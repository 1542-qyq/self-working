# MewHub v4.0 重构方案

## AI 产品经理成长引擎 · 留学进度轻量追踪

> 版本：v4.0 · 2026-08-23
> 定位：从通用效率工具收敛为 PM 成长系统 + 留学监督助手
> 作者：基于 twcz1542.cn 现有定位重新设计

---

## 一、现状诊断

### 1.1 MewHub 现状（self-working）

MewHub 当前是一个通用型 AI Agent 工作台，部署在 `https://1542-qyq.github.io/self-working/`，包含 6 个 Agent：

- PerchCore（调度中枢）
- 选题编辑（待办/任务）
- 生活记者（习惯/打卡）
- 财经编辑（财务分析）
- 书评人（阅读管理）
- 雅思教练（IELTS 备考）

**核心问题**：功能发散，和 PM 成长目标脱节。用户打开工作台，面对 6 个 Agent 不知道哪个该用，每个 Agent 的能力边界模糊。记账、阅读、习惯管理这些功能虽然可用，但对「成为 AI PM」和「留学申请」这两个核心目标没有直接贡献。

### 1.2 个人网站现状（twcz1542.cn）

网站当前定位是 Product Manager（实习）作品集，展示内容：

- GPA 4.0/4.0 专业第一，雅思 6.0
- 三个项目：碳智优（工业 IoT SaaS）、雅思备考 AI 智能体、喵星人商城
- 获奖列表与能力矩阵
- 静态展示，无动态更新机制

**核心问题**：只有结果没有过程。招聘方看到"做过 3 个项目"，但看不到"每天都在练产品思维"；看到"雅思 6.0"，但看不到"从 5.5 考到 6.0 的努力曲线"。网站和 MewHub 之间没有数据流动，是两个孤岛。

### 1.3 根本矛盾

| 维度 | 问题 |
|------|------|
| 工具与目标 | MewHub 做的生活管理和 PM 成长无关 |
| 展示与过程 | 网站只展示结果，看不到日常积累 |
| 系统与系统 | 两个网站零联动，数据不互通 |

**解决思路**：让 MewHub 成为 PM 成长的"发动机"，让网站成为"橱窗"，数据从发动机流向橱窗。

---

## 二、重构定位

### 2.1 双主线重新分工

| 主线 | 新定位 | 投入程度 |
|------|--------|---------|
| 留学申请 | 轻量追踪 + 被动提醒 | 低（交给中介，只监督） |
| AI PM 成长 | 核心能力建设 + 作品集积累 | 高（每天使用） |

### 2.2 MewHub 新定位

**从"通用 AI 工作台"变为"PM 成长引擎 + 留学进度看板"**

每天打开 MewHub，核心动作是：
1. 和 PM Agent 聊一个产品的分析
2. 记录今天练了哪道产品题
3. 扫一眼留学进度（是否需要催中介）

### 2.3 个人网站新定位

**从"静态作品集"变为"动态成长直播"**

访客打开网站，看到的不只是"做过什么"，还有：
- "最近分析了 12 个产品"
- "连续打卡 15 天"
- "雅思从 6.0 到 6.5 的趋势图"

---

## 三、Agent 设计（2 常驻 + 1 预留）

### 3.1 从 6 个 Agent 精简到 2 个

| 原 Agent | 处理方式 | 原因 |
|---------|---------|------|
| PerchCore | 删除 | 2 个 Agent 不需要调度中枢，代码路由即可 |
| 选题编辑 | 合并为申请管家 | 待办功能保留，但聚焦留学追踪 |
| 生活记者 | 删除 | 习惯管理和 PM 目标无关 |
| 财经编辑 | 删除 | 记账不是现阶段重点 |
| 书评人 | 删除 | 阅读管理改为 Notion 直接记录 |
| 雅思教练 | 降级为功能 | 留学线已决定轻量化，不需要独立 Agent |

**精简后**：

### 3.2 PM 主 Agent

**角色定位**：用户每天主要对话对象，负责产品思维训练、案例积累、PRD 练习。

**System Prompt**：

```
你是 MewHub 的 PM 成长教练。你的用户是软件工程背景、
目标成为 AI 产品经理的大三学生。

你的职责：
1. 产品分析：用户发一个产品/功能，你用「用户-场景-需求-方案-指标」框架引导分析
2. PRD 练习：用户描述一个需求，你帮他梳理逻辑、补全流程、指出遗漏
3. 案例积累：对话结束后，自动提炼成 STAR 结构的产品案例
4. 竞品分析：给定两个产品，引导对比维度

你说话直接、有洞察力，不给废话。每次回复控制在 300 字以内，
除非用户要求详细展开。

当用户说"记录为案例"时，你输出 STAR 结构的摘要：
- Situation（背景）
- Task（任务）
- Action（行动/分析过程）
- Result（结论/洞察）
```

