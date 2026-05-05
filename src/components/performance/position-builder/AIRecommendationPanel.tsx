import { useState, useEffect, useCallback } from "react";
import { Check, Undo2, Loader2, ArrowRight, RefreshCw, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Quadrant, QuadrantCriteria } from "@/lib/position-builder-types";
import { QUADRANT_COLORS } from "@/lib/position-builder-types";
import { HiveFloatingPanel } from "./HiveFloatingPanel";

interface AIRecommendationPanelProps {
  open: boolean;
  onClose: () => void;
  quadrantId: Quadrant["id"];
  currentCriteria: QuadrantCriteria[];
  attemptedTag: string;
  positionName: string;
  onApplyRecommendation: (newLabels: string[]) => void;
  onUndo: () => void;
  canUndo: boolean;
  patientLabel?: string;
  staffLabel?: string;
}

interface RecommendationVersion {
  id: string;
  recommended: string[];
  reasoning: string;
  userContext?: string;
  timestamp: Date;
}

// Simulated AI recommendation logic - would be replaced with actual API call
async function generateRecommendation(
  quadrantId: Quadrant["id"],
  currentLabels: string[],
  attemptedTag: string,
  positionName: string,
  userContext?: string
): Promise<{ recommended: string[]; reasoning: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // AI recommendation logic (placeholder - would call actual AI service)
  const allCandidates = [...currentLabels, attemptedTag];
  
  // Simulated prioritization based on quadrant context
  const priorityMap: Record<Quadrant["id"], string[]> = {
    PERSONAL: ["PROFESSIONAL", "PUNCTUAL", "RELIABLE", "ADAPTABLE", "GROWTH-MINDED", "ETHICAL", "ORGANIZED"],
    PATIENT: ["EMPATHETIC", "COMMUNICATIVE", "ATTENTIVE", "WELCOMING", "CONFIDENTIAL", "RESPONSIVE", "CARING"],
    STAFF: ["COLLABORATIVE", "SUPPORTIVE", "RESPECTFUL", "TEAM-ORIENTED", "HELPFUL", "ACCOUNTABLE", "FLEXIBLE"],
    KNOWLEDGE: ["TECHNICAL", "INNOVATIVE", "ANALYTICAL", "EXPERT", "CONTINUOUS-LEARNING", "SPECIALIZED", "SYSTEMATIC"],
  };

  const quadrantPriorities = priorityMap[quadrantId] || [];
  
  // Sort candidates by relevance to quadrant
  const scored = allCandidates.map((label) => ({
    label,
    score: quadrantPriorities.includes(label.toUpperCase()) 
      ? quadrantPriorities.indexOf(label.toUpperCase()) 
      : 100 + Math.random() * 10,
  }));
  
  scored.sort((a, b) => a.score - b.score);
  
  // Take top 5, ensuring attemptedTag is included if relevant
  let recommended = scored.slice(0, 5).map((s) => s.label);
  
  // Ensure the attempted tag is included (user intent)
  if (!recommended.includes(attemptedTag)) {
    recommended = [attemptedTag, ...recommended.slice(0, 4)];
  }

  const removed = currentLabels.filter((l) => !recommended.includes(l));
  const added = recommended.filter((l) => !currentLabels.includes(l));

  // Build reasoning with user context if provided
  let reasoning = `Based on the ${positionName} role requirements, I recommend ${
    removed.length > 0 ? `replacing "${removed.join('", "')}" with "${added.join('", "')}"` : `keeping all current characteristics and adding "${attemptedTag}"`
  } for optimal ${quadrantId.toLowerCase()} performance alignment.`;

  if (userContext) {
    reasoning += ` Taking into account your input: "${userContext}", this selection better aligns with your specific needs for this role.`;
  }

  return { recommended, reasoning };
}

