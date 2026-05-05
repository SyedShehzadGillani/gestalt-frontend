// Canonical SUM mock data — sourced from moved_docs/gestalt-sum-mockup-04-30-v15.html.
// See PROJECT-GLOSSARY.md.

export type NoteColorId = "yellow" | "green" | "blue" | "red" | "purple" | "gray";

export const NOTE_COLORS: Array<{ id: NoteColorId; color: string; colorDark: string; label: string }> = [
  { id: "yellow", color: "#e2b53f", colorDark: "#7a5d12", label: "Yellow" },
  { id: "green", color: "#5fcc00", colorDark: "#2a6900", label: "Green" },
  { id: "blue", color: "#3b82f6", colorDark: "#1e3f80", label: "Blue" },
  { id: "red", color: "#ef4444", colorDark: "#8a1f1f", label: "Red" },
  { id: "purple", color: "#a855f7", colorDark: "#5b1d8a", label: "Purple" },
  { id: "gray", color: "#777", colorDark: "#3a3a3a", label: "Gray" },
];

export const TABS = [
  { id: "chat", label: "CHANNELS", icon: "hash" },
  { id: "slideshow", label: "DAILY SLIDESHOW", icon: "play" },
  { id: "notes", label: "NOTES", icon: "sticky" },
  { id: "metrics", label: "METRICS", icon: "chart" },
] as const;
export type SumTabId = (typeof TABS)[number]["id"];

export const CHANNELS = [
  { name: "general", unread: 3, pinned: true, private: false },
  { name: "marketing", unread: 0, pinned: false, private: false },
  { name: "product-dev", unread: 7, pinned: false, private: false },
  { name: "leadership", unread: 1, pinned: true, private: true },
  { name: "culture-wins", unread: 2, pinned: false, private: false },
];

export const PROJECTS_LIST = [
  { name: "Q2 Brand Refresh", unread: 4 },
  { name: "Website Redesign", unread: 0 },
  { name: "Customer Journey Map", unread: 1 },
];

export const DMS = [
  { name: "Sarah Chen", status: "online", unread: 1 },
  { name: "Marcus Williams", status: "away", unread: 0 },
  { name: "Priya Patel", status: "online", unread: 0 },
];

export interface SumMessage {
  id: number;
  day: string;
  user: string;
  role: string;
  time: string;
  avatar: string;
  text: string;
  reactions: { e: string; count: number }[];
  threadCount: number;
  edited: boolean;
  bookmarked: boolean;
  isAI?: boolean;
  mentions?: string[];
}

