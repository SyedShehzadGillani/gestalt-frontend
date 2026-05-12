import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface AssessmentHistory {
  date: string;
  score: number;
  label?: string;
}

interface TrendLineChartProps {
  history: AssessmentHistory[];
  currentScore: number;
}

export function TrendLineChart({ history, currentScore }: TrendLineChartProps) {
  // Add current assessment to history
  const dataWithCurrent = [
    ...history,
    { date: "Today", score: currentScore, label: "Current" },
  ];

  return (
    <div className="bg-card/75 border border-border p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[16px] font-semibold text-foreground mb-1">
            Assessment History
          </h3>
          <p className="text-[12px] text-foreground-muted">
            Track your brand health progress over time
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold tracking-[1px] text-foreground-secondary uppercase">
            Assessments
          </div>
          <div className="text-[20px] font-bold text-gold">{dataWithCurrent.length}</div>
        </div>
      </div>

      <div className="h-[200px] md:h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataWithCurrent} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--foreground-muted))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 21]}
              tick={{ fill: "hsl(var(--foreground-muted))", fontSize: 11 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
              ticks={[0, 7, 14, 21]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 0,
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value}/21`, "Score"]}
            />
            <ReferenceLine
              y={14}
              stroke="hsl(var(--warning))"
              strokeDasharray="5 5"
              label={{
                value: "Exit Ready",
                position: "right",
                fill: "hsl(var(--warning))",
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--gold))"
              strokeWidth={2}
              dot={{
                fill: "hsl(var(--gold))",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: "hsl(var(--gold))",
                strokeWidth: 0,
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-gold" />
          <span className="text-[11px] text-foreground-muted">Score Trend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-warning" style={{ backgroundImage: "repeating-linear-gradient(90deg, hsl(var(--warning)) 0, hsl(var(--warning)) 5px, transparent 5px, transparent 10px)" }} />
          <span className="text-[11px] text-foreground-muted">Exit Ready Threshold</span>
        </div>
      </div>
    </div>
  );
}
