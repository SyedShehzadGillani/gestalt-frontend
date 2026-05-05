import { ChevronDown, ChevronUp, Pencil, Sparkles, Wand2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CollapsibleSectionHeaderProps {
  title: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onEdit?: () => void;
  onAIEnhance?: () => void;
  onAIClarity?: () => void;
  onVersionHistory?: () => void;
  isEnhancing?: boolean;
  isClarifying?: boolean;
  versionCount?: number;
  className?: string;
  variant?: "default" | "subsection";
}

export function CollapsibleSectionHeader({
  title,
  isCollapsed,
  onToggleCollapse,
  onEdit,
  onAIEnhance,
  onAIClarity,
  onVersionHistory,
  isEnhancing = false,
  isClarifying = false,
  versionCount = 0,
  className,
  variant = "default",
}: CollapsibleSectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between w-full group", className)}>
      {/* Title */}
      <h5
        className={cn(
          variant === "default"
            ? "text-sm font-semibold text-foreground uppercase tracking-wide"
            : "text-sm font-medium text-foreground"
        )}
      >
        {title}
      </h5>

      {/* Action icons */}
      <div className="flex items-center gap-0.5">
        <TooltipProvider delayDuration={300}>
          {/* 1. Edit (Manual customization) */}
          {onEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Edit Section</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* 2. AI Enhancement */}
          {onAIEnhance && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity",
                    isEnhancing && "opacity-100 animate-pulse"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAIEnhance();
                  }}
                  disabled={isEnhancing}
                >
                  <Sparkles
                    className={cn(
                      "h-3.5 w-3.5",
                      isEnhancing ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">AI Enhance</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* 3. AI Clarity (Simplify/Clarify content) */}
          {onAIClarity && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity",
                    isClarifying && "opacity-100 animate-pulse"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAIClarity();
                  }}
                  disabled={isClarifying}
                >
                  <Wand2
                    className={cn(
                      "h-3.5 w-3.5",
                      isClarifying ? "text-accent-foreground" : "text-muted-foreground"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">AI Clarity</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* 4. Version History */}
          {onVersionHistory && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVersionHistory();
                  }}
                >
                  <div className="relative">
                    <History className="h-3.5 w-3.5 text-muted-foreground" />
                    {versionCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 text-[8px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        {versionCount > 9 ? "9+" : versionCount}
                      </span>
                    )}
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Version History ({versionCount})</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* 5. Collapse/Expand - Far Right */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCollapse();
                }}
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{isCollapsed ? "Expand" : "Collapse"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
