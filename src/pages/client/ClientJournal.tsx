import { SumShell } from "@/components/sum/SumShell";
import { Journal } from "@/components/sum/tabs/Journal";

export default function ClientJournal() {
  return (
    <SumShell showRightPanel rightPanelDefault="gestalt">
      <div style={{ flex: 1, overflow: "auto" }}>
        <Journal />
      </div>
    </SumShell>
  );
}
