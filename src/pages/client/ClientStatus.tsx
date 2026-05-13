import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════
// STATUS — B.A.S.E. Daily Brief
// Route: /client/:id/status (first page after login)
// Frontend only — mock data; Supabase wiring later.
// Font: Gotham (loaded globally via src/index.css @font-face).
// ═══════════════════════════════════════════════════════════════


// ─── DESIGN TOKENS (status-scope only — does not touch global theme) ───
const Au = "#e2b53f";
const Ad = "#c18d30";
const Gn = "#5fcc00";
const Rd = "#ef4444";
const Bl = "#4882ff";
const Or = "#c45c00";

type ThemeId = "dark" | "light";
const THEMES: Record<ThemeId, Record<string, string>> = {
  dark: {
    bg: "#0a0a0a", bg2: "#0e0e0e", bg3: "#111", bdr: "#1c1c1c", bdr2: "#2a2a2a",
    tx: "#ffffff", tx2: "#cccccc", tx3: "#777777", tx4: "#555555", tx5: "#333333",
    side: "#0a0a0a", hover: "#141414", card: "#0c0c0c", intro: "#100e06",
  },
  light: {
    bg: "#f0efea", bg2: "#ffffff", bg3: "#fafaf8", bdr: "#ddd8d0", bdr2: "#ccc8c0",
    tx: "#1a1a1a", tx2: "#444444", tx3: "#777777", tx4: "#aaaaaa", tx5: "#dddddd",
    side: "#f8f7f2", hover: "#eeede8", card: "#ffffff", intro: "#fdf9ef",
  },
};

// ─── MOCK DATA ───
const MOCK_SPECIAL_PROJECTS = [
  {
    id: "sp1", from: "JEFFERY P. ESS", priority: "URGENT" as const,
    title: "Complete Q2 Financial Review",
    headline: "Upload Q2 revenue, expenses, and margin data before board meeting.",
    detail: "4 fields remaining in FINANCIALS → CUSTOMERS + TEAM.",
    due: "May 16, 2026", daysLeft: 3,
    link: "financials", linkLabel: "OPEN FINANCIALS",
  },
  {
    id: "sp2", from: "MARKETING TEAM", priority: "HIGH" as const,
    title: "Brand Photography — Final Selects",
    headline: "Review 48 photos from shoot. Select 12 finals for website refresh.",
    detail: "Photography team waiting on approval to begin retouching.",
    due: "May 20, 2026", daysLeft: 7,
    link: "projects/photography", linkLabel: "OPEN PROJECT",
  },
];

type ModuleStatus = "IN PROGRESS" | "COMPLETE" | "ON TRACK";
const MOCK_MODULES: Array<{
  module: string; color: string; scoreNum: string; scoreTotal: string;
  status: ModuleStatus; statusColor: string; headline: string; detail: string;
  link: string; linkLabel: string; due: string | null;
}> = [
  { module: "FINANCIALS", color: Au, scoreNum: "9", scoreTotal: "13",
    status: "IN PROGRESS", statusColor: Au,
    headline: "Complete 4 remaining fields — takes 8 minutes.",
    detail: "Missing: Customer Concentration, Employee Count, Turnover Rate, Amortization.",
    link: "financials", linkLabel: "COMPLETE 4 FIELDS", due: "May 14" },
  { module: "FOCUS", color: Au, scoreNum: "63", scoreTotal: "100",
    status: "IN PROGRESS", statusColor: Au,
    headline: "Resume IDENTITY pillar — 18 questions remaining.",
    detail: "PERCEPTION and CLARITY complete. Start with Q47 — highest B.A.S.E. impact.",
    link: "focus", linkLabel: "RESUME IDENTITY Q47", due: "May 21" },
  { module: "FORMULA", color: Or, scoreNum: "4", scoreTotal: "23",
    status: "IN PROGRESS", statusColor: Or,
    headline: "Block 45 minutes with leadership for Competitive Landscape.",
    detail: "Next: Step 01.10. Best with 2-3 leadership team members present.",
    link: "formula", linkLabel: "RESUME STEP 01.10", due: "May 28" },
  { module: "FRAMEWORK", color: Gn, scoreNum: "15", scoreTotal: "21",
    status: "COMPLETE", statusColor: Gn,
    headline: "All 21 questions answered. 6 blindspots identified.",
    detail: "EXIT POSSIBLE range. Combined blindspot impact: $847K/yr.",
    link: "framework", linkLabel: "VIEW RESULTS", due: null },
  { module: "ONBOARDING", color: Ad, scoreNum: "12", scoreTotal: "42",
    status: "ON TRACK", statusColor: Ad,
    headline: "You're ahead of schedule — top 32% pace at Day 12.",
    detail: "Next milestone: complete FOCUS by Day 21. CERTIFIED eligibility Day 38.",
    link: "onboarding", linkLabel: "VIEW JOURNEY", due: "Jun 14" },
];

