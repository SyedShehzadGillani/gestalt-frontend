// ═══════════════════════════════════════════════════════════════════════════
// GESTALT MOCK DATA — CANONICAL VERSION
// Version: v2 — April 30, 2026
// Single source of truth for ALL mock values across all 54 build steps.
// NEVER hardcode values in components. Import from here.
// Replace with live Supabase calls during developer sprint (Steps 34–39).
// ═══════════════════════════════════════════════════════════════════════════
//
// CHANGES FROM v1:
//
//   1. RECONCILED: H.I.V.E. canonical name updated to "Human Capital
//      Performance System" per locked memory #1. Previous "Human Insight
//      Valuation Engine" was inherited from a stale Lovable Designer
//      Guide fix prompt and is no longer canonical.
//
//   2. RECONCILED: GESTALT INTELLIGENCE branding throughout. "GESTALT AI"
//      references replaced (the engine name already ends in "AI" via the
//      G.E.S.T.A.L.T. acronym — "GESTALT AI" is redundant).
//
//   3. ADDED — S.U.M. v15 exports (16 new):
//        23. NOTE_COLORS              — color palette with dark+light variants
//        24. NOTES                    — sticky-note collection (separate from journal)
//        25. JOURNAL_ENTRIES          — structured personal journal entries
//        26. FOLDERS                  — span both journal entries and notes
//        27. ENTRY_TYPES              — 3 types: IDEA, FEAR/FRICTION, D.E.S.I.R.E.
//        28. DESIRE_FIELDS            — six chained pillars
//        29. DESIRE_HINTS             — chained prompt copy per pillar
//        30. INTERVIEW_QUESTIONS      — pending C.O.R.E. questions for the user
//        31. CONTRIBUTIONS_LOG        — logged participation (NOT score)
//        32. WEEKLY_STATUS            — quality-weighted weekly target
//        33. STORY_POSTS              — STORY ENGINE shared content
//        34. SUM_KPIS                 — 8 metrics for METRICS tab
//        35. SLIDESHOW                — cinematic daily slides
//        36. CHANNELS                 — channel definitions
//        37. REWARD_MESSAGES          — gamified C.O.R.E. answer rewards
//        38. GI_NARRATIONS            — site-wide AI per-tab narrations
//        39. GI_SEED_MESSAGES         — opening welcome + nudge for new users
//        40. GI_SUGGESTIONS           — input field suggestion chips
//        41. GI_DEMO_RESPONSES        — hardcoded responses for mockup demo
//        42. GI_FRANK_PROMPT          — frank-mode permission text
//
// LOCKED RULES — NEVER CHANGE:
//   - GESTALT SCORE = (71.0 + 63.0 + 58.0) / 3 = 64.0 — locked forever
//   - All scores display as toFixed(1) — "64.0" never "64"
//   - "GESTALT INTELLIGENCE" everywhere — never "GESTALT AI"
//   - H.I.V.E. = "Human Capital Performance System" (memory #1, v2 reconciliation)
//   - EXIT EQUATION™ and VALUATION DRAIN™ — these names, no others
//   - isVerified: false — UNVERIFIED flag must always show on self-reported financials
//   - H.I.V.E. KNOWLEDGE quadrant color: #4882ff (Amendment 03 — #0054EA is retired)
//   - D.E.S.I.R.E. = Delight, Experience, Surprise, Inspire, Resonate, Evangelize
//   - SOLVE is dead — D.E.S.I.R.E. replaces it. Chip color is gold not blue.
//   - NOTES is a SEPARATE data type from JOURNAL_ENTRIES (memory #29)
//   - H.I.V.E. score is HUMAN-CURATED by HR — AI captures evidence, humans render verdicts
//   - UI copy: "PARTICIPATION LOGGED" never "H.I.V.E. CREDIT"
//   - NO colored dots/circles as design elements anywhere (memory #28)
// ═══════════════════════════════════════════════════════════════════════════


// ── 1. CURRENT USER ──────────────────────────────────────────────────────────
export const CURRENT_USER = {
  id: "user-001",
  name: "Alex Chen",
  initials: "AC",
  role: "CLIENT",              // CLIENT | SOLOPRENEUR | AGENCY | HQ | EMPLOYEE
  company: "Northgate Solutions",
  avatar: null,
  segment: "BO",              // BB | BO | IA | AC
  aiStatus: "STANDARD",       // STANDARD | STRATEGIST | POWER | UNLIMITED
  aiQueriesUsed: 61,
  aiQueriesTotal: 75,
};


// ── 2. COMPANY SCORES ────────────────────────────────────────────────────────
// GESTALT SCORE™ = (B.A.S.E. + H.I.V.E. + S.U.M.) ÷ 3
// (71.0 + 63.0 + 58.0) ÷ 3 = 64.0 — LOCKED. Never change.
// All scores ALWAYS display as X.X — one decimal place, always.
export const COMPANY_SCORES = {
  base: 71.0,                  // B.A.S.E. (Brand and Strategy Engine)
  hive: 63.0,                  // H.I.V.E. (Human Capital Performance System)
  sum: 58.0,                   // S.U.M. (Strategic Unified Messaging)
  gestaltScore: 64.0,          // = parseFloat(((71.0+63.0+58.0)/3).toFixed(1))
  exitReadiness: 64.0,
  exitLabel: "MARKET VULNERABLE",
  quarterDelta: +6.0,
  intelligencePct: 33,
  onboardingDay: 14,
  onboardingTotal: 42,
  coreConfidence: "STANDARD",  // HIGH | STANDARD | LIMITED
};


// ── 3. QUADRANT SCORES ───────────────────────────────────────────────────────
export const QUADRANT_SCORES = {
  strategy: 72.0,
  leadership: 58.0,
  culture: 50.0,
  brand: 78.0,
};


// ── 4. SEGMENT SCORES ────────────────────────────────────────────────────────
export const SEGMENT_SCORES = {
  operations: 68.0, marketing: 75.0, sales: 62.0, finance: 55.0,
  technology: 63.0, knowledge: 48.0, talent: 58.0, alignment: 52.0,
  support:    50.0, innovation: 75.0, research: 68.0, product: 70.0,
};


// ── 5. ONBOARDING STEPS ──────────────────────────────────────────────────────
export const ONBOARDING_STEPS = [
  { label: "FRAMEWORK",            timing: "Day 1",      status: "done"    },
  { label: "FINANCIALS",           timing: "Day 1",      status: "done"    },
  { label: "FOCUS",                timing: "Weeks 1-2",  status: "active"  },
  { label: "FORMULA",              timing: "Weeks 2-4",  status: "pending" },
  { label: "H.I.V.E.",             timing: "Weeks 3-5",  status: "pending" },
  { label: "S.U.M.",               timing: "Weeks 3-5",  status: "pending" },
  { label: "VAULT + BRAND AUDIT",  timing: "Weeks 5-6",  status: "pending" },
  { label: "ANALYTICS",            timing: "Day 42+",    status: "pending" },
];


