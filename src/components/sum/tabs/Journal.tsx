// Journal — PERSONAL JOURNAL tab (v15 spec §4.3).
// Pure render. State (search, type filter, favorites, draft, folder) lifted to ClientMessaging.
// Privacy banner is mandatory on every render.

import { useState } from "react";
import { Icon } from "@/components/sum/icons";
import {
  DESIRE_FIELDS,
  DESIRE_HINTS,
  ENTRY_TYPES,
  FOLDERS,
  JOURNAL_ENTRIES,
  type JournalEntry,
} from "@/data/sum-data";
import { filterJournalEntries, noteColorMeta } from "@/lib/sum-utils";

interface Props {
  search: string;
  onSearch: (q: string) => void;
  filterType: string | null;
  onFilterType: (t: string | null) => void;
  favoritesOnly: boolean;
  onFavoritesOnly: (v: boolean) => void;
  folderFilter: string | null;
  draftOpen: boolean;
  onDraftOpen: (v: boolean) => void;
  onShareEntry: (entryId: number) => void;
}

export function Journal({ search, onSearch, filterType, onFilterType, favoritesOnly, onFavoritesOnly, folderFilter, draftOpen, onDraftOpen, onShareEntry }: Props) {
  const entries = filterJournalEntries(JOURNAL_ENTRIES, {
    type: filterType,
    favoritesOnly,
    search,
    folderId: folderFilter,
  });

  return (
    <div style={{ padding: "28px 32px", maxWidth: 840, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "var(--sum-gold2)" }}>PRIVATE — NEVER SHARED WITH MANAGEMENT</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>PERSONAL JOURNAL</div>
            <div style={{ fontSize: 14, color: "var(--sum-tx3)", marginTop: 4 }}>Your structured ideas, frictions, and resolutions. Drag any entry into a folder.</div>
          </div>
          <button onClick={() => onDraftOpen(true)} className="smooth" style={{ padding: "10px 16px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="plus" size={14} /><span>NEW ENTRY</span>
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "stretch" }}>
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", background: "var(--sum-inp)", border: "1px solid var(--sum-bdr)", padding: "0 12px" }}>
          <Icon name="search" size={14} color="var(--sum-tx4)" />
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search entries, tags, content..." className="sum-input-pulse" style={{ flex: 1, padding: "8px 8px", background: "transparent", border: "none", outline: "none", fontSize: 14, color: "inherit" }} />
        </div>
        <button onClick={() => onFavoritesOnly(!favoritesOnly)} className="smooth"
          style={{ padding: "8px 14px", background: favoritesOnly ? "var(--sum-gold)" : "transparent", color: favoritesOnly ? "#000" : "var(--sum-tx3)", border: `1px solid ${favoritesOnly ? "var(--sum-gold)" : "var(--sum-bdr)"}`, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name={favoritesOnly ? "starFill" : "star"} size={14} /><span>FAVORITES</span>
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        <button onClick={() => onFilterType(null)} className="smooth"
          style={{ padding: "5px 12px", border: `1px solid ${!filterType ? "var(--sum-gold)" : "var(--sum-bdr)"}`, background: !filterType ? "rgba(226,181,63,0.1)" : "transparent", color: !filterType ? "var(--sum-gold)" : "var(--sum-tx3)", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
          ALL
        </button>
        {ENTRY_TYPES.map((t) => {
          const active = filterType === t.id;
          return (
            <button key={t.id} onClick={() => onFilterType(t.id)} className="smooth"
              style={{ padding: "5px 12px", border: `1px solid ${active ? t.color : "var(--sum-bdr)"}`, background: active ? `color-mix(in srgb, ${t.color} 12%, transparent)` : "transparent", color: active ? t.color : "var(--sum-tx3)", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
              {t.id}
            </button>
          );
        })}
      </div>
      {entries.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--sum-tx4)", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)" }}>
          <div style={{ fontSize: 14 }}>No entries match your search.</div>
        </div>
      ) : (
        entries.map((e) => <JournalEntryCard key={e.id} entry={e} onShare={() => onShareEntry(e.id)} />)
      )}
      {draftOpen && <JournalDraftModal onClose={() => onDraftOpen(false)} />}
    </div>
  );
}

function JournalDraftModal({ onClose }: { onClose: () => void }) {
  const [types, setTypes] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const hasDesire = types.includes("D.E.S.I.R.E.");

  let detailsLabel = "DETAILS";
  let detailsPrompt = "What happened? What are you noticing? What might be possible?";
  if (types.includes("D.E.S.I.R.E.") || types.includes("FEAR/FRICTION")) {
    detailsLabel = "FEAR/FRICTION";
    detailsPrompt = "Identify the point defining the problem/barrier/challenge we are solving.";
  } else if (types.includes("IDEA")) {
    detailsLabel = "DETAILS";
    detailsPrompt = "What's the idea? What might be possible?";
  }

  const toggleType = (id: string) => setTypes((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", maxWidth: 680, width: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--sum-bdr)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>New Journal Entry</div>
            <div style={{ fontSize: 11, color: "var(--sum-gold)" }}>PRIVATE — visible only to you</div>
          </div>
          <button onClick={onClose} style={{ color: "var(--sum-tx4)", padding: 4 }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ padding: 18, overflow: "auto", flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 8 }}>WHAT IS THIS? (PICK ONE OR MORE)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
            {ENTRY_TYPES.map((t) => {
              const sel = types.includes(t.id);
              return (
                <button key={t.id} onClick={() => toggleType(t.id)} className="smooth"
                  style={{ padding: "8px 14px", border: `1px solid ${sel ? t.color : "var(--sum-bdr)"}`, background: sel ? `color-mix(in srgb, ${t.color} 12%, transparent)` : "transparent", color: sel ? t.color : "var(--sum-tx3)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  {sel && <Icon name="check" size={12} />}
                  <span>{t.id}</span>
                  <span style={{ fontWeight: 400, fontSize: 11, color: sel ? t.color : "var(--sum-tx4)", opacity: sel ? 0.85 : 1 }}>{t.desc}</span>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 6 }}>TITLE</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A short, scannable title..." className="sum-input-pulse"
            style={{ width: "100%", padding: "10px 12px", background: "var(--sum-inp)", outline: "none", fontSize: 14, marginBottom: 14, color: "inherit" }} />
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 6 }}>{detailsLabel}</div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={detailsPrompt} className="sum-input-pulse"
            style={{ width: "100%", minHeight: 120, padding: "10px 12px", background: "var(--sum-inp)", outline: "none", resize: "vertical", fontSize: 14, lineHeight: 1.6, marginBottom: 14, color: "inherit" }} />
          {hasDesire && (
            <div style={{ padding: 18, background: "var(--sum-bg3)", border: "1px solid var(--sum-bdr)", marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "var(--sum-gold)", marginBottom: 6 }}>D.E.S.I.R.E. STRUCTURE</div>
              <div style={{ fontSize: 11, color: "var(--sum-tx3)", lineHeight: 1.65, marginBottom: 14 }}>
                Leave any field blank — your team can RIFF to complete it. The more you complete, the more it is campaign-ready.
              </div>
              {DESIRE_FIELDS.map((f) => (
                <div key={f} style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--sum-gold)", marginBottom: 5 }}>
                    {f.toUpperCase()} <span style={{ fontWeight: 400, color: "var(--sum-tx5)" }}>— {DESIRE_HINTS[f]}</span>
                  </label>
                  <textarea placeholder="Optional" className="sum-input-pulse"
                    style={{ width: "100%", minHeight: 50, padding: "8px 10px", background: "var(--sum-inp)", outline: "none", resize: "vertical", fontSize: 14, lineHeight: 1.5, color: "inherit" }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 6 }}>
            TAGS <span style={{ fontWeight: 400, color: "var(--sum-tx5)" }}>(freeform — type and press Enter)</span>
          </div>
          <div className="sum-input-pulse" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, padding: 6, background: "var(--sum-inp)" }}>
            {tags.map((t, i) => (
              <span key={t} className="tag active" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                #{t}
                <button onClick={() => setTags(tags.filter((_, j) => j !== i))} style={{ color: "#000", display: "flex", padding: 0 }}><Icon name="x" size={10} /></button>
              </span>
            ))}
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="add tag..."
              style={{ flex: 1, minWidth: 120, padding: "4px 8px", background: "transparent", border: "none", outline: "none", fontSize: 14, color: "inherit" }} />
          </div>
        </div>
        <div style={{ padding: "14px 18px", borderTop: "1px solid var(--sum-bdr)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: "var(--sum-tx5)" }}>Saved to your private journal only.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ padding: "8px 14px", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 12, fontWeight: 700 }}>CANCEL</button>
            <button onClick={onClose} style={{ padding: "8px 16px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 800 }}>SAVE ENTRY</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function JournalEntryCard({ entry: e, onShare }: { entry: JournalEntry; onShare: () => void }) {
  const colorMeta = noteColorMeta(e.color);
  const filled = e.solve ? Object.values(e.solve).filter(Boolean).length : 0;
  return (
    <div className="smooth" style={{ padding: "22px 24px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", borderLeft: `3px solid ${colorMeta.color}`, marginBottom: 12, cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
        {e.types.map((tid) => {
          const t = ENTRY_TYPES.find((x) => x.id === tid);
          if (!t) return null;
          return (
            <span key={tid} style={{ padding: "2px 8px", background: `color-mix(in srgb, ${t.color} 15%, transparent)`, color: t.color, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>{tid}</span>
          );
        })}
        <span style={{ fontSize: 12, color: "var(--sum-tx4)" }}>{e.date}</span>
        {e.folderId && (() => {
          const f = FOLDERS.find((x) => x.id === e.folderId);
          return f ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, color: "var(--sum-tx4)" }}><Icon name="folder" size={11} />{f.name}</span> : null;
        })()}
        {e.reminders && e.reminders.length > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, color: "var(--sum-gold)", fontWeight: 700 }}>
            <Icon name="clock" size={11} />{e.reminders.length}
          </span>
        )}
        {e.sharedToStoryEngine && (
          <span style={{ padding: "2px 7px", background: "rgba(95,204,0,0.15)", color: "var(--sum-green)", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>SHARED</span>
        )}
        <div style={{ flex: 1 }} />
        <button className="smooth" style={{ color: e.favorite ? "var(--sum-gold)" : "var(--sum-tx5)" }}>
          <Icon name={e.favorite ? "starFill" : "star"} size={14} />
        </button>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{e.title}</div>
      <div style={{ fontSize: 14, color: "var(--sum-tx2)", lineHeight: 1.7, marginBottom: 10 }}>{e.text}</div>
      {e.tags.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {e.tags.map((t) => (
            <span key={t} className="tag">#{t}</span>
          ))}
        </div>
      )}
      {e.solve && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: "var(--sum-bdr)", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(filled / 6) * 100}%`, background: filled === 6 ? "var(--sum-green)" : "var(--sum-gold)" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: filled === 6 ? "var(--sum-green)" : "var(--sum-gold)" }}>D.E.S.I.R.E. {filled}/6</span>
        </div>
      )}
      {!e.sharedToStoryEngine && (
        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={(ev) => { ev.stopPropagation(); onShare(); }} className="smooth" style={{ padding: "5px 10px", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
            SHARE TO STORY ENGINE →
          </button>
        </div>
      )}
    </div>
  );
}
