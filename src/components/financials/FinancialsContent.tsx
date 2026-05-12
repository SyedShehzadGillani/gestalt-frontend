import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Field {
  key: string;
  label: string;
  sub?: string;
  placeholder: string;
  prefix?: string;
  suffix?: string;
}

interface FieldGroup {
  id: string;
  title: string;
  pillarIndex: number;
  tutorial: string;
  valueData: { stat: string; source: string };
  costData: { stat: string; source: string };
  fields: Field[];
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    id: "revenue", title: "REVENUE + INCOME", pillarIndex: 0,
    tutorial: "These three numbers establish your Seller's Discretionary Earnings (SDE) — the true economic benefit of owning your business. SDE is what buyers use to value companies under $5M in revenue.",
    valueData: { stat: "Companies that accurately track SDE sell for 15-25% more than those that rely on tax returns alone.", source: "International Business Brokers Association" },
    costData: { stat: "71% of businesses listed for sale never close — the #1 reason is unrealistic valuation based on inaccurate financials.", source: "BizBuySell" },
    fields: [
      { key: "revenue", label: "Annual Revenue", sub: "Trailing 12 months (TTM). Total top-line revenue before any expenses.", placeholder: "e.g. 4,500,000", prefix: "$" },
      { key: "netIncome", label: "Net Income", sub: "After all expenses, before owner compensation adjustments.", placeholder: "e.g. 450,000", prefix: "$" },
      { key: "ownerSalary", label: "Owner Salary / Total Compensation", sub: "Everything you take: salary, distributions, personal expenses.", placeholder: "e.g. 250,000", prefix: "$" },
    ],
  },
  {
    id: "itda", title: "INTEREST, TAXES, DEPRECIATION, AMORTIZATION", pillarIndex: 1,
    tutorial: "Combined with net income and owner salary, these four numbers produce your EBITDA — the universal language of business valuation.",
    valueData: { stat: "Companies with clean, verified EBITDA calculations receive 2-3× more acquisition offers.", source: "Axial Network" },
    costData: { stat: "46% of failed M&A deals cite 'financial discrepancies discovered during due diligence' as the primary reason.", source: "Deloitte M&A Trends Report" },
    fields: [
      { key: "interest", label: "Interest Expense", placeholder: "e.g. 35,000", prefix: "$" },
      { key: "taxes", label: "Income Taxes", placeholder: "e.g. 120,000", prefix: "$" },
      { key: "depreciation", label: "Depreciation", placeholder: "e.g. 45,000", prefix: "$" },
      { key: "amortization", label: "Amortization", placeholder: "e.g. 15,000", prefix: "$" },
    ],
  },
  {
    id: "growth", title: "GROWTH + MARGINS", pillarIndex: 2,
    tutorial: "Growth rate is the single biggest multiple multiplier. A 20% growth rate can add 2-3× to your exit multiple.",
    valueData: { stat: "Businesses growing at 20%+ annually command exit multiples 2.5× higher than businesses growing under 5%.", source: "PitchBook" },
    costData: { stat: "Companies with declining revenue receive offers averaging 40-60% below industry median multiples.", source: "GF Data" },
    fields: [
      { key: "growthRate", label: "Revenue Growth Rate", placeholder: "e.g. 18", suffix: "%" },
      { key: "grossMargin", label: "Gross Margin", placeholder: "e.g. 62", suffix: "%" },
    ],
  },
  {
    id: "customers", title: "CUSTOMERS + TEAM", pillarIndex: 3,
    tutorial: "Customer concentration is a deal killer. If your top 5 customers represent more than 20% of revenue, every buyer sees risk.",
    valueData: { stat: "Businesses with diversified customer bases sell for 20-30% premiums over concentrated peers.", source: "Pepperdine Private Capital Markets Report" },
    costData: { stat: "Losing a top-5 customer costs 5-25× what it costs to retain them.", source: "Bain & Company + Vista Equity Partners" },
    fields: [
      { key: "customerCount", label: "Total Active Customers", placeholder: "e.g. 340", prefix: "#" },
      { key: "top5Pct", label: "Top 5 Customer Concentration", placeholder: "e.g. 28", suffix: "%" },
      { key: "employeeCount", label: "Total Employees", placeholder: "e.g. 47", prefix: "#" },
      { key: "turnoverRate", label: "Annual Employee Turnover Rate", placeholder: "e.g. 14", suffix: "%" },
    ],
  },
];

