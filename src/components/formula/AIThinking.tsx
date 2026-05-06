import { useEffect, useState } from "react";

interface Props {
  /** Override the default phase pool. */
  phases?: string[];
  /** Header label, defaults to ANALYZING YOUR DESCRIPTION. */
  subLabel?: string;
}

const DEFAULT_PHASES = [
  "Reading your description…",
  "Evaluating customer clarity…",
  "Checking competitive positioning…",
  "Cross-referencing FRAMEWORK insights…",
  "Assessing culture and talent signal…",
  "Evaluating investor and buyer perspective…",
  "Testing against competitor entry risk…",
  "Generating your manifesto…",
];

const PERSPECTIVE_BARS: Array<{ label: string; color: string }> = [
  { label: "CUSTOMER", color: "#803ee4" },
  { label: "CULTURE", color: "#9aca3e" },
  { label: "INVESTOR", color: "#e2b53f" },
  { label: "COMPETITION", color: "#e3398c" },
];

/**
 * GESTALT INTELLIGENCE thinking indicator — used during async coaching
 * generation. Cycles a phase label, blinks dots, pulses 4 perspective
 * progress bars. Direct port of source `DescribeThinkingPanel`
 * (GPS-FORMULA-04-19-v80.jsx lines 1172–1255).
 */
export function AIThinking({
  phases = DEFAULT_PHASES,
  subLabel = "ANALYZING YOUR DESCRIPTION",
}: Props) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setPhaseIdx((i) => (i + 1) % phases.length), 900);
    const t2 = setInterval(() => setDots((d) => (d + 1) % 4), 300);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, [phases.length]);

  return (
    <div className="bg-card border border-gold/30 border-t-2 border-t-gold px-6 py-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-9 h-9 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(226,181,63,0.15)" strokeWidth="2" />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="hsl(var(--gold))"
              strokeWidth="2"
              strokeDasharray="22 66"
              strokeLinecap="round"
              className="ai-thinking-spin"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gold text-[9px] font-black">G</span>
          </div>
        </div>
        <div>
          <div className="text-gold text-[9px] font-extrabold tracking-[3px]">
            GESTALT INTELLIGENCE
          </div>
          <div className="text-gold/60 text-[8px] tracking-[1.5px] mt-0.5">{subLabel}</div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gold/[0.04] border border-gold/[0.12] mb-3.5">
        <p className="text-gold text-[14px] font-medium">
          {phases[phaseIdx]}
          <span className="opacity-70">{".".repeat(dots)}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PERSPECTIVE_BARS.map((p, i) => (
          <div
            key={p.label}
            className="px-2.5 py-2 bg-background border border-border"
          >
            <div className="flex justify-between mb-1">
              <span
                className="text-[7px] font-extrabold tracking-[2px]"
                style={{ color: p.color }}
              >
                {p.label}
              </span>
              <span className="text-muted-foreground text-[7px]">—</span>
            </div>
            <div className="h-[2px] bg-border overflow-hidden">
              <div
                className="h-full ai-thinking-bar"
                style={{ background: p.color, animationDelay: `${i * 0.18}s` }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes aiThinkingSpin { from { transform: rotate(0deg); transform-origin: 18px 18px; } to { transform: rotate(360deg); transform-origin: 18px 18px; } }
        @keyframes aiThinkingBar {
          0%   { width: 0%; }
          40%  { width: 70%; }
          60%  { width: 85%; }
          80%  { width: 95%; }
          100% { width: 0%; }
        }
        .ai-thinking-spin { animation: aiThinkingSpin 1.2s linear infinite; transform-origin: 18px 18px; }
        .ai-thinking-bar { animation: aiThinkingBar 1.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
