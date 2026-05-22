// ═══════════════════════════════════════════════════════════════
// FORMULA v80 — STRATEGY MEASURED
// Ported from references/new-features/GPS/GPS-FORMULA-04-19-v80.jsx
// Data + scoring engines. Keep colors as raw hex — Tailwind arbitrary values
// reference these directly because the source mockup encodes brand-specific
// hues (perspective colors, journey-stage colors, S+D+I) that are not in the
// global token system. Where a semantic token exists (`text-gold` etc.), the
// component uses it; where it does not, this hex is consumed via arbitrary
// `text-[#xxxxxx]` classes.
// ═══════════════════════════════════════════════════════════════

// ── ACRONYM GLOSSARY — render as ACRONYM (Full Name) on first use ─
export const TERMS: Record<string, string> = {
  ICP: "Ideal Customer Profile",
  ARR: "Annual Recurring Revenue",
  MRR: "Monthly Recurring Revenue",
  EBITDA: "Earnings Before Interest, Taxes, Depreciation & Amortization",
  KPI: "Key Performance Indicator",
  ROI: "Return on Investment",
  CSM: "Customer Success Manager",
  CRM: "Customer Relationship Management",
  NPS: "Net Promoter Score",
  CAC: "Customer Acquisition Cost",
  LTV: "Lifetime Value",
  OKR: "Objectives & Key Results",
  SLA: "Service Level Agreement",
  GTM: "Go-To-Market",
  M_A: "Mergers & Acquisitions",
  SDI: "Surprise, Delight & Inspire",
  RUD: "Relevant, Useful & Desirable",
  BASE: "Brand and Strategy Engine",
  HIVE: "Human Insight Valuation Engine",
  SUM: "Strategic Unified Messaging",
  QBR: "Quarterly Business Review",
  P_L: "Profit & Loss",
};

/** Render an acronym as `KEY (Full Name)`. */
export const T = (key: string): string => `${key} (${TERMS[key] || key})`;

// ── TYPOGRAPHY / SPACING FLOORS (canonical platform constants) ──
export const MIN_FONT = { label: 11, body: 14, input: 22, score: 36, micro: 9, button: 10 } as const;
export const MIN_SPACING = { cardPad: 20, sectionGap: 24, labelGap: 8, blockGap: 16, pageSide: 48, actionPad: 14 } as const;

// ── WORD-COUNT ENFORCER ────────────────────────────────────────
// Trims any text to 50 words at the last clean sentence boundary.
export function trimTo50(text: string): string {
  if (!text) return text;
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 50) return text.trim();
  for (let i = 50; i >= 38; i--) {
    const candidate = words.slice(0, i).join(" ");
    if (/[.!?]$/.test(candidate)) return candidate;
  }
  return words.slice(0, 50).join(" ").replace(/[,;:\s—]+$/, "") + ".";
}

// ── JOURNEY STAGES (7-stage customer journey) ─────────────────
export interface JourneyStage {
  id: string;
  label: string;
  color: string;
  desc: string;
  question: string;
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "trigger", label: "TRIGGER", color: "#5d1414",
    desc: "They don't know they need you yet. What event, emotion, or disruption creates the initial spark?",
    question: "What life event, market shift, or emotional trigger makes someone receptive to what you offer — even before they know you exist?",
  },
  {
    id: "consider", label: "CONSIDER", color: "#8b3a00",
    desc: "They know they have a need. You're one of many options. Why should they keep you in the running?",
    question: "What makes someone include you in their consideration set? What 3-4 touchpoints do they need before you move from 'maybe' to 'probably'?",
  },
  {
    id: "search", label: "SEARCH", color: "#c45c00",
    desc: "Active research mode. They're comparing. Your brand must be findable, credible, and differentiated.",
    question: "Where do they search? What do they type? What do they ask their friends? What must they find when they look for you?",
  },
  {
    id: "choose", label: "CHOOSE", color: "#e2b53f",
    desc: "Decision point. Price, trust, experience, and gut feeling all converge. What tips the scale?",
    question: "What is the single decisive factor? Is it a guarantee, a referral, a demo, a price point, or a feeling they can't articulate?",
  },
  {
    id: "engage", label: "ENGAGE", color: "#5a8a3a",
    desc: "They're a customer. First experience defines everything. The brand promise must be delivered — or exceeded.",
    question: "What does the first 24 hours, first week, and first month look like? Where does delight happen? Where are the friction points?",
  },
  {
    id: "advocate", label: "ADVOCATE", color: "#9aca3e",
    desc: "They love you. They tell people. Not because you asked — because they can't help it.",
    question: "What makes them share? What story do they tell? What tool, moment, or experience becomes their 'you have to try this' moment?",
  },
  {
    id: "influence", label: "INFLUENCER", color: "#58d3ff",
    desc: "They don't just recommend — they actively convert others. They become part of your marketing team.",
    question: "How do you empower them? What do you give them to share? How do you recognize and reward their advocacy? This is where the flywheel spins.",
  },
];

// ── SECTIONS (FORMULA tab/sub-nav grouping) ───────────────────
export interface SectionItem {
  id: string;
  label: string;
}
export interface SectionGroup {
  group: string;
  items: SectionItem[];
}

export const SECTIONS: SectionGroup[] = [
  {
    group: "ALIGNING DIALOGUE",
    items: [
      { id: "01.10", label: "Competitive Landscape" },
      { id: "01.20", label: "Business Objectives" },
      { id: "01.30", label: "Barriers & Challenges" },
    ],
  },
  {
    group: "BRAND EXPERIENCE",
    items: [
      { id: "02.10", label: "Target Audiences" },
      { id: "02.20", label: "Customer Experience" },
      { id: "02.30", label: "Brand Architecture" },
    ],
  },
  {
    group: "INTERACTION CAMPAIGNS",
    items: [
      { id: "03.10", label: "Channel Strategy" },
      { id: "03.20", label: "Campaign Builder" },
      { id: "03.30", label: "Success Measures" },
    ],
  },
  {
    group: "NEXT STEPS",
    items: [{ id: "04.10", label: "Launch Action Plan" }],
  },
];

export const ALL_SECTION_IDS: string[] = SECTIONS.flatMap((s) => s.items.map((i) => i.id));

// ── PAGE HEADERS — every page (and sub-step inside 01.10) ─────
export interface PageHeader {
  headline: string;
  statNum: string;
  statLabel: string;
  source: string;
  sub: string;
  payoff: string;
}

export const PAGE_HEADERS: Record<string, PageHeader> = {
  "01.10": { headline: "Words Are Your Operating System.", statNum: "3.5×", statLabel: "More Likely to Achieve Strategic Alignment", source: "McKinsey & Company", sub: "BUILD 100 REASONS FOR DOING BUSINESS WITH YOU — START WITH THE WORDS", payoff: "Companies with documented brand vocabulary don't drift — they execute. Your word stack becomes the benchmark every campaign, hire, and creative decision is measured against. The companies that can't agree on 6 words can't agree on a $50M exit strategy." },
  "01.10_1": { headline: "Words Are Your Operating System.", statNum: "3.5×", statLabel: "More Likely to Achieve Strategic Alignment", source: "McKinsey & Company", sub: "YOUR BRAND VOCABULARY IS YOUR COMPETITIVE WEAPON", payoff: "The company that owns the vocabulary owns the conversation. Your word stack isn't messaging — it's infrastructure. Every campaign, every hire, every creative brief gets filtered through these words. The market leaders don't describe what they do differently. They name things others don't have words for yet. Start here." },
  "01.10_A": { headline: "This Is the First Entry in Your Knowledge Bank.", statNum: "3.5×", statLabel: "More Likely to Achieve Strategic Alignment", source: "McKinsey & Company", sub: "EVERY WORD FROM HERE COMPOUNDS", payoff: "In 50 words, name what your business is and who it is for. This is not a marketing exercise. It is the first durable record in the evidence stack that eventually sits in your acquirer's data room. Every coaching answer, observation, and audit finding you write from this moment on will be triangulated against these 50 words — and every GESTALT INTELLIGENCE prompt that follows is calibrated to them. Write what is verifiably true today and will still be true in twelve months. Vague dies in the first cross-check. Specific compounds." },
  "01.10_B": { headline: "The 10 Words That Run Your Company.", statNum: "2.3×", statLabel: "Higher Employee Engagement in Companies With Documented Brand Values", source: "Gallup Workplace Study", sub: "SELECT YOUR OPERATING SYSTEM", payoff: "Every company says they have values. Almost none have documented them as a ranked, specific, un-gameable word stack. The 10 words you choose here become the filter every campaign gets run through, the standard every hire is measured against, and the vocabulary every client uses to describe you. Choose words you actually operate by — not aspirational words that only exist in the conference room." },
  "01.10_C": { headline: "Word 1 Is Non-Negotiable.", statNum: "89%", statLabel: "of High-Performing Teams Can Articulate Their Company's Top Priority Without Prompting", source: "Bain & Company", sub: "ORDER IS THE OPERATING SYSTEM", payoff: "The difference between a company with a word stack and a company with a ranked word stack is the difference between knowing your values and knowing your hierarchy. Word 1 is the thing you will never compromise on. Word 10 is the closing argument. Drag until the order reflects the honest truth — not the aspirational version. This ranking is what every future conflict resolution, hiring decision, and brand brief runs through." },
  "01.10_D": { headline: "Your Brand Voice Is the Moat.", statNum: "4.7×", statLabel: "Higher Revenue for Companies With a Consistent Brand Voice Across All Channels", source: "Lucidpress Brand Consistency Report", sub: "DEFINE IT IN YOUR WORDS, NOT A TEMPLATE", payoff: "GESTALT INTELLIGENCE has drafted the narrative from your 10 words. Now make it yours. Edit every sentence until it sounds like your company at its best — confident, specific, and impossible to confuse with a competitor. This is the brief every campaign will be written against, every new hire will read on day one, and every buyer will reference in their acquisition thesis. When it sounds undeniably like you, it's done." },
  "01.10_2": { headline: "Category Leaders Don't Compete. They Define.", statNum: "2.1×", statLabel: "Higher Brand Recall for Companies With a Documented Word Stack", source: "Nielsen Brand Resonance Study", sub: "SORTED WORDS BECOME SORTED STRATEGY", payoff: "Categorizing your words isn't busywork — it's the moment strategy becomes visible. When your team can agree on which words are core DNA versus aspirational, you've just done something most companies never do: defined what you actually stand for versus what you wish you stood for. That clarity is worth money at exit." },
  "01.10_3": { headline: "Vision Is the Original Competitive Moat.", statNum: "15×", statLabel: "Outperformance Over 20 Years for Companies With a Documented Vision", source: "Collins & Porras, Built to Last", sub: "THE MAP THAT MAKES YOU UNMISSABLE", payoff: "The context map isn't about defining your present — it's about staking out your future. Companies that articulate a clear vision attract talent who want to build something, customers who want to belong to something, and buyers who want to own something defensible. You're not writing copy. You're casting a vision your entire industry will navigate around." },
  "01.10_4": { headline: "Order Is Power.", statNum: "89%", statLabel: "of High-Performing Teams Can Name Their Company's Top 3 Priorities Without Prompting", source: "Bain & Company, Alignment Study", sub: "RANKED WORDS BECOME RANKED DECISIONS", payoff: "Ranking your words forces the hierarchy every company pretends it has but rarely documents. When any employee in your organization faces a conflict between two good options, the word stack tells them which one wins. That's not brand work — that's operational clarity. And operational clarity is exactly what buyers pay a premium for at exit." },
  "01.10_5": { headline: "You Can't Disrupt What You Don't Understand.", statNum: "67%", statLabel: "of Market Leaders Lost Their Position to a Company That Entered Their Space With Better Positioning", source: "Harvard Business Review, Disruption Index", sub: "KNOW THE ENEMY. BECOME THE THREAT.", payoff: "The competitor you should fear most isn't the one with the biggest budget — it's the one with the sharpest words. This step forces you to document how the market perceives your competition, find the gaps they haven't named, and position your company as the one that makes their entire strategy obsolete. You don't compete from this word stack. You dominate with it." },
  "01.10_6": { headline: "Strategy Without Intelligence Is Just Opinion.", statNum: "9.4×", statLabel: "Higher Win Rate for Companies Running Active Competitive Intelligence Programs", source: "Crayon Annual State of Competitive Intelligence", sub: "EVIDENCE ENDS THE ARGUMENT", payoff: "Naming your competitors is the first step. Documenting exactly how they win, where they fail, what vocabulary they own, and what ground they have abandoned is the work that turns positioning from claim into proof. The dimensional scores, perception radar, and message matrix you generate here become the evidence stack that feeds your spectrum placement, your stakeholder audit, and the diligence package every acquirer reads first. Companies that win the next decade are not the ones with the most data — they are the ones who turn their competitor intelligence into one document the entire building agrees with." },
  "01.10_7": { headline: "Where You Stand Determines What You're Worth.", statNum: "2.8×", statLabel: "Higher Exit Multiple for Companies That Can Prove Differentiated Market Position", source: "Vista Equity Partners M&A Analysis", sub: "YOUR POSITION ON THE SPECTRUM IS YOUR EXIT ARGUMENT", payoff: "Buyers don't just buy revenue — they buy defensibility. A company that can show it is genuinely differentiated from competitors, with documented proof and stakeholder consensus, is worth significantly more than one that just claims it. The spectrum placement you're about to lock isn't an exercise. It's evidence." },
  "01.10_8": { headline: "Consensus Creates Culture. Culture Creates Value.", statNum: "4.4×", statLabel: "Higher Revenue Growth for Companies With Strong Cultural Alignment", source: "Deloitte Global Culture Survey", sub: "THE AUDIT THAT CHANGES WHAT YOUR TEAM BELIEVES", payoff: "When your stakeholders independently place your company and every competitor on the spectrum — and the data agrees — something shifts. The team stops arguing about strategy and starts executing it. That alignment is the foundation of a company that attracts A-players, repels mediocrity, and commands a premium because every person in it knows exactly what they're building and why it matters." },
  "01.20": { headline: "Where Are You Going, and Why?", statNum: "10×", statLabel: "More Likely to Reach Your Goals When Documented", source: "Harvard Business Review", sub: "BUSINESS OBJECTIVES — YOUR MEASURING STICK", payoff: "Document them or they don't exist. Without written objectives, every campaign runs on assumption and every dollar spent is a guess. Define the destination before you build the road." },
  "01.30": { headline: "What's Really Holding You Back?", statNum: "73%", statLabel: "of Failed Transformations Trace Back to Unaddressed Barriers", source: "McKinsey & Company", sub: "PEEL THE ONION — EVERY LAYER REVEALS A DEEPER TRUTH", payoff: "The barriers you won't name are the ones that will stop you. The honest conversation you have in this section is worth more than any strategy document you'll ever produce. Open the INSTRUCTIONS above for a step-by-step walkthrough." },
  "02.10": { headline: "Who Are You Really Talking To?", statNum: "2.3×", statLabel: "Higher Conversion for Companies With Clearly Defined Audiences", source: "HubSpot + Bain & Company", sub: "PRIORITIZE BY REVENUE IMPACT — NOT DEMOGRAPHICS", payoff: "Not demographics. Real humans with real motivations. Define who you're actually talking to — not who you wish you were talking to. Every campaign and employee interaction filters through this lens forever." },
  "02.20": { headline: "Make Them Desire You.", statNum: "86%", statLabel: "of Buyers Will Pay More for Experience Than Product", source: "PwC Future of CX Report", sub: "D.E.S.I.R.E.™ — DELIGHT → EXPERIENCE → SURPRISE → INSPIRE → RESONATE → EVANGELIZE", payoff: "D.E.S.I.R.E.™ maps the six stages that turn a transaction into a movement. Map every stakeholder through each stage. Document 100 stories proving your culture delivers. Open the INSTRUCTIONS above for the full framework and step-by-step walkthrough." },
  "02.30": { headline: "Is Your Brand Ready For A 10× Exit?", statNum: "23%", statLabel: "Revenue Increase From Consistency Alone — No New Product. No New Campaign.", source: "Lucidpress", sub: "BRAND READINESS AUDIT", payoff: "Most business owners have a logo and a color they like. That's not a brand system. This section photographs your brand in the wild, assesses consistency across every touchpoint, and tells you whether your brand is ready to command a premium multiple — or quietly suppressing your valuation." },
  "03.10": { headline: "Right Message. Right Person. Right Channel. Right Time.", statNum: "32%", statLabel: "Higher Campaign Effectiveness From Right-Channeling", source: "Forrester + McKinsey", sub: "CHANNEL STRATEGY BUILDER", payoff: "Most businesses are on channels they shouldn't be, silent on channels they should own, and saying the same thing everywhere to everyone. This section maps every channel your brand touches, documents what you're actually saying, and identifies the gaps where your competitors are winning." },
  "03.20": { headline: "One Idea. Every Touchpoint. Zero Silos.", statNum: "3.2×", statLabel: "Higher Lifetime Value for Companies Mapping the Full Journey", source: "Deloitte + Vista Equity Partners", sub: "CAMPAIGN BUILDER", payoff: "Most companies think in one-offs — one ad, one email, one event. GESTALT thinks in campaigns. One idea deployed across every touchpoint, feeding the same D.E.S.I.R.E. outcome, compounding value at almost no extra cost." },
  "03.30": { headline: "If You Can't Measure It, You Can't Improve It.", statNum: "41%", statLabel: "Higher Exit Multiples for Companies Measuring All Four KPI Categories", source: "Vista Equity Partners", sub: "VISUAL KPI SCORECARD", payoff: "Most business owners have never measured anything beyond their end-of-year bank balance. This scorecard shows you exactly where you stand against real industry benchmarks — in plain English, with data backing every number. Green means you're ahead. Red means you're leaving money on the table." },
  "04.10": { headline: "Strategy Is Worthless Without Execution.", statNum: "2.7×", statLabel: "More Likely to Hit Revenue Targets With a Documented Launch Plan", source: "Project Management Institute", sub: "YOUR GO-TO-MARKET TIMELINE", payoff: "Everything you built in FORMULA becomes executable here. GESTALT INTELLIGENCE monitors every milestone and recalibrates based on your actual performance data." },
};

