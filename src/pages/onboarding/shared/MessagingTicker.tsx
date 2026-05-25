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
        left: `calc(33.333% + ${pos.dx}px)`,
        top: `calc(50% + ${pos.dy}px)`,
        opacity: visible ? 0.45 : 0,
      }}
    >
      {messages[i]}
    </div>
  );
}

// Drop ticker copy within the constellation cluster, which is centered at
// (33% width, 50% height) of the viewport. Random offset 60–170px from center.
function randomPos() {
  const r = 60 + Math.random() * 110;
  const a = Math.random() * Math.PI * 2;
  return { dx: Math.cos(a) * r, dy: Math.sin(a) * r };
}