**核心能力**：
- 意图识别：自动判断用户是在做产品分析、写 PRD、还是竞品对比
- 框架引导：不直接给答案，而是用结构化框架引导用户自己思考
- 案例提炼：对话结束后可一键生成 STAR 结构案例存入数据库
- Notion 归档：支持将分析结果归档到 Notion 指定页面

### 3.3 申请管家 Agent

**角色定位**：留学进度追踪器，只负责记录和提醒，不给策略建议。

**System Prompt**：

```
你是留学申请进度管家。用户已委托中介办理，你只负责追踪和提醒。

你的职责：
1. 用户告诉你中介的最新进展，你更新申请时间线状态
2. 关键节点（选校方案/文书/网申/面试/签证）到期前提醒
3. 材料清单跟踪：用户提交一项，你打勾一项
4. 雅思分数记录：用户输入分数，你更新趋势图

你不给申请策略建议、不修改文书、不做备考计划。
这些由中介和专业机构负责。

你的语气简洁、事务性，像一个好的执行助理。
```

**核心能力**：
- 节点追踪：维护申请时间线（选校 -> 文书 -> 网申 -> 面试 -> 签证）
- 被动提醒：用户设置截止日期，到点前通知
- 材料清单：简单的打勾列表
- 雅思记录：接收分数输入，返回趋势反馈

### 3.4 面试陪练（预留位）

**触发条件**：拿到面试邀请后手动开启。

**预设 Prompt**：

```
你是 PM 面试陪练。针对用户目标学校的面试或实习面试，
进行模拟问答、答题框架训练、压力测试。

你掌握常见 PM 面试题型：
- 产品题（如何设计 XX 功能给 XX 人群）
- 数据分析题（某个指标跌了怎么排查）
- 行为题（讲一个你解决冲突的经历）
- 行业题（怎么看 AI 对 XX 行业的影响）

每次模拟后给出评分和改进建议。
```

---

## 四、功能模块设计

### 4.1 前端界面：3 Tab 结构

```
+--------------------------------------------------+
|  [PM 对话]  |  [申请追踪]  |  [我的积累]          |
+--------------------------------------------------+
|                                                  |
|              当前 Tab 内容区域                     |
|                                                  |
+--------------------------------------------------+
```

#### Tab 1: PM 对话

**布局**：
- 顶部：Agent 切换器（PM 主 Agent / 申请管家）
- 中部：聊天记录区域（类似 ChatGPT 气泡对话）
- 底部：输入框 + 快捷按钮

**快捷按钮**（根据输入内容动态出现）：
- "分析这个产品" — 当用户粘贴产品链接或描述时
- "帮我写 PRD" — 当用户描述需求时
- "竞品对比" — 当用户提到两个产品时
- "记录为案例" — 对话结束后
- "归档到 Notion" — 将当前对话摘要保存到 Notion

**每条 AI 回复下方操作栏**：
- 复制 / 重新生成 / 生成待办 / 归档到 Notion

#### Tab 2: 申请追踪（极简）

**布局**：
- 顶部：当前申请学校/专业概览卡片
- 中部：时间线（5 个节点）
- 下方：雅思分数趋势图
- 底部：材料清单（打勾列表）

**时间线节点**：

| 节点 | 状态选项 | 用户可编辑 |
|------|---------|-----------|
| 选校方案 | 未开始 / 进行中 / 已确认 | 截止日期 + 备注 |
| 文书材料 | 未开始 / 撰写中 / 已提交 | 截止日期 + 备注 |
| 网申提交 | 未开始 / 已提交 / 已付费 | 截止日期 + 备注 |
| 面试 | 未开始 / 已邀约 / 已完成 | 日期 + 备注 |
| 签证 | 未开始 / 材料准备中 / 已递交 | 截止日期 + 备注 |

**操作方式**：
- 用户点击节点 -> 弹出编辑框 -> 更新状态/日期/备注
- 或直接在底部输入框告诉管家："中介说下周出选校方案" -> 管家自动更新

**雅思分数区域**：
- 折线图展示历次模考/实考分数（听力/阅读/写作/口语四科 + 总分）
- "添加分数"按钮：输入考试日期、四科分数，自动更新图表

**材料清单**：
- PS / CV / RL / 成绩单 / 在读证明 / 推荐信 / 作品集 / 其他
- 每项：未提交 / 已提交 / 不适用

