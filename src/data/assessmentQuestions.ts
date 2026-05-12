export interface AssessmentQuestion {
  id: number;
  category: "PERCEPTION" | "CLARITY" | "IDENTITY" | "CULTURE";
  text: string;
  impactMessage: string;
  citations: {
    text: string;
    highlight: string;
    source: string;
  }[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // PERCEPTION (Questions 1-5)
  {
    id: 1,
    category: "PERCEPTION",
    text: "Do your customers clearly understand what makes your company different from competitors?",
    impactMessage: "Without clear differentiation, you're competing on price alone—eroding margins, weakening culture, and reducing your exit multiple by up to 2x.",
    citations: [
      {
        highlight: "64% of consumers",
        text: "cite shared values as the primary reason for a brand relationship.",
        source: "Harvard Business Review",
      },
      {
        highlight: "Brands with clear differentiation",
        text: "command 13% higher prices than undifferentiated competitors.",
        source: "McKinsey",
      },
    ],
  },
  {
    id: 2,
    category: "PERCEPTION",
    text: "Can you articulate your brand promise in one clear, memorable sentence?",
    impactMessage: "A vague promise confuses customers and employees alike, leading to inconsistent delivery, lower conversions, and diminished acquirer confidence.",
    citations: [
      {
        highlight: "Brands with clear promises",
        text: "achieve 3x higher customer recall and recognition.",
        source: "Harvard Business Review",
      },
      {
        highlight: "Vague brand promises",
        text: "correlate with 40% lower conversion rates.",
        source: "McKinsey",
      },
    ],
  },
  {
    id: 3,
    category: "PERCEPTION",
    text: "Do your customers perceive your brand as a leader in your category?",
    impactMessage: "Followers capture scraps; leaders capture market share. Perception as a leader directly impacts pricing power and strategic acquisition interest.",
    citations: [
      {
        highlight: "Category leaders",
        text: "capture 70% of the economic profit in their markets.",
        source: "McKinsey",
      },
      {
        highlight: "Perceived market leaders",
        text: "enjoy 2x higher customer loyalty than followers.",
        source: "Bain & Company",
      },
    ],
  },
  {
    id: 4,
    category: "PERCEPTION",
    text: "Is your brand associated with a specific emotion or feeling in customers' minds?",
    impactMessage: "Emotional disconnection means transactional relationships—high churn, low referrals, and a brand that's easily replaced at exit due diligence.",
    citations: [
      {
        highlight: "Emotionally connected customers",
        text: "have 306% higher lifetime value.",
        source: "Motista",
      },
      {
        highlight: "Brands with strong emotional associations",
        text: "see 23% higher revenue growth.",
        source: "Gallup",
      },
    ],
  },
  {
    id: 5,
    category: "PERCEPTION",
    text: "Do customers recommend your brand to others without being asked?",
    impactMessage: "No organic advocacy means higher CAC, weaker culture proof, and a business that struggles to demonstrate sustainable growth to buyers.",
    citations: [
      {
        highlight: "Word-of-mouth marketing",
        text: "drives $6 trillion in annual consumer spending.",
        source: "WOMMA",
      },
      {
        highlight: "Referred customers",
        text: "have 37% higher retention rates.",
        source: "Wharton School",
      },
    ],
  },

  // CLARITY (Questions 6-10)
  {
    id: 6,
    category: "CLARITY",
    text: "Is your executive team fully aligned on brand messaging and priorities?",
    impactMessage: "Leadership misalignment creates strategic chaos, slows execution, erodes employee trust, and signals dysfunction to potential acquirers.",
    citations: [
      {
        highlight: "Aligned leadership teams",
        text: "execute 67% faster on strategic initiatives.",
        source: "Deloitte",
      },
      {
        highlight: "Misaligned leadership",
        text: "causes 52% of failed market initiatives.",
        source: "BCG",
      },
    ],
  },
  {
    id: 7,
    category: "CLARITY",
    text: "Can every employee explain your company's unique value proposition?",
    impactMessage: "If your team can't articulate value, neither can customers. This gap kills conversions, damages culture, and raises red flags in due diligence.",
    citations: [
      {
        highlight: "Companies with clear internal messaging",
        text: "see 47% higher employee engagement.",
        source: "Gallup",
      },
      {
        highlight: "Employees who understand the value proposition",
        text: "are 4x more likely to be top performers.",
        source: "CEB",
      },
    ],
  },
  {
    id: 8,
    category: "CLARITY",
    text: "Is your brand message consistent across all marketing channels?",
    impactMessage: "Inconsistent messaging fragments your brand, confuses prospects, wastes marketing spend, and suggests operational immaturity to buyers.",
    citations: [
      {
        highlight: "Consistent brand presentation",
        text: "increases revenue by up to 23%.",
        source: "Forbes",
      },
      {
        highlight: "Omnichannel consistency",
        text: "drives 90% higher customer retention.",
        source: "Aberdeen Group",
      },
    ],
  },
  {
    id: 9,
    category: "CLARITY",
    text: "Do you have documented brand guidelines that are actively used?",
    impactMessage: "Without guidelines, every touchpoint is improvised—leading to brand drift, wasted resources, and lower perceived value at acquisition.",
    citations: [
      {
        highlight: "Companies with brand guidelines",
        text: "are 3.5x more likely to have excellent brand visibility.",
        source: "Lucidpress",
      },
      {
        highlight: "Documented guidelines",
        text: "reduce creative production costs by 33%.",
        source: "Bynder",
      },
    ],
  },
  {
    id: 10,
    category: "CLARITY",
    text: "Is your target audience clearly defined with specific personas?",
    impactMessage: "Undefined audiences mean scattered efforts, poor ROI, and an inability to demonstrate focused market fit—critical for exit valuation.",
    citations: [
      {
        highlight: "Companies using buyer personas",
        text: "see 124% higher lead generation.",
        source: "HubSpot",
      },
      {
        highlight: "Clearly defined audiences",
        text: "improve marketing ROI by 171%.",
        source: "Cintell",
      },
    ],
  },

  // IDENTITY (Questions 11-15)
  {
    id: 11,
    category: "IDENTITY",
    text: "Is your visual identity consistent across all customer touchpoints?",
    impactMessage: "Visual inconsistency signals unprofessionalism, erodes trust, weakens recognition, and makes your brand forgettable to customers and acquirers.",
    citations: [
      {
        highlight: "Consistent brand presentation",
        text: "increases recognition by up to 80%.",
        source: "Lucidpress",
      },
      {
        highlight: "Inconsistent branding",
        text: "creates confusion and erodes trust at every touchpoint.",
        source: "Forbes",
      },
    ],
  },
  {
    id: 12,
    category: "IDENTITY",
    text: "Does your brand have a distinctive visual style that's instantly recognizable?",
    impactMessage: "Generic visuals make you invisible in crowded markets, forcing you to outspend competitors and reducing brand equity at exit.",
    citations: [
      {
        highlight: "Distinctive brand assets",
        text: "contribute 52% of brand equity.",
        source: "Kantar",
      },
      {
        highlight: "Recognizable brands",
        text: "are chosen 82% more often than generic alternatives.",
        source: "Nielsen",
      },
    ],
  },
  {
    id: 13,
    category: "IDENTITY",
    text: "Is your brand name easy to remember, spell, and pronounce?",
    impactMessage: "A difficult name creates friction at every stage—harder referrals, lower search discoverability, and reduced memorability that impacts growth.",
    citations: [
      {
        highlight: "Easy-to-process brand names",
        text: "are 35% more likely to be recalled.",
        source: "Journal of Consumer Research",
      },
      {
        highlight: "Memorable brand names",
        text: "reduce customer acquisition costs by 28%.",
        source: "Brand Finance",
      },
    ],
  },
  {
    id: 14,
    category: "IDENTITY",
    text: "Does your brand voice sound consistent whether in ads, social media, or customer service?",
    impactMessage: "An inconsistent voice fractures customer experience, damages trust, confuses your team, and suggests lack of brand discipline.",
    citations: [
      {
        highlight: "Consistent brand voice",
        text: "increases customer trust by 71%.",
        source: "Sprout Social",
      },
      {
        highlight: "Brands with unified voice",
        text: "see 33% higher engagement rates.",
        source: "Content Marketing Institute",
      },
    ],
  },
  {
    id: 15,
    category: "IDENTITY",
    text: "Are your brand colors, fonts, and imagery strategically chosen to evoke specific emotions?",
    impactMessage: "Random visual choices miss emotional connections, reduce memorability, and leave money on the table in perception and positioning.",
    citations: [
      {
        highlight: "Color increases brand recognition",
        text: "by up to 80%.",
        source: "University of Loyola",
      },
      {
        highlight: "Strategic typography",
        text: "improves information retention by 25%.",
        source: "MIT",
      },
    ],
  },

  // CULTURE (Questions 16-21)
  {
    id: 16,
    category: "CULTURE",
    text: "Do your employees believe in and embody the brand values?",
    impactMessage: "Disengaged employees deliver inconsistent experiences, increase turnover costs, and signal cultural weakness that tanks exit multiples.",
    citations: [
      {
        highlight: "Companies with engaged employees",
        text: "outperform competitors by 147%.",
        source: "Gallup",
      },
      {
        highlight: "Value-aligned employees",
        text: "are 5x more likely to stay with the company.",
        source: "LinkedIn",
      },
    ],
  },
  {
    id: 17,
    category: "CULTURE",
    text: "Is your company culture intentionally designed to support brand delivery?",
    impactMessage: "Accidental culture leads to accidental results—inconsistent quality, high attrition, and a business that struggles to scale or exit profitably.",
    citations: [
      {
        highlight: "Culture-driven companies",
        text: "see 4x revenue growth compared to peers.",
        source: "Forbes",
      },
      {
        highlight: "Strong culture alignment",
        text: "reduces turnover by 40%.",
        source: "Columbia University",
      },
    ],
  },
  {
    id: 18,
    category: "CULTURE",
    text: "Can your employees articulate the brand values without prompting?",
    impactMessage: "Values that aren't internalized are just posters on walls—they won't guide decisions, shape behavior, or impress acquirer due diligence.",
    citations: [
      {
        highlight: "Employees who know brand values",
        text: "deliver 20% better customer experiences.",
        source: "Temkin Group",
      },
      {
        highlight: "Value-aware teams",
        text: "make decisions 60% faster.",
        source: "Bain & Company",
      },
    ],
  },
  {
    id: 19,
    category: "CULTURE",
    text: "Does your hiring process screen for cultural and brand fit?",
    impactMessage: "Hiring for skills alone creates culture dilution, higher turnover, slower integration, and a team that can't deliver brand promise.",
    citations: [
      {
        highlight: "Cultural fit hiring",
        text: "improves employee retention by 30%.",
        source: "SHRM",
      },
      {
        highlight: "Value-aligned new hires",
        text: "reach full productivity 50% faster.",
        source: "Glassdoor",
      },
    ],
  },
  {
    id: 20,
    category: "CULTURE",
    text: "Do you regularly train employees on brand standards and customer experience?",
    impactMessage: "Without ongoing training, standards slip, experiences degrade, and your brand promise becomes an empty claim that hurts retention and valuation.",
    citations: [
      {
        highlight: "Companies investing in training",
        text: "see 24% higher profit margins.",
        source: "ATD",
      },
      {
        highlight: "Brand training programs",
        text: "improve customer satisfaction by 12%.",
        source: "Forrester",
      },
    ],
  },
  {
    id: 21,
    category: "CULTURE",
    text: "Are your marketing, sales, product and executive teams aligned on the brand's messaging and priorities?",
    impactMessage: "Cross-functional misalignment creates friction, missed opportunities, internal conflict, and operational chaos that acquirers see as high-risk.",
    citations: [
      {
        highlight: "Highly aligned organizations increase revenue 58% faster",
        text: "and are 72% more profitable than misaligned ones.",
        source: "Forbes",
      },
      {
        highlight: "When sales and marketing teams are highly aligned they",
        text: "see 67% higher deal close rates.",
        source: "Salesgenie",
      },
      {
        highlight: "36% higher customer retention rates",
        text: "when Executive-Sales-Marketing is aligned.",
        source: "SuperOffice",
      },
      {
        highlight: "Only 11% of companies have both",
        text: "aligned marketing & sales audiences and effective hand-off processes.",
        source: "Influ2",
      },
    ],
  },
];

export const confidenceQuestions = [
  { id: 1, text: "I was certain about my answers regarding how customers perceive our brand." },
  { id: 2, text: "I felt confident about our brand's clarity and messaging consistency." },
  { id: 3, text: "I had no doubt about our visual identity and brand recognition." },
  { id: 4, text: "I was sure about our internal culture and employee alignment." },
  { id: 5, text: "Overall, I feel confident that my answers accurately reflect our brand's current state." },
];
