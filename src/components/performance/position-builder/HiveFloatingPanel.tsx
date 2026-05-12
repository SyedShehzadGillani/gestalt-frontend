import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { X, GripHorizontal, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Quadrant } from "@/lib/position-builder-types";
import { QUADRANT_COLORS } from "@/lib/position-builder-types";

interface HiveFloatingPanelProps {
  open: boolean;
  onClose: () => void;
  quadrantId: Quadrant["id"];
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  // Version carousel props
  versionCount?: number;
  currentVersion?: number;
  onVersionChange?: (version: number) => void;
  // Custom display label for quadrant
  patientLabel?: string;
  staffLabel?: string;
  // Anchor element ref for contextual positioning
  anchorRef?: React.RefObject<HTMLElement>;
}

// Custom hook for draggable functionality with contextual initial positioning
function useDraggable(anchorRef?: React.RefObject<HTMLElement>, isOpen?: boolean) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Calculate initial position based on anchor element or fallback to center-right
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen && !position) {
      const panelWidth = 384; // w-96
      const panelHeight = 500;
      const padding = 16;

      let x: number;
      let y: number;

      if (anchorRef?.current) {
        // Position near the anchor element
        const rect = anchorRef.current.getBoundingClientRect();
        
        // Try to position to the right of the anchor, centered vertically
        x = rect.right + padding;
        y = rect.top + (rect.height / 2) - (panelHeight / 2);

        // If it would go off the right edge, position to the left of anchor
        if (x + panelWidth > window.innerWidth - padding) {
          x = rect.left - panelWidth - padding;
        }

        // If it would still go off left edge, center horizontally
        if (x < padding) {
          x = (window.innerWidth - panelWidth) / 2;
        }

        // Clamp vertical position to viewport
        y = Math.max(padding, Math.min(y, window.innerHeight - panelHeight - padding));
      } else {
        // Default: center of viewport
        x = (window.innerWidth - panelWidth) / 2;
        y = (window.innerHeight - panelHeight) / 2;
      }

      setPosition({ x, y });
    }
  }, [anchorRef, isOpen, position]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!position) return;
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      // Keep panel within viewport bounds
      const maxX = window.innerWidth - (dragRef.current?.offsetWidth || 384);
      const maxY = window.innerHeight - (dragRef.current?.offsetHeight || 400);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Reset position when panel closes (so it recalculates on next open)
  const resetPosition = useCallback(() => {
    setPosition(null);
  }, []);

  return { position, isDragging, handleMouseDown, dragRef, resetPosition };
}

export function HiveFloatingPanel({
  open,
  onClose,
  quadrantId,
  title,
  subtitle,
  children,
  footer,
  versionCount = 0,
  currentVersion = 0,
  onVersionChange,
  patientLabel = "PATIENT",
  staffLabel = "STAFF",
  anchorRef,
}: HiveFloatingPanelProps) {
  const { position, isDragging, handleMouseDown, dragRef, resetPosition } = useDraggable(anchorRef, open);
  const colors = QUADRANT_COLORS[quadrantId];

  // Reset position when panel closes so it recalculates on next open
  useEffect(() => {
    if (!open) {
      resetPosition();
    }
  }, [open, resetPosition]);

  // Prevent body scroll while panel is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  if (!open) return null;
  
  // While calculating position, show nothing briefly (will be set immediately by useEffect)
  if (!position) return null;

  return (
    <div 
      ref={dragRef}
      className={cn(
        "fixed z-50 w-96 bg-card/95 backdrop-blur-sm border rounded-lg shadow-2xl flex flex-col",
        colors.border,
        isDragging && "cursor-grabbing select-none"
      )}
      style={{ 
        left: position.x,
        top: position.y,
        maxHeight: "min(500px, calc(100vh - 2rem))",
      }}
    >
      {/* Draggable Header */}
      <div 
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b cursor-grab shrink-0",
          colors.bg,
          colors.border,
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="h-4 w-4 text-muted-foreground/50" />
          <Sparkles className={cn("h-4 w-4", colors.text)} />
          <span className={cn("font-semibold text-sm", colors.text)}>
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Version Navigation */}
          {versionCount > 1 && (
            <div className="flex items-center gap-1 mr-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handlePrevVersion}
                disabled={currentVersion === 0}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground min-w-[40px] text-center">
                {currentVersion + 1} / {versionCount}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleNextVersion}
                disabled={currentVersion === versionCount - 1}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quadrant indicator bar */}
      <div className={cn("h-0.5 shrink-0", colors.bg.replace("/20", "/50").replace("/10", "/30"))} />

      {/* Content - scrollable within panel only */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {children}
        </div>
      </ScrollArea>

      {/* Footer */}
      {footer && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 shrink-0">
          {footer}
        </div>
      )}
    </div>
  );

  function handlePrevVersion() {
    if (onVersionChange && currentVersion > 0) {
      onVersionChange(currentVersion - 1);
    }
  }

  function handleNextVersion() {
    if (onVersionChange && currentVersion < versionCount - 1) {
      onVersionChange(currentVersion + 1);
    }
  }
}
