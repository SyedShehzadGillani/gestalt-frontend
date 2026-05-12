import { specColorAt } from "@/lib/specColorAt";
import { formatScore } from "@/lib/formatScore";
import { SEGMENT_SCORES } from "@/data/mockData.js";

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

interface ThemeColors {
  bg2: string;
  bg3: string;
  border: string;
  border2: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  gold: string;
  green: string;
  scoreColor: string;
}

interface RightPanelProps {
  dark: boolean;
  theme: ThemeColors;
  activeId: string | null;
}

// Segment content for the right panel detail view
const SEGMENT_CONTENT: Record<string, {
  tag: string;
  color: string;
  headline: string;
  summary: string;
  exitImpact: string;
}> = {
  strategy: {
    tag: "STRATEGY",
    color: "#c9a227",
    headline: "Strategy drives where the company goes and what it refuses to do.",
    summary: "A clearly documented strategy with defined trade-offs, resource allocation priorities, and repeatable growth engines that don't depend on founder intuition. Acquirers pay premiums for businesses that know exactly who they are.",
    exitImpact: "A weak strategy score signals founder-dependent decision-making. Buyers discount 15–30% when strategy lives in one person's head instead of documented playbooks.",
  },
  leadership: {
    tag: "LEADERSHIP",
    color: "#cc4444",
    headline: "Leadership depth determines survivability without the founder.",
    summary: "Financial discipline, technology leverage, and institutional knowledge distributed across the team. A business that can't survive a two-week founder vacation will never survive an acquisition.",
    exitImpact: "Buyers run 'bus tests' — what happens if the founder disappears? A leadership score below 60 means the business stalls. That's a deal-killer.",
  },
  culture: {
    tag: "CULTURE",
    color: "#e07800",
    headline: "Culture is the invisible infrastructure acquirers can feel but can't fake.",
    summary: "Talent retention, organizational alignment, and support systems create the foundation that either accelerates or destroys post-acquisition integration. Every failed merger traces back to culture debt.",
    exitImpact: "Culture scores below 55 correlate with 40% higher employee attrition post-acquisition. Buyers price this risk directly into their offer.",
  },
  brand: {
    tag: "BRAND",
    color: "#6baa44",
    headline: "Brand equity is the only asset that compounds after acquisition.",
    summary: "Market position, innovation pipeline, research depth, and product differentiation that make your company irreplaceable. A strong brand means customers stay through ownership transitions.",
    exitImpact: "Companies with brand scores above 75 command 2–3x higher multiples. The brand is what buyers are actually purchasing — everything else is infrastructure.",
  },
  operations: {
    tag: "STRATEGY / OPERATIONS",
    color: "#d4a82a",
    headline: "Operations is the invisible engine that determines business worth.",
    summary: "When operations are systematized and documented, the business becomes an asset. When they aren't, the business is a job. Every PE firm runs an operations audit before closing.",
    exitImpact: "Companies with formally documented operational processes are 3× more likely to achieve above-average profitability.",
  },
  marketing: {
    tag: "STRATEGY / MARKETING",
    color: "#d4a82a",
    headline: "Marketing creates measurable demand that doesn't depend on the founder's network.",
    summary: "Marketing systems that generate predictable pipeline and can be operated by any competent team. The transition from founder-driven sales to systematic demand generation is the single highest-value unlock.",
    exitImpact: "Businesses with documented marketing systems and attributed pipeline command 20–40% higher multiples than founder-dependent sales models.",
  },
  sales: {
    tag: "STRATEGY / SALES",
    color: "#d4a82a",
    headline: "Sales infrastructure converts marketing demand into predictable revenue.",
    summary: "A repeatable sales process with documented playbooks, clear metrics, and team-operated pipeline that doesn't require founder involvement to close deals.",
    exitImpact: "Companies with sales processes that operate independently of the founder achieve 25% faster deal velocity during acquisition due diligence.",
  },
  finance: {
    tag: "LEADERSHIP / FINANCE",
    color: "#cc4444",
    headline: "Financial discipline is the language acquirers speak fluently.",
    summary: "Clean books, verified financials, clear unit economics, and forward-looking financial models that demonstrate predictable growth and margin expansion.",
    exitImpact: "Unverified or messy financials add 3–6 months to due diligence and reduce offers by 15–25%. Clean financials signal operational maturity.",
  },
  technology: {
    tag: "LEADERSHIP / TECHNOLOGY",
    color: "#cc4444",
    headline: "Technology leverage multiplies the value of every other system.",
    summary: "Modern, documented, and scalable technology infrastructure that reduces operational friction and enables growth without proportional headcount increases.",
    exitImpact: "Technical debt is a direct valuation discount. Acquirers estimate remediation costs and subtract them from the offer price.",
  },
  knowledge: {
    tag: "LEADERSHIP / KNOWLEDGE",
    color: "#cc4444",
    headline: "Institutional knowledge must be distributed, not concentrated.",
    summary: "Systems that capture, share, and operationalize organizational knowledge so that critical information doesn't walk out the door when any single person leaves.",
    exitImpact: "Knowledge concentration in key personnel represents the #1 integration risk for acquirers. It directly reduces the offered multiple.",
  },
  talent: {
    tag: "CULTURE / TALENT",
    color: "#e07800",
    headline: "Talent systems identify who carries the culture and who threatens it.",
    summary: "H.I.V.E. measures actual employee performance across four quadrants every quarter — separating culture carriers from flight risks before resignation letters arrive.",
    exitImpact: "Post-acquisition employee attrition averages 33% in the first year. Strong talent systems reduce this to under 15%.",
  },
  alignment: {
    tag: "CULTURE / ALIGNMENT",
    color: "#e07800",
    headline: "Organizational alignment determines execution velocity.",
    summary: "When teams are aligned on strategy, values, and priorities, execution accelerates. Misalignment creates invisible friction that compounds into significant value loss.",
    exitImpact: "Aligned organizations execute strategic initiatives 2.5× faster. Misalignment is the primary reason 70% of post-merger integrations fail.",
  },
  support: {
    tag: "CULTURE / SUPPORT",
    color: "#e07800",
    headline: "Support systems determine whether employees thrive or survive.",
    summary: "The infrastructure that enables employees to do their best work — tools, training, management support, and career development pathways that retain top performers.",
    exitImpact: "Companies with strong support systems achieve 40% lower turnover. Each retained key employee saves 150–200% of their annual salary in replacement costs.",
  },
  innovation: {
    tag: "BRAND / INNOVATION",
    color: "#6baa44",
    headline: "Innovation pipeline is the only sustainable competitive advantage.",
    summary: "A systematic approach to identifying opportunities, testing ideas, and bringing new value to market before competitors can respond. Innovation that is process-driven, not founder-dependent.",
    exitImpact: "Companies with documented innovation processes command 30% higher valuations. The pipeline itself is an acquirable asset.",
  },
  research: {
    tag: "BRAND / RESEARCH",
    color: "#6baa44",
    headline: "Research that is systematic, continuous, and connected to strategy.",
    summary: "Active competitive intelligence, market analysis, and customer insight programs that inform every strategic decision and keep the organization ahead of market shifts.",
    exitImpact: "Companies with active competitive intelligence programs are 2× as likely to respond effectively to competitive threats.",
  },
  product: {
    tag: "BRAND / PRODUCT",
    color: "#6baa44",
    headline: "The market doesn't need another version of what already exists.",
    summary: "Product differentiation built on unresolved customer pain — not feature checklists. The most transformative products solve problems customers have been tolerating.",
    exitImpact: "Product-led growth companies achieve 2× faster revenue growth. Clear product differentiation is the #1 driver of premium acquisition multiples.",
  },
};

