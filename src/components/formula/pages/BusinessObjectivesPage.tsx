import { useState } from "react";
import {
  INIT_OBJECTIVES,
  PRIO,
  type BusinessObjective,
  type ObjectiveInitiative,
} from "@/components/formula/formula-data";
import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { ObjectiveCard } from "@/components/formula/pages/ObjectiveCard";
import type { SignOffSection, TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
  onSignOff: SignOffSection;
  signedOff: Record<string, boolean>;
}

/** 01.20 — Business Objectives. List of priority-ranked objective cards. */
export function BusinessObjectivesPage({ onAi, onSignOff, signedOff }: Props) {
  const [objs, setObjs] = useState<BusinessObjective[]>(INIT_OBJECTIVES);

  const teamRoster = [
    ...new Set([
      ...objs.map((o) => o.owner).filter(Boolean),
      ...objs.flatMap((o) => o.initiatives.map((i) => i.owner)).filter(Boolean),
      "Alex Chen",
      "Sarah Kim",
      "Marcus Lee",
      "Jordan Reeves",
    ]),
  ];

  const updateObj: <F extends keyof BusinessObjective>(
    id: number,
    field: F,
    val: BusinessObjective[F],
  ) => void = (id, field, val) =>
    setObjs((prev) => prev.map((o) => (o.id === id ? { ...o, [field]: val } : o)));

  const updateInit: <F extends keyof ObjectiveInitiative>(
    objId: number,
    iid: number,
    field: F,
    val: ObjectiveInitiative[F],
  ) => void = (objId, iid, field, val) =>
    setObjs((prev) =>
      prev.map((o) =>
        o.id === objId
          ? {
              ...o,
              initiatives: o.initiatives.map((i) => (i.id === iid ? { ...i, [field]: val } : i)),
            }
          : o,
      ),
    );

  const addInit = (objId: number) =>
    setObjs((prev) =>
      prev.map((o) =>
        o.id === objId
          ? {
              ...o,
              initiatives: [
                ...o.initiatives,
                {
                  id: Date.now(),
                  title: "",
                  owner: "",
                  date: "",
                  priority: "PRIMARY",
                },
              ],
            }
          : o,
      ),
    );

  const removeInit = (objId: number, iid: number) =>
    setObjs((prev) =>
      prev.map((o) =>
        o.id === objId
          ? { ...o, initiatives: o.initiatives.filter((i) => i.id !== iid) }
          : o,
      ),
    );

  const addObj = () =>
    setObjs((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        priority: "PRIMARY",
        horizon: "12-MONTH",
        owner: "",
        meaning: "",
        howWhat: "",
        howWhy: "",
        how30: "",
        metric: "",
        done: "",
        valuation: "",
        riskIgnored: "",
        complacency90: "",
        barrierLinked: false,
        initiatives: [
          {
            id: Date.now() + 1,
            title: "",
            owner: "",
            date: "",
            priority: "PRIMARY",
          },
        ],
      },
    ]);

  const primaryCount = objs.filter((o) => o.priority === "PRIMARY").length;
  const canSignOff = objs.every(
    (o) =>
      o.title.trim() &&
      o.howWhat.trim() &&
      o.metric.trim() &&
      o.done.trim() &&
      o.initiatives.some((i) => i.title.trim()),
  );

  const handleSignOff = () => {
    if (!canSignOff) return;
    const ts = new Date().toLocaleString();
    onAi({
      context: "01.20 BUSINESS OBJECTIVES",
      text: `${objs.length} objectives documented and signed off at ${ts}.\n\n${objs
        .map(
          (o, i) =>
            `Objective ${i + 1} [${o.priority}]: ${o.title}\nOwner: ${o.owner || "Unassigned"}\nMetric: ${o.metric}`,
        )
        .join("\n\n")}\n\nSaved to TIMELINE. H.I.V.E. notified. All accountable owners alerted.`,
      needsConfirm: true,
      metrics: [
        { label: "OBJECTIVES", value: String(objs.length), color: "hsl(var(--gold))" },
        {
          label: "INITIATIVES",
          value: String(objs.reduce((a, o) => a + o.initiatives.length, 0)),
          color: "hsl(var(--gold))",
        },
        {
          label: "B.A.S.E.",
          value: `+${objs.reduce((a, o) => a + (PRIO[o.priority]?.score ?? 1), 0)}`,
          color: "hsl(var(--success))",
        },
      ],
    });
    onSignOff("01.20");
  };

  return (
    <div>
      <FormulaPageHeader pageId="01.20" />

      {primaryCount > 2 && (
        <div className="px-4 py-3 bg-red/[0.04] border border-red/40 mb-5">
          <div className="text-red text-[10px] font-extrabold tracking-[2px] mb-1">
            ⚠ PRIORITY CONFLICT DETECTED
          </div>
          <div className="text-muted-foreground text-[13px] leading-[1.7]">
            You've marked {primaryCount} objectives as PRIMARY. Organizations executing 3+ top
            priorities simultaneously succeed on all of them at{" "}
            <strong className="text-red">11%</strong> (McKinsey & Company). One objective should
            lead. The others follow.
          </div>
        </div>
      )}

      {objs.map((obj, idx) => (
        <ObjectiveCard
          key={obj.id}
          obj={obj}
          index={idx}
          primaryCount={primaryCount}
          teamRoster={teamRoster}
          onUpdate={updateObj}
          onUpdateInitiative={updateInit}
          onAddInitiative={addInit}
          onRemoveInitiative={removeInit}
          onAi={onAi}
        />
      ))}

      {objs.length < 5 && (
        <button
          type="button"
          onClick={addObj}
          className="w-full bg-transparent border border-dashed border-border text-muted-foreground py-3.5 text-[11px] tracking-[2px] font-semibold cursor-pointer mb-4 hover:text-foreground hover:border-gold/40"
        >
          + ADD BUSINESS OBJECTIVE
        </button>
      )}

      <div className="mt-2">
        {!canSignOff && (
          <div className="px-3.5 py-3 bg-red/[0.04] border border-red/30 mb-2.5">
            <div className="text-muted-foreground text-[12px] leading-[1.7]">
              <strong className="text-red">Before you can sign off:</strong> every objective needs a
              title, HOW, success metric, definition of done, and at least one initiative.
            </div>
          </div>
        )}
        {signedOff["01.20"] ? (
          <div className="px-4 py-3.5 bg-success/[0.06] border border-success/30 flex items-center gap-2">
            <span className="text-success text-[18px]">✓</span>
            <span className="text-success text-[11px] font-extrabold tracking-[2px]">
              SIGNED OFF — BUSINESS OBJECTIVES APPROVED
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSignOff}
            disabled={!canSignOff}
            className={`w-full px-4 py-4 text-[11px] font-extrabold tracking-[3px] border ${
              canSignOff
                ? "bg-success border-success text-black cursor-pointer hover:bg-success/90"
                : "bg-transparent border-border text-muted-foreground cursor-not-allowed opacity-40"
            }`}
          >
            SIGN OFF — BUSINESS OBJECTIVES APPROVED →
          </button>
        )}
      </div>
    </div>
  );
}
