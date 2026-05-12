import { useState } from "react";
import {
  COMP_WORDS,
  COMPETITOR_SUGGESTED_SETS,
  generateCompetitorNarrative,
  type CompetitorMock,
} from "@/components/formula/formula-data";
import { NarrativeDisplay } from "@/components/formula/NarrativeDisplay";

interface Props {
  competitor: CompetitorMock;
  onUpdate: (patch: Partial<CompetitorMock>) => void;
}

/**
 * Knowledge-bank competitor word board. User picks 5 words that describe
 * how the market perceives this competitor — GESTALT INTELLIGENCE then
 * generates a competitive narrative. Narrative regenerates through 4
 * voice variants. Direct port of source `CompetitorWordBoard`
 * (GPS-FORMULA-04-19-v80.jsx lines 1257–1429).
 */
export function CompetitorWordBoard({ competitor, onUpdate }: Props) {
  const color = competitor.color;
  const [ranked, setRanked] = useState<string[]>(competitor.top5 || []);
  const [narrative, setNarrative] = useState(competitor.aiNarrative || "");
  const [narGenerated, setNarGenerated] = useState(Boolean(competitor.aiNarrative));
  const [shuffleIdx, setShuffleIdx] = useState(0);
  const [narVersion, setNarVersion] = useState(0);

  const currentSuggestions =
    COMPETITOR_SUGGESTED_SETS[shuffleIdx % COMPETITOR_SUGGESTED_SETS.length];

  const toggleWord = (w: string) => {
    if (ranked.includes(w)) {
      const next = ranked.filter((x) => x !== w);
      setRanked(next);
      onUpdate({ top5: next, aiNarrative: narrative });
    } else if (ranked.length < 5) {
      const next = [...ranked, w];
      setRanked(next);
      onUpdate({ top5: next, aiNarrative: narrative });
    }
  };

  const generateNarrative = () => {
    if (ranked.length < 3) return;
    const nar = generateCompetitorNarrative(competitor.name, ranked, narVersion);
    setNarVersion((v) => v + 1);
    setNarrative(nar);
    setNarGenerated(true);
    onUpdate({ top5: ranked, aiNarrative: nar });
  };

  const handleShuffle = () => setShuffleIdx((i) => i + 1);

  return (
    <>
      <div className="grid grid-cols-[1fr_260px] gap-4 items-start">
        {/* LEFT — word board */}
        <div>
          <div className="flex justify-between items-center mb-3.5">
            <div className="text-[10px] tracking-[2px] font-bold" style={{ color: `${color}80` }}>
              HOW DOES THE MARKET PERCEIVE{" "}
              <span style={{ color }}>{competitor.name}</span>?
            </div>
            <button
              type="button"
              onClick={handleShuffle}
              className="bg-transparent px-3.5 py-1 text-[9px] font-bold tracking-[1.5px] cursor-pointer border"
              style={{ borderColor: `${color}40`, color }}
            >
              ↻ SHUFFLE
            </button>
          </div>

          {/* AI suggestions */}
          <div
            className="px-4 py-3 mb-3.5 border"
            style={{ background: `${color}08`, borderColor: `${color}20` }}
          >
            <div
              className="text-[9px] tracking-[2px] font-bold mb-2.5"
              style={{ color: `${color}60` }}
            >
              GESTALT INTELLIGENCE SUGGESTS
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentSuggestions.map((w) => {
                const isRanked = ranked.includes(w);
                const isFull = ranked.length >= 5 && !isRanked;
                return (
                  <button
                    key={w}
                    type="button"
                    disabled={isFull}
                    onClick={() => !isFull && toggleWord(w)}
                    className={`px-3.5 py-1.5 text-[10px] font-bold border transition-colors ${
                      isFull ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    style={{
                      background: isRanked ? `${color}25` : "transparent",
                      borderColor: isRanked ? color : `${color}50`,
                      color: isRanked ? color : `${color}80`,
                    }}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full word board */}
          <div>
            <div
              className="text-[9px] tracking-[2px] font-bold mb-2.5"
              style={{ color: `${color}50` }}
            >
              ALL WORDS — <span style={{ color }}>{ranked.length} ranked</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {COMP_WORDS.filter((w) => !currentSuggestions.includes(w)).map((w) => {
                const isRanked = ranked.includes(w);
                const isFull = ranked.length >= 5 && !isRanked;
                return (
                  <button
                    key={w}
                    type="button"
                    disabled={isFull}
                    onClick={() => !isFull && toggleWord(w)}
                    className={`px-2.5 py-1 text-[9px] border transition-colors ${
                      isRanked ? "font-bold" : "font-normal"
                    } ${isFull ? "cursor-not-allowed" : "cursor-pointer"}`}
                    style={{
                      background: isRanked ? `${color}18` : "transparent",
                      borderColor: isRanked ? color : `${color}18`,
                      color: isRanked ? color : isFull ? `${color}12` : `${color}40`,
                    }}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — ranked stack */}
        <div className="sticky top-5">
          <div className="p-4 bg-card border-t-2" style={{ borderTopColor: color }}>
            <div className="flex justify-between items-center mb-3.5">
              <div
                className="text-[10px] tracking-[2px] font-extrabold"
                style={{ color }}
              >
                YOUR WORDS
              </div>
              <div className="text-[10px]" style={{ color: `${color}60` }}>
                {ranked.length} / 5
              </div>
            </div>
            {[0, 1, 2, 3, 4].map((i) => {
              const word = ranked[i];
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 py-2.5 border-b"
                  style={{ borderBottomColor: word ? `${color}15` : `${color}06` }}
                >
                  <span
                    className="text-[16px] font-black min-w-[22px] text-right leading-none"
                    style={{ color: word ? color : `${color}12` }}
                  >
                    {i + 1}
                  </span>
                  {word ? (
                    <>
                      <span
                        className="text-[13px] font-bold flex-1"
                        style={{ color }}
                      >
                        {word}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleWord(word)}
                        className="bg-transparent border-none cursor-pointer text-[22px] px-1 leading-none"
                        style={{ color: `${color}50` }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span
                      className="text-[11px] italic flex-1"
                      style={{ color: `${color}15` }}
                    >
                      —
                    </span>
                  )}
                </div>
              );
            })}
            {ranked.length >= 5 && (
              <button
                type="button"
                onClick={generateNarrative}
                className="mt-3.5 w-full py-2.5 bg-gold text-black border-none text-[10px] font-extrabold tracking-[2px] cursor-pointer hover:bg-gold/90"
              >
                GENERATE NARRATIVE →
              </button>
            )}
            {ranked.length < 5 && (
              <div className="mt-2.5 text-[9px]" style={{ color: `${color}35` }}>
                Click words to rank
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GESTALT INTELLIGENCE narrative */}
      {ranked.length >= 3 && (
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2.5">
            <div className="text-gold/70 text-[10px] font-bold tracking-[1.5px]">
              GESTALT INTELLIGENCE
            </div>
            <button
              type="button"
              onClick={generateNarrative}
              className="bg-transparent px-3.5 py-1.5 text-[9px] tracking-[1.5px] font-bold cursor-pointer border"
              style={{ borderColor: color, color }}
            >
              {narGenerated ? "REGENERATE" : "GENERATE →"}
            </button>
          </div>
          {narGenerated && (
            <div
              className="px-5 py-4 bg-background border border-t-2"
              style={{ borderColor: `${color}20`, borderTopColor: color }}
            >
              <NarrativeDisplay text={narrative} wordColor={color} />
            </div>
          )}
          {narrative.includes("⚠") && narGenerated && (
            <div
              className="px-3 py-2 mt-2 text-[11px] text-red"
              style={{ background: "rgba(139,32,32,0.08)" }}
            >
              {narrative.match(/⚠[^.]+\./)?.[0] || ""}
            </div>
          )}
        </div>
      )}
    </>
  );
}
