import { Upload, Download } from "lucide-react";
import type { MediaItem } from "./media-types";
import { Thumb } from "./Thumb";
import { useFileLB } from "./useFileLB";
import { FileLB } from "./FileLB";
import { DIGITAL_ITEMS, SOCIAL_ITEMS } from "./data/section-data";

const DIG_ITEMS: MediaItem[] = DIGITAL_ITEMS.map((item) => ({
  name: item.n,
  type: "document",
  fmts: item.f,
  category: "DIGITAL BRAND",
  sub: item.s,
}));

const SOC_ITEMS: MediaItem[] = SOCIAL_ITEMS.map((item) => ({
  name: item.n,
  type: "document",
  fmts: item.f,
  category: `SOCIAL — ${item.p}`,
  sub: item.p,
  platform: item.p,
}));

export function DigitalBrandSection() {
  const digLb = useFileLB();
  const socLb = useFileLB();

  return (
    <>
      <div className="vb-thumb-row vb-thumb-wrap" style={{ marginBottom: 24 }}>
        {DIG_ITEMS.map((item, i) => (
          <Thumb key={item.name} name={item.name} sub={item.sub} fmts={item.fmts} onOpen={() => digLb.open(DIG_ITEMS, i)} />
        ))}
      </div>

      <div className="vb-section-sublabel">SOCIAL PROFILES</div>
      <div className="vb-social-grid">
        {SOC_ITEMS.map((item, i) => (
          <div key={item.name} className="vb-social-tile" onDoubleClick={() => socLb.open(SOC_ITEMS, i)}>
            <div className="vb-social-box">
              <svg width="36" height="36" viewBox="0 0 40 40" className="vb-thumb-icon">
                <rect x="4" y="4" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <line x1="4" y1="4" x2="36" y2="36" stroke="currentColor" strokeWidth="0.8" />
                <line x1="36" y1="4" x2="4" y2="36" stroke="currentColor" strokeWidth="0.8" />
              </svg>
              <div className="vb-social-platform">{item.platform}</div>
              <div className="vb-thumb-fmts">
                {item.fmts?.map((f) => <span key={f} className="vb-thumb-fmt">{f}</span>)}
              </div>
            </div>
            <div className="vb-thumb-name">{item.name}</div>
          </div>
        ))}
      </div>

      <div className="vb-textbtn-row">
        <button type="button" className="vb-textbtn"><Upload size={14} /> Upload Social Asset</button>
        <button type="button" className="vb-textbtn"><Download size={14} /> Download All Social</button>
      </div>
      <div className="vb-dlbar"><span className="vb-dlbar-meta">v1.0 · 2025-11-20</span></div>

      {digLb.items && <FileLB items={digLb.items} idx={digLb.idx} onClose={digLb.close} onNav={digLb.setIdx} />}
      {socLb.items && <FileLB items={socLb.items} idx={socLb.idx} onClose={socLb.close} onNav={socLb.setIdx} />}
    </>
  );
}
