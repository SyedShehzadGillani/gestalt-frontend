import { useState } from "react";
import { CHECKLIST_ITEMS } from "./data/section-data";

export function ChecklistSection() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  function toggle(i: number) {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div className="vb-grid-2">
      {CHECKLIST_ITEMS.map((item, i) => (
        <button
          key={i}
          type="button"
          className={`vb-checklist-item${checked[i] ? " vb-checklist-item-done" : ""}`}
          onClick={() => toggle(i)}
        >
          <div className={`vb-checklist-box${checked[i] ? " vb-checklist-box-checked" : ""}`} />
          <span className="vb-checklist-label">{item}</span>
        </button>
      ))}
    </div>
  );
}
