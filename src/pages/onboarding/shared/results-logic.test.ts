import { describe, it, expect } from "vitest";
import {
  yesCount, brandHealth, HEALTH_BANDS, bandFor,
  avgResponseSeconds, quickAnswers, pillarBreakdown, blindspotIndices,
} from "./results-logic";
import { FRAMEWORK_QUESTIONS } from "./onboarding-data";
import type { Answer } from "./results-logic";

const A = (s: string): Answer[] => s.split("").map((c) => (c === "Y" ? "Y" : "N"));

describe("results-logic", () => {
  it("yesCount counts Y", () => {
    expect(yesCount(A("YNYY"))).toBe(3);
    expect(yesCount([])).toBe(0);
  });

  it("brandHealth = round(yes/total*100), 0 when empty", () => {
    expect(brandHealth(A("Y".repeat(16) + "N".repeat(5)))).toBe(76); // 16/21
    expect(brandHealth([])).toBe(0);
  });

  it("bandFor maps health to the 6 bands", () => {
    expect(HEALTH_BANDS).toHaveLength(6);
    expect(bandFor(76).label).toBe("EXIT POSSIBLE");
    expect(bandFor(10).label).toBe("LIQUIDATION");
    expect(bandFor(100).label).toBe("EXIT READY");
    expect(bandFor(0).label).toBe("LIQUIDATION");
  });

  it("avgResponseSeconds = mean ms / 1000 to 1 decimal", () => {
    expect(avgResponseSeconds([1000, 2000])).toBe(1.5);
    expect(avgResponseSeconds([])).toBe(0);
  });

  it("quickAnswers counts sub-threshold timings", () => {
    expect(quickAnswers([1000, 4000, 6000])).toEqual({ pct: 67, count: 2, total: 3 });
    expect(quickAnswers([])).toEqual({ pct: 0, count: 0, total: 0 });
  });

  it("pillarBreakdown groups YES by pillar", () => {
    // First 5 FRAMEWORK Qs = PERCEPTION. Answer first 4 Y, 5th N.
    const ans = A("YYYYN");
    const rows = pillarBreakdown(FRAMEWORK_QUESTIONS.slice(0, 5), ans);
    const perception = rows.find((r) => r.pillar === "PERCEPTION")!;
    expect(perception.yes).toBe(4);
    expect(perception.total).toBe(5);
    expect(perception.pct).toBe(80);
  });

  it("blindspotIndices returns NO positions", () => {
    expect(blindspotIndices(A("YNYN"))).toEqual([1, 3]);
  });
});
