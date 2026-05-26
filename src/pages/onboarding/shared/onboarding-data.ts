// Onboarding flow data — FRAMEWORK 21Q + FOCUS 100Q + DEMOGRAPHICS.
//
// Source of truth:
//   - gst_21-attachments/GPS-FRAMEWORK-Complete-21-Question-Bank-Mapping-05-22-v1.md
//   - gst_21-attachments/GPS-FOCUS-Complete-100-Question-Bank-Mapping-05-22-v1.md
//
// Pillars differ by module:
//   - FRAMEWORK = 4 pillars (PERCEPTION, CLARITY, IDENTITY, CULTURE) — no EXIT
//   - FOCUS    = 5 pillars (PERCEPTION, CLARITY, IDENTITY, CULTURE, EXECUTION)
//
// Each question carries:
//   - text       — the question (per-demographic variant where applicable)
//   - yesStats[] — gamification / reinforcement stats (shown on YES)
//   - noStats[]  — fear / cost-of-inaction stats (shown on NO; also drives blindspot)
//   - blindspot  — implication + GESTALT solution + timeline/priority/impact
//
// FRAMEWORK stats are sourced verbatim from the client doc.
// FOCUS questions arrive WITHOUT stats in the client doc — they use STUB-CONTENT
// placeholders flagged with `stub: true`. Replace once client delivers FOCUS stats.

// ── Types ───────────────────────────────────────────────────────────────
export type FrameworkPillar = "PERCEPTION" | "CLARITY" | "IDENTITY" | "CULTURE";
export type FocusPillar = "PERCEPTION" | "CLARITY" | "IDENTITY" | "CULTURE" | "EXECUTION";
export type Pillar = FrameworkPillar | FocusPillar;

export const FRAMEWORK_PILLARS: FrameworkPillar[] = ["PERCEPTION", "CLARITY", "IDENTITY", "CULTURE"];
export const FOCUS_PILLARS: FocusPillar[] = ["PERCEPTION", "CLARITY", "IDENTITY", "CULTURE", "EXECUTION"];

export type Demographic = "BB" | "BO" | "IA" | "AC";

export type DemographicColor = "blue" | "gold" | "green" | "red";

export const DEMOGRAPHICS: { id: Demographic; tag: string; title: string; desc: string; color: DemographicColor }[] = [
  { id: "BB", tag: "BUSINESS BUILDERS", title: "Build Right From Day One", desc: "Startups building for maximum exit value.", color: "blue" },
  { id: "BO", tag: "BUSINESS OWNERS", title: "Eliminate Complacency", desc: "Owners preparing to exit at premium multiples.", color: "gold" },
  { id: "IA", tag: "INVESTORS + ACQUIRERS", title: "Maximize Your Acquisition", desc: "PE firms building value post-acquisition.", color: "green" },
  { id: "AC", tag: "AGENCIES + CONSULTANTS", title: "Escape RFP Hell Forever", desc: "Walk in already knowing the problem.", color: "red" },
];

export type Stat = { highlight: string; text: string; source: string };

export type OnboardingQuestion = {
  id: string;
  pillar: Pillar;
  // Per-demographic question text. If a key is missing, fall back to `BO` (the default).
  text: Partial<Record<Demographic, string>>;
  // Per-demographic YES stats. If missing for a demographic, fall back to `BO`.
  yesStats: Partial<Record<Demographic, Stat[]>>;
  // Per-demographic NO stats. If missing for a demographic, fall back to `BO`.
  noStats: Partial<Record<Demographic, Stat[]>>;
  blindspot: {
    implication: string;
    gestaltSolution: string;
    timeline: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    impact: "LOW" | "MEDIUM" | "HIGH";
  };
  stub?: boolean; // STUB-CONTENT marker
};

// Helper: resolve per-demographic field with BO fallback (matches client spec).
export function pickForDemo<T>(field: Partial<Record<Demographic, T>>, demo: Demographic): T {
  return (field[demo] ?? field.BO ?? Object.values(field)[0]) as T;
}

// Compact helpers to keep the data tables readable.
const s = (highlight: string, text: string, source: string): Stat => ({ highlight, text, source });

// Default blindspot factory keyed off pillar — keeps copy on-brand without per-Q hand-tuning.
function defaultBlindspot(pillar: Pillar, idxInPillar: number): OnboardingQuestion["blindspot"] {
  const solution: Record<Pillar, string> = {
    PERCEPTION: "Perception Alignment Program",
    CLARITY: "Messaging Clarity Sprint",
    IDENTITY: "Identity Audit + Refresh",
    CULTURE: "Culture Alignment Program",
    EXECUTION: "Operations Resilience Sprint",
  };
  const implication: Record<Pillar, string> = {
    PERCEPTION: "Unclear brand perception silently shaves multiples off your exit valuation while better-positioned competitors win deals you should have closed.",
    CLARITY: "Strategic clarity gaps create cascading misalignment: scattered effort, lost deals, slow execution, and a business that can't be cleanly handed off.",
    IDENTITY: "Brand inconsistency erodes recognition, trust, and pricing power — buyers see it as a sign of operational immaturity and discount accordingly.",
    CULTURE: "Cultural gaps show up as turnover, inconsistent customer experience, and post-acquisition value destruction — the #1 reason 70% of M&A deals underperform.",
    EXECUTION: "Operational gaps compound. Each one left unaddressed becomes a line item in the discount an acquirer applies to your offer.",
  };
  return {
    implication: implication[pillar],
    gestaltSolution: solution[pillar],
    timeline: ["1 week", "2-3 weeks", "4 weeks", "6 weeks"][idxInPillar % 4],
    priority: (["MEDIUM", "HIGH", "MEDIUM", "HIGH", "LOW"] as const)[idxInPillar % 5],
    impact: (["HIGH", "MEDIUM", "HIGH", "MEDIUM", "MEDIUM"] as const)[idxInPillar % 5],
  };
}

// ════════════════════════════════════════════════════════════════════════
// FRAMEWORK — 21 questions (4 pillars). Stats verbatim from client doc.
// ════════════════════════════════════════════════════════════════════════

