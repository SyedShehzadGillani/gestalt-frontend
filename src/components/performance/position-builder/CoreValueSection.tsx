import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import type { CoreValue, QuadrantCriteria, Quadrant } from "@/lib/position-builder-types";
import { cn } from "@/lib/utils";

interface CoreValueSectionProps {
  coreValue: CoreValue | null;
  innovationTag?: string;
  selectedCriteria?: QuadrantCriteria | null;
  selectedQuadrant?: Quadrant["id"] | null;
  onEditDefinition?: () => void;
  onEditExpectation?: () => void;
}

const getQuadrantColor = (quadrantId: Quadrant["id"] | null | undefined) => {
  switch (quadrantId) {
    case "PERSONAL":
      return "text-white border-white/50 bg-white/10";
    case "PATIENT":
      return "text-orange-500 border-orange-500/50 bg-orange-500/10";
    case "STAFF":
      return "text-yellow-400 border-yellow-500/50 bg-yellow-500/10";
    case "KNOWLEDGE":
      return "text-indigo-400 border-indigo-500/50 bg-indigo-500/10";
    default:
      return "text-chart-primary border-chart-primary/50 bg-chart-primary/10";
  }
};

const getWordColor = (quadrantId: Quadrant["id"] | null | undefined) => {
  switch (quadrantId) {
    case "PERSONAL":
      return "text-white";
    case "PATIENT":
      return "text-orange-500";
    case "STAFF":
      return "text-yellow-400";
    case "KNOWLEDGE":
      return "text-indigo-400";
    default:
      return "text-chart-primary";
  }
};

export function CoreValueSection({ 
  coreValue, 
  innovationTag = "INNOVATION",
  selectedCriteria,
  selectedQuadrant,
  onEditDefinition,
  onEditExpectation,
}: CoreValueSectionProps) {
  // If we have a selected criteria, show that instead of core value
  if (selectedCriteria) {
    const isGenerating = selectedCriteria.definition === "Generating..." || selectedCriteria.expectation === "Generating...";
    
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Badge variant="outline" className={cn("px-3 py-1", getQuadrantColor(selectedQuadrant))}>
            {selectedQuadrant}
          </Badge>
        </div>
        
        <h2 className={cn("text-4xl font-bold tracking-wide", getWordColor(selectedQuadrant))}>
          {selectedCriteria.label}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-chart-primary">DEFINITION</h3>
              {onEditDefinition && !isGenerating && (
                <button onClick={onEditDefinition} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>
            <p className={cn(
              "text-foreground/80 text-sm leading-relaxed",
              isGenerating && "animate-pulse text-muted-foreground italic"
            )}>
              {selectedCriteria.definition || "No definition yet."}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-foreground">EXPECTATION</h3>
              {onEditExpectation && !isGenerating && (
                <button onClick={onEditExpectation} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>
            <p className={cn(
              "text-foreground/80 text-sm leading-relaxed",
              isGenerating && "animate-pulse text-muted-foreground italic"
            )}>
              {selectedCriteria.expectation || "No expectation yet."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!coreValue) {
    return (
      <div className="p-6 border border-dashed border-muted-foreground/30 rounded-lg text-center">
        <p className="text-muted-foreground text-sm">Click a tag below to add a characteristic. Definition and expectation will be AI-generated.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Badge variant="outline" className="bg-chart-primary/20 text-chart-primary border-chart-primary/50 px-3 py-1">
          {innovationTag}
        </Badge>
      </div>
      
      <h2 className="text-4xl font-bold text-chart-primary tracking-wide">
        {coreValue.word}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-chart-primary mb-2">DEFINITION</h3>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {coreValue.definition}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">EXPECTATION</h3>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {coreValue.expectation}
          </p>
        </div>
      </div>
    </div>
  );
}
