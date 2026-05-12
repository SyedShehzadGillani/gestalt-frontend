export type RoleType = "hq" | "agency" | "client" | "solopreneur" | "employee";

// Icon path constants for nav items
export const NAV_ICONS: Record<string, string> = {
  // Top-level
  command: "M2 3h20v14H2zm7 17h6m-3-3v3",
  "client-dashboard": "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M12 7a4 4 0 11-8 0 4 4 0 018 0z",
  dashboard: "M12 20V10M18 20V4M6 20v-4",
  alerts: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9m-4.27 13a2 2 0 01-3.46 0",
  "my-profile": "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
  "my-score": "M22 12h-4l-3 9L9 3l-3 9H2",
  "my-trajectory": "M23 6l-9.5 9.5-5-5L1 18",

  // B.A.S.E.
  overview: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm10 3a3 3 0 100-6 3 3 0 000 6z",
  onboarding: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
  framework: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  financials: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  focus: "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
  formula: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.5-10.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",

  // H.I.V.E.
  performance: "M22 12h-4l-3 9L9 3l-3 9H2",

  // S.U.M.
  messaging: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  journal: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  calendar: "M3 4h18v18H3zm16-2v2M5 2v2m-2 4h18M8 12h8M8 16h5",
  projects: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  timeline: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2",
  "personal-timeline": "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8zM18 8l2 2-2 2M22 10h-4",
  "story-engine": "M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  vault: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zm-3-4V7a4 4 0 00-8 0v4",
  vendors: "M3 21h18M3 7v14m6-14v14m6-14v14m6-14v14M3 7l9-4 9 4M6 11h.01M6 15h.01M12 11h.01M12 15h.01M18 11h.01M18 15h.01",
  polls: "M18 20V10M12 20V4M6 20v-6",

  // Business
  "biz-clients": "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M12 7a4 4 0 11-8 0 4 4 0 018 0z",
  "biz-revenue": "M23 6l-9.5 9.5-5-5L1 18",
  "biz-usage": "M22 12h-4l-3 9L9 3l-3 9H2",
  "biz-mrr": "M23 6l-9.5 9.5-5-5L1 18",
  "biz-churn": "M23 18l-9.5-9.5-5 5L1 6",

  // Management
  "mgmt-invoicing": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  "mgmt-permissions": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  "mgmt-announcements": "M11 5.88L9.88 7H4a2 2 0 00-2 2v4a2 2 0 002 2h5.88L11 16.12A2 2 0 0014 14.62V7.38A2 2 0 0011 5.88z",

  // Standalone
  creative: "M12 19l7-7 3 3-7 7-3-3zm-7.5.25L2 21l1.75-2.5 5-5 1.5 1.5-5 5z",
  research: "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
  "nav-analytics": "M12 20V10M18 20V4M6 20v-4",
  "my-tasks": "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  certified: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  transformation: "M18 3a3 3 0 011 5.83V9a9 9 0 01-9 9H8.83A3 3 0 115 16.17V12a5 5 0 005-5V5.17A3 3 0 0118 3z",

  // HQ-specific (prefixed)
  "hq-dashboard": "M12 20V10M18 20V4M6 20v-4",
  "hq-alerts": "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9m-4.27 13a2 2 0 01-3.46 0",
  "hq-agencies": "M3 21h18M3 7v14m6-14v14m6-14v14m6-14v14M3 7l9-4 9 4M6 11h.01M6 15h.01M12 11h.01M12 15h.01M18 11h.01M18 15h.01",
  "hq-clients": "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M12 7a4 4 0 11-8 0 4 4 0 018 0z",
  "hq-revenue": "M23 6l-9.5 9.5-5-5L1 18",
  "hq-usage": "M22 12h-4l-3 9L9 3l-3 9H2",
  "hq-coupons": "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  "hq-permissions": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  "hq-announcements": "M22 2L11 13M22 2l-7 20-4-9-9-4z",
  "hq-tickets": "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
  "hq-ai-help": "M12 22a10 10 0 100-20 10 10 0 000 20zm0-7v1m0-5a2 2 0 00-2 2h4a2 2 0 00-2-2zm0-3V6",
  "hq-features": "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  "hq-settings": "M12 15a3 3 0 100-6 3 3 0 000 6zm7.94-2a7.94 7.94 0 000-2l2-1.56a.5.5 0 000-.68l-2-3.46a.5.5 0 00-.61-.22l-2.36.95a8 8 0 00-1.73-1l-.36-2.51A.48.48 0 0014 2h-4a.48.48 0 00-.48.42l-.36 2.5a8 8 0 00-1.73 1L5.07 5a.5.5 0 00-.61.22l-2 3.46a.49.49 0 00.12.66L4.57 11a7.94 7.94 0 000 2l-2 1.56a.49.49 0 00-.12.67l2 3.46a.5.5 0 00.61.22l2.36-.95a8 8 0 001.73 1l.36 2.51A.48.48 0 0010 22h4a.48.48 0 00.47-.42l.36-2.5a8 8 0 001.73-1l2.36.95a.5.5 0 00.61-.22l2-3.46a.49.49 0 00-.12-.67z",
  "hq-team": "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m22 0v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M12 7a4 4 0 11-8 0 4 4 0 018 0z",
  "hq-overview": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm10 3a3 3 0 100-6 3 3 0 000 6z",
  "hq-onboarding": "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
  "hq-framework": "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  "hq-focus": "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
  "hq-formula": "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.5-10.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  "hq-performance": "M22 12h-4l-3 9L9 3l-3 9H2",
  "hq-messaging": "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  "hq-vault": "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zm-3-4V7a4 4 0 00-8 0v4",
  "hq-vendors": "M3 21h18M3 7v14m6-14v14m6-14v14m6-14v14M3 7l9-4 9 4M6 11h.01M6 15h.01M12 11h.01M12 15h.01M18 11h.01M18 15h.01",
  "hq-timeline": "M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2",
  "hq-personal-timeline": "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8zM18 8l2 2-2 2M22 10h-4",
  "hq-projects": "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  "hq-journal": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  "hq-story-engine": "M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  "hq-polls": "M18 20V10M12 20V4M6 20v-6",
  "hq-creative": "M12 19l7-7 3 3-7 7-3-3zm-7.5.25L2 21l1.75-2.5 5-5 1.5 1.5-5 5z",
  "hq-research": "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
  "hq-analytics": "M12 20V10M18 20V4M6 20v-4",
  "hq-my-tasks": "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
};