export const FRAMEWORK_QUESTIONS: OnboardingQuestion[] = [
  // ── PERCEPTION (5) ─────────────────────────────────────────────────
  {
    id: "fw-1",
    pillar: "PERCEPTION",
    text: { BO: "Do your customers clearly understand what your brand stands for?" },
    yesStats: {
      BO: [
        s("89% of customers", "stay loyal to brands that share their values — you're in the loyalty zone.", "Adobe for Business"),
        s("Brands with strong customer understanding", "command 20-30% price premiums over competitors.", "McKinsey"),
      ],
    },
    noStats: {
      BO: [
        s("84% of customers", "report their expectations were NOT exceeded — and unclear brands are the first to lose them.", "Harvard Business Review"),
        s("Companies with unclear brand positioning", "lose 10-20% of potential revenue annually to better-positioned competitors.", "Bain & Company"),
      ],
    },
    blindspot: defaultBlindspot("PERCEPTION", 0),
  },
  {
    id: "fw-2",
    pillar: "PERCEPTION",
    text: {
      BB: "Can your customers, partners, or collaborators describe your brand the same way you do?",
      BO: "Do your employees describe your brand the same way your leadership team does?",
      IA: "Can the portfolio company's employees articulate the brand the same way leadership does?",
      AC: "Do your team members describe your agency's brand the same way you do?",
    },
    yesStats: {
      BB: [
        s("64% of consumers", "cite shared values as the primary reason for brand loyalty — your stakeholders are aligned with your message.", "Harvard Business Review"),
        s("Brands with consistent stakeholder messaging", "see 23% higher revenue growth than those without.", "Lucidpress"),
      ],
      BO: [
        s("Companies with aligned employer brands", "reduce turnover by 28% — that's direct savings on hiring costs.", "LinkedIn"),
        s("Employee-aligned brands", "see 2.5× higher shareholder returns over 3 years.", "Gallup"),
      ],
      IA: [
        s("Employee-aligned brands", "see 2.5× higher shareholder returns over 3 years — alignment is a direct value multiplier.", "Gallup"),
        s("Companies with strong employer brands", "reduce cost-per-hire by 43%.", "LinkedIn"),
      ],
      AC: [
        s("Agencies with internally aligned messaging", "win 38% more new business pitches.", "Hinge Research Institute"),
        s("Companies with aligned employer brands", "reduce turnover by 28%.", "LinkedIn"),
      ],
    },
    noStats: {
      BB: [
        s("81% of consumers", "say they need to trust a brand before buying — and inconsistent messaging destroys trust 5× faster than it builds.", "Edelman Trust Barometer"),
        s("Misaligned brand perception", "costs small businesses an average of $15,000/year in lost conversions.", "Lucidpress"),
      ],
      BO: [
        s("52% of jobseekers", "would not accept a job offer if they didn't know or agree with company values — you're losing talent before they even apply.", "Harvard Business Review"),
        s("Misaligned internal branding", "costs mid-market companies an average of $450,000/year in turnover and lost productivity.", "Gallup"),
      ],
      IA: [
        s("52% of jobseekers", "reject offers from companies with unclear values — the portfolio company is bleeding talent.", "Harvard Business Review"),
        s("Brand misalignment between leadership and employees", "is the #1 culture risk in 67% of M&A transactions.", "Deloitte"),
      ],
      AC: [
        s("52% of jobseekers", "reject offers from companies with unclear values — your best recruits are walking.", "Harvard Business Review"),
        s("Internal brand confusion", "leads to 36% lower client retention rates in professional services firms.", "Hinge Research Institute"),
      ],
    },
    blindspot: defaultBlindspot("PERCEPTION", 1),
  },
  {
    id: "fw-3",
    pillar: "PERCEPTION",
    text: {
      BB: "Have you clearly decided how you want your brand to be perceived in the market?",
      BO: "Does your executive team agree on how your brand should be perceived in the market?",
      IA: "Does the portfolio company's leadership team have a unified view of brand positioning?",
      AC: "Do your partners and senior team agree on how your agency should be perceived?",
    },
    yesStats: {
      BB: [
        s("Entrepreneurs who document brand positioning", "are 2.5× more likely to achieve product-market fit.", "CB Insights"),
        s("Brands with defined positioning", "are 3× more likely to grow faster than competitors.", "McKinsey"),
      ],
      BO: [
        s("Aligned executive teams", "are 1.9× more likely to deliver above-median financial performance.", "McKinsey"),
        s("Companies with unified leadership vision", "grow revenue 19% faster than those with internal disagreements.", "Harvard Business Review"),
      ],
      IA: [
        s("Aligned executive teams", "are 1.9× more likely to deliver above-median financial performance — this is a value multiplier.", "McKinsey"),
        s("Post-acquisition companies with aligned leadership", "retain 73% more key employees in Year 1.", "Deloitte"),
      ],
      AC: [
        s("Professional services firms with aligned partner vision", "grow 31% faster than misaligned competitors.", "Hinge Research Institute"),
        s("Aligned leadership teams", "close 1.9× more deals.", "McKinsey"),
      ],
    },
    noStats: {
      BB: [
        s("42% of startups", "fail because there's no market need — often a positioning failure that started with no defined perception.", "CB Insights"),
        s("Undefined brands", "spend 60% more on customer acquisition because they can't articulate why someone should choose them.", "HubSpot"),
      ],
      BO: [
        s("80% of leaders", "think their brand delivers on promises — only 8% of customers agree. That 72-point gap is where revenue dies.", "Bain & Company"),
        s("Executive misalignment", "costs mid-market companies an average of $1.3M/year in duplicated efforts and conflicting strategies.", "McKinsey"),
      ],
      IA: [
        s("80% of leaders", "think their brand delivers — only 8% of customers agree. That gap will show up in due diligence.", "Bain & Company"),
        s("Leadership misalignment", "is the #1 post-acquisition culture risk, cited in 67% of failed integrations.", "Deloitte"),
      ],
      AC: [
        s("80% of leaders", "think their brand delivers — only 8% of customers agree. Your clients see the disconnect.", "Bain & Company"),
        s("Agencies with partner disagreements on positioning", "lose 22% of pitches they should have won.", "Hinge Research Institute"),
      ],
    },
    blindspot: defaultBlindspot("PERCEPTION", 2),
  },
  {
    id: "fw-4",
    pillar: "PERCEPTION",
    text: { BO: "Is how you want your company to be perceived clearly defined in your brand guidelines?" },
    yesStats: {
      BO: [
        s("Brands with defined positioning", "are 3× more likely to grow faster than competitors.", "McKinsey"),
        s("93% of high-growth brands", "have defined metrics for purpose statements — you're in their company.", "Deloitte"),
      ],
    },
    noStats: {
      BO: [
        s("Brands without documented positioning", "grow 3× slower than those who define it.", "McKinsey"),
        s("Only 7% of low-growth brands", "have established purpose metrics — you're in their company instead.", "Deloitte"),
      ],
    },
    blindspot: defaultBlindspot("PERCEPTION", 3),
  },
  {
    id: "fw-5",
    pillar: "PERCEPTION",
    text: { BO: "Is your brand's perception aligned with your exit strategy or long-term valuation goal?" },
    yesStats: {
      BO: [
        s("Companies with strategic brand alignment", "see 20-30% higher valuations during acquisition.", "Harvard Business Review"),
        s("Above-average customer satisfaction scores", "achieve 4× growth in value over 10 years.", "Deloitte"),
      ],
    },
    noStats: {
      BO: [
        s("20% of enterprise value", "is accounted for by intangible assets like brand — and you're not managing it.", "Brand Finance"),
        s("Companies without brand-exit alignment", "sell at an average 2.5× EBITDA multiple instead of the 7-10× that aligned brands command.", "Exit Planning Institute"),
      ],
    },
    blindspot: defaultBlindspot("PERCEPTION", 4),
  },

  // ── CLARITY (5) — all universal ────────────────────────────────────
  {
    id: "fw-6",
    pillar: "CLARITY",
    text: { BO: "Do you have a written brand strategy document that's accessible?" },
    yesStats: {
      BO: [
        s("Companies with documented brand strategies", "grow 2× faster than those without.", "Lucidpress (Marq)"),
        s("93% of high-growth brands", "have established purpose metrics — documentation is the foundation.", "CMOsurvey.org"),
      ],
    },
    noStats: {
      BO: [
        s("Companies without documented strategies", "are 313% less likely to report successful outcomes from their marketing efforts.", "CoSchedule"),
        s("Only 37% of businesses", "have a documented content strategy — the rest are guessing, and it shows in their revenue.", "Content Marketing Institute"),
      ],
    },
    blindspot: defaultBlindspot("CLARITY", 0),
  },
  {
    id: "fw-7",
    pillar: "CLARITY",
    text: { BO: "Has your brand strategy been updated in the last 12 months?" },
    yesStats: {
      BO: [
        s("Brands that refresh strategy annually", "are 50% more likely to outperform on personalization — the #1 customer expectation in 2025.", "Innosight/HBR"),
        s("Companies that adapt strategy at least annually", "see 33% higher employee engagement scores.", "Gallup"),
      ],
    },
    noStats: {
      BO: [
        s("The average time from market leader to irrelevance", "has shrunk from 35 years to just 7 years — stale strategy accelerates that clock.", "Harvard Business Review"),
        s("52% of Fortune 500 companies from 2000", "have disappeared — most because they stopped evolving their brand strategy.", "Innosight"),
      ],
    },
    blindspot: defaultBlindspot("CLARITY", 1),
  },
  {
    id: "fw-8",
    pillar: "CLARITY",
    text: { BO: "Do you have a defined process for brand audits and reviews?" },
    yesStats: {
      BO: [
        s("93% of high-growth brands", "have established key metrics tied to brand purpose — systematic review is what separates them.", "Deloitte"),
        s("Workers who trust their employers", "are 260% more motivated — and trust comes from consistent self-assessment.", "Deloitte"),
      ],
    },
    noStats: {
      BO: [
        s("Companies without regular brand audits", "are 47% more likely to experience a brand crisis.", "Weber Shandwick"),
        s("Only 50% of workers are engaged", "when they don't trust leadership's self-awareness — and brand audits are how you demonstrate it.", "Deloitte"),
      ],
    },
    blindspot: defaultBlindspot("CLARITY", 2),
  },
  {
    id: "fw-9",
    pillar: "CLARITY",
    text: { BO: "Do you measure how loyal, memorable, and respected your brand really is — using metrics like NPS, brand recall, or customer perception?" },
    yesStats: {
      BO: [
        s("71% of brands", "report improved customer loyalty when personalization is core — and you can't personalize without measurement.", "SurveyMonkey"),
        s("66% of Fortune 1000 companies", "use NPS as a primary loyalty metric — you're operating at enterprise level.", "Interaction Metrics"),
      ],
    },
    noStats: {
      BO: [
        s("Companies that don't measure brand loyalty", "see 25% higher customer churn than those that do.", "Bain & Company"),
        s("44% of companies", "can't calculate their customer acquisition cost — because they've never measured what keeps customers coming back.", "Invesp"),
      ],
    },
    blindspot: defaultBlindspot("CLARITY", 3),
  },
  {
    id: "fw-10",
    pillar: "CLARITY",
    text: { BO: "Have you conducted competitive benchmarking in the last year?" },
    yesStats: {
      BO: [
        s("90% of Fortune 500 companies", "use competitive intelligence to maintain their edge — you're playing at their level.", "Evalueserve"),
        s("Companies using CI", "grow revenue 2× faster than non-users over a 3-year period.", "Crayon"),
      ],
    },
    noStats: {
      BO: [
        s("56% of executives", "constantly monitor potential competitors — if you're not one of them, they see you before you see them.", "Evalueserve"),
        s("Companies blindsided by competitors", "lose an average of 15% market share before they can respond.", "McKinsey"),
      ],
    },
    blindspot: defaultBlindspot("CLARITY", 4),
  },

  // ── IDENTITY (5) ───────────────────────────────────────────────────
  {
    id: "fw-11",
    pillar: "IDENTITY",
    text: { BO: "Do you have a formal brand guidelines document (logo, color, tone, typography)?" },
    yesStats: {
      BO: [
        s("Brands that are consistently presented", "see up to 33% more revenue.", "Lytho"),
        s("93% of high-growth brands", "have documented guidelines — consistency is the throughline.", "Deloitte"),
      ],
    },
    noStats: {
      BO: [
        s("Inconsistent brands", "lose up to 33% of potential revenue — that's money walking out the door every quarter.", "Lytho"),
        s("60% of brands", "say their content is often or always off-brand — because there are no guidelines to follow.", "Lucidpress"),
      ],
    },
    blindspot: defaultBlindspot("IDENTITY", 0),
  },
  {
    id: "fw-12",
    pillar: "IDENTITY",
    text: { BO: "Is your identity system used consistently across all physical and digital touchpoints?" },
    yesStats: {
      BO: [
        s("Brands with long-term consistency", "see 2× profit gains vs. those that constantly shift.", "Funnel"),
        s("Consistent brand presentation across all touchpoints", "generates 33% more revenue.", "PR Newswire"),
      ],
    },
    noStats: {
      BO: [
        s("Inconsistent brand presentation", "confuses 71% of consumers, directly reducing purchase intent.", "Lucidpress"),
        s("Brands that shift messaging frequently", "lose 2× the profits of those that stay consistent.", "Funnel"),
      ],
    },
    blindspot: defaultBlindspot("IDENTITY", 1),
  },
  {
    id: "fw-13",
    pillar: "IDENTITY",
    text: { BO: "Has your website been updated in the past 12 months to reflect brand evolution?" },
    yesStats: {
      BO: [
        s("46.1% of people", "judge credibility based on website design — yours is current and working for you.", "Stanford Web Credibility Project"),
        s("Companies that update websites regularly", "see 55% more visitors and 97% more inbound links.", "HubSpot"),
      ],
    },
    noStats: {
      BO: [
        s("Users form first impressions", "of your site in 50 milliseconds — and an outdated site loses them instantly.", "PMC"),
        s("38% of visitors", "stop engaging with a website if the layout or content is unattractive or outdated.", "Adobe"),
      ],
    },
    blindspot: defaultBlindspot("IDENTITY", 2),
  },
  {
    id: "fw-14",
    pillar: "IDENTITY",
    text: { BO: "Do your brand visuals match the emotion and expectations of your ideal customer?" },
    yesStats: {
      BO: [
        s("87.6% of consumers", "intend to purchase high-aesthetic products vs. only 67.3% for low-aesthetic — your visuals are selling for you.", "Neuroscience ERP Study"),
        s("94% of consumers", "prefer image-based content when evaluating brands — aligned visuals accelerate trust.", "MDPI"),
      ],
    },
    noStats: {
      BO: [
        s("Low-aesthetic design", "reduces purchase intent by 20.3 percentage points vs. high-aesthetic alternatives.", "Neuroscience ERP Study"),
        s("75% of consumers", "judge a company's credibility based on visual design — mismatched visuals are actively repelling buyers.", "Stanford/Google"),
      ],
    },
    blindspot: defaultBlindspot("IDENTITY", 3),
  },
  {
    id: "fw-15",
    pillar: "IDENTITY",
    text: {
      BB: "Are all your customer-facing materials (proposals, social profiles, email signatures, templates) aligned with your brand strategy?",
      BO: "Is your signage, packaging, and print collateral updated and aligned with your strategy?",
      IA: "Are the portfolio company's physical and digital touchpoints consistent with the stated brand strategy?",
      AC: "Are your pitch decks, case studies, and client-facing materials aligned with your agency's brand?",
    },
    yesStats: {
      BB: [
        s("Consistent brand presentation", "generates 33% more revenue — every touchpoint is reinforcing your message.", "Lucidpress"),
        s("94% of first impressions", "are design-related — your materials are doing the selling before you speak.", "Northumbria University"),
      ],
      BO: [
        s("72% of consumers", "say packaging design influences purchase decisions — your physical presence is converting.", "PMC"),
        s("50% of new customers", "are drawn into a store because of signage — aligned signage is a revenue driver.", "YESCO"),
      ],
      IA: [
        s("Brand consistency across touchpoints", "increases revenue up to 33% — this is a measurable value driver.", "Lucidpress"),
        s("Consistent brands", "are 3.5× more visible to buyers during M&A screening.", "Deloitte"),
      ],
      AC: [
        s("70% of B2B buyers", "say content quality influences purchasing decisions — your materials are closing deals.", "Demand Gen Report"),
        s("Professional services firms with polished collateral", "close 28% more proposals.", "Hinge Research Institute"),
      ],
    },
    noStats: {
      BB: [
        s("72% of consumers", "say design influences their purchase decisions — inconsistent materials are costing you deals you'll never know about.", "PMC"),
        s("Small businesses with inconsistent branding", "lose an estimated $15,000/year in missed conversions.", "Lucidpress"),
      ],
      BO: [
        s("72% of American consumers", "base purchase decisions on packaging — outdated packaging is silently losing sales.", "PMC"),
        s("Misaligned physical touchpoints", "create a 29% drop in brand trust compared to digitally consistent brands.", "Lucidpress"),
      ],
      IA: [
        s("72% of consumers", "base decisions on design consistency — the portfolio company is leaking value at every touchpoint.", "PMC"),
        s("Brand inconsistency", "reduces perceived company value by 18-25% during due diligence.", "EY"),
      ],
      AC: [
        s("70% of B2B buyers", "judge vendors by content quality — unaligned materials are losing you pitches.", "Demand Gen Report"),
        s("Agencies with inconsistent collateral", "see 36% lower win rates on competitive proposals.", "Hinge Research Institute"),
      ],
    },
    blindspot: defaultBlindspot("IDENTITY", 4),
  },

  // ── CULTURE (6) ────────────────────────────────────────────────────
  {
    id: "fw-16",
    pillar: "CULTURE",
    text: { BO: "If a new competitor entered tomorrow, could you pivot fast enough to defend market share?" },
    yesStats: {
      BO: [
        s("Agile organizations", "are 3× more likely to perform in the top 25% of their industry — you're built for survival.", "McKinsey"),
        s("Companies with agile practices", "make decisions 5-10× faster than competitors.", "McKinsey"),
      ],
    },
    noStats: {
      BO: [
        s("88% of the Fortune 500 companies from 1955", "are gone — every one of them thought they could pivot fast enough.", "AEI"),
        s("Companies that can't pivot", "lose an average of 15% market share within 18 months of a new competitive entry.", "McKinsey"),
      ],
    },
    blindspot: defaultBlindspot("CULTURE", 0),
  },
  {
    id: "fw-17",
    pillar: "CULTURE",
    text: {
      BB: "Do you actively recognize and reward customers, partners, or collaborators who advocate for your brand?",
      BO: "Do you actively reward employees who champion the brand internally or externally?",
      IA: "Does the portfolio company have a formal program for recognizing employees who champion the brand?",
      AC: "Do you actively reward team members and clients who advocate for your agency's brand?",
    },
    yesStats: {
      BB: [
        s("Referred customers", "have 37% higher retention rates — your advocacy network is a revenue engine.", "Wharton School"),
        s("Word-of-mouth", "drives $6 trillion in annual consumer spending — you're tapped into the most powerful marketing channel.", "WOMMA"),
      ],
      BO: [
        s("86% of value-based recognition programs", "report improved worker happiness — your culture is compounding.", "Vantage Circle"),
        s("Companies with recognition programs", "have 31% lower voluntary turnover — saving $15,000-$25,000 per retained employee.", "Bersin by Deloitte"),
      ],
      IA: [
        s("Companies with recognition programs", "have 31% lower voluntary turnover — this protects post-acquisition retention.", "Bersin by Deloitte"),
        s("86% of value-based recognition programs", "drive improved happiness metrics — a leading indicator of integration success.", "Vantage Circle"),
      ],
      AC: [
        s("Client referrals", "are the #1 source of new business for professional services firms — your advocacy engine is working.", "Hinge Research Institute"),
        s("86% of value-based recognition programs", "drive happiness — your team is your best billboard.", "Vantage Circle"),
      ],
    },
    noStats: {
      BB: [
        s("Customer advocacy programs", "generate 2× higher conversion rates than paid advertising — you're overspending to acquire what advocates would bring free.", "Nielsen"),
        s("92% of consumers", "trust recommendations from people they know over any form of advertising — and you're not leveraging it.", "Nielsen"),
      ],
      BO: [
        s("59% of employees", "would work harder if they felt appreciated — you're leaving discretionary effort on the table.", "Vantage Circle"),
        s("Companies without recognition programs", "see 31% higher turnover — at an average replacement cost of 33% of annual salary per employee.", "Bersin by Deloitte"),
      ],
      IA: [
        s("Post-acquisition employee turnover", "averages 47% in Year 1 without structured recognition — that's institutional knowledge walking out the door.", "Deloitte M&A"),
        s("59% of employees", "would work harder if appreciated — the portfolio company is running at 59% of potential human output.", "Vantage Circle"),
      ],
      AC: [
        s("59% of employees", "would work harder if appreciated — your team is underperforming because you're underrecognizing.", "Vantage Circle"),
        s("Agencies without referral programs", "spend 5× more on new business development than those with active advocacy.", "HubSpot"),
      ],
    },
    blindspot: defaultBlindspot("CULTURE", 1),
  },
  {
    id: "fw-18",
    pillar: "CULTURE",
    text: {
      BB: "Do you have a documented process for bringing new clients, partners, or contractors into your brand ecosystem?",
      BO: "Does your onboarding process include brand training?",
      IA: "Does the portfolio company have a structured onboarding program that includes brand and culture training?",
      AC: "Does your onboarding process include brand immersion for new team members AND new clients?",
    },
    yesStats: {
      BB: [
        s("86% of customers", "are willing to pay more for a better experience — your onboarding is pricing power.", "PwC"),
        s("Businesses with documented client onboarding", "retain 16% more clients in Year 1.", "Wyzowl"),
      ],
      BO: [
        s("New employee retention", "increases 82% with well-performed onboarding — your investment compounds over their entire tenure.", "Brandon Hall Group"),
        s("69% of workers", "are more likely to stay 3+ years with strong onboarding — that's 3 years of productivity vs. replacement cost.", "Brandon Hall Group"),
      ],
      IA: [
        s("New employee retention", "increases 82% with proper onboarding — this directly protects post-acquisition value.", "Brandon Hall Group"),
        s("Structured onboarding", "reduces time-to-productivity by 50%, accelerating ROI on the acquisition.", "Aberdeen Group"),
      ],
      AC: [
        s("69% of employees", "stay 3+ years with strong onboarding — you're building institutional memory.", "Brandon Hall Group"),
        s("Agencies that onboard clients into brand strategy", "retain those clients 2.3× longer.", "HubSpot Agency Report"),
      ],
    },
    noStats: {
      BB: [
        s("68% of customers", "leave because they feel a brand is indifferent to them — no onboarding process signals indifference.", "Rockefeller Corporation"),
        s("Poor customer onboarding", "leads to 23% higher annual churn — each lost client costs 5-25× the original acquisition cost.", "Harvard Business Review"),
      ],
      BO: [
        s("20% of employee turnover", "happens within the first 45 days — bad onboarding is an expensive revolving door.", "SHRM"),
        s("Companies with poor onboarding", "are 2× more likely to see new hires leave within 12 months, costing 33% of annual salary per departure.", "Brandon Hall Group"),
      ],
      IA: [
        s("Post-acquisition employee turnover", "averages 47% in Year 1 without structured onboarding — that's the #1 value destroyer in M&A.", "Deloitte M&A"),
        s("Each departing employee", "costs 33% of their annual salary to replace — for a 100-person company, 47% turnover could cost $2-4M.", "SHRM"),
      ],
      AC: [
        s("20% of new hires", "leave within 45 days of poor onboarding — your talent pipeline has a hole in it.", "SHRM"),
        s("Agencies without client onboarding", "see 40% higher annual churn — each lost client costs 5-7× the cost to retain them.", "HubSpot"),
      ],
    },
    blindspot: defaultBlindspot("CULTURE", 2),
  },
  {
    id: "fw-19",
    pillar: "CULTURE",
    text: { BO: "Is your brand strong enough to operate without you for 6 months?" },
    yesStats: {
      BO: [
        s("Businesses that can operate independently of their founder", "command 2-3× higher exit multiples.", "Exit Planning Institute"),
        s("Only 30% of small businesses", "successfully transition to a buyer — you're positioned to be in that 30%.", "Teamshares"),
      ],
    },
    noStats: {
      BO: [
        s("70% of small businesses", "never find a buyer or successor — founder dependency is the #1 deal killer.", "Teamshares"),
        s("Nearly 2/3 of family businesses", "have no documented succession plan — and buyers discount founder-dependent businesses by 40-60%.", "BBH"),
        s("97% of executives", "believe resilience is important, but only 47% believe their organization is resilient.", "Forbes"),
      ],
    },
    blindspot: { ...defaultBlindspot("CULTURE", 3), priority: "HIGH", impact: "HIGH" },
  },
  {
    id: "fw-20",
    pillar: "CULTURE",
    text: {
      BB: "Have you documented your core values and operating principles in a way that guides every business decision?",
      BO: "Do you have a culture guide or internal manifesto that aligns with your external message?",
      IA: "Does the portfolio company have a documented culture that's actively aligned with its market-facing brand?",
      AC: "Does your agency have a culture guide that aligns your internal operations with your external positioning?",
    },
    yesStats: {
      BB: [
        s("Entrepreneurs who document core values early", "are 3× more likely to scale past $1M in revenue.", "EOS Worldwide"),
        s("Companies with documented values", "grow 4× faster than those without.", "Deloitte"),
      ],
      BO: [
        s("Companies with aligned cultures", "grow 4× faster than those without — your internal-external alignment is compounding.", "Deloitte"),
        s("72% of companies", "include values statements in culture descriptions — but only the ones that enforce them see the 4× growth.", "MIT Sloan Management"),
      ],
      IA: [
        s("Companies with aligned cultures", "grow 4× faster — this is a direct indicator of post-acquisition growth potential.", "Deloitte"),
        s("71% of CEOs", "cite culture as a top financial driver — documented culture is a bankable asset.", "Forbes"),
      ],
      AC: [
        s("Companies with aligned cultures", "grow 4× faster — your agency practices what it preaches.", "Deloitte"),
        s("Agencies with documented culture", "retain 45% more senior talent over 3 years.", "Hinge Research Institute"),
      ],
    },
    noStats: {
      BB: [
        s("Companies without documented values", "grow 4× slower — every decision without a values framework is a coin flip.", "Deloitte"),
        s("71% of CEOs", "say culture drives financial performance — and culture starts with writing it down.", "Forbes"),
      ],
      BO: [
        s("71% of CEOs", "say culture is a top driver of financial performance — yet you don't have it documented. That's a bet against your own thesis.", "Forbes"),
        s("Culture misalignment between internal operations and external brand", "costs mid-market companies an average of $1.2M/year in lost productivity and turnover.", "Deloitte"),
      ],
      IA: [
        s("Culture clash", "is the #1 reason 70% of M&A deals fail to deliver expected value.", "McKinsey"),
        s("Companies without documented culture", "lose 4× the growth rate — and post-acquisition, this gap widens to 6×.", "Deloitte/McKinsey"),
      ],
      AC: [
        s("71% of CEOs", "say culture is the top financial driver — if you're advising clients on brand culture without your own documented, that's a credibility gap.", "Forbes"),
        s("Professional services firms without documented culture", "see 33% higher partner turnover.", "Hinge Research Institute"),
      ],
    },
    blindspot: defaultBlindspot("CULTURE", 4),
  },
  {
    id: "fw-21",
    pillar: "CULTURE",
    text: {
      BB: "Is every channel where your brand appears — website, social, email, proposals — delivering the same core message?",
      BO: "Are your marketing, sales, product and executive teams aligned on the brand's messaging and priorities?",
      IA: "Are the portfolio company's departments aligned on brand messaging, or are there internal contradictions?",
      AC: "Are your business development, creative, and account teams aligned on your agency's positioning and messaging?",
    },
    yesStats: {
      BB: [
        s("Consistent brand messaging across channels", "drives 33% higher revenue — every touchpoint is reinforcing the sale.", "Lucidpress"),
        s("60% of consumers", "expect a consistent experience across all channels — you're delivering what most businesses can't.", "Salesforce"),
      ],
      BO: [
        s("Highly aligned organizations", "increase revenue 58% faster and are 72% more profitable.", "Forbes"),
        s("Aligned sales and marketing teams", "see 67% higher deal close rates — your machine is firing together.", "Salesgenie"),
      ],
      IA: [
        s("Aligned organizations", "increase revenue 58% faster — this is a direct value accelerator for the portfolio.", "Forbes"),
        s("Department alignment", "reduces customer churn by 36%, protecting recurring revenue.", "SuperOffice"),
      ],
      AC: [
        s("Aligned agencies", "win 38% more competitive pitches — your teams are selling the same story.", "Hinge Research Institute"),
        s("Highly aligned organizations", "are 72% more profitable than misaligned ones.", "Forbes"),
      ],
    },
    noStats: {
      BB: [
        s("73% of consumers", "use multiple channels during their purchase journey — inconsistent messaging loses them at every transition.", "Harvard Business Review"),
        s("Businesses with inconsistent cross-channel messaging", "see 30% lower conversion rates.", "Aberdeen Group"),
      ],
      BO: [
        s("Only 11% of companies", "have both aligned marketing & sales audiences and effective hand-offs — you're in the 89% that doesn't.", "Influ2"),
        s("36% lower customer retention", "when Executive-Sales-Marketing isn't aligned — that's recurring revenue walking out the door.", "SuperOffice"),
      ],
      IA: [
        s("Only 11% of companies", "achieve true cross-department alignment — the portfolio company is fighting itself.", "Influ2"),
        s("Post-acquisition alignment failures", "cost an average of 10-15% of deal value — on a $50M acquisition, that's $5-7.5M destroyed.", "McKinsey"),
      ],
      AC: [
        s("Only 11% of companies", "achieve true cross-functional alignment — your teams are likely pitching different versions of your agency.", "Influ2"),
        s("Agencies with internal misalignment", "see 22% lower win rates and 40% higher account churn.", "Hinge Research Institute"),
      ],
    },
    blindspot: defaultBlindspot("CULTURE", 5),
  },
];

