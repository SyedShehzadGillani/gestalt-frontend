// S.U.M. v15 canonical data aggregator.
// Re-exports the operational dataset from sum-mock.ts and the legacy
// mockData.js so call-sites have ONE import surface. Adds net-new constants
// the v15 spec requires that aren't already in sum-mock or mockData.
//
// Source: GPS-SUM-Step-01-Data-v1.md + gestalt-sum-mockup-04-30-v15.html.

// ── re-export the existing canonical SUM operational data ────────────────
export {
  NOTE_COLORS,
  TABS,
  CHANNELS,
  PROJECTS_LIST,
  DMS,
  MESSAGES,
  JOURNAL_ENTRIES,
  NOTES,
  FOLDERS,
  folderCount,
  ENTRY_TYPES,
  DESIRE_FIELDS,
  SLIDESHOW,
  POLL,
  STORY_POSTS,
  WEEKLY_STATUS,
  PENDING_REMINDERS,
  GI_SEED_MESSAGES,
  GI_SUGGESTIONS,
  GI_DEMO_RESPONSES,
  GI_NARRATIONS,
  GI_TAB_LABELS,
  METRICS_DATA,
} from "@/data/sum-mock";

export type {
  NoteColorId,
  SumTabId,
  SumMessage,
  JournalReminder,
  JournalEntry,
  SumNote,
  StoryRiff,
  StoryPost,
  GiLink,
  GiMessage,
} from "@/data/sum-mock";

// ── DESIRE_HINTS — chained pillar prompts (v15 spec §4.3) ────────────────
export const DESIRE_HINTS: Record<string, string> = {
  Delight: "What pleasant moment did this create? What did the customer / user / teammate not expect?",
  Experience: "How did the DELIGHT shape the experience that followed it? What changed in their moment?",
  Surprise: "Where did the EXPERIENCE go beyond expectation? What was the surprise inside it?",
  Inspire: "How does the SURPRISE inspire action? What does it make the person want to do next?",
  Resonate: "Why does the INSPIRATION stick? What about it lasts beyond the moment?",
  Evangelize: "How does the RESONANCE turn into evangelism? Why would they tell someone about this?",
};

// ── REWARD_MESSAGES — gamified C.O.R.E. answer rewards (β-friend voice) ──
export const REWARD_MESSAGES: string[] = [
  "Nice one. That's the kind of detail no onboarding doc would've caught.",
  "C.O.R.E. just got smarter. Future-you will thank you.",
  "Got it. Someone's going to save two hours of digging because of this.",
  "Solid answer. The PRICING domain has its first real entry now.",
  "On a roll — third one this week. The org is learning faster.",
  "That's a good one. The wry observer in me appreciates the directness.",
  "Worth saying. C.O.R.E. just gained an opinion it didn't have before.",
];

// ── GI_FRANK_PROMPT — frank-mode permission card text ────────────────────
export const GI_FRANK_PROMPT =
  "I notice this is a moment where directness might help more than diplomacy. **Can I be frank?**";

// ── INTERVIEW_QUESTIONS — pending C.O.R.E. queue (right panel GESTALT) ───
export interface InterviewQuestion {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  topic: string;
  question: string;
  driver: "job-description" | "gap-analysis";
  followUpsAllowed: number;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: "iq1", priority: "HIGH", topic: "PRICING APPROVAL", driver: "gap-analysis", followUpsAllowed: 5,
    question: "Three people in #marketing have asked this month: who has authority to approve a discount above 15% for an existing customer?" },
  { id: "iq2", priority: "MEDIUM", topic: "YOUR ROLE — STRATEGIC", driver: "job-description", followUpsAllowed: 5,
    question: "Walk me through what you consider the three highest-leverage decisions you make in a typical month." },
  { id: "iq3", priority: "MEDIUM", topic: "Q2 BRAND REFRESH", driver: "gap-analysis", followUpsAllowed: 5,
    question: "You shipped the onboarding redesign last week. What's the one thing you learned that future redesigns should avoid?" },
  { id: "iq4", priority: "LOW", topic: "VENDOR RELATIONSHIPS", driver: "gap-analysis", followUpsAllowed: 5,
    question: "You signed off on the Codat integration. What was the deciding factor?" },
];

