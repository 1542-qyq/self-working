# 喵喵编辑部 · 猫咪生活报

你的个人桌面工作台 — 待办、打卡、阅读、运动、记账、笔记一站式管理。

## 快速开始

### 方式一：直接打开（最简单）

1. 双击 `workbench-desktop.html` 用浏览器打开即可使用
2. 数据保存在浏览器本地存储中

### 方式二：PWA 安装（推荐）

1. 用 Chrome / Edge 打开 `workbench-desktop.html`
2. 地址栏点击 **安装** 图标，或菜单选择 **创建快捷方式**
3. 勾选 **在独立窗口中打开**
4. 即可像桌面 App 一样使用，支持离线访问

### 方式三：桌面快捷方式（Windows）

1. 双击 **`创建桌面快捷方式.bat`**
2. 桌面会生成「猫咪生活报」图标
3. 双击即可在独立窗口中启动

### 方式四：Electron 原生桌面应用

```bash
cd electron
npm install
npm start
```

打包为 Windows 安装包：

```bash
npm run build
```

---

## 手机电脑数据同步

### 方案 A：JSON 导入导出（无需后端）

1. **电脑端**：侧边栏点击 **导出** → 下载 JSON 备份文件
2. **传输**：通过微信/QQ 等将 JSON 文件发送到手机
3. **手机端**：打开网页后点击 **导入** → 选择 JSON 文件
4. 数据即可同步

### 方案 B：Supabase 云端同步（实时同步）

#### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com) 注册免费账号
2. 点击 **New Project**，填写项目名称和密码
3. 等待约 1 分钟项目创建完成

#### 2. 初始化数据库

1. 进入项目 → SQL Editor → New Query
2. 粘贴 `schema.sql` 中的内容并执行

#### 3. 获取连接凭据

1. 进入 **Project Settings → API**
2. 复制 **Project URL** 和 **anon public key**

#### 4. 在工作台中配置

1. 打开工作台页面
2. 侧边栏点击 **设置** 按钮
3. 填入 URL、Key、昵称
4. 勾选 **自动同步** 可实现每次保存自动推送到云端
5. 在另一台设备上配置相同的凭据即可同步

---

## 功能模块

| 模块 | 功能 |
|------|------|
| 头版选题 | 今日待办、优先级、完成追踪 |
| 日常打卡 | 习惯养成、连续计数 |
| 阅读专栏 | 书籍进度、笔记摘录 |
| 运动版面 | 运动目标、统计 |
| 财经版 | 收支记账、分类统计 |
| 副刊笔记 | 灵感记录、心情标签 |
| 热点追踪 | 稍后阅读、收藏管理 |

## 技术栈

- 纯 HTML/CSS/JavaScript，无构建依赖
- PWA 支持（Service Worker 离线缓存）
- Supabase 云同步（可选）
- Electron 桌面应用（可选）

## 文件结构

```
cat-news-workbench/
├── workbench-desktop.html    # 主页面
├── manifest.json             # PWA 配置
├── service-worker.js         # Service Worker（离线缓存）
├── schema.sql                # Supabase 数据库建表脚本
├── assets/
│   ├── avatar.jpg            # 头像
│   └── greet-banner.jpg      # 横幅图
├── electron/
│   ├── main.js               # Electron 主进程
│   └── package.json          # Electron 项目配置
├── 启动桌面工作台.bat        # Windows 桌面启动脚本
└── 创建桌面快捷方式.bat      # 桌面快捷方式生成器
```