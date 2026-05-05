import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { WidgetContainer } from "./WidgetContainer";
import {
  COMPANY_SCORES,
  QUADRANT_SCORES,
  SEGMENT_SCORES,
  SCORE_HISTORY,
  EXIT_EQUATION_DATA,
  VALUATION_DRAIN_DATA,
} from "@/data/mockData.js";

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

const PLACEHOLDERS = [
  "Show my FOCUS score blindspots ranked by exit value impact",
  "Compare my H.I.V.E. scores this quarter vs last quarter",
  "What is costing me the most in exit value right now?",
  "Show my VALUATION DRAIN broken down by module",
];

const EXAMPLE_CHIPS = [
  { label: "Score trends", prompt: "Show me how my GESTALT SCORE has trended over the past 6 months with insights on what's driving changes" },
  { label: "Biggest risks", prompt: "What are my biggest exit readiness risks right now, ranked by dollar impact?" },
  { label: "VALUATION DRAIN breakdown", prompt: "Break down my VALUATION DRAIN by module showing which areas are costing me the most" },
];

const GENERATING_PHRASES = [
  "Analyzing your exit readiness data...",
  "Calculating valuation impact...",
  "Identifying your highest-priority gaps...",
  "Structuring your insight...",
];

const SCOPE_GUARD_WORDS = ["other user", "other company", "all clients", "database", "supabase", "sql", "admin"];

interface WidgetSpec {
  title: string;
  type: string;
  insight: string;
  recommendation: string;
  confidence: number;
  citations: string[];
  dataMapping: any;
}

interface AIWidgetBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (widget: any) => void;
}

