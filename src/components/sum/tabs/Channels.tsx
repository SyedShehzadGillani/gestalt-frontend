// Channels — Slack-pattern team messaging tab (v15 spec §4.1).
// Pure render: state (active channel, thread ID) lives in ClientMessaging.

import { useEffect, useRef } from "react";
import { Icon } from "@/components/sum/icons";
import {
  CHANNELS,
  DMS,
  HELPING_MESSAGES,
  MESSAGES,
  PROJECTS_LIST,
  REACTIONS_PALETTE,
  type SumMessage,
} from "@/data/sum-data";

interface Props {
  activeChannel: string;
  onActiveChannel: (name: string) => void;
  threadId: number | null;
  onThreadId: (id: number | null) => void;
}

function renderBody(m: SumMessage): (string | JSX.Element)[] {
  let text: (string | JSX.Element)[] = [m.text];
  if (m.mentions) {
    m.mentions.forEach((name) => {
      const next: (string | JSX.Element)[] = [];
      text.forEach((part) => {
        if (typeof part !== "string") { next.push(part); return; }
        const split = part.split(`@${name}`);
        split.forEach((s, i) => {
          if (i > 0)
            next.push(
              <span key={`${name}-${i}`} style={{ color: "var(--sum-blue)", background: "rgba(59,130,246,0.1)", padding: "1px 4px", fontWeight: 600 }}>
                @{name}
              </span>,
            );
          next.push(s);
        });
      });
      text = next;
    });
  }
  if (m.isAI) {
    const out: (string | JSX.Element)[] = [];
    const re = /(\([^)]*\d{4}[^)]*\))|(\$[\d,]+(?:\.\d+)?[KMB]?|\d+(?:\.\d+)?%|\d+\/\d+|\b\d+(?:,\d{3})+(?:\.\d+)?\b|\b\d+(?:\.\d+)?[KMB]\b)/g;
    text.forEach((part, idx) => {
      if (typeof part !== "string") { out.push(part); return; }
      let last = 0;
      let match: RegExpExecArray | null;
      let i = 0;
      while ((match = re.exec(part)) !== null) {
        if (match.index > last) out.push(part.slice(last, match.index));
        if (match[1]) out.push(<span key={`c-${idx}-${i}`}>{match[1]}</span>);
        else out.push(<strong key={`b-${idx}-${i}`} style={{ color: "var(--sum-gold)", fontWeight: 800 }}>{match[2]}</strong>);
        last = match.index + match[0].length;
        i++;
      }
      if (last < part.length) out.push(part.slice(last));
    });
    return out;
  }
  return text;
}

export function Channels({ activeChannel, onActiveChannel, threadId, onThreadId }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  let lastDay: string | null = null;
  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", width: "100%" }}>
      <ChannelSidebar activeChannel={activeChannel} onActiveChannel={onActiveChannel} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <ChannelHeader name={activeChannel} />
        <div ref={scrollRef} style={{ flex: 1, overflow: "auto" }}>
          {MESSAGES.map((m) => {
            const showDivider = m.day !== lastDay;
            lastDay = m.day;
            return (
              <div key={m.id}>
                {showDivider && <DayDivider day={m.day} />}
                <MessageRow m={m} selected={threadId === m.id} onOpenThread={() => onThreadId(m.id)} />
              </div>
            );
          })}
        </div>
        <Composer channel={activeChannel} />
      </div>
      {threadId !== null && <ThreadPane msgId={threadId} channel={activeChannel} onClose={() => onThreadId(null)} />}
    </div>
  );
}

