import * as React from "react";
import { useState } from "react";
import {
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  GripVertical,
  Presentation,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AISuggestionsPanel } from "./AISuggestionsPanel";
import { GenerateBriefingModal } from "./GenerateBriefingModal";

export interface Slide {
  id: string;
  widgetType: string;
  widgetTitle: string;
  data?: Record<string, unknown>;
  preview?: React.ReactNode;
}

interface PresentationPanelProps {
  slides: Slide[];
  onSlidesChange: (slides: Slide[]) => void;
  onPresent: () => void;
  onClearAll?: () => void;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  isDragging?: boolean;
}

function SortableSlide({
  slide,
  index,
  onRemove,
}: {
  slide: Slide;
  index: number;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative shrink-0 group"
    >
      <div
        style={{
          width: "160px",
          height: "100px",
          backgroundColor: "var(--content-card-bg)",
          border: "1px solid var(--content-border)",
        }}
        className="flex flex-col items-center justify-center"
      >
        <div
          className="absolute top-2 left-2"
          style={{
            fontSize: "10px",
            fontWeight: 600,
            color: "#0a0a0a",
            backgroundColor: "#c9a227",
            padding: "2px 6px",
          }}
        >
          {index + 1}
        </div>

        <button
          onClick={() => onRemove(slide.id)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          style={{ backgroundColor: "var(--content-card-bg)", border: "1px solid var(--content-border)" }}
        >
          <X className="w-3 h-3" style={{ color: "var(--content-text3)" }} />
        </button>

        <div
          {...attributes}
          {...listeners}
          className="absolute bottom-2 right-2 cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" style={{ color: "var(--content-text3)" }} />
        </div>

        <div
          style={{
            fontSize: "11px",
            color: "var(--content-text2)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {slide.widgetType}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--content-text1)",
            marginTop: "4px",
            textAlign: "center",
            padding: "0 8px",
          }}
          className="truncate w-full"
        >
          {slide.widgetTitle}
        </div>
      </div>
    </div>
  );
}

function AddSlideButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 flex flex-col items-center justify-center transition-colors group"
      style={{
        width: "160px",
        height: "100px",
        border: "2px dashed var(--content-border)",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#c9a227";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--content-border)";
      }}
    >
      <Plus
        className="w-8 h-8 mb-1 transition-colors"
        style={{ color: "var(--content-text3)" }}
      />
      <span style={{ fontSize: "12px", color: "var(--content-text3)" }}>Add Slide</span>
    </button>
  );
}

export function PresentationPanel({
  slides,
  onSlidesChange,
  onPresent,
  onClearAll,
  isExpanded,
  onExpandedChange,
  isDragging = false,
}: PresentationPanelProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showGenerateBriefing, setShowGenerateBriefing] = useState(false);
  
  const { setNodeRef, isOver } = useDroppable({
    id: "presentation-drop-zone",
  });

  const handleRemoveSlide = (id: string) => {
    onSlidesChange(slides.filter((s) => s.id !== id));
  };

  const handleClearAll = () => {
    onSlidesChange([]);
    onClearAll?.();
  };

  const handleAddSlide = () => {
    setShowSuggestions(true);
    onExpandedChange(true);
  };

  const handleAddSuggestionSlide = (slideData: Omit<Slide, "id">) => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...slideData,
    };
    onSlidesChange([...slides, newSlide]);
  };

  const handleGeneratedSlides = (generatedSlides: Slide[]) => {
    onSlidesChange([...slides, ...generatedSlides]);
    onExpandedChange(true);
  };

  React.useEffect(() => {
    if (isDragging && !isExpanded) {
      onExpandedChange(true);
    }
  }, [isDragging, isExpanded, onExpandedChange]);

  const showDropZone = isDragging || isOver;

  return (
    <div
      className="fixed bottom-0 left-0 border-t transition-all duration-300"
      style={{
        height: isExpanded ? "200px" : "48px",
        backgroundColor: "var(--content-elevated-bg)",
        borderColor: showDropZone ? "#c9a227" : "var(--content-border)",
        right: "320px",
        zIndex: 50,
      }}
    >
      <div
        className="h-12 flex items-center justify-between px-4 border-b"
        style={{ borderColor: isExpanded ? "var(--content-border)" : "transparent" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5" style={{ color: "#c9a227" }} />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--content-text1)",
              }}
            >
              PRESENTATION MODE
            </span>
          </div>
          <span style={{ fontSize: "12px", color: "var(--content-text3)" }}>
            {isDragging ? "Drop widget to add slide" : "Build your executive briefing"}
          </span>
          {slides.length > 0 && (
            <span
              style={{
                fontSize: "11px",
                color: "var(--content-text2)",
                backgroundColor: "var(--content-card-bg)",
                border: "1px solid var(--content-border)",
                padding: "2px 8px",
              }}
            >
              {slides.length} slide{slides.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSuggestions(true)}
            className="text-xs"
          >
            <Sparkles className="w-3 h-3 mr-1" style={{ color: "#c9a227" }} />
            AI Suggest
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGenerateBriefing(true)}
            className="text-xs"
            style={{
              borderColor: "#c9a227",
              color: "#c9a227",
              backgroundColor: "transparent",
            }}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Generate Briefing
          </Button>
          
          {slides.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearAll}
              className="text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
          <Button
            size="sm"
            onClick={onPresent}
            disabled={slides.length === 0}
            style={{
              backgroundColor: slides.length > 0 ? "#c9a227" : "var(--content-border)",
              color: slides.length > 0 ? "#000000" : "var(--content-text3)",
            }}
          >
            <Presentation className="w-4 h-4 mr-1" />
            Present
          </Button>
          <button
            onClick={() => onExpandedChange(!isExpanded)}
            className="p-2 transition-colors"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--content-hover-bg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" style={{ color: "var(--content-text3)" }} />
            ) : (
              <ChevronUp className="w-5 h-5" style={{ color: "var(--content-text3)" }} />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          ref={setNodeRef}
          className="h-[calc(100%-48px)] overflow-x-auto transition-colors duration-200"
          style={{
            padding: "16px",
            backgroundColor: showDropZone
              ? "rgba(201, 162, 39, 0.08)"
              : "transparent",
          }}
        >
          <SortableContext
            items={slides.map((s) => s.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-3 h-full items-center">
              {slides.map((slide, index) => (
                <SortableSlide
                  key={slide.id}
                  slide={slide}
                  index={index}
                  onRemove={handleRemoveSlide}
                />
              ))}

              {showDropZone && (
                <div
                  className="shrink-0 flex items-center justify-center transition-all animate-scale-in"
                  style={{
                    width: "160px",
                    height: "100px",
                    border: "2px dashed #c9a227",
                    backgroundColor: "rgba(201, 162, 39, 0.1)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#c9a227",
                    }}
                  >
                    Drop here
                  </span>
                </div>
              )}

              {!showDropZone && <AddSlideButton onClick={handleAddSlide} />}
            </div>
          </SortableContext>
        </div>
      )}

      <AISuggestionsPanel
        isOpen={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        onAddSlide={handleAddSuggestionSlide}
        onAddAll={() => setShowSuggestions(false)}
      />

      <GenerateBriefingModal
        isOpen={showGenerateBriefing}
        onClose={() => setShowGenerateBriefing(false)}
        onGenerate={handleGeneratedSlides}
      />
    </div>
  );
}

export default PresentationPanel;
