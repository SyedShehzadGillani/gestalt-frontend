import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Pencil, Download, Send } from "lucide-react";
import type { MoodImage } from "./data/mood-boards";

type Props = {
  image: MoodImage;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

export function MoodBoardViewer({ image, index, total, onPrev, onNext, onClose }: Props) {
  return (
    <div className="vb-mood-viewer" onClick={onClose} role="dialog">
      <div
        className="vb-mood-viewer-inner"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 16 }}>
          <span style={{ color: "var(--vb-t4)", fontSize: 9 }}>
            {index + 1} / {total}
          </span>
          <button type="button" onClick={onClose} className="vb-iconbtn">
            <X size={18} />
          </button>
        </div>
        <div className="vb-mood-viewer-image">
          <ImageIcon size={64} color="var(--vb-t5)" />
          {index > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="vb-iconbtn"
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {index < total - 1 && (
            <button
              type="button"
              onClick={onNext}
              className="vb-iconbtn"
              style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
        <div className="vb-mood-viewer-desc">
          {image.desc}
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            <button type="button" className="vb-textbtn">
              <Pencil size={12} /> Edit Description
            </button>
            <button type="button" className="vb-textbtn">
              <Download size={12} /> Download
            </button>
            <button type="button" className="vb-textbtn">
              <Send size={12} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