// ── TOUR / INSTRUCTION TIPS — collapsible per page ────────────
// v230 — rich-text instructions. InstructionBlock parses:
//   ALL CAPS line  → header
//   "Step N — …"   → step prefix + body
//   **bold**       → strong
export const TOUR_TIPS: Record<string, string> = {
  "01.10_A": "WHAT TO DO\n**Write 50 words max** — what your business does, who it serves, and what makes it worth choosing over the nearest alternative. Name specifics, not categories.\n\nWHY THIS RECORD MATTERS\nThis description is the seed for every coaching answer, declaration, and audit finding from this point forward. Your acquirer inherits it. **Write what you're prepared to defend under diligence.**\n\nHOW TO WRITE IT\nStep 1 — **Name what you do.** Not your industry — your specific action.\nStep 2 — **Name who you serve.** Not everyone — your best customers.\nStep 3 — **Name what makes you different.** The thing a competitor can't copy in 90 days.",
  "01.10_B": "YOUR BRAND'S OPERATING SYSTEM\n**Your 10 words will become the filter every decision runs through.** Every campaign, hire, vendor, and creative direction will be scored against them. Choose words that are true today — not aspirational.\n\nHOW TO SELECT\nStep 1 — **Review the AI suggestions** at the top. A starting point, not a prescription.\nStep 2 — **Browse the full word board.** Click any word to add it. Use SHUFFLE for new options.\nStep 3 — **Select exactly 10.** Each word must earn its place.",
  "01.10_C": "THE HIERARCHY MATTERS\n**Word 1 is your non-negotiable conviction** — the thing you stand for above everything else. Word 10 is your closing argument.\n\nHOW TO ORDER\nStep 1 — **Drag to reorder.** Put your strongest conviction at position 1.\nStep 2 — **Test each position.** If we could only be known for one thing, is Word 1 it?\nStep 3 — **Lock it when it's honest.** Not when it sounds good — when it's actually true.",
  "01.10_D": "YOUR BRAND BRIEF\n**This narrative becomes the document every campaign is written against.** GESTALT INTELLIGENCE generated it from your 10 words.\n\nHOW TO FINALIZE\nStep 1 — **Read it aloud.** If it doesn't sound like your CEO talking to a potential acquirer, it needs work.\nStep 2 — **Edit directly.** Change any phrase or paragraph.\nStep 3 — **Use REGENERATE** if the tone is wrong. Each version is saved.\nStep 4 — **Submit when it's right.** This locks your brand vocabulary for everything that follows.",
  "01.10_step2": "WHAT THIS STEP DOES\nPlace each word in a brand dimension — PRODUCT, SERVICE, CULTURE, VALUE, CUSTOMER, or INTELLIGENCE. **This is the moment most companies never reach: seeing exactly what you stand for versus what you aspire to.**\n\nHOW TO COMPLETE\nStep 1 — **Drag each word** to the dimension it truly belongs in. Not where you want it — where it lives today.\nStep 2 — **Look for imbalances.** If CULTURE has 5 words and CUSTOMER has 0, your brand is internally focused.\nStep 3 — **Challenge every placement.** If you can't explain why a word lives in that dimension in one sentence, move it.",
  "01.10_step3": "FIVE DIMENSIONS. FIVE STORIES. ONE IDENTITY.\nEach dimension represents a different truth your brand must own.\n\nWHY THIS IS THE HARDEST WORK\n**A clear brand identity attracts the right people, repels the wrong ones, and tells every buyer exactly what they're acquiring.**\n\nHOW TO COMPLETE\nStep 1 — **For each dimension,** add words from your selected stack.\nStep 2 — **Generate the narrative.** GESTALT INTELLIGENCE writes the first draft.\nStep 3 — **Edit ruthlessly.** Confident, specific, impossible to mistake for a competitor.\nStep 4 — **Repeat for all 5.** Each must stand on its own and connect to the others.",
  "01.10_step4": "SIX WORDS. ONE HIERARCHY.\n**This is the operating system your entire organization runs on.** The order matters as much as the words.\n\nHOW TO COMPLETE\nStep 1 — **Select your top 6** from the 10 you chose. These are the non-negotiables.\nStep 2 — **Rank them honestly.** Not the aspirational version — the truth. Word 1 = highest conviction.\nStep 3 — **Test it.** Would you fire a top performer who violated Word 1? If not, it's not Word 1.\n\nTHE EXIT CONNECTION\n**The company that executes against a clear priority stack grows faster and exits at a higher multiple.**",
  "01.10_step5": "KNOW YOUR ENEMY\n**You don't win by being good. You win by being undeniably different** in the dimensions that matter most — and making that difference impossible to copy quickly.\n\nHOW TO COMPLETE\nStep 1 — **For each competitor,** select the words the market uses to describe them. Not claims — reality.\nStep 2 — **Rank their top 5.** Force the prioritization.\nStep 3 — **Study the competitive brief.** Where are their gaps? What ground is undefended?\nStep 4 — **Identify your moat.** The companies that dominate know who their competitors are NOT — and build there.",
  "01.10_step6": "You named your top three competitors. Now GESTALT INTELLIGENCE goes to work — pulling live public data, scoring every competitor across nine dimensions, and surfacing two additional competitors you may not have considered. The result is a five-competitor landscape report backed by cited sources, not opinion. Every score traces to evidence. Every claim has a URL. This is the document your acquirer reads first — and the one your team will finally agree on. Review the findings, edit where your market knowledge is sharper than the data, and approve each section before it flows downstream into your spectrum placement.",
  "01.10_step7": "POSITIONING BECOMES PROOF\nPlace each competitor — and yourself — on both spectrums. Be honest about where you are today versus where you're committed to going.\n\nHOW TO COMPLETE\nStep 1 — **Place yourself first.** Where does your brand actually sit today?\nStep 2 — **Place each competitor.** Same honest assessment.\nStep 3 — **Identify the gap.** The distance between TODAY and VISION is your strategy made visible.\nStep 4 — **Share with your team.** When the heat map shows agreement, you've documented a verified market position.\n\n**Buyers don't pay premiums for claims — they pay for proof.**",
  "01.10_step8": "THE ALIGNMENT AUDIT\n**Strategy without alignment is just a slide deck.** This audit asks your stakeholders — independently, anonymously — to place every entity on the spectrum.\n\nWHAT THE HEAT MAP TELLS YOU\n**Tight clusters** = conviction. Your team agrees.\n**Wide spreads** = misalignment that costs money.\n\nWHY IT MATTERS\nWhen your team agrees on where you stand and where you're going, culture shifts. Execution accelerates. **Alignment at this level is exactly what acquirers pay a premium to inherit.**",
  "01.10": "WHAT THIS SECTION DOES\nThis is the foundation of everything. You'll build your brand vocabulary — the 10 words that define who you are, map them across brand dimensions, identify your competitive position, and generate the narrative brief every decision is measured against.\n\nWHY IT MATTERS TO YOUR EXIT\nCompanies with documented brand vocabulary are **3.5× more likely to achieve strategic alignment** (McKinsey). Acquirers don't buy what you make — they buy what you stand for.\n\nHOW TO COMPLETE\nStep 1 — **WORD BOARD.** Write your business description (50 words max), then select 10 words that define your brand.\nStep 2 — **CATEGORIZE.** Place each word in a brand dimension.\nStep 3 — **CONTEXT MAP.** Generate the narrative for each dimension. Edit until it sounds like your company at its best.\nStep 4 — **PRIORITIZE.** Rank your 6 most important words. Word 1 is your highest conviction.\nStep 5 — **COMPETITION.** Select competitor brand words and rank their top 5.\nStep 6 — **INTELLIGENCE.** AI-powered competitive analysis across 9 dimensions.\nStep 7 — **SPECTRUM.** See where your brand sits on Customer Experience and Innovation spectrums.\nStep 8 — **AUDIT.** Review your complete brand story. Lock it.\n\nTHE BOTTOM LINE\n**The companies that can't agree on 6 words can't agree on a $50M exit strategy.** This section forces that agreement.",
  "01.20": "WHAT THIS SECTION DOES\nEvery business has goals. Most live in the owner's head and change every Tuesday. This section forces you to write them down, document HOW you'll achieve each one, and attach specific initiatives with owners and timelines.\n\nWHY IT MATTERS TO YOUR EXIT\n**Documented objectives are 10× more likely to be achieved** (Harvard Business Review). Acquirers evaluate management quality by goal-setting discipline. Written objectives + tracked initiatives = a team that executes without the founder.\n\nHOW TO COMPLETE\nStep 1 — **Write 2–3 objectives.** Not 10. The right number forces prioritization.\nStep 2 — **Document the HOW.** 'Grow revenue' is a wish. 'Acquire 50 new accounts through LinkedIn outreach' is a strategy.\nStep 3 — **Add initiatives.** Each one needs a specific action, a timeline, and an owner.\nStep 4 — **Sign off** when every objective has a real HOW and real initiatives.\n\nTHE BOTTOM LINE\n**If your objectives aren't written down, they don't exist.** Every campaign, metric, and milestone in FORMULA traces back to what you write here.",
  "01.30": "WHAT THIS SECTION DOES\nEvery business has barriers it won't name. This section names them. You'll identify what's actually holding your company back, assign root causes, write mitigation strategies, and connect each barrier to the objectives it threatens.\n\nWHY IT MATTERS TO YOUR EXIT\n**73% of failed transformations trace back to unaddressed barriers** (McKinsey). Acquirers perform diligence specifically to find the problems you didn't fix.\n\nHOW TO COMPLETE\nStep 1 — **Read each barrier category** and its root causes. Edit them to be specific to YOUR business.\nStep 2 — **Write the strategy.** Click WRITE STRATEGY on any root cause. Describe the action, the person responsible, and the deadline.\nStep 3 — **Create the project.** Click CREATE PROJECT to turn it into a tracked initiative with an assigned owner.\nStep 4 — **Link to objectives.** Select every Business Objective this barrier threatens.\nStep 5 — **Repeat for every root cause.** Then sign off.\n\nTHE BOTTOM LINE\n**The barriers you won't name are the ones that will stop you.** Naming them here — with strategies, owners, and deadlines — is the difference between a company that transforms and one that talks about it.",
  "02.10": "WHAT THIS SECTION DOES\nMost businesses describe their customers as demographics — 'women 25-54' or 'small business owners.' That's not an audience — that's a census category. This section forces you to define each audience as a real human with real motivations.\n\nWHY IT MATTERS TO YOUR EXIT\n**Companies with clearly defined audiences convert at 2.3× the rate** (HubSpot + Bain). Acquirers evaluate customer concentration and segment clarity.\n\nHOW TO COMPLETE\nStep 1 — **Define each audience** as a real person. Give them a motivation and a pain point.\nStep 2 — **Write the Brand Promise** (emotional) and **Value Proposition** (rational) for each.\nStep 3 — **Map the journey.** Document what they THINK, FEEL, and DO at each of the 7 stages.\nStep 4 — **Prioritize by revenue impact.** Rank by lifetime value, not ease of reach.\n\nD.E.S.I.R.E. CONNECTION\nEvery audience moves through the D.E.S.I.R.E. flywheel differently. The journey map you build here feeds directly into the Campaign Builder.",
  "02.20": "WHAT THIS SECTION DOES\nD.E.S.I.R.E.™ maps the six stages that turn a transaction into a movement. Every brand that commands premium pricing and 10× exit multiples has one thing in common: **their stakeholders don't just buy — they recruit.**\n\nWHY IT MATTERS TO YOUR EXIT\n**86% of buyers will pay more for experience than product** (PwC). Acquirers evaluate customer experience as a leading indicator of retention, referral rate, and lifetime value.\n\nTHE SIX STAGES\n**D — DELIGHT.** The first moment someone encounters something unexpectedly positive. The spark.\n**E — EXPERIENCE.** Every touchpoint, every handoff, every follow-through. Promises kept or broken.\n**S — SURPRISE.** The gap between what was promised and what was delivered. The most powerful brand accelerator.\n**I — INSPIRE.** When your brand moves people beyond satisfaction into aspiration.\n**R — RESONATE.** When your brand becomes part of someone's identity. Switching costs become emotional.\n**E — EVANGELIZE.** The outcome. Stakeholders become your unpaid marketing force.\n\nHOW TO COMPLETE\nStep 1 — **Expand each stage.** For every D.E.S.I.R.E. stage, map what four stakeholder groups THINK, FEEL, and DO.\nStep 2 — **Confirm each stage** when all fields are complete.\nStep 3 — **Document your 100 Stories.** Each story is proof that your culture delivers at a specific stage. Real examples — not hypotheticals.\nStep 4 — **Sign off** when all 6 stages are confirmed and at least 5 stories are documented.\n\nTHE BOTTOM LINE\n**Stories are the only proof that scales.** An acquirer can't sit in your lobby for a week. But they can read 100 documented moments where your brand delivered. That's due diligence gold.",
  "02.30": "WHAT THIS SECTION DOES\nThis is your brand under a microscope. Photograph or screenshot every brand touchpoint and answer honest Yes/No questions about consistency.\n\nWHY IT MATTERS TO YOUR EXIT\n**Consistently presented brands see a 23% revenue increase from consistency alone** (Lucidpress). Acquirers perform visual brand audits as standard diligence.\n\nHOW TO COMPLETE\nStep 1 — **Upload evidence.** Go through each of the 20 touchpoints across 6 categories. Upload photos as they exist TODAY.\nStep 2 — **Answer the self-assessment.** Yes/No per touchpoint. Binary. Consistent or not.\nStep 3 — **Review your Brand Readiness Score.** BRAND READY ≥70% / NEEDS ATTENTION 40-69% / AT RISK <40%.\nStep 4 — **Use Presentation Mode** to share with your team. Anonymous 1-10 voting reveals perception gaps.\nStep 5 — **Send approved assets to VAULT.** This page is the diagnostic — VAULT is where approved assets live.\n\nTHE BOTTOM LINE\n**Most business owners have a logo and a color they like. That's not a brand system.** The gap between what you think your brand looks like and what it ACTUALLY looks like is where the money is hiding.",
  "03.10": "WHAT THIS SECTION DOES\nEvery channel your brand uses — website, email, social media, events, signage — is saying something to someone. This section makes you document exactly what that message is, who owns it, and whether it's consistent with your brand promise.\n\nWHY IT MATTERS TO YOUR EXIT\nAcquirers look at channel strategy as a signal of operational maturity. A business that can show 'here are our 8 active channels, here's the message on each, here's who owns them, and here's how consistent we are' commands a premium. A business that says 'we post on Facebook sometimes' does not.\n\nHOW TO COMPLETE\n\nStep 1 — Go through each category (Digital, Direct, Content, Experience). For every channel, ask: 'Are we actually active here TODAY?' Not 'should we be' — ARE we. Mark it ACTIVE or INACTIVE honestly.\n\nStep 2 — For every ACTIVE channel, write your current message. Not what you wish you were saying — what you're ACTUALLY saying right now. One sentence. If you can't articulate it, that's a finding.\n\nStep 3 — Set the frequency (how often you show up) and assign an owner (who's responsible). No owner = no strategy. A channel without an owner is a channel running on accident.\n\nStep 4 — Rate brand consistency 1-10. Does this channel look, sound, and feel like the same brand as every other channel? Be honest.\n\nStep 5 — Review the Channel Gap Matrix at the bottom. It shows which audiences and journey stages have NO channel coverage. These are the gaps your competitors exploit.\n\nStep 6 — Review the AI analysis. GESTALT INTELLIGENCE will suggest message revisions tailored to each audience on each channel, highlight inconsistencies, and recommend where to invest next.\n\nD.E.S.I.R.E. CONNECTION\nEvery channel serves a stage in the D.E.S.I.R.E. flywheel. Your website might DELIGHT (first impression), your email might build EXPERIENCE (ongoing relationship), your referral program might drive EVANGELIZE (others selling for you). The AI tags each channel to its D.E.S.I.R.E. stage automatically.",
  "03.20": "THE GESTALT CAMPAIGN PHILOSOPHY\n**You don't do anything in a silo. Everything is a campaign.**\nA campaign doesn't have to be expensive. A **QR code on a WiFi password card** that links to a review page costs almost nothing — but it **runs 24/7**, silently converting every visitor into a potential advocate.\nA thoughtfully designed **coffee station in the lobby** for patients' families costs a few hundred dollars a month — but it **builds trust, reduces anxiety**, and earns word-of-mouth that no ad budget can buy.\nTHINK IN SYSTEMS\n**One great idea can germinate across the entire company.** The same QR concept that works on a WiFi card also works on receipts, email signatures, bathroom mirrors, lobby screens, take-home bags, and vehicle wraps.\nThat's **not seven campaigns** — it's **one campaign with seven touchpoints**, all feeding the same D.E.S.I.R.E. outcome at almost no extra cost per touchpoint.\nThat's the GESTALT difference: **think in systems, not one-offs.** Every initiative — from a $50 WiFi card to a $100K billboard partnership — follows the same D.E.S.I.R.E. framework, has specific deliverables with owners, and defines a measurable outcome.\nHOW TO BUILD A CAMPAIGN\nStep 1 — **Start with the idea.** What did you see? What inspired you? Upload a photo. Describe the vision. It can be as small as a branded pen or as large as a stadium sponsorship.\nStep 2 — **Connect it to D.E.S.I.R.E.** Adopt an existing story from the Story Engine, or map how this specific campaign moves through all 6 stages: Delight → Experience → Surprise → Inspire → Resonate → Evangelize.\nStep 3 — **Select your channels.** A WiFi card is Physical Space. A billboard is Signage. An email drip is Digital. Most campaigns should touch multiple channels.\nStep 4 — **List every deliverable.** Every physical or digital thing that needs to be designed, printed, installed, coded, or launched. Assign an owner and a due date. **No owner = no accountability = no execution.**\nStep 5 — **Set budget and timeline.** Even a $0 campaign has a timeline. Know when it starts, when it ends, and how much it costs.\nStep 6 — **Define the desired outcome.** Not 'get more awareness' — **'15 new Google reviews within 30 days.'** Specific. Measurable. Tied to D.E.S.I.R.E.\nStep 7 — **Share it.** Send the draft to whoever is executing. They can modify the D.E.S.I.R.E. strategy and finalize deliverables.\nTHE LITMUS TEST\n**Every campaign should answer one question:**\n**What is the one thing we want people to DO after this?**\nIf you can't answer that in one sentence, the campaign isn't ready.",
  "03.30": "WHY THIS MATTERS TO YOUR EXIT\n**Acquirers don't buy stories. They buy numbers.** Every metric on this page directly impacts your exit multiple. Companies that can show 12+ months of tracked KPIs across all four categories — Visibility, Engagement, Conversion, and Loyalty — command **41% higher multiples** than those who can't.\nMost business owners have never measured anything beyond their bank balance. That ends here.\nHOW TO USE THIS SCORECARD\nStep 1 — **Start with what you know.** You probably know your revenue and maybe your review count. Enter those first. Use the drag sliders or type directly.\nStep 2 — **Look up what you don't know.** Each metric has an input hint telling you exactly where to find the number — Google Analytics, your email platform, your CRM. If you don't have a CRM, that's a finding.\nStep 3 — **Compare against benchmarks.** The visual bar shows industry averages with real sources. Green = you're ahead. Gold = you're close. Red = this is costing you money.\nStep 4 — **Verify every number.** Click the verify checkbox on each metric you've confirmed. Automated data still needs human eyes. The AI weights verified numbers higher than unverified.\nStep 5 — **Track over time.** Use the WOW/MOM/QOQ/YOY toggle to see trends. Log key milestones — hires, campaigns, partnerships — so you can see what caused the movement.\nAUTOMATION\nWhen Codat and Google Analytics connect, most numbers **auto-populate** and show the last sync timestamp. You can hit **UPDATE** anytime to pull fresh data. But **every auto-populated number requires human sign-off** — automated data is only as good as the source.\nREVIEW PLATFORMS\nGoogle, Yelp, TrustPilot, and Facebook reviews are tracked separately because **each platform reaches a different buyer at a different stage.** A Google review influences search. A Yelp review influences dining. A TrustPilot review influences B2B. Track all of them.\nREVENUE STREAMS\nBreak revenue into streams — by product, service, channel, or customer type. When one stream grows and another shrinks, that's intelligence. When Codat connects, streams auto-separate from your accounting data.\nTHE BOTTOM LINE\n**Red metrics are where your competitors are winning.** Fix those first. Green metrics are your moat — protect and amplify them. Every number on this page feeds your GESTALT Score.",
  "04.10": "YOUR EXECUTION TIMELINE\n**Strategy without execution is a hobby.** This is where everything you've built becomes real.\nEvery milestone below connects back to a specific FORMULA section. The brand architecture you documented in 02.30 becomes the deliverable in Week 1. The campaigns you designed in 03.20 launch in Month 2. The KPIs you baselined in 03.30 become the measurement framework.\nHOW TO USE THIS TIMELINE\nStep 1 — **Assign an owner to every milestone.** Not a department — a person. One name. If nobody owns it, nobody does it.\nStep 2 — **Set the status.** NOT STARTED → IN PROGRESS → COMPLETE. Be honest. GESTALT INTELLIGENCE flags milestones that stall.\nStep 3 — **Watch the phase progress.** Each phase has a GESTALT Score target. When Phase 1 completes, your score should be near 25. Phase 4 targets 85+.\nStep 4 — **Don't skip phases.** Phase 2 depends on Phase 1. You can't launch campaigns without brand architecture. You can't optimize without measurement.\nTHE FOUR PHASES\n**Phase 1 — FOUNDATION (Weeks 1-4):** Lock your brand. Upload to VAULT. Build your first campaigns.\n**Phase 2 — LAUNCH (Months 2-3):** Execute campaigns. Measure everything. Adjust based on data.\n**Phase 3 — OPTIMIZE (Months 4-6):** Activate H.I.V.E. Review your GESTALT Score at month 6.\n**Phase 4 — EXIT READY (Months 9-12):** Qualify for CERTIFIED. Generate your Exit Readiness Report.\nWHEN THIS IS COMPLETE\n**FORMULA becomes your operating system.** GESTALT INTELLIGENCE generates daily priorities, flags when milestones slip, and recalibrates the timeline based on actual performance. Every decision from this point forward has a documented brief, a measured baseline, and a clear owner.",
};

