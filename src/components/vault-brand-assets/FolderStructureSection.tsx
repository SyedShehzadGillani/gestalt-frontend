import { FOLDER_TREE } from "./data/section-data";

export function FolderStructureSection() {
  return (
    <div className="vb-folder-tree">
      {FOLDER_TREE.map((line, i) => (
        <div key={i} className="vb-folder-line">{line}</div>
      ))}
    </div>
  );
}
