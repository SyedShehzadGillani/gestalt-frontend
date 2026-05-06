import { useState } from "react";
import {
  HORIZONS,
  PRIO,
  T,
  type BusinessObjective,
  type ObjectiveInitiative,
} from "@/components/formula/formula-data";
import { AutoTextarea } from "@/components/formula/AutoTextarea";
import type { TriggerAi } from "@/components/formula/page-types";

interface Approvals {
  meaning: boolean;
  how: boolean;
  metrics: boolean;
  valuation: boolean;
  risk: boolean;
  initiatives: boolean;
}

const SECTIONS_OBJ: Array<keyof Approvals> = [
  "meaning",
  "how",
  "metrics",
  "valuation",
  "risk",
  "initiatives",
];

const SECTION_LABELS: Record<keyof Approvals, string> = {
  meaning: "What This Means to the Organization",
  how: "How — Three-Part Strategic Brief",
  metrics: "Success Metric + Definition of Done",
  valuation: "Valuation Impact",
  risk: "Risk if Ignored",
  initiatives: "Initiatives",
};

interface Props {
  obj: BusinessObjective;
  index: number;
  primaryCount: number;
  teamRoster: string[];
  onUpdate: (id: number, field: keyof BusinessObjective, val: BusinessObjective[keyof BusinessObjective]) => void;
  onUpdateInitiative: (
    objId: number,
    initId: number,
    field: keyof ObjectiveInitiative,
    val: ObjectiveInitiative[keyof ObjectiveInitiative],
  ) => void;
  onAddInitiative: (objId: number) => void;
  onRemoveInitiative: (objId: number, initId: number) => void;
  onAi: TriggerAi;
}

interface AiPanelState {
  loading: boolean;
  result: {
    alignment: string;
    language: string;
    scoreImpact: string;
    warning: string | null;
  } | null;
}