// ── 6. ALERTS ────────────────────────────────────────────────────────────────
export const ALERTS = [
  {
    id: 1, priority: "HIGH",
    title: "H.I.V.E. (Human Capital Performance System) — CULTURE signal declining",
    body: "TALENT retention dropped 8.0 points this quarter. GESTALT INTELLIGENCE recommends reviewing compensation benchmarks within 14 days.",
    timestamp: "2 hours ago", module: "HIVE", dollarsAtStake: 38000,
  },
  {
    id: 2, priority: "MEDIUM",
    title: "FRAMEWORK assessment incomplete",
    body: "Questions 14–21 unanswered. Suppressing B.A.S.E. (Brand and Strategy Engine) score below its calculated potential.",
    timestamp: "Yesterday", module: "FRAMEWORK", dollarsAtStake: 12400,
  },
  {
    id: 3, priority: "LOW",
    title: "S.U.M. (Strategic Unified Messaging) — Journal streak broken",
    body: "3-day journal streak ended. Depth score dropped 0.3 points. BRAND PULSE™ refresh overdue by 12 days.",
    timestamp: "3 days ago", module: "SUM", dollarsAtStake: 0,
  },
];


// ── 7. SCORE HISTORY (for ANALYTICS chart) ───────────────────────────────────
export const SCORE_HISTORY = [
  { date: "Oct 2025", base: 61.0, hive: 55.0, sum: 49.0, gestalt: 55.0 },
  { date: "Nov 2025", base: 63.0, hive: 57.0, sum: 51.0, gestalt: 57.0 },
  { date: "Dec 2025", base: 65.0, hive: 59.0, sum: 53.0, gestalt: 59.0 },
  { date: "Jan 2026", base: 67.0, hive: 60.0, sum: 55.0, gestalt: 60.7 },
  { date: "Feb 2026", base: 69.0, hive: 61.0, sum: 57.0, gestalt: 62.3 },
  { date: "Mar 2026", base: 71.0, hive: 63.0, sum: 58.0, gestalt: 64.0 },
];


// ── 8. EXIT EQUATION™ ────────────────────────────────────────────────────────
// FORMULA: BRAND PREMIUM = (GESTALT SCORE ÷ 100) × (CEILING − FLOOR)
//          CURRENT VALUATION = EBITDA × (FLOOR + BRAND PREMIUM)
// isVerified: false — UNVERIFIED badge ALWAYS shown. Never suppress it.
export const EXIT_EQUATION_DATA = {
  gestaltScore: 64.0,
  ebitda: 850000,
  floor: 4.0,
  ceiling: 8.0,
  baseMultiple: 4.0,
  brandPremium: 2.56,         // (64.0 ÷ 100) × (8.0 − 4.0) = 2.56
  currentValuation: 5576000,  // $850,000 × (4.0 + 2.56) = $5,576,000
  potentialValuation: 6800000,// $850,000 × (4.0 + 4.0) = $6,800,000
  valuationGap: 1224000,      // $6,800,000 − $5,576,000
  dailyDrain: 3353,           // $1,224,000 ÷ 365
  isVerified: false,          // false = UNVERIFIED flag shown — NEVER suppress
};


// ── 9. VALUATION DRAIN™ ──────────────────────────────────────────────────────
export const VALUATION_DRAIN_DATA = {
  dailyCost: 3353,
  annualCost: 1223845,
  ninetyDayCost: 301770,
};


// ── 10. MOCK DAILY TASKS ─────────────────────────────────────────────────────
export const MOCK_DAILY_TASKS = [
  { id: "t1", title: "Complete FRAMEWORK questions 14–21", bucket: "BY_NOON",     estimatedMinutes: 25, module: "FRAMEWORK", priority: "HIGH",   dollarsAtStake: 12400, done: false, dismissed: false },
  { id: "t2", title: "Review H.I.V.E. CULTURE alert",      bucket: "BY_NOON",     estimatedMinutes: 15, module: "HIVE",      priority: "HIGH",   dollarsAtStake: 38000, done: false, dismissed: false },
  { id: "t3", title: "Update VAULT brand assets",          bucket: "END_OF_DAY",  estimatedMinutes: 30, module: "SUM",       priority: "MEDIUM", dollarsAtStake:  3200, done: false, dismissed: false },
  { id: "t4", title: "Approve Q2 FORMULA strategy",        bucket: "THIS_WEEK",   estimatedMinutes: 45, module: "FORMULA",   priority: "MEDIUM", dollarsAtStake:  8500, done: false, dismissed: false },
  { id: "t5", title: "Schedule M&A advisor call",          bucket: "NEXT_17_DAYS",estimatedMinutes: 10, module: "ANALYTICS", priority: "LOW",    dollarsAtStake:     0, done: false, dismissed: false },
];


// ── 11. MOCK EMPLOYEES ───────────────────────────────────────────────────────
export const MOCK_EMPLOYEES = [
  { id: "e1", name: "Sarah Patel",     initials: "SP", role: "VP Marketing",     hivescore: 78, status: "ACTIVE",    lastActive: "5 min ago",  flightRisk: "LOW"    },
  { id: "e2", name: "Marcus Johnson",  initials: "MJ", role: "Sales Director",   hivescore: 65, status: "ACTIVE",    lastActive: "12 min ago", flightRisk: "MEDIUM" },
  { id: "e3", name: "Priya Patel",     initials: "PP", role: "Product Manager",  hivescore: 82, status: "ACTIVE",    lastActive: "Just now",   flightRisk: "LOW"    },
  { id: "e4", name: "David Kim",       initials: "DK", role: "Engineering Lead", hivescore: 58, status: "AT RISK",   lastActive: "2 hours ago",flightRisk: "HIGH"   },
];


// ── 12. MOCK TUTORIALS ───────────────────────────────────────────────────────
export const MOCK_TUTORIALS = [
  { id: "tut-1", title: "Reading your GESTALT SCORE",       duration: "2 min", completed: true,  module: "OVERVIEW"  },
  { id: "tut-2", title: "Closing FRAMEWORK gaps",           duration: "5 min", completed: true,  module: "FRAMEWORK" },
  { id: "tut-3", title: "Using GESTALT INTELLIGENCE",       duration: "3 min", completed: false, module: "AI"        },
  { id: "tut-4", title: "Sharing entries to STORY ENGINE",  duration: "4 min", completed: false, module: "SUM"       },
];


