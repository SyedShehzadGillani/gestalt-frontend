// ClientJournal — standalone S.U.M. PERSONAL JOURNAL route.
// Owns local state + GI hook (since this route doesn't go through ClientMessaging).
// Per glossary canon: GI bubble + footer render on all S.U.M. pages.

import { useEffect, useState } from "react";
import { SumShell } from "@/components/sum/SumShell";
import { Journal } from "@/components/sum/tabs/Journal";
import { RightPanel, type RightPanelMode } from "@/components/sum/RightPanel";
import { useGI } from "@/hooks/useGI";

export default function ClientJournal() {
  const gi = useGI();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [draftOpen, setDraftOpen] = useState(false);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("gestalt");

  useEffect(() => {
    gi.narrateTab("journal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SumShell
      gi={gi}
      tabId="journal"
      rightPanel={
        <RightPanel
          mode={rightPanelMode}
          onModeChange={setRightPanelMode}
          context="journal"
          folderFilter={folderFilter}
          onFolderFilter={setFolderFilter}
        />
      }
    >
      <Journal
        search={search}
        onSearch={setSearch}
        filterType={filterType}
        onFilterType={setFilterType}
        favoritesOnly={favoritesOnly}
        onFavoritesOnly={setFavoritesOnly}
        folderFilter={folderFilter}
        draftOpen={draftOpen}
        onDraftOpen={setDraftOpen}
        onShareEntry={() => { /* share flow lives in ClientMessaging orchestrator */ }}
      />
    </SumShell>
  );
}