// Items whose icon color is always #e2b53f regardless of role accent
export const CREATIVE_ICON_IDS = new Set(["creative", "hq-creative"]);

export interface NavItem {
  id: string;
  label: string;
  subLabel: string;
  locked?: boolean;
}

export interface NavSection {
  label: string;
  fullName?: string; // e.g. "Brand and Strategy Engine" for B.A.S.E.
  accentColor?: boolean; // use role accent for label
  collapsedByDefault?: boolean;
  helpId?: string; // maps to HELP_CONTENT key for the ? button
  items: NavItem[];
}

export interface NavDivider {
  type: "divider";
}

export interface NavStandalone {
  type: "standalone";
  item: NavItem;
}

export type NavEntry = 
  | { type: "section"; section: NavSection }
  | NavDivider
  | NavStandalone;

export interface RoleConfig {
  accent: string;
  darkBg: string;
  lightBg: string;
  label: string;
  entries: NavEntry[];
  bottomLocked: NavItem[];
}

// Shared section builders
const baseSectionClient = (financialsLabel = "FINANCIALS", financialsSub = "Financial Intelligence"): NavSection => ({
  label: "B.A.S.E.",
  fullName: "Brand and Strategy Engine",
  helpId: "overview",
  items: [
    { id: "overview", label: "OVERVIEW", subLabel: "Company Dashboard" },
    { id: "onboarding", label: "ONBOARDING", subLabel: "Day 14 of 42" },
    { id: "framework", label: "FRAMEWORK", subLabel: "21-Point Assessment" },
    { id: "financials", label: financialsLabel, subLabel: financialsSub },
    { id: "focus", label: "FOCUS", subLabel: "Company Deep Dive" },
    { id: "formula", label: "FORMULA", subLabel: "Interaction Strategy" },
  ],
});

