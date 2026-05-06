// ClientMessaging — S.U.M. v15 single-state orchestrator (spec §3 + §4).
// Owns ALL state for the 7 inner tabs + GI window. Each tab is a pure render
// component that receives state + setters as props.
//
// Tab IDs (locked, App.tsx route depends): chat | slideshow | journal |
// stories | polls | metrics | notes.

import { useEffect, useState } from "react";
import { SumShell } from "@/components/sum/SumShell";
import { Icon } from "@/components/sum/icons";
import { Channels } from "@/components/sum/tabs/Channels";
import { Slideshow } from "@/components/sum/tabs/Slideshow";
import { Journal } from "@/components/sum/tabs/Journal";
import { Stories, type StorySort } from "@/components/sum/tabs/Stories";
import { Polls } from "@/components/sum/tabs/Polls";
import { Notes, type NotesSortMode } from "@/components/sum/tabs/Notes";
import { Metrics, type MetricsRange } from "@/components/sum/tabs/Metrics";
import { RightPanel, type RightPanelMode } from "@/components/sum/RightPanel";
import { TABS, type SumTabId, type NoteColorId, SLIDESHOW } from "@/data/sum-data";
import { useGI } from "@/hooks/useGI";

export default function ClientMessaging() {
  const gi = useGI();

  // ── Tab navigation (1) ─────────────────────────────────────────────────
  const [tab, setTab] = useState<SumTabId>("chat");

  // ── Channels (2-4) ─────────────────────────────────────────────────────
  const [activeChannel, setActiveChannel] = useState("general");
  const [threadOpenId, setThreadOpenId] = useState<number | null>(null);

  // ── Slideshow (5) ──────────────────────────────────────────────────────
  const [slideIdx, setSlideIdx] = useState(0);

  // ── Personal Journal (6-11) ────────────────────────────────────────────
  const [journalSearch, setJournalSearch] = useState("");
  const [journalFilterType, setJournalFilterType] = useState<string | null>(null);
  const [journalFavoritesOnly, setJournalFavoritesOnly] = useState(false);
  const [journalDraftOpen, setJournalDraftOpen] = useState(false);
  const [journalFolderFilter, setJournalFolderFilter] = useState<string | null>(null);

  // ── Share-to-Story modal (12-13) ───────────────────────────────────────
  const [shareStep, setShareStep] = useState<null | 1 | 2>(null);
  const [shareEntryId, setShareEntryId] = useState<number | null>(null);

  // ── Story Engine (14-17) ───────────────────────────────────────────────
  const [storySort, setStorySort] = useState<StorySort>("best");
  const [storyOpenId, setStoryOpenId] = useState<number | null>(null);
  const [storyComposerOpen, setStoryComposerOpen] = useState(false);

  // ── Metrics (18-19) ────────────────────────────────────────────────────
  const [metricsRange, setMetricsRange] = useState<MetricsRange>("30");
  const [metricsYoY, setMetricsYoY] = useState(false);

  // ── NOTES (20-23) ──────────────────────────────────────────────────────
  const [notesSort, setNotesSort] = useState<NotesSortMode>("date-new");
  const [notesColorFilter, setNotesColorFilter] = useState<NoteColorId | null>(null);
  const [notesSearch, setNotesSearch] = useState("");
  const [notesFolderFilter, setNotesFolderFilter] = useState<string | null>(null);

  // ── Right-side panel (24-25) ───────────────────────────────────────────
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("gestalt");

  // ── Quick-note composer (26-27) ────────────────────────────────────────
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);

  // ── Slideshow auto-advance (5s) ────────────────────────────────────────
  useEffect(() => {
    if (tab !== "slideshow") return;
    const id = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % SLIDESHOW.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [tab]);

  // ── GI narration on tab change ─────────────────────────────────────────
  useEffect(() => {
    gi.narrateTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Right panel only renders on Journal + Notes per spec §6.
  const showRightPanel = tab === "journal" || tab === "notes";
  const rightPanelContext: "journal" | "notes" = tab === "journal" ? "journal" : "notes";
  const folderFilter = tab === "journal" ? journalFolderFilter : notesFolderFilter;
  const setFolderFilter = tab === "journal" ? setJournalFolderFilter : setNotesFolderFilter;

  return (
    <SumShell
      gi={gi}
      tabId={tab}
      rightPanel={showRightPanel ? (
        <RightPanel
          mode={rightPanelMode}
          onModeChange={setRightPanelMode}
          context={rightPanelContext}
          folderFilter={folderFilter}
          onFolderFilter={setFolderFilter}
        />
      ) : undefined}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div className="sum-tabbar">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? "active" : ""}>
              <Icon name={t.icon} size={11} />{t.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: "auto", display: "flex" }}>
          {tab === "chat" && (
            <Channels
              activeChannel={activeChannel}
              onActiveChannel={setActiveChannel}
              threadId={threadOpenId}
              onThreadId={setThreadOpenId}
            />
          )}
          {tab === "slideshow" && (
            <Slideshow slideIdx={slideIdx} onSlideIdx={setSlideIdx} />
          )}
          {tab === "journal" && (
            <Journal
              search={journalSearch}
              onSearch={setJournalSearch}
              filterType={journalFilterType}
              onFilterType={setJournalFilterType}
              favoritesOnly={journalFavoritesOnly}
              onFavoritesOnly={setJournalFavoritesOnly}
              folderFilter={journalFolderFilter}
              draftOpen={journalDraftOpen}
              onDraftOpen={setJournalDraftOpen}
              onShareEntry={(id) => { setShareEntryId(id); setShareStep(1); }}
            />
          )}
          {tab === "stories" && (
            <Stories
              sort={storySort}
              onSort={setStorySort}
              openId={storyOpenId}
              onOpenId={setStoryOpenId}
              composerOpen={storyComposerOpen}
              onComposerOpen={setStoryComposerOpen}
            />
          )}
          {tab === "polls" && <Polls />}
          {tab === "metrics" && (
            <Metrics range={metricsRange} onRange={setMetricsRange} yoy={metricsYoY} onYoy={setMetricsYoY} />
          )}
          {tab === "notes" && (
            <Notes
              sort={notesSort}
              onSort={setNotesSort}
              colorFilter={notesColorFilter}
              onColorFilter={setNotesColorFilter}
              search={notesSearch}
              onSearch={setNotesSearch}
              folderFilter={notesFolderFilter}
              onNewNote={() => setQuickNoteOpen(true)}
            />
          )}
        </div>
      </div>
      {shareStep !== null && shareEntryId !== null && (
        <ShareModal step={shareStep} onStep={setShareStep} onClose={() => { setShareStep(null); setShareEntryId(null); }} />
      )}
      {quickNoteOpen && <QuickNoteModal onClose={() => setQuickNoteOpen(false)} />}
    </SumShell>
  );
}

