import { useState } from "react";
import { Heart, Download, X } from "lucide-react";
import type { MediaItem } from "./media-types";
import { useFileLB } from "./useFileLB";
import { FileLB } from "./FileLB";

type FavItem = MediaItem & { id: number };

const INITIAL_FAVS: FavItem[] = [
  { id: 1, name: "PRIMARY LOGO", sub: "Brand Mark", fmts: ["SVG","PNG","PDF"], category: "BRAND MARK", type: "document" },
  { id: 2, name: "SOCIAL AVATAR", sub: "Instagram", fmts: ["PNG","JPG"], category: "SOCIAL", type: "document" },
  { id: 3, name: "BUSINESS CARD", sub: "Template", fmts: ["PDF","EPS"], category: "APPLICATIONS", type: "document" },
  { id: 4, name: "BRAND ANTHEM", sub: "Video · 2:30", fmts: ["MP4"], category: "VIDEO", type: "video", duration: "2:30" },
  { id: 5, name: "PITCH DECK", sub: "Template", fmts: ["PDF","PNG"], category: "APPLICATIONS", type: "document" },
];

export function FavoritesBar() {
  const [favs, setFavs] = useState<FavItem[]>(INITIAL_FAVS);
  const [view, setView] = useState<"compact" | "expanded">("compact");
  const lb = useFileLB();

  const remove = (id: number) => setFavs((prev) => prev.filter((f) => f.id !== id));

  return (
    <div className="vb-favbar">
      <div className="vb-favbar-head">
        <div className="vb-favbar-title">
          <Heart size={14} className="vb-favbar-icon" />
          <span>FAVORITES</span>
          <span className="vb-favbar-count">{favs.length} items</span>
        </div>
        <div className="vb-favbar-controls">
          <button type="button" className="vb-tagbar-expand" onClick={() => setView((v) => v === "compact" ? "expanded" : "compact")}>
            {view === "compact" ? "EXPAND" : "COMPACT"}
          </button>
          <span className="vb-tagbar-hint" style={{ marginLeft: 8 }}>Drag to reorder · Double-click to expand</span>
        </div>
      </div>

      {view === "compact" ? (
        <div className="vb-fav-compact">
          {favs.map((fav, i) => (
            <div key={fav.id} className="vb-fav-item-wrap">
              <div className="vb-fav-thumb" onDoubleClick={() => lb.open(favs, i)}>
                <svg width="36" height="36" viewBox="0 0 40 40" className="vb-thumb-icon">
                  <rect x="4" y="4" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="4" y1="4" x2="36" y2="36" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="36" y1="4" x2="4" y2="36" stroke="currentColor" strokeWidth="0.8" />
                </svg>
                <div className="vb-thumb-fmts">
                  {fav.fmts?.map((f) => <span key={f} className="vb-thumb-fmt">{f}</span>)}
                </div>
              </div>
              <div className="vb-thumb-name">{fav.name}</div>
              {fav.sub && <div className="vb-thumb-sub">{fav.sub}</div>}
              <button type="button" className="vb-fav-remove" onClick={() => remove(fav.id)} aria-label="Remove favorite">
                <X size={8} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="vb-fav-expanded">
          {favs.map((fav, i) => (
            <div key={fav.id} className="vb-fav-card" onDoubleClick={() => lb.open(favs, i)}>
              <div className="vb-fav-card-img">
                <svg width="40" height="40" viewBox="0 0 40 40" className="vb-thumb-icon">
                  <rect x="4" y="4" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="4" y1="4" x2="36" y2="36" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="36" y1="4" x2="4" y2="36" stroke="currentColor" strokeWidth="0.8" />
                </svg>
                <div className="vb-thumb-fmts">
                  {fav.fmts?.map((f) => <span key={f} className="vb-thumb-fmt">{f}</span>)}
                </div>
              </div>
              <div className="vb-fav-card-meta">
                <div className="vb-thumb-name">{fav.name}</div>
                <div className="vb-thumb-sub">{fav.sub}</div>
                <div className="vb-fav-card-actions">
                  <button type="button" className="vb-thumb-action" aria-label="Download"><Download size={12} /></button>
                  <button type="button" className="vb-thumb-action" onClick={() => remove(fav.id)} aria-label="Remove"><X size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lb.items && <FileLB items={lb.items} idx={lb.idx} onClose={lb.close} onNav={lb.setIdx} />}
    </div>
  );
}
