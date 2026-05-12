/**
 * EXIT SPECTRUM™ — colors, labels, tier definitions, utility functions.
 * Sacred — do not modify SPECTRUM_STOPS values.
 */

export interface SpectrumStop {
  pct: number;
  color: string;
}

export const SPECTRUM_STOPS: SpectrumStop[] = [
  { pct: 0,   color: "#4f0200" },
  { pct: 10,  color: "#6e231f" },
  { pct: 20,  color: "#873025" },
  { pct: 30,  color: "#a44f24" },
  { pct: 40,  color: "#ba702a" },
  { pct: 50,  color: "#c0933b" },
  { pct: 60,  color: "#e2e200" },
  { pct: 70,  color: "#cff200" },
  { pct: 80,  color: "#8ccc00" },
  { pct: 90,  color: "#5fcc00" },
  { pct: 100, color: "#5fcc00" },
];

export const SPECTRUM_COLORS = SPECTRUM_STOPS.map((s) => s.color);

export const SPECTRUM_LABELS = [
  { pct: 0,   label: "LIQUIDATION",         align: "left" },
  { pct: 20,  label: "EXIT UNLIKELY",       align: "center" },
  { pct: 40,  label: "DISRUPTION IMMINENT", align: "center" },
  { pct: 62,  label: "MARKET VULNERABLE",   align: "center" },
  { pct: 80,  label: "EXIT POSSIBLE",       align: "center" },
  { pct: 100, label: "EXIT READY",          align: "right" },
];

export interface TierDef {
  label: string;
  range: string;
  scoreAt: number;
  def: string;
  action: string;
}

export const TIER_DEFS: TierDef[] = [
  {
    label: "LIQUIDATION", range: "0–16", scoreAt: 8,
    def: "Your business is not positioned for a healthy exit. Critical gaps exist across multiple value categories — financial, operational, and human capital. The business is dependent on the founder for daily operations and cannot sustain its current trajectory without immediate structural intervention.",
    action: "Immediate remediation required across all 16 systems. GESTALT INTELLIGENCE (Guided Exit Strategy Through Analytical Learning & Trusted AI) will prioritize the highest-impact interventions for your specific situation.",
  },
  {
    label: "EXIT UNLIKELY", range: "17–33", scoreAt: 25,
    def: "Significant structural issues exist that prevent a viable exit. While some value drivers are functioning, multiple high-priority gaps are suppressing your multiple below the threshold that sophisticated buyers will accept. A 12–24 month remediation runway is required.",
    action: "GESTALT FORMULA (Interaction Strategy) identifies the 5 highest-ROI (Return on Investment) improvements. Begin with financial documentation and leadership distribution.",
  },
  {
    label: "DISRUPTION IMMINENT", range: "34–49", scoreAt: 42,
    def: "Your business is vulnerable to competitive displacement. Core value drivers are underperforming relative to market standards. Complacency has taken root — your team has stopped questioning, your processes haven't been reviewed, and your market position is eroding without visible warning signs.",
    action: "Address CULTURE and STRATEGY gaps first. These compound into every other category. 6–12 month timeline to reach EXIT POSSIBLE.",
  },
  {
    label: "MARKET VULNERABLE", range: "50–65", scoreAt: 57,
    def: "Your business has foundational strength but meaningful gaps remain before exit viability. You are running at partial capacity — performing well enough to sustain operations but not positioned to command a premium multiple. Buyers will identify these gaps in due diligence and discount accordingly.",
    action: "You are at the inflection point. The next 10 points of improvement produce disproportionate multiple gains.",
  },
  {
    label: "EXIT POSSIBLE", range: "66–82", scoreAt: 74,
    def: "Your business is exit-viable. Operational systems, financial documentation, and brand strength are sufficient to attract qualified buyers. Multiple in the 5–7× EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) range is achievable. Final optimization moves you into the premium tier.",
    action: "Tighten the highest-scoring quadrant further. Each additional point above 75 compounds. Engage your M&A (Mergers and Acquisitions) advisor to begin pre-marketing.",
  },
  {
    label: "EXIT READY", range: "83–100", scoreAt: 91,
    def: "You are positioned to command premium acquisition multiples in the 8–10× EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) range. Your operational systems, financial documentation, leadership distribution, and brand strength collectively signal to buyers that they are acquiring a machine — not a founder dependency.",
    action: "Maintain your score. Engage your M&A (Mergers and Acquisitions) advisor with your GESTALT CERTIFIED™ badge. The data package GESTALT has built is your due diligence package.",
  },
];

export function specGradient(): string {
  return SPECTRUM_STOPS.map((s) => `${s.color} ${s.pct}%`).join(", ");
}

export function specLabelAt(score: number): string {
  if (score <= 16) return "LIQUIDATION";
  if (score <= 33) return "EXIT UNLIKELY";
  if (score <= 49) return "DISRUPTION IMMINENT";
  if (score <= 65) return "MARKET VULNERABLE";
  if (score <= 82) return "EXIT POSSIBLE";
  return "EXIT READY";
}

export function specColorDark(color: string): string {
  const m = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!m) return color;
  const darken = (v: number) => Math.round(v * 0.55);
  return `rgb(${darken(+m[1])},${darken(+m[2])},${darken(+m[3])})`;
}

/**
 * Returns an RGB color string for a score (0–100).
 * In light mode, darkens the color for contrast.
 */
export function specColorAt(score: number, isDark: boolean = true): string {
  let color = "#5fcc00";
  for (let i = 0; i < SPECTRUM_STOPS.length - 1; i++) {
    const a = SPECTRUM_STOPS[i];
    const b = SPECTRUM_STOPS[i + 1];
    if (score >= a.pct && score <= b.pct) {
      const t = (score - a.pct) / (b.pct - a.pct);
      const lerp = (x: number, y: number) => Math.round(x + (y - x) * t);
      const hr = parseInt(a.color.slice(1, 3), 16);
      const hg = parseInt(a.color.slice(3, 5), 16);
      const hb = parseInt(a.color.slice(5, 7), 16);
      const tr = parseInt(b.color.slice(1, 3), 16);
      const tg = parseInt(b.color.slice(3, 5), 16);
      const tb = parseInt(b.color.slice(5, 7), 16);
      color = `rgb(${lerp(hr, tr)},${lerp(hg, tg)},${lerp(hb, tb)})`;
      break;
    }
  }
  if (!isDark) return specColorDark(color);
  return color;
}
