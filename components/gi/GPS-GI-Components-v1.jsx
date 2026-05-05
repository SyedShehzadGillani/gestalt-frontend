// ═══════════════════════════════════════════════════════════════════════════
// GPS-GI-Components-v1.jsx
// GESTALT INTELLIGENCE — site-wide bubble + window + message components
// Source: gestalt-sum-mockup-04-30-v15.html (giRenderBubble + giRenderWindow + giRenderMessage)
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════
//
// Three components in one file:
//   - GIBubble: floating gold bubble, bottom-right, pulses when proactive
//   - GIWindow: draggable expanded chat window
//   - GIMessage: single message render (narration / nudge / response / frank-prompt)
//
// Plus:
//   - formatText: utility to convert **bold** markdown to <strong>
//   - GISiteWide (default export): combined wrapper that mounts both bubble + window
//
// LOCKED RULES:
//   - Bubble: 56×56 gold gradient circle, hidden when window open
//   - Window: 420×600 default, draggable from header, resizable corner handle
//   - Window persists across tab navigation
//   - Auto-scroll feed to bottom on new messages
//   - Suggestion chips visible only when no user messages sent yet
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  Trash2, X, Send, Bookmark, Lock, Clock, ArrowRight,
} from "lucide-react";
import { GI_SUGGESTIONS } from "../../constants/GPS-SUM-Data-v1";


// ═══════════════════════════════════════════════════════════════════════════
// formatText — escape HTML + convert **bold** to <strong>
// ═══════════════════════════════════════════════════════════════════════════

export function formatText(text) {
  const escaped = String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withBold = escaped.replace(
    /\*\*(.+?)\*\*/g,
    '<strong style="color:var(--gold);font-weight:700">$1</strong>'
  );
  return { __html: withBold };
}


// ═══════════════════════════════════════════════════════════════════════════
// TAB LABEL MAP
// ═══════════════════════════════════════════════════════════════════════════

const TAB_LABELS = {
  chat:      "CHANNELS",
  slideshow: "DAILY SLIDESHOW",
  journal:   "PERSONAL JOURNAL",
  stories:   "STORY ENGINE",
  polls:     "POLLS",
  metrics:   "METRICS",
  notes:     "NOTES",
};


// ═══════════════════════════════════════════════════════════════════════════
// SITE-WIDE WRAPPER — mounts bubble + window together
// ═══════════════════════════════════════════════════════════════════════════

