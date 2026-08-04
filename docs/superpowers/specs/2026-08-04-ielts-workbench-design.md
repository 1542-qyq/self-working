# IELTS 备考模块设计文档

> **创建日期**: 2026-08-04  
> **状态**: 设计已确认  
> **关联工作区**: Yannick's workplace (Notion)

---

## 1. 概述

### 1.1 背景

用户是雅思（IELTS）考生，在 Notion 的 `Yannick's workplace` 工作区中已建立 5 个 IELTS 相关数据库。本设计旨在将这些 Notion 数据库与现有的「喵喵编辑部」工作台集成，实现雅思备考的数字化管理。

### 1.2 目标

在现有猫咪编辑部工作台基础上，新增 5 个 IELTS 备考专用模块，与用户的 Notion 数据库双向同步，形成「工作台为主、Notion 同步」的备考工作流。

### 1.3 设计原则

| 原则 | 说明 |
|------|------|
| **不破坏现有** | 7 个猫咪日常模块完全不受影响 |
| **延续风格** | IELTS 模块采用相同的报纸/杂志版式风格 |
| **数据为主** | 工作台是主数据源，Notion 作为备份和跨设备同步 |
| **渐进增强** | 扩展映射逻辑，不修改原有映射函数的行为 |

---

## 2. 架构设计

### 2.1 模块列表

```
喵喵编辑部 · Cat Daily News
├── 🐾 猫生日常 (7 个模块，现有)
│   ├── 头版选题 (todo)
│   ├── 日常打卡 (checkin)
│   ├── 阅读专栏 (read)
│   ├── 运动版面 (sport)
│   ├── 财经版 (money)
│   ├── 副刊笔记 (note)
│   └── 热点追踪 (hot)
│
└── 📚 IELTS 备考 (5 个模块，新增) ★
    ├── 📖 阅读题库 (ielts_read)
    ├── 🎧 听力题库 (ielts_listening)
    ├── ✍️ 写作题库 (ielts_writing)
    ├── 🎤 口语题库 (ielts_speaking)
    └── 📋 备考记录 (ielts_record)
```

### 2.2 导航结构

左侧导航分为两个分组，用分隔线区分：

```
┌─────────────────────────────┐
│       🐾 喵喵编辑部          │
├─────────────────────────────┤
│  猫生日常                    │
│  ├── 头版选题                │
│  ├── 日常打卡                │
│  ├── 阅读专栏                │
│  ├── 运动版面                │
│  ├── 财经版                  │
│  ├── 副刊笔记                │
│  └── 热点追踪                │
│  ─────────────               │
│  IELTS 备考 ★               │
│  ├── 📖 阅读题库             │
│  ├── 🎧 听力题库             │
│  ├── ✍️ 写作题库             │
│  ├── 🎤 口语题库             │
│  └── 📋 备考记录             │
├─────────────────────────────┤
│  统计 / 其他                 │
│  ├── 洞察复盘                │
│  └── 设置                   │
└─────────────────────────────┘
```

### 2.3 主题配色

| 模块 | 主色调 | Tint | 说明 |
|------|--------|------|------|
| 📖 阅读题库 | `#4a6c3f` | `#d6e4d0` | 墨绿 · 书本气息 |
| 🎧 听力题库 | `#8b7355` | `#e6dcd0` | 暖棕 · 耳机/音频 |
| ✍️ 写作题库 | `#3d5a6c` | `#d0dde5` | 深蓝 · 墨水/纸笔 |
| 🎤 口语题库 | `#a0522d` | `#f0ddd0` | 朱红 · 说话/热情 |
| 📋 备考记录 | `#9c7a3c` | `#ece0c8` | 暗金 · 档案/记录 |

---

## 3. 模块详细设计

### 3.1 📖 阅读题库

**Notion 数据源**: `33d36208-49f8-4a62-8982-17d5c8730432`

| 字段 Key | 标签 | 类型 | Notion 映射 | 说明 |
|----------|------|------|------------|------|
| `title` | 文章标题 | string | 文章标题 (title) | 卡片主标题 |
| `section` | 部分 | select | 部分 (select) | P1/P2/P3 |
| `accuracy` | 正确率 | number | 正确率 (number %) | 0-100 百分比 |
| `difficulty` | 难度 | number | 难度 (number) | 1-5 星 |
| `frequency` | 频次 | select | 频次 (select) | 高频/中频/低频 |
| `status` | 完成状态 | select | 完成状态 (select) | 4 态状态机 |
| `date` | 练习日期 | date | 练习日期 (date) | ISO 日期 |
| `note` | 备注 | text | 备注 (rich_text) | 错题/笔记 |

