import { Download } from "lucide-react";
import { FONT_WEIGHTS } from "./data/color-data";

export function TypographySection() {
  return (
    <>
      <div className="vb-typo-family text-7xl font-extralight">Gotham</div>
      <div className="vb-typo-grid">
        {FONT_WEIGHTS.map((fw) => (
          <div key={fw.name}>
            <div className="vb-typo-weight-name" style={{ fontWeight: fw.weight }}>
              {fw.name}
            </div>
            <div className="vb-typo-sample" style={{ fontWeight: fw.weight }}>
              AaBbDdEeGgMmOoRrSs
            </div>
            <div className="vb-typo-sample" style={{ fontWeight: fw.weight }}>
              1234567890 !?()[]{}@$#%
            </div>
            <div className="vb-typo-sample dim" style={{ fontWeight: fw.weight }}>
              AaBbDdEeGgMmOoRrSs
            </div>
            <div className="vb-typo-sample dim" style={{ fontWeight: fw.weight }}>
              1234567890 !?()[]{}@$#%
            </div>
          </div>
        ))}
      </div>
      <div className="vb-dlbar">
        <div className="vb-dlbar-meta">
          <span>VERSION v2.0</span>
          <span>UPDATED 2025-11-18</span>
        </div>
        <div>
          <button type="button" className="vb-textbtn">
            <Download size={14} /> Download All
          </button>
        </div>
      </div>
    </>
  );
}