export function AIRecommendationPanel({
  open,
  onClose,
  quadrantId,
  currentCriteria,
  attemptedTag,
  positionName,
  onApplyRecommendation,
  onUndo,
  canUndo,
  patientLabel = "PATIENT",
  staffLabel = "STAFF",
}: AIRecommendationPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [versions, setVersions] = useState<RecommendationVersion[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [applied, setApplied] = useState(false);
  const [userContext, setUserContext] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const colors = QUADRANT_COLORS[quadrantId];
  const currentLabels = currentCriteria.map((c) => c.label);
  const currentRecommendation = versions[currentVersionIndex] || null;

  const fetchRecommendation = useCallback((contextOverride?: string) => {
    setIsLoading(true);
    setApplied(false);
    const context = contextOverride ?? userContext;
    generateRecommendation(quadrantId, currentLabels, attemptedTag, positionName, context || undefined)
      .then((result) => {
        const newVersion: RecommendationVersion = {
          id: `v-${Date.now()}`,
          recommended: result.recommended,
          reasoning: result.reasoning,
          userContext: context || undefined,
          timestamp: new Date(),
        };
        setVersions((prev) => [...prev, newVersion]);
        setCurrentVersionIndex((prev) => prev + (versions.length > 0 ? 1 : 0));
        setIsLoading(false);
        setIsRefining(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsRefining(false);
      });
  }, [quadrantId, currentLabels, attemptedTag, positionName, versions.length, userContext]);

  useEffect(() => {
    if (open && versions.length === 0 && !isLoading) {
      fetchRecommendation();
    }
  }, [open]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setVersions([]);
      setCurrentVersionIndex(0);
      setApplied(false);
      setUserContext("");
      setIsRefining(false);
    }
  }, [open]);

  // Update current version index when new version is added
  useEffect(() => {
    if (versions.length > 0) {
      setCurrentVersionIndex(versions.length - 1);
    }
  }, [versions.length]);

  const handleApply = () => {
    if (currentRecommendation) {
      onApplyRecommendation(currentRecommendation.recommended);
      setApplied(true);
    }
  };

  const handleUndo = () => {
    onUndo();
    setApplied(false);
  };

  const handleTryAgain = () => {
    fetchRecommendation("");
  };

  const handleRefineWithContext = () => {
    if (userContext.trim()) {
      setIsRefining(true);
      fetchRecommendation(userContext);
    }
  };

  const renderFooter = () => {
    if (isLoading) return null;
    
    if (!currentRecommendation) {
      return (
        <div className="flex justify-center w-full">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleTryAgain}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      );
    }

    if (applied) {
      return (
        <>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-green-500" />
            Applied successfully
          </span>
          <div className="flex gap-2">
            {canUndo && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleUndo}
              >
                <Undo2 className="h-3.5 w-3.5" />
                Undo
              </Button>
            )}
            <Button size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleTryAgain}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleApply}
          >
            <Check className="h-3.5 w-3.5" />
            Apply
          </Button>
        </div>
      </div>
    );
  };

  return (
    <HiveFloatingPanel
      open={open}
      onClose={onClose}
      quadrantId={quadrantId}
      title="HIVE REASONING"
      patientLabel={patientLabel}
      staffLabel={staffLabel}
      versionCount={versions.length}
      currentVersion={currentVersionIndex}
      onVersionChange={setCurrentVersionIndex}
      footer={renderFooter()}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <Loader2 className={cn("h-8 w-8 animate-spin", colors.text)} />
          <p className="text-sm text-muted-foreground">
            HIVE is analyzing optimal characteristics...
          </p>
        </div>
      ) : currentRecommendation ? (
        <>
          {/* Comparison View - Solution First */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
            {/* Current */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Current
              </p>
              {currentLabels.map((label) => {
                const isRemoved = !currentRecommendation.recommended.includes(label);
                return (
                  <div
                    key={label}
                    className={cn(
                      "px-2 py-1.5 rounded-[2pt] text-xs border transition-all",
                      isRemoved
                        ? "border-destructive/50 bg-destructive/10 text-destructive line-through opacity-60"
                        : "border-border bg-muted/30 text-foreground"
                    )}
                  >
                    {label}
                  </div>
                );
              })}
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center pt-6">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Recommended */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recommended
              </p>
              {currentRecommendation.recommended.map((label) => {
                const isNew = !currentLabels.includes(label);
                return (
                  <div
                    key={label}
                    className={cn(
                      "px-2 py-1.5 rounded-[2pt] text-xs border transition-all",
                      isNew
                        ? `${colors.border} ${colors.bg} ${colors.text} font-medium`
                        : "border-border bg-muted/30 text-foreground"
                    )}
                  >
                    {label}
                    {isNew && (
                      <span className="ml-1 text-[10px] opacity-70">NEW</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reasoning - Below Solution */}
          <div className="pt-2 border-t border-border/50 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              HIVE Reasoning
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed italic bg-muted/20 rounded-md p-3 border border-border/30">
              {currentRecommendation.reasoning}
            </div>
            
            {/* User Context Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className={cn("h-3.5 w-3.5", colors.text)} />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Add Your Context
                </p>
              </div>
              <Textarea
                placeholder="Share additional context about this role... e.g., 'This position requires heavy patient interaction during LASIK procedures' or 'Team collaboration is critical for this role'"
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                className={cn(
                  "min-h-[80px] text-sm resize-none bg-background/50 border",
                  colors.border,
                  "focus-visible:ring-1 focus-visible:ring-offset-0",
                  `focus-visible:ring-${colors.text.replace('text-', '')}`
                )}
              />
              <Button
                variant="outline"
                size="sm"
                className={cn("w-full gap-2", colors.border, colors.text, "hover:bg-opacity-20")}
                onClick={handleRefineWithContext}
                disabled={!userContext.trim() || isLoading}
              >
                {isRefining ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Refining...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Refine with HIVE
                  </>
                )}
              </Button>
              {currentRecommendation.userContext && (
                <p className="text-xs text-muted-foreground/70 italic">
                  Last refined with: "{currentRecommendation.userContext}"
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Failed to generate recommendation.
          </p>
        </div>
      )}
    </HiveFloatingPanel>
  );
}
