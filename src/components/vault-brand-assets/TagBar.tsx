import { useState } from "react";

const ALL_TAGS = [
  "PRIMARY","SECONDARY","LOGO","BRANDMARK","SOCIAL","PRINT","DIGITAL","TEMPLATE",
  "CAMPAIGN","FAVICON","VIDEO","MOTION","PHOTOGRAPHY","TYPOGRAPHY","COLOR","GRADIENT",
  "GOVERNANCE","INSTAGRAM","FACEBOOK","LINKEDIN","X","TIKTOK","YOUTUBE",
];
const QUICK_TAGS = ["PRIMARY","LOGO","SOCIAL","PRINT","DIGITAL","TEMPLATE","CAMPAIGN","FAVICON"];

export function TagBar() {
  const [active, setActive] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const toggle = (t: string) =>
    setActive((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  return (
    <div className="vb-tagbar">
      <div className="vb-tagbar-row">
        <span className="vb-tagbar-label">QUICK TAGS</span>
        {QUICK_TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className={`vb-quick-tag${active.includes(t) ? " is-active" : ""}`}
            onClick={() => toggle(t)}
          >
            {t}
          </button>
        ))}
        <button type="button" className="vb-quick-tag vb-quick-tag-pin">+ PIN TAG</button>
        <span style={{ flex: 1 }} />
        {active.length > 0 && (
          <button type="button" className="vb-tagbar-clear" onClick={() => setActive([])}>CLEAR</button>
        )}
        <button type="button" className="vb-tagbar-expand" onClick={() => setExpanded((v) => !v)}>
          EXPAND ALL TAGS {expanded ? "▴" : "▾"}
        </button>
      </div>

      {active.length > 0 ? (
        <div className="vb-tagbar-status">
          Filtering by: {active.join(", ")} — {active.length} tag{active.length > 1 ? "s" : ""} active
        </div>
      ) : (
        <div className="vb-tagbar-hint">Drag tags into the quick row for fast filtering. Click any tag to filter all assets.</div>
      )}

      {expanded && (
        <div className="vb-tagbar-all">
          {ALL_TAGS.map((t) => (
            <button
              key={t}
              type="button"
              className={`vb-quick-tag vb-quick-tag-sm${active.includes(t) ? " is-active" : ""}`}
              onClick={() => toggle(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
