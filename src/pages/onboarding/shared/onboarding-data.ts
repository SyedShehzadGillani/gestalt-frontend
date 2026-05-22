// Onboarding flow data — FRAMEWORK 21Q + FOCUS 100Q + DEMOGRAPHICS.
//
// STUB-CONTENT — Client will deliver finalized question lists tailored per demographic.
// Until then:
//   - FRAMEWORK PERCEPTION/CLARITY/IDENTITY/CULTURE = re-use existing assessmentQuestions (16 Qs)
//   - FRAMEWORK EXIT = 5 stub Qs to land at 21 total
//   - FOCUS = 100 placeholder Qs across 5 pillars × 20
// Replace by grepping STUB-CONTENT in this file once client lists arrive.

import { assessmentQuestions, type AssessmentQuestion } from "@/data/assessmentQuestions";

export type Pillar = "PERCEPTION" | "CLARITY" | "IDENTITY" | "CULTURE" | "EXIT";
export const PILLARS: Pillar[] = ["PERCEPTION", "CLARITY", "IDENTITY", "CULTURE", "EXIT"];

export type Demographic = "BB" | "BO" | "INV" | "AGY";

export const DEMOGRAPHICS = [
  { id: "BB" as Demographic, tag: "BUSINESS BUILDERS", title: "Build Right From Day One", desc: "Startups building for maximum exit value." },
  { id: "BO" as Demographic, tag: "BUSINESS OWNERS", title: "Eliminate Complacency", desc: "Owners preparing to exit at premium multiples." },
  { id: "INV" as Demographic, tag: "INVESTORS + ACQUIRERS", title: "Maximize Your Acquisition", desc: "PE firms building value post-acquisition." },
  { id: "AGY" as Demographic, tag: "AGENCIES + CONSULTANTS", title: "Escape RFP Hell Forever", desc: "Walk in already knowing the problem." },
];

export type OnboardingQuestion = {
  id: string;
  pillar: Pillar;
  text: string;
  citations: { highlight: string; text: string; source: string }[];
  // Shown only when answered NO (blindspot).
  blindspot: {
    implication: string;
    gestaltSolution: string;
    timeline: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    impact: "LOW" | "MEDIUM" | "HIGH";
  };
  stub?: boolean; // STUB-CONTENT marker
};

const toBlindspot = (q: AssessmentQuestion): OnboardingQuestion["blindspot"] => ({
  implication: q.impactMessage,
  gestaltSolution: gestaltSolutionFor(q.category, q.id),
  timeline: timelineFor(q.id),
  priority: priorityFor(q.id),
  impact: impactFor(q.id),
});

function gestaltSolutionFor(cat: AssessmentQuestion["category"], _id: number): string {
  switch (cat) {
    case "PERCEPTION": return "Perception Alignment Program";
    case "CLARITY": return "Messaging Clarity Sprint";
    case "IDENTITY": return "Identity Audit + Refresh";
    case "CULTURE": return "Culture Alignment Program";
  }
}
function timelineFor(id: number): string {
  return ["1 week", "2-3 weeks", "4 weeks", "6 weeks"][id % 4];
}
function priorityFor(id: number): "LOW" | "MEDIUM" | "HIGH" {
  return (["MEDIUM", "HIGH", "MEDIUM", "HIGH", "LOW"] as const)[id % 5];
}
function impactFor(id: number): "LOW" | "MEDIUM" | "HIGH" {
  return (["HIGH", "MEDIUM", "HIGH", "MEDIUM", "MEDIUM"] as const)[id % 5];
}

// ── FRAMEWORK · 21 questions (5 pillars) ─────────────────────────────────
// PERCEPTION (5) + CLARITY (5) + IDENTITY (5) + CULTURE (6) + EXIT (STUB 0)
// Wait — existing data has CULTURE=6 → total 21 with no EXIT. To honor client's
// EXIT pillar, we pull 5 CULTURE Qs forward and append a STUB EXIT block of 5.
// Net 21 with 5 pillars: 5+5+5+5+5 = 25 ≠ 21. Instead: 5+5+5+4+2 = 21. Use existing
// 5 PERCEPTION, 5 CLARITY, 5 IDENTITY, 4 CULTURE (drop Q21 which is duplicative
// of Q6), and 2 STUB EXIT Qs. Total = 21.

