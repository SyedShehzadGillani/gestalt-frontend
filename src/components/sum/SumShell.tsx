// SumShell — chrome around the SUM module: scope, GI footer bar, GI bubble.
// State: useGI is owned here so GI persists across tab navigation within SUM.
// Note: in v16 GI moves to App level so it's site-wide. For v15 the bubble
// is restricted to SUM pages per spec §1 ("renders on S.U.M. pages only").

import { ReactNode } from "react";
import "./sum.css";
import type { UseGIReturn } from "@/hooks/useGI";

interface Props {
  gi: UseGIReturn;
  tabId?: string;
  children: ReactNode;
  rightPanel?: ReactNode;
}

const TIMELINE_LEN = 8;
const FILLED = 5;

export function SumShell({ children, rightPanel }: Props) {
  return (
    <div className="sum-scope">
      <div className="sum-body">
        <div className="sum-main">{children}</div>
        {rightPanel}
      </div>
      <GIFooterBar />
    </div>
  );
}

function GIFooterBar() {
  return (
    <div style={{ padding: "10px 24px", borderTop: "1px solid var(--sum-bdr)", flexShrink: 0, background: "var(--sum-bg)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "var(--sum-tx4)", marginBottom: 5 }}>YOUR DATA IS BUILDING</div>
      <div style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: TIMELINE_LEN }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, background: i < FILLED ? "var(--sum-gold)" : "rgba(226,181,63,0.15)" }} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 5, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: "var(--sum-gold)" }}>63% OF FULL INTELLIGENCE</div>
    </div>
  );
}