function ChannelSidebar({ activeChannel, onActiveChannel }: { activeChannel: string; onActiveChannel: (n: string) => void }) {
  return (
    <aside style={{ width: 240, borderRight: "1px solid var(--sum-bdr)", overflow: "auto", padding: "16px 0", flexShrink: 0 }}>
      <div className="sum-section-header"><span>CHANNELS</span><button title="Add channel" style={{ color: "var(--sum-tx4)" }}><Icon name="plus" size={12} /></button></div>
      {CHANNELS.map((ch) => {
        const act = activeChannel === ch.name;
        return (
          <div key={ch.name} className={`sum-channel-row smooth${act ? " active" : ""}`} onClick={() => onActiveChannel(ch.name)}>
            <Icon name={ch.private ? "lock" : "hash"} size={12} />
            <span className="label">{ch.name}</span>
            {ch.pinned && <span title="Pinned" style={{ color: "var(--sum-gold)" }}><Icon name="pin" size={10} /></span>}
            {ch.unread > 0 && <span className="badge">{ch.unread}</span>}
          </div>
        );
      })}
      <div className="sum-section-header" style={{ paddingTop: 18 }}><span>PROJECTS</span><button style={{ color: "var(--sum-tx4)" }}><Icon name="plus" size={12} /></button></div>
      {PROJECTS_LIST.map((p) => (
        <div key={p.name} className="sum-channel-row smooth">
          <Icon name="folder" size={12} color="var(--sum-tx4)" />
          <span className="label">{p.name}</span>
          {p.unread > 0 && <span className="badge">{p.unread}</span>}
        </div>
      ))}
      <div className="sum-section-header" style={{ paddingTop: 18 }}><span>DIRECT MESSAGES</span></div>
      {DMS.map((d) => (
        <div key={d.name} className="sum-channel-row smooth">
          <span style={{ width: 8, height: 8, background: d.status === "online" ? "var(--sum-green)" : d.status === "away" ? "var(--sum-gold)" : "var(--sum-tx5)", flexShrink: 0 }} />
          <span className="label">{d.name}</span>
          {d.unread > 0 && <span className="badge">{d.unread}</span>}
        </div>
      ))}
    </aside>
  );
}

