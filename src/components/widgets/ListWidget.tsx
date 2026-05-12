import * as React from "react";
import { Widget } from "./Widget";

interface ListItem {
  icon?: React.ReactNode;
  avatar?: string;
  title: string;
  subtitle?: string;
  badge?: { text: string; color: string };
  timestamp?: string;
}

export interface ListWidgetProps {
  title: string;
  icon?: React.ReactNode;
  items: ListItem[];
  maxItems?: number;
  emptyMessage?: string;
  onViewAll?: () => void;
  onItemClick?: (item: ListItem, index: number) => void;
  className?: string;
}

export function ListWidget({
  title,
  icon,
  items,
  maxItems = 5,
  emptyMessage = "No items to display",
  onViewAll,
  onItemClick,
  className,
}: ListWidgetProps) {
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
        {visibleItems.map((item, index) => (
          <div
            key={index}
            onClick={() => onItemClick?.(item, index)}
            className="flex items-center gap-3 transition-colors"
            style={{
              padding: "12px 0",
              borderBottom: index < visibleItems.length - 1 ? "1px solid var(--content-border)" : "none",
              cursor: onItemClick ? "pointer" : "default",
              margin: "0 -16px",
              paddingLeft: "16px",
              paddingRight: "16px",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              if (onItemClick) {
                e.currentTarget.style.backgroundColor = "var(--content-hover-bg)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {item.avatar ? (
              <div
                className="flex-shrink-0 bg-cover bg-center"
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundImage: `url(${item.avatar})`,
                  backgroundColor: "var(--content-border)",
                }}
              />
            ) : item.icon ? (
              <span
                className="flex items-center justify-center flex-shrink-0 [&>svg]:w-6 [&>svg]:h-6"
                style={{ 
                  width: "24px", 
                  height: "24px",
                  color: "#c9a227" 
                }}
              >
                {item.icon}
              </span>
            ) : null}

            <div className="flex-1 min-w-0">
              <div
                className="truncate"
                style={{
                  fontSize: "14px",
                  color: "var(--content-text1)",
                }}
              >
                {item.title}
              </div>
              {item.subtitle && (
                <div
                  className="truncate"
                  style={{ fontSize: "13px", color: "var(--content-text2)" }}
                >
                  {item.subtitle}
                </div>
              )}
            </div>

            {item.badge && (
              <span
                className="flex-shrink-0"
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  padding: "3px 8px",
                  borderRadius: "9999px",
                  backgroundColor: `${item.badge.color}33`,
                  color: item.badge.color,
                  textTransform: "uppercase",
                }}
              >
                {item.badge.text}
              </span>
            )}

            {item.timestamp && (
              <span
                className="flex-shrink-0"
                style={{ fontSize: "12px", color: "var(--content-text3)" }}
              >
                {item.timestamp}
              </span>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div
            className="text-center py-8"
            style={{ fontSize: "14px", color: "var(--content-text3)" }}
          >
            {emptyMessage}
          </div>
        )}
      </div>
    </Widget>
  );
}

ListWidget.displayName = "ListWidget";
