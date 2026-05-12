import { useState } from "react";
import { InstructionBlock } from "@/components/formula/InstructionBlock";
import { NarrativeDisplay } from "@/components/formula/NarrativeDisplay";
import { ContextMapCard } from "@/components/formula/pages/ContextMapCard";
import { ContextMapFocus } from "@/components/formula/pages/ContextMapFocus";
import {
  IdentityFocusOverlay,
  IdentitySynthesisPanel,
} from "@/components/formula/pages/IdentitySynthesisPanel";
import {
  CTX_DIMS,
  CTX_KEYS,
  CTX_POOLS,
  TOUR_TIPS,
  extractCompanyName,
  getPrimaryCtxWords,
  makeCtxNarState,
  type CtxDimDef,
  type CtxDimState,
  type CtxKey,
} from "@/components/formula/formula-data";

interface Props {
  /** 10 selected words from Phase B. */
  selected: string[];
  /** The Phase D brand narrative shown as reference. May be empty string. */
  brandNarrative: string;
  /** Phase A description text — used to extract the company name. */
  descText: string;
  onBack: () => void;
  onNext: () => void;
}

/**
 * Step 3 — Context Map. Five brand-identity dimensions, each with a word list
 * and a versioned AI-generated narrative the user edits. Identity Synthesis
 * panel rolls all five up into one statement. Direct port of source v80
 * lines 3835–4341.
 */
