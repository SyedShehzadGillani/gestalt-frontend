import {
  Download, Edit, Search, Upload, Send, Eye, Folder, File,
  Shield, Star, BarChart2, Image, Plus, Check,
} from "lucide-react";
import { ECard } from "./ECard";
import { GRAPHICS_CARDS, ICON_NAMES } from "./data/section-data";

const ICON_MAP: Record<string, React.ReactNode> = {
  download: <Download size={20} />, edit: <Edit size={20} />, search: <Search size={20} />,
  upload: <Upload size={20} />, send: <Send size={20} />, eye: <Eye size={20} />,
  folder: <Folder size={20} />, file: <File size={20} />, shield: <Shield size={20} />,
  star: <Star size={20} />, bar: <BarChart2 size={20} />, image: <Image size={20} />,
  plus: <Plus size={20} />, check: <Check size={20} />,
};

export function GraphicsSection() {
  return (
    <>
      <div className="vb-grid-3">
        {GRAPHICS_CARDS.map((t) => (
          <ECard key={t} title={t} desc={`Editable ${t.toLowerCase()} standards.`} />
        ))}
      </div>
      <div className="vb-icon-lib-label">ICON LIBRARY</div>
      <div className="vb-icon-lib">
        {ICON_NAMES.map((nm) => (
          <div key={nm} className="vb-icon-tile">
            <div className="vb-icon-box">{ICON_MAP[nm]}</div>
            <div className="vb-icon-name">{nm}</div>
          </div>
        ))}
      </div>
    </>
  );
}
