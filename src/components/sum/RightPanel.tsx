// RightPanel — 3-mode panel for PERSONAL JOURNAL + NOTES tabs (v15 spec §6).
// Modes: FOLDERS · AI SEARCH · GESTALT (interview queue + weekly status + reminders).
// Data sourced from sum-data; pure render (state lifted to ClientMessaging).

import { Icon } from "@/components/sum/icons";
import {
  CONTRIBUTIONS_LOG,
  FOLDERS,
  INTERVIEW_QUESTIONS,
  JOURNAL_ENTRIES,
  NOTES,
  PENDING_REMINDERS,
  WEEKLY_STATUS,
  folderCount,
} from "@/data/sum-data";

export type RightPanelMode = "folders" | "search" | "gestalt";

interface Props {
  mode: RightPanelMode;
  onModeChange: (m: RightPanelMode) => void;
  /** "journal" or "notes" — controls which folder filter applies. */
  context: "journal" | "notes";
  folderFilter: string | null;
  onFolderFilter: (id: string | null) => void;
}

const MODE_TABS: { id: RightPanelMode; label: string; icon: string }[] = [
  { id: "folders", label: "FOLDERS", icon: "folder" },
  { id: "search", label: "AI SEARCH", icon: "search" },
  { id: "gestalt", label: "GESTALT", icon: "sparkles" },
];

