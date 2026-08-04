// Notion API Proxy for Cloudflare Workers
// 部署: 在 Cloudflare Dashboard 创建 Worker, 粘贴此代码, 绑定自定义路由
// 用法: 将前端请求的 https://api.notion.com/v1/xxx 改为 /notion/xxx

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization,Notion-Version,Content-Type,Accept,Origin",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check
    if (url.pathname === "/" || url.pathname === "") {
      return jsonResponse({
        status: "ok",
        service: "Notion API Proxy (Cloudflare Worker)",
        target: NOTION_API,
        endpoints: {
          proxy: "/notion/{path}",
          usage: "将前端请求的 https://api.notion.com/v1/xxx 改为 /notion/xxx",
        },
      });
    }

    // Notion proxy
    if (url.pathname.startsWith("/notion")) {
      const notionPath = url.pathname.replace(/^\/notion/, "");
      const targetUrl = NOTION_API + notionPath + url.search;

      const notionHeaders = {
        "Notion-Version": NOTION_VERSION,
        "Content-Type": request.headers.get("Content-Type") || "application/json",
      };

      const auth = request.headers.get("Authorization");
      if (auth) notionHeaders["Authorization"] = auth;

      const accept = request.headers.get("Accept");
      if (accept) notionHeaders["Accept"] = accept;

      console.log(`[PROXY] ${request.method} ${notionPath} -> ${targetUrl}`);

      try {
        const response = await fetch(targetUrl, {
          method: request.method,
          headers: notionHeaders,
          body: ["GET", "DELETE"].includes(request.method) ? null : request.body,
        });

        const responseHeaders = new Headers();
        for (const [key, value] of response.headers) {
          if (["content-type", "x-notion-request-id"].includes(key.toLowerCase())) {
            responseHeaders.set(key, value);
          }
        }
        for (const [key, value] of Object.entries(CORS_HEADERS)) {
          responseHeaders.set(key, value);
        }

        return new Response(response.body, {
          status: response.status,
          headers: responseHeaders,
        });
      } catch (err) {
        return jsonResponse(
          { error: `代理服务器错误: ${err.message}` },
          502
        );
      }
    }

    return jsonResponse({ error: "Not Found" }, 404);
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}