export const MESSAGES: SumMessage[] = [
  { id: 101, day: "Friday, February 28", user: "Marcus Williams", role: "COO", time: "8:42 AM", avatar: "MW",
    text: "Pricing meeting moved to 3pm today. Conference room B. Bring last quarter's numbers.",
    reactions: [{ e: "check", count: 4 }], threadCount: 0, edited: false, bookmarked: false },
  { id: 102, day: "Friday, February 28", user: "Sarah Chen", role: "VP Marketing", time: "9:15 AM", avatar: "SC",
    text: "Campaign data is ready. Saw a 23% lift on the cohort that engaged with the FOCUS preview content. That's the highest we've measured this year.",
    reactions: [{ e: "flame", count: 6 }, { e: "heart", count: 2 }], threadCount: 3, edited: false, bookmarked: true },
  { id: 103, day: "Friday, February 28", user: "GESTALT INTELLIGENCE", role: "Daily Insight", time: "9:30 AM", avatar: "AI", isAI: true,
    text: "Sarah's cohort lift of 23% is statistically significant given your sample size of 1,847 contacts. If you scale this to your full top-of-funnel of 12,400 monthly contacts, you'd add approximately $186K in pipeline at your current $40 average deal size. Recommended action: replicate the FOCUS preview format on the next 3 campaigns (HubSpot State of Marketing, 2025).",
    reactions: [{ e: "check", count: 8 }, { e: "flame", count: 3 }], threadCount: 0, edited: false, bookmarked: true },
  { id: 104, day: "Friday, February 28", user: "Priya Patel", role: "Head of Product", time: "2:14 PM", avatar: "PP",
    text: "Just shipped the onboarding redesign. Time-to-first-value dropped from 14 minutes to 6. Tracking conversion impact for the next 7 days before declaring victory.",
    reactions: [{ e: "flame", count: 5 }], threadCount: 2, edited: false, bookmarked: false },
  { id: 105, day: "Friday, February 28", user: "Jordan Lee", role: "HR Director", time: "4:33 PM", avatar: "JL",
    text: "Reminder: H.I.V.E. quarterly review forms close Friday. We're at 78% completion — last year's average was 64%, so we're trending well. Please nudge your teams.",
    reactions: [{ e: "check", count: 3 }], threadCount: 0, edited: false, bookmarked: false },
  { id: 106, day: "Monday, March 2", user: "Alex Rivera", role: "Senior Designer", time: "7:51 AM", avatar: "AR",
    text: "Pulled the brand audit images from VAULT for the leadership deck. Three of them are tagged as old — Steven, want me to swap to the new versions or keep the originals for historical context?",
    reactions: [], threadCount: 1, edited: false, bookmarked: false },
  { id: 107, day: "Monday, March 2", user: "Steven Wright", role: "Creative Director", time: "8:09 AM", avatar: "SW",
    text: "@Alex Rivera Use the originals. Leadership wants to see the before/after arc — that's the whole point of the audit.",
    reactions: [{ e: "check", count: 2 }], threadCount: 0, edited: false, bookmarked: false, mentions: ["Alex Rivera"] },
  { id: 108, day: "Monday, March 2", user: "Sarah Chen", role: "VP Marketing", time: "10:22 AM", avatar: "SC",
    text: "Story Engine post on the referral program is at 23 votes already. Marcus, can we discuss whether this should move to FORMULA in the next quarterly harvest?",
    reactions: [{ e: "flame", count: 4 }], threadCount: 5, edited: false, bookmarked: false },
  { id: 109, day: "Monday, March 2", user: "GESTALT INTELLIGENCE", role: "Pattern Detected", time: "11:00 AM", avatar: "AI", isAI: true,
    text: "Detected: Cross-functional communication between Marketing and Pricing has dropped 34% over the last 18 days. Last meaningful exchange was on February 12. Pricing decisions made without market context historically correlate with a 12-15% margin compression in the next quarter. Recommend scheduling a sync within 72 hours (McKinsey Operations Practice, 2024).",
    reactions: [{ e: "eye", count: 7 }], threadCount: 0, edited: false, bookmarked: true },
  { id: 110, day: "Monday, March 2", user: "Marcus Williams", role: "COO", time: "3:47 PM", avatar: "MW",
    text: "Booking it for Wednesday. Sarah, Priya — please join. We need this sync before Q2 planning.",
    reactions: [{ e: "check", count: 3 }], threadCount: 0, edited: false, bookmarked: false },
  { id: 1, day: "Today, March 3", user: "Sarah Chen", role: "VP Marketing", time: "9:14 AM", avatar: "SC",
    text: "Just finished reviewing the FOCUS results. Our PERCEPTION pillar is at 14/20 — better than I expected but still 6 points of gap. That's real money we're leaving on the table.",
    reactions: [{ e: "check", count: 3 }, { e: "flame", count: 2 }], threadCount: 0, edited: false, bookmarked: false },
  { id: 2, day: "Today, March 3", user: "Marcus Williams", role: "COO", time: "9:22 AM", avatar: "MW",
    text: "Agreed. The competitive landscape section in FORMULA is going to be eye-opening for the exec team. We mapped 4 competitors and our word stack looks completely different from all of them. @Sarah Chen want to walk through it together before Friday?",
    reactions: [{ e: "check", count: 2 }], threadCount: 4, edited: false, bookmarked: false, mentions: ["Sarah Chen"] },
  { id: 3, day: "Today, March 3", user: "GESTALT INTELLIGENCE", role: "Daily Insight", time: "9:30 AM", avatar: "AI", isAI: true,
    text: "Based on your FOCUS PERCEPTION score of 14/20, the 6-point gap represents approximately $847K in unrealized annual revenue. The highest-ROI question to address first: 'Do customers refer others to you without being asked?' — improving organic referral reduces CAC by 45% on average (LinkedIn, 2024).",
    reactions: [{ e: "flame", count: 5 }], threadCount: 0, edited: false, bookmarked: true },
  { id: 4, day: "Today, March 3", user: "Priya Patel", role: "Head of Product", time: "9:45 AM", avatar: "PP",
    text: "That referral stat is exactly what I needed. Submitting a Story Engine idea around a structured referral program. Going to tie it to the loyalty spectrum work we did in FORMULA.",
    reactions: [{ e: "flame", count: 1 }, { e: "heart", count: 2 }], threadCount: 2, edited: true, bookmarked: false },
];

