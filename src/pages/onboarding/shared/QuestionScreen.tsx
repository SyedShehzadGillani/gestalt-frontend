import { useEffect, useState } from "react";
import type { OnboardingQuestion, Pillar } from "./onboarding-data";
import { PILLARS } from "./onboarding-data";

type Props = {
  question: OnboardingQuestion;
  questionNumber: number; // 1-based position in current module (e.g. 4 of 21)
  total: number;
  module: "FRAMEWORK" | "FOCUS";
  onSubmit: (answer: "Y" | "N") => void;
  onPrev?: () => void;
};

export function QuestionScreen({ question, questionNumber, total, module, onSubmit, onPrev }: Props) {
  const [pick, setPick] = useState<"Y" | "N" | null>(null);

  // Reset on question change.
  useEffect(() => { setPick(null); }, [question.id]);

  // Keyboard: Y=YES, N=NO, Enter=submit, ←=prev, →=submit-if-picked
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "y" || e.key === "Y") { setPick("Y"); e.preventDefault(); }
      else if (e.key === "n" || e.key === "N") { setPick("N"); e.preventDefault(); }
      else if (e.key === "Enter" || e.key === "ArrowRight") {
        if (pick) { onSubmit(pick); e.preventDefault(); }
      } else if (e.key === "ArrowLeft") {
        if (onPrev) { onPrev(); e.preventDefault(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pick, onSubmit, onPrev]);

  return (
    <div className="ob-q">
      {/* Top pillar breadcrumb */}
      <div className="ob-q-breadcrumb">
        <span className="muted">WELCOME</span>
        {PILLARS.map((p) => (
          <span key={p} className={p === question.pillar ? "active" : "muted"}>
            <span className="slash"> / </span>{p}
          </span>
        ))}
      </div>

      {/* Question number + pillar header */}
      <div className="ob-q-header">
        {String(questionNumber).padStart(2, "0")} / {question.pillar}
      </div>
      <div className="ob-q-rule" />

      {/* Question text */}
      <h2 className="ob-q-text">{question.text}</h2>

      {/* Y / N buttons */}
      <div className="ob-q-choices">
        <button className={`ob-q-choice ${pick === "Y" ? "picked" : ""}`} onClick={() => setPick("Y")}>YES</button>
        <button className={`ob-q-choice ${pick === "N" ? "picked" : ""}`} onClick={() => setPick("N")}>NO</button>
      </div>

      <div className="ob-q-rule" />

      {/* Submit bar */}
      <button
        className={`ob-q-submit ${pick ? "active" : ""}`}
        disabled={!pick}
        onClick={() => pick && onSubmit(pick)}
      >
        SUBMIT
      </button>

      <div className="ob-q-rule" />

      {/* Citations */}
      <div className="ob-q-citations">
        {question.citations.map((c, i) => (
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

      {/* Footer: prev + keyboard hint */}
      <div className="ob-q-footer">
        {onPrev && questionNumber > 1 ? (
          <button className="ob-q-prev" onClick={onPrev}>← Previous Question</button>
        ) : <span />}
        <span className="ob-q-kbd-hint">
          {module} · {questionNumber} / {total} · <span className="ob-q-kbd">Y</span> Yes · <span className="ob-q-kbd">N</span> No · <span className="ob-q-kbd">Enter</span> Submit · <span className="ob-q-kbd">←</span> Back
        </span>
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
