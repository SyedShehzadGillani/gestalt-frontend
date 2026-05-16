import { useState } from "react";
import { Shield, File, ChevronDown, ChevronUp } from "lucide-react";

type ReviewItem = {
  file: string;
  reason: string;
  age: string;
  urgency: "HIGH" | "MEDIUM" | "LOW" | "ARCHIVE";
  usedBy: string[];
};

const ITEMS: ReviewItem[] = [
  { file: "LOBBY SIGNAGE", reason: "Brand colors updated 14 days ago. Still uses old primary gold (#c9a227). Update to #E2B53F.", age: "Created 6 months ago", urgency: "HIGH", usedBy: ["Lobby Floor Plan","Building Directory","Reception Desk Sign"] },
  { file: "BATHROOM WAYFINDING SIGNS", reason: "New logo version (v1.2) available. Current signage uses v1.0 brandmark.", age: "Created 8 months ago", urgency: "MEDIUM", usedBy: ["ADA Compliance Package","Signage Vendor Kit"] },
  { file: "Q3 BROCHURE", reason: "Boilerplate copy revised in Messaging System. This brochure contains the old version.", age: "Created 3 months ago", urgency: "MEDIUM", usedBy: ["Sales Kit","Trade Show Package","Email Campaign Q3"] },
  { file: "PATIENT INTAKE VIDEO", reason: "New brand anthem completed. Consider updating intro sequence.", age: "Created 11 months ago", urgency: "LOW", usedBy: ["Waiting Room Playlist","New Patient Onboarding"] },
  { file: "TRADE SHOW BANNER", reason: "Event-specific asset. Expiration date passed (2026-03-15). Archive recommended.", age: "Created 9 months ago", urgency: "ARCHIVE", usedBy: [] },
];

const URGENCY_COLOR: Record<ReviewItem["urgency"], string> = {
  HIGH: "#e05252", MEDIUM: "var(--vb-gold)", LOW: "var(--vb-t3)", ARCHIVE: "var(--vb-t5)",
};

function ReviewRow({ item }: { item: ReviewItem }) {
  const [open, setOpen] = useState(false);
  const color = URGENCY_COLOR[item.urgency];
  return (
    <div className="vb-review-row">
      <div className="vb-review-item">
        <div className="vb-review-thumb" onClick={() => setOpen((v) => !v)}><File size={16} /></div>
        <div className="vb-review-body">
          <div className="vb-review-item-head">
            <button type="button" className="vb-review-file" onClick={() => setOpen((v) => !v)}>{item.file}</button>
            <div className="vb-review-item-actions">
              <span className="vb-urgency-tag" style={{ color, borderColor: color + "40" }}>{item.urgency}</span>
              <button type="button" className="vb-review-btn">REVIEW</button>
            </div>
          </div>
          <div className="vb-review-reason">{item.reason}</div>
          <div className="vb-review-age">{item.age}</div>
        </div>
      </div>
      {open && item.usedBy.length > 0 && (
        <div className="vb-review-deps">
          <div className="vb-review-deps-label">USED BY {item.usedBy.length} FILES</div>
          {item.usedBy.map((ub) => (
            <div key={ub} className="vb-review-dep-item"><File size={10} /><span>{ub}</span></div>
          ))}
          <button type="button" className="vb-review-dep-update">UPDATE ALL DEPENDENT FILES →</button>
        </div>
      )}
    </div>
  );
}

export function FilesNeedingReview() {
  const [open, setOpen] = useState(true);
  return (
    <div className="vb-review-panel">
      <div className="vb-review-panel-head" onClick={() => setOpen((v) => !v)}>
        <div className="vb-review-panel-title">
          <Shield size={14} className="vb-review-shield" />
          <span>FILES NEEDING REVIEW</span>
          <span className="vb-review-count">5 items</span>
        </div>
        <div className="vb-review-panel-meta">
          <span className="vb-review-hint">AI monitors all assets for freshness</span>
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </div>
      {open && ITEMS.map((item) => <ReviewRow key={item.file} item={item} />)}
    </div>
  );
}
