import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Quadrant } from "@/lib/position-builder-types";
import { QUADRANT_COLORS } from "@/lib/position-builder-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuadrantTabsProps {
  activeQuadrantId: Quadrant["id"] | null;
  onSelect: (id: Quadrant["id"]) => void;
  positionName?: string;
  patientLabel?: string;
  staffLabel?: string;
  onPatientLabelChange?: (label: string) => void;
  onStaffLabelChange?: (label: string) => void;
}

const PATIENT_OPTIONS = ["PATIENT", "CUSTOMER", "CLIENT", "ORGANIZATION"];
const STAFF_OPTIONS = ["STAFF", "TEAM"];

const QUADRANT_IDS: Quadrant["id"][] = ["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"];

export function QuadrantTabs({
  activeQuadrantId,
  onSelect,
  positionName = "RECEPTION",
  patientLabel = "PATIENT",
  staffLabel = "STAFF",
  onPatientLabelChange,
  onStaffLabelChange,
}: QuadrantTabsProps) {
  const getDisplayLabel = (qId: Quadrant["id"]) => {
    if (qId === "PATIENT") return patientLabel;
    if (qId === "STAFF") return staffLabel;
    return qId;
  };

  const renderQuadrantButton = (qId: Quadrant["id"]) => {
    const colors = QUADRANT_COLORS[qId];
    const isActive = activeQuadrantId === qId;
    const displayLabel = getDisplayLabel(qId);

    // Check if this quadrant has toggle options
    const hasOptions = qId === "PATIENT" || qId === "STAFF";
    const options = qId === "PATIENT" ? PATIENT_OPTIONS : qId === "STAFF" ? STAFF_OPTIONS : [];
    const onLabelChange = qId === "PATIENT" ? onPatientLabelChange : onStaffLabelChange;

    const buttonContent = (
      <button
        onClick={() => !hasOptions && onSelect(qId)}
        className={cn(
          "px-4 py-2.5 text-sm font-medium rounded transition-all flex items-center gap-2",
          isActive
            ? `${colors.bg} ${colors.text} ${colors.border} border`
            : "bg-card/30 text-muted-foreground border border-transparent hover:border-border"
        )}
      >
        <span
          className={cn(
            "inline-block w-2.5 h-2.5 rounded-full",
            qId === "PERSONAL" && "bg-white border border-muted-foreground/30",
            qId === "PATIENT" && "bg-orange-500",
            qId === "STAFF" && "bg-yellow-500",
            qId === "KNOWLEDGE" && "bg-blue-500"
          )}
        />
        {displayLabel}
        {(isActive || hasOptions) && <ChevronDown className="h-3.5 w-3.5" />}
      </button>
    );

    if (hasOptions && onLabelChange) {
      return (
        <DropdownMenu key={qId}>
          <DropdownMenuTrigger asChild>
            {buttonContent}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[140px]">
            {options.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => {
                    onLabelChange(option);
                    onSelect(qId);
                  }}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    qId === "PATIENT" && "hover:bg-orange-500/50 hover:text-black focus:bg-orange-500/50 focus:text-black",
                    qId === "STAFF" && "hover:bg-yellow-500/50 hover:text-black focus:bg-yellow-500/50 focus:text-black",
                    qId === "PATIENT" && (patientLabel === option) && "bg-orange-500 text-black",
                    qId === "STAFF" && (staffLabel === option) && "bg-yellow-500 text-black"
                  )}
                >
                <span
                  className={cn(
                    "inline-block w-2 h-2 rounded-full",
                    qId === "PATIENT" && "bg-orange-500",
                    qId === "STAFF" && "bg-yellow-500"
                  )}
                />
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div key={qId} onClick={() => onSelect(qId)} className="cursor-pointer">
        {buttonContent}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-1 bg-card/50 rounded-lg p-1 border border-border">
        <div className="px-4 py-2 text-sm font-medium text-foreground bg-card rounded">
          {positionName}
        </div>
      </div>

      <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-muted-foreground hover:text-foreground">
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-1 ml-4">
        {QUADRANT_IDS.map(renderQuadrantButton)}
      </div>
    </div>
  );
}