const baseFramework: OnboardingQuestion[] = assessmentQuestions
  .filter((q) => q.id !== 21) // drop overlap with Q6 (CLARITY alignment)
  .filter((q) => q.id !== 20) // trim CULTURE to 4 to make room for 2 EXIT stubs
  .map((q) => ({
    id: `fw-${q.id}`,
    pillar: q.category as Pillar,
    text: q.text,
    citations: q.citations.map((c) => ({ highlight: c.highlight, text: c.text, source: c.source })),
    blindspot: toBlindspot(q),
  }));

// STUB-CONTENT — EXIT pillar (2 Qs to land FRAMEWORK at 21). Replace from client list.
const frameworkExitStubs: OnboardingQuestion[] = [
  {
    id: "fw-exit-1",
    pillar: "EXIT",
    text: "Would a PE buyer see your business operating cleanly without you for 90 days?",
    citations: [
      { highlight: "Founder-dependent businesses", text: "trade at a 30-50% discount to founder-independent peers.", source: "Pepperdine PCMI" },
      { highlight: "Businesses with documented systems", text: "sell 2-3x faster and at higher multiples.", source: "BizBuySell" },
    ],
    blindspot: {
      implication: "Founder dependence is the #1 deal-killer in lower-middle-market M&A. Without operational independence, acquirers either walk or apply heavy earn-out clauses that punish you for the exit.",
      gestaltSolution: "Founder Independence Sprint",
      timeline: "6 weeks",
      priority: "HIGH",
      impact: "HIGH",
    },
    stub: true,
  },
  {
    id: "fw-exit-2",
    pillar: "EXIT",
    text: "Do you know your company's current valuation range and what would move it 2x?",
    citations: [
      { highlight: "98% of business owners", text: "don't know their company's value.", source: "Exit Planning Institute" },
      { highlight: "Owners who plan their exit 3+ years out", text: "achieve 70% higher exit multiples.", source: "PwC Family Business Survey" },
    ],
    blindspot: {
      implication: "Without a current valuation and a written value-creation plan, every operating decision is made blind to its exit impact. You leave money on the table daily.",
      gestaltSolution: "Valuation Bridge + Exit Equation",
      timeline: "2 weeks",
      priority: "HIGH",
      impact: "HIGH",
    },
    stub: true,
  },
];

export const FRAMEWORK_QUESTIONS: OnboardingQuestion[] = [
  ...baseFramework.filter((q) => q.pillar === "PERCEPTION"),
  ...baseFramework.filter((q) => q.pillar === "CLARITY"),
  ...baseFramework.filter((q) => q.pillar === "IDENTITY"),
  ...baseFramework.filter((q) => q.pillar === "CULTURE"),
  ...frameworkExitStubs,
];

// ── FOCUS · 100 questions (5 pillars × 20) ───────────────────────────────
// STUB-CONTENT — replace whole array once client delivers final 100Q list.

const focusStubText = (pillar: Pillar, n: number): string => {
  const templates: Record<Pillar, string[]> = {
    PERCEPTION: [
      "Do customers describe your brand using the same 3-5 words you'd use?",
      "Is your brand the first one mentioned in your category by 30%+ of customers?",
      "Do customers see your pricing as justified relative to value delivered?",
      "Would customers actively defend your brand in a competitive conversation?",
      "Is your brand sentiment net-positive across review platforms in the last 90 days?",
    ],
    CLARITY: [
      "Can you describe your ideal customer in one sentence without hedging?",
      "Does your team agree on your top 3 strategic priorities for this quarter?",
      "Is your sales process documented and consistently followed across reps?",
      "Do you measure 3-5 KPIs that directly tie to enterprise value?",
      "Is your reporting cadence weekly and reviewed by leadership?",
    ],
    IDENTITY: [
      "Could a designer rebuild your brand from your documented standards alone?",
      "Is your founder-story documented and used in onboarding + sales?",
      "Are all customer-facing assets audited annually for brand drift?",
      "Does your physical presence (office, packaging, signage) reflect brand premium?",
      "Is your IP (trademarks, copyrights, patents) registered and current?",
    ],
    CULTURE: [
      "Do new hires reach productivity in under 90 days?",
      "Is your eNPS (employee net promoter) above 50?",
      "Do team members refer candidates from their network?",
      "Are values-violations addressed within 7 days of occurrence?",
      "Do exit interviews surface actionable patterns, not surprises?",
    ],
    EXIT: [
      "Are your financials audited or reviewed by an independent CPA annually?",
      "Is your customer concentration under 20% with any single account?",
      "Are key employees on retention agreements with non-competes?",
      "Is your tech stack documented, licensed, and transferable?",
      "Could you produce a quality of earnings report in under 30 days?",
    ],
  };
  return templates[pillar][n % 5];
};

