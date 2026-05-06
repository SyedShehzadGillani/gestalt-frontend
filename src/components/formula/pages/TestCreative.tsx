import { useState, type DragEvent } from "react";
import { type Campaign } from "@/components/formula/formula-data";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  campaigns: Campaign[];
  onAi: TriggerAi;
}

/** Drag-and-drop creative tester — must select a campaign first. */
export function TestCreative({ campaigns, onAi }: Props) {
  const [selCampaign, setSelCampaign] = useState<string | null>(null);
  const [dropped, setDropped] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (selCampaign) {
      setDropped(true);
      onAi({
        context: `TEST: ${selCampaign}`,
        text: `Testing creative against "${selCampaign}".\n\n▸ AUDIENCE ALIGNMENT: Scoring against R.U.D. and Behavior Model.\n▸ WORD STACK CHECK: Comparing tone against vocabulary.\n▸ S+D+I BALANCE: Checking Surprise, Delight, Inspire mix.\n▸ BLOWBACK RISK: Scanning for misalignment with values and market.\n▸ JOURNEY STAGE FIT: Where in the 7-stage journey does this creative land?`,
        needsConfirm: true,
        metrics: [{ label: "CAMPAIGN", value: selCampaign, color: "hsl(var(--gold))" }],
      });
    }
    setDragOver(false);
  };

  return (
    <div className="border border-border p-4 bg-card mt-5">
      <div className="flex justify-between items-center mb-3.5">
        <div>
          <div className="text-foreground text-[13px] font-extrabold tracking-[2px]">TEST CREATIVE</div>
          <div className="text-muted-foreground text-[8px] tracking-[1px] mt-0.5">
            NO CREATIVE GETS EXECUTED IN A VACUUM
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className="text-muted-foreground text-[10px] tracking-[2px] font-bold mb-1.5">
          LINKED CAMPAIGN
        </div>
        {selCampaign ? (
          <div className="flex items-center gap-1.5">
            <div className="bg-gold/[0.06] border border-gold px-2.5 py-1.5 flex items-center gap-1.5">
              <span className="text-gold text-[10px] font-semibold">{selCampaign}</span>
              <button
                type="button"
                onClick={() => setSelCampaign(null)}
                className="bg-transparent border-none text-muted-foreground cursor-pointer text-[9px] hover:text-foreground"
              >
                ×
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="w-full bg-transparent border border-dashed border-gold text-gold px-3.5 py-1.5 text-[9px] tracking-[1px] cursor-pointer hover:bg-gold/[0.06]"
          >
            SELECT A CAMPAIGN FIRST — No creative in a vacuum
          </button>
        )}
      </div>
      {showPicker && (
        <div className="bg-background border border-gold p-3.5 mb-3">
          <div className="text-gold text-[10px] tracking-[2px] font-bold mb-2">WHICH CAMPAIGN?</div>
          {campaigns.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => {
                setSelCampaign(c.name);
                setShowPicker(false);
              }}
              className="block w-full text-left bg-transparent border border-border text-foreground px-2.5 py-1.5 text-[10px] cursor-pointer mb-1 hover:border-gold"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`w-full p-4 flex flex-col items-center justify-center border-2 border-dashed ${
          dragOver
            ? "bg-gold/[0.05] border-gold"
            : selCampaign
              ? "bg-background border-border"
              : "bg-background border-muted-foreground"
        } ${selCampaign ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-40"}`}
        style={{ minHeight: 100 }}
      >
        {dropped ? (
          <div className="text-center">
            <span className="text-success text-[18px]">✓</span>
            <p className="text-success text-[10px] mt-1">Analyzing in AI Consultant panel →</p>
          </div>
        ) : (
          <>
            <p
              className={`text-[10px] text-center ${
                selCampaign ? "text-muted-foreground" : "text-muted-foreground/60"
              }`}
            >
              {selCampaign
                ? "Drop a digital ad, homepage, brochure, or any creative asset"
                : "Select a campaign above first"}
            </p>
            <p className="text-muted-foreground text-[8px] tracking-[1px] mt-1">
              Audience · Awareness · Value Prop · Branding · Cost · Blowback Risk
            </p>
          </>
        )}
      </div>
    </div>
  );
}
