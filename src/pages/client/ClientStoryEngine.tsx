import { SumShell } from "@/components/sum/SumShell";
import { Stories } from "@/components/sum/tabs/Stories";

export default function ClientStoryEngine() {
  return (
    <SumShell>
      <div style={{ flex: 1, overflow: "auto" }}>
        <Stories />
      </div>
    </SumShell>
  );
}
