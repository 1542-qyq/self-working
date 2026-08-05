// Notion API Proxy for Cloudflare Workers
const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization,Notion-Version,Content-Type,Accept,Origin",
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
        service: "Notion API Proxy",
        target: NOTION_API,
      });
    }

    // Notion proxy
    if (url.pathname.startsWith("/notion")) {
      const notionPath = url.pathname.replace(/^\/notion/, "") || "/";
      const targetUrl = NOTION_API + notionPath + url.search;

      const headers = {
        "Notion-Version": NOTION_VERSION,
        "Content-Type": request.headers.get("Content-Type") || "application/json",
      };
      const auth = request.headers.get("Authorization");
      if (auth) headers["Authorization"] = auth;

      try {
        const res = await fetch(targetUrl, {
          method: request.method,
          headers,
          body: ["GET", "DELETE"].includes(request.method) ? null : request.body,
        });
        const responseHeaders = new Headers();
        for (const [k, v] of res.headers) {
          if (["content-type", "x-notion-request-id"].includes(k.toLowerCase())) {
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
    }

    return jsonResponse({ error: "Not Found" }, 404);
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}