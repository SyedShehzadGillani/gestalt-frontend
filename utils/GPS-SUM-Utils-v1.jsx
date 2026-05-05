// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-Utils-v1.jsx
// S.U.M. Module — Utility Functions + Chart Components
// Source: gestalt-sum-mockup-04-30-v15.html (lines 1601-1608, 2667-2812)
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import { JOURNAL_ENTRIES, NOTES } from "../constants/GPS-SUM-Data-v1";


// ═══════════════════════════════════════════════════════════════════════════
// GENERAL UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

export function folderCount(folderId) {
  const entries = JOURNAL_ENTRIES.filter(e => e.folderId === folderId).length;
  const notes   = NOTES.filter(n => n.folderId === folderId).length;
  return entries + notes;
}

export function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(full.substr(0, 2), 16);
  const g = parseInt(full.substr(2, 2), 16);
  const b = parseInt(full.substr(4, 2), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

export function formatTimestamp(date) {
  const d = (date instanceof Date) ? date : new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr  = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1)   return "Just now";
  if (diffMin < 60)  return `${diffMin}m ago`;
  if (diffHr  < 24)  return `${diffHr}h ago`;
  if (diffDay < 7)   return `${diffDay}d ago`;
  return d.toLocaleDateString();
}


// ═══════════════════════════════════════════════════════════════════════════
// CHART UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

export const RANGE_META = {
  "30":  { n: 30,  granularity: "daily",  priorLabel: "vs prior 15d",  yoyLabel: "vs same 30d last year",  header: "LAST 30 DAYS",  barW: 6,  barGap: 2 },
  "60":  { n: 60,  granularity: "daily",  priorLabel: "vs prior 30d",  yoyLabel: "vs same 60d last year",  header: "LAST 60 DAYS",  barW: 3,  barGap: 1 },
  "90":  { n: 90,  granularity: "daily",  priorLabel: "vs prior 45d",  yoyLabel: "vs same 90d last year",  header: "LAST 90 DAYS",  barW: 2,  barGap: 1 },
  "120": { n: 120, granularity: "daily",  priorLabel: "vs prior 60d",  yoyLabel: "vs same 120d last year",header: "LAST 120 DAYS", barW: 1,  barGap: 1 },
  "q1":  { n: 13,  granularity: "weekly", priorLabel: "vs Q4 last year",yoyLabel: "vs Q1 last year",      header: "Q1 (THIS YEAR)",barW: 14, barGap: 4 },
  "q2":  { n: 13,  granularity: "weekly", priorLabel: "vs Q1",          yoyLabel: "vs Q2 last year",      header: "Q2 (THIS YEAR)",barW: 14, barGap: 4 },
  "q3":  { n: 13,  granularity: "weekly", priorLabel: "vs Q2",          yoyLabel: "vs Q3 last year",      header: "Q3 (THIS YEAR)",barW: 14, barGap: 4 },
  "q4":  { n: 13,  granularity: "weekly", priorLabel: "vs Q3",          yoyLabel: "vs Q4 last year",      header: "Q4 (THIS YEAR)",barW: 14, barGap: 4 },
};

export function makeSeries(seed, n, base, variance, trend) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const out = [];
  for (let i = 0; i < n; i++) {
    const trendComponent = trend * (i / (n - 1));
    const noiseComponent = (rnd() - 0.5) * 2 * variance;
    out.push(Math.round((base + trendComponent + noiseComponent) * 10) / 10);
  }
  return out;
}

export function buildMetricSeries(metricSeed, baseConfig) {
  const out = {};
  Object.keys(RANGE_META).forEach((rangeId, i) => {
    const meta = RANGE_META[rangeId];
    out[rangeId] = {
      current: makeSeries(metricSeed + i * 10,     meta.n, baseConfig.base,     baseConfig.variance, baseConfig.trend),
      prior:   makeSeries(metricSeed + i * 10 + 5, meta.n, baseConfig.base - 8, baseConfig.variance, baseConfig.trend * 0.7),
    };
  });
  return out;
}