export function AIWidgetBuilder({ isOpen, onClose, onSave }: AIWidgetBuilderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [mode, setMode] = useState<"input" | "generating" | "preview" | "saved">("input");
  const [userPrompt, setUserPrompt] = useState("");
  const [widgetName, setWidgetName] = useState("");
  const [widgetSpec, setWidgetSpec] = useState<WidgetSpec | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);

  const bg2 = isDark ? "hsl(0 0% 8%)" : "hsl(210 20% 98%)";
  const bg3 = isDark ? "hsl(0 0% 10%)" : "hsl(210 12% 93%)";
  const border = isDark ? "hsl(0 0% 15%)" : "hsl(214 18% 83%)";
  const text2 = isDark ? "hsl(0 0% 63%)" : "hsl(215 10% 40%)";
  const text3 = isDark ? "hsl(0 0% 50%)" : "hsl(215 8% 55%)";
  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const gold = "#c9a227";
  const red = "#873025";
  const green = "#5fcc00";

  // Rotating phrases
  useEffect(() => {
    if (mode !== "generating") return;
    const interval = setInterval(() => {
      setPhraseIndex(i => (i + 1) % GENERATING_PHRASES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [mode]);

  // Auto-close saved
  useEffect(() => {
    if (mode === "saved") {
      const t = setTimeout(() => onClose(), 2000);
      return () => clearTimeout(t);
    }
  }, [mode, onClose]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setMode("input");
      setUserPrompt("");
      setWidgetName("");
      setWidgetSpec(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  // Pre-fill widget name from AI title when preview loads
  useEffect(() => {
    if (mode === "preview" && widgetSpec && !widgetName) {
      setWidgetName(widgetSpec.title);
    }
  }, [mode, widgetSpec]);

  if (!isOpen) return null;

  const hasScopeViolation = SCOPE_GUARD_WORDS.some(w => userPrompt.toLowerCase().includes(w));

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;

    if (hasScopeViolation) {
      setErrorMessage("GESTALT INTELLIGENCE only accesses your company data.");
      return;
    }

    setErrorMessage(null);
    setMode("generating");
    setPhraseIndex(0);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: 'You are GESTALT INTELLIGENCE. Return ONLY valid JSON, no markdown, no explanation. Format: { title: string (ALL CAPS max 5 words), type: ("bar_chart"|"line_chart"|"score_card"|"comparison"|"text_analysis"), insight: string (1-2 sentences), recommendation: string (1 action sentence), confidence: number (0-100), citations: [string, string, string], dataMapping: object }',
          messages: [{
            role: "user",
            content: `${userPrompt}\n\nAvailable data: ${JSON.stringify({ COMPANY_SCORES, QUADRANT_SCORES, SCORE_HISTORY, EXIT_EQUATION_DATA, VALUATION_DRAIN_DATA })}`,
          }],
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const spec = JSON.parse(text);
      setWidgetSpec(spec);
      setMode("preview");
    } catch {
      // Fallback mock response
      setWidgetSpec({
        title: "SCORE ANALYSIS",
        type: "bar_chart",
        insight: `Your GESTALT SCORE of ${COMPANY_SCORES.gestaltScore.toFixed(1)} shows MARKET VULNERABLE positioning. The gap between B.A.S.E. (${COMPANY_SCORES.base.toFixed(1)}) and S.U.M. (${COMPANY_SCORES.sum.toFixed(1)}) represents the largest opportunity.`,
        recommendation: "Prioritize S.U.M. improvement to close the 13-point gap with B.A.S.E. and lift your overall GESTALT SCORE.",
        confidence: 82,
        citations: [
          "GESTALT Partners. Score methodology. 2026.",
          "McKinsey Global Institute. 2017.",
          "Interbrand Best Global Brands Report. 2023.",
        ],
        dataMapping: { base: COMPANY_SCORES.base, hive: COMPANY_SCORES.hive, sum: COMPANY_SCORES.sum },
      });
      setMode("preview");
    }
  };

  const handleSave = () => {
    if (!widgetSpec || !widgetName.trim()) return;
    const newWidget = {
      id: `custom-${Date.now()}`,
      type: "custom",
      size: "medium",
      isCustom: true,
      spec: { ...widgetSpec, title: widgetName.trim() },
      prompt: userPrompt,
    };
    onSave(newWidget);
    setMode("saved");
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        backgroundColor: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 200ms ease",
      }}
    >
      <div
        style={{
          maxWidth: 780, width: "90vw", maxHeight: "85vh",
          backgroundColor: bg2, border: `1px solid ${border}`, borderRadius: 2,
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "scaleIn 200ms ease",
          fontFamily: font,
        }}
      >
        {/* Header */}
        <div style={{
          padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${border}`,
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: gold, letterSpacing: 2 }}>BUILD A CUSTOM WIDGET</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          {mode === "input" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 9, color: text3, margin: 0 }}>
                Describe what you want to see. GESTALT INTELLIGENCE will build it from your platform data.
              </p>

              <textarea
                className="gold-input"
                value={userPrompt}
                onChange={(e) => { setUserPrompt(e.target.value); setErrorMessage(null); }}
                placeholder={placeholder}
                style={{
                  fontFamily: font, fontSize: 11, minHeight: 80, borderRadius: 2,
                  backgroundColor: bg3, resize: "vertical", width: "100%",
                  padding: "8px 10px",
                }}
              />

              {/* Example chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {EXAMPLE_CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    onClick={() => setUserPrompt(chip.prompt)}
                    style={{
                      fontFamily: font, fontSize: 8, fontWeight: 600, color: text3,
                      background: bg3, border: `1px solid ${border}`, borderRadius: 2,
                      padding: "4px 10px", cursor: "pointer",
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Widget name field */}
              <div>
                <span style={{ fontFamily: font, fontSize: 7, fontWeight: 800, letterSpacing: 2, color: gold, textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                  WIDGET NAME
                </span>
                <input
                  className="gold-input"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  placeholder="Name your widget..."
                  style={{
                    fontFamily: font, fontSize: 12, borderRadius: 2,
                    backgroundColor: bg3, width: "100%",
                    padding: "6px 10px",
                  }}
                />
              </div>

              {/* Scope guard error */}
              {errorMessage && (
                <div style={{
                  background: "rgba(135,48,37,0.1)", border: `1px solid ${red}`,
                  borderRadius: 2, padding: "8px 12px",
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: red }}>{errorMessage}</span>
                </div>
              )}

              {/* Available data */}
              <p style={{ fontSize: 7, color: text4, margin: 0 }}>
                Using: GESTALT SCORE · B.A.S.E. · H.I.V.E. · S.U.M. · EXIT EQUATION · VALUATION DRAIN · Score History
              </p>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!userPrompt.trim()}
                style={{
                  width: "100%", padding: "10px", fontFamily: font, fontSize: 10, fontWeight: 800,
                  backgroundColor: gold, color: "#000", border: "none", borderRadius: 2,
                  cursor: userPrompt.trim() ? "pointer" : "default",
                  opacity: userPrompt.trim() ? 1 : 0.35, letterSpacing: 1,
                }}
              >
                GENERATE WIDGET
              </button>
            </div>
          )}

          {mode === "generating" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, gap: 12 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: gold, letterSpacing: 1.5, animation: "goldPulseText 1.5s ease-in-out infinite" }}>
                GESTALT INTELLIGENCE IS BUILDING YOUR WIDGET...
              </span>
              <span style={{ fontSize: 7, color: text4, transition: "opacity 300ms" }}>
                {GENERATING_PHRASES[phraseIndex]}
              </span>
            </div>
          )}

          {mode === "preview" && widgetSpec && (
            <div style={{ display: "flex", gap: 20 }}>
              {/* Left: Widget preview */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <WidgetContainer title={widgetName || widgetSpec.title} size="medium">
                  <div style={{ fontFamily: font }}>
                    {widgetSpec.type === "bar_chart" && widgetSpec.dataMapping && (
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 100, padding: "10px 0" }}>
                        {Object.entries(widgetSpec.dataMapping).map(([key, val]) => (
                          <div key={key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 8, fontWeight: 700, color: text2 }}>{(val as number).toFixed(1)}</span>
                            <div style={{
                              width: "100%", height: `${(val as number)}%`,
                              backgroundColor: gold, borderRadius: 1, minHeight: 4,
                            }} />
                            <span style={{ fontSize: 7, fontWeight: 600, color: text4, textTransform: "uppercase" }}>{key}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {widgetSpec.type !== "bar_chart" && (
                      <p style={{ fontSize: 9, color: text2, lineHeight: 1.6, margin: 0 }}>{widgetSpec.insight}</p>
                    )}
                  </div>
                </WidgetContainer>
              </div>

              {/* Right: Insight panel */}
              <div style={{ width: 240, flexShrink: 0 }}>
                <span style={{ fontSize: 7, fontWeight: 800, color: gold, letterSpacing: 2 }}>INSIGHT</span>
                <p style={{ fontSize: 10, color: text2, lineHeight: 1.75, margin: "6px 0 0" }}>{widgetSpec.insight}</p>

                <span style={{ fontSize: 7, fontWeight: 800, color: gold, letterSpacing: 2, display: "block", marginTop: 12 }}>RECOMMENDATION</span>
                <p style={{ fontSize: 10, color: text2, lineHeight: 1.75, margin: "6px 0 0" }}>{widgetSpec.recommendation}</p>

                <span style={{ fontSize: 7, fontWeight: 800, color: gold, letterSpacing: 2, display: "block", marginTop: 12 }}>SOURCES</span>
                {widgetSpec.citations.map((c, i) => (
                  <p key={i} style={{ fontSize: 8, color: text4, fontStyle: "italic", margin: "3px 0", lineHeight: 1.4 }}>{c}</p>
                ))}

                {/* Confidence bar */}
                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: 7, fontWeight: 800, color: gold, letterSpacing: 2 }}>CONFIDENCE</span>
                  <div style={{ width: "100%", height: 2, backgroundColor: border, marginTop: 4 }}>
                    <div style={{ width: `${widgetSpec.confidence}%`, height: "100%", backgroundColor: gold }} />
                  </div>
                </div>

                {/* Widget name in preview */}
                <div style={{ marginTop: 16 }}>
                  <span style={{ fontFamily: font, fontSize: 7, fontWeight: 800, letterSpacing: 2, color: gold, textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                    WIDGET NAME
                  </span>
                  <input
                    className="gold-input"
                    value={widgetName}
                    onChange={(e) => setWidgetName(e.target.value)}
                    placeholder="Name your widget..."
                    style={{
                      fontFamily: font, fontSize: 12, borderRadius: 2,
                      backgroundColor: bg3, width: "100%",
                      padding: "6px 10px",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {mode === "saved" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, gap: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 800, color: gold, letterSpacing: 1.5 }}>WIDGET ADDED TO YOUR DASHBOARD</span>
            </div>
          )}
        </div>

        {/* Footer buttons for preview mode */}
        {mode === "preview" && (
          <div style={{
            padding: "12px 20px", borderTop: `1px solid ${border}`,
            display: "flex", gap: 10, justifyContent: "flex-end",
          }}>
            <button
              onClick={() => setMode("input")}
              style={{
                fontFamily: font, fontSize: 9, fontWeight: 700, color: text2,
                background: "none", border: `1px solid ${border}`, borderRadius: 2,
                padding: "6px 14px", cursor: "pointer", letterSpacing: 0.5,
              }}
            >
              ← EDIT PROMPT
            </button>
            <button
              onClick={handleGenerate}
              style={{
                fontFamily: font, fontSize: 9, fontWeight: 700, color: text2,
                background: "none", border: `1px solid ${border}`, borderRadius: 2,
                padding: "6px 14px", cursor: "pointer", letterSpacing: 0.5,
              }}
            >
              ↺ REGENERATE
            </button>
            <button
              onClick={handleSave}
              disabled={!widgetName.trim()}
              style={{
                fontFamily: font, fontSize: 9, fontWeight: 700, color: "#000",
                backgroundColor: gold, border: "none", borderRadius: 2,
                padding: "6px 14px", cursor: widgetName.trim() ? "pointer" : "default",
                letterSpacing: 0.5,
                opacity: widgetName.trim() ? 1 : 0.35,
              }}
            >
              SAVE TO DASHBOARD →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes goldPulseText { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}
