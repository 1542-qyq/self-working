# MewHub 工作台 · 完整样式主题文档（迁移用）

> 来源：`workbench-desktop.html`（桌面端）+ `index.html`（移动端）+ `assets/common.js`（模块调色板）
> 说明：桌面端与移动端共享同一份 `:root` token，全站零硬编码颜色，所有组件通过 `var(--token)` 引用。**迁移关键 = 一份 `:root` 变量表。**

---

## 0. 主题定位

> **极简 Dashboard 设计系统：纯白底 + 灰蓝色主调、零阴影、靠边框对比建立层级、紧凑专业。**

- 卡片默认无阴影（`--shadow-card: none`），层级靠 `1px solid var(--border)` 边框区分
- 交互反馈统一：focus 光环 + accent 描边；hover 才允许阴影浮起
- 主色为灰蓝 slate `#475569`（注意：文件头注释写的 "#2563ef brand blue" 是历史遗留，实际 accent 为 slate）

---

## 1. 核心 Token 系统（可直接复制）

```css
:root {
  /* ---- 页面与表面 ---- */
  --page-bg: #ffffff;          /* 页面底色 */
  --surface-card: #ffffff;     /* 卡片/弹层/输入框表面 */
  --surface-nested: #f9fafb;   /* 次级填充面（hover、嵌套块、ghost 按钮 hover） */

  /* ---- 边框 ---- */
  --border: #e5e7eb;           /* 通用边框（灰 200） */
  --border-input: #d1d5db;     /* 输入框/更强调的边框（灰 300） */

  /* ---- 文本层级 ---- */
  --text: #111827;             /* 主文本（灰 900） */
  --text-secondary: #4b5563;   /* 次级文本（灰 600） */
  --text-tertiary: #9ca3af;    /* 弱化文本/图标默认色（灰 400） */

  /* ---- 主色（灰蓝 slate 系） ---- */
  --brand-50: #f8fafc;
  --brand-100: #f1f5f9;
  --brand-500: #64748b;
  --brand-600: #475569;        /* ← 实际主色 accent */
  --brand-700: #334155;        /* accent hover */
  --accent: var(--brand-600);
  --accent-muted: var(--brand-50);  /* focus ring 底色 */
  --on-accent: #ffffff;        /* accent 上的文字/图标 */

  /* ---- 模块色 — 统一只用灰蓝色系 ---- */
  --module-1: #475569;
  --module-2: #475569;
  --module-3: #475569;
  --module-4: #475569;
  --module-5: #475569;

  /* ---- 状态色 ---- */
  --danger: #ef4444;
  --danger-muted: #fef2f2;
  --success: #10b981;
  --warning: #f59e0b;

  /* ---- 抽屉/侧栏 ---- */
  --drawer-bg: #f9fafb;
  --drawer-bg-top: #f9fafb;
  --drawer-text: #111827;
  --drawer-text-mute: #9ca3af;
  --drawer-hover: #f3f4f6;
  --drawer-active: #eff6ff;

  /* ---- 背景图（可覆盖） ---- */
  --greet-image: none;
  --page-texture: none;

  /* ---- 圆角 ---- */
  --radius-sm: 6px;
  --radius-control: 8px;    /* 按钮/输入框/导航项/图标容器 */
  --radius-tile: 12px;      /* 小卡片/记录条/缩略图 */
  --radius-card: 16px;      /* 卡片/面板 */
  --radius-lg: 16px;
  --radius-sheet: 20px;     /* 大图横幅 hero */

  /* ---- 阴影 — 卡片无阴影！ ---- */
  --shadow-card: none;
  --shadow-overlay: 0 10px 28px rgba(0,0,0,.08);  /* 仅 hover/弹层 */

  /* ---- 字体与布局 ---- */
  --font: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-mono: 'JetBrains Mono', "SF Mono", Menlo, Consolas, monospace;
  --sidebar-w: 240px;
}
```

---

## 2. 颜色语义分层

