import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X, Unlink, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell } from "recharts";
import { CLINIC_NAMES } from "@/lib/clinics";
import { Link, useParams } from "react-router-dom";

type Quadrant = { name: string; value: number; color: string };

interface EmployeeLite {
  id: string;
  name: string;
  role: string;
  quadrants: Quadrant[];
  previousReviewChange: number;
  image?: string | null;
  productivityScore?: number;
  hiredDate?: string;
  hiredBy?: string;
  previousPosition?: string;
  clinicManager?: string;
  daysEmployed?: number;
}

export function SortableEmployeeDetailCard({
  employee,
  clinicId,
  index,
  onRemove,
  onUnlink,
}: {
  employee: EmployeeLite;
  clinicId?: string;
  index?: number;
  onRemove?: () => void;
  onUnlink?: () => void;
}) {
  const { id: clientId } = useParams<{ id: string }>();
  const positionBuilderPath = `/client/${clientId}/hive/position-builder?employee=${employee.id}`;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: employee.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const current =
    Math.round(employee.quadrants?.reduce((s, q) => s + (q?.value ?? 0), 0)) || 0;
  const prev = Math.max(0, Math.min(100, current - (employee.previousReviewChange ?? 0)));
  const delta = current - prev;

  const deltaClass =
    delta > 0
      ? "text-[hsl(var(--chart-success))]"
      : delta < 0
        ? "text-[hsl(var(--chart-error))]"
        : "text-[hsl(var(--muted-foreground))]";

  const perfClass =
    delta > 0
      ? "text-[hsl(var(--chart-success))]"
      : delta < 0
        ? "text-[hsl(var(--chart-error))]"
        : "text-[hsl(var(--muted-foreground))]";

  const sparklineColor = delta > 0 ? "hsl(var(--chart-success))" : delta < 0 ? "hsl(var(--chart-error))" : "hsl(var(--muted-foreground))";

  const trendData = React.useMemo(() => {
    const p = [prev, Math.max(0, Math.round(prev + delta / 2)), current];
    return p.map(v => Math.max(0, Math.min(100, v)));
  }, [prev, current, delta]);

  const sparkPoints = React.useMemo(() => {
    const h = 40; // Increased height for more detailed sparkline
    const step = 24; // 3 points across 48px width (matching image width)
    const points = trendData.map((v, i) => {
      const y = h - (v / 100) * 36; // 2px padding top/bottom
      const x = i * step;
      return `${x},${y}`;
    });
    return points.join(" ");
  }, [trendData]);

  const daysLate = 11;
  const daysClass = daysLate > 0 ? "text-[hsl(var(--chart-error))]" : "text-[hsl(var(--muted-foreground))]";

  // Mock data for the new fields
  const hiredDate = employee.hiredDate || "2019";
  const hiredBy = employee.hiredBy || "Dr. Sarah Johnson";
  const previousPosition = employee.previousPosition || "Medical Assistant";
  const clinicManager = employee.clinicManager || "Jennifer Smith";
  const daysEmployed = employee.daysEmployed || 1825; // ~5 years

  const initials = React.useMemo(() => {
    const parts = (employee.name || "").split(" ");
    const letters = parts.map((p) => p?.[0]).filter(Boolean).slice(0, 2).join("");
    return letters.toUpperCase() || "U";
  }, [employee.name]);

  const donutData = React.useMemo(
    () => (employee.quadrants ?? []).map((q) => ({ name: q.name, value: q.value ?? 0, color: q.color })),
    [employee.quadrants]
  );

  const clinicName = React.useMemo(() => {
    if (!clinicId) return undefined;
    const match = /clinic-(\d+)/.exec(clinicId);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      return CLINIC_NAMES[idx];
    }
    return undefined;
  }, [clinicId]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-black/75 rounded-md px-4 py-3 grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center text-foreground ${current < 50 ? 'bg-[#1b0b11]/75' : ''}`}
    >
      {/* Left section: Index + Drag Icon + Employee Image + Info */}
      <div className="flex items-center gap-3">
        {/* Index and Drag Icon (stacked vertically) */}
        <div className="flex flex-col items-center gap-1">
          {typeof index === "number" && (
            <div className="w-6 text-center text-[10px] tabular-nums text-[hsl(var(--muted-foreground))]">
              {index}
            </div>
          )}
          <div
            {...attributes}
            {...listeners}
            className="w-6 h-6 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-foreground cursor-grab active:cursor-grabbing"
            aria-label="Drag"
            title="Drag to reorder"
          >
            <GripVertical size={12} />
          </div>
        </div>

        {/* Employee Avatar */}
        <Avatar className="h-14 w-14 rounded-md">
          <AvatarImage className="rounded-md" src={employee.image ?? undefined} alt={`${employee.name} avatar`} />
          <AvatarFallback className="text-[10px] rounded-md">{initials}</AvatarFallback>
        </Avatar>

        {/* Employee Info */}
        <div className="min-w-0">
          <div className="text-sm font-medium text-white uppercase">{employee.name}</div>
          <div className="text-xs text-white/50 uppercase">{employee.role}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/25">{clinicName ?? "Unlinked"}</span>
            <Link 
              to={positionBuilderPath}
              className="inline-flex items-center gap-1 text-[10px] text-[#c9a227] hover:text-[#e0b82e] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Open Review</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Center section: Performance data and columns */}
      <div className="flex items-center gap-4">
        {/* Donut Chart (scaled to match image size) */}
        <div className="w-12 h-12 relative">
          <PieChart width={48} height={48}>
            <Pie
              data={donutData}
              dataKey="value"
              nameKey="name"
              innerRadius={16}
              outerRadius={22}
              stroke="transparent"
              isAnimationActive={false}
            >
              {donutData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-semibold tabular-nums ${perfClass}`}>{current}</span>
          </div>
        </div>

        {/* Larger Sparkline */}
        <div className="flex flex-col items-center gap-1">
          <svg width="48" height="40" viewBox="0 0 48 40" style={{ color: sparklineColor }}>
            <polyline fill="none" stroke="currentColor" strokeWidth="2" points={sparkPoints} />
          </svg>
        </div>

        {/* Trend Score */}
        <div className={`text-sm font-medium tabular-nums ${deltaClass}`}>
          {delta >= 0 ? `+${delta}` : delta}
        </div>

        {/* Data Columns */}
        <div className="flex gap-8">
          {/* Column 1 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] text-right w-16 uppercase">HIRED:</span>
              <span className="ml-2 text-xs font-bold text-white">{hiredDate}</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] text-right w-16 uppercase">POSITION:</span>
              <span className="ml-2 text-xs font-bold text-white">{employee.role}</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] text-right w-16 uppercase">HIRED BY:</span>
              <span className="ml-2 text-xs font-bold text-white">{hiredBy}</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] text-right w-24 uppercase">DAYS LATE:</span>
              <span className={`ml-2 text-xs font-bold ${daysClass}`}>{daysLate}</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] text-right w-24 uppercase">PREV POSITION:</span>
              <span className="ml-2 text-xs font-bold text-white">{previousPosition}</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] text-right w-24 uppercase">CLINIC MGR:</span>
              <span className="ml-2 text-xs font-bold text-white">{clinicManager}</span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] text-right w-24 uppercase">DAYS EMPLOYED:</span>
              <span className="ml-2 text-xs font-bold text-white">{daysEmployed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unlink button column */}
      <div className="w-8 flex justify-center">
        {clinicId && onUnlink && (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 text-[hsl(var(--muted-foreground))] hover:text-white" 
            aria-label="Unlink from clinic"
            onClick={onUnlink}
          >
            <Unlink size={12} />
          </Button>
        )}
      </div>
      
      {/* X Button column */}
      <div className="w-8 flex justify-center">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6 text-[hsl(var(--muted-foreground))] hover:text-white" 
          aria-label="Remove"
          onClick={onRemove}
        >
          <X size={12} />
        </Button>
      </div>
    </div>
  );

}

export default SortableEmployeeDetailCard;