function ChannelHeader({ name }: { name: string }) {
  return (
    <header style={{ padding: "18px 28px", borderBottom: "1px solid var(--sum-bdr)", display: "flex", alignItems: "center", gap: 12 }}>
      <Icon name="hash" size={16} color="var(--sum-gold)" />
      <span style={{ fontSize: 18, fontWeight: 700 }}>{name}</span>
      <button title="Pin" className="smooth" style={{ color: "var(--sum-tx4)", padding: 4 }}><Icon name="pin" size={14} /></button>
      <button title="Members" className="smooth" style={{ color: "var(--sum-tx4)", padding: 4, display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="users" size={14} /><span style={{ fontSize: 12 }}>47</span>
      </button>
      <div style={{ flex: 1 }} />
      <button title="Search" className="smooth" style={{ color: "var(--sum-tx4)", padding: 4 }}><Icon name="search" size={14} /></button>
    </header>
  );
}

function DayDivider({ day }: { day: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 28px 8px" }}>
      <div style={{ flex: 1, height: 1, background: "var(--sum-bdr)" }} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", padding: "4px 12px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", borderRadius: 9 }}>{day}</span>
      <div style={{ flex: 1, height: 1, background: "var(--sum-bdr)" }} />
    </div>
  );
}

function MessageRow({ m, selected, onOpenThread }: { m: SumMessage; selected: boolean; onOpenThread: () => void }) {
  return (
    <div className={`msg${selected ? " selected" : ""}`} style={{ display: "flex", gap: 14, padding: "22px 28px", ...(selected ? { background: "rgba(226,181,63,0.08)", borderLeft: "3px solid var(--sum-gold)", paddingLeft: 25 } : {}) }}>
      <div style={{ width: 36, height: 36, background: m.isAI ? "rgba(226,181,63,0.1)" : "var(--sum-bg3)", border: m.isAI ? "1px solid rgba(226,181,63,0.3)" : "1px solid var(--sum-bdr)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: m.isAI ? "var(--sum-gold)" : "var(--sum-tx3)" }}>{m.avatar}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: m.isAI ? "var(--sum-gold)" : "var(--sum-tx)" }}>{m.user}</span>
          <span style={{ fontSize: 12, color: "var(--sum-tx4)" }}>{m.role}</span>
          <span style={{ fontSize: 12, color: "var(--sum-tx5)" }}>{m.time}</span>
          {m.edited && <span style={{ fontSize: 11, color: "var(--sum-tx5)", fontStyle: "italic" }}>(edited)</span>}
          {m.bookmarked && <span title="Saved" style={{ color: "var(--sum-gold)" }}><Icon name="bookmark" size={10} /></span>}
          {HELPING_MESSAGES.has(m.id) && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 7px", background: "rgba(95,204,0,0.15)", color: "var(--sum-green)", fontSize: 9, fontWeight: 800, letterSpacing: 1, borderRadius: 9 }}>
              <Icon name="sparkles" size={9} /> PARTICIPATION LOGGED
            </span>
          )}
        </div>
        <div style={{ fontSize: 14, color: m.isAI ? "var(--sum-gold2)" : "var(--sum-tx2)", lineHeight: 1.7, marginTop: m.isAI ? 10 : 6, ...(m.isAI ? { padding: "14px 16px", background: "rgba(226,181,63,0.05)", borderLeft: "2px solid var(--sum-gold)" } : {}) }}>
          {renderBody(m)}
        </div>
        {m.reactions.length > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
            {m.reactions.map((rx, i) => (
              <button key={i} className="smooth" style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", background: "var(--sum-bg3)", border: "1px solid var(--sum-bdr)", fontSize: 11, color: "var(--sum-tx2)" }}>
                <Icon name={rx.e} size={12} color="var(--sum-gold)" /><span style={{ fontWeight: 700 }}>{rx.count}</span>
              </button>
            ))}
            <button className="smooth" title="Add reaction" style={{ padding: "2px 6px", background: "transparent", border: "1px solid var(--sum-bdr)", color: "var(--sum-tx4)", display: "flex", gap: 2, alignItems: "center" }}>
              <Icon name="smile" size={12} /><Icon name="plus" size={10} />
            </button>
          </div>
        )}
        {m.threadCount > 0 && (
          <button onClick={onOpenThread} className="smooth" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "transparent", border: "1px solid var(--sum-bdr)", color: "var(--sum-blue)", fontSize: 12, fontWeight: 600 }}>
            <Icon name="msg" size={12} />
            <span>{m.threadCount} {m.threadCount === 1 ? "reply" : "replies"}</span>
            <span style={{ color: "var(--sum-tx4)", fontWeight: 400 }}>View thread</span>
          </button>
        )}
      </div>
      <div className="rxbar" style={{ position: "absolute", top: -12, right: 32, background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", padding: 4, gap: 2, zIndex: 5, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
        {REACTIONS_PALETTE.map((rx) => (
          <button key={rx.emoji} className="smooth" style={{ padding: 6, color: rx.color }}><Icon name={rx.icon} size={15} /></button>
        ))}
        <button className="smooth" style={{ padding: 6, color: "var(--sum-tx4)" }}><Icon name="smile" size={15} /></button>
        <button onClick={onOpenThread} className="smooth" style={{ padding: 6, color: "var(--sum-tx4)" }}><Icon name="msg" size={15} /></button>
        <button className="smooth" style={{ padding: 6, color: m.bookmarked ? "var(--sum-gold)" : "var(--sum-tx4)" }}><Icon name="bookmark" size={15} /></button>
      </div>
    </div>
  );
}

function Composer({ channel }: { channel: string }) {
  return (
    <div style={{ padding: "18px 28px", borderTop: "1px solid var(--sum-bdr)" }}>
      <div style={{ border: "1px solid var(--sum-bdr)", background: "var(--sum-inp)" }}>
        <div style={{ display: "flex", gap: 2, padding: "6px 8px", borderBottom: "1px solid var(--sum-bdr)" }}>
          {["bold", "italic", "underline", "link", "listUl", "listOl", "code"].map((t) => (
            <button key={t} className="smooth" style={{ padding: 5, color: "var(--sum-tx4)" }}><Icon name={t} size={14} /></button>
          ))}
          <div style={{ width: 1, background: "var(--sum-bdr)", margin: "4px 4px" }} />
          <button className="smooth" style={{ padding: 5, color: "var(--sum-tx4)" }}><Icon name="type" size={14} /></button>
        </div>
        <textarea placeholder={`Message #${channel}`} className="sum-input-pulse" style={{ width: "100%", minHeight: 42, padding: "10px 12px", background: "transparent", border: "none", resize: "vertical", fontSize: 14, lineHeight: 1.5, color: "inherit" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 8px", borderTop: "1px solid var(--sum-bdr)" }}>
          <button className="smooth" style={{ padding: 5, color: "var(--sum-tx4)" }}><Icon name="paperclip" size={14} /></button>
          <button className="smooth" style={{ padding: 5, color: "var(--sum-tx4)" }}><Icon name="at" size={14} /></button>
          <button className="smooth" style={{ padding: 5, color: "var(--sum-tx4)" }}><Icon name="smile" size={14} /></button>
          <div style={{ flex: 1 }} />
          <button title="Send" style={{ padding: "6px 12px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="send" size={12} /><span>SEND</span>
          </button>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "var(--sum-tx5)", marginTop: 6 }}>
        <span style={{ color: "var(--sum-tx4)" }}>No video huddles in Wave 1.</span> Voice and video are future features.
      </div>
    </div>
  );
}

function ThreadPane({ msgId, channel, onClose }: { msgId: number; channel: string; onClose: () => void }) {
  const m = MESSAGES.find((x) => x.id === msgId);
  if (!m) return null;
  const replies = [
    { author: "Sarah Chen", avatar: "SC", time: "9:24 AM", text: "Yes — Friday 2pm works. I'll bring the loyalty spectrum data." },
    { author: "Marcus Williams", avatar: "MW", time: "9:25 AM", text: "Perfect. Let's keep it tight, 30 min." },
    { author: "Priya Patel", avatar: "PP", time: "9:31 AM", text: "Can I sit in? Want to make sure my Story Engine submission aligns." },
    { author: "Marcus Williams", avatar: "MW", time: "9:32 AM", text: "Of course — invite incoming." },
  ];
  return (
    <aside style={{ width: 380, borderLeft: "1px solid var(--sum-bdr)", display: "flex", flexDirection: "column", background: "var(--sum-bg)" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--sum-bdr)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Thread</div>
          <div style={{ fontSize: 12, color: "var(--sum-tx4)" }}>#{channel}</div>
        </div>
        <button onClick={onClose} style={{ color: "var(--sum-tx4)", padding: 4 }}><Icon name="x" size={16} /></button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "14px 16px" }}>
        <div style={{ paddingBottom: 12, borderBottom: "1px solid var(--sum-bdr)", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 30, height: 30, background: "var(--sum-bg3)", border: "1px solid var(--sum-bdr)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "var(--sum-tx3)" }}>{m.avatar}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{m.user}</span>
                <span style={{ fontSize: 11, color: "var(--sum-tx5)" }}>{m.time}</span>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, marginTop: 3, color: "var(--sum-tx2)" }}>{m.text}</div>
            </div>
          </div>
        </div>
        {replies.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, background: "var(--sum-bg3)", border: "1px solid var(--sum-bdr)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "var(--sum-tx3)" }}>{r.avatar}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{r.author}</span>
                <span style={{ fontSize: 11, color: "var(--sum-tx5)" }}>{r.time}</span>
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, marginTop: 2, color: "var(--sum-tx2)" }}>{r.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--sum-bdr)" }}>
        <textarea placeholder="Reply..." className="sum-input-pulse" style={{ width: "100%", minHeight: 60, padding: "8px 10px", background: "var(--sum-inp)", border: "1px solid var(--sum-bdr)", resize: "vertical", fontSize: 14, color: "inherit" }} />
        <button style={{ marginTop: 6, padding: "5px 12px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 700 }}>REPLY</button>
      </div>
    </aside>
  );
}
