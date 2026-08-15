/* ============================================================
   common.js — 手机版和桌面版共用代码
   ============================================================ */

/* ============================================================
   工具函数（需要在CONFIG之前定义，因为CONFIG.seed用到了isoToday）
   ============================================================ */
function isoToday(){ return new Date().toISOString().slice(0,10); }
function today(){ return isoToday(); }
function pad2(n){ return String(n).padStart(2,"0"); }
function avgProgress(list){
  if(!list||!list.length) return { value:0, sub:"0" };
  const v = Math.round(list.reduce((s,x)=>s+Math.min(100,(x.current/x.target)*100||0),0)/list.length);
  return { value:v, sub:`${list.length} 项` };
}
function dateStr(){ const n=new Date(); const wd="日一二三四五六"[n.getDay()]; return `${n.getFullYear()}年${n.getMonth()+1}月${n.getDate()}日 周${wd}`; }
function weekDates(){
  const n=new Date(); const dow=(n.getDay()+6)%7; const mon=new Date(n); mon.setDate(n.getDate()-dow);
  const arr=[]; for(let i=0;i<7;i++){ const d=new Date(mon); d.setDate(mon.getDate()+i); arr.push(d.toISOString().slice(0,10)); }
  return arr;
}
function esc(s){ return String(s??"").replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function attr(s){ return esc(s).replace(/"/g,'&quot;'); }
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function uuid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

/* ============================================================
   ICONS — 单色线性图标库（stroke 跟随 color）
   ============================================================ */
const ICONS = {
  home:'<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10.5V19h12v-8.5"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
  chart:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4"/><path d="M12 16v-7"/><path d="M16 16v-2"/>',
  user:'<circle cx="12" cy="8" r="3.4"/><path d="M5.5 19c.7-3.2 3.2-5 6.5-5s5.8 1.8 6.5 5"/>',
  plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',
  menu:'<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
  calendar:'<rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M4 9.5h16"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  list:'<path d="M8.5 6h11"/><path d="M8.5 12h11"/><path d="M8.5 18h11"/><circle cx="4.5" cy="6" r=".9"/><circle cx="4.5" cy="12" r=".9"/><circle cx="4.5" cy="18" r=".9"/>',
  leaf:'<path d="M20 4C10 4 4 9 4 17c0 1 .1 2 .5 3 5.5-9 9-9.5 15.5-16z"/><path d="M4.5 20c3-6 7-9.5 13-11.5"/>',
  book:'<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v14H7.5A2.5 2.5 0 0 0 5 19.5z"/><path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H19v4H7.5A2.5 2.5 0 0 1 5 19.5z"/>',
  activity:'<path d="M3 12h4l2.5 6L14 5l2.5 7H21"/>',
  wallet:'<path d="M4 8a2 2 0 0 1 2-2h11a1.5 1.5 0 0 1 1.5 1.5V8"/><rect x="3.5" y="7.5" width="17" height="11.5" rx="2.5"/><circle cx="16.5" cy="13.2" r="1.3"/>',
  pen:'<path d="M4 20l1.2-4L16 5.2l2.8 2.8L8 19z"/><path d="M14.2 7l2.8 2.8"/>',
  camera:'<path d="M4 8.5h3l1.5-2h7L17 8.5h3v10H4z"/><circle cx="12" cy="13" r="3.2"/>',
  flame:'<path d="M12 3c3 3 5 5.5 5 9a5 5 0 0 1-10 0c0-2 1-3.6 2.6-4.6C9 10.4 10.4 6.2 12 3z"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>',
  star:'<path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.8L12 16.9l-5.2 2.75 1-5.8-4.2-4.1 5.8-.85z"/>',
  quote:'<path d="M9.5 7C7.6 7.9 6.5 9.6 6.5 12v5h5v-6H8.5c0-1.7.7-2.7 2.2-3.4zM19 7c-1.9.9-3 2.6-3 5v5h5v-6h-3c0-1.7.7-2.7 2.2-3.4z"/>',
  chevron:'<path d="M9 5l7 7-7 7"/>',
  check:'<path d="M5 12.5 10 17 19 7"/>',
  trash:'<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
  bolt:'<path d="M13 3 5 13h5l-1 8 8-11h-5z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  headphones:'<path d="M4 14v-2a8 8 0 1 1 16 0v2"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/>',
  mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
  'file-text':'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/>',
  download:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  'message-circle':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  send:'<path d="m22 2-7 20-4-9-9-4 20-7z"/>',
  sparkles:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  refresh:'<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/>',
  'cloud-off':'<path d="m2 2 20 20"/><path d="M5.78 5.78A7 7 0 0 0 9 19h9a5 5 0 0 0 1.78-.22"/><path d="M19 15a5 5 0 0 0-2.83-8.86 7 7 0 0 0-9.17 1.18"/>',
  cloud:'<path d="M17.5 19H9a5 5 0 1 1 .89-9.92A7 7 0 0 1 22 14a5 5 0 0 1-4.5 5z"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off':'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  external:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
  briefcase:'<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
};
function icon(name, size=22, sw=1.7){
  const path = ICONS[name] || ICONS.grid;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}
const modOf = k => CONFIG.modules.find(m=>m.key===k);

/* ============================================================
   Toast 提示
   ============================================================ */
function showToast(msg, type){
  const t = document.createElement('div');
  t.className = 'sync-toast' + (type ? ' ' + type : '');
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); },2500);
}

