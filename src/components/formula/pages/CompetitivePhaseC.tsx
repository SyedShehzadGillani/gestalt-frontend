interface Props {
  ordered: string[];
  moveUp: (idx: number) => void;
  moveDown: (idx: number) => void;
  onAdvance: () => void;
}

/**
 * 01.10 Phase C — rank the 10 selected words. Word 1 is the non-negotiable.
 * Up/down buttons re-order; the order locks the operating system hierarchy.
 */
export function CompetitivePhaseC({ ordered, moveUp, moveDown, onAdvance }: Props) {
  return (
    <div className="bg-card border border-border p-6 mb-5">
      <div className="text-gold text-[10px] tracking-[3px] font-extrabold mb-1.5">
        PHASE C — RANK THE STACK
      </div>
      <div className="text-muted-foreground text-[12px] leading-[1.7] mb-4 italic">
        Word 1 is your non-negotiable conviction. Word 10 is the closing argument. Every future
        conflict resolution and hiring decision runs through this hierarchy. Order matters as much
        as the words themselves.
      </div>

      <div className="space-y-1">
        {ordered.map((word, idx) => (
          <div
            key={word}
            className="flex items-center gap-3 px-3 py-2 bg-background border border-border"
          >
            <span className="text-gold text-[16px] font-black w-6 text-center">{idx + 1}</span>
            <span className="flex-1 text-foreground text-[13px] font-bold tracking-[1px]">
              {word}
            </span>
            <button
              type="button"
              disabled={idx === 0}
              onClick={() => moveUp(idx)}
              className="px-2 py-1 bg-transparent border border-border text-muted-foreground text-[10px] cursor-pointer hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={idx === ordered.length - 1}
              onClick={() => moveDown(idx)}
              className="px-2 py-1 bg-transparent border border-border text-muted-foreground text-[10px] cursor-pointer hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↓
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdvance}
        className="w-full px-5 py-3 text-[11px] tracking-[3px] font-extrabold cursor-pointer bg-gold border-none text-black mt-5 hover:bg-gold/90"
      >
        LOCK STACK → MANIFESTO COACHING
      </button>
    </div>
  );
}
