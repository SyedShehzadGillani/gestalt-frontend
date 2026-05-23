import type { Demographic } from "./onboarding-data";
import type { Answer } from "./results-logic";
import type { Lead } from "./LeadCapture";

export type Scene =
  | "demographic"
  | "lead"
  | "framework-intro"
  | "framework"
  | "framework-confidence"
  | "framework-results"
  | "paywall"
  | "focus-intro"
  | "focus"
  | "focus-confidence"
  | "focus-results"
  | "end";

export type OnboardingSession = {
  scene: Scene;
  demographic: Demographic | null;
  lead: Lead | null;
  fwAnswers: Answer[];
  fwTimings: number[];
  focusAnswers: Answer[];
  focusTimings: number[];
  fwConfidence: number | null;
  focusConfidence: number | null;
  credentials: { username: string } | null;
};

export const SESSION_KEY = "gestalt.onboarding.session";

export function emptySession(): OnboardingSession {
  return {
    scene: "demographic",
    demographic: null,
    lead: null,
    fwAnswers: [],
    fwTimings: [],
    focusAnswers: [],
    focusTimings: [],
    fwConfidence: null,
    focusConfidence: null,
    credentials: null,
  };
}

export function loadSession(): OnboardingSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingSession;
  } catch {
    return null;
  }
}

export function saveSession(s: OnboardingSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    /* ignore quota / disabled storage */
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
