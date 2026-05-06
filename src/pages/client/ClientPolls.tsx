// ClientPolls — standalone S.U.M. POLLS route.
// Owns GI hook for the bubble (per spec: GI on all S.U.M. pages).

import { useEffect } from "react";
import { SumShell } from "@/components/sum/SumShell";
import { Polls } from "@/components/sum/tabs/Polls";
import { useGI } from "@/hooks/useGI";

export default function ClientPolls() {
  const gi = useGI();
  useEffect(() => {
    gi.narrateTab("polls");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SumShell gi={gi} tabId="polls">
      <Polls />
    </SumShell>
  );
}
