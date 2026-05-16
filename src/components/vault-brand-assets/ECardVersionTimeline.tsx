import type { ECardVersion } from "./ecard-types";

type Props = {
  versions: ECardVersion[];
  activeIdx: number;
  onPick: (i: number) => void;
  onUse: (i: number) => void;
};

export function ECardVersionTimeline({ versions, activeIdx, onPick, onUse }: Props) {
  const current = versions[activeIdx];
  return (
    <div className="vb-versions">
      <div className="vb-versions-head">
        <span>VERSION HISTORY</span>
        <span>
          {versions.length} versions · viewing {current?.label}
        </span>
      </div>
      <div className="vb-versions-strip">
        {versions.map((v, i) => {
          const isActive = i === activeIdx;
          return (
            <div key={v.id} className="vb-version-card">
              <button
                type="button"
                className={`vb-version-btn${isActive ? " is-active" : ""}`}
                onClick={() => onPick(i)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="vb-version-label">{v.label}</span>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {v.source === "FORMULA" && <span className="vb-tag-gi">GI</span>}
                    {isActive && <span className="vb-tag-active">ACTIVE</span>}
                  </div>
                </div>
                <div className="vb-version-meta">
                  {v.date} · {v.source}
                </div>
                <div className="vb-version-preview">{v.text.substring(0, 50)}...</div>
              </button>
              {!isActive && i !== versions.length - 1 && (
                <button type="button" className="vb-version-use" onClick={() => onUse(i)}>
                  USE THIS VERSION
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
