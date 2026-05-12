/**
 * Format a score to exactly one decimal place.
 * e.g. 64 → "64.0", 72.35 → "72.4"
 */
export function formatScore(value: number): string {
  return value.toFixed(1);
}
