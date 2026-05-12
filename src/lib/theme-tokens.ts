/**
 * Design tokens ported from GPS-DESIGN-Themes-04-30-v2.
 * Core gold + role accent CSS vars live in `src/index.css`. This file
 * exposes the additive tokens needed by feature components: NOTE_COLORS,
 * GI_WINDOW, and helpers.
 */

export interface NoteColor {
  id: string;
  /** Dark-mode body text + border at 100% saturation */
  color: string;
  /** Light-mode body text — chosen for WCAG AA on a 12% color-tint background */
  colorDark: string;
  label: string;
}

export const NOTE_COLORS: NoteColor[] = [
  { id: "yellow", color: "#e2b53f", colorDark: "#7a5d12", label: "Yellow" },
  { id: "green",  color: "#5fcc00", colorDark: "#2a6900", label: "Green"  },
  { id: "blue",   color: "#3b82f6", colorDark: "#1e3f80", label: "Blue"   },
  { id: "red",    color: "#ef4444", colorDark: "#8a1f1f", label: "Red"    },
  { id: "purple", color: "#a855f7", colorDark: "#5b1d8a", label: "Purple" },
  { id: "gray",   color: "#777777", colorDark: "#3a3a3a", label: "Gray"   },
];

export interface RoleAccent {
  accent: string;
  bgTint: string;
  bgTintLight: string;
}

export const ROLE_ACCENTS: Record<string, RoleAccent> = {
  CLIENT:      { accent: "#e2b53f", bgTint: "#0a0a0a", bgTintLight: "#e8e7e2" },
  SOLOPRENEUR: { accent: "#e2b53f", bgTint: "#0c0a00", bgTintLight: "#f0ece2" },
  AGENCY:      { accent: "#7c3aed", bgTint: "#0d0814", bgTintLight: "#f0eeff" },
  HQ:          { accent: "#4882ff", bgTint: "#020d1a", bgTintLight: "#e8f0ff" },
  EMPLOYEE:    { accent: "#888888", bgTint: "#0a0a0a", bgTintLight: "#e8e7e2" },
};

export const CREATIVE_COLOR = "#e2b53f";

export const GI_WINDOW = {
  bubbleSize:        56,
  bubblePosBottom:   24,
  bubblePosRight:    24,
  bubbleZIndex:      150,
  bubbleGradient:    "linear-gradient(135deg, #c9a227 0%, #e2b53f 100%)",
  bubbleBorderColor: "rgba(226,181,63,0.5)",
  bubbleShadow:      "0 4px 14px rgba(0,0,0,0.4)",
  bubblePulseDuration: "2.5s",
  bubblePulseFrom:   "rgba(226,181,63,0.55)",
  bubblePulseTo:     "rgba(226,181,63,0)",
  bubblePulseSpread: 18,
  windowDefaultWidth:  420,
  windowDefaultHeight: 600,
  windowMinWidth:      380,
  windowMinHeight:     300,
  windowMaxWidth:      "90vw",
  windowMaxHeight:     "90vh",
  windowZIndex:        151,
  windowSnapThreshold: 16,
  feedPadding:         14,
  messageGap:          12,
  messageBubblePadding:"11px 14px",
  composerPadding:     "12px 14px",
  inputAutoGrowMax:    140,
  typingDuration:      "1.4s",
  typingDelayPause:    800,
} as const;

export const GI_SAVE_DESTINATIONS = [
  { id: "vault",    label: "VAULT",    icon: "lock",  description: "Institutional knowledge — visible per VAULT permissions" },
  { id: "timeline", label: "TIMELINE", icon: "clock", description: "Personal Timeline — private to user, exportable, portable" },
];

/** Convert hex (#rrggbb) to rgba string at given alpha. */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