// ─── ICON HELPER ───
const Ic = ({ name, size = 14, color = "#888" }: { name: string; size?: number; color?: string }) => {
  const s = { stroke: color, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const icons: Record<string, JSX.Element> = {
    clock: <><circle cx="12" cy="12" r="10" {...s} /><path d="M12 6v6l4 2" {...s} /></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" {...s} /><line x1="12" y1="9" x2="12" y2="13" {...s} /><line x1="12" y1="17" x2="12.01" y2="17" {...s} /></>,
    arrow: <path d="M5 12h14m-7-7l7 7-7 7" {...s} />,
    help: <><circle cx="12" cy="12" r="10" {...s} /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" {...s} /><line x1="12" y1="17" x2="12.01" y2="17" {...s} /></>,
    x: <path d="M18 6L6 18M6 6l12 12" {...s} />,
    send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" {...s} />,
    sun: <><circle cx="12" cy="12" r="5" {...s} /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" {...s} /></>,
    moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" {...s} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
};

// ─── SPECIAL PROJECT CARD ───
const SpecialProjectCard = ({ project, theme, go }: { project: typeof MOCK_SPECIAL_PROJECTS[number]; theme: ThemeId; go: (p: string) => void }) => {
  const t = THEMES[theme];
  const urgent = project.priority === "URGENT";
  const pc = urgent ? Rd : Au;
  const bgAlpha = urgent ? "rgba(239,68,68,0.10)" : "rgba(226,181,63,0.10)";
  const bdrAlpha = urgent ? "rgba(239,68,68,0.50)" : "rgba(226,181,63,0.50)";
  return (
    <div
      style={{ border: `1px solid ${bdrAlpha}`, background: bgAlpha, padding: "18px 22px", marginBottom: 10, cursor: "pointer", borderRadius: 0 }}
      onClick={() => go(project.link)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: 1.5, padding: "3px 8px", background: pc, color: urgent ? "#fff" : "#000" }}>{project.priority}</span>
          <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: 1, color: t.tx4 }}>ASSIGNED BY {project.from}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Ic name="clock" size={12} color={project.daysLeft <= 3 ? Rd : t.tx4} />
          <span style={{ fontSize: 9, fontWeight: 600, color: project.daysLeft <= 3 ? Rd : t.tx3 }}>{project.daysLeft}d left · {project.due}</span>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: t.tx, marginBottom: 3 }}>{project.title}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: t.tx2, lineHeight: 1.5, marginBottom: 4 }}>{project.headline}</div>
      <div style={{ fontSize: 9, color: t.tx3, lineHeight: 1.5, marginBottom: 12 }}>{project.detail}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
        <button
          onClick={(e) => { e.stopPropagation(); go(project.link); }}
          style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1.5, color: urgent ? "#fff" : "#000", background: pc, padding: "7px 18px", minWidth: 180, textAlign: "center", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, border: "none", borderRadius: 0 }}
        >
          {project.linkLabel} <Ic name="arrow" size={10} color={urgent ? "#fff" : "#000"} />
        </button>
        <button style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: `1px solid ${t.bdr2}`, padding: 0, borderRadius: 0 }}>
          <Ic name="help" size={13} color={Ad} />
        </button>
      </div>
    </div>
  );
};

// ─── CHECKBOX ───
const CheckBox = ({ checked, color = "#e2b53f", size = 18 }: { checked: boolean; color?: string; size?: number }) => (
  <div style={{
    width: size, height: size, border: `1.5px solid ${checked ? Gn : color}40`,
    background: checked ? `${Gn}15` : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: 0,
  }}>
    {checked && (
      <svg width={size - 6} height={size - 6} viewBox="0 0 24 24" style={{ display: "block" }}>
        <polyline points="20 6 9 17 4 12" stroke={Gn} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )}
  </div>
);

