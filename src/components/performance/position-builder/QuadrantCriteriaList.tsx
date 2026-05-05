import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Quadrant } from "@/lib/position-builder-types";
import { QUADRANT_COLORS } from "@/lib/position-builder-types";

interface QuadrantCriteriaListProps {
  quadrants: Record<Quadrant["id"], Quadrant>;
  activeQuadrantId: Quadrant["id"] | null;
  onRemoveCriteria?: (quadrantId: Quadrant["id"], criteriaId: string) => void;
  patientLabel?: string;
  staffLabel?: string;
}

const MAX_CRITERIA_PER_QUADRANT = 5;

export function QuadrantCriteriaList({
  quadrants,
  activeQuadrantId,
  onRemoveCriteria,
  patientLabel = "PATIENT",
  staffLabel = "STAFF",
}: QuadrantCriteriaListProps) {
  const quadrantIds: Quadrant["id"][] = ["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"];

  const getDisplayTitle = (qId: Quadrant["id"]) => {
    if (qId === "PATIENT") return patientLabel;
    if (qId === "STAFF") return staffLabel;
    return qId;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quadrantIds.map((qId) => {
        const quadrant = quadrants[qId];
        const colors = QUADRANT_COLORS[qId];
        const isActive = activeQuadrantId === qId;
        const criteriaCount = quadrant.criteria.length;
        const isFull = criteriaCount >= MAX_CRITERIA_PER_QUADRANT;

        return (
          <div
            key={qId}
            className={cn(
              "rounded-lg border p-4 transition-all",
              isActive ? `${colors.border} ${colors.bg}` : "border-border bg-card/30"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className={cn("text-xs font-semibold tracking-wide flex items-center gap-2", colors.text)}>
                <span
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    qId === "PERSONAL" && "bg-white border border-muted-foreground/30",
                    qId === "PATIENT" && "bg-orange-500",
                    qId === "STAFF" && "bg-yellow-500",
                    qId === "KNOWLEDGE" && "bg-blue-500"
                  )}
                />
                {getDisplayTitle(qId)}
              </h4>
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                isFull ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"
              )}>
                {criteriaCount}/{MAX_CRITERIA_PER_QUADRANT}
              </span>
            </div>

            <div className="space-y-2">
              {quadrant.criteria.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No criteria added yet</p>
              ) : (
                quadrant.criteria.map((criteria) => (
                  <div
                    key={criteria.id}
                    className={cn(
                      "flex items-center justify-between gap-2 px-2 py-1.5 rounded text-sm",
                      isActive ? `${colors.bg} ${colors.text}` : "bg-card/50 text-foreground/80"
                    )}
                  >
                    <span className="truncate">{criteria.label}</span>
                    {onRemoveCriteria && (
                      <button
                        onClick={() => onRemoveCriteria(qId, criteria.id)}
                        className="shrink-0 p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { MAX_CRITERIA_PER_QUADRANT };
