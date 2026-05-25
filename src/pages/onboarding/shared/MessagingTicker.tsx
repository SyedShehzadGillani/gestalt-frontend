import { useEffect, useRef, useState } from "react";
import type { ConstellationNode } from "./ConstellationCanvas";

const FADE_MS = 3000;
const HOLD_MS = 2000;

const TICKER_W = 320;
const TICKER_H = 28;
const PAD = 20;

type Props = {
  messages: string[];
  getNodes: () => ConstellationNode[];
  logicalSize: { w: number; h: number };
};

function exclusionZones(vw: number, vh: number) {
  return [
    // HUD rail (top-left)
    { x: 0, y: 0, w: 420, h: 360 },
    // EXIT button (top-right)
    { x: vw - 160, y: 0, w: 160, h: 60 },
    // Right scene panel
    { x: vw - Math.min(720, Math.max(460, vw * 0.44)), y: 0, w: vw, h: vh },
    // Bottom keyboard hint bar
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

export function MessagingTicker({ messages, getNodes, logicalSize }: Props) {
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

    const pickPosition = () => {
      const { vw, vh } = measure();
      const zones = exclusionZones(vw, vh);
      const sx = vw / logicalSize.w;
      const sy = vh / logicalSize.h;
      const nodes = getNodes();

      const minX = TICKER_W / 2 + 16;
      const maxX = Math.max(minX + 1, vw - Math.min(720, Math.max(460, vw * 0.44)) - TICKER_W / 2 - 16);
      const minY = TICKER_H / 2 + 16;
      const maxY = vh - TICKER_H / 2 - 16;
      const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

      // Try anchoring near a real constellation node. Pick a random node and
      // offset by 50–140px in a random direction so the text sits *near* the
      // data points rather than on top of them.
      if (nodes.length > 0) {
        for (let attempt = 0; attempt < 60; attempt++) {
          const n = nodes[Math.floor(Math.random() * nodes.length)];
          const angle = Math.random() * Math.PI * 2;
          const offset = 50 + Math.random() * 90;
          const x = clamp(n.x * sx + Math.cos(angle) * offset, minX, maxX);
          const y = clamp(n.y * sy + Math.sin(angle) * offset, minY, maxY);
          if (!overlaps(x, y, zones)) return { x, y };
        }
      }

      // Fallback: random anywhere in the constellation area.
      for (let i = 0; i < 40; i++) {
        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        if (!overlaps(x, y, zones)) return { x, y };
      }
      return { x: (minX + maxX) / 2, y: vh / 2 };
    };

    const cycle = () => {
      setPos(pickPosition());
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
  }, [messages.length, getNodes, logicalSize.w, logicalSize.h]);

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
