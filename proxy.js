// 本地CORS代理，解决浏览器跨域问题
// 使用方法：node proxy.js  然后代理跑在 http://localhost:8787
const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 8787;

// 支持的API目标地址（与Cloudflare Worker保持一致）
const TARGETS = {
  deepseek: { host: 'api.deepseek.com', basePath: '/v1' },
  doubao: { host: 'ark.cn-beijing.volces.com', basePath: '/api/v3' },
  qwen: { host: 'dashscope.aliyuncs.com', basePath: '/compatible-mode/v1' },
  ollama: { host: 'localhost', port: 11434, basePath: '' },
  duannao: { host: 'cephalon.cloud', basePath: '/user-center/v1/model' },
  notion: { host: 'api.notion.com', basePath: '/v1' }
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

  // 路由格式：/deepseek/chat/completions
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split('/').filter(Boolean);
  
  if (parts.length === 0) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'MewAI Proxy is running',
      supported_targets: Object.keys(TARGETS),
      usage: '例如：POST /deepseek/chat/completions'
    }));
    return;
  }

  const targetKey = parts[0];
  const target = TARGETS[targetKey];
  
  if (!target) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Unknown target: ${targetKey}`, supported: Object.keys(TARGETS) }));
    return;
  }

  // 构建目标路径
  const targetPath = parts.slice(1).join('/');
  let fullPath = target.basePath || '';
  if (targetPath) {
    fullPath += '/' + targetPath;
  }
  if (url.search) {
    fullPath += url.search;
  }
  
  // 转发请求
  const isLocal = targetKey === 'ollama';
  const protocol = isLocal ? http : https;
  const hostname = target.host;
  const port = target.port || (isLocal ? 11434 : 443);

  const options = {
    hostname: hostname,
    port: port,
    path: fullPath,
    method: req.method,
    headers: { ...req.headers, host: `${hostname}${port ? ':' + port : ''}` }
  };

  // 删除可能导致问题的头
  delete options.headers['accept-encoding'];

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
║           🚀 MewAI Proxy Server 已启动                    ║
╠════════════════════════════════════════════════════════════╣
║  本地代理地址: http://localhost:${PORT}                      ║
║                                                            ║
║  支持的模型提供商:                                          ║
║   • DeepSeek V4: http://localhost:${PORT}/deepseek         ║
║   • 豆包/方舟:    http://localhost:${PORT}/doubao           ║
║   • 通义千问:     http://localhost:${PORT}/qwen             ║
║   • 端脑云:       http://localhost:${PORT}/duannao          ║
║   • Ollama本地:  http://localhost:${PORT}/ollama           ║
║   • Notion:      http://localhost:${PORT}/notion           ║
║                                                            ║
║  保持这个窗口开着，工作台就能调用真实AI啦！                  ║
╚════════════════════════════════════════════════════════════╝
  `);
});