**卡片 UI**:
```
┌─────────────────────────────────┐
│ 📖 The Origins of Solar Energy  │
│  [P3] [高频]          ⭐⭐⭐⭐   │
│  ┌──────┐                        │
│  │  75%  │  ✅ 已完成   2026-08-04│
│  └──────┘                        │
│  易错点：题目中的术语理解...       │
└─────────────────────────────────┘
```

### 3.2 🎧 听力题库

**Notion 数据源**: `ad38c5ab-363d-4f15-be0d-0aefdf45cb04`

| 字段 Key | 标签 | 类型 | Notion 映射 | 说明 |
|----------|------|------|------------|------|
| `title` | 标题(英) | string | 标题(英) (title) | 英文标题主显示 |
| `titleCn` | 标题(中) | string | 标题(中) (rich_text) | 副标题 |
| `section` | Section | select | Section (select) | S1/S2/S3/S4 |
| `accuracy` | 正确率 | number | 正确率 (number %) | 0-100 百分比 |
| `difficulty` | 难度 | text | 难度 (rich_text) | 文字描述 |
| `status` | 完成状态 | select | 完成状态 (select) | 4 态状态机 |
| `date` | 练习日期 | date | 练习日期 (date) | ISO 日期 |
| `note` | 备注 | text | 备注 (rich_text) | 笔记 |

**卡片 UI**:
```
┌─────────────────────────────────┐
│ 🎧 The History of Tea Production│
│ │ 茶叶生产的历史                │
│  [S2]  ⭐⭐⭐        ⏳ 进行中    │
│  ┌──────┐                        │
│  │  68%  │              2026-08-04│
│  └──────┘                        │
│  注意：Section 3 的地图标注...    │
└─────────────────────────────────┘
```

### 3.3 ✍️ 写作题库

**Notion 数据源**: `ef4c771d-676e-4da8-bde0-96c0a010a6ad`

| 字段 Key | 标签 | 类型 | Notion 映射 | 说明 |
|----------|------|------|------------|------|
| `title` | 题目 | string | 题目 (title) | 中文题目主显示 |
| `titleEn` | 题目英文 | string | 题目英文 (rich_text) | 可折叠英文原题 |
| `task` | Task | select | Task (select) | Task 1/Task 2 |
| `questionType` | 题型 | select | 题型 (select) | 10 种题型 |
| `estimatedScore` | 预估分数 | number | 预估分数 (number) | 0-9 |
| `correctionLink` | 批改报告链接 | url | 批改报告链接 (url) | 可点击链接 |
| `status` | 完成状态 | select | 完成状态 (select) | 4 态状态机 |
| `date` | 练习日期 | date | 练习日期 (date) | ISO 日期 |
| `note` | 备注 | text | 备注 (rich_text) | 笔记 |

**卡片 UI**:
```
┌─────────────────────────────────┐
│ ✍️ 现代生活中的科技使用          │
│ [Task 2] [观点类]               │
│ 预估分：7.0    ✅ 已完成         │
│                                  │
│ 题目原文 ▾                       │
│  "Some people believe that..."   │
│                                  │
│  [📎 查看批改报告]  2026-08-04   │
│  论点不够充分，需增加具体案例...   │
└─────────────────────────────────┘
```

### 3.4 🎤 口语题库

**Notion 数据源**: `eef7e69d-4e77-4e83-b49e-18ea75dce750`

| 字段 Key | 标签 | 类型 | Notion 映射 | 说明 |
|----------|------|------|------------|------|
| `title` | 话题/问题 | string | 话题/问题 (title) | 话题标题 |
| `part` | Part | select | Part (select) | Part 1/2/3 |
| `selfAssessment` | 自我评估 | select | 自我评估 (select) | 流利/一般/需加强 |
| `cueCard` | 提示卡内容 | text | 提示卡内容 (rich_text) | 可折叠展开 |
| `topicCategory` | 话题分类 | text | 话题分类 (rich_text) | 小标签 |
| `status` | 完成状态 | select | 完成状态 (select) | 4 态状态机 |
| `date` | 练习日期 | date | 练习日期 (date) | ISO 日期 |
| `note` | 备注 | text | 备注 (rich_text) | 笔记 |

