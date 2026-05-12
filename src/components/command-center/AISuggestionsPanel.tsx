import * as React from "react";
import { useState } from "react";
import { Bot, Plus, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { Slide } from "./PresentationPanel";
import type { WidgetDragData } from "./DraggableWidget";

interface AISuggestion {
  id: string;
  title: string;
  reason: string;
  widgetType: WidgetDragData["widgetType"];
  data: Record<string, unknown>;
}

interface AISuggestionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSlide: (slide: Omit<Slide, "id">) => void;
  onAddAll: () => void;
}

const mockSuggestions: AISuggestion[] = [
  {
    id: "suggestion-1",
    title: "FRAMEWORK Score Improvement",
    reason: "Score increased 12% this quarter — worth highlighting",
    widgetType: "score",
    data: { score: 16, maxScore: 21, trend: "+12%", status: "EXIT POSSIBLE" },
  },
  {
    id: "suggestion-2",
    title: "Flight Risk Alert",
    reason: "Tom Zimmerman 87% departure risk — needs attention",
    widgetType: "alert",
    data: { severity: "critical", employee: "Tom Zimmerman", riskScore: 87 },
  },
  {
    id: "suggestion-3",
    title: "EBITDA Growth",
    reason: "Up 12% year-over-year — strong indicator",
    widgetType: "chart",
    data: { trend: "+12%", values: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4] },
  },
  {
    id: "suggestion-4",
    title: "Team Milestone",
    reason: "Sarah Chen's birthday today — team celebration",
    widgetType: "list",
    data: { type: "celebration", person: "Sarah Chen", event: "Birthday" },
  },
  {
    id: "suggestion-5",
    title: "Project Risk",
    reason: "Employee Handbook overdue — escalation needed",
    widgetType: "progress",
    data: { project: "Employee Handbook", progress: 28, status: "overdue" },
  },
  {
    id: "suggestion-6",
    title: "Brand Health Summary",
    reason: "Executive overview for stakeholders",
    widgetType: "spectrum",
    data: { overallScore: 76, status: "EXIT POSSIBLE" },
  },
];

function SuggestionCard({
  suggestion,
  onAdd,
  isAdded,
}: {
  suggestion: AISuggestion;
  onAdd: () => void;
  isAdded: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="transition-all cursor-pointer"
      style={{
        backgroundColor: "#141414",
        border: "1px solid #1a1a1a",
        borderLeftWidth: "4px",
        borderLeftColor: isHovered ? "#e2b53f" : "#c9a227",
        padding: "16px",
        marginBottom: "12px",
        opacity: isAdded ? 0.5 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isAdded && onAdd()}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div
            className="flex items-center gap-2 mb-2"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#ffffff",
            }}
          >
            {suggestion.title}
            {isAdded && (
              <CheckCircle className="w-4 h-4" style={{ color: "#78b956" }} />
            )}
          </div>

          {/* Reason */}
          <div
            style={{
              fontSize: "13px",
              color: "#a0a0a0",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            {suggestion.reason}
          </div>

          {/* Widget Type Preview */}
          <div className="mt-3 flex items-center gap-2">
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#c9a227",
                backgroundColor: "rgba(201, 162, 39, 0.1)",
                padding: "4px 8px",
                border: "1px solid rgba(201, 162, 39, 0.3)",
              }}
            >
              {suggestion.widgetType}
            </span>
          </div>
        </div>

        {/* Add Button */}
        {!isAdded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="shrink-0 flex items-center gap-1 transition-colors hover:bg-[rgba(201,162,39,0.1)]"
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "#c9a227",
              padding: "6px 12px",
              border: "1px solid #c9a227",
              backgroundColor: "transparent",
            }}
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        )}
      </div>
    </div>
  );
}

export function AISuggestionsPanel({
  isOpen,
  onClose,
  onAddSlide,
  onAddAll,
}: AISuggestionsProps) {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleAddSuggestion = (suggestion: AISuggestion) => {
    if (addedIds.has(suggestion.id)) return;

    onAddSlide({
      widgetType: suggestion.widgetType,
      widgetTitle: suggestion.title,
      data: suggestion.data,
    });

    setAddedIds((prev) => new Set([...prev, suggestion.id]));

    toast({
      title: "Added to presentation",
      description: suggestion.title,
    });
  };

  const handleAddAll = () => {
    const newIds = new Set(addedIds);
    
    mockSuggestions.forEach((suggestion) => {
      if (!addedIds.has(suggestion.id)) {
        onAddSlide({
          widgetType: suggestion.widgetType,
          widgetTitle: suggestion.title,
          data: suggestion.data,
        });
        newIds.add(suggestion.id);
      }
    });

    setAddedIds(newIds);
    onAddAll();

    toast({
      title: "Added all suggestions",
      description: `${mockSuggestions.length - addedIds.size} slides added to presentation`,
    });
  };

  const remainingCount = mockSuggestions.length - addedIds.size;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col animate-scale-in"
        style={{
          backgroundColor: "#0a0a0a",
          border: "1px solid #1a1a1a",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="shrink-0 px-6 py-4 border-b"
          style={{ borderColor: "#1a1a1a" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5" style={{ color: "#c9a227" }} />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#c9a227",
              }}
            >
              GESTALT INTELLIGENCE Suggestions
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "#a0a0a0" }}>
            Based on your client's data, here are recommended highlights:
          </p>
        </div>

        {/* Suggestions List */}
        <div className="flex-1 overflow-y-auto p-4">
          {mockSuggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onAdd={() => handleAddSuggestion(suggestion)}
              isAdded={addedIds.has(suggestion.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          className="shrink-0 px-6 py-4 border-t flex items-center justify-between gap-4"
          style={{ borderColor: "#1a1a1a" }}
        >
          <button
            onClick={onClose}
            style={{
              fontSize: "13px",
              color: "#666666",
            }}
            className="hover:text-white transition-colors"
          >
            Close
          </button>

          <Button
            onClick={handleAddAll}
            disabled={remainingCount === 0}
            className="flex items-center gap-2"
            style={{
              backgroundColor: remainingCount > 0 ? "#c9a227" : "#1a1a1a",
              color: remainingCount > 0 ? "#000000" : "#666666",
            }}
          >
            <Sparkles className="w-4 h-4" />
            {remainingCount > 0
              ? `Add All ${remainingCount} Suggestions`
              : "All Added"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AISuggestionsPanel;
