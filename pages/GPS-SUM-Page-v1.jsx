// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-Page-v1.jsx
// S.U.M. Module — Top-Level Orchestrator
// Source: gestalt-sum-mockup-04-30-v15.html (state + render + event delegation)
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import {
  TABS,
  GI_SEED_MESSAGES,
  GI_NARRATIONS,
  SLIDESHOW,
} from "../constants/GPS-SUM-Data-v1";
import SumTabChannels from "../components/sum/GPS-SUM-Tab-Channels-v1";
import SumTabSlideshow from "../components/sum/GPS-SUM-Tab-Slideshow-v1";
import SumTabJournal from "../components/sum/GPS-SUM-Tab-Journal-v1";
import SumTabStories from "../components/sum/GPS-SUM-Tab-Stories-v1";
import SumTabPolls from "../components/sum/GPS-SUM-Tab-Polls-v1";
import SumTabMetrics from "../components/sum/GPS-SUM-Tab-Metrics-v1";
import SumTabNotes, { QuickNoteModal } from "../components/sum/GPS-SUM-Tab-Notes-v1";
import useGI from "../hooks/GPS-GI-Hook-v1";
import GISiteWide from "../components/gi/GPS-GI-Components-v1";

// ─── Inline tab stubs — replaced as later steps complete ─────────────────────
function StubTab({ label, stepNumber }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 32px",
      textAlign: "center",
    }}>
      <div style={{
        fontSize: "var(--t-micro)",
        fontWeight: 800,
        letterSpacing: 2,
        color: "var(--gold)",
        marginBottom: 12,
      }}>
        TAB STUB
      </div>
      <div style={{
        fontSize: "var(--t-h2)",
        fontWeight: 700,
        color: "var(--tx)",
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: "var(--t-body)",
        color: "var(--tx3)",
        maxWidth: 400,
      }}>
        This tab is populated in Step {stepNumber} of the build sequence.
      </div>
    </div>
  );
}









