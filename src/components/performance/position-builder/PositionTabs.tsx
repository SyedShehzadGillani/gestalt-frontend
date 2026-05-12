import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Position } from "@/lib/position-builder-types";

interface PositionTabsProps {
  positions: Position[];
  activePositionId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function PositionTabs({ positions, activePositionId, onSelect, onAdd, onRemove }: PositionTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2 overflow-x-auto">
        {positions.map((pos) => (
          <div
            key={pos.id}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded border transition-all cursor-pointer group",
              activePositionId === pos.id
                ? "bg-card border-primary text-foreground"
                : "bg-card/50 border-border text-muted-foreground hover:border-primary/50"
            )}
            onClick={() => onSelect(pos.id)}
          >
            <span className="text-sm font-medium whitespace-nowrap">{pos.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(pos.id); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="shrink-0 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-foreground"
        >
          <Plus className="h-4 w-4 mr-1" />
          ADD
        </Button>
      </div>
      
      <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-muted-foreground hover:text-foreground">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
