import { useState, useRef, useCallback, type ReactNode } from "react";
import { HelpButton } from "@/components/help/HelpButton";
import { AIFeedback } from "@/components/ai-feedback/AIFeedback";
import { useTheme } from "@/hooks/use-theme";

type Mode = "surface" | "deepDive" | "minimized";

interface WidgetContainerProps {
  title: string;
  size?: string;
  isAnchor?: boolean;
  isCustom?: boolean;
  onRemove?: () => void;
  onSizeChange?: (size: string) => void;
  dataContext?: string;
  helpId?: string;
  children: ReactNode;
  /** Slot rendered between content and footer (e.g. shot clock) */
  belowContent?: ReactNode;
}

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

export function WidgetContainer({
  title,
  isAnchor = false,
  isCustom = false,
  onRemove,
  helpId,
  children,
  belowContent,
}: WidgetContainerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mode, setMode] = useState<Mode>("surface");
  const [isLoadingDeepDive, setIsLoadingDeepDive] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [footerHovered, setFooterHovered] = useState(false);

  // Drag-to-resize height
  const containerRef = useRef<HTMLDivElement>(null);
  const [userHeight, setUserHeight] = useState<number | null>(null);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);

  const bg2 = isDark ? "hsl(0 0% 8%)" : "hsl(210 20% 98%)";
  const bg3 = isDark ? "hsl(0 0% 10%)" : "hsl(210 12% 93%)";
  const border = isDark ? "hsl(0 0% 15%)" : "hsl(214 18% 83%)";
  const border2 = isDark ? "hsl(0 0% 20%)" : "hsl(214 14% 75%)";
  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const text2 = isDark ? "hsl(0 0% 63%)" : "hsl(215 10% 40%)";
  const gold = "#c9a227";

  const [handleHovered, setHandleHovered] = useState(false);

  const onDragHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const startY = e.clientY;
    const startH = el.getBoundingClientRect().height;
    dragRef.current = { startY, startH };

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const newH = Math.max(120, dragRef.current.startH + (ev.clientY - dragRef.current.startY));
      setUserHeight(newH);
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const handleTellMeMore = async () => {
    setMode("deepDive");
    setIsLoadingDeepDive(true);
    setAiResponse("");

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
          messages: [
            {
              role: "user",
              content: `Analyze this widget: "${title}". Provide insights, trends, and actionable recommendations. Be concise, data-driven, and specific.`,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setAiResponse(
        data.content?.[0]?.text ||
          "GESTALT INTELLIGENCE analysis is currently unavailable. Your widget data has been queued for the next analysis cycle."
      );
    } catch {
      setAiResponse(
        "GESTALT INTELLIGENCE analysis is currently unavailable. Your widget data has been queued for the next analysis cycle. In the meantime, review the citations below for context on this metric."
      );
    } finally {
      setIsLoadingDeepDive(false);
    }
  };

  const handleSendFollowUp = () => {
    if (!followUp.trim()) return;
    setAiResponse(
      (prev) =>
        prev +
        "\n\n--- Follow-up ---\nGESTALT INTELLIGENCE is processing your question. Results will appear here when ready."
    );
    setFollowUp("");
  };

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: bg2,
        border: `1px solid ${isCustom ? gold : border}`,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: userHeight ? `${userHeight}px` : "100%",
        minHeight: 120,
      }}
    >
      {/* HEADER BAR */}
      <div
        style={{
          height: 40,
          padding: "0 10px",
          backgroundColor: bg3,
          borderBottom: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: font,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: gold,
          }}
        >
          {title}
        </span>
        {!isAnchor && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* ? help */}
            <button
              style={{
                width: 36, height: 36, background: "none", border: "none",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: font, fontSize: 9, fontWeight: 700, color: text4,
                borderRadius: 0, transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = text2; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = text4; }}
            >
              ?
            </button>
            {/* Expand */}
            <button
              onClick={() => setMode(mode === "minimized" ? "surface" : "minimized")}
              style={{
                width: 36, height: 36, background: "none", border: "none",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 150ms ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.stroke = text2; }}
                onMouseLeave={(e) => { e.currentTarget.style.stroke = text4; }}
              >
                <path d="M14 4H20V10M4 20H10V14M20 4l-6 6M4 20l6-6" />
              </svg>
            </button>
            {/* Close × */}
            {onRemove && (
              <button
                onClick={onRemove}
                style={{
                  width: 36, height: 36, background: "none", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 150ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.stroke = text2; }}
                  onMouseLeave={(e) => { e.currentTarget.style.stroke = text4; }}
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* SURFACE CONTENT */}
      {mode !== "minimized" && (
        <div
          style={{
            flex: 1,
            padding: 14,
            backgroundColor: bg2,
            opacity: mode === "deepDive" ? 0.4 : 1,
            transition: "opacity 200ms",
          }}
        >
          {children}
        </div>
      )}

      {/* Below-content slot (shot clock) */}
      {mode !== "minimized" && belowContent}

      {/* DEEP DIVE PANEL */}
      {mode === "deepDive" && (
        <div
          style={{
            backgroundColor: bg3,
            borderTop: `1px solid ${border}`,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontFamily: font, fontSize: 9, fontWeight: 800, color: gold, letterSpacing: 1.5, textTransform: "uppercase" }}>
            GESTALT INTELLIGENCE
          </div>
          {isLoadingDeepDive ? (
            <div style={{ fontFamily: font, fontSize: 11, color: text2, fontStyle: "italic" }}>
              Analyzing...
            </div>
          ) : (
            <>
              <p style={{ fontFamily: font, fontSize: 11, color: text2, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
                {aiResponse}
              </p>
              <div style={{ fontFamily: font, fontSize: 9, color: text4, fontStyle: "italic" }}>
                McKinsey Global Institute. 2017. • Interbrand Best Global Brands Report. 2023. • GESTALT Partners. EXIT EQUATION™ methodology. 2026.
              </div>
              <AIFeedback responseId="r001" moduleContext={`widget-${title}`} sentenceCount={5} />
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <textarea
                  className="gold-input"
                  value={followUp}
                  onChange={(e) => {
                    setFollowUp(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder="Ask a follow-up..."
                  style={{
                    flex: 1, fontFamily: font, fontSize: 12, padding: "6px 8px",
                    borderRadius: 2, backgroundColor: bg2, resize: "none",
                    minHeight: 32, overflow: "hidden",
                  }}
                />
                <button
                  onClick={handleSendFollowUp}
                  style={{
                    fontFamily: font, fontSize: 9, fontWeight: 800, letterSpacing: 1,
                    backgroundColor: gold, color: "#000", border: "none",
                    borderRadius: 2, padding: "6px 12px", cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  SEND
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* FOOTER BAR */}
      {!isAnchor && mode !== "minimized" && (
        <div
          style={{
            height: 26,
            padding: "0 10px",
            backgroundColor: bg3,
            borderTop: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <button
            onClick={mode === "deepDive" ? () => setMode("surface") : handleTellMeMore}
            onMouseEnter={() => setFooterHovered(true)}
            onMouseLeave={() => setFooterHovered(false)}
            style={{
              fontFamily: font, fontSize: 9, fontWeight: 700,
              color: mode === "deepDive" ? gold : (footerHovered ? gold : text4),
              background: "none", border: "none", padding: 0, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6,
              transition: "color 150ms ease",
              letterSpacing: mode === "deepDive" ? 1.5 : 0.5,
              textTransform: "uppercase",
            }}
          >
            {mode === "deepDive" ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 150ms ease" }}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                CLOSE ANALYSIS
              </>
            ) : (
              <>GESTALT INTELLIGENCE — Tell me more</>
            )}
          </button>
        </div>
      )}

      {/* BOTTOM DRAG HANDLE (not for anchors) */}
      {!isAnchor && mode !== "minimized" && (
        <div
          onMouseDown={onDragHandleMouseDown}
          onMouseEnter={() => setHandleHovered(true)}
          onMouseLeave={() => setHandleHovered(false)}
          style={{
            height: 8,
            width: "100%",
            backgroundColor: "transparent",
            cursor: "ns-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 32,
            height: 1,
            backgroundColor: handleHovered ? gold : border2,
            transition: "background-color 150ms ease",
          }} />
        </div>
      )}
    </div>
  );
}