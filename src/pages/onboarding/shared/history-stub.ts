// STUB-CONTENT: mock assessment history for the results chart.
// Backend slice replaces this with real per-company retake history.
export type HistoryPoint = { label: string; score: number };

// Past points are illustrative; the caller appends today's real score as the final point.
export const HISTORY_STUB: HistoryPoint[] = [
  { label: "Jan 2024", score: 7 },
  { label: "Apr 2024", score: 9 },
  { label: "Jul 2024", score: 12 },
  { label: "Oct 2024", score: 11 },
];

// Exit-ready threshold reference line (out of the module's max points).
export const EXIT_READY_RATIO = 14 / 21; // ~67% — matches mockup dashed line
