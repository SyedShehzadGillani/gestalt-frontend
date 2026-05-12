import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { specColorAt } from "@/lib/specColorAt";
import { toast } from "sonner";

// ─── Mock Data ─────────────────────────────────────
interface ClientData {
  id: string;
  name: string;
  score: number;
  tier: string;
  trajectory: "up" | "flat" | "down";
  delta: string;
  lastActiveDays: number;
  onboardingDay: number;
  onboardingTotal: number;
  alerts: string[];
}

const mockClients: ClientData[] = [
  {
    id: "1",
    name: "Northgate Solutions",
    score: 64.0,
    tier: "MARKET VULNERABLE",
    trajectory: "up",
    delta: "+6.0",
    lastActiveDays: 2,
    onboardingDay: 14,
    onboardingTotal: 42,
    alerts: ["H.I.V.E. ALERT"],
  },
  {
    id: "2",
    name: "Lakeside Staffing",
    score: 29.0,
    tier: "EXIT UNLIKELY",
    trajectory: "down",
    delta: "-4.0",
    lastActiveDays: 25,
    onboardingDay: 8,
    onboardingTotal: 42,
    alerts: ["FRAMEWORK INCOMPLETE"],
  },
  {
    id: "3",
    name: "Summit Logistics",
    score: 55.0,
    tier: "MARKET VULNERABLE",
    trajectory: "flat",
    delta: "0.0",
    lastActiveDays: 9,
    onboardingDay: 31,
    onboardingTotal: 42,
    alerts: ["FORMULA STALLED"],
  },
];

interface AlertData {
  priority: "HIGH" | "MEDIUM" | "LOW";
  company: string;
  title: string;
  timeAgo: string;
}

const mockAlerts: AlertData[] = [
  { priority: "HIGH", company: "Lakeside Staffing", title: "No platform activity in 25 days", timeAgo: "25 days ago" },
  { priority: "HIGH", company: "Summit Logistics", title: "FORMULA session stalled — 14 days inactive", timeAgo: "14 days ago" },
  { priority: "MEDIUM", company: "Northgate Solutions", title: "H.I.V.E. culture signal declining", timeAgo: "2 hours ago" },
];

const priorityColors: Record<string, string> = {
  HIGH: "#873025",
  MEDIUM: "#ba702a",
  LOW: "#c9a227",
};

const dateRanges = ["TODAY", "7 DAYS", "30 DAYS", "90 DAYS"];

