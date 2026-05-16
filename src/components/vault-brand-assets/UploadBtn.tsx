import { useState } from "react";
import { Upload } from "lucide-react";

const CATEGORIES = [
  "BRAND MARK","LOGO","LOGOTYPE","SUB LOGO","FAVICON","APPLICATIONS","SOCIAL PROFILES",
  "VIDEO LIBRARY","MOTION","PHOTOGRAPHY","SIGNAGE","BROCHURES","PATIENT VIDEOS",
  "TRADE SHOW","INVESTOR MATERIALS","PACKAGING",
];

export function UploadBtn() {
  const [open, setOpen] = useState(false);

  return (
    <div className="vb-upload-wrap">
      <button type="button" className="vb-textbtn" onClick={() => setOpen((v) => !v)}>
        <Upload size={14} /> Upload Assets
      </button>
      {open && (
        <div className="vb-upload-dropdown">
          <div className="vb-upload-dropdown-title">UPLOAD & ASSIGN</div>
          <div className="vb-upload-dropzone">
            <Upload size={20} />
            <div className="vb-upload-dropzone-hint">Drop files or click to browse</div>
          </div>
          <div className="vb-upload-cat-label">ASSIGN TO CATEGORY</div>
          <div className="vb-upload-cat-list">
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" className="vb-upload-cat-btn">{cat}</button>
            ))}
          </div>
          <div className="vb-upload-actions">
            <button type="button" className="vb-upload-submit">UPLOAD</button>
            <button type="button" className="vb-upload-cancel" onClick={() => setOpen(false)}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
}