| 层级 | Token | 色值 | 用途 |
|---|---|---|---|
| 背景 | `--page-bg` | `#ffffff` | 页面整体 |
| 表面 | `--surface-card` | `#ffffff` | 卡片、弹层、输入框 |
| 嵌套面 | `--surface-nested` | `#f9fafb` | 次级填充、ghost 按钮 hover |
| 描边 | `--border` | `#e5e7eb` | 所有卡片/分隔线 |
| 强调描边 | `--border-input` | `#d1d5db` | 输入框、hover 时边框加深 |
| 主文字 | `--text` | `#111827` | 标题、正文 |
| 次文字 | `--text-secondary` | `#4b5563` | 描述、说明 |
| 弱文字 | `--text-tertiary` | `#9ca3af` | 图标默认色、占位、页脚 |
| 品牌主色 | `--accent` | `#475569` | 按钮、选中态、链接、强调条 |
| accent hover | `--brand-700` | `#334155` | 按钮 hover |
| accent 浅底 | `--accent-muted` | `#f8fafc` | focus 光环底色 |
| 危险 | `--danger` / `--danger-muted` | `#ef4444` / `#fef2f2` | 删除、错误 |
| 成功 | `--success` | `#10b981` | 通过、完成 |
| 警示 | `--warning` | `#f59e0b` | 待办警示 |

**色阶关系**：整个色板 = Tailwind 灰蓝 slate 系 + 灰系混用——
`gray-50/100/200/300/400/600/900` 对应 `--surface-nested / --brand-50 / --border / --border-input / --text-tertiary / --text-secondary / --text`；
`slate-500/600/700` 对应 `--brand-500 / --brand-600 / --brand-700`。

---

## 3. 字体规范

```css
--font: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
--font-mono: 'JetBrains Mono', "SF Mono", Menlo, Consolas, monospace;
```

- 正文：**Inter**（中文 fallback：苹方 → 微软雅黑）
- 数字/统计强调：**JetBrains Mono**（财务金额、求职数据、进度数值等用 `--font-mono`）
- 全局：`-webkit-font-smoothing: antialiased`
- `body { font-size: 14px; line-height: 1.5 }`

### 字号阶梯（从代码实际提取）

| 字号 | 字重 | 场景 |
|---|---|---|
| 10.5px | 600 + uppercase + 0.08em | 侧栏分组标题 `.nav-sep` |
| 11px | 500/700 | 侧栏副标、页脚、列表元信息 |
| 11.5px | 700 | Badge 胶囊、卡片描述 |
| 12px | 500–600 | 次要说明、统计标签 |
| 12.5px | — | 备注正文 |
| 13px | 500–600 | 按钮、输入框、导航项、次级标题 |
| 13.5px | 700 | 聚焦列表项标题 |
| 14px | 400/600 | 正文基准、小节标题 `.sec-title` |
| 14.5px | 700–800 | 记录条目标题、模块卡名 |
| 15px | 600–800 | 品牌名、卡片主数值、强标题 |
| 18px | 600 | 引用块文字 |
| 19px | 600 | 弹层标题 |
| 20px | 800 | 模块 hero 大数值 |
| 22px | 800 | hero 统计数字 |
| 27px | 800 | 页面大标题 `h2`（letter-spacing: -0.03em） |
| 34px | 800 | hero 问候语 |

标题普遍带**负字距**：`-0.01em / -0.02em / -0.03em`，字号越大负越多。

---

## 4. 圆角体系（5 档）

| 档位 | 值 | 应用于 |
|---|---|---|
| `--radius-sm` | 6px | 进度条、极小元素 |
| `--radius-control` | 8px | 按钮、输入框、导航项、头像、图标容器 |
| `--radius-tile` | 12px | 记录条、小卡片、缩略图 |
| `--radius-card` | 16px | 卡片、面板、模块卡 |
| `--radius-sheet` | 20px | hero 大横幅、弹层 `modal` |