/* ============================================================
   CONFIG — 全局配置
   ============================================================ */
const CONFIG = {
  storageKey: "cat-news-workbench-v1",
  owner: "檐栖",
  slogan: "Cat Daily News",

  quotes: [
    "头版头条：今日阳光正好，适合趴在窗台打个盹。",
    "独家报道：纸箱仍是本年度最佳睡眠场所。",
    "编辑部公告：今日运动量已达标，从客厅到阳台来回三趟。",
    "特别关注：罐头库存告急，建议尽快补货。",
    "深度专栏：关于「人类什么时候下班」的千年谜题。",
    "周末特刊：整理一下爪子，迎接新的一周。",
    "周日副刊：复盘本周的睡姿，争取下次更专业。",
  ],

  overview: [
    { key:"todo", label:"今日选题", icon:"list", color:"var(--accent)",
      calc: d => { const it=d.todo||[]; const done=it.filter(x=>x.done).length; return { value: it.length?Math.round(done/it.length*100):0, sub:`${done}/${it.length} 项` }; } },
    { key:"checkin", label:"打卡", icon:"leaf", color:"var(--module-1)",
      calc: d => { const it=(d.checkin||[]).filter(x=>x.type!=="word"); const t=today(); const done=it.filter(x=>x.log&&x.log[t]).length; return { value: it.length?Math.round(done/it.length*100):0, sub:`${done}/${it.length} 项` }; } },
    { key:"read", label:"阅读", icon:"book", color:"var(--module-2)", calc: d => avgProgress(d.read) },
    { key:"sport", label:"运动", icon:"activity", color:"var(--module-3)", calc: d => avgProgress(d.sport) },
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
  ],

  trend: {
    title:"本周心情指数", unit:"分",
    series: d => (Array.isArray(d.__trend) && d.__trend.length===7) ? d.__trend : [],
  },

  quickAdd: [
    { label:"记运动", icon:"activity", module:"sport",   tint:"#f3e3dd", color:"var(--module-3)" },
    { label:"记打卡", icon:"check",    module:"checkin", tint:"#d8e5d0", color:"var(--module-1)" },
    { label:"记一笔", icon:"wallet",   module:"money",   tint:"#efe7d0", color:"var(--module-4)" },
    { label:"记想法", icon:"pen",      module:"note",    tint:"#e6dfd0", color:"var(--module-5)" },
  ],

  modules: [
    { key:"todo", name:"头版选题", icon:"list", tint:"#efe7d0", color:"var(--accent)", type:"todo", desc:"今日重点报道与选题追踪",
      priorities:[ {key:"P0",label:"重要",color:"#f3e3dd",text:"#c25d4f"}, {key:"P1",label:"一般",color:"#f6efe8",text:"#e6a043"}, {key:"P2",label:"随手",color:"#d8e5d0",text:"#4a6c3f"} ],
      seed:[ {id:11,title:"审核今日稿件：《论纸箱的舒适性》",priority:"P0",done:false,note:"深度报道，需配图"},
             {id:12,title:"拍摄封面写真",priority:"P1",done:false,note:"阳光下的窗台"},
             {id:13,title:"给人类留个便签",priority:"P2",done:true,note:""} ] },
    { key:"checkin", name:"日常打卡", icon:"leaf", tint:"#d8e5d0", color:"var(--module-1)", type:"checkin", desc:"每日例行公事",
      seed:[ {id:21,title:"喝够 8 杯水（其实是罐头汤）",log:{}}, {id:22,title:"23:00 前睡觉",log:{}}, {id:23,title:"舔毛 3 分钟",log:{}},
             {id:91,title:"背单词",type:"word",target:50,log:{}} ] },
    { key:"read", name:"阅读专栏", icon:"book", tint:"#f6efe8", color:"var(--module-2)", type:"progress", unit:"页", desc:"书籍·文章·猫生感悟",
      seed:[ {id:31,title:"《如何与人类沟通》",current:168,target:300,unit:"页",note:"第 7 章：关于人类听不懂呼噜声的研究"}, {id:32,title:"《纸箱建筑学》",current:90,target:260,unit:"页",note:"经典之作，常读常新"} ] },
    { key:"sport", name:"运动版面", icon:"activity", tint:"#f3e3dd", color:"var(--module-3)", type:"progress", unit:"分钟", desc:"奔跑·跳跃·偷袭训练",
      seed:[ {id:41,title:"半夜疯跑",current:12,target:20,unit:"分钟",note:"客厅到卧室折返跑"}, {id:42,title:"偷袭人类",current:30,target:40,unit:"次",note:"成功率约 30%"} ] },
    { key:"money", name:"财经版", icon:"wallet", tint:"#efe7d0", color:"var(--module-4)", type:"finance", desc:"罐头·小鱼干·家用开销",
      categories:["罐头","小鱼干","玩具","医疗","礼金","其他"],
      seed:[ {id:51,title:"金枪鱼罐头",type:"expense",amount:32,category:"罐头",date:isoToday()},
             {id:52,title:"逗猫棒",type:"expense",amount:6,category:"玩具",date:isoToday()},
             {id:53,title:"稿费",type:"income",amount:400,category:"礼金",date:isoToday()} ] },
    { key:"note", name:"副刊笔记", icon:"pen", tint:"#e6dfd0", color:"var(--module-5)", type:"note", desc:"灵感·摘录·猫生感悟",
      moods:["开心","平静","不满","困倦","警觉"],
      seed:[ {id:61,title:"今日观察：人类的行为模式",content:"人类每天都会消失 8 小时，然后带着食物回来。这是一个有趣的循环。",mood:"平静",date:isoToday()} ] },
    { key:"hot", name:"热点追踪", icon:"flame", tint:"#f3e3dd", color:"var(--danger)", type:"note", desc:"喵星动态·热搜·稍后关注",
      moods:["收藏","稍后读","已读"],
      seed:[ {id:71,title:"纸箱新品发布会",content:"隔壁小区的纸箱新品，值得关注。",mood:"收藏",date:isoToday()} ] },
    { key:"ielts_read", name:"阅读题库", icon:"book", tint:"#d6e4d0", color:"#4a6c3f", type:"ielts", desc:"IELTS Reading · 阅读文章与正确率追踪",
      seed:[] },
    { key:"ielts_listening", name:"听力题库", icon:"headphones", tint:"#e6dcd0", color:"#8b7355", type:"ielts", desc:"IELTS Listening · Section 与正确率",
      seed:[] },
    { key:"ielts_writing", name:"写作题库", icon:"pen", tint:"#d0dde5", color:"#3d5a6c", type:"ielts", desc:"IELTS Writing · Task 1/2 练习",
      seed:[] },
    { key:"ielts_speaking", name:"口语题库", icon:"mic", tint:"#f0ddd0", color:"#a0522d", type:"ielts", desc:"IELTS Speaking · Part 1/2/3",
      seed:[] },
    { key:"ielts_record", name:"备考记录", icon:"file-text", tint:"#ece0c8", color:"#9c7a3c", type:"ielts", desc:"IELTS 备考 · 错题与薄弱点记录",
      seed:[] },
    { key:"job", name:"求职投递", icon:"briefcase", tint:"#e4ecf2", color:"#2f5d8a", type:"job", desc:"简历投递进度追踪",
      seed:[
        { id:1, title:"字节跳动 Coze", position:"产品经理实习生（AI Agent平台）", salary:"ByteIntern转正", location:"深圳", tier:"s", tagsText:"AI Agent平台", score:65, aiScore:4.5, resume:"01-定制简历/邱彦琦-29-字节Coze-产品经理实习生.html", jd:"02-岗位JD/字节跳动coze.png", desc:"2027届ByteIntern转正岗，AI Agent平台（扣子）与职业目标高度一致；Vibe Coding深度用户；RAG/Agent工作流/工具调用有实践；首选投递", status:"pending", date:"", note:"" },
        { id:2, title:"极飞科技", position:"AI产品经理（实习）", salary:"10-15K·13薪", location:"广州", tier:"s", tagsText:"AI Agent·产业AI", score:64, aiScore:4.3, resume:"01-定制简历/邱彦琦-09-极飞科技-AI产品经理实习生.html", jd:"02-岗位JD/极飞科技(10-15K).png", desc:"产业AI+Agent PM完美契合职业目标；农业科技=实体行业AI落地，与碳智优故事线一致；薪资最高档；13薪", status:"pending", date:"", note:"" },
        { id:3, title:"腾讯", position:"产品实习生（Prompt Engineering/AI平台）", salary:"300-350/天", location:"深圳", tier:"s", tagsText:"LLM/PE·AI平台", score:63, aiScore:4.6, resume:"01-定制简历/邱彦琦-10-腾讯-产品实习生.html", jd:"02-岗位JD/腾讯（300-350）.png", desc:"腾讯品牌+大模型平台PE经验=简历最强背书；对申请港科广AI方向极具说服力；B端AI平台与职业目标高度一致", status:"pending", date:"", note:"" },
        { id:4, title:"字节跳动 豆包", position:"产品实习生-AI创新业务", salary:"日常实习", location:"上海", tier:"a", tagsText:"AI应用·C端", score:58, aiScore:4.2, resume:"01-定制简历/邱彦琦-30-字节豆包-产品实习生.html", jd:"02-岗位JD/字节跳动AI创新.png", desc:"豆包是字节旗舰AI产品；AI功能策略设计经验；字节+豆包品牌背书极强；但日常实习无转正+上海地点", status:"pending", date:"", note:"" },
        { id:5, title:"智元机器人", position:"机器人交互产品经理实习生", salary:"240-360/天", location:"上海", tier:"a", tagsText:"多模态·具身智能", score:57, aiScore:4, resume:"01-定制简历/邱彦琦-11-智元机器人-机器人交互产品实习生.html", jd:"02-岗位JD/智元机器人（机器人交互产品经理实习生 240-360）.png", desc:"具身智能=港科广红鸟重点方向；MLLM研究背景（Ferret多模态模型）直接对口；智元是头部机器人公司", status:"pending", date:"", note:"" },
        { id:6, title:"字节跳动 火山方舟", position:"豆包AI大模型产品实习生", salary:"日常实习", location:"北京", tier:"a", tagsText:"大模型平台·B端", score:57, aiScore:4.3, resume:"01-定制简历/邱彦琦-31-字节火山方舟-大模型产品实习生.html", jd:"02-岗位JD/字节跳动火山方舟.png", desc:"火山方舟是国内头部大模型服务平台；LLM/多模态底层技术理解；AI模型服务化经验；但北京地点+日常实习无转正", status:"pending", date:"", note:"" },
        { id:7, title:"数说故事", position:"产品实习生", salary:"150-250/天", location:"广州", tier:"a", tagsText:"LLM/Agent·AI SaaS", score:56, aiScore:4.3, resume:"01-定制简历/邱彦琦-06-数说故事-产品实习生.html", jd:"02-岗位JD/数说故事.png", desc:"AI Agent产品经验与职业目标最直接匹配；RAG知识库+AI内容创作经验高度对口；广州本地便于在职", status:"pending", date:"", note:"" },
        { id:8, title:"百度", position:"Agent产品实习生", salary:"180-230/天", location:"深圳", tier:"a", tagsText:"Agent·C端社交", score:55, aiScore:4.2, resume:"01-定制简历/邱彦琦-12-百度-Agent产品实习生.html", jd:"02-岗位JD/百度（180-230）.png", desc:"百度+Agent产品经验品牌价值高；AI内容创作模块经验（AI角色/对话）；但C端社交陪伴方向与产业AI目标有偏差", status:"pending", date:"", note:"" },
        { id:9, title:"自变量机器人", position:"软件产品实习生", salary:"200-250/天", location:"深圳", tier:"a", tagsText:"具身智能·SaaS", score:54, aiScore:4.2, resume:"01-定制简历/邱彦琦-08-自变量机器人-软件产品实习生.html", jd:"02-岗位JD/自变量机器人(200-250).png", desc:"具身智能AI PM与港科广研究方向高度契合；MLLM研究背景（VLM/LLM）；可转正；能接触算法团队", status:"pending", date:"", note:"" },
        { id:10, title:"领智寻知", position:"产品经理（核心产品从0到1）", salary:"350-400/天", location:"未标注", tier:"a", tagsText:"LLM·AI系统", score:53, aiScore:4.2, resume:"01-定制简历/邱彦琦-13-领智寻知-产品经理.html", jd:"02-岗位JD/领智寻知（350-400）.png", desc:"薪资最高档；AI产品从0到1经验含金量高；但A轮0-20人极小公司，品牌风险高；非实习岗而是全职PM", status:"pending", date:"", note:"" },
        { id:11, title:"传音控股", position:"AI产品实习生（内容营销方向）", salary:"200-250/天", location:"深圳/重庆", tier:"a", tagsText:"AIGC·出海", score:53, aiScore:4, resume:"01-定制简历/邱彦琦-14-传音控股-AI产品实习生.html", jd:"02-岗位JD/传音控股（200-250）.png", desc:"汉全AI营销系统经验直接对口！非洲出海+AI营销=差异化经历；但JD标注\"硕士优先\"，本科可能竞争劣势", status:"pending", date:"", note:"" },
        { id:12, title:"商汤科技", position:"产品实习生", salary:"200-300/天", location:"深圳", tier:"a", tagsText:"AI·智能硬件", score:52, aiScore:4.4, resume:"01-定制简历/邱彦琦-01-商汤科技-产品实习生.html", jd:"02-岗位JD/SenseTime.png", desc:"商汤=AI头部品牌，简历辨识度高；Figma/Axure/墨刀熟练；但JD偏设计/原型而非AI产品核心", status:"pending", date:"", note:"" },
        { id:13, title:"字节跳动 抖音电商", position:"商家产品实习生", salary:"日常实习", location:"上海", tier:"a", tagsText:"商家工具·电商", score:51, aiScore:4.2, resume:"01-定制简历/邱彦琦-32-字节抖音电商-商家产品实习生.html", jd:"02-岗位JD/字节跳动抖音电商.png", desc:"字节品牌+抖音电商业务背书强；B端商家平台经验（RBAC+8模块）；但6个月+5天/周+上海+无转正+电商非AI核心", status:"pending", date:"", note:"" },
        { id:14, title:"xmind", position:"AI产品经理实习生", salary:"250-300/天", location:"深圳", tier:"a", tagsText:"对话AI·C端", score:50, aiScore:4.3, resume:"01-定制简历/邱彦琦-15-xmind-AI产品经理实习生.html", jd:"02-岗位JD/xmind(250-300).png", desc:"AI虚拟角色/对话式AI是热门方向；薪资不错；但C端情感陪伴方向与产业AI目标偏差大", status:"pending", date:"", note:"" },
        { id:15, title:"北京杉树智能", position:"产品经理实习生（B端AI）", salary:"200-300/天", location:"广州", tier:"b", tagsText:"AI应用·B端", score:47, aiScore:4.2, resume:"01-定制简历/邱彦琦-16-杉树智能-B端AI产品实习生.html", jd:"02-岗位JD/北京杉树智能科技（200-300）.png", desc:"广州本地B端AI经验；薪资中上；B端SaaS产品经验；但D轮但知名度低；大数据方向非核心AI", status:"pending", date:"", note:"" },
        { id:16, title:"金山WPS", position:"AI产品经理（B端）", salary:"150-200/天", location:"珠海", tier:"b", tagsText:"AI办公·B端", score:47, aiScore:4.2, resume:"01-定制简历/邱彦琦-17-金山WPS-AI产品经理.html", jd:"02-岗位JD/金山WPS（150-200）.png", desc:"WPS是国民级AI办公产品，品牌认知度高；但薪资偏低；珠海地点不便；JD描述非常简略", status:"pending", date:"", note:"" },
        { id:17, title:"影石Insta360（原）", position:"产品实习生（B端效率工具）", salary:"200-250/天", location:"深圳", tier:"b", tagsText:"B端系统·硬件", score:47, aiScore:4.2, resume:"01-定制简历/邱彦琦-07-影石Insta360-产品实习生.html", jd:"02-岗位JD/影石.png", desc:"影石上市公司品牌；B端复杂系统设计经验扎实；但非AI核心岗位；内部效率工具对外不可见", status:"pending", date:"", note:"" },
        { id:18, title:"沃尔玛", position:"AI项目/数据分析实习生", salary:"160-180/天", location:"深圳/广州", tier:"b", tagsText:"AI Agent·数据分析", score:46, aiScore:3.8, resume:"01-定制简历/邱彦琦-19-沃尔玛-AI项目数据分析实习生.html", jd:"02-岗位JD/沃尔玛（160-180）.png", desc:"沃尔玛世界500强品牌对留学申请有加分；AI Agent/模型评估经验有价值；但偏数据分析而非核心PM", status:"pending", date:"", note:"" },
        { id:19, title:"雷鸟创新", position:"AI产品经理实习生（智能眼镜）", salary:"140-240/天", location:"深圳", tier:"b", tagsText:"AI硬件·AR眼镜", score:46, aiScore:4.2, resume:"01-定制简历/邱彦琦-20-雷鸟创新-AI产品经理实习生.html", jd:"02-岗位JD/雷鸟创新（140-240）.png", desc:"AI+AR硬件是前沿方向；TCL旗下品牌；但薪资区间大(下限低)；智能眼镜/AR领域经验为零；5天/周", status:"pending", date:"", note:"" },
        { id:20, title:"影石Insta360（新）", position:"软件产品经理实习生（相机软件）", salary:"250-350/天", location:"深圳", tier:"b", tagsText:"软件·影像", score:46, aiScore:3.9, resume:"01-定制简历/邱彦琦-18-影石Insta360-软件产品实习生.html", jd:"02-岗位JD/影石（250-350）.png", desc:"影石品牌+高薪资；但完全非AI方向；要求影像/摄影背景；对AI PM职业目标帮助有限", status:"pending", date:"", note:"" },
        { id:21, title:"字节跳动 TikTok Shop", position:"国际电商数据科学实习生", salary:"日常实习", location:"上海", tier:"b", tagsText:"数据科学·跨境电商", score:45, aiScore:3.4, resume:"01-定制简历/邱彦琦-33-字节TikTokShop-数据科学实习生.html", jd:"02-岗位JD/字节跳动tiktokshop.png", desc:"TikTok是顶级全球化品牌；数据科学经验可补充定量分析能力；但这是数据科学岗非PM岗；上海地点", status:"pending", date:"", note:"" },
        { id:22, title:"安点科技", position:"AI产品经理实习生", salary:"200-250/天", location:"广州", tier:"b", tagsText:"AI工具·FinTech", score:44, aiScore:4.2, resume:"01-定制简历/邱彦琦-21-安点科技-AI产品经理实习生.html", jd:"02-岗位JD/安点科技（200-250）.png", desc:"广州本地+AI PM title；Figma/Cursor/ChatGPT等AI工具熟练；但未融资20-99人小公司，品牌风险高", status:"pending", date:"", note:"" },
        { id:23, title:"嘉为科技", position:"ToB产品经理（27届/可转正）", salary:"200-250/天", location:"广州", tier:"b", tagsText:"IT运维", score:43, aiScore:4.2, resume:"01-定制简历/邱彦琦-22-嘉为科技-ToB产品经理.html", jd:"02-岗位JD/嘉为科技（200-250）.png", desc:"可转正+广州本地是优势；B端SaaS产品经验；但AI含量极低（IT运维方向）；品牌知名度一般", status:"pending", date:"", note:"" },
        { id:24, title:"驴迹科技", position:"AI产品实习生（办公流程提效）", salary:"150-180/天", location:"广州", tier:"b", tagsText:"AI办公·B端", score:42, aiScore:3.8, resume:"01-定制简历/邱彦琦-23-驴迹科技-AI产品实习生.html", jd:"02-岗位JD/驴迹科技（150-180）.png", desc:"AI办公效率+B端+可转正；AI工具深度用户；但薪资偏低；上市公司但知名度低；景区数字化方向偏窄", status:"pending", date:"", note:"" },
        { id:25, title:"Strikingly", position:"实习产品经理（远程/香港）", salary:"200-250/天", location:"香港远程", tier:"b", tagsText:"SaaS·出海", score:41, aiScore:4.2, resume:"01-定制简历/邱彦琦-24-Strikingly-产品经理实习生.html", jd:"02-岗位JD/Strikingly(200-250).png", desc:"海外SaaS+英语工作环境对留学申请有加分；远程灵活；可作为赴港读书后的实习备选；但非AI方向", status:"pending", date:"", note:"" },
        { id:26, title:"唯品会", position:"策略产品实习生", salary:"150-200/天", location:"广州", tier:"b", tagsText:"策略/数据·电商", score:40, aiScore:3.6, resume:"01-定制简历/邱彦琦-25-唯品会-策略产品实习生.html", jd:"02-岗位JD/唯品会（150-200）.png", desc:"唯品会品牌+广州本地；但无转正机会；搜推策略经验不足；非AI核心；策略产品与AI PM偏差大", status:"pending", date:"", note:"" },
        { id:27, title:"普渡机器人", position:"Agent开发实习生", salary:"200-300/天", location:"深圳", tier:"c", tagsText:"开发岗", score:39, aiScore:3.8, resume:"01-定制简历/邱彦琦-26-普渡机器人-Agent开发实习生.html", jd:"02-岗位JD/普渡机器人（200-300）.png", desc:"⚠这是开发岗不是PM岗。要求Go/C++/Python后端开发、MCP/Function Call/Agent架构开发；6个月全职投入成本高", status:"pending", date:"", note:"" },
        { id:28, title:"韶音科技", position:"产品实习生（内部IT系统）", salary:"150-250/天", location:"深圳", tier:"c", tagsText:"内部IT", score:39, aiScore:3.6, resume:"01-定制简历/邱彦琦-05-韶音科技-产品实习生.html", jd:"02-岗位JD/韶音科技.png", desc:"非AI方向（内部IT系统）；品牌在消费电子领域有名但互联网圈认知度一般；匹配度不高", status:"pending", date:"", note:"" },
        { id:29, title:"锐明技术", position:"产品实习生", salary:"200-250/天", location:"深圳", tier:"c", tagsText:"商用车AI", score:37, aiScore:3.9, resume:"01-定制简历/邱彦琦-04-锐明技术-产品实习生.html", jd:"02-岗位JD/锐明(200-250).png", desc:"JD过于简洁，工作内容基础（用户场景梳理+竞品调研）；AI含量低；品牌知名度有限；成长空间有限", status:"pending", date:"", note:"" },
        { id:30, title:"荔枝集团", position:"产品实习生", salary:"150-200/天", location:"广州", tier:"c", tagsText:"内容/音频", score:36, aiScore:4.2, resume:"01-定制简历/邱彦琦-02-荔枝集团-产品实习生.html", jd:"02-岗位JD/荔枝.png", desc:"完全非AI方向（音频内容平台）；C端经验与B端/产业AI优势不匹配；薪资偏低；品牌一般", status:"pending", date:"", note:"" },
        { id:31, title:"爱奇创新", position:"AI产品经理实习生", salary:"100-200/天", location:"广州", tier:"c", tagsText:"内容社区", score:35, aiScore:3.6, resume:"01-定制简历/邱彦琦-27-爱奇创新-AI产品经理实习生.html", jd:"02-岗位JD/爱奇创新（100-200）.png", desc:"未融资20-99人极小公司；薪资最低档（100/天起）；AI含量不高；对简历和留学申请几乎无加分", status:"pending", date:"", note:"" },
        { id:32, title:"美的集团", position:"产品经理/项目管理实习生", salary:"150-200/天", location:"广州", tier:"c", tagsText:"信息化", score:33, aiScore:3.6, resume:"01-定制简历/邱彦琦-03-美的集团-产品经理实习生.html", jd:"02-岗位JD/美的.png", desc:"⚠JD明确要求\"26/27届在读研究生\"，本科学历不匹配。美的世界500强品牌强，但学历门槛是硬伤", status:"pending", date:"", note:"" },
        { id:33, title:"树根互联", position:"具身智能机器人（算法/研究）", salary:"150-180/天", location:"未标注", tier:"x", tagsText:"算法研究", score:0, aiScore:2.8, resume:"01-定制简历/邱彦琦-28-树根互联-具身智能机器人.html", jd:"02-岗位JD/树根（具身智能机器人 150-180）.png", desc:"⚠不建议投递。纯算法研究岗非PM，要求PyTorch/ROS2/强化学习/顶会论文，远不满足要求", status:"pending", date:"", note:"" },
      ] },
  ],
};
