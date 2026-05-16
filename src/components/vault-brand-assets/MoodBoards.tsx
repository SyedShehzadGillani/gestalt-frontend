import { useState } from "react";
import { Plus, Image as ImageIcon, Upload, Download, Send, X, Pencil } from "lucide-react";
import { INITIAL_BOARDS, type MoodBoard } from "./data/mood-boards";
import { MoodBoardViewer } from "./MoodBoardViewer";

export function MoodBoards() {
  const [boards, setBoards] = useState<MoodBoard[]>(INITIAL_BOARDS);
  const [activeIdx, setActiveIdx] = useState(0);
  const [renamingIdx, setRenamingIdx] = useState<number | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [viewerImg, setViewerImg] = useState<number | null>(null);

  const active = boards[activeIdx];
  const images = active?.images ?? [];

  const addBoard = () => {
    const nb: MoodBoard = { id: Date.now(), name: "NEW MOOD BOARD", images: [] };
    setBoards((prev) => [...prev, nb]);
    setActiveIdx(boards.length);
  };

  const removeBoard = (idx: number) => {
    if (boards.length <= 1) return;
    setBoards((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx((cur) => Math.min(cur, boards.length - 2));
  };

  const renameSave = () => {
    if (renamingIdx === null) return;
    setBoards((prev) => prev.map((b, i) => (i === renamingIdx ? { ...b, name: nameDraft } : b)));
    setRenamingIdx(null);
  };

  const viewerIdx =
    viewerImg !== null ? images.findIndex((i) => i.id === viewerImg) : -1;

  return (
    <div className="vb-mood-wrap">
      <div className="vb-mood-head">
        <div className="vb-color-eyebrow" style={{ marginBottom: 0 }}>
          MOOD BOARDS
        </div>
        <button type="button" className="vb-textbtn" onClick={addBoard}>
          <Plus size={14} /> New Board
        </button>
      </div>

      <div className="vb-mood-tabs">
        {boards.map((b, i) => {
          const isA = i === activeIdx;
          return (
            <div key={b.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {renamingIdx === i ? (
                <div style={{ display: "flex", gap: 4 }}>
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && renameSave()}
                    className="vb-field-input"
                    style={{ width: 160, marginBottom: 0 }}
                  />
                  <button type="button" className="vb-btn-primary" onClick={renameSave}>
                    OK
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={`vb-mood-tab${isA ? " is-active" : ""}`}
                  onClick={() => setActiveIdx(i)}
                >
                  {b.name}
                </button>
              )}
              {isA && renamingIdx !== i && (
                <button
                  type="button"
                  className="vb-iconbtn"
                  onClick={() => {
                    setRenamingIdx(i);
                    setNameDraft(b.name);
                  }}
                  aria-label="Rename board"
                >
                  <Pencil size={10} />
                </button>
              )}
              {isA && boards.length > 1 && (
                <button
                  type="button"
                  className="vb-iconbtn"
                  onClick={() => removeBoard(i)}
                  aria-label="Remove board"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {active && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div className="vb-mood-board-title">{active.name}</div>
            <div style={{ color: "var(--vb-t5)", fontSize: 9 }}>{images.length} images</div>
          </div>

          {images.length > 0 ? (
            <div className="vb-mood-grid">
              {images.map((img) => (
                <div key={img.id} className="vb-mood-img" onClick={() => setViewerImg(img.id)}>
                  <div className="vb-mood-img-placeholder" style={{ height: img.height }}>
                    <ImageIcon size={32} />
                  </div>
                  <div className="vb-mood-img-desc">{img.desc}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="vb-mood-empty">
              <ImageIcon size={32} />
              <div style={{ marginTop: 10 }}>No images yet. Upload images to build this mood board.</div>
            </div>
          )}

          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            <button type="button" className="vb-textbtn">
              <Upload size={14} /> Upload Images
            </button>
            <button type="button" className="vb-textbtn">
              <Download size={14} /> Export Board
            </button>
            <button type="button" className="vb-textbtn">
              <Send size={14} /> Share Board
            </button>
          </div>
        </>
      )}

      {viewerIdx >= 0 && images[viewerIdx] && (
        <MoodBoardViewer
          image={images[viewerIdx]}
          index={viewerIdx}
          total={images.length}
          onPrev={() => setViewerImg(images[viewerIdx - 1]?.id ?? null)}
          onNext={() => setViewerImg(images[viewerIdx + 1]?.id ?? null)}
          onClose={() => setViewerImg(null)}
        />
      )}
    </div>
  );
}
