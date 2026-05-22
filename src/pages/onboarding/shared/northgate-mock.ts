// Canonical Northgate Solutions mock — frozen values used across all 3 onboarding demos.
// Mirrors vault/PROJECT-GLOSSARY.md canonical client.

export const NORTHGATE = {
  company: "Northgate Solutions",
  owner: "J. Marsh",
  industry: "Industrial services",
  employees: 47,
  arr: 8_400_000,
};

export const FRAMEWORK_Q = [
  "Does your company have a documented brand strategy?",
  "Can every employee articulate your competitive advantage in one sentence?",
  "Do you formally measure customer loyalty?",
  "Is pricing based on value created, not competitors?",
  "Does leadership review brand metrics quarterly?",
  "Do you have a written succession plan?",
  "Are recurring revenue streams documented?",
];

// Demo answers (pre-seeded so demos feel populated): Y Y N Y N Y N
export const FRAMEWORK_DEMO_ANSWERS: ("Y" | "N")[] = ["Y", "Y", "N", "Y", "N", "Y", "N"];

export const SCORES = {
  framework: { value: 15, of: 21, blindSpots: 6 },
  perception: { value: 58.7, threshold: 70 },
  financials: { value: 72.4 },
  hive: { value: 61.2 },
  sum: { value: 58.0 },
  gestalt: 64.0,
  exitCurrent: 3.2,
  exitClosed: 5.8,
  exitFull: 8.5,
};

export type VaultRecord = {
  id: string;
  title: string;
  module: "FRAMEWORK" | "FOCUS" | "FINANCIALS" | "FORMULA" | "HIVE" | "SUM" | "VAULT" | "PROJECTS";
  type: "answer" | "doc" | "metric" | "campaign" | "asset";
  source: string;
  confidence: number;
  date: string;
  tags: string[];
  connectedTo: string[]; // ids
  status: "gold" | "red" | "neutral";
};

export const VAULT: VaultRecord[] = [
  { id: "fw-01", title: "Brand strategy documentation", module: "FRAMEWORK", type: "answer", source: "Self-reported", confidence: 0.85, date: "2026-05-22", tags: ["brand", "strategy"], connectedTo: ["fo-01", "fm-01"], status: "gold" },
  { id: "fw-02", title: "Competitive advantage clarity", module: "FRAMEWORK", type: "answer", source: "Self-reported", confidence: 0.78, date: "2026-05-22", tags: ["positioning"], connectedTo: ["fo-02"], status: "gold" },
  { id: "fw-03", title: "Customer loyalty measurement", module: "FRAMEWORK", type: "answer", source: "Bain NPS Study", confidence: 0.92, date: "2026-05-22", tags: ["loyalty", "blind-spot"], connectedTo: ["fo-03", "fm-02", "camp-01"], status: "red" },
  { id: "fw-04", title: "Value-based pricing", module: "FRAMEWORK", type: "answer", source: "Self-reported", confidence: 0.7, date: "2026-05-22", tags: ["pricing"], connectedTo: ["fin-01"], status: "gold" },
  { id: "fw-05", title: "Quarterly brand review cadence", module: "FRAMEWORK", type: "answer", source: "Self-reported", confidence: 0.6, date: "2026-05-22", tags: ["governance", "blind-spot"], connectedTo: [], status: "red" },
  { id: "fo-01", title: "Brand perception baseline", module: "FOCUS", type: "metric", source: "McKinsey Brand Premium", confidence: 0.88, date: "2026-05-22", tags: ["perception"], connectedTo: ["fw-01"], status: "gold" },
  { id: "fo-02", title: "Positioning gap analysis", module: "FOCUS", type: "doc", source: "Bain", confidence: 0.81, date: "2026-05-22", tags: ["positioning", "blind-spot"], connectedTo: ["fw-02"], status: "red" },
  { id: "fo-03", title: "Customer sentiment index", module: "FOCUS", type: "metric", source: "Internal survey", confidence: 0.74, date: "2026-05-22", tags: ["loyalty"], connectedTo: ["fw-03"], status: "red" },
  { id: "fin-01", title: "Revenue leakage map", module: "FINANCIALS", type: "doc", source: "QuickBooks", confidence: 0.95, date: "2026-05-22", tags: ["leakage"], connectedTo: ["fw-04", "camp-01"], status: "gold" },
  { id: "fin-02", title: "EBITDA bridge model", module: "FINANCIALS", type: "doc", source: "QuickBooks", confidence: 0.97, date: "2026-05-22", tags: ["valuation"], connectedTo: ["fo-01"], status: "gold" },
  { id: "fm-01", title: "FORMULA strategy plan", module: "FORMULA", type: "doc", source: "Generated", confidence: 0.83, date: "2026-05-22", tags: ["plan"], connectedTo: ["fw-01"], status: "gold" },
  { id: "fm-02", title: "Loyalty program proposal", module: "FORMULA", type: "doc", source: "Generated · Bain", confidence: 0.79, date: "2026-05-22", tags: ["loyalty", "plan"], connectedTo: ["fw-03", "camp-01"], status: "gold" },
  { id: "hv-01", title: "Org graph baseline", module: "HIVE", type: "metric", source: "Org chart import", confidence: 0.9, date: "2026-05-22", tags: ["people"], connectedTo: [], status: "gold" },
  { id: "hv-02", title: "Key-man risk · CFO", module: "HIVE", type: "metric", source: "5-signal triangulation", confidence: 0.86, date: "2026-05-22", tags: ["key-man", "blind-spot"], connectedTo: [], status: "red" },
  { id: "sm-01", title: "Channel coverage audit", module: "SUM", type: "metric", source: "S.U.M. ingest", confidence: 0.82, date: "2026-05-22", tags: ["comms"], connectedTo: [], status: "gold" },
  { id: "camp-01", title: "Q4 Loyalty Launch", module: "PROJECTS", type: "campaign", source: "Campaign brief", confidence: 1, date: "2026-05-22", tags: ["loyalty", "Q4"], connectedTo: ["fw-03", "fm-02", "fin-01", "ast-01", "ast-02"], status: "gold" },
  { id: "ast-01", title: "Loyalty hero video", module: "VAULT", type: "asset", source: "Brand assets", confidence: 1, date: "2026-05-22", tags: ["loyalty", "creative"], connectedTo: ["camp-01"], status: "neutral" },
  { id: "ast-02", title: "Loyalty landing page", module: "VAULT", type: "asset", source: "Brand assets", confidence: 1, date: "2026-05-22", tags: ["loyalty", "web"], connectedTo: ["camp-01"], status: "neutral" },
];

export const MODULES = [
  { id: "FRAMEWORK", color: "#c9a227", label: "FRAMEWORK" },
  { id: "FOCUS", color: "#c45c00", label: "FOCUS" },
  { id: "FINANCIALS", color: "#5fcc00", label: "FINANCIALS" },
  { id: "FORMULA", color: "#7c3aed", label: "FORMULA" },
  { id: "HIVE", color: "#4882ff", label: "H.I.V.E." },
  { id: "SUM", color: "#e2b53f", label: "S.U.M." },
  { id: "VAULT", color: "#94d900", label: "VAULT" },
  { id: "PROJECTS", color: "#e25c5c", label: "PROJECTS" },
] as const;

export const TOKENS = {
  GOLD: "#c9a227",
  GOLD_BRIGHT: "#e2b53f",
  GOLD_DIM: "#c18d30",
  RED: "#8b2020",
  RED_BRIGHT: "#b83030",
  BG: "#0a0a0a",
  TEXT: "#e8e8e8",
  DIM: "#444",
};
