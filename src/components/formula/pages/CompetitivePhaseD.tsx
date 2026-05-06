import { useMemo, useState } from "react";
import {
  PERSPECTIVES,
  generateCoachingPlaceholder,
  getCoachingQuestion,
  scoreManifesto,
  type Perspective,
} from "@/components/formula/formula-data";
import { AutoTextarea } from "@/components/formula/AutoTextarea";
import type { SignOffSection, TriggerAi } from "@/components/formula/page-types";

interface Props {
  descText: string;
  manifesto: string;
  setManifesto: (v: string) => void;
  onAi: TriggerAi;
  onSignOff: SignOffSection;
  signedOff: Record<string, boolean>;
}

/**
 * 01.10 Phase D — manifesto coaching across 4 perspectives. Live scores show
 * how the current manifesto reads to Customer / Culture / Investor / Competition.
 * The lowest-scoring perspective surfaces a coaching question.
 */
export function CompetitivePhaseD({
  descText,
  manifesto,
  setManifesto,
  onAi,
  onSignOff,
  signedOff,
}: Props) {
  const [coachingAnswers, setCoachingAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [round, setRound] = useState(0);

  const scores = useMemo(
    () => scoreManifesto(manifesto, descText, coachingAnswers),
    [manifesto, descText, coachingAnswers],
  );

  const coaching = getCoachingQuestion(scores, round);
  const lowestPerspective = coaching
    ? PERSPECTIVES.find((p) => p.key === coaching.category)
    : null;
  const placeholder = lowestPerspective
    ? generateCoachingPlaceholder(lowestPerspective.key as Perspective["key"], descText)
    : "";

  const submitAnswer = () => {
    if (currentAnswer.trim().length < 10) return;
    setCoachingAnswers((prev) => [...prev, currentAnswer]);
    setCurrentAnswer("");
    setRound((r) => r + 1);
  };

  const ready = scores.total >= 60;
  const isSignedOff = !!signedOff["01.10"];

  return (
    <div className="bg-card border border-border p-6 mb-5">
      <div className="text-gold text-[10px] tracking-[3px] font-extrabold mb-1.5">
        PHASE D — MANIFESTO COACHING
      </div>
      <div className="text-muted-foreground text-[12px] leading-[1.7] mb-4 italic">
        Write a 1-paragraph manifesto. Four perspectives — Customer, Culture, Investor,
        Competition — score it live. The lowest score surfaces a coaching question that strengthens
        your weakest dimension.
      </div>

      <AutoTextarea
        value={manifesto}
        onChange={(e) => setManifesto(e.target.value)}
        placeholder="Write your manifesto. What you do. Who you do it for. Why nobody else can replicate it…"
        minHeight={140}
      />

      <div className="grid grid-cols-4 gap-2 mt-4">
        {PERSPECTIVES.map((p) => {
          const score = scores[p.key];
          const filled = score >= 18;
          return (
            <div
              key={p.key}
              className="px-3 py-2.5 border bg-background"
              style={{ borderColor: filled ? p.color : "hsl(var(--border))" }}
            >
              <div
                className="text-[8px] font-extrabold tracking-[1.5px] mb-1"
                style={{ color: p.color }}
              >
                {p.label}
              </div>
              <div
                className="text-[20px] font-black"
                style={{ color: filled ? p.color : "hsl(var(--muted-foreground))" }}
              >
                {score}
                <span className="text-muted-foreground text-[10px] font-semibold">/25</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 px-3 py-2 bg-background border border-border flex justify-between items-baseline">
        <span className="text-muted-foreground text-[10px] tracking-[2px] font-bold">
          MANIFESTO TOTAL
        </span>
        <span className="text-gold text-[20px] font-black">
          {scores.total}
          <span className="text-muted-foreground text-[11px] font-semibold">/100</span>
        </span>
      </div>

      {coaching && lowestPerspective && (
        <div
          className="mt-4 px-4 py-3.5 border-l-[3px]"
          style={{
            borderColor: lowestPerspective.color,
            background: `${lowestPerspective.color}10`,
          }}
        >
          <div
            className="text-[8px] font-extrabold tracking-[2px] mb-1.5"
            style={{ color: lowestPerspective.color }}
          >
            COACHING — {lowestPerspective.label} ({coaching.score}/25)
          </div>
          <div className="text-foreground text-[13px] leading-[1.7] mb-2.5">
            {coaching.question}
          </div>
          {placeholder && (
            <div className="text-muted-foreground text-[11px] italic leading-[1.7] mb-2.5">
              {placeholder}
            </div>
          )}
          <AutoTextarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer…"
            minHeight={72}
          />
          <button
            type="button"
            onClick={submitAnswer}
            disabled={currentAnswer.trim().length < 10}
            className={`px-4 py-2 text-[9px] tracking-[2px] font-extrabold cursor-pointer mt-2 border ${
              currentAnswer.trim().length < 10
                ? "bg-transparent border-border text-muted-foreground cursor-not-allowed opacity-50"
                : "bg-transparent border-gold text-gold hover:bg-gold/10"
            }`}
          >
            SAVE ANSWER & REFINE →
          </button>
        </div>
      )}

      {isSignedOff ? (
        <div className="mt-5 px-4 py-3.5 bg-success/[0.06] border border-success/30 flex items-center gap-2">
          <span className="text-success text-[18px]">✓</span>
          <span className="text-success text-[11px] font-extrabold tracking-[2px]">
            SIGNED OFF — COMPETITIVE LANDSCAPE LOCKED
          </span>
        </div>
      ) : (
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            onAi({
              context: "01.10 COMPETITIVE LANDSCAPE",
              text: `Manifesto locked at ${scores.total}/100 — ${scores.confidence}% confidence.\n\nCustomer: ${scores.customer}/25 · Culture: ${scores.culture}/25 · Investor: ${scores.investor}/25 · Competition: ${scores.competition}/25\n\nThe word stack and manifesto are now your operating system. Every campaign, hire, and creative brief gets filtered through these.`,
              needsConfirm: true,
              metrics: [
                { label: "TOTAL", value: `${scores.total}/100`, color: "hsl(var(--gold))" },
                {
                  label: "CONFIDENCE",
                  value: `${scores.confidence}%`,
                  color: "hsl(var(--success))",
                },
              ],
            });
            onSignOff("01.10");
          }}
          className={`w-full px-5 py-3 text-[11px] tracking-[3px] font-extrabold cursor-pointer mt-5 ${
            ready
              ? "bg-success border-none text-black hover:bg-success/90"
              : "bg-transparent border border-border text-muted-foreground cursor-not-allowed opacity-50"
          }`}
        >
          {ready
            ? "✓ SIGN OFF — LOCK COMPETITIVE LANDSCAPE"
            : `STRENGTHEN MANIFESTO — ${60 - scores.total} POINTS TO UNLOCK`}
        </button>
      )}
    </div>
  );
}
