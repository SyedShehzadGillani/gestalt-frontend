import { CONGRATS_MESSAGES, FORMULA_INTROS, INTELLIGENCE_STAGES } from "@/components/formula/formula-data";

interface Props {
  sectionId: string;
  onClose: () => void;
}

/** Full-screen overlay celebrating a section sign-off. */
export function CongratsOverlay({ sectionId, onClose }: Props) {
  const intro = FORMULA_INTROS[sectionId];
  const stage = INTELLIGENCE_STAGES.find((s) => s.id === sectionId);
  const msg = CONGRATS_MESSAGES[sectionId] || `${stage?.label || "This section"} is complete.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/[0.92]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-[680px] px-14 py-[52px] bg-card border-2 border-success text-center relative"
      >
        <div className="w-16 h-16 bg-success/15 border-2 border-success flex items-center justify-center mx-auto mb-6">
          <span className="text-success text-[32px] font-black">✓</span>
        </div>
        <div className="text-success text-[9px] font-extrabold tracking-[3px] mb-3">
          SECTION COMPLETE
        </div>
        <h2 className="text-white text-4xl font-black tracking-[-1px] leading-[1.1] mb-5">
          {stage?.label || "Section"}
          <br />
          <span className="text-success">is locked.</span>
        </h2>
        <p className="text-muted-foreground text-[15px] leading-[1.8] mb-7">{msg}</p>

        {intro && (
          <div className="px-5 py-3.5 bg-success/[0.04] border border-success/30 mb-6">
            <span className="text-success text-[18px] font-black">{intro.stat}</span>
            <span className="text-muted-foreground text-[13px] ml-2">{intro.statLabel}</span>
            <div className="text-success/50 text-[10px] italic mt-1">— {intro.source}</div>
          </div>
        )}

        {stage?.capability && (
          <div className="mb-6 px-4 py-2.5 bg-background border border-border">
            <div className="text-gold text-[8px] font-extrabold tracking-[2.5px] mb-1">
              GESTALT INTELLIGENCE UNLOCKED
            </div>
            <div className="text-muted-foreground text-[12px]">{stage.capability}</div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-success text-black px-10 py-3 text-[11px] font-black tracking-[3px] cursor-pointer"
        >
          CONTINUE →
        </button>
      </div>
    </div>
  );
}