// ════════════════════════════════════════════════════════════════════════
// FOCUS — 100 questions (5 pillars × 20). Question text per client doc.
// STUB-CONTENT: Stats are placeholders — client doc only specifies text.
// Replace yesStats/noStats once final stat list arrives.
// ════════════════════════════════════════════════════════════════════════

// IA reframe rule (per client doc PART 2): For questions where IA is not an
// explicit swap, IA receives a global find-replace transformation of the BO
// text. We pre-compute that transformation here so the question table only
// stores BO + named swaps where they differ structurally.
function iaReframe(text: string): string {
  return text
    .replace(/\byour company\b/gi, "the portfolio company")
    .replace(/\byour team\b/gi, "the portfolio company's team")
    .replace(/\byour employees\b/gi, "the portfolio company's employees")
    .replace(/\byour business\b/gi, "the portfolio company")
    .replace(/\byour /g, "the portfolio company's ")
    .replace(/\bYour /g, "The portfolio company's ")
    .replace(/\byou \b/gi, "they ");
}

type FocusQDef = {
  pillar: FocusPillar;
  // BO is the baseline. Other demographics override when the doc specifies a swap.
  text: { BO: string; BB?: string; IA?: string; AC?: string };
};

// STUB-CONTENT — generic placeholder stats used across all FOCUS questions.
const FOCUS_STUB_YES = (pillar: FocusPillar): Stat[] => [
  s("Companies scoring high here", `achieve 1.5-2× higher exit multiples on ${pillar.toLowerCase()}.`, "Placeholder, replace"),
  s("Top-quartile operators", "use this signal to track readiness for PE acquisition.", "Placeholder, replace"),
];
const FOCUS_STUB_NO = (pillar: FocusPillar): Stat[] => [
  s("Weakness in this area", `compounds — buyers price ${pillar.toLowerCase()} gaps into lower offer multiples or earn-out structures.`, "Placeholder, replace"),
  s("Industry benchmarks", "show this signal correlates with valuation drag at exit.", "Placeholder, replace"),
];