// ── BRAND WORD BOARD ──────────────────────────────────────────
export const WORD_BOARD: string[] = [
  "NIMBLE", "RELEVANT", "TIMELY", "INGENUITY", "THOUGHTFUL", "ADMIRED", "SMART", "GET IT DONE",
  "RESOURCEFUL", "ADAPTABLE", "COLLABORATIVE", "PURPOSEFUL", "THOUGHT LEADER", "1ST TO MARKET",
  "ANTICIPATION", "IMPROVEMENT", "PROBLEM SOLVING", "EDUCATION", "CREATIVE", "UNIQUE OFFERING",
  "BRAVE", "RISK TAKING", "CUSTOMER CENTRIC", "ADDING VALUE", "FLEXIBLE", "AGGRESSIVE",
  "APPROACHABLE", "VISIONARY", "OPPORTUNISTIC", "SUCCESSFUL",
  "AUTHENTIC", "TRANSPARENT", "INNOVATIVE", "PASSIONATE", "RELIABLE", "TRUSTWORTHY",
  "DISRUPTIVE", "BOLD", "FOCUSED", "EXPERT", "EMPOWERED", "ACCOUNTABLE", "INCLUSIVE",
  "DRIVEN", "IMPACT", "EXCELLENCE", "INTEGRITY", "COMMUNITY", "SUSTAINABLE", "FORWARD-THINKING",
  "PIONEERING", "GAME-CHANGER", "RESPONSIVE", "CONNECTED", "INSPIRING", "CONSISTENT",
  "PREMIUM", "ACCESSIBLE", "EFFICIENT", "HUMAN",
  "ORIGINAL", "LOCAL", "IRREPLACEABLE", "DESTINATION", "BELONGING", "ICONIC", "ROOTED",
  "CRAFTED", "NEIGHBORHOOD", "SIGNATURE", "CULTURAL", "EARNED", "UNMISSABLE", "CATEGORY-DEFINING",
  "STANDARD-SETTER", "UNAPOLOGETIC", "UNMATCHED", "DELIBERATE", "MAGNETIC", "CONVICTION",
];

