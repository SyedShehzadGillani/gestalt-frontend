import { useState, useCallback, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { WidgetContainer } from "./WidgetContainer";
import { DailyRoutineWidget } from "./DailyRoutineWidget";
import { AIWidgetBuilder } from "./AIWidgetBuilder";
import { specColorAt } from "@/lib/specColorAt";
import { formatScore } from "@/lib/formatScore";
import {
  COMPANY_SCORES,
  VALUATION_DRAIN_DATA,
  DEFAULT_WIDGET_LAYOUTS,
  CURRENT_USER,
} from "@/data/mockData.js";

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

type WidgetSize = "small" | "medium" | "large" | "full";

function PlaceholderWidget({ type }: { type: string }) {
  return (
    <div style={{ fontFamily: font, fontSize: 11, color: "var(--content-text3)", textAlign: "center", padding: 10 }}>
      {type.replace(/-/g, " ").toUpperCase()} — coming soon
    </div>
  );
}

const WIDGET_LIBRARY = [
  { type: "daily-routine", label: "DAILY ROUTINES", desc: "AI-prioritized task list", size: "medium" },
  { type: "exit-equation", label: "EXIT EQUATION™", desc: "Valuation calculator", size: "medium" },
  { type: "hive-flight-risk", label: "H.I.V.E. FLIGHT RISK", desc: "Employee risk signals", size: "small" },
  { type: "certified-progress", label: "CERTIFIED PROGRESS", desc: "Badge requirements", size: "small" },
  { type: "focus-blindspots", label: "FOCUS BLIND SPOTS", desc: "Gap analysis", size: "medium" },
  { type: "formula-progress", label: "FORMULA PROGRESS", desc: "Strategy completion", size: "small" },
  { type: "valuation-history", label: "VALUATION HISTORY", desc: "Score over time", size: "medium" },
  { type: "core-confidence", label: "C.O.R.E. CONFIDENCE", desc: "Readiness level", size: "small" },
  { type: "story-engine", label: "STORY ENGINE", desc: "Submitted ideas", size: "small" },
  { type: "formula-status", label: "FORMULA STATUS", desc: "Step completion", size: "small" },
];

const sizeToColSpan: Record<string, number> = {
  small: 3,
  medium: 6,
  large: 9,
  full: 12,
};

// ── Combined Anchor: GESTALT SCORE + EXIT EQUATION™ ──
function GestaltExitAnchor({ isDark }: { isDark: boolean }) {
  const score = COMPANY_SCORES.gestaltScore;
  const scoreColor = specColorAt(score, isDark);
  const text2 = isDark ? "hsl(0 0% 80%)" : "hsl(215 10% 35%)";
  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const [showTiers, setShowTiers] = useState(false);

  const tiers = [
    { name: "LIQUIDATION", range: "0–16", desc: "No viable path to exit. Business is failing or has no transferable value." },
    { name: "EXIT UNLIKELY", range: "17–33", desc: "Critical deficiencies across strategy, people, and brand make any transaction improbable." },
    { name: "DISRUPTION IMMINENT", range: "34–50", desc: "Severe gaps that leave the business exposed to market disruption or forced sale." },
    { name: "MARKET VULNERABLE", range: "51–66", desc: "Foundational strength exists but meaningful gaps remain before a buyer pays a premium multiple." },
    { name: "EXIT POSSIBLE", range: "67–83", desc: "Strong foundation across most dimensions. Targeted improvements unlock premium valuation." },
    { name: "EXIT READY", range: "84–100", desc: "Comprehensive readiness across all dimensions. Business commands premium multiples." },
  ];

  const activeTierIdx = Math.min(Math.floor(score / 16.7), 5);

  return (
    <WidgetContainer title="GESTALT SCORE + EXIT EQUATION™" isAnchor helpId="widget-gestalt-score">
      <div style={{ display: "flex", gap: 32 }}>
        {/* LEFT COLUMN */}
        <div style={{ flex: "0 0 200px", display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: font, fontSize: 56, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
            {formatScore(score)}
          </span>
          <span style={{ fontFamily: font, fontSize: 9, fontWeight: 800, color: scoreColor, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 6 }}>
            {COMPANY_SCORES.exitLabel}
          </span>
          <span style={{ fontFamily: font, fontSize: 9, fontWeight: 700, color: "#5fcc00", marginTop: 4 }}>
            +{formatScore(COMPANY_SCORES.quarterDelta)} this quarter
          </span>
          <span style={{ fontFamily: font, fontSize: 7, color: text4, marginTop: 8, lineHeight: 1.5 }}>
            C.O.R.E. (Collaborative Organization Readiness Engine) CONFIDENCE: {COMPANY_SCORES.coreConfidence}
          </span>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: font, fontSize: 10, color: text2, lineHeight: 1.7, marginBottom: 16 }}>
            Foundational strength exists but meaningful gaps remain before a buyer pays a premium multiple.
          </span>

          {/* Spectrum bar */}
          <div style={{ width: "100%", position: "relative" }}>
            <div style={{
              width: "100%", height: 8, borderRadius: 9999,
              background: "linear-gradient(90deg, #4f0200, #873025, #ba702a, #c0933b, #cff200, #5fcc00)",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", left: `${score}%`, top: -4,
                width: 0, height: 0,
                borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                borderTop: "8px solid #fff",
                transform: "translateX(-5px)",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
              }} />
            </div>

            {/* Tier labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              {tiers.map((t, i) => (
                <span key={i} style={{
                  fontFamily: font, fontSize: 7, fontWeight: i === activeTierIdx ? 900 : 700,
                  color: i === activeTierIdx ? specColorAt(score, isDark) : text4,
                  textTransform: "uppercase", textAlign: "center", flex: 1, letterSpacing: 0.3,
                }}>
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          {/* Tier definitions toggle */}
          <button
            onClick={() => setShowTiers(!showTiers)}
            style={{
              fontFamily: font, fontSize: 8, color: text4, background: "none",
              border: "none", cursor: "pointer", padding: 0, marginTop: 8,
              textAlign: "left",
            }}
          >
            TIER DEFINITIONS {showTiers ? "▴" : "▾"}
          </button>

          {showTiers && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8 }}>
              {tiers.map((t, i) => (
                <div key={i} style={{
                  padding: "6px 8px",
                  border: `1px solid ${i === activeTierIdx ? scoreColor : (isDark ? "hsl(0 0% 15%)" : "hsl(214 18% 83%)")}`,
                  borderRadius: 2,
                }}>
                  <div style={{
                    fontFamily: font, fontSize: 7, fontWeight: 800, letterSpacing: 1,
                    color: i === activeTierIdx ? scoreColor : text4,
                    textTransform: "uppercase", marginBottom: 2,
                  }}>
                    {t.name} ({t.range})
                  </div>
                  <div style={{ fontFamily: font, fontSize: 7, color: text4, lineHeight: 1.4 }}>
                    {t.desc}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WidgetContainer>
  );
}

// ── Anchor: VALUATION DRAIN ───────────────────────
function ValuationDrainAnchor() {
  const gold = "#c9a227";
  const red = "#873025";
  const text4Dark = "hsl(0 0% 40%)";

  return (
    <WidgetContainer title="VALUATION DRAIN™" isAnchor helpId="widget-valuation-drain">
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: text4Dark, textTransform: "uppercase" }}>
          YOUR VALUATION DRAIN IS
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontFamily: font, fontSize: 32, fontWeight: 900, color: red }}>
            ${VALUATION_DRAIN_DATA.dailyCost.toLocaleString()}
          </span>
          <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: red }}>
            /day
          </span>
        </div>
        <span style={{ fontFamily: font, fontSize: 11, fontWeight: 500, color: text4Dark }}>
          ${VALUATION_DRAIN_DATA.annualCost.toLocaleString()} annual cost of inaction
        </span>
        <button style={{ fontFamily: font, fontSize: 11, fontWeight: 800, color: gold, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", letterSpacing: 1, marginTop: 4 }}>
          TAKE ACTION →
        </button>
      </div>
    </WidgetContainer>
  );
}

