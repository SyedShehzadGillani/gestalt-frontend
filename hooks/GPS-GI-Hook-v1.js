// ═══════════════════════════════════════════════════════════════════════════
// GPS-GI-Hook-v1.js
// GESTALT INTELLIGENCE — site-wide custom hook
// Source: gestalt-sum-mockup-04-30-v15.html (giNarrateTab + giRender* + event handlers)
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════
//
// Custom React hook that owns all state for the site-wide GI window.
// Call once at the App level (or inside a Context provider). The returned
// object exposes state + handlers for the GIBubble and GIWindow components
// (Step 13).
//
// LOCKED RULES:
//   - First/second tab visit: full narration. Third+: compressed.
//   - ⌘K (Mac) / Ctrl+K (Windows) toggles window from anywhere.
//   - 800ms typing delay before AI responses render.
//   - Frank-mode: AI asks permission, response is remembered.
//   - Save destinations: VAULT (institutional) or TIMELINE (private).
//   - Internal link targets: tab IDs navigate; "note:N" / "journal:N" /
//     "folder:N" prefixes; everything else gets a mock acknowledgment.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import {
  GI_SEED_MESSAGES,
  GI_NARRATIONS,
  GI_DEMO_RESPONSES,
  GI_FRANK_PROMPT,
} from "../constants/GPS-SUM-Data-v1";


// Window dimension defaults
const WINDOW_DEFAULT_W = 420;
const WINDOW_DEFAULT_H = 600;
const WINDOW_MIN_W     = 380;
const WINDOW_MIN_H     = 300;
const TYPING_DELAY_MS  = 800;
const FRANK_DELAY_MS   = 1200;

// Internal navigation targets (tab IDs)
const TAB_TARGETS = ["chat", "slideshow", "journal", "stories", "polls", "metrics", "notes"];


/**
 * useGI — site-wide GESTALT INTELLIGENCE hook.
 *
 * @param {object} args
 * @param {string} args.currentTab            — the S.U.M. tab the user is on (for context indicator)
 * @param {function} args.setSumTab           — setter to navigate S.U.M. tabs from internal links
 * @param {function} [args.setNotesFolderFilter] — optional, for "folder:..." link targets
 * @param {function} [args.setJournalEntryOpen]  — optional, for "journal:N" link targets
 * @returns {object} { state, handlers, refs }
 */
