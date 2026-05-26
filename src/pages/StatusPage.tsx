import "./status.css";
import {
  COMPANY_SCORES,
  SEGMENT_SCORES,
  ONBOARDING_STEPS,
  ALERTS,
  VALUATION_DRAIN_DATA,
  MOCK_DAILY_TASKS,
} from "@/data/mockData.js";

const DAYS_TO_NEXT_REVIEW = 76; // 90-day cadence; mock countdown

interface Alert { id: number; priority: string; title: string; module: string; dollarsAtStake: number; }
interface Step { label: string; timing: string; status: string; }
interface Task { id: string; dollarsAtStake: number; }

function fmt(n: number) {
  return `$${n.toLocaleString()}`;
}

function signalColor(score: number) {
  if (score < 50) return "#873025";
  if (score < 60) return "#ba702a";
  return "#c0933b";
}

export default function StatusPage() {
  const alerts = ALERTS as Alert[];
  const steps = ONBOARDING_STEPS as Step[];
  const tasks = MOCK_DAILY_TASKS as Task[];

  // Blind spots = AI-identified, not yet executed → open alerts + incomplete modules
  const openAlerts = alerts.filter((a) => a.dollarsAtStake >= 0);
  const pendingSteps = steps.filter((s) => s.status === "pending");

  // Lowest-scoring dimensions (weakest signals)
  const lowestSignals = Object.entries(SEGMENT_SCORES as Record<string, number>)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 4);

  // Accomplished = done + active steps
  const accomplished = steps.filter((s) => s.status === "done" || s.status === "active");

  // Total flagged dollars across open daily tasks
  const totalFlagged = tasks.reduce((sum, t) => sum + (t.dollarsAtStake || 0), 0);

  return (
    <div className="status-scope">
      {/* Header */}
      <div className="status-eyebrow">B.A.S.E. — STATUS</div>
      <div className="status-scoreRow">
        <span className="status-score">{COMPANY_SCORES.gestaltScore.toFixed(1)}</span>
        <span className="status-scoreLabel">{COMPANY_SCORES.exitLabel}</span>
        <span className="status-delta">+{COMPANY_SCORES.quarterDelta.toFixed(1)} this quarter</span>
      </div>
      <p className="status-intro">
        Where your Brand and Strategy Engine stands right now — what the AI has flagged but you
        haven&apos;t executed, what&apos;s already done, and what the gaps are costing you. The AI
        reviews your progress every 90 days to keep B.A.S.E. moving toward completion.
      </p>

      {/* 90-day review banner */}
      <div className="status-banner">
        <div className="status-banner-text">
          <span className="status-banner-title">Next AI progress review in {DAYS_TO_NEXT_REVIEW} days</span>
          <span className="status-banner-sub">
            GESTALT INTELLIGENCE will reassess your blind spots and re-score B.A.S.E.
          </span>
        </div>
        <button className="status-banner-cta" type="button">Review now →</button>
      </div>

      {/* Three sections */}
      <div className="status-grid">
        {/* BLIND SPOTS */}
        <div className="status-card">
          <div className="status-card-head">
            <span className="status-card-title">Blind Spots</span>
            <span className="status-card-count">{openAlerts.length + pendingSteps.length} identified · not executed</span>
          </div>

          <div className="status-sub">Flagged — awaiting action</div>
          {openAlerts.map((a) => (
            <div className="status-row" key={a.id}>
              <div className="status-row-main">
                <div className="status-row-title">{a.title}</div>
                <div className="status-row-desc">{a.module} · {a.priority} priority</div>
              </div>
              {a.dollarsAtStake > 0 && <span className="status-stake">{fmt(a.dollarsAtStake)}</span>}
            </div>
          ))}

          <div className="status-sub">Not yet started</div>
          {pendingSteps.map((s) => (
            <div className="status-row" key={s.label}>
              <span className="status-dot pending" />
              <div className="status-row-main">
                <div className="status-row-title">{s.label}</div>
                <div className="status-row-desc">{s.timing}</div>
              </div>
            </div>
          ))}

          <div className="status-sub">Lowest signals</div>
          {lowestSignals.map(([name, score]) => (
            <div className="status-signal" key={name}>
              <span className="status-signal-name">{name}</span>
              <span className="status-signal-score" style={{ color: signalColor(score) }}>
                {score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        {/* ACCOMPLISHED */}
        <div className="status-card">
          <div className="status-card-head">
            <span className="status-card-title">Accomplished</span>
            <span className="status-card-count">{accomplished.length} of {ONBOARDING_STEPS.length} modules</span>
          </div>

          {accomplished.map((s) => (
            <div className="status-row" key={s.label}>
              <span className="status-check" style={{ color: s.status === "done" ? "#5fcc00" : "#c9a227" }}>
                {s.status === "done" ? "✓" : "◐"}
              </span>
              <div className="status-row-main">
                <div className="status-row-title">{s.label}</div>
                <div className="status-row-desc">
                  {s.status === "done" ? `Complete · ${s.timing}` : `In progress · ${s.timing}`}
                </div>
              </div>
            </div>
          ))}

          <div className="status-sub">Momentum</div>
          <div className="status-row">
            <span className="status-check" style={{ color: "#5fcc00" }}>↑</span>
            <div className="status-row-main">
              <div className="status-row-title">+{COMPANY_SCORES.quarterDelta.toFixed(1)} GESTALT points this quarter</div>
              <div className="status-row-desc">B.A.S.E. {COMPANY_SCORES.base.toFixed(1)} · C.O.R.E. confidence {COMPANY_SCORES.coreConfidence}</div>
            </div>
          </div>
        </div>

        {/* VALUE AT STAKE */}
        <div className="status-card">
          <div className="status-card-head">
            <span className="status-card-title">Value at Stake</span>
            <span className="status-card-count">cost of inaction</span>
          </div>

          <div className="status-bigstat-cap">Valuation drain</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginTop: 4 }}>
            <span className="status-bigstat">{fmt(VALUATION_DRAIN_DATA.dailyCost)}</span>
            <span className="status-bigstat-unit">/day</span>
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="status-stat">
              <span className="status-stat-label">Next 90 days</span>
              <span className="status-stat-value">{fmt(VALUATION_DRAIN_DATA.ninetyDayCost)}</span>
            </div>
            <div className="status-stat">
              <span className="status-stat-label">Annual cost of inaction</span>
              <span className="status-stat-value">{fmt(VALUATION_DRAIN_DATA.annualCost)}</span>
            </div>
            <div className="status-stat">
              <span className="status-stat-label">Flagged in open tasks</span>
              <span className="status-stat-value">{fmt(totalFlagged)}</span>
            </div>
          </div>

          <p className="status-intro" style={{ marginTop: "auto", paddingTop: 14 }}>
            Every day B.A.S.E. stays unfinished, your exit valuation erodes. Closing the blind spots
            above recovers this premium.
          </p>
        </div>
      </div>
    </div>
  );
}