// ── Widget Library Drawer ─────────────────────────
function WidgetLibraryDrawer({
  open, onClose, onAdd, isDark, onOpenBuilder,
}: {
  open: boolean; onClose: () => void; onAdd: (type: string) => void; isDark: boolean; onOpenBuilder?: () => void;
}) {
  const bg2 = isDark ? "hsl(0 0% 8%)" : "hsl(210 20% 98%)";
  const bg3 = isDark ? "hsl(0 0% 10%)" : "hsl(210 12% 93%)";
  const border = isDark ? "hsl(0 0% 15%)" : "hsl(214 18% 83%)";
  const text2 = isDark ? "hsl(0 0% 63%)" : "hsl(215 10% 40%)";
  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const gold = "#c9a227";

  return (
    <div style={{
      position: "fixed", top: 52, right: 0, bottom: 36, width: 280, zIndex: 200,
      backgroundColor: bg2, borderLeft: `1px solid ${border}`,
      boxShadow: "-4px 0 20px rgba(0,0,0,0.25)", borderRadius: 0,
      transform: open ? "translateX(0)" : "translateX(280px)",
      transition: "transform 250ms ease",
      display: "flex", flexDirection: "column", fontFamily: font,
    }}>
      <div style={{ height: 30, padding: "0 14px", backgroundColor: bg3, borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: gold }}>WIDGET LIBRARY</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
          <X style={{ width: 12, height: 12, color: text4 }} strokeWidth={1.5} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {WIDGET_LIBRARY.map((w) => (
          <button key={w.type} onClick={() => onAdd(w.type)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
            backgroundColor: bg3, border: `1px solid ${border}`, borderRadius: 2,
            cursor: "pointer", textAlign: "left", width: "100%",
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: text2, letterSpacing: 0.5 }}>{w.label}</div>
              <div style={{ fontSize: 9, color: text4 }}>{w.desc}</div>
            </div>
            <Plus style={{ width: 12, height: 12, color: gold, marginLeft: "auto", flexShrink: 0 }} strokeWidth={1.5} />
          </button>
        ))}
        <button onClick={() => { onClose(); onOpenBuilder?.(); }} style={{
          width: "100%", padding: "10px", border: `2px dashed ${gold}`, borderRadius: 2,
          backgroundColor: "transparent", cursor: "pointer", fontFamily: font,
          fontSize: 11, fontWeight: 800, color: gold, letterSpacing: 1.5,
          textTransform: "uppercase", marginTop: 4,
        }}>
          + BUILD A CUSTOM WIDGET
        </button>
      </div>
    </div>
  );
}

