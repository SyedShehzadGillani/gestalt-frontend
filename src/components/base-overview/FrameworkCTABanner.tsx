import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FrameworkCTABannerProps {
  onStartAssessment: () => void;
  lastAssessmentDate?: string;
}

export function FrameworkCTABanner({ onStartAssessment, lastAssessmentDate }: FrameworkCTABannerProps) {
  const daysSinceLastAssessment = lastAssessmentDate ? 7 : null; // Mock calculation

  return (
    <div className="relative p-[1px] bg-gradient-to-r from-gold/50 via-gold to-gold/50 mb-6">
      <div className="bg-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <div className="w-14 h-14 bg-gold-dim flex items-center justify-center flex-shrink-0">
            <Target className="w-7 h-7 text-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[16px] md:text-[18px] font-semibold text-foreground">
                FRAMEWORK — 21-PT Assessment
              </h3>
              {daysSinceLastAssessment && daysSinceLastAssessment > 30 && (
                <span className="text-[9px] font-bold tracking-[1px] bg-warning-dim text-warning px-2 py-0.5">
                  OVERDUE
                </span>
              )}
            </div>
            <p className="text-[13px] text-foreground-muted">
              Measure your brand's exit potential with our comprehensive 21-point assessment.
              {lastAssessmentDate && (
                <span className="text-foreground-secondary ml-2">
                  Last taken: {lastAssessmentDate}
                </span>
              )}
            </p>
          </div>
        </div>
        <Button
          onClick={onStartAssessment}
          className="w-full md:w-auto gap-2 bg-gold text-primary-foreground hover:bg-gold/90 h-12 px-6"
        >
          Start Assessment
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
