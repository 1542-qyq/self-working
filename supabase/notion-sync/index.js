// ============================================================
// Notion Sync Edge Function
// Supabase Edge Function 代理 Notion API 调用
// 
// 部署步骤：
//   1. 进入 Supabase → Edge Functions → Create new function
//   2. 命名为 "notion-sync"
//   3. 将本文件内容粘贴到 index.js
//   4. 在 Secrets 中添加 NOTION_API_KEY（可选，也可由前端传入）
//   5. 部署
// 
// 支持的操作：
//   - pull: 从 Notion 数据库拉取数据并映射到工作台格式
//   - push: 将工作台数据推送到 Notion
//   - test: 测试 Notion API 连接
// ============================================================

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// 属性类型到工作台字段的默认映射
const DEFAULT_MAPPINGS = {
  title: 'title',
  rich_text: 'content',
  select: 'tags',
  multi_select: 'tags',
  date: 'date',
  checkbox: 'done',
  number: 'number',
  url: 'url',
  created_time: 'createdAt',
  last_edited_time: 'updatedAt',
};

// 将 Notion page 的属性转换为扁平结构
function extractProperties(page) {
  const props = {};
  if (!page.properties) return props;

  for (const [key, prop] of Object.entries(page.properties)) {
    switch (prop.type) {
      case 'title':
        props[key] = prop.title?.[0]?.plain_text || '';
        break;
      case 'rich_text':
        props[key] = prop.rich_text?.map(t => t.plain_text).join('') || '';
        break;
      case 'select':
        props[key] = prop.select?.name || '';
        break;
      case 'multi_select':
        props[key] = prop.multi_select?.map(s => s.name) || [];
        break;
      case 'date':
        props[key] = prop.date?.start || '';
        break;
      case 'checkbox':
        props[key] = prop.checkbox || false;
        break;
      case 'number':
        props[key] = prop.number || 0;
        break;
      case 'url':
        props[key] = prop.url || '';
        break;
      case 'created_time':
        props[key] = prop.created_time || '';
        break;
      case 'last_edited_time':
        props[key] = prop.last_edited_time || '';
        break;
      case 'status':
        props[key] = prop.status?.name || '';
        break;
      case 'people':
        props[key] = prop.people?.map(p => p.name || p.id) || [];
        break;
      case 'files':
        props[key] = prop.files?.map(f => f.name) || [];
        break;
      default:
        props[key] = prop[prop.type] || '';
    }
  }
  return props;
}

// 将 Notion 数据映射为工作台模块格式
function mapToWorkbench(page, moduleKey, mappings) {
  const props = extractProperties(page);
  const mapping = mappings?.[moduleKey] || {};
  const result = { id: page.id, _notionId: page.id };

  // 标题映射
  if (mapping.titleField && props[mapping.titleField]) {
    result.title = props[mapping.titleField];
  } else {
    // 自动查找 title 类型的属性
    const titleKey = Object.entries(page.properties || {})
      .find(([_, p]) => p.type === 'title')?.[0];
    result.title = titleKey ? props[titleKey] : page.id;
  }

  // 内容/备注
  if (mapping.contentField && props[mapping.contentField]) {
    result.note = props[mapping.contentField];
  }

  // 状态/完成
  if (mapping.statusField && props[mapping.statusField]) {
    const statusVal = props[mapping.statusField];
    if (typeof statusVal === 'boolean') {
      result.done = statusVal;
    } else if (typeof statusVal === 'string') {
      result.done = ['done', 'complete', 'completed', '已完成', '完成', 'yes', 'true']
        .includes(statusVal.toLowerCase());
    }
  }

  // 优先级
  if (mapping.priorityField && props[mapping.priorityField]) {
    result.priority = String(props[mapping.priorityField]).toUpperCase();
  }

  // 日期
  if (mapping.dateField && props[mapping.dateField]) {
    result.date = props[mapping.dateField];
  } else {
    result.date = new Date().toISOString().slice(0, 10);
  }

  // 数字类型（金额/进度）
  if (mapping.amountField && props[mapping.amountField]) {
    result.amount = props[mapping.amountField];
  }
  if (mapping.currentField && props[mapping.currentField]) {
    result.current = props[mapping.currentField];
  }
  if (mapping.targetField && props[mapping.targetField]) {
    result.target = props[mapping.targetField];
  }

  // 标签/分类
  if (mapping.tagField && props[mapping.tagField]) {
    const tags = props[mapping.tagField];
    result.tags = Array.isArray(tags) ? tags : [tags];
  }

  // 心情
  if (mapping.moodField && props[mapping.moodField]) {
    result.mood = props[mapping.moodField];
  }

  // 打卡日志
  if (mapping.logField && props[mapping.logField]) {
    result.log = {};
    if (Array.isArray(props[mapping.logField])) {
      props[mapping.logField].forEach(date => {
        result.log[date] = true;
      });
    }
  }

  return result;
}

