import { Button } from "@/components/ui/button";

interface Assessment {
  id: string;
  date: string;
  type: string;
  score: number;
  change: string;
  status: "completed" | "in-progress";
}

const mockAssessments: Assessment[] = [
  { id: "1", date: "Jan 20, 2026", type: "Framework 21-PT", score: 82, change: "+6", status: "completed" },
  { id: "2", date: "Dec 15, 2025", type: "Framework 21-PT", score: 76, change: "+4", status: "completed" },
  { id: "3", date: "Nov 1, 2025", type: "Framework 21-PT", score: 72, change: "—", status: "completed" },
];

export function AssessmentHistoryTable() {
  return (
    <div className="mt-8">
      <h3 className="text-[16px] font-semibold text-foreground mb-4">
        Assessment History
      </h3>

      <div className="border border-border">
        {/* Table Header */}
        <div className="bg-muted grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3">
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Date
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Type
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Score
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Change
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Status
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Actions
          </span>
        </div>

        {/* Table Rows */}
        {mockAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-4 border-b border-border hover:bg-card transition-colors"
          >
            {/* Date */}
            <div className="flex items-center">
              <span className="text-[13px] text-foreground">{assessment.date}</span>
            </div>

            {/* Type */}
            <div className="flex items-center">
              <span className="text-[13px] text-foreground-muted">{assessment.type}</span>
            </div>

            {/* Score */}
            <div className="flex items-center">
              <span className="text-[14px] font-semibold text-gold">{assessment.score}</span>
            </div>

            {/* Change */}
            <div className="flex items-center">
              <span
                className={`text-[13px] ${
                  assessment.change.startsWith("+")
                    ? "text-success"
                    : assessment.change === "—"
                    ? "text-foreground-muted"
                    : "text-red"
                }`}
              >
                {assessment.change}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <span className="text-[9px] font-bold tracking-[0.5px] px-2 py-1 bg-success-dim text-success">
                Completed
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center">
              <Button variant="secondary" size="sm" className="text-[11px] h-7 px-3">
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
