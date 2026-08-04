// Notion Sync Edge Function for Supabase
// Deploy as: index.ts or index.js

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

type PropertyValue = { type: string; [key: string]: any };

function extractProperties(page: any): Record<string, any> {
  const props: Record<string, any> = {};
  if (!page.properties) return props;

  for (const [key, prop] of Object.entries(page.properties)) {
    const p = prop as PropertyValue;
    switch (p.type) {
      case 'title':
        props[key] = p.title?.[0]?.plain_text || '';
        break;
      case 'rich_text':
        props[key] = p.rich_text?.map((t: any) => t.plain_text).join('') || '';
        break;
      case 'select':
        props[key] = p.select?.name || '';
        break;
      case 'multi_select':
        props[key] = p.multi_select?.map((s: any) => s.name) || [];
        break;
      case 'date':
        props[key] = p.date?.start || '';
        break;
      case 'checkbox':
        props[key] = p.checkbox || false;
        break;
      case 'number':
        props[key] = p.number || 0;
        break;
      case 'url':
        props[key] = p.url || '';
        break;
      case 'created_time':
        props[key] = p.created_time || '';
        break;
      case 'last_edited_time':
        props[key] = p.last_edited_time || '';
        break;
      case 'status':
        props[key] = p.status?.name || '';
        break;
      case 'people':
        props[key] = p.people?.map((p: any) => p.name || p.id) || [];
        break;
      default:
        props[key] = p[p.type] || '';
    }
  }
  return props;
}

