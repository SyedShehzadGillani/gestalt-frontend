import { ChevronRight } from "lucide-react";
import { CategoryBreakdownCard } from "./CategoryBreakdownCard";
import { QuickActionsRow } from "./QuickActionsRow";
import { AssessmentHistoryTable } from "./AssessmentHistoryTable";
import { FrameworkCTABanner } from "./FrameworkCTABanner";

interface BASEOverviewPageProps {
  clientName: string;
  score: number;
  onNavigate?: (itemId: string) => void;
}

const mockCategoryScores = [
  { name: "PERCEPTION", score: 78, trend: 3 },
  { name: "CLARITY", score: 85, trend: 5 },
  { name: "IDENTITY", score: 72, trend: -2 },
  { name: "CULTURE", score: 88, trend: 0 },
];

function getStatusLabel(score: number): { label: string; color: string } {
  if (score >= 91) return { label: "EXIT READY", color: "bg-emerald-500/20 text-emerald-400" };
  if (score >= 76) return { label: "EXIT POSSIBLE", color: "bg-success-dim text-success" };
  if (score >= 61) return { label: "MARKET VULNERABLE", color: "bg-lime-500/20 text-lime-400" };
  if (score >= 41) return { label: "DISRUPTION IMMINENT", color: "bg-warning-dim text-warning" };
  if (score >= 21) return { label: "EXIT UNLIKELY", color: "bg-warning-dim text-warning" };
  return { label: "LIQUIDATION", color: "bg-red-dim text-red" };
}

export function BASEOverviewPage({ clientName, score, onNavigate }: BASEOverviewPageProps) {
  const status = getStatusLabel(score);

  const handleStartAssessment = () => {
    if (onNavigate) {
      onNavigate("framework");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-foreground-muted mb-4">
        <span className="hover:text-foreground cursor-pointer transition-colors">
          {clientName}
        </span>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-foreground cursor-pointer transition-colors">
          B.A.S.E.
        </span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Overview</span>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-foreground">
          Brand Assessment Overview
        </h1>
        <p className="text-[13px] text-foreground-secondary">
          Comprehensive view of brand health metrics
        </p>
      </div>

      {/* Framework CTA Banner */}
      <FrameworkCTABanner 
        onStartAssessment={handleStartAssessment}
        lastAssessmentDate="January 20, 2026"
      />

      {/* Score Summary */}
      <div className="bg-card border border-border p-6 md:p-8 text-center">
        <div className="text-[72px] md:text-[96px] font-bold text-gold leading-none mb-2">
          {score}
        </div>
        <div className="text-[12px] font-bold tracking-[2px] text-foreground-secondary uppercase mb-3">
          B.A.S.E. SCORE
        </div>
        <span className={`inline-block text-[10px] font-bold tracking-[1px] px-3 py-1.5 ${status.color}`}>
          {status.label}
        </span>
        <div className="text-[12px] text-foreground-secondary mt-4">
          Last assessed: January 20, 2026
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-6">
        {mockCategoryScores.map((category) => (
          <CategoryBreakdownCard key={category.name} {...category} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActionsRow onNavigate={onNavigate} />

      {/* Assessment History */}
      <AssessmentHistoryTable />
    </div>
  );
}
