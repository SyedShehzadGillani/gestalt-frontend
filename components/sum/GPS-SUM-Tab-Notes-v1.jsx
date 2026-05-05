// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-Tab-Notes-v1.jsx
// S.U.M. Module — NOTES tab + QuickNote modal
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState } from "react";
import RightPanel from "./GPS-SUM-RightPanel-v1";
import {
  Plus, X, Search, Star, Folder, Clock, Sticker, MoreHorizontal,
} from "lucide-react";
import {
  NOTES,
  NOTE_COLORS,
  FOLDERS,
} from "../../constants/GPS-SUM-Data-v1";
import { hexToRgba } from "../../utils/GPS-SUM-Utils-v1";

export default function SumTabNotes(props) {
  const {
    notesSort, setNotesSort,
    notesColorFilter, setNotesColorFilter,
    notesFolderFilter, setNotesFolderFilter,
    journalSearch, setJournalSearch,
    setDraggedNoteId,
    setQuickNoteOpen,
  } = props;

  let notes = NOTES.slice();
  if (notesColorFilter)  notes = notes.filter(n => n.color === notesColorFilter);
  if (notesFolderFilter) notes = notes.filter(n => n.folderId === notesFolderFilter);
  if (journalSearch.trim()) {
    const q = journalSearch.toLowerCase().trim();
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.text.toLowerCase().includes(q)
    );
  }

  if (notesSort === "date-new") {
    notes.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (notesSort === "date-old") {
    notes.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (notesSort === "color") {
    const order = NOTE_COLORS.map(c => c.id);
    notes.sort((a, b) => order.indexOf(a.color) - order.indexOf(b.color));
  }

  const folder = notesFolderFilter ? FOLDERS.find(f => f.id === notesFolderFilter) : null;
  const hasActiveFilter = notesColorFilter || notesFolderFilter || journalSearch.trim();

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
      <div style={{ flex: 1, overflow: "auto" }}>
        <div style={{ padding: "28px 32px", width: "100%" }}>
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
                  NOTES
                </div>
                <div style={{ fontSize: "var(--t-body)", color: "var(--tx3)", marginTop: 4 }}>
                  A wall of quick captures. Color-code, sort, search, and drag into folders.
                </div>
              </div>
              <button
                onClick={() => setQuickNoteOpen(true)}
                style={{
                  padding: "10px 16px",
                  background: "var(--gold)",
                  color: "#000",
                  border: "none",
                  borderRadius: 2,
                  fontSize: "var(--t-caption)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <Plus size={14} /><span>NOTE</span>
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
                ({notes.length} {notes.length === 1 ? "note" : "notes"})
              </span>
              <button
                onClick={() => setNotesFolderFilter(null)}
                style={{
                  marginLeft: "auto",
                  color: "var(--tx4)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {notesSort === "manual" && (
            <div style={{
              padding: "10px 14px",
              background: "rgba(226,181,63,0.06)",
              border: "1px solid rgba(226,181,63,0.2)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 2,
            }}>
              <MoreHorizontal size={13} color="var(--gold)" />
              <span style={{ fontSize: "var(--t-caption)", color: "var(--tx3)" }}>
                Manual mode — drag any note left or right of another to reorder.
              </span>
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
                placeholder="Search notes..."
                style={{
                  flex: 1,
                  padding: 8,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "var(--t-body)",
                  color: "var(--tx)",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{
              display: "flex",
              border: "1px solid var(--bdr)",
              background: "var(--bg2)",
            }}>
              {[
                { id: "date-new", label: "NEWEST" },
                { id: "date-old", label: "OLDEST" },
                { id: "color",    label: "COLOR"  },
                { id: "manual",   label: "MANUAL" },
              ].map((s, i, arr) => {
                const sel = notesSort === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setNotesSort(s.id)}
                    style={{
                      padding: "8px 12px",
                      background: sel ? "rgba(226,181,63,0.1)" : "transparent",
                      color: sel ? "var(--gold)" : "var(--tx3)",
                      border: "none",
                      borderRight: i < arr.length - 1 ? "1px solid var(--bdr)" : "none",
                      fontSize: "var(--t-caption)",
                      fontWeight: sel ? 800 : 600,
                      letterSpacing: 1,
                      cursor: "pointer",
                      borderRadius: 0,
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: 6,
            marginBottom: 18,
            flexWrap: "wrap",
            alignItems: "center",
          }}>
            <span style={{
              fontSize: 10,
              color: "var(--tx5)",
              fontWeight: 700,
              letterSpacing: 1,
              marginRight: 4,
            }}>
              COLOR:
            </span>
            <ColorFilterChip
              label="ALL"
              active={!notesColorFilter}
              activeColor="var(--gold)"
              onClick={() => setNotesColorFilter(null)}
            />
            {NOTE_COLORS.map(c => {
              const sel = notesColorFilter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setNotesColorFilter(c.id)}
                  title={c.label}
                  style={{
                    padding: "5px 12px",
                    border: `1px solid ${sel ? c.color : hexToRgba(c.color, 0.6)}`,
                    background: sel ? hexToRgba(c.color, 0.15) : "transparent",
                    color: c.color,
                    fontSize: "var(--t-caption)",
                    fontWeight: sel ? 800 : 700,
                    letterSpacing: 0.5,
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                >
                  {c.label.toUpperCase()}
                </button>
              );
            })}
          </div>

          {notes.length === 0 ? (
            <div style={{
              padding: "60px 40px",
              textAlign: "center",
              color: "var(--tx4)",
              background: "var(--bg2)",
              border: "1px solid var(--bdr)",
              borderRadius: 2,
            }}>
              <div style={{ opacity: 0.4, marginBottom: 12, display: "flex", justifyContent: "center" }}>
                <Sticker size={36} strokeWidth={1.5} />
              </div>
              <div style={{ fontSize: "var(--t-body)" }}>
                {hasActiveFilter ? "No notes match." : "No notes yet."}
              </div>
              <div style={{ fontSize: "var(--t-caption)", color: "var(--tx5)", marginTop: 6 }}>
                {hasActiveFilter ? "" : "Click + NOTE to capture your first thought."}
              </div>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 14,
            }}>
              {notes.map(n => (
                <NoteCard
                  key={n.id}
                  note={n}
                  onDragStart={() => setDraggedNoteId(n.id)}
                  onDragEnd={() => setDraggedNoteId(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <RightPanel {...props} />
    </div>
  );
}

function ColorFilterChip({ label, active, activeColor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        border: `1px solid ${active ? activeColor : "var(--bdr)"}`,
        background: active ? "rgba(226,181,63,0.1)" : "transparent",
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

function NoteCard({ note, onDragStart, onDragEnd }) {
  const colorMeta = NOTE_COLORS.find(c => c.id === note.color) || NOTE_COLORS[0];
  const folder = note.folderId ? FOLDERS.find(f => f.id === note.folderId) : null;
  const [hover, setHover] = useState(false);

  const bgTint     = hexToRgba(colorMeta.color, 0.10);
  const borderRest = hexToRgba(colorMeta.color, 0.5);
  const borderHov  = colorMeta.color;

  return (
    <div
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: bgTint,
        border: `1px solid ${hover ? borderHov : borderRest}`,
        borderRadius: 2,
        padding: 14,
        boxShadow: hover ? `0 0 0 1px ${borderHov}` : "none",
        cursor: "grab",
        transition: "border-color .15s, box-shadow .15s",
        "--note-color":       colorMeta.color,
        "--note-color-light": colorMeta.colorDark,
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
        gap: 8,
      }}>
        <div style={{
          flex: 1,
          fontSize: "var(--t-body)",
          fontWeight: 700,
          lineHeight: 1.35,
          color: "var(--tx)",
          textAlign: "left",
        }}>
          {note.title}
        </div>
        <button
          onClick={e => { e.stopPropagation(); }}
          style={{
            color: note.favorite ? "var(--gold)" : "var(--tx5)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            display: "flex",
          }}
        >
          <Star size={13} fill={note.favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div
        className="note-body"
        style={{
          fontSize: "var(--t-caption)",
          lineHeight: 1.6,
          marginBottom: 12,
          color: "var(--note-color)",
        }}
      >
        {note.text.length > 140 ? `${note.text.slice(0, 140)}...` : note.text}
      </div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 10,
        color: "var(--tx5)",
        gap: 6,
        flexWrap: "wrap",
      }}>
        <span>{note.date}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {note.reminders && note.reminders.length > 0 && (
            <span
              title={`${note.reminders.length} reminder${note.reminders.length === 1 ? "" : "s"}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                color: "var(--gold)",
                fontWeight: 700,
              }}
            >
              <Clock size={10} />{note.reminders.length}
            </span>
          )}
          {folder && (
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Folder size={10} />{folder.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function QuickNoteModal(props) {
  const {
    quickNoteText, setQuickNoteText,
    quickNoteColor, setQuickNoteColor,
    quickNoteReminders, setQuickNoteReminders,
    quickNoteReminderDate, setQuickNoteReminderDate,
    quickNoteReminderTime, setQuickNoteReminderTime,
    onClose,
  } = props;

  function addReminderFromDateTime() {
    if (!quickNoteReminderDate) return;
    const at = quickNoteReminderTime
      ? `${quickNoteReminderDate} ${quickNoteReminderTime}`
      : quickNoteReminderDate;
    setQuickNoteReminders([
      ...quickNoteReminders,
      { id: `qr-${Date.now()}`, label: "", at, fired: false },
    ]);
    setQuickNoteReminderDate("");
    setQuickNoteReminderTime("");
  }

  function addReminderFromDuration(mins) {
    const now = new Date(Date.now() + mins * 60_000);
    const at = now.toLocaleString();
    setQuickNoteReminders([
      ...quickNoteReminders,
      { id: `qr-${Date.now()}`, label: `In ${mins} min`, at, fired: false },
    ]);
  }

  function removeReminder(idx) {
    setQuickNoteReminders(quickNoteReminders.filter((_, i) => i !== idx));
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        onClick={ev => ev.stopPropagation()}
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--bdr)",
          borderRadius: 2,
          maxWidth: 560,
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          color: "var(--tx)",
        }}
      >
        <div style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--bdr)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: "var(--t-h3)", fontWeight: 800 }}>Quick Note</div>
            <div style={{ fontSize: "var(--t-micro)", color: "var(--gold)", marginTop: 2 }}>
              PRIVATE — visible only to you
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--tx4)", padding: 4, background: "transparent", border: "none", cursor: "pointer", display: "flex" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 18, overflow: "auto", flex: 1 }}>
          <textarea
            className="gold-input"
            autoFocus
            value={quickNoteText}
            onChange={e => setQuickNoteText(e.target.value)}
            placeholder="Capture a thought..."
            style={{
              width: "100%",
              minHeight: 110,
              padding: 14,
              background: "var(--inp)",
              border: "1px solid var(--bdr)",
              borderRadius: 2,
              outline: "none",
              resize: "vertical",
              fontSize: "var(--t-body-lg)",
              lineHeight: 1.65,
              color: "var(--tx)",
              fontFamily: "inherit",
            }}
          />

          <div style={{ marginTop: 14 }}>
            <div style={{
              fontSize: "var(--t-micro)",
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "var(--tx4)",
              marginBottom: 8,
            }}>
              COLOR
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {NOTE_COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setQuickNoteColor(c.id)}
                  title={c.label}
                  style={{
                    width: 32,
                    height: 32,
                    background: c.color,
                    border: "none",
                    outline: quickNoteColor === c.id ? "2px solid var(--tx)" : "none",
                    outlineOffset: 2,
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}>
              <div style={{
                fontSize: "var(--t-micro)",
                fontWeight: 700,
                letterSpacing: 1.5,
                color: "var(--tx4)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}>
                <Clock size={11} />REMINDERS
              </div>
              {quickNoteReminders.length > 0 && (
                <span style={{
                  fontSize: "var(--t-micro)",
                  color: "var(--gold)",
                  fontWeight: 700,
                }}>
                  {quickNoteReminders.length} set
                </span>
              )}
            </div>

            {quickNoteReminders.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                {quickNoteReminders.map((r, i) => (
                  <div
                    key={r.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      background: "var(--bg3)",
                      border: "1px solid var(--bdr)",
                      borderRadius: 2,
                      marginBottom: 4,
                    }}
                  >
                    <Clock size={12} color="var(--gold)" />
                    <span style={{ flex: 1, fontSize: "var(--t-caption)", color: "var(--tx2)" }}>
                      {r.at}
                    </span>
                    <button
                      onClick={() => removeReminder(i)}
                      style={{ color: "var(--tx5)", padding: 2, background: "transparent", border: "none", cursor: "pointer", display: "flex" }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <input
                className="gold-input"
                type="date"
                value={quickNoteReminderDate}
                onChange={e => setQuickNoteReminderDate(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  background: "var(--inp)",
                  border: "1px solid var(--bdr)",
                  borderRadius: 2,
                  outline: "none",
                  fontSize: "var(--t-caption)",
                  color: "var(--tx2)",
                  fontFamily: "inherit",
                }}
              />
              <input
                className="gold-input"
                type="time"
                value={quickNoteReminderTime}
                onChange={e => setQuickNoteReminderTime(e.target.value)}
                style={{
                  width: 120,
                  padding: "8px 10px",
                  background: "var(--inp)",
                  border: "1px solid var(--bdr)",
                  borderRadius: 2,
                  outline: "none",
                  fontSize: "var(--t-caption)",
                  color: "var(--tx2)",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={addReminderFromDateTime}
                style={{
                  padding: "8px 14px",
                  background: "transparent",
                  border: "1px solid var(--bdr2)",
                  borderRadius: 2,
                  color: "var(--tx2)",
                  fontSize: "var(--t-caption)",
                  fontWeight: 700,
                  letterSpacing: 1,
                  cursor: "pointer",
                }}
              >
                ADD
              </button>
            </div>

            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 10,
                color: "var(--tx5)",
                alignSelf: "center",
                marginRight: 4,
              }}>
                OR REMIND IN:
              </span>
              {[
                { mins: 15,  label: "15m" },
                { mins: 30,  label: "30m" },
                { mins: 60,  label: "1h"  },
                { mins: 120, label: "2h"  },
              ].map(d => (
                <button
                  key={d.mins}
                  onClick={() => addReminderFromDuration(d.mins)}
                  style={durationBtn}
                >
                  {d.label}
                </button>
              ))}
              <button style={durationBtn}>CUSTOM</button>
            </div>

            <div style={{
              fontSize: 10,
              color: "var(--tx5)",
              marginTop: 8,
              lineHeight: 1.5,
            }}>
              In-app banner + browser notification when each reminder fires.
            </div>
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
            No required fields. Classify later if you want.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 14px",
                border: "1px solid var(--bdr2)",
                background: "transparent",
                color: "var(--tx3)",
                borderRadius: 2,
                fontSize: "var(--t-caption)",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              CANCEL
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                background: "var(--gold)",
                color: "#000",
                border: "none",
                borderRadius: 2,
                fontSize: "var(--t-caption)",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              SAVE NOTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

const durationBtn = {
  padding: "5px 10px",
  background: "transparent",
  border: "1px solid var(--bdr2)",
  borderRadius: 2,
  color: "var(--tx3)",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1,
  cursor: "pointer",
};
