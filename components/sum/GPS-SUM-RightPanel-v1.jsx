// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-RightPanel-v1.jsx
// S.U.M. Module — Right-side panel
// Source: gestalt-sum-mockup-04-30-v15.html (renderRightPanel + renderFoldersPanel
//         + renderSearchPanel + renderGestaltPanel)
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════
//
// 340px right-side panel mounted on PERSONAL JOURNAL and NOTES tabs.
// Three modes (inner tabs):
//   - FOLDERS: folder list with drop targets, AI-suggested folder
//   - AI SEARCH: semantic search input + mocked results
//   - GESTALT: weekly status, reminders, C.O.R.E. interview queue, contributions
//
// LOCKED RULES:
//   - Inner tab strip is 0px corners (tab-bar pattern)
//   - Folder rows are 0px corners (list-item pattern)
//   - Weekly Status indicator is a SQUARE (not circle) per memory #28
//   - "H.I.V.E. score is reviewed by HR quarterly" — locked phrasing.
//     Never "+X H.I.V.E." or "credits your H.I.V.E."
//   - Drop targets visually highlight via dragOverFolderId state
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  Folder, Search, Sparkles, Grid, Plus, Clock,
} from "lucide-react";
import {
  FOLDERS,
  JOURNAL_ENTRIES,
  NOTES,
  WEEKLY_STATUS,
  INTERVIEW_QUESTIONS,
  CONTRIBUTIONS_LOG,
} from "../../constants/GPS-SUM-Data-v1";
import { folderCount } from "../../utils/GPS-SUM-Utils-v1";

