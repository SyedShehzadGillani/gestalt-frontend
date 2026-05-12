import * as React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Widget } from "./Widget";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartWidgetProps {
  title: string;
  icon?: React.ReactNode;
  chartType?: "line" | "bar" | "area";
  data: ChartDataPoint[];
  color?: string;
  showLegend?: boolean;
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  currentValueLabel?: string;
  comparison?: {
    value: string;
    direction: "up" | "down" | "neutral";
    text: string;
  };
  className?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  valuePrefix = "",
  valueSuffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "var(--content-elevated-bg)",
          border: "1px solid var(--content-border)",
          padding: "8px 12px",
        }}
      >
        <p style={{ fontSize: "12px", color: "var(--content-text3)", marginBottom: "4px" }}>
          {label}
        </p>
        <p style={{ fontSize: "14px", color: "var(--content-text1)", fontWeight: 600 }}>
          {valuePrefix}
          {payload[0].value.toLocaleString()}
          {valueSuffix}
        </p>
      </div>
    );
  }
  return null;
};

export function ChartWidget({
  title,
  icon,
  chartType = "line",
  data,
  color = "#c9a227",
  height = 150,
  valuePrefix = "",
  valueSuffix = "",
  currentValueLabel = "Current",
  comparison,
  className,
}: ChartWidgetProps) {
  const chartData = data.map((d) => ({
    name: d.label,
    value: d.value,
  }));

  const currentValue = data.length > 0 ? data[data.length - 1].value : 0;

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${valuePrefix}${(value / 1000000).toFixed(1)}${valueSuffix || "M"}`;
    }
    if (value >= 1000) {
      return `${valuePrefix}${(value / 1000).toFixed(1)}${valueSuffix || "K"}`;
    }
    return `${valuePrefix}${value}${valueSuffix}`;
  };

  const axisStyle = {
    fontSize: 11,
    fill: "var(--content-text3)",
  };

  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 5, left: -20, bottom: 0 },
  };

  const getComparisonColor = (direction: "up" | "down" | "neutral") => {
    switch (direction) {
      case "up":
        return "#78b956";
      case "down":
        return "#8b2020";
      default:
        return "var(--content-text3)";
    }
  };

  const gridStroke = "var(--content-border)";

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="name" axisLine={{ stroke: gridStroke }} tickLine={false} tick={axisStyle} />
            <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={(v) => formatValue(v)} />
            <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} />
            <Bar dataKey="value" fill={color} radius={0} />
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="name" axisLine={{ stroke: gridStroke }} tickLine={false} tick={axisStyle} />
            <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={(v) => formatValue(v)} />
            <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#gradient-${color.replace("#", "")})`} />
          </AreaChart>
        );

      case "line":
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="name" axisLine={{ stroke: gridStroke }} tickLine={false} tick={axisStyle} />
            <YAxis axisLine={false} tickLine={false} tick={axisStyle} tickFormatter={(v) => formatValue(v)} />
            <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, strokeWidth: 0, r: 3 }} activeDot={{ fill: color, strokeWidth: 0, r: 5 }} />
          </LineChart>
        );
    }
  };

  return (
    <Widget
      title={title}
      icon={icon}
      size="medium"
      className={className}
      footer={
        comparison ? (
          <div className="flex items-center gap-2">
            {comparison.direction === "up" && (
              <ArrowUp className="w-3.5 h-3.5" style={{ color: getComparisonColor(comparison.direction) }} />
            )}
            {comparison.direction === "down" && (
              <ArrowDown className="w-3.5 h-3.5" style={{ color: getComparisonColor(comparison.direction) }} />
            )}
            <span style={{ fontSize: "13px", color: getComparisonColor(comparison.direction) }}>
              {comparison.value}
            </span>
            <span style={{ fontSize: "13px", color: "var(--content-text3)" }}>
              {comparison.text}
            </span>
          </div>
        ) : undefined
      }
    >
      <div>
        <div className="flex justify-end mb-2">
          <div className="text-right">
            <div
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "var(--content-text1)",
                lineHeight: 1,
              }}
            >
              {formatValue(currentValue)}
            </div>
            <div style={{ fontSize: "12px", color: "var(--content-text3)", marginTop: "2px" }}>
              {currentValueLabel}
            </div>
          </div>
        </div>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </Widget>
  );
}

ChartWidget.displayName = "ChartWidget";
