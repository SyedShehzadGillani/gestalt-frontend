import * as React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Slide } from "./PresentationPanel";
import type { WidgetDragData } from "./DraggableWidget";

interface CommandCenterContextValue {
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  addSlide: (widgetData: WidgetDragData) => void;
  removeSlide: (id: string) => void;
  isPanelExpanded: boolean;
  setIsPanelExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isDragging: boolean;
  activeId: string | null;
}

const CommandCenterContext = createContext<CommandCenterContextValue | null>(null);

export function useCommandCenter() {
  const context = useContext(CommandCenterContext);
  if (!context) {
    throw new Error("useCommandCenter must be used within CommandCenterProvider");
  }
  return context;
}

interface CommandCenterProviderProps {
  children: React.ReactNode;
}

export function CommandCenterProvider({ children }: CommandCenterProviderProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<WidgetDragData | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSlide = useCallback((widgetData: WidgetDragData) => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      widgetType: widgetData.widgetType,
      widgetTitle: widgetData.title,
      data: widgetData.data,
    };
    setSlides((prev) => [...prev, newSlide]);
  }, []);

  const removeSlide = useCallback((id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setIsDragging(true);
    
    // Auto-expand panel when dragging starts
    if (active.data.current?.type === "widget" || active.data.current?.type === "priority") {
      setIsPanelExpanded(true);
    }

    if (active.data.current) {
      setActiveData(active.data.current as WidgetDragData);
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Could add visual feedback for valid drop targets here
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveData(null);
    setIsDragging(false);

    if (!over) return;

    // Handle dropping on the presentation panel
    if (over.id === "presentation-drop-zone") {
      const data = active.data.current;
      if (data && (data.type === "widget" || data.type === "priority")) {
        addSlide({
          id: data.id || (active.id as string),
          type: data.type,
          widgetType: data.widgetType || "stat",
          title: data.title || "Untitled",
          data: data.data || {},
        });
      }
    }
  }, [addSlide]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveData(null);
    setIsDragging(false);
  }, []);

  return (
    <CommandCenterContext.Provider
      value={{
        slides,
        setSlides,
        addSlide,
        removeSlide,
        isPanelExpanded,
        setIsPanelExpanded,
        isDragging,
        activeId,
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {children}

        {/* Drag Overlay - Ghost preview */}
        <DragOverlay>
          {activeData && (
            <div
              style={{
                width: "200px",
                padding: "12px 16px",
                backgroundColor: "#141414",
                border: "2px solid #c9a227",
                opacity: 0.9,
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#c9a227",
                  marginBottom: "4px",
                }}
              >
                {activeData.widgetType || "Widget"}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#ffffff",
                }}
              >
                {activeData.title || "Untitled"}
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </CommandCenterContext.Provider>
  );
}

export default CommandCenterProvider;
