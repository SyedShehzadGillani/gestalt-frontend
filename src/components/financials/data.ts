// FINANCIALS field groups — mirrors moved_docs/gestalt-financials.txt verbatim.

export interface FinField {
  key: string;
  label: string;
  sub: string;
  placeholder: string;
  prefix?: string;
  suffix?: string;
  tooltip: string;
}

export interface FinFieldGroup {
  id: string;
  title: string;
  breadcrumb: string;
  pillarIndex: number;
  tutorial: string;
  valueData: { stat: string; source: string };
  costData: { stat: string; source: string };
  fields: FinField[];
}

export const FIN_BREADCRUMBS = [
  "WELCOME",
  "REVENUE + INCOME",
  "I.T.D.A.",
  "GROWTH + MARGINS",
  "CUSTOMERS + TEAM",
  "RESULTS",
];

export const FIN_FIELD_GROUPS: FinFieldGroup[] = [
  {
    id: "revenue",
    title: "REVENUE + INCOME",
    breadcrumb: "REVENUE + INCOME",
    pillarIndex: 0,
    tutorial:
      "These three numbers establish your Seller's Discretionary Earnings (SDE) — the true economic benefit of owning your business. SDE is what buyers use to value companies under $5M in revenue. For larger companies, EBITDA becomes the standard. Either way, it starts here.",
    valueData: {
      stat: "Companies that accurately track SDE sell for 15-25% more than those that rely on tax returns alone.",
      source: "International Business Brokers Association",
    },
    costData: {
      stat: "71% of businesses listed for sale never close — the #1 reason is unrealistic valuation based on inaccurate financials.",
      source: "BizBuySell",
    },
    fields: [
      {
        key: "revenue",
        label: "Annual Revenue",
        sub: "Trailing 12 months (TTM). Total top-line revenue before any expenses.",
        placeholder: "e.g. 4,500,000",
        prefix: "$",
        tooltip:
          "Use your most recent 12-month period, not calendar year if different. This is the number at the top of your P&L. If you have seasonal variation, TTM smooths it out.",
      },
      {
        key: "netIncome",
        label: "Net Income",
        sub: "After all expenses, before owner compensation adjustments.",
        placeholder: "e.g. 450,000",
        prefix: "$",
        tooltip:
          "This is the bottom line from your income statement. Don't adjust for owner salary yet — we'll do that separately. Include all business expenses, interest, taxes, depreciation.",
      },
      {
        key: "ownerSalary",
        label: "Owner Salary / Total Compensation",
        sub: "Everything you take: salary, distributions, personal expenses run through the business.",
        placeholder: "e.g. 250,000",
        prefix: "$",
        tooltip:
          "Include ALL compensation: W-2 salary, owner draws, distributions, health insurance, car payments, personal travel, and any other expenses the business pays for your benefit. Be honest — this adds back to SDE.",
      },
    ],
  },
  {
    id: "itda",
    title: "INTEREST, TAXES, DEPRECIATION, AMORTIZATION",
    breadcrumb: "I.T.D.A.",
    pillarIndex: 1,
    tutorial:
      "Combined with net income and owner salary, these four numbers produce your EBITDA — Earnings Before Interest, Taxes, Depreciation, and Amortization. EBITDA is the universal language of business valuation. Every PE buyer, every M&A advisor, every bank uses this number. If you don't know yours, you can't negotiate your exit.",
    valueData: {
      stat: "Companies with clean, verified EBITDA calculations receive 2-3× more acquisition offers than those with unclear financials.",
      source: "Axial Network",
    },
    costData: {
      stat: "46% of failed M&A deals cite 'financial discrepancies discovered during due diligence' as the primary reason.",
      source: "Deloitte M&A Trends Report",
    },
    fields: [
      {
        key: "interest",
        label: "Interest Expense",
        sub: "Annual interest payments on all business debt: loans, lines of credit, equipment financing.",
        placeholder: "e.g. 35,000",
        prefix: "$",
        tooltip:
          "Include all interest payments — SBA loans, equipment financing, credit lines, real estate mortgages held by the business. This gets added back to calculate EBITDA because a buyer will have different debt structure.",
      },
      {
        key: "taxes",
        label: "Income Taxes",
        sub: "Federal + state + local income taxes paid by the business entity.",
        placeholder: "e.g. 120,000",
        prefix: "$",
        tooltip:
          "Business income taxes only — not payroll taxes (those are operating expenses). For pass-through entities (S-Corp, LLC), estimate what the business-level tax burden would be. This adds back because buyers have different tax structures.",
      },
      {
        key: "depreciation",
        label: "Depreciation",
        sub: "Annual depreciation of tangible assets: equipment, vehicles, buildings, improvements.",
        placeholder: "e.g. 45,000",
        prefix: "$",
        tooltip:
          "Found on your tax return or P&L. This is a non-cash expense — the business didn't actually spend this money this year. It adds back to EBITDA because the asset still has value.",
      },
      {
        key: "amortization",
        label: "Amortization",
        sub: "Annual amortization of intangible assets: patents, goodwill, licensing agreements.",
        placeholder: "e.g. 15,000",
        prefix: "$",
        tooltip:
          "Similar to depreciation but for intangible assets. If you've acquired another business, you likely have goodwill amortization. If not, this may be $0 — that's fine.",
      },
    ],
  },
  {
    id: "growth",
    title: "GROWTH + MARGINS",
    breadcrumb: "GROWTH + MARGINS",
    pillarIndex: 2,
    tutorial:
      "Growth rate is the single biggest multiple multiplier. A 20% growth rate can add 2-3× to your exit multiple compared to a flat or declining business. Gross margin tells buyers how much room exists for profit expansion. Together, these two numbers determine whether a buyer sees a turnaround project or a rocket ship.",
    valueData: {
      stat: "Businesses growing at 20%+ annually command exit multiples 2.5× higher than businesses growing under 5%.",
      source: "PitchBook",
    },
    costData: {
      stat: "Companies with declining revenue receive offers averaging 40-60% below industry median multiples — if they receive offers at all.",
      source: "GF Data",
    },
    fields: [
      {
        key: "growthRate",
        label: "Revenue Growth Rate",
        sub: "Year-over-year percentage. Current TTM vs. prior TTM.",
        placeholder: "e.g. 18",
        suffix: "%",
        tooltip:
          "Calculate: (Current Year Revenue - Prior Year Revenue) / Prior Year Revenue × 100. If you're growing 18%, enter 18. If declining, enter a negative number. Be honest — buyers will verify this in due diligence.",
      },
      {
        key: "grossMargin",
        label: "Gross Margin",
        sub: "Revenue minus cost of goods/services, divided by revenue.",
        placeholder: "e.g. 62",
        suffix: "%",
        tooltip:
          "Gross Margin = (Revenue - COGS) / Revenue × 100. For service businesses, COGS includes direct labor costs. For product businesses, include materials, manufacturing, and direct labor. Higher margins = more room for profit optimization.",
      },
    ],
  },
  {
    id: "customers",
    title: "CUSTOMERS + TEAM",
    breadcrumb: "CUSTOMERS + TEAM",
    pillarIndex: 3,
    tutorial:
      "Customer concentration is a deal killer. If your top 5 customers represent more than 20% of revenue, every buyer sees risk. Employee turnover rate tells buyers whether your culture retains talent — or hemorrhages it. High turnover is a direct signal of complacency eating your culture from the inside.\n\nThese numbers connect directly to your H.I.V.E. and S.U.M. data once those modules activate. The AI will correlate employee turnover with H.I.V.E. scores and S.U.M. participation patterns to identify exactly WHERE culture is breaking down — not just that it's breaking down.",
    valueData: {
      stat: "Businesses with diversified customer bases (no single customer >10% of revenue) sell for 20-30% premiums over concentrated peers.",
      source: "Pepperdine Private Capital Markets Report",
    },
    costData: {
      stat: "Losing a top-5 customer costs 5-25× what it costs to retain them. Customer concentration above 20% is flagged as 'material risk' in 94% of PE due diligence reports.",
      source: "Bain & Company + Vista Equity Partners",
    },
    fields: [
      {
        key: "customerCount",
        label: "Total Active Customers",
        sub: "Number of unique paying customers in the trailing 12 months.",
        placeholder: "e.g. 340",
        prefix: "#",
        tooltip:
          "Count customers who have paid you at least once in the last 12 months. For recurring revenue businesses, count active subscribers. For project-based, count unique clients with completed projects.",
      },
      {
        key: "top5Pct",
        label: "Top 5 Customer Concentration",
        sub: "What percentage of total revenue comes from your 5 largest customers?",
        placeholder: "e.g. 28",
        suffix: "%",
        tooltip:
          "Add up revenue from your 5 largest customers, divide by total revenue, multiply by 100. Below 15% is excellent. 15-25% is acceptable. Above 25% is a red flag for buyers. Above 40% is a deal risk.",
      },
      {
        key: "employeeCount",
        label: "Total Employees",
        sub: "Full-time equivalent (FTE) headcount, including owners.",
        placeholder: "e.g. 47",
        prefix: "#",
        tooltip:
          "Count all full-time employees. For part-time workers, convert to FTE (two half-time = one FTE). Include owners who work in the business. This number combined with revenue gives your revenue-per-employee — a key efficiency metric.",
      },
      {
        key: "turnoverRate",
        label: "Annual Employee Turnover Rate",
        sub: "Percentage of employees who left (voluntary + involuntary) in the past 12 months.",
        placeholder: "e.g. 14",
        suffix: "%",
        tooltip:
          "Calculate: (Number of employees who left in 12 months / Average total employees) × 100. Include both voluntary resignations and terminations. Industry average is 15-20%. Below 10% is excellent. Above 25% signals culture problems that will show up in H.I.V.E.",
      },
    ],
  },
];

export const FIN_TIMELINE_LEN = 8;
