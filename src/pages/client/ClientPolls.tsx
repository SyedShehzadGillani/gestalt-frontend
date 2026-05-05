import { SumShell } from "@/components/sum/SumShell";
import { Polls } from "@/components/sum/tabs/Polls";

export default function ClientPolls() {
  return (
    <SumShell>
      <div style={{ flex: 1, overflow: "auto" }}>
        <Polls />
      </div>
    </SumShell>
  );
}
