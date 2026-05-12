import { useState } from "react";
import { specColorAt } from "@/lib/specColorAt";
import { formatScore } from "@/lib/formatScore";
import { QUADRANT_SCORES } from "@/data/mockData.js";

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

interface LeftPanelProps {
  dark: boolean;
  theme: ThemeColors;
  activeId: string | null;
  viewMode: "education" | "score";
  onSegmentClick: (id: string | null) => void;
}

const QUADRANTS = [
  {
    id: "strategy",
    label: "STRATEGY",
    color: "#c9a227",
    useFixed: true,
    score: QUADRANT_SCORES.strategy,
    subtitle: "Defines where the company is going, what it will sacrifice to get there, and why.",
    segments: [
      { id: "operations", label: "OPERATIONS", tag: "OPS" },
      { id: "marketing", label: "MARKETING", tag: "MKT" },
      { id: "sales", label: "SALES", tag: "SAL" },
    ],
    selectedHeadline: "Strategic alignment drives premium valuation multiples.",
    selectedBody: "Strategy isn't a mission statement — it's the documented system of trade-offs that lets your organization say no to the wrong opportunities and yes to the right ones. Acquirers pay premiums for businesses with clear strategic moats, disciplined resource allocation, and repeatable growth engines that don't depend on founder intuition.",
    exitImpact: "A weak strategy score signals founder-dependent decision-making. Buyers discount 15–30% when strategy lives in one person's head instead of documented playbooks.",
  },
  {
    id: "leadership",
    label: "LEADERSHIP",
    color: null,
    useFixed: false,
    score: QUADRANT_SCORES.leadership,
    subtitle: "The system that runs the business without the founder — distributed, measured, scalable.",
    segments: [
      { id: "finance", label: "FINANCE", tag: "FIN" },
      { id: "technology", label: "TECHNOLOGY", tag: "TECH" },
      { id: "knowledge", label: "KNOWLEDGE", tag: "KNW" },
    ],
    selectedHeadline: "Leadership depth determines survivability without the founder.",
    selectedBody: "Leadership isn't about charisma — it's the operational infrastructure that keeps the business running when the founder steps away. Financial discipline, technology leverage, and institutional knowledge must be distributed across the team. A business that can't survive a two-week founder vacation will never survive an acquisition.",
    exitImpact: "Buyers run 'bus tests' — what happens if the founder disappears? A leadership score below 60 means the answer is 'the business stalls.' That's a deal-killer.",
  },
  {
    id: "culture",
    label: "CULTURE",
    color: null,
    useFixed: false,
    score: QUADRANT_SCORES.culture,
    subtitle: "The behaviors your organization produces when no one is watching, scored every quarter.",
    segments: [
      { id: "talent", label: "TALENT", tag: "TAL" },
      { id: "alignment", label: "ALIGNMENT", tag: "ALN" },
      { id: "support", label: "SUPPORT", tag: "SUP" },
    ],
    selectedHeadline: "Culture is the invisible infrastructure acquirers can feel but can't fake.",
    selectedBody: "Culture isn't ping-pong tables — it's the behavioral patterns your team defaults to under pressure. Talent retention, organizational alignment, and support systems create the foundation that either accelerates or destroys post-acquisition integration. Every failed merger traces back to culture debt.",
    exitImpact: "Culture scores below 55 correlate with 40% higher employee attrition post-acquisition. Buyers price this risk directly into their offer.",
  },
  {
    id: "brand",
    label: "BRAND",
    color: null,
    useFixed: false,
    score: QUADRANT_SCORES.brand,
    subtitle: "The governing identity that no competitor can replicate and no acquisition can acquire.",
    segments: [
      { id: "innovation", label: "INNOVATION", tag: "INN" },
      { id: "research", label: "RESEARCH", tag: "RES" },
      { id: "product", label: "PRODUCT", tag: "PRD" },
    ],
    selectedHeadline: "Brand equity is the only asset that compounds after acquisition.",
    selectedBody: "Brand isn't a logo — it's the market position, innovation pipeline, research depth, and product differentiation that make your company irreplaceable. A strong brand means customers stay through ownership transitions, competitors can't replicate your advantage, and acquirers see strategic value beyond cash flow.",
    exitImpact: "Companies with brand scores above 75 command 2–3x higher multiples. The brand is what buyers are actually purchasing — everything else is infrastructure.",
  },
];

function getQuadrantColor(q: typeof QUADRANTS[0], dark: boolean): string {
  if (q.useFixed) return q.color!;
  return specColorAt(q.score, dark);
}

