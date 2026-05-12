import { useMemo } from "react";

interface SparkChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  threshold?: number;
  showThreshold?: boolean;
}

export function SparkChart({
  data,
  width = 80,
  height = 24,
  color = "hsl(var(--gold))",
  threshold = 3000,
  showThreshold = true,
}: SparkChartProps) {
  const { path, thresholdY, max } = useMemo(() => {
    if (data.length === 0) return { path: "", thresholdY: 0, max: 0 };

    const maxValue = Math.max(...data, threshold);
    const minValue = 0;
    const range = maxValue - minValue || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${x},${y}`;
    });

    const thresholdY = height - ((threshold - minValue) / range) * height;

    return {
      path: `M${points.join(" L")}`,
      thresholdY,
      max: maxValue,
    };
  }, [data, width, height, threshold]);

  if (data.length === 0) {
    return (
      <div 
        className="bg-muted/50 flex items-center justify-center"
        style={{ width, height }}
      >
        <span className="text-[8px] text-foreground-muted">No data</span>
      </div>
    );
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Threshold line */}
      {showThreshold && (
        <line
          x1={0}
          y1={thresholdY}
          x2={width}
          y2={thresholdY}
          stroke="hsl(var(--red))"
          strokeWidth={1}
          strokeDasharray="2,2"
          opacity={0.5}
        />
      )}
      {/* Data line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Data points */}
      {data.map((value, index) => {
        const x = (index / (data.length - 1 || 1)) * width;
        const maxValue = Math.max(...data, threshold);
        const y = height - (value / maxValue) * height;
        const isAboveThreshold = value > threshold;
        
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={2}
            fill={isAboveThreshold ? "hsl(var(--red))" : color}
          />
        );
      })}
    </svg>
  );
}
