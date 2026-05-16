import { useState } from "react";
import { Plus, Folder, File, ChevronDown, ChevronUp } from "lucide-react";
import { FilesNeedingReview } from "./FilesNeedingReview";

const STAT_CARDS = [
  { l: "TOTAL ASSETS", v: "47" },
  { l: "SECTIONS", v: "21" },
  { l: "FILE TYPES", v: "7" },
  { l: "LAST UPDATED", v: "2026-05-15" },
];

const RECENT = [
  { n: "Logo v1.2", d: "Today" },
  { n: "Social Pack", d: "Yesterday" },
  { n: "Event Banner", d: "3 days ago" },
  { n: "Pitch Deck v3", d: "1 week ago" },
  { n: "Team Photos", d: "2 weeks ago" },
];

const CUSTOM_CATS = ["SIGNAGE","BROCHURES","PATIENT VIDEOS","TRADE SHOW","INVESTOR MATERIALS","INTERNAL TRAINING","RECRUITMENT","PACKAGING"];

const ADD_WIDGETS = [
  { id: "campaigns", label: "ACTIVE CAMPAIGNS" },
  { id: "downloads", label: "DOWNLOAD ACTIVITY" },
  { id: "compliance", label: "BRAND COMPLIANCE" },
  { id: "storage", label: "STORAGE BREAKDOWN" },
];

export function DashboardSection() {
  const [expanded, setExpanded] = useState(false);
  const [addMenu, setAddMenu] = useState(false);

  return (
    <div>
      {/* Stat cards */}
      <div className="vb-stat-grid">
        {STAT_CARDS.map((s) => (
          <div key={s.l} className="vb-stat-card">
            <div className="vb-stat-label">{s.l}</div>
            <div className="vb-stat-value">{s.v}</div>
          </div>
        ))}
      </div>

      {/* GI Alert */}
      <div className="vb-gi-alert">
        <div className="vb-gi-alert-head">
          <div className="vb-gi-dot" />
          <span className="vb-gi-label">GESTALT INTELLIGENCE</span>
        </div>
        <div className="vb-gi-body">
          Brand system is <strong>78% complete</strong>. Missing: Photography direction, 2 sub-logo lockups.{" "}
          <strong>3 files</strong> need review based on recent strategy changes.
        </div>
      </div>

      {/* Expand toggle */}
      <button type="button" className="vb-dash-toggle" onClick={() => setExpanded((v) => !v)}>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {expanded ? "COLLAPSE DASHBOARD" : "EXPAND DASHBOARD — Reviews, Recent Uploads, Categories"}
      </button>

      {expanded && (
        <div className="vb-dash-expanded">
          <FilesNeedingReview />

          {/* Recent Uploads */}
          <div className="vb-recent-panel">
            <div className="vb-recent-title">RECENT UPLOADS</div>
            <div className="vb-recent-strip">
              {RECENT.map((r) => (
                <div key={r.n} className="vb-recent-item">
                  <div className="vb-recent-thumb"><File size={18} /></div>
                  <div className="vb-recent-name">{r.n}</div>
                  <div className="vb-recent-date">{r.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Categories */}
          <div className="vb-custom-cats-panel">
            <div className="vb-custom-cats-head">
              <span className="vb-custom-cats-title">CUSTOM CATEGORIES</span>
              <button type="button" className="vb-textbtn"><Plus size={12} /> Add Category</button>
            </div>
            <div className="vb-custom-cats-grid">
              {CUSTOM_CATS.map((cat) => (
                <div key={cat} className="vb-cat-chip">
                  <Folder size={12} />
                  <span>{cat}</span>
                  <span className="vb-cat-count">0</span>
                </div>
              ))}
            </div>
            <div className="vb-custom-cats-hint">Create custom categories for any asset type your brand needs.</div>
          </div>

          {/* Add Widget */}
          <div className="vb-add-widget-wrap">
            <button type="button" className="vb-add-widget-btn" onClick={() => setAddMenu((v) => !v)}>
              <Plus size={12} /> ADD DASHBOARD WIDGET
            </button>
            {addMenu && (
              <div className="vb-add-widget-menu">
                {ADD_WIDGETS.map((w) => (
                  <button key={w.id} type="button" className="vb-add-widget-item" onClick={() => setAddMenu(false)}>
                    {w.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
