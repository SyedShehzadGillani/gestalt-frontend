// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-Tab-Journal-v1.jsx
// S.U.M. Module — PERSONAL JOURNAL tab (LIST VIEW + ENTRY CARDS)
// Modals (detail, draft, share) added in Steps 6b, 6c, 6d.
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════
import React from "react";
import RightPanel from "./GPS-SUM-RightPanel-v1";
import {
  Plus, X, Search, Star, Folder, Clock, Lightbulb, Edit2, Forward, Check,
  AlertTriangle, Sparkles,
} from "lucide-react";
import {
  JOURNAL_ENTRIES,
  ENTRY_TYPES,
  FOLDERS,
  DESIRE_FIELDS,
  DESIRE_HINTS,
} from "../../constants/GPS-SUM-Data-v1";

// ─── Tag chip ─────────────────────────────────────────────────────────────
export function Tag({ label, active = false }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      marginRight: 4,
      marginBottom: 4,
      background: active ? "var(--gold)" : "var(--bg3)",
      color: active ? "#000" : "var(--tx3)",
      fontSize: "var(--t-micro)",
      fontWeight: 600,
      borderRadius: 2,
    }}>
      #{label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — list view with filters
// ═══════════════════════════════════════════════════════════════════════════
export default function SumTabJournal(props) {
  const {
    journalSearch, setJournalSearch,
    journalFilterType, setJournalFilterType,
    journalFavoritesOnly, setJournalFavoritesOnly,
    journalEntryOpen, setJournalEntryOpen,
    journalDraftOpen, setJournalDraftOpen,
    journalDraft, setJournalDraft,
    journalFolderFilter, setJournalFolderFilter,
    shareStep, setShareStep,
    shareEntryId, setShareEntryId,
    setDraggedEntryId,
  } = props;

  let entries = JOURNAL_ENTRIES.slice();
  if (journalFavoritesOnly) entries = entries.filter(e => e.favorite);
  if (journalFilterType)    entries = entries.filter(e => e.types.includes(journalFilterType));
  if (journalFolderFilter)  entries = entries.filter(e => e.folderId === journalFolderFilter);
  if (journalSearch.trim()) {
    const q = journalSearch.toLowerCase().trim();
    entries = entries.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.text.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  const folder = journalFolderFilter ? FOLDERS.find(f => f.id === journalFolderFilter) : null;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "28px 32px", maxWidth: 840, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontSize: "var(--t-h1)", fontWeight: 900, color: "var(--tx)" }}>
                  PERSONAL JOURNAL
                </div>
                <div style={{ fontSize: "var(--t-body)", color: "var(--tx3)", marginTop: 4 }}>
                  Your structured ideas, frictions, and resolutions. Drag any entry into a folder.
                </div>
              </div>
              <button
                onClick={() => {
                  setJournalDraft({ types: [], title: "", text: "", tags: [], tagInput: "", desire: null });
                  setJournalDraftOpen(true);
                }}
                style={{
                  padding: "10px 16px",
                  background: "var(--gold)",
                  color: "#000",
                  fontSize: "var(--t-caption)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "none",
                  borderRadius: 2,
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /><span>NEW ENTRY</span>
              </button>
            </div>
          </div>

          {folder && (
            <div style={{
              padding: "14px 18px",
              background: "rgba(226,181,63,0.06)",
              border: "1px solid rgba(226,181,63,0.2)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 2,
            }}>
              <Folder size={14} color="var(--gold)" />
              <span style={{ fontSize: "var(--t-caption)", color: "var(--tx2)" }}>
                Filtered by folder: <strong style={{ color: "var(--gold)" }}>{folder.name}</strong>{" "}
                ({entries.length} {entries.length === 1 ? "entry" : "entries"})
              </span>
              <button
                onClick={() => setJournalFolderFilter(null)}
                style={{
                  marginLeft: "auto",
                  color: "var(--tx4)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  padding: 2,
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div style={{
            display: "flex",
            gap: 8,
            marginBottom: 14,
            flexWrap: "wrap",
            alignItems: "stretch",
          }}>
            <div style={{
              flex: 1,
              minWidth: 200,
              display: "flex",
              alignItems: "center",
              background: "var(--inp)",
              border: "1px solid var(--bdr)",
              borderRadius: 2,
              padding: "0 12px",
            }}>
              <Search size={14} color="var(--tx4)" />
              <input
                className="gold-input"
                value={journalSearch}
                onChange={e => setJournalSearch(e.target.value)}
                placeholder="Search entries, tags, content..."
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "var(--t-body)",
                  color: "var(--tx)",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <button
              onClick={() => setJournalFavoritesOnly(!journalFavoritesOnly)}
              style={{
                padding: "8px 14px",
                background: journalFavoritesOnly ? "var(--gold)" : "transparent",
                color: journalFavoritesOnly ? "#000" : "var(--tx3)",
                border: `1px solid ${journalFavoritesOnly ? "var(--gold)" : "var(--bdr)"}`,
                borderRadius: 2,
                fontSize: "var(--t-caption)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <Star size={14} fill={journalFavoritesOnly ? "currentColor" : "none"} />
              <span>FAVORITES</span>
            </button>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
            <FilterChip
              label="ALL"
              active={!journalFilterType}
              activeColor="var(--gold)"
              onClick={() => setJournalFilterType(null)}
            />
            {ENTRY_TYPES.map(t => (
              <FilterChip
                key={t.id}
                label={t.id}
                active={journalFilterType === t.id}
                activeColor={t.color}
                onClick={() => setJournalFilterType(t.id)}
              />
            ))}
          </div>

          {entries.length === 0 ? (
            <div style={{
              padding: 40,
              textAlign: "center",
              color: "var(--tx4)",
              background: "var(--bg2)",
              border: "1px solid var(--bdr)",
              borderRadius: 2,
            }}>
              <div style={{ fontSize: "var(--t-body)" }}>No entries match your search.</div>
            </div>
          ) : (
            entries.map(e => (
              <JournalEntryCard
                key={e.id}
                entry={e}
                onClick={() => setJournalEntryOpen(e.id)}
                onDragStart={() => setDraggedEntryId(e.id)}
                onDragEnd={() => setDraggedEntryId(null)}
              />
            ))
          )}
        </div>
      </div>

      <RightPanel {...props} />

      {journalEntryOpen !== null && (
        <JournalDetailModal
          entryId={journalEntryOpen}
          onClose={() => setJournalEntryOpen(null)}
          onShare={(id) => {
            setShareEntryId(id);
            setShareStep(1);
          }}
        />
      )}
      {journalDraftOpen && (
        <JournalDraftModal
          draft={journalDraft}
          setDraft={setJournalDraft}
          onClose={() => setJournalDraftOpen(false)}
          onSave={() => {
            setJournalDraftOpen(false);
          }}
        />
      )}
      {shareStep !== null && shareEntryId !== null && (
        <ShareModal
          entryId={shareEntryId}
          step={shareStep}
          onStep={(n) => setShareStep(n)}
          onClose={() => {
            setShareStep(null);
            setShareEntryId(null);
          }}
          onSubmit={() => {
            setShareStep(null);
            setShareEntryId(null);
          }}
        />
      )}
    </div>
  );
}

function FilterChip({ label, active, activeColor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        border: `1px solid ${active ? activeColor : "var(--bdr)"}`,
        background: active ? `color-mix(in srgb, ${activeColor} 12%, transparent)` : "transparent",
        color: active ? activeColor : "var(--tx3)",
        fontSize: "var(--t-caption)",
        fontWeight: 700,
        letterSpacing: 0.5,
        borderRadius: 2,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function JournalEntryCard({ entry, onClick, onDragStart, onDragEnd }) {
  const filledFields = entry.desire ? Object.values(entry.desire).filter(v => v && v.trim()).length : 0;
  const isLoved = filledFields === 6;
  const folder = entry.folderId ? FOLDERS.find(f => f.id === entry.folderId) : null;
  const remindersCount = entry.reminders ? entry.reminders.length : 0;

  return (
    <div
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={{
        padding: "22px 28px",
        background: "var(--bg2)",
        border: "1px solid var(--bdr)",
        borderRadius: 2,
        marginBottom: 14,
        cursor: "pointer",
        transition: "border-color .15s, transform .15s",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 14,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          flex: 1,
        }}>
          {entry.types.map(tid => {
            const t = ENTRY_TYPES.find(x => x.id === tid);
            return (
              <span
                key={tid}
                style={{
                  padding: "2px 8px",
                  background: `color-mix(in srgb, ${t.color} 15%, transparent)`,
                  color: t.color,
                  fontSize: "var(--t-micro)",
                  fontWeight: 800,
                  letterSpacing: 1,
                  borderRadius: 2,
                }}
              >
                {tid}
              </span>
            );
          })}
          {entry.types.length === 0 && (
            <span style={{
              padding: "2px 8px",
              background: "var(--bg3)",
              color: "var(--tx4)",
              fontSize: "var(--t-micro)",
              fontWeight: 700,
              letterSpacing: 1,
              borderRadius: 2,
            }}>
              QUICK NOTE
            </span>
          )}
          <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)", marginLeft: 4 }}>
            {entry.date}
          </span>
          {entry.sharedToStoryEngine && (
            <span style={{
              padding: "2px 8px",
              background: "rgba(226,181,63,0.15)",
              color: "var(--gold)",
              fontSize: "var(--t-micro)",
              fontWeight: 700,
              letterSpacing: 1,
              display: "flex",
              alignItems: "center",
              gap: 3,
              borderRadius: 2,
            }}>
              <Lightbulb size={10} /> SHARED
            </span>
          )}
          {folder && (
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: "var(--t-micro)",
              color: "var(--tx4)",
            }}>
              <Folder size={10} />{folder.name}
            </span>
          )}
          {remindersCount > 0 && (
            <span
              title={`${remindersCount} reminder${remindersCount === 1 ? "" : "s"} set`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: "var(--t-micro)",
                color: "var(--gold)",
                fontWeight: 700,
              }}
            >
              <Clock size={10} />{remindersCount}
            </span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); }}
          style={{
            color: entry.favorite ? "var(--gold)" : "var(--tx5)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 2,
            display: "flex",
          }}
        >
          <Star size={16} fill={entry.favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div style={{
        fontSize: "var(--t-body-lg)",
        fontWeight: 700,
        marginTop: 14,
        color: "var(--tx)",
      }}>
        {entry.title}
      </div>

      <div style={{
        fontSize: "var(--t-body)",
        color: "var(--tx3)",
        lineHeight: 1.7,
        marginTop: 10,
      }}>
        {entry.text.length > 200 ? `${entry.text.slice(0, 200)}...` : entry.text}
      </div>

      {entry.tags.length > 0 && (
        <div style={{ marginTop: 18 }}>
          {entry.tags.map(t => <Tag key={t} label={t} />)}
        </div>
      )}

      {entry.desire && (
        <div style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{
            flex: 1,
            height: 4,
            background: "var(--bdr)",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${(filledFields / 6) * 100}%`,
              background: isLoved ? "var(--green)" : "var(--gold)",
            }} />
          </div>
          <span style={{
            fontSize: "var(--t-micro)",
            fontWeight: 700,
            color: isLoved ? "var(--green)" : "var(--gold)",
          }}>
            D.E.S.I.R.E. {filledFields}/6
          </span>
          {isLoved && (
            <span style={{
              padding: "2px 8px",
              background: "var(--green)",
              color: "#000",
              fontSize: "var(--t-micro)",
              fontWeight: 800,
              letterSpacing: 1,
              borderRadius: 2,
            }}>
              LOVED
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ModalStub({ label, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--bdr)",
          borderRadius: 2,
          padding: 24,
          maxWidth: 520,
          width: "100%",
          color: "var(--tx)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Modal Stub</div>
        <div style={{ color: "var(--tx3)", fontSize: "var(--t-caption)" }}>{label}</div>
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            padding: "6px 14px",
            background: "var(--gold)",
            color: "#000",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL — shared overlay + card styles (used by all journal modals)
// ═══════════════════════════════════════════════════════════════════════════
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 200,
  padding: 20,
};

const cardStyle = (maxWidth = 680) => ({
  background: "var(--bg2)",
  border: "1px solid var(--bdr)",
  borderRadius: 2,
  maxWidth,
  width: "100%",
  maxHeight: "92vh",
  display: "flex",
  flexDirection: "column",
  color: "var(--tx)",
});

// ═══════════════════════════════════════════════════════════════════════════
// JOURNAL DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════
function JournalDetailModal({ entryId, onClose, onShare }) {
  const e = JOURNAL_ENTRIES.find(x => x.id === entryId);
  if (!e) return null;
  const filledFields = e.desire ? Object.values(e.desire).filter(v => v && v.trim()).length : 0;
  const allFilled = filledFields === 6;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle(680)} onClick={ev => ev.stopPropagation()}>
        <div style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--bdr)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {e.types.map(tid => {
              const t = ENTRY_TYPES.find(x => x.id === tid);
              return (
                <span key={tid} style={{
                  padding: "3px 10px",
                  background: `color-mix(in srgb, ${t.color} 15%, transparent)`,
                  color: t.color,
                  fontSize: "var(--t-micro)",
                  fontWeight: 800,
                  letterSpacing: 1,
                  borderRadius: 2,
                }}>
                  {tid}
                </span>
              );
            })}
            <span style={{ fontSize: "var(--t-micro)", color: "var(--tx4)", marginLeft: 4 }}>
              {e.date}
            </span>
          </div>
          <button onClick={onClose} style={{
            color: "var(--tx4)",
            padding: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
          }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 18, overflow: "auto", flex: 1 }}>
          <div style={{ fontSize: "var(--t-h2)", fontWeight: 800, lineHeight: 1.3, color: "var(--tx)" }}>
            {e.title}
          </div>
          <div style={{
            fontSize: "var(--t-body)",
            color: "var(--tx2)",
            lineHeight: 1.7,
            marginTop: 12,
            whiteSpace: "pre-wrap",
          }}>
            {e.text}
          </div>

          {e.tags.length > 0 && (
            <div style={{ marginTop: 14 }}>
              {e.tags.map(t => <Tag key={t} label={t} />)}
            </div>
          )}

          {e.desire && (
            <div style={{
              marginTop: 24,
              padding: 16,
              background: "var(--bg3)",
              border: "1px solid var(--bdr)",
              borderRadius: 2,
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}>
                <div>
                  <div style={{
                    fontSize: "var(--t-caption)",
                    fontWeight: 800,
                    letterSpacing: 2,
                    color: "var(--gold)",
                  }}>
                    D.E.S.I.R.E. STRUCTURE
                  </div>
                  <div style={{ fontSize: "var(--t-micro)", color: "var(--tx4)", marginTop: 2 }}>
                    {filledFields}/6 fields completed{allFilled ? " — LOVED" : ""}
                  </div>
                </div>
                {allFilled && (
                  <span style={{
                    padding: "4px 10px",
                    background: "var(--green)",
                    color: "#000",
                    fontSize: "var(--t-caption)",
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    borderRadius: 2,
                  }}>
                    LOVED
                  </span>
                )}
              </div>

              {DESIRE_FIELDS.map(f => {
                const filled = e.desire[f] && e.desire[f].trim();
                return (
                  <div key={f} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{
                        fontSize: "var(--t-caption)",
                        fontWeight: 800,
                        letterSpacing: 1,
                        color: filled ? "var(--gold)" : "var(--tx4)",
                      }}>
                        {f.toUpperCase()}
                      </span>
                      <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>
                        — {DESIRE_HINTS[f]}
                      </span>
                    </div>
                    <div style={{
                      fontSize: "var(--t-body)",
                      color: filled ? "var(--tx2)" : "var(--tx5)",
                      lineHeight: 1.6,
                      fontStyle: filled ? "normal" : "italic",
                      padding: "8px 12px",
                      background: filled ? "var(--bg2)" : "transparent",
                      border: "1px solid var(--bdr)",
                      borderRadius: 2,
                    }}>
                      {filled ? e.desire[f] : "Not yet completed — add your perspective"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{
          padding: "12px 18px",
          borderTop: "1px solid var(--bdr)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={detailFooterBtn(e.favorite ? "var(--gold)" : "var(--tx3)")}>
              <Star size={13} fill={e.favorite ? "currentColor" : "none"} />
              <span>{e.favorite ? "FAVORITED" : "FAVORITE"}</span>
            </button>
            <button style={detailFooterBtn("var(--tx3)")}>
              <Edit2 size={13} />
              <span>EDIT</span>
            </button>
          </div>

          {e.sharedToStoryEngine ? (
            <button disabled style={{
              padding: "8px 14px",
              background: "rgba(226,181,63,0.1)",
              color: "var(--gold)",
              border: "1px solid rgba(226,181,63,0.3)",
              borderRadius: 2,
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "not-allowed",
            }}>
              <Check size={13} /><span>SHARED TO STORY ENGINE</span>
            </button>
          ) : (
            <button
              onClick={() => onShare(e.id)}
              style={{
                padding: "8px 14px",
                background: "var(--gold)",
                color: "#000",
                border: "none",
                borderRadius: 2,
                fontSize: "var(--t-caption)",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 6,
                letterSpacing: 0.5,
                cursor: "pointer",
              }}
            >
              <Forward size={13} /><span>SHARE TO STORY ENGINE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function detailFooterBtn(color) {
  return {
    padding: "6px 10px",
    border: "1px solid var(--bdr)",
    background: "transparent",
    color,
    fontSize: "var(--t-caption)",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 4,
    borderRadius: 2,
    cursor: "pointer",
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// JOURNAL DRAFT MODAL — new entry composer
// ═══════════════════════════════════════════════════════════════════════════
function JournalDraftModal({ draft, setDraft, onClose, onSave }) {
  const hasDesire = draft.types.includes("D.E.S.I.R.E.");

  let detailsLabel = "DETAILS";
  let detailsPrompt = "What happened? What are you noticing? What might be possible?";
  if (draft.types.includes("D.E.S.I.R.E.") || draft.types.includes("FEAR/FRICTION")) {
    detailsLabel = "FEAR/FRICTION";
    detailsPrompt = "Identify the point defining the problem/barrier/challenge we are solving.";
  } else if (draft.types.includes("IDEA")) {
    detailsLabel = "DETAILS";
    detailsPrompt = "What's the idea? What might be possible?";
  }

  function toggleType(typeId) {
    setDraft({
      ...draft,
      types: draft.types.includes(typeId)
        ? draft.types.filter(t => t !== typeId)
        : [...draft.types, typeId],
    });
  }

  function addTagFromInput() {
    const t = (draft.tagInput || "").trim();
    if (!t) return;
    setDraft({ ...draft, tags: [...draft.tags, t], tagInput: "" });
  }

  function removeTag(idx) {
    setDraft({ ...draft, tags: draft.tags.filter((_, i) => i !== idx) });
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle(680)} onClick={ev => ev.stopPropagation()}>
        <div style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--bdr)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: "var(--t-h3)", fontWeight: 800 }}>New Journal Entry</div>
            <div style={{ fontSize: "var(--t-micro)", color: "var(--gold)" }}>
              PRIVATE — visible only to you
            </div>
          </div>
          <button onClick={onClose} style={{
            color: "var(--tx4)",
            padding: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
          }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 18, overflow: "auto", flex: 1 }}>
          <FieldLabel>WHAT IS THIS? (PICK ONE OR MORE)</FieldLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
            {ENTRY_TYPES.map(t => {
              const sel = draft.types.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleType(t.id)}
                  style={{
                    padding: "8px 14px",
                    border: `1px solid ${sel ? t.color : "var(--bdr)"}`,
                    background: sel ? `color-mix(in srgb, ${t.color} 12%, transparent)` : "transparent",
                    color: sel ? t.color : "var(--tx3)",
                    borderRadius: 2,
                    fontSize: "var(--t-caption)",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer",
                  }}
                >
                  {sel && <Check size={12} />}
                  <span>{t.id}</span>
                  <span style={{
                    fontWeight: 400,
                    fontSize: "var(--t-micro)",
                    color: sel ? t.color : "var(--tx4)",
                    opacity: sel ? 0.85 : 1,
                  }}>
                    {t.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <FieldLabel>TITLE</FieldLabel>
          <input
            className="gold-input"
            value={draft.title}
            onChange={e => setDraft({ ...draft, title: e.target.value })}
            placeholder="A short, scannable title..."
            style={textInputStyle}
          />

          <FieldLabel>{detailsLabel}</FieldLabel>
          <textarea
            className="gold-input"
            value={draft.text}
            onChange={e => setDraft({ ...draft, text: e.target.value })}
            placeholder={detailsPrompt}
            style={{ ...textInputStyle, minHeight: 120, lineHeight: 1.6, resize: "vertical" }}
          />

          {hasDesire && (
            <div style={{
              padding: 18,
              background: "var(--bg3)",
              border: "1px solid var(--bdr)",
              marginBottom: 14,
              borderRadius: 2,
            }}>
              <div style={{
                fontSize: "var(--t-caption)",
                fontWeight: 800,
                letterSpacing: 2,
                color: "var(--gold)",
                marginBottom: 6,
              }}>
                D.E.S.I.R.E. STRUCTURE
              </div>
              <div style={{
                fontSize: "var(--t-micro)",
                color: "var(--tx3)",
                lineHeight: 1.65,
                marginBottom: 14,
              }}>
                Leave any field blank, and your team can RIFF to complete it.
                The more you complete, the more it is campaign-ready for execution.
              </div>
              {DESIRE_FIELDS.map(f => (
                <div key={f} style={{ marginBottom: 12 }}>
                  <label style={{
                    display: "block",
                    fontSize: "var(--t-caption)",
                    fontWeight: 700,
                    color: "var(--gold)",
                    marginBottom: 5,
                  }}>
                    {f.toUpperCase()}{" "}
                    <span style={{ fontWeight: 400, color: "var(--tx5)" }}>
                      — {DESIRE_HINTS[f]}
                    </span>
                  </label>
                  <textarea
                    className="gold-input"
                    placeholder="Optional"
                    style={{ ...textInputStyle, minHeight: 50, lineHeight: 1.5, resize: "vertical" }}
                  />
                </div>
              ))}
            </div>
          )}

          <FieldLabel>
            TAGS{" "}
            <span style={{ fontWeight: 400, color: "var(--tx5)" }}>
              (freeform — type and press Enter)
            </span>
          </FieldLabel>
          <div className="gold-input" style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 4,
            padding: 6,
            background: "var(--inp)",
            border: "1px solid var(--bdr)",
            borderRadius: 2,
          }}>
            {draft.tags.map((t, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "var(--gold)",
                  color: "#000",
                  padding: "2px 8px",
                  fontSize: "var(--t-micro)",
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              >
                #{t}
                <button
                  onClick={() => removeTag(i)}
                  style={{
                    color: "#000",
                    display: "flex",
                    padding: 0,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              value={draft.tagInput || ""}
              onChange={e => setDraft({ ...draft, tagInput: e.target.value })}
              onKeyDown={e => {
                if (e.key === "Enter") { e.preventDefault(); addTagFromInput(); }
              }}
              placeholder="add tag..."
              style={{
                flex: 1,
                minWidth: 120,
                padding: "4px 8px",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "var(--t-body)",
                color: "var(--tx)",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div style={{
          padding: "14px 18px",
          borderTop: "1px solid var(--bdr)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>
            Saved to your private journal only.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{
              padding: "8px 14px",
              border: "1px solid var(--bdr2)",
              background: "transparent",
              color: "var(--tx3)",
              borderRadius: 2,
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              cursor: "pointer",
            }}>
              CANCEL
            </button>
            <button onClick={onSave} style={{
              padding: "8px 16px",
              background: "var(--gold)",
              color: "#000",
              border: "none",
              borderRadius: 2,
              fontSize: "var(--t-caption)",
              fontWeight: 800,
              cursor: "pointer",
            }}>
              SAVE ENTRY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize: "var(--t-caption)",
      fontWeight: 700,
      letterSpacing: 1.5,
      color: "var(--tx4)",
      marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

const textInputStyle = {
  width: "100%",
  padding: "10px 12px",
  background: "var(--inp)",
  border: "1px solid var(--bdr)",
  borderRadius: 2,
  outline: "none",
  fontSize: "var(--t-body)",
  marginBottom: 14,
  color: "var(--tx)",
  fontFamily: "inherit",
};

// ═══════════════════════════════════════════════════════════════════════════
// SHARE MODAL — 2-step confirmation flow
// ═══════════════════════════════════════════════════════════════════════════
function ShareModal({ entryId, step, onStep, onClose, onSubmit }) {
  const e = JOURNAL_ENTRIES.find(x => x.id === entryId);
  if (!e) return null;

  if (step === 1) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={cardStyle(520)} onClick={ev => ev.stopPropagation()}>
          <div style={{
            padding: 18,
            borderBottom: "1px solid var(--bdr)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <AlertTriangle size={20} color="var(--gold)" />
            <span style={{ fontSize: "var(--t-h3)", fontWeight: 800 }}>
              Make this entry public?
            </span>
          </div>
          <div style={{
            padding: 18,
            fontSize: "var(--t-body)",
            color: "var(--tx2)",
            lineHeight: 1.65,
          }}>
            <div style={{ marginBottom: 14 }}>
              This entry is currently <strong style={{ color: "var(--gold)" }}>private to you</strong>.
              Sharing it to Story Engine will:
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Make the post visible to your team with your name attached",
                "Allow upvotes and RIFFs (revisions, refinements, missing field completion)",
                "Be passed through GESTALT INTELLIGENCE to check on-brand alignment",
                "Be considered for quarterly FORMULA harvest if it gains traction",
              ].map((line, i) => (
                <li
                  key={i}
                  style={{
                    padding: "6px 0",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ color: "var(--gold)", marginTop: 2, display: "flex" }}>
                    <Check size={14} />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div style={{
              marginTop: 16,
              padding: 12,
              background: "var(--bg3)",
              border: "1px solid var(--bdr)",
              fontSize: "var(--t-caption)",
              color: "var(--tx3)",
              borderRadius: 2,
            }}>
              <strong style={{ color: "var(--tx2)" }}>You can still cancel before final submission.</strong>{" "}
              The next screen will show exactly how your post will appear.
            </div>
          </div>
          <div style={{
            padding: "14px 18px",
            borderTop: "1px solid var(--bdr)",
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}>
            <button onClick={onClose} style={{
              padding: "8px 16px",
              border: "1px solid var(--bdr2)",
              background: "transparent",
              color: "var(--tx3)",
              borderRadius: 2,
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              cursor: "pointer",
            }}>
              CANCEL
            </button>
            <button onClick={() => onStep(2)} style={{
              padding: "8px 16px",
              background: "var(--gold)",
              color: "#000",
              border: "none",
              borderRadius: 2,
              fontSize: "var(--t-caption)",
              fontWeight: 800,
              cursor: "pointer",
            }}>
              CONTINUE TO REVIEW
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2 — final review
  const filledFields = e.desire ? Object.values(e.desire).filter(v => v && v.trim()).length : 0;
  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle(600)} onClick={ev => ev.stopPropagation()}>
        <div style={{
          padding: 18,
          borderBottom: "1px solid var(--bdr)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              letterSpacing: 2,
              color: "var(--gold)",
            }}>
              FINAL REVIEW — STEP 2 OF 2
            </div>
            <div style={{ fontSize: "var(--t-h3)", fontWeight: 800, marginTop: 2 }}>
              This is exactly how your post will appear
            </div>
          </div>
        </div>
        <div style={{ padding: 18, overflow: "auto", flex: 1 }}>
          <div style={{
            padding: 14,
            background: "var(--bg3)",
            border: "1px solid var(--bdr)",
            borderLeft: "3px solid var(--gold)",
            borderRadius: 2,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                background: "var(--bg)",
                border: "1px solid var(--bdr)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: "var(--t-micro)", fontWeight: 800, color: "var(--tx3)" }}>
                  JE
                </span>
              </div>
              <div>
                <div style={{ fontSize: "var(--t-caption)", fontWeight: 700 }}>Jeffery Ess</div>
                <div style={{ fontSize: "var(--t-micro)", color: "var(--tx4)" }}>Founder · just now</div>
              </div>
            </div>
            {e.types.map(tid => {
              const t = ENTRY_TYPES.find(x => x.id === tid);
              return (
                <span key={tid} style={{
                  padding: "2px 8px",
                  background: `color-mix(in srgb, ${t.color} 15%, transparent)`,
                  color: t.color,
                  fontSize: "var(--t-micro)",
                  fontWeight: 800,
                  letterSpacing: 1,
                  marginRight: 4,
                  borderRadius: 2,
                }}>
                  {tid}
                </span>
              );
            })}
            <div style={{
              fontSize: "var(--t-body-lg)",
              fontWeight: 700,
              marginTop: 10,
            }}>
              {e.title}
            </div>
            <div style={{
              fontSize: "var(--t-body)",
              color: "var(--tx2)",
              lineHeight: 1.6,
              marginTop: 6,
            }}>
              {e.text}
            </div>
            {e.tags.length > 0 && (
              <div style={{ marginTop: 10 }}>
                {e.tags.map(t => <Tag key={t} label={t} />)}
              </div>
            )}
            {e.desire && (
              <div style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: "1px solid var(--bdr)",
                fontSize: "var(--t-caption)",
                color: "var(--gold)",
                fontWeight: 700,
              }}>
                D.E.S.I.R.E. — {filledFields}/6 fields {filledFields < 6 && "(community can RIFF to complete)"}
              </div>
            )}
          </div>
          <div style={{
            marginTop: 14,
            padding: 12,
            background: "rgba(226,181,63,0.06)",
            border: "1px solid rgba(226,181,63,0.2)",
            borderRadius: 2,
          }}>
            <div style={{
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              color: "var(--gold)",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <Sparkles size={12} />GESTALT INTELLIGENCE — BRAND CHECK
            </div>
            <div style={{
              fontSize: "var(--t-caption)",
              color: "var(--tx2)",
              lineHeight: 1.55,
            }}>
              GESTALT INTELLIGENCE will check this post against brand voice and D.E.S.I.R.E. pillars
              before publishing. On-brand posts publish immediately. Borderline posts publish with
              a "BRAND REVIEW PENDING" flag. Off-brand posts route to management.
            </div>
          </div>
          <div style={{
            marginTop: 10,
            fontSize: "var(--t-caption)",
            color: "var(--tx4)",
            lineHeight: 1.5,
          }}>
            Your private journal entry remains in your journal. Sharing creates a separate Story
            Engine post — it does not delete or move your private entry.
          </div>
        </div>
        <div style={{
          padding: "14px 18px",
          borderTop: "1px solid var(--bdr)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}>
          <button onClick={() => onStep(1)} style={{
            padding: "8px 14px",
            border: "1px solid var(--bdr2)",
            background: "transparent",
            color: "var(--tx3)",
            borderRadius: 2,
            fontSize: "var(--t-caption)",
            fontWeight: 700,
            cursor: "pointer",
          }}>
            BACK
          </button>
          <button onClick={onSubmit} style={{
            padding: "10px 20px",
            background: "var(--gold)",
            color: "#000",
            border: "none",
            borderRadius: 2,
            fontSize: "var(--t-caption)",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 6,
            letterSpacing: 0.5,
            cursor: "pointer",
          }}>
            <Forward size={13} /><span>SUBMIT TO STORY ENGINE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
