import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { CoreValueSection } from "@/components/performance/position-builder/CoreValueSection";
import { SuggestionTags } from "@/components/performance/position-builder/SuggestionTags";
import { QuadrantNavBar } from "@/components/performance/position-builder/QuadrantNavBar";
import { QuadrantGrid } from "@/components/performance/position-builder/QuadrantGrid";
import { PositionBuilderFooter } from "@/components/performance/position-builder/PositionBuilderFooter";
import { AIAssistantPanel } from "@/components/performance/position-builder/AIAssistantPanel";
import { JobDescriptionPanel } from "@/components/performance/position-builder/JobDescriptionPanel";
import { JobDescriptionEnhancement } from "@/components/performance/position-builder/JobDescriptionEnhancement";
import { MaxCriteriaDialog } from "@/components/performance/position-builder/MaxCriteriaDialog";
import { AIRecommendationPanel } from "@/components/performance/position-builder/AIRecommendationPanel";
import { CustomTagPanel } from "@/components/performance/position-builder/CustomTagPanel";
import { HiveQuadrantData } from "@/lib/job-description-types";
import {
  Position,
  Quadrant,
  CoreValue,
  QuadrantCriteria,
  DEFAULT_POSITIONS,
  createEmptyPosition,
} from "@/lib/position-builder-types";

const LS_KEY = "position-builder-state";

function loadState(): { positions: Position[]; activePositionId: string | null } {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Initialize with default positions
  const positions = DEFAULT_POSITIONS.map((name) => createEmptyPosition(name));
  return { positions, activePositionId: positions[0]?.id || null };
}

