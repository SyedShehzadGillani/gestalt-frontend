import { useState } from "react";
import { Sparkles, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Quadrant, QuadrantCriteria } from "@/lib/position-builder-types";
import type { HiveQuadrantData, QuadrantCriteriaInput } from "@/lib/job-description-types";

interface EnhancementRecommendation {
  quadrant: Quadrant["id"];
  word: string;
  expectation: string;
  isNew: boolean; // true if not in original job description
}

interface JobDescriptionEnhancementProps {
  currentQuadrants?: Record<Quadrant["id"], { criteria: QuadrantCriteria[] }>;
  originalHiveQuadrants?: HiveQuadrantData;
  onApproveEnhancement: (updates: HiveQuadrantData, changesSummary?: string) => void;
  className?: string;
}

const QUADRANT_COLORS: Record<Quadrant["id"], string> = {
  PERSONAL: "text-white border-white/30 bg-white/10",
  PATIENT: "text-orange-400 border-orange-500/50 bg-orange-500/10",
  STAFF: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10",
  KNOWLEDGE: "text-blue-400 border-blue-500/50 bg-blue-500/10",
};

export function JobDescriptionEnhancement({
  currentQuadrants,
  originalHiveQuadrants,
  onApproveEnhancement,
  className,
}: JobDescriptionEnhancementProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set());

  // Find new words that were added to quadrants but aren't in original job description
  const getNewWords = (): EnhancementRecommendation[] => {
    if (!currentQuadrants || !originalHiveQuadrants) return [];

    const recommendations: EnhancementRecommendation[] = [];
    const quadrantIds: Quadrant["id"][] = ["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"];

    quadrantIds.forEach((qId) => {
      const originalWords = new Set(
        originalHiveQuadrants[qId].map((q) => q.word.toUpperCase())
      );

      currentQuadrants[qId].criteria.forEach((criteria) => {
        if (!originalWords.has(criteria.label.toUpperCase())) {
          recommendations.push({
            quadrant: qId,
            word: criteria.label,
            expectation: criteria.expectation,
            isNew: true,
          });
        }
      });
    });

    return recommendations;
  };

  const newWords = getNewWords();

  const toggleRecommendation = (word: string) => {
    setSelectedRecommendations((prev) => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else {
        next.add(word);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedRecommendations(new Set(newWords.map((r) => r.word)));
  };

  const handleApprove = () => {
    if (!originalHiveQuadrants || selectedRecommendations.size === 0) return;

    // Build enhanced HIVE data
    const enhanced: HiveQuadrantData = {
      PERSONAL: [...originalHiveQuadrants.PERSONAL],
      PATIENT: [...originalHiveQuadrants.PATIENT],
      STAFF: [...originalHiveQuadrants.STAFF],
      KNOWLEDGE: [...originalHiveQuadrants.KNOWLEDGE],
    };

    newWords.forEach((rec) => {
      if (selectedRecommendations.has(rec.word)) {
        // Only add if not already present
        const exists = enhanced[rec.quadrant].some(
          (q) => q.word.toUpperCase() === rec.word.toUpperCase()
        );
        if (!exists) {
          enhanced[rec.quadrant].push({
            word: rec.word,
            expectation: rec.expectation,
          });
        }
      }
    });

    // Create a summary of changes
    const addedWords = [...selectedRecommendations].join(", ");
    const changesSummary = `Added ${selectedRecommendations.size} criteria: ${addedWords}`;

    onApproveEnhancement(enhanced, changesSummary);
    setSelectedRecommendations(new Set());
  };

  if (newWords.length === 0) return null;

  return (
    <div className={cn("rounded-lg border border-primary/30 bg-primary/5 overflow-hidden", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-primary/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {newWords.length} Enhancement{newWords.length !== 1 ? "s" : ""} Recommended
          </span>
          <span className="text-xs text-muted-foreground">
            — Update job description with new criteria
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 animate-in fade-in duration-200">
          <p className="text-xs text-muted-foreground">
            These new words have been added to the quadrants. Approve them to permanently enhance the job description.
          </p>

          {/* Recommendations list */}
          <div className="space-y-2">
            {newWords.map((rec) => (
              <label
                key={rec.word}
                className={cn(
                  "flex items-start gap-3 p-2 rounded-md border cursor-pointer transition-colors",
                  selectedRecommendations.has(rec.word)
                    ? "bg-primary/10 border-primary/40"
                    : "bg-background/50 border-border/50 hover:border-border"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedRecommendations.has(rec.word)}
                  onChange={() => toggleRecommendation(rec.word)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded border",
                        QUADRANT_COLORS[rec.quadrant]
                      )}
                    >
                      {rec.quadrant}
                    </span>
                    <span className="text-sm font-medium text-foreground">{rec.word}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {rec.expectation}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRecommendations(new Set())}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={selectedRecommendations.size === 0}
                className="bg-primary text-primary-foreground"
              >
                <Check className="h-3 w-3 mr-1" />
                Approve & Enhance ({selectedRecommendations.size})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}