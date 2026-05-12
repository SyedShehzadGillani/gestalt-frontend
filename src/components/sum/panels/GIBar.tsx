const TIMELINE_LEN = 8;
const FILLED = 5;

interface Props { onOpenGI: () => void; }

export function GIBar({ onOpenGI }: Props) {
  return (
    <>
      <button onClick={onOpenGI} className="sum-gi-bubble" title="GESTALT INTELLIGENCE — ask anything (⌘K)" aria-label="Open GESTALT INTELLIGENCE">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5z" />
        </svg>
      </button>
      <div style={{ padding: "10px 24px", borderTop: "1px solid var(--sum-bdr)", flexShrink: 0, background: "var(--sum-bg)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--sum-tx4)", marginBottom: 5 }}>YOUR DATA IS BUILDING</div>
        <div style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: TIMELINE_LEN }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, background: i < FILLED ? "var(--sum-gold)" : "rgba(226,181,63,0.15)" }} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 5, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-gold)" }}>63% OF FULL INTELLIGENCE</div>
      </div>
    </>
  );
}
