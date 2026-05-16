import { Plus, Download } from "lucide-react";
import { CSwatch } from "./CSwatch";
import { TintRampEdit } from "./TintRampEdit";
import { MoodBoards } from "./MoodBoards";
import { makeRamp } from "./color-utils";
import { PRIMARY_COLORS, SECONDARY_COLORS, GRADIENTS } from "./data/color-data";

export function ColorSystemSection() {
  const goldRamp = makeRamp("#e2b53f");
  const grayRamp = makeRamp("#909090");

  return (
    <>
      <div className="vb-color-eyebrow">PRIMARY COLORS</div>
      <div className="vb-swatch-grid-primary">
        {PRIMARY_COLORS.map((c) => (
          <CSwatch key={c.name} name={c.name} hex={c.hex} pms={c.pms} large />
        ))}
      </div>

      <div className="vb-color-eyebrow mt">SECONDARY COLORS</div>
      <div className="vb-swatch-grid-secondary">
        {SECONDARY_COLORS.map((c) => (
          <CSwatch key={c.name} name={c.name} hex={c.hex} pms={c.pms} />
        ))}
      </div>

      <div style={{ marginTop: 8, marginBottom: 28 }}>
        <button type="button" className="vb-textbtn">
          <Plus size={14} /> Add Color
        </button>
      </div>

      <TintRampEdit label="GOLD TINT RAMP" ramp={goldRamp} />
      <TintRampEdit label="NEUTRAL TINT RAMP" ramp={grayRamp} />

      <div className="vb-color-eyebrow">GRADIENT SYSTEM</div>
      <div className="vb-gradient-grid">
        {GRADIENTS.map((g) => (
          <div key={g.name} className="vb-gradient-card">
            <div className="vb-gradient-band" style={{ background: g.gradient }} />
            <div className="vb-gradient-meta">
              <div className="vb-gradient-name">{g.name}</div>
              <div className="vb-gradient-use">{g.usage}</div>
            </div>
          </div>
        ))}
      </div>

      <MoodBoards />

      <div className="vb-dlbar">
        <div className="vb-dlbar-meta">
          <span>VERSION v1.0</span>
          <span>UPDATED 2025-11-15</span>
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