**卡片 UI**:
```
┌─────────────────────────────────┐
│ 🎧 Describe a place you'd like  │
│ to visit in the future          │
│ [Part 2] [个人经历]              │
│ 自我评估：😊 一般                │
│                                  │
│ 提示卡 ▾                         │
│  - Where: Japan                  │
│  - When: Next summer             │
│  - Why: Experience culture...    │
│                                  │
│  ✅ 已完成  2026-08-04            │
│  需要更多例子支撑...              │
└─────────────────────────────────┘
```

### 3.5 📋 备考记录

**Notion 数据源**: `cca1d5c6-7a0d-4ac3-ad98-703b8e084027`

| 字段 Key | 标签 | 类型 | Notion 映射 | 说明 |
|----------|------|------|------------|------|
| `title` | 练习内容 | string | 练习内容 (title) | 记录标题 |
| `subject` | 科目 | select | 科目 (select) | 听力/阅读/写作/口语 |
| `accuracy` | 正确率 | number | 正确率 (number %) | 0-100 |
| `estimatedScore` | 评估分数 | number | 评估分数 (number) | 0-9 |
| `weakness` | 薄弱点 | text | 薄弱点 (rich_text) | 红色背景标注 |
| `tomorrowPlan` | 明日重点 | text | 明日重点 (rich_text) | 蓝色背景标注 |
| `source` | 练习来源 | text | 练习来源 (rich_text) | 小标签 |
| `correctionLink` | 批改报告链接 | url | 批改报告链接 (url) | 可点击 |
| `status` | 完成状态 | select | 完成状态 (select) | 3 态状态机 |
| `date` | 日期 | date | 日期 (date) | ISO 日期 |

**卡片 UI**:
```
┌─────────────────────────────────┐
│ 📋 剑15 Test 3 Section 2-4       │
│ [听力] [剑桥真题]                │
│ ┌──────────┐                     │
│ │ 正确率 72% │  评估：6.5        │
│ └──────────┘                     │
│                                  │
│ ⚠️ 薄弱点：地图标注题，听力细节   │
│ ✅ 明日重点：Section 3 地图题     │
│                                  │
│ [📎 批改报告]  2026-08-04        │
└─────────────────────────────────┘
```

---

## 4. 状态流转

### 4.1 IELTS 练习状态

每个条目支持 4 种状态（备考记录为 3 种）：

```
☐ 未练习 ──▶ ⏳ 进行中 ──▶ ✅ 已完成
    │                    │
    └──▶ 📋 今日任务 ────┘
         (安排到某天)
```

| 状态值 | 含义 | Notion 对应 |
|--------|------|------------|
| `☐ 未练习` | 尚未开始 | 默认状态 |
| `📋 今日任务` | 安排到今日 | 待办 |
| `⏳ 进行中` | 正在练习 | 进行中 |
| `✅ 已完成` | 练习完成 | 已完成 |

### 4.2 状态切换

- 点击卡片上的状态徽章，循环切换：未练习 → 进行中 → 已完成 → 未练习
- 编辑表单中可直接选择任一状态

---

## 5. 首页 IELTS 汇总

### 5.1 位置

在首页现有 4 个区块之后，新增第 ⑤ 区块「备考进度」：

```
① 今日节奏
② 习惯与待办
③ 专注与状态
④ 收支与成长
⑤ 📚 备考进度 ← 新增
```

### 5.2 卡片设计

```
┌─────────────────────────────────────────────────┐
│  📚 IELTS PROGRESS · 雅思备考                   │
│  备考第 1 周 · 2026-08-04                       │
├─────────────────────────────────────────────────┤
│  ...                                            │
├─────────────────────────────────────────────────┤
│  ⚠️ 今日计划 (3)                                │
│  ☐ 剑16 Test 2 Section 3-4                      │
│  ☐ Task 2: 科技与生活                           │
│  ✅ Part 2: 旅行经历                            │
├─────────────────────────────────────────────────┤
│  📈 今日统计：正确率 68% | 完成 3/7 项          │
└─────────────────────────────────────────────────┘
```

### 5.3 数据计算

