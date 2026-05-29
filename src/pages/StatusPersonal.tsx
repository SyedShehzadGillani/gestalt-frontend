import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  HelpCircle,
  X,
  Send,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "./status-personal.css";

// ─── Mock data (replace with Supabase: profiles, project_members, accountability_metrics, stalled_items) ───
const PERSON = {
  name: "Sarah Chen",
  role: "Marketing Manager",
  accountabilityScore: 87,
  responseRate: 92,
  followUpRate: 84,
  protocolAdherence: 91,
  avgResponseTime: "4.2 hrs",
};

interface Stalled { id: string; title: string; detail: string; project: string; daysSinceAction: number; seg: string; linkLabel: string; }
interface Deliverable { title: string; project: string; due: string; daysLeft: number; status: "ON TIME" | "AT RISK"; detail: string; seg: string; linkLabel: string; }
interface Campaign { name: string; role: string; progress: number; status: "ACTIVE" | "PLANNING"; tasks: string; seg: string; }
interface Completed { title: string; date: string; project: string; }

const STALLED: Stalled[] = [
  { id: "s1", title: "Website copy review — 3 days overdue", detail: "Jake R. submitted final copy May 10. You haven't reviewed. Team blocked on launch timeline.", project: "1IG WEBSITE", daysSinceAction: 3, seg: "projects", linkLabel: "REVIEW NOW" },
  { id: "s2", title: "Photography selects — no response to Priya", detail: "Priya P. asked for feedback on shoot selects May 11. No reply sent. Retouching team idle.", project: "PHOTOGRAPHY", daysSinceAction: 2, seg: "vault", linkLabel: "RESPOND NOW" },
];

const DELIVERABLES: Deliverable[] = [
  { title: "Brand guidelines document — final draft", project: "MARKETING", due: "May 16", daysLeft: 3, status: "ON TIME", detail: "V3 draft shared. Awaiting Jeff's sign-off before distribution.", seg: "projects", linkLabel: "VIEW DRAFT" },
  { title: "Q2 social media calendar", project: "DIGITAL ADS", due: "May 18", daysLeft: 5, status: "ON TIME", detail: "12 of 20 posts scheduled. 8 need creative assets from design team.", seg: "projects", linkLabel: "OPEN CALENDAR" },
  { title: "Competitive landscape research", project: "FORMULA", due: "May 28", daysLeft: 15, status: "ON TIME", detail: "Assigned to support leadership team for Step 01.10. Prep competitive data.", seg: "formula", linkLabel: "VIEW RESEARCH" },
  { title: "Employee onboarding materials update", project: "BROCHURE A", due: "May 14", daysLeft: 1, status: "AT RISK", detail: "Design complete. Copy needs final proofread. 1 day remaining.", seg: "projects", linkLabel: "OPEN DOCUMENT" },
];

const CAMPAIGNS: Campaign[] = [
  { name: "Q2 Brand Refresh", role: "Project Lead", progress: 45, status: "ACTIVE", tasks: "6 active / 4 complete / 2 blocked", seg: "projects" },
  { name: "Website Relaunch", role: "Content Reviewer", progress: 72, status: "ACTIVE", tasks: "2 active / 8 complete / 1 blocked", seg: "projects" },
  { name: "Trade Show Prep", role: "Contributor", progress: 20, status: "PLANNING", tasks: "1 active / 0 complete", seg: "projects" },
];

const COMPLETED: Completed[] = [
  { title: "Submitted FRAMEWORK assessment", date: "May 2", project: "FRAMEWORK" },
  { title: "Reviewed print collateral proofs", date: "May 5", project: "BROCHURE A" },
  { title: "Uploaded 12 brand photos to VAULT", date: "May 8", project: "PHOTOGRAPHY" },
  { title: "Completed H.I.V.E. PERSONAL quadrant", date: "May 9", project: "H.I.V.E." },
];

const BANNER_KEY = "gestalt-statuspersonal-banner-dismissed";

// metric color coding: ≥95 green, ≥85 gold, ≥70 orange, <70 red
function metricAcc(v: number) {
  if (v >= 95) return "spr-acc-green";
  if (v >= 85) return "spr-acc-gold";
  if (v >= 70) return "spr-acc-orange";
  return "spr-acc-red";
}
function barAcc(v: number) {
  if (v >= 70) return "spr-acc-green";
  if (v >= 40) return "spr-acc-gold";
  return "spr-acc-orange";
}

function MetricCard({ label, value, subtitle }: { label: string; value: number; subtitle: string }) {
  return (
    <div className="spr-metric">
      <div className="spr-metric-label">{label}</div>
      <div className={`spr-metric-val ${metricAcc(value)}`}>{value}%</div>
      <div className="spr-metric-sub">{subtitle}</div>
    </div>
  );
}