// ═══════════════════════════════════════════════════════════════════════════
// RIGHT PANEL — wrapper with 3-tab strip
// ═══════════════════════════════════════════════════════════════════════════
export default function RightPanel(props) {
  const { rightPanel, setRightPanel, rightPanelOpen } = props;
  if (!rightPanelOpen) return null;

  const tabs = [
    { id: "folders", label: "FOLDERS",   Icon: Folder    },
    { id: "search",  label: "AI SEARCH", Icon: Search    },
    { id: "gestalt", label: "GESTALT",   Icon: Sparkles  },
  ];

  return (
    <div style={{
      width: 340,
      borderLeft: "1px solid var(--bdr)",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg)",
      flexShrink: 0,
    }}>
      {/* Inner tab strip — 0px corners */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid var(--bdr)",
        background: "var(--bg2)",
      }}>
        {tabs.map(t => {
          const active = rightPanel === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setRightPanel(t.id)}
              style={{
                flex: 1,
                padding: "10px 8px",
                background: active ? "rgba(226,181,63,0.10)" : "transparent",
                color: active ? "var(--gold)" : "var(--tx3)",
                border: "none",
                borderBottom: active ? "2px solid var(--gold)" : "2px solid transparent",
                fontSize: 10,
                fontWeight: active ? 800 : 700,
                letterSpacing: 1,
                cursor: "pointer",
                borderRadius: 0,
              }}
            >
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                justifyContent: "center",
              }}>
                <t.Icon size={11} />{t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active mode body */}
      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        {rightPanel === "folders" && <FoldersPanel {...props} />}
        {rightPanel === "search"  && <SearchPanel  {...props} />}
        {rightPanel === "gestalt" && <GestaltPanel {...props} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FOLDERS PANEL — folder list with drop targets
// ═══════════════════════════════════════════════════════════════════════════
function FoldersPanel(props) {
  const {
    tab,
    journalFolderFilter, setJournalFolderFilter,
    notesFolderFilter, setNotesFolderFilter,
    dragOverFolderId, setDragOverFolderId,
    draggedNoteId, setDraggedNoteId,
    draggedEntryId, setDraggedEntryId,
  } = props;

  const totalAll = JOURNAL_ENTRIES.length + NOTES.length;
  const isOnNotesTab = tab === "notes";
  const activeFilter = isOnNotesTab ? notesFolderFilter : journalFolderFilter;

  function handleClickFolder(folderId) {
    if (isOnNotesTab) setNotesFolderFilter(folderId);
    else              setJournalFolderFilter(folderId);
  }
  function handleClickAll() {
    if (isOnNotesTab) setNotesFolderFilter(null);
    else              setJournalFolderFilter(null);
  }

  function handleDragOver(e, folderId) {
    e.preventDefault(); // critical: enables drop
    setDragOverFolderId(folderId);
  }
  function handleDragLeave() {
    setDragOverFolderId(null);
  }
  function handleDrop(e, folderId) {
    e.preventDefault();
    setDragOverFolderId(null);
    // Mockup: actual filing is stubbed (would mutate NOTES[].folderId or
    // JOURNAL_ENTRIES[].folderId in real implementation).
    // For now, just clear the drag state.
    if (draggedNoteId !== null) setDraggedNoteId(null);
    if (draggedEntryId !== null) setDraggedEntryId(null);
    // Optionally: filter to the folder so the user sees their drop landed.
    if (folderId !== null) handleClickFolder(folderId);
  }

  return (
    <div style={{ padding: 14 }}>
      <div style={{
        fontSize: "var(--t-micro)",
        fontWeight: 700,
        letterSpacing: 1.5,
        color: "var(--tx4)",
        marginBottom: 6,
      }}>
        YOUR FOLDERS
      </div>
      <div style={{
        fontSize: 10,
        color: "var(--tx5)",
        marginBottom: 8,
        lineHeight: 1.5,
      }}>
        Drag any entry or note here to file it.
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--bdr)",
        background: "var(--bg2)",
        marginBottom: 14,
      }}>
        {/* All row (clears filter) */}
        <FolderRow
          isAll={true}
          active={!activeFilter}
          dragOver={dragOverFolderId === "ALL_DROP_CLEAR"}
          count={totalAll}
          onClick={handleClickAll}
          onDragOver={e => handleDragOver(e, null)}
          onDragLeave={handleDragLeave}
          onDrop={e => handleDrop(e, null)}
        />
        {FOLDERS.map(f => (
          <FolderRow
            key={f.id}
            folder={f}
            active={activeFilter === f.id}
            dragOver={dragOverFolderId === f.id}
            count={folderCount(f.id)}
            onClick={() => handleClickFolder(f.id)}
            onDragOver={e => handleDragOver(e, f.id)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, f.id)}
          />
        ))}
      </div>

      <button style={{
        width: "100%",
        padding: 10,
        background: "transparent",
        border: "1px dashed var(--bdr2)",
        borderRadius: 2,
        color: "var(--tx3)",
        fontSize: "var(--t-caption)",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "pointer",
      }}>
        <Plus size={12} /><span>NEW FOLDER</span>
      </button>

      {/* AI SUGGESTION */}
      <div style={{
        marginTop: 14,
        padding: "12px 14px",
        background: "rgba(226,181,63,0.06)",
        border: "1px solid rgba(226,181,63,0.2)",
        borderRadius: 2,
      }}>
        <div style={{
          fontSize: "var(--t-micro)",
          fontWeight: 700,
          letterSpacing: 1.5,
          color: "var(--gold)",
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          <Sparkles size={11} />AI SUGGESTION
        </div>
        <div style={{
          fontSize: "var(--t-caption)",
          color: "var(--tx2)",
          lineHeight: 1.55,
        }}>
          Three of your recent notes mention pricing decisions. Want me to create
          a "Pricing Decisions" folder and move them?
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
          <button style={{
            padding: "5px 10px",
            background: "var(--gold)",
            color: "#000",
            border: "none",
            borderRadius: 2,
            fontSize: 10,
            fontWeight: 800,
            cursor: "pointer",
          }}>
            YES, CREATE
          </button>
          <button style={{
            padding: "5px 10px",
            background: "transparent",
            border: "1px solid var(--bdr2)",
            borderRadius: 2,
            color: "var(--tx3)",
            fontSize: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}>
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Folder row ─────────────────────────────────────────────────────────────
function FolderRow({ folder, isAll, active, dragOver, count, onClick, onDragOver, onDragLeave, onDrop }) {
  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        background: dragOver
          ? "rgba(226,181,63,0.15)"
          : (active ? "rgba(226,181,63,0.06)" : "transparent"),
        borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
        borderBottom: "1px solid var(--bdr)",
        transition: "background .15s",
      }}
    >
      {isAll ? (
        <Grid size={13} color={active ? "var(--gold)" : "var(--tx4)"} />
      ) : (
        <Folder size={13} color={active ? "var(--gold)" : "var(--tx4)"} />
      )}
      <span style={{
        flex: 1,
        fontSize: "var(--t-body)",
        color: active ? "var(--tx)" : "var(--tx2)",
        fontWeight: active ? 700 : 500,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {isAll ? "All" : folder.name}
      </span>
      <span style={{ fontSize: "var(--t-micro)", color: "var(--tx5)" }}>
        {count}
      </span>
      {!isAll && folder.aiSuggested && (
        <span title="AI suggested" style={{ color: "var(--gold)", display: "inline-flex" }}>
          <Sparkles size={10} />
        </span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH PANEL
// ═══════════════════════════════════════════════════════════════════════════
function SearchPanel() {
  return (
    <div style={{ padding: 14 }}>
      <div style={{
        fontSize: "var(--t-micro)",
        fontWeight: 700,
        letterSpacing: 1.5,
        color: "var(--tx4)",
        marginBottom: 8,
      }}>
        AI SEMANTIC SEARCH
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        background: "var(--inp)",
        border: "1px solid var(--bdr)",
        borderRadius: 2,
        padding: "0 10px",
        marginBottom: 14,
      }}>
        <Search size={14} color="var(--tx4)" />
        <input
          className="gold-input"
          placeholder='Try "that thing about pricing" or "Q2 ideas"...'
          style={{
            flex: 1,
            padding: "10px 8px",
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "var(--t-caption)",
            color: "var(--tx)",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div style={{
        fontSize: "var(--t-micro)",
        fontWeight: 700,
        letterSpacing: 1.5,
        color: "var(--tx4)",
        marginBottom: 8,
      }}>
        RECENT SEMANTIC RESULTS
      </div>

      <SearchResultCard
        title="Pricing page confusion"
        meta={`Mar 2 · matched on "pricing" + "FRAMEWORK Q9" + "fix this before Q2"`}
        match={94}
      />
      <SearchResultCard
        title="Q2 planning offsite — venue ideas"
        meta={`Feb 28 · matched on "Q2" + "planning"`}
        match={71}
      />

      <div style={{
        marginTop: 14,
        padding: "12px 14px",
        background: "rgba(59,130,246,0.06)",
        border: "1px solid rgba(59,130,246,0.2)",
        borderRadius: 2,
      }}>
        <div style={{
          fontSize: "var(--t-micro)",
          fontWeight: 700,
          letterSpacing: 1.5,
          color: "var(--blue)",
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          <Sparkles size={11} />C.O.R.E. CROSS-REFERENCE
        </div>
        <div style={{
          fontSize: "var(--t-caption)",
          color: "var(--tx2)",
          lineHeight: 1.55,
        }}>
          Search results above are from your private journal. Want to also search
          C.O.R.E. (organizational knowledge)? Other employees may have answered
          similar questions.
        </div>
        <button style={{
          marginTop: 8,
          padding: "5px 10px",
          background: "var(--blue)",
          color: "#fff",
          border: "none",
          borderRadius: 2,
          fontSize: 10,
          fontWeight: 800,
          cursor: "pointer",
        }}>
          SEARCH C.O.R.E.
        </button>
      </div>
    </div>
  );
}

function SearchResultCard({ title, meta, match }) {
  return (
    <div style={{
      padding: 12,
      background: "var(--bg2)",
      border: "1px solid var(--bdr)",
      borderRadius: 2,
      marginBottom: 8,
    }}>
      <div style={{
        fontSize: "var(--t-caption)",
        fontWeight: 700,
        color: "var(--tx)",
      }}>
        {title}
      </div>
      <div style={{
        fontSize: "var(--t-micro)",
        color: "var(--tx4)",
        marginTop: 3,
      }}>
        {meta}
      </div>
      <div style={{
        fontSize: 11,
        color: "var(--gold)",
        marginTop: 6,
        fontWeight: 700,
      }}>
        {match}% match
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GESTALT PANEL — weekly status + reminders + interview queue + contributions
// ═══════════════════════════════════════════════════════════════════════════
const STATUS_META = {
  green:  { color: "var(--green)", label: "ON TRACK", note: "Above weekly target" },
  yellow: { color: "var(--gold)",  label: "PARTIAL",  note: "Below weekly target" },
  red:    { color: "var(--red)",   label: "AT RISK",  note: "Significantly below target" },
};

function GestaltPanel(props) {
  const { setInterviewActive } = props;
  const ws = WEEKLY_STATUS;
  const statusMeta = STATUS_META[ws.status] || STATUS_META.green;

  // Pending reminders aggregated from journal + notes
  const allReminders = [];
  JOURNAL_ENTRIES.forEach(e => {
    (e.reminders || []).forEach(r => {
      if (!r.fired) allReminders.push({ ...r, source: "entry", sourceTitle: e.title });
    });
  });
  NOTES.forEach(n => {
    (n.reminders || []).forEach(r => {
      if (!r.fired) allReminders.push({ ...r, source: "note", sourceTitle: n.title });
    });
  });

  // Sort interview questions by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedQs = INTERVIEW_QUESTIONS
    .slice()
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div style={{ padding: 14 }}>
      {/* ─── WEEKLY STATUS ──────────────────────────────────────── */}
      <div style={{
        padding: 14,
        background: "var(--bg2)",
        border: "1px solid var(--bdr)",
        borderLeft: `3px solid ${statusMeta.color}`,
        borderRadius: 2,
        marginBottom: 18,
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}>
          <div>
            <div style={{
              fontSize: "var(--t-micro)",
              fontWeight: 700,
              letterSpacing: 1.5,
              color: statusMeta.color,
            }}>
              WEEKLY STATUS — {statusMeta.label}
            </div>
            <div style={{ fontSize: "var(--t-caption)", color: "var(--tx4)", marginTop: 2 }}>
              {statusMeta.note}
            </div>
          </div>
          {/* SQUARE indicator (NOT circle) — locked rule, memory #28 */}
          <div style={{
            width: 12,
            height: 12,
            background: statusMeta.color,
            flexShrink: 0,
            marginTop: 4,
          }} />
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--tx4)",
              letterSpacing: 1,
            }}>
              CONTRIBUTIONS
            </div>
            <div style={{
              fontSize: "var(--t-h2)",
              fontWeight: 900,
              color: "var(--tx)",
              marginTop: 2,
            }}>
              {ws.count}
              <span style={{ fontSize: "var(--t-body)", color: "var(--tx4)", fontWeight: 500 }}>
                /{ws.target}
              </span>
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--tx4)",
              letterSpacing: 1,
            }}>
              QUALITY AVG
            </div>
            <div style={{
              fontSize: "var(--t-h2)",
              fontWeight: 900,
              color: "var(--gold)",
              marginTop: 2,
            }}>
              {ws.qualityAvg}
              <span style={{ fontSize: "var(--t-body)", color: "var(--tx4)", fontWeight: 500 }}>
                /100
              </span>
            </div>
          </div>
        </div>

        <div style={{
          fontSize: "var(--t-micro)",
          color: "var(--tx5)",
          marginTop: 10,
          lineHeight: 1.5,
        }}>
          Evidence captured by GESTALT INTELLIGENCE.{" "}
          <strong style={{ color: "var(--tx3)" }}>
            H.I.V.E. score is reviewed by HR quarterly.
          </strong>
        </div>
      </div>

      {/* ─── PENDING REMINDERS ──────────────────────────────────── */}
      {allReminders.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontSize: "var(--t-micro)",
            fontWeight: 700,
            letterSpacing: 1.5,
            color: "var(--tx4)",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}>
            <Clock size={11} />PENDING REMINDERS ({allReminders.length})
          </div>
          {allReminders.map((r, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                background: "var(--bg2)",
                border: "1px solid var(--bdr)",
                borderLeft: "3px solid var(--gold)",
                borderRadius: 2,
                marginBottom: 6,
                cursor: "pointer",
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                color: "var(--gold)",
                letterSpacing: 1,
              }}>
                <Clock size={11} />{r.at}
              </div>
              <div style={{
                fontSize: "var(--t-caption)",
                color: "var(--tx2)",
                marginTop: 4,
                lineHeight: 1.45,
              }}>
                {r.label || r.sourceTitle}
              </div>
              <div style={{ fontSize: 10, color: "var(--tx5)", marginTop: 3 }}>
                {r.source === "note" ? "note" : "entry"}: {r.sourceTitle}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── PENDING QUESTIONS ──────────────────────────────────── */}
      <div style={{
        fontSize: "var(--t-micro)",
        fontWeight: 700,
        letterSpacing: 1.5,
        color: "var(--tx4)",
        marginBottom: 8,
      }}>
        QUESTIONS FOR YOU ({sortedQs.length})
      </div>
      <div style={{
        fontSize: "var(--t-micro)",
        color: "var(--tx5)",
        marginBottom: 10,
        lineHeight: 1.5,
      }}>
        30 minutes per week is the expected effort. Quality matters more than time.
      </div>

      {sortedQs.map(q => (
        <div
          key={q.id}
          onClick={() => setInterviewActive(q.id)}
          style={{
            padding: "12px 14px",
            background: "var(--bg2)",
            border: "1px solid var(--bdr)",
            borderRadius: 2,
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}>
            <span style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.5,
              color: "var(--gold)",
            }}>
              {q.topic}
            </span>
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1,
              color: "var(--tx5)",
              textTransform: "uppercase",
            }}>
              {q.source.replace("-driven", "")}
            </span>
          </div>
          <div style={{
            fontSize: "var(--t-caption)",
            color: "var(--tx2)",
            lineHeight: 1.55,
            marginTop: 6,
          }}>
            {q.question.length > 120 ? `${q.question.slice(0, 120)}...` : q.question}
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
            fontSize: 10,
            color: "var(--tx4)",
          }}>
            <span>{q.estTime}</span>
            <span style={{ color: "var(--gold)", fontWeight: 700 }}>ANSWER →</span>
          </div>
        </div>
      ))}

      {/* ─── YOUR CONTRIBUTIONS ─────────────────────────────────── */}
      <div style={{
        fontSize: "var(--t-micro)",
        fontWeight: 700,
        letterSpacing: 1.5,
        color: "var(--tx4)",
        marginTop: 18,
        marginBottom: 8,
      }}>
        YOUR CONTRIBUTIONS
      </div>
      {CONTRIBUTIONS_LOG.slice(0, 4).map(c => (
        <div
          key={c.id}
          style={{
            padding: "10px 12px",
            background: "var(--bg2)",
            border: "1px solid var(--bdr)",
            borderRadius: 2,
            marginBottom: 6,
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: c.type === "answer" ? "var(--gold)" : "var(--blue)",
              letterSpacing: 1,
            }}>
              {c.type === "answer" ? "ANSWER" : "HELPING"}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--gold)" }}>
              {c.quality}/100
            </span>
          </div>
          <div style={{ fontSize: "var(--t-caption)", color: "var(--tx2)", marginTop: 4 }}>
            {c.topic}
          </div>
          <div style={{
            fontSize: 10,
            color: "var(--tx4)",
            lineHeight: 1.5,
            marginTop: 4,
          }}>
            {c.note}
          </div>
          {c.reused && (
            <div style={{
              fontSize: 10,
              color: "var(--green)",
              fontWeight: 700,
              marginTop: 4,
            }}>
              ↗ Reused {c.reused}× — score adjusted upward
            </div>
          )}
        </div>
      ))}

      {/* ─── Footer note ────────────────────────────────────────── */}
      <div style={{
        marginTop: 14,
        padding: "12px 14px",
        background: "rgba(226,181,63,0.06)",
        border: "1px solid rgba(226,181,63,0.2)",
        borderRadius: 2,
      }}>
        <div style={{
          fontSize: "var(--t-micro)",
          color: "var(--tx2)",
          lineHeight: 1.55,
        }}>
          Your answers feed C.O.R.E. and populate segments of the{" "}
          <strong style={{ color: "var(--gold)" }}>360° Intelligence Map</strong>.
          Executives see the knowledge bank fill across the wheel as the org's
          collective intelligence grows.
        </div>
      </div>
    </div>
  );
}