export default function GISiteWide({ gi }) {
  const { state, handlers, refs } = gi;
  return (
    <>
      <GIBubble
        giHasProactive={state.giHasProactive}
        giOpen={state.giOpen}
        onToggle={handlers.giToggle}
      />
      {state.giOpen && (
        <GIWindow
          state={state}
          handlers={handlers}
          feedRef={refs.feedRef}
        />
      )}
    </>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// GI BUBBLE — bottom-right floating button
// ═══════════════════════════════════════════════════════════════════════════

export function GIBubble({ giHasProactive, giOpen, onToggle }) {
  if (giOpen) return null;

  return (
    <div
      onClick={onToggle}
      className={`gi-bubble${giHasProactive ? " has-proactive" : ""}`}
      title="GESTALT INTELLIGENCE (⌘K)"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, #f0c66f, #c9961f)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 9999,
        transition: "transform .2s ease",
      }}
    >
      {/* Sparkle / intelligence glyph — custom line-art SVG */}
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
           stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        <circle cx="12" cy="12" r="3" />
      </svg>

      {/* Hover label */}
      <div
        className="gi-bubble-label"
        style={{
          position: "absolute",
          right: 68,
          top: "50%",
          transform: "translateY(-50%)",
          padding: "5px 10px",
          background: "var(--bg)",
          border: "1px solid var(--bdr)",
          borderRadius: 2,
          color: "var(--tx)",
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: "nowrap",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity .2s ease",
        }}
      >
        GESTALT INTELLIGENCE — ask anything (⌘K)
      </div>

      {/* Proactive green status dot — allowed exception */}
      {giHasProactive && (
        <div style={{
          position: "absolute",
          top: 4,
          right: 4,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "var(--green)",
          border: "2px solid #000",
        }} />
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// GI WINDOW — expanded draggable chat window
// ═══════════════════════════════════════════════════════════════════════════

export function GIWindow({ state, handlers, feedRef }) {
  const {
    giMessages, giInput, giTyping, giWindowX, giWindowY, giWindowW, giWindowH,
    currentTab, hasUserMessages, giSavePickerFor,
  } = state;
  const {
    giToggle, giClear, giSetInput, giSend, giSendSuggestion,
    giSaveToggle, giSave, giFrankYes, giFrankNo, giHandleLink,
    giDragStart, giResizeStart,
  } = handlers;

  const positionStyle = giWindowX !== null && giWindowY !== null
    ? { left: giWindowX, top: giWindowY, width: giWindowW, height: giWindowH }
    : { right: 24, bottom: 24, width: giWindowW, height: giWindowH };

  const ctxLabel = TAB_LABELS[currentTab] || (currentTab || "").toUpperCase();

  function handleInputKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      giSend();
    }
  }

  return (
    <div
      className="gi-window"
      style={{
        position: "fixed",
        ...positionStyle,
        background: "var(--bg)",
        border: "1px solid var(--bdr2)",
        borderRadius: 2,
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* ─── Header (draggable) ────────────────────────────────────── */}
      <div
        onMouseDown={giDragStart}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderBottom: "1px solid var(--bdr)",
          background: "var(--bg2)",
          cursor: "grab",
          userSelect: "none",
        }}
      >
        {/* Mark */}
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #f0c66f, #c9961f)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
          </svg>
        </div>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12, fontWeight: 800, color: "var(--gold)",
            letterSpacing: 1.2,
          }}>
            GESTALT INTELLIGENCE
          </div>
          <div style={{ fontSize: 10, color: "var(--tx4)", marginTop: 1 }}>
            Currently viewing: {ctxLabel}
          </div>
        </div>

        {/* Header buttons */}
        <div style={{ display: "flex", gap: 2 }}>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); giClear(); }}
            title="Clear conversation"
            style={headerBtn}
          >
            <Trash2 size={13} />
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); giToggle(); }}
            title="Minimize"
            style={headerBtn}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ─── Conversation feed ─────────────────────────────────────── */}
      <div
        ref={feedRef}
        style={{
          flex: 1,
          overflow: "auto",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          minHeight: 0,
        }}
      >
        {giMessages.map((m) => (
          <GIMessage
            key={m.id}
            m={m}
            giSavePickerFor={giSavePickerFor}
            onSaveToggle={giSaveToggle}
            onSave={giSave}
            onFrankYes={giFrankYes}
            onFrankNo={giFrankNo}
            onLinkClick={giHandleLink}
          />
        ))}
        {giTyping && <TypingIndicator />}
      </div>

      {/* ─── Composer ──────────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid var(--bdr)",
        padding: 10,
        background: "var(--bg2)",
      }}>
        {/* Suggestion chips */}
        {!hasUserMessages && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            marginBottom: 8,
          }}>
            {GI_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => giSendSuggestion(s)}
                style={suggestionChip}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
          background: "var(--inp)",
          border: "1px solid var(--bdr)",
          borderRadius: 2,
          padding: 6,
        }}>
          <textarea
            id="gi-input"
            className="gold-input"
            value={giInput}
            onChange={(e) => giSetInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Ask GESTALT INTELLIGENCE anything..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--tx)",
              fontFamily: "inherit",
              maxHeight: 140,
              padding: "4px 4px",
            }}
          />
          <button
            onClick={giSend}
            disabled={!giInput.trim()}
            title="Send"
            style={{
              padding: 7,
              background: giInput.trim() ? "var(--gold)" : "var(--bg3)",
              color: giInput.trim() ? "#000" : "var(--tx5)",
              border: "none",
              borderRadius: 2,
              cursor: giInput.trim() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* ─── Resize handle ─────────────────────────────────────────── */}
      <div
        onMouseDown={giResizeStart}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 14,
          height: 14,
          cursor: "nwse-resize",
          background: "linear-gradient(135deg, transparent 50%, var(--tx5) 50%, var(--tx5) 60%, transparent 60%, transparent 70%, var(--tx5) 70%, var(--tx5) 80%, transparent 80%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}

const headerBtn = {
  padding: 5,
  background: "transparent",
  border: "none",
  color: "var(--tx3)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  borderRadius: 2,
};

const suggestionChip = {
  padding: "5px 10px",
  background: "rgba(226,181,63,0.08)",
  border: "1px solid rgba(226,181,63,0.25)",
  color: "var(--gold)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.3,
  borderRadius: 2,
  cursor: "pointer",
};


// ═══════════════════════════════════════════════════════════════════════════
// GI MESSAGE — single message bubble
// ═══════════════════════════════════════════════════════════════════════════

export function GIMessage({
  m, giSavePickerFor, onSaveToggle, onSave,
  onFrankYes, onFrankNo, onLinkClick,
}) {

  // Frank-mode prompt
  if (m.type === "frank-prompt") {
    return (
      <div style={{
        padding: 12,
        background: "rgba(226,181,63,0.08)",
        border: "1px solid rgba(226,181,63,0.4)",
        borderRadius: 2,
        alignSelf: "stretch",
      }}>
        <div
          style={{ fontSize: 12, lineHeight: 1.6, color: "var(--gold2)" }}
          dangerouslySetInnerHTML={formatText(m.text)}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <button
            onClick={onFrankYes}
            style={{
              padding: "6px 12px",
              background: "var(--gold)",
              color: "#000",
              border: "none",
              borderRadius: 2,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.5,
              cursor: "pointer",
            }}
          >
            YES, BE FRANK
          </button>
          <button
            onClick={onFrankNo}
            style={{
              padding: "6px 12px",
              background: "transparent",
              border: "1px solid var(--bdr2)",
              color: "var(--tx3)",
              borderRadius: 2,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            NOT RIGHT NOW
          </button>
        </div>
      </div>
    );
  }

  const isUser = m.role === "user";
  const isAi   = m.role === "ai";

  const styleByType = {
    narration: { bg: "rgba(226,181,63,0.04)", border: "rgba(226,181,63,0.4)" },
    nudge:     { bg: "rgba(95,204,0,0.05)",   border: "rgba(95,204,0,0.4)"   },
    response:  {
      bg:     isUser ? "var(--bg3)" : "rgba(226,181,63,0.06)",
      border: isUser ? "var(--bdr)" : "rgba(226,181,63,0.3)",
    },
  };
  const style = styleByType[m.type] || styleByType.response;

  const labelMap = { narration: "NARRATION", nudge: "PROACTIVE", response: "" };
  const label = isAi ? (labelMap[m.type] || "") : "";

  return (
    <div style={{
      alignSelf: isUser ? "flex-end" : "stretch",
      maxWidth: isUser ? "75%" : "100%",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      {isAi && label && (
        <div style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: 1.5,
          color: m.type === "nudge" ? "var(--green)" : "var(--gold)",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          <span>{label}</span>
          <span style={{ color: "var(--tx5)" }}>·</span>
          <span style={{ color: "var(--tx5)", fontWeight: 600 }}>{m.timestamp}</span>
        </div>
      )}

      <div style={{
        padding: "10px 12px",
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 2,
      }}>
        <div
          style={{
            fontSize: 12.5,
            lineHeight: 1.6,
            color: isUser ? "var(--tx)" : "var(--tx2)",
          }}
          dangerouslySetInnerHTML={formatText(m.text)}
        />
        {m.links && m.links.length > 0 && (
          <div style={{
            marginTop: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}>
            {m.links.map((l, i) => (
              <button
                key={i}
                onClick={() => onLinkClick(l.target)}
                style={{
                  padding: "3px 8px",
                  background: "transparent",
                  border: "1px solid rgba(226,181,63,0.4)",
                  borderRadius: 2,
                  color: "var(--gold)",
                  fontSize: 11,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                }}
              >
                {l.label}
                <ArrowRight size={10} />
              </button>
            ))}
          </div>
        )}
      </div>

      {isAi && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginTop: 2,
        }}>
          <button
            onClick={() => onSaveToggle(m.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 7px",
              background: "transparent",
              border: "1px solid var(--bdr)",
              color: "var(--tx4)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
              borderRadius: 2,
              cursor: "pointer",
            }}
          >
            <Bookmark size={10} />
            <span>SAVE</span>
          </button>

          {giSavePickerFor === m.id && (
            <div style={{
              display: "inline-flex",
              gap: 4,
              padding: "3px 6px",
              background: "var(--bg)",
              border: "1px solid var(--bdr2)",
              borderRadius: 2,
            }}>
              <button onClick={() => onSave(m.id, "vault")} style={savePickerBtn}>
                <Lock size={10} /><span>VAULT</span>
              </button>
              <button onClick={() => onSave(m.id, "timeline")} style={savePickerBtn}>
                <Clock size={10} /><span>TIMELINE</span>
              </button>
            </div>
          )}

          {m.savedTo && (
            <span style={{
              color: "var(--green)",
              fontWeight: 700,
              letterSpacing: 0.5,
              fontSize: 10,
            }}>
              ✓ Saved to {m.savedTo === "vault" ? "VAULT" : "Personal Timeline"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const savePickerBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 3,
  padding: "2px 6px",
  background: "transparent",
  border: "none",
  color: "var(--tx2)",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: 0.5,
  cursor: "pointer",
};


// ═══════════════════════════════════════════════════════════════════════════
// TYPING INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

function TypingIndicator() {
  return (
    <div style={{
      padding: "8px 12px",
      background: "rgba(226,181,63,0.04)",
      border: "1px solid rgba(226,181,63,0.3)",
      borderRadius: 2,
      display: "inline-flex",
      gap: 4,
      alignItems: "center",
      alignSelf: "flex-start",
    }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="gi-typing-dot"
          style={{
            width: 5,
            height: 5,
            background: "var(--gold)",
            borderRadius: "50%",
            opacity: 0.5,
            animation: "gitypingDot 1.4s infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
}
