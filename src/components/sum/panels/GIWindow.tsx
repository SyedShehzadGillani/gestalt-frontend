import { useEffect, useRef, useState } from "react";
import { Icon } from "../icons";
import {
  GI_DEMO_RESPONSES,
  GI_SEED_MESSAGES,
  GI_SUGGESTIONS,
  GI_TAB_LABELS,
  GiMessage,
} from "@/data/sum-mock";

interface Props {
  open: boolean;
  onClose: () => void;
  tabId?: string;
}

const renderInline = (
  text: string,
  links?: { label: string; target: string }[],
) => {
  // Parse **bold**. Wrap link labels with gold style.
  const parts: (string | JSX.Element)[] = [];
  let cursor = 0;
  let i = 0;
  const re = /\*\*([^*]+)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > cursor) parts.push(text.slice(cursor, m.index));
    parts.push(
      <strong
        key={`b-${i++}`}
        style={{ color: "var(--sum-gold)", fontWeight: 800 }}
      >
        {m[1]}
      </strong>,
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  // Wrap link labels (case-sensitive) with gold class
  if (links?.length) {
    return parts.flatMap((p, idx) => {
      if (typeof p !== "string") return [p];
      let chunk: (string | JSX.Element)[] = [p];
      links.forEach((lk) => {
        const next: (string | JSX.Element)[] = [];
        chunk.forEach((c) => {
          if (typeof c !== "string") {
            next.push(c);
            return;
          }
          const split = c.split(lk.label);
          split.forEach((s, k) => {
            if (k > 0)
              next.push(
                <span
                  key={`l-${idx}-${k}`}
                  style={{
                    color: "var(--sum-gold)",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {lk.label}
                </span>,
              );
            if (s) next.push(s);
          });
        });
        chunk = next;
      });
      return chunk;
    });
  }
  return parts;
};

export function GIWindow({ open, onClose, tabId = "chat" }: Props) {
  const [messages, setMessages] = useState<GiMessage[]>(() =>
    GI_SEED_MESSAGES.slice(),
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const feedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (feedRef.current)
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages, typing, open]);

  if (!open) return null;

  const ctxLabel = GI_TAB_LABELS[tabId] ?? tabId.toUpperCase();
  const hasUser = messages.some((m) => m.role === "user");

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    const userMsg: GiMessage = {
      id: `gi-u-${Date.now()}`,
      type: "user",
      role: "user",
      text,
      timestamp: "Just now",
    };
    setMessages((cur) => [...cur, userMsg]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      const demo = GI_DEMO_RESPONSES[text];
      const reply: GiMessage = demo
        ? {
            id: `gi-r-${Date.now()}`,
            type: "response",
            role: "ai",
            text: demo.text,
            links: demo.links,
            frankMode: demo.frankMode,
            timestamp: "Just now",
          }
        : {
            id: `gi-r-${Date.now()}`,
            type: "response",
            role: "ai",
            text: "Got it. I'll surface a deeper read on that next time you're in a relevant tab — one signal isn't enough yet to be sure I'm right.",
            timestamp: "Just now",
          };
      setMessages((cur) => [...cur, reply]);
      setTyping(false);
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-label="GESTALT INTELLIGENCE"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 151,
        width: 420,
        height: 580,
        maxWidth: "90vw",
        maxHeight: "90vh",
        background: "var(--sum-bg2)",
        border: "1px solid var(--sum-bdr)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--sum-bdr)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--sum-bg2)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            flexShrink: 0,
            background: "linear-gradient(135deg, #c9a227 0%, #e2b53f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5z" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.5,
              color: "var(--sum-tx)",
            }}
          >
            GESTALT INTELLIGENCE
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--sum-tx5)",
              marginTop: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Currently viewing: {ctxLabel}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => setMessages(GI_SEED_MESSAGES.slice())}
            title="Clear conversation"
            style={{
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--sum-tx4)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Icon name="x" size={13} />
          </button>
          <button
            onClick={onClose}
            title="Minimize"
            style={{
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--sum-tx4)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Icon name="x" size={15} />
          </button>
        </div>
      </header>
      <div
        ref={feedRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((m) => (
          <Message key={m.id} m={m} />
        ))}
        {typing && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "11px 14px",
              background: "rgba(226,181,63,0.06)",
              borderLeft: "2px solid var(--sum-gold)",
            }}
          >
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </div>
        )}
      </div>
      <div
        style={{
          borderTop: "1px solid var(--sum-bdr)",
          padding: "12px 14px",
          flexShrink: 0,
          background: "var(--sum-bg2)",
        }}
      >
        {!hasUser && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 10,
            }}
          >
            {GI_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: "1px solid var(--sum-bdr2)",
                  color: "var(--sum-tx3)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: 0.3,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--sum-inp)",
            border: "1px solid var(--sum-bdr)",
            padding: "8px 10px",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Ask anything — about your data, your business, your strategy..."
            style={{
              flex: 1,
              minHeight: 20,
              maxHeight: 140,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "var(--sum-tx)",
              fontSize: 14,
              lineHeight: 1.5,
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            style={{
              width: 32,
              height: 32,
              background: "var(--sum-gold)",
              color: "#000",
              border: "none",
              cursor: input.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              opacity: input.trim() ? 1 : 0.3,
            }}
          >
            <Icon name="send" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Message({ m }: { m: GiMessage }) {
  const isAi = m.role === "ai";
  const labelText =
    m.type === "narration"
      ? "NARRATION"
      : m.type === "nudge"
        ? "NUDGE"
        : m.type === "response"
          ? "RESPONSE"
          : "";
  const bubbleStyle: React.CSSProperties = {
    padding: "11px 14px",
    fontSize: 12,
    lineHeight: 1.65,
    color: isAi ? "var(--sum-gold2)" : "var(--sum-tx2)",
    maxWidth: "100%",
    ...(isAi
      ? {
          background:
            m.type === "nudge"
              ? "rgba(95,204,0,0.06)"
              : "rgba(226,181,63,0.06)",
          borderLeft: `2px solid ${m.type === "nudge" ? "var(--sum-green)" : "var(--sum-gold)"}`,
        }
      : {
          background: "var(--sum-bg3)",
          alignSelf: "flex-end",
          color: "var(--sum-tx2)",
        }),
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {isAi && labelText && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 9,
            color: "var(--sum-tx5)",
            letterSpacing: 0.5,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              color:
                m.type === "nudge" ? "var(--sum-green)" : "var(--sum-gold)",
              letterSpacing: 1,
            }}
          >
            {labelText}
          </span>
          <span>·</span>
          <span>{m.timestamp}</span>
        </div>
      )}
      <div style={bubbleStyle}>{renderInline(m.text, m.links)}</div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--sum-gold)",
        animation: "sumGiDot 1.4s infinite ease-in-out both",
        animationDelay: `${delay}s`,
      }}
    />
  );
}
