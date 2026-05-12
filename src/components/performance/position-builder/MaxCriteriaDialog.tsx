import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Quadrant, QuadrantCriteria } from "@/lib/position-builder-types";
import { QUADRANT_COLORS } from "@/lib/position-builder-types";
import { HiveFloatingPanel } from "./HiveFloatingPanel";

interface MaxCriteriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quadrantId: Quadrant["id"];
  attemptedTag: string;
  currentCriteria: QuadrantCriteria[];
  onRemoveCriteria: (criteriaId: string) => void;
  onAIRecommend: () => void;
  patientLabel?: string;
  staffLabel?: string;
}

export function MaxCriteriaDialog({
  open,
  onOpenChange,
  quadrantId,
  attemptedTag,
  currentCriteria,
  onRemoveCriteria,
  onAIRecommend,
  patientLabel = "PATIENT",
  staffLabel = "STAFF",
}: MaxCriteriaDialogProps) {
  const colors = QUADRANT_COLORS[quadrantId];
  
  const getDisplayTitle = () => {
    if (quadrantId === "PATIENT") return patientLabel;
    if (quadrantId === "STAFF") return staffLabel;
    return quadrantId;
  };

  const handleRemoveAndClose = (criteriaId: string) => {
    onRemoveCriteria(criteriaId);
    onOpenChange(false);
  };

  const handleAIRecommend = () => {
    onAIRecommend();
    onOpenChange(false);
  };

  return (
    <HiveFloatingPanel
      open={open}
      onClose={() => onOpenChange(false)}
      quadrantId={quadrantId}
      title="HIVE"
      subtitle="Maximum Reached"
      patientLabel={patientLabel}
      staffLabel={staffLabel}
      
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={handleAIRecommend}
          >
            <Sparkles className="h-4 w-4" />
            HIVE Recommends New 5
          </Button>
        </div>
      }
    >
      {/* Header info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-3 h-3 rounded-full",
              quadrantId === "PERSONAL" && "bg-white border border-muted-foreground/30",
              quadrantId === "PATIENT" && "bg-orange-500",
              quadrantId === "STAFF" && "bg-yellow-500",
              quadrantId === "KNOWLEDGE" && "bg-blue-500"
            )}
          />
          <span className="font-semibold text-sm">
            Maximum 5 Characteristics Allowed
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          The <strong className={colors.text}>{getDisplayTitle()}</strong> quadrant already has 5 characteristics. 
          To add <strong>"{attemptedTag}"</strong>, remove one below:
        </p>
      </div>
      
      {/* Current criteria list */}
      <div className="space-y-1.5">
        {currentCriteria.map((criteria) => (
          <div
            key={criteria.id}
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2 rounded-[2pt] border",
              colors.border,
              colors.bg
            )}
          >
            <span className={cn("text-sm font-medium", colors.text)}>
              {criteria.label}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleRemoveAndClose(criteria.id)}
              title={`Remove ${criteria.label}`}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </HiveFloatingPanel>
  );
}
