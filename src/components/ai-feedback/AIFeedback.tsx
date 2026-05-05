import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

// Mock feedback store
const mockFeedback: Record<string, number> = { r001: 1 };

interface AIFeedbackProps {
  responseId: string;
  moduleContext: string;
  sentenceCount?: number;
}

export function AIFeedback({ responseId, moduleContext, sentenceCount = 4 }: AIFeedbackProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const text2 = isDark ? "hsl(0 0% 63%)" : "hsl(215 10% 40%)";

  const initial = mockFeedback[responseId] ?? null;
  const [rating, setRating] = useState<number | null>(initial);

  const handleRate = (value: number) => {
    if (rating !== null) return; // no undo
    setRating(value);
    mockFeedback[responseId] = value;
  };

  const showLabel = sentenceCount > 3;

  const thumbUpPath = "M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zm-7 11H5a2 2 0 01-2-2v-7a2 2 0 012-2h2v11z";
  const thumbDownPath = "M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zm7-13h2a2 2 0 012 2v7a2 2 0 01-2 2h-2V2z";

  const getStyle = (value: number): React.CSSProperties => {
    const isSelected = rating === value;
    const isOther = rating !== null && rating !== value;
    const strokeColor = isSelected
      ? value === 1 ? "#c9a227" : "#873025"
      : text4;
    const fillColor = isSelected
      ? value === 1 ? "rgba(201,162,39,0.15)" : "rgba(135,48,37,0.15)"
      : "none";

    return {
      width: 28,
      height: 28,
      borderRadius: 2,
      border: "none",
      background: "none",
      cursor: rating !== null ? "default" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: isOther ? 0.3 : 1,
      transition: "opacity 200ms",
      padding: 0,
      // store colors for SVG
      "--thumb-stroke": strokeColor,
      "--thumb-fill": fillColor,
    } as React.CSSProperties;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 6,
      }}
    >
      {showLabel && (
        <span
          style={{
            fontFamily: font,
            fontSize: 7.5,
            fontWeight: 600,
            color: text4,
          }}
        >
          Was this helpful?
        </span>
      )}
      <button
        onClick={() => handleRate(1)}
        style={getStyle(1)}
        onMouseEnter={(e) => {
          if (rating === null) {
            const svg = e.currentTarget.querySelector("svg");
            if (svg) svg.style.stroke = text2;
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
          }
        }}
        onMouseLeave={(e) => {
          if (rating === null) {
            const svg = e.currentTarget.querySelector("svg");
            if (svg) svg.style.stroke = text4;
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={rating === 1 ? "rgba(201,162,39,0.15)" : "none"}
          stroke={rating === 1 ? "#c9a227" : text4}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={thumbUpPath} />
        </svg>
      </button>
      <button
        onClick={() => handleRate(-1)}
        style={getStyle(-1)}
        onMouseEnter={(e) => {
          if (rating === null) {
            const svg = e.currentTarget.querySelector("svg");
            if (svg) svg.style.stroke = text2;
            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
          }
        }}
        onMouseLeave={(e) => {
          if (rating === null) {
            const svg = e.currentTarget.querySelector("svg");
            if (svg) svg.style.stroke = text4;
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={rating === -1 ? "rgba(135,48,37,0.15)" : "none"}
          stroke={rating === -1 ? "#873025" : text4}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={thumbDownPath} />
        </svg>
      </button>
    </div>
  );
}