#### Tab 3: 我的积累

**布局**：
- 顶部：累计数据卡片（3 个数字）
- 中部：产品案例列表
- 下方：打卡日历热力图
- 底部：Notion 文章列表

**累计数据卡片**：

| 指标 | 数据来源 |
|------|---------|
| 已分析 X 个产品 | product_cases 表 count |
| 连续打卡 X 天 | checkins 表连续日期计算 |
| PRD 累计 X 字 | product_cases 表中 prd_content 字段总字数 |

**产品案例列表**：
- 每条案例：产品名 + 一句话洞察 + 分析日期
- 点击展开：完整 STAR 结构内容
- 标签：产品分析 / PRD 练习 / 竞品对比

**打卡日历热力图**：
- 类似 GitHub Contributions 图
- 每天一个格子，颜色深浅表示当天活跃度
- 活跃度定义：和 PM Agent 对话、记录案例、添加待办都算

**Notion 文章列表**：
- 自动拉取 Notion 中带 #mewhub 标签的页面
- 显示标题 + 最后编辑时间 + 摘要前 100 字

### 4.2 后台管理功能

| 功能 | 说明 |
|------|------|
| 用户设置 | 修改昵称、目标学校、目标专业、Notion Token |
| Agent 配置 | 修改 System Prompt（高级用户） |
| 数据导出 | 导出所有案例为 Markdown / JSON |
| 归档管理 | 查看已归档到 R2 的历史聊天记录 |

---

## 五、数据模型

### 5.1 数据库选型

- **主数据库**：Supabase PostgreSQL（Free Tier，500MB）
- **文档存储**：Notion（已有，免费）
- **归档存储**：Cloudflare R2（10GB 免费额度）
- **缓存/会话**：Cloudflare Workers KV

### 5.2 核心表结构（12 张表）

#### users — 用户基础信息

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  nickname TEXT DEFAULT '匿名用户',
  avatar_url TEXT,
  target_school TEXT,           -- 目标学校
  target_major TEXT,            -- 目标专业
  notion_token TEXT,            -- Notion integration token
  notion_database_id TEXT,      -- Notion 数据库 ID
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### hermes_sessions — Agent 会话管理

```sql
CREATE TABLE hermes_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('pm_coach', 'application_butler', 'interview_trainer')),
  session_name TEXT DEFAULT '新会话',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### messages — 聊天记录

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES hermes_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',   -- 用于存储快捷操作结果、归档状态等
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 索引：加速会话历史查询
CREATE INDEX idx_messages_session_created ON messages(session_id, created_at);
```

#### todos — 待办事项

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'pm' CHECK (category IN ('pm', 'application', 'general')),
  priority TEXT DEFAULT 'p1' CHECK (priority IN ('p0', 'p1', 'p2')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_todos_user_status ON todos(user_id, status);
CREATE INDEX idx_todos_due_date ON todos(due_date);
```

#### checkins — 打卡记录

```sql
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  checkin_type TEXT NOT NULL CHECK (checkin_type IN ('pm_case', 'daily_reflection', 'ielts_study')),
  content TEXT,                  -- 打卡内容（如"分析了小红书推荐算法"）
  metadata JSONB DEFAULT '{}',   -- 额外数据（如分数、时长）
  checkin_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, checkin_type, checkin_date)
);
```

#### product_cases — 产品案例库

```sql
CREATE TABLE product_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  case_type TEXT DEFAULT 'analysis' CHECK (case_type IN ('analysis', 'prd', 'competitor')),
  star_structure JSONB NOT NULL, -- {situation, task, action, result}
  prd_content TEXT,              -- PRD 全文（如有）
  insights TEXT,                 -- 一句话洞察
  tags TEXT[],                   -- 标签数组
  notion_page_id TEXT,           -- 关联 Notion 页面
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_product_cases_user ON product_cases(user_id);
CREATE INDEX idx_product_cases_tags ON product_cases USING GIN(tags);
```

#### applications — 申请时间线

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  major_name TEXT,
  program_type TEXT DEFAULT 'master', -- master / phd / etc.
  status TEXT DEFAULT 'preparing' CHECK (status IN ('preparing', 'submitted', 'interview', 'offer', 'rejected', 'withdrawn')),
  deadline DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### application_materials — 材料清单

```sql
CREATE TABLE application_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  material_type TEXT NOT NULL CHECK (material_type IN ('ps', 'cv', 'rl', 'transcript', 'certificate', 'portfolio', 'recommendation', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'waived')),
  submitted_at TIMESTAMPTZ,
  notes TEXT
);
```

#### ielts_scores — 雅思分数记录

```sql
CREATE TABLE ielts_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  test_type TEXT DEFAULT 'academic' CHECK (test_type IN ('academic', 'general')),
  listening NUMERIC(2,1) CHECK (listening >= 0 AND listening <= 9),
  reading NUMERIC(2,1) CHECK (reading >= 0 AND reading <= 9),
  writing NUMERIC(2,1) CHECK (writing >= 0 AND writing <= 9),
  speaking NUMERIC(2,1) CHECK (speaking >= 0 AND speaking <= 9),
  overall NUMERIC(2,1) GENERATED ALWAYS AS (
    (listening + reading + writing + speaking) / 4
  ) STORED,
  is_mock BOOLEAN DEFAULT false, -- 是否模考
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### notion_page_mappings — Notion 页面引用

