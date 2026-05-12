// GIBubble — site-wide floating bubble (v15 spec §8.1).
// Pulses gold when GI has something proactive. Click toggles GIWindow.

interface Props {
  hasProactive: boolean;
  onToggle: () => void;
}

export function GIBubble({ hasProactive, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={hasProactive ? "sum-gi-bubble" : "sum-gi-bubble sum-gi-bubble-quiet"}
      title="GESTALT INTELLIGENCE — ask anything (⌘K)"
      aria-label="Open GESTALT INTELLIGENCE"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5z" />
      </svg>
    </button>
  );
}