// ── 13. HELP CONTENT ─────────────────────────────────────────────────────────
export const HELP_CONTENT = {
  "command-center": {
    title: "COMMAND CENTER",
    body: "Your daily strategic dashboard. Three locked anchor widgets at top: GESTALT SCORE, EXIT SPECTRUM, VALUATION DRAIN. Everything below is draggable widgets you can rearrange. GESTALT INTELLIGENCE generates your DAILY ROUTINE every morning at 7am.",
    citations: ["GESTALT Partners. COMMAND CENTER methodology. 2026.", "Harvard Business Review. The Daily Routine of High-Performing Leaders. 2018.", "McKinsey. Science of Organizational Transformations. 2015."],
  },
  "framework": {
    title: "FRAMEWORK ASSESSMENT",
    body: "21 binary questions across the four B.A.S.E. quadrants — STRATEGY, LEADERSHIP, CULTURE, BRAND. Each Yes/No exposes a specific gap. The result is a Competitive Threat Score and a prioritized list of improvements with dollar impact.",
    citations: ["GESTALT Partners. 21-Point Assessment methodology. 2026.", "Bain & Company. Founder's Mentality. 2019.", "PwC Private Business Pulse. 2023."],
  },
  "focus": {
    title: "FOCUS DEEP DIVE",
    body: "100-point comprehensive audit across 5 pillars: PERCEPTION, CLARITY, IDENTITY, CULTURE, EXECUTION. Binary scoring (no subjective 1–5 scales). Identifies exact value gaps and the ROI of closing each one.",
    citations: ["GESTALT Partners. FOCUS methodology. 2026.", "Bain. The Elements of Value. 2016.", "McKinsey Global Institute. 2017."],
  },
  "formula": {
    title: "FORMULA",
    body: "Productized version of the Brand Interaction Strategy Guide. 23-step sequential strategy session producing a completed deliverable. FORMULA's contribution to B.A.S.E. score is a completion and alignment metric, not a quality judgment.",
    citations: ["GESTALT Partners. FORMULA methodology. 2026.", "GESTALT Partners. Brand Interaction Strategy Guide. 2017.", "Harvard Business Review. The Discipline of Brand Strategy. 2020."],
  },
  "hive-performance": {
    title: "H.I.V.E. PERFORMANCE",
    body: "H.I.V.E. (Human Capital Performance System) measures human capital across four equal quadrants: PERSONAL, CUSTOMER, STAFF, KNOWLEDGE — each weighted 25/25/25/25 (locked). Each employee has a score in each quadrant. AI captures evidence; HR renders the final verdicts quarterly.",
    citations: ["GESTALT Partners. H.I.V.E. methodology. 2026.", "Gallup. State of the American Workplace. 2023.", "MIT Sloan. The Toxic Culture Crisis. 2022."],
  },
  "sum-messaging": {
    title: "S.U.M. MESSAGING",
    body: "Seven contexts unified under one MESSAGING surface: CHANNELS for team conversation, DAILY SLIDESHOW for AI-curated briefings, PERSONAL JOURNAL for private structured entries, STORY ENGINE for shared peer-voted ideas, POLLS for org check-ins, METRICS for S.U.M. health, NOTES for quick captures. GESTALT INTELLIGENCE narrates as you navigate.",
    citations: ["GESTALT Partners. S.U.M. specification. 2026.", "Harvard Business Review. The Hidden Cost of Silent Knowledge. 2021.", "MIT Sloan. The State of Organizational Communication. 2023."],
  },
  "vault": {
    title: "VAULT",
    body: "Centralized brand assets and institutional knowledge. When a buyer asks for documentation in due diligence, VAULT delivers it. Storage: 5GB (Founding), 10GB (Regular Standard), 25GB (Agency/White Label). Saved AI conversations land here when the user chooses VAULT in the GESTALT INTELLIGENCE save flow.",
    citations: ["PwC M&A Due Diligence. 2023.", "KPMG Deal Advisory. 2021.", "GESTALT Partners. VAULT specification. 2026."],
  },
  "personal-timeline": {
    title: "PERSONAL TIMELINE",
    body: "Your private chronological log of saved AI conversations, significant journal entries, C.O.R.E. contributions, and earned milestones. The Personal Timeline is your personal property — exportable, deletable, and portable across employers (with company-confidential context redacted on departure).",
    citations: ["GESTALT Partners. Personal Timeline privacy commitments. 2026.", "Harvard Business Review. The Future of Work. 2023.", "MIT Sloan. Knowledge Worker Mobility. 2022."],
  },
  "research": {
    title: "RESEARCH ENGINE",
    body: "Ask GESTALT INTELLIGENCE anything about your business. Every answer includes minimum 3 citations, a confidence score (0–100%), and a dollar impact on your exit valuation.",
    citations: ["McKinsey Global Institute. 2017.", "Harvard Business Review. 2022.", "GESTALT Partners. RESEARCH methodology. 2026."],
  },
  "analytics": {
    title: "ANALYTICS",
    body: "Every data point converts into exit valuation. EXIT EQUATION™ calculates current and potential valuation. VALUATION DRAIN™ shows the dollar cost of your score gap per day.",
    citations: ["McKinsey Global Institute. 2017.", "Deloitte M&A Due Diligence. 2023.", "KPMG. The Art and Science of the Deal. 2021."],
  },
  "certified": {
    title: "GESTALT CERTIFIED™",
    body: "The live badge updates in real time as your score moves. Requires FRAMEWORK score ≥ 16, verified financials, 50+ RESEARCH deposits, and 12+ months of active subscription.",
    citations: ["GESTALT Partners. CERTIFIED badge outcome data. 2026.", "PwC M&A Integration Survey. 2022.", "BDO USA. Private Company Perspectives. 2023."],
  },
  "widget-gestalt-score": {
    title: "YOUR GESTALT SCORE™",
    body: "Composite of B.A.S.E. (Brand and Strategy Engine), H.I.V.E. (Human Capital Performance System), and S.U.M. (Strategic Unified Messaging). Every 10-point increase corresponds to a measurable increase in your exit multiple.",
    citations: ["McKinsey Global Institute. 2017.", "Interbrand Best Global Brands Report. 2023.", "GESTALT Partners. EXIT EQUATION™ methodology. 2026."],
  },
  "widget-exit-spectrum": {
    title: "EXIT SPECTRUM™ POSITION",
    body: "Six-tier readiness continuum. MARKET VULNERABLE means foundational strength exists but meaningful gaps remain before a buyer pays a premium multiple. Tiers: LIQUIDATION | EXIT UNLIKELY | DISRUPTION IMMINENT | MARKET VULNERABLE | EXIT POSSIBLE | EXIT READY.",
    citations: ["GESTALT Partners. EXIT SPECTRUM™ tier definitions. 2026.", "Deloitte M&A Due Diligence. 2023.", "PwC Private Business Pulse. 2023."],
  },
  "widget-valuation-drain": {
    title: "VALUATION DRAIN™",
    body: "(Potential Valuation minus Current Valuation) divided by 365. At $3,353 per day, doing nothing for 90 days costs $301,770. This is not a projection — it is what complacency costs right now.",
    citations: ["GESTALT Partners. VALUATION DRAIN™ formula. 2026.", "McKinsey Global Institute. 2019.", "Bain. The Elements of Value. 2016."],
  },
  "widget-daily-routine": {
    title: "DAILY ROUTINE",
    body: "GESTALT INTELLIGENCE generates your priority list every morning at 7am based on score gaps, open tasks, and active alerts. Every task ranked by dollar impact on your exit valuation.",
    citations: ["Harvard Business Review. The Daily Routine of High-Performing Leaders. 2018.", "McKinsey. Science of Organizational Transformations. 2015.", "GESTALT Partners. Daily Routine methodology. 2026."],
  },
};


