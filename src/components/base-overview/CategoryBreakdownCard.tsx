import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  score: number;
  trend: number; // positive = up, negative = down, 0 = no change
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-lime-400";
  if (score >= 40) return "text-warning";
  return "text-red";
}

function getBarColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-lime-400";
  if (score >= 40) return "bg-warning";
  return "bg-red";
}

export function CategoryBreakdownCard({ name, score, trend }: CategoryCardProps) {
  return (
    <div className="bg-muted border border-border p-5 hover:border-gold/50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold tracking-[2px] text-foreground-secondary uppercase">
          {name}
        </span>
        {/* Trend Indicator */}
        <div className="flex items-center gap-1">
          {trend > 0 && (
            <>
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-[11px] text-success">+{trend}</span>
            </>
          )}
          {trend < 0 && (
            <>
              <TrendingDown className="w-3 h-3 text-red" />
              <span className="text-[11px] text-red">{trend}</span>
            </>
          )}
          {trend === 0 && (
            <>
              <Minus className="w-3 h-3 text-foreground-muted" />
              <span className="text-[11px] text-foreground-muted">—</span>
            </>
          )}
        </div>
      </div>

      {/* Score */}
      <div className={`text-[28px] font-semibold mb-3 ${getScoreColor(score)}`}>
        {score}%
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-card mb-4">
        <div
          className={`h-full ${getBarColor(score)} transition-all duration-300`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* View Details Link */}
      <button className="flex items-center gap-1 text-[12px] text-gold hover:text-gold/80 transition-colors">
        View Details
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