| 指标 | 计算方式 |
|------|---------|
| 各科目正确率 | 已完成条目的 `accuracy` 平均值 |
| 各科目完成度 | 已完成条目数 / 总条目数 |
| 今日计划 | 所有模块中 `status = "📋 今日任务"` 的条目 |
| 今日统计 | 当日练习条目的汇总 |
| 备考周数 | 从用户设置的起始日期计算 `Math.floor(days / 7) + 1` |

### 5.4 交互

- 点击科目进度 → 跳转到对应 IELTS 模块
- 点击今日计划条目 → 打开条目详情
- 备考周数可在设置中自定义起始日期

---

## 6. Notion 同步

### 6.1 数据流

```
工作台编辑 → 自动保存到本地 (localStorage)
    ↓
定时检查 (30 秒) / 手动同步
    ↓
发现变更 → 通过 Python Proxy 推送到 Notion
    ↓
用户点击「拉取」→ 从 Notion 拉取最新数据 → 合并到本地
```

### 6.2 同步策略

| 场景 | 行为 |
|------|------|
| 推送（工作台 → Notion） | 工作台数据优先，覆盖 Notion 中的同名条目 |
| 拉取（Notion → 工作台） | 仅导入 Notion 中存在但本地没有的条目（合并模式） |
| 冲突解决 | 本地编辑优先，保留 Notion 中的新条目 |

### 6.3 Notion 数据库映射

| 工作台模块 | Notion 数据库 ID |
|-----------|-----------------|
| `ielts_read` | `33d36208-49f8-4a62-8982-17d5c8730432` |
| `ielts_listening` | `ad38c5ab-363d-4f15-be0d-0aefdf45cb04` |
| `ielts_writing` | `ef4c771d-676e-4da8-bde0-96c0a010a6ad` |
| `ielts_speaking` | `eef7e69d-4e77-4e83-b49e-18ea75dce750` |
| `ielts_record` | `cca1d5c6-7a0d-4ac3-ad98-703b8e084027` |

### 6.4 字段映射扩展

在 Notion 配置弹窗的字段映射下拉中，新增 IELTS 专用字段选项组：

```html
<optgroup label="IELTS 专用字段">
  <option value="section">部分 (P1/P2/P3)</option>
  <option value="listeningSection">Section (S1-S4)</option>
  <option value="part">口语 Part (1/2/3)</option>
  <option value="task">写作 Task (1/2)</option>
  <option value="questionType">题型</option>
  <option value="accuracy">正确率 (%)</option>
  <option value="difficulty">难度</option>
  <option value="frequency">频次</option>
  <option value="selfAssessment">自我评估</option>
  <option value="estimatedScore">预估分数</option>
  <option value="source">练习来源</option>
  <option value="weakness">薄弱点</option>
  <option value="tomorrowPlan">明日重点</option>
  <option value="cueCard">提示卡内容</option>
  <option value="titleCn">标题(中)</option>
  <option value="titleEn">标题(英)</option>
  <option value="correctionLink">批改报告链接</option>
  <option value="topicCategory">话题分类</option>
  <option value="subject">科目</option>
</optgroup>
```

---

## 7. 技术实现

### 7.1 数据结构

#### 新增模块配置

```javascript
// CONFIG.modules 中新增 5 个模块
{
  key: "ielts_read",
  name: "📖 阅读题库",
  icon: "book",
  tint: "#d6e4d0",
  color: "#4a6c3f",
  type: "ielts",
  desc: "IELTS Reading · 阅读文章与正确率追踪",
  schema: { /* 见 3.1 */ }
}
```

#### 数据存储

```javascript
// data 对象中新增 5 个数组
data.ielts_read = [];      // 阅读题库
data.ielts_listening = []; // 听力题库
data.ielts_writing = [];   // 写作题库
data.ielts_speaking = [];  // 口语题库
data.ielts_record = [];    // 备考记录
```

#### 条目数据结构

```javascript
{
  id: 1750000001,           // 本地唯一 ID
  _notionId: "page-id",     // Notion 页面 ID（同步后填充）
  
  // 通用字段
  title: "The Origins of Solar Energy",
  status: "✅ 已完成",      // 多状态（不再使用 done boolean）
  date: "2026-08-04",
  note: "易错点：...",
  
  // IELTS 专用字段
  section: "P3",
  accuracy: 75,
  difficulty: 4,
  frequency: "高频",
  
  // 模块特有字段
  // listening: titleCn, section(S1-S4)
  // writing: task, questionType, estimatedScore, titleEn, correctionLink
  // speaking: part, selfAssessment, cueCard, topicCategory
  // record: subject, weakness, tomorrowPlan, source, estimatedScore
}
```

