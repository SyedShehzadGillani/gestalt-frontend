// Org-level permission model mock data.
// Source of truth: features-to-implement/permissions/GPS-PLATFORM-Permission-Model-Spec-05-23-v2.md
// Frontend-only mock. Primary org rekeyed to canonical "Northgate Solutions".

export type PermStatus =
  | "active"
  | "paused"
  | "pending"
  | "pending-approval"
  | "departed";

export type PermRole =
  | "GESTALT HQ"
  | "CEO"
  | "ADMIN"
  | "IT SUPPORT"
  | "ATTORNEY"
  | "MANAGER"
  | "EMPLOYEE"
  | "VENDOR";

export type AccessLevel =
  | "No Access"
  | "Can View"
  | "Can Export"
  | "Can Comment"
  | "Full Access";

export type AiTier = "STANDARD" | "STRATEGIST" | "POWER" | "UNLIMITED";

export type VendorCategory =
  | "Creative Agency"
  | "Service Vendor"
  | "Strategic Partner"
  | "Contractor"
  | "Investor / Board Observer";

export interface AiQueryUsage {
  used: number;
  allocation: number;
  rollover: number;
  overage: number;
  resetDate: string;
}

export interface PermUser {
  id: number;
  name: string;
  email: string;
  role: PermRole;
  av: string;
  company: string;
  status: PermStatus;
  locations: string[];
  dept: string | null;
  expires: string | null;
  watermark: boolean;
  downloads: number;
  lastDl: string | null;
  grantedBy: string;
  grantedAt: string;
  canGrantProjects: boolean;
  aiStatus: AiTier | null;
  tenureMonths?: number | null;
  retentionConsent: boolean;
  mfa?: "active" | "not-configured";
  lastLogin?: string;
  lastLoginIp?: string;
  lastLoginDevice?: string;
  aiQueries?: AiQueryUsage;
  isVC?: boolean;
  vendorCategory?: VendorCategory;
  ndaStatus?: "signed" | "pending" | "none";
  vendorScore?: number;
  ipAllowlist?: string[];
  agencyOptIn?: string[];
  pausedAt?: string | null;
  pausedBy?: string | null;
  pauseReason?: string | null;
  departedAt?: string;
  departedBy?: string;
  pendingApproval?: boolean;
  exportPackage?: boolean;
}

export interface DownloadLog {
  ts: string;
  uid: number;
  file: string;
  size: string;
  flag: boolean;
}

export interface DownloadAlert {
  ts: string;
  uid: number;
  type: string;
  msg: string;
  sev: "high" | "medium";
}

export interface AuditEntry {
  ts: string;
  who: string;
  role: string;
  act: string;
  alert?: boolean;
}

export interface AssetItem {
  id: string;
  name: string;
}

export interface AssetCategory {
  key: string;
  label: string;
  desc: string;
  items: AssetItem[];
  locked?: boolean;
}

export interface AiTierData {
  k: AiTier;
  price: number;
}

export const LEVELS: AccessLevel[] = [
  "No Access",
  "Can View",
  "Can Export",
  "Can Comment",
  "Full Access",
];

export const FULL_ROLES: PermRole[] = [
  "GESTALT HQ",
  "CEO",
  "ADMIN",
  "IT SUPPORT",
  "ATTORNEY",
];

export const TABS = [
  "people",
  "companies",
  "assets",
  "audit",
  "downloads",
  "notifications",
] as const;
export type PermTab = (typeof TABS)[number];

export const LOCS = [
  "Downtown Clinic",
  "Westside Clinic",
  "Corporate HQ",
  "Satellite Office",
];

export const DEPTS = [
  "Executive",
  "Operations",
  "Marketing",
  "Sales",
  "Engineering",
  "Finance",
  "HR",
  "Legal",
];

export const VENDOR_CATS: VendorCategory[] = [
  "Creative Agency",
  "Service Vendor",
  "Strategic Partner",
  "Contractor",
  "Investor / Board Observer",
];

export const AI_TIERS_DATA: AiTierData[] = [
  { k: "STANDARD", price: 29 },
  { k: "STRATEGIST", price: 79 },
  { k: "POWER", price: 149 },
  { k: "UNLIMITED", price: 299 },
];

export const AGENCY_OPTIN_MODULES = [
  "FRAMEWORK",
  "FOCUS",
  "C.O.R.E.",
  "VAULT",
  "Projects",
];

