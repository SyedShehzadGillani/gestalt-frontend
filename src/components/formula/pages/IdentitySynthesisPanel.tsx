import { NarrativeDisplay } from "@/components/formula/NarrativeDisplay";

interface Props {
  identitySynthesis: string;
  identityLoading: boolean;
  identityVersions: string[];
  identityVerIdx: number;
  identityTokens: string[];
  allNarrativesReady: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFocus: () => void;
  onRegenerate: () => void;
}

/**
 * "IDENTITY — THE CULMINATION" panel that synthesizes all five Context Map
 * narratives into a single statement. Direct port of source v80
 * lines 4257–4301.
 */
export function IdentitySynthesisPanel({
  identitySynthesis,
  identityLoading,
  identityVersions,
  identityVerIdx,
  identityTokens,
  allNarrativesReady,
  onPrev,
  onNext,
  onFocus,
  onRegenerate,
}: Props) {
  return (
    <div className="mb-6 bg-card border border-border border-t-[3px] border-t-gold">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="text-gold text-[9px] font-extrabold tracking-[2.5px]">
            IDENTITY — THE CULMINATION
          </div>
          <div className="text-foreground/70 text-[11px] mt-0.5">
            GESTALT INTELLIGENCE synthesizes all five narratives into a single identity statement.
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {identityVersions.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onPrev}
                className={`bg-transparent border-none text-[16px] px-1 ${
                  identityVerIdx > 0 ? "text-gold cursor-pointer" : "text-muted-foreground"
                }`}
              >
                ‹
              </button>
              <span className="text-muted-foreground text-[9px] tracking-[1px]">
                v<span className="text-gold font-black">{identityVerIdx + 1}</span>/
                {identityVersions.length}
              </span>
              <button
                type="button"
                onClick={onNext}
                className={`bg-transparent border-none text-[16px] px-1 ${
                  identityVerIdx < identityVersions.length - 1
                    ? "text-gold cursor-pointer"
                    : "text-muted-foreground"
                }`}
              >
                ›
              </button>
            </div>
          )}
          {identitySynthesis && (
            <button
              type="button"
              onClick={onFocus}
              className="px-3.5 py-1.5 bg-gold/[0.15] border border-gold/50 text-gold text-[8px] font-extrabold tracking-[1.5px] cursor-pointer"
            >
              ⊞ FOCUS
            </button>
          )}
          <button
            type="button"
            onClick={onRegenerate}
            disabled={!allNarrativesReady || identityLoading}
            className={`px-4 py-2 text-[9px] font-extrabold tracking-[1.5px] border ${
              allNarrativesReady
                ? "bg-gold border-gold text-black cursor-pointer"
                : "bg-transparent border-border text-muted-foreground cursor-default"
            }`}
          >
            {identityLoading
              ? "SYNTHESIZING…"
              : identitySynthesis
                ? "↻ REGENERATE"
                : "GENERATE IDENTITY →"}
          </button>
        </div>
      </div>

      {identityTokens.length > 0 && (
        <div className="px-5 py-2.5 border-b border-border flex items-center gap-2.5 flex-wrap">
          <span className="text-muted-foreground text-[8px] font-bold tracking-[1.5px] flex-shrink-0">
            IDENTITY WORDS ({identityTokens.length})
          </span>
          {identityTokens.map((token, i) => (
            <span
              key={token}
              className="px-2 py-0.5 bg-gold/[0.12] border border-gold/30 text-[8px] font-extrabold tracking-[1px] text-gold"
            >
              {i + 1}. {token}
            </span>
          ))}
        </div>
      )}

      <div className="px-6 py-5 min-h-[72px]">
        {identityLoading && (
          <div className="text-gold text-[10px] tracking-[2px]">
            GESTALT INTELLIGENCE IS WORKING…
          </div>
        )}
        {identitySynthesis && !identityLoading && (
          <NarrativeDisplay text={identitySynthesis} />
        )}
        {!identitySynthesis && !identityLoading && (
          <p className="text-muted-foreground text-[12px] italic">
            Generate a narrative in each of the five dimensions above, then synthesize your
            identity here.
          </p>
        )}
      </div>
    </div>
  );
}

interface IdentityFocusProps {
  identitySynthesis: string;
  identityTokens: string[];
  companyName: string;
  onExit: () => void;
}

/**
 * Full-screen overlay for the identity synthesis. Direct port of source v80
 * lines 4304–4332.
 */
export function IdentityFocusOverlay({
  identitySynthesis,
  identityTokens,
  companyName,
  onExit,
}: IdentityFocusProps) {
  return (
    <div className="fixed inset-0 bg-background z-[2000] overflow-auto">
      <div className="max-w-[860px] mx-auto px-6 pt-10 pb-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-gold text-[9px] font-extrabold tracking-[3px]">
              IDENTITY — THE CULMINATION
            </div>
            <div className="text-foreground text-[20px] font-black mt-1">{companyName}</div>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="bg-transparent border border-border text-muted-foreground px-4 py-[7px] text-[9px] font-bold tracking-[2px] cursor-pointer"
          >
            ✕ EXIT FOCUS
          </button>
        </div>
        {identityTokens.length > 0 && (
          <div className="mb-6 px-4 py-3 bg-gold/[0.06] border border-gold/20">
            <div className="text-muted-foreground text-[8px] font-bold tracking-[2px] mb-2">
              IDENTITY WORDS — {identityTokens.length} UNIQUE TERMS DRAWN FROM ALL 5 DIMENSIONS
            </div>
            <div className="flex flex-wrap gap-1.5">
              {identityTokens.map((token, i) => (
                <span
                  key={token}
                  className="px-2.5 py-0.5 bg-gold/[0.15] border border-gold/40 text-[9px] font-extrabold tracking-[1.5px] text-gold"
                >
                  {i + 1}. {token}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="px-8 py-7 bg-card border-2 border-gold">
          <NarrativeDisplay text={identitySynthesis} />
        </div>
      </div>
    </div>
  );
}