// 将工作台数据反向映射回 Notion 属性
function mapToNotion(item, moduleKey, mappings, schema) {
  const mapping = mappings?.[moduleKey] || {};
  const properties = {};

  // 标题
  const titleField = mapping.titleField || mapping._autoTitleField;
  if (titleField) {
    properties[titleField] = {
      title: [{ type: 'text', text: { content: item.title || '未命名' } }]
    };
  }

  // 内容
  if (mapping.contentField && item.note) {
    properties[mapping.contentField] = {
      rich_text: [{ type: 'text', text: { content: item.note } }]
    };
  }

  // 状态
  if (mapping.statusField) {
    const propSchema = schema?.[mapping.statusField];
    if (propSchema?.type === 'checkbox') {
      properties[mapping.statusField] = { checkbox: item.done || false };
    } else if (propSchema?.type === 'select') {
      const options = propSchema.select?.options || [];
      const doneOpt = options.find(o =>
        ['done', 'complete', 'completed', '已完成', '完成', 'yes', 'true']
          .includes(o.name.toLowerCase())
      );
      properties[mapping.statusField] = {
        select: doneOpt || options.find(o => o.name === 'Not done') || options[0] || { name: 'Not done' }
      };
    }
  }

  // 优先级
  if (mapping.priorityField && item.priority) {
    properties[mapping.priorityField] = {
      select: { name: item.priority }
    };
  }

  // 日期
  if (mapping.dateField) {
    properties[mapping.dateField] = {
      date: item.date ? { start: item.date } : null
    };
  }

  // 数字
  if (mapping.amountField && item.amount) {
    properties[mapping.amountField] = { number: item.amount };
  }

  // 标签
  if (mapping.tagField && item.tags && item.tags.length) {
    properties[mapping.tagField] = {
      multi_select: item.tags.map(t => ({ name: t }))
    };
  }

  return properties;
}

// 获取数据库 schema（属性定义）
async function getDatabaseSchema(apiKey, databaseId) {
  const res = await fetch(`${NOTION_API}/databases/${databaseId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': NOTION_VERSION,
    },
  });
  if (!res.ok) throw new Error(`获取数据库结构失败: ${res.status}`);
  const data = await res.json();
  return data.properties || {};
}

// 查询数据库页面
async function queryDatabase(apiKey, databaseId, filter = {}, cursor = null) {
  const body = { page_size: 100 };
  if (filter) body.filter = filter;
  if (cursor) body.start_cursor = cursor;

  const res = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`查询数据库失败: ${res.status} ${await res.text()}`);
  return res.json();
}

// 创建或更新页面
async function upsertPage(apiKey, pageId, properties, parentType, parentId) {
  const url = pageId
    ? `${NOTION_API}/pages/${pageId}`
    : `${NOTION_API}/pages`;
  const method = pageId ? 'PATCH' : 'POST';

  const body = { properties };
  if (!pageId && parentType && parentId) {
    body.parent = { type: parentType, [parentType]: parentId };
  }

  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${pageId ? '更新' : '创建'}页面失败: ${res.status} ${await res.text()}`);
  return res.json();
}