const RAW_CATS: AssetCategory[] = [
  {
    key: "vault",
    label: "VAULT",
    desc: "Brand Assets",
    items: [
      "Logo Package",
      "Brand Guidelines",
      "Photography Library",
      "Template Files",
      "Letterhead & Collateral",
    ].map((name, i) => ({ id: `vault_${i}`, name })),
  },
  {
    key: "projects",
    label: "PROJECTS",
    desc: "Active Initiatives",
    items: [
      "Q1 Website Redesign",
      "OVO Billboard Campaign",
      "Social Media Strategy 2026",
      "Employee Onboarding Refresh",
    ].map((name, i) => ({ id: `projects_${i}`, name })),
  },
  {
    key: "campaigns",
    label: "CAMPAIGNS",
    desc: "B.A.S.E. / H.I.V.E. / S.U.M.",
    items: [
      "FOCUS Assessment — Q1 2026",
      "H.I.V.E. Review Cycle — February",
      "S.U.M. Pulse Survey — Week 8",
      "FORMULA Strategy — Phase 2",
    ].map((name, i) => ({ id: `campaigns_${i}`, name })),
  },
  {
    key: "timelines",
    label: "TIMELINES",
    desc: "Brand History",
    items: [
      "Company Timeline",
      "Downtown Clinic Timeline",
      "Westside Clinic Timeline",
    ].map((name, i) => ({ id: `timelines_${i}`, name })),
  },
  {
    key: "analytics",
    label: "ANALYTICS",
    desc: "Numbers + Data + Trends",
    items: [
      "Financial Dashboard",
      "GESTALT Score Trends",
      "H.I.V.E. Aggregate Reports",
      "Valuation Bridge",
      "Competitive Position Tracking",
    ].map((name, i) => ({ id: `analytics_${i}`, name })),
  },
  {
    key: "presentations",
    label: "PRESENTATIONS",
    desc: "B.A.S.E. / H.I.V.E. / S.U.M.",
    items: [
      "Investor Deck — Q1 2026",
      "Board Report — February",
      "Transformation Progress Report",
    ].map((name, i) => ({ id: `presentations_${i}`, name })),
  },
  {
    key: "journal",
    label: "JOURNAL",
    desc: "Owner-Only — Private",
    locked: true,
    items: [{ id: "journal_0", name: "Personal Business Journal" }],
  },
];

export const CATS = RAW_CATS;
export const ALL_IDS = CATS.filter((c) => !c.locked).flatMap((c) =>
  c.items.map((i) => i.id),
);
export const TOTAL = ALL_IDS.length;

// Permission templates by vendor category — auto-applied on invite, overridable per item.
export const VENDOR_TEMPLATES: Record<VendorCategory, Record<string, AccessLevel>> = {
  "Creative Agency": {
    vault: "Can View",
    projects: "Can Comment",
    campaigns: "No Access",
    timelines: "No Access",
    analytics: "No Access",
    presentations: "Can View",
  },
  "Service Vendor": {
    vault: "Can View",
    projects: "Can View",
    campaigns: "No Access",
    timelines: "No Access",
    analytics: "No Access",
    presentations: "No Access",
  },
  "Strategic Partner": {
    vault: "Can View",
    projects: "Can View",
    campaigns: "Can View",
    timelines: "Can View",
    analytics: "Can View",
    presentations: "Can View",
  },
  Contractor: {
    vault: "Can View",
    projects: "Can Comment",
    campaigns: "No Access",
    timelines: "No Access",
    analytics: "No Access",
    presentations: "No Access",
  },
  "Investor / Board Observer": {
    vault: "Can View",
    projects: "No Access",
    campaigns: "No Access",
    timelines: "Can View",
    analytics: "Can View",
    presentations: "Can View",
  },
};

const PRIMARY_CO = "Northgate Solutions";