// ═══════════════════════════════════════════════════════════════════════════
// SumPage
// ═══════════════════════════════════════════════════════════════════════════
export default function SumPage() {
  const [theme, setTheme]         = useState("dark");
  const [textScale, setTextScale] = useState(1.0);

  const [tab, setTab] = useState("chat");

  const [activeChannel, setActiveChannel] = useState("general");
  const [chatInput, setChatInput]         = useState("");
  const [threadOpenId, setThreadOpenId]   = useState(null);
  const [msgRxOpen, setMsgRxOpen]         = useState(null);

  const [slideIdx, setSlideIdx] = useState(0);

  const [journalSearch, setJournalSearch]               = useState("");
  const [journalFilterType, setJournalFilterType]       = useState(null);
  const [journalFavoritesOnly, setJournalFavoritesOnly] = useState(false);
  const [journalEntryOpen, setJournalEntryOpen]         = useState(null);
  const [journalDraftOpen, setJournalDraftOpen]         = useState(false);
  const [journalDraft, setJournalDraft]                 = useState({
    types: [],
    title: "",
    text: "",
    tags: [],
    tagInput: "",
    desire: null,
  });
  const [journalFolderFilter, setJournalFolderFilter] = useState(null);

  const [rightPanel, setRightPanel]         = useState("gestalt");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const [quickNoteOpen, setQuickNoteOpen]                 = useState(false);
  const [quickNoteText, setQuickNoteText]                 = useState("");
  const [quickNoteColor, setQuickNoteColor]               = useState("yellow");
  const [quickNoteReminders, setQuickNoteReminders]       = useState([]);
  const [quickNoteReminderDate, setQuickNoteReminderDate] = useState("");
  const [quickNoteReminderTime, setQuickNoteReminderTime] = useState("");

  const [notesSort, setNotesSort]                 = useState("date-new");
  const [notesColorFilter, setNotesColorFilter]   = useState(null);
  const [notesFolderFilter, setNotesFolderFilter] = useState(null);
  const [draggedNoteId, setDraggedNoteId]         = useState(null);
  const [draggedEntryId, setDraggedEntryId]       = useState(null);
  const [dragOverFolderId, setDragOverFolderId]   = useState(null);

  const [interviewActive, setInterviewActive] = useState(null);
  const [interviewInput, setInterviewInput]   = useState("");
  const [interviewTurns, setInterviewTurns]   = useState([]);
  const [rewardOverlay, setRewardOverlay]     = useState(null);

  const [folderEditId, setFolderEditId]       = useState(null);
  const [folderEditValue, setFolderEditValue] = useState("");

  const [shareStep, setShareStep]       = useState(null);
  const [shareEntryId, setShareEntryId] = useState(null);

  const [storyOpenId, setStoryOpenId]             = useState(null);
  const [storyRiffInput, setStoryRiffInput]       = useState("");
  const [storyComposerOpen, setStoryComposerOpen] = useState(false);
  const [storySort, setStorySort]                 = useState("best");

  const [metricsRange, setMetricsRange] = useState("30");
  const [metricsYoY, setMetricsYoY]     = useState(false);

  // ─── GESTALT INTELLIGENCE site-wide hook ───────────────────────────────
  const gi = useGI({
    currentTab: tab,
    setSumTab: setTab,
    setNotesFolderFilter,
    setJournalEntryOpen,
  });

  // ─── Effects ───────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.style.setProperty("--t-scale", textScale);
  }, [textScale]);

  useEffect(() => {
    if (tab !== "slideshow") return;
    const id = setInterval(() => {
      setSlideIdx(prev => (prev + 1) % SLIDESHOW.length);
    }, 5000);
    return () => clearInterval(id);
  }, [tab]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const event = new CustomEvent("gi-narrate-tab", { detail: { tabId: tab } });
    window.dispatchEvent(event);
  }, [tab]);

  // ─── Tab routing ───────────────────────────────────────────────────────
  const tabProps = {
    theme, textScale,
    tab, setTab,
    activeChannel, setActiveChannel,
    chatInput, setChatInput,
    threadOpenId, setThreadOpenId,
    msgRxOpen, setMsgRxOpen,
    slideIdx, setSlideIdx,
    journalSearch, setJournalSearch,
    journalFilterType, setJournalFilterType,
    journalFavoritesOnly, setJournalFavoritesOnly,
    journalEntryOpen, setJournalEntryOpen,
    journalDraftOpen, setJournalDraftOpen,
    journalDraft, setJournalDraft,
    journalFolderFilter, setJournalFolderFilter,
    rightPanel, setRightPanel,
    rightPanelOpen, setRightPanelOpen,
    quickNoteOpen, setQuickNoteOpen,
    quickNoteText, setQuickNoteText,
    quickNoteColor, setQuickNoteColor,
    quickNoteReminders, setQuickNoteReminders,
    quickNoteReminderDate, setQuickNoteReminderDate,
    quickNoteReminderTime, setQuickNoteReminderTime,
    notesSort, setNotesSort,
    notesColorFilter, setNotesColorFilter,
    notesFolderFilter, setNotesFolderFilter,
    draggedNoteId, setDraggedNoteId,
    draggedEntryId, setDraggedEntryId,
    dragOverFolderId, setDragOverFolderId,
    interviewActive, setInterviewActive,
    interviewInput, setInterviewInput,
    interviewTurns, setInterviewTurns,
    rewardOverlay, setRewardOverlay,
    folderEditId, setFolderEditId,
    folderEditValue, setFolderEditValue,
    shareStep, setShareStep,
    shareEntryId, setShareEntryId,
    storyOpenId, setStoryOpenId,
    storyRiffInput, setStoryRiffInput,
    storyComposerOpen, setStoryComposerOpen,
    storySort, setStorySort,
    metricsRange, setMetricsRange,
    metricsYoY, setMetricsYoY,
  };

  function renderActiveTab() {
    switch (tab) {
      case "chat":      return <SumTabChannels  {...tabProps} />;
      case "slideshow": return <SumTabSlideshow {...tabProps} />;
      case "journal":   return <SumTabJournal   {...tabProps} />;
      case "stories":   return <SumTabStories   {...tabProps} />;
      case "polls":     return <SumTabPolls     {...tabProps} />;
      case "metrics":   return <SumTabMetrics   {...tabProps} />;
      case "notes":     return <SumTabNotes     {...tabProps} />;
      default:          return <SumTabChannels  {...tabProps} />;
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 0,
      background: "var(--bg)",
      color: "var(--tx)",
    }}>
      <div style={{
        padding: "20px 28px",
        borderBottom: "1px solid var(--bdr)",
      }}>
        <div style={{
          fontSize: "var(--t-micro)",
          fontWeight: 800,
          letterSpacing: 2,
          color: "var(--gold2)",
          marginBottom: 4,
        }}>
          S.U.M. (STRATEGIC UNIFIED MESSAGING)
        </div>
        <div style={{
          fontSize: "var(--t-h2)",
          fontWeight: 700,
          color: "var(--tx)",
        }}>
          MESSAGING — Team Communication
        </div>
      </div>

      {tab === "journal" && (
        <div style={{
          padding: "10px 28px",
          background: "rgba(226,181,63,0.06)",
          borderBottom: "1px solid rgba(226,181,63,0.2)",
          textAlign: "center",
          fontSize: "var(--t-micro)",
          fontWeight: 800,
          letterSpacing: 2,
          color: "var(--gold)",
        }}>
          PRIVATE — NEVER SHARED WITH MANAGEMENT
        </div>
      )}

      <div style={{
        display: "flex",
        borderBottom: "1px solid var(--bdr)",
        background: "var(--bg2)",
        overflowX: "auto",
        flexShrink: 0,
      }}>
        {TABS.map(t => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "14px 20px",
                background: "transparent",
                border: "none",
                borderRadius: 0,
                borderBottom: isActive
                  ? "2px solid var(--gold)"
                  : "2px solid transparent",
                color: isActive ? "var(--gold)" : "var(--tx3)",
                fontSize: "var(--t-caption)",
                fontWeight: isActive ? 800 : 600,
                letterSpacing: 1.5,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}>
        {renderActiveTab()}
      </div>

      {quickNoteOpen && (
        <QuickNoteModal
          quickNoteText={quickNoteText} setQuickNoteText={setQuickNoteText}
          quickNoteColor={quickNoteColor} setQuickNoteColor={setQuickNoteColor}
          quickNoteReminders={quickNoteReminders} setQuickNoteReminders={setQuickNoteReminders}
          quickNoteReminderDate={quickNoteReminderDate} setQuickNoteReminderDate={setQuickNoteReminderDate}
          quickNoteReminderTime={quickNoteReminderTime} setQuickNoteReminderTime={setQuickNoteReminderTime}
          onClose={() => setQuickNoteOpen(false)}
        />
      )}

      {interviewActive && (
        <div style={modalOverlayStyle} onClick={() => setInterviewActive(null)}>
          <div style={modalCardStyle} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>C.O.R.E. Interview Modal</div>
            <div style={{ color: "var(--tx3)", fontSize: "var(--t-caption)" }}>
              Populated in Step 11 (Right Panel).
            </div>
            <button
              onClick={() => setInterviewActive(null)}
              style={{ marginTop: 16, padding: "6px 14px", background: "var(--gold)", color: "#000", fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {rewardOverlay && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={{ color: "var(--gold)", fontWeight: 800, letterSpacing: 1.5, marginBottom: 8 }}>
              PARTICIPATION LOGGED
            </div>
            <div style={{ color: "var(--tx)" }}>{rewardOverlay.message}</div>
            <button
              onClick={() => setRewardOverlay(null)}
              style={{ marginTop: 16, padding: "6px 14px", background: "var(--gold)", color: "#000", fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      <GISiteWide gi={gi} />
    </div>
  );
}

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 200,
  padding: 20,
};

const modalCardStyle = {
  background: "var(--bg2)",
  border: "1px solid var(--bdr)",
  borderRadius: 2,
  padding: 24,
  maxWidth: 520,
  width: "100%",
  color: "var(--tx)",
};