// ── CONTRIBUTIONS_LOG — logged participation (NOT score) ─────────────────
export interface ContributionEntry {
  id: string;
  date: string;
  type: "core-answer" | "helping" | "note" | "journal-entry";
  topic: string;
  summary: string;
}

export const CONTRIBUTIONS_LOG: ContributionEntry[] = [
  { id: "cl1", date: "Mar 3, 2026", type: "core-answer", topic: "Pricing strategy",
    summary: "Substantive answer + 3 follow-ups. Quality scored relative to question depth." },
  { id: "cl2", date: "Mar 2, 2026", type: "helping", topic: "#marketing-questions",
    summary: "Replied to teammate's question. AI inferred the reply solved their problem." },
  { id: "cl3", date: "Mar 1, 2026", type: "note", topic: "Onboarding feedback",
    summary: "Substantive note flagged a real issue with H.I.V.E. interview pacing." },
  { id: "cl4", date: "Feb 28, 2026", type: "journal-entry", topic: "Q2 offsite",
    summary: "FEAR/FRICTION entry shared to STORY ENGINE." },
];

// ── SUM_KPIS — 8 KPIs for METRICS tab (v15 spec §4.6) ────────────────────
export interface SumKpi {
  id: string;
  label: string;
  suffix: string;
  goodHigh: boolean;
  source: string;
  description: string;
}

export const SUM_KPIS: SumKpi[] = [
  { id: "sum-score",        label: "S.U.M. SCORE",       suffix: "/100",   goodHigh: true,  source: "computed",                description: "Composite of all S.U.M. signals — participation, depth, helping, idea flow." },
  { id: "participation",    label: "PARTICIPATION",      suffix: "%",      goodHigh: true,  source: "channels + polls",        description: "Percentage of team actively engaged this period." },
  { id: "idea-flow",        label: "IDEA FLOW",          suffix: "/week",  goodHigh: true,  source: "journal + stories",       description: "Number of substantive ideas surfaced from journal + STORY ENGINE per week." },
  { id: "helping-signal",   label: "HELPING SIGNAL",     suffix: "/week",  goodHigh: true,  source: "AI helping detection",    description: "AI-detected helping moments in channels — answering questions, unblocking teammates." },
  { id: "response-latency", label: "RESPONSE LATENCY",   suffix: "hr avg", goodHigh: false, source: "channels",                description: "Average hours from question asked to substantive response." },
  { id: "journal-depth",    label: "JOURNAL DEPTH",      suffix: "/10",    goodHigh: true,  source: "journal AI scoring",      description: "AI-scored substantive depth of journal entries on a 0-10 scale." },
  { id: "core-contrib",     label: "C.O.R.E. CONTRIB",   suffix: "/week",  goodHigh: true,  source: "interview answers",       description: "C.O.R.E. interview answers contributed per week, weighted by quality." },
  { id: "silo-index",       label: "SILO INDEX",         suffix: "%",      goodHigh: false, source: "channel cross-flow",      description: "Percentage of teams that don't communicate cross-functionally. Lower is better." },
];

// ── SUM_SCORE_WEIGHTS — score component weights (sums to 1.00) ───────────
export const SUM_SCORE_WEIGHTS = {
  channelCoverage: 0.15,
  slideshowEngagement: 0.10,
  journalDepth: 0.10,
  storyEngineActivity: 0.15,
  pollResponseRate: 0.10,
  metricTrend: 0.10,
  notesDiscipline: 0.05,
  desireCoverage: 0.10,
  onboardingCompletion: 0.05,
  rightPanelUsage: 0.10,
} as const;

// ── REACTIONS_PALETTE — quick-reaction picker for CHANNELS ───────────────
export const REACTIONS_PALETTE = [
  { emoji: "check", icon: "check", color: "var(--sum-green)" },
  { emoji: "flame", icon: "flame", color: "#f97316" },
  { emoji: "heart", icon: "heart", color: "#e879a0" },
];

// ── HELPING_MESSAGES — message IDs flagged as PARTICIPATION LOGGED ───────
export const HELPING_MESSAGES = new Set<number>([102]);
