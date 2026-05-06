import { useState } from "react";
import { CAMPAIGNS } from "@/components/formula/formula-data";
import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { FormulaCard } from "@/components/formula/FormulaCard";
import { SDIBadges } from "@/components/formula/SDIBadges";
import { SDIFlywheel } from "@/components/formula/SDIFlywheel";
import { CampaignLifecycle } from "@/components/formula/pages/CampaignLifecycle";
import { TestCreative } from "@/components/formula/pages/TestCreative";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
}

/** 03.20 — Campaign Options. Card list → click to expand 7-stage lifecycle. */
export function CampaignsPage({ onAi }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (expanded) {
    const camp = CAMPAIGNS.find((c) => c.name === expanded);
    if (camp) {
      return (
        <div>
          <FormulaPageHeader pageId="03.20" />
          <CampaignLifecycle
            campaign={camp}
            onClose={() => setExpanded(null)}
            onAi={onAi}
          />
        </div>
      );
    }
  }

  return (
    <div>
      <FormulaPageHeader pageId="03.20" />

      <div className="bg-background border border-border p-4 mb-5">
        <p className="text-muted-foreground text-[14px] leading-[1.8]">
          Most companies fail their campaigns because they skip the TRIGGER — they assume the
          customer already knows they need the product.{" "}
          <span className="text-gold font-bold">
            We don't know where the customer is in their journey when they encounter you.
          </span>{" "}
          Each campaign below must map the complete 7-stage journey. Click{" "}
          <span className="text-gold">FINISH CYCLE</span> to build the full roadmap.
        </p>
      </div>

      {CAMPAIGNS.map((c) => (
        <FormulaCard
          key={c.name}
          className="mb-2"
          onClick={() => setExpanded(c.name)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-foreground text-[16px] font-extrabold tracking-[1px]">
                  {c.name}
                </span>
                <span className="text-muted-foreground text-[8px]">{c.type}</span>
              </div>
              <p className="text-muted-foreground text-[10px] my-2">{c.description}</p>
              <SDIBadges types={c.sdi} />
            </div>
            <div className="text-right">
              <span className="text-gold text-[10px] font-bold tracking-[2px]">{c.time}</span>
              <div
                className={`text-[10px] font-bold mt-1 ${
                  c.growth >= 70 ? "text-success" : "text-[#c45c00]"
                }`}
              >
                GROWTH OPP: {c.growth}%
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(c.name);
                }}
                className="bg-gold border-none text-black px-3.5 py-1.5 text-[8px] tracking-[2px] font-extrabold cursor-pointer mt-2 hover:bg-gold/90"
              >
                FINISH CYCLE
              </button>
            </div>
          </div>
        </FormulaCard>
      ))}

      <button
        type="button"
        className="w-full bg-transparent border border-dashed border-border text-muted-foreground py-3.5 cursor-pointer text-[10px] tracking-[2px] font-semibold mt-2 hover:text-foreground hover:border-gold/40"
      >
        + ADD CAMPAIGN
      </button>

      <div className="mt-6 p-4 bg-card border border-border">
        <SDIFlywheel />
      </div>

      <TestCreative campaigns={CAMPAIGNS} onAi={onAi} />
    </div>
  );
}
