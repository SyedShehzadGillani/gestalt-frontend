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
} from "lucide-react";
import "./status-business.css";

// ─── Mock data (replace with Supabase: special_projects, module_progress, daily_routine) ───
interface SpecialProject {
  id: string;
  from: string;
  priority: "URGENT" | "HIGH";
  title: string;
  headline: string;
  detail: string;
  due: string;
  daysLeft: number;
  seg: string;
  linkLabel: string;
}

interface ModuleItem {
  module: string;
  acc: string; // accent class
  scoreNum: string;
  scoreTotal: string;
  status: string;
  headline: string;
  detail: string;
  seg: string;
  linkLabel: string;
  due: string | null;
  done?: boolean;
}

const SPECIAL_PROJECTS: SpecialProject[] = [
  {
    id: "sp1",
    from: "JEFFERY P. ESS",
    priority: "URGENT",
    title: "Complete Q2 Financial Review",
    headline: "Upload Q2 revenue, expenses, and margin data before board meeting.",
    detail: "4 fields remaining in FINANCIALS → CUSTOMERS + TEAM.",
    due: "May 16, 2026",
    daysLeft: 3,
    seg: "financials",
    linkLabel: "OPEN FINANCIALS",
  },
  {
    id: "sp2",
    from: "MARKETING TEAM",
    priority: "HIGH",
    title: "Brand Photography — Final Selects",
    headline: "Review 48 photos from shoot. Select 12 finals for website refresh.",
    detail: "Photography team waiting on approval to begin retouching.",
    due: "May 20, 2026",
    daysLeft: 7,
    seg: "projects",
    linkLabel: "OPEN PROJECT",
  },
];

const MODULES: ModuleItem[] = [
  {
    module: "FRAMEWORK", acc: "sb-acc-green", scoreNum: "15", scoreTotal: "21",
    status: "COMPLETE", done: true,
    headline: "All 21 questions answered. 6 blindspots identified.",
    detail: "EXIT POSSIBLE range. Combined blindspot impact: $847K/yr.",
    seg: "framework", linkLabel: "VIEW RESULTS", due: null,
  },
  {
    module: "FOCUS", acc: "sb-acc-gold", scoreNum: "63", scoreTotal: "100",
    status: "IN PROGRESS",
    headline: "Resume IDENTITY pillar — 18 questions remaining.",
    detail: "PERCEPTION and CLARITY complete. Start with Q47 — highest B.A.S.E. impact.",
    seg: "focus", linkLabel: "RESUME IDENTITY Q47", due: "May 21",
  },
  {
    module: "FINANCIALS", acc: "sb-acc-gold", scoreNum: "9", scoreTotal: "13",
    status: "IN PROGRESS",
    headline: "Complete 4 remaining fields — takes 8 minutes.",
    detail: "Missing: Customer Concentration, Employee Count, Turnover Rate, Amortization.",
    seg: "financials", linkLabel: "COMPLETE 4 FIELDS", due: "May 14",
  },
  {
    module: "FORMULA", acc: "sb-acc-orange", scoreNum: "4", scoreTotal: "23",
    status: "IN PROGRESS",
    headline: "Block 45 minutes with leadership for Competitive Landscape.",
    detail: "Next: Step 01.10. Best with 2-3 leadership team members present.",
    seg: "formula", linkLabel: "RESUME STEP 01.10", due: "May 28",
  },
  {
    module: "ONBOARDING", acc: "sb-acc-golddk", scoreNum: "12", scoreTotal: "42",
    status: "ON TRACK",
    headline: "You're ahead of schedule — top 32% pace at Day 12.",
    detail: "Next milestone: complete FOCUS by Day 21. CERTIFIED eligibility Day 38.",
    seg: "onboarding", linkLabel: "VIEW JOURNEY", due: "Jun 14",
  },
  {
    module: "S.U.M.", acc: "sb-acc-orange", scoreNum: "58", scoreTotal: "100",
    status: "IN PROGRESS",
    headline: "3 pending tasks in TASKS tab. Team engagement up 12% this week.",
    detail: "2 open polls need votes. Story Engine has 4 unread submissions.",
    seg: "messaging", linkLabel: "OPEN TASKS", due: null,
  },
  {
    module: "H.I.V.E.", acc: "sb-acc-blue", scoreNum: "63", scoreTotal: "100",
    status: "IN PROGRESS",
    headline: "Complete self-assessment — 4 quadrants, 15 minutes.",
    detail: "PERSONAL and CUSTOMER quadrants done. STAFF and KNOWLEDGE remaining.",
    seg: "hive", linkLabel: "CONTINUE ASSESSMENT", due: "May 25",
  },
];

