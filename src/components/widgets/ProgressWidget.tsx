import * as React from "react";
import { Widget } from "./Widget";

type ProgressStatus = "on-track" | "at-risk" | "overdue" | "complete";

interface ProgressItem {
  name: string;
  progress: number;
  status: ProgressStatus;
  dueDate?: string;
}

export interface ProgressWidgetProps {
  title: string;
  icon?: React.ReactNode;
  items: ProgressItem[];
  maxItems?: number;
  onViewAll?: () => void;
  onItemClick?: (item: ProgressItem, index: number) => void;
  className?: string;
}

const statusConfig: Record<ProgressStatus, { 
  color: string; 
  bgColor: string;
  label: string;
}> = {
  "on-track": {
    color: "#78b956",
    bgColor: "rgba(120, 185, 86, 0.2)",
    label: "On Track",
  },
  "at-risk": {
    color: "#c45c00",
    bgColor: "rgba(196, 92, 0, 0.2)",
    label: "At Risk",
  },
  "overdue": {
    color: "#8b2020",
    bgColor: "rgba(139, 32, 32, 0.2)",
    label: "Overdue",
  },
  "complete": {
    color: "#78b956",
    bgColor: "rgba(120, 185, 86, 0.2)",
    label: "Complete",
  },
};

export function ProgressWidget({
  title,
  icon,
  items,
  maxItems = 4,
  onViewAll,
  onItemClick,
  className,
}: ProgressWidgetProps) {
  const visibleItems = items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  return (
    <Widget
      title={title}
      icon={icon}
      size="medium"
      className={className}
      footer={
        hasMore && onViewAll ? (
          <button
            onClick={onViewAll}
            className="hover:opacity-80 transition-opacity"
            style={{ color: "#c9a227", fontSize: "13px" }}
          >
            View all {items.length} items →
          </button>
        ) : undefined
      }
    >
      <div>
        {visibleItems.map((item, index) => {
          const config = statusConfig[item.status];

          return (
            <div
              key={index}
              onClick={() => onItemClick?.(item, index)}
              className="transition-colors"
              style={{
                padding: "12px 0",
                borderBottom:
                  index < visibleItems.length - 1
                    ? "1px solid var(--content-border)"
                    : "none",
                cursor: onItemClick ? "pointer" : "default",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--content-text1)",
                  }}
                >
                  {item.name}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    backgroundColor: config.bgColor,
                    color: config.color,
                  }}
                >
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex-1"
                  style={{ 
                    height: "6px",
                    backgroundColor: "var(--content-bar-track)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, Math.max(0, item.progress))}%`,
                      backgroundColor: config.color,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--content-text2)",
                    minWidth: "32px",
                  }}
                >
                  {item.progress}%
                </span>
                {item.dueDate && (
                  <span style={{ fontSize: "12px", color: "var(--content-text3)" }}>
                    {item.dueDate}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div
            className="text-center py-8"
            style={{ fontSize: "14px", color: "var(--content-text3)" }}
          >
            No items to track
          </div>
        )}
      </div>
    </Widget>
  );
}

ProgressWidget.displayName = "ProgressWidget";