// ─── MODULE ROW ───
const ModuleRow = ({ mod, theme, go, onAskGI }: { mod: typeof MOCK_MODULES[number]; theme: ThemeId; go: (p: string) => void; onAskGI: (m: string) => void }) => {
  const t = THEMES[theme];
  const done = mod.status === "COMPLETE";
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ borderBottom: `1px solid ${t.bdr}`, padding: "14px 0", cursor: "pointer", background: hovered ? t.hover : "transparent", transition: "background .1s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr auto", gap: 12, alignItems: "start" }}>
        <div style={{ paddingLeft: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <CheckBox checked={done} color={mod.color} />
            <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: 2, color: done ? t.tx3 : t.tx }}>{mod.module}</span>
          </div>
          <span style={{
            fontSize: 7, fontWeight: 700, letterSpacing: 1, color: mod.statusColor,
            padding: "2px 7px", border: `1px solid ${mod.statusColor}30`, background: `${mod.statusColor}10`,
            display: "inline-block", marginLeft: 26,
          }}>
            {mod.status}
          </span>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.tx, lineHeight: 1.4, marginBottom: 4 }}>{mod.headline}</div>
          <div style={{ fontSize: 9, color: t.tx3, lineHeight: 1.6 }}>{mod.detail}</div>
        </div>
        <div style={{ textAlign: "right", whiteSpace: "nowrap", paddingRight: 22 }}>
          {mod.due && <div style={{ fontSize: 8, fontWeight: 500, color: t.tx4, marginBottom: 3 }}>{mod.due}</div>}
          <div>
            <span style={{ fontSize: 13, fontWeight: 900, color: Au }}>{mod.scoreNum}</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: t.tx4 }}>/{mod.scoreTotal}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginTop: 10, paddingRight: 22 }}>
        <button
          onClick={(e) => { e.stopPropagation(); go(mod.link); }}
          style={{
            fontSize: 8, fontWeight: 800, letterSpacing: 1.5,
            color: done ? t.tx3 : "#000", background: done ? t.bdr2 : Au,
            padding: "7px 18px", minWidth: 180, textAlign: "center",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, border: "none", borderRadius: 0,
          }}
        >
          {mod.linkLabel} <Ic name="arrow" size={10} color={done ? t.tx3 : "#000"} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onAskGI(mod.module); }}
          style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: `1px solid ${t.bdr2}`, padding: 0, borderRadius: 0 }}
        >
          <Ic name="help" size={13} color={Ad} />
        </button>
      </div>
    </div>
  );
};

// ─── SCORE ───
const fx = (n: number) => n.toFixed(1);

