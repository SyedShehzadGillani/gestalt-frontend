import { Play, Download, Upload, Heart } from "lucide-react";
import { FileLB } from "./FileLB";
import { useFileLB } from "./useFileLB";
import { VIDEOS } from "./data/media-data";

export function VideoLibrarySection() {
  const lb = useFileLB();

  return (
    <>
      <div className="vb-vid-grid">
        {VIDEOS.map((vid, i) => (
          <div key={vid.name} className="vb-vid-card" onDoubleClick={() => lb.open(VIDEOS, i)}>
            <div className="vb-vid-poster">
              <div className="vb-vid-play-ring">
                <Play size={20} />
              </div>
              <div className="vb-vid-duration">{vid.duration}</div>
              <div className="vb-vid-fmts">
                {vid.fmts?.map((f) => (
                  <span key={f} className="vb-thumb-fmt">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="vb-vid-meta">
              <div>
                <div className="vb-vid-name">{vid.name}</div>
                <div className="vb-vid-sub">{vid.sub}</div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button type="button" className="vb-iconbtn" onClick={(e) => e.stopPropagation()} aria-label="Download">
                  <Download size={12} />
                </button>
                <button type="button" className="vb-iconbtn" onClick={(e) => e.stopPropagation()} aria-label="Favorite">
                  <Heart size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button type="button" className="vb-textbtn">
          <Upload size={14} /> Upload Video
        </button>
        <button type="button" className="vb-textbtn">
          <Download size={14} /> Download All Videos
        </button>
      </div>
      {lb.items && <FileLB items={lb.items} idx={lb.idx} onClose={lb.close} onNav={lb.setIdx} />}
    </>
  );
}