const baseSectionEmployee: NavSection = {
  label: "B.A.S.E.",
  fullName: "Brand and Strategy Engine",
  helpId: "overview",
  items: [
    { id: "overview", label: "OVERVIEW", subLabel: "Company Dashboard" },
    { id: "framework", label: "FRAMEWORK", subLabel: "21-Point Assessment" },
    { id: "focus", label: "FOCUS", subLabel: "Company Deep Dive" },
    { id: "financials", label: "FINANCIALS", subLabel: "Financial Intelligence" },
    { id: "formula", label: "FORMULA", subLabel: "Interaction Strategy" },
  ],
};

const baseSectionHQ: NavSection = {
  label: "B.A.S.E.",
  fullName: "Brand and Strategy Engine",
  helpId: "overview",
  items: [
    { id: "hq-overview", label: "OVERVIEW", subLabel: "Company Dashboard" },
    { id: "hq-onboarding", label: "ONBOARDING", subLabel: "Day 14 of 42" },
    { id: "hq-framework", label: "FRAMEWORK", subLabel: "21-Point Assessment" },
    { id: "hq-focus", label: "FOCUS", subLabel: "Company Deep Dive" },
    { id: "hq-formula", label: "FORMULA", subLabel: "Interaction Strategy" },
  ],
};

const hiveSectionDefault: NavSection = {
  label: "H.I.V.E.",
  fullName: "Human Capital Performance System",
  helpId: "hive-performance",
  items: [
    { id: "performance", label: "PERFORMANCE", subLabel: "Human Capital Performance System" },
  ],
};

const hiveSectionHQ: NavSection = {
  label: "H.I.V.E.",
  fullName: "Human Capital Performance System",
  helpId: "hive-performance",
  items: [
    { id: "hq-performance", label: "PERFORMANCE", subLabel: "Human Capital Performance System" },
  ],
};

const sumSectionClient: NavSection = {
  label: "S.U.M.",
  fullName: "Strategic Unified Messaging",
  helpId: "sum-messaging",
  items: [
    { id: "messaging", label: "MESSAGING", subLabel: "Team Communication" },
    { id: "vault", label: "VAULT", subLabel: "Brand Assets" },
    { id: "timeline", label: "BRAND TIMELINE", subLabel: "Company History" },
    { id: "personal-timeline", label: "PERSONAL TIMELINE", subLabel: "Your Journey" },
    { id: "projects", label: "PROJECTS", subLabel: "Active Initiatives" },
  ],
};

const sumSectionEmployee: NavSection = {
  label: "S.U.M.",
  fullName: "Strategic Unified Messaging",
  helpId: "sum-messaging",
  items: [
    { id: "messaging", label: "MESSAGING", subLabel: "Team Communication" },
    { id: "vault", label: "VAULT", subLabel: "Brand Assets" },
    { id: "timeline", label: "BRAND TIMELINE", subLabel: "Company History" },
    { id: "personal-timeline", label: "PERSONAL TIMELINE", subLabel: "Your Journey" },
    { id: "projects", label: "PROJECTS", subLabel: "Active Initiatives" },
  ],
};

const sumSectionHQ: NavSection = {
  label: "S.U.M.",
  fullName: "Strategic Unified Messaging",
  helpId: "sum-messaging",
  items: [
    { id: "hq-messaging", label: "MESSAGING", subLabel: "Team Communication" },
    { id: "hq-vault", label: "VAULT", subLabel: "Brand Assets" },
    { id: "hq-timeline", label: "BRAND TIMELINE", subLabel: "Company History" },
    { id: "hq-personal-timeline", label: "PERSONAL TIMELINE", subLabel: "Your Journey" },
    { id: "hq-projects", label: "PROJECTS", subLabel: "Active Initiatives" },
  ],
};

