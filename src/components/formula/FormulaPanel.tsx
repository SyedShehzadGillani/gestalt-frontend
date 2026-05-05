import { useEffect, useRef, useState } from "react";
import { INTELLIGENCE_STAGES, PAGE_HEADERS } from "@/components/formula/formula-data";

export interface PanelMetric {
  label: string;
  value: string;
  color?: string;
}

export interface PanelMessage {
  context?: string;
  text: string;
  metrics?: PanelMetric[];
  needsConfirm?: boolean;
  confirmed?: boolean;
  isReminder?: boolean;
  sectionName?: string;
  impact?: string;
  scoreDrop?: string;
}

interface Props {
  messages: PanelMessage[];
  onConfirm: (idx: number) => void;
  signedOff: Record<string, boolean>;
  activePage: string;
  stepProgress: Record<string, number>;
  lastCompleted: string | null;
}

/**
 * GESTALT INTELLIGENCE side panel — intelligence meter + per-page data
 * card + scrollable approval feed. Source lines 6080–6225.
 */
export function FormulaPanel({ messages, onConfirm, signedOff, activePage, stepProgress, lastCompleted }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const completedStages = INTELLIGENCE_STAGES.filter((s) => signedOff[s.id]);
  const totalPoints = completedStages.reduce((a, s) => a + s.points, 0);
  const partialPoints = stepProgress
    ? Object.values(stepProgress).reduce((a, b) => a + b, 0)
    : 0;
  const maxPoints = INTELLIGENCE_STAGES.reduce((a, s) => a + s.points, 0);
  const pct = Math.min(99, Math.round(((totalPoints + partialPoints) / maxPoints) * 100));

  const [showDopamine, setShowDopamine] = useState(false);
  const [dopamineMsg, setDopamineMsg] = useState("");
  useEffect(() => {
    if (!lastCompleted) return;
    const stage = INTELLIGENCE_STAGES.find((s) => s.id === lastCompleted);
    if (!stage) return;
    const msgs = [
      `${stage.label} is locked. GESTALT INTELLIGENCE just got smarter — and so did your exit strategy.`,
      `${stage.label} complete. Every section you finish is a data point your competitors don't have.`,
      `${stage.label} signed off. You're building something most companies never document.`,
    ];
    setDopamineMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    setShowDopamine(true);
    const t = window.setTimeout(() => setShowDopamine(false), 8000);
    return () => window.clearTimeout(t);
  }, [lastCompleted]);

  const pageData = PAGE_HEADERS[activePage];

  return (
    <aside className="w-[320px] min-w-[320px] bg-card border-l border-border flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 flex-shrink-0">
        <div
          className={`w-[7px] h-[7px] rounded-full ${
            completedStages.length > 0 ? "bg-success" : "bg-muted-foreground"
          }`}
        />
        <span className="text-gold text-[10px] tracking-[2px] font-extrabold">
          GESTALT INTELLIGENCE
        </span>
      </div>

      <div className="px-4 py-3 border-b border-border bg-gold/[0.04] flex-shrink-0">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-gold-dimlight text-[9px] tracking-[2px] font-bold">
            INTELLIGENCE LEVEL
          </span>
          <span className="text-gold text-[14px] font-black">{pct}%</span>
        </div>
        <div className="h-1 bg-background relative">
          <div
            className="h-full transition-[width] duration-300"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(to right, hsl(var(--gold) / 0.6), hsl(var(--gold)))",
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-muted-foreground text-[9px]">
            {completedStages.length}/{INTELLIGENCE_STAGES.length} sections
          </span>
          <span className="text-gold-dimlight text-[9px]">
            {(totalPoints + partialPoints).toLocaleString()} / {maxPoints.toLocaleString()}
          </span>
        </div>
        <div className="mt-2.5">
          {INTELLIGENCE_STAGES.map((stage) => {
            const done = signedOff[stage.id];
            const partial = (stepProgress[stage.id] ?? 0) > 0;
            return (
              <div
                key={stage.id}
                className={`flex items-start gap-1.5 py-1 border-b border-gold/[0.06] ${
                  done ? "opacity-100" : partial ? "opacity-70" : "opacity-35"
                }`}
              >
                <span
                  className={`text-[10px] mt-0.5 flex-shrink-0 ${
                    done ? "text-success" : partial ? "text-gold" : "text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : partial ? "◐" : "○"}
                </span>
                <div className="flex-1">
                  <div
                    className={`text-[9px] font-bold ${
                      done ? "text-gold-dimlight" : partial ? "text-gold" : "text-muted-foreground"
                    }`}
                  >
                    {stage.label}
                  </div>
                  {done && (
                    <div className="text-muted-foreground text-[11px] leading-[1.6] mt-px">
                      {stage.capability}
                    </div>
                  )}
                  {!done && partial && (
                    <div className="h-0.5 bg-background mt-1">
                      <div
                        className="h-full bg-gold/40"
                        style={{
                          width: `${Math.min(99, ((stepProgress[stage.id] ?? 0) / stage.points) * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {pageData && (
        <div className="px-4 py-3 border-b border-border bg-gold/[0.06] flex-shrink-0">
          <div className="text-gold-dimlight text-[11px] font-bold leading-[1.6] mb-1">
            {pageData.statNum} {pageData.statLabel}
          </div>
          <div className="text-gold/50 text-[9px] italic">— {pageData.source}</div>
          <div className="mt-2 text-muted-foreground text-[11px] leading-[1.7]">{pageData.payoff}</div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4">
        {showDopamine && (
          <div className="px-4 py-3.5 bg-success/[0.06] border border-success/30 mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-success text-[18px]">✓</span>
              <span className="text-success text-[10px] font-extrabold tracking-[2px]">
                SECTION COMPLETE
              </span>
            </div>
            <p className="text-success text-[12px] leading-[1.7]">{dopamineMsg}</p>
            <p className="text-success/60 text-[10px] mt-1.5">
              Keep going — the next section adds even more signal.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="mb-5">
            {msg.context && (
              <div className="text-muted-foreground text-[10px] tracking-[2px] font-bold mb-1.5">
                {msg.context}
              </div>
            )}

            {msg.isReminder && (
              <div className="bg-gold/[0.04] border border-gold/20 p-3.5 mb-2">
                <div className="text-gold-dimlight text-[9px] tracking-[2px] font-bold mb-2">
                  REMINDER EMAIL — DRAFT
                </div>
                <p className="text-muted-foreground text-[11px] leading-[1.7]">
                  <strong className="text-gold">Subject:</strong> Your GESTALT score dropped — here's
                  what's at stake
                  <br />
                  <br />
                  You left {msg.sectionName} incomplete. Without it, GESTALT INTELLIGENCE can't
                  cross-reference your {msg.impact} — and your GESTALT Score is{" "}
                  {msg.scoreDrop || "suppressed"} below where it should be.
                  <br />
                  <br />
                  <span className="text-gold">Pick up where you left off →</span>
                </p>
              </div>
            )}

            <p className="text-muted-foreground text-[12px] leading-[1.8] whitespace-pre-line">
              {msg.text}
            </p>
            {msg.metrics && (
              <div className="flex gap-1.5 flex-wrap mt-2.5">
                {msg.metrics.map((m, j) => (
                  <div key={j} className="bg-gold/[0.12] px-2.5 py-[7px]">
                    <div className="text-gold-dimlight text-[7px] tracking-[2px] opacity-70">
                      {m.label}
                    </div>
                    <div
                      className="text-[14px] font-bold"
                      style={{ color: m.color || "hsl(var(--gold))" }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {msg.needsConfirm && !msg.confirmed && (
              <button
                type="button"
                onClick={() => onConfirm(i)}
                className="bg-transparent border border-gold text-gold w-full px-3.5 py-2.5 text-[9px] tracking-[2px] font-bold cursor-pointer mt-2.5 hover:bg-gold/10"
              >
                APPROVE + CONTINUE
              </button>
            )}
            {msg.confirmed && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-success text-[10px]">✓</span>
                <span className="text-success text-[9px] tracking-[2px] font-semibold">APPROVED</span>
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="py-4">
            <p className="text-gold/60 text-[12px] leading-[1.8]">
              Complete a section and I'll review your input, cross-reference it against your
              strategy, and confirm before you move on.
            </p>
            <p className="text-gold text-[9px] mt-2.5 tracking-[1px]">
              EVERY SECTION ADDS INTELLIGENCE
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </aside>
  );
}
