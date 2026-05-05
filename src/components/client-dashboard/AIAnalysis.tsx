import { Button } from "@/components/ui/button";
import { AIFeedback } from "@/components/ai-feedback/AIFeedback";

interface AIAnalysisProps {
  date: string;
  summary: string;
  findings: string[];
}

export function AIAnalysis({ date, summary, findings }: AIAnalysisProps) {
  return (
    <div className="bg-card border border-border border-l-4 border-l-gold p-6" data-tour="ai-analysis">
      {/* Header */}
      <h3 className="text-[16px] font-semibold text-foreground mb-1">
        Latest Assessment Analysis
      </h3>
      <div className="text-[12px] text-foreground-secondary mb-4">{date}</div>

      {/* Summary */}
      <p className="text-[13px] text-foreground-muted leading-relaxed mb-4">
        {summary}
      </p>

      {/* Key Findings */}
      <div className="mb-5">
        <div className="text-[10px] font-bold tracking-[1px] text-foreground-secondary uppercase mb-2">
          Key Findings
        </div>
        <ul className="space-y-2">
          {findings.map((finding, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-[12px] text-foreground-muted"
            >
              <span className="text-gold mt-0.5">•</span>
              {finding}
            </li>
          ))}
        </ul>
      </div>

      {/* Feedback */}
      <AIFeedback responseId="ai-analysis-latest" moduleContext="ai-analysis" sentenceCount={4} />

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <Button variant="secondary" size="sm">
          View Full Report
        </Button>
        <Button
          size="sm"
          className="bg-gold text-primary-foreground hover:bg-gold/90"
        >
          Ask GESTALT INTELLIGENCE
        </Button>
      </div>
    </div>
  );
}