// ── COMPETITOR WORD BOARD (for 01.10 step 5) ──────────────────
export const COMP_WORDS: string[] = [
  "ESTABLISHED", "TRUSTED", "AFFORDABLE", "PREMIUM", "TECHNOLOGY", "FAST", "RELIABLE",
  "CONVENIENT", "WELL-FUNDED", "NATIONAL REACH", "BRAND RECOGNITION", "SALES FORCE",
  "PARTNERSHIPS", "RESOURCES", "DESIGN", "VISIONARY FOUNDER", "DISTRIBUTION", "PRICE LEADER",
  "QUALITY", "SPECIALIZATION", "COMMUNITY", "LOYALTY PROGRAMS", "MARKETING SPEND",
  "INDUSTRY EXPERIENCE", "CUSTOMER SERVICE",
];

// ── PERSPECTIVE METADATA — 4 perspectives the manifesto is scored on ──
export interface Perspective {
  key: "customer" | "culture" | "investor" | "competition";
  label: string;
  color: string;
  gapPrompt: string;
  fallbackDeclaration: string;
}

export const PERSPECTIVES: Perspective[] = [
  {
    key: "customer", label: "CUSTOMER", color: "#803ee4",
    gapPrompt: "What does your customer walk away with that they can't get anywhere else? Tie your work to a result — revenue, time, confidence, freedom, transformation.",
    fallbackDeclaration: "A customer reading this knows immediately whether they belong here.",
  },
  {
    key: "culture", label: "EMPLOYEE / CULTURE", color: "#9aca3e",
    gapPrompt: "What does someone who works here say about it at dinner — and what would pull a top performer from a competitor to join?",
    fallbackDeclaration: "This attracts the right people AND makes them want to stay.",
  },
  {
    key: "investor", label: "INVESTOR / BUYER", color: "#e2b53f",
    gapPrompt: "What would a competitor need to spend or sacrifice to replicate exactly what you've built?",
    fallbackDeclaration: "A buyer sees a defensible position and a category worth acquiring.",
  },
  {
    key: "competition", label: "COMPETITION", color: "#e3398c",
    gapPrompt: "Name three things a chain or competitor could NOT copy, even if they tried tomorrow.",
    fallbackDeclaration: "A competitor reading this seriously evaluates whether to enter your market.",
  },
];

// ── COACHING QUESTIONS — pool per perspective for low scores ──
export const COACHING_QUESTIONS: Record<Perspective["key"], string[]> = {
  customer: [
    "Who specifically is your best customer? Describe them in one sentence — not a demographic, a real person.",
    "What does your best customer say when they refer you to a friend? Quote it as closely as you can.",
    "What does a customer experience at your best location that they can't get anywhere else in the city?",
  ],
  culture: [
    "What does someone who works here say about it when they're at dinner with friends who don't work here?",
    "What kind of person thrives here that would struggle at a chain or corporate competitor?",
    "What's the one thing your best employee has that candidates from competitors don't?",
    "What does someone give up at their current job that they'd find here instead?",
    "If your best hire described their first month here to a skeptical friend, what would they say?",
    "What's the version of their career that someone gets by having worked here?",
  ],
  investor: [
    "What would a competitor need to spend or sacrifice to replicate exactly what you've built?",
    "If a national brand tried to enter your market tomorrow, what would make them fail?",
    "Why would an acquirer pay a premium for your business over a comparable one in your category?",
  ],
  competition: [
    "Name the one thing your strongest competitor cannot copy without abandoning what makes them scalable.",
    "What do you own in your market — a neighborhood, a customer type, a format — that no one else has claimed?",
    "What would you have to give up about your business for a chain to be able to do what you do?",
  ],
};

// ── MANIFESTO THEME WORDS — shuffle pools by semantic theme ───
export const MANIFESTO_THEME_WORDS: Record<string, string[][]> = {
  originality: [["ORIGINAL", "AUTHENTIC", "UNIQUE OFFERING"], ["1ST TO MARKET", "PIONEERING", "BOLD"], ["SIGNATURE", "CRAFTED", "UNAPOLOGETIC"]],
  local: [["COMMUNITY", "LOCAL", "NEIGHBORHOOD"], ["ROOTED", "CONNECTED", "HUMAN"], ["BELONGING", "CULTURAL", "EARNED"]],
  moat: [["IRREPLACEABLE", "GAME-CHANGER", "DISRUPTIVE"], ["UNMATCHED", "EXCELLENCE", "ACCOUNTABLE"], ["STANDARD-SETTER", "CONSISTENT", "TRUSTWORTHY"]],
  destination: [["DESTINATION", "ICONIC", "ADMIRED"], ["MAGNETIC", "INSPIRING", "PASSIONATE"], ["PREMIUM", "UNMISSABLE", "PURPOSEFUL"]],
  culture: [["EMPOWERED", "INCLUSIVE", "COLLABORATIVE"], ["INTEGRITY", "DRIVEN", "PURPOSEFUL"], ["CONVICTION", "DELIBERATE", "TRANSPARENT"]],
  customer: [["CUSTOMER CENTRIC", "APPROACHABLE", "RESPONSIVE"], ["ADDING VALUE", "RELEVANT", "ACCESSIBLE"], ["THOUGHTFUL", "RELIABLE", "CONSISTENT"]],
  leadership: [["VISIONARY", "THOUGHT LEADER", "FORWARD-THINKING"], ["INNOVATIVE", "PIONEERING", "CATEGORY-DEFINING"], ["ANTICIPATION", "SMART", "INGENUITY"]],
  execution: [["GET IT DONE", "NIMBLE", "TIMELY"], ["ADAPTABLE", "RESOURCEFUL", "AGILE"], ["FOCUSED", "EFFICIENT", "ACCOUNTABLE"]],
};

// ── MODULE NAV (full B.A.S.E. journey) — used in breadcrumb context only ──
export interface ModuleNavItem {
  id: string;
  label: string;
  time: string;
  sub: string;
  color: string;
}

export const MODULE_NAV: ModuleNavItem[] = [
  { id: "framework", label: "FRAMEWORK", time: "DAY 1", sub: "30 SEC", color: "#6b0901" },
  { id: "financials", label: "FINANCIAL WIZARD", time: "DAY 1", sub: "5 MIN", color: "#c14000" },
  { id: "focus", label: "FOCUS", time: "WEEK 1", sub: "30 MIN", color: "#ffad33" },
  { id: "formula", label: "FORMULA", time: "WEEKS 2–4", sub: "3 FULL DAYS", color: "#d5e24a" },
  { id: "sum", label: "S.U.M.", time: "WEEKS 3–4", sub: "30 MIN/EMPLOYEE", color: "#b5eb41" },
  { id: "hive", label: "H.I.V.E.", time: "WEEKS 4–6", sub: "15 MIN/EMP + ONGOING", color: "#94d900" },
  { id: "vault", label: "VAULT + BRAND AUDIT", time: "WEEKS 5–6", sub: "2–4 HOURS", color: "#57d900" },
  { id: "analytics", label: "ANALYTICS", time: "DAY 42+", sub: "CONTINUOUS", color: "#57d900" },
];

// ── INTELLIGENCE STAGES — sidebar tracker per FORMULA section ──
export interface IntelligenceStage {
  id: string;
  label: string;
  capability: string;
  points: number;
}

export const INTELLIGENCE_STAGES: IntelligenceStage[] = [
  { id: "01.10", label: "Competitive Landscape", capability: "Strategic vocabulary locked. All creative scored against your words.", points: 1840 },
  { id: "01.20", label: "Business Objectives", capability: "Objectives become the filter for every campaign decision.", points: 620 },
  { id: "01.30", label: "Barriers & Challenges", capability: "Root causes mapped. AI flags objective-barrier conflicts in real time.", points: 480 },
  { id: "02.10", label: "Target Audiences", capability: "Behavior models active. 7-stage journey tracked per audience.", points: 2100 },
  { id: "02.20", label: "Customer Experience", capability: "R.U.D. benchmark live. TEST CREATIVE analysis enabled.", points: 1760 },
  { id: "02.30", label: "Brand Architecture", capability: "VAULT enforcement active. Brand drift detection enabled.", points: 940 },
  { id: "03.10", label: "Campaign Outlets", capability: "Right-channeling analysis active. S+D+I gap detection live.", points: 1200 },
  { id: "03.20", label: "Campaign Options", capability: "7-stage lifecycle tracking active. Campaign Autopsy enabled.", points: 3400 },
  { id: "03.30", label: "Success Measures", capability: "KPI benchmarks set. GESTALT Score fully instrumented.", points: 2800 },
  { id: "04.10", label: "Launch Action Plan", capability: "Full AI operating system active. Ask me anything.", points: 1200 },
];

// ── FORMULA INTROS (per-section goal + stat) ──────────────────
export interface FormulaIntro {
  goal: string;
  why: string;
  stat: string;
  source: string;
  statLabel: string;
}

export const FORMULA_INTROS: Record<string, FormulaIntro> = {
  "01.10": { goal: "Lock your brand vocabulary.", why: "The company that owns the vocabulary owns the conversation. By the end of this section you will have 10 ranked words, a competitive context map, and your company's position on the market spectrum — locked, versioned, and signed off by your team.", stat: "3.5×", source: "McKinsey & Company", statLabel: "More Likely to Achieve Strategic Alignment" },
  "01.20": { goal: "Document what you're actually building toward.", why: "Objectives without HOWs are wishes. Every objective you sign off here includes a three-part strategic brief, a success metric, a valuation connection, and a barrier link. When this section is complete, every member of your team can answer the question: what are we doing and why?", stat: "10×", source: "Harvard Business Review", statLabel: "More Likely to Reach Goals When Documented" },
  "01.30": { goal: "Name what's in the way — before it costs you.", why: "Most companies know their barriers. Almost none document them, link them to objectives, and assign owners. You're about to. Every barrier you name here is cross-referenced against your objectives in real time — and every unaddressed barrier is flagged as a complacency risk.", stat: "67%", source: "Bain & Company", statLabel: "of Strategic Failures Trace to Known but Ignored Barriers" },
  "02.10": { goal: "Define who you're actually talking to — not who you wish you were.", why: "Demographics are not audiences. Real humans with real motivations, fears, and decision triggers are audiences. You will define each one with a Brand Promise, a Value Proposition, and a full 7-stage behavior model. By the end, every campaign gets filtered through this lens.", stat: "2.3×", source: "HubSpot + Bain & Company", statLabel: "Higher Conversion With Clearly Defined Audiences" },
  "02.20": { goal: "Engineer the experience your customers remember and repeat.", why: "The R.U.D. framework — Relevant, Useful, Desirable — is the standard every touchpoint is held against. Think / Feel / Do maps the internal experience at every stage. This is where brand stops being a feeling and starts being an engineered system.", stat: "86%", source: "PwC Customer Experience Study", statLabel: "of Buyers Pay More for a Superior Experience" },
  "02.30": { goal: "Make your brand enforceable, not aspirational.", why: "Brand standards that live in a document get ignored. Brand standards that live in VAULT get enforced — automatically. This section documents the standards GESTALT INTELLIGENCE will use to audit every asset, flag every drift, and score every creative decision.", stat: "23%", source: "Lucidpress Brand Consistency Report", statLabel: "Higher Revenue for Brands With Consistent Standards" },
  "03.10": { goal: "Assign a strategy to every channel — or cut it.", why: "An untagged channel has no strategy. Every channel you activate here gets tagged with S (Surprise), D (Delight), or I (Inspire) — and cross-referenced against your audience journey map. Gaps become visible immediately. Closing them is how you take market share.", stat: "3.2×", source: "Deloitte + Vista Equity", statLabel: "Higher LTV for Companies Mapping the Full Customer Journey" },
  "03.20": { goal: "Build campaigns that never stop working.", why: "Most companies build 3–5 reasons to do business with them. You're about to build the full 7-stage lifecycle — Trigger to Influencer — for every active campaign. GESTALT INTELLIGENCE tracks execution against strategy and flags the moment a campaign begins to drift.", stat: "7×", source: "Sirius Decisions Research", statLabel: "More Revenue for Companies With a Fully Mapped Customer Journey" },
  "03.30": { goal: "Set targets that make your score accountable.", why: "Targets without baselines are guesses. You will set a specific current number and target for every KPI category. These numbers feed your GESTALT Score directly — and GESTALT INTELLIGENCE will alert you the moment performance diverges from the plan.", stat: "2.4×", source: "McKinsey Strategy Practice", statLabel: "More Likely to Achieve Goals With Documented Metrics" },
  "04.10": { goal: "Make strategy executable — with owners, dates, and a signed commitment.", why: "The difference between a strategy that gets executed and one that gets filed is a signed action plan with named owners and specific milestones. This is the last step of FORMULA. When you sign off here, GESTALT INTELLIGENCE begins monitoring every milestone.", stat: "2.7×", source: "Project Management Institute", statLabel: "More Likely to Hit Revenue Targets With a Documented Launch Plan" },
};