export default function ClientStatus() {
  useMontserrat();
  const navigate = useNavigate();
  const { id = "1" } = useParams<{ id: string }>();
  const [theme, setTheme] = useState<ThemeId>("dark");
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("status:welcome:dismissed") !== "1";
  });
  const [helpOpen, setHelpOpen] = useState(false);

  const dismissIntro = () => {
    setShowIntro(false);
    try { localStorage.setItem("status:welcome:dismissed", "1"); } catch {}
  };

  const go = (rel: string) => navigate(`/client/${id}/${rel}`);

  const t = THEMES[theme];
  const ff = "'Montserrat', sans-serif";
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase();

  return (
    <div className="status-scope" style={{ fontFamily: ff, background: t.bg, color: t.tx, minHeight: "100%", display: "flex", overflow: "hidden" }}>
      <style>{`.status-scope, .status-scope * { box-sizing: border-box; border-radius: 0 !important; } .status-scope button, .status-scope input { font-family: ${ff}; } .status-scope button { cursor: pointer; } .status-scope .avatar-circle { border-radius: 50% !important; }`}</style>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>

        {/* Top bar (theme + GI toggle) — kept minimal since shell provides chrome */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: "none", border: `1px solid ${t.bdr2}`, padding: 6, display: "flex" }}>
            <Ic name={theme === "dark" ? "sun" : "moon"} size={14} color={t.tx3} />
          </button>
          <button onClick={() => setHelpOpen(!helpOpen)} style={{ background: helpOpen ? `${Au}15` : "none", border: `1px solid ${helpOpen ? `${Au}30` : t.bdr2}`, padding: 6, display: "flex" }}>
            <Ic name="help" size={14} color={helpOpen ? Au : t.tx3} />
          </button>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 1, color: t.tx }}>STATUS</div>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: 1, color: t.tx4, marginTop: 2 }}>
            B.A.S.E. DAILY BRIEF · {dateStr} · UPDATED BY GESTALT INTELLIGENCE
          </div>
        </div>

        {/* Welcome banner */}
        {showIntro && (
          <div style={{ background: t.intro, border: `1px solid rgba(226,181,63,0.15)`, padding: "16px 20px", marginBottom: 24, position: "relative" }}>
            <button onClick={dismissIntro} style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", padding: 4, opacity: 0.5 }}>
              <Ic name="x" size={12} color={t.tx3} />
            </button>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 2.5, color: Au, marginBottom: 10 }}>WELCOME TO STATUS</div>
            <div style={{ fontSize: 10, color: t.tx2, lineHeight: 1.8, marginBottom: 3 }}><strong style={{ color: t.tx }}>WHAT:</strong> Your daily command center. GESTALT INTELLIGENCE analyzes your company every morning and prioritizes what matters.</div>
            <div style={{ fontSize: 10, color: t.tx2, lineHeight: 1.8, marginBottom: 3 }}><strong style={{ color: t.tx }}>WHY:</strong> Every day of inaction costs you $2,847 in exit value. STATUS eliminates guesswork.</div>
            <div style={{ fontSize: 10, color: t.tx2, lineHeight: 1.8 }}><strong style={{ color: t.tx }}>HOW:</strong> Click any item to go directly to the work. Your personal tasks live in S.U.M. → TASKS.</div>
          </div>
        )}

        {/* Special Projects */}
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2.5, color: Rd, marginBottom: 10, display: "flex", alignItems: "center", gap: 6, paddingBottom: 8, borderBottom: `1px solid rgba(239,68,68,0.15)` }}>
          <Ic name="alert" size={14} color={Rd} />
          SPECIAL PROJECTS · REQUIRES YOUR ATTENTION
        </div>
        {MOCK_SPECIAL_PROJECTS.map((sp) => (
          <SpecialProjectCard key={sp.id} project={sp} theme={theme} go={go} />
        ))}

        {/* B.A.S.E. AI Priorities */}
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2.5, color: Au, marginTop: 28, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid rgba(226,181,63,0.15)` }}>
          B.A.S.E. — AI PRIORITIES · UPDATED DAILY AT 7:00 AM
        </div>
        <div style={{ borderTop: `1px solid ${t.bdr}` }}>
          {MOCK_MODULES.map((mod) => (
            <ModuleRow key={mod.module} mod={mod} theme={theme} go={go} onAskGI={() => setHelpOpen(true)} />
          ))}
        </div>

        {/* Scores Bar */}
        <div style={{ padding: "16px 20px", border: `1px solid ${t.bdr}`, background: t.bg3, marginTop: 4 }}>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: t.tx4 }}>GESTALT SCORE</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: Au }}>{fx(64)}</div>
            </div>
            <div style={{ height: 34, width: 1, background: t.bdr2 }} />
            <div><div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: Au }}>B.A.S.E.</div><div style={{ fontSize: 17, fontWeight: 800, color: Au }}>{fx(71)}</div></div>
            <div><div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: Bl }}>H.I.V.E.</div><div style={{ fontSize: 17, fontWeight: 800, color: Bl }}>{fx(63)}</div></div>
            <div><div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: Or }}>S.U.M.</div><div style={{ fontSize: 17, fontWeight: 800, color: Or }}>{fx(58)}</div></div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, color: Rd }}>DAILY VALUATION DRAIN™</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: Rd }}>$2,847<span style={{ fontSize: 11, fontWeight: 600 }}>/day</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* GI Panel */}
      {helpOpen && (
        <div style={{ width: 260, borderLeft: `1px solid ${t.bdr}`, overflow: "auto", flexShrink: 0, background: t.side, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: Au }}>GESTALT INTELLIGENCE</div>
            <button onClick={() => setHelpOpen(false)} style={{ background: "none", border: "none", padding: 2 }}>
              <Ic name="x" size={12} color={t.tx4} />
            </button>
          </div>
          <div style={{ padding: 12, background: t.bg2, border: `1px solid ${t.bdr}`, marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: t.tx2, lineHeight: 1.7 }}>Good morning, Alex. Your VALUATION DRAIN™ is <strong style={{ color: Rd, fontWeight: 800 }}>$2,847/day</strong>.</div>
            <div style={{ fontSize: 10, color: t.tx3, lineHeight: 1.7, marginTop: 6 }}>Completing the 4 missing FINANCIALS fields reduces that by ~$340/day — 12% improvement from 8 minutes of work.</div>
            <div style={{ fontSize: 7, color: Au, marginTop: 8, fontWeight: 600 }}>CONFIDENCE: 94% · 3 CITATIONS · ROI: $124K/YR</div>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 4 }}>
            <input placeholder="Ask about STATUS..." style={{ flex: 1, padding: 8, background: t.bg2, border: `1px solid ${t.bdr}`, color: t.tx, fontSize: 8, outline: "none", fontFamily: ff }} />
            <button style={{ padding: 8, background: Au, border: "none" }}><Ic name="send" size={10} color="#000" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
