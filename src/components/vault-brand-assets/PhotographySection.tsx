import { Image as ImageIcon, Upload, Download } from "lucide-react";
import { ECard } from "./ECard";
import { FileLB } from "./FileLB";
import { useFileLB } from "./useFileLB";
import { PHOTOGRAPHY } from "./data/media-data";

export function PhotographySection() {
  const lb = useFileLB();

  return (
    <>
      <div className="vb-photo-section">
        <div>
          <ECard title="PHOTOGRAPHY STYLE" desc="Lighting, composition, subject matter, color grading, stock rules." />
          <ECard title="DO / DON'T EXAMPLES" desc="Upload examples of correct and incorrect brand photography." />
        </div>
        <div>
          <div className="vb-color-eyebrow">IMAGE LIBRARY</div>
          <div className="vb-photo-grid">
            {PHOTOGRAPHY.map((img, i) => (
              <div key={img.name} className="vb-photo-card" onDoubleClick={() => lb.open(PHOTOGRAPHY, i)}>
                <div className="vb-photo-img" style={{ height: img.height }}>
                  <ImageIcon size={28} />
                </div>
                <div className="vb-photo-meta">
                  <div className="vb-photo-meta-row">
                    <span className="vb-photo-name">{img.name}</span>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      {img.tag && <span className="vb-photo-tag">{img.tag}</span>}
                      <button type="button" className="vb-iconbtn" onClick={(e) => e.stopPropagation()} aria-label="Download">
                        <Download size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="vb-photo-sub">{img.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="vb-upload-zone">
            <Upload size={24} color="var(--vb-t5)" />
            <div style={{ marginTop: 8 }}>Drop images here or click to upload</div>
            <div className="vb-upload-zone-sub">Add as many images as you need. Tag each with a category and description.</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" className="vb-textbtn">
              <Upload size={14} /> Upload Images
            </button>
            <button type="button" className="vb-textbtn">
              <Download size={14} /> Download All Photos
            </button>
          </div>
        </div>
      </div>
      {lb.items && <FileLB items={lb.items} idx={lb.idx} onClose={lb.close} onNav={lb.setIdx} />}
    </>
  );
}
