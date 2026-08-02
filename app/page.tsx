"use client";

import { useEffect, useRef, useState } from "react";

type MainTab = "create" | "manage";
type ConfirmSource = "voice" | "text" | "mcp";
type ContextSession = { kind: "alarm" | "schedule"; title: string; detail: string };

const mcpCandidates = [
  { source: "Teams · 产品晨会", quote: "“我们周五下班前把竞品分析发出来，下周一直接讨论。”", type: "日程", title: "提交竞品分析", time: "周五 18:00" },
  { source: "微信 · 小余", quote: "“周六中午见？吃饭时正好把周末短途旅行的地方定下来。”", type: "日程", title: "和小余吃午饭", time: "周六 12:30" },
];

const days = [
  { week: "一", date: 3 }, { week: "二", date: 4 }, { week: "三", date: 5 },
  { week: "四", date: 6 }, { week: "五", date: 7 }, { week: "六", date: 8 },
  { week: "日", date: 9 }, { week: "一", date: 10 }, { week: "二", date: 11 },
];

const plans: Record<number, Array<{ time: string; title: string; note: string }>> = {
  5: [{ time: "15:00", title: "产品方向讨论", note: "梳理三个核心使用场景" }],
  7: [
    { time: "12:30", title: "和小余吃午饭", note: "聊聊周末短途旅行" },
    { time: "19:00", title: "整理产品反馈", note: "先归类，不急着解决" },
  ],
  9: [{ time: "20:00", title: "给妈妈打电话", note: "聊聊这一周发生的事" }],
};

function MicIcon() {
  return <span className="mic"><i /><b /></span>;
}

export default function Home() {
  const [tab, setTab] = useState<MainTab>("create");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showText, setShowText] = useState(false);
  const [text, setText] = useState("");
  const [confirmSource, setConfirmSource] = useState<ConfirmSource | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedLabel, setSavedLabel] = useState("明天 07:30 · 晨跑 5 公里");
  const [selectedDate, setSelectedDate] = useState(7);
  const [contextSession, setContextSession] = useState<ContextSession | null>(null);
  const [contextReply, setContextReply] = useState(false);
  const [sharedContext, setSharedContext] = useState<string | null>(null);
  const [mcpRemaining, setMcpRemaining] = useState([0, 1]);

  useEffect(() => {
    const appear = window.setTimeout(() => setConfirmSource("mcp"), 1200);
    return () => window.clearTimeout(appear);
  }, []);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  function toggleRecording() {
    if (recording) {
      setRecording(false);
      if (contextSession) setContextReply(true);
      else window.setTimeout(() => setConfirmSource("voice"), 250);
    } else {
      setSeconds(0);
      setRecording(true);
    }
  }

  function submitText() {
    if (!text.trim()) return;
    setShowText(false);
    if (contextSession) {
      setContextReply(true);
      setText("");
      return;
    }
    setConfirmSource("text");
  }

  function removeMcpCandidate(activeIndex: number) {
    if (mcpRemaining.length > 1) setMcpRemaining((items) => items.filter((_, index) => index !== activeIndex));
    else setConfirmSource(null);
  }

  function ignoreConfirm(activeIndex = 0) {
    if (confirmSource === "mcp") removeMcpCandidate(activeIndex);
    else setConfirmSource(null);
  }

  function confirmCreate(activeIndex = 0) {
    const candidate = confirmSource === "mcp" ? mcpCandidates[mcpRemaining[activeIndex] ?? 0] : null;
    setSavedLabel(candidate ? `${candidate.time} · ${candidate.title}` : "明天 07:30 · 晨跑 5 公里");
    if (confirmSource === "mcp") removeMcpCandidate(activeIndex);
    else setConfirmSource(null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2300);
  }

  function startContext(session: ContextSession) {
    setConfirmSource(null);
    setShowText(false);
    setRecording(false);
    setContextReply(false);
    setContextSession(session);
    setTab("create");
  }

  function shareContext(title: string) {
    setSharedContext(title);
    window.setTimeout(() => setSharedContext(null), 2800);
  }

  return (
    <main className="stage">
      <div className="stage-glow glow-one" /><div className="stage-glow glow-two" />
      <section className="phone" aria-label="念念手机应用交互原型">
        <i className="side-key key-one" /><i className="side-key key-two" /><i className="side-key key-three" />
        <div className="phone-screen">
          <header className="status"><span>9:41</span><i className="island" /><span className="status-marks">▮▮▮ ◔ ▰</span></header>

          <div className="viewport">
            {tab === "create" ? (
              <CreatePage
                recording={recording}
                seconds={seconds}
                toggleRecording={toggleRecording}
                openText={() => setShowText(true)}
                showText={showText}
                text={text}
                setText={setText}
                closeText={() => setShowText(false)}
                submitText={submitText}
                confirmSource={confirmSource}
                closeConfirm={() => setConfirmSource(null)}
                ignoreConfirm={ignoreConfirm}
                confirmCreate={confirmCreate}
                mcpCandidateIds={mcpRemaining}
                contextSession={contextSession}
                contextReply={contextReply}
                closeContext={() => { setContextSession(null); setContextReply(false); }}
              />
            ) : (
              <ManagePage
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                startContext={startContext}
                shareContext={shareContext}
              />
            )}
          </div>

          <nav className="main-tabs" aria-label="主导航">
            <button className={tab === "create" ? "active" : ""} onClick={() => setTab("create")}><span className="plus-icon" aria-hidden="true" /><em>创建</em></button>
            <button className={tab === "manage" ? "active" : ""} onClick={() => setTab("manage")}><span className="list-icon"><i /><i /><i /></span><em>日程</em></button>
          </nav>

          {saved && <div className="saved"><span>✓</span><div><strong>已创建</strong><small>{savedLabel}</small></div></div>}
          {sharedContext && <div className="share-toast"><span>↗</span><div><strong>上下文链接已生成</strong><small>niannian.link/context/7K2A · {sharedContext}</small></div></div>}
        </div>
      </section>

      <aside className="side-copy"><span>念念 · PRODUCT PROTOTYPE</span><h1>记住你的念头，<br />陪你把它做成。</h1><p>从一句话、一个日程，到真正开始行动。念念会带着当时的上下文，在你需要的时候继续和你聊。</p></aside>
    </main>
  );
}

