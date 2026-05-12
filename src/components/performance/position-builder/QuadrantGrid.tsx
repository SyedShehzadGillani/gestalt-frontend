import { X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Quadrant, QuadrantCriteria } from "@/lib/position-builder-types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface QuadrantGridProps {
  quadrants: Record<Quadrant["id"], Quadrant>;
  activeQuadrantId: Quadrant["id"] | null;
  onSelectQuadrant: (id: Quadrant["id"]) => void;
  onRemoveCriteria?: (quadrantId: Quadrant["id"], criteriaId: string) => void;
  onUpdateDefinition?: (quadrantId: Quadrant["id"], criteriaId: string, definition: string) => void;
  onSelectCriteria?: (criteriaId: string | null) => void;
  onReorderCriteria?: (quadrantId: Quadrant["id"], newOrder: QuadrantCriteria[]) => void;
  selectedCriteriaId?: string | null;
  patientLabel: string;
  staffLabel: string;
  onPatientLabelChange: (label: string) => void;
  onStaffLabelChange: (label: string) => void;
  positionName?: string;
}

const MAX_CRITERIA_PER_QUADRANT = 5;
const QUADRANT_IDS: Quadrant["id"][] = ["PERSONAL", "PATIENT", "STAFF", "KNOWLEDGE"];

const getCellStyles = (qId: Quadrant["id"], hasCriteria: boolean, isActive: boolean, isSelected: boolean, isDragging: boolean = false) => {
  const baseStyles = "h-8 w-full rounded-[2px] flex items-center text-center transition-all relative";
  
  const dragStyles = isDragging ? "opacity-90 shadow-lg z-50" : "";
  
  switch (qId) {
    case "PERSONAL":
      return cn(baseStyles, hasCriteria 
        ? "border border-white text-white font-semibold" 
        : "bg-transparent border border-white/40",
        hasCriteria && "hover:bg-white/15",
        isSelected ? "bg-white/25" : "",
        "hover:border-white",
        isActive && "border-white",
        dragStyles);
    case "PATIENT":
      return cn(baseStyles, hasCriteria 
        ? "border border-orange-500 text-orange-500 font-semibold" 
        : "bg-transparent border border-orange-500/40",
        hasCriteria && "hover:bg-orange-500/15",
        isSelected ? "bg-orange-500/20" : "",
        "hover:border-orange-500",
        isActive && "border-orange-500",
        dragStyles);
    case "STAFF":
      return cn(baseStyles, hasCriteria 
        ? "border border-yellow-400 text-yellow-400 font-semibold" 
        : "bg-transparent border border-yellow-400/40",
        hasCriteria && "hover:bg-yellow-400/15",
        isSelected ? "bg-yellow-400/25" : "",
        "hover:border-yellow-400",
        isActive && "border-yellow-400",
        dragStyles);
    case "KNOWLEDGE":
      return cn(baseStyles, hasCriteria 
        ? "border border-indigo-500 text-indigo-400 font-semibold" 
        : "bg-transparent border border-indigo-500/40",
        hasCriteria && "hover:bg-indigo-500/15",
        isSelected ? "bg-indigo-500/25" : "",
        "hover:border-indigo-500",
        isActive && "border-indigo-500",
        dragStyles);
    default:
      return cn(baseStyles, "bg-transparent border border-border/50", dragStyles);
  }
};

const getRemoveButtonColor = (qId: Quadrant["id"]) => {
  switch (qId) {
    case "PERSONAL":
      return "text-white hover:text-white/70";
    case "PATIENT":
      return "text-orange-500 hover:text-orange-400";
    case "STAFF":
      return "text-yellow-400 hover:text-yellow-300";
    case "KNOWLEDGE":
      return "text-indigo-500 hover:text-indigo-400";
    default:
      return "text-muted-foreground";
  }
};