另有 `border-radius: 999px`（**胶囊形**）：Badge、日期 chip、进度条、tab 指示器。
图标容器常用 **10px / 11px** 圆角（介于 8–12 之间，随尺寸微调）。

---

## 5. 阴影规范（极简）

- **卡片默认零阴影**（`--shadow-card: none`），层级靠 `1px solid var(--border)` 边框区分——这是本主题最鲜明的特征。
- **hover 浮起**：`box-shadow: var(--shadow-overlay)` + `transform: translateY(-2px)` + `border-color: var(--border-input)`（仅桌面端卡片用 translateY，移动端只改边框色）。
- **弹层**：`modal` 用 `box-shadow: 0 24px 60px color-mix(in srgb, var(--text) 26%, transparent)`。
- **遮罩** `overlay`：`background: color-mix(in srgb, var(--text) 44%, transparent); backdrop-filter: blur(3px)`。

---

## 6. 组件设计规范

### 6.1 侧栏（sidebar / drawer）

- 宽 `240px`（`--sidebar-w`），底色 `--drawer-bg: #f9fafb`，右侧 `1px solid var(--border)`
- 导航项 `.navi`：`padding: 9px 12px; border-radius: 8px; font-size: 13px; font-weight: 500`
  - hover：`background: var(--drawer-hover)` 文字加深
  - active：`background: var(--drawer-active)` + 文字/图标 `var(--accent)` + `font-weight: 600`
  - 图标默认 `var(--text-tertiary)`
- 分组标题 `.nav-sep`：10.5px / 600 / uppercase / 0.08em / tertiary
- 滚动条 4px 细条，thumb 用 `--border`

### 6.2 按钮 `.btn`

```css
.btn {
  background: var(--accent); color: #fff;
  border: 1px solid var(--accent); border-radius: 8px;
  padding: 8px 16px; font-size: 13px; cursor: pointer;
}
.btn:hover          { background: var(--brand-700); border-color: var(--brand-700); }
.btn.ghost          { background: var(--surface-card); color: var(--text); border: 1px solid var(--border); font-weight: 500; }
.btn.ghost:hover    { background: var(--surface-nested); border-color: var(--border-input); }
.btn.danger         { background: var(--danger); border-color: var(--danger); }
.btn.danger:hover   { background: #dc2626; border-color: #dc2626; }
```

### 6.3 输入框 `input / textarea / select`

```css
input, textarea {
  font-size: 13px; border: 1px solid var(--border); border-radius: 8px;
  padding: 8px 12px; background: var(--surface-card); color: var(--text);
  outline: none; width: 100%;
  transition: border-color .12s, box-shadow .12s;
}
input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-muted); }
textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
```

带图标输入框：图标绝对定位在 `left: 11px`，输入框 `padding-left: 34px`。

### 6.4 分段控件 `.seg`

```css
.seg { display: flex; gap: 8px; flex-wrap: wrap; }
.seg .opt { flex: 1; min-width: 64px; text-align: center; padding: 10px;
  border-radius: 11px; border: 1px solid var(--border-input); }
.seg .opt.on { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
```

### 6.5 卡片（bento 布局）

- 网格：`.modcard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px }`
- 统一卡片公式：`background: var(--surface-card); border: 1px solid var(--border); border-radius: var(--radius-card); box-shadow: var(--shadow-card)`
- 模块卡头部：36×36 图标容器（`border-radius: 10px`，背景 = 模块 tint，图标 = 模块 color）+ 名称（14.5px/800）+ 描述（11.5px/tertiary）
- 主数值 15px/800，hover 整卡上浮 2px

### 6.6 记录条目 `.rec`

- `border-radius: 12px; padding: 14px 16px`，hover 边框变 `--border-input`
- 复选框：23×23、`border-radius: 7px`、`border: 1.6px solid var(--border-input)`，勾选后背景/边框 = `--module-1`
- 标题 14.5px/700，完成后 `line-through` + secondary
- 进度条 `.pbar`：`height: 6px; border-radius: 999px; background: var(--border)`，填充 `i` 为模块色
- hover 时右侧操作按钮淡入（opacity 0→1，`background: var(--surface-card)` 遮底）
- 三种版式：默认横条 / `feature`（大图 16:10、160px 高）/ `quote`（18px/600 引用文字）

