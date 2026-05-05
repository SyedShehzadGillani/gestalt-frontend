// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-Tab-Metrics-v1.jsx
// S.U.M. Module — METRICS tab
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════
import React from "react";
import {
  RANGE_META,
  METRIC_SERIES,
  calcDelta,
  calcYoYDelta,
  SvgBars,
} from "../../utils/GPS-SUM-Utils-v1";

const DAILY_RANGES = [
  { id: "30",  label: "30 DAYS"  },
  { id: "60",  label: "60 DAYS"  },
  { id: "90",  label: "90 DAYS"  },
  { id: "120", label: "120 DAYS" },
];

const QUARTER_RANGES = [
  { id: "q1", label: "Q1" },
  { id: "q2", label: "Q2" },
  { id: "q3", label: "Q3" },
  { id: "q4", label: "Q4" },
];

const COMPANY_METRICS = [
  { label: "Messaging Alignment",            value: 71, desc: "Brand promise consistency across channels" },
  { label: "Communication Health",           value: 74, desc: "Teams talking effectively"                 },
  { label: "Idea Flow Score",                value: 68, desc: "Frontline ideas reaching decision-makers"  },
  { label: "Cross-Functional Collaboration", value: 62, desc: "Department connectivity"                   },
  { label: "Decision Quality",               value: 77, desc: "Data-informed and timely decisions"        },
  { label: "Information Flow Velocity",      value: 69, desc: "Speed of org-wide information travel"      },
];

export default function SumTabMetrics(props) {
  const { metricsRange, setMetricsRange, metricsYoY, setMetricsYoY } = props;
  const range = metricsRange;
  const yoy = metricsYoY;
  const meta = RANGE_META[range] || RANGE_META["30"];

  const sumPair  = METRIC_SERIES.sum[range];
  const partPair = METRIC_SERIES.part[range];
  const ideaPair = METRIC_SERIES.idea[range];

  const sumLatest  = sumPair.current[sumPair.current.length - 1];
  const partLatest = partPair.current[partPair.current.length - 1];
  const ideaLatest = ideaPair.current[ideaPair.current.length - 1];

  const sumDelta  = yoy ? calcYoYDelta(sumPair.current,  sumPair.prior)  : calcDelta(sumPair.current);
  const partDelta = yoy ? calcYoYDelta(partPair.current, partPair.prior) : calcDelta(partPair.current);
  const ideaDelta = yoy ? calcYoYDelta(ideaPair.current, ideaPair.prior) : calcDelta(ideaPair.current);

  const chartProps = {
    showYoY: yoy,
    barW: meta.barW,
    barGap: meta.barGap,
    h: 96,
  };

  const topKpis = [
    {
      label: "S.U.M. SCORE",
      value: sumLatest.toFixed(0),
      sub: "/100",
      color: "var(--gold)",
      chartColor: "#e2b53f",
      seriesPair: sumPair,
      delta: sumDelta,
      goodHigh: true,
    },
    {
      label: "PARTICIPATION",
      value: partLatest.toFixed(0),
      sub: "%",
      color: "var(--green)",
      chartColor: "#5fcc00",
      seriesPair: partPair,
      delta: partDelta,
      goodHigh: true,
    },
    {
      label: "IDEA FLOW",
      value: ideaLatest.toFixed(1),
      sub: "/week",
      color: "var(--blue)",
      chartColor: "#3b82f6",
      seriesPair: ideaPair,
      delta: ideaDelta,
      goodHigh: true,
    },
  ];

  return (
    <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
      <div style={{
        padding: "28px 32px",
        maxWidth: 1040,
        margin: "0 auto",
        width: "100%",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 18,
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div>
            <div style={{
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              letterSpacing: 2,
              color: "var(--gold2)",
            }}>
              ADMIN VIEW — COMPANY-LEVEL METRICS
            </div>
            <div style={{
              fontSize: "var(--t-h1)",
              fontWeight: 900,
              marginTop: 4,
              color: "var(--tx)",
            }}>
              S.U.M. DASHBOARD
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: "var(--t-micro)",
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "var(--tx4)",
            }}>
              {meta.header}
            </span>
            {yoy && (
              <span style={{
                padding: "2px 10px",
                background: "rgba(59,130,246,0.20)",
                color: "var(--blue)",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 0.5,
                borderRadius: 9,
              }}>
                YoY ON
              </span>
            )}
            <span style={{
              padding: "2px 8px",
              background: "rgba(226,181,63,0.20)",
              color: "var(--gold)",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.5,
              borderRadius: 9,
            }}>
              DEMO
            </span>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          marginBottom: 14,
        }}>
          {topKpis.map(m => (
            <KpiCard
              key={m.label}
              kpi={m}
              chartProps={chartProps}
              meta={meta}
              yoy={yoy}
            />
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "stretch" }}>
          <RangeRow
            ranges={DAILY_RANGES}
            activeId={metricsRange}
            onSelect={setMetricsRange}
          />
          <button
            onClick={() => setMetricsYoY(!yoy)}
            style={{
              padding: "0 22px",
              background: yoy ? "rgba(59,130,246,0.15)" : "var(--bg2)",
              color: yoy ? "var(--blue)" : "var(--tx3)",
              border: `1px solid ${yoy ? "rgba(59,130,246,0.4)" : "var(--bdr)"}`,
              fontSize: "var(--t-caption)",
              fontWeight: 800,
              letterSpacing: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            <span style={{
              width: 10,
              height: 10,
              background: yoy ? "var(--blue)" : "transparent",
              border: `1.5px solid ${yoy ? "var(--blue)" : "var(--tx4)"}`,
            }} />
            <span>YoY OVERLAY</span>
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, alignItems: "stretch" }}>
          <RangeRow
            ranges={QUARTER_RANGES}
            activeId={metricsRange}
            onSelect={setMetricsRange}
          />
          <div style={{
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid transparent",
            fontSize: "var(--t-micro)",
            color: "var(--tx5)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            maxWidth: 240,
            lineHeight: 1.4,
          }}>
            {yoy
              ? "Showing current period overlaid with same period one year ago — both at 50% opacity."
              : "Click YoY OVERLAY to compare any range to the same period one year ago."}
          </div>
        </div>

        <div style={{
          fontSize: "var(--t-caption)",
          fontWeight: 700,
          letterSpacing: 2,
          color: "var(--gold)",
          marginBottom: 14,
        }}>
          COMPANY-LEVEL INTELLIGENCE
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}>
          {COMPANY_METRICS.map(m => <CompanyMetricCard key={m.label} m={m} />)}
        </div>

        <div style={{
          marginTop: 18,
          padding: "22px 28px",
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 2,
        }}>
          <div style={{
            fontSize: "var(--t-caption)",
            fontWeight: 700,
            letterSpacing: 1.5,
            color: "var(--red)",
          }}>
            SILO ALERT
          </div>
          <div style={{
            fontSize: "var(--t-body)",
            color: "var(--tx2)",
            lineHeight: 1.7,
            marginTop: 8,
          }}>
            The Pricing team hasn't communicated with Marketing in 18 days.
            Cross-functional score dropped 8 points. Pricing decisions are being
            made without market context.
          </div>
          <div style={{
            fontSize: "var(--t-micro)",
            color: "var(--gold)",
            marginTop: 10,
            fontWeight: 700,
          }}>
            — GESTALT INTELLIGENCE
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ kpi, chartProps, meta, yoy }) {
  const compareLabel = yoy ? meta.yoyLabel : meta.priorLabel;
  return (
    <div style={{
      padding: "22px 28px",
      background: "var(--bg2)",
      border: "1px solid var(--bdr)",
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 14,
      }}>
        <span style={{
          fontSize: "var(--t-caption)",
          fontWeight: 700,
          letterSpacing: 1.5,
          color: "var(--tx4)",
        }}>
          {kpi.label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{
          fontSize: "var(--t-display)",
          fontWeight: 900,
          color: kpi.color,
          lineHeight: 1,
        }}>
          {kpi.value}
        </span>
        <span style={{ fontSize: "var(--t-body)", color: "var(--tx4)" }}>
          {kpi.sub}
        </span>
      </div>
      <DeltaIndicator delta={kpi.delta} goodHigh={kpi.goodHigh} compareLabel={compareLabel} />
      <div style={{ marginTop: 18, flex: 1 }}>
        <SvgBars
          seriesPair={kpi.seriesPair}
          color={kpi.chartColor}
          {...chartProps}
        />
      </div>
    </div>
  );
}