export const METRIC_SERIES = {
  sum:  buildMetricSeries(100, { base: 66,  variance: 4,   trend: 6   }),
  part: buildMetricSeries(200, { base: 74,  variance: 4,   trend: 4   }),
  idea: buildMetricSeries(300, { base: 3.6, variance: 0.6, trend: 0.6 }),
};

export function calcDelta(series) {
  const half       = Math.floor(series.length / 2);
  const priorAvg   = series.slice(0, half).reduce((a, b) => a + b, 0) / half;
  const currentAvg = series.slice(half).reduce((a, b) => a + b, 0) / (series.length - half);
  return Math.round((currentAvg - priorAvg) * 10) / 10;
}

export function calcYoYDelta(currentSeries, priorYearSeries) {
  const cAvg = currentSeries.reduce((a, b) => a + b, 0) / currentSeries.length;
  const pAvg = priorYearSeries.reduce((a, b) => a + b, 0) / priorYearSeries.length;
  return Math.round((cAvg - pAvg) * 10) / 10;
}


// ═══════════════════════════════════════════════════════════════════════════
// CHART COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export function SvgBars({ seriesPair, color, barW = 4, barGap = 1, h = 96, showYoY = false }) {
  const { current, prior } = seriesPair;
  const showYoYActual = showYoY && prior;
  const allValues = showYoYActual ? current.concat(prior) : current;
  const max = Math.max(...allValues) * 1.05;
  const min = 0;
  const n = current.length;
  const stride = barW + barGap;
  const w = n * stride;

  const renderBars = (series, opacity) => series.map((v, i) => {
    const barH = ((v - min) / (max - min)) * h;
    return (
      <rect
        key={i}
        x={i * stride}
        y={h - barH}
        width={barW}
        height={barH}
        fill={color}
        opacity={opacity}
      />
    );
  });

  const gridLines = [0.25, 0.5, 0.75].map(p => (
    <line
      key={p}
      x1={0}
      x2={w}
      y1={h * p}
      y2={h * p}
      stroke="currentColor"
      strokeWidth={1}
      opacity={0.08}
    />
  ));

  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <svg width={w} height={h} style={{ display: "block" }}>
        {gridLines}
        {showYoYActual && renderBars(prior, 0.5)}
        {renderBars(current, showYoYActual ? 0.5 : 1.0)}
      </svg>
    </div>
  );
}

export function SvgArea({ seriesPair, color, w = 300, h = 96, showYoY = false }) {
  const { current, prior } = seriesPair;
  const showYoYActual = showYoY && prior;
  const allValues = showYoYActual ? current.concat(prior) : current;
  const max = Math.max(...allValues) * 1.08;
  const min = Math.min(...allValues) * 0.92;
  const range = (max - min) || 1;
  const n = current.length;
  const stepX = w / Math.max(1, n - 1);

  const buildPath = (series) => {
    const pts = series.map((v, i) => ({
      x: i * stepX,
      y: h - ((v - min) / range) * h,
    }));
    let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      path += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return { line: path, fill: path + ` L ${w} ${h} L 0 ${h} Z` };
  };

  const colorId = color.replace(/[^a-z0-9]/gi, "");
  const cur = buildPath(current);
  const pri = showYoYActual ? buildPath(prior) : null;

  const gridLines = [0.25, 0.5, 0.75].map(p => (
    <line
      key={p}
      x1={0}
      x2={w}
      y1={h * p}
      y2={h * p}
      stroke="currentColor"
      strokeWidth={1}
      opacity={0.08}
    />
  ));

  return (
    <svg width={w} height={h} style={{ display: "block", width: "100%" }} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {gridLines}
      <defs>
        <linearGradient id={`grad-${colorId}-cur`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`grad-${colorId}-pri`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {pri && (
        <>
          <path d={pri.fill} fill={`url(#grad-${colorId}-pri)`} opacity={0.5} />
          <path d={pri.line} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.5} />
        </>
      )}
      <path d={cur.fill} fill={`url(#grad-${colorId}-cur)`} />
      <path d={cur.line} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

export const SvgLine = SvgArea;
