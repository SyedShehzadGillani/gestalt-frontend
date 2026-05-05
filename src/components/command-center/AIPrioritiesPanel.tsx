import * as React from "react";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronRight, ChevronDown, Bot } from "lucide-react";

type PriorityType = "alert" | "opportunity" | "risk";
type Severity = "critical" | "warning" | "info" | "success";

interface PriorityDetails {
  why: string;
  actions: string[];
  sources: string;
  confidence: number;
}

interface Priority {
  id: string;
  type: PriorityType;
  severity: Severity;
  title: string;
  description: string;
  action?: string;
  details: PriorityDetails;
}

interface AIPrioritiesPanelProps {
  priorities?: Priority[];
  onViewAll?: () => void;
  onTakeAction?: (priority: Priority) => void;
}

const severityConfig: Record<Severity, { color: string; label: string }> = {
  critical: { color: "#8b2020", label: "ALERT" },
  warning: { color: "#c45c00", label: "RISK" },
  info: { color: "#c9a227", label: "ALERT" },
  success: { color: "#78b956", label: "OPPORTUNITY" },
};

const defaultPriorities: Priority[] = [
  {
    id: "1",
    type: "alert",
    severity: "critical",
    title: "Coastal Living score dropped",
    description: "Perception category declined 12 points. Review needed.",
    action: "Take Action →",
    details: {
      why: "Perception scores below 60% correlate with 23% higher customer churn. Coastal Living's drop from 72 to 60 puts them at risk of losing market position.",
      actions: [
        "Schedule perception audit review",
        "Analyze customer feedback from last 30 days",
        "Compare messaging to top 3 competitors",
      ],
      sources: "GESTALT Benchmark Data, Customer NPS Trends, Competitor Analysis",
      confidence: 87,
    },
  },
  {
    id: "2",
    type: "opportunity",
    severity: "success",
    title: "Summit Fitness ready for upsell",
    description: "High engagement signals FOCUS audit timing.",
    action: "Take Action →",
    details: {
      why: "Companies at 16+ FRAMEWORK score with high engagement are 3x more likely to convert to FOCUS. Summit Fitness meets all criteria.",
      actions: [
        "Send FOCUS benefits email",
        "Schedule demo call",
        "Prepare ROI calculator",
      ],
      sources: "GESTALT Conversion Data, Engagement Analytics",
      confidence: 92,
    },
  },
  {
    id: "3",
    type: "risk",
    severity: "warning",
    title: "Nova Financial churn risk",
    description: "No activity in 14 days. 3 overdue milestones.",
    action: "Take Action →",
    details: {
      why: "14+ days of inactivity combined with overdue milestones indicates 67% probability of churn within 30 days.",
      actions: [
        "Personal outreach from account manager",
        "Offer strategy session",
        "Review contract terms",
      ],
      sources: "Engagement Analytics, Churn Model v2.3",
      confidence: 78,
    },
  },
  {
    id: "4",
    type: "alert",
    severity: "info",
    title: "Tom Zimmerman flight risk",
    description: "87% departure probability. Schedule 1:1.",
    action: "Take Action →",
    details: {
      why: "LinkedIn activity, declined assignments, and engagement drop are the top 3 predictors of departure. Combined probability: 87%.",
      actions: [
        "Schedule 1:1 within 48 hours",
        "Review compensation benchmarks",
        "Discuss career growth path",
      ],
      sources: "H.I.V.E. Analytics, LinkedIn Activity Monitor, HR Benchmark Data",
      confidence: 91,
    },
  },
];

function highlightNumbers(text: string) {
  const parts = text.split(/(\d+%?)/g);
  return parts.map((part, i) => {
    if (/^\d+%?$/.test(part)) {
      return (
        <span key={i} style={{ color: "var(--content-text1)", fontWeight: 600 }}>
          {part}
        </span>
      );
    }
    return part;
  });
}