function StalledCard({ item, go, onHelp }: { item: Stalled; go: (s: string) => void; onHelp: () => void }) {
  return (
    <div className="spr-stalled">
      <div className="spr-stalled-top">
        <div className="spr-stalled-meta">
          <span className="spr-badge">STALLED</span>
          <span className="spr-stalled-project">PROJECT: {item.project}</span>
        </div>
        <div className="spr-stalled-days">
          <Clock size={12} />
          <span>{item.daysSinceAction}d without action</span>
        </div>
      </div>
      <div className="spr-stalled-title">{item.title}</div>
      <div className="spr-stalled-detail">{item.detail}</div>
      <div className="spr-actions">
        <button className="spr-btn is-red" onClick={() => go(item.seg)}>
          {item.linkLabel} <ArrowRight size={10} />
        </button>
        <button className="spr-help" onClick={onHelp} aria-label="Help"><HelpCircle size={13} /></button>
      </div>
    </div>
  );
}

function DeliverableRow({ item, go, onHelp }: { item: Deliverable; go: (s: string) => void; onHelp: () => void }) {
  const atRisk = item.status === "AT RISK";
  const statusAcc = atRisk ? "spr-acc-red" : "spr-acc-green";
  return (
    <div className="spr-row">
      <div className="spr-row-grid">
        <div className="spr-row-left">
          <div className="spr-row-project">{item.project}</div>
          <span className={`spr-status ${statusAcc}`}>{item.status}</span>
        </div>
        <div>
          <div className="spr-row-title">{item.title}</div>
          <div className="spr-row-detail">{item.detail}</div>
        </div>
        <div className="spr-row-right">
          <div className={`spr-row-due ${atRisk ? "is-risk" : ""}`}>{item.due}</div>
          <div className={`spr-row-days ${atRisk ? "is-risk" : ""}`}>{item.daysLeft}d left</div>
        </div>
      </div>
      <div className="spr-row-actions">
        <button className="spr-btn is-gold" onClick={() => go(item.seg)}>
          {item.linkLabel} <ArrowRight size={10} />
        </button>
        <button className="spr-help" onClick={onHelp} aria-label="Help"><HelpCircle size={13} /></button>
      </div>
    </div>
  );
}

function CampaignCard({ campaign, go }: { campaign: Campaign; go: (s: string) => void }) {
  const acc = barAcc(campaign.progress);
  const statusAcc = campaign.status === "ACTIVE" ? "spr-acc-green" : "spr-acc-gold";
  return (
    <div className="spr-campaign" onClick={() => go(campaign.seg)}>
      <div className="spr-campaign-top">
        <div>
          <span className="spr-campaign-name">{campaign.name}</span>
          <span className="spr-campaign-role">{campaign.role.toUpperCase()}</span>
        </div>
        <span className={`spr-campaign-status ${statusAcc}`}>{campaign.status}</span>
      </div>
      <div className="spr-bar-track">
        <div className={`spr-bar-fill ${acc}`} style={{ width: `${campaign.progress}%`, background: "currentColor" }} />
      </div>
      <div className="spr-campaign-foot">
        <span>{campaign.tasks}</span>
        <span className={`spr-campaign-pct ${acc}`}>{campaign.progress}%</span>
      </div>
    </div>
  );
}

function GIPanel({ onClose }: { onClose: () => void }) {
  const first = PERSON.name.split(" ")[0];
  return (
    <aside className="spr-gi">
      <div className="spr-gi-head">
        <div className="spr-gi-title">GESTALT INTELLIGENCE</div>
        <button className="spr-gi-x" onClick={onClose} aria-label="Close"><X size={12} /></button>
      </div>
      <div className="spr-gi-card">
        <div className="spr-gi-line">{first}, you have <strong>{STALLED.length} stalled items</strong> blocking teammates. Your follow-up rate dropped to {PERSON.followUpRate}%.</div>
        <div className="spr-gi-line is-muted">Resolving the website copy review takes ~10 minutes and unblocks 3 people.</div>
        <div className="spr-gi-conf">CONFIDENCE: 96% · PROJECT DATA · H.I.V.E. IMPACT: -4.2 POINTS</div>
      </div>
      <form className="spr-gi-form" onSubmit={(e) => e.preventDefault()}>
        <input className="spr-gi-input" placeholder="Ask about my performance..." />
        <button className="spr-gi-send" type="submit" aria-label="Send"><Send size={10} /></button>
      </form>
    </aside>
  );
}

