import { useEffect, useState } from "react";

const FADE_MS = 3000;
const HOLD_MS = 2000;

export function MessagingTicker({ messages }: { messages: string[]; intervalMs?: number }) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState(() => randomPos());

  useEffect(() => {
    let cancelled = false;
    const timeouts: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => { if (!cancelled) fn(); }, ms);
      timeouts.push(id);
    };

    const cycle = () => {
      setPos(randomPos());
      setVisible(true);                               // fade in (3s)
      schedule(() => setVisible(false), FADE_MS + HOLD_MS); // hold (2s) then fade out (3s)
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

// Constellation is drawn centered at (400, 450) in canvas pixels with a
// target radius ≈ 175px. Keep the ticker strictly within that disc so it
// always lands on top of the cluster, never floating around the page.
function randomPos() {
  const cx = 400, cy = 450;
  const r = 60 + Math.random() * 110; // 60–170px from center
  const a = Math.random() * Math.PI * 2;
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
}