const BREADCRUMBS = ["WELCOME", "REVENUE + INCOME", "I.T.D.A.", "GROWTH + MARGINS", "CUSTOMERS + TEAM", "RESULTS"];

const fmt = (v: number) => {
  if (!v && v !== 0) return "—";
  if (isNaN(v)) return "—";
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${Math.round(v).toLocaleString()}`;
  return `$${v}`;
};

type ConnectMode = "manual" | "quickbooks" | null;

export function FinancialsContent() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [connectMode, setConnectMode] = useState<ConnectMode>(null);
  const [vals, setVals] = useState<Record<string, string>>({});

  const updateVal = (key: string, value: string) => setVals((prev) => ({ ...prev, [key]: value }));

  const calcs = useMemo(() => {
    const num = (k: string) => {
      const v = parseFloat((vals[k] || "").toString().replace(/,/g, ""));
      return isNaN(v) ? 0 : v;
    };
    const revenue = num("revenue"), netIncome = num("netIncome"), ownerSalary = num("ownerSalary");
    const interest = num("interest"), taxes = num("taxes"), depreciation = num("depreciation"), amortization = num("amortization");
    const growthRate = num("growthRate");

    const sde = netIncome + ownerSalary + interest + depreciation + amortization;
    const ebitda = netIncome + interest + taxes + depreciation + amortization;
    const filledCount = Object.values(vals).filter((v) => v && v.toString().trim() !== "").length;

    const estMultiple = revenue < 1e6 ? 2.5
      : revenue < 5e6 ? (growthRate > 15 ? 4 : 3)
      : revenue < 20e6 ? (growthRate > 20 ? 6 : growthRate > 10 ? 5 : 4)
      : (growthRate > 20 ? 8 : growthRate > 10 ? 6 : 5);
    const currentVal = ebitda * estMultiple;
    const potentialMultiple = estMultiple + 3;
    const potentialVal = ebitda * potentialMultiple;
    const complacencyTaxDaily = ebitda > 0 ? Math.round((potentialVal - currentVal) / 365) : 0;

    return { revenue, ebitda, sde, filledCount, totalFields: 13, estMultiple, currentVal, potentialMultiple, potentialVal, complacencyTaxDaily };
  }, [vals]);

  const renderWelcome = () => (
    <div className="max-w-2xl mx-auto my-10 text-center">
      <div className="text-[8px] font-bold tracking-[2px] text-gold/80 mb-2">FINANCIALS</div>
      <div className="text-2xl font-black tracking-[3px] mb-4">YOUR VALUATION ANCHOR</div>
      <div className="text-[11px] text-muted-foreground leading-[1.8] max-w-md mx-auto mb-8">
        Every number you enter here flows directly into your EXIT EQUATION™. This is the financial foundation — your EBITDA, your multiples, and your daily VALUATION DRAIN™.
      </div>
      <div className="text-[9px] font-bold tracking-[2px] text-muted-foreground/60 mb-3">HOW DO YOU WANT TO START?</div>
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          onClick={() => setConnectMode("manual")}
          className="px-8 py-4 text-[10px] font-bold tracking-[1.5px]"
        >
          ENTER MANUALLY
        </Button>
        <Button
          onClick={() => setConnectMode("quickbooks")}
          className="px-8 py-4 bg-gold text-black hover:bg-gold/90 text-[10px] font-extrabold tracking-[1.5px]"
        >
          CONNECT QUICKBOOKS
        </Button>
      </div>
      <div className="text-[8px] text-muted-foreground/60 mt-4 tracking-wider">
        MANUAL ENTRY IS FLAGGED "UNVERIFIED" · QUICKBOOKS UNLOCKS VERIFIED SCORING
      </div>
    </div>
  );

  const renderQuickBooks = () => (
    <div className="max-w-md mx-auto my-16 text-center">
      <div className="text-xl font-black mb-3">CONNECT QUICKBOOKS</div>
      <div className="text-[10px] text-muted-foreground mb-6">
        Verified financial data unlocks GESTALT CERTIFIED eligibility and removes the UNVERIFIED flag from all your scores.
      </div>
      <Button className="px-8 py-3.5 bg-gold text-black hover:bg-gold/90 text-[10px] font-extrabold tracking-[1.5px]">
        AUTHORIZE QUICKBOOKS
      </Button>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setConnectMode("manual")}
          className="text-[9px] tracking-wider underline text-muted-foreground hover:text-foreground"
        >
          OR ENTER MANUALLY
        </button>
      </div>
    </div>
  );

  const renderManual = () => {
    const g = FIELD_GROUPS[activeGroup];
    return (
      <div className="max-w-2xl">
        <div className="mb-5">
          <div className="text-[8px] font-bold tracking-[2px] text-gold/80 mb-1">SECTION {activeGroup + 1} OF {FIELD_GROUPS.length}</div>
          <div className="text-xl font-black tracking-[2px]">{g.title}</div>
        </div>

        <div className="px-5 py-4 bg-card border border-border border-l-[3px] border-l-gold mb-5">
          <div className="text-[8px] font-bold tracking-[2px] text-gold mb-1.5">WHY THIS MATTERS</div>
          <div className="text-[10px] text-muted-foreground leading-[1.7]">{g.tutorial}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-6">
          <div className="p-3 bg-[#5fcc00]/[0.04] border border-[#5fcc00]/15 border-l-[3px] border-l-[#5fcc00]">
            <div className="text-[7px] font-bold tracking-[1.5px] text-[#5fcc00] mb-1">VALUE OF COMPLETING</div>
            <div className="text-[9px] text-foreground/80 leading-[1.5]">{g.valueData.stat}</div>
            <div className="text-[7px] text-muted-foreground/60 mt-1">— {g.valueData.source}</div>
          </div>
          <div className="p-3 bg-[#ef4444]/[0.04] border border-[#ef4444]/15 border-l-[3px] border-l-[#ef4444]">
            <div className="text-[7px] font-bold tracking-[1.5px] text-[#ef4444] mb-1">COST OF SKIPPING</div>
            <div className="text-[9px] text-foreground/80 leading-[1.5]">{g.costData.stat}</div>
            <div className="text-[7px] text-muted-foreground/60 mt-1">— {g.costData.source}</div>
          </div>
        </div>

        {g.fields.map((f) => (
          <div key={f.key} className="mb-4">
            <div className="text-[10px] font-bold mb-0.5">{f.label}</div>
            {f.sub && <div className="text-[8px] text-muted-foreground/60 mb-1.5">{f.sub}</div>}
            <div className="flex">
              {f.prefix && (
                <div className="px-3 py-2.5 bg-card border border-border border-r-0 text-base font-bold text-gold flex items-center">
                  {f.prefix}
                </div>
              )}
              <Input
                type="text"
                value={vals[f.key] || ""}
                onChange={(e) => updateVal(f.key, e.target.value)}
                placeholder={f.placeholder}
                className={`flex-1 text-sm font-semibold ${f.prefix ? "border-l-0 rounded-l-none" : ""} ${f.suffix ? "border-r-0 rounded-r-none" : ""}`}
              />
              {f.suffix && (
                <div className="px-3 py-2.5 bg-card border border-border border-l-0 text-base font-bold text-gold flex items-center">
                  {f.suffix}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => activeGroup === 0 ? setConnectMode(null) : setActiveGroup(activeGroup - 1)}
            className="px-5 py-2.5 text-[9px] font-bold tracking-[1.5px]"
          >
            {activeGroup === 0 ? "BACK" : "PREVIOUS SECTION"}
          </Button>
          <Button
            onClick={() => activeGroup < FIELD_GROUPS.length - 1 && setActiveGroup(activeGroup + 1)}
            className="px-6 py-2.5 bg-gold text-black hover:bg-gold/90 text-[9px] font-extrabold tracking-[1.5px]"
          >
            {activeGroup === FIELD_GROUPS.length - 1 ? "CALCULATE MY VALUATION" : "NEXT SECTION"}
          </Button>
        </div>

        {calcs.filledCount >= 3 && calcs.ebitda > 0 && (
          <div className="mt-6 p-5 bg-gold/[0.03] border border-gold/20">
            <div className="text-[8px] font-bold tracking-[2px] text-gold mb-3">LIVE EXIT EQUATION™ PREVIEW</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="text-[7px] text-muted-foreground/60 tracking-wider">EBITDA</div>
                <div className="text-lg font-black text-gold">{fmt(calcs.ebitda)}</div>
              </div>
              <div>
                <div className="text-[7px] text-muted-foreground/60 tracking-wider">CURRENT VALUATION</div>
                <div className="text-lg font-black">{fmt(calcs.currentVal)}</div>
                <div className="text-[7px] text-muted-foreground/60">{calcs.estMultiple.toFixed(1)}× multiple</div>
              </div>
              <div>
                <div className="text-[7px] text-muted-foreground/60 tracking-wider">POTENTIAL VALUATION</div>
                <div className="text-lg font-black text-[#5fcc00]">{fmt(calcs.potentialVal)}</div>
                <div className="text-[7px] text-muted-foreground/60">{calcs.potentialMultiple.toFixed(1)}× multiple</div>
              </div>
            </div>
            {calcs.complacencyTaxDaily > 0 && (
              <div className="mt-3 px-3 py-2 bg-[#ef4444]/10 border-l-[3px] border-[#ef4444]">
                <div className="text-[7px] font-bold tracking-wider text-[#ef4444]">DAILY VALUATION DRAIN™</div>
                <div className="text-base font-black text-[#ef4444]">{fmt(calcs.complacencyTaxDaily)}/day</div>
              </div>
            )}
            <div className="mt-2 text-[7px] text-muted-foreground/60 tracking-wider">
              SELF-REPORTED · UNVERIFIED · CONNECT QUICKBOOKS FOR VERIFIED SCORING
            </div>
          </div>
        )}
      </div>
    );
  };

  let body;
  if (!connectMode) body = renderWelcome();
  else if (connectMode === "quickbooks") body = renderQuickBooks();
  else body = renderManual();

  const activeBreadcrumb = connectMode ? activeGroup + 1 : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 py-3 border-b border-border flex gap-2 flex-wrap">
        {BREADCRUMBS.map((bc, i) => (
          <div key={bc} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => connectMode && i > 0 && i < 5 && setActiveGroup(i - 1)}
              className={`text-[9px] tracking-wider ${
                i === activeBreadcrumb ? "font-bold text-gold" :
                i < activeBreadcrumb ? "text-[#5fcc00]" : "text-muted-foreground/60"
              }`}
            >
              {bc}
            </button>
            {i < BREADCRUMBS.length - 1 && <span className="text-[9px] text-muted-foreground/40">/</span>}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">{body}</div>

      <div className="px-8 py-3 border-t border-border">
        <div className="text-[8px] font-bold tracking-[2px] text-muted-foreground/60 mb-1.5">YOUR DATA IS BUILDING</div>
        <div className="flex gap-0.5">
          {[0,1,2,3,4,5,6,7].map((i) => (
            <div key={i} className={`flex-1 h-1 ${i <= 1 ? "bg-gold" : "bg-gold/15"}`} />
          ))}
        </div>
        <div className="text-center mt-1.5 text-[8px] font-bold tracking-[1.5px] text-gold">
          {Math.round(calcs.filledCount / calcs.totalFields * 100 * 0.12 + 13)}% OF FULL INTELLIGENCE
        </div>
      </div>
    </div>
  );
}
