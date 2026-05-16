import { Download, Heart, X } from "lucide-react";

type Props = {
  name: string;
  sub?: string;
  fmts?: string[];
  onOpen?: () => void;
};

export function Thumb({ name, sub, fmts = ["SVG", "PNG"], onOpen }: Props) {
  return (
    <div className="vb-thumb" onDoubleClick={onOpen}>
      <div className="vb-thumb-box">
        <svg width="36" height="36" viewBox="0 0 40 40" className="vb-thumb-icon">
          <rect x="4" y="4" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="4" y1="4" x2="36" y2="36" stroke="currentColor" strokeWidth="0.8" />
          <line x1="36" y1="4" x2="4" y2="36" stroke="currentColor" strokeWidth="0.8" />
        </svg>
        <div className="vb-thumb-hover">
          <button type="button" className="vb-thumb-action" onClick={(e) => e.stopPropagation()} aria-label="Download">
            <Download size={12} />
          </button>
          <button type="button" className="vb-thumb-action" onClick={(e) => e.stopPropagation()} aria-label="Favorite">
            <Heart size={12} />
          </button>
          <button type="button" className="vb-thumb-action" onClick={(e) => e.stopPropagation()} aria-label="Delete">
            <X size={12} />
          </button>
        </div>
        <div className="vb-thumb-hint">
          <span>Double-click to expand</span>
        </div>
        <div className="vb-thumb-fmts">
          {fmts.map((f) => (
            <span key={f} className="vb-thumb-fmt">
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="vb-thumb-name">{name}</div>
      {sub && <div className="vb-thumb-sub">{sub}</div>}
    </div>
  );
}
