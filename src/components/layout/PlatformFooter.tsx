import { useTheme } from "@/hooks/use-theme";
import { COMPANY_SCORES } from "@/data/mockData";
import { formatScore } from "@/lib/formatScore";
import { specColorAt } from "@/lib/specColorAt";

const scoreBlocks = [
  { label: "B.A.S.E.", value: COMPANY_SCORES.base },
  { label: "H.I.V.E.", value: COMPANY_SCORES.hive },
  { label: "S.U.M.", value: COMPANY_SCORES.sum },
];

export function PlatformFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const navBg = isDark ? "#0a0a0a" : "#e8e7e2";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#c8c7c2";
  const text4 = isDark ? "#666" : "#999";

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 36,
        zIndex: 100,
        backgroundColor: navBg,
        borderTop: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderRadius: 0,
      }}
    >
      {/* LEFT — Score blocks */}
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {scoreBlocks.map((block) => (
          <div key={block.label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                fontFamily: "'Gotham', 'Montserrat', system-ui, sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: text4,
              }}
            >
              {block.label}
            </span>
            <span
              style={{
                fontFamily: "'Gotham', 'Montserrat', system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 900,
                color: isDark ? specColorAt(block.value, true) : text4,
              }}
            >
              {formatScore(block.value)}
            </span>
          </div>
        ))}
      </div>

      {/* RIGHT — Legal */}
      <div
        style={{
          fontFamily: "'Gotham', 'Montserrat', system-ui, sans-serif",
          fontSize: 8,
          fontWeight: 500,
          letterSpacing: 1.5,
          color: text4,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>GESTALT 2026</span>
        <span>—</span>
        <span style={{ cursor: "pointer" }}>Terms</span>
        <span>—</span>
        <span style={{ cursor: "pointer" }}>Privacy</span>
        <span>—</span>
        <span style={{ cursor: "pointer" }}>Security</span>
        <span>—</span>
        <span style={{ color: "#c9a227" }}>POWERED BY GESTALT.PARTNERS</span>
      </div>
    </footer>
  );
}