```sql
CREATE TABLE notion_page_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notion_page_id TEXT NOT NULL,
  title TEXT,
  url TEXT,
  tags TEXT[],
  summary TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, notion_page_id)
);
```

#### website_sync_logs — 网站数据同步日志

```sql
CREATE TABLE website_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('stats', 'timeline', 'cases')),
  data_payload JSONB NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT now()
);
```

#### archive_logs — 归档元数据

```sql
CREATE TABLE archive_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  archive_type TEXT NOT NULL CHECK (archive_type IN ('chat_messages', 'audit_logs')),
  archive_key TEXT NOT NULL,     -- R2 文件路径
  record_count INTEGER,
  date_from TIMESTAMPTZ,
  date_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 5.3 数据量预估

| 数据类型 | 年增量 | 存储位置 |
|---------|--------|---------|
| 结构化数据（待办、打卡、案例等） | ~10MB | Supabase |
| 聊天记录（热） | ~5MB | Supabase（30 天内） |
| 聊天记录（冷） | ~50MB | R2 归档 |
| 图片附件 | ~50MB | R2 |
| 文书/分析全文 | ~0MB | Notion（只存引用） |

**结论**：500MB 数据库可用数年，核心策略是把 Supabase 当"索引"用，大内容外迁。

---

## 六、技术架构

### 6.1 六层架构

```
┌──────────────────────────────────────────────┐
│  展示层：twcz1542.cn（个人网站）              │
│  动态成长数据展示 · 项目卡片 · 经历时间线      │
├──────────────────────────────────────────────┤
│  交互层：GitHub Pages（MewHub 前端）          │
│  React/Vue 静态站点 · 3 Tab 界面              │
├──────────────────────────────────────────────┤
│  API 层：Cloudflare Workers                  │
│  请求路由 · 认证 · 聚合 · 公开 API            │
├──────────────────────────────────────────────┤
│  AI 层：端脑云 Hermes                        │
│  PM 主 Agent · 申请管家 · Function Calling    │
├──────────────────────────────────────────────┤
│  数据层：Supabase + Notion + R2              │
│  结构化数据 · 文档库 · 归档存储               │
├──────────────────────────────────────────────┤
│  集成层：Notion API                          │
│  文档同步 · 知识检索 · 双向引用               │
└──────────────────────────────────────────────┘
```

### 6.2 组件说明

| 组件 | 角色 | 选型理由 |
|------|------|---------|
| GitHub Pages | MewHub 前端托管 | 免费、可靠、自动部署 |
| Cloudflare Workers | API 网关 + 业务逻辑 | 免费额度足够、边缘部署低延迟、内置 KV 和 R2 |
| Supabase | 主数据库 | Free Tier 500MB、内置 Auth、Realtime、RLS |
| 端脑云 Hermes | AI Agent 引擎 | 开源、支持 Function Calling、持久化记忆 |
| Notion | 文档库 | 用户已有、富文本编辑、双向链接 |
| R2 | 冷数据归档 | 10GB 免费、与 Workers 同生态 |

### 6.3 数据流

**用户对话流**：
```
用户 -> MewHub 前端 -> Cloudflare Workers -> 端脑云 Hermes
                                        -> Supabase（历史记录/上下文）
                                        -> Notion（知识检索）
```

**数据归档流**：
```
Supabase（超期消息）-> Cloudflare Workers Cron -> R2 压缩归档
                                               -> Supabase（archive_logs 记录元数据）
```

**网站联动流**：
```
MewHub 数据变更 -> Supabase Trigger -> Cloudflare Workers -> 网站公开 API
                                                      -> twcz1542.cn 实时渲染
