import { useEffect, useRef, useState } from "react";

export interface SpectrumEntity {
  id: string;
  name: string;
  /** Hex color (e.g. `#7c3aed`). `self` and `self_vision` use gold marker styling. */
  color: string;
}

export interface AuditPlacement {
  entityId: string;
  specId: string;
  position: number;
}

interface Props {
  specId: string;
  label: string;
  entities: SpectrumEntity[];
  /** keyed `${specId}_${entityId}` → 0-100 position. */
  placements: Record<string, number>;
  auditPlacements: AuditPlacement[];
  onPlace: (specId: string, entityId: string, pos: number) => void;
  locked: boolean;
  /** When set, clicking the bar places this entity (crosshair mode). */
  placingId: string | null;
}

const ZONES = [
  { label: "STATUS QUO", start: 0, end: 24 },
  { label: "LEADING EDGE", start: 25, end: 49 },
  { label: "CUTTING EDGE", start: 50, end: 74 },
  { label: "BLEEDING EDGE", start: 75, end: 100 },
];

/**
 * Drag-to-place spectrum canvas with 100-increment positioning, click-to-place
 * crosshair mode, and audit heat-map overlay (individual ticks + computed
 * average lines). Direct port of source `SpectrumCanvas`
 * (GPS-FORMULA-04-19-v80.jsx lines 1036–1162).
 */
export function SpectrumCanvas({
  specId,
  label,
  entities,
  placements,
  auditPlacements,
  onPlace,
  locked,
  placingId,
}: Props) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<number | null>(null);

  const getPos = (clientX: number) => {
    const r = barRef.current?.getBoundingClientRect();
    if (!r) return 0;
    return Math.max(0, Math.min(100, Math.round(((clientX - r.left) / r.width) * 100)));
  };

  const handleMouseDown = (e: React.MouseEvent, entityId: string) => {
    if (locked) return;
    e.preventDefault();
    setDragging(entityId);
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => onPlace(specId, dragging, getPos(e.clientX));
    const up = () => setDragging(null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, specId]);

  // Heat map: group audit placements by entity
  const heatByEntity: Record<string, number[]> = {};
  auditPlacements.forEach((p) => {
    if (!heatByEntity[p.entityId]) heatByEntity[p.entityId] = [];
    heatByEntity[p.entityId].push(p.position);
  });

  const description =
    specId === "inno"
      ? "Where does each company compete in terms of innovation?"
      : "How do customers experience each company?";

  return (
    <div className="mb-10">
      <div className="text-foreground text-[13px] font-extrabold tracking-[2px] mb-1">{label}</div>
      <div className="text-muted-foreground text-[10px] mb-4">{description}</div>

      {/* Zone labels */}
      <div className="grid grid-cols-4 gap-0.5 mb-1">
        {ZONES.map((z) => (
          <div
            key={z.label}
            className="text-center px-1 py-1 bg-transparent border border-gold/20"
          >
            <span className="text-gold/60 text-[7px] font-bold tracking-[1.5px]">{z.label}</span>
          </div>
        ))}
      </div>

      {/* The bar */}
      <div
        ref={barRef}
        onClick={(e) => {
          if (!placingId || locked) return;
          onPlace(specId, placingId, getPos(e.clientX));
        }}
        onMouseMove={(e) => setHoverPos(getPos(e.clientX))}
        onMouseLeave={() => setHoverPos(null)}
        className={`relative h-14 bg-card border border-border ${
          placingId && !locked ? "cursor-crosshair" : "cursor-default"
        }`}
      >
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(93,20,20,0.15) 0%, rgba(196,92,0,0.15) 25%, rgba(226,181,63,0.15) 50%, rgba(120,185,86,0.15) 100%)",
          }}
        />

        {/* Zone dividers */}
        {[25, 50, 75].map((p) => (
          <div
            key={p}
            className="absolute top-0 bottom-0 w-px bg-white/[0.06] pointer-events-none"
            style={{ left: `${p}%` }}
          />
        ))}

        {/* Hover guide */}
        {placingId && hoverPos !== null && (
          <div
            className="absolute top-0 bottom-0 w-px bg-gold/40 pointer-events-none"
            style={{ left: `${hoverPos}%` }}
          />
        )}

        {/* Heat map ticks */}
        {Object.entries(heatByEntity).map(([eid, positions]) => {
          const entity = entities.find((e) => e.id === eid);
          if (!entity) return null;
          return positions.map((pos, i) => (
            <div
              key={`${eid}-${i}`}
              className="absolute top-1 bottom-1 w-0.5 pointer-events-none -translate-x-px"
              style={{
                left: `${pos}%`,
                background:
                  entity.id === "self" ? "rgba(226,181,63,0.25)" : `${entity.color}40`,
              }}
            />
          ));
        })}

        {/* Average lines */}
        {Object.entries(heatByEntity).map(([eid, positions]) => {
          const entity = entities.find((e) => e.id === eid);
          if (!entity || positions.length < 2) return null;
          const avg = Math.round(positions.reduce((a, b) => a + b, 0) / positions.length);
          const isSelf = entity.id === "self" || entity.id === "self_vision";
          return (
            <div
              key={`avg-${eid}`}
              className="absolute top-0 bottom-0 w-0.5 pointer-events-none -translate-x-px opacity-80"
              style={{
                left: `${avg}%`,
                background: isSelf ? "hsl(var(--gold))" : entity.color,
              }}
            >
              <div
                className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 text-[6px] font-extrabold whitespace-nowrap"
                style={{ color: isSelf ? "hsl(var(--gold))" : entity.color }}
              >
                AVG {avg}
              </div>
            </div>
          );
        })}

        {/* Entity markers */}
        {entities.map((entity) => {
          const pos = placements[`${specId}_${entity.id}`];
          if (pos === undefined || pos === null) return null;
          const isSelf = entity.id === "self";
          const isVision = entity.id === "self_vision";
          return (
            <div
              key={entity.id}
              onMouseDown={(e) => handleMouseDown(e, entity.id)}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: `${pos}%`,
                width: 16,
                height: 16,
                background: isVision ? "hsl(var(--gold))" : isSelf ? "transparent" : entity.color,
                border: isSelf
                  ? "2.5px solid hsl(var(--gold))"
                  : isVision
                    ? "none"
                    : `2px solid ${entity.color}`,
                borderRadius: isSelf || isVision ? 0 : "50%",
                cursor: locked ? "default" : "grab",
                boxShadow: `0 0 0 2px ${isSelf || isVision ? "hsl(var(--gold))" : entity.color}30`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
