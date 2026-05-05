// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-Tab-Polls-v1.jsx
// S.U.M. Module — POLLS tab
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════
import React from "react";
import { POLL } from "../../constants/GPS-SUM-Data-v1";

export default function SumTabPolls() {
  const responsePct = Math.round((POLL.responses / POLL.total) * 100);
  const lowParticipation = POLL.responses / POLL.total < 0.5;
  const barColors = ["var(--green)", "var(--gold)", "var(--red)"];

  return (
    <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
      <div style={{ padding: "28px 32px", maxWidth: 660, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: "var(--t-h1)", fontWeight: 900, color: "var(--tx)" }}>
            POLLS
          </div>
          <div style={{
            fontSize: "var(--t-body)",
            color: "var(--tx3)",
            marginTop: 4,
          }}>
            Short polls when a project needs more data before prioritizing or executing.
          </div>
        </div>

        <div style={{
          padding: "22px 28px",
          background: "var(--bg2)",
          border: "1px solid var(--bdr)",
          borderRadius: 2,
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}>
            <span style={{
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "var(--gold)",
            }}>
              ACTIVE POLL
            </span>
            <span style={{
              fontSize: "var(--t-caption)",
              color: "var(--red)",
              fontWeight: 600,
            }}>
              {POLL.deadline}
            </span>
          </div>

          <div style={{
            fontSize: "var(--t-h3)",
            fontWeight: 700,
            lineHeight: 1.4,
            marginBottom: 22,
            color: "var(--tx)",
          }}>
            {POLL.title}
          </div>

          {POLL.options.map((opt, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                gap: 10,
              }}>
                <span style={{ fontSize: "var(--t-body)", color: "var(--tx2)" }}>
                  {opt.text}
                </span>
                <span style={{
                  fontSize: "var(--t-body)",
                  fontWeight: 700,
                  color: "var(--gold)",
                }}>
                  {opt.pct}%
                </span>
              </div>
              <div style={{ height: 6, background: "var(--bdr)" }}>
                <div style={{
                  height: "100%",
                  width: `${opt.pct}%`,
                  background: barColors[i] || "var(--gold)",
                  transition: "width .5s",
                }} />
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop: "1px solid var(--bdr)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}>
            <span style={{ fontSize: "var(--t-caption)", color: "var(--tx4)" }}>
              {POLL.responses}/{POLL.total} responses ({responsePct}%)
            </span>
            {lowParticipation && (
              <span style={{
                fontSize: "var(--t-micro)",
                fontWeight: 700,
                color: "var(--red)",
                letterSpacing: 1,
              }}>
                LOW PARTICIPATION WARNING
              </span>
            )}
          </div>
        </div>

        <div style={{
          marginTop: 18,
          padding: "22px 28px",
          background: "rgba(226,181,63,0.06)",
          border: "1px solid rgba(226,181,63,0.2)",
          borderRadius: 2,
        }}>
          <div style={{
            fontSize: "var(--t-caption)",
            fontWeight: 700,
            letterSpacing: 2,
            color: "var(--gold)",
            marginBottom: 8,
          }}>
            POLL INTELLIGENCE
          </div>
          <div style={{
            fontSize: "var(--t-body)",
            color: "var(--tx3)",
            lineHeight: 1.7,
          }}>
            53% of respondents feel strongly aligned after FORMULA sessions.
            The 32% who understand but can't connect to their role = your next
            S.U.M. campaign priority.
          </div>
          <div style={{
            fontSize: "var(--t-micro)",
            color: "var(--gold)",
            marginTop: 8,
            fontWeight: 700,
          }}>
            — GESTALT INTELLIGENCE
          </div>
        </div>
      </div>
    </div>
  );
}