// ── 14. MOCK COUPONS (HQ tools) ───────────────────────────────────────────────
export const MOCK_COUPONS = [
  { id: "c1", code: "FOUNDING50", type: "PERCENTAGE", value: 50,  appliesTo: ["Founding Standard"],                        uses: 23,  maxUses: 50,   expiry: "May 19, 2026", status: "ACTIVE"  },
  { id: "c2", code: "AGENCY25",   type: "PERCENTAGE", value: 25,  appliesTo: ["All subscriptions"],                        uses: 8,   maxUses: null, expiry: null,           status: "ACTIVE"  },
  { id: "c3", code: "LAUNCH100",  type: "FIXED",      value: 100, appliesTo: ["Regular Standard", "Regular White Label"], uses: 100, maxUses: 100,  expiry: "Apr 1, 2026",  status: "EXPIRED" },
  { id: "c4", code: "PARTNER15",  type: "PERCENTAGE", value: 15,  appliesTo: ["All subscriptions"],                        uses: 3,   maxUses: 25,   expiry: null,           status: "PAUSED"  },
  { id: "c5", code: "WHARTON30",  type: "PERCENTAGE", value: 30,  appliesTo: ["Founding Standard", "Founding White Label"],uses: 2,   maxUses: 10,   expiry: "Jun 1, 2026",  status: "ACTIVE"  },
];


// ── 15. MOCK REFUNDS (HQ tools) ───────────────────────────────────────────────
export const MOCK_REFUNDS = [
  { id: "r1", company: "River Creek Dental", invoice: "Feb 2026", amount: 797.00, type: "FULL",    reason: "Billing error",                       status: "PROCESSED", processedBy: "Jeffery Ess", processedDate: "Mar 3, 2026"  },
  { id: "r2", company: "Lakeside Staffing",  invoice: "Mar 2026", amount: 398.50, type: "PARTIAL", reason: "Service issue — prorated refund",     status: "PENDING",   processedBy: null,          processedDate: null           },
  { id: "r3", company: "Summit Logistics",   invoice: "Jan 2026", amount: 797.00, type: "FULL",    reason: "Customer request — plan cancellation",status: "PROCESSED", processedBy: "Jeffery Ess", processedDate: "Feb 10, 2026" },
];


// ── 16. MOCK PRICE OVERRIDES (HQ pricing) ────────────────────────────────────
export const MOCK_PRICE_OVERRIDES = [
  { id: "o1", company: "Northgate Solutions", standardPrice: 797, overridePrice: 697, reason: "Early adopter negotiated rate", effectiveDate: "Jan 1, 2026",  setBy: "Jeffery Ess" },
  { id: "o2", company: "Apex Manufacturing",  standardPrice: 797, overridePrice: 750, reason: "Agency referral deal",          effectiveDate: "Feb 15, 2026", setBy: "Jeffery Ess" },
];


// ── 17. MOCK AGENCY REFERRALS ────────────────────────────────────────────────
export const MOCK_AGENCY_REFERRALS = [
  { id: "a1", agency: "Meridian Creative Group",  tier: "PARTNER PRO",   code: "MERIDIAN25",  clientDiscount: 20, cashShare90: 15, cashShare12mo: 17.5, activeReferrals: 4, pendingPayout: 1240, status: "ACTIVE"             },
  { id: "a2", agency: "Summit Strategy Partners", tier: "PARTNER",       code: "SUMMIT15",    clientDiscount: 15, cashShare90: 10, cashShare12mo: 12.5, activeReferrals: 2, pendingPayout: 0,    status: "PENDING ACTIVATION" },
  { id: "a3", agency: "Blueprint Advisors",       tier: "PARTNER ELITE", code: "BLUEPRINT20", clientDiscount: 25, cashShare90: 20, cashShare12mo: 22.5, activeReferrals: 8, pendingPayout: 3680, status: "ACTIVE"             },
];


// ── 18. MOCK INFLUENCERS ─────────────────────────────────────────────────────
export const MOCK_INFLUENCERS = [
  { id: "i1", name: "Jordan Lee",     code: "JORDANGESTALT", payoutType: "PERCENTAGE", payoutValue: 8,  activeReferrals: 3, pendingPayout: 191, approvalStatus: "APPROVED"         },
  { id: "i2", name: "Casey Thompson", code: "CASEYEXIT",     payoutType: "FLAT",       payoutValue: 50, activeReferrals: 1, pendingPayout: 0,   approvalStatus: "PENDING APPROVAL" },
];


// ── 19. MOCK STRIPE CONNECTED (Invoicing module) ─────────────────────────────
export const MOCK_STRIPE_CONNECTED = true;


// ── 20. MOCK ESTIMATES (Invoicing module) ────────────────────────────────────
export const MOCK_ESTIMATES = [
  {
    id: "est-001", client: "Lakeside Staffing", project: "Brand Refresh Package", total: 12500, status: "DRAFT",  created: "Mar 15, 2026",
    lineItems: [
      { desc: "Brand strategy session (8 hrs)", qty: 1, rate: 2500, amount: 2500 },
      { desc: "Visual identity development",    qty: 1, rate: 7500, amount: 7500 },
      { desc: "Brand guidelines document",      qty: 1, rate: 2500, amount: 2500 },
    ],
  },
  {
    id: "est-002", client: "Metro Plumbing Co", project: "Website Redesign", total: 8750, status: "SIGNED", created: "Mar 20, 2026",
    lineItems: [
      { desc: "UX/UI design",          qty: 1, rate: 5000, amount: 5000 },
      { desc: "Copywriting (5 pages)", qty: 5, rate: 500,  amount: 2500 },
      { desc: "SEO setup",             qty: 1, rate: 1250, amount: 1250 },
    ],
  },
];


