import { useEffect, useRef, useState } from "react";
import { trimTo50 } from "@/components/formula/formula-data";

interface Props {
  descText: string;
  setDescText: (v: string) => void;
  descSaved: boolean;
  onSave: () => void;
  onAdvance: () => void;
}

/**
 * 01.10 Phase A — describe the business in 50 words. First entry in the
 * Knowledge Bank. Auto-trims to 50 words on blur, locks gold once saved.
 */
export function CompetitivePhaseA({ descText, setDescText, descSaved, onSave, onAdvance }: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${Math.max(160, ref.current.scrollHeight)}px`;
  }, [descText]);

  useEffect(() => {
    setWordCount(descText.trim() ? descText.trim().split(/\s+/).length : 0);
  }, [descText]);

  const overLimit = wordCount > 50;

  return (
    <div className="bg-card border border-border p-6 mb-5">
      <div className="text-gold text-[10px] tracking-[3px] font-extrabold mb-1.5">
        PHASE A — DESCRIBE YOUR BUSINESS
      </div>
      <div className="text-muted-foreground text-[12px] leading-[1.7] mb-4 italic">
        50 words. What you do, who you serve, why people choose you. Write what is verifiably true
        today — and will still be true in 12 months. Vague dies in the first cross-check.
      </div>
      <textarea
        ref={ref}
        value={descText}
        onChange={(e) => setDescText(e.target.value)}
        onBlur={() => setDescText(trimTo50(descText))}
        disabled={descSaved}
        placeholder="Describe your business in 50 words or less…"
        className={`w-full bg-background border ${
          descSaved ? "border-gold text-gold" : "border-border text-foreground"
        } px-3 py-2.5 text-[14px] leading-[1.7] outline-none focus:border-gold resize-none overflow-hidden disabled:cursor-default font-semibold`}
        style={{ minHeight: 160 }}
      />
      <div className="flex justify-between items-center mt-2.5">
        <span
          className={`text-[10px] tracking-[1.5px] font-bold ${
            overLimit
              ? "text-red"
              : wordCount >= 30
                ? "text-success"
                : "text-muted-foreground"
          }`}
        >
          {wordCount} / 50 WORDS{overLimit && " — auto-trimmed on blur"}
        </span>
        {descSaved ? (
          <button
            type="button"
            onClick={onAdvance}
            className="bg-gold text-black px-5 py-2 text-[10px] tracking-[2px] font-extrabold cursor-pointer hover:bg-gold/90"
          >
            ✓ LOCKED — CONTINUE TO WORD BOARD →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (wordCount >= 10) onSave();
            }}
            className={`px-5 py-2 text-[10px] tracking-[2px] font-extrabold cursor-pointer border ${
              wordCount >= 10
                ? "bg-transparent border-gold text-gold hover:bg-gold/10"
                : "bg-transparent border-border text-muted-foreground cursor-not-allowed opacity-50"
            }`}
          >
            SAVE DESCRIPTION →
          </button>
        )}
      </div>
    </div>
  );
}
