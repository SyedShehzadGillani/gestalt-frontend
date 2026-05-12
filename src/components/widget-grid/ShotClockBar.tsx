import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

interface ShotClockTask {
  id: string;
  title: string;
  estimatedMinutes: number | null;
}

interface ShotClockBarProps {
  task: ShotClockTask | null;
  seconds: number;
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
  onDone: () => void;
  onCarryForward: () => void;
  onNeedMoreTime: () => void;
}

export function ShotClockBar({
  task,
  seconds,
  paused,
  onPause,
  onResume,
  onDone,
  onCarryForward,
  onNeedMoreTime,
}: ShotClockBarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bg = isDark ? "#0d0d0d" : "#e8e7e2";
  const border = isDark ? "hsl(0 0% 15%)" : "hsl(214 18% 83%)";
  const text1 = isDark ? "#fff" : "#1a1a1a";
  const text2 = isDark ? "hsl(0 0% 63%)" : "hsl(215 10% 40%)";
  const text4 = isDark ? "hsl(0 0% 40%)" : "hsl(215 8% 55%)";
  const gold = "#c9a227";
  const red = "#873025";
  const green = "#5fcc00";

  const estimatedSeconds = task?.estimatedMinutes ? task.estimatedMinutes * 60 : 0;
  const progress = estimatedSeconds > 0 ? Math.min(seconds / estimatedSeconds, 1) : 0;
  const isAt75 = progress >= 0.75 && progress < 1;
  const isOvertime = progress >= 1;

  // Timer color interpolation
  const timerColor = (() => {
    if (isOvertime) return red;
    if (progress <= 0.75) return gold;
    // Interpolate gold→red in last 25%
    const t = (progress - 0.75) / 0.25;
    return interpolateColor(gold, red, t);
  })();

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const truncatedTitle = task
    ? task.title.length > 40
      ? task.title.slice(0, 40) + "…"
      : task.title
    : "";

  if (!task) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 36,
          left: 0,
          right: 0,
          height: 36,
          zIndex: 90,
          backgroundColor: bg,
          borderTop: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: font,
          fontSize: 7,
          color: text4,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        SHOT CLOCK — Click START on any task to begin.
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 36,
        left: 0,
        right: 0,
        height: 36,
        zIndex: 90,
        backgroundColor: bg,
        borderTop: isOvertime ? `2px solid ${red}` : `1px solid ${border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 16,
        fontFamily: font,
        borderRadius: 0,
        animation: isAt75 ? "goldPulseBar 1.5s ease-in-out infinite" : undefined,
      }}
    >
      {/* Task name */}
      <span style={{ fontSize: 9, fontWeight: 700, color: text2, whiteSpace: "nowrap", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 300 }}>
        {truncatedTitle}
      </span>

      {/* Center: Timer or overtime buttons */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {isOvertime ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onNeedMoreTime} style={{ ...btnStyle, border: `1px solid ${gold}`, color: gold }}>NEED MORE TIME</button>
            <button onClick={onCarryForward} style={{ ...btnStyle, border: `1px solid ${text4}`, color: text4 }}>CARRY FORWARD</button>
            <button onClick={onDone} style={{ ...btnStyle, backgroundColor: green, color: "#000", border: "none" }}>DONE</button>
          </div>
        ) : (
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: timerColor, fontVariantNumeric: "tabular-nums" }}>
              {formatTime(seconds)}
            </span>
            {/* Progress bar */}
            <div style={{ position: "absolute", bottom: -4, left: 0, right: 0, height: 2, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", borderRadius: 0 }}>
              <div style={{ width: `${progress * 100}%`, height: "100%", backgroundColor: timerColor, transition: "width 1s linear" }} />
            </div>
          </div>
        )}
      </div>

      {/* Right: Action buttons */}
      {!isOvertime && (
        <div style={{ display: "flex", gap: 6 }}>
          {/* Pause/Resume */}
          <button
            onClick={paused ? onResume : onPause}
            style={iconBtnStyle}
            onMouseEnter={(e) => { (e.currentTarget.querySelector("svg") as SVGElement).style.stroke = text1; }}
            onMouseLeave={(e) => { (e.currentTarget.querySelector("svg") as SVGElement).style.stroke = text4; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {paused
                ? <path d="M5 3l14 9-14 9V3z" />
                : <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              }
            </svg>
          </button>
          {/* Done */}
          <button
            onClick={onDone}
            style={iconBtnStyle}
            onMouseEnter={(e) => { (e.currentTarget.querySelector("svg") as SVGElement).style.stroke = green; }}
            onMouseLeave={(e) => { (e.currentTarget.querySelector("svg") as SVGElement).style.stroke = text4; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </button>
          {/* Carry Forward */}
          <button
            onClick={onCarryForward}
            style={iconBtnStyle}
            onMouseEnter={(e) => { (e.currentTarget.querySelector("svg") as SVGElement).style.stroke = gold; }}
            onMouseLeave={(e) => { (e.currentTarget.querySelector("svg") as SVGElement).style.stroke = text4; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <style>{`
        @keyframes goldPulseBar {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,162,39,0); }
          50% { box-shadow: 0 0 12px 2px rgba(201,162,39,0.3); }
        }
      `}</style>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 2,
  border: "none",
  background: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

const btnStyle: React.CSSProperties = {
  fontFamily: "'Gotham', 'Montserrat', system-ui, sans-serif",
  fontSize: 8,
  fontWeight: 800,
  letterSpacing: 1,
  padding: "4px 10px",
  borderRadius: 2,
  cursor: "pointer",
  background: "none",
  textTransform: "uppercase",
};

function interpolateColor(c1: string, c2: string, t: number): string {
  const hex = (s: string) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
  const [r1, g1, b1] = hex(c1);
  const [r2, g2, b2] = hex(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}
