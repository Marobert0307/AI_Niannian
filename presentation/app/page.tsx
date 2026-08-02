"use client";

import { useEffect, useState } from "react";

const chapters = [
  { id: "vision", label: "WHY" },
  { id: "architecture", label: "SYSTEM" },
  { id: "memory", label: "MEMORY" },
  { id: "scenes", label: "SCENES" },
  { id: "value", label: "VALUE" },
];

const layers = [
  { no: "01", tag: "ENTRY", title: "日常 AI 入口", desc: "Codex · Claude Code · 任意 MCP Client", detail: "用户仍在熟悉的工具里工作，不需要迁移习惯。上下文通过 MCP 被自然带入每一次新对话。", tone: "blue" },
  { no: "02", tag: "BRAIN", title: "Context Server", desc: "记忆存储 · 召回管理 · Personal Agent", detail: "把经历整理成可检索的记忆，计算情绪、重要度与遗忘度，并决定此刻应该想起什么。", tone: "violet" },
  { no: "03", tag: "SOURCE", title: "你的电脑", desc: "Spec.md · 原始材料 · 可直接编辑", detail: "Markdown 是记忆的可读真相源。你可以随时审阅、修正或补充，而不是把人生锁进黑箱数据库。", tone: "amber" },
  { no: "04", tag: "MOMENT", title: "时间交互 Demo", desc: "闹钟 · 日程 · 手机语音 · 上下文链接", detail: "当某个时刻到来，产品主动把相关上下文送回来：不是提醒一件事，而是帮你重新进入那件事。", tone: "coral" },
];

const memorySteps = [
  { label: "写入", title: "发生过什么", text: "对话、承诺、情绪和理由先保留原文，再形成记忆条目。" },
  { label: "理解", title: "它对你意味着什么", text: "用效价 × 唤醒度、重要度、未解决状态理解记忆。" },
  { label: "衰减", title: "自然淡去", text: "低活跃记忆逐渐下沉；情绪强、反复出现的经历保留更久。" },
  { label: "召回", title: "在此刻浮现", text: "结合语义、关键词、时间与当前任务，返回最相关的少量上下文。" },
];

const scenes = [
  {
    id: "alarm", index: "01", kicker: "07:30 / CONTEXTUAL ALARM", title: "不是把你叫醒，\n而是把「为什么」叫醒。",
    body: "闹钟响起时，Agent 不只说“该跑步了”。它知道你为什么开始、昨天为什么放弃，也知道今天怎样开口最有用。",
    quote: "“你不是要完成五公里。先穿上鞋，下楼走两分钟——这是你昨晚答应自己的最小一步。”",
    chips: ["目标上下文", "个性化语音", "动态 motivation"], color: "mint"
  },
  {
    id: "calendar", index: "02", kicker: "15:00 / CALENDAR", title: "日程不是时间格子，\n是上下文的入口。",
    body: "进入会议、写作或讨论前，一键拉起对应上下文。无需重新解释背景，AI 从上次停下的位置继续。",
    quote: "“已带入产品方向讨论：上次确定了三类用户，仍未解决的是记忆授权边界。”",
    chips: ["一键进入", "跨会话连续", "少重复输入"], color: "sand"
  },
  {
    id: "handoff", index: "03", kicker: "ANYWHERE / HANDOFF", title: "上下文跟着你走，\n不跟着窗口消失。",
    body: "在手机上直接语音补充，也可以生成一个上下文链接，交给另一个 AI 窗口、同事或未来的自己。",
    quote: "“这个链接不是一份聊天记录，而是一份为下一次行动整理好的上下文。”",
    chips: ["手机语音", "上下文链接", "跨端接力"], color: "lavender"
  },
];