/** Single business-objective card — title, priority, horizon, all 6 approval sections. */
export function ObjectiveCard({
  obj,
  index,
  primaryCount,
  teamRoster,
  onUpdate,
  onUpdateInitiative,
  onAddInitiative,
  onRemoveInitiative,
  onAi,
}: Props) {
  const [approvals, setApprovals] = useState<Approvals>({
    meaning: false,
    how: false,
    metrics: false,
    valuation: false,
    risk: false,
    initiatives: false,
  });
  const [aiPanel, setAiPanel] = useState<AiPanelState | null>(null);

  const p = PRIO[obj.priority] ?? PRIO.PRIMARY;
  const allApproved = SECTIONS_OBJ.every((s) => approvals[s]);

  const horizonTarget = (() => {
    const d = new Date();
    if (obj.horizon === "90-DAY") d.setDate(d.getDate() + 90);
    else if (obj.horizon === "6-MONTH") d.setMonth(d.getMonth() + 6);
    else if (obj.horizon === "12-MONTH") d.setFullYear(d.getFullYear() + 1);
    else if (obj.horizon === "3-YEAR") d.setFullYear(d.getFullYear() + 3);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  })();

  const approveSection = (sectionId: keyof Approvals) => {
    setApprovals((prev) => ({ ...prev, [sectionId]: true }));
    let detail = "";
    if (sectionId === "how") detail = `WHAT: ${obj.howWhat}\n\nWHY IT WORKS: ${obj.howWhy}\n\n30-DAY WIN: ${obj.how30}`;
    else if (sectionId === "meaning") detail = obj.meaning;
    else if (sectionId === "metrics") detail = `METRIC: ${obj.metric}\n\nDONE WHEN: ${obj.done}`;
    else if (sectionId === "valuation") detail = obj.valuation;
    else if (sectionId === "risk") detail = `RISK: ${obj.riskIgnored}\n\nCOMPLACENCY CHECK: ${obj.complacency90}`;
    else if (sectionId === "initiatives")
      detail = obj.initiatives
        .map(
          (ini, i) =>
            `${i + 1}. ${ini.title}${ini.owner ? ` · Owner: ${ini.owner}` : ""}${
              ini.date ? ` · Due: ${ini.date}` : ""
            }`,
        )
        .join("\n");
    const sectionLabel = SECTION_LABELS[sectionId];
    onAi({
      context: `OBJECTIVE "${obj.title || obj.id}" — ${sectionLabel.toUpperCase()} APPROVED`,
      text: `${sectionLabel} has been approved for objective: "${obj.title || "(untitled)"}".\n\n${
        detail ? `${detail}\n\n` : ""
      }GESTALT INTELLIGENCE has added this to the knowledge bank. Cross-referencing against your word stack, competitive positioning, and exit valuation model.`,
      needsConfirm: false,
      metrics: [
        {
          label: "OBJECTIVE",
          value: obj.title ? obj.title.slice(0, 14) + "…" : "UNTITLED",
          color: "hsl(var(--gold))",
        },
        {
          label: "SECTION",
          value: sectionLabel.split(" ")[0].toUpperCase(),
          color: "hsl(var(--gold))",
        },
      ],
    });
  };

  const reopenSection = (sectionId: keyof Approvals) =>
    setApprovals((prev) => ({ ...prev, [sectionId]: false }));

  const runAi = () => {
    setAiPanel({ loading: true, result: null });
    window.setTimeout(() => {
      setAiPanel({
        loading: false,
        result: {
          alignment:
            "Your word stack directly supports this objective direction. Core DNA words create a defensible position.",
          language: `"${obj.title} — companies that own their segment don't compete on price, they compete on irreplaceability."`,
          scoreImpact: `+${p.score} points to B.A.S.E. Score on sign-off at ${obj.priority} priority.`,
          warning:
            obj.priority === "PRIMARY" && primaryCount > 2
              ? `${primaryCount} PRIMARY objectives detected. Organizations executing 3+ top priorities simultaneously succeed on all at 11% (McKinsey). Reconsider your stack.`
              : null,
        },
      });
    }, 1400);
  };

  const labelClass = (approved: boolean) =>
    `${approved ? "text-gold" : "text-foreground"} text-[18px] tracking-[1px] font-extrabold mb-2 mt-4 leading-[1.2] transition-colors`;

  const SectionBar = ({ sectionId }: { sectionId: keyof Approvals }) => {
    const approved = approvals[sectionId];
    return (
      <div className="flex justify-end mt-2.5">
        <button
          type="button"
          onClick={() => (approved ? reopenSection(sectionId) : approveSection(sectionId))}
          className={`px-3.5 py-1 text-[8px] font-extrabold tracking-[1.5px] cursor-pointer border ${
            approved
              ? "border-success bg-success/10 text-success"
              : "border-border bg-transparent text-muted-foreground hover:border-gold/40 hover:text-foreground"
          }`}
        >
          {approved ? "✓ APPROVED — CLICK TO REVISE" : "APPROVE THIS SECTION →"}
        </button>
      </div>
    );
  };

  const OwnerInput = ({
    value,
    onChange,
    placeholder,
    className,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    className?: string;
  }) => {
    const [open, setOpen] = useState(false);
    const filtered = teamRoster.filter(
      (n) => n.toLowerCase().includes(value.toLowerCase()) && n !== value,
    );
    return (
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className={
            className ??
            "w-full bg-background border border-border text-muted-foreground px-3 py-2 text-[13px] outline-none focus:border-gold"
          }
        />
        {open && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-background border border-gold z-[100] mt-px">
            {filtered.map((name) => (
              <button
                key={name}
                type="button"
                onMouseDown={() => onChange(name)}
                className="block w-full text-left px-3 py-2 text-[12px] cursor-pointer text-foreground border-b border-border hover:bg-gold/[0.06]"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`mb-7 bg-card border ${
        allApproved ? "border-success" : "border-border"
      } overflow-visible transition-colors`}
      style={{ borderTopWidth: 3, borderTopColor: p.color }}
    >
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2 mb-3.5 flex-wrap">
          <div
            className="w-7 h-7 flex items-center justify-center flex-shrink-0"
            style={{
              background: `${p.color}24`,
              border: `1px solid ${p.color}66`,
            }}
          >
            <span className="text-[12px] font-black" style={{ color: p.color }}>
              {index + 1}
            </span>
          </div>
          <div className="flex gap-0.5">
            {Object.keys(PRIO).map((pk) => {
              const cfg = PRIO[pk];
              const active = obj.priority === pk;
              return (
                <button
                  key={pk}
                  type="button"
                  onClick={() => onUpdate(obj.id, "priority", pk as keyof typeof PRIO)}
                  className="px-2.5 py-1 text-[7px] font-extrabold tracking-[1.5px] cursor-pointer border transition-colors"
                  style={{
                    borderColor: active ? cfg.color : "hsl(var(--border))",
                    color: active ? cfg.color : "hsl(var(--muted-foreground))",
                    background: active ? `${cfg.color}24` : "transparent",
                  }}
                >
                  {pk}
                </button>
              );
            })}
          </div>
          <div
            className="px-2 py-0.5 border"
            style={{
              borderColor: `${p.allocColor}55`,
              background: `${p.allocColor}1a`,
            }}
          >
            <span
              className="text-[7px] font-extrabold tracking-[1.5px]"
              style={{ color: p.allocColor }}
            >
              {p.alloc}
            </span>
          </div>
          {allApproved && (
            <span className="text-success text-[9px] font-extrabold tracking-[1px] ml-auto">
              ✓ ALL SECTIONS APPROVED
            </span>
          )}
        </div>
        <input
          value={obj.title}
          onChange={(e) => onUpdate(obj.id, "title", e.target.value)}
          placeholder="State your objective clearly and specifically…"
          className={`w-full bg-transparent border-b border-border ${
            allApproved ? "text-gold" : "text-foreground"
          } px-0 py-1.5 text-[24px] font-black outline-none leading-[1.2] tracking-[-0.5px] focus:border-gold`}
        />
        <div className="text-[11px] leading-[1.6] mt-2.5" style={{ color: p.color }}>
          {p.hint}
        </div>
      </div>

      <div className="px-6 pt-1 pb-6">
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <div className={labelClass(false)}>TIME HORIZON</div>
            <div className="flex gap-1">
              {HORIZONS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => onUpdate(obj.id, "horizon", h)}
                  className={`flex-1 px-1 py-1.5 text-[8px] tracking-[1px] cursor-pointer border ${
                    obj.horizon === h
                      ? "border-gold bg-gold/[0.06] text-gold font-extrabold"
                      : "border-border text-muted-foreground font-semibold"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
            <div className="text-gold text-[9px] mt-1.5 tracking-[1px]">TARGET: {horizonTarget}</div>
          </div>
          <div>
            <div className={labelClass(false)}>ACCOUNTABLE OWNER</div>
            <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
              One person. Not a team. Not a role. A name.
            </div>
            <OwnerInput
              value={obj.owner}
              onChange={(v) => onUpdate(obj.id, "owner", v)}
              placeholder="Name — one person answers for this"
            />
          </div>
        </div>

        <div className="mt-5 p-4 bg-background border border-border">
          <div className={labelClass(approvals.meaning)}>
            WHAT THIS MEANS TO THE ORGANIZATION
          </div>
          <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
            When this objective is executed properly, what changes? What does winning look like for
            your team, your customers, your valuation? Be specific — not aspirational.
          </div>
          <AutoTextarea
            value={obj.meaning}
            onChange={(e) => onUpdate(obj.id, "meaning", e.target.value)}
            placeholder={'"When we execute this, we will… Our team will feel… Our customers will notice…"'}
            className={approvals.meaning ? "text-gold border-gold" : ""}
          />
          <SectionBar sectionId="meaning" />
        </div>

        <div className="mt-4 p-4 bg-background border border-border border-t-2 border-t-gold">
          <div className="text-gold text-[9px] font-extrabold tracking-[2.5px] mb-2">
            HOW — THREE-PART STRATEGIC BRIEF
          </div>
          <div className="mb-5">
            <div className={labelClass(approvals.how)}>WHAT SPECIFICALLY WILL YOU DO?</div>
            <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
              The concrete action. Not a direction — a decision. Specific enough that someone reading
              this can execute without asking a question.
            </div>
            <AutoTextarea
              value={obj.howWhat}
              onChange={(e) => onUpdate(obj.id, "howWhat", e.target.value)}
              placeholder="We will specifically… by doing… using… with the following approach…"
              className={approvals.how ? "text-gold border-gold" : ""}
            />
          </div>
          <div className="mb-5">
            <div className={labelClass(approvals.how)}>
              WHY WILL IT WORK? — THE STRATEGIC LOGIC
            </div>
            <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
              What insight or market truth makes this the right move? This is what you'd say to a
              skeptical board member.
            </div>
            <AutoTextarea
              value={obj.howWhy}
              onChange={(e) => onUpdate(obj.id, "howWhy", e.target.value)}
              placeholder="This will work because… The market condition that makes this the right move is…"
              className={approvals.how ? "text-gold border-gold" : ""}
            />
          </div>
          <div>
            <div className={labelClass(approvals.how)}>WHAT DOES WINNING LOOK LIKE IN 30 DAYS?</div>
            <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
              The earliest signal this is working. Not the finish line — the first checkpoint.
            </div>
            <AutoTextarea
              value={obj.how30}
              onChange={(e) => onUpdate(obj.id, "how30", e.target.value)}
              placeholder="Within 30 days we will see… The first signal that this is working is…"
              className={approvals.how ? "text-gold border-gold" : ""}
            />
          </div>
          <SectionBar sectionId="how" />
        </div>

        <div className="mt-4 p-4 bg-background border border-border">
          <div className="mb-5">
            <div className={labelClass(approvals.metrics)}>
              SUCCESS METRIC — ONE HARD NUMBER
            </div>
            <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
              A {T("KPI")} so specific it can only be answered yes or no. If you can't measure it on
              a specific date, it isn't a metric — it's a wish.
            </div>
            <AutoTextarea
              value={obj.metric}
              onChange={(e) => onUpdate(obj.id, "metric", e.target.value)}
              placeholder={`e.g. "${T("ARR")} reaches $X by Q4"`}
              className={approvals.metrics ? "text-gold border-gold" : ""}
            />
          </div>
          <div>
            <div className={labelClass(approvals.metrics)}>DEFINITION OF DONE</div>
            <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
              One sentence. The objective is 100% complete when this specific thing happens.
            </div>
            <AutoTextarea
              value={obj.done}
              onChange={(e) => onUpdate(obj.id, "done", e.target.value)}
              placeholder="This objective is complete when… [name the exact moment you can declare it finished]"
              className={approvals.metrics ? "text-gold border-gold" : ""}
            />
          </div>
          <SectionBar sectionId="metrics" />
        </div>

        <div className="mt-4 p-4 bg-background border border-border">
          <div className={labelClass(approvals.valuation)}>
            VALUATION IMPACT — How does this increase your exit multiple?
          </div>
          <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
            Connect this objective directly to exit value. If it doesn't move the number, it's not a
            strategic priority.
          </div>
          <AutoTextarea
            value={obj.valuation}
            onChange={(e) => onUpdate(obj.id, "valuation", e.target.value)}
            placeholder={'"Completing this adds X to our exit multiple because acquirers will see…"'}
            className={approvals.valuation ? "text-gold border-gold" : ""}
          />
          <SectionBar sectionId="valuation" />
        </div>

        <div className="mt-4 p-4 bg-background border border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={labelClass(approvals.risk)}>RISK IF IGNORED</div>
              <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
                One sentence. What breaks if this never gets done?
              </div>
              <AutoTextarea
                value={obj.riskIgnored}
                onChange={(e) => onUpdate(obj.id, "riskIgnored", e.target.value)}
                placeholder="If we never do this, we will…"
                minHeight={52}
                className={approvals.risk ? "text-gold border-gold" : ""}
              />
            </div>
            <div>
              <div className={labelClass(approvals.risk)}>
                COMPLACENCY RISK — 90 days of inaction
              </div>
              <div className="text-muted-foreground text-[12px] italic leading-[1.7] mb-2">
                This is where complacency hides. Name it or it wins.
              </div>
              <AutoTextarea
                value={obj.complacency90}
                onChange={(e) => onUpdate(obj.id, "complacency90", e.target.value)}
                placeholder="If this sits unaddressed for 90 days…"
                minHeight={52}
                className={approvals.risk ? "text-gold border-gold" : ""}
              />
            </div>
          </div>
          <SectionBar sectionId="risk" />
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onUpdate(obj.id, "barrierLinked", !obj.barrierLinked)}
            className={`px-3 py-1 text-[9px] font-bold tracking-[1.5px] cursor-pointer border ${
              obj.barrierLinked
                ? "bg-[#c45c00]/[0.1] border-[#c45c00] text-[#c45c00]"
                : "bg-transparent border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
            }`}
          >
            {obj.barrierLinked ? "⚠ BARRIER LINKED" : "+ LINK TO A BARRIER"}
          </button>
          {obj.barrierLinked && (
            <span className="text-muted-foreground text-[11px]">
              A pre-populated barrier card will appear in 01.30 Barriers &amp; Challenges.
            </span>
          )}
        </div>

        <div className="mt-4 p-4 bg-background border border-border">
          <div className="flex items-center justify-between mb-3">
            <div
              className={`text-[11px] tracking-[2px] font-extrabold ${
                approvals.initiatives ? "text-gold" : "text-muted-foreground"
              }`}
            >
              INITIATIVES — IN ORDER OF PRIORITY
            </div>
            <span className="text-muted-foreground text-[11px]">{obj.initiatives.length} / 5</span>
          </div>
          {obj.initiatives.map((ini, j) => (
            <div
              key={ini.id}
              className="grid grid-cols-[22px_1fr_140px_110px_auto] gap-2 items-center py-2.5 border-b border-border"
            >
              <span
                className={`text-[11px] font-bold text-center ${
                  approvals.initiatives ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {j + 1}
              </span>
              <input
                value={ini.title}
                onChange={(e) => onUpdateInitiative(obj.id, ini.id, "title", e.target.value)}
                placeholder="Initiative — specific, actionable, owned"
                className={`bg-transparent border-none border-b border-b-border ${
                  approvals.initiatives ? "text-gold" : "text-muted-foreground"
                } px-0 py-1 text-[13px] outline-none w-full focus:border-b-gold`}
              />
              <OwnerInput
                value={ini.owner}
                onChange={(v) => onUpdateInitiative(obj.id, ini.id, "owner", v)}
                placeholder="Owner"
                className="bg-transparent border-none border-b border-b-border text-muted-foreground px-0 py-1 text-[12px] outline-none w-full focus:border-b-gold"
              />
              <input
                value={ini.date}
                onChange={(e) => onUpdateInitiative(obj.id, ini.id, "date", e.target.value)}
                placeholder="Target date"
                className="bg-transparent border-none border-b border-b-border text-muted-foreground px-0 py-1 text-[12px] outline-none w-full focus:border-b-gold"
              />
              <div className="flex items-center gap-1">
                {(["P", "S", "T"] as const).map((abbr, pi) => {
                  const k = (["PRIMARY", "SECONDARY", "TERTIARY"] as const)[pi];
                  const active = ini.priority === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      title={k}
                      onClick={() => onUpdateInitiative(obj.id, ini.id, "priority", k)}
                      className="w-5 h-5 text-[8px] font-black cursor-pointer border"
                      style={{
                        borderColor: active ? PRIO[k].color : "hsl(var(--border))",
                        background: active ? `${PRIO[k].color}33` : "transparent",
                        color: active ? PRIO[k].color : "hsl(var(--muted-foreground))",
                      }}
                    >
                      {abbr}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => onRemoveInitiative(obj.id, ini.id)}
                  className="bg-transparent border-none text-muted-foreground cursor-pointer text-[14px] px-0.5 hover:text-foreground"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          {obj.initiatives.length < 5 && (
            <button
              type="button"
              onClick={() => onAddInitiative(obj.id)}
              className="bg-transparent border-none text-gold text-[10px] cursor-pointer tracking-[1.5px] py-2.5 font-bold hover:text-gold-dimlight"
            >
              + ADD INITIATIVE
            </button>
          )}
          <SectionBar sectionId="initiatives" />
        </div>

        <div className="mt-4 bg-background border border-border border-t-2 border-t-gold">
          <div className="px-4 py-3 flex items-center justify-between border-b border-border">
            <div>
              <div className="text-gold-dimlight text-[10px] font-extrabold tracking-[2px]">
                GESTALT INTELLIGENCE
              </div>
              <div className="text-muted-foreground text-[11px] mt-0.5">
                Word stack alignment · Language · Score impact · Conflict check
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center gap-1 px-2.5 py-1 border"
                style={{
                  borderColor: `${p.color}55`,
                  background: `${p.color}14`,
                }}
              >
                <span className="text-[13px] font-black" style={{ color: p.color }}>
                  +{p.score}
                </span>
                <span className="text-muted-foreground text-[8px] tracking-[1px]">
                  B.A.S.E. ON SIGN-OFF
                </span>
              </div>
              <button
                type="button"
                onClick={runAi}
                disabled={aiPanel?.loading}
                className={`px-4 py-1.5 text-[9px] font-extrabold tracking-[1.5px] cursor-pointer border border-gold ${
                  aiPanel?.result ? "bg-gold/[0.1] text-foreground" : "bg-gold text-black"
                } disabled:opacity-60`}
              >
                {aiPanel?.loading
                  ? "ANALYZING…"
                  : aiPanel?.result
                    ? "↻ REGENERATE"
                    : "ANALYZE THIS OBJECTIVE →"}
              </button>
            </div>
          </div>
          {aiPanel?.loading && (
            <div className="px-4 py-5 text-center">
              <div className="text-gold text-[10px] tracking-[2px]">
                GESTALT INTELLIGENCE IS WORKING…
              </div>
            </div>
          )}
          {aiPanel?.result && (
            <div className="p-4">
              {aiPanel.result.warning && (
                <div className="px-3.5 py-2.5 bg-red/[0.04] border border-red/40 mb-3">
                  <div className="text-red text-[9px] font-extrabold tracking-[2px] mb-1">
                    PRIORITY CONFLICT
                  </div>
                  <div className="text-muted-foreground text-[12px] leading-[1.7]">
                    {aiPanel.result.warning}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "WORD STACK ALIGNMENT",
                    text: aiPanel.result.alignment,
                    color: "hsl(var(--success))",
                  },
                  {
                    label: "SUGGESTED LANGUAGE",
                    text: aiPanel.result.language,
                    color: "hsl(var(--gold))",
                  },
                  {
                    label: "SCORE IMPACT",
                    text: aiPanel.result.scoreImpact,
                    color: p.color,
                  },
                ].map((panel) => (
                  <div
                    key={panel.label}
                    className="p-3 border"
                    style={{
                      background: `${panel.color === p.color ? p.color : "hsl(var(--background))"}06`,
                      borderColor: panel.color === p.color ? `${p.color}33` : "hsl(var(--border))",
                    }}
                  >
                    <div
                      className="text-[8px] font-extrabold tracking-[1.5px] mb-1.5"
                      style={{ color: panel.color }}
                    >
                      {panel.label}
                    </div>
                    <div className="text-muted-foreground text-[12px] leading-[1.7]">
                      {panel.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
