import { Lock } from "lucide-react";
import { FormulaPageHeader } from "@/components/formula/FormulaPageHeader";
import { FormulaCard } from "@/components/formula/FormulaCard";
import { FormulaField } from "@/components/formula/FormulaField";
import type { TriggerAi } from "@/components/formula/page-types";

interface Props {
  onAi: TriggerAi;
}

const ASSET_KEYS = ["IDENTITY SYSTEM", "VOICE + TONE", "VISUAL STANDARDS", "APPLICATION RULES"] as const;

/**
 * 02.30 — Brand Architecture. Documents standards that flow into VAULT.
 * VAULT integration is read-only mock for now (all assets missing → P1 callouts).
 */
export function ArchPage({ onAi }: Props) {
  // In production this reads from Supabase VAULT table. Mock keeps the missing
  // banner visible so the UX surface for the empty state is exercised.
  const vaultAssets: Record<(typeof ASSET_KEYS)[number], boolean> = {
    "IDENTITY SYSTEM": false,
    "VOICE + TONE": false,
    "VISUAL STANDARDS": false,
    "APPLICATION RULES": false,
  };
  const missing = ASSET_KEYS.filter((k) => !vaultAssets[k]);

  return (
    <div>
      <FormulaPageHeader pageId="02.30" />

      {missing.length > 0 && (
        <div className="px-5 py-4 bg-red/[0.06] border border-red mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-red text-[11px] font-extrabold tracking-[2px] mb-1.5">
                VAULT — ASSETS MISSING
              </div>
              <div className="text-muted-foreground text-[13px] leading-[1.7] mb-2.5">
                GESTALT INTELLIGENCE has flagged {missing.length} brand asset{" "}
                {missing.length === 1 ? "category" : "categories"} not yet uploaded to VAULT. Upload
                your assets and this section auto-populates. Document your standards below in the
                meantime.
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {missing.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-0.5 bg-red/10 border border-red/30 text-red text-[9px] font-bold tracking-[1px]"
                  >
                    P1: {m}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="bg-gold text-black px-4 py-2 text-[9px] font-extrabold tracking-[2px] cursor-pointer flex-shrink-0 ml-4"
            >
              GO TO VAULT →
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {ASSET_KEYS.map((label) => {
          const hasAsset = vaultAssets[label];
          return (
            <FormulaCard key={label} innerClassName="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gold text-[10px] tracking-[3px] font-bold">{label}</span>
                {hasAsset ? (
                  <span className="text-success text-[8px] font-bold tracking-[1px] px-2 py-0.5 border border-success/30 bg-success/10">
                    ✓ FROM VAULT
                  </span>
                ) : (
                  <span className="text-red text-[8px] font-bold tracking-[1px] px-2 py-0.5 border border-red/30 bg-red/[0.04]">
                    MISSING
                  </span>
                )}
              </div>
              <div className="w-6 h-0.5 bg-gold mb-4" />
              {hasAsset ? (
                <div className="px-3.5 py-3 bg-background border border-success/20">
                  <div className="text-success text-[9px] tracking-[1px]">Asset loaded from VAULT</div>
                </div>
              ) : (
                <>
                  <FormulaField placeholder={`Document your ${label.toLowerCase()} standards...`} multiline />
                  <button
                    type="button"
                    className="w-full px-2.5 py-2.5 bg-transparent border border-dashed border-border text-muted-foreground text-[9px] tracking-[2px] cursor-pointer mt-2 flex items-center justify-center gap-1.5 hover:text-foreground"
                  >
                    <Lock className="w-2.5 h-2.5" />
                    UPLOAD TO VAULT
                  </button>
                </>
              )}
            </FormulaCard>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          onAi({
            context: "02.30 BRAND ARCHITECTURE",
            text:
              "Brand Architecture documented. Every standard you defined cascades into VAULT and becomes enforceable.\n\nGESTALT INTELLIGENCE will now:\n▸ Flag any campaign creative that contradicts your Voice + Tone\n▸ Alert when external agencies submit materials that violate your Visual Standards\n▸ Score every S.U.M. message for brand alignment\n\nYour brand now stays consistent even when you're not in the room.",
            needsConfirm: true,
            metrics: [
              { label: "FEEDS", value: "VAULT", color: "hsl(var(--gold))" },
              {
                label: "STATUS",
                value: missing.length === 0 ? "COMPLETE" : "PARTIAL",
                color: missing.length === 0 ? "hsl(var(--success))" : "#c45c00",
              },
            ],
          })
        }
        className="bg-transparent border border-gold text-gold px-5 py-2.5 text-[10px] tracking-[2px] font-bold cursor-pointer mt-5 hover:bg-gold/10"
      >
        CONFIRM ARCHITECTURE → AI REVIEW
      </button>
    </div>
  );
}