export interface JournalReminder { id: string; label: string; at: string; fired: boolean; }
export interface JournalEntry {
  id: number;
  date: string;
  types: string[];
  tags: string[];
  favorite: boolean;
  color: NoteColorId;
  folderId: string | null;
  title: string;
  text: string;
  solve: Record<string, string> | null;
  sharedToStoryEngine: boolean;
  reminders?: JournalReminder[];
}

export const JOURNAL_ENTRIES: JournalEntry[] = [
  { id: 1, date: "Mar 3, 2026", types: ["IDEA"], tags: ["referral", "loyalty", "Q2-launch"], favorite: true,
    color: "yellow", folderId: "f1",
    title: "Referral program tied to loyalty spectrum",
    text: "If we create a tiered referral reward that maps to where the customer sits on our loyalty spectrum, we can systematically move them from Acceptable → Loyal. Need to discuss with Sarah.",
    solve: null, sharedToStoryEngine: false },
  { id: 2, date: "Mar 2, 2026", types: ["FEAR/FRICTION"], tags: ["pricing", "Q1-results"], favorite: false,
    color: "red", folderId: "f2",
    title: "Pricing page confusion",
    text: "Three customers this week asked about pricing before the first call. Our FRAMEWORK score on Q9 was NO — this is the exact friction the assessment identified. We need to fix this before Q2.",
    solve: null, sharedToStoryEngine: false,
    reminders: [
      { id: "r1", label: "Call Brad about pricing", at: "Mar 4, 2026 12:00 PM", fired: false },
      { id: "r2", label: "Review with Sarah", at: "Mar 5, 2026 9:30 AM", fired: false },
    ] },
  { id: 3, date: "Mar 1, 2026", types: ["D.E.S.I.R.E."], tags: ["customer-story", "support-team"], favorite: false,
    color: "green", folderId: "f3",
    title: "Customer called to thank support team",
    text: "Customer called specifically to thank Alex for resolving their issue in 4 minutes. This is the kind of S+D+I moment we need to replicate.",
    solve: {
      Delight: "Customer was delighted that a real human picked up and solved their problem in minutes.",
      Experience: "Phone call, voice contact, immediate competence — felt human and rare.",
      Surprise: "They expected to wait 24 hours. Got resolution in 4 minutes.",
      Inspire: "They told us they'd never had service like that anywhere.",
      Resonate: "",
      Evangelize: "",
    },
    sharedToStoryEngine: true },
  { id: 6, date: "Feb 26, 2026", types: ["IDEA"], tags: ["culture", "H.I.V.E."], favorite: true,
    color: "purple", folderId: "f4",
    title: "Quarterly anonymous founder Q&A",
    text: "What if we let employees submit anonymous questions to the founder for a quarterly response video? Builds trust without putting people on the spot live.",
    solve: null, sharedToStoryEngine: false },
];

export interface SumNote {
  id: string;
  date: string;
  title: string;
  color: NoteColorId;
  folderId: string | null;
  favorite: boolean;
  text: string;
  reminders: JournalReminder[];
}

export const NOTES: SumNote[] = [
  { id: "n1", date: "Mar 3, 2026", title: "Call Brad TODAY", color: "red", folderId: "f2", favorite: false,
    text: "Brad needs a callback re: pricing tier discussion before EOD.",
    reminders: [{ id: "nr1", label: "Call Brad", at: "Mar 4, 2026 12:00 PM", fired: false }] },
  { id: "n2", date: "Feb 28, 2026", title: "Q2 offsite venue ideas", color: "yellow", folderId: "f1", favorite: false,
    text: "Looked into 3 venues. Lakehouse needs 60-day notice. Ridge has weekend availability. Downtown loft is cheapest but parking is rough.",
    reminders: [] },
  { id: "n3", date: "Feb 27, 2026", title: "Renew SSL cert", color: "blue", folderId: null, favorite: false,
    text: "Renew the SSL cert for the marketing subdomain. Expires April 12.",
    reminders: [{ id: "nr3", label: "Renew SSL cert", at: "Apr 5, 2026 10:00 AM", fired: false }] },
  { id: "n4", date: "Feb 26, 2026", title: "Sarah's birthday", color: "purple", folderId: null, favorite: true,
    text: "March 14. She likes that bookstore on Main. Get a card.",
    reminders: [] },
  { id: "n5", date: "Feb 25, 2026", title: "Onboarding feedback", color: "green", folderId: "f4", favorite: false,
    text: "New hire mentioned the H.I.V.E. interview pacing felt rushed in week 2. Worth checking the question density.",
    reminders: [] },
  { id: "n6", date: "Feb 24, 2026", title: "Codat invoice", color: "yellow", folderId: null, favorite: false,
    text: "Q1 invoice came in higher than projected. Check usage tier.",
    reminders: [] },
  { id: "n7", date: "Feb 22, 2026", title: "Marketing meeting moved", color: "gray", folderId: null, favorite: false,
    text: "Pushed from Tuesday 10am to Thursday 2pm. Confirm with team.",
    reminders: [] },
  { id: "n8", date: "Feb 21, 2026", title: "Investor follow-up", color: "red", folderId: "f2", favorite: false,
    text: "David from Greenway asked about Q2 projections — send the deck before Friday.",
    reminders: [{ id: "nr8", label: "Send Greenway deck", at: "Mar 7, 2026 9:00 AM", fired: false }] },
];

