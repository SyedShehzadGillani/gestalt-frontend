import { WORD_BOARD } from "@/components/formula/formula-data";

interface Props {
  selected: string[];
  toggle: (word: string) => void;
  onAdvance: () => void;
}

/**
 * 01.10 Phase B — Word Board. Pick 10 words from the master pool that
 * describe your operating system. Cap of 10 enforced.
 */
export function CompetitivePhaseB({ selected, toggle, onAdvance }: Props) {
  const ready = selected.length === 10;
  return (
    <div className="bg-card border border-border p-6 mb-5">
      <div className="text-gold text-[10px] tracking-[3px] font-extrabold mb-1.5">
        PHASE B — SELECT YOUR 10 WORDS
      </div>
      <div className="text-muted-foreground text-[12px] leading-[1.7] mb-4 italic">
        Pick the 10 words that define your operating system. Every campaign, hire, and creative
        decision will be measured against these. Click to add. Click again to remove. Cap is 10 —
        enforce the priority.
      </div>

      <div className="flex justify-between items-baseline mb-3">
        <span className="text-foreground text-[11px] tracking-[2px] font-bold">YOUR STACK</span>
        <span
          className={`text-[12px] font-black ${
            ready ? "text-success" : "text-gold"
          }`}
        >
          {selected.length} / 10
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5 min-h-[40px] p-2 bg-background border border-border">
        {selected.length === 0 && (
          <span className="text-muted-foreground text-[11px] italic">
            Tap a word below to add it.
          </span>
        )}
        {selected.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => toggle(w)}
            className="px-2.5 py-1 bg-gold/[0.1] border border-gold text-gold text-[10px] tracking-[1px] font-bold cursor-pointer hover:bg-gold/20"
          >
            {w} ×
          </button>
        ))}
      </div>

      <div className="text-muted-foreground text-[10px] tracking-[2px] font-bold mb-2">
        WORD BOARD
      </div>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {WORD_BOARD.map((w) => {
          const isSelected = selected.includes(w);
          const atCap = selected.length >= 10 && !isSelected;
          return (
            <button
              key={w}
              type="button"
              disabled={atCap}
              onClick={() => toggle(w)}
              className={`px-2.5 py-1 text-[10px] tracking-[1px] font-semibold cursor-pointer border transition-colors ${
                isSelected
                  ? "bg-gold border-gold text-black"
                  : atCap
                    ? "bg-transparent border-border text-muted-foreground/40 cursor-not-allowed"
                    : "bg-transparent border-border text-foreground hover:border-gold hover:text-gold"
              }`}
            >
              {w}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAdvance}
        disabled={!ready}
        className={`w-full px-5 py-3 text-[11px] tracking-[3px] font-extrabold cursor-pointer ${
          ready
            ? "bg-gold border-none text-black hover:bg-gold/90"
            : "bg-transparent border border-border text-muted-foreground cursor-not-allowed opacity-50"
        }`}
      >
        {ready ? "CONTINUE TO PRIORITY RANKING →" : `PICK ${10 - selected.length} MORE WORDS`}
      </button>
    </div>
  );
}
