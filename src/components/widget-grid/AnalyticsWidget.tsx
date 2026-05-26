import { useState } from "react";
import { WidgetContainer } from "./WidgetContainer";
import { AnalyticsContent } from "@/components/analytics/AnalyticsContent";
import { specColorAt } from "@/lib/specColorAt";
import { formatScore } from "@/lib/formatScore";
import { COMPANY_SCORES, MOCK_DAILY_TASKS } from "@/data/mockData.js";

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

interface Task { id: string; title: string; dollarsAtStake: number; }

export function AnalyticsWidget({ isDark, onRemove }: { isDark: boolean; onRemove?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const score = COMPANY_SCORES.gestaltScore;
  const scoreColor = specColorAt(score, isDark);
  const text2 = isDark ? "hsl(0 0% 63%)" : "hsl(215 10% 40%)";
  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const gold = "#c9a227";

  const topActions = [...(MOCK_DAILY_TASKS as Task[])]
    .sort((a, b) => (b.dollarsAtStake || 0) - (a.dollarsAtStake || 0))
    .slice(0, 3);

  return (
    <>
      <WidgetContainer title="ANALYTICS" helpId="widget-analytics" onRemove={onRemove}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: font }}>
          {/* Score + spectrum */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                {formatScore(score)}
              </span>
              <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", color: scoreColor, marginTop: 4 }}>
                {COMPANY_SCORES.exitLabel}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                width: "100%", height: 8, borderRadius: 9999, position: "relative",
                background: "linear-gradient(90deg, #4f0200, #873025, #ba702a, #c0933b, #cff200, #5fcc00)",
              }}>
                <div style={{
                  position: "absolute", left: `${score}%`, top: -4,
                  width: 0, height: 0,
                  borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                  borderTop: "8px solid #fff", transform: "translateX(-5px)",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                }} />
              </div>
              <div style={{ fontSize: 9, color: text4, marginTop: 8, lineHeight: 1.5 }}>
                224 data points · 12 subsystems · 3-tier valuation range
              </div>
            </div>
          </div>

          {/* Top AI actions */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: text4, marginBottom: 6 }}>
              Top AI Actions
            </div>
            {topActions.map((t) => (
              <div key={t.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "4px 0" }}>
                <span style={{ fontSize: 11, color: text2 }}>{t.title}</span>
                {t.dollarsAtStake > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#ba702a", whiteSpace: "nowrap" }}>
                    ${t.dollarsAtStake.toLocaleString()}
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setExpanded(true)}
            style={{
              alignSelf: "flex-start", fontFamily: font, fontSize: 11, fontWeight: 800,
              letterSpacing: 1, textTransform: "uppercase", color: gold,
              background: "transparent", border: `1px solid ${gold}`, borderRadius: 2,
              padding: "6px 14px", cursor: "pointer",
            }}
          >
            Open full dashboard ↗
          </button>
        </div>
      </WidgetContainer>

      {expanded && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          backgroundColor: "var(--content-bg)", height: "100vh", overflow: "hidden",
        }}>
          <button
            onClick={() => setExpanded(false)}
            aria-label="Close analytics"
            style={{
              position: "fixed", top: 12, right: 16, zIndex: 1001,
              width: 32, height: 32, borderRadius: 2, cursor: "pointer",
              backgroundColor: "rgba(0,0,0,0.5)", border: `1px solid ${gold}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <AnalyticsContent />
        </div>
      )}
    </>
  );
}
