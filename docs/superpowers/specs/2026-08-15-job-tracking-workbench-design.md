# 简历投递追踪模块设计文档

> **创建日期**: 2026-08-15
> **状态**: 设计已确认
> **关联工作区**: 喵喵编辑部 / MewHub 工作台
> **数据来源**: `job-board/简历投递看板.html`

---

## 1. 概述

### 1.1 背景

用户已制作一份独立的「产品实习简历投递看板」（`job-board/简历投递看板.html`），包含 33 个岗位的静态信息（公司/岗位/薪资/地点/优先级/评分/链接/匹配分析）与动态状态（投递状态/日期/备注）。现需将该能力并入个人工作台，形成统一入口。

### 1.2 目标

在工作台新增一个「求职投递」模块，全量迁移看板的字段与视图，沿用工作台现有视觉风格，数据存 localStorage，后续可扩展 Notion 同步。

### 1.3 设计原则

| 原则 | 说明 |
|------|------|
| **不破坏现有** | 现有「猫生日常」「IELTS 备考」模块完全不受影响 |
| **全量迁移** | 保留 rank/tier/score/aiScore/desc/链接等全部字段 |
| **完整视图** | 还原统计卡片 + 优先级筛选 + 排序 + 搜索 |
| **沿用工作台样式** | 结构色用 `var()` token，不搬看板的硬编码 hex |
| **工作台为主** | 数据存 localStorage，Notion 作为后续备份层 |

---

## 2. 架构设计

### 2.1 模块与导航分组

在导航新增第三组「求职投递」，先只放 1 个模块：

```
├── 🐾 猫生日常 (7 个模块，现有)
├── 📚 IELTS 备考 (5 个模块，现有)
└── 💼 求职投递 (1 个模块，新增) ★
    └── 求职投递 (job)
```

模块定义：

| 属性 | 值 |
|------|-----|
| key | `job` |
| name | 求职投递 |
| icon | `briefcase`（新增，lucide） |
| type | `job`（新增类型） |
| color | `#2f5d8a`（钢蓝，与现有模块色区分） |
| tint | `#e4ecf2` |
| desc | 简历投递进度追踪 |

### 2.2 配色（沿用工作台 token）

- 结构色全部用 token：`--surface-card` / `--border` / `--text` / `--text-secondary` / `--text-tertiary` / `--accent` / `--radius-*`
- 语义色（tier / status）用一组柔和 hex，与现有 IELTS 模块的硬编码色保持一致：

| 语义 | 色值 | 用途 |
|------|------|------|
| 模块主色 | `#2f5d8a` | job 模块标识 |
| S 级 / 已结束 | `#c25d4f` | 强烈推荐 / 拒绝 |
| A 级 / 面试中 | `#e6a043` | 推荐 / 面试 |
| B 级 / 已投递 | `#3b6fa0` | 可考虑 / 已投递 |
| C 级 / 待投递 | `#8a94a0` | 保底 / 待投递 |
| ⚠ / 笔试中 | `#805ad5` | 不建议 / 笔试 |
| Offer | `#3a9d6b` | 已 Offer |

---

## 3. 数据模型

### 3.1 字段清单

每条记录对应一个岗位，`title` 为公司名（卡片主标题）：

| 字段 key | 标签 | 类型 | 看板来源 | 说明 |
|---|---|---|---|---|
| `title` | 公司 | 内置主标题 | company | 卡片主标题 |
| `position` | 岗位 | text | position | |
| `salary` | 薪资 | text | salary | |
| `location` | 地点 | text | location | |
| `tier` | 优先级 | select | tier | `s/a/b/c/x` → S/A/B/C/⚠ |
| `tagsText` | 标签 | text | tagsText | |
| `score` | 手动评分 | number | score | 0–70 |
| `aiScore` | AI评分 | number | aiScore | 0–5 |
| `resume` | 简历链接 | url | resume | 可点击 |
| `jd` | JD链接 | url | jd | 可点击 |
| `desc` | 匹配分析 | textarea | desc | |
| `status` | 投递状态 | select | status | 6 态 |
| `date` | 投递/面试日期 | date | date | |
| `note` | 备注 | textarea | note | |

> `rank` 不单设字段，seed 数组顺序即默认排名。

### 3.2 投递状态流转（6 态）

```
pending(待投递) → applied(已投递) → written(笔试中) → interview(面试中) → offer(已Offer) / rejected(已结束)
```

| 值 | 显示 | 色 |
|---|---|---|
| `pending` | 待投递 | `#8a94a0` |
| `applied` | 已投递 | `#3b6fa0` |
| `written` | 笔试中 | `#805ad5` |
| `interview` | 面试中 | `#e6a043` |
| `offer` | 已Offer | `#3a9d6b` |
| `rejected` | 已结束 | `#c25d4f` |

