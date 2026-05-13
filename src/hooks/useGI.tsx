// useGI — site-wide GESTALT INTELLIGENCE state hook + context provider.
// State lives in <GIProvider> mounted at the App level so the bubble + window
// persist across every route, and every page can read/dispatch into the same
// conversation via useGI().

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GI_DEMO_RESPONSES,
  GI_NARRATIONS,
  GI_SEED_MESSAGES,
  type GiMessage,
} from "@/data/sum-data";

export type SaveDestination = "vault" | "timeline";

export interface UseGIReturn {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;

  hasProactive: boolean;
  clearProactive: () => void;

  messages: GiMessage[];
  input: string;
  setInput: (v: string) => void;
  typing: boolean;
  send: (raw?: string) => void;
  clear: () => void;

  narrateTab: (tabId: string) => void;

  savePickerFor: string | null;
  setSavePickerFor: (id: string | null) => void;
  saveMessage: (msgId: string, dest: SaveDestination) => void;
}

function useGIState(): UseGIReturn {
  const [open, setOpen] = useState(false);
  const [hasProactive, setHasProactive] = useState(true);
  const [messages, setMessages] = useState<GiMessage[]>(() => GI_SEED_MESSAGES.slice());
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [savePickerFor, setSavePickerFor] = useState<string | null>(null);
  const [narrationsShown, setNarrationsShown] = useState<Record<string, number>>({});

  const toggle = useCallback(() => {
    setOpen((cur) => {
      const next = !cur;
      if (next) setHasProactive(false);
      return next;
    });
  }, []);

  const clearProactive = useCallback(() => setHasProactive(false), []);

  const clear = useCallback(() => {
    setMessages(GI_SEED_MESSAGES.slice());
    setSavePickerFor(null);
  }, []);

  const send = useCallback(
    (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text) return;
      const userMsg: GiMessage = {
        id: `gi-u-${Date.now()}`,
        type: "user",
        role: "user",
        text,
        timestamp: "Just now",
      };
      setMessages((cur) => [...cur, userMsg]);
      setInput("");
      setTyping(true);
      window.setTimeout(() => {
        const demo = GI_DEMO_RESPONSES[text];
        const reply: GiMessage = demo
          ? {
              id: `gi-r-${Date.now()}`,
              type: "response",
              role: "ai",
              text: demo.text,
              links: demo.links,
              frankMode: demo.frankMode,
              timestamp: "Just now",
            }
          : {
              id: `gi-r-${Date.now()}`,
              type: "response",
              role: "ai",
              text: "Got it. I'll surface a deeper read on that next time you're in a relevant tab — one signal isn't enough yet to be sure I'm right.",
              timestamp: "Just now",
            };
        setMessages((cur) => [...cur, reply]);
        setTyping(false);
      }, 800);
    },
    [input],
  );

  const narrateTab = useCallback((tabId: string) => {
    const narration = GI_NARRATIONS[tabId];
    if (!narration) return;
    setNarrationsShown((cur) => {
      const seen = cur[tabId] ?? 0;
      const next = { ...cur, [tabId]: seen + 1 };
      const text = seen >= 2 ? narration.short : narration.full;
      const msg: GiMessage = {
        id: `gi-n-${tabId}-${Date.now()}`,
        type: "narration",
        role: "ai",
        text,
        timestamp: "Just now",
      };
      setMessages((curMsgs) => [...curMsgs, msg]);
      setHasProactive(true);
      return next;
    });
  }, []);

  const saveMessage = useCallback((msgId: string, dest: SaveDestination) => {
    setMessages((cur) => cur.map((m) => (m.id === msgId ? { ...m, savedTo: dest } : m)));
    setSavePickerFor(null);
  }, []);

  // ⌘K / Ctrl+K — toggle window from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);

  return useMemo<UseGIReturn>(
    () => ({
      open,
      setOpen,
      toggle,
      hasProactive,
      clearProactive,
      messages,
      input,
      setInput,
      typing,
      send,
      clear,
      narrateTab,
      savePickerFor,
      setSavePickerFor,
      saveMessage,
    }),
    [open, toggle, hasProactive, clearProactive, messages, input, typing, send, clear, narrateTab, savePickerFor, saveMessage],
  );
}

const GIContext = createContext<UseGIReturn | null>(null);

export function GIProvider({ children }: { children: ReactNode }) {
  const value = useGIState();
  return <GIContext.Provider value={value}>{children}</GIContext.Provider>;
}

export function useGI(): UseGIReturn {
  const ctx = useContext(GIContext);
  if (!ctx) {
    throw new Error("useGI must be used within <GIProvider>");
  }
  return ctx;
}