### 7.2 映射函数扩展

#### `mapToWorkbenchItem` 扩展

在现有映射逻辑后追加 IELTS 字段映射：

```javascript
// IELTS 专用字段
if(mapping.sectionField && props[mapping.sectionField])
  result.section = props[mapping.sectionField];

if(mapping.accuracyField && props[mapping.accuracyField] != null)
  result.accuracy = props[mapping.accuracyField];

if(mapping.difficultyField && props[mapping.difficultyField] != null)
  result.difficulty = props[mapping.difficultyField];

if(mapping.frequencyField && props[mapping.frequencyField])
  result.frequency = props[mapping.frequencyField];

if(mapping.selfAssessmentField && props[mapping.selfAssessmentField])
  result.selfAssessment = props[mapping.selfAssessmentField];

if(mapping.estimatedScoreField && props[mapping.estimatedScoreField] != null)
  result.estimatedScore = props[mapping.estimatedScoreField];

if(mapping.sourceField && props[mapping.sourceField])
  result.source = props[mapping.sourceField];

if(mapping.weaknessField && props[mapping.weaknessField])
  result.weakness = props[mapping.weaknessField];

if(mapping.tomorrowPlanField && props[mapping.tomorrowPlanField])
  result.tomorrowPlan = props[mapping.tomorrowPlanField];

if(mapping.cueCardField && props[mapping.cueCardField])
  result.cueCard = props[mapping.cueCardField];

if(mapping.titleCnField && props[mapping.titleCnField])
  result.titleCn = props[mapping.titleCnField];

if(mapping.titleEnField && props[mapping.titleEnField])
  result.titleEn = props[mapping.titleEnField];

if(mapping.correctionLinkField && props[mapping.correctionLinkField])
  result.correctionLink = props[mapping.correctionLinkField];

if(mapping.topicCategoryField && props[mapping.topicCategoryField])
  result.topicCategory = props[mapping.topicCategoryField];

if(mapping.subjectField && props[mapping.subjectField])
  result.subject = props[mapping.subjectField];

if(mapping.taskField && props[mapping.taskField])
  result.task = props[mapping.taskField];

if(mapping.questionTypeField && props[mapping.questionTypeField])
  result.questionType = props[mapping.questionTypeField];
```

#### `mapToNotionProperties` 扩展

```javascript
// IELTS 专用字段推送
if(mapping.sectionField && item.section)
  properties[mapping.sectionField] = { select: { name: item.section } };

if(mapping.accuracyField && item.accuracy != null)
  properties[mapping.accuracyField] = { number: Number(item.accuracy) };

if(mapping.difficultyField && item.difficulty != null) {
  const schema = schema?.[mapping.difficultyField];
  if(schema?.type === 'number')
    properties[mapping.difficultyField] = { number: Number(item.difficulty) };
  else
    properties[mapping.difficultyField] = { rich_text: [{ text: { content: String(item.difficulty) } }] };
}

// ... 其他 IELTS 字段
```

### 7.3 状态处理改造

#### 从布尔值改为多状态

```javascript
// 拉取时（兼容旧数据）
if(mapping.statusField && props[mapping.statusField] !== undefined) {
  const v = props[mapping.statusField];
  if(typeof v === 'boolean')
    result.status = v ? '✅ 已完成' : '☐ 未练习';
  else if(typeof v === 'string')
    result.status = v;  // 直接使用 Notion 的状态值
}

// 推送时
if(mapping.statusField) {
  const v = item.status || '☐ 未练习';
  properties[mapping.statusField] = { select: { name: v } };
}
```

### 7.4 首页汇总函数

```javascript
function ieltsStats(data) {
  const modules = ['ielts_read', 'ielts_listening', 'ielts_writing', 'ielts_speaking'];
  const today = today();
  const startDate = data.__ieltsStartDate || today;
  
  // 计算备考周数
  const days = Math.floor((new Date(today) - new Date(startDate)) / 86400000);
  const weekNum = Math.floor(days / 7) + 1;
  
  // 计算各科目统计
  const subjectStats = modules.map(key => {
    const items = data[key] || [];
    const done = items.filter(x => x.status === '✅ 已完成').length;
    const total = items.length;
    const withAccuracy = items.filter(x => x.accuracy != null && x.accuracy > 0);
    const avgAccuracy = withAccuracy.length
      ? Math.round(withAccuracy.reduce((s, x) => s + x.accuracy, 0) / withAccuracy.length)
      : 0;
    return { key, done, total, avgAccuracy };
  });
  
  // 今日计划
  const todayPlan = modules.flatMap(key =>
    (data[key] || []).filter(x => x.status === '📋 今日任务').map(x => ({ ...x, module: key }))
  );
  
  return { weekNum, subjectStats, todayPlan };
}
```

