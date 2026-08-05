// Notion API Proxy for Cloudflare Workers
// 部署: Cloudflare Dashboard -> Workers & Pages -> Create Worker -> 粘贴此代码 -> Save
// 用法: 将前端请求的 https://api.notion.com/v1/xxx 改为 /notion/xxx

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization,Notion-Version,Content-Type,Accept,Origin",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Expose-Headers": "X-Notion-Request-ID",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight - 必须在所有路由之前
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 健康检查 / 调试端点
    if (url.pathname === "/" || url.pathname === "/health" || url.pathname === "") {
      const clientIP = request.headers.get("cf-connecting-ip") || "unknown";
      return jsonResponse({
        status: "ok",
        service: "Notion API Proxy",
        version: "2.0",
        target: NOTION_API,
        clientIP: clientIP,
        endpoints: {
          proxy: "/notion/{path}",
          health: "/health",
        },
        cors: Object.fromEntries(Object.entries(CORS_HEADERS).map(([k, v]) => [k, v.substring(0, 30) + "..."])),
      });
    }

    // Notion proxy - 处理所有 /notion 开头的路径
    if (url.pathname.startsWith("/notion")) {
      return handleNotionProxy(request, url);
    }

    return jsonResponse({ error: "Not Found", available: ["/", "/health", "/notion/..."] }, 404);
  },
};

async function handleNotionProxy(request, url) {
  const notionPath = url.pathname.replace(/^\/notion/, "") || "/";
  const targetUrl = NOTION_API + notionPath + url.search;

  const notionHeaders = {
    "Notion-Version": NOTION_VERSION,
    "Content-Type": request.headers.get("Content-Type") || "application/json",
  };

  const auth = request.headers.get("Authorization");
  if (auth) notionHeaders["Authorization"] = auth;

  const accept = request.headers.get("Accept");
  if (accept) notionHeaders["Accept"] = accept;

  // 构建转发请求
  const fetchOptions = {
    method: request.method,
    headers: notionHeaders,
  };

  // 对于非 GET/DELETE 请求，转发 body
  if (!["GET", "DELETE", "HEAD"].includes(request.method)) {
    fetchOptions.body = request.body;
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);

    // 构建响应头 - 保留 Notion 关键头 + 添加 CORS
    const responseHeaders = new Headers();
    
    // 保留 Notion 响应头
    const passthroughHeaders = ["content-type", "x-notion-request-id", "notion-version"];
    for (const [key, value] of response.headers) {
      if (passthroughHeaders.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    }
    
    // 添加 CORS 头
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("[PROXY ERROR]", err);
    return jsonResponse(
      { error: "代理服务器错误", details: err.message, path: notionPath },
      502
    );
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}