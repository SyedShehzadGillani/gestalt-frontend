import { SpectrumCanvas } from "@/components/formula/SpectrumCanvas";
import type {
  AuditPlacement,
  SpectrumEntity,
} from "@/components/formula/SpectrumCanvas";
import type { CompetitorMock } from "@/components/formula/formula-data";

interface LockData {
  timestamp: string;
  version: number;
  authority: string;
}

interface Props {
  competitors: CompetitorMock[];
  placements: Record<string, number>;
  auditPlacements: AuditPlacement[];
  placing: string | null;
  onSetPlacing: (id: string | null) => void;
  onPlace: (specId: string, entityId: string, pos: number) => void;
  authorityName: string;
  onSetAuthority: (v: string) => void;
  locked: boolean;
  lockData: LockData | null;
  onLock: () => void;
  onUnlock: () => void;
  onBack: () => void;
  onNext: () => void;
}

/**
 * Step 6 — Spectrum Placement. Two SpectrumCanvas instances (INNOVATION,
 * CUSTOMER-CENTRIC). User selects an entity and clicks/drags to place.
 * Locks under a named authority. Direct port of source Step 6 (lines
 * 4511–4582).
 */
export function CompetitiveStepSpectrum({
  competitors,
  placements,
  auditPlacements,
  placing,
  onSetPlacing,
  onPlace,
  authorityName,
  onSetAuthority,
  locked,
  lockData,
  onLock,
  onUnlock,
  onBack,
  onNext,
}: Props) {
  const allEntities: SpectrumEntity[] = [
    ...competitors.map((c) => ({ id: c.id, name: c.name, color: c.color })),
    { id: "self", name: "TODAY", color: "hsl(var(--gold))" },
    { id: "self_vision", name: "VISION", color: "hsl(var(--gold))" },
  ];

  return (
    <div className="bg-card border border-border p-6 mb-5">
      <div className="text-foreground text-[20px] font-black tracking-[2px] mb-2">
        STEP 6 — SPECTRUM PLACEMENT
      </div>
      <p className="text-muted-foreground text-[13px] leading-[1.8] mb-2">
        Place each competitor on both spectrums. Then place your company:{" "}
        <span className="text-gold">TODAY (outlined gold)</span> shows where you are.{" "}
        <span className="text-gold font-bold">VISION (solid gold)</span> shows where you're going.
        Click the entity you want to place, then click the spectrum.
      </p>

      <div className="p-5 bg-background border border-gold/15 mb-4">
        <div className="flex gap-1.5 items-center mb-5 flex-nowrap overflow-x-auto">
          {allEntities.map((e) => {
            const isSelf = e.id === "self";
            const isV = e.id === "self_vision";
            const isActive = placing === e.id;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => onSetPlacing(placing === e.id ? null : e.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold tracking-[1px] cursor-pointer border transition-colors"
                style={{
                  background: isActive ? `${e.color}20` : "transparent",
                  borderColor: isActive ? e.color : `${e.color}30`,
                  color: isActive ? e.color : `${e.color}60`,
                }}
              >
                <div
                  className="w-2.5 h-2.5 flex-shrink-0"
                  style={{
                    background: isV ? e.color : "transparent",
                    border: `2px solid ${e.color}`,
                    borderRadius: isSelf || isV ? 0 : "50%",
                  }}
                />
                {isV ? "VISION" : isSelf ? "TODAY" : e.name}
              </button>
            );
          })}
          {placing && (
            <span className="text-gold text-[9px] ml-2">→ click the spectrum</span>
          )}
        </div>

        <SpectrumCanvas
          specId="inno"
          label="INNOVATION"
          entities={allEntities}
          placements={placements}
          auditPlacements={auditPlacements.filter((p) => p.specId === "inno")}
          onPlace={onPlace}
          locked={locked}
          placingId={placing}
        />
        <SpectrumCanvas
          specId="cust"
          label="CUSTOMER-CENTRIC"
          entities={allEntities}
          placements={placements}
          auditPlacements={auditPlacements.filter((p) => p.specId === "cust")}
          onPlace={onPlace}
          locked={locked}
          placingId={placing}
        />
      </div>

      {!locked ? (
        <div className="p-5 bg-background border border-gold/20 mb-4">
          <div className="text-foreground text-[13px] font-extrabold tracking-[2px] mb-1.5">
            LOCK POSITIONS
          </div>
          <div className="text-muted-foreground text-[11px] mb-3.5 leading-[1.6]">
            Locking requires a person with authority to sign off. This creates an automatic
            timestamp and version number. Future audits are tracked against this locked state.
          </div>
          <div className="flex gap-2">
            <input
              value={authorityName}
              onChange={(e) => onSetAuthority(e.target.value)}
              placeholder="Name and title of person locking this position…"
              className="flex-1 bg-card border border-gold/30 text-foreground px-3.5 py-2.5 text-[12px] outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={onLock}
              disabled={!authorityName.trim()}
              className={`px-5 py-2.5 text-[9px] font-extrabold tracking-[2px] border ${
                authorityName.trim()
                  ? "bg-gold border-gold text-black cursor-pointer hover:bg-gold/90"
                  : "bg-transparent border-border text-muted-foreground cursor-not-allowed"
              }`}
            >
              LOCK + TIMESTAMP
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-success/[0.06] border border-success/30 mb-4 flex justify-between items-center">
          <div>
            <div className="text-success text-[11px] font-extrabold">
              ✓ LOCKED — VERSION {lockData?.version}
            </div>
            <div className="text-muted-foreground text-[9px] mt-1">
              {lockData?.authority} ·{" "}
              {lockData ? new Date(lockData.timestamp).toLocaleString() : ""}
            </div>
          </div>
          <button
            type="button"
            onClick={onUnlock}
            className="bg-transparent border border-border text-muted-foreground px-3 py-1.5 text-[8px] cursor-pointer hover:text-foreground hover:border-gold"
          >
            UNLOCK TO EDIT
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="bg-transparent border border-border text-muted-foreground px-5 py-2.5 text-[10px] cursor-pointer hover:border-gold hover:text-gold"
        >
          ← BACK
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-gold border-none text-black px-5 py-2.5 text-[10px] font-extrabold tracking-[2px] cursor-pointer hover:bg-gold/90"
        >
          NEXT — STAKEHOLDER AUDIT →
        </button>
      </div>
    </div>
  );
}
