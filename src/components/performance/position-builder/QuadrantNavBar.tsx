import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Quadrant } from "@/lib/position-builder-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuadrantNavBarProps {
  activeQuadrantId: Quadrant["id"] | null;
  onSelectQuadrant: (id: Quadrant["id"]) => void;
  patientLabel: string;
  staffLabel: string;
  onPatientLabelChange: (label: string) => void;
  onStaffLabelChange: (label: string) => void;
  positionName: string;
  onPositionPrev: () => void;
  onPositionNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const PATIENT_OPTIONS = ["PATIENT", "CUSTOMER", "CLIENT", "ORGANIZATION"];
const STAFF_OPTIONS = ["STAFF", "TEAM"];
const QUADRANT_IDS: Quadrant["id"][] = ["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"];

export function QuadrantNavBar({
  activeQuadrantId,
  onSelectQuadrant,
  patientLabel,
  staffLabel,
  onPatientLabelChange,
  onStaffLabelChange,
  positionName,
  onPositionPrev,
  onPositionNext,
  canGoPrev,
  canGoNext,
}: QuadrantNavBarProps) {
  const getDisplayTitle = (qId: Quadrant["id"]) => {
    if (qId === "PATIENT") return patientLabel;
    if (qId === "STAFF") return staffLabel;
    return qId;
  };

  const hasDropdown = (qId: Quadrant["id"]) => qId === "PATIENT" || qId === "STAFF";
  
  const getDropdownOptions = (qId: Quadrant["id"]) => {
    if (qId === "PATIENT") return PATIENT_OPTIONS;
    if (qId === "STAFF") return STAFF_OPTIONS;
    return [];
  };

  const handleLabelChange = (qId: Quadrant["id"], label: string) => {
    if (qId === "PATIENT") onPatientLabelChange(label);
    if (qId === "STAFF") onStaffLabelChange(label);
  };

  const getQuadrantStyle = (qId: Quadrant["id"], isActive: boolean) => {
    const baseStyle = "h-9 flex items-center px-4 font-semibold text-sm tracking-wide cursor-pointer transition-all rounded-[2px]";
    
    const colors: Record<Quadrant["id"], string> = {
      PERSONAL: "bg-white text-black",
      PATIENT: "bg-orange-400 text-black",
      STAFF: "bg-yellow-400 text-black",
      KNOWLEDGE: "bg-indigo-500 text-indigo-950",
    };
    
    return cn(
      baseStyle,
      colors[qId],
      !isActive && "opacity-75"
    );
  };

  const navHeight = "h-9"; // Consistent height for all elements

  return (
    <div className="flex items-stretch gap-2">
      {/* Position Navigation - takes fixed width for position name */}
      <div className="flex items-stretch gap-1.5 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPositionPrev}
          disabled={!canGoPrev}
          className={cn(navHeight, "w-8 text-muted-foreground hover:text-foreground")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className={cn(navHeight, "px-5 flex items-center bg-slate-800 rounded-[2px] border border-slate-600 text-xs font-semibold text-white min-w-[130px] justify-center tracking-wide")}>
          {positionName}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPositionNext}
          disabled={!canGoNext}
          className={cn(navHeight, "w-8 text-muted-foreground hover:text-foreground")}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Quadrant Tabs - scaled to 90% width */}
      <div className="grid grid-cols-4 gap-2" style={{ width: '90%' }}>
        {QUADRANT_IDS.map((qId) => {
          const isActive = activeQuadrantId === qId;
          const showDropdown = hasDropdown(qId);
          const options = getDropdownOptions(qId);
          const currentLabel = getDisplayTitle(qId);

          const tabContent = (
            <div
              onClick={() => !showDropdown && onSelectQuadrant(qId)}
              className={getQuadrantStyle(qId, isActive)}
            >
              <span className="w-5 shrink-0" />
              <span className="flex-1 text-center tracking-[0.12em]">{currentLabel}</span>
              {showDropdown ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <span className="w-5 shrink-0" />
              )}
            </div>
          );

          if (showDropdown) {
            return (
              <div key={qId} className="h-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="h-full w-full">
                    {tabContent}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="min-w-[260px] bg-slate-800 border-0">
                    {options.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => {
                          handleLabelChange(qId, option);
                          onSelectQuadrant(qId);
                        }}
                        className={cn(
                          "cursor-pointer justify-center text-center",
                          qId === "PATIENT" && "hover:bg-orange-500/50 hover:text-black focus:bg-orange-500/50 focus:text-black",
                          qId === "STAFF" && "hover:bg-yellow-500/50 hover:text-black focus:bg-yellow-500/50 focus:text-black",
                          currentLabel === option && (qId === "PATIENT" ? "bg-orange-500 text-black" : "bg-yellow-500 text-black")
                        )}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          }

          return (
            <div key={qId} onClick={() => onSelectQuadrant(qId)} className="h-full">
              {tabContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