// ── MAIN WIDGET GRID ──────────────────────────────
export function WidgetGrid() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const segment = (CURRENT_USER as any).segment || "BO";
  const defaultLayout = (DEFAULT_WIDGET_LAYOUTS as any)[segment] || [];

  const [widgets, setWidgets] = useState<any[]>(defaultLayout);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);

  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const gold = "#c9a227";

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w: any) => w.id !== id));
  }, []);

  const addWidget = useCallback((type: string) => {
    const lib = WIDGET_LIBRARY.find((w) => w.type === type);
    if (!lib) return;
    const id = `${type}-${Date.now()}`;
    setWidgets((prev) => [...prev, { id, type, size: lib.size, helpId: "" }]);
  }, []);

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setWidgets((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  return (
    <div style={{ fontFamily: font, padding: 0 }}>
      <div style={{ padding: "0 0 8px 0" }}>
        <span style={{ fontFamily: font, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: text4 }}>
          EXIT INTELLIGENCE OVERVIEW
        </span>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 2 }}>
          <GestaltExitAnchor isDark={isDark} />
        </div>
        <div style={{ flex: 1 }}>
          <ValuationDrainAnchor />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button onClick={() => setDrawerOpen(true)} style={{
          fontFamily: font, fontSize: 11, fontWeight: 700, color: gold,
          backgroundColor: "transparent", border: `1px solid ${gold}`, borderRadius: 2,
          padding: "5px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, letterSpacing: 1,
        }}>
          <Plus style={{ width: 12, height: 12 }} strokeWidth={1.5} />
          ADD WIDGET
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
        {widgets.map((w: any, idx: number) => (
          <div
            key={w.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            style={{
              gridColumn: `span ${sizeToColSpan[w.size] || 6}`,
              minHeight: 140,
              opacity: dragIdx === idx ? 0.5 : 1,
              transition: "opacity 150ms",
            }}
          >
            {w.type === "daily-routine" ? (
              <DailyRoutineWidget />
            ) : (
              <WidgetContainer
                title={w.type === "custom" && w.spec ? w.spec.title : w.type.replace(/-/g, " ")}
                size={w.size}
                isCustom={!!w.isCustom}
                helpId={w.helpId}
                onRemove={() => removeWidget(w.id)}
              >
                {w.type === "custom" && w.spec ? (
                  <div style={{ fontFamily: font, fontSize: 11, color: isDark ? "hsl(0 0% 63%)" : "hsl(215 10% 40%)", lineHeight: 1.6 }}>
                    {w.spec.insight}
                  </div>
                ) : (
                  <PlaceholderWidget type={w.type} />
                )}
              </WidgetContainer>
            )}
          </div>
        ))}
      </div>

      <WidgetLibraryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={(type) => { addWidget(type); setDrawerOpen(false); }}
        isDark={isDark}
        onOpenBuilder={() => setBuilderOpen(true)}
      />

      <AIWidgetBuilder
        isOpen={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onSave={(widget) => { setWidgets((prev) => [...prev, widget]); }}
      />
    </div>
  );
}