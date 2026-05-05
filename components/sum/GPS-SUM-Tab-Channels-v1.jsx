// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-Tab-Channels-v1.jsx
// S.U.M. Module — CHANNELS tab
// Source: gestalt-sum-mockup-04-30-v15.html
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  Hash, Lock, Pin, Folder, Plus, Search, Users,
  MessageSquare, Smile, Bookmark, Forward, MoreHorizontal,
  Bold, Italic, Underline, Link2, List, ListOrdered, Code, Type,
  Paperclip, AtSign, Send, X,
  Sparkles, CheckCheck, Flame, Heart, Eye,
} from "lucide-react";
import {
  CHANNELS, PROJECTS_LIST, DMS, MESSAGES, HELPING_MESSAGES, REACTIONS_PALETTE,
} from "../../constants/GPS-SUM-Data-v1";


const REACTION_ICON = {
  check: CheckCheck,
  flame: Flame,
  heart: Heart,
  eye:   Eye,
  smile: Smile,
};


// ═══════════════════════════════════════════════════════════════════════════
// CHANNELS TAB
// ═══════════════════════════════════════════════════════════════════════════
export default function SumTabChannels(props) {
  const {
    activeChannel, setActiveChannel,
    chatInput, setChatInput,
    threadOpenId, setThreadOpenId,
  } = props;

  return (
    <div style={{
      flex: 1,
      display: "flex",
      minHeight: 0,
      overflow: "hidden",
      background: "var(--bg)",
      color: "var(--tx)",
    }}>
      <ChannelSidebar activeChannel={activeChannel} setActiveChannel={setActiveChannel} />

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
      }}>
        <ChannelHeader activeChannel={activeChannel} />
        <MessageStream threadOpenId={threadOpenId} setThreadOpenId={setThreadOpenId} />
        <Composer activeChannel={activeChannel} chatInput={chatInput} setChatInput={setChatInput} />
      </div>

      {threadOpenId !== null && (
        <ThreadPane
          messageId={threadOpenId}
          activeChannel={activeChannel}
          onClose={() => setThreadOpenId(null)}
        />
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// CHANNEL SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════
function ChannelSidebar({ activeChannel, setActiveChannel }) {
  return (
    <div style={{
      width: 240,
      borderRight: "1px solid var(--bdr)",
      background: "var(--bg2)",
      overflowY: "auto",
      flexShrink: 0,
      paddingBottom: 16,
    }}>
      <SidebarHeader label="CHANNELS" />
      {CHANNELS.map(ch => {
        const active = activeChannel === ch.name;
        const ChannelIcon = ch.private ? Lock : Hash;
        return (
          <div
            key={ch.name}
            onClick={() => setActiveChannel(ch.name)}
            style={{
              padding: "8px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              background: active ? "var(--hover)" : "transparent",
              borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
              transition: "background .15s",
            }}
          >
            <ChannelIcon
              size={14}
              strokeWidth={1.5}
              fill="none"
              color={active ? "var(--gold)" : "var(--tx4)"}
            />
            <span style={{
              flex: 1,
              fontSize: "var(--t-body)",
              fontWeight: active ? 700 : 500,
              color: active ? "var(--gold)" : "var(--tx2)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {ch.name}
            </span>
            {ch.pinned && <Pin size={11} strokeWidth={1.5} fill="none" color="var(--tx5)" />}
            {ch.unread > 0 && <Badge count={ch.unread} />}
          </div>
        );
      })}

      <SidebarHeader label="PROJECTS" />
      {PROJECTS_LIST.map(p => (
        <div
          key={p.name}
          style={{
            padding: "8px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            borderLeft: "2px solid transparent",
          }}
        >
          <Folder size={14} strokeWidth={1.5} fill="none" color="var(--tx4)" />
          <span style={{
            flex: 1,
            fontSize: "var(--t-body)",
            fontWeight: 500,
            color: "var(--tx2)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {p.name}
          </span>
          {p.unread > 0 && <Badge count={p.unread} />}
        </div>
      ))}

      <SidebarHeader label="DIRECT MESSAGES" />
      {DMS.map(d => {
        const dotColor = d.status === "online" ? "var(--green)"
                       : d.status === "away"   ? "var(--gold)"
                       : "var(--tx5)";
        return (
          <div
            key={d.name}
            style={{
              padding: "8px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              borderLeft: "2px solid transparent",
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: dotColor,
              flexShrink: 0,
              display: "inline-block",
            }} />
            <span style={{
              flex: 1,
              fontSize: "var(--t-body)",
              fontWeight: 500,
              color: "var(--tx2)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {d.name}
            </span>
            {d.unread > 0 && <Badge count={d.unread} />}
          </div>
        );
      })}
    </div>
  );
}

function SidebarHeader({ label }) {
  return (
    <div style={{
      padding: "16px 18px 6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <span style={{
        fontSize: "var(--t-micro)",
        fontWeight: 800,
        letterSpacing: 1.5,
        color: "var(--tx5)",
      }}>
        {label}
      </span>
      <button style={{
        background: "transparent",
        border: "none",
        color: "var(--tx5)",
        cursor: "pointer",
        padding: 2,
        display: "flex",
      }}>
        <Plus size={12} strokeWidth={1.5} />
      </button>
    </div>
  );
}

function Badge({ count }) {
  return (
    <span style={{
      minWidth: 18,
      height: 18,
      padding: "0 5px",
      background: "var(--gold)",
      color: "#000",
      borderRadius: 2,
      fontSize: "var(--t-micro)",
      fontWeight: 800,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {count}
    </span>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// CHANNEL HEADER
// ═══════════════════════════════════════════════════════════════════════════
function ChannelHeader({ activeChannel }) {
  return (
    <div style={{
      padding: "12px 20px",
      borderBottom: "1px solid var(--bdr)",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0,
    }}>
      <Hash size={16} strokeWidth={1.5} fill="none" color="var(--tx3)" />
      <span style={{ fontSize: "var(--t-h3)", fontWeight: 700 }}>
        {activeChannel}
      </span>
      <button style={iconBtnStyle}>
        <Pin size={13} strokeWidth={1.5} fill="none" />
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--tx4)" }}>
        <Users size={13} strokeWidth={1.5} fill="none" />
        <span style={{ fontSize: "var(--t-caption)" }}>47</span>
      </div>
      <div style={{ flex: 1 }} />
      <button style={iconBtnStyle}>
        <Search size={14} strokeWidth={1.5} fill="none" />
      </button>
    </div>
  );
}

const iconBtnStyle = {
  background: "transparent",
  border: "none",
  color: "var(--tx4)",
  padding: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};


// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE STREAM
// ═══════════════════════════════════════════════════════════════════════════
function MessageStream({ threadOpenId, setThreadOpenId }) {
  let lastDay = null;
  return (
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: "12px 20px",
      minHeight: 0,
    }}>
      {MESSAGES.map(m => {
        const showDateDivider = m.day !== lastDay;
        lastDay = m.day;
        return (
          <React.Fragment key={m.id}>
            {showDateDivider && <DateDivider day={m.day} />}
            <Message
              m={m}
              isThreadOpen={threadOpenId === m.id}
              onOpenThread={() => setThreadOpenId(m.id)}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

function DateDivider({ day }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      margin: "16px 0 10px",
    }}>
      <div style={{ flex: 1, height: 1, background: "var(--bdr)" }} />
      <span style={{
        fontSize: "var(--t-micro)",
        fontWeight: 700,
        letterSpacing: 1,
        color: "var(--tx5)",
      }}>
        {day}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--bdr)" }} />
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE
// ═══════════════════════════════════════════════════════════════════════════
function Message({ m, isThreadOpen, onOpenThread }) {
  const isAI = !!m.isAI;
  return (
    <div style={{
      position: "relative",
      display: "flex",
      gap: 12,
      padding: "8px 8px",
      marginBottom: 4,
      borderLeft: isAI ? "2px solid var(--gold)" : "2px solid transparent",
      background: isAI ? "rgba(226,181,63,0.04)" : "transparent",
      borderRadius: 2,
    }}>
      <Avatar avatar={m.avatar} isAI={isAI} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontSize: "var(--t-body)",
            fontWeight: 700,
            color: isAI ? "var(--gold)" : "var(--tx)",
          }}>
            {m.user}
          </span>
          <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)", fontWeight: 600 }}>
            {m.role}
          </span>
          <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>{m.time}</span>
          {m.edited && (
            <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)", fontStyle: "italic" }}>
              (edited)
            </span>
          )}
          {m.bookmarked && <Bookmark size={11} strokeWidth={1.5} fill="none" color="var(--gold)" />}
          {HELPING_MESSAGES.has(m.id) && <ParticipationPill />}
        </div>

        <MessageBody m={m} />

        {m.reactions && m.reactions.length > 0 && (
          <ReactionRow reactions={m.reactions} />
        )}

        {m.threadCount > 0 && (
          <button
            onClick={onOpenThread}
            style={{
              marginTop: 6,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 8px",
              background: "transparent",
              border: "1px solid var(--bdr)",
              borderRadius: 2,
              color: "var(--blue)",
              fontSize: "var(--t-micro)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <MessageSquare size={11} strokeWidth={1.5} fill="none" />
            <span>{m.threadCount} {m.threadCount === 1 ? "reply" : "replies"}</span>
            <span style={{ color: "var(--tx5)", fontWeight: 500 }}>View thread</span>
          </button>
        )}
      </div>

      <HoverReactionBar onOpenThread={onOpenThread} bookmarked={m.bookmarked} />
    </div>
  );
}

function Avatar({ avatar, isAI }) {
  return (
    <div style={{
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: isAI ? "rgba(226,181,63,0.15)" : "var(--bg3)",
      border: isAI ? "1px solid var(--gold)" : "1px solid var(--bdr)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      {isAI ? (
        <Sparkles size={16} strokeWidth={1.5} fill="none" color="var(--gold)" />
      ) : (
        <span style={{
          fontSize: "var(--t-caption)",
          fontWeight: 800,
          color: "var(--tx3)",
        }}>
          {avatar}
        </span>
      )}
    </div>
  );
}

function ParticipationPill() {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 7px",
      background: "rgba(95,204,0,0.12)",
      border: "1px solid var(--green)",
      borderRadius: 2,
      color: "var(--green)",
      fontSize: "var(--t-micro)",
      fontWeight: 800,
      letterSpacing: 1,
    }}>
      <CheckCheck size={10} strokeWidth={1.5} fill="none" />
      PARTICIPATION LOGGED
    </span>
  );
}

function ReactionRow({ reactions }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
      {reactions.map((rx, i) => {
        const Icon = REACTION_ICON[rx.e] || Smile;
        return (
          <span key={i} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 7px",
            background: "var(--bg3)",
            border: "1px solid var(--bdr)",
            borderRadius: 2,
            fontSize: "var(--t-micro)",
            color: "var(--tx3)",
            cursor: "pointer",
          }}>
            <Icon size={11} strokeWidth={1.5} fill="none" />
            <span style={{ fontWeight: 700 }}>{rx.count}</span>
          </span>
        );
      })}
      <button style={{
        padding: "2px 6px",
        background: "transparent",
        border: "1px dashed var(--bdr)",
        borderRadius: 2,
        color: "var(--tx5)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      }}>
        <Smile size={11} strokeWidth={1.5} fill="none" />
      </button>
    </div>
  );
}

function HoverReactionBar({ onOpenThread, bookmarked }) {
  return (
    <div style={{
      position: "absolute",
      top: 4,
      right: 8,
      display: "flex",
      gap: 0,
      background: "var(--bg2)",
      border: "1px solid var(--bdr)",
      borderRadius: 2,
      opacity: 0.6,
    }}>
      {REACTIONS_PALETTE.slice(0, 3).map(rx => {
        const Icon = REACTION_ICON[rx.icon] || Smile;
        return (
          <button key={rx.emoji} style={hoverBtn(rx.color)}>
            <Icon size={12} strokeWidth={1.5} fill="none" />
          </button>
        );
      })}
      <button style={hoverBtn("var(--tx4)")} onClick={onOpenThread}>
        <MessageSquare size={12} strokeWidth={1.5} fill="none" />
      </button>
      <button style={hoverBtn(bookmarked ? "var(--gold)" : "var(--tx4)")}>
        <Bookmark size={12} strokeWidth={1.5} fill="none" />
      </button>
      <button style={hoverBtn("var(--tx4)")}>
        <Forward size={12} strokeWidth={1.5} fill="none" />
      </button>
      <button style={hoverBtn("var(--tx4)")}>
        <MoreHorizontal size={12} strokeWidth={1.5} fill="none" />
      </button>
    </div>
  );
}

function hoverBtn(color) {
  return {
    padding: 6,
    color,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE BODY
// ═══════════════════════════════════════════════════════════════════════════
function MessageBody({ m }) {
  const html = buildMessageHtml(m);
  return (
    <div
      style={{
        fontSize: "var(--t-body)",
        lineHeight: 1.6,
        marginTop: 3,
        color: m.isAI ? "rgba(226,181,63,0.75)" : "var(--tx2)",
        wordBreak: "break-word",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function buildMessageHtml(m) {
  let text = String(m.text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (m.mentions) {
    m.mentions.forEach(name => {
      const safe = name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const re = new RegExp(`@${safe}`, "g");
      text = text.replace(
        re,
        `<span style="color:var(--blue);background:rgba(59,130,246,0.1);padding:1px 4px;font-weight:600;border-radius:2px">@${safe}</span>`
      );
    });
  }

  if (m.isAI) {
    const citations = [];
    text = text.replace(/\([^)]*\d{4}[^)]*\)/g, match => {
      citations.push(match);
      return `__CITE${citations.length - 1}__`;
    });
    text = text.replace(
      /(\$[\d,]+(?:\.\d+)?[KMB]?|\d+(?:\.\d+)?%|\d+\/\d+|\b\d+(?:,\d{3})+(?:\.\d+)?\b|\b\d+(?:\.\d+)?[KMB]\b)/g,
      `<strong style="color:var(--gold);font-weight:800">$1</strong>`
    );
    citations.forEach((c, i) => {
      text = text.replace(`__CITE${i}__`, c);
    });
  }

  return text;
}


// ═══════════════════════════════════════════════════════════════════════════
// COMPOSER
// ═══════════════════════════════════════════════════════════════════════════
function Composer({ activeChannel, chatInput, setChatInput }) {
  return (
    <div style={{ padding: "10px 20px 14px", flexShrink: 0 }}>
      <div style={{
        background: "var(--inp)",
        border: "1px solid var(--bdr)",
        borderRadius: 2,
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "5px 8px",
          borderBottom: "1px solid var(--bdr)",
        }}>
          {[Bold, Italic, Underline, Link2, List, ListOrdered, Code].map((Icon, i) => (
            <button key={i} style={{
              padding: 5,
              color: "var(--tx4)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
            }}>
              <Icon size={13} strokeWidth={1.5} fill="none" />
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{
            padding: 5,
            color: "var(--tx4)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
          }}>
            <Type size={13} strokeWidth={1.5} fill="none" />
          </button>
        </div>

        <textarea
          className="gold-input"
          placeholder={`Message #${activeChannel}`}
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          style={{
            width: "100%",
            minHeight: 42,
            padding: "10px 12px",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "vertical",
            fontSize: "var(--t-body)",
            lineHeight: 1.5,
            color: "var(--tx)",
            fontFamily: "inherit",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 8px", borderTop: "1px solid var(--bdr)" }}>
          <button style={{ padding: 5, color: "var(--tx4)", background: "transparent", border: "none", cursor: "pointer", display: "flex" }}>
            <Paperclip size={14} strokeWidth={1.5} fill="none" />
          </button>
          <button style={{ padding: 5, color: "var(--tx4)", background: "transparent", border: "none", cursor: "pointer", display: "flex" }}>
            <AtSign size={14} strokeWidth={1.5} fill="none" />
          </button>
          <button style={{ padding: 5, color: "var(--tx4)", background: "transparent", border: "none", cursor: "pointer", display: "flex" }}>
            <Smile size={14} strokeWidth={1.5} fill="none" />
          </button>
          <div style={{ flex: 1 }} />
          <button style={{
            padding: "6px 12px",
            background: "var(--gold)",
            color: "#000",
            fontSize: "var(--t-caption)",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "none",
            borderRadius: 2,
            cursor: "pointer",
          }}>
            <Send size={12} strokeWidth={1.5} fill="none" /><span>SEND</span>
          </button>
        </div>
      </div>

      <div style={{ fontSize: "var(--t-micro)", color: "var(--tx5)", marginTop: 6 }}>
        <span style={{ color: "var(--tx4)" }}>No video huddles in Wave 1.</span> Voice and video are future features.
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// THREAD PANE
// ═══════════════════════════════════════════════════════════════════════════
function ThreadPane({ messageId, activeChannel, onClose }) {
  const original = MESSAGES.find(x => x.id === messageId);
  if (!original) return null;

  const replies = [
    { author: "Sarah Chen",      avatar: "SC", time: "9:24 AM", text: "Yes — Friday 2pm works. I'll bring the loyalty spectrum data." },
    { author: "Marcus Williams", avatar: "MW", time: "9:25 AM", text: "Perfect. Let's keep it tight, 30 min." },
    { author: "Priya Patel",     avatar: "PP", time: "9:31 AM", text: "Can I sit in? Want to make sure my Story Engine submission aligns." },
    { author: "Marcus Williams", avatar: "MW", time: "9:32 AM", text: "Of course — invite incoming." },
  ];

  return (
    <div style={{
      width: 380,
      borderLeft: "1px solid var(--bdr)",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg)",
      flexShrink: 0,
    }}>
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--bdr)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: "var(--t-h3)", fontWeight: 700 }}>Thread</div>
          <div style={{ fontSize: "var(--t-caption)", color: "var(--tx4)" }}>#{activeChannel}</div>
        </div>
        <button onClick={onClose} style={{ ...iconBtnStyle, padding: 4 }}>
          <X size={16} strokeWidth={1.5} fill="none" />
        </button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "14px 16px", minHeight: 0 }}>
        <div style={{ paddingBottom: 12, borderBottom: "1px solid var(--bdr)", marginBottom: 12 }}>
          <ThreadMessageRow m={original} />
        </div>
        {replies.map((r, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <ThreadReplyRow r={r} />
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 16px", borderTop: "1px solid var(--bdr)", flexShrink: 0 }}>
        <textarea
          className="gold-input"
          placeholder="Reply..."
          style={{
            width: "100%",
            minHeight: 60,
            padding: "8px 10px",
            background: "var(--inp)",
            border: "1px solid var(--bdr)",
            borderRadius: 2,
            outline: "none",
            resize: "vertical",
            fontSize: "var(--t-body)",
            color: "var(--tx)",
            fontFamily: "inherit",
          }}
        />
        <button style={{
          marginTop: 6,
          padding: "5px 12px",
          background: "var(--gold)",
          color: "#000",
          fontSize: "var(--t-caption)",
          fontWeight: 700,
          border: "none",
          borderRadius: 2,
          cursor: "pointer",
        }}>
          REPLY
        </button>
      </div>
    </div>
  );
}

function ThreadMessageRow({ m }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{
        width: 30,
        height: 30,
        background: "var(--bg3)",
        border: "1px solid var(--bdr)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "var(--t-caption)", fontWeight: 800, color: "var(--tx3)" }}>
          {m.avatar}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: "var(--t-body)", fontWeight: 700 }}>{m.user}</span>
          <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>{m.time}</span>
        </div>
        <div
          style={{ fontSize: "var(--t-body)", lineHeight: 1.6, marginTop: 3, color: "var(--tx2)" }}
          dangerouslySetInnerHTML={{ __html: buildMessageHtml(m) }}
        />
      </div>
    </div>
  );
}

function ThreadReplyRow({ r }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{
        width: 28,
        height: 28,
        background: "var(--bg3)",
        border: "1px solid var(--bdr)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "var(--t-micro)", fontWeight: 800, color: "var(--tx3)" }}>
          {r.avatar}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: "var(--t-caption)", fontWeight: 700 }}>{r.author}</span>
          <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>{r.time}</span>
        </div>
        <div style={{ fontSize: "var(--t-body)", lineHeight: 1.6, marginTop: 2, color: "var(--tx2)" }}>
          {r.text}
        </div>
      </div>
    </div>
  );
}