export const USERS: PermUser[] = [
  { id: 0, name: "GESTALT Operations", email: "ops@gestaltpartners.com", role: "GESTALT HQ", av: "GP", company: "GESTALT Partners", status: "active", locations: LOCS, dept: "Executive", expires: null, watermark: false, downloads: 2, lastDl: "2026-02-24 09:14", grantedBy: "System", grantedAt: "2026-01-01", canGrantProjects: true, aiStatus: "UNLIMITED", tenureMonths: null, retentionConsent: true, mfa: "active", lastLogin: "2026-02-24 11:02", lastLoginIp: "72.14.201.18", lastLoginDevice: "Chrome / macOS", aiQueries: { used: 1847, allocation: 3000, rollover: 0, overage: 0, resetDate: "2026-03-15" } },
  { id: 1, name: "Jeffery Ess", email: "jeff.ess@northgatesolutions.com", role: "CEO", av: "JE", company: PRIMARY_CO, status: "active", locations: LOCS, dept: "Executive", expires: null, watermark: false, downloads: 14, lastDl: "2026-02-24 11:42", grantedBy: "System", grantedAt: "2025-09-15", canGrantProjects: true, aiStatus: "UNLIMITED", tenureMonths: 120, retentionConsent: true, agencyOptIn: ["FRAMEWORK", "FOCUS", "VAULT"], mfa: "active", lastLogin: "2026-02-24 08:15", lastLoginIp: "68.45.112.90", lastLoginDevice: "Safari / macOS", aiQueries: { used: 4210, allocation: 3000, rollover: 0, overage: 121, resetDate: "2026-03-15" } },
  { id: 2, name: "Sarah Mitchell", email: "sarah.m@northgatesolutions.com", role: "ADMIN", av: "SM", company: PRIMARY_CO, status: "active", locations: LOCS, dept: "Operations", expires: null, watermark: false, downloads: 9, lastDl: "2026-02-23 16:30", grantedBy: "Jeffery Ess", grantedAt: "2025-09-16", canGrantProjects: true, aiStatus: "STRATEGIST", tenureMonths: 84, retentionConsent: true, mfa: "active", lastLogin: "2026-02-24 07:45", lastLoginIp: "68.45.112.90", lastLoginDevice: "Chrome / Windows", aiQueries: { used: 98, allocation: 500, rollover: 175, overage: 0, resetDate: "2026-03-15" } },
  { id: 3, name: "David Chen", email: "d.chen@northgatesolutions.com", role: "MANAGER", av: "DC", company: PRIMARY_CO, status: "active", locations: ["Downtown Clinic", "Westside Clinic"], dept: "Marketing", expires: null, watermark: true, downloads: 22, lastDl: "2026-02-24 10:55", grantedBy: "Sarah Mitchell", grantedAt: "2025-10-01", canGrantProjects: true, aiStatus: "STRATEGIST", tenureMonths: 36, retentionConsent: true, mfa: "not-configured", lastLogin: "2026-02-24 09:30", lastLoginIp: "192.168.1.45", lastLoginDevice: "Chrome / Windows", aiQueries: { used: 487, allocation: 500, rollover: 13, overage: 0, resetDate: "2026-03-15" } },
  { id: 4, name: "Laura Carter", email: "l.carter@northgatesolutions.com", role: "EMPLOYEE", av: "LC", company: PRIMARY_CO, status: "active", locations: ["Downtown Clinic"], dept: "Marketing", expires: null, watermark: true, downloads: 3, lastDl: "2026-02-20 08:10", grantedBy: "Sarah Mitchell", grantedAt: "2025-10-15", canGrantProjects: false, aiStatus: "STANDARD", tenureMonths: 18, retentionConsent: true, mfa: "not-configured", lastLogin: "2026-02-23 14:22", lastLoginIp: "10.0.0.34", lastLoginDevice: "Safari / iOS", aiQueries: { used: 71, allocation: 75, rollover: 4, overage: 0, resetDate: "2026-03-15" } },
  { id: 5, name: "Marcus Webb", email: "marcus@bluelinestudio.com", role: "VENDOR", av: "MW", company: "Blue Line Studio", status: "active", locations: [], dept: null, expires: "2026-04-15", watermark: true, downloads: 47, lastDl: "2026-02-24 11:58", grantedBy: "Jeffery Ess", grantedAt: "2025-11-10", isVC: true, canGrantProjects: false, aiStatus: null, vendorCategory: "Creative Agency", ndaStatus: "signed", vendorScore: 72, retentionConsent: true, mfa: "not-configured", lastLogin: "2026-02-24 11:48", lastLoginIp: "104.28.55.12", lastLoginDevice: "Firefox / Windows", ipAllowlist: ["104.28.55.0/24"] },
  { id: 6, name: "Ryan Schroeder", email: "ryan@techops.io", role: "IT SUPPORT", av: "RS", company: "TechOps Solutions", status: "active", locations: LOCS, dept: "Engineering", expires: null, watermark: false, downloads: 6, lastDl: "2026-02-22 14:20", grantedBy: "Jeffery Ess", grantedAt: "2026-02-15", canGrantProjects: false, aiStatus: "POWER", tenureMonths: null, retentionConsent: true, mfa: "active", lastLogin: "2026-02-24 10:10", lastLoginIp: "72.14.201.18", lastLoginDevice: "Chrome / macOS", aiQueries: { used: 1142, allocation: 2000, rollover: 340, overage: 0, resetDate: "2026-03-15" } },
  { id: 7, name: "Jennifer Park", email: "j.park@northgatesolutions.com", role: "EMPLOYEE", av: "JP", company: PRIMARY_CO, status: "active", locations: ["Westside Clinic"], dept: "Sales", expires: null, watermark: true, downloads: 1, lastDl: "2026-02-18 09:45", grantedBy: "David Chen", grantedAt: "2025-11-01", canGrantProjects: false, aiStatus: "STANDARD", tenureMonths: 8, retentionConsent: false, mfa: "not-configured", lastLogin: "2026-02-21 16:05", lastLoginIp: "10.0.0.88", lastLoginDevice: "Chrome / Android", aiQueries: { used: 12, allocation: 75, rollover: 0, overage: 0, resetDate: "2026-03-15" } },
  { id: 8, name: "Tom Bradley", email: "tom@bradleylaw.com", role: "ATTORNEY", av: "TB", company: "Bradley Law Group", status: "active", locations: LOCS, dept: "Legal", expires: null, watermark: false, downloads: 8, lastDl: "2026-02-23 13:00", grantedBy: "Jeffery Ess", grantedAt: "2025-12-01", canGrantProjects: false, aiStatus: null, tenureMonths: null, retentionConsent: true, mfa: "active", lastLogin: "2026-02-23 12:50", lastLoginIp: "209.85.227.104", lastLoginDevice: "Safari / macOS" },
  { id: 12, name: "Chloe Martin", email: "chloe@bluelinestudio.com", role: "VENDOR", av: "CM", company: "Blue Line Studio", status: "active", locations: [], dept: null, expires: "2026-04-15", watermark: true, downloads: 11, lastDl: "2026-02-23 15:30", grantedBy: "Marcus Webb", grantedAt: "2025-12-05", isVC: false, canGrantProjects: false, aiStatus: null, vendorCategory: "Creative Agency", ndaStatus: "signed", vendorScore: 68, retentionConsent: true, mfa: "not-configured", lastLogin: "2026-02-23 15:20", lastLoginIp: "104.28.55.12", lastLoginDevice: "Chrome / macOS" },
  { id: 14, name: "Rachel Torres", email: "r.torres@northgatesolutions.com", role: "EMPLOYEE", av: "RT", company: PRIMARY_CO, status: "paused", locations: ["Corporate HQ"], dept: "HR", expires: null, watermark: true, downloads: 7, lastDl: "2026-02-10 09:00", grantedBy: "Sarah Mitchell", grantedAt: "2025-10-20", pausedAt: "2026-02-18", pausedBy: "Sarah Mitchell", pauseReason: "Under review — download activity flagged", canGrantProjects: false, aiStatus: "STANDARD", tenureMonths: 14, retentionConsent: true, mfa: "not-configured", lastLogin: "2026-02-18 08:55", lastLoginIp: "10.0.0.22", lastLoginDevice: "Chrome / Windows", aiQueries: { used: 45, allocation: 75, rollover: 30, overage: 0, resetDate: "2026-03-15" } },
  { id: 9, name: "Anika Patel", email: "anika@designco.io", role: "VENDOR", av: "AP", company: "DesignCo", status: "pending", locations: [], dept: null, expires: "2026-05-01", watermark: true, downloads: 0, lastDl: null, grantedBy: "Jeffery Ess", grantedAt: "2026-02-23", isVC: true, canGrantProjects: false, aiStatus: null, vendorCategory: "Service Vendor", ndaStatus: "pending", retentionConsent: false },
  { id: 10, name: "Chris Novak", email: "c.novak@northgatesolutions.com", role: "EMPLOYEE", av: "CN", company: PRIMARY_CO, status: "pending", locations: ["Satellite Office"], dept: "Engineering", expires: null, watermark: true, downloads: 0, lastDl: null, grantedBy: "Sarah Mitchell", grantedAt: "2026-02-24", canGrantProjects: false, aiStatus: "STANDARD", tenureMonths: 0, retentionConsent: false },
  { id: 11, name: "Blue Ridge Consulting", email: "team@blueridge.co", role: "VENDOR", av: "BR", company: "Blue Ridge Consulting", status: "pending-approval", locations: [], dept: null, expires: "2026-06-30", watermark: true, downloads: 0, lastDl: null, grantedBy: "Sarah Mitchell", grantedAt: "2026-02-24", pendingApproval: true, isVC: true, canGrantProjects: false, aiStatus: null, vendorCategory: "Strategic Partner", ndaStatus: "pending", retentionConsent: false },
  { id: 13, name: "Jake Reeves", email: "jake@bluelinestudio.com", role: "VENDOR", av: "JR", company: "Blue Line Studio", status: "departed", locations: [], dept: null, expires: null, watermark: true, downloads: 5, lastDl: "2026-01-20 11:00", grantedBy: "Marcus Webb", grantedAt: "2025-11-12", departedAt: "2026-01-25", departedBy: "Marcus Webb", isVC: false, canGrantProjects: false, aiStatus: null, vendorCategory: "Creative Agency", ndaStatus: "signed", exportPackage: false, retentionConsent: true, lastLogin: "2026-01-24 17:30", lastLoginIp: "104.28.55.12", lastLoginDevice: "Chrome / Windows" },
];

