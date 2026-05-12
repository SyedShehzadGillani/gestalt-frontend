import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { HELP_CONTENT, MOCK_TUTORIALS } from "@/data/mockData.js";
import { useTheme } from "@/hooks/use-theme";
import { AIFeedback } from "@/components/ai-feedback/AIFeedback";

interface HelpPanelProps {
  helpId: string;
  open: boolean;
  onClose: () => void;
}

export function HelpPanel({ helpId, open, onClose }: HelpPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const panelRef = useRef<HTMLDivElement>(null);

  const content = (HELP_CONTENT as Record<string, any>)[helpId];
  const tutorials = (MOCK_TUTORIALS as any[]).filter(
    (t) => t.helpId === helpId && t.published === true
  );

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    setTimeout(() => window.addEventListener("mousedown", handler), 10);
    return () => window.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const bg2 = isDark ? 'hsl(0 0% 8%)' : 'hsl(210 20% 98%)';
  const bg3 = isDark ? 'hsl(0 0% 10%)' : 'hsl(210 12% 93%)';
  const borderColor = isDark ? 'hsl(0 0% 15%)' : 'hsl(214 18% 83%)';
  const text2 = isDark ? 'hsl(0 0% 63%)' : 'hsl(215 10% 40%)';
  const text4 = isDark ? 'hsl(0 0% 40%)' : 'hsl(215 8% 55%)';
  const textPrimary = isDark ? '#fff' : 'hsl(215 25% 15%)';
  const gold = '#c9a227';
  const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: 52,
        right: 0,
        bottom: 36,
        width: 320,
        zIndex: 150,
        backgroundColor: bg2,
        borderLeft: `1px solid ${borderColor}`,
        boxShadow: '-4px 0 20px rgba(0,0,0,0.25)',
        borderRadius: 0,
        transform: open ? 'translateX(0)' : 'translateX(320px)',
        transition: 'transform 250ms ease',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: font,
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 30,
          padding: '0 14px',
          backgroundColor: bg3,
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: gold,
            fontFamily: font,
          }}
        >
          {content?.title || 'HELP'}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X
            style={{ width: 12, height: 12, color: text4 }}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {content && (
          <>
            {/* WHY THIS MATTERS */}
            <div>
              <div
                style={{
                  fontSize: 7,
                  fontWeight: 800,
                  color: gold,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontFamily: font,
                }}
              >
                WHY THIS MATTERS
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: text2,
                  lineHeight: 1.75,
                  margin: 0,
                  fontFamily: font,
                  fontWeight: 400,
                }}
              >
                {content.body}
              </p>
            </div>

            {/* THE RESEARCH BEHIND THIS */}
            <div>
              <div
                style={{
                  fontSize: 7,
                  fontWeight: 800,
                  color: gold,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontFamily: font,
                }}
              >
                THE RESEARCH BEHIND THIS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {content.citations.map((cite: string, i: number) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: gold,
                        flexShrink: 0,
                        marginTop: 3,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 8,
                        color: text4,
                        fontStyle: 'italic',
                        fontFamily: font,
                        fontWeight: 400,
                        lineHeight: 1.5,
                      }}
                    >
                      {cite}
                    </span>
                  </div>
                ))}
              </div>
              <AIFeedback responseId={`help-${helpId}`} moduleContext="help-panel" sentenceCount={4} />
            </div>

            {/* TUTORIAL VIDEOS */}
            <div>
              <div
                style={{
                  fontSize: 7,
                  fontWeight: 800,
                  color: gold,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontFamily: font,
                }}
              >
                TUTORIAL VIDEOS
              </div>
              {tutorials.length === 0 ? (
                <p
                  style={{
                    fontSize: 10,
                    color: text4,
                    fontStyle: 'italic',
                    margin: 0,
                    fontFamily: font,
                  }}
                >
                  Tutorial videos coming soon.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {tutorials.map((video) => (
                    <div
                      key={video.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      {/* Thumbnail placeholder */}
                      <div
                        style={{
                          width: 48,
                          height: 27,
                          backgroundColor: isDark ? 'hsl(0 0% 15%)' : 'hsl(214 18% 83%)',
                          borderRadius: 2,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            color: textPrimary,
                            fontFamily: font,
                            lineHeight: 1.3,
                          }}
                        >
                          {video.title}
                        </div>
                        <div
                          style={{
                            fontSize: 8,
                            color: text4,
                            fontFamily: font,
                            marginTop: 1,
                          }}
                        >
                          {video.duration}
                        </div>
                      </div>
                      <button
                        style={{
                          fontSize: 7,
                          fontWeight: 800,
                          letterSpacing: 1,
                          color: gold,
                          border: `1px solid ${gold}`,
                          borderRadius: 2,
                          backgroundColor: 'transparent',
                          padding: '2px 6px',
                          cursor: 'pointer',
                          fontFamily: font,
                          textTransform: 'uppercase',
                          flexShrink: 0,
                        }}
                      >
                        WATCH
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: `1px solid ${borderColor}`,
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: 7,
            color: text4,
            fontStyle: 'italic',
            margin: 0,
            fontFamily: font,
            fontWeight: 400,
          }}
        >
          Tutorial videos are for guidance only. Download is not permitted.
        </p>
      </div>
    </div>
  );
}
