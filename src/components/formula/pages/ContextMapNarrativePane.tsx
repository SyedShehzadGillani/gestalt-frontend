import { AutoTextarea } from "@/components/formula/AutoTextarea";
import { NarrativeDisplay } from "@/components/formula/NarrativeDisplay";
import type { CtxDimDef, CtxDimState } from "@/components/formula/formula-data";

interface Props {
  dimDef: CtxDimDef;
  state: CtxDimState;
  onGenerate: () => void;
  onUpdate: (patch: Partial<CtxDimState>) => void;
  onDeleteVersion: () => void;
}

/**
 * Right column of `ContextMapCard` — the AI-generated narrative with version
 * nav, raw textarea, save/delete/regenerate actions, and SURPRISE/INSPIRE/
 * DESIRE mantra strip. Direct port of source v80 lines 4058–4147.
 */
export function ContextMapNarrativePane({
  dimDef,
  state,
  onGenerate,
  onUpdate,
  onDeleteVersion,
}: Props) {
  const hasNarrative = state.narrative.trim().length > 0;
  const today = new Date();
  const datePrefix = `${today.getMonth() + 1}.${String(today.getDate()).padStart(2, "0")}`;

  if (!hasNarrative) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 gap-3">
        <div className="text-muted-foreground text-[12px] text-center leading-[1.7] italic max-w-[260px]">
          "{dimDef.starter}…"
          <br />
          <span className="text-[10px]">Add words to the list, then generate.</span>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          className="px-6 py-2.5 border-none text-black text-[10px] font-extrabold tracking-[2px] cursor-pointer"
          style={{ background: dimDef.color }}
        >
          GENERATE NARRATIVE →
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <span className="text-gold/70 text-[8px] font-extrabold tracking-[2px]">
          GESTALT INTELLIGENCE NARRATIVE
        </span>
        <span className="text-muted-foreground text-[11px]">
          {datePrefix}-
          <span className="font-black" style={{ color: dimDef.color }}>
            v{state.verIdx + 1}
          </span>
        </span>
      </div>

      <div className="px-5 py-4 flex-1">
        <NarrativeDisplay text={state.narrative} wordColor={dimDef.color} />
      </div>

      {/* SURPRISE / INSPIRE / DESIRE mantra */}
      <div
        className="px-5 py-2.5 flex border-t"
        style={{
          background: `${dimDef.color}08`,
          borderTopColor: `${dimDef.color}20`,
        }}
      >
        {["SURPRISE THEM", "INSPIRE THEM", "CREATE DESIRE"].map((m, i) => (
          <div
            key={m}
            className={`flex-1 text-center py-1 ${i < 2 ? "border-r" : ""}`}
            style={{ borderRightColor: `${dimDef.color}20` }}
          >
            <span
              className="text-[8px] font-black tracking-[2.5px]"
              style={{ color: dimDef.color }}
            >
              {m}
            </span>
          </div>
        ))}
      </div>

      <div className="h-px" style={{ background: `${dimDef.color}20` }} />

      {/* Raw text header w/ version nav */}
      <div className="px-4 py-2 border-b border-border flex items-center gap-2.5">
        <span className="text-foreground text-[9px] tracking-[2px] font-extrabold flex-1">
          RAW TEXT
        </span>
        {state.versions.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                state.verIdx > 0 &&
                onUpdate({
                  verIdx: state.verIdx - 1,
                  narrative: state.versions[state.verIdx - 1],
                  deleteConfirm: false,
                })
              }
              className="bg-transparent border-none cursor-pointer text-[14px] px-1"
              style={{
                color: state.verIdx > 0 ? dimDef.color : "var(--muted-foreground)",
              }}
            >
              ‹
            </button>
            <span className="text-muted-foreground text-[9px]">
              {datePrefix}-
              <span className="font-black" style={{ color: dimDef.color }}>
                v{state.verIdx + 1}
              </span>
            </span>
            <button
              type="button"
              onClick={() =>
                state.verIdx < state.versions.length - 1 &&
                onUpdate({
                  verIdx: state.verIdx + 1,
                  narrative: state.versions[state.verIdx + 1],
                  deleteConfirm: false,
                })
              }
              className="bg-transparent border-none cursor-pointer text-[14px] px-1"
              style={{
                color:
                  state.verIdx < state.versions.length - 1
                    ? dimDef.color
                    : "var(--muted-foreground)",
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="px-4">
        <AutoTextarea
          value={state.narrative}
          disabled={state.narSaved}
          onChange={(e) => {
            if (state.narSaved) return;
            const updated = [...state.versions];
            updated[state.verIdx] = e.target.value;
            onUpdate({ narrative: e.target.value, versions: updated });
          }}
          className="!bg-transparent !border-none !px-0 !py-3.5 !text-[18px] !leading-[1.9]"
          minHeight={80}
        />
      </div>

      {/* Action bar */}
      <div className="px-4 py-2 bg-background border-t border-border flex items-center gap-1.5">
        {!state.deleteConfirm ? (
          <button
            type="button"
            onClick={() => onUpdate({ deleteConfirm: true })}
            className="bg-transparent border border-border text-muted-foreground px-2.5 py-1 text-[8px] font-bold tracking-[1.5px] cursor-pointer"
          >
            DELETE VERSION
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-destructive text-[10px]">Permanently delete?</span>
            <button
              type="button"
              onClick={onDeleteVersion}
              className="bg-destructive border-none text-white px-2.5 py-1 text-[8px] font-extrabold cursor-pointer"
            >
              YES
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ deleteConfirm: false })}
              className="bg-transparent border border-border text-muted-foreground px-2 py-1 text-[8px] cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        )}
        <div className="ml-auto flex gap-1.5">
          {state.narSaved ? (
            <button
              type="button"
              onClick={() => onUpdate({ narSaved: false })}
              className="bg-transparent border border-border text-muted-foreground px-3 py-1 text-[8px] font-bold tracking-[1px] cursor-pointer"
            >
              ✎ EDIT
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                onUpdate({
                  narSaved: true,
                  savedAt: {
                    ...state.savedAt,
                    [state.verIdx]: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                })
              }
              className="px-3 py-1 text-[8px] font-extrabold tracking-[1px] cursor-pointer border"
              style={{
                background: `${dimDef.color}15`,
                borderColor: `${dimDef.color}50`,
                color: dimDef.color,
              }}
            >
              SAVE ✓
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onUpdate({ narSaved: false });
              onGenerate();
            }}
            className="bg-transparent px-3.5 py-1 text-[8px] font-extrabold tracking-[1.5px] cursor-pointer border"
            style={{ borderColor: `${dimDef.color}50`, color: dimDef.color }}
          >
            ↻ NEW VERSION
          </button>
        </div>
      </div>
    </>
  );
}