export const DL_LOG: DownloadLog[] = [
  { ts: "2026-02-24 11:58", uid: 5, file: "Logo Package", size: "24.3 MB", flag: true },
  { ts: "2026-02-24 11:55", uid: 5, file: "Brand Guidelines", size: "8.1 MB", flag: true },
  { ts: "2026-02-24 11:52", uid: 5, file: "Photography Library", size: "142 MB", flag: true },
  { ts: "2026-02-24 11:50", uid: 5, file: "Template Files", size: "33.7 MB", flag: true },
  { ts: "2026-02-24 11:42", uid: 1, file: "Valuation Bridge", size: "2.1 MB", flag: false },
  { ts: "2026-02-24 10:55", uid: 3, file: "H.I.V.E. Aggregate Reports", size: "5.6 MB", flag: false },
  { ts: "2026-02-23 16:30", uid: 2, file: "Board Report — February", size: "4.5 MB", flag: false },
  { ts: "2026-02-23 15:30", uid: 12, file: "Photography Library", size: "142 MB", flag: false },
  { ts: "2026-02-23 13:00", uid: 8, file: "Investor Deck — Q1 2026", size: "12.3 MB", flag: false },
  { ts: "2026-02-22 14:20", uid: 6, file: "Template Files", size: "33.7 MB", flag: false },
  { ts: "2026-02-20 08:10", uid: 4, file: "Brand Guidelines", size: "8.1 MB", flag: false },
];