function CreatePage({ recording, seconds, toggleRecording, openText, showText, text, setText, closeText, submitText, confirmSource, closeConfirm, ignoreConfirm, confirmCreate, mcpCandidateIds, contextSession, contextReply, closeContext }: {
  recording: boolean; seconds: number; toggleRecording: () => void; openText: () => void;
  showText: boolean; text: string; setText: (text: string) => void; closeText: () => void; submitText: () => void;
  confirmSource: ConfirmSource | null; closeConfirm: () => void; ignoreConfirm: (index?: number) => void; confirmCreate: (index?: number) => void; mcpCandidateIds: number[];
  contextSession: ContextSession | null; contextReply: boolean; closeContext: () => void;
}) {
  return (
    <section className={`create-page page ${confirmSource ? "has-inline-card" : ""}`}>
      <header className="create-head"><div><span className="brand">念念</span><h1>{confirmSource === "mcp" ? `我从对话里，\n记下了 ${mcpCandidateIds.length} 件事。` : confirmSource ? "我从对话里，\n记下了一件事。" : contextSession ? "带着上下文，\n继续聊。" : "把想做的事，\n说给我听。"}</h1></div><button className="avatar">木</button></header>
      {!confirmSource && <p className="intro">{contextSession ? "这段对话已经准备好，直接开口就可以。" : <>时间、事情，以及你为什么想做到。<br />剩下的交给念念。</>}</p>}

      {confirmSource && <ConfirmCard source={confirmSource} candidateIds={mcpCandidateIds} close={closeConfirm} ignore={ignoreConfirm} confirm={confirmCreate} />}

      {showText && !confirmSource && (
        <section className="inline-text">
          <header><div><small>{contextSession ? `已带入 · ${contextSession.title}` : "文字创建"}</small><strong>{contextSession ? "继续和念念聊" : "写下想完成的事"}</strong></div><button onClick={closeText}>×</button></header>
          <textarea autoFocus value={text} onChange={(event) => setText(event.target.value)} placeholder={contextSession ? "比如：我有点不想开始，帮我拆成最小的一步……" : "明早 7:30 叫我去晨跑。我正在准备第一次半马……"} />
          <button className="inline-submit" disabled={!text.trim()} onClick={submitText}>{contextSession ? "发送给念念" : "让念念帮我整理"} <span>→</span></button>
        </section>
      )}

      {contextSession && !showText && (
        <section className={`context-session ${contextSession.kind}`}>
          <header><span>{contextSession.kind === "alarm" ? "✦ AI 闹钟上下文" : "↗ 日程上下文"}</span><button onClick={closeContext}>×</button></header>
          <strong>{contextSession.title}</strong><p>{contextSession.detail}</p>
          <div className="ai-ready"><i>念</i><span>{contextReply ? "很好，我听到了。我们从最容易的一步开始。" : "上下文已经带上了。点下面的圆球，直接和念念聊。"}</span></div>
        </section>
      )}

      <div className={`orb-wrap ${recording ? "recording" : ""} ${(confirmSource || showText || contextSession) ? "orb-compact" : ""} ${(confirmSource === "mcp" || contextSession) ? "orb-network" : ""}`}>
        {(confirmSource === "mcp" || contextSession) && <><span className="context-orbit orbit-a">{confirmSource === "mcp" ? "晨会" : "目标"}</span><span className="context-orbit orbit-b">{confirmSource === "mcp" ? "小余" : "理由"}</span><i className="network-ring ring-a" /><i className="network-ring ring-b" /></>}
        <div className="orb-halo" /><div className="orb-halo halo-small" />
        <button className="voice-orb" onClick={toggleRecording} aria-label={recording ? "结束语音输入" : "开始语音输入"}>
          {recording ? <span className="voice-wave">{[22,38,28,46,31].map((h, i) => <i key={i} style={{ height: h }} />)}</span> : <MicIcon />}
        </button>
        <span className="orb-shine" />
      </div>

      <div className={`listen-copy ${confirmSource ? "confirm-listen-copy" : ""}`}><strong>{recording ? `正在听 · 00:${String(seconds).padStart(2, "0")}` : confirmSource ? "需要修改？直接告诉念念" : contextSession ? "轻点，基于这段上下文开始聊" : "轻点，说出你的计划"}</strong><small>{recording ? "说完再点一次" : confirmSource === "mcp" ? `${mcpCandidateIds.length} 段上下文持续连接 · 滑动不会中断` : contextSession ? "上下文会跟着这次对话" : "念念会记住你的时间，也记住你的理由"}</small></div>
      {!confirmSource && !showText && <button className="text-entry" onClick={openText}><span>⌨</span><strong>{contextSession ? "打字和念念聊" : "用文字创建"}</strong><i>→</i></button>}
    </section>
  );
}

