// ═══════════════════════════════════════════════════════════════════════════
// GPS-SUM-Tab-Slideshow-v1.jsx
// S.U.M. Module — DAILY SLIDESHOW tab
// Source: gestalt-sum-mockup-04-30-v15.html (renderSlideshow)
// April 30, 2026
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  Star, BarChart2, Users, Lightbulb, Heart, AlertTriangle,
} from "lucide-react";
import { SLIDESHOW } from "../../constants/GPS-SUM-Data-v1";

const SLIDE_ICON = {
  star:  Star,
  chart: BarChart2,
  users: Users,
  bulb:  Lightbulb,
  heart: Heart,
  alert: AlertTriangle,
};

export default function SumTabSlideshow(props) {
  const { slideIdx, setSlideIdx } = props;
  const item = SLIDESHOW[slideIdx];
  const Icon = SLIDE_ICON[item.icon] || Star;

  function goPrev() {
    setSlideIdx((slideIdx - 1 + SLIDESHOW.length) % SLIDESHOW.length);
  }
  function goNext() {
    setSlideIdx((slideIdx + 1) % SLIDESHOW.length);
  }

  return (
    <div style={{
      flex: 1,
      overflow: "auto",
      minHeight: 0,
      padding: "36px 32px",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            fontSize: "var(--t-caption)",
            fontWeight: 700,
            letterSpacing: 2,
            color: "var(--gold2)",
          }}>
            TODAY — MARCH 3, 2026
          </div>
          <div style={{
            fontSize: "var(--t-h1)",
            fontWeight: 900,
            marginTop: 6,
            color: "var(--tx)",
          }}>
            DAILY COMPANY SLIDESHOW
          </div>
          <div style={{
            fontSize: "var(--t-body)",
            color: "var(--tx3)",
            marginTop: 8,
          }}>
            AI-curated highlights from across the organization
          </div>
        </div>

        {/* Cinematic slide card — locked 1946:780 aspect ratio. NO color bar. */}
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1946 / 780",
          background: "var(--bg2)",
          border: "1px solid var(--bdr)",
          borderRadius: 2,
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "6% 8%",
          }}>
            <div style={{ color: item.color, marginBottom: 14, display: "flex" }}>
              <Icon size={40} strokeWidth={1.5} fill="none" />
            </div>
            <div style={{
              fontSize: "var(--t-caption)",
              fontWeight: 800,
              letterSpacing: 2.5,
              color: item.color,
            }}>
              {item.title}
            </div>
            <div style={{
              fontSize: "var(--t-h2)",
              lineHeight: 1.45,
              marginTop: 18,
              maxWidth: 680,
              color: "var(--tx)",
              fontWeight: 500,
            }}>
              {item.text}
            </div>
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: 22,
        }}>
          {SLIDESHOW.map((_, i) => {
            const isActive = i === slideIdx;
            return (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: isActive ? 28 : 8,
                  height: 8,
                  background: isActive ? "var(--gold)" : "var(--bdr2)",
                  border: "none",
                  borderRadius: 0,
                  cursor: "pointer",
                  transition: "width .3s",
                  padding: 0,
                }}
              />
            );
          })}
        </div>

        <div style={{
          textAlign: "center",
          marginTop: 8,
          fontSize: "var(--t-caption)",
          color: "var(--tx4)",
        }}>
          {slideIdx + 1} / {SLIDESHOW.length}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 22,
        }}>
          <button
            onClick={goPrev}
            style={{
              padding: "10px 22px",
              border: "1px solid var(--bdr2)",
              background: "transparent",
              color: "var(--tx3)",
              fontSize: "var(--t-caption)",
              fontWeight: 700,
              letterSpacing: 1,
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            PREVIOUS
          </button>
          <button
            onClick={goNext}
            style={{
              padding: "10px 22px",
              background: "var(--gold)",
              color: "#000",
              border: "none",
              fontSize: "var(--t-caption)",
              fontWeight: 800,
              letterSpacing: 1,
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            NEXT
          </button>
        </div>

        <div style={{
          margin: "36px auto 0",
          width: "60%",
          padding: "22px 28px",
          background: "rgba(226,181,63,0.06)",
          border: "1px solid rgba(226,181,63,0.18)",
          borderRadius: 2,
        }}>
          <div style={{
            fontSize: "var(--t-caption)",
            fontWeight: 700,
            letterSpacing: 2,
            color: "var(--gold)",
            marginBottom: 8,
          }}>
            ENGAGEMENT TRACKED
          </div>
          <div style={{
            fontSize: "var(--t-body)",
            color: "var(--tx3)",
            lineHeight: 1.7,
          }}>
            Your interaction with the Daily Slideshow is captured as a participation metric.
            78% of your team viewed today's slideshow. Companies with daily engagement above
            70% see 3.5× higher culture alignment scores.
          </div>
        </div>
      </div>
    </div>
  );
}