export default function StatusPersonal() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [bannerOpen, setBannerOpen] = useState(() => localStorage.getItem(BANNER_KEY) !== "1");
  const [showCompleted, setShowCompleted] = useState(false);
  const [giOpen, setGiOpen] = useState(false);

  const base = pathname.replace(/\/status-personal$/, "");
  const go = (seg: string) => navigate(`${base}/${seg}`);
  const onHelp = () => setGiOpen(true);

  const dismissBanner = () => {
    setBannerOpen(false);
    localStorage.setItem(BANNER_KEY, "1");
  };

  const p = PERSON;
  const below100 = p.accountabilityScore < 100;

  return (
    <div className="statuspersonal-scope">
      <div className="spr-main">
        {/* Header */}
        <div className="spr-head">
          <div>
            <div className="spr-title">STATUS <span className="spr-title-sub">- PERSONAL</span></div>
            <div className="spr-subtitle">PERSONAL ACCOUNTABILITY · {p.name.toUpperCase()} · {p.role.toUpperCase()}</div>
          </div>
          <div className="spr-head-right">
            <div className="spr-acc-label">ACCOUNTABILITY</div>
            <div className={`spr-acc-score ${metricAcc(p.accountabilityScore)}`}>{p.accountabilityScore}%</div>
            <div className={`spr-acc-note ${below100 ? "" : "is-good"}`}>
              {below100 ? "BELOW 100% — IMPROVEMENT NEEDED" : "PERFECT STANDING"}
            </div>
          </div>
        </div>

        {/* Welcome banner */}
        {bannerOpen && (
          <div className="spr-banner">
            <button className="spr-banner-x" onClick={dismissBanner} aria-label="Dismiss"><X size={12} /></button>
            <div className="spr-banner-label">YOUR PERSONAL STATUS</div>
            <div className="spr-banner-line"><strong>WHAT:</strong> Your personal accountability dashboard. Every deliverable, follow-up, and response is tracked here.</div>
            <div className="spr-banner-line"><strong>WHY:</strong> One missed response can snowball into a missed opportunity for you and the entire business. There is no excuse for a lack of communication.</div>
            <div className="spr-banner-line"><strong>HOW:</strong> Stalled items appear at the top — fix those first. Your accountability score reflects reliability, responsiveness, and initiative.</div>
          </div>
        )}

        {/* Metrics bar */}
        <div className="spr-metrics">
          <MetricCard label="RESPONSE RATE" value={p.responseRate} subtitle={`AVG: ${p.avgResponseTime}`} />
          <MetricCard label="FOLLOW-UP RATE" value={p.followUpRate} subtitle={`${100 - p.followUpRate}% missed`} />
          <MetricCard label="PROTOCOL ADHERENCE" value={p.protocolAdherence} subtitle="Following defined processes" />
          <MetricCard label="ACCOUNTABILITY SCORE" value={p.accountabilityScore} subtitle={below100 ? "Below 100% — action required" : "Perfect standing"} />
        </div>

        {/* Stalled */}
        {STALLED.length > 0 && (
          <div className="spr-section">
            <div className="spr-section-head is-red">
              <AlertTriangle size={14} /> STALLED · YOU ARE BLOCKING PROGRESS
            </div>
            {STALLED.map((s) => <StalledCard key={s.id} item={s} go={go} onHelp={onHelp} />)}
          </div>
        )}

        {/* Deliverables */}
        <div className="spr-section">
          <div className="spr-section-head is-orange">MY DELIVERABLES · {DELIVERABLES.length} ACTIVE</div>
          <div className="spr-list">
            {DELIVERABLES.map((d, i) => <DeliverableRow key={i} item={d} go={go} onHelp={onHelp} />)}
          </div>
        </div>

        {/* Campaigns */}
        <div className="spr-section">
          <div className="spr-section-head is-gold">CAMPAIGN INVOLVEMENT · {CAMPAIGNS.length} ACTIVE</div>
          {CAMPAIGNS.map((c, i) => <CampaignCard key={i} campaign={c} go={go} />)}
        </div>

        {/* Completed (collapsible) */}
        <div className="spr-section">
          <div className="spr-section-head is-gray" onClick={() => setShowCompleted(!showCompleted)}>
            <span>COMPLETED THIS MONTH · {COMPLETED.length} ITEMS</span>
            {showCompleted ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
          {showCompleted && COMPLETED.map((c, i) => (
            <div key={i} className="spr-completed-row">
              <div className="spr-completed-check"><Check size={11} strokeWidth={3} /></div>
              <span className="spr-completed-title">{c.title}</span>
              <span className="spr-completed-date">{c.date}</span>
              <span className="spr-completed-project">{c.project}</span>
            </div>
          ))}
        </div>
      </div>

      {giOpen && <GIPanel onClose={() => setGiOpen(false)} />}
    </div>
  );
}