// ── 21. MOCK INVOICES (Invoicing module) ─────────────────────────────────────
export const MOCK_INVOICES = [
  { id: "inv-001", client: "Lakeside Staffing",   project: "Brand Refresh Package", total: 12500, status: "SENT",    due: "Apr 15, 2026", created: "Apr 1, 2026",  paidDate: null            },
  { id: "inv-002", client: "Summit Logistics",    project: "Q1 Consulting",          total: 4500,  status: "PAID",    due: "Mar 30, 2026", created: "Mar 1, 2026",  paidDate: "Mar 28, 2026"  },
  { id: "inv-003", client: "Horizon Real Estate", project: "FORMULA Implementation", total: 6000,  status: "OVERDUE", due: "Mar 15, 2026", created: "Feb 15, 2026", paidDate: null            },
];


// ── 22. DEFAULT WIDGET LAYOUTS (per role/segment) ────────────────────────────
export const DEFAULT_WIDGET_LAYOUTS = {
  BO: [
    { id: "daily-routine",      type: "daily-routine",      size: "medium", helpId: "widget-daily-routine" },
    { id: "exit-equation",      type: "exit-equation",      size: "medium", helpId: "analytics"            },
    { id: "hive-flight-risk",   type: "hive-flight-risk",   size: "small",  helpId: "hive-performance"     },
    { id: "certified-progress", type: "certified-progress", size: "small",  helpId: "certified"            },
    { id: "focus-blindspots",   type: "focus-blindspots",   size: "medium", helpId: "focus"                },
    { id: "formula-progress",   type: "formula-progress",   size: "small",  helpId: "formula"              },
  ],
  BB: [
    { id: "daily-routine",   type: "daily-routine",   size: "medium", helpId: "widget-daily-routine" },
    { id: "focus-blindspots",type: "focus-blindspots",size: "medium", helpId: "focus"                },
    { id: "exit-equation",   type: "exit-equation",   size: "full",   helpId: "analytics"            },
  ],
  IA: [
    { id: "exit-equation",      type: "exit-equation",      size: "large",  helpId: "analytics"        },
    { id: "hive-flight-risk",   type: "hive-flight-risk",   size: "medium", helpId: "hive-performance" },
    { id: "certified-progress", type: "certified-progress", size: "small",  helpId: "certified"        },
  ],
  AC: [
    { id: "daily-routine",   type: "daily-routine",   size: "medium", helpId: "widget-daily-routine" },
    { id: "hive-flight-risk",type: "hive-flight-risk",size: "medium", helpId: "hive-performance"     },
    { id: "focus-blindspots",type: "focus-blindspots",size: "medium", helpId: "focus"                },
  ],
  EMPLOYEE: [
    { id: "daily-routine",  type: "daily-routine",  size: "medium", helpId: "widget-daily-routine" },
    { id: "core-confidence",type: "core-confidence",size: "small",  helpId: "hive-performance"     },
    { id: "story-engine",   type: "story-engine",   size: "small",  helpId: "sum-messaging"        },
    { id: "formula-status", type: "formula-status", size: "small",  helpId: "formula"              },
  ],
  SOLOPRENEUR: [
    { id: "daily-routine",     type: "daily-routine",     size: "medium", helpId: "widget-daily-routine" },
    { id: "exit-equation",     type: "exit-equation",     size: "medium", helpId: "analytics"            },
    { id: "focus-blindspots",  type: "focus-blindspots",  size: "medium", helpId: "focus"                },
    { id: "valuation-history", type: "valuation-history", size: "medium", helpId: "analytics"            },
  ],
};


// ═══════════════════════════════════════════════════════════════════════════
// ─────────────  S.U.M. v15 EXPORTS — NEW IN v2 (23-42)  ──────────────────
// All exports below are scoped to the S.U.M. module + GESTALT INTELLIGENCE.
// ═══════════════════════════════════════════════════════════════════════════


// ── 23. NOTE_COLORS (also exported from themes.js — re-exported here for module convenience)
// `color` = dark mode body text + border at 100%
// `colorDark` = light mode body text — darker variant for WCAG AA on tinted bg
export const NOTE_COLORS = [
  { id: "yellow", color: "#e2b53f", colorDark: "#7a5d12", label: "Yellow" },
  { id: "green",  color: "#5fcc00", colorDark: "#2a6900", label: "Green"  },
  { id: "blue",   color: "#3b82f6", colorDark: "#1e3f80", label: "Blue"   },
  { id: "red",    color: "#ef4444", colorDark: "#8a1f1f", label: "Red"    },
  { id: "purple", color: "#a855f7", colorDark: "#5b1d8a", label: "Purple" },
  { id: "gray",   color: "#777777", colorDark: "#3a3a3a", label: "Gray"   },
];


// ── 24. NOTES (sticky-card wall data — separate from JOURNAL_ENTRIES) ────────
export const NOTES = [
  { id: "n1", date: "Mar 3, 2026",  title: "Call Brad TODAY",          color: "red",    folderId: "f2",  favorite: false, text: "Brad needs a callback re: pricing tier discussion before EOD.", reminders: [{id: "nr1", label: "Call Brad", at: "Mar 4, 2026 12:00 PM", fired: false}] },
  { id: "n2", date: "Feb 28, 2026", title: "Q2 offsite venue ideas",   color: "yellow", folderId: "f1",  favorite: false, text: "Looked into 3 venues. Lakehouse needs 60-day notice. Ridge has weekend availability. Downtown loft is cheapest but parking is rough.", reminders: [] },
  { id: "n3", date: "Feb 27, 2026", title: "Renew SSL cert",           color: "blue",   folderId: null,  favorite: false, text: "Renew the SSL cert for the marketing subdomain. Expires April 12.", reminders: [{id: "nr3", label: "Renew SSL cert", at: "Apr 5, 2026 10:00 AM", fired: false}] },
  { id: "n4", date: "Feb 26, 2026", title: "Sarah's birthday",         color: "purple", folderId: null,  favorite: true,  text: "March 14. She likes that bookstore on Main. Get a card.", reminders: [] },
  { id: "n5", date: "Feb 25, 2026", title: "Onboarding feedback",      color: "green",  folderId: "f4",  favorite: false, text: "New hire mentioned the H.I.V.E. interview pacing felt rushed in week 2. Worth checking the question density.", reminders: [] },
  { id: "n6", date: "Feb 24, 2026", title: "Codat invoice",            color: "yellow", folderId: null,  favorite: false, text: "Q1 invoice came in higher than projected. Check usage tier.", reminders: [] },
  { id: "n7", date: "Feb 22, 2026", title: "Marketing meeting moved",  color: "gray",   folderId: null,  favorite: false, text: "Pushed from Tuesday 10am to Thursday 2pm. Confirm with team.", reminders: [] },
  { id: "n8", date: "Feb 21, 2026", title: "Investor follow-up",       color: "red",    folderId: "f2",  favorite: false, text: "David from Greenway asked about Q2 projections — send the deck before Friday.", reminders: [{id: "nr8", label: "Send Greenway deck", at: "Mar 7, 2026 9:00 AM", fired: false}] },
];