```

### 6.4 前端角色壳 vs Hermes 后端边界

端脑云的模型**不单独再起一套 Agent 运行时**——Hermes 本身就是「Agent 大脑」，MewHub 前端只保留「角色壳」。两层职责边界如下：

#### 6.4.1 前端角色壳（只做"门面"，不碰推理）

承担职责：
- **角色皮肤**：PM 主 Agent / 申请管家 / 面试陪练的 Tab、配色、System Prompt 文案入口
- **会话 UI**：`hermes_sessions` 的列表/切换、消息气泡渲染、SSE 流式展示
- **快捷按钮**：根据输入动态出现的"分析产品 / 写 PRD / 记录为案例 / 归档 Notion"
- **本地轻逻辑**：输入框校验、消息本地缓存、断线重连提示

**不做**：意图识别、记忆管理、工具调用决策、模型推理。这些一律下沉到 Hermes。

边界原则：
- 前端永远不知道"用哪个模型、怎么调工具"，它只传 `agent_type`（pm_coach / application_butler / interview_trainer）给后端
- 前端看到的"角色差异"= 不同的 `agent_type` + 不同的默认 System Prompt + 不同的快捷按钮配置，差异全部由后端/Hermes 配置决定，前端只是渲染

#### 6.4.2 Hermes 后端（"大脑"，承载一切 AI 能力）

承担职责：
- **模型推理**：端脑云 GPU 上运行的对话生成
- **角色路由**：根据 `agent_type` 加载对应 System Prompt（即 3.2 / 3.3 / 3.4 的 Prompt）
- **Function Calling**：执行第八章的全部工具（`create_todo` / `create_case` / `update_application_status` / `add_ielts_score` 等）
- **持久化记忆**：会话上下文、用户画像、跨会话案例检索
- **工具副作用落地**：调用 Cloudflare Workers 内部 API 写 Supabase / Notion

边界原则：
- Hermes 不直接暴露给浏览器（无 API Key 在前端），所有调用经 Cloudflare Workers 网关鉴权中转
- Hermes 返回的是「带工具调用指令的统一响应」，由 Workers 翻译成中文业务结果再回前端

#### 6.4.3 一句话边界

> **前端 = 角色皮肤 + 会话 UI；Hermes = 模型 + 角色 Prompt + 工具执行 + 记忆。中间由 Cloudflare Workers 做鉴权、协议翻译、副作用落地。**

#### 6.4.4 部署形态

```
[GitHub Pages 前端]
   角色壳：agent_type + UI + 快捷按钮
        │  HTTPS + 用户 JWT
        ▼
[Cloudflare Workers]  ← 鉴权 / 路由 / 协议翻译 / 写 Supabase·Notion
        │  HTTPS（服务端密钥，不落前端）
        ▼
[端脑云 Hermes]  ← 模型推理 + Function Calling + 记忆
```

端脑云只跑 Hermes 进程（2C4G 足够承载 2 个常驻 Agent + 1 个预留），不再叠加任何自研调度层。

---

## 七、API 设计

### 7.1 内部 API（MewHub 前端调用）

#### 认证

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /api/auth/login | Supabase Auth 登录 |
| POST | /api/auth/logout | 退出登录 |
| GET  | /api/auth/me | 获取当前用户信息 |

#### 对话

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /api/chat | 发送消息给指定 Agent，SSE 流式返回 |
| GET  | /api/sessions | 获取用户的会话列表 |
| GET  | /api/sessions/:id/messages | 获取会话历史消息 |
| POST | /api/sessions | 创建新会话 |
| DELETE | /api/sessions/:id | 删除会话 |

POST /api/chat 请求体：
```json
{
  "session_id": "uuid",
  "agent_type": "pm_coach",
  "message": "帮我分析小红书的推荐算法",
  "context": {
    "product_name": "小红书",
    "analysis_framework": "user-scenario-need-solution-metric"
  }
}
```

#### 7.1.1 /api/chat 与 Hermes 的调用契约

`POST /api/chat` 是前端与 AI 能力之间的**唯一边界**。前端到 Workers 是普通 JSON/SSE，Workers 到 Hermes 是另一套协议（服务端密钥，不落前端）。两段请求体形态不同：

**① 前端 → Cloudflare Workers（公开契约）**

- 路径：`POST /api/chat`
- 鉴权：Bearer `<user_jwt>`
- 请求体：上文的 `{ session_id, agent_type, message, context }`
- 响应：SSE 流式，事件三种：
  - `data: {"type":"delta","content":"..."}` —— 逐字增量文本
  - `data: {"type":"tool_call","tool":"create_case","args":{...}}` —— 工具调用通知（前端可展示"正在记录案例…"）
  - `data: {"type":"done","message_id":"uuid"}` —— 本轮结束
- 前端**禁止**携带任何模型参数、工具定义、Hermes 地址

**② Cloudflare Workers → 端脑云 Hermes（内部契约，服务端密钥）**

Workers 收到上请求后，做三件事再转发给 Hermes：
1. **鉴权**：校验 JWT，从 KV 取 Hermes 服务端 API Key（不回传前端）
2. **角色映射**：用 `agent_type` 查表，注入对应 System Prompt（见 3.2 / 3.3 / 3.4）
3. **工具注入**：按 `agent_type` 挂载对应工具集（见第八章），并把工具执行端点指向 Workers 自己的内部 API（Hermes 回调时调回 Workers，再由 Workers 写 Supabase / Notion）

转发给 Hermes 的请求体（示意）：
```json
{
  "agent_id": "pm_coach",
  "session_id": "uuid",
  "system_prompt": "<PM 主 Agent 的 Prompt，由 Workers 注入>",
  "messages": [
    { "role": "user", "content": "帮我分析小红书的推荐算法" }
  ],
  "tools": [
    { "name": "create_case", "description": "...", "parameters": { "...": "..." } },
    { "name": "create_todo", "description": "...", "parameters": { "...": "..." } }
  ],
  "tool_callback": "https://<worker>/internal/hermes/tool"
}
```

**③ Hermes → Workers 工具回调（副作用落地）**

当 Hermes 决定调工具，它向 `tool_callback` 回 POST，Workers 据此写业务数据：
```
Hermes 决策 create_case
   → POST /internal/hermes/tool  { tool:"create_case", args:{...} }
   → Workers 校验权限 → POST /api/cases（内部）→ Supabase 写入
   → 返回工具结果给 Hermes → Hermes 继续生成 → SSE 推回前端