// ── CONGRATS MESSAGES per section sign-off ────────────────────
export const CONGRATS_MESSAGES: Record<string, string> = {
  "01.10": "Your word stack is locked. Every campaign, hire, and creative decision that follows will be measured against these words. You've done what most companies never do — you've made your brand vocabulary undeniable.",
  "01.20": "Your objectives are documented, stratified, and signed. The HOW is real. The metric is specific. The timeline is locked. You can now answer — in writing — the questions every acquirer asks on day one of diligence.",
  "01.30": "Your barriers are named, owned, and linked to strategy. The threats that used to operate silently now have addresses and owners. Complacency just lost its hiding place.",
  "02.10": "Your audiences are defined as real humans, not demographics. You can now describe exactly who you serve, what they want before they know you exist, and where they make their decision. That clarity compounds.",
  "02.20": "Your customer experience is engineered. Think / Feel / Do is mapped. The standard every touchpoint is held against is documented. GESTALT INTELLIGENCE now knows what 'excellent' means for your brand.",
  "02.30": "Your brand is enforceable. Standards are documented. VAULT enforcement is active. From this point forward, every asset, every campaign, and every vendor brief is auditable against this baseline.",
  "03.10": "Every channel has a strategy. Every gap has been identified. You've just completed what most marketing teams spend months trying to align on — and you did it in an afternoon.",
  "03.20": "Your campaigns are built for the full customer journey. Not just acquisition — advocacy. Every stage from Trigger to Influencer has execution ideas. GESTALT INTELLIGENCE will now monitor performance against this roadmap.",
  "03.30": "Your KPIs are set and your baselines are documented. The GESTALT Score is now fully instrumented. From this point forward, every decision can be evaluated against a measured standard.",
  "04.10": "FORMULA is complete. Your Brand Interaction Strategy Guide is signed, versioned, and active. GESTALT INTELLIGENCE now has everything it needs to generate daily priorities, flag risk, and recalibrate as you execute.",
};

// ── PRIORITY CONFIG (BusinessObjectivesPage) ──────────────────
export interface PriorityConfig {
  label: string;
  color: string;
  score: number;
  alloc: string;
  allocColor: string;
  hint: string;
}

export const PRIO: Record<string, PriorityConfig> = {
  PRIMARY: { label: "PRIMARY", color: "#e2b53f", score: 3, alloc: "HIGH ALLOCATION", allocColor: "#e2b53f", hint: "This is your #1 focus. Maximum resources, weekly review, owner accountable daily." },
  SECONDARY: { label: "SECONDARY", color: "#888888", score: 2, alloc: "MODERATE ALLOCATION", allocColor: "#888888", hint: "Important but not the main thrust. Monthly review. Resources allocated after PRIMARY." },
  TERTIARY: { label: "TERTIARY", color: "#444444", score: 1, alloc: "LOW ALLOCATION", allocColor: "#555555", hint: "Noted and tracked. Executed when capacity allows. Do not let this stall the others." },
};

export const HORIZONS = ["90-DAY", "6-MONTH", "12-MONTH", "3-YEAR"] as const;

export interface ObjectiveInitiative {
  id: number;
  title: string;
  owner: string;
  date: string;
  priority: keyof typeof PRIO;
}

export interface BusinessObjective {
  id: number;
  title: string;
  priority: keyof typeof PRIO;
  horizon: string;
  owner: string;
  meaning: string;
  howWhat: string;
  howWhy: string;
  how30: string;
  metric: string;
  done: string;
  valuation: string;
  riskIgnored: string;
  complacency90: string;
  barrierLinked: boolean;
  initiatives: ObjectiveInitiative[];
}

export const INIT_OBJECTIVES: BusinessObjective[] = [
  {
    id: 1,
    title: "Define and dominate our primary market segment",
    priority: "PRIMARY", horizon: "12-MONTH", owner: "Alex Chen",
    meaning: "When we execute this, our team will have a clearly defined customer archetype every member can articulate. Our marketing budget will be 40% more efficient, our close rate will improve, and our word-of-mouth referrals will spike because we stopped trying to be everything to everyone.",
    howWhat: `Narrow our ${T("ICP")} to the 20% of customers who generate 80% of value. Build a documented scoring model and apply it to every prospect and existing account.`,
    howWhy: "Unfocused sales motion is the #1 revenue leak in companies our size. Segment ownership compounds — once you dominate a niche, expansion is faster and cheaper than competing broadly from day one.",
    how30: `Within 30 days: ${T("ICP")} model documented, top 20 accounts scored, and first prospect disqualified using the new criteria. If no one has been told 'no' yet, the model isn't being used.`,
    metric: `Close rate from ${T("ICP")}-qualified leads reaches 35% by Q3`,
    done: `${T("ICP")} criteria documented, all current accounts scored, and sales process updated to filter at intake.`,
    valuation: `A defined ${T("ICP")} directly increases exit multiple by narrowing buyer risk. Acquirers pay 1.5–2× more for companies where revenue is predictable and customer profile is clear.`,
    riskIgnored: "We continue burning budget on low-fit accounts, our close rate stays flat, and churn stays high because we're serving customers who were never a good fit.",
    complacency90: `If this sits for 90 days, our Q3 pipeline will be filled with wrong-fit prospects, our ${T("CAC")} will increase, and the next quarter will feel exactly like the last one.`,
    barrierLinked: true,
    initiatives: [
      { id: 1, title: `Define ${T("ICP")} scoring criteria across 5 dimensions`, owner: "Alex Chen", date: "Week 1", priority: "PRIMARY" },
      { id: 2, title: "Audit existing customer base and score every account", owner: "Sales", date: "Week 2", priority: "PRIMARY" },
      { id: 3, title: `Remove non-${T("ICP")} accounts from active pipeline`, owner: "Alex Chen", date: "Month 1", priority: "SECONDARY" },
    ],
  },
  {
    id: 2,
    title: "Build a system that runs without the founder",
    priority: "PRIMARY", horizon: "12-MONTH", owner: "",
    meaning: "When this is executed properly, the company will operate at full efficiency whether the founder is in the building or not. Buyers pay a premium for this. Companies dependent on one person are acquisition liabilities — companies with documented systems are acquisition assets.",
    howWhat: "Document every decision, process, and approval that currently routes through the founder. Delegate each one to a qualified owner with documented authority. Create redundancy in every critical function.",
    howWhy: "Founder-dependency is the most common reason exits fail or close below multiple. No buyer wants to acquire a company where one departure breaks operations.",
    how30: "Within 30 days: a complete inventory of every founder-dependent decision. Not resolved — just named. You can't delegate what you haven't documented.",
    metric: "Zero decisions requiring founder approval for operational continuity by Q4",
    done: "All critical processes documented in a shared system, backup owners assigned and trained, and founder successfully absent for 2 weeks without operational disruption.",
    valuation: `Documented systems and clear ownership structure can add 1.2–1.8× to your ${T("EBITDA")} multiple at exit. Buyers discount 15–30% when key-person risk is detected in diligence.`,
    riskIgnored: "You remain the single point of failure. When buyers run diligence, they find it immediately and use it as leverage to reduce the offer — or walk away.",
    complacency90: "In 90 days this becomes a culture problem, not just a process problem. Teams stop developing judgment when they know everything routes upward.",
    barrierLinked: false,
    initiatives: [
      { id: 1, title: "Inventory every founder-dependent decision and process", owner: "", date: "Week 1", priority: "PRIMARY" },
      { id: 2, title: "Document top 10 operational processes with step-by-step handoff guides", owner: "", date: "Month 1", priority: "PRIMARY" },
      { id: 3, title: "Hire or train backup owner for every critical function", owner: "", date: "Q2", priority: "SECONDARY" },
    ],
  },
  {
    id: 3,
    title: "Achieve 10× exit multiple through brand equity",
    priority: "SECONDARY", horizon: "3-YEAR", owner: "",
    meaning: `When this is executed properly, our ${T("EBITDA")} multiple will reflect the strength of our brand, not just our revenue. We will have documented proof of transformation, a scored GESTALT profile, and a narrative that positions us as a category-defining company — not just a profitable one.`,
    howWhat: `Complete every section of GESTALT FORMULA. Activate ${T("HIVE")} for all team members. Run quarterly GESTALT Score reviews and document every point of improvement as evidence for the exit narrative.`,
    howWhy: "Brand equity is the most defensible form of value. Revenue can be replicated. A documented brand transformation with measured cultural improvement over multiple years cannot.",
    how30: `Within 30 days: GESTALT FORMULA complete, baseline ${T("HIVE")} scores set for all team members, and first GESTALT Score documented as the starting line.`,
    metric: "GESTALT Score reaches 85+ within 24 months, maintained at 80+ for 12 consecutive months prior to exit",
    done: `GESTALT Score above 80, all FORMULA sections signed off, ${T("HIVE")} active for 100% of team, and GESTALT CERTIFIED badge earned.`,
    valuation: `Every 10-point improvement in GESTALT Score correlates to a 0.4–0.8× increase in exit multiple based on documented ${T("EBITDA")} performance data from comparable exits.`,
    riskIgnored: "We exit at a commodity multiple. Revenue without brand story is worth 3–4×. Revenue with a documented, scored transformation is worth 8–12×.",
    complacency90: "The brand stops improving but the team stops noticing. Complacency becomes the operating system. This is the exact scenario the platform is designed to prevent.",
    barrierLinked: false,
    initiatives: [
      { id: 1, title: "Complete all GESTALT FORMULA sections and earn sign-off", owner: "", date: "Month 1", priority: "PRIMARY" },
      { id: 2, title: `Activate ${T("HIVE")} for all team members`, owner: "", date: "Month 2", priority: "PRIMARY" },
      { id: 3, title: "Run first quarterly GESTALT Score review and document baseline", owner: "", date: "Month 3", priority: "PRIMARY" },
    ],
  },
];

// ── BARRIERS (page 01.30) ─────────────────────────────────────
export interface Barrier {
  category: string;
  severity: "high" | "medium";
  items: string[];
}
export const BARRIERS: Barrier[] = [
  { category: "MAINTAIN CONSISTENT BRAND EXPERIENCE", severity: "high", items: ["Training gaps across locations", "No documented guidelines", "Internal teams misaligned"] },
  { category: "PROSPECT TRACKING", severity: "high", items: ["No unified CRM", "Can't identify what's working", "Sales slump blind spots"] },
  { category: "COMPETITIVE DIFFERENTIATION", severity: "medium", items: ["Competitors copying positioning", "No clear moat", "Springboard threats"] },
  { category: "TIME TO MARKET", severity: "medium", items: ["Launch windows closing", "Internal approvals slow", "Resource constraints"] },
];

// ── AUDIENCES (page 02.10) ────────────────────────────────────
export interface Audience {
  name: string;
  priority: number;
  description: string;
  sdi: Array<"S" | "D" | "I">;
}
export const AUDIENCES: Audience[] = [
  { name: "PRIMARY CUSTOMER", priority: 1, description: "Direct buyers — your core revenue", sdi: ["S", "D"] },
  { name: "INVESTOR / PARTNER", priority: 2, description: "Stakeholders seeking ROI", sdi: ["D", "I"] },
  { name: "EMPLOYEE / TEAM", priority: 3, description: "Culture carriers + brand stewards", sdi: ["S", "I"] },
];

// ── CHANNELS (page 03.10) ─────────────────────────────────────
export interface ChannelGroup {
  name: string;
  items: string[];
}
export const CHANNEL_GROUPS: ChannelGroup[] = [
  { name: "DIGITAL", items: ["Website", "Email", "Social Media", "Search / SEO", "Digital Ads", "Landing Pages"] },
  { name: "DIRECT", items: ["In-Person Events", "Direct Mail", "Phone / SMS", "Trade Shows", "Referrals"] },
  { name: "CONTENT", items: ["Blog / Articles", "Video / YouTube", "Podcast", "Case Studies", "White Papers"] },
  { name: "EXPERIENCE", items: ["Physical Space", "Packaging", "Onboarding", "Customer Service", "Community"] },
];

// ── CAMPAIGNS (page 03.20) ────────────────────────────────────
export interface Campaign {
  name: string;
  type: string;
  sdi: Array<"S" | "D" | "I">;
  time: string;
  growth: number;
  description: string;
}
export const CAMPAIGNS: Campaign[] = [
  { name: "AWARENESS LAUNCH", type: "Immediate Impact", sdi: ["S"], time: "Q1", growth: 40, description: "Pattern-interrupt establishing market presence" },
  { name: "TRUST BUILDER", type: "Nurture Sequence", sdi: ["D"], time: "Q1-Q2", growth: 80, description: "Case study + social proof campaign" },
  { name: "CONVERSION ENGINE", type: "Direct Response", sdi: ["S", "D"], time: "Q2", growth: 60, description: "Value proposition campaign driving action" },
  { name: "INSPIRE + ENGAGE + SHARE", type: "Advocacy", sdi: ["I"], time: "Q2-Q3", growth: 80, description: "Turn customers into vocal advocates" },
  { name: "THANK YOU", type: "Retention", sdi: ["D", "I"], time: "Ongoing", growth: 50, description: "Post-purchase delight that sustains desire" },
  { name: "CULT BRAND SEQUENCE", type: "Full S+D+I", sdi: ["S", "D", "I"], time: "Q3-Q4", growth: 95, description: "Complete Desire → Inspire → Influence loop — the flywheel" },
];