function ConfirmCard({ source, candidateIds, close, ignore, confirm }: { source: ConfirmSource; candidateIds: number[]; close: () => void; ignore: (index?: number) => void; confirm: (index?: number) => void }) {
  const external = source === "mcp";
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setActiveIndex(0); trackRef.current?.scrollTo({ left: 0 }); }, [candidateIds.length]);

  function moveTo(index: number) {
    const next = Math.max(0, Math.min(index, candidateIds.length - 1));
    setActiveIndex(next);
    trackRef.current?.scrollTo({ left: next * (trackRef.current.clientWidth || 0), behavior: "smooth" });
  }

  const fallback = { source: source === "voice" ? "来自刚才的语音" : "来自刚才的文字", quote: "“下个月要参加第一次半马。只要穿上鞋出门，就已经完成一半了。”", type: "AI 闹钟", title: "晨跑 5 公里", time: "明天 07:30" };
  const visibleCandidates = external ? candidateIds.map((id) => mcpCandidates[id]) : [fallback];
  return (
      <section className="confirm inline-confirm">
        <header><div className="source-icon">念</div><div><small>{external ? `${candidateIds.length} 段上下文持续连接中` : fallback.source}</small><strong>{external ? "左右滑动查看念念的建议" : "念念理解到的是"}</strong></div><button onClick={close}>×</button></header>
        <div className="mcp-track" ref={trackRef} onScroll={(event) => setActiveIndex(Math.round(event.currentTarget.scrollLeft / Math.max(event.currentTarget.clientWidth, 1)))}>
          {visibleCandidates.map((candidate) => <article className="mcp-slide" key={candidate.title}>
            <div className="context-box context-primary"><small>{external ? candidate.source : "你为什么想做这件事"}</small><p>{candidate.quote}</p></div>
            <div className="intent-card"><small>建议为你创建</small><div><span>{candidate.type}</span><strong>{candidate.title}</strong></div><time>{candidate.time}</time></div>
          </article>)}
        </div>
        {external && <div className="carousel-status"><button onClick={() => moveTo(activeIndex - 1)} disabled={activeIndex === 0}>←</button><div>{visibleCandidates.map((candidate, index) => <i className={index === activeIndex ? "active" : ""} key={candidate.title} />)}<span>{activeIndex + 1}/{visibleCandidates.length}</span></div><button onClick={() => moveTo(activeIndex + 1)} disabled={activeIndex === visibleCandidates.length - 1}>→</button></div>}
        <footer><button onClick={() => ignore(activeIndex)}>忽略这条</button><button onClick={() => confirm(activeIndex)}>确认创建</button></footer>
      </section>
  );
}

