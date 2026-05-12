import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HiveFloatingPanel } from "./HiveFloatingPanel";
import type { Quadrant } from "@/lib/position-builder-types";

interface CustomTagPanelProps {
  open: boolean;
  onClose: () => void;
  quadrantId: Quadrant["id"];
  positionName: string;
  onSubmit: (tag: string, definition: string, expectation: string) => void;
  patientLabel?: string;
  staffLabel?: string;
}

export function CustomTagPanel({
  open,
  onClose,
  quadrantId,
  positionName,
  onSubmit,
  patientLabel = "PATIENT",
  staffLabel = "STAFF",
}: CustomTagPanelProps) {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [expectation, setExpectation] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  // Reset form when panel opens
  useEffect(() => {
    if (open) {
      setWord("");
      setDefinition("");
      setExpectation("");
    }
  }, [open]);

  const getQuadrantLabel = () => {
    if (quadrantId === "PATIENT") return patientLabel;
    if (quadrantId === "STAFF") return staffLabel;
    return quadrantId;
  };

  const handleHiveRefine = async () => {
    if (!word.trim()) return;
    
    setIsRefining(true);
    
    // Simulate AI refinement - in production this would call an edge function
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const refinedDefinition = definition.trim() 
      ? `${definition} — refined for ${positionName} role clarity.`
      : `Demonstrates ${word.toLowerCase()} in all ${getQuadrantLabel().toLowerCase()}-related interactions.`;
    
    const refinedExpectation = expectation.trim()
      ? `${expectation} Consistently applies this standard.`
      : `Expected to exemplify ${word.toLowerCase()} when engaging with ${getQuadrantLabel().toLowerCase().replace('patient', 'patients').replace('staff', 'team members').replace('knowledge', 'technical tasks').replace('personal', 'individual responsibilities')}.`;
    
    setDefinition(refinedDefinition);
    setExpectation(refinedExpectation);
    setIsRefining(false);
  };

  const handleSubmit = () => {
    const trimmedWord = word.trim().toUpperCase();
    if (!trimmedWord) return;
    
    onSubmit(
      trimmedWord,
      definition.trim() || `Demonstrates ${trimmedWord.toLowerCase()} consistently.`,
      expectation.trim() || `Expected to apply ${trimmedWord.toLowerCase()} in daily responsibilities.`
    );
    onClose();
  };

  const canSubmit = word.trim().length > 0;

  return (
    <HiveFloatingPanel
      open={open}
      onClose={onClose}
      quadrantId={quadrantId}
      title="HIVE"
      subtitle="Custom Characteristic"
      patientLabel={patientLabel}
      staffLabel={staffLabel}
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleHiveRefine}
              disabled={!word.trim() || isRefining}
            >
              {isRefining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              HIVE Refine
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              Add to {getQuadrantLabel()}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Word Input */}
        <div className="space-y-2">
          <Label htmlFor="custom-word" className="text-sm font-medium">
            Characteristic Word
          </Label>
          <Input
            id="custom-word"
            placeholder="e.g., PUNCTUAL"
            value={word}
            onChange={(e) => setWord(e.target.value.toUpperCase())}
            className="uppercase font-medium"
          />
          <p className="text-xs text-muted-foreground">
            Enter a word that defines a key characteristic for {positionName}
          </p>
        </div>

        {/* Definition Input */}
        <div className="space-y-2">
          <Label htmlFor="custom-definition" className="text-sm font-medium">
            Definition
          </Label>
          <Textarea
            id="custom-definition"
            placeholder="Describe what this characteristic means..."
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            rows={2}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Leave blank for HIVE to generate, or enter your own and refine
          </p>
        </div>

        {/* Expectation Input */}
        <div className="space-y-2">
          <Label htmlFor="custom-expectation" className="text-sm font-medium">
            HIVE Expectation
          </Label>
          <Textarea
            id="custom-expectation"
            placeholder="What is expected of the employee..."
            value={expectation}
            onChange={(e) => setExpectation(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Describe the behavioral expectation for this {getQuadrantLabel()} characteristic
          </p>
        </div>
      </div>
    </HiveFloatingPanel>
  );
}
