# 喵喵编辑部 · 猫咪生活报

你的个人桌面工作台 — 待办、打卡、阅读、运动、记账、笔记一站式管理。

## 🚀 快速开始（推荐：PWA + GitHub Pages）

### 第一步：开启 GitHub Pages

1. 打开仓库 [self-working](https://github.com/1542-qyq/self-working)
2. 进入 **Settings → Pages**
3. Source 选择 **GitHub Actions**
4. 推送代码后会自动部署

### 第二步：部署完成后访问

在任意设备浏览器打开：

```
https://1542-qyq.github.io/self-working/
```

### 第三步：安装为桌面/手机 App

**电脑（Chrome/Edge）：**
- 地址栏点击「安装」图标
- 或菜单 → 更多工具 → 创建快捷方式 → 勾选「在独立窗口中打开」

**手机（iOS/Android）：**
- iOS Safari：分享 → 添加到主屏幕
- Android Chrome：菜单 → 安装应用
- iPad Safari：同上

### 第四步：配置云同步

1. 访问 [supabase.com](https://supabase.com) 创建免费项目
2. SQL Editor 执行 `schema.sql` 建表
3. 获取 Project URL 和 Anon Key
4. 打开工作台 → 侧边栏「设置」→ 填入凭据
5. 勾选「自动同步」，所有设备配置相同凭据即可实时同步

---

## 📦 离线使用

### 方式一：直接打开

直接双击 `workbench-desktop.html` 用浏览器打开即可。

### 方式二：桌面快捷方式（Windows）

1. 双击 **`创建桌面快捷方式.bat`**
2. 桌面生成「猫咪生活报」图标
3. 双击在独立窗口中启动

### 方式三：Electron 原生应用

```bash
cd electron
npm install
npm start
```

---

## 📱 功能模块

| 模块 | 功能 |
|------|------|
| 头版选题 | 今日待办、优先级、完成追踪 |
| 日常打卡 | 习惯养成、连续计数 |
| 阅读专栏 | 书籍进度、笔记摘录 |
| 运动版面 | 运动目标、统计 |
| 财经版 | 收支记账、分类统计 |
| 副刊笔记 | 灵感记录、心情标签 |
| 热点追踪 | 稍后阅读、收藏管理 |

## 🔧 技术栈

- 纯 HTML/CSS/JavaScript，零构建依赖
- PWA 支持（Service Worker 离线缓存）
- Supabase 云同步（可选）
- GitHub Pages 自动部署
- Electron 桌面应用（可选）

## 📁 文件结构

```
self-working/
├── .github/workflows/deploy.yml  # GitHub Pages 自动部署
├── cat-news-workbench/
│   ├── workbench-desktop.html    # 主页面
│   ├── manifest.json             # PWA 配置
│   ├── service-worker.js         # 离线缓存
│   ├── schema.sql                # Supabase 建表脚本
│   ├── README.md                 # 详细文档
│   ├── assets/                   # 图片资源
│   ├── electron/                 # Electron 桌面应用
│   ├── 启动桌面工作台.bat        # Windows 启动
│   └── 创建桌面快捷方式.bat      # 快捷方式生成
└── init
```