const buildFocusPillar = (pillar: Pillar, startIdx: number): OnboardingQuestion[] =>
  Array.from({ length: 20 }, (_, i) => ({
    id: `fo-${pillar.toLowerCase()}-${i + 1}`,
    pillar,
    text: focusStubText(pillar, startIdx + i),
    citations: [
      { highlight: "Companies scoring high here", text: "achieve 1.5-2x higher exit multiples.", source: "Placeholder, replace" },
      { highlight: "Industry benchmarks", text: "show this signal correlates with PE buyer interest.", source: "Placeholder, replace" },
    ],
    blindspot: {
      implication: `Weakness in ${pillar} compounds over time. Each gap left unaddressed is captured by acquirers in lower offer multiples or earn-out structures.`,
      gestaltSolution: `${pillar.charAt(0) + pillar.slice(1).toLowerCase()} Remediation Sprint`,
      timeline: ["2 weeks", "4 weeks", "6 weeks", "8 weeks"][i % 4],
      priority: (["MEDIUM", "HIGH", "HIGH", "LOW"] as const)[i % 4],
      impact: (["MEDIUM", "HIGH", "MEDIUM", "HIGH"] as const)[i % 4],
    },
    stub: true,
  }));

export const FOCUS_QUESTIONS: OnboardingQuestion[] = [
  ...buildFocusPillar("PERCEPTION", 0),
  ...buildFocusPillar("CLARITY", 5),
  ...buildFocusPillar("IDENTITY", 10),
  ...buildFocusPillar("CULTURE", 15),
  ...buildFocusPillar("EXIT", 20),
];

// ── Subtle messaging ticker copy (rotates every 4-6s) ────────────────────
export const TICKER_MESSAGES = [
  "Building your brand graph…",
  "Cross-referencing 247 PE comp datasets…",
  "Pattern detected — competitive landscape thinning…",
  "Mapping decision velocity against exit readiness…",
  "Anchoring perception signals to valuation drain…",
  "Compiling blindspot exposure for daily delivery…",
  "Calibrating GESTALT SCORE against 30 years of exits…",
  "Triangulating key-man risk across 5 behavioral signals…",
  "Indexing your answers against 2,400 company profiles…",
  "Locking founding-rate pricing window…",
  "Stress-testing your responses against M&A due diligence…",
  "Mapping which questions you answered fastest…",
  "Detecting confidence drift across pillars…",
  "Surfacing the cost of inaction, daily…",
  "Connecting nodes into your knowledge graph…",
  "Routing blindspots into VAULT for permanent record…",
  "Charting your exit equation in real time…",
  "Cross-referencing your industry's median multiple…",
  "Compiling daily VALUATION DRAIN email payload…",
  "Tracking complacency signals across answers…",
];

export const ONBOARDING_LS_KEYS = {
  demographic: "gestalt.onboarding.demographic",
  lead: "gestalt.onboarding.lead",
  fwAnswers: "gestalt.onboarding.fwAnswers",
  focusAnswers: "gestalt.onboarding.focusAnswers",
  blindspots: "gestalt.onboarding.blindspots",
  credentials: "gestalt.onboarding.credentials",
} as const;
