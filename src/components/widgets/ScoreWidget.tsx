import * as React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Widget, WidgetSize } from "./Widget";
import { cn } from "@/lib/utils";

// Spectrum color thresholds
const getSpectrumColor = (percentage: number): string => {
  if (percentage <= 20) return "#5d1414";
  if (percentage <= 40) return "#8b2020";
  if (percentage <= 60) return "#c45c00";
  if (percentage <= 75) return "#c9a227";
  if (percentage <= 90) return "#5a8a3a";
  return "#78b956";
};

export interface ScoreWidgetProps {
  title: string;
  score: number;
  maxScore: number;
  status: string;
  statusColor: string;
  trend?: number;
  lastUpdated?: string;
  size?: "small" | "medium";
  icon?: React.ReactNode;
  className?: string;
}

export function ScoreWidget({
  title,
  score,
  maxScore,
  status,
  statusColor,
  trend = 0,
  lastUpdated,
  size = "medium",
  icon,
  className,
}: ScoreWidgetProps) {
  const widgetSize: WidgetSize = size === "small" ? "small" : "medium";
  const percentage = Math.round((score / maxScore) * 100);
  const barColor = getSpectrumColor(percentage);

  // Trend colors
  const trendColor = trend > 0 ? "#78b956" : trend < 0 ? "#8b2020" : "var(--content-text3)";

  return (
    <Widget
      title={title}
      icon={icon}
      size={widgetSize}
      className={className}
      footer={lastUpdated && <span>Last updated: {lastUpdated}</span>}
    >
      <div className="flex flex-col h-full items-center">
        {/* Score Display - Centered */}
        <div className="flex items-baseline justify-center gap-1 mb-3">
          <span
            className={cn("font-bold leading-none")}
            style={{
              fontSize: size === "small" ? "32px" : "48px",
              color: "#c9a227",
              fontWeight: 700,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: "24px",
              color: "var(--content-text3)",
            }}
          >
            /{maxScore}
          </span>
        </div>

        {/* Status Badge - Centered */}
        <div
          className="uppercase text-center"
          style={{
            backgroundColor: `${statusColor}26`,
            color: statusColor,
            fontSize: "11px",
            letterSpacing: "0.1em",
            fontWeight: 600,
            padding: "6px 14px",
          }}
        >
          {status}
        </div>

        {/* Progress Bar - Medium size only */}
        {size === "medium" && (
          <div className="w-full mt-auto">
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-2"
                style={{ backgroundColor: "var(--content-bar-track)" }}
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--content-text2)",
                }}
              >
                {percentage}%
              </span>
            </div>

            {/* Trend - Medium size only */}
            {trend !== 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <span
                  className="flex items-center gap-1"
                  style={{
                    fontSize: "13px",
                    color: trendColor,
                  }}
                >
                  {trend > 0 ? (
                    <>+{trend} <ArrowUp className="w-3.5 h-3.5" /></>
                  ) : trend < 0 ? (
                    <>{trend} <ArrowDown className="w-3.5 h-3.5" /></>
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                </span>
                <span style={{ fontSize: "13px", color: "var(--content-text3)" }}>
                  from last assessment
                </span>
              </div>
            )}

            {trend === 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <span style={{ fontSize: "13px", color: "var(--content-text3)" }}>—</span>
                <span style={{ fontSize: "13px", color: "var(--content-text3)" }}>
                  from last assessment
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Widget>
  );
}

ScoreWidget.displayName = "ScoreWidget";