const BANNER_KEY = "gestalt-statusbiz-banner-dismissed";

function SpecialProjectCard({
  project,
  go,
  onHelp,
}: {
  project: SpecialProject;
  go: (seg: string) => void;
  onHelp: () => void;
}) {
  const urgent = project.priority === "URGENT";
  return (
    <div className={`sb-sp ${urgent ? "is-urgent" : "is-high"}`} onClick={() => go(project.seg)}>
      <div className="sb-sp-top">
        <div className="sb-sp-meta">
          <span className={`sb-badge ${urgent ? "is-urgent" : "is-high"}`}>{project.priority}</span>
          <span className="sb-sp-from">ASSIGNED BY {project.from}</span>
        </div>
        <div className={`sb-sp-due ${project.daysLeft <= 3 ? "is-soon" : ""}`}>
          <Clock size={12} />
          <span>{project.daysLeft}d left · {project.due}</span>
        </div>
      </div>
      <div className="sb-sp-title">{project.title}</div>
      <div className="sb-sp-headline">{project.headline}</div>
      <div className="sb-sp-detail">{project.detail}</div>
      <div className="sb-actions">
        <button
          className={`sb-btn ${urgent ? "is-red" : "is-gold"}`}
          onClick={(e) => { e.stopPropagation(); go(project.seg); }}
        >
          {project.linkLabel} <ArrowRight size={10} />
        </button>
        <button className="sb-help" onClick={(e) => { e.stopPropagation(); onHelp(); }} aria-label="Help">
          <HelpCircle size={13} />
        </button>
      </div>
    </div>
  );
}

function ModuleRow({
  mod,
  go,
  onHelp,
}: {
  mod: ModuleItem;
  go: (seg: string) => void;
  onHelp: () => void;
}) {
  const done = !!mod.done;
  return (
    <div className="sb-row" onClick={() => go(mod.seg)}>
      <div className="sb-row-grid">
        <div className="sb-row-left">
          <div className="sb-check-wrap">
            <div className={`sb-check ${mod.acc} ${done ? "is-done" : ""}`}>
              {done && <Check size={12} strokeWidth={3} />}
            </div>
            <span className={`sb-mod-name ${done ? "is-done" : ""}`}>{mod.module}</span>
          </div>
          <span className={`sb-status ${mod.acc}`}>{mod.status}</span>
        </div>
        <div>
          <div className="sb-headline">{mod.headline}</div>
          <div className="sb-detail">{mod.detail}</div>
        </div>
        <div className="sb-row-right">
          {mod.due && <div className="sb-due">{mod.due}</div>}
          <div>
            <span className="sb-score">{mod.scoreNum}</span>
            <span className="sb-score-total">/{mod.scoreTotal}</span>
          </div>
        </div>
      </div>
      <div className="sb-row-actions">
        <button
          className={`sb-btn ${done ? "is-gray" : "is-gold"}`}
          onClick={(e) => { e.stopPropagation(); go(mod.seg); }}
        >
          {mod.linkLabel} <ArrowRight size={10} />
        </button>
        <button className="sb-help" onClick={(e) => { e.stopPropagation(); onHelp(); }} aria-label="Help">
          <HelpCircle size={13} />
        </button>
      </div>
    </div>
  );
}

function GIPanel({ onClose }: { onClose: () => void }) {
  return (
    <aside className="sb-gi">
      <div className="sb-gi-head">
        <div className="sb-gi-title">GESTALT INTELLIGENCE</div>
        <button className="sb-gi-x" onClick={onClose} aria-label="Close"><X size={12} /></button>
      </div>
      <div className="sb-gi-card">
        <div className="sb-gi-line">Good morning, Alex. Your VALUATION DRAIN™ is <strong>$2,847/day</strong>.</div>
        <div className="sb-gi-line is-muted">Completing the 4 missing FINANCIALS fields reduces that by ~$340/day — 12% improvement from 8 minutes of work.</div>
        <div className="sb-gi-conf">CONFIDENCE: 94% · 3 CITATIONS · ROI: $124K/YR</div>
      </div>
      <form className="sb-gi-form" onSubmit={(e) => e.preventDefault()}>
        <input className="sb-gi-input" placeholder="Ask about STATUS..." />
        <button className="sb-gi-send" type="submit" aria-label="Send"><Send size={10} /></button>
      </form>
    </aside>
  );
}

