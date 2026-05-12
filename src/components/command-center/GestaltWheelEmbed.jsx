import { useState } from "react";
import {
  CX, CY, RC, R1, R2, R3, R4, R5, R6,
  toRad, arcPath, centroid, innerRot, arcText,
  INNER, MIDDLE, DARK, LIGHT,
  wheelSpecColorAt,
} from "@/components/gestalt-360-map-2.jsx";
import { formatScore } from "@/lib/formatScore";
import { specColorAt } from "@/lib/specColorAt";

const font = "'Gotham', 'Montserrat', system-ui, sans-serif";

/**
 * Embeddable 360° wheel SVG — reuses all geometry from gestalt-360-map-2.jsx.
 * Props: dark, viewMode, wheelActive, outerActive, onWheelClick, onOuterClick, gestaltScore
 */
export default function GestaltWheelEmbed({
  dark,
  viewMode = "score",
  wheelActive = null,
  outerActive = null,
  onWheelClick,
  onOuterClick,
  gestaltScore = 64.0,
}) {
  const [wheelHover, setWheelHover] = useState(null);
  const [outerHover, setOuterHover] = useState(null);

  const T = dark ? DARK : LIGHT;
  const scoreColor = wheelSpecColorAt(gestaltScore);
  const scoreColorDark = scoreColor.replace(/rgb\((\d+),(\d+),(\d+)\)/,
    (_, r, g, b) => `rgb(${Math.round(r * 0.75)},${Math.round(g * 0.75)},${Math.round(b * 0.75)})`);

  const onWheelEnter = id => setWheelHover(id);
  const onWheelLeave = () => setWheelHover(null);
  const handleWheelClick = id => {
    if (onWheelClick) {
      const next = wheelActive === id ? null : id;
      onWheelClick(next);
    }
  };
  const onOuterEnter = id => setOuterHover(id);
  const onOuterLeave = () => setOuterHover(null);
  const handleOuterClick = id => {
    if (onOuterClick) {
      const next = outerActive === id ? null : id;
      onOuterClick(next);
    }
  };

  const isCenterActive = (wheelActive || wheelHover) === "center";
  const isEducation = viewMode === "education";

  return (
    <div style={{ position: "relative" }}>
      <svg width={940} height={940} viewBox="-20 -20 920 920"
        style={{ display: "block", maxWidth: "100%", height: "auto" }}>
        <defs>
          <radialGradient id="cg-embed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={T.gold} stopOpacity="0.18" />
            <stop offset="100%" stopColor={T.gold} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bgg-embed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={T.svgBg1} />
            <stop offset="100%" stopColor={T.svgBg2} />
          </radialGradient>
          {MIDDLE.map((s, i) => (
            <path key={`tp-e-${i}`} id={`tp-e-${i}`}
              d={arcText((R5 + R6) / 2, s.start, s.end, !!s.textFlip)} fill="none" />
          ))}
          {MIDDLE.map((s, i) => (
            <path key={`tpm-e-${i}`} id={`tpm-e-${i}`}
              d={arcText((R3 + R4) / 2, s.start, s.end, !!s.midFlip)} fill="none" />
          ))}
        </defs>

        <circle cx={CX} cy={CY} r={R6 + 4} fill="url(#bgg-embed)" />
        {[RC, R2, R4, R6].map((r, i) => (
          <circle key={i} cx={CX} cy={CY} r={r}
            fill="none" stroke={T.svgRing} strokeWidth="1" />
        ))}

        {/* INNER RING */}
        {INNER.map((seg, i) => {
          const mid = (seg.start + seg.end) / 2;
          const rot = seg.rotOverride ?? innerRot(mid);
          const isAct = wheelActive === seg.id || (!wheelActive && wheelHover === seg.id);
          const [tx, ty] = centroid((R1 + R2) / 2, seg.start, seg.end);
          const rd = toRad(mid), px = Math.cos(rd), py = Math.sin(rd);
          const lx = tx - px * 9, ly = ty - py * 9, mx = tx + px * 10, my = ty + py * 10;
          return (
            <g key={i} onMouseEnter={() => onWheelEnter(seg.id)} onMouseLeave={onWheelLeave}
              onClick={() => handleWheelClick(seg.id)} style={{ cursor: "pointer" }}>
              <path d={arcPath(R1, R2, seg.start, seg.end, 2)}
                fill={`${seg.color}${isAct ? "55" : seg.dim}`}
                stroke={seg.color} strokeWidth={isAct ? "2.5" : "1.2"}
                style={{ transition: "all 0.2s" }} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                transform={`rotate(${rot},${lx},${ly})`}
                fill={isAct ? "#fff" : seg.color}
                fontSize="11" fontWeight="800" letterSpacing="2.5"
                style={{ fontFamily: font, pointerEvents: "none", transition: "fill 0.2s" }}>
                {seg.label}
              </text>
              <text x={mx} y={my} textAnchor="middle" dominantBaseline="middle"
                transform={`rotate(${rot},${mx},${my})`}
                fill={seg.color} fontSize="7" fontWeight="700" letterSpacing="1.5"
                opacity={isAct ? "0.9" : "0.45"}
                style={{ fontFamily: font, pointerEvents: "none" }}>
                {seg.module}
              </text>
            </g>
          );
        })}

        {/* MIDDLE RING */}
        {MIDDLE.map((seg, i) => {
          const isAct = wheelActive === seg.id || (!wheelActive && wheelHover === seg.id);
          return (
            <g key={i} onMouseEnter={() => onWheelEnter(seg.id)} onMouseLeave={onWheelLeave}
              onClick={() => handleWheelClick(seg.id)} style={{ cursor: "pointer" }}>
              <path d={arcPath(R3, R4, seg.start, seg.end, 1.1)}
                fill={`${seg.color}${isAct ? "50" : seg.dimMid}`}
                stroke={seg.color} strokeWidth={isAct ? "2" : "0.6"}
                strokeOpacity={isAct ? "1" : "0.55"}
                style={{ transition: "all 0.2s" }} />
              <text fill={isAct ? (dark ? "#fff" : T.text1) : seg.color}
                fontSize="9" fontWeight="700" letterSpacing="1.2"
                style={{ fontFamily: font, pointerEvents: "none", transition: "fill 0.2s" }}>
                <textPath href={`#tpm-e-${i}`} startOffset="50%" textAnchor="middle">
                  {seg.label}
                </textPath>
              </text>
            </g>
          );
        })}

        {/* OUTER BAND */}
        {MIDDLE.map((seg, i) => {
          const isAct = outerActive === seg.id || (!outerActive && outerHover === seg.id);
          return (
            <g key={i} onMouseEnter={() => onOuterEnter(seg.id)} onMouseLeave={onOuterLeave}
              onClick={() => handleOuterClick(seg.id)} style={{ cursor: "pointer" }}>
              <path d={arcPath(R5, R6, seg.start, seg.end, 1.1)}
                fill={`${seg.color}${isAct ? "60" : seg.dimOut}`}
                stroke={seg.color} strokeWidth={isAct ? "1.2" : "0.5"}
                strokeOpacity="0.85" style={{ transition: "all 0.2s" }} />
              <text fill={isAct ? (dark ? "#fff" : T.text1) : seg.color}
                fontSize="8" fontWeight="700" letterSpacing="0.8"
                style={{ fontFamily: font, pointerEvents: "none", transition: "fill 0.2s" }}>
                <textPath href={`#tp-e-${i}`} startOffset="50%" textAnchor="middle">
                  {seg.impact}
                </textPath>
              </text>
            </g>
          );
        })}

        {/* CENTER HUB */}
        <g onMouseEnter={() => onWheelEnter("center")} onMouseLeave={onWheelLeave}
          onClick={() => handleWheelClick("center")} style={{ cursor: "pointer" }}>
          <circle cx={CX} cy={CY} r={RC} fill="url(#cg-embed)"
            stroke={isCenterActive ? "#e2b53f" : T.gold}
            strokeWidth={wheelActive === "center" ? "2.5" : isCenterActive ? "2" : "1.5"}
            style={{ transition: "all 0.2s" }} />
          <circle cx={CX} cy={CY} r={RC - 4}
            fill={isCenterActive ? T.centerHov : T.centerBg}
            style={{ transition: "all 0.2s" }} />
          {isEducation ? (
            <>
              <text x={CX} y={CY - 14} textAnchor="middle" dominantBaseline="middle"
                fill={T.gold} fontSize="13" fontWeight="800" letterSpacing="2"
                style={{ fontFamily: font, pointerEvents: "none" }}>
                CLICK
              </text>
              <text x={CX} y={CY + 4} textAnchor="middle" dominantBaseline="middle"
                fill={T.gold} fontSize="13" fontWeight="800" letterSpacing="2"
                style={{ fontFamily: font, pointerEvents: "none" }}>
                / TO /
              </text>
              <text x={CX} y={CY + 22} textAnchor="middle" dominantBaseline="middle"
                fill={T.gold} fontSize="13" fontWeight="800" letterSpacing="2"
                style={{ fontFamily: font, pointerEvents: "none" }}>
                EXPLORE
              </text>
            </>
          ) : (
            <text x={CX} y={CY + 4} textAnchor="middle"
              fill={dark ? scoreColor : scoreColorDark} fontSize="58" fontWeight="900" opacity="0.75"
              style={{ fontFamily: font, pointerEvents: "none", dominantBaseline: "middle" }}>
              {formatScore(gestaltScore)}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