export default function IntelligenceMapLeftPanel({ dark, theme, activeId, viewMode, onSegmentClick }: LeftPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selected = activeId ? QUADRANTS.find(q => q.id === activeId) : null;

  if (selected) {
    const qColor = getQuadrantColor(selected, dark);
    return (
      <div style={{ width: 260, flexShrink: 0, fontFamily: font, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Back button */}
        <button
          onClick={() => onSegmentClick(null)}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = theme.gold; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = theme.text4; }}
          style={{
            fontFamily: font, fontSize: 8, fontWeight: 700, color: theme.text4,
            background: "none", border: "none", cursor: "pointer", padding: 0,
            letterSpacing: 1.5, textTransform: "uppercase", textAlign: "left",
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          ALL QUADRANTS
        </button>

        {/* Segment tag + score */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: qColor, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {selected.label}
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: specColorAt(selected.score, dark) }}>
              {formatScore(selected.score)}
            </span>
          </div>

          {/* Segment tags */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {selected.segments.map(seg => (
              <span key={seg.id} style={{
                fontSize: 7, fontWeight: 700, color: theme.text4,
                letterSpacing: 1, padding: "2px 6px",
                border: `1px solid ${theme.border}`, borderRadius: 2,
                textTransform: "uppercase",
              }}>
                {seg.tag}
              </span>
            ))}
          </div>
        </div>

        {/* Headline with gold left border */}
        <div style={{ borderLeft: `2px solid ${theme.gold}`, paddingLeft: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: theme.text1, lineHeight: 1.5, display: "block" }}>
            {selected.selectedHeadline}
          </span>
        </div>

        {/* Body summary */}
        <p style={{ fontSize: 9, color: theme.text3, lineHeight: 1.8, margin: 0 }}>
          {selected.selectedBody}
        </p>

        {/* EXIT IMPACT box */}
        <div style={{
          borderLeft: `2px solid ${theme.gold}`,
          padding: "10px 14px",
          backgroundColor: dark ? "rgba(201,162,39,0.06)" : "rgba(201,162,39,0.08)",
          borderRadius: 2,
        }}>
          <span style={{ fontSize: 8, fontWeight: 800, color: theme.gold, letterSpacing: 1.5, display: "block", marginBottom: 6 }}>
            EXIT IMPACT
          </span>
          <p style={{ fontSize: 9, color: theme.text2, lineHeight: 1.7, margin: 0 }}>
            {selected.exitImpact}
          </p>
        </div>
      </div>
    );
  }

  // DEFAULT STATE: Four quadrant cards
  return (
    <div style={{ width: 260, flexShrink: 0, fontFamily: font, display: "flex", flexDirection: "column", gap: 14 }}>
      {QUADRANTS.map(q => {
        const qColor = getQuadrantColor(q, dark);
        const isHovered = hoveredId === q.id;
        return (
          <div
            key={q.id}
            onClick={() => onSegmentClick(q.id)}
            onMouseEnter={() => setHoveredId(q.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              backgroundColor: isHovered ? theme.bg3 : theme.bg2,
              border: `1px solid ${theme.border}`,
              borderLeft: `2px solid ${qColor}`,
              borderRadius: 2,
              padding: "12px 14px",
              cursor: "pointer",
              transition: "background-color 150ms",
            }}
          >
            {/* Top row: name + score */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: qColor, letterSpacing: 1.5, textTransform: "uppercase" }}>
                {q.label}
              </span>
              <span style={{ fontSize: 10, fontWeight: 900, color: specColorAt(q.score, dark) }}>
                {formatScore(q.score)}
              </span>
            </div>

            {/* Subtitle */}
            <p style={{ fontSize: 8, color: theme.text3, lineHeight: 1.6, margin: "0 0 8px 0" }}>
              {q.subtitle}
            </p>

            {/* Progress bar */}
            <div style={{ width: "100%", height: 2, backgroundColor: theme.border, borderRadius: 1 }}>
              <div style={{ width: `${q.score}%`, height: "100%", backgroundColor: qColor, borderRadius: 1, transition: "width 300ms" }} />
            </div>

            {/* Hover: EXIT IMPACT text */}
            {isHovered && (
              <span style={{
                display: "block", marginTop: 6,
                fontSize: 7, fontWeight: 700, color: theme.gold,
                letterSpacing: 1, textTransform: "uppercase",
              }}>
                VIEW EXIT IMPACT →
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
