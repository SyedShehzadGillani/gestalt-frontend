import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { specColorAt } from "@/lib/specColorAt";
import { formatScore } from "@/lib/formatScore";
import { HelpButton } from "@/components/help/HelpButton";
import { WidgetGrid } from "@/components/widget-grid/WidgetGrid";
import IntelligenceMapLeftPanel from "@/components/command-center/IntelligenceMapLeftPanel";
import GestaltWheelEmbed from "@/components/command-center/GestaltWheelEmbed.jsx";
import IntelligenceMapRightPanel from "@/components/command-center/IntelligenceMapRightPanel";
import {
  COMPANY_SCORES,
  QUADRANT_SCORES,
  SEGMENT_SCORES,
  ONBOARDING_STEPS,
  CURRENT_USER,
} from "@/data/mockData.js";

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

const TIERS = [
  { label: "LIQUIDATION", range: "0–16", color: "#4f0200", desc: "Business has no transferable value. Immediate structural failure if founder exits." },
  { label: "EXIT UNLIKELY", range: "17–33", color: "#6e231f", desc: "Significant foundational gaps. Acquirers see more risk than opportunity." },
  { label: "DISRUPTION IMMINENT", range: "34–49", color: "#a44f24", desc: "Operations depend on founder. One disruption away from value collapse." },
  { label: "MARKET VULNERABLE", range: "50–65", color: "#c0933b", desc: "Foundational strength exists but meaningful gaps remain before a buyer pays a premium multiple." },
  { label: "EXIT POSSIBLE", range: "66–82", color: "#8ccc00", desc: "Strong operational independence. Buyers see viable acquisition target with manageable risk." },
  { label: "EXIT READY", range: "83–100", color: "#5fcc00", desc: "Premium multiple justified. Business runs independently with documented systems and proven growth." },
];

const QUADRANT_CARDS = [
  { key: "strategy", label: "STRATEGY", score: QUADRANT_SCORES.strategy, systems: ["Operations", "Marketing", "Sales"] },
  { key: "leadership", label: "LEADERSHIP", score: QUADRANT_SCORES.leadership, systems: ["Finance", "Technology", "Knowledge"] },
  { key: "culture", label: "CULTURE", score: QUADRANT_SCORES.culture, systems: ["Talent", "Alignment", "Support"] },
  { key: "brand", label: "BRAND", score: QUADRANT_SCORES.brand, systems: ["Innovation", "Research", "Product"] },
];