const businessSectionClient: NavSection = {
  label: "BUSINESS",
  accentColor: true,
  items: [
    { id: "biz-revenue", label: "REVENUE", subLabel: "Company Revenue" },
    { id: "biz-usage", label: "USAGE", subLabel: "Platform Activity" },
    { id: "biz-mrr", label: "MRR", subLabel: "Monthly Recurring Revenue" },
    { id: "biz-churn", label: "CHURN", subLabel: "Customer Retention Rate" },
  ],
};

const businessSectionAgency: NavSection = {
  label: "BUSINESS",
  accentColor: true,
  items: [
    { id: "biz-clients", label: "CLIENTS", subLabel: "My Client Accounts" },
    { id: "biz-revenue", label: "REVENUE", subLabel: "Agency Billing + ARR" },
    { id: "biz-usage", label: "USAGE", subLabel: "Platform Activity" },
    { id: "biz-mrr", label: "MRR", subLabel: "Monthly Recurring Revenue" },
    { id: "biz-churn", label: "CHURN", subLabel: "Retention + Attrition Rate" },
  ],
};

const managementSectionClient: NavSection = {
  label: "MANAGEMENT",
  collapsedByDefault: true,
  items: [
    { id: "mgmt-invoicing", label: "INVOICING", subLabel: "Billing + Billable Hours" },
    { id: "mgmt-permissions", label: "PERMISSIONS", subLabel: "Client Access Controls" },
    { id: "mgmt-announcements", label: "ANNOUNCEMENTS", subLabel: "Platform-Wide Broadcasts" },
  ],
};

const managementSectionAgency: NavSection = {
  label: "MANAGEMENT",
  collapsedByDefault: true,
  items: [
    { id: "mgmt-invoicing", label: "INVOICING", subLabel: "Billing + Billable Hours" },
    { id: "mgmt-permissions", label: "PERMISSIONS", subLabel: "Client Access Controls" },
    { id: "mgmt-announcements", label: "ANNOUNCEMENTS", subLabel: "Platform-Wide Broadcasts" },
  ],
};

const lockedItems: NavItem[] = [
  { id: "certified", label: "CERTIFIED", subLabel: "Exit Badge", locked: true },
  { id: "transformation", label: "TRANSFORMATION", subLabel: "Apply to Qualify", locked: true },
];

// ─── CLIENT ────────────────────────────────────────
export const clientConfig: RoleConfig = {
  accent: "#c9a227",
  darkBg: "#0a0a0a",
  lightBg: "#e8e7e2",
  label: "CLIENT",
  entries: [
    // Top items (never collapsible)
    { type: "standalone", item: { id: "command", label: "COMMAND CENTER", subLabel: "" } },
    { type: "standalone", item: { id: "alerts", label: "ALERTS", subLabel: "AI Intelligence" } },
    // Business
    { type: "section", section: businessSectionClient },
    // Sections
    { type: "section", section: baseSectionClient() },
    { type: "section", section: hiveSectionDefault },
    { type: "section", section: sumSectionClient },
    { type: "section", section: managementSectionClient },
    { type: "divider" },
    { type: "standalone", item: { id: "creative", label: "CREATIVE", subLabel: "Campaign Intelligence" } },
    { type: "divider" },
    { type: "standalone", item: { id: "research", label: "RESEARCH", subLabel: "Knowledge Engine" } },
    { type: "standalone", item: { id: "nav-analytics", label: "ANALYTICS", subLabel: "Data + Trends" } },
    { type: "standalone", item: { id: "my-tasks", label: "MY TASKS", subLabel: "Assigned From Projects" } },
  ],
  bottomLocked: lockedItems,
};

// ─── SOLOPRENEUR ───────────────────────────────────
export const solopreneurConfig: RoleConfig = {
  accent: "#e2b53f",
  darkBg: "#0a0a0a",
  lightBg: "#e8e7e2",
  label: "SOLOPRENEUR",
  entries: [...clientConfig.entries], // Identical structure
  bottomLocked: lockedItems,
};