// ── KPI CATEGORIES (page 03.30) ───────────────────────────────
export interface KpiCategory {
  category: string;
  metrics: string[];
}
export const KPI_CATEGORIES: KpiCategory[] = [
  { category: "AWARENESS", metrics: ["Brand Recognition %", "Organic Search Volume", "Social Mentions", "PR Impressions"] },
  { category: "ENGAGEMENT", metrics: ["Time on Site", "Email Open / Click", "Social Engagement", "Event Attendance"] },
  { category: "CONVERSION", metrics: ["Lead-to-Customer Rate", "Cost per Acquisition", "Average Deal Size", "Sales Cycle Length"] },
  { category: "ADVOCACY", metrics: ["Net Promoter Score", "Referral Rate", "Customer Lifetime Value", "Review Volume"] },
];

// ── LAUNCH MILESTONES (page 04.10) ────────────────────────────
export interface LaunchMilestone {
  time: string;
  label: string;
  description: string;
  phase: 1 | 2 | 3 | 4;
}
export const LAUNCH_MILESTONES: LaunchMilestone[] = [
  { time: "WEEK 1-2", label: "Brand Architecture Finalization", description: "Lock logo, color, typography, voice. Upload to VAULT. All creative that follows derives from this.", phase: 1 },
  { time: "WEEK 3-4", label: "Campaign Development", description: "Build Awareness Launch and Trust Builder using FORMULA word stack and audience profiles.", phase: 1 },
  { time: "MONTH 2", label: "Launch Phase 1 Campaigns", description: "Execute top 2 prioritized campaigns. Measure against Success Measures defined in 03.30.", phase: 2 },
  { time: "MONTH 3", label: "Optimize + Expand", description: "Review performance data. Adjust S+D+I tagging. Launch 2 additional campaigns.", phase: 2 },
  { time: "MONTH 4-5", label: "H.I.V.E. Activation", description: "Activate employee scoring. Connect culture metrics to brand performance. Story Engine live.", phase: 3 },
  { time: "MONTH 6", label: "Full GESTALT Review", description: "Re-run FOCUS assessment. Compare GESTALT Scores. Quantify valuation increase. Adjust FORMULA strategy.", phase: 3 },
  { time: "MONTH 9", label: "CERTIFIED Qualification Check", description: "Review FRAMEWORK score trajectory. If 16+/21, begin CERTIFIED certification process.", phase: 3 },
  { time: "MONTH 12", label: "Exit Readiness Report", description: "First annual GESTALT Score report. ANALYTICS full PE due diligence readout. Present to advisors.", phase: 4 },
];

export interface LaunchPhase {
  n: 1 | 2 | 3 | 4;
  label: string;
  colorClass: string;
}
export const LAUNCH_PHASES: LaunchPhase[] = [
  { n: 1, label: "FOUNDATION", colorClass: "text-gold border-gold/40 bg-gold/10" },
  { n: 2, label: "LAUNCH", colorClass: "text-[#c45c00] border-[#c45c00]/40 bg-[#c45c00]/10" },
  { n: 3, label: "OPTIMIZE", colorClass: "text-[#5a8a3a] border-[#5a8a3a]/40 bg-[#5a8a3a]/10" },
  { n: 4, label: "EXIT READY", colorClass: "text-[#9aca3e] border-[#9aca3e]/40 bg-[#9aca3e]/10" },
];

// ── REPORT SECTIONS (FormulaReport) ───────────────────────────
export interface ReportSection {
  id: string;
  label: string;
  group: string;
  color: string;
  summary: string;
}
export const REPORT_SECTIONS: ReportSection[] = [
  { id: "01.10", label: "Competitive Landscape", group: "ALIGNING DIALOGUE", color: "#e2b53f", summary: "Word stack documented. Spectrum positions locked. Competitive narrative generated for 3 competitors. Stakeholder audit complete." },
  { id: "01.20", label: "Business Objectives", group: "ALIGNING DIALOGUE", color: "#e2b53f", summary: "3 objectives defined with priority ranking, time horizons, owners, HOW briefs, success metrics, and valuation impact." },
  { id: "01.30", label: "Barriers & Challenges", group: "ALIGNING DIALOGUE", color: "#e2b53f", summary: "Root-level constraints identified and linked to objectives. Resolution strategies documented." },
  { id: "02.10", label: "Target Audiences", group: "BRAND EXPERIENCE", color: "#803ee4", summary: "Audiences mapped across all 7 journey stages with Brand Promises and Value Propositions defined." },
  { id: "02.20", label: "Customer Experience", group: "BRAND EXPERIENCE", color: "#803ee4", summary: "R.U.D. (Relevant, Useful & Desirable) framework complete. Think/Feel/Do model active." },
  { id: "02.30", label: "Brand Architecture", group: "BRAND EXPERIENCE", color: "#803ee4", summary: "Brand standards documented and feeding VAULT enforcement." },
  { id: "03.10", label: "Campaign Outlets", group: "INTERACTION CAMPAIGNS", color: "#58d3ff", summary: "All active channels mapped with S+D+I (Surprise, Delight & Inspire) tags. No untagged channels." },
  { id: "03.20", label: "Campaign Options", group: "INTERACTION CAMPAIGNS", color: "#58d3ff", summary: "6 campaigns built across full 7-stage customer journey." },
  { id: "03.30", label: "Success Measures", group: "INTERACTION CAMPAIGNS", color: "#58d3ff", summary: "KPI (Key Performance Indicator) targets set across all 4 categories. GESTALT Score active." },
  { id: "04.10", label: "Launch Action Plan", group: "NEXT STEPS", color: "#9aca3e", summary: "8 milestones across 4 phases. Owners assigned. GESTALT INTELLIGENCE monitoring activated." },
];

// ═══════════════════════════════════════════════════════════════
// SCORING ENGINES
// ═══════════════════════════════════════════════════════════════

/** 0–1 quality multiplier for a single answer string. */
export function answerQuality(answer: string | undefined | null): number {
  if (!answer || typeof answer !== "string") return 0;
  const trimmed = answer.trim();
  if (trimmed.length < 15) return 0;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 4) return 0;

  const fillerPatterns = [
    /^(i don't know|idk|not sure|no idea|whatever|nothing|n\/a|none|skip|test)/i,
    /^(yes|no|maybe|ok|okay|sure|i guess|kind of|sort of)\.?$/i,
  ];
  if (fillerPatterns.some((p) => p.test(trimmed))) return 0;

  let q = 0.3;
  if (/[A-Z][a-z]+/.test(trimmed)) q += 0.15;
  if (/\d/.test(trimmed)) q += 0.1;
  if (words.length >= 15) q += 0.15;
  if (words.length >= 25) q += 0.1;
  if (/because|—|:|;/.test(trimmed)) q += 0.1;
  if (/\b(only|never|always|every|most|first)\b/i.test(trimmed)) q += 0.1;

  return Math.min(1, q);
}

/** 0–100 confidence for a single perspective. */
export function perspectiveConfidence(score: number, answers: string[] | undefined): number {
  const scoreContrib = (score / 25) * 60;
  const qualitySum = (answers || []).reduce((s, a) => s + answerQuality(a), 0);
  const qualityContrib = Math.min(40, qualitySum * 20);
  return Math.min(99, Math.round(scoreContrib + qualityContrib));
}

export interface ManifestoScores {
  customer: number;
  culture: number;
  investor: number;
  competition: number;
  total: number;
  confidence: number;
}

