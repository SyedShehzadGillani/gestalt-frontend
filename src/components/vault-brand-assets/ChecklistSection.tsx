import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

type Item = {
  label: string;
  sectionId: string;
  done: boolean;
};

// Auto-derived completion state (mock). Each item links to the section that
// owns its evidence so users can jump straight to what's missing.
const ITEMS: Item[] = [
  { label: "All logos exported in SVG, PDF, PNG, EPS, JPG", sectionId: "identity", done: true },
  { label: "File naming convention applied", sectionId: "naming", done: true },
  { label: "Folder structure organized", sectionId: "folders", done: true },
  { label: "Color values documented", sectionId: "color", done: true },
  { label: "Typography hierarchy defined", sectionId: "typography", done: true },
  { label: "Brand foundation completed", sectionId: "foundation", done: true },
  { label: "Messaging system documented", sectionId: "messaging", done: true },
  { label: "Logo usage rules defined", sectionId: "usage", done: true },
  { label: "Photography direction set", sectionId: "photography", done: false },
  { label: "Application templates designed", sectionId: "applications", done: true },
  { label: "Digital brand standards documented", sectionId: "digital", done: true },
  { label: "Brand governance established", sectionId: "governance", done: true },
  { label: "Vendor guide prepared", sectionId: "governance", done: false },
  { label: "Asset index complete", sectionId: "index", done: true },
  { label: "READ ME FIRST written", sectionId: "readme", done: true },
  { label: "Package tested", sectionId: "checklist", done: false },
  { label: "All files reviewed", sectionId: "checklist", done: true },
  { label: "Shared to VAULT", sectionId: "checklist", done: true },
];

export function ChecklistSection() {
  const [overrides, setOverrides] = useState<Record<number, boolean>>({});

  const isChecked = (i: number) =>
    overrides[i] !== undefined ? overrides[i] : ITEMS[i].done;

  const toggle = (i: number) =>
    setOverrides((prev) => ({ ...prev, [i]: !isChecked(i) }));

  const jumpTo = (sectionId: string) => {
    const el = document.getElementById(`vb-sec-${sectionId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const completed = ITEMS.filter((_, i) => isChecked(i)).length;

  return (
    <div>
      <div className="vb-checklist-progress">
        <span className="vb-checklist-progress-label">
          {completed} / {ITEMS.length} COMPLETE
        </span>
        <div className="vb-checklist-progress-track">
          <div
            className="vb-checklist-progress-fill"
            style={{ width: `${(completed / ITEMS.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="vb-grid-2">
        {ITEMS.map((item, i) => {
          const checked = isChecked(i);
          return (
            <div
              key={i}
              className={`vb-checklist-item${checked ? " vb-checklist-item-done" : ""}`}
            >
              <button
                type="button"
                className={`vb-checklist-box${checked ? " vb-checklist-box-checked" : ""}`}
                onClick={() => toggle(i)}
                aria-label={checked ? "Mark incomplete" : "Mark complete"}
              />
              <span className="vb-checklist-label">{item.label}</span>
              <button
                type="button"
                className="vb-checklist-link"
                onClick={() => jumpTo(item.sectionId)}
                aria-label={`Go to ${item.label}`}
              >
                {checked ? "REVIEW" : "COMPLETE"}
                <ArrowUpRight size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
