/**
 * Shared spectrum color utility.
 * Returns an RGB color string for a score (0–100).
 * In light mode, darkens the color for contrast.
 */
export function specColorAt(score: number, isDark: boolean): string {
  const stops: [number, string][] = [
    [0, '#4f0200'], [10, '#6e231f'], [20, '#873025'], [30, '#a44f24'],
    [40, '#ba702a'], [50, '#c0933b'], [60, '#e2e200'], [70, '#cff200'],
    [80, '#8ccc00'], [90, '#5fcc00'], [100, '#5fcc00'],
  ];
  let color = '#5fcc00';
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ac] = stops[i];
    const [b, bc] = stops[i + 1];
    if (score >= a && score <= b) {
      const t = (score - a) / (b - a);
      const lerp = (x: number, y: number) => Math.round(x + (y - x) * t);
      const hr = parseInt(ac.slice(1, 3), 16), hg = parseInt(ac.slice(3, 5), 16), hb = parseInt(ac.slice(5, 7), 16);
      const tr = parseInt(bc.slice(1, 3), 16), tg = parseInt(bc.slice(3, 5), 16), tb = parseInt(bc.slice(5, 7), 16);
      color = `rgb(${lerp(hr, tr)},${lerp(hg, tg)},${lerp(hb, tb)})`;
      break;
    }
  }
  if (!isDark) {
    const m = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (m) {
      const darken = (v: number) => Math.round(v * 0.55);
      return `rgb(${darken(+m[1])},${darken(+m[2])},${darken(+m[3])})`;
    }
  }
  return color;
}
