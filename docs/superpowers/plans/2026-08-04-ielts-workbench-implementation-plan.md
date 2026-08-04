# IELTS 备考模块实现计划

> **关联 Spec**: [2026-08-04-ielts-workbench-design.md](file:///workspace/docs/superpowers/specs/2026-08-04-ielts-workbench-design.md)
> **创建日期**: 2026-08-04

---

## 任务概览

| # | 任务 | 涉及文件 | 复杂度 | 依赖 |
|---|------|---------|--------|------|
| T1 | 新增 5 个 IELTS 模块定义 | index.html, workbench-desktop.html | 低 | — |
| T2 | 修改 `buildNav` 支持分组显示 | index.html, workbench-desktop.html | 中 | T1 |
| T3 | 扩展 `mapToWorkbenchItem` 支持 IELTS 字段 | index.html, workbench-desktop.html | 中 | T1 |
| T4 | 扩展 `mapToNotionProperties` 支持 IELTS 字段 | index.html, workbench-desktop.html | 中 | T3 |
| T5 | 改造状态处理（布尔→多状态） | index.html, workbench-desktop.html | 中 | T3, T4 |
| T6 | 新增 IELTS 模块 UI 渲染函数 | index.html, workbench-desktop.html | 高 | T1, T5 |
| T7 | 新增首页 IELTS 汇总卡片 | index.html, workbench-desktop.html | 中 | T6 |
| T8 | 扩展 Notion 配置弹窗字段映射选项 | index.html, workbench-desktop.html | 低 | T3, T4 |
| T9 | 添加 IELTS 相关样式 | index.html, workbench-desktop.html | 中 | T6 |
| T10 | 数据迁移与初始化 | index.html, workbench-desktop.html | 低 | T1 |
| T11 | 最终同步 workbench-desktop.html | workbench-desktop.html | 中 | T1-T10 |

---

## T1：新增 5 个 IELTS 模块定义

### 位置
- `index.html` 第 712 行 `CONFIG.modules` 数组
- `workbench-desktop.html` 相同位置

### 操作
在现有 7 个模块之后，新增 5 个 IELTS 模块定义：

```javascript
{ key:"ielts_read", name:"📖 阅读题库", icon:"book", tint:"#d6e4d0", color:"#4a6c3f", type:"ielts", desc:"IELTS Reading · 阅读文章与正确率追踪",
  fields:[
    {key:"section", label:"部分", type:"select", options:["P1","P2","P3"]},
    {key:"accuracy", label:"正确率(%)", type:"number"},
    {key:"difficulty", label:"难度", type:"number"},
    {key:"frequency", label:"频次", type:"select", options:["高频","中频","低频"]}
  ],
  seed:[] },
{ key:"ielts_listening", name:"🎧 听力题库", icon:"headphones", tint:"#e6dcd0", color:"#8b7355", type:"ielts", desc:"IELTS Listening · Section 与正确率",
  fields:[
    {key:"titleCn", label:"标题(中)", type:"text"},
    {key:"section", label:"Section", type:"select", options:["S1","S2","S3","S4"]},
    {key:"accuracy", label:"正确率(%)", type:"number"},
    {key:"difficulty", label:"难度", type:"text"}
  ],
  seed:[] },
{ key:"ielts_writing", name:"✍️ 写作题库", icon:"pen", tint:"#d0dde5", color:"#3d5a6c", type:"ielts", desc:"IELTS Writing · Task 1/2 练习",
  fields:[
    {key:"titleEn", label:"题目英文", type:"textarea"},
    {key:"task", label:"Task", type:"select", options:["Task 1","Task 2"]},
    {key:"questionType", label:"题型", type:"text"},
    {key:"estimatedScore", label:"预估分数", type:"number"},
    {key:"correctionLink", label:"批改报告链接", type:"text"}
  ],
  seed:[] },
{ key:"ielts_speaking", name:"🎤 口语题库", icon:"mic", tint:"#f0ddd0", color:"#a0522d", type:"ielts", desc:"IELTS Speaking · Part 1/2/3",
  fields:[
    {key:"part", label:"Part", type:"select", options:["Part 1","Part 2","Part 3"]},
    {key:"selfAssessment", label:"自我评估", type:"select", options:["流利","一般","需加强"]},
    {key:"cueCard", label:"提示卡内容", type:"textarea"},
    {key:"topicCategory", label:"话题分类", type:"text"}
  ],
  seed:[] },
{ key:"ielts_record", name:"📋 备考记录", icon:"file-text", tint:"#ece0c8", color:"#9c7a3c", type:"ielts", desc:"IELTS 备考 · 错题与薄弱点记录",
  fields:[
    {key:"subject", label:"科目", type:"select", options:["听力","阅读","写作","口语"]},
    {key:"accuracy", label:"正确率(%)", type:"number"},
    {key:"estimatedScore", label:"评估分数", type:"number"},
    {key:"weakness", label:"薄弱点", type:"textarea"},
    {key:"tomorrowPlan", label:"明日重点", type:"textarea"},
    {key:"source", label:"练习来源", type:"text"},
    {key:"correctionLink", label:"批改报告链接", type:"text"}
  ],
  seed:[] }
```

同时在 `CONFIG.overview` 中新增 IELTS 概览条目：

```javascript
{ key:"ielts_read", label:"雅思阅读", icon:"book", color:"#4a6c3f",
  calc: d => { const it=d.ielts_read||[]; const done=it.filter(x=>x.status==='✅ 已完成').length;
    const withAcc=it.filter(x=>x.accuracy!=null && x.accuracy>0);
    const acc=withAcc.length?Math.round(withAcc.reduce((s,x)=>s+x.accuracy,0)/withAcc.length):0;
    return { value: acc, sub:`${done}/${it.length} 完成` }; } },
{ key:"ielts_listening", label:"雅思听力", icon:"headphones", color:"#8b7355",
  calc: d => { const it=d.ielts_listening||[]; const done=it.filter(x=>x.status==='✅ 已完成').length;
    const withAcc=it.filter(x=>x.accuracy!=null && x.accuracy>0);
    const acc=withAcc.length?Math.round(withAcc.reduce((s,x)=>s+x.accuracy,0)/withAcc.length):0;
    return { value: acc, sub:`${done}/${it.length} 完成` }; } },
```

---

## T2：修改 `buildNav` 支持分组显示

### 位置
- `index.html` 第 1415 行 `buildNav()` 函数

### 修改内容
在构建导航 HTML 时，将 `CONFIG.modules` 分为「猫生日常」和「IELTS 备考」两个分组：

```javascript
function buildNav(){
  $("#brandName").textContent=CONFIG.owner;
  $("#brandSlogan").textContent=CONFIG.slogan;
  
  const normalModules = CONFIG.modules.filter(m => m.type !== 'ielts');
  const ieltsModules = CONFIG.modules.filter(m => m.type === 'ielts');
  
  const html = [
    `<div class="navi" data-go="home">${icon("home",19)}首页</div>`,
    `<div class="nav-sep">猫生日常</div>`
  ]
  .concat(normalModules.map(m=>`<div class="navi" data-go="${m.key}">${icon(m.icon,19)}${m.name}</div>`))
  .concat([`<div class="nav-sep">IELTS 备考</div>`])
  .concat(ieltsModules.map(m=>`<div class="navi" data-go="${m.key}">${icon(m.icon,19)}${m.name}</div>`))
  .concat([`<div class="nav-sep">统计</div>`,
    `<div class="navi" data-go="insight">${icon("chart",19)}洞察复盘</div>`])
  .concat([`<div class="nav-sep">其他</div>`,
    `<div class="navi" id="navi-settings" title="云同步 / 数据管理">${icon("gear",19)} 设置</div>`]);
  
  $("#nav").innerHTML=html.join("");
  $("#nav").querySelectorAll("[data-go]").forEach(el=>el.onclick=()=>go(el.dataset.go));
  const naviSet = document.getElementById('navi-settings');
  if(naviSet) naviSet.onclick = () => CloudSync.openConfig();
  renderNavActive();
}
```

---

## T3：扩展 `mapToWorkbenchItem` 支持 IELTS 字段

### 位置
- `index.html` 第 1941 行 `mapToWorkbenchItem()` 函数

### 修改内容
在现有映射逻辑后追加 IELTS 字段映射。在 `return result;` 之前添加：

```javascript
  // IELTS 专用字段
  if(mapping.sectionField && props[mapping.sectionField])
    result.section = props[mapping.sectionField];
  if(mapping.listeningSectionField && props[mapping.listeningSectionField])
    result.section = props[mapping.listeningSectionField];
  if(mapping.accuracyField && props[mapping.accuracyField] != null)
    result.accuracy = Number(props[mapping.accuracyField]);
  if(mapping.difficultyField && props[mapping.difficultyField] != null)
    result.difficulty = props[mapping.difficultyField];
  if(mapping.frequencyField && props[mapping.frequencyField])
    result.frequency = props[mapping.frequencyField];
  if(mapping.partField && props[mapping.partField])
    result.part = props[mapping.partField];
  if(mapping.taskField && props[mapping.taskField])
    result.task = props[mapping.taskField];
  if(mapping.questionTypeField && props[mapping.questionTypeField])
    result.questionType = props[mapping.questionTypeField];
  if(mapping.selfAssessmentField && props[mapping.selfAssessmentField])
    result.selfAssessment = props[mapping.selfAssessmentField];
  if(mapping.estimatedScoreField && props[mapping.estimatedScoreField] != null)
    result.estimatedScore = Number(props[mapping.estimatedScoreField]);
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
```

---

## T4：扩展 `mapToNotionProperties` 支持 IELTS 字段

### 位置
- `index.html` 第 2012 行 `mapToNotionProperties()` 函数

### 修改内容
在现有属性构建逻辑后追加 IELTS 字段的输出。在 `return properties;` 之前添加：

```javascript
  // IELTS 专用字段推送
  if(mapping.sectionField && item.section)
    properties[mapping.sectionField] = { select: { name: item.section } };
  if(mapping.listeningSectionField && item.section)
    properties[mapping.listeningSectionField] = { select: { name: item.section } };
  if(mapping.accuracyField && item.accuracy != null)
    properties[mapping.accuracyField] = { number: Number(item.accuracy) };
  if(mapping.difficultyField && item.difficulty != null) {
    const propSchema = schema?.[mapping.difficultyField];
    if(propSchema?.type === 'number')
      properties[mapping.difficultyField] = { number: Number(item.difficulty) };
    else
      properties[mapping.difficultyField] = { rich_text: [{ text: { content: String(item.difficulty) } }] };
  }
  if(mapping.frequencyField && item.frequency)
    properties[mapping.frequencyField] = { select: { name: item.frequency } };
  if(mapping.partField && item.part)
    properties[mapping.partField] = { select: { name: item.part } };
  if(mapping.taskField && item.task)
    properties[mapping.taskField] = { select: { name: item.task } };
  if(mapping.questionTypeField && item.questionType)
    properties[mapping.questionTypeField] = { rich_text: [{ text: { content: item.questionType } }] };
  if(mapping.selfAssessmentField && item.selfAssessment)
    properties[mapping.selfAssessmentField] = { select: { name: item.selfAssessment } };
  if(mapping.estimatedScoreField && item.estimatedScore != null)
    properties[mapping.estimatedScoreField] = { number: Number(item.estimatedScore) };
  if(mapping.sourceField && item.source)
    properties[mapping.sourceField] = { rich_text: [{ text: { content: item.source } }] };
  if(mapping.weaknessField && item.weakness)
    properties[mapping.weaknessField] = { rich_text: [{ text: { content: item.weakness } }] };
  if(mapping.tomorrowPlanField && item.tomorrowPlan)
    properties[mapping.tomorrowPlanField] = { rich_text: [{ text: { content: item.tomorrowPlan } }] };
  if(mapping.cueCardField && item.cueCard)
    properties[mapping.cueCardField] = { rich_text: [{ text: { content: item.cueCard } }] };
  if(mapping.titleCnField && item.titleCn)
    properties[mapping.titleCnField] = { rich_text: [{ text: { content: item.titleCn } }] };
  if(mapping.titleEnField && item.titleEn)
    properties[mapping.titleEnField] = { rich_text: [{ text: { content: item.titleEn } }] };
  if(mapping.correctionLinkField && item.correctionLink)
    properties[mapping.correctionLinkField] = { url: item.correctionLink };
  if(mapping.topicCategoryField && item.topicCategory)
    properties[mapping.topicCategoryField] = { rich_text: [{ text: { content: item.topicCategory } }] };
  if(mapping.subjectField && item.subject)
    properties[mapping.subjectField] = { select: { name: item.subject } };
```

---

## T5：改造状态处理（布尔→多状态）

### 位置
- `index.html` 第 1964-1969 行（`mapToWorkbenchItem` 中的状态处理）
- `index.html` 第 2031-2040 行（`mapToNotionProperties` 中的状态处理）
- `index.html` 第 1267 行（`recHTML` 中的 todo 状态渲染）
- `index.html` 第 1302-1306 行（`wireModule` 中的状态切换）
- `index.html` 第 1387 行（`newItem` 中的初始化）

### 修改内容

#### 5.1 `mapToWorkbenchItem` — 状态兼容
将现有状态处理改为支持多状态：

```javascript
  // 状态（多状态支持）
  if(mapping.statusField && props[mapping.statusField] !== undefined){
    const v = props[mapping.statusField];
    if(typeof v === 'boolean'){
      result.status = v ? '✅ 已完成' : '☐ 未练习';
      result.done = v;  // 保留 done 以兼容旧代码
    } else if(typeof v === 'string'){
      // 已有明确状态值，直接使用
      result.status = v;
      result.done = ['done','completed','已完成','✅ 已完成'].includes(v.toLowerCase());
    }
  }
```

#### 5.2 `mapToNotionProperties` — 状态推送
增加对多状态的支持：

```javascript
  if(mapping.statusField){
    const propSchema = schema?.[mapping.statusField];
    const statusVal = item.status || (item.done ? '✅ 已完成' : '☐ 未练习');
    if(propSchema?.type === 'checkbox'){
      properties[mapping.statusField] = { checkbox: item.done || (statusVal === '✅ 已完成') };
    } else if(propSchema?.type === 'status'){
      properties[mapping.statusField] = { status: { name: statusVal } };
    } else if(propSchema?.type === 'select'){
      properties[mapping.statusField] = { select: { name: statusVal } };
    }
  }
```

#### 5.3 `recHTML` — IELTS 模块卡片渲染
在 `recHTML` 函数中新增 IELTS 类型卡片渲染分支（在 progress 分支之后、finance 分支之前插入）：

```javascript
  // ielts 类型卡片
  if(m.type === "ielts"){
    const isDone = x.status === '✅ 已完成';
    const statusBadge = `<span class="badge" style="background:${m.tint};color:${m.color}">${esc(x.status||'☐ 未练习')}</span>`;
    const accRing = x.accuracy != null ? ringSVG(x.accuracy, m.color, 28) : '';
    
    // IELTS 特有标签
    const tags = [];
    if(x.section) tags.push(x.section);
    if(x.part) tags.push(x.part);
    if(x.task) tags.push(x.task);
    if(x.frequency) tags.push(x.frequency);
    if(x.questionType) tags.push(x.questionType);
    
    return `<div class="rec ielts-rec ${layoutCls}">${acts}<div class="top" style="padding-right:60px">
      <div class="body" data-edit="${x.id}">
        <span class="rname ${isDone?'done':''}">${esc(x.title)}</span>
        ${x.titleCn?`<div class="ielts-sub">${esc(x.titleCn)}</div>`:''}
        ${tags.length?`<div class="meta-line">${tags.map(t=>`<span class="meta-tag">${esc(t)}</span>`).join('')}</div>`:''}
        <div class="ielts-meta">
          ${accRing}
          ${x.difficulty?`<span class="ielts-diff">${'⭐'.repeat(Number(x.difficulty))}</span>`:''}
          ${x.estimatedScore!=null?`<span class="ielts-score">评估: ${x.estimatedScore}</span>`:''}
          ${x.date?`<span class="rdate">${esc(x.date)}</span>`:''}
          ${statusBadge}
        </div>
        ${x.weakness?`<div class="ielts-note ielts-weak">⚠️ ${esc(x.weakness)}</div>`:''}
        ${x.tomorrowPlan?`<div class="ielts-note ielts-plan">📌 ${esc(x.tomorrowPlan)}</div>`:''}
        ${x.note?`<div class="rnote">${esc(x.note)}</div>`:''}
        ${x.correctionLink?`<a class="ielts-link" href="${esc(x.correctionLink)}" target="_blank">📎 批改报告</a>`:''}
      </div></div></div>`;
  }
```

#### 5.4 `wireModule` — IELTS 状态切换
在 `wireModule` 中增加 IELTS 类型的状态切换逻辑：

```javascript
  $("#screen").querySelectorAll(".js-chk").forEach(el=>el.onclick=e=>{
    e.stopPropagation();
    const x=(data[key]).find(i=>i.id==el.dataset.id);
    if(m.type==="todo") x.done=!x.done;
    else if(m.type==="ielts"){
      // 状态循环切换：未练习 → 进行中 → 已完成 → 未练习
      const states = ['☐ 未练习','⏳ 进行中','✅ 已完成','📋 今日任务'];
      const cur = states.indexOf(x.status||'☐ 未练习');
      x.status = states[(cur+1) % states.length];
      x.done = (x.status === '✅ 已完成');
    }
    else if(m.type==="checkin"){ ... }
    persist();
  });
```

#### 5.5 `newItem` — IELTS 初始化
在 `newItem` 函数中增加 IELTS 类型初始化：

```javascript
  else if(m.type==="ielts"){
    item={...base, title:"", status:"☐ 未练习", date:isoToday()};
    // 根据模块类型设置默认值
    if(key==="ielts_read"){ item.section="P1"; item.accuracy=null; item.difficulty=3; item.frequency="中频"; }
    else if(key==="ielts_listening"){ item.section="S1"; item.accuracy=null; item.difficulty="中等"; }
    else if(key==="ielts_writing"){ item.task="Task 2"; item.estimatedScore=null; }
    else if(key==="ielts_speaking"){ item.part="Part 1"; item.selfAssessment="一般"; }
    else if(key==="ielts_record"){ item.subject="听力"; item.accuracy=null; item.estimatedScore=null; }
  }
```

---

## T6：新增 IELTS 模块 UI 渲染函数

### 位置
- `index.html` `renderModule()` 函数（第 1086 行）、`renderModuleResults()` 函数（第 1141 行）、`openEditor()` 函数（第 1313 行）

### 修改内容

#### 6.1 `renderModule` — 新增 IELTS 类型分支
在 `renderModule` 的 head 生成部分添加：

```javascript
  } else if(m.type==="ielts"){
    const allStatus = all.filter(x => x.status === '✅ 已完成').length;
    const todayPlan = all.filter(x => x.status === '📋 今日任务').length;
    const withAcc = all.filter(x => x.accuracy != null && x.accuracy > 0);
    const avgAcc = withAcc.length ? Math.round(withAcc.reduce((s,x)=>s+x.accuracy,0)/withAcc.length) : 0;
    head = `<div class="mod-summary">
      <div class="mini"><div class="l">已完成</div><div class="v" style="color:${m.color}">${allStatus}</div></div>
      <div class="mini"><div class="l">今日计划</div><div class="v">${todayPlan}</div></div>
      <div class="mini"><div class="l">平均正确率</div><div class="v" style="color:var(--accent)">${avgAcc}%</div></div>
      <div class="mini"><div class="l">总条目</div><div class="v">${all.length}</div></div></div>`;
  }
```

#### 6.2 `openEditor` — 新增 IELTS 编辑表单
在 `openEditor` 函数的类型分支中添加 IELTS 表单：

```javascript
  } else if(m.type==="ielts"){
    fields = buildIELTSEditor(m, d);
  }
```

新增 `buildIELTSEditor` 函数：

```javascript
function buildIELTSEditor(m, d){
  let html = `<div class="field"><label>标题/题目</label><input id="f-title" value="${attr(d.title)}" placeholder="文章标题或话题名称"/></div>`;
  
  // 状态选择
  const states = ['☐ 未练习','📋 今日任务','⏳ 进行中','✅ 已完成'];
  html += `<div class="field"><label>练习状态</label><div class="seg" id="f-status">${states.map(s=>`<div class="opt ${s===(d.status||'☐ 未练习')?'on':''}" data-v="${s}">${s}</div>`).join("")}</div></div>`;
  
  // 日期
  html += `<div class="field"><label>练习日期</label><input id="f-date" type="date" value="${d.date||isoToday()}"/></div>`;
  
  // IELTS 专用字段
  if(m.key === 'ielts_read'){
    html += selectField('f-section', '部分', ['P1','P2','P3'], d.section);
    html += numberField('f-accuracy', '正确率(%)', d.accuracy);
    html += numberField('f-difficulty', '难度(1-5)', d.difficulty);
    html += selectField('f-frequency', '频次', ['高频','中频','低频'], d.frequency);
  } else if(m.key === 'ielts_listening'){
    html += textField('f-titleCn', '标题(中)', d.titleCn);
    html += selectField('f-section', 'Section', ['S1','S2','S3','S4'], d.section);
    html += numberField('f-accuracy', '正确率(%)', d.accuracy);
    html += textField('f-difficulty', '难度', d.difficulty);
  } else if(m.key === 'ielts_writing'){
    html += textareaField('f-titleEn', '题目英文', d.titleEn);
    html += selectField('f-task', 'Task', ['Task 1','Task 2'], d.task);
    html += textField('f-questionType', '题型', d.questionType);
    html += numberField('f-estimatedScore', '预估分数(0-9)', d.estimatedScore);
    html += textField('f-correctionLink', '批改报告链接', d.correctionLink);
  } else if(m.key === 'ielts_speaking'){
    html += selectField('f-part', 'Part', ['Part 1','Part 2','Part 3'], d.part);
    html += selectField('f-selfAssessment', '自我评估', ['流利','一般','需加强'], d.selfAssessment);
    html += textareaField('f-cueCard', '提示卡内容', d.cueCard);
    html += textField('f-topicCategory', '话题分类', d.topicCategory);
  } else if(m.key === 'ielts_record'){
    html += selectField('f-subject', '科目', ['听力','阅读','写作','口语'], d.subject);
    html += numberField('f-accuracy', '正确率(%)', d.accuracy);
    html += numberField('f-estimatedScore', '评估分数(0-9)', d.estimatedScore);
    html += textareaField('f-weakness', '薄弱点', d.weakness);
    html += textareaField('f-tomorrowPlan', '明日重点', d.tomorrowPlan);
    html += textField('f-source', '练习来源', d.source);
    html += textField('f-correctionLink', '批改报告链接', d.correctionLink);
  }
  
  // 备注
  html += `<div class="field"><label>备注</label><textarea id="f-note" placeholder="笔记/错题">${esc(d.note||'')}</textarea></div>`;
  
  return html;
}

// 辅助函数
function selectField(id, label, options, val){
  return `<div class="field"><label>${label}</label><div class="seg" id="${id}">${options.map(o=>`<div class="opt ${o===val?'on':''}" data-v="${o}" style="flex:0 0 auto;min-width:auto">${o}</div>`).join("")}</div></div>`;
}
function numberField(id, label, val){
  return `<div class="field"><label>${label}</label><input id="${id}" type="number" value="${val??''}" placeholder="0"/></div>`;
}
function textField(id, label, val){
  return `<div class="field"><label>${label}</label><input id="${id}" value="${attr(val||'')}" placeholder="${attr(label)}"/></div>`;
}
function textareaField(id, label, val){
  return `<div class="field"><label>${label}</label><textarea id="${id}" placeholder="${attr(label)}">${esc(val||'')}</textarea></div>`;
}
```

#### 6.3 `openEditor` — IELTS 保存逻辑
在保存回调中添加 IELTS 处理：

```javascript
    if(m.type==="ielts"){
      d.status = seg("#f-status") || d.status || '☐ 未练习';
      d.date = val("#f-date");
      d.note = (val("#f-note")||"").trim();
      d.done = (d.status === '✅ 已完成');
      
      // 模块特有字段
      if(m.key === 'ielts_read'){
        d.section = seg("#f-section") || '';
        d.accuracy = +val("#f-accuracy") || null;
        d.difficulty = +val("#f-difficulty") || null;
        d.frequency = seg("#f-frequency") || '';
      } else if(m.key === 'ielts_listening'){
        d.titleCn = (val("#f-titleCn")||"").trim();
        d.section = seg("#f-section") || '';
        d.accuracy = +val("#f-accuracy") || null;
        d.difficulty = (val("#f-difficulty")||"").trim();
      } else if(m.key === 'ielts_writing'){
        d.titleEn = (val("#f-titleEn")||"").trim();
        d.task = seg("#f-task") || '';
        d.questionType = (val("#f-questionType")||"").trim();
        d.estimatedScore = +val("#f-estimatedScore") || null;
        d.correctionLink = (val("#f-correctionLink")||"").trim();
      } else if(m.key === 'ielts_speaking'){
        d.part = seg("#f-part") || '';
        d.selfAssessment = seg("#f-selfAssessment") || '';
        d.cueCard = (val("#f-cueCard")||"").trim();
        d.topicCategory = (val("#f-topicCategory")||"").trim();
      } else if(m.key === 'ielts_record'){
        d.subject = seg("#f-subject") || '';
        d.accuracy = +val("#f-accuracy") || null;
        d.estimatedScore = +val("#f-estimatedScore") || null;
        d.weakness = (val("#f-weakness")||"").trim();
        d.tomorrowPlan = (val("#f-tomorrowPlan")||"").trim();
        d.source = (val("#f-source")||"").trim();
        d.correctionLink = (val("#f-correctionLink")||"").trim();
      }
    }
```

#### 6.4 `headHero` — IELTS 头部 hero
在 `headHero` 函数中添加 IELTS 类型支持（复用现有逻辑，无需特殊处理）。

#### 6.5 `sideStats` — IELTS 侧栏统计
在 `sideStats` 函数中添加 IELTS 侧栏：

```javascript
  } else if(m.type === "ielts"){
    const doneCount = all.filter(x => x.status === '✅ 已完成').length;
    const todayPlan = all.filter(x => x.status === '📋 今日任务').length;
    const inProgress = all.filter(x => x.status === '⏳ 进行中').length;
    const withAcc = all.filter(x => x.accuracy != null && x.accuracy > 0);
    const avgAcc = withAcc.length ? Math.round(withAcc.reduce((s,x)=>s+x.accuracy,0)/withAcc.length) : 0;
    
    return `<div class="side-section">
      <div class="side-title">备考概览</div>
      <div class="side-stat"><span class="dot" style="background:${m.color}"></span>已完成 <b>${doneCount}</b></div>
      <div class="side-stat"><span class="dot" style="background:var(--accent)"></span>进行中 <b>${inProgress}</b></div>
      <div class="side-stat"><span class="dot" style="background:var(--module-5)"></span>今日计划 <b>${todayPlan}</b></div>
      <div class="side-stat"><span class="dot" style="background:var(--danger)"></span>平均正确率 <b>${avgAcc}%</b></div>
    </div>`;
  }
```

---

## T7：新增首页 IELTS 汇总卡片

### 位置
- `index.html` `overviewTileHTML()` 函数（第 890 行附近）、`renderHome()` 函数（第 1009 行附近）

### 修改内容

#### 7.1 在 `overviewTileHTML` 中新增 IELTS 卡片样式

```javascript
function ieltsTileHTML(d){
  const modules = ['ielts_read','ielts_listening','ielts_writing','ielts_speaking'];
  const today = today();
  const startDate = d.__ieltsStartDate || today;
  
  // 计算备考周数
  const days = Math.floor((new Date(today) - new Date(startDate)) / 86400000);
  const weekNum = Math.floor(days / 7) + 1;
  
  // 各科目统计
  const stats = modules.map(key => {
    const items = d[key] || [];
    const done = items.filter(x => x.status === '✅ 已完成').length;
    const withAcc = items.filter(x => x.accuracy != null && x.accuracy > 0);
    const acc = withAcc.length ? Math.round(withAcc.reduce((s,x)=>s+x.accuracy,0)/withAcc.length) : 0;
    return { key, done, total: items.length, acc };
  });
  
  // 今日计划
  const todayPlan = modules.flatMap(key =>
    (d[key]||[]).filter(x => x.status === '📋 今日任务').map(x => ({ ...x, module: key }))
  );
  
  // 今日统计
  const todayItems = modules.flatMap(key => (d[key]||[]).filter(x => x.date === today));
  const todayDone = todayItems.filter(x => x.status === '✅ 已完成').length;
  const todayAcc = todayItems.filter(x => x.accuracy != null && x.accuracy > 0);
  const todayAvgAcc = todayAcc.length ? Math.round(todayAcc.reduce((s,x)=>s+x.accuracy,0)/todayAcc.length) : 0;
  
  const moduleIcons = { ielts_read: '📖', ielts_listening: '🎧', ielts_writing: '✍️', ielts_speaking: '🎤' };
  
  const cards = stats.map(s => `
    <div class="ielts-sub">
      <div class="ielts-sub-ic">${moduleIcons[s.key]}</div>
      <div class="ielts-sub-v">${s.acc}%</div>
      <div class="ielts-sub-l">${s.done}/${s.total}</div>
    </div>
  `).join("");
  
  const planHTML = todayPlan.length
    ? todayPlan.map(p => `<div class="ielts-plan-item">${p.status} ${esc(p.title)}</div>`).join("")
    : '<div style="color:var(--text-tertiary);font-size:12px">暂无今日计划</div>';
  
  return `<div class="tile ielts-tile">
    <div class="tile-head">
      <span class="tile-title">📚 雅思备考</span>
      <span class="tile-sub">备考第 ${weekNum} 周 · ${today}</span>
    </div>
    <div class="ielts-stats">${cards}</div>
    <div class="ielts-plan">
      <div class="ielts-plan-title">📋 今日计划 (${todayPlan.length})</div>
      ${planHTML}
    </div>
    <div class="ielts-footer">
      <span>📈 今日正确率：${todayAvgAcc}%</span>
      <span>完成：${todayDone}/${todayItems.length} 项</span>
    </div>
  </div>`;
}
```

#### 7.2 在 `renderHome` 中添加 IELTS 卡片
在现有 overview 区块后添加：

```javascript
  // 在 overview 区块后添加 IELTS 汇总卡片
  const ieltsTile = ieltsTileHTML(data);
  // 将其插入到 overview 卡片之后
  homeHTML = homeHTML.replace(
    /(<div class="overview-grid">[\s\S]*?<\/div>)/,
    '$1' + ieltsTile
  );
```

---

## T8：扩展 Notion 配置弹窗字段映射选项

### 位置
- `index.html` Notion 配置弹窗中的字段映射下拉选项区域

### 修改内容
在 Notion 配置弹窗的字段映射 `<select>` 元素中，新增 IELTS 专用字段选项组：

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

## T9：添加 IELTS 相关样式

### 位置
- `index.html` `<style>` 部分

### 新增 CSS

```css
/* IELTS 模块卡片样式 */
.rec.ielts-rec .ielts-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
  flex-wrap: wrap;
}
.rec.ielts-rec .ielts-sub {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}
.rec.ielts-rec .ielts-diff {
  font-size: 12px;
  letter-spacing: 1px;
}
.rec.ielts-rec .ielts-score {
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--surface-nested);
  padding: 2px 6px;
  border-radius: 4px;
}
.rec.ielts-rec .ielts-note {
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  margin-top: 4px;
  line-height: 1.5;
}
.rec.ielts-rec .ielts-weak {
  background: #fbe9e7;
  color: #c62828;
}
.rec.ielts-rec .ielts-plan {
  background: #e3f2fd;
  color: #1565c0;
}
.rec.ielts-rec .ielts-link {
  display: inline-block;
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;
  margin-top: 4px;
}
.rec.ielts-rec .ielts-link:hover {
  text-decoration: underline;
}

/* IELTS 首页汇总卡片 */
.tile.ielts-tile {
  grid-column: span 2;
  background: var(--surface);
}
.tile.ielts-tile .tile-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.tile.ielts-tile .tile-title {
  font-size: 14px;
  font-weight: 600;
}
.tile.ielts-tile .tile-sub {
  font-size: 11px;
  color: var(--text-tertiary);
}
.ielts-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.ielts-sub {
  text-align: center;
  padding: 10px 4px;
  background: var(--surface-nested);
  border-radius: 8px;
}
.ielts-sub-ic {
  font-size: 18px;
}
.ielts-sub-v {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
}
.ielts-sub-l {
  font-size: 11px;
  color: var(--text-tertiary);
}
.ielts-plan {
  border-top: 1px solid var(--border);
  padding-top: 8px;
  margin-bottom: 8px;
}
.ielts-plan-title {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
}
.ielts-plan-item {
  font-size: 12px;
  padding: 3px 0;
  color: var(--text-secondary);
}
.ielts-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-tertiary);
  border-top: 1px solid var(--border);
  padding-top: 8px;
}
```

---

## T10：数据迁移与初始化

### 位置
- `index.html` 数据存储/初始化部分

### 操作

#### 10.1 初始化 IELTS 数据数组
在数据初始化时（`store.load()` 之后），添加：

```javascript
// 初始化 IELTS 模块数据
['ielts_read','ielts_listening','ielts_writing','ielts_speaking','ielts_record'].forEach(key => {
  if(!Array.isArray(data[key])) data[key] = [];
});
```

#### 10.2 初始化备考起始日期
```javascript
if(!data.__ieltsStartDate) data.__ieltsStartDate = today();
```

#### 10.3 兼容旧数据状态
```javascript
// 迁移旧数据：将 done 布尔值转换为 status
const migrateStatus = (items) => {
  items.forEach(item => {
    if(item.done !== undefined && !item.status){
      item.status = item.done ? '✅ 已完成' : '☐ 未练习';
    }
  });
};
migrateStatus(data.todo || []);
migrateStatus(data.checkin || []);
migrateStatus(data.read || []);
migrateStatus(data.sport || []);
```

---

## T11：最终同步 workbench-desktop.html

### 操作
将 `index.html` 的所有修改同步到 `workbench-desktop.html`，确保两个文件一致。

---

## 实现顺序与注意事项

```
T1 (模块定义) ──→ T2 (导航) ──→ T10 (数据初始化)
                                      │
T3 (映射扩展) ──→ T4 (属性扩展) ──→ T5 (状态改造)
                                      │
T6 (UI渲染) ──→ T7 (首页汇总) ──→ T9 (样式)
                                      │
              T8 (配置弹窗) ──────────┘
                                      │
                          T11 (同步desktop)
```

### 关键注意事项

1. **向后兼容**：所有现有模块的行为不变
2. **`done` 字段保留**：即使引入 `status`，仍保留 `done` 布尔值以兼容
3. **双文件同步**：`index.html` 和 `workbench-desktop.html` 需同时修改
4. **测试**：修改后在浏览器中打开 `http://localhost:8081` 验证