### 7.5 实现任务清单

| # | 任务 | 文件 | 复杂度 |
|---|------|------|--------|
| 1 | 新增 5 个 IELTS 模块定义 | `index.html`, `workbench-desktop.html` | 低 |
| 2 | 修改 `buildNav` 支持分组显示 | `index.html`, `workbench-desktop.html` | 中 |
| 3 | 扩展 `mapToWorkbenchItem` 支持 IELTS 字段 | `index.html`, `workbench-desktop.html` | 中 |
| 4 | 扩展 `mapToNotionProperties` 支持 IELTS 字段 | `index.html`, `workbench-desktop.html` | 中 |
| 5 | 改造状态处理从布尔到多状态 | `index.html`, `workbench-desktop.html` | 中 |
| 6 | 新增 IELTS 模块 UI 渲染函数 | `index.html`, `workbench-desktop.html` | 高 |
| 7 | 新增首页 IELTS 汇总卡片 | `index.html`, `workbench-desktop.html` | 中 |
| 8 | 扩展 Notion 配置弹窗字段映射选项 | `index.html`, `workbench-desktop.html` | 低 |
| 9 | 添加 IELTS 相关样式 | `index.html`, `workbench-desktop.html` | 中 |
| 10 | 数据迁移与初始化 | `index.html`, `workbench-desktop.html` | 低 |
| 11 | 同步更新 `workbench-desktop.html` | `workbench-desktop.html` | 中 |

---

## 8. Notion 前置条件

### 8.1 Integration 授权

用户需在 **Yannick's workplace** 中完成以下操作：

1. 进入 [Notion Developers](https://www.notion.so/my-integrations) 创建 Integration
2. 在 Yannick's workplace 中，为 Integration 授权访问以下数据库：
   - 📖 阅读题库
   - 🎧 听力题库
   - ✍️ 写作题库
   - 🎤 口语题库
   - 📋 备考记录

### 8.2 工作台配置

用户需在工作台的 Notion 设置中填写：

| 配置项 | 值 |
|--------|-----|
| API Key | 用户的 Integration Token（以 `ntn_` 开头） |
| 代理 URL | `/notion` |
| 数据库 ID 映射 | 对应 5 个 Notion 数据库 ID |

---

## 9. 非目标（Out of Scope）

| 项目 | 说明 |
|------|------|
| 修改现有 7 个模块 | 原有模块完全不变 |
| 离线模式支持 | IELTS 模块依赖 Notion 同步 |
| 数据导入/导出 | 不提供 CSV/Excel 导入 |
| 移动端适配 | 当前仅优化桌面端 |
| 实时协作 | 单人使用，不支持多人协作编辑 |
| 图片/附件同步 | 暂不同步 Notion 页面中的图片和附件 |

---

## 10. 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| Notion API 限流 | 同步失败 | 实现重试队列，指数退避 |
| 网络不稳定 | 同步延迟 | 本地优先，后台同步 |
| 数据冲突 | 覆盖丢失 | 合并模式 + 冲突提示 |
| 用户误删 | 数据丢失 | 定期自动备份到 localStorage |

---

## 附录 A：Notion 数据库 Schema

详见对话历史中的数据库结构分析部分。

## 附录 B：现有工作台模块 Schema

| 模块 | Key | 类型 | 主要字段 |
|------|-----|------|---------|
| 头版选题 | `todo` | todo | title, priority, done, note |
| 日常打卡 | `checkin` | checkin | title, log(date→bool) |
| 阅读专栏 | `read` | progress | title, current, target, unit, note |
| 运动版面 | `sport` | progress | title, current, target, unit, note |
| 财经版 | `money` | finance | title, type, amount, category, date |
| 副刊笔记 | `note` | note | title, content, tags, mood, date |
| 热点追踪 | `hot` | note | title, content, tags |
