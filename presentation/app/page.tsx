"use client";

import { useEffect, useState } from "react";

const chapters = [
  { id: "answer", label: "结论" },
  { id: "scenarios", label: "场景" },
  { id: "system", label: "架构" },
  { id: "closing", label: "价值" },
];

const scenarios = [
  {
    id: "alarm", time: "07:30", label: "AI 闹钟", color: "green",
    headline: "不是提醒你起床，\n而是帮你找回行动的理由。",
    pain: "普通闹钟只知道时间，不知道你为什么设下它。",
    context: "你的目标、昨晚的承诺、过去几次放弃的原因。",
    value: "AI 用最适合此刻的语气和最小行动，提供真正个性化的 motivation。",
    response: "先不用跑五公里。穿上鞋、下楼走两分钟——这是你昨晚答应自己的最小一步。",
    tags: ["目标上下文", "动态语音", "Motivation"]
  },
  {
    id: "life", time: "周六", label: "生活日程", color: "sand",
    headline: "想出去玩时，\n不用从零向 AI 解释一遍。",
    pain: "朋友约出游时，地点偏好、预算和以前聊过的方案散落在不同窗口。",
    context: "同行的人、预算、偏好、收藏的链接和上次没有决定的选项。",
    value: "点开日程就直接进入讨论，AI 可以马上比较路线、补全计划并生成下一步。",
    response: "你们上次留下了莫干山和安吉两个方案。按小余不想自驾、预算 800 元，安吉更合适。",
    tags: ["生活决策", "快速讨论", "链接归档"]
  },
  {
    id: "work", time: "15:00", label: "工作日程", color: "purple",
    headline: "复杂工作不是重新开聊，\n而是从真正的断点继续。",
    pain: "会议、代码、文档和决策背景太多，每个新窗口都要重新同步。",
    context: "项目 Spec、历史决策、相关对话、待解决问题和最新修改。",
    value: "日程成为上下文入口：一键带入大量材料，在 Codex 或 Claude Code 中继续工作。",
    response: "已带入 Context OS 方向会：三类用户已确定，当前未解决的是记忆授权边界。",
    tags: ["大量上下文", "MCP 接入", "跨窗口连续"]
  }
];