export function CompetitiveStepContextMap({
  selected,
  brandNarrative,
  descText,
  onBack,
  onNext,
}: Props) {
  const companyName = extractCompanyName(descText) || "THIS COMPANY";

  const [ctxNar, setCtxNar] = useState<Record<CtxKey, CtxDimState>>(makeCtxNarState);
  const [ctxSecondary, setCtxSecondary] = useState<Record<CtxKey, string[]>>({
    objective: [],
    culture: [],
    customer: [],
    vision: [],
    persona: [],
  });
  const [ctxShuffleIdx, setCtxShuffleIdx] = useState<Record<CtxKey, number>>({
    objective: 0,
    culture: 0,
    customer: 0,
    vision: 0,
    persona: 0,
  });
  const [focusMode, setFocusMode] = useState(false);
  const [focusDimKey, setFocusDimKey] = useState<CtxKey | null>(null);
  const [focusIdentity, setFocusIdentity] = useState(false);

  const [identitySynthesis, setIdentitySynthesis] = useState("");
  const [identityLoading, setIdentityLoading] = useState(false);
  const [identityVersions, setIdentityVersions] = useState<string[]>([]);
  const [identityVerIdx, setIdentityVerIdx] = useState(-1);
  const [identityTokens, setIdentityTokens] = useState<string[]>([]);

  const updateCtx = (key: CtxKey, patch: Partial<CtxDimState>) =>
    setCtxNar((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const generateCtxNarrative = (dimDef: CtxDimDef) => {
    const dim = ctxNar[dimDef.key];
    const allWords = [
      ...new Set([...getPrimaryCtxWords(selected, dimDef.wordDims), ...dim.words]),
    ].slice(0, 5);
    const templateIdx = dim.versions.length % dimDef.templates.length;
    const nar = dimDef.templates[templateIdx](companyName, allWords);
    const lastVer = dim.versions[dim.versions.length - 1];
    if (nar === lastVer) return; // duplicate guard
    const nextVersions = [...dim.versions, nar];
    updateCtx(dimDef.key, {
      versions: nextVersions,
      verIdx: nextVersions.length - 1,
      narrative: nar,
    });
  };

  const addCtxWord = (key: CtxKey, word: string) => {
    const dim = ctxNar[key];
    const dimDef = CTX_DIMS.find((d) => d.key === key);
    if (!dimDef) return;
    const allWords = [
      ...new Set([...getPrimaryCtxWords(selected, dimDef.wordDims), ...dim.words]),
    ];
    if (allWords.length >= 5 || dim.words.includes(word)) return;
    updateCtx(key, { words: [...dim.words, word] });
  };

  const removeCtxWord = (key: CtxKey, word: string) =>
    updateCtx(key, { words: ctxNar[key].words.filter((w) => w !== word) });

  const shuffleCtxDim = (key: CtxKey) => {
    const pools = CTX_POOLS[key];
    const nextIdx = (ctxShuffleIdx[key] + 1) % pools.length;
    setCtxShuffleIdx((prev) => ({ ...prev, [key]: nextIdx }));
    setCtxSecondary((prev) => ({ ...prev, [key]: pools[nextIdx] }));
  };

  const initSuggestions = (key: CtxKey) => {
    if (!ctxSecondary[key].length) {
      setCtxSecondary((prev) => ({ ...prev, [key]: CTX_POOLS[key][0] }));
    }
  };

  const deleteCtxVersion = (key: CtxKey) => {
    const dim = ctxNar[key];
    if (dim.versions.length === 1) {
      updateCtx(key, { versions: [], verIdx: -1, narrative: "", deleteConfirm: false });
      return;
    }
    const updated = dim.versions.filter((_, i) => i !== dim.verIdx);
    const newIdx = Math.max(0, dim.verIdx - 1);
    updateCtx(key, {
      versions: updated,
      verIdx: newIdx,
      narrative: updated[newIdx],
      deleteConfirm: false,
    });
  };

  const allNarrativesReady = CTX_KEYS.every(
    (k) => ctxNar[k].narrative.trim().length > 20,
  );

  const runIdentityAI = () => {
    setIdentityLoading(true);
    setTimeout(() => {
      const seen = new Set([companyName.toUpperCase()]);
      const uniqueTokens: string[] = [];
      CTX_DIMS.forEach((d) => {
        const n = ctxNar[d.key].narrative;
        if (!n) return;
        const matches = n.match(/\[([^\]]+)\]/g) || [];
        matches.forEach((m) => {
          const word = m.slice(1, -1).toUpperCase();
          if (!seen.has(word)) {
            seen.add(word);
            uniqueTokens.push(word);
          }
        });
      });
      const w = (i: number) => (uniqueTokens[i] ? `[${uniqueTokens[i]}]` : null);
      const cn = `[${companyName}]`;
      const sentences = [
        `${cn} is defined by the things that can't be copied.`,
        w(0) && w(1)
          ? `${w(0)} and ${w(1)} are not aspirations — they are the operating standard.`
          : w(0)
            ? `${w(0)} is the operating standard.`
            : null,
        w(2) && w(3) ? `The culture runs on ${w(2)}. The customer feels ${w(3)}.` : null,
        w(4) && w(5) ? `${w(4)} is the promise. ${w(5)} is the proof.` : null,
        w(6) && w(7) ? `${w(6)} drives every decision. ${w(7)} defines every relationship.` : null,
        w(8) && w(9)
          ? `${w(8)} and ${w(9)} are not marketing language — they are operating instructions.`
          : w(8)
            ? `${w(8)} is not marketing language — it is an operating instruction.`
            : null,
        w(10) ? `The vision is ${w(10)} — and the brand was built to earn it.` : null,
        `This is the identity that earns the multiple.`,
      ]
        .filter(Boolean)
        .join(" ");

      const nextVersions = [...identityVersions, sentences];
      setIdentityVersions(nextVersions);
      setIdentityVerIdx(nextVersions.length - 1);
      setIdentitySynthesis(sentences);
      setIdentityTokens(uniqueTokens.slice(0, 12));
      setIdentityLoading(false);
    }, 1800);
  };

  const renderCard = (dimDef: CtxDimDef) => {
    const state = ctxNar[dimDef.key];
    const primaryWords = getPrimaryCtxWords(selected, dimDef.wordDims);
    const suggestions = ctxSecondary[dimDef.key] || [];
    return (
      <ContextMapCard
        key={dimDef.key}
        dimDef={dimDef}
        state={state}
        primaryWords={primaryWords}
        suggestions={suggestions}
        onAddWord={(w) => addCtxWord(dimDef.key, w)}
        onRemoveWord={(w) => removeCtxWord(dimDef.key, w)}
        onShuffle={() => {
          initSuggestions(dimDef.key);
          shuffleCtxDim(dimDef.key);
        }}
        onFocus={() => {
          setFocusMode(true);
          setFocusDimKey(dimDef.key);
        }}
        onGenerate={() => {
          initSuggestions(dimDef.key);
          generateCtxNarrative(dimDef);
        }}
        onUpdate={(patch) => updateCtx(dimDef.key, patch)}
        onDeleteVersion={() => deleteCtxVersion(dimDef.key)}
        onLoadSuggestions={() => initSuggestions(dimDef.key)}
      />
    );
  };

  return (
    <div>
      <InstructionBlock text={TOUR_TIPS["01.10_step3"]} />

      {focusMode && (
        <ContextMapFocus
          focusDimKey={focusDimKey}
          setFocusDimKey={setFocusDimKey}
          onExit={() => {
            setFocusMode(false);
            setFocusDimKey(null);
          }}
          companyName={companyName}
          brandNarrative={brandNarrative}
          identitySynthesis={identitySynthesis || null}
          cardSlot={
            focusDimKey
              ? renderCard(CTX_DIMS.find((d) => d.key === focusDimKey)!)
              : CTX_DIMS.map(renderCard)
          }
        />
      )}

      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-gold text-[9px] font-extrabold tracking-[3px] mb-1">
            STEP 3 — CONTEXT MAP
          </div>
          <h2 className="text-foreground text-[32px] font-black leading-[1.1] tracking-[-0.5px] mb-2">
            The Story Only You Can Tell.
          </h2>
          <p className="text-foreground/70 text-[14px] leading-[1.8]">
            Five dimensions. Five word lists. Five narratives. Each one generated from your words,
            refined in your voice. Together they become your brand identity — documented, versioned,
            and defensible.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFocusMode(true)}
          className="flex-shrink-0 px-4 py-2.5 bg-transparent border border-gold/40 text-gold text-[9px] font-extrabold tracking-[2px] cursor-pointer mt-1"
        >
          ⊞ FOCUS MODE
        </button>
      </div>

      {/* Brand narrative reference */}
      {brandNarrative && (
        <div className="mb-6 px-[18px] py-3 bg-gold/[0.04] border border-gold/20">
          <div className="text-gold/70 text-[8px] font-extrabold tracking-[2px] mb-2">
            YOUR BRAND NARRATIVE — REFERENCE WHILE YOU WRITE
          </div>
          <NarrativeDisplay text={brandNarrative} />
        </div>
      )}

      {/* 5 cards */}
      {CTX_DIMS.map(renderCard)}

      <IdentitySynthesisPanel
        identitySynthesis={identitySynthesis}
        identityLoading={identityLoading}
        identityVersions={identityVersions}
        identityVerIdx={identityVerIdx}
        identityTokens={identityTokens}
        allNarrativesReady={allNarrativesReady}
        onPrev={() => {
          if (identityVerIdx > 0) {
            setIdentityVerIdx(identityVerIdx - 1);
            setIdentitySynthesis(identityVersions[identityVerIdx - 1]);
          }
        }}
        onNext={() => {
          if (identityVerIdx < identityVersions.length - 1) {
            setIdentityVerIdx(identityVerIdx + 1);
            setIdentitySynthesis(identityVersions[identityVerIdx + 1]);
          }
        }}
        onFocus={() => setFocusIdentity(true)}
        onRegenerate={runIdentityAI}
      />

      {focusIdentity && identitySynthesis && (
        <IdentityFocusOverlay
          identitySynthesis={identitySynthesis}
          identityTokens={identityTokens}
          companyName={companyName}
          onExit={() => setFocusIdentity(false)}
        />
      )}

      {/* Nav */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="bg-transparent border border-border text-muted-foreground px-5 py-2.5 text-[10px] cursor-pointer hover:border-gold hover:text-gold"
        >
          ← BACK
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 bg-gold border-none text-black px-5 py-2.5 text-[10px] font-extrabold tracking-[2px] cursor-pointer hover:bg-gold/90"
        >
          NEXT — PRIORITIZE →
        </button>
      </div>
    </div>
  );
}
