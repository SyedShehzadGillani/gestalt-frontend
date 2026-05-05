// ═══════════════════════════════════════════════════════════════════════════
// GESTALT MOCK DATA — CANONICAL VERSION
// Version: FINAL — April 2026
// Single source of truth for ALL mock values across all 54 build steps.
// NEVER hardcode values in components. Import from here.
// Replace with live Supabase calls during developer sprint (Steps 34–39).
//
// ALL 22 EXPORTS — in order:
//  1.  CURRENT_USER
//  2.  COMPANY_SCORES
//  3.  QUADRANT_SCORES
//  4.  SEGMENT_SCORES
//  5.  ONBOARDING_STEPS
//  6.  ALERTS
//  7.  SCORE_HISTORY
//  8.  EXIT_EQUATION_DATA
//  9.  VALUATION_DRAIN_DATA
//  10. MOCK_DAILY_TASKS
//  11. MOCK_EMPLOYEES
//  12. MOCK_TUTORIALS
//  13. HELP_CONTENT
//  14. MOCK_COUPONS          ← HQ steps
//  15. MOCK_REFUNDS          ← HQ steps
//  16. MOCK_PRICE_OVERRIDES  ← HQ steps
//  17. MOCK_AGENCY_REFERRALS ← Referral steps
//  18. MOCK_INFLUENCERS      ← Referral steps
//  19. MOCK_STRIPE_CONNECTED ← Invoicing step
//  20. MOCK_ESTIMATES        ← Invoicing step
//  21. MOCK_INVOICES         ← Invoicing step
//  22. DEFAULT_WIDGET_LAYOUTS
//
// LOCKED RULES — NEVER CHANGE:
//  - GESTALT SCORE = (71.0 + 63.0 + 58.0) / 3 = 64.0 — locked forever
//  - All scores display as toFixed(1) — "64.0" never "64"
//  - "GESTALT INTELLIGENCE" everywhere — never "GESTALT AI"
//  - H.I.V.E. = "Human Insight Valuation Engine" — never "Human Capital Performance System"
//  - EXIT EQUATION™ and VALUATION DRAIN™ — these names, no others
//  - isVerified: false — UNVERIFIED flag must always show on self-reported financials
//  - H.I.V.E. KNOWLEDGE quadrant color: #4882ff (Amendment 03 — #0054EA is retired)
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
  hive: 63.0,                  // H.I.V.E. (Human Insight Valuation Engine)
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


// ── 4. SEGMENT SCORES (12 systems) ───────────────────────────────────────────
export const SEGMENT_SCORES = {
  // STRATEGY quadrant
  operations: 68.0,
  marketing: 75.0,
  sales: 62.0,
  // LEADERSHIP quadrant
  finance: 55.0,
  technology: 63.0,
  knowledge: 48.0,
  // CULTURE quadrant
  talent: 58.0,
  alignment: 52.0,
  support: 50.0,
  // BRAND quadrant
  innovation: 75.0,
  research: 68.0,
  product: 70.0,
};


// ── 5. ONBOARDING STEPS ──────────────────────────────────────────────────────
export const ONBOARDING_STEPS = [
  { label: "FRAMEWORK",           timing: "Day 1",      status: "done"    },
  { label: "FINANCIALS",          timing: "Day 1",      status: "done"    },
  { label: "FOCUS",               timing: "Weeks 1–2",  status: "active"  },
  { label: "FORMULA",             timing: "Weeks 2–4",  status: "pending" },
  { label: "H.I.V.E.",            timing: "Weeks 3–5",  status: "pending" },
  { label: "S.U.M.",              timing: "Weeks 3–5",  status: "pending" },
  { label: "VAULT + BRAND AUDIT", timing: "Weeks 5–6",  status: "pending" },
  { label: "ANALYTICS",           timing: "Day 42+",    status: "pending" },
];


