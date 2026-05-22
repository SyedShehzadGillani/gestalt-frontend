import { useEffect, useState } from "react";

export function MessagingTicker({ messages, intervalMs = 5000 }: { messages: string[]; intervalMs?: number }) {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setI((p) => (p + 1) % messages.length);
        setFade(true);
      }, 400);
    }, intervalMs);
    return () => clearInterval(t);
  }, [messages.length, intervalMs]);

  return (
    <div className="ob-ticker" style={{ opacity: fade ? 0.45 : 0 }}>
      {messages[i]}
    </div>
  );
}
