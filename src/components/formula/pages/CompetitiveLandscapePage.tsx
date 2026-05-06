import { useState } from "react";
import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { CompetitivePhaseA } from "@/components/formula/pages/CompetitivePhaseA";
import { CompetitivePhaseB } from "@/components/formula/pages/CompetitivePhaseB";
import { CompetitivePhaseC } from "@/components/formula/pages/CompetitivePhaseC";
import { CompetitivePhaseD } from "@/components/formula/pages/CompetitivePhaseD";
import { CompetitiveSevenStep } from "@/components/formula/pages/CompetitiveSevenStep";
import type { SignOffSection, TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
  onSignOff: SignOffSection;
  signedOff: Record<string, boolean>;
}

type Phase = "A" | "B" | "C" | "D";

const PHASES: Array<{ key: Phase; label: string; sub: string }> = [
  { key: "A", label: "DESCRIBE", sub: "50 words" },
  { key: "B", label: "WORD BOARD", sub: "Pick 10" },
  { key: "C", label: "RANK", sub: "Order the stack" },
  { key: "D", label: "MANIFESTO", sub: "Coaching" },
];

/**
 * 01.10 — Competitive Landscape. Outer 7-step flow (CompetitiveSevenStep)
 * wraps the 4 internal phases (A→D) as Step 1, then exposes Steps 2–7
 * (Categorize, Context Map, Prioritize, Competition, Spectrum, Audit).
 */
export function CompetitiveLandscapePage({ onAi, onSignOff, signedOff }: Props) {
  const [phase, setPhase] = useState<Phase>("A");
  const [descText, setDescText] = useState("");
  const [descSaved, setDescSaved] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [manifesto, setManifesto] = useState("");

  const toggleWord = (word: string) =>
    setSelectedWords((prev) => {
      if (prev.includes(word)) return prev.filter((w) => w !== word);
      if (prev.length >= 10) return prev;
      return [...prev, word];
    });

  const moveUp = (idx: number) =>
    setOrderedWords((prev) => {
      if (idx === 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });

  const moveDown = (idx: number) =>
    setOrderedWords((prev) => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });

  const advanceFromB = () => {
    setOrderedWords([...selectedWords]);
    setPhase("C");
  };

  const step1 = (
    <div>
      <div className="grid grid-cols-4 gap-1 mb-5">
        {PHASES.map((p) => {
          const isActive = phase === p.key;
          const reached =
            p.key === "A" ||
            (p.key === "B" && descSaved) ||
            (p.key === "C" && selectedWords.length === 10) ||
            (p.key === "D" && orderedWords.length === 10);
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => reached && setPhase(p.key)}
              className={`px-3 py-2 text-left border ${
                isActive
                  ? "border-gold bg-gold/[0.06]"
                  : reached
                    ? "border-border hover:border-gold/40"
                    : "border-border opacity-40 cursor-not-allowed"
              } ${reached ? "cursor-pointer" : ""}`}
            >
              <div
                className={`text-[8px] tracking-[2px] font-extrabold ${
                  isActive ? "text-gold" : "text-muted-foreground"
                }`}
              >
                PHASE {p.key}
              </div>
              <div
                className={`text-[12px] font-extrabold mt-0.5 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {p.label}
              </div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{p.sub}</div>
            </button>
          );
        })}
      </div>

      {phase === "A" && (
        <CompetitivePhaseA
          descText={descText}
          setDescText={setDescText}
          descSaved={descSaved}
          onSave={() => {
            setDescSaved(true);
            onAi({
              context: "01.10 PHASE A — DESCRIPTION LOCKED",
              text: `Description saved to the Knowledge Bank. Every coaching answer, audit, and AI prompt that follows is now calibrated against this baseline.\n\n"${descText}"`,
              needsConfirm: true,
              metrics: [
                {
                  label: "WORDS",
                  value: String(descText.trim().split(/\s+/).length),
                  color: "hsl(var(--gold))",
                },
              ],
            });
          }}
          onAdvance={() => setPhase("B")}
        />
      )}

      {phase === "B" && (
        <CompetitivePhaseB selected={selectedWords} toggle={toggleWord} onAdvance={advanceFromB} />
      )}

      {phase === "C" && (
        <CompetitivePhaseC
          ordered={orderedWords}
          moveUp={moveUp}
          moveDown={moveDown}
          onAdvance={() => setPhase("D")}
        />
      )}

      {phase === "D" && (
        <CompetitivePhaseD
          descText={descText}
          manifesto={manifesto}
          setManifesto={setManifesto}
          onAi={onAi}
          onSignOff={onSignOff}
          signedOff={signedOff}
        />
      )}
    </div>
  );

  return (
    <div>
      <FormulaPageHeader pageId="01.10" />
      <CompetitiveSevenStep
        step1Slot={step1}
        selectedWords={selectedWords}
        step1Complete={selectedWords.length === 10}
        onAi={onAi}
        onSignOff={onSignOff}
      />
    </div>
  );
}