export default function Home() {
  const [active, setActive] = useState("answer");
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target.id) setActive(current.target.id);
    }, { rootMargin: "-35% 0px -55%", threshold: [0, .25, .6] });
    chapters.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const current = scenarios[scene];

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => go("answer")}><i />WAKIE <span>CONTEXTUAL TO-DO</span></button>
        <nav aria-label="三分钟演讲章节">{chapters.map((item, index) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => go(item.id)}><small>0{index + 1}</small>{item.label}</button>)}</nav>
        <div className="timer"><i />03:00 PITCH</div>
      </header>

      <section className="hero" id="answer">
        <div className="hero-copy">
          <div className="timecode">00:00—00:25 · 先说结论</div>
          <p className="super">我们用什么，解决什么？</p>
          <h1>我们用一个<span>有记忆的个人 Agent</span>，<br />解决 To-do <em>没有上下文</em>的问题。</h1>
          <p className="hero-lead">今天的提醒工具只告诉你“要做什么”；我们让 AI 同时知道<span>为什么做、之前发生了什么、现在怎样帮你行动。</span></p>
          <div className="formula"><b>TO-DO</b><i>+</i><b>CONTEXT</b><i>+</i><b>RIGHT MOMENT</b><strong>= 能推动行动的 AI</strong></div>
          <div className="hero-values">
            <article><span>01</span><strong>记得</strong><p>跨窗口保存事实、理由与情绪</p></article>
            <article><span>02</span><strong>理解</strong><p>知道此刻需要提醒、讨论还是执行</p></article>
            <article><span>03</span><strong>行动</strong><p>在闹钟与日程中把上下文送回来</p></article>
          </div>
        </div>
        <div className="hero-demo">
          <div className="demo-label"><span>LIVE PRODUCT FRONTEND</span><i>NOW</i></div>
          <Phone mode="alarm" compact />
          <div className="context-capsule cap-a"><small>WHY</small><b>第一次半马</b></div>
          <div className="context-capsule cap-b"><small>LAST NIGHT</small><b>先下楼两分钟</b></div>
          <div className="context-capsule cap-c"><small>NOW</small><b>需要 motivation</b></div>
        </div>
        <button className="next" onClick={() => go("scenarios")}>三个场景，快速说清价值 <span>↓</span></button>
      </section>

      <section className="scenarios section" id="scenarios">
        <header className="section-head">
          <div><span>00:20—01:15</span><small>VALUE FIRST</small></div>
          <h2>同一个“带上下文的 To-do”，<br />在不同场景里产生<em>不同价值。</em></h2>
        </header>
        <div className="scene-tabs" role="tablist">
          {scenarios.map((item, index) => <button key={item.id} role="tab" aria-selected={scene === index} className={scene === index ? "active" : ""} onClick={() => setScene(index)}><span>0{index + 1}</span><strong>{item.label}</strong><small>{item.time}</small></button>)}
        </div>
        <article className={`scene-panel ${current.color}`}>
          <div className="scene-story">
            <span className="scene-kicker">{current.time} / {current.label}</span>
            <h3>{current.headline.split("\n").map(line => <span key={line}>{line}</span>)}</h3>
            <div className="logic-row"><small>痛点</small><p>{current.pain}</p></div>
            <div className="logic-row"><small>带入</small><p>{current.context}</p></div>
            <div className="logic-row value-row"><small>价值</small><p>{current.value}</p></div>
            <div className="tags">{current.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          </div>
          <div className="scene-phone"><Phone mode={current.id} /><blockquote><span>AI</span><p>{current.response}</p></blockquote></div>
        </article>
        <div className="scene-conclusion"><b>前端负责把上下文变成“此刻可用”</b><span>→</span><p>闹钟负责督促，日程负责开启讨论，工作场景则可以<span>直接进入 Agent 或用问答补全细节。</span></p></div>
      </section>

      <section className="layers section" id="layers">
        <header className="section-head">
          <div><span>01:15—01:45</span><small>THREE LAYERS</small></div>
          <h2>用户看到的是时间与交互，<br />背后才是<em>上下文管控。</em></h2>
        </header>
        <div className="layer-stack">
          <article className="layer-top"><div><span>03</span><small>用户强感知</small></div><h3>带着上下文，快速交互</h3><p>语音问答 · 和朋友讨论 · 进入 Codex / Claude Code · 分享上下文链接</p><b>INTERACT</b></article>
          <article className="layer-middle"><div><span>02</span><small>用户强感知</small></div><h3>上下文与时间绑定</h3><p>闹钟带回动力与承诺；日程带回攻略、材料、决策和未解决问题</p><b>TIME</b></article>
          <article className="layer-bottom"><div><span>01</span><small>用户基本无感</small></div><h3>合理管控上下文</h3><p>Agent 在后台持续整理、检索、衰减、浮现，并保持原文可编辑</p><b>MEMORY AGENT</b></article>
        </div>
        <p className="layer-note">讲述顺序：<strong>从上往下</strong>，先说用户价值；产品运行顺序：<strong>从下往上</strong>，由记忆 Agent 支撑时间与交互。</p>
      </section>

      <section className="system section" id="system">
        <header className="section-head inverse">
          <div><span>01:45—02:45</span><small>AGENT & SYSTEM</small></div>
          <h2>主角是记忆 Agent，<br />四个部分围绕它<em>持续双向更新。</em></h2>
        </header>

        <div className="system-map" aria-label="Context OS 四部分双向架构图">
          <div className="map-orbit orbit-a" /><div className="map-orbit orbit-b" />
          <div className="connector con-client"><span>对话 / 召回 ↔</span></div>
          <div className="connector con-computer"><span>读取 / 修改 ↔</span></div>
          <div className="connector con-product"><span>录入 / 触发 ↔</span></div>
          <article className="sys-node clients"><div className="node-icon">⌘</div><small>01 · AI CLIENTS</small><h3>Codex / Claude Code</h3><p>日常对话与工作入口。通过 MCP 读取记忆，也把新经历写回。</p><div><span>CHAT</span><span>MCP</span><span>WORK</span></div></article>
          <article className="sys-node computer"><div className="node-icon">▱</div><small>03 · YOUR COMPUTER</small><h3>Spec.md / 原始文档</h3><p>用户直接查看、编辑上下文真相源；Agent 同步最新修改。</p><div><span>EDIT</span><span>FILES</span><span>CONTROL</span></div></article>
          <article className="sys-node product"><div className="node-icon">◉</div><small>04 · PRODUCT FRONTEND</small><h3>手机 / 闹钟 / 日程</h3><p>既是输出端，也是录入端：语音、链接和日程会继续生成上下文。</p><div><span>VOICE IN</span><span>TIME</span><span>SHARE</span></div></article>
          <article className="brain"><small>02 · CONTEXT SERVER</small><div className="brain-core"><i /><strong>PERSONAL<br />AGENT</strong></div><h3>记忆与决策中枢</h3><p>存储 · 检索 · 遗忘 · 情绪 · Agent</p></article>
        </div>

        <div className="system-note"><b>关键变化</b><p>手机端不只是“展示提醒”：它可以语音写入；Codex 不只是“读取资料”：它也会更新记忆；电脑上的 Spec 不是终点：它始终可以被人直接修正。</p></div>

        <div className="memory-org">
          <header><div><small>CONTEXT ORGANIZATION</small><h3>Agent 如何把散乱经历，整理成此刻可用的上下文</h3></div><p>基于 `memory.html` 的组织逻辑，调整为 WAKIE 的记忆层。</p></header>
          <div className="org-columns"><span>技术与组织方式</span><span>带来的结果</span></div>
          <div className="org-list">
            <article><i>01</i><div><strong>Spec 真相统一</strong><small>后台整理关键事实，原始文档保持可编辑</small></div><b>→</b><p>上下文有稳定、可校正的来源</p></article>
            <article><i>02</i><div><strong>混合检索</strong><small>关键词 / BM25 / 语义向量共同召回</small></div><b>→</b><p>既能理解意思，也不会丢掉原文细节</p></article>
            <article><i>03</i><div><strong>情绪与遗忘曲线</strong><small>活跃度、重要度与情绪强度影响衰减</small></div><b>→</b><p>重要记忆保留更久，其余自然淡去</p></article>
            <article><i>04</i><div><strong>权重池主动浮现</strong><small>未解决、高唤醒、临近时间的内容提高权重</small></div><b>→</b><p>闹钟和日程到来前，关键上下文主动回来</p></article>
            <article><i>05</i><div><strong>Markdown 记忆桶</strong><small>YAML 元数据 + 可读原文 + 关联链接</small></div><b>→</b><p>用户可读、可改、可搜索、可迁移</p></article>
            <article><i>06</i><div><strong>先落盘，再向量化</strong><small>写入与 embedding 解耦，后台完成索引</small></div><b>→</b><p>网络失败也不丢记忆，长期可靠运行</p></article>
          </div>
        </div>
      </section>

      <section className="closing section" id="closing">
        <div className="closing-time">02:45—03:00 · 最后只留一句</div>
        <p>THE ONE-LINE PITCH</p>
        <h2>一个以记忆 Agent 为核心，<br />让上下文优雅流入时间的产品。</h2>
        <div className="final-values">
          <span>更少重复解释</span><i>×</i><span>更快进入状态</span><i>×</i><span>更容易真正行动</span>
        </div>
        <div className="final-line"><span>CONTEXTUAL TO-DO</span><b>从“记得要做”到“帮你做到”</b><button onClick={() => go("answer")}>回到开场 ↑</button></div>
      </section>
    </main>
  );
}

