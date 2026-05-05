import { Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EditableSectionHeaderProps {
  title: string;
  onEdit?: () => void;
  onAIEnhance?: () => void;
  isEnhancing?: boolean;
  className?: string;
  variant?: "default" | "subsection";
}

export function EditableSectionHeader({
  title,
  onEdit,
  onAIEnhance,
  isEnhancing = false,
  className,
  variant = "default",
}: EditableSectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between group", className)}>
      <h5
        className={cn(
          variant === "default"
            ? "text-sm font-semibold text-foreground uppercase tracking-wide"
            : "text-sm font-medium text-foreground"
        )}
      >
        {title}
      </h5>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider delayDuration={300}>
          {onAIEnhance && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6",
                    isEnhancing && "animate-pulse"
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
                <p className="text-xs">HIVE AI Enhancement</p>
              </TooltipContent>
            </Tooltip>
          )}

          {onEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Edit & Version</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    </div>
  );
}
