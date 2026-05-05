import { useState } from "react";
import { SumShell } from "@/components/sum/SumShell";
import { Icon } from "@/components/sum/icons";
import { Channels } from "@/components/sum/tabs/Channels";
import { Slideshow } from "@/components/sum/tabs/Slideshow";
import { Notes } from "@/components/sum/tabs/Notes";
import { Metrics } from "@/components/sum/tabs/Metrics";
import { TABS, SumTabId } from "@/data/sum-mock";

export default function ClientMessaging() {
  const [tab, setTab] = useState<SumTabId>("chat");
  const showRightPanel = tab === "notes";
  return (
    <SumShell showRightPanel={showRightPanel}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
        <div className="sum-tabbar">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? "active" : ""}>
              <Icon name={t.icon} size={11} />{t.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflow: "auto", display: "flex" }}>
          {tab === "chat" && <Channels />}
          {tab === "slideshow" && <Slideshow />}
          {tab === "notes" && <Notes />}
          {tab === "metrics" && <Metrics />}
        </div>
      </div>
    </SumShell>
  );
}