### 6.7 Badge 与 Chip

```css
.badge { display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px;
  border-radius: 999px; font-size: 11.5px; font-weight: 700; }
.badge .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
```

- 日期 chip：胶囊形 `border-radius: 999px; padding: 8px 15px`
- 元信息标签 `.meta-tag`：12px/600，前导分隔符 `·`（tertiary）

### 6.8 弹层

```css
.modal { background: var(--surface-card); border-radius: 20px; padding: 26px;
  width: 480px; max-width: 92vw; max-height: 90vh; }
.modal h3 { font-size: 19px; font-weight: 600; letter-spacing: -.01em; }
.modal .sub { color: var(--text-secondary); font-size: 13px; margin: 5px 0 18px; }
.modal-actions { display: flex; align-items: center; gap: 10px; margin-top: 22px; }
```

### 6.9 页面结构

- `main`：`padding: 26px 34px 48px`，内容区最大宽 1180px
- 页头 `h2`：27px / 800 / `letter-spacing: -.03em`
- 小节标题 `.sec-title`：14px/600，前置 **3px×14px 圆角竖条**（`background: var(--accent)`）
- hero 横幅：`border-radius: 20px; min-height: 208px`，左侧白色渐变叠加图（`linear-gradient(100deg, var(--surface-card) 34%, color-mix(in srgb, var(--surface-card) 50%, transparent) 52%, transparent 76%)`）

### 6.10 移动端外壳（index.html 特有）

- 汉堡按钮 → 全屏抽屉（复用桌面侧栏样式）
- 底部 Tab 栏 `.mob-tabbar`：`position: fixed; bottom: 0; z-index: 40`，按钮为纵向 flex（20px 图标 + 11px 文字），active 用 accent 色 + 顶部小指示条（`::before`）
- `min-width: 1000px` 媒体查询切换桌面/移动布局

---

## 7. 模块调色板（重点迁移内容）

主工作台 7 个模块 + 雅思 5 个 + 求职 1 个，来自 `assets/common.js` 的 CONFIG。
**tint = 浅底（图标容器背景），color = 前景强调色**：

| 模块 | tint（浅底） | color（前景） | 说明 |
|---|---|---|---|
| 头版选题 todo | `#efe7d0` | `var(--accent)` #475569 | 米灰底 |
| 日常打卡 checkin | `#d8e5d0` | `var(--module-1)` | 淡绿 |
| 阅读专栏 read | `#f6efe8` | `var(--module-2)` | 暖米 |
| 运动版面 sport | `#f3e3dd` | `var(--module-3)` | 淡粉橘 |
| 财经版 money | `#efe7d0` | `var(--module-4)` | 米灰 |
| 副刊笔记 note | `#e6dfd0` | `var(--module-5)` | 浅沙 |
| 热点追踪 hot | `#f3e3dd` | `var(--danger)` #ef4444 | 粉红底 + 红 |
| 雅思阅读 | `#d6e4d0` | `#4a6c3f` | 绿 |
| 雅思听力 | `#e6dcd0` | `#8b7355` | 棕 |
| 雅思写作 | `#d0dde5` | `#3d5a6c` | 蓝 |
| 雅思口语 | `#f0ddd0` | `#a0522d` | 栗色 |
| 备考记录 | `#ece0c8` | `#9c7a3c` | 金 |
| 求职投递 job | `#e4ecf2` | `#2f5d8a` | 蓝 |

**待办优先级 chip**：

- P0 重要：底 `#f3e3dd` / 字 `#c25d4f`
- P1 一般：底 `#f6efe8` / 字 `#e6a043`
- P2 随手：底 `#d8e5d0` / 字 `#4a6c3f`

