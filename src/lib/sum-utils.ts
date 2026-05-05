// S.U.M. v15 utility helpers.
// Mirrors GPS-SUM-Step-02-Utils-v1.md. Pure functions — no React, no state.
// Importable from any tab component.

import { DESIRE_FIELDS, NOTE_COLORS, type JournalEntry, type NoteColorId, type StoryPost } from "@/data/sum-data";

// ── color helpers ─────────────────────────────────────────────────────────
/** Convert hex (#rrggbb or #rgb) to rgba string at given alpha. */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const expanded = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(expanded.substr(0, 2), 16);
  const g = parseInt(expanded.substr(2, 2), 16);
  const b = parseInt(expanded.substr(4, 2), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Look up the NoteColor for a given color id. Falls back to yellow. */
export function noteColorMeta(id: NoteColorId | string) {
  return NOTE_COLORS.find((c) => c.id === id) ?? NOTE_COLORS[0];
}

// ── escape / format ───────────────────────────────────────────────────────
/** Escape HTML for any text rendered via dangerouslySetInnerHTML. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Compact "Mar 3, 2026" formatter from Date — used by drafts + reminders. */
export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── DESIRE scoring ────────────────────────────────────────────────────────
/** Count filled D.E.S.I.R.E. pillars on a journal/story entry. 0..6. */
export function desireFilledCount(desire: Record<string, string> | null | undefined): number {
  if (!desire) return 0;
  return DESIRE_FIELDS.reduce((acc, k) => acc + (desire[k]?.trim() ? 1 : 0), 0);
}

/** Whether a STORY ENGINE post earns the LOVED badge. */
export function isLoved(post: Pick<StoryPost, "solve" | "votes" | "brandFlag">): boolean {
  if (post.brandFlag) return false;
  if (post.votes < 5) return false;
  return desireFilledCount(post.solve) === 6;
}

// ── journal helpers ───────────────────────────────────────────────────────
/** Filter + search journal entries. */
export function filterJournalEntries(
  entries: JournalEntry[],
  opts: { type?: string | null; favoritesOnly?: boolean; search?: string; folderId?: string | null },
): JournalEntry[] {
  let out = entries.slice();
  if (opts.favoritesOnly) out = out.filter((e) => e.favorite);
  if (opts.type) out = out.filter((e) => e.types.includes(opts.type as string));
  if (opts.folderId) out = out.filter((e) => e.folderId === opts.folderId);
  const q = opts.search?.toLowerCase().trim();
  if (q) {
    out = out.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.text.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return out;
}

// ── score formatters ──────────────────────────────────────────────────────
/** Always one decimal place. 64 → "64.0". */
export function formatScore1dp(n: number): string {
  return n.toFixed(1);
}

// ── SUM score (lightweight rollup) ────────────────────────────────────────
/** Weighted S.U.M. score from 10 component values (0–100 each). */
export function computeSumScore(c: {
  channelCoverage: number;
  slideshowEngagement: number;
  journalDepth: number;
  storyEngineActivity: number;
  pollResponseRate: number;
  metricTrend: number;
  notesDiscipline: number;
  desireCoverage: number;
  onboardingCompletion: number;
  rightPanelUsage: number;
}): number {
  return (
    c.channelCoverage * 0.15 +
    c.slideshowEngagement * 0.10 +
    c.journalDepth * 0.10 +
    c.storyEngineActivity * 0.15 +
    c.pollResponseRate * 0.10 +
    c.metricTrend * 0.10 +
    c.notesDiscipline * 0.05 +
    c.desireCoverage * 0.10 +
    c.onboardingCompletion * 0.05 +
    c.rightPanelUsage * 0.10
  );
}

// ── chart series helpers (used by METRICS sparklines) ─────────────────────
export function makeSeries(seed: number, length = 40, base = 30, range = 24): number[] {
  // Deterministic pseudo-random series — no Math.random for stable mock renders.
  const out: number[] = [];
  let prev = base;
  for (let i = 0; i < length; i++) {
    const noise = (((i + seed) * 9301 + 49297) % 233) / 233 - 0.5;
    const trend = (i / length) * (range * 0.6);
    prev = Math.max(8, Math.min(72, base + trend + Math.sin((i + seed) * 0.4) * 6 + noise * range * 0.4));
    out.push(prev);
  }
  return out;
}

/** Delta between last and first elements in a series, formatted with sign. */
export function calcDelta(series: number[]): { abs: number; sign: "+" | "-" | ""; pct: number } {
  if (series.length < 2) return { abs: 0, sign: "", pct: 0 };
  const first = series[0];
  const last = series[series.length - 1];
  const diff = last - first;
  return {
    abs: Math.round(diff * 10) / 10,
    sign: diff > 0 ? "+" : diff < 0 ? "-" : "",
    pct: first === 0 ? 0 : Math.round((diff / first) * 100),
  };
}