```

**契约要点**：
- 前端永远不知道用哪个模型、怎么调工具，只知道 `agent_type`
- Hermes 不直接碰 Supabase / Notion，所有副作用经 Workers 落地（统一鉴权 + 审计）
- `agent_type` 是前后端唯一的"角色货币"，新增角色只改 Workers 映射表 + Hermes 配置，前端零改动

#### 产品案例

| 方法 | 端点 | 说明 |
|------|------|------|
| GET  | /api/cases | 获取案例列表（支持分页、标签筛选） |
| GET  | /api/cases/:id | 获取单个案例详情 |
| POST | /api/cases | 创建新案例（从对话中提炼） |
| PUT  | /api/cases/:id | 更新案例 |
| DELETE | /api/cases/:id | 删除案例 |

#### 申请追踪

| 方法 | 端点 | 说明 |
|------|------|------|
| GET  | /api/applications | 获取申请列表 |
| POST | /api/applications | 创建新申请 |
| PUT  | /api/applications/:id | 更新申请状态 |
| GET  | /api/applications/:id/materials | 获取材料清单 |
| PUT  | /api/applications/:id/materials/:mid | 更新材料状态 |

#### 雅思分数

| 方法 | 端点 | 说明 |
|------|------|------|
| GET  | /api/ielts | 获取所有分数记录 |
| POST | /api/ielts | 添加新分数 |
| DELETE | /api/ielts/:id | 删除记录 |

#### 待办

| 方法 | 端点 | 说明 |
|------|------|------|
| GET  | /api/todos | 获取待办列表 |
| POST | /api/todos | 创建待办 |
| PUT  | /api/todos/:id | 更新状态 |
| DELETE | /api/todos/:id | 删除 |

#### Notion

| 方法 | 端点 | 说明 |
|------|------|------|
| GET  | /api/notion/pages | 获取带 #mewhub 标签的页面列表 |
| POST | /api/notion/archive | 将当前对话归档到 Notion |

### 7.2 公开 API（个人网站调用）

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/public/stats | 获取成长统计数据 |
| GET | /api/public/timeline | 获取经历时间线 |
| GET | /api/public/cases | 获取公开案例列表（脱敏） |

GET /api/public/stats 响应：
```json
{
  "product_cases_count": 12,
  "checkin_streak_days": 15,
  "total_prd_words": 8500,
  "ielts_latest_score": 6.5,
  "ielts_trend": [6.0, 6.0, 6.5],
  "last_updated": "2026-08-23T10:00:00Z"
}
```

### 7.3 数据脱敏规则

公开 API 严格过滤隐私信息：

| 类型 | 处理方式 |
|------|---------|
| 产品案例 | 展示产品名、一句话洞察、标签；隐藏完整分析过程 |
| 雅思分数 | 展示分数和趋势；隐藏具体考试日期 |
| 打卡数据 | 展示连续天数和总数；隐藏具体内容 |
| 待办/申请 | 完全不暴露 |
| 聊天记录 | 完全不暴露 |
| Notion 内容 | 只展示标题和摘要 |

---

## 八、Agent Function Calling 工具

### 8.1 PM 主 Agent 可用工具

| 工具名 | 功能 | 触发时机 |
|--------|------|---------|
| `create_todo` | 创建待办事项 | 用户说"帮我记下来" |
| `create_case` | 将对话提炼为产品案例 | 用户说"记录为案例" |
| `search_notion` | 搜索 Notion 相关页面 | 需要引用已有笔记时 |
| `archive_to_notion` | 将分析结果归档到 Notion | 用户说"归档到 Notion" |
| `get_cases` | 查询历史案例 | 用户说"我之前分析过 XX 吗" |

### 8.2 申请管家可用工具

| 工具名 | 功能 | 触发时机 |
|--------|------|---------|
| `update_application_status` | 更新申请节点状态 | 用户告知最新进展 |
| `add_ielts_score` | 记录雅思分数 | 用户输入分数 |
| `create_reminder` | 创建提醒待办 | 用户设置截止日期 |
| `get_materials_checklist` | 查询材料清单 | 用户问"还差什么材料" |

---

## 九、前端设计规范

### 9.1 技术栈

- **框架**：React 18 + Vite（或 Vue 3，用户自选）
- **样式**：Tailwind CSS
- **状态管理**：Zustand（轻量）
- **图表**：Chart.js 或 ECharts
- **HTTP**：原生 fetch + SSE（Server-Sent Events）
- **部署**：GitHub Pages

### 9.2 颜色系统

```css
:root {
  --bg: #0f1115;           /* 主背景 */
  --surface: #181b22;      /* 卡片背景 */
  --surface-2: #222630;    /* 次级背景 */
  --border: #2a2f3a;       /* 边框 */
  --text: #e6e8ec;         /* 主文字 */
  --text-sec: #9aa3b2;     /* 次级文字 */
  --accent: #6366f1;       /* 主强调色（紫） */
  --accent-2: #8b5cf6;     /* 次强调色 */
  --green: #10b981;        /* 成功 */
  --orange: #f59e0b;       /* 警告 */
  --red: #ef4444;          /* 错误 */
}
```

### 9.3 布局规范

- 最大宽度：900px（对话区域）/ 1100px（数据看板）
- 移动端：底部 Tab 导航栏
- 桌面端：顶部 Tab 导航栏
- 圆角：卡片 12px，按钮 8px
- 阴影：卡片使用 subtle shadow（`0 4px 12px rgba(0,0,0,0.3)`）

### 9.4 组件清单

| 组件 | 说明 |
|------|------|
| ChatInterface | 对话界面（消息气泡 + 输入框 + 快捷按钮） |
| AgentSwitcher | Agent 切换器（Tab 形式） |
| ApplicationTimeline | 申请时间线（5 节点可视化） |
| IeltsChart | 雅思分数趋势图 |
| MaterialChecklist | 材料清单（打勾列表） |
| StatsCard | 累计数据卡片（大数字 + 标签） |
| CaseList | 产品案例列表 |
| CalendarHeatmap | 打卡日历热力图 |
| NotionPageList | Notion 文章列表 |

---

## 十、实施计划

### Phase 1：MVP 核心（3-5 天）

**目标**：跑起来，能对话、能追踪、能积累。

| 天数 | 任务 |
|------|------|
| Day 1 | 创建 Supabase 项目，建 12 张核心表，配置 RLS |
| Day 1 | 初始化 Cloudflare Workers 项目，配置路由和中间件 |
| Day 2 | 搭建 React 前端骨架，实现 3 Tab 布局和路由 |
| Day 2 | 实现 PM 对话界面（SSE 流式输出） |
| Day 3 | 配置端脑云 Hermes：创建 PM 主 Agent 和申请管家 |
| Day 3 | 实现待办、案例、申请追踪的基础 CRUD API |
| Day 4 | 实现 Tab 2（申请追踪）和 Tab 3（我的积累）前端 |
| Day 5 | 联调测试，修复 bug，部署到 GitHub Pages |

**Phase 1 验收标准**：
- 打开 MewHub 可以和 PM Agent 对话
- 可以说"帮我分析 XX 产品"并得到结构化回复
- 可以记录雅思分数并看到趋势图
- 可以更新申请节点状态

### Phase 2：能力深化（1 周）

**目标**：让 PM Agent 真正有用，让数据开始积累。

| 任务 | 说明 |
|------|------|
| 优化 PM Agent Prompt | 根据实际对话效果调优，增加更多产品分析框架 |
| 案例自动提炼 | 对话结束后一键生成 STAR 结构案例 |
| 打卡系统 | 每日自动提醒"今天分析产品了吗" |
| 统计面板 | Tab 3 的累计数据自动计算和展示 |
| 对话历史搜索 | 支持按关键词搜索历史聊天记录 |

### Phase 3：网站联动（3-4 天）

**目标**：让个人网站动起来。

| 任务 | 说明 |
|------|------|
| 公开 API | 实现 `/api/public/stats` 等聚合接口 |
| 网站改版 | 在 twcz1542.cn 增加动态数据区域 |
| 数据同步 | MewHub 数据变更自动同步到网站 |
| Notion 集成 | 实现单向同步（Notion -> MewHub） |

### Phase 4：持续优化（长期）

| 任务 | 触发条件 |
|------|---------|
| 启用面试陪练 Agent | 拿到面试邀请后 |
| R2 归档策略 | 聊天记录超过 30 天或数据库接近 400MB |
| 双向 Notion 同步 | 需要 Agent 写内容回 Notion 时 |
| 移动端 App | 使用频率高、需要推送通知时 |

---

## 十一、成本估算

| 资源 | 规格 | 月费 |
|------|------|------|
| 端脑云 Hermes | 2C4G（2 个 Agent 足够） | 约 ¥80-120 |
| Cloudflare Workers | 个人使用量 | 免费额度足够 |
| Cloudflare R2 | 10GB 以内 | 免费 |
| Supabase | Free Tier | $0 |
| GitHub Pages | 静态站点 | 免费 |
| Notion | 个人 Free Plan | 免费 |
| 个人域名 | 已持有 | 已有 |

**月总成本：¥80-120（仅端脑云）**，其余全部免费。

---

## 十二、风险与应对

| 风险 | 影响 | 应对 |
|------|------|------|
| 端脑云费用超预期 | 预算超支 | 先用 2C4G 低配，不够再升级；或切到本地部署 + 免费模型 |
| Supabase 500MB 满了 | 无法写入 | 启用 R2 归档策略，自动迁移超期聊天记录 |
| Agent 回复质量不稳定 | 用户体验差 | 持续调优 Prompt，增加 few-shot 示例；必要时降级到规则回复 |
| Notion API 限流 | 同步失败 | 增加重试机制和本地缓存 |
| 个人网站改版复杂 | 时间超支 | 先加动态数据区域，整体视觉改版放到 Phase 4 |

---

## 十三、成功指标

### 短期（1 个月）

| 指标 | 目标 |
|------|------|
| 产品案例分析数 | >= 10 个 |
| PM Agent 对话次数 | >= 30 次 |
| 连续打卡天数 | >= 7 天 |
| 申请节点无遗漏 | 所有节点状态及时更新 |

### 中期（3 个月）

| 指标 | 目标 |
|------|------|
| 产品案例库 | >= 30 个案例，覆盖不同类型产品 |
| PRD 累计字数 | >= 15000 字 |
| 网站动态数据 | 访问者能看到实时更新的成长数据 |
| 作品集素材 | 碳智优 + 雅思 AI + 喵星人 + MewHub 本身 = 4 个完整项目 |

### 长期（6 个月）

| 指标 | 目标 |
|------|------|
| MewHub 作为作品集项目 | 在网站和面试中展示"我自己做了一个 AI 工作台" |
| 产品思维能力 | 能独立完成从需求分析到 PRD 的全流程 |
| 留学申请 | 拿到目标学校 offer |

---

## 十四、附录

### 14.1 与 v3.1 方案的差异

| 维度 | v3.1 | v4.0 |
|------|------|------|
| Agent 数量 | 8 个 | 2 个常驻 + 1 预留 |
| 数据库表 | 26 张 | 12 张 |
| 前端界面 | 多面板复杂布局 | 3 Tab 极简 |
| 留学线 | 深度功能（备考、文书、面试） | 极简追踪（只记录和提醒） |
| 记账/阅读/习惯 | 独立模块 | 删除 |
| 网站联动 | 双向引流 | 单向数据展示 |
| 开发周期 | 2-3 周 | 3-5 天 MVP |

### 14.2 文件清单

| 文件 | 路径 |
|------|------|
| 本方案文档 | `/workspace/mewhub-v4-plan.md` |
| 旧版方案（HTML） | `/workspace/mewhub-hermes-integration-plan.html` |

---

*方案版本 v4.0 · 2026-08-23 · 双主线重定位 · 2 Agent 架构 · 12 表核心数据模型 · 3 Tab 前端 · 动态作品集*