// ── 25. JOURNAL_ENTRIES (structured personal journal — separate from NOTES) ──
export const JOURNAL_ENTRIES = [
  {
    id: 1, date: "Mar 5, 2026",
    types: ["IDEA"], tags: ["pricing", "Q2-launch"],
    favorite: true, color: "yellow", folderId: "f1",
    title: "Tiered pricing experiment for SMB segment",
    text: "What if we tested a 'try before you buy' tier — 14 days free, full feature access, no card required? The conversion rate from current 2-week trial is 18%, but we lose 40% in the first 3 days because they need to enter a card up front. Removing that friction might lift sign-up volume 2-3x.",
    desire: null,
    sharedToStoryEngine: false,
    reminders: [],
  },
  {
    id: 2, date: "Mar 2, 2026",
    types: ["FEAR/FRICTION"], tags: ["pricing", "customer-friction"],
    favorite: false, color: "red", folderId: "f2",
    title: "Pricing page confusion",
    text: "Three customers this week asked the same thing about tier 2 vs tier 3. They can't see what they get extra at tier 3 from the pricing page — they have to book a call. That's a leak.",
    desire: null,
    sharedToStoryEngine: false,
    reminders: [{id: "r2", label: "Review pricing page", at: "Mar 8, 2026 9:00 AM", fired: false}],
  },
  {
    id: 3, date: "Feb 25, 2026",
    types: ["D.E.S.I.R.E."], tags: ["onboarding", "customer-experience"],
    favorite: true, color: "gold", folderId: "f3",
    title: "Onboarding moment that surprised the customer",
    text: "Brad called and said the welcome video was the moment he knew he made the right choice. He didn't expect it to be that personal.",
    desire: {
      Delight:    "Brad expected a generic welcome flow — he got a personalized welcome video that referenced his specific industry and use case.",
      Experience: "The first 60 seconds felt like a 1:1 message rather than a marketing piece. Set the tone for everything that followed.",
      Surprise:   "He wasn't expecting depth this early. Most platforms front-load with feature tours — we front-loaded with him.",
      Inspire:    "He told two other founders about it within a week. The personalization made him want to share.",
      Resonate:   "",
      Evangelize: "",
    },
    sharedToStoryEngine: true,
    reminders: [],
  },
];


// ── 26. FOLDERS (span both JOURNAL_ENTRIES and NOTES) ────────────────────────
export const FOLDERS = [
  { id: "f1", name: "Q2 Initiatives",      aiSuggested: false },
  { id: "f2", name: "Pricing Workstream",  aiSuggested: false },
  { id: "f3", name: "Customer Stories",    aiSuggested: false },
  { id: "f4", name: "Culture & H.I.V.E.",  aiSuggested: true  },
];


// ── 27. ENTRY_TYPES (3 types — DELIGHT removed, FEAR folded, SOLVE renamed)
export const ENTRY_TYPES = [
  { id: "IDEA",          color: "var(--gold)", desc: "Proactive idea to share"     },
  { id: "FEAR/FRICTION", color: "var(--red)",  desc: "Problem or obstacle observed"},
  { id: "D.E.S.I.R.E.",  color: "var(--gold)", desc: "Structured resolution"       },
];


// ── 28. DESIRE_FIELDS (six chained pillars, in order) ────────────────────────
export const DESIRE_FIELDS = ["Delight", "Experience", "Surprise", "Inspire", "Resonate", "Evangelize"];


// ── 29. DESIRE_HINTS (chained prompts — each builds on the previous) ─────────
export const DESIRE_HINTS = {
  Delight:    "What pleasant moment did this create? What did the customer / user / teammate not expect?",
  Experience: "How did the DELIGHT shape the experience that followed it? What changed in their moment?",
  Surprise:   "Where did the EXPERIENCE go beyond expectation? What was the surprise inside it?",
  Inspire:    "How does the SURPRISE inspire action? What does it make the person want to do next?",
  Resonate:   "Why does the INSPIRATION stick? What about it lasts beyond the moment?",
  Evangelize: "How does the RESONANCE turn into evangelism? Why would they tell someone about this?",
};


// ── 30. INTERVIEW_QUESTIONS (pending C.O.R.E. questions for the user) ────────
export const INTERVIEW_QUESTIONS = [
  { id: "iq1", priority: "HIGH",   topic: "Pricing strategy",          question: "Walk me through how you decide pricing tier breakpoints. What signals matter most?", driver: "job-description", followUpsAllowed: 5 },
  { id: "iq2", priority: "MEDIUM", topic: "Customer escalation",       question: "When a customer escalates to leadership, what's the unwritten rule about who handles it?", driver: "gap-analysis",     followUpsAllowed: 5 },
  { id: "iq3", priority: "MEDIUM", topic: "Onboarding handoff",        question: "How does context transfer from sales to onboarding? Any handoff that's failed in the last quarter?", driver: "gap-analysis", followUpsAllowed: 5 },
  { id: "iq4", priority: "LOW",    topic: "Vendor management",         question: "Who decides which vendors get renewed? Is there a written process or is it tribal knowledge?", driver: "gap-analysis", followUpsAllowed: 5 },
];


// ── 31. CONTRIBUTIONS_LOG (logged participation — NOT score) ─────────────────
// Per memory #29: H.I.V.E. score is HUMAN-CURATED by HR. AI captures evidence.
// UI copy must say "PARTICIPATION LOGGED" never "H.I.V.E. CREDIT" or "SCORE +X."
export const CONTRIBUTIONS_LOG = [
  { id: "cl1", date: "Mar 3, 2026", type: "core-answer",   topic: "Pricing strategy",   summary: "Substantive answer + 3 follow-ups. Quality scored relative to question depth." },
  { id: "cl2", date: "Mar 2, 2026", type: "helping",       topic: "#marketing-questions", summary: "Replied to teammate's question. AI inferred the reply solved their problem." },
  { id: "cl3", date: "Mar 1, 2026", type: "note",          topic: "Onboarding feedback", summary: "Substantive note flagged a real issue with H.I.V.E. interview pacing." },
  { id: "cl4", date: "Feb 28, 2026", type: "journal-entry",topic: "Q2 offsite",          summary: "FEAR/FRICTION entry shared to STORY ENGINE." },
];