交互：卡片内 `<select>` 下拉直接切换（6 态太多，不用循环点击）。

### 3.3 Seed 数据

33 个岗位迁移为 `seed` 数组，每条含全部字段，`status` 默认 `pending`、`date`/`note` 为空。`resume`/`jd` 保留看板的相对路径字符串（迁移后需按实际路径核对）。

---

## 4. 视图设计

### 4.1 模块页结构

```
┌─────────────────────────────────────────────┐
│ 求职投递  ·  简历投递进度追踪        [日期]   │
│ [搜索框]                          [新建]      │
│ ┌─ 7 格状态统计（点击筛选）─────────────┐     │
│ │ 全部 | 待投递 | 已投递 | 笔试中 | 面试 | Offer | 已结束 │
│ └────────────────────────────────────┘     │
│ [优先级筛选] [排序：手动排名/AI评分]          │
│ ┌───────────────┐  ┌───────────────────┐   │
│ │  岗位卡片网格   │  │  侧栏统计          │   │
│ └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────┘
```

### 4.2 卡片布局

```
┌──────────────────────────────────┐
│ [tier徽章] 公司             薪资  │
│           岗位              地点  │
│ [标签]                            │
│ 手动评分 ▓▓▓▓▓▓░░  65             │
│ AI评分   ▓▓▓▓▓▓▓░  4.5            │
│ 匹配分析（2 行截断）               │
│ [状态▾] [日期] [📄简历] [🖼️JD]   │
│ [📝 备注输入框]                    │
└──────────────────────────────────┘
```

卡片内可内联编辑：状态下拉、日期、备注（同看板）；其余字段通过点卡片打开编辑弹窗。

---

## 5. 技术实现

### 5.1 改动点清单

| # | 任务 | 文件 | 复杂度 |
|---|------|------|--------|
| 1 | 新增 `briefcase` 图标 | `assets/common.js` | 低 |
| 2 | 新增 `job` 模块定义 + seed | `assets/common.js` | 低 |
| 3 | `recHTML` 加 `job` 卡片分支 | `index.html` / `workbench-desktop.html` | 高 |
| 4 | `sideStats` 加 `job` 侧栏 | 同上 | 中 |
| 5 | `renderModule` 加 `job` head（7 格统计）+ 筛选/排序栏 | 同上 | 中 |
| 6 | `openEditor` 加 `job` 表单 + 保存 | 同上 | 中 |
| 7 | `newItem` 加 `job` 分支 | 同上 | 低 |
| 8 | `wireModule` 加 `job` 内联编辑绑定 | 同上 | 中 |
| 9 | `buildNav` 加「求职投递」分组 | 同上 | 低 |
| 10 | 新增 `job` 相关 CSS | 同上 | 中 |

### 5.2 模块状态（筛选/排序）

筛选与排序为 `job` 模块专有，用模块级变量承载：

```js
let jobFilter = 'all';   // status: all/pending/applied/written/interview/offer/rejected
let jobTier   = 'all';   // tier: all/s/a/b/c/x
let jobSort   = 'rank';  // rank/ai
```

进入模块时重置（在 `go()` 或 `renderModule` 中处理），避免跨模块残留。

### 5.3 新增类型的关键分支

- `recHTML`：`if(m.type==="job"){ ... }`
- `sideStats`：`if(m.type==="job"){ ... }`
- `renderModule` head：`else if(m.type==="job"){ ... }`
- `buildAllFields`：`else if(m.type==="job"){ ... }`
- 保存处理：`else if(m.type==="job"){ ... }`
- `newItem`：`else if(m.type==="job"){ ... }`
- `wireModule`：绑定 `.js-status` / `.js-date` / `.js-note` 内联控件

---

## 6. 数据迁移

1. 33 个岗位 → `job.seed`（静态字段全部迁移）。
2. 看板 `localStorage.jobApplicationStatus` 里的 status/date/note → 合并进对应岗位。
   - 当前看板状态全为「待投递」，动态字段为空，实际迁移几乎无需处理。
3. 工作台 `store.load()` 已含 `CONFIG.modules.forEach` 初始化逻辑，新增模块后老用户首次打开会自动注入 seed，无需手动迁移。

---

## 7. Notion 同步（后续，非本阶段）

预留 `job` 字段映射（公司/岗位/状态/日期/备注 → Notion 数据库），复用现有 `autoMapField` / `mapToWorkbenchItem` / `mapToNotionProperties` 逻辑，本阶段不实现。

---

## 8. 非目标（Out of Scope）

| 项目 | 说明 |
|------|------|
| Notion 双向同步 | 后续阶段 |
| 移动端适配 | 沿用现有桌面端形态 |
| 岗位分析与排名页 | 看板内「快速访问」链接不迁入 |
| 多用户/协作 | 单人使用 |
| 附件/PDF 上传 | 仅保留链接字符串 |