export default function useGI({
  currentTab = "chat",
  setSumTab = () => {},
  setNotesFolderFilter = null,
  setJournalEntryOpen  = null,
} = {}) {

  // ── State ──────────────────────────────────────────────────────────────
  const [giOpen, setGiOpen]                       = useState(false);
  const [giHasProactive, setGiHasProactive]       = useState(true);
  const [giMessages, setGiMessages]               = useState(GI_SEED_MESSAGES.slice());
  const [giInput, setGiInput]                     = useState("");
  const [giTyping, setGiTyping]                   = useState(false);
  const [giSavePickerFor, setGiSavePickerFor]     = useState(null);
  const [giWindowX, setGiWindowX]                 = useState(null);
  const [giWindowY, setGiWindowY]                 = useState(null);
  const [giWindowW, setGiWindowW]                 = useState(WINDOW_DEFAULT_W);
  const [giWindowH, setGiWindowH]                 = useState(WINDOW_DEFAULT_H);
  const [giNarrationsShown, setGiNarrationsShown] = useState({});

  // Refs for feed scrolling + drag state
  const feedRef        = useRef(null);
  const dragStateRef   = useRef(null);  // {dx, dy} during drag
  const resizeStateRef = useRef(null);  // {startW, startH, startX, startY} during resize

  // Derived
  const hasUserMessages = giMessages.some(m => m.role === "user");


  // ── Helpers ────────────────────────────────────────────────────────────

  const appendMessage = useCallback((msg) => {
    setGiMessages(prev => [...prev, { ...msg, id: msg.id || `gi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }]);
  }, []);


  // ── Tab narration ──────────────────────────────────────────────────────

  const giNarrate = useCallback((tabId) => {
    const narration = GI_NARRATIONS[tabId];
    if (!narration) return;

    setGiNarrationsShown(prev => {
      const seen = prev[tabId] || 0;
      const text = seen >= 2 ? narration.short : narration.full;
      // Append narration message
      appendMessage({
        type: "narration",
        role: "ai",
        text,
        timestamp: "Just now",
        tabContext: tabId,
      });
      // Re-pulse the bubble — there's something new to say
      setGiHasProactive(true);
      return { ...prev, [tabId]: seen + 1 };
    });
  }, [appendMessage]);

  // Listen for tab-change events from SumPage (Step 3 dispatches these)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e) => {
      const tabId = e?.detail?.tabId;
      if (tabId) giNarrate(tabId);
    };
    window.addEventListener("gi-narrate-tab", handler);
    return () => window.removeEventListener("gi-narrate-tab", handler);
  }, [giNarrate]);


  // ── Window open / close ────────────────────────────────────────────────

  const giToggle = useCallback(() => {
    setGiOpen(prev => {
      const next = !prev;
      if (next) {
        // Opening: clear proactive indicator and focus input
        setGiHasProactive(false);
        setTimeout(() => {
          const el = document.getElementById("gi-input");
          if (el) el.focus();
        }, 50);
      }
      return next;
    });
  }, []);

  const giClose = useCallback(() => {
    setGiOpen(false);
  }, []);

  const giClear = useCallback(() => {
    setGiMessages(GI_SEED_MESSAGES.slice());
    setGiSavePickerFor(null);
  }, []);


  // ── ⌘K / Ctrl+K shortcut ───────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        giToggle();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [giToggle]);


  // ── Auto-scroll feed to bottom on new messages ─────────────────────────

  useEffect(() => {
    if (!giOpen || !feedRef.current) return;
    feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [giMessages, giTyping, giOpen]);


  // ── Send message + AI response ─────────────────────────────────────────

  const giSendSuggestion = useCallback((text) => {
    appendMessage({
      type: "response",
      role: "user",
      text,
      timestamp: "Just now",
    });

    const demo = GI_DEMO_RESPONSES[text];

    // AI typing indicator
    setGiTyping(true);
    setTimeout(() => {
      setGiTyping(false);
      if (demo) {
        appendMessage({
          type: "response",
          role: "ai",
          text: demo.text,
          links: demo.links || null,
          timestamp: "Just now",
        });
        // If frank-mode demo, also append the frank prompt
        if (demo.frankMode) {
          setTimeout(() => {
            appendMessage({
              type: "frank-prompt",
              role: "ai",
              text: GI_FRANK_PROMPT,
              timestamp: "Just now",
            });
          }, 600);
        }
      } else {
        // Generic acknowledgment for non-mocked input
        appendMessage({
          type: "response",
          role: "ai",
          text: "I hear you. In production I'd give you a real answer here — for the mockup, I'm responding to the four hardcoded suggestion prompts. Try one of those to see a full conversation flow.",
          timestamp: "Just now",
        });
      }
    }, TYPING_DELAY_MS);
  }, [appendMessage]);

  const giSend = useCallback(() => {
    const text = giInput.trim();
    if (!text) return;
    setGiInput("");
    giSendSuggestion(text);
  }, [giInput, giSendSuggestion]);


  // ── Save flow (VAULT / TIMELINE) ───────────────────────────────────────

  const giSaveToggle = useCallback((msgId) => {
    setGiSavePickerFor(prev => (prev === msgId ? null : msgId));
  }, []);

  const giSave = useCallback((msgId, destination) => {
    setGiMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, savedTo: destination } : m
    ));
    setGiSavePickerFor(null);
  }, []);


  // ── Frank-mode handlers ────────────────────────────────────────────────

  const giFrankYes = useCallback(() => {
    appendMessage({
      type: "response",
      role: "user",
      text: "Yes — be frank.",
      timestamp: "Just now",
    });
    setGiTyping(true);
    setTimeout(() => {
      setGiTyping(false);
      appendMessage({
        type: "response",
        role: "ai",
        text: "Here it is straight: you've been working on FORMULA because it's tangible — copy you can write, brand voice you can refine. FOCUS is harder because it requires you to look at how customers actually perceive you, which is uncomfortable. The PERCEPTION pillar is at 14/20 because you've avoided three customer interviews this quarter that would have moved it. Want me to schedule one?",
        timestamp: "Just now",
      });
    }, FRANK_DELAY_MS);
  }, [appendMessage]);

  const giFrankNo = useCallback(() => {
    appendMessage({
      type: "response",
      role: "user",
      text: "Not right now.",
      timestamp: "Just now",
    });
    setTimeout(() => {
      appendMessage({
        type: "response",
        role: "ai",
        text: "Got it. I'll keep things diplomatic. Just say the word when you want me to be more direct.",
        timestamp: "Just now",
      });
    }, 400);
  }, [appendMessage]);


  // ── Internal link click (navigate or acknowledge) ──────────────────────

  const giHandleLink = useCallback((target) => {
    if (!target) return;

    if (target.startsWith("note:")) {
      // For mockup: jump to NOTES tab. Highlighting specific note is v16+.
      setSumTab("notes");
      return;
    }
    if (target.startsWith("journal:")) {
      const id = parseInt(target.split(":")[1], 10);
      setSumTab("journal");
      if (setJournalEntryOpen && !isNaN(id)) setJournalEntryOpen(id);
      return;
    }
    if (target.startsWith("folder:")) {
      const id = target.split(":")[1];
      setSumTab("notes");
      if (setNotesFolderFilter) setNotesFolderFilter(id);
      return;
    }
    if (TAB_TARGETS.includes(target)) {
      setSumTab(target);
      return;
    }

    // Mock external links (FRAMEWORK Q9, FOCUS, B.A.S.E., etc.)
    appendMessage({
      type: "response",
      role: "ai",
      text: `In production this would jump you to **${target.toUpperCase()}**. That section isn't built in this S.U.M. mockup yet — it lives elsewhere on the platform.`,
      timestamp: "Just now",
    });
  }, [setSumTab, setJournalEntryOpen, setNotesFolderFilter, appendMessage]);


  // ── Window drag (from header) ──────────────────────────────────────────

  const giDragStart = useCallback((e) => {
    // Get current window position (resolve from anchored to absolute if needed)
    const rect = e.currentTarget.closest(".gi-window")?.getBoundingClientRect();
    if (!rect) return;
    if (giWindowX === null) {
      setGiWindowX(rect.left);
      setGiWindowY(rect.top);
    }
    dragStateRef.current = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
    };

    const onMove = (ev) => {
      if (!dragStateRef.current) return;
      const newX = ev.clientX - dragStateRef.current.dx;
      const newY = ev.clientY - dragStateRef.current.dy;
      // Snap to edges within 16px proximity
      const snap = 16;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = giWindowW;
      const h = giWindowH;
      let snappedX = newX;
      let snappedY = newY;
      if (Math.abs(newX) < snap) snappedX = 0;
      if (Math.abs(vw - newX - w) < snap) snappedX = vw - w;
      if (Math.abs(newY) < snap) snappedY = 0;
      if (Math.abs(vh - newY - h) < snap) snappedY = vh - h;
      setGiWindowX(snappedX);
      setGiWindowY(snappedY);
    };
    const onUp = () => {
      dragStateRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    e.preventDefault();
  }, [giWindowX, giWindowW, giWindowH]);


  // ── Window resize (from corner handle) ─────────────────────────────────

  const giResizeStart = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    resizeStateRef.current = {
      startW: giWindowW,
      startH: giWindowH,
      startX: e.clientX,
      startY: e.clientY,
    };
    const onMove = (ev) => {
      if (!resizeStateRef.current) return;
      const r = resizeStateRef.current;
      const newW = Math.max(WINDOW_MIN_W, Math.min(window.innerWidth * 0.9,  r.startW + (ev.clientX - r.startX)));
      const newH = Math.max(WINDOW_MIN_H, Math.min(window.innerHeight * 0.9, r.startH + (ev.clientY - r.startY)));
      setGiWindowW(newW);
      setGiWindowH(newH);
    };
    const onUp = () => {
      resizeStateRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [giWindowW, giWindowH]);


  // ── Return shape ───────────────────────────────────────────────────────

  return {
    state: {
      giOpen,
      giHasProactive,
      giMessages,
      giInput,
      giTyping,
      giSavePickerFor,
      giWindowX,
      giWindowY,
      giWindowW,
      giWindowH,
      giNarrationsShown,
      currentTab,
      hasUserMessages,
    },
    handlers: {
      giToggle,
      giClose,
      giClear,
      giSetInput: setGiInput,
      giSend,
      giSendSuggestion,
      giSaveToggle,
      giSave,
      giFrankYes,
      giFrankNo,
      giHandleLink,
      giDragStart,
      giResizeStart,
    },
    refs: {
      feedRef,
    },
  };
}