// ── Share-to-Story 2-step confirmation (spec §4.4) ─────────────────────────
function ShareModal({ step, onStep, onClose }: { step: 1 | 2; onStep: (s: 1 | 2) => void; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", maxWidth: 480, width: "100%", padding: 24 }}>
        {step === 1 ? (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Share to STORY ENGINE?</div>
            <div style={{ fontSize: 13, color: "var(--sum-tx3)", lineHeight: 1.65, marginBottom: 18 }}>
              This will be visible to everyone in the company. AI will scan for confidential terms (customer names, financials, internal IPs) before publishing.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={onClose} style={{ padding: "8px 14px", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 12, fontWeight: 700 }}>CANCEL</button>
              <button onClick={() => onStep(2)} style={{ padding: "8px 16px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 800 }}>CONTINUE</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Final confirm</div>
            <div style={{ fontSize: 13, color: "var(--sum-tx3)", lineHeight: 1.65, marginBottom: 18 }}>
              Share as anonymous, or attributed to you?
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={onClose} style={{ padding: "8px 14px", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 12, fontWeight: 700 }}>ANONYMOUS</button>
              <button onClick={onClose} style={{ padding: "8px 16px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 800 }}>SHARE WITH MY NAME</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Quick-note composer (spec §3.1 quickNote* state) ───────────────────────
function QuickNoteModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--sum-bg2)", border: "1px solid var(--sum-bdr)", maxWidth: 480, width: "100%", padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>Quick Note</div>
          <button onClick={onClose} style={{ color: "var(--sum-tx4)", padding: 4 }}><Icon name="x" size={16} /></button>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What's on your mind?" autoFocus className="sum-input-pulse"
          style={{ width: "100%", minHeight: 100, padding: "10px 12px", background: "var(--sum-inp)", border: "1px solid var(--sum-bdr)", fontSize: 14, lineHeight: 1.6, resize: "vertical", marginBottom: 14, color: "inherit" }} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "8px 14px", border: "1px solid var(--sum-bdr2)", color: "var(--sum-tx3)", fontSize: 12, fontWeight: 700 }}>CANCEL</button>
          <button onClick={onClose} style={{ padding: "8px 16px", background: "var(--sum-gold)", color: "#000", fontSize: 12, fontWeight: 800 }}>SAVE NOTE</button>
        </div>
      </div>
    </div>
  );
}
