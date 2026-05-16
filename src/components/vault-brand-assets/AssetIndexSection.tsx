import { ASSET_INDEX_ROWS } from "./data/section-data";

const HEADERS = ["ASSET", "DESCRIPTION", "FORMAT", "LOCATION"];

export function AssetIndexSection() {
  return (
    <div className="vb-asset-index">
      <div className="vb-asset-index-head">
        {HEADERS.map((h) => <div key={h} className="vb-asset-index-hcell">{h}</div>)}
      </div>
      {ASSET_INDEX_ROWS.map((r, i) => (
        <div key={r.n} className={`vb-asset-index-row${i % 2 === 0 ? " vb-asset-index-row-alt" : ""}`}>
          <div className="vb-asset-index-name">{r.n}</div>
          <div className="vb-asset-index-desc">{r.d}</div>
          <div className="vb-asset-index-fmt">{r.f}</div>
          <div className="vb-asset-index-loc">{r.l}</div>
        </div>
      ))}
    </div>
  );
}
