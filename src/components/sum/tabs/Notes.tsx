import { useMemo, useState } from "react";
import { Icon } from "../icons";
import { FOLDERS, NOTES, NOTE_COLORS, NoteColorId, SumNote } from "@/data/sum-mock";

type SortMode = "date-new" | "date-old" | "color";

const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const expanded = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(expanded.substr(0, 2), 16);
  const g = parseInt(expanded.substr(2, 2), 16);
  const b = parseInt(expanded.substr(4, 2), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export function Notes() {
  const [sort, setSort] = useState<SortMode>("date-new");
  const [colorFilter, setColorFilter] = useState<NoteColorId | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let out = NOTES.slice();
    if (colorFilter) out = out.filter((n) => n.color === colorFilter);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      out = out.filter((n) => n.title.toLowerCase().includes(q) || n.text.toLowerCase().includes(q));
    }
    if (sort === "date-new") out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    else if (sort === "date-old") out.sort((a, b) => +new Date(a.date) - +new Date(b.date));
    else if (sort === "color") {
      const order = NOTE_COLORS.map((c) => c.id);
      out.sort((a, b) => order.indexOf(a.color) - order.indexOf(b.color));
    }
    return out;
  }, [sort, colorFilter, search]);

  return (
    <div style={{ padding: "28px 32px", width: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "var(--sum-gold2)" }}>PRIVATE — NEVER SHARED WITH MANAGEMENT</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>NOTES</div>
            <div style={{ fontSize: 14, color: "var(--sum-tx3)", marginTop: 4 }}>A wall of quick captures. Color-code, sort, search, and drag into folders.</div>
          </div>
          <button className="smooth" style={{ padding: "10px 16px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="plus" size={14} /><span>NOTE</span>
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "stretch" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", background: "var(--sum-inp)", border: "1px solid var(--sum-bdr)", padding: "0 12px" }}>
          <Icon name="search" size={14} color="var(--sum-tx4)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." style={{ flex: 1, padding: "8px 8px", background: "transparent", border: "none", outline: "none", fontSize: 14, color: "inherit" }} />
        </div>
        <div style={{ display: "flex", border: "1px solid var(--sum-bdr)", background: "var(--sum-bg2)" }}>
          {([
            { id: "date-new", label: "NEWEST" },
            { id: "date-old", label: "OLDEST" },
            { id: "color", label: "COLOR" },
          ] as const).map((s, i, arr) => {
            const sel = sort === s.id;
            return (
              <button key={s.id} onClick={() => setSort(s.id)} className="smooth"
                style={{ padding: "8px 12px", background: sel ? "rgba(226,181,63,0.1)" : "transparent", color: sel ? "var(--sum-gold)" : "var(--sum-tx3)", fontSize: 12, fontWeight: sel ? 800 : 600, letterSpacing: 1, borderRight: i < arr.length - 1 ? "1px solid var(--sum-bdr)" : "none" }}>
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "var(--sum-tx5)", fontWeight: 700, letterSpacing: 1, marginRight: 4 }}>COLOR:</span>
        <button onClick={() => setColorFilter(null)} className="smooth"
          style={{ padding: "5px 12px", border: `1px solid ${!colorFilter ? "var(--sum-gold)" : "var(--sum-bdr)"}`, background: !colorFilter ? "rgba(226,181,63,0.1)" : "transparent", color: !colorFilter ? "var(--sum-gold)" : "var(--sum-tx3)", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
          ALL
        </button>
        {NOTE_COLORS.map((c) => {
          const sel = colorFilter === c.id;
          return (
            <button key={c.id} onClick={() => setColorFilter(c.id)} className="smooth"
              style={{ padding: "5px 12px", border: `1px solid ${sel ? c.color : hexToRgba(c.color, 0.6)}`, background: sel ? hexToRgba(c.color, 0.15) : "transparent", color: c.color, fontSize: 12, fontWeight: sel ? 800 : 700, letterSpacing: 0.5 }}>
              {c.label.toUpperCase()}
            </button>
          );
        })}
      </div>
      <div className="sticky-grid">
        {filtered.map((n) => (
          <NoteCard key={n.id} note={n} />
        ))}
      </div>
    </div>
  );
}

function NoteCard({ note }: { note: SumNote }) {
  const colorMeta = NOTE_COLORS.find((c) => c.id === note.color) ?? NOTE_COLORS[0];
  const folder = note.folderId ? FOLDERS.find((f) => f.id === note.folderId) : null;
  return (
    <div className="sticky-card note-card" style={{
      background: hexToRgba(colorMeta.color, 0.10),
      borderColor: hexToRgba(colorMeta.color, 0.5),
      ["--note-color" as any]: colorMeta.color,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 700, lineHeight: 1.35, color: "var(--sum-tx)" }}>{note.title}</div>
        <button className="smooth" style={{ color: note.favorite ? "var(--sum-gold)" : "var(--sum-tx5)", padding: 0, flexShrink: 0 }}>
          <Icon name={note.favorite ? "starFill" : "star"} size={13} />
        </button>
      </div>
      <div className="note-body" style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
        {note.text.length > 140 ? note.text.slice(0, 140) + "..." : note.text}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "var(--sum-tx5)", gap: 6, flexWrap: "wrap" }}>
        <span>{note.date}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {note.reminders.length > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 2, color: "var(--sum-gold)", fontWeight: 700 }}>
              <Icon name="clock" size={10} />{note.reminders.length}
            </span>
          )}
          {folder && (
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Icon name="folder" size={10} />{folder.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
