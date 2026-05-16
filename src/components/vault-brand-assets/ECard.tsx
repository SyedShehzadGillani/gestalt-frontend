import { useRef, useState, type ChangeEvent } from "react";
import { ECardVersionTimeline } from "./ECardVersionTimeline";
import { TODAY, type ECardVersion } from "./ecard-types";

type Props = {
  title: string;
  desc?: string;
  saved?: string;
  sizeVariant?: "default" | "large-3" | "large-7";
};

const makeVersion = (id: number, text: string, source: ECardVersion["source"]): ECardVersion => ({
  id,
  text,
  date: TODAY,
  label: `v1.${id - 1}`,
  source,
});

export function ECard({ title, desc, saved, sizeVariant = "default" }: Props) {
  const initial: ECardVersion[] = saved ? [makeVersion(1, saved, "manual")] : [];
  const [versions, setVersions] = useState<ECardVersion[]>(initial);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [draft, setDraft] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const current = versions[activeIdx];

  const autoGrow = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    setDraft(el.value);
  };

  const startEdit = () => {
    setDraft(current?.text ?? "");
    setMode("edit");
    queueMicrotask(() => {
      const el = taRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
      el.focus();
    });
  };

  const doSave = () => {
    setVersions((prev) => {
      const next = [...prev, makeVersion(prev.length + 1, draft, "manual")];
      setActiveIdx(next.length - 1);
      return next;
    });
    setMode("view");
  };

  const doRegenerate = () => {
    const giText = `GESTALT INTELLIGENCE analyzed your FORMULA session data and regenerated ${title.toLowerCase()} from documented strategy, positioning, and audience profiles.`;
    setVersions((prev) => {
      const next = [...prev, makeVersion(prev.length + 1, giText, "FORMULA")];
      setActiveIdx(next.length - 1);
      return next;
    });
  };

  const useVersion = (i: number) => {
    setVersions((prev) => {
      const v = prev[i];
      const next = [...prev, makeVersion(prev.length + 1, v.text, `restored from ${v.label}`)];
      setActiveIdx(next.length - 1);
      return next;
    });
  };

  const hasAlignment = current && versions.length > 1;
  const isAligned = current && current.source !== "FORMULA";
  const contentClass = `vb-ecard-content${sizeVariant === "large-3" ? " is-large-3" : sizeVariant === "large-7" ? " is-large-7" : ""}`;

  return (
    <div className="vb-ecard">
      <div className={`vb-ecard-head${current || mode === "edit" ? " has-body" : ""}`}>
        <div className="vb-ecard-meta">
          <span className="vb-ecard-title">{title}</span>
          <span className="vb-ecard-date">
            {current?.date ?? TODAY} · {current?.label ?? "v1.0"}
          </span>
          {current?.source === "FORMULA" && <span className="vb-ecard-badge-formula">FROM FORMULA</span>}
        </div>
        <div className="vb-ecard-actions">
          {current && mode === "view" && <span className="vb-chip-saved">SAVED</span>}
          <button type="button" className="vb-ecard-regen" onClick={doRegenerate}>
            REGENERATE →
          </button>
          {mode === "view" && (
            <button type="button" className="vb-ecard-edit-btn" onClick={startEdit}>
              EDIT
            </button>
          )}
        </div>
      </div>

      {desc && !current && mode !== "edit" && <div className="vb-ecard-desc">{desc}</div>}
      {desc && mode === "edit" && <div className="vb-ecard-desc is-editing">{desc}</div>}

      {mode === "edit" && (
        <div>
          <textarea
            ref={taRef}
            value={draft}
            onChange={autoGrow}
            className="vb-ecard-textarea"
            placeholder={`Enter ${title.toLowerCase()}...`}
          />
          <div className="vb-ecard-save-row">
            <button type="button" className="vb-btn-primary" onClick={doSave}>
              SAVE
            </button>
            <button type="button" className="vb-btn-secondary" onClick={() => setMode("view")}>
              CANCEL
            </button>
          </div>
        </div>
      )}

      {mode === "view" && current && (
        <div className="vb-ecard-saved">
          <span className="vb-ecard-quote">“</span>
          <div className={contentClass}>{current.text}</div>
        </div>
      )}

      {mode === "view" && hasAlignment && (
        <div className="vb-alignment">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="vb-alignment-dot" />
            <span className="vb-alignment-text">
              FORMULA ALIGNMENT:{" "}
              {isAligned ? "Content updated independently — verify alignment with strategy." : "Aligned with FORMULA session data."}
            </span>
          </div>
          <button type="button" className="vb-alignment-link">
            VIEW IN FORMULA →
          </button>
        </div>
      )}

      {mode === "view" && versions.length > 1 && (
        <ECardVersionTimeline
          versions={versions}
          activeIdx={activeIdx}
          onPick={setActiveIdx}
          onUse={useVersion}
        />
      )}
    </div>
  );
}