**快速添加按钮**（记运动/记打卡/记一笔/记想法）复用对应模块 tint + color。

**雅思弱项标记**（IELTS 模块内）：

- 弱项：`rgba(220,53,69,.08)` 底 + danger 字
- 计划：`rgba(40,167,69,.08)` 底 + `#28a745` 字
- 难度：`#d4a017`

---

## 8. 特殊组件（可选项）

- **POMO 专注卡**：深色渐变卡 `linear-gradient(155deg, #302f2c, #1e1d1b)`，按钮用 rgba 描边；主按钮反色 `#f4f3f0` 底 / `#232220` 字
- **时钟卡 / 侧栏概览**：`linear-gradient(140deg, #33322e, #232220, #1b1a18)` + 圆形光晕 `radial-gradient`（金 `rgba(189,138,78,.35)`、绿 `rgba(111,143,106,.28)`）

---

## 9. 图标规范

- 全部 **Lucide 风格内联 SVG**：24×24 viewBox，`fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round`，跟随父元素 `color` 变色
- 图标字典集中管理在 `common.js` 的 `ICONS`，HTML 通过 `<svg><use href="#icon-xxx"/></svg>` 引用
- 常用图标：`list`（选题）、`leaf`（打卡）、`book`（阅读）、`activity`（运动）、`wallet`（记账）、`pen`（笔记）、`flame`（热点）、`headphones`（听力）、`mic`（口语）、`file-text`（备考）、`briefcase`（求职）、`check`、`search`、`calendar` 等

---

## 10. 迁移到目标站点的 Checklist

1. **复制 `:root` 块**（第 1 节）到目标项目 CSS 顶层；
2. **建立两条铁律**：所有颜色/圆角/阴影必须通过 `var(--token)` 引用；不引入卡片阴影；
3. **字体**：引入 Inter + JetBrains Mono（中文自动回退苹方/雅黑，无需额外引入）；
4. **层级语言**：卡片间一律用 `1px solid var(--border)` 区分；hover 才允许 `--shadow-overlay`；
5. **交互反馈**：focus = `border-color: var(--accent)` + `0 0 0 3px var(--accent-muted)` 光环；active 态一律 accent 底 + 白字；
6. **模块卡配色**：从第 7 节直接取 tint/color 对，用于图标容器底色 + 图标颜色 + 进度条填充；
7. **状态语义**：danger / success / warning 三个 token 全站复用，禁止另开新色；
8. **响应式**：`min-width: 1000px` 以上用侧栏布局，以下切换抽屉 + 底部 Tab 栏；
9. **可选深色**：如要深色模式，只需整体替换 `:root` 变量值（AI 聊天组件用的 `[data-theme='dark']` 变量块可作参考，但它是第三方组件的独立体系）。

---

## 附：迁移模板文件结构建议

```
theme/
├── tokens.css        # 第 1 节 :root 变量表
├── base.css          # reset + 字体 + 排版阶梯
├── components.css    # 第 6 节组件规范
└── module-palette.css # 第 7 节模块 tint/color（CSS 变量形式）
```

模块色建议也落成变量，例如：

```css
:root {
  --m-todo:        #475569;  /* 头版选题 */
  --m-checkin:     #475569;  /* 日常打卡 */
  --m-read:        #475569;  /* 阅读专栏 */
  --m-sport:       #475569;  /* 运动版面 */
  --m-money:       #475569;  /* 财经版 */
  --m-note:        #475569;  /* 副刊笔记 */
  --m-hot:         #ef4444;  /* 热点追踪 */
  --m-ielts-read:  #4a6c3f;  /* 雅思阅读 */
  --m-ielts-list:  #8b7355;  /* 雅思听力 */
  --m-ielts-write: #3d5a6c;  /* 雅思写作 */
  --m-ielts-speak: #a0522d;  /* 雅思口语 */
  --m-ielts-record:#9c7a3c;  /* 备考记录 */
  --m-job:         #2f5d8a;  /* 求职投递 */
}
```
