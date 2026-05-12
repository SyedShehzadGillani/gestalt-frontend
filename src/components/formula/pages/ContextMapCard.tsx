import { ContextMapNarrativePane } from "@/components/formula/pages/ContextMapNarrativePane";
import {
  CTX_DATA,
  type CtxDimDef,
  type CtxDimState,
} from "@/components/formula/formula-data";

interface Props {
  dimDef: CtxDimDef;
  state: CtxDimState;
  primaryWords: string[];
  suggestions: string[];
  onAddWord: (word: string) => void;
  onRemoveWord: (word: string) => void;
  onShuffle: () => void;
  onFocus: () => void;
  onGenerate: () => void;
  onUpdate: (patch: Partial<CtxDimState>) => void;
  onDeleteVersion: () => void;
  onLoadSuggestions: () => void;
}

/**
 * One context-map card — left column word list, right column narrative.
 * Direct port of the source v80 `CtxCard` (lines 3983–4151).
 */
export function ContextMapCard({
  dimDef,
  state,
  primaryWords,
  suggestions,
  onAddWord,
  onRemoveWord,
  onShuffle,
  onFocus,
  onGenerate,
  onUpdate,
  onDeleteVersion,
  onLoadSuggestions,
}: Props) {
  const allWords = [...new Set([...primaryWords, ...state.words])].slice(0, 5);
  const data = CTX_DATA[dimDef.key];

  return (
    <div
      className="mb-7 bg-card border border-border"
      style={{ borderTopWidth: 3, borderTopColor: dimDef.color }}
    >
      {/* Card header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <span
          className="text-[9px] font-extrabold tracking-[2.5px]"
          style={{ color: dimDef.color }}
        >
          {dimDef.label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-[9px]">{allWords.length}/5 words</span>
          <button
            type="button"
            onClick={onShuffle}
            className="bg-transparent px-2.5 py-0.5 text-[8px] font-bold tracking-[1.5px] cursor-pointer border"
            style={{ borderColor: `${dimDef.color}40`, color: dimDef.color }}
          >
            ↻ SHUFFLE
          </button>
          <button
            type="button"
            onClick={onFocus}
            className="px-2.5 py-0.5 text-[8px] font-extrabold tracking-[1.5px] cursor-pointer border"
            style={{
              background: `${dimDef.color}15`,
              borderColor: `${dimDef.color}50`,
              color: dimDef.color,
            }}
          >
            ⊞ FOCUS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[220px_1fr] min-h-[320px]">
        {/* LEFT — word list */}
        <div className="p-4 border-r border-border">
          <div className="text-muted-foreground text-[8px] tracking-[2px] font-bold mb-2.5">
            WORD LIST
          </div>

          {primaryWords.map((w) => (
            <div
              key={w}
              className="flex items-center gap-1.5 py-1 border-b border-border"
            >
              <span
                className="w-1.5 h-1.5 inline-block flex-shrink-0"
                style={{ background: dimDef.color }}
              />
              <span
                className="text-[11px] font-bold flex-1"
                style={{ color: dimDef.color }}
              >
                {w}
              </span>
              <span className="text-muted-foreground text-[7px]">PRIMARY</span>
            </div>
          ))}

          {state.words.map((w) => (
            <div
              key={w}
              className="flex items-center gap-1.5 py-1 border-b border-border"
            >
              <span className="w-1.5 h-1.5 inline-block flex-shrink-0 bg-muted-foreground" />
              <span className="text-foreground/70 text-[11px] flex-1">{w}</span>
              <button
                type="button"
                onClick={() => onRemoveWord(w)}
                className="bg-transparent border-none cursor-pointer text-[22px] px-1 leading-none"
                style={{ color: `${dimDef.color}60` }}
              >
                ×
              </button>
            </div>
          ))}

          {allWords.length < 5 && (
            <div className="mt-2.5">
              <div className="text-muted-foreground text-[8px] tracking-[1.5px] mb-1.5">
                ADD A WORD
              </div>
              <div className="flex flex-wrap gap-[3px]">
                {suggestions.length > 0 ? (
                  suggestions
                    .filter((w) => !allWords.includes(w))
                    .slice(0, 8)
                    .map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => onAddWord(w)}
                        className="px-2 py-0.5 bg-transparent border border-border text-muted-foreground text-[9px] cursor-pointer hover:text-foreground"
                      >
                        + {w}
                      </button>
                    ))
                ) : (
                  <button
                    type="button"
                    onClick={onLoadSuggestions}
                    className="px-2 py-0.5 bg-transparent text-[8px] font-bold tracking-[1px] cursor-pointer border border-dashed"
                    style={{ borderColor: `${dimDef.color}60`, color: dimDef.color }}
                  >
                    LOAD SUGGESTIONS
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Citation */}
          <div
            className="mt-4 px-2.5 py-2 border"
            style={{ background: `${dimDef.color}06`, borderColor: `${dimDef.color}15` }}
          >
            <div
              className="text-[10px] leading-[1.6] mb-0.5"
              style={{ color: dimDef.color }}
            >
              ◆ {data.stat}
            </div>
            <div className="text-muted-foreground text-[8px] italic">— {data.source}</div>
          </div>
        </div>

        {/* RIGHT — narrative */}
        <div className="flex flex-col">
          <ContextMapNarrativePane
            dimDef={dimDef}
            state={state}
            onGenerate={onGenerate}
            onUpdate={onUpdate}
            onDeleteVersion={onDeleteVersion}
          />
        </div>
      </div>
    </div>
  );
}
