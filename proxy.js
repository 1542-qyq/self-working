// 本地CORS代理，解决浏览器跨域问题
// 使用方法：node proxy.js  然后代理跑在 http://localhost:8787
const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 8787;

// 支持的API目标地址
const TARGETS = {
  deepseek: 'api.deepseek.com',
  doubao: 'ark.cn-beijing.volces.com',
  qwen: 'dashscope.aliyuncs.com',
  ollama: 'localhost:11434'
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 路由格式：/deepseek/v1/chat/completions
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split('/').filter(Boolean);
  
  if (parts.length === 0) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'AI Proxy is running',
      supported_targets: Object.keys(TARGETS),
      usage: '例如：POST /deepseek/v1/chat/completions'
    }));
    return;
  }

  const targetKey = parts[0];
  const targetHost = TARGETS[targetKey];
  
  if (!targetHost) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Unknown target: ${targetKey}`, supported: Object.keys(TARGETS) }));
    return;
  }

  // 构建目标路径
  const targetPath = '/' + parts.slice(1).join('/') + url.search;
  
  // 转发请求
  const isLocal = targetKey === 'ollama';
  const protocol = isLocal ? http : https;
  const [hostname, port] = targetHost.split(':');

  const options = {
    hostname: hostname,
    port: port || (isLocal ? 11434 : 443),
    path: targetPath,
    method: req.method,
    headers: { ...req.headers, host: targetHost }
  };

  const proxyReq = protocol.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           🚀 AI Proxy Server 已启动                        ║
╠════════════════════════════════════════════════════════════╣
║  本地代理地址: http://localhost:${PORT}                      ║
║                                                            ║
║  支持的模型提供商:                                          ║
║   • DeepSeek:  http://localhost:${PORT}/deepseek           ║
║   • 豆包/方舟:  http://localhost:${PORT}/doubao             ║
║   • 通义千问:   http://localhost:${PORT}/qwen               ║
║   • Ollama本地: http://localhost:${PORT}/ollama            ║
║                                                            ║
║  保持这个窗口开着，工作台就能调用真实AI啦！                  ║
╚════════════════════════════════════════════════════════════╝
  `);
});