export const FOLDERS = [
  { id: "f1", name: "Q2 Initiatives", aiSuggested: false },
  { id: "f2", name: "Pricing Workstream", aiSuggested: false },
  { id: "f3", name: "Customer Stories", aiSuggested: false },
  { id: "f4", name: "Culture & H.I.V.E.", aiSuggested: true },
];

export const folderCount = (folderId: string) =>
  JOURNAL_ENTRIES.filter((e) => e.folderId === folderId).length +
  NOTES.filter((n) => n.folderId === folderId).length;

export const ENTRY_TYPES = [
  { id: "IDEA", color: "var(--sum-gold)", desc: "Proactive idea to share" },
  { id: "FEAR/FRICTION", color: "var(--sum-red)", desc: "Problem or obstacle observed" },
  { id: "D.E.S.I.R.E.", color: "var(--sum-gold)", desc: "Structured resolution" },
];

export const DESIRE_FIELDS = ["Delight", "Experience", "Surprise", "Inspire", "Resonate", "Evangelize"];

export const SLIDESHOW = [
  { icon: "star", title: "CULTURE WIN", text: "Sarah Chen completed her 100th FOCUS review collaboration. Top 5% contributor.", color: "var(--sum-gold)" },
  { icon: "chart", title: "SCORE UPDATE", text: "Company GESTALT Score increased from 62 → 67 this month. PERCEPTION pillar drove the gain.", color: "var(--sum-green)" },
  { icon: "users", title: "WELCOME", text: "Alex Rivera joins the Product team on Monday. Background in UX research and competitive analysis.", color: "var(--sum-blue)" },
  { icon: "bulb", title: "STORY ENGINE", text: "'Customer Onboarding Video Series' idea received 23 upvotes. Moving to FORMULA quarterly harvest.", color: "var(--sum-gold)" },
  { icon: "heart", title: "PERSONAL", text: "Marcus Williams and family welcomed a baby girl this weekend. Congratulations!", color: "#e879a0" },
  { icon: "alert", title: "VALUATION DRAIN", text: "Your daily Valuation Drain decreased by $312/day this month. Keep pushing — $4,384/day remaining.", color: "var(--sum-red)" },
];

export const POLL = {
  title: "How aligned do you feel with the company mission after the FORMULA sessions?",
  deadline: "48 hours remaining",
  responses: 34,
  total: 47,
  options: [
    { text: "Strongly aligned — I can articulate it and connect it to my daily work", votes: 18, pct: 53, color: "var(--sum-green)" },
    { text: "Somewhat aligned — I understand it but struggle to connect it to my role", votes: 11, pct: 32, color: "var(--sum-gold)" },
    { text: "Not aligned — The FORMULA sessions didn't change my understanding", votes: 5, pct: 15, color: "var(--sum-red)" },
  ],
  intelligence: "53% of respondents feel strongly aligned after FORMULA sessions. The 32% who understand but can't connect to their role = your next S.U.M. campaign priority.",
};

export interface StoryRiff {
  id: number;
  author: string;
  avatar: string;
  days: number;
  votes: number;
  hivePoints: number;
  body: string;
  contributionType: string;
  fieldFilled?: string;
}

export interface StoryPost {
  id: number;
  title: string;
  author: string;
  dept: string;
  avatar: string;
  days: number;
  votes: number;
  status: string;
  brandFlag: string | null;
  types: string[];
  tags: string[];
  body: string;
  solve: Record<string, string> | null;
  fieldsCompleted: number;
  riffs: StoryRiff[];
  loved: boolean;
  aiNote?: string;
}

