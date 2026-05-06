import { useState, type ReactNode } from "react";
import {
  DEFAULT_COMPETITORS,
  type CompetitorMock,
} from "@/components/formula/formula-data";
import type { AuditPlacement } from "@/components/formula/SpectrumCanvas";
import { CompetitiveStepCategorize } from "@/components/formula/pages/CompetitiveStepCategorize";
import { CompetitiveStepPrioritize } from "@/components/formula/pages/CompetitiveStepPrioritize";
import { CompetitiveStepCompetitors } from "@/components/formula/pages/CompetitiveStepCompetitors";
import { CompetitiveStepSpectrum } from "@/components/formula/pages/CompetitiveStepSpectrum";
import { CompetitiveStepAudit } from "@/components/formula/pages/CompetitiveStepAudit";
import type { SignOffSection, TriggerAi } from "@/components/formula/page-types";

interface LockData {
  timestamp: string;
  version: number;
  authority: string;
}

interface Props {
  /** Step 1 (Word Board A→D) is already rendered by the parent — pass it in. */
  step1Slot: ReactNode;
  /** True once Phase B has 10 selected words; gates the Categorize/Prioritize gates. */
  selectedWords: string[];
  /** Whether Step 1 (A→D) has reached completion (manifesto signed off in source). */
  step1Complete: boolean;
  onAi: TriggerAi;
  onSignOff: SignOffSection;
}

const STEP_LABELS = [
  "WORD BOARD",
  "CATEGORIZE",
  "CONTEXT MAP",
  "PRIORITIZE",
  "COMPETITION",
  "SPECTRUM",
  "AUDIT",
];

/**
 * 7-step outer flow for Competitive Landscape (01.10). Step 1 hosts the
 * existing A→D word-board phases; Steps 2–7 add the deeper exercises ported
 * from v80: categorize buckets, top-6 prioritize, competitor word boards,
 * spectrum placement, and stakeholder audit heat map.
 */