function mapToWorkbench(page: any, moduleKey: string, mappings: any): any {
  const props = extractProperties(page);
  const mapping = mappings?.[moduleKey] || {};
  const result: any = { id: page.id, _notionId: page.id };

  // 标题
  if (mapping.titleField && props[mapping.titleField]) {
    result.title = props[mapping.titleField];
  } else {
    const titleKey = Object.entries(page.properties || {})
      .find(([_, p]: [string, any]) => p.type === 'title')?.[0];
    result.title = titleKey ? props[titleKey] : page.id;
  }

  // 内容/备注
  if (mapping.contentField && props[mapping.contentField]) {
    if (moduleKey === 'note' || moduleKey === 'hot') {
      result.content = props[mapping.contentField];
    } else {
      result.note = props[mapping.contentField];
    }
  }

  // 状态
  if (mapping.statusField && props[mapping.statusField] !== undefined) {
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

  // 类型
  if (mapping.typeField && props[mapping.typeField]) {
    result.type = props[mapping.typeField];
  }

  // 分类
  if (mapping.categoryField && props[mapping.categoryField]) {
    result.category = props[mapping.categoryField];
  }

  // 单位
  if (mapping.unitField && props[mapping.unitField]) {
    result.unit = props[mapping.unitField];
  }

  // 心情
  if (mapping.moodField && props[mapping.moodField]) {
    result.mood = props[mapping.moodField];
  }

  // 日期
  if (mapping.dateField && props[mapping.dateField]) {
    result.date = props[mapping.dateField];
  } else {
    result.date = new Date().toISOString().slice(0, 10);
  }

  // 数字
  if (mapping.amountField && props[mapping.amountField] !== undefined) {
    result.amount = props[mapping.amountField];
  }
  if (mapping.currentField && props[mapping.currentField] !== undefined) {
    result.current = props[mapping.currentField];
  }
  if (mapping.targetField && props[mapping.targetField] !== undefined) {
    result.target = props[mapping.targetField];
  }

  // 标签
  if (mapping.tagField && props[mapping.tagField]) {
    const tags = props[mapping.tagField];
    result.tags = Array.isArray(tags) ? tags : [tags];
  }

  return result;
}

function mapToNotion(item: any, moduleKey: string, mappings: any, schema: any): any {
  const mapping = mappings?.[moduleKey] || {};
  const properties: any = {};

  // 标题
  const titleField = mapping.titleField;
  if (titleField) {
    properties[titleField] = {
      title: [{ type: 'text', text: { content: item.title || '未命名' } }]
    };
  }

  // 内容
  if (mapping.contentField) {
    const content = item.note || item.content;
    if (content) {
      properties[mapping.contentField] = {
        rich_text: [{ type: 'text', text: { content: content } }]
      };
    }
  }

  // 状态
  if (mapping.statusField) {
    const propSchema = schema?.[mapping.statusField];
    if (propSchema?.type === 'checkbox') {
      properties[mapping.statusField] = { checkbox: item.done || false };
    } else if (propSchema?.type === 'status') {
      const statusVal = item.done ? 'Done' : 'Not started';
      properties[mapping.statusField] = { status: { name: statusVal } };
    } else if (propSchema?.type === 'select') {
      const statusVal = item.done ? 'Done' : 'Not done';
      properties[mapping.statusField] = { select: { name: statusVal } };
    }
  }

  // 类型
  if (mapping.typeField && item.type) {
    properties[mapping.typeField] = { select: { name: item.type } };
  }

  // 分类
  if (mapping.categoryField && item.category) {
    properties[mapping.categoryField] = { select: { name: item.category } };
  }

  // 优先级
  if (mapping.priorityField && item.priority) {
    properties[mapping.priorityField] = { select: { name: item.priority } };
  }

  // 日期
  if (mapping.dateField) {
    properties[mapping.dateField] = {
      date: item.date ? { start: item.date } : null
    };
  }

  // 数字
  if (mapping.amountField && item.amount !== undefined && item.amount !== null) {
    properties[mapping.amountField] = { number: item.amount };
  }
  if (mapping.currentField && item.current !== undefined) {
    properties[mapping.currentField] = { number: item.current };
  }
  if (mapping.targetField && item.target !== undefined) {
    properties[mapping.targetField] = { number: item.target };
  }

  // 心情
  if (mapping.moodField && item.mood) {
    properties[mapping.moodField] = { select: { name: item.mood } };
  }

  // 标签
  if (mapping.tagField && item.tags && item.tags.length) {
    properties[mapping.tagField] = {
      multi_select: item.tags.map((t: string) => ({ name: t }))
    };
  }

  // 单位
  if (mapping.unitField && item.unit) {
    properties[mapping.unitField] = {
      rich_text: [{ type: 'text', text: { content: item.unit } }]
    };
  }

  return properties;
}

async function getDatabaseSchema(apiKey: string, databaseId: string): Promise<any> {
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

async function queryDatabase(apiKey: string, databaseId: string, filter: any, cursor: string | null): Promise<any> {
  const body: any = { page_size: 100 };
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

async function upsertPage(apiKey: string, pageId: string | null, properties: any, parentType: string, parentId: string): Promise<any> {
  const url = pageId
    ? `${NOTION_API}/pages/${pageId}`
    : `${NOTION_API}/pages`;
  const method = pageId ? 'PATCH' : 'POST';

  const body: any = { properties };
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

async function testConnection(apiKey: string): Promise<any> {
  const res = await fetch(`${NOTION_API}/users/me`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Notion-Version': NOTION_VERSION,
    },
  });
  if (!res.ok) throw new Error(`连接失败: ${res.status}`);
  return res.json();
}

export default async function handler(req: Request) {
  const origin = req.headers.get('origin') || '*';
  const headers: any = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const body = await req.json();
    const { action, apiKey, databaseId, moduleKey, mappings, filter, items } = body;

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
        const results: any[] = [];
        let cursor: string | null = null;
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
        const results: any[] = [];

        for (const item of items) {
          const properties = mapToNotion(item, moduleKey, mappings, schema);

          try {
            if (item._notionId) {
              const result = await upsertPage(effectiveKey, item._notionId, properties, '', '');
              results.push({ id: item._notionId, action: 'updated', ok: true, data: result });
            } else {
              const result = await upsertPage(effectiveKey, null, properties, 'database_id', databaseId);
              results.push({ id: result.id, action: 'created', ok: true, data: result });
            }
          } catch (e: any) {
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
  } catch (error: any) {
    return new Response(JSON.stringify({
      ok: false,
      error: error.message,
    }), { status: 400, headers });
  }
}
