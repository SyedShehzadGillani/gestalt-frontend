import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PositionBuilderFooterProps {
  onEdit: () => void;
  onSave: () => void;
  onExit: () => void;
}

export function PositionBuilderFooter({ onEdit, onSave, onExit }: PositionBuilderFooterProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-1">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-1.5">
        <Button
          variant="default"
          size="sm"
          className="bg-chart-primary hover:bg-chart-primary/90 text-primary-foreground px-6 h-8"
          onClick={onEdit}
        >
          EDIT
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-6 h-8"
          onClick={onSave}
        >
          SAVE
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-6 h-8 bg-muted/50"
          onClick={onExit}
        >
          EXIT
        </Button>
      </div>
      
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
