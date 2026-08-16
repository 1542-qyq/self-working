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
  owner: "QYQ",
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
        { id:1, title:"示例科技", position:"AI产品经理实习生", salary:"200-300/天", location:"深圳", tier:"s", tagsText:"AI Agent·B端", score:60, aiScore:4.2, resume:"", jd:"", desc:"示例岗位：用于演示看板功能，可删除后录入自己的投递记录", status:"pending", date:"", note:"" },
        { id:2, title:"星辰网络", position:"产品实习生", salary:"150-250/天", location:"北京", tier:"a", tagsText:"AI应用·C端", score:52, aiScore:3.9, resume:"", jd:"", desc:"示例岗位：演示优先级筛选与评分条效果", status:"pending", date:"", note:"" },
        { id:3, title:"蓝图数据", position:"数据分析实习生", salary:"180-220/天", location:"上海", tier:"b", tagsText:"数据·电商", score:44, aiScore:3.6, resume:"", jd:"", desc:"示例岗位：演示状态流转与备注记录", status:"pending", date:"", note:"" }
      ] }
  ],
};
