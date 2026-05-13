// GIWindow — site-wide GESTALT INTELLIGENCE expanded chat.
// Draggable by header, resizable from bottom-right corner, and supports a
// 25%-smaller compact toggle. Position + size + scale persist to localStorage.

import { useEffect, useRef, useState, useCallback } from "react";
import { Icon } from "@/components/sum/icons";
import { GI_SUGGESTIONS, GI_TAB_LABELS } from "@/data/sum-data";
import type { UseGIReturn } from "@/hooks/useGI";
import { GIMessageView } from "./GIMessage";

interface Props {
  gi: UseGIReturn;
  tabId?: string;
}

const DEFAULT_W = 420;
const DEFAULT_H = 580;
const MIN_W = 280;
const MIN_H = 340;
const STORAGE_KEY = "gi-window-frame-v1";

interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
  compact: boolean;
}

function loadFrame(): Frame {
  if (typeof window === "undefined") return { x: -1, y: -1, w: DEFAULT_W, h: DEFAULT_H, compact: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { x: -1, y: -1, w: DEFAULT_W, h: DEFAULT_H, compact: false, ...JSON.parse(raw) };
  } catch {}
  return { x: -1, y: -1, w: DEFAULT_W, h: DEFAULT_H, compact: false };
}

export function GIWindow({ gi, tabId = "chat" }: Props) {
  const feedRef = useRef<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState<Frame>(loadFrame);

  // Persist frame.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(frame));
    } catch {}
  }, [frame]);

  // Compute effective rect (anchor bottom-right on first load).
  const scale = frame.compact ? 0.75 : 1;
  const w = Math.round(frame.w * scale);
  const h = Math.round(frame.h * scale);
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const x = frame.x < 0 ? Math.max(8, vw - w - 24) : Math.min(Math.max(8, frame.x), vw - w - 8);
  const y = frame.y < 0 ? Math.max(8, vh - h - 24) : Math.min(Math.max(8, frame.y), vh - h - 8);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [gi.messages, gi.typing, gi.open]);

  // Drag (by header).
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const onHeaderPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y };
    },
    [x, y],
  );
  const onHeaderPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setFrame((f) => ({
      ...f,
      x: Math.max(8, Math.min(window.innerWidth - 80, dragRef.current!.origX + dx)),
      y: Math.max(8, Math.min(window.innerHeight - 60, dragRef.current!.origY + dy)),
    }));
  }, []);
  const onHeaderPointerUp = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
  }, []);

  // Resize (bottom-right corner) — adjusts the un-scaled w/h so dragging
  // produces a free-form aspect ratio.
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);
  const onResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      resizeRef.current = { startX: e.clientX, startY: e.clientY, origW: frame.w, origH: frame.h };
    },
    [frame.w, frame.h],
  );
  const onResizePointerMove = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    const dx = (e.clientX - resizeRef.current.startX) / scale;
    const dy = (e.clientY - resizeRef.current.startY) / scale;
    setFrame((f) => ({
      ...f,
      w: Math.max(MIN_W, Math.min(1400, resizeRef.current!.origW + dx)),
      h: Math.max(MIN_H, Math.min(1400, resizeRef.current!.origH + dy)),
    }));
  }, [scale]);
  const onResizePointerUp = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    resizeRef.current = null;
  }, []);

  if (!gi.open) return null;
  const ctxLabel = GI_TAB_LABELS[tabId] ?? tabId.toUpperCase();
  const hasUser = gi.messages.some((m) => m.role === "user");

  return (
    <div
      role="dialog"
      aria-label="GESTALT INTELLIGENCE"
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 151,
        width: w,
        height: h,
        maxWidth: "95vw",
        maxHeight: "95vh",
        background: "var(--sum-bg2)",
        border: "1px solid var(--sum-bdr)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <header
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        onPointerCancel={onHeaderPointerUp}
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--sum-bdr)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--sum-bg2)",
          flexShrink: 0,
          cursor: dragRef.current ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #c9a227 0%, #e2b53f 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5z" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: "var(--sum-tx)" }}>GESTALT INTELLIGENCE</div>
          <div style={{ fontSize: 10, color: "var(--sum-tx5)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Currently viewing: {ctxLabel}
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => setFrame((f) => ({ ...f, compact: !f.compact }))}
            title={frame.compact ? "Expand to full size" : "Shrink 25%"}
            style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sum-tx4)", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}
          >
            {frame.compact ? "100%" : "75%"}
          </button>
          <button onClick={gi.clear} title="Clear conversation" style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sum-tx4)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
          <button onClick={() => gi.setOpen(false)} title="Minimize" style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--sum-tx4)" }}>
            <Icon name="x" size={15} />
          </button>
        </div>
      </header>

      <div ref={feedRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
        {gi.messages.map((m) => (
          <GIMessageView
            key={m.id}
            m={m}
            savePickerFor={gi.savePickerFor}
            onOpenSave={(id) => gi.setSavePickerFor(id)}
            onSave={gi.saveMessage}
            onCloseSave={() => gi.setSavePickerFor(null)}
          />
        ))}
        {gi.typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "11px 14px", background: "rgba(226,181,63,0.06)", borderLeft: "2px solid var(--sum-gold)" }}>
            <Dot delay={0} />
            <Dot delay={0.2} />
            <Dot delay={0.4} />
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid var(--sum-bdr)", padding: "12px 14px", flexShrink: 0, background: "var(--sum-bg2)" }}>
        {!hasUser && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {GI_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => gi.send(s)}
                style={{ padding: "6px 12px", background: "transparent", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 0.3 }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--sum-inp)", border: "1px solid var(--sum-bdr)", padding: "8px 10px" }}>
          <textarea
            id="gi-input"
            value={gi.input}
            onChange={(e) => gi.setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                gi.send();
              }
            }}
            rows={1}
            placeholder="Ask anything — about your data, your business, your strategy..."
            style={{ flex: 1, minHeight: 20, maxHeight: 140, background: "transparent", border: "none", outline: "none", resize: "none", color: "var(--sum-tx)", fontSize: 14, lineHeight: 1.5, fontFamily: "inherit" }}
          />
          <button
            onClick={() => gi.send()}
            disabled={!gi.input.trim()}
            style={{ width: 32, height: 32, background: "var(--sum-gold)", color: "#000", border: "none", cursor: gi.input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: gi.input.trim() ? 1 : 0.3 }}
          >
            <Icon name="send" size={14} />
          </button>
        </div>
      </div>

      {/* Resize handle (bottom-right) */}
      <div
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
        title="Drag to resize"
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 18,
          height: 18,
          cursor: "nwse-resize",
          touchAction: "none",
          background:
            "linear-gradient(135deg, transparent 0 50%, var(--sum-gold) 50% 60%, transparent 60% 70%, var(--sum-gold) 70% 80%, transparent 80% 90%, var(--sum-gold) 90% 100%)",
          opacity: 0.6,
        }}
      />
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