export default function AgencyClients() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeRange, setActiveRange] = useState("30 DAYS");

  const bg2 = isDark ? "#141414" : "#f0efe9";
  const bg3 = isDark ? "#1a1a1a" : "#e8e7e2";
  const border = isDark ? "#232323" : "#d4d3cd";
  const text1 = isDark ? "#f5f5f5" : "#1a1a1a";
  const text2 = isDark ? "#cccccc" : "#444444";
  const text4 = isDark ? "#606060" : "#aaaaaa";
  const accent = "#7c3aed";
  const red = "#873025";
  const green = "#5fcc00";
  const gold = "#c9a227";

  const activeClients = mockClients.filter(c => c.lastActiveDays <= 7).length;
  const avgScore = (mockClients.reduce((s, c) => s + c.score, 0) / mockClients.length);
  const needingAttention = mockClients.filter(c => c.alerts.length > 0 && c.score < 60).length;

  const getActivityColor = (days: number) => {
    if (days <= 2) return green;
    if (days <= 7) return gold;
    return red;
  };

  const trajectoryIcon = (t: ClientData["trajectory"]) => {
    if (t === "up") return { d: "M23 6l-9.5 9.5-5-5L1 18", color: green };
    if (t === "down") return { d: "M23 18l-9.5-9.5-5 5L1 6", color: red };
    return { d: "M5 12h14", color: gold };
  };

  return (
    <div style={{ fontFamily: "Gotham, sans-serif" }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: accent, textTransform: "uppercase" as const }}>
            CLIENT DASHBOARD
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: text1, marginTop: 4 }}>
            All Client Accounts
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {dateRanges.map(r => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              style={{
                fontFamily: "Gotham, sans-serif",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: 1,
                padding: "6px 12px",
                borderRadius: 2,
                border: "none",
                cursor: "pointer",
                background: activeRange === r ? accent : "transparent",
                color: activeRange === r ? "#fff" : text4,
                transition: "all 150ms ease",
              }}
            >
              {r}
            </button>
          ))}
          <button
            onClick={() => toast.info("Add Client flow coming soon")}
            style={{
              fontFamily: "Gotham, sans-serif",
              fontSize: 10,
              fontWeight: 800,
              padding: "8px 16px",
              borderRadius: 2,
              border: "none",
              cursor: "pointer",
              background: accent,
              color: "#fff",
              marginLeft: 8,
            }}
          >
            + ADD CLIENT
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "ACTIVE CLIENTS", value: activeClients.toString(), color: accent },
          { label: "AVG GESTALT SCORE", value: avgScore.toFixed(1), color: specColorAt(avgScore, isDark) },
          { label: "CLIENTS NEEDING ATTENTION", value: needingAttention.toString(), color: red },
          { label: "REVENUE AT RISK", value: "$301,770", color: red },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: bg2,
              border: `1px solid ${border}`,
              borderRadius: 2,
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: text4, textTransform: "uppercase" as const, marginBottom: 8 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Client Health Grid */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: accent, textTransform: "uppercase" as const }}>
          CLIENT HEALTH MAP
        </div>
        <div style={{ fontSize: 8, color: text4, marginTop: 4, marginBottom: 16 }}>
          Click any client to open their dashboard.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {mockClients.map(client => {
            const scoreColor = specColorAt(client.score, isDark);
            const tierColor = scoreColor;
            const traj = trajectoryIcon(client.trajectory);
            const activityColor = getActivityColor(client.lastActiveDays);
            const progress = client.onboardingDay / client.onboardingTotal;
            const hasAlerts = client.alerts.length > 0 && client.score < 60;

            return (
              <ClientHealthCard
                key={client.id}
                client={client}
                scoreColor={scoreColor}
                tierColor={tierColor}
                traj={traj}
                activityColor={activityColor}
                progress={progress}
                hasAlerts={hasAlerts}
                bg2={bg2}
                bg3={bg3}
                border={border}
                text1={text1}
                text2={text2}
                text4={text4}
                accent={accent}
                green={green}
                isDark={isDark}
              />
            );
          })}
        </div>
      </div>

      {/* Alerts Feed */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2, color: accent, textTransform: "uppercase" as const, marginBottom: 16 }}>
          CLIENT ALERTS
        </div>
        {mockAlerts.map((alert, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: `1px solid ${border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: priorityColors[alert.priority],
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: text1 }}>{alert.company}</span>
                  <span style={{ fontSize: 9, color: text2 }}>{alert.title}</span>
                </div>
                <div style={{ fontSize: 8, color: text4, marginTop: 2 }}>{alert.timeAgo}</div>
              </div>
            </div>
            <button
              onClick={() => toast.info(`Viewing alert for ${alert.company}`)}
              style={{
                fontFamily: "Gotham, sans-serif",
                fontSize: 8,
                fontWeight: 700,
                color: accent,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              VIEW →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Client Health Card ────────────────────────────
interface CardProps {
  client: ClientData;
  scoreColor: string;
  tierColor: string;
  traj: { d: string; color: string };
  activityColor: string;
  progress: number;
  hasAlerts: boolean;
  bg2: string;
  bg3: string;
  border: string;
  text1: string;
  text2: string;
  text4: string;
  accent: string;
  green: string;
  isDark: boolean;
}

function ClientHealthCard({
  client, scoreColor, tierColor, traj, activityColor, progress,
  hasAlerts, bg2, bg3, border, text1, text2, text4, accent, green, isDark,
}: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => toast.info(`Opening ${client.name} dashboard...`)}
      style={{
        background: hovered ? bg3 : bg2,
        border: `1px solid ${border}`,
        borderTop: `3px solid ${scoreColor}`,
        borderLeft: hovered ? `2px solid ${accent}` : `1px solid ${border}`,
        borderRadius: 2,
        padding: 20,
        cursor: "pointer",
        transition: "all 150ms ease",
        position: "relative",
      }}
    >
      {/* Row 1: Name + Score */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: text1 }}>{client.name}</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: scoreColor }}>{client.score.toFixed(1)}</div>
      </div>

      {/* Row 2: Tier + Trajectory */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <div style={{ fontSize: 8, fontWeight: 800, color: tierColor, textTransform: "uppercase" as const }}>
          {client.tier}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={traj.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={traj.d} />
          </svg>
          <span style={{ fontSize: 8, fontWeight: 700, color: traj.color }}>{client.delta}</span>
        </div>
      </div>

      {/* Row 3: Spectrum bar */}
      <div style={{
        marginTop: 10,
        width: "100%",
        height: 4,
        borderRadius: 999,
        background: isDark ? "#1e1e1e" : "#d8d7d0",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${client.score}%`,
          height: "100%",
          borderRadius: 999,
          background: scoreColor,
        }} />
      </div>

      {/* Row 4: Last Active + Onboarding */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <div>
          <div style={{ fontSize: 7, fontWeight: 700, color: text4, textTransform: "uppercase" as const, letterSpacing: 1 }}>LAST ACTIVE</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: activityColor, marginTop: 2 }}>
            {client.lastActiveDays === 1 ? "1 day ago" : `${client.lastActiveDays} days ago`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 7, fontWeight: 700, color: text4, textTransform: "uppercase" as const, letterSpacing: 1 }}>
            DAY {client.onboardingDay} OF {client.onboardingTotal}
          </span>
          <div style={{
            width: 40,
            height: 2,
            borderRadius: 999,
            background: isDark ? "#1e1e1e" : "#d8d7d0",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${progress * 100}%`,
              height: "100%",
              borderRadius: 999,
              background: accent,
            }} />
          </div>
        </div>
      </div>

      {/* Row 5: Alert badges */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" as const }}>
        {hasAlerts ? (
          client.alerts.slice(0, 2).map((a, i) => (
            <span
              key={i}
              style={{
                fontSize: 7,
                fontWeight: 800,
                color: "#873025",
                background: "rgba(135,48,37,0.15)",
                border: "1px solid #873025",
                padding: "2px 8px",
                borderRadius: 2,
              }}
            >
              {a}
            </span>
          ))
        ) : (
          <span
            style={{
              fontSize: 7,
              fontWeight: 800,
              color: green,
              background: "rgba(95,204,0,0.15)",
              border: `1px solid ${green}`,
              padding: "2px 8px",
              borderRadius: 2,
            }}
          >
            ON TRACK
          </span>
        )}
      </div>

      {/* Hover: VIEW DASHBOARD */}
      {hovered && (
        <div style={{
          position: "absolute",
          bottom: 10,
          right: 16,
          fontSize: 8,
          fontWeight: 700,
          color: accent,
        }}>
          VIEW DASHBOARD →
        </div>
      )}
    </div>
  );
}