const getDragHandleColor = (qId: Quadrant["id"]) => {
  switch (qId) {
    case "PERSONAL":
      return "text-white/50 hover:text-white";
    case "PATIENT":
      return "text-orange-500/50 hover:text-orange-500";
    case "STAFF":
      return "text-yellow-400/50 hover:text-yellow-400";
    case "KNOWLEDGE":
      return "text-indigo-400/50 hover:text-indigo-400";
    default:
      return "text-muted-foreground";
  }
};

interface SortableCriteriaItemProps {
  criteria: QuadrantCriteria;
  quadrantId: Quadrant["id"];
  isActive: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function SortableCriteriaItem({
  criteria,
  quadrantId,
  isActive,
  isSelected,
  onSelect,
  onRemove,
}: SortableCriteriaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: criteria.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={cn(
        getCellStyles(quadrantId, true, isActive, isSelected, isDragging),
        "cursor-pointer bg-black/15"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-2 p-1 cursor-grab active:cursor-grabbing transition-colors",
          getDragHandleColor(quadrantId)
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-sm tracking-wide truncate px-8 text-left">
        {criteria.label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={cn(
          "absolute right-3 p-1 transition-colors",
          getRemoveButtonColor(quadrantId)
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface QuadrantColumnProps {
  quadrantId: Quadrant["id"];
  criteria: QuadrantCriteria[];
  isActiveQuadrant: boolean;
  selectedCriteriaId: string | null | undefined;
  onSelectQuadrant: () => void;
  onSelectCriteria: (id: string | null) => void;
  onRemoveCriteria: (criteriaId: string) => void;
  onReorder: (newOrder: QuadrantCriteria[]) => void;
}

function QuadrantColumn({
  quadrantId,
  criteria,
  isActiveQuadrant,
  selectedCriteriaId,
  onSelectQuadrant,
  onSelectCriteria,
  onRemoveCriteria,
  onReorder,
}: QuadrantColumnProps) {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = criteria.findIndex((c) => c.id === active.id);
      const newIndex = criteria.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(criteria, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  const emptySlots = MAX_CRITERIA_PER_QUADRANT - criteria.length;

  return (
    <div className="flex flex-col gap-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={criteria.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {criteria.map((c) => (
            <SortableCriteriaItem
              key={c.id}
              criteria={c}
              quadrantId={quadrantId}
              isActive={isActiveQuadrant}
              isSelected={selectedCriteriaId === c.id}
              onSelect={() => {
                onSelectQuadrant();
                onSelectCriteria(c.id);
              }}
              onRemove={() => {
                if (selectedCriteriaId === c.id) {
                  onSelectCriteria(null);
                }
                onRemoveCriteria(c.id);
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      {/* Empty slots */}
      {Array.from({ length: emptySlots }, (_, idx) => (
        <div
          key={`empty-${quadrantId}-${idx}`}
          onClick={() => {
            onSelectQuadrant();
            onSelectCriteria(null);
          }}
          className={cn(
            getCellStyles(quadrantId, false, isActiveQuadrant, false),
            "cursor-pointer"
          )}
        />
      ))}
    </div>
  );
}

export function QuadrantGrid({
  quadrants,
  activeQuadrantId,
  onSelectQuadrant,
  onRemoveCriteria,
  onSelectCriteria,
  onReorderCriteria,
  selectedCriteriaId,
}: QuadrantGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {QUADRANT_IDS.map((qId) => (
        <QuadrantColumn
          key={qId}
          quadrantId={qId}
          criteria={quadrants[qId].criteria}
          isActiveQuadrant={activeQuadrantId === qId}
          selectedCriteriaId={selectedCriteriaId}
          onSelectQuadrant={() => onSelectQuadrant(qId)}
          onSelectCriteria={(id) => onSelectCriteria?.(id)}
          onRemoveCriteria={(criteriaId) => onRemoveCriteria?.(qId, criteriaId)}
          onReorder={(newOrder) => onReorderCriteria?.(qId, newOrder)}
        />
      ))}
    </div>
  );
}

export { MAX_CRITERIA_PER_QUADRANT };