export function CompetitiveSevenStep({
  step1Slot,
  selectedWords,
  step1Complete,
  onAi,
  onSignOff,
}: Props) {
  const [step, setStep] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);

  // Step 2 — Categorize
  const [cats, setCats] = useState<{
    core: string[];
    supporting: string[];
    aspirational: string[];
  }>({ core: [], supporting: [], aspirational: [] });

  // Step 4 — Prioritize
  const [priority, setPriority] = useState<string[]>([]);

  // Step 5 — Competitors
  const [competitors, setCompetitors] = useState<CompetitorMock[]>(DEFAULT_COMPETITORS);
  const [activeComp, setActiveComp] = useState<string>(DEFAULT_COMPETITORS[0].id);

  // Step 6 — Spectrum
  const [placements, setPlacements] = useState<Record<string, number>>({});
  const [placing, setPlacing] = useState<string | null>(null);
  const [authority, setAuthority] = useState("");
  const [locked, setLocked] = useState(false);
  const [lockData, setLockData] = useState<LockData | null>(null);

  // Step 7 — Audit
  const [auditPlacements, setAuditPlacements] = useState<AuditPlacement[]>([]);
  const [invitesSent, setInvitesSent] = useState(0);
  const [invitesFilled, setInvitesFilled] = useState(0);

  const reachable = (n: number) => {
    if (n === 1) return true;
    if (n === 2) return step1Complete && selectedWords.length === 10;
    if (n === 3) return step1Complete && selectedWords.length === 10;
    if (n === 4) return step1Complete && selectedWords.length === 10;
    if (n === 5) return priority.length >= 3;
    if (n === 6) return competitors.every((c) => c.locked && c.top5.length >= 5);
    if (n === 7) return locked;
    return false;
  };

  const assignToCategory = (
    word: string,
    cat: "core" | "supporting" | "aspirational",
  ) =>
    setCats((prev) => {
      const next = {
        core: prev.core.filter((w) => w !== word),
        supporting: prev.supporting.filter((w) => w !== word),
        aspirational: prev.aspirational.filter((w) => w !== word),
      };
      next[cat] = [...next[cat], word];
      return next;
    });

  const removeFromCategories = (word: string) =>
    setCats((prev) => ({
      core: prev.core.filter((w) => w !== word),
      supporting: prev.supporting.filter((w) => w !== word),
      aspirational: prev.aspirational.filter((w) => w !== word),
    }));

  const togglePriority = (w: string) =>
    setPriority((p) => {
      if (p.includes(w)) return p.filter((x) => x !== w);
      if (p.length >= 6) return p;
      return [...p, w];
    });

  const updateCompetitor = (id: string, patch: Partial<CompetitorMock>) =>
    setCompetitors((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const handlePlace = (specId: string, entityId: string, pos: number) =>
    setPlacements((p) => ({ ...p, [`${specId}_${entityId}`]: pos }));

  const handleLock = () => {
    if (!authority.trim()) return;
    const ver = (lockData?.version || 0) + 1;
    setLockData({
      timestamp: new Date().toISOString(),
      version: ver,
      authority,
    });
    setLocked(true);
  };

  const simulateAuditVotes = () => {
    const entities = [...competitors.map((c) => c.id), "self", "self_vision"];
    const newVotes: AuditPlacement[] = [];
    const batchSize = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < batchSize; i++) {
      entities.forEach((eid) => {
        const base = placements[`inno_${eid}`] ?? 50;
        const custBase = placements[`cust_${eid}`] ?? 50;
        newVotes.push({
          entityId: eid,
          specId: "inno",
          position: Math.max(
            0,
            Math.min(100, base + Math.round((Math.random() - 0.5) * 20)),
          ),
        });
        newVotes.push({
          entityId: eid,
          specId: "cust",
          position: Math.max(
            0,
            Math.min(100, custBase + Math.round((Math.random() - 0.5) * 20)),
          ),
        });
      });
    }
    setAuditPlacements((prev) => [...prev, ...newVotes]);
    setInvitesSent((prev) => prev + batchSize + Math.floor(Math.random() * 5) + 2);
    setInvitesFilled((prev) => prev + batchSize);
  };

  const completeAudit = () => {
    onAi({
      context: "01.10 COMPETITIVE LANDSCAPE",
      text: `Competitive Landscape complete.\n\nWord Exercise: ${priority.length} priority words — ${priority.join(
        ", ",
      )}\n\nCompetitors analyzed:\n${competitors
        .map((c) => `▸ ${c.name}: ${c.top5.join(", ")}`)
        .join(
          "\n",
        )}\n\nSpectrum positions locked: Version ${lockData?.version || 1} by ${lockData?.authority || "[authority]"}\nStakeholder audit: ${
        Math.round(auditPlacements.length / (competitors.length + 2) / 2) || 0
      } participants\n\nYour word stack is now the benchmark for every campaign, creative asset, and employee interaction.`,
      needsConfirm: true,
      metrics: [
        { label: "WORDS", value: String(priority.length), color: "hsl(var(--gold))" },
        { label: "COMPETITORS", value: "3", color: "hsl(var(--gold))" },
        {
          label: "VERSION",
          value: `v${lockData?.version || 1}`,
          color: "hsl(var(--success))",
        },
      ],
    });
    onSignOff("01.10");
  };

  return (
    <div>
      {/* Step nav */}
      <div className="flex gap-0.5 mb-7">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const isCur = step === n;
          const isDone = step > n;
          const isHov = hovered === i && !isCur;
          const canReach = reachable(n);
          return (
            <button
              key={label}
              type="button"
              onClick={() => canReach && setStep(n)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              disabled={!canReach}
              className={`flex-1 px-2 h-13 flex flex-col items-center justify-center gap-0.5 border transition-colors ${
                isCur
                  ? "bg-gold/[0.15] border-gold text-gold"
                  : isDone
                    ? "bg-gold/[0.3] border-gold/50 text-gold"
                    : isHov
                      ? "bg-white/[0.04] border-white/30 text-foreground"
                      : "bg-transparent border-gold/15 text-gold/35"
              } ${canReach ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              style={{ height: 52 }}
            >
              <div className="text-[16px] font-black leading-none">
                {isDone ? "✓" : n}
              </div>
              <div className="text-[7px] tracking-[1.5px] font-bold">{label}</div>
            </button>
          );
        })}
      </div>

      {step === 1 && step1Slot}

      {step === 2 && (
        <CompetitiveStepCategorize
          selected={selectedWords}
          cats={cats}
          onAssign={assignToCategory}
          onRemove={removeFromCategories}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <div className="bg-card border border-border p-6 mb-5">
          <div className="text-gold text-[10px] tracking-[3px] font-extrabold mb-1.5">
            STEP 3 — CONTEXT MAP
          </div>
          <div className="text-muted-foreground text-[12px] leading-[1.7] mb-4 italic">
            Five dimensions, five stories — objective, culture, customer experience, vision, and
            personality. The deep narrative editor for this step is reserved for a follow-up
            iteration; for now, advance to PRIORITIZE to lock your top 6.
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-transparent border border-border text-muted-foreground px-5 py-2.5 text-[10px] cursor-pointer hover:border-gold hover:text-gold"
            >
              ← BACK
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex-1 bg-gold border-none text-black px-5 py-2.5 text-[10px] font-extrabold tracking-[2px] cursor-pointer hover:bg-gold/90"
            >
              NEXT — PRIORITIZE →
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <CompetitiveStepPrioritize
          selected={selectedWords}
          priority={priority}
          onToggle={togglePriority}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <CompetitiveStepCompetitors
          competitors={competitors}
          activeId={activeComp}
          onSetActive={setActiveComp}
          onUpdate={updateCompetitor}
          onBack={() => setStep(4)}
          onNext={() => setStep(6)}
        />
      )}

      {step === 6 && (
        <CompetitiveStepSpectrum
          competitors={competitors}
          placements={placements}
          auditPlacements={auditPlacements}
          placing={placing}
          onSetPlacing={setPlacing}
          onPlace={handlePlace}
          authorityName={authority}
          onSetAuthority={setAuthority}
          locked={locked}
          lockData={lockData}
          onLock={handleLock}
          onUnlock={() => {
            setLocked(false);
            setLockData(null);
          }}
          onBack={() => setStep(5)}
          onNext={() => setStep(7)}
        />
      )}

      {step === 7 && (
        <CompetitiveStepAudit
          competitors={competitors}
          placements={placements}
          auditPlacements={auditPlacements}
          invitesSent={invitesSent}
          invitesFilled={invitesFilled}
          onSimulate={simulateAuditVotes}
          onBack={() => setStep(6)}
          onComplete={completeAudit}
        />
      )}
    </div>
  );
}
