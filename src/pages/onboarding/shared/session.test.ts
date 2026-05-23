import { describe, it, expect, beforeEach } from "vitest";
import { loadSession, saveSession, clearSession, emptySession, SESSION_KEY } from "./session";

beforeEach(() => localStorage.clear());

describe("session", () => {
  it("loadSession returns null when nothing stored", () => {
    expect(loadSession()).toBeNull();
  });

  it("saveSession then loadSession round-trips", () => {
    const s = { ...emptySession(), scene: "focus" as const, fwAnswers: ["Y", "N"] as ("Y" | "N")[] };
    saveSession(s);
    expect(loadSession()).toEqual(s);
  });

  it("clearSession removes the key", () => {
    saveSession(emptySession());
    clearSession();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("loadSession returns null on corrupt JSON", () => {
    localStorage.setItem(SESSION_KEY, "{not json");
    expect(loadSession()).toBeNull();
  });

  it("emptySession starts at demographic with empty arrays", () => {
    const s = emptySession();
    expect(s.scene).toBe("demographic");
    expect(s.fwAnswers).toEqual([]);
    expect(s.focusTimings).toEqual([]);
  });
});