// ── 32. WEEKLY_STATUS (quality-weighted weekly target) ───────────────────────
// 3 substantive answers OR 5 substantive notes OR equivalent helping detection.
export const WEEKLY_STATUS = {
  weekOf: "Mar 1, 2026",
  target: { answers: 3, notes: 5, helping: 5 },
  current: { answers: 1, notes: 4, helping: 2 },
  status: "yellow",  // green | yellow | red
  message: "On pace — one more substantive answer or note this week pushes you to green.",
};


// ── 33. STORY_POSTS (STORY ENGINE shared content) ────────────────────────────
export const STORY_POSTS = [
  {
    id: 1, title: "Structured Referral Program", author: "Priya Patel", dept: "Product", avatar: "PP",
    days: 3, votes: 23, status: "voting", brandFlag: null,
    types: ["IDEA"], tags: ["referral", "Q2-launch"],
    text: "What if we built a structured referral program with tracked rewards rather than ad-hoc thank-yous?",
    riffs: [
      { id: "rf1", author: "Marcus Johnson", text: "I like this. We'd need a clear reward tier — flat fee or percentage of first-year revenue?", days: 2 },
      { id: "rf2", author: "Sarah Patel",    text: "Percentage. Flat fees attract noise; percentage attracts intent.", days: 2 },
    ],
  },
  {
    id: 2, title: "Anonymous Founder Q&A", author: "Anonymous", dept: null, avatar: null,
    days: 5, votes: 41, status: "voting", brandFlag: null,
    types: ["IDEA"], tags: ["culture", "trust"],
    text: "Quarterly anonymous Q&A where employees submit any question to the founder, founder responds publicly. Builds trust without putting people on the spot live.",
    riffs: [],
  },
];


// ── 34. SUM_KPIS (8 metrics for METRICS tab) ─────────────────────────────────
export const SUM_KPIS = [
  { id: "sum-score",       label: "S.U.M. SCORE",     suffix: "/100",    goodHigh: true,  source: "computed",                  description: "Composite of all S.U.M. signals — participation, depth, helping, idea flow." },
  { id: "participation",   label: "PARTICIPATION",    suffix: "%",       goodHigh: true,  source: "channels + polls",          description: "Percentage of team actively engaged this period." },
  { id: "idea-flow",       label: "IDEA FLOW",        suffix: "/week",   goodHigh: true,  source: "journal + stories",         description: "Number of substantive ideas surfaced from journal + STORY ENGINE per week." },
  { id: "helping-signal",  label: "HELPING SIGNAL",   suffix: "/week",   goodHigh: true,  source: "AI helping detection",      description: "AI-detected helping moments in channels — answering questions, unblocking teammates." },
  { id: "response-latency",label: "RESPONSE LATENCY", suffix: "hr avg",  goodHigh: false, source: "channels",                  description: "Average hours from question asked to substantive response." },
  { id: "journal-depth",   label: "JOURNAL DEPTH",    suffix: "/10",     goodHigh: true,  source: "journal AI scoring",        description: "AI-scored substantive depth of journal entries on a 0-10 scale." },
  { id: "core-contrib",    label: "C.O.R.E. CONTRIB", suffix: "/week",   goodHigh: true,  source: "interview answers",         description: "C.O.R.E. interview answers contributed per week, weighted by quality." },
  { id: "silo-index",      label: "SILO INDEX",       suffix: "%",       goodHigh: false, source: "channel cross-flow",        description: "Percentage of teams that don't communicate cross-functionally. Lower is better." },
];


// ── 35. SLIDESHOW (Daily Slideshow cards — cinematic 2.495:1 ratio) ──────────
export const SLIDESHOW = [
  { id: 1, type: "valuation-drain", headline: "$3,353/day",                              subhead: "Today's VALUATION DRAIN — that's $301,770 over the next 90 days at the current pace.",       cta: "OPEN ANALYTICS",   ctaTarget: "analytics",   bgGradient: "linear-gradient(135deg, #4f0200 0%, #6e231f 100%)" },
  { id: 2, type: "win",             headline: "Sarah closed Lakeside",                   subhead: "$12,500 brand refresh signed yesterday. The pitch deck quote: 'You actually understood us.'", cta: "READ THE STORY",   ctaTarget: "stories",     bgGradient: "linear-gradient(135deg, #2a6900 0%, #5fcc00 100%)" },
  { id: 3, type: "milestone",       headline: "FRAMEWORK halfway",                       subhead: "Questions 1-13 complete. The next 8 unlock 4 more points on B.A.S.E.",                       cta: "CONTINUE ASSESSMENT", ctaTarget: "framework", bgGradient: "linear-gradient(135deg, #7a5d12 0%, #e2b53f 100%)" },
  { id: 4, type: "alert",           headline: "H.I.V.E. CULTURE signal",                 subhead: "TALENT retention down 8 points this quarter. Worth a conversation with leadership.",           cta: "REVIEW H.I.V.E.",  ctaTarget: "hive",        bgGradient: "linear-gradient(135deg, #5d1414 0%, #8b2020 100%)" },
];


// ── 36. CHANNELS (CHANNELS tab data) ─────────────────────────────────────────
export const CHANNELS_DATA = [
  { name: "general",             unread: 3, pinned: true,  private: false, helpingMagnet: false },
  { name: "marketing-questions", unread: 0, pinned: false, private: false, helpingMagnet: true  },
  { name: "leadership-only",     unread: 1, pinned: false, private: true,  helpingMagnet: false },
  { name: "pricing-workstream",  unread: 0, pinned: false, private: false, helpingMagnet: false },
  { name: "engineering",         unread: 5, pinned: false, private: false, helpingMagnet: true  },
];


// ── 37. REWARD_MESSAGES (gamified C.O.R.E. answer rewards — β voice + γ wry observer)
// In production GESTALT INTELLIGENCE generates fresh per answer. Mockup cycles.
export const REWARD_MESSAGES = [
  "Nice one. That's the kind of detail no onboarding doc would've caught.",
  "C.O.R.E. just got smarter. Future-you will thank you.",
  "Got it. Someone's going to save two hours of digging because of this.",
  "Solid answer. The PRICING domain has its first real entry now.",
  "On a roll — third one this week. The org is learning faster.",
  "That's a good one. The wry observer in me appreciates the directness.",
  "Worth saying. C.O.R.E. just gained an opinion it didn't have before.",
];