// ─── AGENCY ────────────────────────────────────────
export const agencyConfig: RoleConfig = {
  accent: "#7c3aed",
  darkBg: "#0a0a0a",
  lightBg: "#e8e7e2",
  label: "AGENCY",
  entries: [
    { type: "standalone", item: { id: "command", label: "COMMAND CENTER", subLabel: "Agency Dashboard" } },
    { type: "standalone", item: { id: "client-dashboard", label: "CLIENT DASHBOARD", subLabel: "All Client Accounts" } },
    { type: "standalone", item: { id: "alerts", label: "ALERTS", subLabel: "Client + Platform Alerts" } },
    { type: "section", section: businessSectionAgency },
  ],
  bottomLocked: [],
};

// ─── HQ ────────────────────────────────────────────
export const hqConfig: RoleConfig = {
  accent: "#4882ff",
  darkBg: "#0a0a0a",
  lightBg: "#e8e7e2",
  label: "HQ",
  entries: [
    { type: "standalone", item: { id: "command", label: "COMMAND CENTER", subLabel: "Agency Dashboard" } },
    { type: "standalone", item: { id: "hq-dashboard", label: "DASHBOARD", subLabel: "Platform Health" } },
    { type: "standalone", item: { id: "hq-alerts", label: "ALERTS", subLabel: "System + Client Alerts" } },
    { type: "section", section: {
      label: "BUSINESS",
      items: [
        { id: "hq-agencies", label: "AGENCIES", subLabel: "All Agency Accounts" },
        { id: "hq-clients", label: "CLIENTS", subLabel: "All Client Accounts" },
        { id: "hq-revenue", label: "REVENUE", subLabel: "ARR + MRR + Projections" },
        { id: "hq-usage", label: "USAGE", subLabel: "Feature Adoption + Retention" },
      ],
    }},
    { type: "section", section: {
      label: "TOOLS",
      items: [
        { id: "hq-coupons", label: "COUPONS", subLabel: "Promo Codes + Discounts" },
        { id: "hq-permissions", label: "PERMISSIONS", subLabel: "Global Role Settings" },
        { id: "hq-announcements", label: "ANNOUNCEMENTS", subLabel: "Platform-Wide Broadcasts" },
      ],
    }},
    { type: "section", section: {
      label: "SUPPORT",
      items: [
        { id: "hq-tickets", label: "TICKETS", subLabel: "Open Support Requests" },
        { id: "hq-ai-help", label: "AI HELP", subLabel: "GESTALT INTELLIGENCE Diagnostics" },
        { id: "hq-features", label: "FEATURES", subLabel: "Requested Features" },
      ],
    }},
    { type: "section", section: {
      label: "SETTINGS",
      items: [
        { id: "hq-settings", label: "SETTINGS", subLabel: "Platform Configuration" },
        { id: "hq-team", label: "TEAM", subLabel: "HQ Staff Management" },
      ],
    }},
  ],
  bottomLocked: [],
};

// ─── EMPLOYEE ──────────────────────────────────────
export const employeeConfig: RoleConfig = {
  accent: "#888888",
  darkBg: "#0a0a0a",
  lightBg: "#e8e7e2",
  label: "EMPLOYEE",
  entries: [
    { type: "standalone", item: { id: "my-profile", label: "MY PROFILE", subLabel: "" } },
    { type: "standalone", item: { id: "my-score", label: "MY SCORE", subLabel: "H.I.V.E. Dashboard" } },
    { type: "standalone", item: { id: "my-trajectory", label: "MY TRAJECTORY", subLabel: "Score Over Time" } },
    { type: "section", section: baseSectionEmployee },
    { type: "section", section: hiveSectionDefault },
    { type: "section", section: sumSectionEmployee },
    { type: "divider" },
    { type: "standalone", item: { id: "creative", label: "CREATIVE", subLabel: "Campaign Intelligence" } },
    { type: "divider" },
    { type: "standalone", item: { id: "research", label: "RESEARCH", subLabel: "Knowledge Engine" } },
    { type: "standalone", item: { id: "nav-analytics", label: "ANALYTICS", subLabel: "Data + Trends" } },
    { type: "standalone", item: { id: "my-tasks", label: "MY TASKS", subLabel: "Assigned From Projects" } },
  ],
  bottomLocked: [], // Employee has no CERTIFIED/TRANSFORMATION
};