const FOCUS_DEFS: FocusQDef[] = [
  // ── PERCEPTION (Q01–Q20) ───────────────────────────────────────────
  { pillar: "PERCEPTION", text: { BO: "Do customers associate your brand with quality?" } },
  { pillar: "PERCEPTION", text: { BO: "Can a stranger identify your industry from your homepage in under 5 seconds?" } },
  { pillar: "PERCEPTION", text: { BO: "Do you have written documentation of how customers describe your brand?" } },
  { pillar: "PERCEPTION", text: { BO: "Have you surveyed customers about brand perception in the past 12 months?" } },
  { pillar: "PERCEPTION", text: { BO: "Do your online reviews average 4.5 stars or above?" } },
  { pillar: "PERCEPTION", text: { BO: "Can you name your top 3 competitors' positioning statements?" } },
  { pillar: "PERCEPTION", text: { BO: "Do customers refer others to you without being asked?" } },
  { pillar: "PERCEPTION", text: { BO: "Is your brand mentioned in industry media or publications?" } },
  { pillar: "PERCEPTION", text: { BO: "Do prospects understand your pricing before the first sales call?" } },
  { pillar: "PERCEPTION", text: { BO: "Can you articulate your brand's single biggest differentiator in one sentence?" } },
  {
    pillar: "PERCEPTION",
    text: {
      BB: "Do your clients, contractors, or collaborators describe your brand the same way you do?",
      BO: "Do employees describe the brand the same way customers do?",
      IA: "Do the portfolio company's employees describe the brand the same way customers do?",
      AC: "Do your team members describe your agency's brand the same way clients do?",
    },
  },
  {
    pillar: "PERCEPTION",
    text: {
      BB: "Has your client base or revenue grown in the past 12 months?",
      BO: "Has your market share grown in the past 24 months?",
      IA: "Has the portfolio company's market share grown in the past 24 months?",
      AC: "Has your agency's client count or revenue grown in the past 24 months?",
    },
  },
  { pillar: "PERCEPTION", text: { BO: "Do you monitor competitor brand activity monthly?" } },
  {
    pillar: "PERCEPTION",
    text: {
      BB: "Do you know how much it costs you (in time and money) to acquire a new client?",
      BO: "Is your customer acquisition cost lower than your industry average?",
      IA: "Is the portfolio company's customer acquisition cost lower than the industry average?",
      AC: "Do you know your agency's cost to acquire a new client and is it benchmarked against industry?",
    },
  },
  { pillar: "PERCEPTION", text: { BO: "Do you have a documented customer journey map?" } },
  { pillar: "PERCEPTION", text: { BO: "Can new customers find you through organic search for your primary service?" } },
  { pillar: "PERCEPTION", text: { BO: "Do you have a system for measuring brand sentiment beyond reviews?" } },
  {
    pillar: "PERCEPTION",
    text: {
      BB: "Have you directly asked your clients whether they would recommend you to others in the past 6 months?",
      BO: "Has your Net Promoter Score been measured in the past 6 months?",
      IA: "Has the portfolio company measured its Net Promoter Score in the past 6 months?",
      AC: "Have you measured client satisfaction or NPS formally in the past 6 months?",
    },
  },
  { pillar: "PERCEPTION", text: { BO: "Do your customers know what makes you different from your top competitor?" } },
  { pillar: "PERCEPTION", text: { BO: "Would a PE buyer see your brand perception as a defensible asset?" } },

  // ── CLARITY (Q21–Q40) ──────────────────────────────────────────────
  {
    pillar: "CLARITY",
    text: {
      BB: "Can you articulate your own business mission in one sentence without pausing?",
      BO: "Can every employee articulate the company mission in one sentence?",
      IA: "Can the portfolio company's employees articulate the mission in one sentence?",
      AC: "Can every person in your agency articulate your mission in one sentence?",
    },
  },
  {
    pillar: "CLARITY",
    text: {
      BB: "Is your value proposition documented and accessible to every contractor, partner, or collaborator you work with?",
      BO: "Is your value proposition documented and distributed company-wide?",
      IA: "Is the portfolio company's value proposition documented and distributed company-wide?",
      AC: "Is your agency's value proposition documented and distributed to every team member and client-facing person?",
    },
  },
  {
    pillar: "CLARITY",
    text: {
      BB: "Do your website, social profiles, proposals, and verbal pitch all use the same language to describe what you do?",
      BO: "Do sales and marketing use the same language to describe your offering?",
      IA: "Do the portfolio company's sales and marketing teams use the same language to describe their offering?",
      AC: "Do your business development, creative, and account teams use the same language to describe your services?",
    },
  },
  {
    pillar: "CLARITY",
    text: {
      BB: "Can a new client understand exactly what you do and why after their first interaction with you?",
      BO: "Can a new hire explain what you do after their first week?",
      IA: "Can a new hire at the portfolio company explain what they do after their first week?",
      AC: "Can a new client explain your agency's services and differentiator after your first meeting?",
    },
  },
  { pillar: "CLARITY", text: { BO: "Is your pricing model simple enough to explain in 30 seconds?" } },
  { pillar: "CLARITY", text: { BO: "Do you have a single, documented brand voice guide?" } },
  { pillar: "CLARITY", text: { BO: "Are your top 3 customer objections documented with approved responses?" } },
  {
    pillar: "CLARITY",
    text: {
      BB: "Does your website messaging match exactly what you say when describing your work on a call or in person?",
      BO: "Does your website messaging match what sales says on calls?",
      IA: "Does the portfolio company's website messaging match what their sales team says on calls?",
      AC: "Does your agency's website messaging match what your account leads say in new business pitches?",
    },
  },
  {
    pillar: "CLARITY",
    text: {
      BB: "Have you documented your top 3 business priorities for this year and are you actively working on all three?",
      BO: "Can leadership agree on the company's top 3 priorities for this year?",
      IA: "Can the portfolio company's leadership team agree on the company's top 3 priorities for this year?",
      AC: "Can you and your partners agree on your agency's top 3 priorities for this year?",
    },
  },
  { pillar: "CLARITY", text: { BO: "Do customers understand the full scope of your services without asking?" } },
  { pillar: "CLARITY", text: { BO: "Is there a single source of truth for product/service descriptions?" } },
  { pillar: "CLARITY", text: { BO: "Do all customer-facing materials use consistent terminology?" } },
  {
    pillar: "CLARITY",
    text: {
      BB: "Can you explain clearly and confidently why you're priced the way you are relative to competitors?",
      BO: "Can your team explain why you're more expensive (or cheaper) than competitors?",
      IA: "Can the portfolio company's team explain their pricing position relative to competitors?",
      AC: "Can every person on your team explain your agency's pricing rationale relative to competitors?",
    },
  },
  {
    pillar: "CLARITY",
    text: {
      BB: "Is your ideal client profile documented, and does it guide which opportunities you pursue and which you decline?",
      BO: "Is your ideal customer profile documented and agreed upon by sales and leadership?",
      IA: "Is the portfolio company's ideal customer profile documented and agreed upon by sales and leadership?",
      AC: "Is your agency's ideal client profile documented and does it drive your business development decisions?",
    },
  },
  {
    pillar: "CLARITY",
    text: {
      BB: "Do you have documented KPIs you review at least monthly to measure your business performance?",
      BO: "Do internal teams use the same KPIs to measure success?",
      IA: "Do the portfolio company's internal teams use the same KPIs to measure success?",
      AC: "Do all teams in your agency use shared KPIs to measure client and business success?",
    },
  },
  { pillar: "CLARITY", text: { BO: "Has your messaging been tested with actual prospects in the past 12 months?" } },
  { pillar: "CLARITY", text: { BO: "Can you describe your 3-year strategic direction in under 60 seconds?" } },
  { pillar: "CLARITY", text: { BO: "Do partners and vendors accurately represent your brand?" } },
  {
    pillar: "CLARITY",
    text: {
      BB: "Do you have a documented client onboarding process that communicates your brand, values, and working approach from day one?",
      BO: "Is there a documented onboarding flow that communicates brand clarity to every new hire?",
      IA: "Does the portfolio company have a documented onboarding process that communicates brand clarity to every new hire?",
      AC: "Do you have a documented onboarding process for both new team members AND new clients that communicates your agency's brand and working approach?",
    },
  },
  { pillar: "CLARITY", text: { BO: "Would an acquirer see your strategic clarity as an asset that survives the founder leaving?" } },

  // ── IDENTITY (Q41–Q60) ─────────────────────────────────────────────
  { pillar: "IDENTITY", text: { BO: "Do you have a documented brand style guide with logo usage rules?" } },
  { pillar: "IDENTITY", text: { BO: "Is your logo used consistently across every customer touchpoint?" } },
  { pillar: "IDENTITY", text: { BO: "Do you have a centralized, accessible digital asset library?" } },
  { pillar: "IDENTITY", text: { BO: "Has your brand identity been professionally updated in the past 5 years?" } },
  { pillar: "IDENTITY", text: { BO: "Are your brand colors defined with exact hex/RGB values and enforced?" } },
  {
    pillar: "IDENTITY",
    text: {
      BB: "Do all external communications you send — emails, proposals, invoices, social posts — use a consistent branded format?",
      BO: "Do all departments use approved templates for external communications?",
      IA: "Do all departments at the portfolio company use approved templates for external communications?",
      AC: "Do all departments in your agency use approved templates for every client-facing communication?",
    },
  },
  { pillar: "IDENTITY", text: { BO: "Is your brand trademarked and legally protected?" } },
  { pillar: "IDENTITY", text: { BO: "Can you produce a brand asset (logo, template, photo) within 5 minutes of request?" } },
  {
    pillar: "IDENTITY",
    text: {
      BB: "Does every digital environment where you work or meet clients — your video background, email signature, profile photos — reflect your brand identity?",
      BO: "Does your physical space (office, store, vehicles) reflect your brand identity?",
      IA: "Does the portfolio company's physical space (office, store, vehicles) reflect their brand identity?",
      AC: "Does your agency's physical and digital workspace reflect your brand identity consistently?",
    },
  },
  {
    pillar: "IDENTITY",
    text: {
      BB: "Are all materials you send to clients — emails, proposals, decks, contracts — visually and tonally brand-consistent?",
      BO: "Are employee-generated materials (emails, decks, proposals) brand-consistent?",
      IA: "Are employee-generated materials at the portfolio company (emails, decks, proposals) brand-consistent?",
      AC: "Are all materials generated by your team — emails, decks, proposals, reports — brand-consistent?",
    },
  },
  { pillar: "IDENTITY", text: { BO: "Do you have professional photography that represents your current brand?" } },
  { pillar: "IDENTITY", text: { BO: "Is your website design less than 3 years old?" } },
  { pillar: "IDENTITY", text: { BO: "Do you have documented typography standards that are followed?" } },
  { pillar: "IDENTITY", text: { BO: "Are your social media profiles visually consistent with your primary brand?" } },
  { pillar: "IDENTITY", text: { BO: "Do you audit brand consistency across touchpoints at least annually?" } },
  {
    pillar: "IDENTITY",
    text: {
      BB: "Are you actively and consistently enforcing your own brand standards across every touchpoint?",
      BO: "Is there a designated person or team responsible for brand governance?",
      IA: "Is there a designated person or team at the portfolio company responsible for brand governance?",
      AC: "Is there a designated person or role in your agency responsible for maintaining brand standards across all client work and internal output?",
    },
  },
  {
    pillar: "IDENTITY",
    text: {
      BB: "Can you document the intentional evolution of your brand since you launched — showing deliberate decisions, not accidental drift?",
      BO: "Can you show a visual evolution of your brand over the past decade?",
      IA: "Can the portfolio company show a documented visual and strategic brand evolution over its history?",
      AC: "Can you show a documented evolution of your agency's brand that reflects strategic growth, not accidental drift?",
    },
  },
  {
    pillar: "IDENTITY",
    text: {
      BB: "Does every channel where your brand appears — digital, print, or in-person — deliver a visually and tonally consistent experience?",
      BO: "Do your packaging, signage, and printed materials match your digital presence?",
      IA: "Do the portfolio company's packaging, signage, and printed materials match their digital presence?",
      AC: "Do all physical and digital brand expressions from your agency maintain visual and tonal consistency?",
    },
  },
  { pillar: "IDENTITY", text: { BO: "Has a brand inconsistency been flagged and corrected in the past 90 days?" } },
  { pillar: "IDENTITY", text: { BO: "Would a PE buyer see your brand identity as turnkey — requiring zero investment post-acquisition?" } },

  // ── CULTURE (Q61–Q80) ──────────────────────────────────────────────
  {
    pillar: "CULTURE",
    text: {
      BB: "Do your clients or collaborators actively recommend working with you without being asked?",
      BO: "Do employees voluntarily recommend the company as a place to work?",
      IA: "Do the portfolio company's employees voluntarily recommend it as a place to work?",
      AC: "Do your team members recommend your agency as a place to work without being prompted?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Have you documented your top 3 core business values and do they actively guide every major decision you make?",
      BO: "Can every employee name the company's top 3 values without looking them up?",
      IA: "Can the portfolio company's employees name the company's top 3 values without looking them up?",
      AC: "Can every person in your agency name your top 3 values without looking them up?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Have you retained more than 80% of your active clients over the past 12 months?",
      BO: "Has voluntary turnover been below your industry average for the past 12 months?",
      IA: "Has the portfolio company's voluntary turnover been below the industry average for the past 12 months?",
      AC: "Has your agency's voluntary turnover been below the industry average for the past 12 months?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Have you documented guidelines that allow contractors or collaborators to act on your behalf without checking with you first?",
      BO: "Do employees have authority to make customer-facing decisions without manager approval?",
      IA: "Do the portfolio company's employees have authority to make customer-facing decisions without manager approval?",
      AC: "Do your account leads have authority to make client-facing decisions without partner approval?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Do you have a deliberate practice of acknowledging and rewarding clients or collaborators who embody your brand values?",
      BO: "Is there a system for recognizing and rewarding employees who live the brand values?",
      IA: "Is there a system at the portfolio company for recognizing employees who live the brand values?",
      AC: "Is there a formal system for recognizing team members who exemplify your agency's values?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Have you formally collected feedback from your clients about their experience working with you in the past 6 months?",
      BO: "Have you conducted an employee engagement survey in the past 6 months?",
      IA: "Has the portfolio company conducted an employee engagement survey in the past 6 months?",
      AC: "Have you conducted an employee engagement survey in your agency in the past 6 months?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Do you have a regular self-review cadence — at least quarterly — where you assess your own performance against documented goals?",
      BO: "Do employees receive regular feedback beyond annual reviews?",
      IA: "Do the portfolio company's employees receive regular feedback beyond annual reviews?",
      AC: "Do all team members in your agency receive regular performance feedback on a cadence beyond annual reviews?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Do your clients have a clear, documented way to raise concerns or problems with you directly — and do they feel safe using it?",
      BO: "Is there a documented process for employees to flag problems without fear of retaliation?",
      IA: "Is there a documented process at the portfolio company for employees to flag problems without fear of retaliation?",
      AC: "Is there a documented and psychologically safe process for team members to raise problems with leadership?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Do your contractors or collaborators work together effectively on shared work without you having to coordinate every interaction?",
      BO: "Do cross-functional teams collaborate without executive intervention?",
      IA: "Do the portfolio company's cross-functional teams collaborate without executive intervention?",
      AC: "Do your creative, strategy, and account teams collaborate on client work without partner intervention?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Can you clearly articulate how every service or product you offer connects directly to your core mission?",
      BO: "Can employees describe how their daily work connects to the company mission?",
      IA: "Can the portfolio company's employees describe how their daily work connects to the company mission?",
      AC: "Can every person in your agency describe how their specific role contributes to the agency's mission?",
    },
  },
  { pillar: "CULTURE", text: { BO: "Is innovation encouraged and resourced — not just talked about?" } },
  {
    pillar: "CULTURE",
    text: {
      BB: "Do you document and share lessons from your own failures and setbacks with your clients or professional network?",
      BO: "Do employees feel comfortable failing publicly and sharing what they learned?",
      IA: "Does the portfolio company have a culture where employees feel comfortable acknowledging and sharing lessons from failures?",
      AC: "Does your agency have a documented practice of reviewing failed pitches or projects and sharing learnings across the team?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Have you implemented a recommendation from a client, contractor, peer, or mentor in the past 6 months?",
      BO: "Has a new idea from a non-executive been implemented in the past 6 months?",
      IA: "Has a new idea from a non-executive employee at the portfolio company been implemented in the past 6 months?",
      AC: "Has a recommendation from a non-partner team member been implemented in the past 6 months?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Have you ended or restructured a client or contractor relationship within 30 days of identifying it as misaligned with your values or standards?",
      BO: "Are toxic or underperforming employees addressed within 30 days of identification?",
      IA: "Does the portfolio company address toxic or underperforming employees within 30 days of identification?",
      AC: "Does your agency address underperforming or culturally misaligned team members within 30 days of identification?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Do you have a documented personal and professional growth plan for yourself that you review and update at least quarterly?",
      BO: "Do employees have clear growth paths documented and reviewed quarterly?",
      IA: "Do the portfolio company's employees have documented growth paths reviewed quarterly?",
      AC: "Do all team members in your agency have documented growth paths reviewed at least quarterly?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Are you actively participating in a mentorship relationship, mastermind group, or structured peer development program?",
      BO: "Is there a mentorship or peer development program active in the organization?",
      IA: "Is there an active mentorship or peer development program at the portfolio company?",
      AC: "Is there an active mentorship or professional development program within your agency?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Have you invested in formal leadership, business, or professional development training in the past 12 months?",
      BO: "Do all managers receive leadership training at least annually?",
      IA: "Do all managers at the portfolio company receive leadership training at least annually?",
      AC: "Do all agency managers and team leads receive leadership development training at least annually?",
    },
  },
  {
    pillar: "CULTURE",
    text: {
      BB: "Can you identify your top 3 clients by revenue, relationship strength, and renewal risk — and do you have a retention plan for each?",
      BO: "Can you name your top 5 highest-performing employees and their flight risk level?",
      IA: "Can leadership identify the portfolio company's top performers and their flight risk level?",
      AC: "Can you name your top 5 highest-performing team members and their flight risk level?",
    },
  },
  { pillar: "CULTURE", text: { BO: "Has your company culture been independently assessed or benchmarked?" } },
  {
    pillar: "CULTURE",
    text: {
      BB: "Could a buyer operate your business within 90 days of acquisition without you, using the people and systems you've built?",
      BO: "Would a PE buyer retain your team post-acquisition without adding management layers?",
      IA: "Would a PE buyer retain the portfolio company's team post-acquisition without adding management layers?",
      AC: "Would a buyer retain your agency's team post-acquisition without restructuring management?",
    },
  },

  // ── EXECUTION (Q81–Q100) ───────────────────────────────────────────
  { pillar: "EXECUTION", text: { BO: "Do you have documented SOPs for your top 10 revenue-generating processes?" } },
  { pillar: "EXECUTION", text: { BO: "Can you measure the time from lead to close and is it benchmarked against industry?" } },
  {
    pillar: "EXECUTION",
    text: {
      BB: "Is your tech stack integrated — or are you manually transferring data between systems yourself?",
      BO: "Is your tech stack integrated — or do teams manually transfer data between systems?",
      IA: "Is the portfolio company's tech stack integrated, or are teams manually transferring data between systems?",
      AC: "Is your agency's tech stack integrated across client management, project management, and billing — or are teams manually bridging data?",
    },
  },
  { pillar: "EXECUTION", text: { BO: "Have you eliminated a bottleneck process in the past 90 days?" } },
  { pillar: "EXECUTION", text: { BO: "Do you have real-time visibility into your sales pipeline?" } },
  { pillar: "EXECUTION", text: { BO: "Are customer complaints resolved within a documented SLA?" } },
  {
    pillar: "EXECUTION",
    text: {
      BB: "Do you have a documented weekly review of your own performance metrics — revenue, pipeline, client health, and project status?",
      BO: "Is there a weekly cadence for reviewing performance metrics at the leadership level?",
      IA: "Is there a weekly cadence for reviewing performance metrics at the portfolio company's leadership level?",
      AC: "Is there a weekly cadence for reviewing agency performance metrics with all senior leads?",
    },
  },
  { pillar: "EXECUTION", text: { BO: "Can you produce a P&L statement within 24 hours of request?" } },
  { pillar: "EXECUTION", text: { BO: "Do you have a documented decision-making framework for resource allocation?" } },
  { pillar: "EXECUTION", text: { BO: "Are projects delivered on time and within budget more than 80% of the time?" } },
  { pillar: "EXECUTION", text: { BO: "Is your customer onboarding process documented, measured, and optimized?" } },
  { pillar: "EXECUTION", text: { BO: "Do you conduct post-mortems on failed initiatives and document learnings?" } },
  { pillar: "EXECUTION", text: { BO: "Can you identify your top 3 operational bottlenecks right now?" } },
  { pillar: "EXECUTION", text: { BO: "Is your supply chain or service delivery model resilient to single-point failures?" } },
  { pillar: "EXECUTION", text: { BO: "Do you have a disaster recovery or business continuity plan that has been tested?" } },
  { pillar: "EXECUTION", text: { BO: "Are your financial controls and compliance documentation current?" } },
  { pillar: "EXECUTION", text: { BO: "Has a process improvement generated measurable ROI in the past 6 months?" } },
  { pillar: "EXECUTION", text: { BO: "Do you track and report on customer lifetime value?" } },
  {
    pillar: "EXECUTION",
    text: {
      BB: "Do you have a documented map of every role, contractor, or function your business depends on — with clear responsibilities and no gaps?",
      BO: "Is your organizational chart documented with clear reporting lines and no gaps?",
      IA: "Does the portfolio company have a documented organizational chart with clear reporting lines and no gaps?",
      AC: "Is your agency's org chart documented with clear reporting lines, including freelancers and contractors?",
    },
  },
  { pillar: "EXECUTION", text: { BO: "Would a PE buyer see your operations as scalable without founder dependence?" } },
];

// Materialize the FOCUS list. For each definition we expand text into per-demo
// variants (with IA falling back to global reframe) and attach STUB stats.
export const FOCUS_QUESTIONS: OnboardingQuestion[] = FOCUS_DEFS.map((def, i) => {
  const idxInPillar = i % 20;
  const text: OnboardingQuestion["text"] = {
    BO: def.text.BO,
    BB: def.text.BB ?? def.text.BO,
    IA: def.text.IA ?? iaReframe(def.text.BO),
    AC: def.text.AC ?? def.text.BO,
  };
  const yesStats = FOCUS_STUB_YES(def.pillar);
  const noStats = FOCUS_STUB_NO(def.pillar);
  return {
    id: `fo-${i + 1}`,
    pillar: def.pillar,
    text,
    yesStats: { BB: yesStats, BO: yesStats, IA: yesStats, AC: yesStats },
    noStats: { BB: noStats, BO: noStats, IA: noStats, AC: noStats },
    blindspot: defaultBlindspot(def.pillar, idxInPillar),
    stub: true, // stats are placeholders; text is final from client doc
  };
});

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
