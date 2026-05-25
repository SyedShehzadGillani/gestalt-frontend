import { useEffect, useState } from "react";

export function MessagingTicker({ messages, intervalMs = 5000 }: { messages: string[]; intervalMs?: number }) {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);
  const [pos, setPos] = useState(() => randomPos());

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setI((p) => (p + 1) % messages.length);
        setPos(randomPos());
        setFade(true);
      }, 400);
    }, intervalMs);
    return () => clearInterval(t);
  }, [messages.length, intervalMs]);

  return (
    <div
      className="ob-ticker"
      style={{
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        opacity: fade ? 0.45 : 0,
      }}
    >
      {messages[i]}
    </div>
  );
}

// Random position constrained to the visible constellation area
// (left ~55% of stage, with vertical breathing room from edges).
function randomPos() {
  return {
    top: 15 + Math.random() * 70,   // 15% – 85%
    left: 8 + Math.random() * 42,   // 8%  – 50%
  };
}