export default function CommandCenterPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [viewMode, setViewMode] = useState<"education" | "score">("education");
  const [activeTab, setActiveTab] = useState<"dashboard" | "map">("dashboard");
  const [showTierDefs, setShowTierDefs] = useState(false);
  const [isFirstLogin] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  const bg2 = isDark ? "hsl(0 0% 8%)" : "hsl(210 20% 98%)";
  const bg3 = isDark ? "hsl(0 0% 10%)" : "hsl(210 12% 93%)";
  const border = isDark ? "hsl(0 0% 15%)" : "hsl(214 18% 83%)";
  const border2 = isDark ? "hsl(0 0% 20%)" : "hsl(214 14% 75%)";
  const text1 = isDark ? "#fff" : "#1a1a1a";
  const text2 = isDark ? "hsl(0 0% 63%)" : "hsl(215 10% 40%)";
  const text3 = isDark ? "hsl(0 0% 50%)" : "hsl(215 8% 55%)";
  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const gold = "#c9a227";
  const green = "#5fcc00";

  const score = COMPANY_SCORES.exitReadiness;
  const scoreColor = specColorAt(score, isDark);
  const isEducation = viewMode === "education";

  return (
    <div style={{ fontFamily: font, position: "relative" }}>
      {/* PAGE HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontFamily: font, fontWeight: 900, fontSize: 18, letterSpacing: 1.5, textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>
          <span style={{ color: text1 }}>360° ORG </span>
          <span style={{ color: gold }}>AI TRANSFORMATION</span>
          <span style={{ color: text1 }}> MAP</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Education / My Score toggle */}
          <div style={{ display: "flex", gap: 0 }}>
            {(["education", "score"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  fontFamily: font, fontSize: 9, fontWeight: 700, letterSpacing: 1,
                  textTransform: "uppercase", color: viewMode === mode ? gold : text4,
                  background: "none", border: "none", cursor: "pointer",
                  padding: "6px 12px", borderBottom: viewMode === mode ? `2px solid ${gold}` : "2px solid transparent",
                  borderRadius: 0, transition: "all 150ms",
                }}
              >
                {mode === "education" ? "EDUCATION" : "MY SCORE"}
              </button>
            ))}
          </div>
          <button
            style={{
              fontFamily: font, fontSize: 10, fontWeight: 800,
              backgroundColor: gold, color: "#000", border: "none",
              borderRadius: 2, padding: "6px 14px", cursor: "pointer",
              letterSpacing: 1,
            }}
          >
            START HERE!
          </button>
          <HelpButton helpId="command-center" />
        </div>
      </div>

      {/* EXIT READINESS BAR */}
      <div style={{ marginBottom: 16, padding: 16, backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: text3 }}>EXIT READINESS</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: scoreColor, opacity: isEducation ? 0.35 : 1, transition: "opacity 300ms" }}>
              {formatScore(score)}
            </span>
            {isEducation ? (
              <span style={{ fontSize: 8, fontWeight: 700, color: text4, letterSpacing: 1 }}>SAMPLE SCORE</span>
            ) : (
              <>
                <span style={{ fontSize: 10, fontWeight: 700, color: scoreColor }}>{COMPANY_SCORES.exitLabel}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: green }}>+{formatScore(COMPANY_SCORES.quarterDelta)} this quarter</span>
              </>
            )}
          </div>
          <button
            onClick={() => setShowTierDefs(!showTierDefs)}
            style={{
              fontFamily: font, fontSize: 8, color: text4, background: "none",
              border: "none", cursor: "pointer", padding: 0, letterSpacing: 0.5,
            }}
          >
            TIER DEFINITIONS {showTierDefs ? "▴" : "▾"}
          </button>
        </div>

        {/* Spectrum bar */}
        <div style={{ position: "relative", marginBottom: 6 }}>
          <div style={{
            width: "100%", height: 6, borderRadius: 9999,
            background: "linear-gradient(90deg, #4f0200, #6e231f, #873025, #a44f24, #ba702a, #c0933b, #e2e200, #cff200, #8ccc00, #5fcc00)",
          }}>
            <div style={{
              position: "absolute", left: `${score}%`, top: -3,
              width: 0, height: 0,
              borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
              borderBottom: `7px solid ${isDark ? "#fff" : "#222"}`,
              transform: "translateX(-5px)",
            }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {TIERS.map((t, i) => (
            <span key={i} style={{ fontSize: 6, fontWeight: 600, color: text4, letterSpacing: 0.5, textAlign: "center", flex: 1 }}>
              {t.label}
            </span>
          ))}
        </div>

        {/* Tier definitions panel */}
        {showTierDefs && (
          <div style={{
            marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10,
          }}>
            {TIERS.map((t, i) => (
              <div key={i} style={{
                backgroundColor: bg3, border: `1px solid ${border}`, borderRadius: 2,
                padding: "10px 12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: t.color }} />
                  <span style={{ fontSize: 8, fontWeight: 800, color: text2, letterSpacing: 1.5 }}>{t.label}</span>
                </div>
                <span style={{ fontSize: 7, fontWeight: 600, color: text4, letterSpacing: 0.5 }}>{t.range}</span>
                <p style={{ fontSize: 8, color: text3, lineHeight: 1.5, margin: "4px 0 0" }}>{t.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, marginBottom: 16 }}>
        {(["dashboard", "map"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontFamily: font, fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
              textTransform: "uppercase",
              color: activeTab === tab ? gold : text4,
              background: "none", border: "none", borderRadius: 0,
              borderBottom: activeTab === tab ? `2px solid ${gold}` : "2px solid transparent",
              padding: "8px 16px", cursor: "pointer", transition: "all 150ms",
            }}
          >
            {tab === "dashboard" ? "DASHBOARD" : "INTELLIGENCE MAP"}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "dashboard" ? (
        <WidgetGrid />
      ) : (
        <IntelligenceMapTab isDark={isDark} theme={{ bg2, bg3, border, border2, text1, text2, text3, text4, gold, green, scoreColor }} />
      )}

      {/* PRESENTATION MODE BAR */}
      <div style={{
        position: "sticky", bottom: 0, left: 0, right: 0, height: 32,
        backgroundColor: bg3, borderTop: `1px solid ${border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", fontFamily: font, zIndex: 80,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
          </svg>
          <span style={{ fontSize: 8, fontWeight: 800, color: text4, letterSpacing: 1.5 }}>PRESENTATION MODE</span>
        </div>
        <span style={{ fontSize: 7, color: text4, letterSpacing: 0.5 }}>BUILD YOUR EXECUTIVE BRIEFING</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={{ ...pmBtnStyle, border: `1px solid ${border}`, color: text2 }}>AI SUGGEST</button>
          <button style={{ ...pmBtnStyle, border: `1px solid ${gold}`, color: gold }}>GENERATE BRIEFING</button>
          <button style={{ ...pmBtnStyle, backgroundColor: gold, color: "#000", border: "none" }}>PRESENT →</button>
        </div>
      </div>

      {/* FIRST LOGIN OVERLAY */}
      {isFirstLogin && showOverlay && (
        <FirstLoginOverlay
          isDark={isDark}
          onClose={() => setShowOverlay(false)}
          theme={{ bg2, bg3, border, border2, text1, text2, text3, text4, gold, green }}
        />
      )}
    </div>
  );
}

const pmBtnStyle: React.CSSProperties = {
  fontFamily: "'Gotham', 'Montserrat', system-ui, sans-serif",
  fontSize: 8, fontWeight: 800, letterSpacing: 1,
  padding: "4px 10px", borderRadius: 2, cursor: "pointer",
  background: "none", textTransform: "uppercase",
};

// ── Intelligence Map Tab ──
function IntelligenceMapTab({ isDark, theme }: { isDark: boolean; theme: Record<string, string> }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [outerActive, setOuterActive] = useState<string | null>(null);
  const [viewMode] = useState<"education" | "score">("score");

  const handleWheelClick = (id: string | null) => {
    setActiveId(id);
    setOuterActive(null);
  };
  const handleOuterClick = (id: string | null) => {
    setOuterActive(id);
    setActiveId(id);
  };

  // Combine wheel + outer for panel display
  const panelActiveId = activeId || outerActive;

  return (
    <div style={{ display: "flex", gap: 16, fontFamily: font }}>
      {/* Left: Quadrant panel */}
      <IntelligenceMapLeftPanel
        dark={isDark}
        theme={theme as any}
        activeId={panelActiveId}
        viewMode={viewMode}
        onSegmentClick={(id) => { setActiveId(id); setOuterActive(null); }}
      />

      {/* Center: 360° Wheel */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <GestaltWheelEmbed
          dark={isDark}
          viewMode={viewMode}
          wheelActive={activeId}
          outerActive={outerActive}
          onWheelClick={handleWheelClick}
          onOuterClick={handleOuterClick}
          gestaltScore={COMPANY_SCORES.gestaltScore}
        />
      </div>

      {/* Right: Segment detail panel */}
      <IntelligenceMapRightPanel
        dark={isDark}
        theme={theme as any}
        activeId={panelActiveId}
      />
    </div>
  );
}

// ── First Login Overlay ──
function FirstLoginOverlay({
  isDark,
  onClose,
  theme,
}: {
  isDark: boolean;
  onClose: () => void;
  theme: Record<string, string>;
}) {
  const isAgency = (CURRENT_USER as any).role === "AGENCY";
  const steps = ONBOARDING_STEPS;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 400,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: font,
      }}
    >
      <div style={{
        backgroundColor: theme.bg2,
        border: `2px solid ${theme.gold}`, borderRadius: 2,
        padding: 48, maxWidth: 680, width: "90vw",
        position: "relative",
      }}>
        {/* Demo mode toggle (Agency only) */}
        {isAgency && (
          <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 7, fontWeight: 700, color: theme.text4, letterSpacing: 1 }}>DEMO MODE</span>
            <div style={{
              width: 28, height: 14, borderRadius: 7, backgroundColor: theme.border,
              cursor: "pointer", position: "relative",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%", backgroundColor: theme.gold,
                position: "absolute", top: 2, left: 2,
                transition: "left 150ms",
              }} />
            </div>
          </div>
        )}

        {/* Welcome header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 8, fontWeight: 800, color: theme.gold, letterSpacing: 2, display: "block", marginBottom: 8 }}>
            WELCOME TO GESTALT
          </span>
          <span style={{ fontSize: 28, fontWeight: 900, color: theme.text1, display: "block", marginBottom: 24 }}>
            {(CURRENT_USER as any).company}
          </span>

          {/* Three score blocks */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
            {[
              { label: "B.A.S.E.", sublabel: "Brand & Strategy Engine" },
              { label: "H.I.V.E.", sublabel: "Human Insight Valuation Engine" },
              { label: "S.U.M.", sublabel: "Strategic Unified Messaging" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: theme.text4, display: "block" }}>--</span>
                <span style={{ fontSize: 8, fontWeight: 800, color: theme.text3, letterSpacing: 1.5, display: "block" }}>{s.label}</span>
                <span style={{ fontSize: 6, color: theme.text4, display: "block" }}>{s.sublabel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding timeline */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginBottom: 24 }}>
          {steps.map((step, i) => {
            const dotColor = step.status === "done" ? theme.green : step.status === "active" ? theme.gold : theme.border;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    backgroundColor: dotColor, margin: "0 auto 4px",
                  }} />
                  <span style={{ fontSize: 6, fontWeight: 700, color: step.status === "active" ? theme.gold : theme.text4, letterSpacing: 0.5 }}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 24, height: 1, backgroundColor: theme.border, margin: "0 2px", marginBottom: 12 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Video placeholder */}
        <div style={{
          width: "100%", maxWidth: 560, height: 315, margin: "0 auto 24px",
          backgroundColor: theme.bg3, border: `1px solid ${theme.border}`, borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>

        {/* CTA button */}
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "12px", fontFamily: font, fontSize: 10, fontWeight: 800,
            backgroundColor: theme.gold, color: "#000", border: "none",
            borderRadius: 2, cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          START YOUR FRAMEWORK ASSESSMENT →
        </button>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onClose}
            style={{
              fontFamily: font, fontSize: 8, color: theme.text4, background: "none",
              border: "none", cursor: "pointer", padding: "4px 8px",
            }}
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
