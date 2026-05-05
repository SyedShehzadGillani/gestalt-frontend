import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export interface WidgetDragData {
  id: string;
  type: "widget" | "priority";
  widgetType: "score" | "stat" | "alert" | "list" | "chart" | "progress" | "spectrum";
  title: string;
  data: Record<string, unknown>;
}

interface DraggableWidgetProps {
  id: string;
  widgetType: WidgetDragData["widgetType"];
  title: string;
  data: Record<string, unknown>;
  children: React.ReactNode;
}

export function DraggableWidget({
  id,
  widgetType,
  title,
  data,
  children,
}: DraggableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `widget-${id}`,
    data: {
      id,
      type: "widget",
      widgetType,
      title,
      data,
    } as WidgetDragData,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 right-12 z-10 cursor-grab active:cursor-grabbing p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          backgroundColor: "var(--content-card-bg)",
          border: "1px solid var(--content-border)",
        }}
      >
        <GripVertical className="w-4 h-4" style={{ color: "var(--content-text3)" }} />
      </div>
      {children}
    </div>
  );
}

export default DraggableWidget;