function DeltaIndicator({ delta, goodHigh, compareLabel }) {
  if (Math.abs(delta) < 0.05) {
    return (
      <div style={{ marginTop: 10 }}>
        <span style={{ fontSize: "var(--t-micro)", color: "var(--tx4)", fontWeight: 700 }}>
          — FLAT{" "}
          <span style={{ color: "var(--tx5)", fontWeight: 600 }}>{compareLabel}</span>
        </span>
      </div>
    );
  }
  const isUp   = delta > 0;
  const isGood = goodHigh ? isUp : !isUp;
  const color  = isGood ? "var(--green)" : "var(--red)";
  const arrow  = isUp ? "▲" : "▼";
  const value  = isUp ? `+${Math.abs(delta)}` : `−${Math.abs(delta)}`;
  return (
    <div style={{ marginTop: 10 }}>
      <span style={{
        fontSize: "var(--t-micro)",
        color,
        fontWeight: 800,
        letterSpacing: 0.3,
      }}>
        {arrow} {value}{" "}
        <span style={{ color: "var(--tx5)", fontWeight: 600 }}>{compareLabel}</span>
      </span>
    </div>
  );
}

function RangeRow({ ranges, activeId, onSelect }) {
  return (
    <div style={{
      display: "flex",
      gap: 0,
      border: "1px solid var(--bdr)",
      background: "var(--bg2)",
      flex: 1,
    }}>
      {ranges.map((r, i) => {
        const active = activeId === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: active ? "rgba(226,181,63,0.10)" : "transparent",
              color: active ? "var(--gold)" : "var(--tx3)",
              border: "none",
              borderRight: i < ranges.length - 1 ? "1px solid var(--bdr)" : "none",
              borderTop: active ? "2px solid var(--gold)" : "2px solid transparent",
              fontSize: "var(--t-caption)",
              fontWeight: active ? 800 : 700,
              letterSpacing: 1.5,
              cursor: "pointer",
              borderRadius: 0,
            }}
          >
            {r.label}
          </button>
        );
      })}
    </div>
  );
}

function CompanyMetricCard({ m }) {
  const color = m.value >= 70 ? "var(--green)" : "var(--gold)";
  return (
    <div style={{
      padding: "22px 28px",
      background: "var(--bg2)",
      border: "1px solid var(--bdr)",
      borderRadius: 2,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}>
        <span style={{ fontSize: "var(--t-caption)", fontWeight: 700, color: "var(--tx)" }}>
          {m.label}
        </span>
        <span style={{ fontSize: "var(--t-h3)", fontWeight: 900, color }}>
          {m.value}
        </span>
      </div>
      <div style={{ fontSize: "var(--t-micro)", color: "var(--tx4)", marginTop: 6 }}>
        {m.desc}
      </div>
      <div style={{ height: 3, background: "var(--bdr)", marginTop: 14 }}>
        <div style={{
          height: "100%",
          width: `${m.value}%`,
          background: color,
        }} />
      </div>
    </div>
  );
}
