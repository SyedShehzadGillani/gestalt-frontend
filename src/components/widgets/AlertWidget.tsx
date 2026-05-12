import * as React from "react";
import { AlertTriangle, AlertCircle, Info, Sparkles } from "lucide-react";
import { Widget } from "./Widget";

type Severity = "critical" | "warning" | "info" | "opportunity";

interface AlertItem {
  title: string;
  description: string;
  meta?: string;
}

export interface AlertWidgetProps {
  title: string;
  severity: Severity;
  items: AlertItem[];
  maxItems?: number;
  onViewAll?: () => void;
  className?: string;
}

const severityConfig: Record<Severity, { 
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}> = {
  critical: {
    icon: AlertTriangle,
    color: "#8b2020",
  },
  warning: {
    icon: AlertCircle,
    color: "#c45c00",
  },
  info: {
    icon: Info,
    color: "#3b82f6",
  },
  opportunity: {
    icon: Sparkles,
    color: "#78b956",
  },
};

export function AlertWidget({
  title,
  severity,
  items,
  maxItems = 3,
  onViewAll,
  className,
}: AlertWidgetProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;
  const visibleItems = items.slice(0, maxItems);
  const hasMore = items.length > maxItems;

  return (
    <Widget
      title={title}
      icon={<Icon className="w-5 h-5" style={{ color: config.color }} />}
      size="medium"
      className={className}
      actions={
        <div
          className="flex items-center justify-center"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "9999px",
            backgroundColor: config.color,
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          {items.length}
        </div>
      }
      footer={
        onViewAll ? (
          <button
            onClick={onViewAll}
            className="hover:opacity-80 transition-opacity"
            style={{ color: "#c9a227", fontSize: "13px" }}
          >
            View all alerts →
          </button>
        ) : undefined
      }
    >
      <div>
        {visibleItems.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #1a1a1a",
              borderLeftWidth: "3px",
              borderLeftColor: config.color,
              padding: "12px",
              marginBottom: index < visibleItems.length - 1 ? "8px" : 0,
            }}
          >
            {/* Item Title with Bullet */}
            <div className="flex items-start gap-2">
              <span
                style={{
                  color: config.color,
                  fontSize: "8px",
                  lineHeight: "20px",
                }}
              >
                ●
              </span>
              <div className="flex-1">
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#ffffff",
                  }}
                >
                  {item.title}
                </div>

                {/* Item Description */}
                <div
                  className="mt-1"
                  style={{ fontSize: "13px", color: "#a0a0a0" }}
                >
                  {item.description}
                </div>

                {/* Item Meta */}
                {item.meta && (
                  <div
                    className="mt-2"
                    style={{ fontSize: "12px", color: config.color }}
                  >
                    {item.meta}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div
            className="text-center py-6"
            style={{ fontSize: "13px", color: "#666666" }}
          >
            No {severity} alerts
          </div>
        )}
      </div>
    </Widget>
  );
}

AlertWidget.displayName = "AlertWidget";