export default function IntelligenceMapRightPanel({ dark, theme, activeId }: RightPanelProps) {
  const segment = activeId ? SEGMENT_CONTENT[activeId] : null;

  // Default state — no segment selected
  if (!segment) {
    return (
      <div style={{
        width: 230, flexShrink: 0,
        backgroundColor: theme.bg2, border: `1px solid ${theme.border}`,
        borderRadius: 2, padding: 16, fontFamily: font,
      }}>
        <div style={{
          borderLeft: `2px solid ${theme.gold}`,
          paddingLeft: 12, marginBottom: 16,
        }}>
          <span style={{
            fontSize: 13, fontWeight: 800, color: theme.text1,
            lineHeight: 1.5, display: "block",
          }}>
            16 Systems. One Number. Your Exit Valuation.
          </span>
        </div>
        <p style={{
          fontSize: 9, color: theme.text2, lineHeight: 1.8,
          margin: "0 0 16px 0",
        }}>
          Click any segment to see its impact on your exit valuation.
        </p>

        {/* 16 systems mini-list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Object.entries(SEGMENT_SCORES).map(([key, val]) => {
            const numVal = val as number;
            const sColor = specColorAt(numVal, dark);
            return (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 7, fontWeight: 600, color: theme.text4, textTransform: "uppercase" }}>{key}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 40, height: 2, backgroundColor: theme.border }}>
                    <div style={{ width: `${numVal}%`, height: "100%", backgroundColor: sColor }} />
                  </div>
                  <span style={{ fontSize: 7, fontWeight: 700, color: sColor, width: 24, textAlign: "right" }}>{formatScore(numVal)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Selected state
  const segColor = segment.color;

  return (
    <div style={{
      width: 230, flexShrink: 0,
      backgroundColor: theme.bg2, border: `1px solid ${theme.border}`,
      borderRadius: 2, padding: 16, fontFamily: font,
    }}>
      {/* Segment tag */}
      <span style={{
        fontSize: 8, fontWeight: 800, color: segColor,
        letterSpacing: 2, textTransform: "uppercase",
        display: "block", marginBottom: 10,
      }}>
        {segment.tag}
      </span>

      {/* Headline with gold left border */}
      <div style={{
        borderLeft: `2px solid ${segColor}`,
        paddingLeft: 10, marginBottom: 12,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 800, color: theme.text1,
          lineHeight: 1.5, display: "block",
        }}>
          {segment.headline}
        </span>
      </div>

      {/* Summary */}
      <p style={{
        fontSize: 9, color: theme.text3, lineHeight: 1.8,
        margin: "0 0 14px 0",
      }}>
        {segment.summary}
      </p>

      {/* EXIT IMPACT box */}
      <div style={{
        borderLeft: `2px solid ${theme.gold}`,
        padding: "10px 14px",
        backgroundColor: dark ? "rgba(201,162,39,0.06)" : "rgba(201,162,39,0.08)",
        borderRadius: 2,
      }}>
        <span style={{
          fontSize: 8, fontWeight: 800, color: theme.gold,
          letterSpacing: 1.5, display: "block", marginBottom: 6,
        }}>
          EXIT IMPACT
        </span>
        <p style={{
          fontSize: 9, color: theme.text2, lineHeight: 1.7, margin: 0,
        }}>
          {segment.exitImpact}
        </p>
      </div>
    </div>
  );
}