/** Score a manifesto across 4 perspectives, 0–25 each. */
export function scoreManifesto(text: string, descText?: string, coachingAnswers?: string[]): ManifestoScores {
  if (!text || text.trim().length < 10) {
    return { customer: 0, culture: 0, investor: 0, competition: 0, total: 0, confidence: 0 };
  }
  const t = text;

  const customer = Math.min(25,
    (/customer|guest|local|neighbor|diner|patron|client|community|people who/i.test(t) ? 9 : 0) +
    (/return|belong|reflects them|their place|theirs|discovered|loyalty|trust/i.test(t) ? 9 : 0) +
    (/not.*chain|can't replicate|cannot replicate|no chain|no franchise/i.test(t) ? 7 : 0)
  );

  const culture = Math.min(25,
    (/team|staff|people who work|build here|work here|chose this|career|job worth/i.test(t) ? 7 : 0) +
    (/culture|belonging|means something|proud|standard|excellence|craft/i.test(t) ? 6 : 0) +
    (/doesn't leave|don't leave|stay because|chose it|found one/i.test(t) ? 4 : 0) +
    (/consequential|meaningful|matters|build something|story.*telling|dinner/i.test(t) ? 5 : 0) +
    (/talent.*attracts|attract.*talent|best.*choose|top.*performer/i.test(t) ? 3 : 0)
  );

  const investor = Math.min(25,
    (/cannot copy|can't copy|franchise agreement|scalable.*irreplaceable|irreplaceable|defensible|moat|acquisition/i.test(t) ? 11 : 0) +
    (/category|standard|own.*market|define.*market|measured against/i.test(t) ? 8 : 0) +
    (/original|documented|verifiable|track record|results/i.test(t) ? 6 : 0)
  );

  const competition = Math.min(25,
    (/cannot copy|can't replicate|cannot replicate|no chain|franchise.*can't|competitor.*fear/i.test(t) ? 11 : 0) +
    (/irreplaceable|scalable.*abandon|standard.*category|category.*standard/i.test(t) ? 8 : 0) +
    (/only|first|define|own.*market|measured against/i.test(t) ? 6 : 0)
  );

  const total = customer + culture + investor + competition;

  const coachRounds = Array.isArray(coachingAnswers) ? coachingAnswers.filter(Boolean).length : 0;
  const descLen = descText ? descText.trim().split(/\s+/).length : 0;
  const confidence = Math.min(99, Math.round(
    (total / 100) * 70 +
    Math.min(15, descLen * 0.5) +
    Math.min(15, coachRounds * 5)
  ));

  return { customer, culture, investor, competition, total, confidence };
}

export interface CoachingQuestion {
  category: Perspective["key"];
  categoryLabel: string;
  color: string;
  score: number;
  question: string;
}

/** Returns the next coaching question for the lowest-scoring perspective <20. */
export function getCoachingQuestion(
  scores: { customer: number; culture: number; investor: number; competition: number },
  roundIndex: number,
): CoachingQuestion | null {
  const cats: Perspective["key"][] = ["customer", "culture", "investor", "competition"];
  const sorted = cats
    .map((k) => ({ key: k, score: scores[k] }))
    .filter((c) => c.score < 20)
    .sort((a, b) => a.score - b.score);
  if (!sorted.length) return null;
  const lowest = sorted[0];
  const meta = PERSPECTIVES.find((p) => p.key === lowest.key)!;
  const pool = COACHING_QUESTIONS[lowest.key];
  return {
    category: lowest.key,
    categoryLabel: meta.label,
    color: meta.color,
    score: lowest.score,
    question: pool[roundIndex % pool.length],
  };
}

/** Pull a likely company name from a description. */
export function extractCompanyName(text: string): string {
  if (!text || !text.trim()) return "YOUR BRAND";
  const PRON = /^(we|i|our|they|it|he|she|you|this|that|what|when|where|which|who|how|the|a|an|my|your|his|her|its|their|there|here|these|those|is|are|was|were|im|in|at|to|of|and|or|but|if|so)/i;
  const nmS = text.match(/^([A-Z][a-zA-Z'']+(?:\s+[A-Z][a-zA-Z'']+){0,3})/);
  const nmM = text.match(/(?:called|named|known as)\s+([A-Z][a-zA-Z'']+(?:\s+[A-Z][a-zA-Z'']+){0,3})/);
  if (nmS && !PRON.test(nmS[1])) return nmS[1];
  if (nmM) return nmM[1];
  return "YOUR BRAND";
}

export interface ManifestoNouns {
  brandName: string | null;
  properNouns: string[];
  customerNoun: string | null;
  venueNoun: string | null;
  peopleNoun: string | null;
  productNoun: string | null;
}

export function extractManifestoNouns(descText: string, descAiVersion?: string): ManifestoNouns | null {
  const primary = (descText || "").trim();
  const secondary = (descAiVersion || "").trim();
  const combined = (primary + " " + secondary).trim();
  if (!combined) return null;

  const PRON = /^(We|I|Our|They|It|He|She|You|This|That|What|When|Where|Which|Who|How|The|A|An|My|Your|His|Her|Its|Their|There|Here|These|Those|Is|Are|Was|Were|In|At|To|Of|And|Or|But|If|So)$/;
  const properMatches = combined.match(/\b[A-Z][a-zA-Z'']+(?:\s+[A-Z][a-zA-Z'']+){0,3}\b/g) || [];
  const properNouns = [...new Set(
    properMatches
      .map((n) => n.trim())
      .filter((n) => !PRON.test(n.split(/\s+/)[0]))
      .filter((n) => n.length >= 3),
  )].slice(0, 3);

  const fromExtractor = extractCompanyName(primary);
  const brandName = fromExtractor !== "YOUR BRAND" ? fromExtractor : (properNouns[0] || null);

  const lower = combined.toLowerCase();
  const firstMatch = (list: string[]) =>
    list.find((n) => new RegExp(`\\b${n}s?\\b`, "i").test(lower)) || null;

  const customerNoun = firstMatch([
    "patient", "client", "guest", "member", "customer", "buyer", "shopper", "subscriber", "student", "resident", "rider", "passenger",
  ]);
  const venueNoun = firstMatch([
    "shop", "clinic", "store", "studio", "office", "location", "practice", "kitchen", "restaurant", "cafe", "gym", "salon", "showroom", "warehouse", "facility",
  ]);
  const peopleNoun = firstMatch([
    "team", "staff", "crew", "family", "artisans", "specialists", "professionals", "technicians", "engineers", "stylists", "mechanics", "baristas",
  ]);
  const productNoun = firstMatch([
    "experience", "product", "service", "craft", "offering", "menu", "treatment", "session", "portfolio", "program", "procedure",
  ]);

  return { brandName, properNouns, customerNoun, venueNoun, peopleNoun, productNoun };
}

export function generateCoachingPlaceholder(
  perspectiveKey: Perspective["key"],
  descText: string,
  descAiVersion?: string,
): string {
  const nouns = extractManifestoNouns(descText, descAiVersion);
  const slotCount = nouns
    ? [nouns.customerNoun, nouns.venueNoun, nouns.peopleNoun, nouns.productNoun, nouns.brandName].filter(Boolean).length
    : 0;

  if (!nouns || slotCount < 2) {
    const fb: Record<Perspective["key"], string> = {
      customer: "Strengthen your description above — it'll personalize this prompt. For now: name one customer specifically. What they walked in needing. What they left with. Not a type. A person.",
      culture: "Strengthen your description above — it'll personalize this prompt. For now: name one employee specifically. What they gave up to come here. What they'd tell a skeptical friend about their first month.",
      investor: "Strengthen your description above — it'll personalize this prompt. For now: name one thing a competitor would need to spend or sacrifice to rebuild what you've built. Be specific — years, relationships, mistakes.",
      competition: "Strengthen your description above — it'll personalize this prompt. For now: name one thing a chain couldn't copy without abandoning what makes them scalable. Not a feature. A trade-off they'd refuse to make.",
    };
    return fb[perspectiveKey];
  }

  const brand = nouns.brandName || "your business";
  const cust = nouns.customerNoun || "customer";
  const venue = nouns.venueNoun || "location";
  const people = nouns.peopleNoun || "team";
  const product = nouns.productNoun || "offering";

  const a = (w: string) => (/^[aeiouAEIOU]/.test(w) ? "an" : "a");

  const templates: Record<Perspective["key"], string> = {
    customer: `e.g. "Our best ${cust} walks into ${brand} already knowing what's possible here — not because we sold them on it, but because someone they trust came first. They leave with ${a(product)} ${product} the nearest alternative can't match, and the ${venue} feels like theirs for the time they were inside it."`,
    culture: `e.g. "The kind of person who thrives here doesn't want a chain's career path. They want years of knowing every regular ${cust} by name, working with our ${people} to build the kind of ${product} nobody's done quite this way, and telling a skeptical friend at dinner that ${brand} is actually somewhere worth staying."`,
    investor: `e.g. "A buyer looking at ${brand} sees ${a(venue)} ${venue} a national operator has been trying to replicate for years and still can't. The ${cust} list didn't come from ads — it came from a decade of our ${people} treating every walk-in like the only one that day. That's not a line item. That's the premium."`,
    competition: `e.g. "A chain entering our market next year could copy the ${product}, the pricing, maybe the storefront of ${brand}. They couldn't copy a ${cust} who's been coming since before they had kids and now brings them. They couldn't copy ${a(venue)} ${venue} that feels like this neighborhood instead of any intersection in America."`,
  };

  return templates[perspectiveKey];
}

// ── COMPETITOR WORD BOARD — suggested word sets + narrative engine ──
// Each competitor card pulls from one of these "AI suggested" sets first
// before exposing the full COMP_WORDS pool. SHUFFLE rotates through the sets.
export const COMPETITOR_SUGGESTED_SETS: string[][] = [
  ["TRUSTED", "PREMIUM", "TECHNOLOGY", "BRAND RECOGNITION", "COMMUNITY"],
  ["ESTABLISHED", "QUALITY", "DESIGN", "SPECIALIZATION", "CUSTOMER SERVICE"],
  ["WELL-FUNDED", "NATIONAL REACH", "RESOURCES", "MARKETING SPEND", "PARTNERSHIPS"],
  ["AFFORDABLE", "FAST", "CONVENIENT", "PRICE LEADER", "DISTRIBUTION"],
  ["VISIONARY FOUNDER", "INDUSTRY EXPERIENCE", "LOYALTY PROGRAMS", "SALES FORCE", "TRUSTED"],
];

/** Default mock competitor dataset for the Competitive Analysis step. */
export interface CompetitorMock {
  id: string;
  name: string;
  /** Hex color used for borders, badges, and narrative highlights. */
  color: string;
  top5: string[];
  aiNarrative: string;
  locked: boolean;
}

export const DEFAULT_COMPETITORS: CompetitorMock[] = [
  { id: "a", name: "COMPETITOR A", color: "#7c3aed", top5: [], aiNarrative: "", locked: false },
  { id: "b", name: "COMPETITOR B", color: "#0ea5e9", top5: [], aiNarrative: "", locked: false },
  { id: "c", name: "COMPETITOR C", color: "#f97316", top5: [], aiNarrative: "", locked: false },
];

/**
 * Generate a narrative for a competitor word board. Cycles 4 narrative voice
 * variants based on `version`; flags PRICE LEADER + PREMIUM as a brand
 * conflict. Wraps the highlighted words in `[BRACKETS]` so NarrativeDisplay
 * can render them in the competitor color.
 */
export function generateCompetitorNarrative(
  competitorName: string,
  ranked: string[],
  version: number,
): string {
  if (ranked.length < 3) return "";
  const name = competitorName.trim() || "This competitor";
  const r = ranked;
  const br = (w: string) => `[${w}]`;
  const conflicts =
    r.includes("PRICE LEADER") && r.includes("PREMIUM")
      ? ` ⚠ CONFLICT: [PRICE LEADER] and [PREMIUM] contradict — this signals brand confusion in the market.`
      : "";
  const techSignal =
    r.includes("TECHNOLOGY") || r.includes("WELL-FUNDED")
      ? `Their technology investment signals a move toward the Bleeding Edge.`
      : `Their positioning has not staked out Innovation leadership — that is your opening.`;
  const cn = `[${name}]`;
  const v = version % 4;

  let nar = "";
  if (v === 0) {
    nar = `${cn} competes primarily on ${br(r[0])}${r[1] ? ` and ${br(r[1])}` : ""}. ${
      r[2]
        ? `Their approach to ${br(r[2])}${r[3] ? ` and ${br(r[3])}` : ""} creates a defensible position in their current market.`
        : ""
    } ${techSignal}${conflicts}`;
  } else if (v === 1) {
    nar = `The market knows ${cn} for ${br(r[0])}${r[1] ? ` — and increasingly for ${br(r[1])}` : ""}. ${
      r[2] ? `${br(r[2])}${r[3] ? ` and ${br(r[3])}` : ""} are the pillars they've built their reputation on.` : ""
    } ${r[4] ? `${br(r[4])} is the differentiator they lead with when the sale gets competitive.` : ""} ${techSignal}${conflicts}`;
  } else if (v === 2) {
    nar = `${cn}'s brand narrative is built around ${br(r[0])}. ${
      r[1] ? `${br(r[1])} amplifies that position — it's the reason their customers stay.` : ""
    } ${r[2] && r[3] ? `The combination of ${br(r[2])} and ${br(r[3])} is their competitive moat: difficult to replicate quickly.` : ""} ${techSignal}${conflicts}`;
  } else {
    nar = `If you were a buyer evaluating ${cn}, you'd see ${br(r[0])} as their headline.${
      r[1] ? ` ${br(r[1])} is the proof point — what customers report when asked to describe the experience.` : ""
    } ${r[2] ? `${br(r[2])}${r[3] ? ` and ${br(r[3])}` : ""} are their operational advantages.` : ""} ${
      r[4] ? `${br(r[4])} is the story they tell in competitive situations.` : ""
    } ${techSignal}${conflicts}`;
  }
  return nar.replace(/\s+/g, " ").trim();
}

// ── CONTEXT MAP (01.10 Step 3) ────────────────────────────────
// Five brand-identity dimensions, each with a primary word-bucket map and
// three rotating narrative templates. Direct port of source v80 lines 3837–3888.

export type CtxKey = "objective" | "culture" | "customer" | "vision" | "persona";

export interface CtxDimDef {
  key: CtxKey;
  label: string;
  color: string;
  /** Word-board categories whose primary words anchor this dimension. */
  wordDims: Array<keyof typeof CTX_DIM_MAP>;
  starter: string;
  prompt: string;
  templates: Array<(companyName: string, words: string[]) => string>;
}

/** Word-to-category map used to pull primary words per dimension. */
export const CTX_DIM_MAP = {
  PRODUCT: ["INNOVATIVE","CREATIVE","UNIQUE OFFERING","PREMIUM","DISRUPTIVE","PIONEERING","GAME-CHANGER","1ST TO MARKET","INGENUITY","IMPROVEMENT","PROBLEM SOLVING","BOLD"],
  SERVICE: ["COLLABORATIVE","HUMAN","EMPOWERED","ACCOUNTABLE","INCLUSIVE","DRIVEN","EXPERT","AUTHENTIC","PASSIONATE","APPROACHABLE","INSPIRING","EXCELLENCE","RELIABLE","RESOURCEFUL","FOCUSED","THOUGHTFUL","NIMBLE","ADAPTABLE","FLEXIBLE","EFFICIENT"],
  CULTURE: ["PURPOSEFUL","INTEGRITY","TRANSPARENT","CONSISTENT","BRAVE","COMMUNITY","SUSTAINABLE","ADMIRED","TRUSTWORTHY"],
  VALUE: ["ADDING VALUE","ACCESSIBLE","AFFORDABLE","RELEVANT","TIMELY","GET IT DONE","OPPORTUNISTIC","AGGRESSIVE","RESPONSIVE","SUCCESSFUL"],
  CUSTOMER: ["CUSTOMER CENTRIC","CONNECTED","EDUCATION","RESPONSIVE"],
  INTELLIGENCE: ["SMART","VISIONARY","FORWARD-THINKING","THOUGHT LEADER","ANTICIPATION","RISK TAKING"],
} as const;

export const CTX_DIMS: CtxDimDef[] = [
  {
    key: "objective",
    label: "BUSINESS OBJECTIVE",
    color: "#e2b53f",
    wordDims: ["VALUE", "INTELLIGENCE"],
    starter: "The competitor we fear most would achieve this by",
    prompt:
      "Imagine the company that would beat you — steal your staff, your clients, your market. What would they be relentless about that you haven't been? Now become that company. Your objective isn't where you are — it's the standard that makes you the market leader nobody dares copy.",
    templates: [
      (cn, ws) => `[${cn}] was built to achieve something the market hasn't seen yet. ${ws[0] ? `[${ws[0]}] is the non-negotiable — the standard every decision is held against.` : ""} ${ws[1] ? `[${ws[1]}] isn't a department initiative — it's the proof the mission is real.` : ""} ${ws[2] ? `[${ws[2]}] is what surprises the market, inspires the team, and creates desire that no competitor can replicate.` : ""} ${ws[3] ? `[${ws[3]}] is the measuring stick.` : ""} ${ws[4] ? `And [${ws[4]}] is what compounds into exit value, one day at a time.` : ""}`.trim(),
      (cn, ws) => `The company that would take everything from [${cn}] would be relentless about one thing: ${ws[0] ? `[${ws[0]}]` : "execution"}. ${ws[1] ? `So [${ws[1]}] becomes the standard — not the aspiration, the documented operating minimum.` : ""} ${ws[2] ? `[${ws[2]}] keeps the team honest when comfort creeps in.` : ""} ${ws[3] ? `[${ws[3]}] is the filter: if an initiative doesn't serve it, the initiative doesn't ship.` : ""} ${ws[4] ? `[${ws[4]}] is the compounding force — the reason this company is worth more every quarter than it was the last.` : ""}`.trim(),
      (cn, ws) => `Ask what the feared competitor does differently, and the answer is ${ws[0] ? `[${ws[0]}]` : "discipline"}. ${ws[1] ? `They never let [${ws[1]}] become optional. Neither does [${cn}].` : ""} ${ws[2] ? `[${ws[2]}] is where the company's energy goes when nobody is measuring it.` : ""} ${ws[3] || ws[4] ? `${[ws[3], ws[4]].filter(Boolean).map((w) => `[${w}]`).join(" and ")} — these aren't on the roadmap. They're in the DNA.` : ""}`.trim(),
    ],
  },
  {
    key: "culture",
    label: "CULTURE",
    color: "#9aca3e",
    wordDims: ["CULTURE", "SERVICE"],
    starter: "The competitor that would steal our best people would offer",
    prompt:
      "Imagine the company that would hire away your best people. What would it give them that you don't? Now become that company. Culture that SURPRISES employees, INSPIRES them daily, and makes them DESIRE to stay — and tell their friends — isn't accidental. It's designed, defended, and documented.",
    templates: [
      (cn, ws) => `The company that would steal [${cn}]'s best people knows exactly what it would offer: ${ws[0] ? `[${ws[0]}]` : "something irreplaceable"}. ${ws[1] ? `[${ws[1]}] is the culture's operating standard — not a value on a wall, a behavior that gets rewarded and repeated.` : ""} ${ws[2] ? `[${ws[2]}] is what surprises a new hire in week one. It's also what they tell their friends.` : ""} ${ws[3] || ws[4] ? `${[ws[3], ws[4]].filter(Boolean).map((w) => `[${w}]`).join(" and ")} don't appear in the job description. They're the reason people don't look for a new one.` : ""}`.trim(),
      (cn, ws) => `Attrition is expensive. Replacing one employee costs 33–200% of their annual salary. The answer isn't higher pay — it's ${ws[0] ? `[${ws[0]}]` : "belonging"}. ${ws[1] ? `[${ws[1]}] makes the difference between a job and a place someone invests in.` : ""} ${ws[2] ? `[${ws[2]}] is the immune system — it rejects misalignment before it becomes a culture problem.` : ""} Gallup found employees with one close friend at work are 5× less likely to leave.${ws[3] ? ` [${cn}] builds that through [${ws[3]}].` : " Build it deliberately."}`.trim(),
      (cn, ws) => `The culture at [${cn}] is defined by ${ws[0] ? `[${ws[0]}]` : "what happens when nobody is watching"} — and that's exactly what the feared competitor can't replicate overnight. ${ws[1] ? `[${ws[1]}] is safe to do great work here.` : ""} ${ws[2] ? `[${ws[2]}] is what leadership models — and what the team reflects back.` : ""} ${ws[3] || ws[4] ? `${[ws[3], ws[4]].filter(Boolean).map((w) => `[${w}]`).join(" and ")} are the reasons this place is more than a job. They're why people stay, perform, and tell their network.` : ""}`.trim(),
    ],
  },
  {
    key: "customer",
    label: "CUSTOMER",
    color: "#803ee4",
    wordDims: ["CUSTOMER"],
    starter: "The competitor that would steal our customers would make them feel",
    prompt:
      "Imagine the competitor that would take your customers. What experience would they deliver that you haven't? Now exceed it. SURPRISE them with what they didn't expect. INSPIRE them to trust you completely. Create DESIRE so strong they return, refer, and never look for an alternative. Name the emotion — not the feature.",
    templates: [
      (cn, ws) => `The competitor that would take [${cn}]'s customers knows one thing: it isn't the product that wins — it's how the customer feels when the transaction is over. ${ws[0] ? `[${ws[0]}] is the target — the emotion every touchpoint is engineered to produce.` : ""} ${ws[1] ? `[${ws[1]}] converts a first interaction into a referral. Not a loyalty program — a feeling.` : ""} ${ws[2] ? `[${ws[2]}] is the surprise. The thing nobody had to do, but this company does anyway.` : ""} ${ws[3] || ws[4] ? `PwC found 86% of buyers pay more for superior experience. ${[ws[3], ws[4]].filter(Boolean).map((w) => `[${w}]`).join(" and ")} are how this company earns that premium.` : ""}`.trim(),
      (cn, ws) => `${ws[0] ? `[${ws[0]}]` : "Desire"} is the emotion [${cn}] designs for — not satisfaction. There's a difference, and customers feel it immediately. ${ws[1] ? `[${ws[1]}] is the residue left after every interaction. It's what drives the referral before the customer even reaches for their phone.` : ""} ${ws[2] ? `[${ws[2]}] is the architecture — invisible when it's working, catastrophic when it's not.` : ""} ${ws[3] ? `A 5% increase in retention lifts profit 25–95% (Bain). [${ws[3]}] is how that retention is earned.` : ""}`.trim(),
      (cn, ws) => `Every customer builds an emotional memory. The goal is that the last thing they feel is ${ws[0] ? `[${ws[0]}]` : "certainty they made the right choice"}. ${ws[1] ? `[${ws[1]}] is what they experience before they even notice they're experiencing it.` : ""} ${ws[2] ? `[${ws[2]}] is the detail — the thing that turns a customer into an evangelist.` : ""} ${ws[3] || ws[4] ? `${[ws[3], ws[4]].filter(Boolean).map((w) => `[${w}]`).join(" and ")} are what make a customer irreversible — not retained, converted.` : ""}`.trim(),
    ],
  },
  {
    key: "vision",
    label: "BRAND VISION",
    color: "#58d3ff",
    wordDims: ["INTELLIGENCE", "PRODUCT"],
    starter: "The company that would dominate our market and take our position would be known for",
    prompt:
      "Name the companies you genuinely fear as competitors — the ones that would take your staff, your clients, your media coverage, your billboard space. Now build a vision that makes you that company. Simple, honest, directional. Where is this brand headed — and why would someone stake a decade of their career on it?",
    templates: [
      (cn, ws) => `In 10 years, [${cn}] will be the brand the competition fears. ${ws[0] ? `[${ws[0]}] won't be a positioning statement — it'll be a documented market fact.` : ""} ${ws[1] ? `[${ws[1]}] will be the standard new entrants are measured against.` : ""} ${ws[2] ? `[${ws[2]}] will be the moat — the thing that took years to build and can't be copied in a quarter.` : ""} ${ws[3] || ws[4] ? `Companies that optimize for next quarter exit at 3–4×. ${[ws[3], ws[4]].filter(Boolean).map((w) => `[${w}]`).join(" and ")} is the vision that earns 8–12×.` : ""}`.trim(),
      (cn, ws) => `The 10-year version of [${cn}] is already defined — it just hasn't been built yet. ${ws[0] ? `[${ws[0]}] is the north star: the thing that makes every short-term decision easy, because the long-term direction is clear.` : ""} ${ws[1] ? `[${ws[1]}] is the proof — not projected, documented.` : ""} ${ws[2] ? `[${ws[2]}] is the culture that makes the vision inevitable, not aspirational.` : ""} Collins & Porras documented visionary companies outperform the market 15× over 20 years. The difference isn't talent. It's${ws[3] ? ` [${ws[3]}]` : " commitment to a direction that compounds"}.`.trim(),
      (cn, ws) => `A new employee joining [${cn}] in a decade will learn the company chose ${ws[0] ? `[${ws[0]}]` : "a direction"} when most of its competitors chose comfort. ${ws[1] ? `[${ws[1]}] will be referenced in the acquisition brief.` : ""} ${ws[2] ? `[${ws[2]}] will be the story told in the press release.` : ""} ${ws[3] || ws[4] ? `${[ws[3], ws[4]].filter(Boolean).map((w) => `[${w}]`).join(" and ")} aren't features of the future product — they're features of the future company.` : ""}`.trim(),
    ],
  },
  {
    key: "persona",
    label: "BRAND PERSONA",
    color: "#e3398c",
    wordDims: ["PRODUCT", "SERVICE"],
    starter: "If our brand walked into a room, before saying a word, people would notice",
    prompt:
      "Name 3 brands you genuinely admire and fear — Apple, Tesla, Patagonia, whoever. What makes them magnetic? What's the first thing you'd notice about them in a room? The persona isn't your logo — it's the personality that SURPRISES people, makes them want to know more, and creates DESIRE without a single word of marketing. If a customer describes you in one word, what is it?",
    templates: [
      (cn, ws) => `If [${cn}] walked into a room, you'd notice ${ws[0] ? `[${ws[0]}]` : "something distinct"} before they said a word. ${ws[1] ? `[${ws[1]}] is the earned confidence — not performed, but impossible to miss.` : ""} ${ws[2] ? `[${ws[2]}] is how they engage — not delivering warmth procedurally, but actually having it.` : ""} ${ws[3] ? `[${ws[3]}] is what lingers after they've left.` : ""} ${ws[4] ? `Brands with a distinct personality command a 13% price premium (Kantar BrandZ). That premium is [${ws[4]}].` : ""}`.trim(),
      (cn, ws) => `The brands people love aren't products — they're personalities. ${ws[0] ? `[${ws[0]}]` : "Distinction"} is the quality [${cn}] owns. ${ws[1] ? `[${ws[1]}] is why customers return — not for the price point, for the feeling.` : ""} ${ws[2] ? `[${ws[2]}] makes every interaction feel intentional, never procedural.` : ""} ${ws[3] || ws[4] ? `${[ws[3], ws[4]].filter(Boolean).map((w) => `[${w}]`).join(" and ")} — when a customer can describe the brand in one word, the positioning game is already won.` : ""}`.trim(),
      (cn, ws) => `The personality of [${cn}] was never accidental — it was chosen. ${ws[0] ? `[${ws[0]}] is what was chosen: a quality that every hire, every campaign, every product decision either reinforces or erodes.` : ""} ${ws[1] ? `[${ws[1]}] is the quality the team guards, because it's the quality customers remember.` : ""} ${ws[2] ? `[${ws[2]}] isn't a brand attribute. It's a cultural commitment that shows up in the product, the conversation, and the invoice.` : ""} ${ws[3] || ws[4] ? `${[ws[3], ws[4]].filter(Boolean).map((w) => `[${w}]`).join(" and ")} — these are the words that should appear in every exit story.` : ""}`.trim(),
    ],
  },
];