export default function PositionBuilder() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const hiveRoot = `/client/${id}/hive`;
  const [state, setState] = useState(loadState);
  const [activeQuadrantId, setActiveQuadrantId] = useState<Quadrant["id"]>("PATIENT");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [showAI, setShowAI] = useState(true);
  const [patientLabel, setPatientLabel] = useState("PATIENT");
  const [staffLabel, setStaffLabel] = useState("STAFF");
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<string | null>(null);
  const [jobDescriptionTags, setJobDescriptionTags] = useState<string[]>([]);
  const [activeJobHiveQuadrants, setActiveJobHiveQuadrants] = useState<HiveQuadrantData | undefined>(undefined);
  const [enhanceJobDescriptionCallback, setEnhanceJobDescriptionCallback] = useState<((updates: HiveQuadrantData, summary?: string) => void) | null>(null);
  
  // Max criteria dialog state
  const [maxCriteriaDialogOpen, setMaxCriteriaDialogOpen] = useState(false);
  const [attemptedTag, setAttemptedTag] = useState<string>("");
  
  // AI recommendation panel state
  const [aiRecommendationOpen, setAiRecommendationOpen] = useState(false);
  const [previousCriteriaSnapshot, setPreviousCriteriaSnapshot] = useState<QuadrantCriteria[] | null>(null);
  
  // Custom tag panel state
  const [customTagPanelOpen, setCustomTagPanelOpen] = useState(false);

  const activePosition = state.positions.find((p) => p.id === state.activePositionId) || null;

  // Derive selectedTags from actual quadrant criteria (source of truth)
  const derivedSelectedTags = useMemo(() => {
    if (!activePosition) return [];
    return [
      ...activePosition.quadrants.PERSONAL.criteria.map(c => c.label),
      ...activePosition.quadrants.PATIENT.criteria.map(c => c.label),
      ...activePosition.quadrants.STAFF.criteria.map(c => c.label),
      ...activePosition.quadrants.KNOWLEDGE.criteria.map(c => c.label),
    ];
  }, [activePosition]);

  // Sync state with derived tags when position changes
  useEffect(() => {
    setSelectedTags(derivedSelectedTags);
  }, [derivedSelectedTags]);

  const saveState = useCallback((newState: typeof state) => {
    setState(newState);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(newState));
    } catch {}
  }, []);

  const handlePositionSelect = (id: string) => {
    saveState({ ...state, activePositionId: id });
  };

  const handlePositionAdd = () => {
    const name = `POSITION ${state.positions.length + 1}`;
    const newPosition = createEmptyPosition(name);
    saveState({
      positions: [...state.positions, newPosition],
      activePositionId: newPosition.id,
    });
    toast.success(`Added ${name}`);
  };

  const handlePositionRemove = (id: string) => {
    const remaining = state.positions.filter((p) => p.id !== id);
    const newActiveId = state.activePositionId === id
      ? remaining[0]?.id || null
      : state.activePositionId;
    saveState({ positions: remaining, activePositionId: newActiveId });
    toast.info("Position removed");
  };

  const handleTagSelect = async (tag: string) => {
    if (!activePosition || !activeQuadrantId) return;
    
    // Check if tag is already used in ANY quadrant
    const existingQuadrant = (["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"] as Quadrant["id"][]).find(
      (qId) => activePosition.quadrants[qId].criteria.some((c) => c.label === tag)
    );
    
    if (existingQuadrant) {
      toast.error(`"${tag}" is already assigned to ${existingQuadrant}. Remove it first to reassign.`);
      return;
    }
    
    // Check if quadrant already has 5 criteria
    const currentCriteria = activePosition.quadrants[activeQuadrantId].criteria;
    if (currentCriteria.length >= 5) {
      setAttemptedTag(tag);
      setMaxCriteriaDialogOpen(true);
      return;
    }

    const criteriaId = `crit-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const quadrantId = activeQuadrantId;
    const positionId = activePosition.id;
    
    // Create criteria with placeholder while AI generates content
    const newCriteria: QuadrantCriteria = {
      id: criteriaId,
      label: tag,
      definition: "Generating...",
      expectation: "Generating...",
      score: 0,
      color: quadrantId === "PERSONAL" ? "white" : quadrantId === "PATIENT" ? "orange" : quadrantId === "STAFF" ? "yellow" : "blue",
    };
    
    const updatedPositions = state.positions.map((p) => {
      if (p.id !== positionId) return p;
      return {
        ...p,
        quadrants: {
          ...p.quadrants,
          [quadrantId]: {
            ...p.quadrants[quadrantId],
            criteria: [...p.quadrants[quadrantId].criteria, newCriteria],
          },
        },
      };
    });
    
    setSelectedTags((prev) => [...prev, tag]);
    setSelectedCriteriaId(criteriaId); // Auto-select the new criteria
    saveState({ ...state, positions: updatedPositions });

    // TODO: Re-enable AI generation when UI is complete
    // For now, use placeholder content to speed up development
    const placeholderDefinition = `The quality of being ${tag.toLowerCase()} in the context of ${activePosition.name}.`;
    const placeholderExpectation = `Demonstrates ${tag.toLowerCase()} consistently in all ${quadrantId.toLowerCase()}-related responsibilities.`;
    
    setState((prev) => {
      const newPositions = prev.positions.map((p) => {
        if (p.id !== positionId) return p;
        return {
          ...p,
          quadrants: {
            ...p.quadrants,
            [quadrantId]: {
              ...p.quadrants[quadrantId],
              criteria: p.quadrants[quadrantId].criteria.map((c) =>
                c.id === criteriaId ? { ...c, definition: placeholderDefinition, expectation: placeholderExpectation } : c
              ),
            },
          },
        };
      });
      const newState = { ...prev, positions: newPositions };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(newState));
      } catch {}
      return newState;
    });
  };

  const handleTagDeselect = (tag: string) => {
    if (!activePosition || !activeQuadrantId) return;
    
    const updatedPositions = state.positions.map((p) => {
      if (p.id !== activePosition.id) return p;
      return {
        ...p,
        quadrants: {
          ...p.quadrants,
          [activeQuadrantId]: {
            ...p.quadrants[activeQuadrantId],
            criteria: p.quadrants[activeQuadrantId].criteria.filter((c) => c.label !== tag),
          },
        },
      };
    });
    
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    saveState({ ...state, positions: updatedPositions });
  };

  const handleCustomTagAdd = (tag: string, definition?: string, expectation?: string) => {
    if (!activePosition || !activeQuadrantId) return;
    
    // Check if tag already exists
    const existingQuadrant = (["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"] as Quadrant["id"][]).find(
      (qId) => activePosition.quadrants[qId].criteria.some((c) => c.label === tag)
    );
    
    if (existingQuadrant) {
      toast.error(`"${tag}" is already assigned to ${existingQuadrant}. Remove it first to reassign.`);
      return;
    }
    
    // Check limit
    const currentCriteria = activePosition.quadrants[activeQuadrantId].criteria;
    if (currentCriteria.length >= 5) {
      setAttemptedTag(tag);
      setMaxCriteriaDialogOpen(true);
      return;
    }
    
    setCustomTags((prev) => [...prev, tag]);
    
    // Create criteria with provided or default definition/expectation
    const criteriaId = `crit-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    const newCriteria: QuadrantCriteria = {
      id: criteriaId,
      label: tag,
      definition: definition || "Generating...",
      expectation: expectation || "Generating...",
      score: 0,
      color: activeQuadrantId === "PERSONAL" ? "white" : activeQuadrantId === "PATIENT" ? "orange" : activeQuadrantId === "STAFF" ? "yellow" : "blue",
    };
    
    const updatedPositions = state.positions.map((p) => {
      if (p.id !== activePosition.id) return p;
      return {
        ...p,
        quadrants: {
          ...p.quadrants,
          [activeQuadrantId]: {
            ...p.quadrants[activeQuadrantId],
            criteria: [...p.quadrants[activeQuadrantId].criteria, newCriteria],
          },
        },
      };
    });
    
    setSelectedTags((prev) => [...prev, tag]);
    setSelectedCriteriaId(criteriaId);
    saveState({ ...state, positions: updatedPositions });
    
    // Generate placeholder definition/expectation if not provided
    if (!definition || !expectation) {
      // Use placeholder content like the rest of the app
      const placeholderDefinition = `The quality of being ${tag.toLowerCase()} in the context of ${activePosition.name}.`;
      const placeholderExpectation = `Demonstrates ${tag.toLowerCase()} consistently in all ${activeQuadrantId.toLowerCase()}-related responsibilities.`;
      
      setState((prev) => {
        const newPositions = prev.positions.map((p) => {
          if (p.id !== activePosition.id) return p;
          return {
            ...p,
            quadrants: {
              ...p.quadrants,
              [activeQuadrantId]: {
                ...p.quadrants[activeQuadrantId],
                criteria: p.quadrants[activeQuadrantId].criteria.map((c) =>
                  c.id === criteriaId
                    ? { ...c, definition: placeholderDefinition, expectation: placeholderExpectation }
                    : c
                ),
              },
            },
          };
        });
        saveState({ ...prev, positions: newPositions });
        return { ...prev, positions: newPositions };
      });
    }
  };

  const handleRemoveCriteria = (quadrantId: Quadrant["id"], criteriaId: string) => {
    if (!activePosition) return;

    const criteria = activePosition.quadrants[quadrantId].criteria.find((c) => c.id === criteriaId);
    
    const updatedPositions = state.positions.map((p) => {
      if (p.id !== activePosition.id) return p;
      return {
        ...p,
        quadrants: {
          ...p.quadrants,
          [quadrantId]: {
            ...p.quadrants[quadrantId],
            criteria: p.quadrants[quadrantId].criteria.filter((c) => c.id !== criteriaId),
          },
        },
      };
    });

    if (criteria) {
      setSelectedTags((prev) => prev.filter((t) => t !== criteria.label));
    }
    saveState({ ...state, positions: updatedPositions });
  };

  const handleReorderCriteria = (quadrantId: Quadrant["id"], newOrder: QuadrantCriteria[]) => {
    if (!activePosition) return;

    const updatedPositions = state.positions.map((p) => {
      if (p.id !== activePosition.id) return p;
      return {
        ...p,
        quadrants: {
          ...p.quadrants,
          [quadrantId]: {
            ...p.quadrants[quadrantId],
            criteria: newOrder,
          },
        },
      };
    });

    saveState({ ...state, positions: updatedPositions });
  };

  // Handle AI recommendation: replace current quadrant's criteria with recommended labels
  const handleApplyRecommendation = (newLabels: string[]) => {
    if (!activePosition || !activeQuadrantId) return;

    // Save snapshot for undo
    setPreviousCriteriaSnapshot([...activePosition.quadrants[activeQuadrantId].criteria]);

    // Build new criteria from labels
    const newCriteria: QuadrantCriteria[] = newLabels.map((label, idx) => {
      // Check if this label already exists in current criteria
      const existing = activePosition.quadrants[activeQuadrantId].criteria.find(
        (c) => c.label === label
      );
      if (existing) return existing;

      // Create new criteria with placeholder content
      return {
        id: `crit-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
        label,
        definition: `The quality of being ${label.toLowerCase()} in the context of ${activePosition.name}.`,
        expectation: `Demonstrates ${label.toLowerCase()} consistently in all ${activeQuadrantId.toLowerCase()}-related responsibilities.`,
        score: 0,
        color: activeQuadrantId === "PERSONAL" ? "white" : activeQuadrantId === "PATIENT" ? "orange" : activeQuadrantId === "STAFF" ? "yellow" : "blue",
      };
    });

    const updatedPositions = state.positions.map((p) => {
      if (p.id !== activePosition.id) return p;
      return {
        ...p,
        quadrants: {
          ...p.quadrants,
          [activeQuadrantId]: {
            ...p.quadrants[activeQuadrantId],
            criteria: newCriteria,
          },
        },
      };
    });

    // Update selected tags
    const oldLabels = activePosition.quadrants[activeQuadrantId].criteria.map((c) => c.label);
    const removedLabels = oldLabels.filter((l) => !newLabels.includes(l));
    const addedLabels = newLabels.filter((l) => !oldLabels.includes(l));

    setSelectedTags((prev) => {
      const filtered = prev.filter((t) => !removedLabels.includes(t));
      return [...filtered, ...addedLabels.filter((l) => !filtered.includes(l))];
    });

    saveState({ ...state, positions: updatedPositions });
    toast.success("Applied AI recommendation");
  };

  // Undo AI recommendation
  const handleUndoRecommendation = () => {
    if (!activePosition || !activeQuadrantId || !previousCriteriaSnapshot) return;

    const currentLabels = activePosition.quadrants[activeQuadrantId].criteria.map((c) => c.label);
    const snapshotLabels = previousCriteriaSnapshot.map((c) => c.label);

    const updatedPositions = state.positions.map((p) => {
      if (p.id !== activePosition.id) return p;
      return {
        ...p,
        quadrants: {
          ...p.quadrants,
          [activeQuadrantId]: {
            ...p.quadrants[activeQuadrantId],
            criteria: previousCriteriaSnapshot,
          },
        },
      };
    });

    // Restore selected tags
    const addedByRecommendation = currentLabels.filter((l) => !snapshotLabels.includes(l));
    const removedByRecommendation = snapshotLabels.filter((l) => !currentLabels.includes(l));

    setSelectedTags((prev) => {
      const filtered = prev.filter((t) => !addedByRecommendation.includes(t));
      return [...filtered, ...removedByRecommendation.filter((l) => !filtered.includes(l))];
    });

    saveState({ ...state, positions: updatedPositions });
    setPreviousCriteriaSnapshot(null);
    toast.info("Reverted to previous characteristics");
  };

  const handleUpdateDefinition = (quadrantId: Quadrant["id"], criteriaId: string, definition: string) => {
    if (!activePosition) return;
    
    const updatedPositions = state.positions.map((p) => {
      if (p.id !== activePosition.id) return p;
      return {
        ...p,
        quadrants: {
          ...p.quadrants,
          [quadrantId]: {
            ...p.quadrants[quadrantId],
            criteria: p.quadrants[quadrantId].criteria.map((c) =>
              c.id === criteriaId ? { ...c, definition } : c
            ),
          },
        },
      };
    });
    
    saveState({ ...state, positions: updatedPositions });
  };

  const handlePositionPrev = () => {
    const idx = state.positions.findIndex((p) => p.id === state.activePositionId);
    if (idx > 0) {
      saveState({ ...state, activePositionId: state.positions[idx - 1].id });
    }
  };

  const handlePositionNext = () => {
    const idx = state.positions.findIndex((p) => p.id === state.activePositionId);
    if (idx < state.positions.length - 1) {
      saveState({ ...state, activePositionId: state.positions[idx + 1].id });
    }
  };

  const handleAISuggestion = (suggestions: { tags?: string[]; coreValue?: { word: string; definition: string; expectation: string } }) => {
    if (!activePosition) return;
    
    if (suggestions.coreValue) {
      const cv: CoreValue = {
        id: `cv-${Date.now()}`,
        word: suggestions.coreValue.word,
        definition: suggestions.coreValue.definition,
        expectation: suggestions.coreValue.expectation,
      };
      
      const updatedPositions = state.positions.map((p) => {
        if (p.id !== activePosition.id) return p;
        return { ...p, coreValue: cv };
      });
      
      saveState({ ...state, positions: updatedPositions });
      toast.success(`Core value "${cv.word}" applied`);
    }
    
    if (suggestions.tags) {
      suggestions.tags.forEach((tag) => handleTagSelect(tag));
    }
  };

  // Handle populating quadrants from job description
  const handlePopulateFromJobDescription = (criteria: Record<Quadrant["id"], QuadrantCriteria[]>) => {
    if (!activePosition) return;

    const updatedPositions = state.positions.map((p) => {
      if (p.id !== activePosition.id) return p;
      return {
        ...p,
        quadrants: {
          PERSONAL: { ...p.quadrants.PERSONAL, criteria: criteria.PERSONAL },
          PATIENT: { ...p.quadrants.PATIENT, criteria: criteria.PATIENT },
          STAFF: { ...p.quadrants.STAFF, criteria: criteria.STAFF },
          KNOWLEDGE: { ...p.quadrants.KNOWLEDGE, criteria: criteria.KNOWLEDGE },
        },
      };
    });

    // Update selected tags to reflect new criteria
    const allCriteriaLabels = [
      ...criteria.PERSONAL.map(c => c.label),
      ...criteria.PATIENT.map(c => c.label),
      ...criteria.STAFF.map(c => c.label),
      ...criteria.KNOWLEDGE.map(c => c.label),
    ];
    setSelectedTags(allCriteriaLabels);
    setSelectedCriteriaId(null);

    saveState({ ...state, positions: updatedPositions });
    toast.success("Quadrants populated from job description");
  };

  const handleSave = () => {
    toast.success("Position saved successfully");
  };

  const handleExit = () => {
    navigate(hiveRoot);
  };

  // Combine job description AI tags + custom tags + words already in quads
  // First get all words currently in quadrants
  const wordsInQuadrants = activePosition
    ? [
        ...activePosition.quadrants.PERSONAL.criteria.map(c => c.label),
        ...activePosition.quadrants.PATIENT.criteria.map(c => c.label),
        ...activePosition.quadrants.STAFF.criteria.map(c => c.label),
        ...activePosition.quadrants.KNOWLEDGE.criteria.map(c => c.label),
      ]
    : [];
  
  // Combine: job description suggestions + words in quads + custom, deduped
  const allTags = [...new Set([...jobDescriptionTags, ...wordsInQuadrants, ...customTags])];

  // Build a map of tags to their assigned quadrants
  const tagQuadrantMap: Record<string, Quadrant["id"]> = {};
  if (activePosition) {
    (["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"] as Quadrant["id"][]).forEach((qId) => {
      activePosition.quadrants[qId].criteria.forEach((criteria) => {
        tagQuadrantMap[criteria.label] = qId;
      });
    });
  }

  const QUADRANT_IDS: Quadrant["id"][] = ["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"];

  // Find selected criteria object
  const selectedCriteria = (() => {
    if (!activePosition || !selectedCriteriaId) return null;
    for (const qId of QUADRANT_IDS) {
      const found = activePosition.quadrants[qId].criteria.find((c) => c.id === selectedCriteriaId);
      if (found) return { criteria: found, quadrantId: qId };
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-transparent">

      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(hiveRoot)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  H.I.V.E. <span className="text-muted-foreground font-normal">FEATURES</span> - Position Builder
                </h1>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowAI((v) => !v)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>


          {/* Core Value Section */}
          <div className="mb-6">
            <CoreValueSection
              coreValue={activePosition?.coreValue || null}
              innovationTag="INNOVATION"
              selectedCriteria={selectedCriteria?.criteria || null}
              selectedQuadrant={selectedCriteria?.quadrantId || null}
            />
          </div>

          {/* Suggestion Tags */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              Click tags to add to 
              <span className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold tracking-[0.12em]",
                activeQuadrantId === "PERSONAL" && "bg-white/20 text-white border border-white/40",
                activeQuadrantId === "PATIENT" && "bg-quadrant-patient text-black border border-quadrant-patient",
                activeQuadrantId === "STAFF" && "bg-quadrant-staff text-black border border-quadrant-staff",
                activeQuadrantId === "KNOWLEDGE" && "bg-quadrant-knowledge/20 text-quadrant-knowledge border border-quadrant-knowledge/50"
              )}>
                {activeQuadrantId === "PATIENT" ? patientLabel : activeQuadrantId === "STAFF" ? staffLabel : activeQuadrantId}
              </span>
              quadrant
            </h3>
            <SuggestionTags
              tags={allTags}
              selectedTags={selectedTags}
              tagQuadrantMap={tagQuadrantMap}
              onTagSelect={handleTagSelect}
              onTagDeselect={handleTagDeselect}
              onCustomClick={() => setCustomTagPanelOpen(true)}
              activeQuadrantId={activeQuadrantId}
            />
          </div>

          {/* Enhancement Recommendations */}
          <JobDescriptionEnhancement
            currentQuadrants={activePosition?.quadrants}
            originalHiveQuadrants={activeJobHiveQuadrants}
            onApproveEnhancement={(updates, summary) => {
              if (enhanceJobDescriptionCallback) {
                enhanceJobDescriptionCallback(updates, summary);
              }
              setActiveJobHiveQuadrants(updates);
            }}
            className="mb-5"
          />

          {/* Quadrant Navigation Bar */}
          <div className="mb-3">
            <QuadrantNavBar
              activeQuadrantId={activeQuadrantId}
              onSelectQuadrant={setActiveQuadrantId}
              patientLabel={patientLabel}
              staffLabel={staffLabel}
              onPatientLabelChange={setPatientLabel}
              onStaffLabelChange={setStaffLabel}
              positionName={activePosition?.name || "No Position"}
              onPositionPrev={handlePositionPrev}
              onPositionNext={handlePositionNext}
              canGoPrev={state.positions.findIndex((p) => p.id === state.activePositionId) > 0}
              canGoNext={state.positions.findIndex((p) => p.id === state.activePositionId) < state.positions.length - 1}
            />
          </div>

          {/* Quadrant Criteria Grid - aligned with nav tabs */}
          <div className="mb-3 flex gap-2">
            {/* Spacer to match position navigation width - must match QuadrantNavBar dimensions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="h-9 w-8" /> {/* Match chevron button */}
              <div className="min-w-[130px] px-5 h-9" /> {/* Match position name box */}
              <div className="h-9 w-8" /> {/* Match chevron button */}
            </div>
            
            {/* Grid aligned with tabs - 90% width to match nav tabs */}
            <div style={{ width: '90%' }}>
              {activePosition && (
                <QuadrantGrid
                  quadrants={activePosition.quadrants}
                  activeQuadrantId={activeQuadrantId}
                  onSelectQuadrant={setActiveQuadrantId}
                  onRemoveCriteria={handleRemoveCriteria}
                  onUpdateDefinition={handleUpdateDefinition}
                  onSelectCriteria={setSelectedCriteriaId}
                  onReorderCriteria={handleReorderCriteria}
                  selectedCriteriaId={selectedCriteriaId}
                  patientLabel={patientLabel}
                  staffLabel={staffLabel}
                  onPatientLabelChange={setPatientLabel}
                  onStaffLabelChange={setStaffLabel}
                  positionName={activePosition.name}
                />
              )}
            </div>
          </div>

          {/* Footer - aligned with quads */}
          <div className="flex gap-2 mb-2">
            {/* Spacer to match position navigation width */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="h-9 w-8" />
              <div className="min-w-[130px] px-5 h-9" />
              <div className="h-9 w-8" />
            </div>
            
            {/* Footer centered under quads */}
            <div style={{ width: '90%' }} className="flex justify-center">
              <PositionBuilderFooter
                onEdit={() => toast.info("Edit mode")}
                onSave={handleSave}
                onExit={handleExit}
              />
            </div>
          </div>

          {/* Job Description Panel */}
          <div className="flex gap-2">
            {/* Spacer to match position navigation width */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="h-9 w-8" />
              <div className="min-w-[130px] px-5 h-9" />
              <div className="h-9 w-8" />
            </div>
            
            {/* Job Description centered under quads */}
            <div style={{ width: '90%' }}>
              <JobDescriptionPanel
                positionName={activePosition?.name || "Position"}
                patientLabel={patientLabel}
                onPopulateQuadrants={handlePopulateFromJobDescription}
                currentQuadrants={activePosition?.quadrants}
                onSuggestedTagsChange={setJobDescriptionTags}
                onActiveJobChange={setActiveJobHiveQuadrants}
                onProvideEnhanceCallback={(cb) => setEnhanceJobDescriptionCallback(() => cb)}
                onPositionChangeRequest={(posName) => {
                  const match = state.positions.find(
                    (p) => p.name.toUpperCase() === posName.toUpperCase()
                  );
                  if (match && match.id !== state.activePositionId) {
                    saveState({ ...state, activePositionId: match.id });
                  }
                }}
              />
            </div>
          </div>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {showAI && (
          <div className="w-96 shrink-0">
            <AIAssistantPanel
              industry="Healthcare"
              position={activePosition?.name}
              onSuggestionApply={handleAISuggestion}
            />
          </div>
        )}
      </div>

      {/* Max Criteria Dialog */}
      {activePosition && activeQuadrantId && (
        <MaxCriteriaDialog
          open={maxCriteriaDialogOpen}
          onOpenChange={setMaxCriteriaDialogOpen}
          quadrantId={activeQuadrantId}
          attemptedTag={attemptedTag}
          currentCriteria={activePosition.quadrants[activeQuadrantId].criteria}
          onRemoveCriteria={(criteriaId) => {
            handleRemoveCriteria(activeQuadrantId, criteriaId);
            // After removing, add the attempted tag
            setTimeout(() => handleTagSelect(attemptedTag), 100);
          }}
          onAIRecommend={() => {
            setMaxCriteriaDialogOpen(false);
            setAiRecommendationOpen(true);
          }}
          patientLabel={patientLabel}
          staffLabel={staffLabel}
        />
      )}

      {/* AI Recommendation Floating Panel */}
      {activePosition && activeQuadrantId && (
        <AIRecommendationPanel
          open={aiRecommendationOpen}
          onClose={() => setAiRecommendationOpen(false)}
          quadrantId={activeQuadrantId}
          currentCriteria={activePosition.quadrants[activeQuadrantId].criteria}
          attemptedTag={attemptedTag}
          positionName={activePosition.name}
          onApplyRecommendation={handleApplyRecommendation}
          onUndo={handleUndoRecommendation}
          canUndo={previousCriteriaSnapshot !== null}
          patientLabel={patientLabel}
          staffLabel={staffLabel}
        />
      )}

      {/* Custom Tag Panel */}
      {activePosition && activeQuadrantId && (
        <CustomTagPanel
          open={customTagPanelOpen}
          onClose={() => setCustomTagPanelOpen(false)}
          quadrantId={activeQuadrantId}
          positionName={activePosition.name}
          onSubmit={handleCustomTagAdd}
          patientLabel={patientLabel}
          staffLabel={staffLabel}
        />
      )}
    </div>
  );
}
