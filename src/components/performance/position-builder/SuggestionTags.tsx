import { Plus, X, Loader2, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import type { Quadrant } from "@/lib/position-builder-types";

interface SuggestionTagsProps {
  tags: string[];
  selectedTags: string[];
  tagQuadrantMap: Record<string, Quadrant["id"]>; // Maps tag to its assigned quadrant
  onTagSelect: (tag: string) => void;
  onTagDeselect: (tag: string) => void;
  onCustomClick: () => void;
  isLoading?: boolean;
  activeQuadrantId?: Quadrant["id"];
}

const QUADRANT_TAG_COLORS: Record<Quadrant["id"], { selected: string; unselected: string }> = {
  PERSONAL: {
    selected: "bg-white/20 text-white border-white/60",
    unselected: "bg-card/50 text-muted-foreground border-border hover:border-white/40 hover:text-white",
  },
  PATIENT: {
    selected: "bg-orange-500/30 text-orange-400 border-orange-500",
    unselected: "bg-card/50 text-muted-foreground border-border hover:border-orange-500/50 hover:text-orange-400",
  },
  STAFF: {
    selected: "bg-yellow-500/30 text-yellow-400 border-yellow-500",
    unselected: "bg-card/50 text-muted-foreground border-border hover:border-yellow-500/50 hover:text-yellow-400",
  },
  KNOWLEDGE: {
    selected: "bg-indigo-500/30 text-indigo-400 border-indigo-500",
    unselected: "bg-card/50 text-muted-foreground border-border hover:border-indigo-500/50 hover:text-indigo-400",
  },
};

const INITIAL_TAG_COUNT = 25;

export function SuggestionTags({
  tags,
  selectedTags,
  tagQuadrantMap,
  onTagSelect,
  onTagDeselect,
  onCustomClick,
  isLoading = false,
  activeQuadrantId = "PATIENT",
}: SuggestionTagsProps) {
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Separate selected and unselected tags
  const { selectedTagsList, unselectedTagsList } = useMemo(() => {
    const selected = tags.filter((tag) => selectedTags.includes(tag));
    const unselected = tags.filter((tag) => !selectedTags.includes(tag));
    return { selectedTagsList: selected, unselectedTagsList: unselected };
  }, [tags, selectedTags]);

  // Sort unselected tags based on current sort mode
  const sortedUnselectedTags = useMemo(() => {
    if (sortAlphabetical) {
      return [...unselectedTagsList].sort((a, b) => a.localeCompare(b));
    }
    // HIVE recommendation order = original order (as provided)
    return unselectedTagsList;
  }, [unselectedTagsList, sortAlphabetical]);

  // Limit unselected tags to 25 unless "show all"
  const displayedUnselectedTags = useMemo(() => {
    if (showAll) return sortedUnselectedTags;
    return sortedUnselectedTags.slice(0, INITIAL_TAG_COUNT);
  }, [sortedUnselectedTags, showAll]);

  // Combine: all selected first, then limited unselected
  const displayedTags = useMemo(() => {
    return [...selectedTagsList, ...displayedUnselectedTags];
  }, [selectedTagsList, displayedUnselectedTags]);

  const remainingCount = sortedUnselectedTags.length - INITIAL_TAG_COUNT;
  const hasMoreTags = sortedUnselectedTags.length > INITIAL_TAG_COUNT;

  // Toggle sort mode and auto-expand the list
  const handleSortToggle = () => {
    setSortAlphabetical(!sortAlphabetical);
    setShowAll(true); // Auto-expand when filter is toggled
  };

  const getTagStyle = (tag: string, isSelected: boolean) => {
    if (isSelected) {
      // Use the quadrant color the tag was assigned to
      const assignedQuadrant = tagQuadrantMap[tag] || activeQuadrantId;
      return QUADRANT_TAG_COLORS[assignedQuadrant].selected;
    }
    // Unselected tags use current active quadrant hover color
    return QUADRANT_TAG_COLORS[activeQuadrantId].unselected;
  };

  return (
    <div className="space-y-2">
      {/* Controls Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={handleSortToggle}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortAlphabetical ? "A-Z" : "HIVE"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {unselectedTagsList.length} available
          </span>
        </div>
        {/* Custom Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-3 text-xs gap-1.5"
          onClick={onCustomClick}
        >
          <Plus className="h-3.5 w-3.5" />
          CUSTOM
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">AI is generating suggestions...</span>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5">
            {displayedTags.map((tag, index) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={`${tag}-${index}`}
                  onClick={() => isSelected ? onTagDeselect(tag) : onTagSelect(tag)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded border transition-all tracking-[0.05em]",
                    getTagStyle(tag, isSelected)
                  )}
                >
                  {tag}
                  {isSelected && <X className="inline-block ml-1 h-3 w-3" />}
                </button>
              );
            })}
          </div>

          {/* Show More/Less Button */}
          {hasMoreTags && (
            <div className="flex justify-center pt-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    Show {remainingCount} More
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