// ── 6. GESTALT INTELLIGENCE ALERTS ───────────────────────────────────────────
// NOTE: These are AI-generated alerts. Never call them "GESTALT AI alerts."
// dollarsAtStake shown on hover as "$(X) AT STAKE"
export const ALERTS = [
  {
    id: 1,
    priority: "HIGH",
    title: "H.I.V.E. (Human Insight Valuation Engine) — CULTURE signal declining",
    body: "TALENT retention dropped 8.0 points this quarter. Three high performers show early flight risk indicators. GESTALT INTELLIGENCE recommends reviewing compensation benchmarks within 14 days.",
    timestamp: "2 hours ago",
    module: "HIVE",
    dollarsAtStake: 38000,
  },
  {
    id: 2,
    priority: "MEDIUM",
    title: "FRAMEWORK assessment incomplete",
    body: "Questions 14–21 unanswered. Suppressing B.A.S.E. (Brand and Strategy Engine) score below its calculated potential.",
    timestamp: "Yesterday",
    module: "FRAMEWORK",
    dollarsAtStake: 12400,
  },
  {
    id: 3,
    priority: "LOW",
    title: "S.U.M. (Strategic Unified Messaging) — Journal streak broken",
    body: "3-day journal streak ended. Depth score dropped 0.3 points. BRAND PULSE™ refresh overdue by 12 days.",
    timestamp: "3 days ago",
    module: "SUM",
    dollarsAtStake: 0,
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
// FORMULA: DAILY DRAIN = (Potential − Current) ÷ 365
export const VALUATION_DRAIN_DATA = {
  dailyCost: 3353,
  annualCost: 1223845,
  ninetyDayCost: 301770,
};


// ── 10. MOCK DAILY TASKS ─────────────────────────────────────────────────────
// Buckets: BY_NOON | END_OF_DAY | THIS_WEEK | NEXT_17_DAYS | NEXT_21_DAYS | THIS_MONTH
// Replaced by Anthropic API call at 7am daily in live platform.
// Shot Clock timer uses estimatedMinutes as default countdown duration.
export const MOCK_DAILY_TASKS = [
  {
    id: "t1",
    title: "Complete FRAMEWORK questions 14–21",
    bucket: "BY_NOON",
    estimatedMinutes: 25,
    module: "FRAMEWORK",
    priority: "HIGH",
    dollarsAtStake: 12400,
    done: false,
    dismissed: false,
  },
  {
    id: "t2",
    title: "Review H.I.V.E. (Human Insight Valuation Engine) culture alert and respond",
    bucket: "BY_NOON",
    estimatedMinutes: 15,
    module: "HIVE",
    priority: "HIGH",
    dollarsAtStake: 38000,
    done: false,
    dismissed: false,
  },
  {
    id: "t3",
    title: "Upload Q1 financials to FINANCIALS module",
    bucket: "END_OF_DAY",
    estimatedMinutes: 30,
    module: "FINANCIALS",
    priority: "MEDIUM",
    dollarsAtStake: 8200,
    done: false,
    dismissed: false,
  },
  {
    id: "t4",
    title: "Start FORMULA brand strategy session",
    bucket: "THIS_WEEK",
    estimatedMinutes: 90,
    module: "FORMULA",
    priority: "STRATEGIC",
    dollarsAtStake: 44000,
    done: false,
    dismissed: false,
  },
  {
    id: "t5",
    title: "Complete FOCUS PERCEPTION pillar",
    bucket: "THIS_WEEK",
    estimatedMinutes: 45,
    module: "FOCUS",
    priority: "MEDIUM",
    dollarsAtStake: 19800,
    done: true,
    dismissed: false,
  },
];


// ── 11. MOCK EMPLOYEES (H.I.V.E.) ────────────────────────────────────────────
// H.I.V.E. quadrant colors (Amendment 03 — locked):
//   PERSONAL = rgba(255,255,255,0.9) | CUSTOMER = #FEDA00 | STAFF = #FF8001 | KNOWLEDGE = #4882ff
// NOTE: #0054EA is RETIRED. Use #4882ff for KNOWLEDGE quadrant. No exceptions.
export const MOCK_EMPLOYEES = [
  {
    id: "e1", name: "Sarah Chen",     role: "VP Marketing",
    overall: 78.0, personal: 82.0, customer: 75.0, staff: 80.0, knowledge: 75.0,
    status: "CHAMPION",   aiStatus: "STRATEGIST", aiQueriesUsed: 312,  aiQueriesTotal: 500,
  },
  {
    id: "e2", name: "Marcus Williams", role: "Sales Director",
    overall: 65.0, personal: 70.0, customer: 68.0, staff: 62.0, knowledge: 60.0,
    status: "STABLE",     aiStatus: "STANDARD",   aiQueriesUsed: 61,   aiQueriesTotal: 75,
  },
  {
    id: "e3", name: "Priya Patel",    role: "Operations Lead",
    overall: 72.0, personal: 74.0, customer: 70.0, staff: 73.0, knowledge: 71.0,
    status: "STRONG",     aiStatus: "STANDARD",   aiQueriesUsed: 58,   aiQueriesTotal: 75,
  },
  {
    id: "e4", name: "James Torres",   role: "Account Manager",
    overall: 41.0, personal: 38.0, customer: 45.0, staff: 42.0, knowledge: 39.0,
    status: "FLIGHT RISK",aiStatus: "STANDARD",   aiQueriesUsed: 8,    aiQueriesTotal: 75,
    // NOTE: James Torres is the flight-risk anchor. Estimated replacement cost: $180,545.
    // This alert must appear in H.I.V.E. performance view.
  },
  {
    id: "e5", name: "Alex Rivera",    role: "Product Manager",
    overall: 69.0, personal: 72.0, customer: 68.0, staff: 67.0, knowledge: 69.0,
    status: "STABLE",     aiStatus: "POWER",      aiQueriesUsed: 1680, aiQueriesTotal: 2000,
  },
];


// ── 12. MOCK TUTORIALS (for HelpPanel + TutorialsAdmin) ──────────────────────
// published: false = invisible to all client/employee roles
// wistiaId: real IDs added in developer sprint via HQ TUTORIALS admin screen
export const MOCK_TUTORIALS = [
  {
    id: "v1", title: "Understanding Your GESTALT SCORE™",
    section: "overview",        duration: "5:24", helpId: "overview",
    published: true,  wistiaId: "abc123", order: 1,
  },
  {
    id: "v2", title: "How to Complete FRAMEWORK",
    section: "framework",       duration: "4:12", helpId: "framework",
    published: true,  wistiaId: "def456", order: 2,
  },
  {
    id: "v3", title: "Reading H.I.V.E. (Human Insight Valuation Engine) Scores",
    section: "hive-performance",duration: "6:08", helpId: "hive-performance",
    published: false, wistiaId: "ghi789", order: 3,
  },
  {
    id: "v4", title: "The EXIT EQUATION™ Explained",
    section: "analytics",       duration: "5:45", helpId: "analytics",
    published: true,  wistiaId: "jkl012", order: 4,
  },
];


// ── 13. HELP CONTENT (drives every ? button across the platform) ──────────────
// helpId must match a key in this object exactly.
// Every entry: title (shown in panel header), body (2–4 sentences), citations (array of 3).
export const HELP_CONTENT = {
  "overview": {
    title: "COMMAND CENTER",
    body: "Your GESTALT SCORE™ is the composite of B.A.S.E. (Brand and Strategy Engine), H.I.V.E. (Human Insight Valuation Engine), and S.U.M. (Strategic Unified Messaging). Every 10-point increase corresponds to a measurable increase in your exit multiple.",
    citations: ["McKinsey Global Institute. 2017.", "Interbrand Best Global Brands Report. 2023.", "GESTALT Partners. EXIT EQUATION™ methodology. 2026."],
  },
  "framework": {
    title: "FRAMEWORK ASSESSMENT",
    body: "21 binary questions that expose your competitive blind spots. No gray areas. Every NO answer maps directly to a dollar amount of suppressed exit value.",
    citations: ["McKinsey. Strategy under uncertainty. 2016.", "Harvard Business Review. The Business Case for Purpose. 2015.", "GESTALT Partners. FRAMEWORK methodology. 2026."],
  },
  "financials": {
    title: "FINANCIALS",
    body: "Three simultaneous scores: Self-Reported (always shown, flagged UNVERIFIED), Verified (via QuickBooks — required for CERTIFIED), and AI 12-Month Projection. The UNVERIFIED badge never disappears from self-reported data.",
    citations: ["Deloitte M&A Due Diligence Framework. 2023.", "PwC Private Business Pulse. 2023.", "GESTALT Partners. FINANCIALS scoring. 2026."],
  },
  "focus": {
    title: "FOCUS DEEP DIVE",
    body: "100 binary questions across 4 pillars: PERCEPTION, CLARITY, IDENTITY, CULTURE. Each NO answer has a documented dollar cost to your exit valuation. NOT MEASURED is a complacency signal — treated as P2 priority.",
    citations: ["Gallup. State of the Global Workplace. 2023.", "Bain. The Elements of Value. 2016.", "GESTALT Partners. FOCUS methodology. 2026."],
  },
  "formula": {
    title: "FORMULA STRATEGY SESSION",
    body: "23 guided steps producing your completed brand interaction strategy. Completion unlocks the CREATIVE module. Not a scoring tool — a deliverable. Every step requires a sign-off before advancing.",
    citations: ["Harvard Business Review. 2018.", "McKinsey. Science of Organizational Transformations. 2015.", "GESTALT Partners. FORMULA methodology. 2026."],
  },
  "hive-performance": {
    title: "H.I.V.E. PERFORMANCE",
    body: "H.I.V.E. (Human Insight Valuation Engine) scores your team across four quadrants: PERSONAL, CUSTOMER, STAFF, KNOWLEDGE. Each weighted equally at 25%. This weighting never changes.",
    citations: ["Gallup. Cost of replacing employees. 2019.", "Center for American Progress. 2012.", "GESTALT Partners. H.I.V.E. methodology. 2026."],
  },
  "sum-messaging": {
    title: "S.U.M. MESSAGING",
    body: "S.U.M. (Strategic Unified Messaging) captures participation, knowledge sharing, project engagement, and communication quality. Hoarding information scores lower than sharing it.",
    citations: ["Deloitte. Knowledge Management. 2020.", "McKinsey. Collaborative Teams. 2017.", "GESTALT Partners. S.U.M. methodology. 2026."],
  },
  "vault": {
    title: "VAULT",
    body: "Every brand asset organized, searchable, and ready for due diligence. Acquirers expect instant access to brand history. VAULT delivers it. Storage: 5GB (Founding), 10GB (Regular Standard), 25GB (Agency/White Label).",
    citations: ["PwC M&A Due Diligence. 2023.", "KPMG Deal Advisory. 2021.", "GESTALT Partners. VAULT specification. 2026."],
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
    body: "The live badge updates in real time as your score moves. Requires FRAMEWORK score ≥ 16, verified financials, 50+ RESEARCH deposits, and 12+ months of active subscription. Certified companies report shorter due diligence timelines.",
    citations: ["GESTALT Partners. CERTIFIED badge outcome data. 2026.", "PwC M&A Integration Survey. 2022.", "BDO USA. Private Company Perspectives. 2023."],
  },
  "widget-gestalt-score": {
    title: "YOUR GESTALT SCORE™",
    body: "Composite of B.A.S.E. (Brand and Strategy Engine), H.I.V.E. (Human Insight Valuation Engine), and S.U.M. (Strategic Unified Messaging). Every 10-point increase corresponds to a measurable increase in your exit multiple.",
    citations: ["McKinsey Global Institute. 2017.", "Interbrand Best Global Brands Report. 2023.", "GESTALT Partners. EXIT EQUATION™ methodology. 2026."],
  },
  "widget-exit-equation": {
    title: "EXIT EQUATION™ POSITION",
    body: "Six-tier readiness continuum. MARKET VULNERABLE means foundational strength exists but meaningful gaps remain before a buyer pays a premium multiple. Tiers: LIQUIDATION | EXIT UNLIKELY | DISRUPTION IMMINENT | MARKET VULNERABLE | EXIT POSSIBLE | EXIT READY.",
    citations: ["GESTALT Partners. EXIT EQUATION™ tier definitions. 2026.", "Deloitte M&A Due Diligence. 2023.", "PwC Private Business Pulse. 2023."],
  },
  "widget-valuation-drain": {
    title: "VALUATION DRAIN™",
    body: "(Potential Valuation minus Current Valuation) divided by 365. At $3,353 per day, doing nothing for 90 days costs $301,770. This is not a projection — it is what complacency costs right now.",
    citations: ["GESTALT Partners. VALUATION DRAIN™ formula. 2026.", "McKinsey Global Institute. 2019.", "Bain. The Elements of Value. 2016."],
  },
  "widget-daily-routine": {
    title: "DAILY ROUTINE",
    body: "GESTALT INTELLIGENCE generates your priority list every morning at 7am based on score gaps, open tasks, and active alerts. Every task ranked by dollar impact on your exit valuation. One thing above the list is always the highest-impact action.",
    citations: ["Harvard Business Review. The Daily Routine of High-Performing Leaders. 2018.", "McKinsey. Science of Organizational Transformations. 2015.", "GESTALT Partners. Daily Routine methodology. 2026."],
  },
};


// ── 14. MOCK COUPONS (HQ tools) ───────────────────────────────────────────────
export const MOCK_COUPONS = [
  { id: "c1", code: "FOUNDING50", type: "PERCENTAGE", value: 50, appliesTo: ["Founding Standard"],                              uses: 23,  maxUses: 50,  expiry: "May 19, 2026", status: "ACTIVE"  },
  { id: "c2", code: "AGENCY25",   type: "PERCENTAGE", value: 25, appliesTo: ["All subscriptions"],                              uses: 8,   maxUses: null,expiry: null,           status: "ACTIVE"  },
  { id: "c3", code: "LAUNCH100",  type: "FIXED",      value: 100,appliesTo: ["Regular Standard", "Regular White Label"],       uses: 100, maxUses: 100, expiry: "Apr 1, 2026",  status: "EXPIRED" },
  { id: "c4", code: "PARTNER15",  type: "PERCENTAGE", value: 15, appliesTo: ["All subscriptions"],                              uses: 3,   maxUses: 25,  expiry: null,           status: "PAUSED"  },
  { id: "c5", code: "WHARTON30",  type: "PERCENTAGE", value: 30, appliesTo: ["Founding Standard", "Founding White Label"],     uses: 2,   maxUses: 10,  expiry: "Jun 1, 2026",  status: "ACTIVE"  },
];


// ── 15. MOCK REFUNDS (HQ tools) ───────────────────────────────────────────────
export const MOCK_REFUNDS = [
  { id: "r1", company: "River Creek Dental",  invoice: "Feb 2026", amount: 797.00,  type: "FULL",    reason: "Billing error",                          status: "PROCESSED", processedBy: "Jeffery Ess", processedDate: "Mar 3, 2026"  },
  { id: "r2", company: "Lakeside Staffing",   invoice: "Mar 2026", amount: 398.50,  type: "PARTIAL", reason: "Service issue — prorated refund",         status: "PENDING",   processedBy: null,          processedDate: null           },
  { id: "r3", company: "Summit Logistics",    invoice: "Jan 2026", amount: 797.00,  type: "FULL",    reason: "Customer request — plan cancellation",    status: "PROCESSED", processedBy: "Jeffery Ess", processedDate: "Feb 10, 2026" },
];


// ── 16. MOCK PRICE OVERRIDES (HQ pricing) ────────────────────────────────────
export const MOCK_PRICE_OVERRIDES = [
  { id: "o1", company: "Northgate Solutions", standardPrice: 797, overridePrice: 697, reason: "Early adopter negotiated rate", effectiveDate: "Jan 1, 2026",  setBy: "Jeffery Ess" },
  { id: "o2", company: "Apex Manufacturing",  standardPrice: 797, overridePrice: 750, reason: "Agency referral deal",          effectiveDate: "Feb 15, 2026", setBy: "Jeffery Ess" },
];


// ── 17. MOCK AGENCY REFERRALS ────────────────────────────────────────────────
// cashShare90: % after 90-day retention. cashShare12mo: % after 12 months (loyalty unlock).
export const MOCK_AGENCY_REFERRALS = [
  { id: "a1", agency: "Meridian Creative Group",  tier: "PARTNER PRO",   code: "MERIDIAN25",  clientDiscount: 20, cashShare90: 15, cashShare12mo: 17.5, activeReferrals: 4, pendingPayout: 1240, status: "ACTIVE"              },
  { id: "a2", agency: "Summit Strategy Partners", tier: "PARTNER",       code: "SUMMIT15",    clientDiscount: 15, cashShare90: 10, cashShare12mo: 12.5, activeReferrals: 2, pendingPayout: 0,    status: "PENDING ACTIVATION"  },
  { id: "a3", agency: "Blueprint Advisors",       tier: "PARTNER ELITE", code: "BLUEPRINT20", clientDiscount: 25, cashShare90: 20, cashShare12mo: 22.5, activeReferrals: 8, pendingPayout: 3680, status: "ACTIVE"              },
];


// ── 18. MOCK INFLUENCERS ─────────────────────────────────────────────────────
// Influencers earn % or flat fee — no client discount (unlike agency partners).
export const MOCK_INFLUENCERS = [
  { id: "i1", name: "Jordan Lee",     code: "JORDANGESTALT", payoutType: "PERCENTAGE", payoutValue: 8,  activeReferrals: 3, pendingPayout: 191, approvalStatus: "APPROVED"         },
  { id: "i2", name: "Casey Thompson", code: "CASEYEXIT",     payoutType: "FLAT",       payoutValue: 50, activeReferrals: 1, pendingPayout: 0,   approvalStatus: "PENDING APPROVAL" },
];


// ── 19. MOCK STRIPE CONNECTED (Invoicing module) ─────────────────────────────
// true = business owner has connected their own Stripe via Stripe Connect Standard.
// When false: Invoicing shows the "Connect Stripe" onboarding screen.
export const MOCK_STRIPE_CONNECTED = true;


// ── 20. MOCK ESTIMATES (Invoicing module) ────────────────────────────────────
export const MOCK_ESTIMATES = [
  {
    id: "est-001", client: "Lakeside Staffing",  project: "Brand Refresh Package", total: 12500, status: "DRAFT",  created: "Mar 15, 2026",
    lineItems: [
      { desc: "Brand strategy session (8 hrs)", qty: 1, rate: 2500,  amount: 2500  },
      { desc: "Visual identity development",    qty: 1, rate: 7500,  amount: 7500  },
      { desc: "Brand guidelines document",      qty: 1, rate: 2500,  amount: 2500  },
    ],
  },
  {
    id: "est-002", client: "Metro Plumbing Co",  project: "Website Redesign",       total: 8750,  status: "SIGNED", created: "Mar 20, 2026",
    lineItems: [
      { desc: "UX/UI design",          qty: 1, rate: 5000, amount: 5000 },
      { desc: "Copywriting (5 pages)", qty: 5, rate: 500,  amount: 2500 },
      { desc: "SEO setup",             qty: 1, rate: 1250, amount: 1250 },
    ],
  },
];


// ── 21. MOCK INVOICES (Invoicing module) ─────────────────────────────────────
export const MOCK_INVOICES = [
  { id: "inv-001", client: "Lakeside Staffing",   project: "Brand Refresh Package",   total: 12500, status: "SENT",    due: "Apr 15, 2026", created: "Apr 1, 2026",  paidDate: null            },
  { id: "inv-002", client: "Summit Logistics",    project: "Q1 Consulting",            total: 4500,  status: "PAID",    due: "Mar 30, 2026", created: "Mar 1, 2026",  paidDate: "Mar 28, 2026"  },
  { id: "inv-003", client: "Horizon Real Estate", project: "FORMULA Implementation",   total: 6000,  status: "OVERDUE", due: "Mar 15, 2026", created: "Feb 15, 2026", paidDate: null            },
];


// ── 22. DEFAULT WIDGET LAYOUTS (per segment) ─────────────────────────────────
// Anchor row (gestalt-score, exit-spectrum, valuation-drain) is always locked.
// These arrays define the draggable grid below the anchor row.
// Widget IDs must match WIDGET_LIBRARY in WidgetGrid.jsx.
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
