import { Plus, Download, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import { CSwatch } from "./CSwatch";
import { TintRampEdit } from "./TintRampEdit";
import { MoodBoards } from "./MoodBoards";
import { makeRamp, hexToRgb, rgbToCmyk } from "./color-utils";
import { PRIMARY_COLORS, SECONDARY_COLORS, GRADIENTS } from "./data/color-data";

export function ColorSystemSection() {
  const goldRamp = makeRamp("#e2b53f");
  const grayRamp = makeRamp("#909090");

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 48;
    let y = M;

    const heading = (text: string, size = 22) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(size);
      doc.setTextColor(10, 10, 10);
      doc.text(text, M, y);
      y += size + 6;
    };
    const eyebrow = (text: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(text.toUpperCase(), M, y);
      y += 14;
    };
    const body = (text: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(text, W - M * 2);
      doc.text(lines, M, y);
      y += lines.length * 13;
    };
    const pageBreakIfNeeded = (needed: number) => {
      if (y + needed > H - M) {
        doc.addPage();
        y = M;
      }
    };
    const swatchRow = (
      list: { name: string; hex: string; pms?: string }[],
      tileH = 56,
    ) => {
      const cols = 3;
      const gap = 10;
      const tileW = (W - M * 2 - gap * (cols - 1)) / cols;
      list.forEach((c, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        if (col === 0 && row > 0) y += tileH + 56;
        pageBreakIfNeeded(tileH + 64);
        const x = M + col * (tileW + gap);
        const rgb = hexToRgb(c.hex);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(x, y, tileW, tileH, "F");
        doc.setDrawColor(220, 220, 220);
        doc.rect(x, y, tileW, tileH);
        const ty = y + tileH + 12;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(10, 10, 10);
        doc.text(c.name, x, ty);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(90, 90, 90);
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
        doc.text(
          `HEX ${c.hex.toUpperCase()}   RGB ${rgb.r},${rgb.g},${rgb.b}`,
          x,
          ty + 11,
        );
        doc.text(
          `CMYK ${cmyk.c},${cmyk.m},${cmyk.y},${cmyk.k}${c.pms ? `   ${c.pms}` : ""}`,
          x,
          ty + 22,
        );
      });
      y += tileH + 56;
    };
    const ramp = (label: string, stops: { stop: number; hex: string }[]) => {
      pageBreakIfNeeded(90);
      eyebrow(label);
      const tileH = 44;
      const tileW = (W - M * 2) / stops.length;
      stops.forEach((s, i) => {
        const rgb = hexToRgb(s.hex);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(M + i * tileW, y, tileW, tileH, "F");
        doc.setFontSize(7);
        doc.setTextColor(rgb.r + rgb.g + rgb.b > 400 ? 30 : 240, rgb.r + rgb.g + rgb.b > 400 ? 30 : 240, rgb.r + rgb.g + rgb.b > 400 ? 30 : 240);
        doc.text(String(s.stop), M + i * tileW + 4, y + tileH - 14);
        doc.text(s.hex.toUpperCase(), M + i * tileW + 4, y + tileH - 4);
      });
      y += tileH + 24;
    };

    // Cover
    heading("CORPORATE COLOR GUIDE", 26);
    body("Brand color standards and usage. Version 1.0");
    y += 12;

    eyebrow("Primary Colors");
    swatchRow(PRIMARY_COLORS);

    eyebrow("Secondary Colors");
    swatchRow(SECONDARY_COLORS);

    ramp("Gold Tint Ramp", goldRamp);
    ramp("Neutral Tint Ramp", grayRamp);

    pageBreakIfNeeded(120);
    eyebrow("Gradient System");
    GRADIENTS.forEach((g) => {
      pageBreakIfNeeded(60);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(10, 10, 10);
      doc.text(g.name, M, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(g.usage, W - M, y, { align: "right" });
      y += 8;
      doc.setFillColor(230, 230, 230);
      doc.rect(M, y, W - M * 2, 22, "F");
      y += 32;
    });

    pageBreakIfNeeded(80);
    eyebrow("Usage Standards");
    body(
      "Primary Gold is the dominant brand color and should anchor hero moments, CTAs, and key brand expressions. Secondary colors support typography, surfaces, and UI chrome. Tint ramps are used for data visualization, states, and depth. Never modify brand colors outside the approved tokens.",
    );

    doc.save("corporate-color-guide.pdf");
  };

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

      <div style={{ marginTop: 8, marginBottom: 28, display: "flex", gap: 12 }}>
        <button type="button" className="vb-textbtn">
          <Plus size={14} /> Add Color
        </button>
        <button type="button" className="vb-textbtn" onClick={downloadPdf}>
          <FileDown size={14} /> Download Color Guide PDF
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
          <button type="button" className="vb-textbtn" onClick={downloadPdf}>
            <Download size={14} /> Download Color Guide
          </button>
        </div>
      </div>
    </>
  );
}
