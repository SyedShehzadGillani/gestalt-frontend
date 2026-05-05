import { ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import "./sum.css";
import { GIBar } from "./panels/GIBar";
import { GIWindow } from "./panels/GIWindow";
import { RightPanel } from "./panels/RightPanel";

interface Props {
  children: ReactNode;
  showRightPanel?: boolean;
  rightPanelDefault?: "folders" | "search" | "gestalt";
}

function deriveTabId(pathname: string): string {
  if (pathname.includes("/journal")) return "journal";
  if (pathname.includes("/story-engine")) return "stories";
  if (pathname.includes("/polls")) return "polls";
  return "chat";
}

export function SumShell({ children, showRightPanel = false, rightPanelDefault = "gestalt" }: Props) {
  const [giOpen, setGiOpen] = useState(false);
  const { pathname } = useLocation();
  const tabId = deriveTabId(pathname);
  return (
    <div className="sum-scope">
      <div className="sum-body">
        <div className="sum-main">{children}</div>
        {showRightPanel && <RightPanel defaultTab={rightPanelDefault} />}
      </div>
      <GIBar onOpenGI={() => setGiOpen(true)} />
      <GIWindow open={giOpen} onClose={() => setGiOpen(false)} tabId={tabId} />
    </div>
  );
}