function DraggablePriorityCard({
  priority,
  onTakeAction,
  isExpanded,
  onToggleExpand,
}: {
  priority: Priority;
  onTakeAction?: (priority: Priority) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `priority-${priority.id}`,
    data: {
      id: priority.id,
      type: "priority",
      widgetType: "alert",
      title: priority.title,
      data: {
        severity: priority.severity,
        description: priority.description,
        priorityType: priority.type,
        details: priority.details,
      },
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const config = severityConfig[priority.severity];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mx-3 mb-3"
    >
      <div
        className="relative group transition-all duration-200"
        style={{
          backgroundColor: "var(--content-card-bg)",
          border: "1px solid var(--content-border)",
          borderLeftWidth: "4px",
          borderLeftColor: config.color,
        }}
      >
        <div
          className="p-4 cursor-pointer"
          onClick={onToggleExpand}
        >
          <div
            {...attributes}
            {...listeners}
            className="absolute top-3 right-3 cursor-grab active:cursor-grabbing p-1 transition-colors opacity-50 group-hover:opacity-100"
            style={{ backgroundColor: "var(--content-hover-bg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" style={{ color: "var(--content-text3)" }} />
          </div>

          <div className="flex items-center justify-between mb-2 pr-8">
            <div
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: config.color,
              }}
            >
              {config.label}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" style={{ color: "var(--content-text3)" }} />
            ) : (
              <ChevronRight className="w-4 h-4" style={{ color: "var(--content-text3)" }} />
            )}
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--content-text1)",
              marginBottom: "8px",
              paddingRight: "24px",
            }}
          >
            {priority.title}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "var(--content-text2)",
              lineHeight: 1.5,
              marginBottom: isExpanded ? "0" : "12px",
            }}
          >
            {priority.description}
          </div>

          {!isExpanded && priority.action && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTakeAction?.(priority);
              }}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: config.color,
                padding: "6px 12px",
                border: `1px solid ${config.color}`,
                backgroundColor: "transparent",
              }}
            >
              {priority.action}
            </button>
          )}
        </div>

        {isExpanded && (
          <div
            className="px-4 pb-4 animate-fade-in"
            style={{ borderTop: "1px solid var(--content-border)" }}
          >
            <div className="pt-4">
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--content-text3)",
                  marginBottom: "8px",
                }}
              >
                WHY THIS MATTERS
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--content-text2)",
                  lineHeight: 1.6,
                }}
              >
                {highlightNumbers(priority.details.why)}
              </div>
            </div>

            <div className="pt-4">
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--content-text3)",
                  marginBottom: "8px",
                }}
              >
                RECOMMENDED ACTIONS
              </div>
              <ol className="space-y-2">
                {priority.details.actions.map((action, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2"
                    style={{
                      fontSize: "13px",
                      color: "var(--content-text2)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        color: "#c9a227",
                        fontWeight: 600,
                        minWidth: "16px",
                      }}
                    >
                      {idx + 1}.
                    </span>
                    {action}
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-4">
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--content-text3)",
                  marginBottom: "6px",
                }}
              >
                SOURCES
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--content-text3)",
                  lineHeight: 1.5,
                }}
              >
                {priority.details.sources}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "#c9a227",
                  backgroundColor: "rgba(201, 162, 39, 0.2)",
                  padding: "4px 10px",
                }}
              >
                {priority.details.confidence}% Confidence
              </div>

              {priority.action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTakeAction?.(priority);
                  }}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: config.color,
                    padding: "6px 12px",
                    border: `1px solid ${config.color}`,
                    backgroundColor: "transparent",
                  }}
                >
                  {priority.action}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AIPrioritiesPanel({
  priorities = defaultPriorities,
  onViewAll,
  onTakeAction,
}: AIPrioritiesPanelProps) {
  const [items] = useState(priorities);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <aside
      className="fixed right-0 top-0 h-full overflow-y-auto border-l flex flex-col"
      style={{
        width: "320px",
        backgroundColor: "var(--content-elevated-bg)",
        borderColor: "var(--content-border)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-4 border-b shrink-0"
        style={{ borderColor: "var(--content-border)" }}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" style={{ color: "#c9a227" }} />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#c9a227",
            }}
          >
            GESTALT INTELLIGENCE
          </span>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{ fontSize: "12px", color: "#c9a227" }}
          >
            View All
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex-1 py-3 overflow-y-auto">
        {items.map((priority) => (
          <DraggablePriorityCard
            key={priority.id}
            priority={priority}
            onTakeAction={onTakeAction}
            isExpanded={expandedId === priority.id}
            onToggleExpand={() => handleToggleExpand(priority.id)}
          />
        ))}
      </div>

      <div
        className="shrink-0 px-4 py-4 border-t"
        style={{ borderColor: "var(--content-border)" }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div
            className="p-3"
            style={{ backgroundColor: "var(--content-card-bg)", border: "1px solid var(--content-border)" }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "var(--content-text3)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "4px",
              }}
            >
              Critical
            </div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#8b2020" }}>
              {items.filter((p) => p.severity === "critical").length}
            </div>
          </div>
          <div
            className="p-3"
            style={{ backgroundColor: "var(--content-card-bg)", border: "1px solid var(--content-border)" }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "var(--content-text3)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "4px",
              }}
            >
              Opportunities
            </div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: "#78b956" }}>
              {items.filter((p) => p.severity === "success").length}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AIPrioritiesPanel;
