import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EndChoiceScreen } from "./shared/EndChoiceScreen";
import { useConstellation } from "./shared/ConstellationCanvas";
import { HUD } from "./shared/HUD";
import { MessagingTicker } from "./shared/MessagingTicker";
import { QuestionScreen } from "./shared/QuestionScreen";
import { BlindspotPanel } from "./shared/BlindspotPanel";
import { DemographicPicker } from "./shared/DemographicPicker";
import { LeadCapture, type Lead } from "./shared/LeadCapture";
import { Paywall, type Credentials } from "./shared/Paywall";
import {
  FRAMEWORK_QUESTIONS,
  FOCUS_QUESTIONS,
  TICKER_MESSAGES,
  ONBOARDING_LS_KEYS,
  type Demographic,
} from "./shared/onboarding-data";
import "./shared/onboarding.css";

type Scene =
  | "demographic"
  | "lead"
  | "framework-intro"
  | "framework"
  | "framework-blindspot"
  | "paywall"
  | "focus-intro"
  | "focus"
  | "focus-blindspot"
  | "end";

const DATA_POINTS_PER_Q = 47;

export default function OnboardingFlow() {
  const nav = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const constellation = useConstellation(canvasRef);

  const [scene, setScene] = useState<Scene>("demographic");
  const [demographic, setDemographic] = useState<Demographic | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  const [fwAnswers, setFwAnswers] = useState<("Y" | "N")[]>([]);
  const [focusAnswers, setFocusAnswers] = useState<("Y" | "N")[]>([]);
  const [pendingBlindspotIdx, setPendingBlindspotIdx] = useState<number | null>(null);

  const fwIdx = fwAnswers.length;
  const focusIdx = focusAnswers.length;

  const totalAnswered = fwAnswers.length + focusAnswers.length;
  const yesCount = fwAnswers.filter((a) => a === "Y").length + focusAnswers.filter((a) => a === "Y").length;
  const blindspotCount = fwAnswers.filter((a) => a === "N").length + focusAnswers.filter((a) => a === "N").length;
  const confidence = totalAnswered === 0 ? 0 : Math.round((yesCount / totalAnswered) * 100);
  const intelligence = totalAnswered * DATA_POINTS_PER_Q + (demographic ? 80 : 0) + (lead ? 120 : 0);

  // Seed background nodes so canvas isn't blank on landing.
  useEffect(() => {
    constellation.addNodes(6, "gold");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (module: "FRAMEWORK" | "FOCUS", answer: "Y" | "N") => {
    if (answer === "Y") constellation.addNodes(4, "gold");
    else constellation.addNodes(3, "red");

    if (module === "FRAMEWORK") {
      const next = [...fwAnswers, answer];
      setFwAnswers(next);
      try { localStorage.setItem(ONBOARDING_LS_KEYS.fwAnswers, JSON.stringify(next)); } catch { /* ignore */ }

      if (answer === "N") {
        setPendingBlindspotIdx(next.length - 1);
        setScene("framework-blindspot");
      } else if (next.length >= FRAMEWORK_QUESTIONS.length) {
        setScene("paywall");
      }
    } else {
      const next = [...focusAnswers, answer];
      setFocusAnswers(next);
      try { localStorage.setItem(ONBOARDING_LS_KEYS.focusAnswers, JSON.stringify(next)); } catch { /* ignore */ }

      if (answer === "N") {
        setPendingBlindspotIdx(next.length - 1);
        setScene("focus-blindspot");
      } else if (next.length >= FOCUS_QUESTIONS.length) {
        setScene("end");
      }
    }
  };

  const continueAfterBlindspot = () => {
    if (scene === "framework-blindspot") {
      if (fwAnswers.length >= FRAMEWORK_QUESTIONS.length) setScene("paywall");
      else setScene("framework");
    } else if (scene === "focus-blindspot") {
      if (focusAnswers.length >= FOCUS_QUESTIONS.length) setScene("end");
      else setScene("focus");
    }
    setPendingBlindspotIdx(null);
  };

  const goPrevFw = () => {
    if (fwAnswers.length === 0) return;
    const next = fwAnswers.slice(0, -1);
    setFwAnswers(next);
  };
  const goPrevFocus = () => {
    if (focusAnswers.length === 0) return;
    const next = focusAnswers.slice(0, -1);
    setFocusAnswers(next);
  };

  const currentBlindspot = useMemo(() => {
    if (pendingBlindspotIdx == null) return null;
    if (scene === "framework-blindspot") return FRAMEWORK_QUESTIONS[pendingBlindspotIdx];
    if (scene === "focus-blindspot") return FOCUS_QUESTIONS[pendingBlindspotIdx];
    return null;
  }, [pendingBlindspotIdx, scene]);

  const persistBlindspots = (q: { id: string; pillar: string; text: string } | null) => {
    if (!q) return;
    try {
      const raw = localStorage.getItem(ONBOARDING_LS_KEYS.blindspots);
      const arr: { id: string; pillar: string; text: string }[] = raw ? JSON.parse(raw) : [];
      if (!arr.find((b) => b.id === q.id)) arr.push(q);
      localStorage.setItem(ONBOARDING_LS_KEYS.blindspots, JSON.stringify(arr));
    } catch { /* ignore */ }
  };
  useEffect(() => { persistBlindspots(currentBlindspot); }, [currentBlindspot]);

  return (
    <div className="onboarding-scope">
      <button className="ob-exit" onClick={() => nav("/")}>✕ EXIT</button>

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
          {scene === "demographic" && (
            <DemographicPicker
              onPick={(d) => {
                setDemographic(d);
                constellation.addNodes(4, "gold");
                try { localStorage.setItem(ONBOARDING_LS_KEYS.demographic, d); } catch { /* ignore */ }
                setScene("lead");
              }}
            />
          )}

          {scene === "lead" && (
            <LeadCapture
              onSubmit={(l) => {
                setLead(l);
                constellation.addNodes(5, "gold");
                try { localStorage.setItem(ONBOARDING_LS_KEYS.lead, JSON.stringify(l)); } catch { /* ignore */ }
                setScene("framework-intro");
              }}
            />
          )}

          {scene === "framework-intro" && lead && (
            <div className="ob-intro">
              <div className="ob-label">FRAMEWORK · 21-POINT ASSESSMENT</div>
              <h2 className="ob-intro-h2">Welcome, {lead.firstName}.</h2>
              <p className="ob-intro-sub">21 binary questions across 5 pillars. <strong>YES</strong> confirms value. <strong>NO</strong> exposes a blindspot.</p>
              <p className="ob-intro-sub muted">Use <span className="kbd">Y</span> / <span className="kbd">N</span> / <span className="kbd">Enter</span> to move fast. <span className="kbd">←</span> to go back.</p>
              <button className="ob-btn" onClick={() => setScene("framework")}>BEGIN ASSESSMENT</button>
            </div>
          )}

          {scene === "framework" && fwIdx < FRAMEWORK_QUESTIONS.length && (
            <QuestionScreen
              question={FRAMEWORK_QUESTIONS[fwIdx]}
              questionNumber={fwIdx + 1}
              total={FRAMEWORK_QUESTIONS.length}
              module="FRAMEWORK"
              onSubmit={(a) => handleAnswer("FRAMEWORK", a)}
              onPrev={fwIdx > 0 ? goPrevFw : undefined}
            />
          )}

          {scene === "framework-blindspot" && currentBlindspot && (
            <BlindspotPanel question={currentBlindspot} onContinue={continueAfterBlindspot} />
          )}

          {scene === "paywall" && lead && (
            <Paywall
              lead={lead}
              blindspotCount={blindspotCount}
              onUnlock={(c) => {
                setCredentials(c);
                try { localStorage.setItem(ONBOARDING_LS_KEYS.credentials, JSON.stringify({ username: c.username })); } catch { /* ignore */ }
                constellation.addNodes(10, "gold");
                setScene("focus-intro");
              }}
            />
          )}

          {scene === "focus-intro" && lead && credentials && (
            <div className="ob-intro">
              <div className="ob-label">FOCUS · 100-POINT DEEP DIVE</div>
              <h2 className="ob-intro-h2">Account unlocked, {credentials.username}.</h2>
              <p className="ob-intro-sub">100 questions across 5 pillars. Same rules — same speed. Response timing measured.</p>
              <p className="ob-intro-sub muted">~20-30 minutes. Or take it in chunks — your progress saves.</p>
              <button className="ob-btn" onClick={() => setScene("focus")}>BEGIN DEEP DIVE</button>
            </div>
          )}

          {scene === "focus" && focusIdx < FOCUS_QUESTIONS.length && (
            <QuestionScreen
              question={FOCUS_QUESTIONS[focusIdx]}
              questionNumber={focusIdx + 1}
              total={FOCUS_QUESTIONS.length}
              module="FOCUS"
              onSubmit={(a) => handleAnswer("FOCUS", a)}
              onPrev={focusIdx > 0 ? goPrevFocus : undefined}
            />
          )}

          {scene === "focus-blindspot" && currentBlindspot && (
            <BlindspotPanel question={currentBlindspot} onContinue={continueAfterBlindspot} />
          )}

          {scene === "end" && (
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
