import type { OnboardingQuestion, Pillar } from "./onboarding-data";

export type Answer = "Y" | "N";

export function yesCount(answers: Answer[]): number {
  return answers.filter((a) => a === "Y").length;
}

export function brandHealth(answers: Answer[]): number {
  if (answers.length === 0) return 0;
  return Math.round((yesCount(answers) / answers.length) * 100);
}

export type Band = { label: string; min: number; max: number };

export const HEALTH_BANDS: Band[] = [
  { label: "LIQUIDATION", min: 0, max: 20 },
  { label: "EXIT UNLIKELY", min: 21, max: 40 },
  { label: "DISRUPTION IMMINENT", min: 41, max: 60 },
  { label: "MARKET VULNERABLE", min: 61, max: 75 },
  { label: "EXIT POSSIBLE", min: 76, max: 90 },
  { label: "EXIT READY", min: 91, max: 100 },
];

export function bandFor(health: number): Band {
  return HEALTH_BANDS.find((b) => health >= b.min && health <= b.max) ?? HEALTH_BANDS[0];
}

export function avgResponseSeconds(timings: number[]): number {
  if (timings.length === 0) return 0;
  const meanMs = timings.reduce((a, b) => a + b, 0) / timings.length;
  return Math.round(meanMs / 100) / 10; // ms → s, 1 decimal
}

export function quickAnswers(timings: number[], thresholdMs = 5000): { pct: number; count: number; total: number } {
  const total = timings.length;
  const count = timings.filter((t) => t < thresholdMs).length;
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return { pct, count, total };
}

export type PillarStat = { pillar: Pillar; yes: number; total: number; pct: number };

export function pillarBreakdown(questions: OnboardingQuestion[], answers: Answer[]): PillarStat[] {
  const acc = new Map<Pillar, { yes: number; total: number }>();
  questions.forEach((q, i) => {
    const row = acc.get(q.pillar) ?? { yes: 0, total: 0 };
    row.total += 1;
    if (answers[i] === "Y") row.yes += 1;
    acc.set(q.pillar, row);
  });
  return [...acc.entries()].map(([pillar, { yes, total }]) => ({
    pillar,
    yes,
    total,
    pct: total === 0 ? 0 : Math.round((yes / total) * 100),
  }));
}

export function blindspotIndices(answers: Answer[]): number[] {
  return answers.flatMap((a, i) => (a === "N" ? [i] : []));
}