// ── 38. GI_NARRATIONS (per-tab narrations for site-wide GESTALT INTELLIGENCE)
// First/second visit: full intro. Third visit and beyond: compressed acknowledgment.
export const GI_NARRATIONS = {
  chat: {
    full: "This is **CHANNELS** — your team's day-to-day messaging. Threaded conversations, polls, channel privacy. I track patterns here: who's helping whom, where knowledge is flowing, where silos are forming.",
    short: "Back in CHANNELS.",
  },
  slideshow: {
    full: "**DAILY SLIDESHOW** — your morning briefing. AI-curated highlights from across the org. 78% of your team viewed today's slides. The VALUATION DRAIN slide today is worth a look.",
    short: "Back to the SLIDESHOW.",
  },
  journal: {
    full: "**PERSONAL JOURNAL** — private to you. IDEA, FEAR/FRICTION, D.E.S.I.R.E. entries. None of this gets shared with management without your explicit confirmation. This is your thinking space.",
    short: "Back in your JOURNAL.",
  },
  stories: {
    full: "**STORY ENGINE** — where private journal entries become company stories. Anyone can RIFF on what someone shares. A D.E.S.I.R.E. that fills all six pillars and gets upvoted earns the LOVED badge.",
    short: "STORY ENGINE again.",
  },
  polls: {
    full: "**POLLS** — quick org-wide check-ins. Today's poll on culture alignment is at 47% participation — below the threshold where the data becomes reliable. Want me to talk through why participation matters more than the result?",
    short: "POLLS.",
  },
  metrics: {
    full: "**METRICS** — your S.U.M. health dashboard. Three KPIs: S.U.M. score, participation, idea flow. Time-range and YoY toggles up top. The Pricing-vs-Marketing silo alert is the most actionable thing on this screen.",
    short: "Looking at METRICS.",
  },
  notes: {
    full: "**NOTES** — your wall of quick captures. Color-code, sort, drag into folders. Lighter than journal entries — for thoughts you don't want to structure yet. I noticed three of your notes mention pricing — want me to surface the connections?",
    short: "Back in NOTES.",
  },
};


// ── 39. GI_SEED_MESSAGES (opening welcome + nudge for new sessions) ──────────
export const GI_SEED_MESSAGES = [
  {
    id: "gi-welcome",
    type: "narration",
    role: "ai",
    text: "Welcome back, Jeffery. I'm **GESTALT INTELLIGENCE** — your strategist on this platform. I see what you see, I track what's changing, and I'll surface what matters when it matters. Ask me anything from anywhere.",
    timestamp: "Just now",
  },
  {
    id: "gi-nudge-1",
    type: "nudge",
    role: "ai",
    text: "Quick nudge before you dive in: **FRAMEWORK Q9** (pricing transparency) is still unanswered. It's the single biggest drag on your B.A.S.E. score right now — about $847K of valuation gap.",
    links: [
      { label: "FRAMEWORK Q9", target: "framework-q9" },
      { label: "B.A.S.E. score", target: "base" },
    ],
    timestamp: "Just now",
  },
];


// ── 40. GI_SUGGESTIONS (input field suggestion chips when conversation is fresh)
export const GI_SUGGESTIONS = [
  "Show me this week's wins",
  "What should I focus on?",
  "Walk me through my B.A.S.E. score",
  "Where's my biggest valuation gap?",
];


// ── 41. GI_DEMO_RESPONSES (hardcoded responses for mockup — replace with API in prod)
export const GI_DEMO_RESPONSES = {
  "Show me this week's wins": {
    text: "Three things lit up this week: (1) **Codat invoice** got resolved — your usage tier is correct, no overage. (2) **Sarah's onboarding feedback** flagged a real issue with H.I.V.E. interview pacing in week 2 — worth a look. (3) Your team helped each other in #marketing-questions five times this week — quietly, without being asked. That's the participation pattern that drives the highest GESTALT scores.",
    links: [
      { label: "Codat invoice", target: "note:n6" },
      { label: "Sarah's onboarding feedback", target: "note:n5" },
    ],
  },
  "What should I focus on?": {
    text: "If I had to pick one: **answer FRAMEWORK Q9.** Three reasons. First, it's the highest-leverage unanswered question in your assessment — every other score depends on it. Second, the friction it surfaces is already showing up in your customer conversations (your journal entry from Mar 2 noticed exactly this). Third, you've been around it three times this week without resolving. Want me to walk through it with you now?",
    links: [
      { label: "FRAMEWORK Q9", target: "framework-q9" },
      { label: "your journal entry from Mar 2", target: "journal:2" },
    ],
  },
  "Walk me through my B.A.S.E. score": {
    text: "Your B.A.S.E. score is **71/100**. Breakdown: FRAMEWORK 14/21 (10% weight), FOCUS 71/100 (50% weight), FORMULA 68/100 (20% weight), FINANCIALS 84/100 (20% weight). The score is held back by FOCUS — specifically the PERCEPTION pillar at 14/20. Can I be frank? You've been improving FORMULA when the leverage is in FOCUS. Want me to explain why that's happening?",
    links: [
      { label: "FOCUS", target: "focus" },
      { label: "PERCEPTION pillar", target: "focus-perception" },
      { label: "FORMULA", target: "formula" },
    ],
    frankMode: true,
  },
  "Where's my biggest valuation gap?": {
    text: "**$847K**, sourced from FRAMEWORK Q9 + the FOCUS PERCEPTION pillar. Both point at the same root cause: customers can't easily understand your pricing before the first call. This shows up in your Mar 2 journal entry, your Pricing Workstream notes, and the silo alert between Pricing and Marketing in METRICS. Three signals, same root. That's worth taking seriously.",
    links: [
      { label: "FRAMEWORK Q9", target: "framework-q9" },
      { label: "Pricing Workstream notes", target: "folder:f2" },
      { label: "silo alert", target: "metrics-silo" },
    ],
  },
};


// ── 42. GI_FRANK_PROMPT (frank-mode permission text) ─────────────────────────
export const GI_FRANK_PROMPT = "I notice this is a moment where directness might help more than diplomacy. **Can I be frank?**";


// ═══════════════════════════════════════════════════════════════════════════
// END OF FILE — 42 EXPORTS TOTAL (22 from v1 + 20 new for S.U.M. v15)
// ═══════════════════════════════════════════════════════════════════════════
