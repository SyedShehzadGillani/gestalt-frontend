import { useEffect, useRef, useState } from "react";

const FADE_MS = 3000;
const HOLD_MS = 2000;

// Rough text size for collision checks (height x width estimate around the
// center point). The actual element is one short line of 11px text.
const TICKER_W = 320;
const TICKER_H = 28;
const PAD = 24;

// Zones that already have text on the stage — the ticker must never land on
// top of them. Coordinates are viewport pixels relative to .ob-canvas-wrap
// (which is full-bleed inset:0).
function exclusionZones(vw: number, vh: number) {
  return [
    // HUD rail (top-left): module label + intelligence + confidence + blindspots + reset
    { x: 0, y: 0, w: 420, h: 360 },
    // EXIT button (top-right)
    { x: vw - 160, y: 0, w: 160, h: 60 },
    // Right scene panel (44% width, min 460px, max 720px)
    { x: vw - Math.min(720, Math.max(460, vw * 0.44)), y: 0, w: vw, h: vh },
    // Bottom keyboard hint bar (centered)
    { x: vw / 2 - 240, y: vh - 60, w: 480, h: 60 },
  ];
}

function overlaps(cx: number, cy: number, zones: ReturnType<typeof exclusionZones>) {
  const left = cx - TICKER_W / 2 - PAD;
  const right = cx + TICKER_W / 2 + PAD;
  const top = cy - TICKER_H / 2 - PAD;
  const bottom = cy + TICKER_H / 2 + PAD;
  return zones.some(z =>
    right > z.x && left < z.x + z.w && bottom > z.y && top < z.y + z.h
  );
}

function pickPosition(vw: number, vh: number) {
  const zones = exclusionZones(vw, vh);
  // Constrain to the constellation half (left of the right panel) with a
  // safe inset from the page edges.
  const minX = TICKER_W / 2 + 16;
  const maxX = Math.max(minX + 1, vw - Math.min(720, Math.max(460, vw * 0.44)) - TICKER_W / 2 - 16);
  const minY = TICKER_H / 2 + 16;
  const maxY = vh - TICKER_H / 2 - 16;

  for (let i = 0; i < 80; i++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    if (!overlaps(x, y, zones)) return { x, y };
  }
  // Fallback: middle of the constellation area
  return { x: (minX + maxX) / 2, y: vh / 2 };
}

export function MessagingTicker({ messages }: { messages: string[]; intervalMs?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => { if (!cancelled) fn(); }, ms);
      timeouts.push(id);
    };

    const measure = () => {
      const el = wrapRef.current?.parentElement;
      const r = el?.getBoundingClientRect();
      return { vw: r?.width ?? window.innerWidth, vh: r?.height ?? window.innerHeight };
    };

    const cycle = () => {
      const { vw, vh } = measure();
      setPos(pickPosition(vw, vh));
      setVisible(true);
      schedule(() => setVisible(false), FADE_MS + HOLD_MS);
      schedule(() => {
        setI((p) => (p + 1) % messages.length);
        cycle();
      }, FADE_MS + HOLD_MS + FADE_MS);
    };
    cycle();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [messages.length]);

  return (
    <div
      ref={wrapRef}
      className="ob-ticker"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        opacity: visible ? 0.45 : 0,
      }}
    >
      {messages[i]}
    </div>
  );
}