export default function Home() {
  const [active, setActive] = useState("vision");
  const [scene, setScene] = useState(0);
  const [layer, setLayer] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-35% 0px -55%", threshold: [0, .2, .6] });
    chapters.forEach(({ id }) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main>
      <header className="topbar">
        <button className="wordmark" onClick={() => go("vision")}><i />WAKIE <span>/ CONTEXT OS</span></button>
        <nav aria-label="演讲章节">
          {chapters.map((item, index) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => go(item.id)}><small>0{index + 1}</small>{item.label}</button>)}
        </nav>
        <div className="deck-meta"><span>PRODUCT STORY</span><b>2026</b></div>
      </header>

      <section className="hero section" id="vision">
        <div className="hero-grain" />
        <div className="eyebrow"><span>CONTEXT-AWARE PERSONAL AGENT</span><i /></div>
        <h1>让 AI 记得你，<br />也记得<span>什么时候</span><br />该想起你。</h1>
        <div className="hero-bottom">
          <p>我们不是在做一个更聪明的提醒工具。<br />我们在做一层<span>有情感、有遗忘、与时间相连的个人上下文。</span></p>
          <button className="round-cta" onClick={() => go("architecture")} aria-label="查看系统架构"><span>↓</span><small>SCROLL TO<br />THE SYSTEM</small></button>
        </div>
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="hero-note note-a"><b>REMEMBER</b><span>被理解的过去</span></div>
        <div className="hero-note note-b"><b>MOMENT</b><span>恰好到来的现在</span></div>
      </section>

      <section className="section architecture" id="architecture">
        <header className="section-head">
          <div><span className="section-no">01</span><p>THE SYSTEM</p></div>
          <h2>四个部分，一条不断裂的<br /><em>上下文链路</em></h2>
          <p className="section-intro">从日常 AI 工具出发，经过个人记忆中枢，落回可编辑的原始文档，最终在具体时刻被产品重新唤起。</p>
        </header>

        <div className="flow" aria-label="四层产品架构图">
          <div className="flow-line" />
          {layers.map((item, index) => (
            <button key={item.no} className={`flow-card ${item.tone} ${layer === index ? "selected" : ""}`} onMouseEnter={() => setLayer(index)} onFocus={() => setLayer(index)} onClick={() => setLayer(index)}>
              <span className="flow-no">{item.no}</span>
              <i className="flow-node" />
              <small>{item.tag}</small>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
              {index < layers.length - 1 && <b className="flow-arrow">→</b>}
            </button>
          ))}
        </div>
        <div className="layer-detail"><span>{layers[layer].no}</span><p>{layers[layer].detail}</p><small>点击上方模块查看</small></div>

        <div className="loop-band">
          <span>CAPTURE</span><i>→</i><span>UNDERSTAND</span><i>→</i><span>REMEMBER</span><i>→</i><span>RETURN AT THE RIGHT MOMENT</span>
        </div>
      </section>

      <section className="section memory" id="memory">
        <div className="memory-top">
          <header className="section-head inverse">
            <div><span className="section-no">02</span><p>THE MEMORY</p></div>
            <h2>记忆不是数据库。<br />它应该像人一样，<em>有轻重。</em></h2>
          </header>
          <p className="memory-lead">参考 Ombre-Brain 的情绪记忆思路，并针对“时间交互”重构：让记忆不仅可被查询，还能在一个时刻主动回来。</p>
        </div>

        <div className="memory-grid">
          <div className="emotion-map">
            <div className="axis y"><span>高唤醒</span><span>低唤醒</span></div><div className="axis x"><span>负效价</span><span>正效价</span></div>
            <div className="map-ring ring-1" /><div className="map-ring ring-2" />
            <button className="memory-dot dot-1"><i /><span>第一次公开演讲<br /><small>紧张 · 重要</small></span></button>
            <button className="memory-dot dot-2"><i /><span>晨跑后的轻松<br /><small>平静 · 积极</small></span></button>
            <button className="memory-dot dot-3"><i /><span>搁置的产品决定<br /><small>未解决 · 反复出现</small></span></button>
            <div className="map-center">情绪坐标<br /><small>VALENCE × AROUSAL</small></div>
          </div>

          <div className="memory-process">
            {memorySteps.map((item, index) => <article key={item.label}>
              <span>0{index + 1}</span><div><small>{item.label}</small><strong>{item.title}</strong><p>{item.text}</p></div>
            </article>)}
          </div>
        </div>

        <div className="memory-principles">
          <article><span>01</span><strong>情感是坐标，<br />不是“开心/难过”的标签</strong></article>
          <article><span>02</span><strong>遗忘是淡去，<br />不是粗暴删除</strong></article>
          <article><span>03</span><strong>原文是可读的 Markdown，<br />不是不可控的黑箱</strong></article>
        </div>
      </section>

      <section className="section scenes" id="scenes">
        <header className="section-head">
          <div><span className="section-no">03</span><p>THE MOMENTS</p></div>
          <h2>当上下文遇到时间，<br /><em>提醒变成了陪伴。</em></h2>
        </header>

        <div className="scene-tabs" role="tablist">
          {scenes.map((item, index) => <button role="tab" aria-selected={scene === index} className={scene === index ? "active" : ""} onClick={() => setScene(index)} key={item.id}><span>{item.index}</span>{item.id === "alarm" ? "AI 闹钟" : item.id === "calendar" ? "上下文日程" : "跨端接力"}</button>)}
        </div>

        <article className={`scene-stage ${scenes[scene].color}`}>
          <div className="scene-copy">
            <small>{scenes[scene].kicker}</small>
            <h3>{scenes[scene].title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3>
            <p>{scenes[scene].body}</p>
            <div className="chips">{scenes[scene].chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
          </div>
          <div className="phone-shell" aria-label={`${scenes[scene].id} 产品场景示意`}>
            <div className="phone-island" />
            {scene === 0 && <div className="phone-content alarm-ui"><div className="ui-top"><span>7:30</span><small>8月7日 · 星期五</small></div><div className="voice-core"><i /><i /><i /><i /><i /></div><strong>早上好，Maro。</strong><p>{scenes[scene].quote}</p><button>我起来了 <span>→</span></button></div>}
            {scene === 1 && <div className="phone-content calendar-ui"><div className="mini-head"><small>AUGUST / TODAY</small><b>···</b></div><h4>今天</h4><div className="day-strip"><span>三<small>5</small></span><span>四<small>6</small></span><span className="today">五<small>7</small></span><span>六<small>8</small></span></div><article><time>15:00</time><div><small>产品讨论</small><strong>Context OS 方向会</strong><p>3 条记忆 · 1 个未解决问题</p></div></article><button>带着上下文进入 <span>→</span></button></div>}
            {scene === 2 && <div className="phone-content handoff-ui"><div className="mini-head"><small>CONTEXT HANDOFF</small><b>×</b></div><div className="link-orb">↗</div><h4>上下文已准备好</h4><p>产品演讲 / 当前版本</p><div className="link-box"><span>wakie.ai/c/7K2A</span><button>复制</button></div><ul><li><i />12 条相关记忆</li><li><i />3 份原始文档</li><li><i />有效期：24 小时</li></ul><button className="share-btn">分享给另一个窗口</button></div>}
          </div>
          <blockquote><span>“</span><p>{scenes[scene].quote.replaceAll("“", "").replaceAll("”", "")}</p></blockquote>
        </article>
      </section>

      <section className="section value" id="value">
        <header className="section-head inverse">
          <div><span className="section-no">04</span><p>THE VALUE</p></div>
          <h2>我们减少的不是点击，<br />而是每次重新开始的<em>心理摩擦。</em></h2>
        </header>
        <div className="value-grid">
          <article><span>01</span><div className="value-icon">↗</div><h3>更快进入状态</h3><p>不用反复复制背景、解释目标。每次打开 AI，都从真正的断点继续。</p></article>
          <article><span>02</span><div className="value-icon">◎</div><h3>更像你的 Agent</h3><p>它理解的不只是事实，还有你的犹豫、动力、承诺与情绪重量。</p></article>
          <article><span>03</span><div className="value-icon">⌁</div><h3>从建议走向行动</h3><p>上下文不再沉睡在聊天记录里，而是在日程和闹钟中主动抵达。</p></article>
          <article><span>04</span><div className="value-icon">◇</div><h3>可见、可控、可带走</h3><p>原始记忆保存在可编辑文档中，用户拥有修正权，也拥有迁移权。</p></article>
        </div>

        <div className="closing">
          <p>THE ONE-LINE PITCH</p>
          <h2>一个会在正确时间，<br />带着正确上下文回来找你的 AI。</h2>
          <div><span>CONTEXT</span><i>×</i><span>EMOTION</span><i>×</i><span>TIME</span></div>
          <button onClick={() => go("vision")}>回到开场 ↑</button>
        </div>
      </section>
    </main>
  );
}