export const DL_ALERTS: DownloadAlert[] = [
  { ts: "2026-02-24 11:58", uid: 5, type: "BULK DOWNLOAD", msg: "4 files in 8 min — 208 MB total.", sev: "high" },
  { ts: "2026-02-24 10:55", uid: 3, type: "ELEVATED ACTIVITY", msg: "22 downloads this month — above MANAGER avg.", sev: "medium" },
];

export const AUDITS: AuditEntry[] = [
  { ts: "2026-02-24 11:58", who: "SYSTEM", role: "", act: "ALERT — Marcus Webb (Blue Line Studio) bulk download. 4 files / 208 MB in 8 min.", alert: true },
  { ts: "2026-02-24 09:15", who: "Sarah Mitchell", role: "ADMIN", act: "Invited Blue Ridge Consulting (VENDOR) — awaiting CEO approval" },
  { ts: "2026-02-24 08:30", who: "Sarah Mitchell", role: "ADMIN", act: "Invited Chris Novak (EMPLOYEE) — Satellite Office" },
  { ts: "2026-02-23 14:14", who: "Jeffery Ess", role: "CEO", act: "Laura Carter — Q1 Website Redesign — Can View" },
  { ts: "2026-02-23 10:00", who: "Jeffery Ess", role: "CEO", act: "Invited Anika Patel (DesignCo / VENDOR) — expires 2026-05-01" },
  { ts: "2026-02-18 14:00", who: "Sarah Mitchell", role: "ADMIN", act: "PAUSED Rachel Torres — reason: download activity under review" },
  { ts: "2026-02-18 11:20", who: "Sarah Mitchell", role: "ADMIN", act: "David Chen granted MANAGER + PROJECT GRANT — Downtown + Westside" },
  { ts: "2026-01-25 10:00", who: "Marcus Webb", role: "VENDOR CONTACT", act: "Jake Reeves departed — access revoked, history preserved" },
  { ts: "2026-02-10 10:00", who: "SYSTEM", role: "", act: "H.I.V.E. review cycle initiated — 7 employees notified" },
];

export const INVITE_COMPANY = PRIMARY_CO;
