import {
  LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip,
} from "recharts";
import type { OnboardingQuestion, Demographic } from "./onboarding-data";
import type { Answer } from "./results-logic";
import {
  yesCount, brandHealth, bandFor, HEALTH_BANDS,
  avgResponseSeconds, quickAnswers, pillarBreakdown, blindspotIndices,
} from "./results-logic";
import { HISTORY_STUB, EXIT_READY_RATIO } from "./history-stub";
import { BlindspotCard } from "./BlindspotCard";

type Props = {
  module: "FRAMEWORK" | "FOCUS";
  questions: OnboardingQuestion[];
  answers: Answer[];
  timings: number[];
  confidence: number;
  demographic: Demographic;
  onNext: () => void;       // FRAMEWORK: → paywall. FOCUS: → end.
  onDownloadPdf: () => void;
  onReturn: () => void;
};

export function ResultsDashboard({
  module, questions, answers, timings, confidence, demographic,
  onNext, onDownloadPdf, onReturn,
}: Props) {
  const total = questions.length;
  const yes = yesCount(answers);
  const health = brandHealth(answers);
  const band = bandFor(health);
  const qa = quickAnswers(timings);
  const avg = avgResponseSeconds(timings);
  const pillars = pillarBreakdown(questions, answers);
  const blindspots = blindspotIndices(answers);

  const chartData = [
    ...HISTORY_STUB,
    { label: "Today", score: yes },
  ];
  const threshold = Math.round(EXIT_READY_RATIO * total);

  return (
    <div className="ob-results">
      {/* Score hero */}
      <div className="ob-results-hero">
        <div className="ob-results-score">{yes}<span> OF {total} POINTS</span></div>
        <div className="ob-results-band">{band.label}</div>
        <p className="ob-results-tagline">
          Your brand shows measurable fundamentals. Close the identified gaps to maximize exit potential.
        </p>
      </div>

      {/* Stat cards */}
      <div className="ob-results-stats">
        <div className="ob-stat-card highlight">
          <div className="ob-stat-label">FINAL CONFIDENCE</div>
          <div className="ob-stat-value">{confidence}<span> /10</span></div>
          <div className="ob-stat-sub">Self-rated confidence level</div>
        </div>
        <div className="ob-stat-card">
          <div className="ob-stat-label">QUICK ANSWERS</div>
          <div className="ob-stat-value">{qa.pct}%<span> ({qa.count}/{qa.total})</span></div>
          <div className="ob-stat-sub">Within 5-second threshold</div>
        </div>
        <div className="ob-stat-card">
          <div className="ob-stat-label">AVG RESPONSE TIME</div>
          <div className="ob-stat-value">{avg}s</div>
          <div className="ob-stat-sub">Across all {total} questions</div>
        </div>
      </div>

      {/* Assessment history */}
      <div className="ob-results-panel">
        <div className="ob-panel-head">
          <div><h3>Assessment History</h3><span>Track your brand health progress over time</span></div>
          <div className="ob-panel-count">ASSESSMENTS<br /><strong>{chartData.length}</strong></div>
        </div>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
              <XAxis dataKey="label" stroke="#6b7176" fontSize={11} />
              <YAxis domain={[0, total]} stroke="#6b7176" fontSize={11} />
              <Tooltip contentStyle={{ background: "#16181c", border: "1px solid #2a2d33" }} />
              <ReferenceLine y={threshold} stroke="#c9a227" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="score" stroke="#e2b53f" strokeWidth={2} dot={{ r: 3, fill: "#e2b53f" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Brand health spectrum */}
      <div className="ob-results-panel">
        <div className="ob-spectrum-top"><strong>{health}</strong><span>/100</span><em>BRAND HEALTH SPECTRUM</em></div>
        <div className="ob-spectrum-bar">
          <div className="ob-spectrum-marker" style={{ left: `${health}%` }} />
        </div>
        <div className="ob-spectrum-labels">
          {HEALTH_BANDS.map((b) => (
            <span key={b.label} className={b.label === band.label ? "active" : ""}>{b.label}</span>
          ))}
        </div>
      </div>

      {/* Pillar cards */}
      <div className="ob-results-pillars">
        {pillars.map((p) => (
          <div key={p.pillar} className="ob-pillar-card">
            <div className="ob-pillar-name">{p.pillar}</div>
            <div className={`ob-pillar-pct ${p.pct >= 60 ? "good" : "bad"}`}>{p.pct}% <span>({p.yes}/{p.total})</span></div>
            <div className="ob-pillar-bar"><div style={{ width: `${p.pct}%` }} className={p.pct >= 60 ? "good" : "bad"} /></div>
          </div>
        ))}
      </div>

      {/* Identified blindspots */}
      <div className="ob-results-blindspots">
        <h2><span className="ob-bs-count">{blindspots.length}</span> IDENTIFIED BLINDSPOTS</h2>
        <p className="ob-bs-intro">These gaps are limiting your brand's potential and exit valuation.</p>
        {blindspots.map((i) => (
          <BlindspotCard key={questions[i].id} question={questions[i]} demographic={demographic} index={i} />
        ))}
      </div>

      {/* Next step (FRAMEWORK only) */}
      {module === "FRAMEWORK" && (
        <div className="ob-results-next">
          <div className="ob-next-tag">NEXT STEP</div>
          <h3>Go Deeper with 100-Point FOCUS Audit</h3>
          <p>Uncover 100 data-driven reasons why customers should choose you. Get a comprehensive analysis with actionable recommendations.</p>
          <button className="ob-q-submit active" onClick={onNext}>SCHEDULE FOCUS AUDIT →</button>
        </div>
      )}

      {/* Footer */}
      <div className="ob-results-footer">
        <button onClick={onDownloadPdf}>⬇ Download PDF Report</button>
        <button onClick={() => navigator.clipboard?.writeText(window.location.href)}>↗ Share Results</button>
        <button onClick={onReturn}>← Return to Dashboard</button>
        {module === "FOCUS" && <button className="ob-q-submit active" onClick={onNext}>CONTINUE →</button>}
      </div>
    </div>
  );
}