export const CTX_KEYS: CtxKey[] = CTX_DIMS.map((d) => d.key);

/** Rotating secondary word pools — three rotations per dimension. */
export const CTX_POOLS: Record<CtxKey, string[][]> = {
  objective: [
    ["ADVANCE","ACCELERATE","BUILD","LEAD","DEFINE","TRANSFORM","ELEVATE","PIONEER","PROTECT","SCALE"],
    ["EMPOWER","LAUNCH","DISRUPT","OWN","FUEL","CHAMPION","DEFEND","EXPAND","PROVE","WIN"],
    ["DELIVER","INNOVATE","UNIFY","INSPIRE","EARN","MEASURE","ACTIVATE","COMMIT","DOCUMENT","EXECUTE"],
  ],
  culture: [
    ["BELONGING","FRIENDSHIP","TRUST","SAFETY","RECOGNITION","PURPOSE","AUTONOMY","GROWTH","PRIDE","CARE"],
    ["LOYALTY","CONNECTION","MEANING","INCLUSION","ACCOUNTABILITY","CELEBRATION","RESILIENCE","TRANSPARENCY","MENTORSHIP","FUN"],
    ["COMMUNITY","OWNERSHIP","VOICE","WELLBEING","CRAFT","IMPACT","CHALLENGE","MASTERY","CAMARADERIE","JOY"],
  ],
  customer: [
    ["DELIGHT","SURPRISE","CERTAINTY","SPEED","CLARITY","EASE","CONFIDENCE","TRUST","BELONGING","WARMTH"],
    ["DISCOVERY","RELIEF","EMPOWERMENT","STATUS","SAFETY","EXCITEMENT","GRATITUDE","LOYALTY","DELIGHT","PRIDE"],
    ["CONNECTION","VALUE","TRANSFORMATION","RECOGNITION","ANTICIPATION","MOMENTUM","APPRECIATION","SECURITY","AWE","JOY"],
  ],
  vision: [
    ["CATEGORY-DEFINING","INDISPENSABLE","IRREPLACEABLE","TRUSTED","GLOBAL","SCALABLE","MEASURABLE","PROVEN","ENDURING","ADMIRED"],
    ["TRANSFORMATIVE","ESSENTIAL","ICONIC","BENCHMARKED","COMPOUNDING","DEFENSIBLE","PORTABLE","CERTIFIED","DOCUMENTED","REFERENCED"],
    ["AUTONOMOUS","SYSTEMATIC","PREDICTABLE","REPEATABLE","EXPORTABLE","FRANCHISEABLE","ACQUIRABLE","INVESTABLE","LEGACY","LANDMARK"],
  ],
  persona: [
    ["CONFIDENT","WARM","SHARP","HONEST","UNEXPECTED","GENEROUS","PRECISE","MAGNETIC","GROUNDED","PLAYFUL"],
    ["AUTHORITATIVE","APPROACHABLE","CURATED","EFFORTLESS","PRINCIPLED","BOLD","REFINED","DIRECT","SPIRITED","DEPENDABLE"],
    ["SOPHISTICATED","SCRAPPY","VISIONARY","STEADY","PROVOCATIVE","GENUINE","AMBITIOUS","THOUGHTFUL","INVENTIVE","MEMORABLE"],
  ],
};

/** Citation stat shown on each context card. */
export const CTX_DATA: Record<CtxKey, { stat: string; source: string }> = {
  objective: { stat: "Companies with a documented purpose grow 3× faster and retain top talent 40% longer.", source: "Deloitte Human Capital Report, 2023" },
  culture: { stat: "Employees with one close friend at work are 5× less likely to leave. Attrition costs 33–200% of annual salary per departure.", source: "Gallup State of the American Workplace; SHRM Workforce Turnover Study" },
  customer: { stat: "86% of buyers will pay more for a superior customer experience. A 5% increase in retention lifts profit by 25–95%.", source: "PwC Future of CX Report; Bain & Company" },
  vision: { stat: "Companies with a 10-year vision are 2.1× more likely to outperform their market than those optimizing for the next 12 months.", source: "Collins & Porras, Built to Last; McKinsey Long-Term Capitalism Study" },
  persona: { stat: "Brands with a distinct personality command a 13% price premium and convert at 2.3× the rate of commodity competitors.", source: "Kantar BrandZ Global Study, 2024" },
};

export interface CtxDimState {
  words: string[];
  narrative: string;
  versions: string[];
  verIdx: number;
  savedAt: Record<number, string>;
  deleteConfirm: boolean;
  narSaved: boolean;
}

export const makeCtxDimState = (): CtxDimState => ({
  words: [],
  narrative: "",
  versions: [],
  verIdx: -1,
  savedAt: {},
  deleteConfirm: false,
  narSaved: false,
});

export const makeCtxNarState = (): Record<CtxKey, CtxDimState> => ({
  objective: makeCtxDimState(),
  culture: makeCtxDimState(),
  customer: makeCtxDimState(),
  vision: makeCtxDimState(),
  persona: makeCtxDimState(),
});

/** Pull primary words for a dimension from the user's selected stack. */
export function getPrimaryCtxWords(
  selected: string[],
  dims: Array<keyof typeof CTX_DIM_MAP>,
): string[] {
  return selected.filter((w) => dims.some((d) => (CTX_DIM_MAP[d] as readonly string[]).includes(w)));
}