export default function StatusBusiness() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [bannerOpen, setBannerOpen] = useState(() => localStorage.getItem(BANNER_KEY) !== "1");
  const [giOpen, setGiOpen] = useState(false);

  const base = pathname.replace(/\/status-business$/, "");
  const go = (seg: string) => navigate(`${base}/${seg}`);

  const dismissBanner = () => {
    setBannerOpen(false);
    localStorage.setItem(BANNER_KEY, "1");
  };

  const dateStr = new Date()
    .toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();

  return (
    <div className="statusbiz-scope">
      <div className="sb-main">
        {/* Title */}
        <div className="sb-title">STATUS <span className="sb-title-sub">- BUSINESS</span></div>
        <div className="sb-subtitle">B.A.S.E. DAILY BRIEF · {dateStr} · UPDATED BY GESTALT INTELLIGENCE</div>

        {/* Metrics bar */}
        <div className="sb-metrics">
          <div className="sb-metric">
            <div className="sb-metric-label">GESTALT SCORE</div>
            <div className="sb-metric-val">64.0</div>
            <div className="sb-metric-sub">Composite of all systems</div>
          </div>
          <div className="sb-metric">
            <div className="sb-metric-label">MODULE COMPLETION</div>
            <div className="sb-metric-val">1<span className="sb-metric-frac">/7</span></div>
            <div className="sb-metric-sub">FRAMEWORK complete</div>
          </div>
          <div className="sb-metric">
            <div className="sb-metric-label">DATA POINTS ACTIVE</div>
            <div className="sb-metric-val">224</div>
            <div className="sb-metric-sub">12 subsystems feeding</div>
          </div>
          <div className="sb-metric">
            <div className="sb-metric-label is-red">DAILY VALUATION DRAIN™</div>
            <div className="sb-metric-val is-red">$2,847</div>
            <div className="sb-metric-sub is-red">$1,039,155/yr lost</div>
          </div>
        </div>

        {/* Welcome banner */}
        {bannerOpen && (
          <div className="sb-banner">
            <button className="sb-banner-x" onClick={dismissBanner} aria-label="Dismiss"><X size={12} /></button>
            <div className="sb-banner-label">WELCOME TO STATUS</div>
            <div className="sb-banner-line"><strong>WHAT:</strong> Your daily command center. GESTALT INTELLIGENCE analyzes your company every morning and prioritizes what matters.</div>
            <div className="sb-banner-line"><strong>WHY:</strong> Every day of inaction costs you $2,847 in exit value. STATUS eliminates guesswork.</div>
            <div className="sb-banner-line"><strong>HOW:</strong> Click any item to go directly to the work. Your personal tasks live in S.U.M. → TASKS.</div>
          </div>
        )}

        {/* Special projects */}
        <div className="sb-section-head is-red">
          <AlertTriangle size={14} />
          SPECIAL PROJECTS · REQUIRES YOUR ATTENTION
        </div>
        {SPECIAL_PROJECTS.map((sp) => (
          <SpecialProjectCard key={sp.id} project={sp} go={go} onHelp={() => setGiOpen(true)} />
        ))}

        {/* AI priorities */}
        <div className="sb-section-head is-gold">
          B.A.S.E. + S.U.M. + H.I.V.E. — AI PRIORITIES · UPDATED DAILY AT 7:00 AM
        </div>
        <div className="sb-modlist">
          {MODULES.map((mod) => (
            <ModuleRow key={mod.module} mod={mod} go={go} onHelp={() => setGiOpen(true)} />
          ))}
        </div>

        {/* Scores bar */}
        <div className="sb-scores">
          <div className="sb-scores-row">
            <div>
              <div className="sb-sc-label sb-acc-dim">GESTALT SCORE</div>
              <div className="sb-sc-big">64.0</div>
            </div>
            <div className="sb-sc-divider" />
            <div>
              <div className="sb-sc-label sb-acc-gold">B.A.S.E.</div>
              <div className="sb-sc-val sb-acc-gold">71.0</div>
            </div>
            <div>
              <div className="sb-sc-label sb-acc-blue">H.I.V.E.</div>
              <div className="sb-sc-val sb-acc-blue">63.0</div>
            </div>
            <div>
              <div className="sb-sc-label sb-acc-orange">S.U.M.</div>
              <div className="sb-sc-val sb-acc-orange">58.0</div>
            </div>
            <div className="sb-drain">
              <div className="sb-drain-label">DAILY VALUATION DRAIN™</div>
              <div className="sb-drain-val">$2,847<span>/day</span></div>
            </div>
          </div>
        </div>
      </div>

      {giOpen && <GIPanel onClose={() => setGiOpen(false)} />}
    </div>
  );
}
