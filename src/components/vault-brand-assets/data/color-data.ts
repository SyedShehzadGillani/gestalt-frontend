export type GradientDef = { name: string; gradient: string; usage: string };

export const PRIMARY_COLORS = [
  { name: "PRIMARY GOLD", hex: "#e2b53f", pms: "PMS 7405 C" },
  { name: "DEEP GOLD", hex: "#a07d15", pms: "PMS 7406 C" },
  { name: "GOLD DIM", hex: "#c18d30", pms: "PMS 7407 C" },
];

export const SECONDARY_COLORS = [
  { name: "BLACK", hex: "#0a0a0a", pms: "PMS Black C" },
  { name: "WHITE", hex: "#ffffff" },
  { name: "WARM GRAY", hex: "#c0c0c0", pms: "Cool Gray 5 C" },
  { name: "MID GRAY", hex: "#909090" },
  { name: "DARK GRAY", hex: "#404040" },
  { name: "CHARCOAL", hex: "#1e1e1e" },
  { name: "LIGHT GOLD", hex: "#f5e6b8" },
  { name: "CREAM", hex: "#f0efea" },
];

export const GRADIENTS: GradientDef[] = [
  { name: "BRAND WARMTH", gradient: "linear-gradient(135deg,#c18d30,#e2b53f)", usage: "Hero, CTAs" },
  { name: "SUBTLE DEPTH", gradient: "linear-gradient(135deg,#0a0a0a,#1e1e1e)", usage: "Backgrounds" },
  { name: "GOLDEN HOUR", gradient: "linear-gradient(135deg,#a07d15,#e2b53f,#c18d30)", usage: "Feature callouts" },
  { name: "TRI-BLEND", gradient: "linear-gradient(135deg,#0a0a0a,#1e1e1e,#c18d30)", usage: "Data viz" },
];

export const FONT_WEIGHTS = [
  { name: "Thin", weight: 100 },
  { name: "Extra Light", weight: 200 },
  { name: "Light", weight: 300 },
  { name: "Regular", weight: 400 },
  { name: "Medium", weight: 500 },
  { name: "Semi Bold", weight: 600 },
  { name: "Bold", weight: 700 },
  { name: "Extra Bold", weight: 800 },
  { name: "Black", weight: 900 },
];
