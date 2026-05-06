import { SpectrumCanvas } from "@/components/formula/SpectrumCanvas";
import type {
  AuditPlacement,
  SpectrumEntity,
} from "@/components/formula/SpectrumCanvas";
import type { CompetitorMock } from "@/components/formula/formula-data";

interface Props {
  competitors: CompetitorMock[];
  placements: Record<string, number>;
  auditPlacements: AuditPlacement[];
  invitesSent: number;
  invitesFilled: number;
  onSimulate: () => void;
  onBack: () => void;
  onComplete: () => void;
}

const LEGEND: Array<[string, string]> = [
  ["Thin colored lines", "Individual placements at 25% opacity"],
  ["Solid colored line", "Calculated average per entity"],
  ["Spread width", "Narrow = consensus, wide = debate"],
  ["Gold = your company", "TODAY (outline) and VISION (solid)"],
];

/**
 * Step 7 — Stakeholder Audit. Anonymous responses populate a heat map across
 * both spectrums. SIMULATE STAKEHOLDER VOTES seeds demo data. Direct port of
 * source Step 7 (lines 4584–4651).
 */
export function CompetitiveStepAudit({
  competitors,
  placements,
  auditPlacements,
  invitesSent,
  invitesFilled,
  onSimulate,
  onBack,
  onComplete,
}: Props) {
  const allEntities: SpectrumEntity[] = [
    ...competitors.map((c) => ({ id: c.id, name: c.name, color: c.color })),
    { id: "self", name: "TODAY", color: "hsl(var(--gold))" },
    { id: "self_vision", name: "VISION", color: "hsl(var(--gold))" },
  ];

  const participantCount = Math.round(
    auditPlacements.length / (competitors.length + 2) / 2,
  );

  return (
    <div className="bg-card border border-border p-6 mb-5">
      <div className="text-foreground text-[20px] font-black tracking-[2px] mb-2">
        STEP 7 — STAKEHOLDER AUDIT
      </div>
      <p className="text-muted-foreground text-[13px] leading-[1.8] mb-5">
        Share this with key stakeholders. Each person independently places every competitor and
        your company on both spectrums. Responses are <span className="text-gold">anonymous</span> —
        their individual record exists only in their S.U.M. journal. The heat map below shows
        collective intelligence.
      </p>

      {auditPlacements.length === 0 ? (
        <div className="p-8 bg-background border border-gold/15 text-center mb-5">
          <div className="text-muted-foreground text-[13px] mb-4">
            No stakeholder responses yet.
          </div>
          <button
            type="button"
            onClick={onSimulate}
            className="bg-gold border-none text-black px-6 py-2.5 text-[9px] font-extrabold tracking-[2px] cursor-pointer hover:bg-gold/90"
          >
            SIMULATE STAKEHOLDER VOTES (DEMO)
          </button>
        </div>
      ) : (
        <div>
          <div className="px-4 py-2.5 bg-gold/[0.06] border border-gold/30 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-gold text-[11px]">
                {participantCount} participants · Anonymous · Heat map active
              </span>
              {invitesSent > 0 && (
                <span className="text-muted-foreground text-[9px] tracking-[1px]">
                  <span className="text-success font-extrabold">{invitesFilled}</span>
                  <span className="text-muted-foreground"> / {invitesSent} completed</span>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onSimulate}
              className="bg-transparent border border-gold/40 text-gold px-3 py-1 text-[8px] tracking-[1px] cursor-pointer hover:bg-gold/10"
            >
              + ADD RESPONSES
            </button>
          </div>

          <SpectrumCanvas
            specId="inno"
            label="INNOVATION SPECTRUM — CONSENSUS VIEW"
            entities={allEntities}
            placements={placements}
            auditPlacements={auditPlacements.filter((p) => p.specId === "inno")}
            onPlace={() => undefined}
            locked
            placingId={null}
          />
          <SpectrumCanvas
            specId="cust"
            label="CUSTOMER-CENTRIC SPECTRUM — CONSENSUS VIEW"
            entities={allEntities}
            placements={placements}
            auditPlacements={auditPlacements.filter((p) => p.specId === "cust")}
            onPlace={() => undefined}
            locked
            placingId={null}
          />

          <div className="p-4 bg-background border border-gold/15 mb-4">
            <div className="text-muted-foreground text-[9px] tracking-[2px] font-bold mb-2.5">
              READING THE HEAT MAP
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LEGEND.map(([l, d]) => (
                <div key={l} className="flex gap-2">
                  <span className="text-gold text-[10px] font-bold min-w-[120px]">{l}</span>
                  <span className="text-muted-foreground text-[10px]">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="bg-transparent border border-border text-muted-foreground px-5 py-2.5 text-[10px] cursor-pointer hover:border-gold hover:text-gold"
        >
          ← BACK
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="flex-1 bg-success border-none text-black px-5 py-2.5 text-[10px] font-extrabold tracking-[2px] cursor-pointer hover:bg-success/90"
        >
          SIGN OFF — COMPETITIVE LANDSCAPE COMPLETE
        </button>
      </div>
    </div>
  );
}