export const STORY_POSTS: StoryPost[] = [
  { id: 1, title: "Structured Referral Program", author: "Priya Patel", dept: "Product", avatar: "PP",
    days: 3, votes: 23, status: "voting", brandFlag: null,
    types: ["IDEA"], tags: ["referral", "Q2-launch"],
    body: "A tiered referral reward system mapped to our loyalty spectrum. Move customers from Acceptable → Loyal systematically.",
    solve: {
      Delight: "Customers feel rewarded for evangelizing — and the reward scales with their loyalty tier.",
      Experience: "One-tap share, automatic credit, real-time tier progress visible to the customer.",
      Surprise: "",
      Inspire: "It turns customers into measurable advocates instead of hoping word-of-mouth happens.",
      Resonate: "",
      Evangelize: "",
    },
    fieldsCompleted: 3,
    riffs: [
      { id: 11, author: "Sarah Chen", avatar: "SC", days: 2, votes: 8, hivePoints: 3,
        body: "Filling in the SURPRISE field — what if the reward unlocks a personalized thank-you video from the team member who served them best? Surprise factor is real, costs us nothing.",
        contributionType: "field-completion", fieldFilled: "Surprise" },
      { id: 12, author: "Marcus Williams", avatar: "MW", days: 1, votes: 4, hivePoints: 2,
        body: "Strong concept but we need to think about pricing impact. If we give 20% off for referrals, our gross margin compresses. Suggest tiered: 5% / 10% / 15% based on customer LTV tier.",
        contributionType: "refinement" },
    ],
    loved: false },
  { id: 2, title: "Monthly 'Ask Anything' Town Hall with CEO", author: "Alex Rivera", dept: "Product", avatar: "AR",
    days: 8, votes: 31, status: "approved", brandFlag: null,
    types: ["IDEA", "D.E.S.I.R.E."], tags: ["culture", "leadership", "transparency"],
    body: "30 minutes, no slides, no agenda. Any employee can ask anything. Recorded for those who can't attend live.",
    solve: {
      Delight: "Employees feel heard — direct line to the top, no filter.",
      Experience: "Casual, no-slides, raw conversation. Recorded so async employees aren't excluded.",
      Surprise: "CEO commits to answering every question, even the uncomfortable ones.",
      Inspire: "It signals that leadership is confident enough to be transparent.",
      Resonate: "It addresses the silence that builds when leadership hides.",
      Evangelize: "Employees tell prospects 'Our CEO does monthly Q&As' and that becomes a recruiting differentiator.",
    },
    fieldsCompleted: 6,
    riffs: [
      { id: 21, author: "Jordan Lee", avatar: "JL", days: 6, votes: 5, hivePoints: 1,
        body: "Brilliant. Encouragement: this is exactly the kind of trust signal a 50-person company needs.",
        contributionType: "encouragement" },
    ],
    loved: true },
  { id: 3, title: "Free Beer Friday for the office", author: "Sam Quinn", dept: "Sales", avatar: "SQ",
    days: 1, votes: 2, status: "brand-review", brandFlag: "BRAND REVIEW PENDING",
    types: ["IDEA"], tags: ["culture"],
    body: "Free beer in the office every Friday afternoon to boost morale.",
    solve: null,
    fieldsCompleted: 0,
    riffs: [],
    aiNote: "GESTALT INTELLIGENCE flagged: alcohol-related perks may conflict with brand values around 'high performance under pressure' and create legal/HR exposure in some jurisdictions. Routed for management review.",
    loved: false },
];

export const WEEKLY_STATUS = {
  status: "green",
  count: 4,
  target: 3,
  qualityAvg: 78,
  trend: "up",
};

export const PENDING_REMINDERS = [
  { id: "r1", at: "Mar 4, 2026 12:00 PM", label: "Call Brad about pricing", source: "entry: Pricing page confusion" },
  { id: "r2", at: "Mar 5, 2026 9:30 AM", label: "Review with Sarah", source: "entry: Pricing page confusion" },
  { id: "nr1", at: "Mar 4, 2026 12:00 PM", label: "Call Brad", source: "note: Call Brad TODAY" },
  { id: "nr3", at: "Apr 5, 2026 10:00 AM", label: "Renew SSL cert", source: "note: Renew SSL cert" },
  { id: "nr8", at: "Mar 7, 2026 9:00 AM", label: "Send Greenway deck", source: "note: Investor follow-up" },
];

