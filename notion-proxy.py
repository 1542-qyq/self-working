#!/usr/bin/env python3
"""
Notion API 代理服务器
解决浏览器直接调用 Notion API 的 CORS 限制问题。

用法：
  python3 notion-proxy.py [端口号]

默认端口 8080，启动后：
  - http://localhost:8080/           工作台首页 (index.html)
  - http://localhost:8080/notion/*   Notion API 代理
  - http://localhost:8080/notion     健康检查

浏览器访问 http://localhost:8080 即可使用工作台。
"""

import sys
import os
import json
import urllib.request
import urllib.error
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

NOTION_API = "https://api.notion.com/v1"
NOTION_VERSION = "2022-06-28"
WORKSPACE_DIR = Path(__file__).parent
INDEX_FILE = WORKSPACE_DIR / "index.html"
DESKTOP_FILE = WORKSPACE_DIR / "cat-news-workbench" / "workbench-desktop.html"

HOST = "0.0.0.0"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class NotionProxyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization,Notion-Version,Content-Type,Accept,Origin")
        self.send_header("Access-Control-Max-Age", "86400")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == "/notion" or self.path == "/notion/":
            self._handle_proxy_health()
        elif self.path.startswith("/notion/"):
            self._proxy_notion()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith("/notion/"):
            self._proxy_notion()
        else:
            self.send_error(405, "Method Not Allowed")

    def do_PATCH(self):
        if self.path.startswith("/notion/"):
            self._proxy_notion()
        else:
            self.send_error(405, "Method Not Allowed")

    def do_DELETE(self):
        if self.path.startswith("/notion/"):
            self._proxy_notion()
        else:
            self.send_error(405, "Method Not Allowed")

    def do_PUT(self):
        if self.path.startswith("/notion/"):
            self._proxy_notion()
        else:
            self.send_error(405, "Method Not Allowed")

    def _handle_proxy_health(self):
        self._send_json(200, {
            "status": "ok",
            "service": "Notion API Proxy",
            "target": NOTION_API,
            "endpoints": {
                "proxy": "/notion/{path}",
                "usage": "将前端请求的 https://api.notion.com/v1/xxx 改为 /notion/xxx"
            }
        })

    def _proxy_notion(self):
        path = self.path[len("/notion"):]
        target_url = NOTION_API + path

        if not self.headers.get("Content-Length") and self.command in ("POST", "PATCH", "PUT"):
            content_length = 0
        else:
            content_length = int(self.headers.get("Content-Length", 0))

        body = self.rfile.read(content_length) if content_length > 0 else None

        notion_headers = {
            "Notion-Version": NOTION_VERSION,
            "Content-Type": self.headers.get("Content-Type", "application/json"),
        }

        incoming_auth = self.headers.get("Authorization", "")
        if incoming_auth:
            notion_headers["Authorization"] = incoming_auth

        incoming_accept = self.headers.get("Accept", "")
        if incoming_accept:
            notion_headers["Accept"] = incoming_accept

        print(f"[PROXY] {self.command} {path} -> {target_url} (auth: {'yes' if incoming_auth else 'no'})", flush=True)

        req = urllib.request.Request(
            target_url,
            data=body,
            headers=notion_headers,
            method=self.command,
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                response_body = resp.read()
                response_status = resp.status
                response_headers = dict(resp.getheaders())
        except urllib.error.HTTPError as e:
            response_body = e.read()
            response_status = e.code
            response_headers = dict(e.headers or {})
        except urllib.error.URLError as e:
            self._send_error_response(502, f"Notion API 连接失败: {e.reason}")
            return
        except Exception as e:
            self._send_error_response(500, f"代理服务器内部错误: {e}")
            return

        self.send_response(response_status)
        for header_name in ("Content-Type", "X-Notion-Request-Id"):
            val = response_headers.get(header_name)
            if val:
                self.send_header(header_name, val)
        self.end_headers()
        self.wfile.write(response_body)

    def _send_json(self, status, data):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def _send_error_response(self, status, message):
        self._send_json(status, {"error": message, "status": status})

    def log_message(self, format, *args):
        sys.stderr.write(f"[{self.command}] {self.path} -> {format % args}\n")


def main():
    server = HTTPServer((HOST, PORT), NotionProxyHandler)
    print(f"""
╔══════════════════════════════════════════════╗
║   🐱 猫报工作台 · Notion API 代理服务器      ║
╚══════════════════════════════════════════════╝

🚀 服务器已启动：
   工作台地址:  http://localhost:{PORT}
   代理端点:    http://localhost:{PORT}/notion/*

📝 使用说明：
   1. 浏览器打开 http://localhost:{PORT}
   2. 在设置中将 Notion API Key 填入
   3. 所有 Notion API 请求会通过此代理转发

💡 提示：
   - 此服务器解决了 Notion API 的 CORS 跨域限制
   - 如需部署到远程服务器（如 Vercel/Cloudflare Workers），
     可参考项目中的部署文档
   - 按 Ctrl+C 停止服务器
""")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止。")
        server.server_close()


if __name__ == "__main__":
    main()