// 创建页面（push 新条目）
async function createPage(apiKey, parentType, parentId, properties) {
  return upsertPage(apiKey, null, properties, parentType, parentId);
}

// 更新现有页面
async function updatePage(apiKey, pageId, properties) {
  return upsertPage(apiKey, pageId, properties);
}

// 测试连接
async function testConnection(apiKey) {
  const res = await fetch(`${NOTION_API}/users/me`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': NOTION_VERSION,
    },
  });
  if (!res.ok) throw new Error(`连接失败: ${res.status}`);
  return res.json();
}

// 主处理函数
export default async function handler(req) {
  // CORS
  const origin = req.headers.get('origin') || '*';
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Max-Age': '86400',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { action, apiKey, databaseId, moduleKey, mappings, filter, items, direction } = await req.json();

    // 获取 API Key（支持环境变量兜底）
    const effectiveKey = apiKey || Deno.env.get('NOTION_API_KEY');
    if (!effectiveKey) {
      throw new Error('缺少 Notion API Key');
    }

    switch (action) {
      case 'test': {
        const user = await testConnection(effectiveKey);
        return new Response(JSON.stringify({
          ok: true,
          user: user.name || user.bot_name || 'Unknown',
          type: user.type,
        }), { headers });
      }

      case 'schema': {
        if (!databaseId) throw new Error('缺少 databaseId');
        const schema = await getDatabaseSchema(effectiveKey, databaseId);
        return new Response(JSON.stringify({ ok: true, schema }), { headers });
      }

      case 'pull': {
        if (!databaseId) throw new Error('缺少 databaseId');
        const results = [];
        let cursor = null;
        do {
          const response = await queryDatabase(effectiveKey, databaseId, filter, cursor);
          results.push(...response.results);
          cursor = response.has_more ? response.next_cursor : null;
        } while (cursor);

        const mappedItems = results.map(page =>
          mapToWorkbench(page, moduleKey, mappings)
        );

        return new Response(JSON.stringify({
          ok: true,
          count: mappedItems.length,
          items: mappedItems,
        }), { headers });
      }

      case 'push': {
        if (!databaseId) throw new Error('缺少 databaseId');
        if (!items || !Array.isArray(items)) throw new Error('缺少 items');
        if (!moduleKey) throw new Error('缺少 moduleKey');

        const schema = await getDatabaseSchema(effectiveKey, databaseId);
        const results = [];

        for (const item of items) {
          let properties;
          if (direction === 'push-reverse') {
            // 将工作台字段反向映射为 Notion 属性
            properties = mapToNotion(item, moduleKey, mappings, schema);
          } else {
            // 直接用映射生成 Notion 属性
            properties = mapToNotion(item, moduleKey, mappings, schema);
          }

          try {
            if (item._notionId) {
              // 更新现有页面
              const result = await updatePage(effectiveKey, item._notionId, properties);
              results.push({ id: item._notionId, action: 'updated', ok: true, data: result });
            } else {
              // 创建新页面
              const parentKey = mappings?.parentField;
              const parent = parentKey && item[parentKey]
                ? { type: 'page_id', id: item[parentKey] }
                : { type: 'database_id', id: databaseId };
              const result = await createPage(
                effectiveKey,
                parent.type,
                parent.id,
                properties
              );
              results.push({ id: result.id, action: 'created', ok: true, data: result });
            }
          } catch (e) {
            results.push({ id: item._notionId || 'new', ok: false, error: e.message });
          }
        }

        return new Response(JSON.stringify({
          ok: true,
          count: results.length,
          results,
        }), { headers });
      }

      default:
        throw new Error(`未知操作: ${action}`);
    }
  } catch (error) {
    return new Response(JSON.stringify({
      ok: false,
      error: error.message,
    }), { status: 400, headers });
  }
}