function ManagePage({ selectedDate, setSelectedDate, startContext, shareContext }: {
  selectedDate: number; setSelectedDate: (day: number) => void;
  startContext: (session: ContextSession) => void; shareContext: (title: string) => void;
}) {
  const [alarmOn, setAlarmOn] = useState(true);
  const regularPlans = plans[selectedDate] ?? [];
  const total = regularPlans.length + (selectedDate === 7 ? 1 : 0);
  return (
    <section className="manage-page page">
      <header className="manage-head"><div><span className="brand">MY DAY</span><h1>日程</h1></div><button className="more-button">•••</button></header>

      <section className="floating-ideas">
        <header><div><strong>待讨论 · 待探索</strong><small>没有明确日期的内容</small></div><button>＋</button></header>
        <div className="idea-row"><article><span>探索</span><strong>AI 能不能成为真正的起床搭子？</strong><small>3 条想法</small></article><article><span>待讨论</span><strong>周末短途旅行去哪里</strong><small>和小余讨论</small></article></div>
      </section>

      <section className="calendar">
        <header><div><strong>2026年 8月</strong><span>{selectedDate === 7 ? "今天" : `${selectedDate}日`}</span></div><button onClick={() => setSelectedDate(7)}>今天</button></header>
        <div className="date-strip">{days.map((day) => <button key={day.date} className={selectedDate === day.date ? "selected" : ""} onClick={() => setSelectedDate(day.date)}><span>{day.week}</span><strong>{day.date}</strong>{(plans[day.date] || day.date === 7) && <i />}</button>)}</div>
      </section>

      <section className="mixed-agenda">
        <header><strong>{selectedDate === 7 ? "今天的事项" : `${selectedDate}日的事项`}</strong><small>{total} 项</small></header>
        {selectedDate === 7 && (
          <article className={`agenda-item alarm-item ${alarmOn ? "" : "alarm-disabled"}`}>
            <time>07:30</time><i className="type-line" />
            <div className="item-copy"><div className="item-kind-row"><span className="type-tag alarm-tag">↻ 周期闹钟</span><button className={`alarm-power ${alarmOn ? "on" : ""}`} aria-label={alarmOn ? "关闭周期闹钟" : "开启周期闹钟"} onClick={() => setAlarmOn((value) => !value)}><i />{alarmOn ? "关闭" : "开启"}</button></div><strong>晨跑 5 公里</strong><small>每周一、三、五 · 铃声后由念念陪你起床</small></div>
            <div className="item-actions"><button onClick={() => startContext({ kind: "alarm", title: "晨跑 5 公里", detail: "你正在准备第一次半马。只要穿上鞋出门，就已经完成一半。" })}>念念</button><button onClick={() => shareContext("晨跑 5 公里")}>分享</button></div>
          </article>
        )}
        {regularPlans.map((item) => (
          <article className="agenda-item schedule-item" key={item.time + item.title}>
            <time>{item.time}</time><i className="type-line" />
            <div className="item-copy"><span className="type-tag schedule-tag">□ 单次日程</span><strong>{item.title}</strong><small>{item.note}</small></div>
            <div className="item-actions"><button onClick={() => startContext({ kind: "schedule", title: item.title, detail: `${item.time} · ${item.note}` })}>念念</button><button onClick={() => shareContext(item.title)}>分享</button></div>
          </article>
        ))}
        {total === 0 && <div className="empty"><span>○</span><div><strong>这天还没有安排</strong><small>留白也很好</small></div></div>}
        {selectedDate === 7 && <div className="legend"><span><i className="alarm-dot" />周期闹钟：可单独关闭，响铃后继续和念念聊</span><span><i className="schedule-dot" />日程：单次事项，到点普通提醒</span></div>}
      </section>
    </section>
  );
}