export const roleConfigs: Record<RoleType, RoleConfig> = {
  client: clientConfig,
  solopreneur: solopreneurConfig,
  agency: agencyConfig,
  hq: hqConfig,
  employee: employeeConfig,
};

// Route mapping per nav item id
export function getRouteForItem(itemId: string, role: RoleType, clientId?: string): string {
  const prefix = role === "hq" ? "/hq" : clientId ? `/client/${clientId}` : "/agency";
  
  const routeMap: Record<string, string> = {
    // Client/Agency/Solo shared
    "command": "/platform",
    "client-dashboard": "/agency/clients",
    "alerts": `${prefix}/alerts`,
    "overview": "/platform",
    "onboarding": `${prefix}/onboarding`,
    "framework": `${prefix}/framework`,
    "financials": `${prefix}/financials`,
    "focus": `${prefix}/focus`,
    "formula": `${prefix}/formula`,
    "performance": `${prefix}/hive`,
    "messaging": `${prefix}/messaging`,
    "journal": `${prefix}/journal`,
    "calendar": `${prefix}/calendar`,
    "projects": `${prefix}/projects`,
    "timeline": `${prefix}/timeline`,
    "story-engine": `${prefix}/story-engine`,
    "vault": `${prefix}/vault`,
    "vendors": `${prefix}/vendors`,
    "polls": `${prefix}/polls`,
    "creative": `${prefix}/creative`,
    "research": `${prefix}/research`,
    "nav-analytics": `${prefix}/analytics`,
    "my-tasks": `${prefix}/my-tasks`,
    
    // Business
    "biz-clients": role === "agency" ? "/agency/clients" : `${prefix}/biz-clients`,
    "biz-revenue": role === "agency" ? "/agency/billing" : `${prefix}/biz-revenue`,
    "biz-usage": `${prefix}/biz-usage`,
    "biz-mrr": `${prefix}/biz-mrr`,
    "biz-churn": `${prefix}/biz-churn`,
    
    // Management
    "mgmt-invoicing": `${prefix}/mgmt-invoicing`,
    "mgmt-permissions": `${prefix}/mgmt-permissions`,
    "mgmt-announcements": `${prefix}/mgmt-announcements`,
    
    // HQ
    "hq-overview-top": "/hq/dashboard",
    "hq-dashboard": "/hq/dashboard",
    "hq-alerts": "/hq/alerts",
    "hq-agencies": "/hq/agencies",
    "hq-clients": "/hq/clients",
    "hq-revenue": "/hq/revenue",
    "hq-usage": "/hq/usage",
    "hq-coupons": "/hq/coupons",
    "hq-permissions": "/hq/permissions",
    "hq-announcements": "/hq/announcements",
    "hq-tickets": "/hq/tickets",
    "hq-ai-help": "/hq/ai-help",
    "hq-features": "/hq/features",
    "hq-settings": "/hq/settings",
    "hq-team": "/hq/team",
    "hq-overview": "/hq/base-overview",
    "hq-onboarding": "/hq/onboarding",
    "hq-framework": "/hq/base-framework",
    "hq-focus": "/hq/base-focus",
    "hq-formula": "/hq/base-formula",
    "hq-performance": "/hq/hive-performance",
    "hq-messaging": "/hq/sum-messaging",
    "hq-vault": "/hq/sum-vault",
    "hq-vendors": "/hq/vendors",
    "hq-timeline": "/hq/sum-timeline",
    "hq-projects": "/hq/sum-projects",
    "hq-journal": "/hq/journal",
    "hq-story-engine": "/hq/story-engine",
    "hq-polls": "/hq/polls",
    "hq-creative": "/hq/creative",
    "hq-research": "/hq/research",
    "hq-analytics": "/hq/analytics",
    "hq-my-tasks": "/hq/my-tasks",
    
    // Employee
    "my-profile": `${prefix}/profile`,
    "my-score": `${prefix}/my-score`,
    "my-trajectory": `${prefix}/my-trajectory`,
    
    // Locked
    "certified": "#",
    "transformation": "#",
  };
  
  return routeMap[itemId] || "#";
}
