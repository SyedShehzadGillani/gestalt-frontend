import * as React from "react";
import { GripVertical, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type WidgetSize = "small" | "medium" | "large" | "wide";

export interface WidgetProps {
  title: string;
  icon?: React.ReactNode;
  size?: WidgetSize;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<WidgetSize, string> = {
  small: "col-span-1 min-h-[120px]",
  medium: "col-span-1 min-h-[200px]",
  large: "col-span-1 min-h-[320px]",
  wide: "col-span-2 min-h-[200px]",
};

export function Widget({
  title,
  icon,
  size = "medium",
  draggable = false,
  onDragStart,
  onDragEnd,
  actions,
  footer,
  children,
  className,
}: WidgetProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: 'var(--content-card-bg)',
        border: '1px solid var(--content-border)',
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Widget Header */}
      <div
        className="h-11 flex items-center px-4 shrink-0"
        style={{
          borderBottom: '1px solid var(--content-border)',
          backgroundColor: 'var(--content-widget-header-bg)',
        }}
      >
        {/* Left side: Drag handle + Icon + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {draggable && (
            <GripVertical
              className="w-4 h-4 cursor-grab shrink-0"
              style={{ color: 'var(--content-text3)' }}
            />
          )}
          {icon && (
            <span className="text-gold shrink-0 [&>svg]:w-5 [&>svg]:h-5">
              {icon}
            </span>
          )}
          <span
            className="text-[12px] font-medium tracking-[0.1em] uppercase truncate"
            style={{ color: 'var(--content-text3)' }}
          >
            {title}
          </span>
        </div>

        {/* Right side: Actions */}
        {actions ? (
          <div className="shrink-0">{actions}</div>
        ) : (
          <button className="p-1 hover:opacity-80 transition-colors shrink-0">
            <MoreVertical className="w-4 h-4" style={{ color: 'var(--content-text3)' }} />
          </button>
        )}
      </div>

      {/* Widget Content */}
      <div className="flex-1 p-4 overflow-auto">
        {children}
      </div>

      {/* Widget Footer (optional) */}
      {footer && (
        <div
          className="px-4 py-3 shrink-0"
          style={{
            borderTop: '1px solid var(--content-border)',
            backgroundColor: 'var(--content-widget-footer-bg)',
          }}
        >
          <div className="text-[12px]" style={{ color: 'var(--content-text3)' }}>
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}

Widget.displayName = "Widget";
