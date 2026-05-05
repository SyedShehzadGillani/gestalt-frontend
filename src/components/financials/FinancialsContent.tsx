import { useState } from "react";
import "./financials.css";
import { FIN_BREADCRUMBS, FIN_FIELD_GROUPS, FIN_TIMELINE_LEN } from "./data";

const fmt = (v: number) => {
  if (!v && v !== 0) return "—";
  if (isNaN(v)) return "—";
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${Math.round(v).toLocaleString()}`;
  return `$${v}`;
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}
function Icon({ name, size = 16, color = "currentColor" }: IconProps) {
  const p = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "link":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" {...p} />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" {...p} />
        </svg>
      );
    case "edit":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" {...p} />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" {...p} />
        </svg>
      );
    case "check":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" {...p} strokeWidth={2.5} />
        </svg>
      );
    case "alert":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" {...p} />
          <path d="M12 8v4M12 16h.01" {...p} />
        </svg>
      );
    case "x":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

type ConnectMode = null | "manual" | "quickbooks";

export function FinancialsContent() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [connectMode, setConnectMode] = useState<ConnectMode>(null);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [helpOpen, setHelpOpen] = useState(false);

  const g = FIN_FIELD_GROUPS[activeGroup];
  const set = (k: string, v: string) => setVals((p) => ({ ...p, [k]: v }));
  const n = (k: string) => {
    const v = parseFloat((vals[k] || "").replace(/,/g, ""));
    return isNaN(v) ? 0 : v;
  };

  const revenue = n("revenue");
  const netIncome = n("netIncome");
  const ownerSalary = n("ownerSalary");
  const interest = n("interest");
  const taxes = n("taxes");
  const depreciation = n("depreciation");
  const amortization = n("amortization");
  const growthRate = n("growthRate");

  const sde = netIncome + ownerSalary + interest + depreciation + amortization;
  const ebitda = netIncome + interest + taxes + depreciation + amortization;
  const filledCount = Object.values(vals).filter(
    (v) => v && v.toString().trim() !== "",
  ).length;
  const totalFields = FIN_FIELD_GROUPS.reduce((s, x) => s + x.fields.length, 0);

  const estMultiple =
    revenue < 1e6
      ? 2.5
      : revenue < 5e6
        ? growthRate > 15
          ? 4
          : 3
        : revenue < 20e6
          ? growthRate > 20
            ? 6
            : growthRate > 10
              ? 5
              : 4
          : growthRate > 20
            ? 8
            : growthRate > 10
              ? 6
              : 5;
  const currentVal = ebitda * estMultiple;
  const potentialMultiple = estMultiple + 3;
  const potentialVal = ebitda * potentialMultiple;
  const complacencyTaxDaily =
    ebitda > 0 ? Math.round((potentialVal - currentVal) / 365) : 0;
  const complacencyTaxAnnual = complacencyTaxDaily * 365;

  const activeBreadcrumb = connectMode ? activeGroup + 1 : 0;
  const intelligencePct = Math.round((filledCount / totalFields) * 100 * 0.12 + 13);

  const GOLD = "var(--fin-gold)";
  const GOLD_DIM = "var(--fin-gold-dim)";
  const GREEN = "var(--fin-green)";
  const RED = "var(--fin-red)";
  const GRAY = "var(--fin-gray)";

  return (
    <div className="fin-scope">
      <div
        style={{
          padding: "12px 32px",
          borderBottom: "1px solid var(--fin-bdr)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        {FIN_BREADCRUMBS.map((bc, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              onClick={() => {
                if (connectMode && i > 0 && i < 5) setActiveGroup(i - 1);
              }}
              style={{
                fontSize: 9,
                fontWeight: i === activeBreadcrumb ? 700 : 400,
                letterSpacing: 1,
                color:
                  i === activeBreadcrumb
                    ? GOLD
                    : i < activeBreadcrumb
                      ? GREEN
                      : "var(--fin-tx4)",
                cursor: connectMode && i > 0 && i < 5 ? "pointer" : "default",
              }}
            >
              {bc}
            </span>
            {i < FIN_BREADCRUMBS.length - 1 && (
              <span style={{ fontSize: 9, color: "var(--fin-tx5)" }}>/</span>
            )}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setHelpOpen(!helpOpen)}
          title="Help"
          style={{
            padding: "4px 8px",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: helpOpen ? GOLD : "var(--fin-tx4)",
            border: `1px solid ${helpOpen ? GOLD : "transparent"}`,
            background: helpOpen ? "rgba(226,181,63,0.1)" : "transparent",
          }}
        >
          GESTALT AI
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
          {!connectMode && (
            <div style={{ maxWidth: 640 }}>
              <div
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: GOLD_DIM,
                  marginBottom: 6,
                }}
              >
                DAY 1 — 5 MINUTES
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  letterSpacing: 2,
                  lineHeight: 1.1,
                }}
              >
                FINANCIALS
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: GOLD_DIM,
                  marginTop: 4,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                VALUATION ANCHOR
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--fin-tx3)",
                  lineHeight: 1.7,
                  marginTop: 16,
                }}
              >
                10 financial data points that turn your blind spots into dollars. Without
                these numbers, your FRAMEWORK score is an observation. With them, it
                becomes a daily cost — your Complacency Tax.
              </div>

              <div
                style={{
                  marginTop: 28,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "var(--fin-tx4)",
                  marginBottom: 12,
                }}
              >
                CHOOSE HOW TO ENTER YOUR DATA
              </div>

              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
              >
                <div
                  onClick={() => setConnectMode("quickbooks")}
                  style={{
                    padding: "24px 20px",
                    background: "var(--fin-bg2)",
                    border: "1px solid var(--fin-bdr)",
                    cursor: "pointer",
                    transition: "border-color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--fin-gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--fin-bdr)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Icon name="link" size={18} color="var(--fin-gold)" />
                    <div style={{ fontSize: 11, fontWeight: 800 }}>
                      CONNECT QUICKBOOKS
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--fin-tx3)",
                      lineHeight: 1.6,
                    }}
                  >
                    Auto-populate from your accounting data via secure API. You can review
                    and edit every number before submitting. Connection takes 30 seconds.
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      padding: "6px 10px",
                      background: "rgba(95,204,0,0.1)",
                      border: "1px solid rgba(95,204,0,0.2)",
                      fontSize: 8,
                      color: GREEN,
                      fontWeight: 600,
                    }}
                  >
                    RECOMMENDED — MOST ACCURATE
                  </div>
                </div>

                <div
                  onClick={() => setConnectMode("manual")}
                  style={{
                    padding: "24px 20px",
                    background: "var(--fin-bg2)",
                    border: "1px solid var(--fin-bdr)",
                    cursor: "pointer",
                    transition: "border-color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--fin-gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--fin-bdr)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Icon name="edit" size={18} color="var(--fin-gold)" />
                    <div style={{ fontSize: 11, fontWeight: 800 }}>ENTER MANUALLY</div>
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--fin-tx3)",
                      lineHeight: 1.6,
                    }}
                  >
                    Enter your 10 financial data points directly. Each field includes
                    tooltips explaining exactly what to enter. Takes about 5 minutes.
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      padding: "6px 10px",
                      background: "var(--fin-bg3)",
                      border: "1px solid var(--fin-bdr)",
                      fontSize: 8,
                      color: "var(--fin-tx3)",
                      fontWeight: 600,
                    }}
                  >
                    WORKS IF YOU KNOW YOUR NUMBERS
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <div
                  style={{
                    padding: 14,
                    background: "var(--fin-card-tint-green)",
                    border: "1px solid rgba(95,204,0,0.2)",
                    borderLeft: `3px solid ${GREEN}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 7,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: GREEN,
                      marginBottom: 4,
                    }}
                  >
                    VALUE OF EXECUTING THIS STEP
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--fin-tx2)",
                      lineHeight: 1.6,
                    }}
                  >
                    Companies that know their exact valuation gap close exits 3.2× faster
                    than those that estimate.
                  </div>
                  <div style={{ fontSize: 8, color: GRAY, marginTop: 4 }}>
                    — Exit Planning Institute
                  </div>
                </div>
                <div
                  style={{
                    padding: 14,
                    background: "var(--fin-card-tint-red)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderLeft: `3px solid ${RED}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 7,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: RED,
                      marginBottom: 4,
                    }}
                  >
                    COST OF NOT EXECUTING THIS STEP
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--fin-tx2)",
                      lineHeight: 1.6,
                    }}
                  >
                    68% of business owners overestimate their company's value by 40% or
                    more — leading to failed exits.
                  </div>
                  <div style={{ fontSize: 8, color: GRAY, marginTop: 4 }}>
                    — Exit Planning Institute
                  </div>
                </div>
              </div>
            </div>
          )}

          {connectMode === "quickbooks" && (
            <div style={{ maxWidth: 640 }}>
              <div
                style={{
                  padding: 32,
                  background: "var(--fin-bg2)",
                  border: "1px solid var(--fin-bdr)",
                  textAlign: "center",
                }}
              >
                <Icon name="link" size={32} color="var(--fin-gold)" />
                <div
                  style={{ fontSize: 14, fontWeight: 800, marginTop: 12 }}
                >
                  CONNECT YOUR QUICKBOOKS
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--fin-tx3)",
                    marginTop: 8,
                    lineHeight: 1.6,
                  }}
                >
                  Secure API connection via Codat. Your data stays encrypted and is never
                  shared. GESTALT reads revenue, expenses, and account balances — nothing
                  else.
                </div>
                <button
                  style={{
                    marginTop: 20,
                    padding: "12px 32px",
                    background: GREEN,
                    color: "#000",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                  }}
                >
                  AUTHORIZE QUICKBOOKS CONNECTION
                </button>
                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => setConnectMode("manual")}
                    style={{
                      color: "var(--fin-tx4)",
                      fontSize: 9,
                      textDecoration: "underline",
                    }}
                  >
                    Enter manually instead
                  </button>
                </div>
              </div>
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: "var(--fin-bg3)",
                  border: "1px solid var(--fin-bdr)",
                  fontSize: 8,
                  color: "var(--fin-tx4)",
                  lineHeight: 1.5,
                }}
              >
                After connecting, all fields will auto-populate. You can review and edit
                every number before submitting. Your QuickBooks connection stays active
                for ongoing ANALYTICS updates.
              </div>
            </div>
          )}

          {connectMode === "manual" && (
            <div style={{ maxWidth: 680 }}>
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: GOLD_DIM,
                    marginBottom: 4,
                  }}
                >
                  SECTION {activeGroup + 1} OF {FIN_FIELD_GROUPS.length}
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>
                  {g.title}
                </div>
              </div>

              <div
                style={{
                  padding: "16px 20px",
                  background: "var(--fin-bg2)",
                  border: "1px solid var(--fin-bdr)",
                  borderLeft: `3px solid ${GOLD}`,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: GOLD,
                    marginBottom: 6,
                  }}
                >
                  WHY THIS MATTERS
                </div>
                {g.tutorial.split("\n\n").map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: 10,
                      color: "var(--fin-tx3)",
                      lineHeight: 1.7,
                      margin: i === 0 ? 0 : "8px 0 0",
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    padding: 12,
                    background: "var(--fin-card-tint-green)",
                    border: "1px solid rgba(95,204,0,0.15)",
                    borderLeft: `3px solid ${GREEN}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 7,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      color: GREEN,
                      marginBottom: 3,
                    }}
                  >
                    VALUE OF COMPLETING
                  </div>
                  <div
                    style={{ fontSize: 9, color: "var(--fin-tx2)", lineHeight: 1.5 }}
                  >
                    {g.valueData.stat}
                  </div>
                  <div style={{ fontSize: 7, color: GRAY, marginTop: 3 }}>
                    — {g.valueData.source}
                  </div>
                </div>
                <div
                  style={{
                    padding: 12,
                    background: "var(--fin-card-tint-red)",
                    border: "1px solid rgba(239,68,68,0.15)",
                    borderLeft: `3px solid ${RED}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 7,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      color: RED,
                      marginBottom: 3,
                    }}
                  >
                    COST OF SKIPPING
                  </div>
                  <div
                    style={{ fontSize: 9, color: "var(--fin-tx2)", lineHeight: 1.5 }}
                  >
                    {g.costData.stat}
                  </div>
                  <div style={{ fontSize: 7, color: GRAY, marginTop: 3 }}>
                    — {g.costData.source}
                  </div>
                </div>
              </div>

              {g.fields.map((f) => {
                const hasVal =
                  vals[f.key] && vals[f.key].toString().trim() !== "";
                const tipOpen = showTooltip === f.key;
                return (
                  <div
                    key={f.key}
                    style={{
                      marginBottom: 16,
                      padding: "16px 20px",
                      background: "var(--fin-bg2)",
                      border: `1px solid ${hasVal ? "rgba(226,181,63,0.3)" : "var(--fin-bdr)"}`,
                      transition: "border-color .2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 700 }}>
                            {f.label}
                          </span>
                          {hasVal && <Icon name="check" size={12} color={GREEN} />}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--fin-tx4)",
                            marginTop: 2,
                            lineHeight: 1.4,
                          }}
                        >
                          {f.sub}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowTooltip(tipOpen ? null : f.key)}
                        title="More info"
                        style={{
                          padding: 4,
                          background: tipOpen
                            ? "rgba(226,181,63,0.1)"
                            : "transparent",
                          border: `1px solid ${tipOpen ? "rgba(226,181,63,0.3)" : "transparent"}`,
                        }}
                      >
                        <Icon
                          name="alert"
                          size={14}
                          color={tipOpen ? GOLD : "var(--fin-tx4)"}
                        />
                      </button>
                    </div>

                    {tipOpen && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: "10px 14px",
                          background: "var(--fin-card-tint-gold)",
                          border: "1px solid rgba(226,181,63,0.15)",
                          fontSize: 9,
                          color: "var(--fin-tx3)",
                          lineHeight: 1.6,
                        }}
                      >
                        <span style={{ color: GOLD, fontWeight: 700 }}>
                          HOW TO FIND THIS:{" "}
                        </span>
                        {f.tooltip}
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {f.prefix && (
                        <div
                          style={{
                            padding: "10px 12px",
                            background: "var(--fin-bg3)",
                            border: "1px solid var(--fin-bdr)",
                            borderRight: "none",
                            fontSize: 12,
                            fontWeight: 700,
                            color: GOLD,
                            minWidth: 36,
                            textAlign: "center",
                          }}
                        >
                          {f.prefix}
                        </div>
                      )}
                      <input
                        type="text"
                        value={vals[f.key] || ""}
                        onChange={(e) => set(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          background: "var(--fin-inp)",
                          border: "1px solid var(--fin-bdr)",
                          color: "var(--fin-tx)",
                          fontSize: 14,
                          fontWeight: 600,
                          borderLeft: f.prefix ? "none" : undefined,
                          borderRight: f.suffix ? "none" : undefined,
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--fin-gold)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "var(--fin-bdr)")
                        }
                      />
                      {f.suffix && (
                        <div
                          style={{
                            padding: "10px 12px",
                            background: "var(--fin-bg3)",
                            border: "1px solid var(--fin-bdr)",
                            borderLeft: "none",
                            fontSize: 12,
                            fontWeight: 700,
                            color: GOLD,
                            minWidth: 36,
                            textAlign: "center",
                          }}
                        >
                          {f.suffix}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 24,
                  paddingTop: 16,
                  borderTop: "1px solid var(--fin-bdr)",
                }}
              >
                <button
                  onClick={() => {
                    if (activeGroup > 0) setActiveGroup(activeGroup - 1);
                    else setConnectMode(null);
                  }}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid var(--fin-bdr2)",
                    color: "var(--fin-tx3)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                  }}
                >
                  {activeGroup === 0 ? "BACK" : "PREVIOUS SECTION"}
                </button>
                <button
                  onClick={() => {
                    if (activeGroup < FIN_FIELD_GROUPS.length - 1)
                      setActiveGroup(activeGroup + 1);
                  }}
                  style={{
                    padding: "10px 24px",
                    background: GOLD,
                    border: `1px solid ${GOLD}`,
                    color: "#000",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                  }}
                >
                  {activeGroup === FIN_FIELD_GROUPS.length - 1
                    ? "CALCULATE MY VALUATION"
                    : "NEXT SECTION"}
                </button>
              </div>

              {filledCount >= 3 && (
                <div
                  style={{
                    marginTop: 24,
                    padding: 20,
                    background: "var(--fin-card-tint-gold)",
                    border: "1px solid rgba(226,181,63,0.2)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: GOLD,
                      marginBottom: 12,
                    }}
                  >
                    REAL-TIME CALCULATIONS
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 7,
                          fontWeight: 700,
                          letterSpacing: 1.5,
                          color: "var(--fin-tx4)",
                        }}
                      >
                        SDE
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: sde > 0 ? GREEN : "var(--fin-tx4)",
                        }}
                      >
                        {sde > 0 ? fmt(sde) : "—"}
                      </div>
                      <div
                        style={{
                          fontSize: 7,
                          color: "var(--fin-tx5)",
                          marginTop: 2,
                        }}
                      >
                        Seller's Discretionary Earnings
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 7,
                          fontWeight: 700,
                          letterSpacing: 1.5,
                          color: "var(--fin-tx4)",
                        }}
                      >
                        EBITDA
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: ebitda > 0 ? GOLD : "var(--fin-tx4)",
                        }}
                      >
                        {ebitda > 0 ? fmt(ebitda) : "—"}
                      </div>
                      <div
                        style={{
                          fontSize: 7,
                          color: "var(--fin-tx5)",
                          marginTop: 2,
                        }}
                      >
                        Earnings Before ITDA
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 7,
                          fontWeight: 700,
                          letterSpacing: 1.5,
                          color: "var(--fin-tx4)",
                        }}
                      >
                        EST. MULTIPLE
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: revenue > 0 ? GOLD : "var(--fin-tx4)",
                        }}
                      >
                        {revenue > 0 ? `${estMultiple}×` : "—"}
                      </div>
                      <div
                        style={{
                          fontSize: 7,
                          color: "var(--fin-tx5)",
                          marginTop: 2,
                        }}
                      >
                        Based on revenue + growth
                      </div>
                    </div>
                  </div>

                  {ebitda > 0 && revenue > 0 && (
                    <>
                      <div
                        style={{
                          borderTop: "1px solid var(--fin-bdr)",
                          marginTop: 16,
                          paddingTop: 16,
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 7,
                              fontWeight: 700,
                              letterSpacing: 1.5,
                              color: "var(--fin-tx4)",
                            }}
                          >
                            CURRENT EST. VALUATION
                          </div>
                          <div style={{ fontSize: 18, fontWeight: 900 }}>
                            {fmt(currentVal)}
                          </div>
                          <div style={{ fontSize: 8, color: "var(--fin-tx4)" }}>
                            at {estMultiple}× EBITDA
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 7,
                              fontWeight: 700,
                              letterSpacing: 1.5,
                              color: GREEN,
                            }}
                          >
                            POTENTIAL VALUATION
                          </div>
                          <div
                            style={{ fontSize: 18, fontWeight: 900, color: GREEN }}
                          >
                            {fmt(potentialVal)}
                          </div>
                          <div style={{ fontSize: 8, color: "var(--fin-tx4)" }}>
                            at {potentialMultiple}× EBITDA (GESTALT optimized)
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 16,
                          padding: 16,
                          background: "var(--fin-card-tint-tax)",
                          border: "1px solid rgba(239,68,68,0.2)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 8,
                            fontWeight: 700,
                            letterSpacing: 2,
                            color: RED,
                            marginBottom: 4,
                          }}
                        >
                          YOUR COMPLACENCY TAX
                        </div>
                        <div
                          style={{ display: "flex", alignItems: "baseline", gap: 8 }}
                        >
                          <span
                            style={{ fontSize: 28, fontWeight: 900, color: RED }}
                          >
                            {fmt(complacencyTaxDaily)}
                          </span>
                          <span
                            style={{ fontSize: 10, color: RED, fontWeight: 600 }}
                          >
                            PER DAY
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--fin-tx3)",
                            marginTop: 4,
                          }}
                        >
                          That's{" "}
                          <span style={{ fontWeight: 700, color: "var(--fin-tx)" }}>
                            {fmt(complacencyTaxAnnual)}/year
                          </span>{" "}
                          in unrealized exit value. Every day without action, this is
                          what standing still costs you.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {helpOpen && (
          <div
            style={{
              width: 280,
              borderLeft: "1px solid var(--fin-bdr)",
              overflow: "auto",
              flexShrink: 0,
              background: "var(--fin-bg3)",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: GOLD,
                }}
              >
                GESTALT AI
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                style={{ color: "var(--fin-tx4)", padding: 2 }}
              >
                <Icon name="x" size={14} color="currentColor" />
              </button>
            </div>
            <div
              style={{
                padding: 12,
                background: "var(--fin-bg2)",
                border: "1px solid var(--fin-bdr)",
                marginBottom: 10,
              }}
            >
              <div
                style={{ fontSize: 10, color: "var(--fin-tx2)", lineHeight: 1.6 }}
              >
                Your Complacency Tax isn't a scare tactic — it's math. The gap between
                your current multiple and your potential multiple, divided by 365.
                That's what standing still costs you per day.
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: GOLD,
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                — GESTALT AI
              </div>
            </div>
            <div
              style={{
                padding: 12,
                background: "var(--fin-bg2)",
                border: "1px solid var(--fin-bdr)",
                marginBottom: 10,
              }}
            >
              <div
                style={{ fontSize: 10, color: "var(--fin-tx2)", lineHeight: 1.6 }}
              >
                If any of these numbers are estimates, that's okay — flag them and
                we'll refine as your QuickBooks data connects. Accuracy here determines
                the credibility of every calculation downstream.
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: GOLD,
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                — GESTALT AI
              </div>
            </div>
            <div
              style={{
                fontSize: 8,
                color: "var(--fin-tx4)",
                lineHeight: 1.5,
                marginTop: 12,
              }}
            >
              Try asking: "What if I don't know my depreciation?" or "How does growth
              rate affect my multiple?" or "What's a good gross margin for my industry?"
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
              <input
                placeholder="Ask about FINANCIALS..."
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  background: "var(--fin-inp)",
                  border: "1px solid var(--fin-bdr)",
                  color: "var(--fin-tx)",
                  fontSize: 9,
                }}
              />
              <button
                style={{
                  padding: "8px 10px",
                  background: GOLD,
                }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth={2}
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "12px 32px",
          borderTop: "1px solid var(--fin-bdr)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: 2,
            color: "var(--fin-tx4)",
            marginBottom: 6,
          }}
        >
          YOUR DATA IS BUILDING
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: FIN_TIMELINE_LEN }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                background: i <= 1 ? GOLD : "rgba(226,181,63,0.15)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 6,
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: GOLD,
          }}
        >
          {intelligencePct}% OF FULL INTELLIGENCE
        </div>
      </div>
    </div>
  );
}
