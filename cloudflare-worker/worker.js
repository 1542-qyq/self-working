// AI API Proxy for Cloudflare Workers - 支持DeepSeek、豆包、通义千问等
const TARGETS = {
  deepseek: { host: 'api.deepseek.com', basePath: '/v1' },
  doubao: { host: 'ark.cn-beijing.volces.com', basePath: '/api/v3' },
  qwen: { host: 'dashscope.aliyuncs.com', basePath: '/compatible-mode/v1' },
  duannao: { host: 'cephalon.cloud', basePath: '/user-center/v1/model' },
  notion: { host: 'api.notion.com', basePath: '/v1' }
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization,Content-Type,Accept,Origin,Notion-Version",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check
    if (url.pathname === "/" || url.pathname === "/health") {
      return jsonResponse({
        status: "ok",
        service: "MewAI API Proxy",
        supported_targets: Object.keys(TARGETS),
        usage: "例如：POST /deepseek/chat/completions"
      });
    }

    // 解析目标服务
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length === 0) {
      return jsonResponse({ error: "Please specify target, e.g., /deepseek/..." }, 400);
    }

    const targetKey = parts[0];
    const target = TARGETS[targetKey];
    
    if (!target) {
      return jsonResponse({ 
        error: `Unknown target: ${targetKey}`, 
        supported: Object.keys(TARGETS) 
      }, 404);
    }

    // 构建目标路径
    const targetPath = parts.slice(1).join('/');
    let fullPath = target.basePath;
    if (targetPath) {
      fullPath += '/' + targetPath;
    }
    if (url.search) {
      fullPath += url.search;
    }

    const targetUrl = `https://${target.host}${fullPath}`;

    // 转发请求头
    const headers = new Headers();
    const contentType = request.headers.get("Content-Type");
    if (contentType) headers.set("Content-Type", contentType);
    
    const auth = request.headers.get("Authorization");
    if (auth) headers.set("Authorization", auth);
    
    if (targetKey === 'notion') {
      headers.set("Notion-Version", "2022-06-28");
    }

    try {
      const res = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: ["GET", "DELETE"].includes(request.method) ? null : request.body,
      });

      // 复制响应头
      const responseHeaders = new Headers();
      for (const [k, v] of res.headers) {
        const lowerK = k.toLowerCase();
        if (['content-type', 'x-notion-request-id'].includes(lowerK) ||
            lowerK.startsWith('x-') || lowerK.startsWith('openai-')) {
          responseHeaders.set(k, v);
        }
      }
      for (const [k, v] of Object.entries(CORS_HEADERS)) {
        responseHeaders.set(k, v);
      }

      return new Response(res.body, { status: res.status, headers: responseHeaders });
    } catch (err) {
      return jsonResponse({ error: err.message }, 502);
    }
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}