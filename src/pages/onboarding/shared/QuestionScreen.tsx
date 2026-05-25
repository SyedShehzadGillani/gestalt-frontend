import { useEffect, useRef, useState } from "react";
import type { OnboardingQuestion, Pillar, Demographic } from "./onboarding-data";
import { FRAMEWORK_PILLARS, FOCUS_PILLARS, pickForDemo } from "./onboarding-data";

type Props = {
  question: OnboardingQuestion;
  questionNumber: number; // 1-based position in current module (e.g. 4 of 21)
  total: number;
  module: "FRAMEWORK" | "FOCUS";
  demographic: Demographic;
  onSubmit: (answer: "Y" | "N", elapsedMs: number) => void;
  onPrev?: () => void;
};

export function QuestionScreen({ question, questionNumber, total, module, demographic, onSubmit, onPrev }: Props) {
  const [pick, setPick] = useState<"Y" | "N" | null>(null);
  const t0 = useRef<number>(performance.now());

  // Reset pick + timer on question change.
  useEffect(() => { setPick(null); t0.current = performance.now(); }, [question.id]);

  const submit = (a: "Y" | "N") => onSubmit(a, Math.round(performance.now() - t0.current));

  // Keyboard: Y=YES, N=NO, Enter=submit, ←=prev, →=submit-if-picked
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "y" || e.key === "Y") { setPick("Y"); e.preventDefault(); }
      else if (e.key === "n" || e.key === "N") { setPick("N"); e.preventDefault(); }
      else if (e.key === "Enter" || e.key === "ArrowRight") {
        if (pick) { onSubmit(pick, Math.round(performance.now() - t0.current)); e.preventDefault(); }
      } else if (e.key === "ArrowLeft") {
        if (onPrev) { onPrev(); e.preventDefault(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pick, onSubmit, onPrev]);

  // Pillar breadcrumb varies by module: FRAMEWORK = 4 pillars, FOCUS = 5 pillars.
  const breadcrumbPillars: Pillar[] = module === "FRAMEWORK" ? FRAMEWORK_PILLARS : FOCUS_PILLARS;

  // Resolve text + NO stats for current demographic (NO stats drive the visible
  // urgency framing pre-answer, matching the existing UI tone; YES stats are
  // stored for future post-answer affirmation panel).
  const text = pickForDemo(question.text, demographic);
  const visibleStats = pickForDemo(question.noStats, demographic);

  return (
    <div className="ob-q">
      {/* Top pillar breadcrumb */}
      <div className="ob-q-breadcrumb">
        {(() => {
          const currentIdx = breadcrumbPillars.indexOf(question.pillar);
          // WELCOME is always "done" (already passed)
          return (
            <>
              <span className="done">WELCOME</span>
              {breadcrumbPillars.map((p, i) => {
                const cls = i < currentIdx ? "done" : i === currentIdx ? "active" : "pending";
                const slashCls = i - 1 < currentIdx ? "slash-done" : "slash-pending";
                return (
                  <span key={p} className={cls}>
                    <span className={`slash ${slashCls}`}> / </span>{p}
                  </span>
                );
              })}
            </>
          );
        })()}
      </div>

      {/* Question number + pillar header */}
      <div className="ob-q-header">
        <span className="ob-q-num">{String(questionNumber).padStart(2, "0")} / </span>{question.pillar}
      </div>
      <div className="ob-q-rule" />

      {/* Question text */}
      <h2 className="ob-q-text">{text}</h2>

      {/* Y / N buttons */}
      <div className="ob-q-choices">
        <button className={`ob-q-choice ob-q-choice--yes ${pick === "Y" ? "picked" : ""}`} onClick={() => setPick("Y")}>YES</button>
        <button className={`ob-q-choice ob-q-choice--no ${pick === "N" ? "picked" : ""}`} onClick={() => setPick("N")}>NO</button>
      </div>

      <div className="ob-q-rule" />

      {/* Submit bar */}
      <button
        className={`ob-q-submit ${pick ? "active" : ""}`}
        disabled={!pick}
        onClick={() => pick && submit(pick)}
      >
        SUBMIT
      </button>

      <div className="ob-q-rule" />

      {/* Citations (NO-path stats — urgency framing of what's at stake) */}
      <div className="ob-q-citations">
        {visibleStats.map((c, i) => (
          <div key={i} className="ob-q-citation">
            <div><strong>{c.highlight}</strong> {c.text}</div>
            <div className="ob-q-source">-{c.source}</div>
          </div>
        ))}
      </div>

      {/* GI logo */}
      <div className="ob-q-gi-logo" aria-hidden>
        <GILogo />
      </div>

      {/* Footer: prev only — keyboard hints now live in global bottom bar */}
      <div className="ob-q-footer">
        {onPrev && questionNumber > 1 ? (
          <button className="ob-q-prev" onClick={onPrev}>&lt; PREVIOUS QUESTION</button>
        ) : <span />}
      </div>
    </div>
  );
}

function GILogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="#444" strokeWidth="1" />
      <path d="M7 11 L15 11 M11 7 L11 15" stroke="#444" strokeWidth="0.7" />
    </svg>
  );
}

// Keep prop unused-warning quiet for Pillar type re-export — used by callers.
export type { Pillar };