export function RightPanel({ mode, onModeChange, folderFilter, onFolderFilter }: Props) {
  return (
    <aside className="sum-right-panel">
      <div style={{ display: "flex", borderBottom: "1px solid var(--sum-bdr)", background: "var(--sum-bg2)" }}>
        {MODE_TABS.map((t) => {
          const sel = mode === t.id;
          return (
            <button
              key={t.id}
              className="smooth"
              onClick={() => onModeChange(t.id)}
              style={{
                flex: 1,
                padding: "12px 6px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: sel ? "var(--sum-gold)" : "var(--sum-tx4)",
                borderBottom: sel ? "2px solid var(--sum-gold)" : "2px solid transparent",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                whiteSpace: "nowrap",
              }}
            >
              <Icon name={t.icon} size={11} />
              {t.label}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {mode === "folders" && <FoldersPanel folderFilter={folderFilter} onFolderFilter={onFolderFilter} />}
        {mode === "search" && <SearchPanel />}
        {mode === "gestalt" && <GestaltPanel />}
      </div>
    </aside>
  );
}

function FoldersPanel({ folderFilter, onFolderFilter }: { folderFilter: string | null; onFolderFilter: (id: string | null) => void }) {
  const total = JOURNAL_ENTRIES.length + NOTES.length;
  return (
    <div style={{ padding: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 6 }}>YOUR FOLDERS</div>
      <div style={{ fontSize: 10, color: "var(--sum-tx5)", marginBottom: 8, lineHeight: 1.5 }}>Drag any entry or note here to file it.</div>
      <div style={{ display: "flex", flexDirection: "column", border: "1px solid var(--sum-bdr)", background: "var(--sum-bg2)", marginBottom: 14 }}>
        <FolderRow icon="folder" label="All" count={total} active={folderFilter === null} onClick={() => onFolderFilter(null)} />
        {FOLDERS.map((f) => (
          <FolderRow
            key={f.id}
            icon="folder"
            label={f.name}
            count={folderCount(f.id)}
            aiSuggested={f.aiSuggested}
            active={folderFilter === f.id}
            onClick={() => onFolderFilter(f.id)}
          />
        ))}
      </div>
      <button className="smooth" style={{ width: "100%", padding: 10, background: "transparent", border: "1px dashed var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <Icon name="plus" size={12} /><span>NEW FOLDER</span>
      </button>
      <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(226,181,63,0.06)", border: "1px solid rgba(226,181,63,0.2)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-gold)", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="sparkles" size={11} />AI SUGGESTION
        </div>
        <div style={{ fontSize: 12, color: "var(--sum-tx2)", lineHeight: 1.55 }}>
          Three of your recent notes mention pricing decisions. Want me to create a "Pricing Decisions" folder and move them?
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
          <button className="smooth" style={{ padding: "5px 10px", background: "var(--sum-gold)", color: "#000", fontSize: 10, fontWeight: 800 }}>YES, CREATE</button>
          <button className="smooth" style={{ padding: "5px 10px", background: "transparent", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 10, fontWeight: 700 }}>DISMISS</button>
        </div>
      </div>
    </div>
  );
}

function FolderRow({ icon, label, count, active = false, aiSuggested = false, onClick }: { icon: string; label: string; count: number; active?: boolean; aiSuggested?: boolean; onClick?: () => void }) {
  return (
    <div
      className="smooth"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderBottom: "1px solid var(--sum-bdr)",
        borderLeft: active ? "3px solid var(--sum-gold)" : "3px solid transparent",
        cursor: "pointer",
        background: active ? "rgba(226,181,63,0.06)" : "transparent",
      }}
    >
      <Icon name={icon} size={13} color={active ? "var(--sum-gold)" : "var(--sum-tx4)"} />
      <span style={{ flex: 1, fontSize: 14, color: active ? "var(--sum-tx)" : "var(--sum-tx2)", fontWeight: active ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ fontSize: 11, color: "var(--sum-tx5)" }}>{count}</span>
      {aiSuggested && <span title="AI suggested" style={{ color: "var(--sum-gold)", display: "inline-flex" }}><Icon name="sparkles" size={10} /></span>}
    </div>
  );
}

function SearchPanel() {
  return (
    <div style={{ padding: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 8 }}>AI SEMANTIC SEARCH</div>
      <div style={{ display: "flex", alignItems: "center", background: "var(--sum-inp)", border: "1px solid var(--sum-bdr)", padding: "0 10px", marginBottom: 14 }}>
        <Icon name="search" size={14} color="var(--sum-tx4)" />
        <input className="sum-input-pulse" placeholder='Try "that thing about pricing" or "Q2 ideas"...' style={{ flex: 1, padding: "10px 8px", background: "transparent", border: "none", fontSize: 12 }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 8 }}>RECENT SEMANTIC RESULTS</div>
      {[
        { title: "Pricing page confusion", meta: 'Mar 2 · matched on "pricing" + "FRAMEWORK Q9" + "fix this before Q2"', match: "94% match" },
        { title: "Q2 planning offsite — venue ideas", meta: 'Feb 28 · matched on "Q2" + "planning"', match: "71% match" },
      ].map((r) => (
        <div key={r.title} style={{ padding: 12, background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--sum-tx)" }}>{r.title}</div>
          <div style={{ fontSize: 11, color: "var(--sum-tx4)", marginTop: 3 }}>{r.meta}</div>
          <div style={{ fontSize: 11, color: "var(--sum-gold)", marginTop: 6, fontWeight: 700 }}>{r.match}</div>
        </div>
      ))}
      <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-blue)", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="sparkles" size={11} />C.O.R.E. CROSS-REFERENCE
        </div>
        <div style={{ fontSize: 12, color: "var(--sum-tx2)", lineHeight: 1.55 }}>
          Search results above are from your private journal. Want to also search C.O.R.E. (organizational knowledge)?
        </div>
        <button className="smooth" style={{ marginTop: 8, padding: "5px 10px", background: "var(--sum-blue)", color: "#fff", fontSize: 10, fontWeight: 800 }}>SEARCH C.O.R.E.</button>
      </div>
    </div>
  );
}

function GestaltPanel() {
  const ws = WEEKLY_STATUS;
  const statusMeta =
    ws.status === "green" ? { color: "var(--sum-green)", label: "ON TRACK", note: "Above weekly target" }
      : ws.status === "yellow" ? { color: "var(--sum-gold)", label: "PARTIAL", note: "Below weekly target — keep going" }
      : { color: "var(--sum-red)", label: "BELOW TARGET", note: "Less than half of weekly target met" };

  return (
    <div style={{ padding: 14 }}>
      {/* Weekly status — PARTICIPATION LOGGED, never score */}
      <div style={{ padding: 14, background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", borderLeft: `3px solid ${statusMeta.color}`, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: statusMeta.color }}>WEEKLY STATUS — {statusMeta.label}</div>
            <div style={{ fontSize: 12, color: "var(--sum-tx4)", marginTop: 2 }}>{statusMeta.note}</div>
          </div>
          <div style={{ width: 14, height: 14, background: statusMeta.color, flexShrink: 0, marginTop: 4 }} />
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
          <Stat label="CONTRIBUTIONS" value={`${ws.count}`} sub={`/${ws.target}`} />
          <Stat label="QUALITY AVG" value={`${ws.qualityAvg}`} sub="/100" valueColor="var(--sum-gold)" />
        </div>
        <div style={{ fontSize: 11, color: "var(--sum-tx5)", marginTop: 10, lineHeight: 1.5 }}>
          Evidence captured by GESTALT INTELLIGENCE.{" "}
          <strong style={{ color: "var(--sum-tx3)" }}>H.I.V.E. score is reviewed by HR quarterly.</strong>
        </div>
      </div>

      {/* Pending reminders */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
        <Icon name="clock" size={11} />PENDING REMINDERS ({PENDING_REMINDERS.length})
      </div>
      {PENDING_REMINDERS.map((r) => (
        <div key={r.id} className="smooth" style={{ padding: "10px 12px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", borderLeft: "3px solid var(--sum-gold)", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--sum-gold)", letterSpacing: 1 }}>
            <Icon name="clock" size={11} />{r.at}
          </div>
          <div style={{ fontSize: 12, color: "var(--sum-tx2)", marginTop: 4, lineHeight: 1.45 }}>{r.label}</div>
          <div style={{ fontSize: 10, color: "var(--sum-tx5)", marginTop: 3 }}>{r.source}</div>
        </div>
      ))}

      {/* C.O.R.E. interview queue */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginTop: 18, marginBottom: 6 }}>
        QUESTIONS FOR YOU ({INTERVIEW_QUESTIONS.length})
      </div>
      <div style={{ fontSize: 11, color: "var(--sum-tx5)", marginBottom: 10, lineHeight: 1.5 }}>
        30 minutes per week is the expected effort. Quality matters more than time.
      </div>
      {INTERVIEW_QUESTIONS.map((q) => (
        <div key={q.id} className="smooth" style={{ padding: "12px 14px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", marginBottom: 8, cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: "var(--sum-gold)" }}>{q.topic}</span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "var(--sum-tx5)", textTransform: "uppercase" }}>{q.driver === "job-description" ? "ROLE" : "GAP"}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--sum-tx2)", lineHeight: 1.55, marginTop: 6 }}>
            {q.question.length > 120 ? q.question.slice(0, 120) + "..." : q.question}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: 10, color: "var(--sum-tx4)" }}>
            <span>{q.priority}</span>
            <span style={{ color: "var(--sum-gold)", fontWeight: 700 }}>ANSWER →</span>
          </div>
        </div>
      ))}

      {/* Contributions log */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-tx4)", marginTop: 18, marginBottom: 8 }}>
        CONTRIBUTIONS LOGGED ({CONTRIBUTIONS_LOG.length})
      </div>
      {CONTRIBUTIONS_LOG.map((c) => (
        <div key={c.id} style={{ padding: "10px 12px", background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "var(--sum-tx4)", letterSpacing: 1, fontWeight: 700 }}>
            <span>{c.type.toUpperCase().replace("-", " ")}</span>
            <span>{c.date}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--sum-tx2)", marginTop: 4, lineHeight: 1.45 }}>{c.summary}</div>
        </div>
      ))}
    </div>
  );
}

function Stat({ label, value, sub, valueColor = "var(--sum-tx)" }: { label: string; value: string; sub: string; valueColor?: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--sum-tx4)", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: valueColor, marginTop: 2 }}>
        {value}
        <span style={{ fontSize: 14, color: "var(--sum-tx4)", fontWeight: 500 }}>{sub}</span>
      </div>
    </div>
  );
}