function Phone({ mode, compact = false }: { mode: string; compact?: boolean }) {
  return <div className={`phone ${compact ? "compact" : ""}`}>
    <i className="island" />
    {mode === "alarm" && <div className="phone-screen alarm-ui"><time>7:30</time><small>8月7日 · 星期五</small><div className="voice-orb"><i /><i /><i /><i /><i /></div><h4>早上好，Maro。</h4><p>先不用跑五公里。穿上鞋，下楼走两分钟。</p><button>我起来了 <span>→</span></button></div>}
    {mode === "life" && <div className="phone-screen life-ui"><header><small>SATURDAY PLAN</small><b>···</b></header><h4>和小余出去玩</h4><p>已带入 8 条相关上下文</p><div className="mini-chat"><span>念</span><p>继续比较莫干山和安吉？我记得你们不想自驾。</p></div><div className="choice"><small>RECOMMEND</small><b>安吉 · 两天一夜</b><span>¥ 680 / 人</span></div><button>继续和 AI 讨论 <span>→</span></button></div>}
    {mode === "work" && <div className="phone-screen work-ui"><header><small>CONTEXT READY</small><b>15:00</b></header><h4>Context OS 方向会</h4><div className="context-count"><strong>24</strong><span>条记忆<br />已准备</span></div><ul><li><i />产品 Spec.md</li><li><i />上次会议的 3 个决定</li><li><i />1 个未解决问题</li></ul><button>在 Codex 中继续 <span>↗</span></button><small className="share">或复制上下文链接</small></div>}
  </div>;
}
