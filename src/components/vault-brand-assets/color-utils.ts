export type RGB = { r: number; g: number; b: number };
export type CMYK = { c: number; m: number; y: number; k: number };
export type RampStop = { stop: number; hex: string };

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  if (h.length !== 6) return { r: 0, g: 0, b: 0 };
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return {
    r: Number.isNaN(r) ? 0 : r,
    g: Number.isNaN(g) ? 0 : g,
    b: Number.isNaN(b) ? 0 : b,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const c1 = 1 - r / 255;
  const m1 = 1 - g / 255;
  const y1 = 1 - b / 255;
  const k = Math.min(c1, m1, y1);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((c1 - k) / (1 - k)) * 100),
    m: Math.round(((m1 - k) / (1 - k)) * 100),
    y: Math.round(((y1 - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

export function isLightHex(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  return r + g + b > 400;
}

export function makeRamp(hex: string): RampStop[] {
  const { r, g, b } = hexToRgb(hex);
  return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((stop, i) => {
    const f = 1 - i / 10;
    let nr: number;
    let ng: number;
    let nb: number;
    if (i < 5) {
      nr = Math.round(r + (255 - r) * f * 0.85);
      ng = Math.round(g + (255 - g) * f * 0.85);
      nb = Math.round(b + (255 - b) * f * 0.85);
    } else {
      nr = Math.max(0, Math.round(r * (1 - i * 0.09)));
      ng = Math.max(0, Math.round(g * (1 - i * 0.09)));
      nb = Math.max(0, Math.round(b * (1 - i * 0.09)));
    }
    return { stop, hex: rgbToHex(nr, ng, nb) };
  });
}
