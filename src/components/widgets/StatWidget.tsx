import * as React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Widget, WidgetSize } from "./Widget";

export interface StatWidgetProps {
  title: string;
  value: string | number;
  valueColor?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  size?: "small" | "medium";
  className?: string;
}

export function StatWidget({
  title,
  value,
  valueColor,
  icon,
  iconColor = "#c9a227",
  subtitle,
  trend,
  size = "medium",
  className,
}: StatWidgetProps) {
  const widgetSize: WidgetSize = size === "small" ? "small" : "medium";

  // Trend colors
  const getTrendColor = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return "#78b956";
      case "down":
        return "#8b2020";
      default:
        return "var(--content-text3)";
    }
  };

  const TrendIcon = trend?.direction === "up" 
    ? ArrowUp 
    : trend?.direction === "down" 
      ? ArrowDown 
      : Minus;

  const resolvedValueColor = valueColor || "var(--content-text1)";

  // Small size: inline layout
  if (size === "small") {
    return (
      <Widget
        title={title}
        size={widgetSize}
        className={className}
      >
        <div className="flex items-center gap-3 h-full">
          {icon && (
            <span 
              className="shrink-0 [&>svg]:w-6 [&>svg]:h-6"
              style={{ color: iconColor }}
            >
              {icon}
            </span>
          )}
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: resolvedValueColor,
              lineHeight: 1,
            }}
          >
            {value}
          </span>
          {trend && (
            <div className="flex items-center gap-1 ml-auto">
              <TrendIcon 
                className="w-3.5 h-3.5" 
                style={{ color: getTrendColor(trend.direction) }} 
              />
              <span
                style={{
                  fontSize: "13px",
                  color: getTrendColor(trend.direction),
                }}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </Widget>
    );
  }

  // Medium size: stacked layout
  return (
    <Widget
      title={title}
      size={widgetSize}
      className={className}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        {icon && (
          <span 
            className="mb-3 [&>svg]:w-8 [&>svg]:h-8"
            style={{ color: iconColor }}
          >
            {icon}
          </span>
        )}
        <span
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: resolvedValueColor,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {subtitle && (
          <div 
            className="mt-2"
            style={{ fontSize: "14px", color: "var(--content-text2)" }}
          >
            {subtitle}
          </div>
        )}
        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <TrendIcon 
              className="w-4 h-4" 
              style={{ color: getTrendColor(trend.direction) }} 
            />
            <span
              style={{
                fontSize: "13px",
                color: getTrendColor(trend.direction),
              }}
            >
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </Widget>
  );
}

StatWidget.displayName = "StatWidget";
