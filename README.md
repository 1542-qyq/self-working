# MewHub · 个人工作台

一个自包含的个人桌面工作台：待办、习惯打卡、阅读、运动、记账、笔记、雅思备考、简历投递追踪一站式管理。纯 HTML/CSS/JavaScript，零构建依赖，数据存本地浏览器。

## ✨ 功能模块

| 分组 | 模块 | 说明 |
|------|------|------|
| 🐾 猫生日常 | 头版选题 (todo) | 待办任务、优先级、完成追踪 |
| | 日常打卡 (checkin) | 习惯打卡 + 单词打卡、连续天数 |
| | 阅读专栏 (read) | 书籍进度追踪 |
| | 运动版面 (sport) | 运动目标、统计 |
| | 财经版 (money) | 收支记账、分类统计 |
| | 副刊笔记 (note) | 灵感记录、心情标签 |
| | 热点追踪 (hot) | 稍后阅读、收藏管理 |
| 📚 IELTS 备考 | 阅读/听力/写作/口语题库 | 多状态流转、正确率追踪 |
| | 备考记录 | 错题与薄弱点记录 |
| 💼 求职投递 | 投递追踪 (job) | 33 岗位看板：状态、优先级、评分、简历/JD 链接 |
| 🤖 AI 能力 | AI Agent 指挥中心 | 6 个专业角色 Agent、任务调度 |
| | 智能助手 (MewAI) | 悬浮对话、多模型接入（DeepSeek/豆包/Ollama） |
| 📊 其他 | 洞察复盘 | 趋势图、热力图、周/月对比 |

## 🚀 快速开始

### 方式一：本地打开（零依赖）

直接双击 `workbench-desktop.html` 用浏览器打开即可，无需安装任何东西。

### 方式二：GitHub Pages 部署

1. 推送代码到 `main` 分支，[.github/workflows/deploy.yml](.github/workflows/deploy.yml) 会自动构建部署
2. 在仓库 Settings → Pages 中 Source 选择 **GitHub Actions**
3. 部署完成后访问 `https://<用户名>.github.io/self-working/`

> `index.html` 是手机版（底栏 Tab + 抽屉导航），`workbench-desktop.html` 是桌面版（左侧边栏），两者共用同一份 `assets/common.js` 配置与 localStorage 数据。

## 🔧 云同步（可选）

工作台支持两条同步通道，均为**可选**：

- **Notion 双向同步**：侧边栏「设置」填入 Notion API Key + 数据库 ID 映射后，可把各模块数据推送到 Notion / 从 Notion 拉取
  - 本地开发：`python3 notion-proxy.py` 启动代理（默认 8080 端口，解决浏览器直连 Notion 的 CORS 问题）
  - 远程部署：`cloudflare-worker/` 提供 Cloudflare Worker 代理，部署后填入完整 URL
- **Supabase 云同步**：`supabase/notion-sync/` 提供同步脚本，配合 `schema.sql` 建表实现跨设备同步

## 📁 文件结构

```
self-working/
├── index.html                    # 手机版主页面
├── workbench-desktop.html        # 桌面版主页面
├── assets/
│   ├── common.js                 # 共用配置 CONFIG / 图标库 ICONS / 工具函数（两个版本共用）
│   └── ...                       # 图片资源
├── manifest.json                 # PWA 配置
├── service-worker.js             # 离线缓存
├── schema.sql                    # Supabase 建表脚本
├── notion-proxy.py               # 本地 Notion API 代理
├── proxy.js                      # 本地代理
├── cloudflare-worker/            # Cloudflare Worker 代理（远程 Notion 同步）
├── supabase/notion-sync/         # Supabase 同步脚本
├── docs/superpowers/specs/       # 设计文档
└── .github/workflows/deploy.yml  # GitHub Pages 自动部署
```

## 🧩 如何新增模块

所有模块定义集中在 `assets/common.js` 的 `CONFIG.modules` 中：

```js
{ key: "job", name: "求职投递", icon: "briefcase", tint: "#e4ecf2", color: "#2f5d8a",
  type: "job", desc: "简历投递进度追踪", seed: [...] }
```

- `type` 决定渲染逻辑（todo / checkin / progress / finance / note / ielts / job）
- 新增自定义字段用 `fields` 数组声明，表单与卡片自动渲染，无需改 JS
- 新模块若需专属 UI，需同步修改 `index.html` 与 `workbench-desktop.html`（两个版本保持一致）

## ⚠️ 数据存储说明

- 数据默认只存在**你自己这台设备的这个浏览器里**（localStorage）。换台电脑、换个浏览器、或清了浏览记录，之前填的就没了
- 手机版和电脑版的数据不会互相同步，各记各的
- 需要跨设备同步时，请配置上面的 Notion / Supabase 同步

## 🔒 隐私提醒

- 仓库为公开部署（GitHub Pages 免费版不支持私有），**请勿将包含个人信息的简历、证件等文件提交到仓库**。代码中的示例数据均为脱敏内容，个人真实数据请存放在浏览器本地或自己的 Notion 数据库中。

## 🛠 技术栈

- 纯 HTML/CSS/JavaScript，零构建依赖，PWA 支持（Service Worker 离线缓存）
- localStorage 本地存储
- Notion API（可选，经本地 Python 代理 / Cloudflare Worker）
- Supabase（可选，云同步）
- GitHub Pages 自动部署
