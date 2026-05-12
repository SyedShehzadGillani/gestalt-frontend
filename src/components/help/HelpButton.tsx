import { useState } from "react";
import { HelpPanel } from "./HelpPanel";

interface HelpButtonProps {
  helpId: string;
}

export function HelpButton({ helpId }: HelpButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 16,
          height: 16,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          fontFamily: "'Gotham', 'Montserrat', system-ui, sans-serif",
          fontSize: 9,
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--content-text3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#c9a227';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--content-text3)';
        }}
      >
        ?
      </button>
      <HelpPanel helpId={helpId} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
