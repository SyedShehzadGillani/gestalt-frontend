import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Download, Send, Heart, Pencil } from "lucide-react";
import type { MediaItem } from "./media-types";
import { FileLBVideoPlayer } from "./FileLBVideoPlayer";

type Props = {
  items: MediaItem[];
  idx: number;
  onClose: () => void;
  onNav: (i: number) => void;
};

export function FileLB({ items, idx, onClose, onNav }: Props) {
  const current = items[idx];
  const [name, setName] = useState(current?.name ?? "");
  const [renaming, setRenaming] = useState(false);
  const [selectedFmt, setSelectedFmt] = useState<string | null>(current?.fmts?.[0] ?? null);

  if (!current) return null;

  const isVideo = current.type === "video";
  const isPhoto = current.type === "photo";
  const previewClass = isPhoto ? "is-photo" : isVideo ? "is-video" : "is-doc";

  const navTo = (next: number) => {
    onNav(next);
    setName(items[next]?.name ?? "");
    setRenaming(false);
    setSelectedFmt(items[next]?.fmts?.[0] ?? null);
  };

  const downloadLabel =
    selectedFmt === "ALL"
      ? "DOWNLOAD ALL"
      : selectedFmt
      ? `DOWNLOAD ${selectedFmt}`
      : isVideo ? "DOWNLOAD VIDEO" : isPhoto ? "DOWNLOAD PHOTO" : "DOWNLOAD";


  return (
    <div className="vb-flb" onClick={onClose} role="dialog">
      <div className="vb-flb-inner" onClick={(e) => e.stopPropagation()}>
        <div className="vb-flb-topbar">
          <div className="vb-flb-meta">
            <span>{current.category ?? "ASSET"}</span>
            <span style={{ color: "var(--vb-t5)" }}>
              {idx + 1} / {items.length}
            </span>
            {isVideo && <span className="vb-flb-type-tag">VIDEO</span>}
            {isPhoto && <span className="vb-flb-type-tag">PHOTO</span>}
          </div>
          <button type="button" className="vb-iconbtn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className={`vb-flb-preview ${previewClass}`}>
          {isVideo ? (
            <FileLBVideoPlayer item={current} />
          ) : isPhoto ? (
            <div style={{ width: 320, height: 240, background: "var(--vb-bg3)", border: "1px solid var(--vb-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ImageIcon size={80} color="var(--vb-t5)" />
            </div>
          ) : (
            <ImageIcon size={80} color="var(--vb-t5)" />
          )}

          {idx > 0 && (
            <button type="button" className="vb-flb-nav is-prev" onClick={() => navTo(idx - 1)} aria-label="Previous">
              <ChevronLeft size={20} />
            </button>
          )}
          {idx < items.length - 1 && (
            <button type="button" className="vb-flb-nav is-next" onClick={() => navTo(idx + 1)} aria-label="Next">
              <ChevronRight size={20} />
            </button>
          )}

          {current.fmts && (
            <div className="vb-flb-fmts" role="radiogroup" aria-label="Download format">
              {current.fmts.map((f) => (
                <button
                  type="button"
                  key={f}
                  className={`vb-flb-fmt${selectedFmt === f ? " is-selected" : ""}`}
                  aria-pressed={selectedFmt === f}
                  onClick={() => setSelectedFmt(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

        </div>

        <div className="vb-flb-detail">
          <div className="vb-flb-detail-row">
            {renaming ? (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="vb-field-input"
                  style={{ marginBottom: 0, width: 300, fontSize: 14, fontWeight: 700 }}
                />
                <button type="button" className="vb-btn-primary" onClick={() => setRenaming(false)}>
                  SAVE
                </button>
                <button
                  type="button"
                  className="vb-btn-secondary"
                  onClick={() => {
                    setName(current.name);
                    setRenaming(false);
                  }}
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="vb-flb-name">{name}</span>
                <button type="button" className="vb-iconbtn" onClick={() => setRenaming(true)} aria-label="Rename">
                  <Pencil size={12} />
                </button>
              </div>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" className="vb-flb-action">
                <Download size={12} /> {downloadLabel}
              </button>
              <button type="button" className="vb-flb-action is-secondary">
                <Send size={12} /> SHARE
              </button>
              <button type="button" className="vb-flb-action is-secondary">
                <Heart size={12} /> FAVORITE
              </button>
            </div>
          </div>
          {current.sub && <div className="vb-flb-sub">{current.sub}</div>}
          <div className="vb-flb-stats">
            <span>Version v1.0</span>
            <span>Uploaded 2026-05-16</span>
            {isVideo && <span>Duration: {current.duration ?? "0:00"}</span>}
            <span>Downloads: 12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
