import { useState } from "react";
import { JOURNEY_STAGES, type Campaign } from "@/components/formula/formula-data";
import { SDIBadges } from "@/components/formula/SDIBadges";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  campaign: Campaign;
  onClose: () => void;
  onAi: TriggerAi;
}

interface StageIdea {
  text: string;
  owner: string;
  timeline: string;
}

interface StageData {
  ideas: StageIdea[];
}

const SDI_COLORS: Record<"S" | "D" | "I", string> = {
  S: "#58d3ff",
  D: "#e3398c",
  I: "#9aca3e",
};

/** 7-stage lifecycle builder for one campaign — ideas + autopsy. */
export function CampaignLifecycle({ campaign, onClose, onAi }: Props) {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [stageData, setStageData] = useState<Record<string, StageData>>({});
  const [showAutopsy, setShowAutopsy] = useState(false);

  const completedStages = JOURNEY_STAGES.filter((s) => (stageData[s.id]?.ideas?.length ?? 0) > 0)
    .length;
  const progress = Math.round((completedStages / 7) * 100);
  const totalIdeas = Object.values(stageData).reduce((a, s) => a + (s.ideas?.length ?? 0), 0);

  const addIdea = (stageId: string) =>
    setStageData((prev) => ({
      ...prev,
      [stageId]: {
        ideas: [...(prev[stageId]?.ideas ?? []), { text: "", owner: "", timeline: "" }],
      },
    }));

  const handleFinish = () => {
    if (completedStages < 7) {
      const missing = JOURNEY_STAGES.find((s) => !stageData[s.id]?.ideas?.length);
      if (missing) setActiveStage(missing.id);
      return;
    }
    onAi({
      context: `CAMPAIGN COMPLETE: ${campaign.name}`,
      text: `"${campaign.name}" is fully mapped across all 7 stages.\n\n${Object.entries(stageData)
        .map(
          ([id, d]) =>
            `▸ ${JOURNEY_STAGES.find((s) => s.id === id)?.label}: ${d.ideas?.length ?? 0} execution ideas`,
        )
        .join("\n")}\n\nThis campaign now has a complete roadmap from TRIGGER to INFLUENCER. Most companies build 3-5 reasons to do business with them. You've built ${totalIdeas}.`,
      needsConfirm: true,
      metrics: [
        { label: "STAGES", value: "7/7", color: "hsl(var(--success))" },
        { label: "IDEAS", value: String(totalIdeas), color: "hsl(var(--gold))" },
      ],
    });
  };

  return (
    <div className="bg-background border border-gold">
      <div className="bg-card px-5 py-4 border-b border-border flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-foreground text-[16px] font-extrabold tracking-[2px]">
              {campaign.name}
            </span>
            <span className="text-muted-foreground text-[9px]">{campaign.type}</span>
          </div>
          <div className="flex items-center gap-2.5 mt-1.5">
            <SDIBadges types={campaign.sdi} />
            <span className="text-gold text-[10px] font-bold">{campaign.time}</span>
            <span
              className={`text-[9px] font-bold ${
                progress >= 100 ? "text-success" : "text-[#c45c00]"
              }`}
            >
              GROWTH OPP: {campaign.growth}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <div className="text-muted-foreground text-[8px] tracking-[1px]">JOURNEY COMPLETION</div>
            <div
              className={`text-[18px] font-black ${
                progress >= 100 ? "text-success" : "text-gold"
              }`}
            >
              {progress}%
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border border-border text-muted-foreground w-7 h-7 cursor-pointer text-[12px] hover:text-foreground hover:border-gold/40"
          >
            ×
          </button>
        </div>
      </div>

      <div className="bg-gold/[0.04] border-b border-border px-5 py-2.5">
        <p className="text-muted-foreground text-[13px] leading-[1.8]">
          <span className="text-gold font-bold">BUILD 100 REASONS</span> for doing business with
          you — not 3. Every stage is a chance to surprise, delight, and inspire. Map it all. Leave
          nothing to chance.
        </p>
      </div>

      <div className="px-5 py-3 border-b border-border">
        <div className="flex gap-0.5">
          {JOURNEY_STAGES.map((stage) => {
            const hasData = (stageData[stage.id]?.ideas?.length ?? 0) > 0;
            const isActive = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(isActive ? null : stage.id)}
                className={`flex-1 px-1 py-2 cursor-pointer text-center transition-all border ${
                  isActive ? "border-2" : "border"
                }`}
                style={{
                  background: isActive
                    ? stage.color
                    : hasData
                      ? `${stage.color}33`
                      : "hsl(var(--card))",
                  borderColor: isActive ? stage.color : hasData ? stage.color : "hsl(var(--border))",
                }}
              >
                <div
                  className="text-[7px] font-extrabold tracking-[1px]"
                  style={{
                    color: isActive
                      ? "#fff"
                      : hasData
                        ? stage.color
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  {stage.label}
                </div>
                <div className="text-[7px] mt-0.5 text-muted-foreground">
                  {hasData ? `${stageData[stage.id].ideas.length} ideas` : "—"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {activeStage &&
        (() => {
          const stage = JOURNEY_STAGES.find((s) => s.id === activeStage);
          if (!stage) return null;
          const data = stageData[activeStage] ?? { ideas: [] };
          return (
            <div className="p-5 border-b border-border">
              <div className="flex gap-4 mb-4">
                <div className="w-1 flex-shrink-0" style={{ background: stage.color }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[13px] font-extrabold tracking-[2px]"
                      style={{ color: stage.color }}
                    >
                      {stage.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[14px] leading-[1.8] mb-2.5">
                    {stage.question}
                  </p>
                  <div className="text-foreground text-[10px] font-bold tracking-[2px] mb-2">
                    EXECUTION IDEAS — YOUR WISH LIST
                  </div>
                  {data.ideas.map((idea, idx) => (
                    <div key={idx} className="flex gap-2 mb-1.5 items-start">
                      <span
                        className="text-[8px] font-bold min-w-[20px] pt-1.5"
                        style={{ color: stage.color }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <input
                          placeholder="Describe the idea or action..."
                          defaultValue={idea.text}
                          className="w-full bg-background border border-border text-foreground px-2.5 py-1.5 text-[11px] outline-none mb-1 focus:border-gold"
                        />
                        <div className="flex gap-1">
                          <input
                            placeholder="Owner / Team"
                            className="flex-1 bg-background border border-border text-muted-foreground px-2 py-1 text-[8px] outline-none focus:border-gold"
                          />
                          <input
                            placeholder="Timeline"
                            className="w-20 bg-background border border-border text-muted-foreground px-2 py-1 text-[8px] outline-none focus:border-gold"
                          />
                          {(["S", "D", "I"] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              className="w-4 h-4 text-[6px] font-bold bg-transparent border border-border cursor-pointer hover:border-gold"
                              style={{ color: SDI_COLORS[t] }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addIdea(activeStage)}
                    className="w-full bg-transparent border border-dashed px-3 py-2 text-[9px] tracking-[2px] font-semibold cursor-pointer mt-1 hover:bg-foreground/5"
                    style={{ borderColor: stage.color, color: stage.color }}
                  >
                    + ADD IDEA TO {stage.label}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      <div className="px-5 py-3.5 border-b border-border">
        <button
          type="button"
          onClick={() => setShowAutopsy((s) => !s)}
          className={`bg-transparent border px-4 py-2 text-[9px] tracking-[2px] font-bold cursor-pointer ${
            showAutopsy
              ? "border-red text-red bg-red/10"
              : "border-border text-muted-foreground hover:border-red/40 hover:text-red"
          }`}
        >
          ⚠ CAMPAIGN AUTOPSY — BEFORE YOU KILL IT, DIAGNOSE IT
        </button>
        {showAutopsy && (
          <div className="mt-3 p-4 bg-red/[0.04] border border-red">
            <p className="text-muted-foreground text-[13px] leading-[1.8] mb-3">
              Before killing this campaign, conduct an autopsy. Campaigns fail for identifiable
              reasons — and sometimes a "failed" campaign is feeding another by fulfilling a smaller
              but critical role.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { q: "Which journey stages had the weakest execution?", p: "Identify the gap..." },
                {
                  q: "Was the TRIGGER correctly identified?",
                  p: "Most campaigns fail because they assume awareness exists...",
                },
                {
                  q: "Did the audience actually encounter this campaign?",
                  p: "Right channel, right time?",
                },
                {
                  q: "Is this campaign feeding another campaign?",
                  p: "What smaller role does it play?",
                },
              ].map((item) => (
                <div key={item.q}>
                  <div className="text-red text-[8px] font-semibold tracking-[1px] mb-1">
                    {item.q}
                  </div>
                  <textarea
                    placeholder={item.p}
                    className="w-full bg-background border border-border text-foreground px-2 py-1.5 text-[10px] outline-none resize-none overflow-hidden focus:border-gold"
                    style={{ minHeight: 52 }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-transparent border border-success text-success px-3.5 py-1.5 text-[8px] tracking-[2px] font-bold cursor-pointer hover:bg-success/10"
              >
                REVIVE — MODIFY + RELAUNCH
              </button>
              <button
                type="button"
                className="bg-transparent border border-[#c45c00] text-[#c45c00] px-3.5 py-1.5 text-[8px] tracking-[2px] font-bold cursor-pointer hover:bg-[#c45c00]/10"
              >
                REASSIGN — FEEDS ANOTHER CAMPAIGN
              </button>
              <button
                type="button"
                className="bg-transparent border border-red text-red px-3.5 py-1.5 text-[8px] tracking-[2px] font-bold cursor-pointer hover:bg-red/10"
              >
                KILL — DOCUMENT + ARCHIVE
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-4 flex justify-between items-center">
        <div className="text-muted-foreground text-[8px] tracking-[1px]">
          {completedStages}/7 STAGES MAPPED · {totalIdeas} TOTAL IDEAS
        </div>
        <button
          type="button"
          onClick={handleFinish}
          className={`border-none text-black px-6 py-2.5 text-[11px] tracking-[3px] font-extrabold cursor-pointer ${
            completedStages >= 7 ? "bg-success hover:bg-success/90" : "bg-gold hover:bg-gold/90"
          }`}
        >
          {completedStages >= 7
            ? "✓ FINISH CYCLE — SUBMIT TO AI"
            : `FINISH CYCLE — ${7 - completedStages} STAGES REMAINING`}
        </button>
      </div>
    </div>
  );
}
