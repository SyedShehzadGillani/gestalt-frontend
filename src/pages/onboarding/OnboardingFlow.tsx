import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EndChoiceScreen } from "./shared/EndChoiceScreen";
import { useConstellation } from "./shared/ConstellationCanvas";
import { HUD } from "./shared/HUD";
import { MessagingTicker } from "./shared/MessagingTicker";
import { QuestionScreen } from "./shared/QuestionScreen";
import { DemographicPicker } from "./shared/DemographicPicker";
import { LeadCapture } from "./shared/LeadCapture";
import { Paywall } from "./shared/Paywall";
import { ConfidenceStep } from "./shared/ConfidenceStep";
import { ResultsDashboard } from "./shared/ResultsDashboard";
import { downloadResultsPdf } from "./shared/results-pdf";
import {
  FRAMEWORK_QUESTIONS, FOCUS_QUESTIONS, TICKER_MESSAGES, type Demographic,
} from "./shared/onboarding-data";
import type { Answer } from "./shared/results-logic";
import {
  type OnboardingSession, type Scene, emptySession, loadSession, saveSession, clearSession,
} from "./shared/session";
import "./shared/onboarding.css";

const DATA_POINTS_PER_Q = 47;

export default function OnboardingFlow() {
  const nav = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const constellation = useConstellation(canvasRef);

  const [s, setS] = useState<OnboardingSession>(() => loadSession() ?? emptySession());

  // Persist on every change.
  useEffect(() => { saveSession(s); }, [s]);

  const patch = (p: Partial<OnboardingSession>) => setS((prev) => ({ ...prev, ...p }));
  const go = (scene: Scene) => patch({ scene });

  const fwIdx = s.fwAnswers.length;
  const focusIdx = s.focusAnswers.length;

  const totalAnswered = s.fwAnswers.length + s.focusAnswers.length;
  const yesCnt = s.fwAnswers.filter((a) => a === "Y").length + s.focusAnswers.filter((a) => a === "Y").length;
  const blindspotCount = totalAnswered - yesCnt;
  const confidence = totalAnswered === 0 ? 0 : Math.round((yesCnt / totalAnswered) * 100);
  const intelligence = totalAnswered * DATA_POINTS_PER_Q + (s.demographic ? 80 : 0) + (s.lead ? 120 : 0);

  // Seed background nodes once.
  useEffect(() => {
    constellation.addNodes(6, "gold");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (module: "FRAMEWORK" | "FOCUS", answer: Answer, elapsedMs: number) => {
    if (answer === "Y") constellation.addNodes(4, "gold");
    else constellation.addNodes(3, "red");

    if (module === "FRAMEWORK") {
      const fwAnswers = [...s.fwAnswers, answer];
      const fwTimings = [...s.fwTimings, elapsedMs];
      const done = fwAnswers.length >= FRAMEWORK_QUESTIONS.length;
      patch({ fwAnswers, fwTimings, scene: done ? "framework-confidence" : "framework" });
    } else {
      const focusAnswers = [...s.focusAnswers, answer];
      const focusTimings = [...s.focusTimings, elapsedMs];
      const done = focusAnswers.length >= FOCUS_QUESTIONS.length;
      patch({ focusAnswers, focusTimings, scene: done ? "focus-confidence" : "focus" });
    }
  };

  const goPrevFw = () => fwIdx > 0 && patch({ fwAnswers: s.fwAnswers.slice(0, -1), fwTimings: s.fwTimings.slice(0, -1) });
  const goPrevFocus = () => focusIdx > 0 && patch({ focusAnswers: s.focusAnswers.slice(0, -1), focusTimings: s.focusTimings.slice(0, -1) });

  const startOver = () => { clearSession(); setS(emptySession()); };

  return (
    <div className="onboarding-scope">
      <button className="ob-exit" onClick={() => nav("/")}>✕ EXIT</button>
      {s.scene !== "demographic" && <button className="ob-startover" onClick={startOver}>↺ Start over</button>}

      <div className="ob-stage">
        {/* Left: constellation canvas */}
        <div className="ob-canvas-wrap">
          <canvas ref={canvasRef} />
          <HUD intelligence={intelligence} confidence={confidence} />
          {blindspotCount > 0 && (
            <div className="ob-blindspot-counter">
              <span className="red">●</span> {blindspotCount} BLINDSPOT{blindspotCount === 1 ? "" : "S"} EXPOSED
            </div>
          )}
          <MessagingTicker messages={TICKER_MESSAGES} />
        </div>

        {/* Right: scene panel */}
        <div className="ob-panel">
          {s.scene === "demographic" && (
            <DemographicPicker
              onPick={(d: Demographic) => {
                constellation.addNodes(4, "gold");
                patch({ demographic: d, scene: "lead" });
              }}
            />
          )}

          {s.scene === "lead" && (
            <LeadCapture
              onSubmit={(l) => {
                constellation.addNodes(5, "gold");
                patch({ lead: l, scene: "framework-intro" });
              }}
            />
          )}

          {s.scene === "framework-intro" && s.lead && (
            <div className="ob-intro">
              <div className="ob-label">FRAMEWORK · 21-POINT ASSESSMENT</div>
              <h2 className="ob-intro-h2">Welcome, {s.lead.firstName}.</h2>
              <p className="ob-intro-sub">21 questions across 4 pillars. <strong>YES</strong> confirms value. <strong>NO</strong> exposes a blindspot.</p>
              <p className="ob-intro-sub muted">Use <span className="kbd">Y</span> / <span className="kbd">N</span> / <span className="kbd">Enter</span> to move fast. <span className="kbd">←</span> to go back.</p>
              <button className="ob-btn" onClick={() => go("framework")}>BEGIN ASSESSMENT</button>
            </div>
          )}

          {s.scene === "framework" && s.demographic && fwIdx < FRAMEWORK_QUESTIONS.length && (
            <QuestionScreen
              question={FRAMEWORK_QUESTIONS[fwIdx]}
              questionNumber={fwIdx + 1}
              total={FRAMEWORK_QUESTIONS.length}
              module="FRAMEWORK"
              demographic={s.demographic}
              onSubmit={(a, ms) => handleAnswer("FRAMEWORK", a, ms)}
              onPrev={fwIdx > 0 ? goPrevFw : undefined}
            />
          )}

          {s.scene === "framework-confidence" && (
            <ConfidenceStep module="FRAMEWORK" onSubmit={(r) => patch({ fwConfidence: r, scene: "framework-results" })} />
          )}

          {s.scene === "framework-results" && s.demographic && (
            <ResultsDashboard
              module="FRAMEWORK"
              questions={FRAMEWORK_QUESTIONS}
              answers={s.fwAnswers}
              timings={s.fwTimings}
              confidence={s.fwConfidence ?? 0}
              demographic={s.demographic}
              onNext={() => go("paywall")}
              onReturn={() => nav("/")}
              onDownloadPdf={() => downloadResultsPdf({
                module: "FRAMEWORK", companyName: s.lead?.companyName ?? "Your Company",
                questions: FRAMEWORK_QUESTIONS, answers: s.fwAnswers, demographic: s.demographic!, confidence: s.fwConfidence ?? 0,
              })}
            />
          )}

          {s.scene === "paywall" && s.lead && (
            <Paywall
              lead={s.lead}
              blindspotCount={blindspotCount}
              onUnlock={(c) => {
                constellation.addNodes(10, "gold");
                patch({ credentials: { username: c.username }, scene: "focus-intro" });
              }}
            />
          )}

          {s.scene === "focus-intro" && s.credentials && (
            <div className="ob-intro">
              <div className="ob-label">FOCUS · 100-POINT DEEP DIVE</div>
              <h2 className="ob-intro-h2">Account unlocked, {s.credentials.username}.</h2>
              <p className="ob-intro-sub">100 questions across 5 pillars. Same rules — same speed. Response timing measured.</p>
              <p className="ob-intro-sub muted">~20-30 minutes. Or take it in chunks — your progress saves automatically.</p>
              <button className="ob-btn" onClick={() => go("focus")}>BEGIN DEEP DIVE</button>
            </div>
          )}

          {s.scene === "focus" && s.demographic && focusIdx < FOCUS_QUESTIONS.length && (
            <QuestionScreen
              question={FOCUS_QUESTIONS[focusIdx]}
              questionNumber={focusIdx + 1}
              total={FOCUS_QUESTIONS.length}
              module="FOCUS"
              demographic={s.demographic}
              onSubmit={(a, ms) => handleAnswer("FOCUS", a, ms)}
              onPrev={focusIdx > 0 ? goPrevFocus : undefined}
            />
          )}

          {s.scene === "focus-confidence" && (
            <ConfidenceStep module="FOCUS" onSubmit={(r) => patch({ focusConfidence: r, scene: "focus-results" })} />
          )}

          {s.scene === "focus-results" && s.demographic && (
            <ResultsDashboard
              module="FOCUS"
              questions={FOCUS_QUESTIONS}
              answers={s.focusAnswers}
              timings={s.focusTimings}
              confidence={s.focusConfidence ?? 0}
              demographic={s.demographic}
              onNext={() => go("end")}
              onReturn={() => nav("/")}
              onDownloadPdf={() => downloadResultsPdf({
                module: "FOCUS", companyName: s.lead?.companyName ?? "Your Company",
                questions: FOCUS_QUESTIONS, answers: s.focusAnswers, demographic: s.demographic!, confidence: s.focusConfidence ?? 0,
              })}
            />
          )}

          {s.scene === "end" && (
            <EndChoiceScreen
              demoName="Constellation"
              vaultView={
                <div className="ob-end-grid">
                  <div><div className="num">{intelligence.toLocaleString()}</div><div className="lbl">DATA POINTS</div></div>
                  <div><div className="num">{blindspotCount}</div><div className="lbl">BLINDSPOTS</div></div>
                  <div><div className="num">{confidence}%</div><div className="lbl">CONFIDENCE</div></div>
                </div>
              }
              onEnterVault={() => nav("/client/1/vault")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