export interface GiLink { label: string; target: string; }
export interface GiMessage {
  id: string;
  type: "narration" | "nudge" | "response" | "user";
  role: "ai" | "user";
  text: string;
  links?: GiLink[];
  timestamp: string;
  savedTo?: "vault" | "timeline";
  frankMode?: boolean;
}

export const GI_SEED_MESSAGES: GiMessage[] = [
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

export const GI_SUGGESTIONS = [
  "Show me this week's wins",
  "What should I focus on?",
  "Walk me through my B.A.S.E. score",
  "Where's my biggest valuation gap?",
];

export const GI_DEMO_RESPONSES: Record<string, { text: string; links?: GiLink[]; frankMode?: boolean }> = {
  "Show me this week's wins": {
    text: "Three things lit up this week: (1) **Codat invoice** got resolved — your usage tier is correct, no overage. (2) **Sarah's onboarding feedback** flagged a real issue with H.I.V.E. interview pacing in week 2 — worth a look. (3) Your team helped each other in #marketing-questions five times this week — quietly, without being asked. That's the participation pattern that drives the highest GESTALT scores.",
    links: [{ label: "Codat invoice", target: "note:n6" }, { label: "Sarah's onboarding feedback", target: "note:n5" }],
  },
  "What should I focus on?": {
    text: "If I had to pick one: **answer FRAMEWORK Q9.** Three reasons. First, it's the highest-leverage unanswered question in your assessment — every other score depends on it. Second, the friction it surfaces is already showing up in your customer conversations (your journal entry from Mar 2 noticed exactly this). Third, you've been around it three times this week without resolving. Want me to walk through it with you now?",
    links: [{ label: "FRAMEWORK Q9", target: "framework-q9" }, { label: "your journal entry from Mar 2", target: "journal:2" }],
  },
  "Walk me through my B.A.S.E. score": {
    text: "Your B.A.S.E. score is **71/100**. Breakdown: FRAMEWORK 14/21 (10% weight), FOCUS 71/100 (50% weight), FORMULA 68/100 (20% weight), FINANCIALS 84/100 (20% weight). The score is held back by FOCUS — specifically the PERCEPTION pillar at 14/20. Can I be frank? You've been improving FORMULA when the leverage is in FOCUS. Want me to explain why that's happening?",
    links: [{ label: "FOCUS", target: "focus" }, { label: "PERCEPTION pillar", target: "focus-perception" }, { label: "FORMULA", target: "formula" }],
    frankMode: true,
  },
  "Where's my biggest valuation gap?": {
    text: "**$847K**, sourced from FRAMEWORK Q9 + the FOCUS PERCEPTION pillar. Both point at the same root cause: customers can't easily understand your pricing before the first call. This shows up in your Mar 2 journal entry, your Pricing Workstream notes, and the silo alert between Pricing and Marketing in METRICS. Three signals, same root.",
    links: [
      { label: "FRAMEWORK Q9", target: "framework-q9" },
      { label: "Pricing Workstream notes", target: "folder:f2" },
      { label: "silo alert", target: "metrics-silo" },
    ],
  },
};

export const GI_NARRATIONS: Record<string, { full: string; short: string }> = {
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
    full: "**NOTES** — your wall of quick captures. Color-code, sort, drag into folders. Lighter than journal entries — for thoughts you don't want to structure yet.",
    short: "Back in NOTES.",
  },
};

export const GI_TAB_LABELS: Record<string, string> = {
  chat: "CHANNELS",
  slideshow: "DAILY SLIDESHOW",
  journal: "PERSONAL JOURNAL",
  stories: "STORY ENGINE",
  polls: "POLLS",
  metrics: "METRICS",
  notes: "NOTES",
};

export const METRICS_DATA = {
  sumScore: { value: 67, change: 5, label: "S.U.M. Score" },
  participation: { value: 78, change: 14, label: "Participation %" },
  ideaFlow: { value: 23, change: 7, label: "Ideas / Month" },
  siloAlert: {
    title: "Pricing ↔ Marketing silo detected",
    body: "Cross-functional communication between Pricing and Marketing has dropped 34% over the last 18 days. Last meaningful exchange was Feb 12. Pricing decisions made without market context historically correlate with 12-15% margin compression next quarter.",
    cta: "Schedule sync within 72h",
  },
};
