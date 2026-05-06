// ClientStoryEngine — standalone S.U.M. STORY ENGINE route.
// Owns local state + GI hook for the bubble (per spec: GI on all S.U.M. pages).

import { useEffect, useState } from "react";
import { SumShell } from "@/components/sum/SumShell";
import { Stories, type StorySort } from "@/components/sum/tabs/Stories";
import { useGI } from "@/hooks/useGI";

export default function ClientStoryEngine() {
  const gi = useGI();
  const [sort, setSort] = useState<StorySort>("best");
  const [openId, setOpenId] = useState<number | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    gi.narrateTab("stories");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SumShell gi={gi} tabId="stories">
      <Stories
        sort={sort}
        onSort={setSort}
        openId={openId}
        onOpenId={setOpenId}
        composerOpen={composerOpen}
        onComposerOpen={setComposerOpen}
      />
    </SumShell>
  );
}
