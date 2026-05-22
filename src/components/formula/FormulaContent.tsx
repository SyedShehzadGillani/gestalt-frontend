import { useCallback, useState } from "react";
import { ALL_SECTION_IDS, TOUR_TIPS } from "@/components/formula/formula-data";
import { CongratsOverlay } from "@/components/formula/CongratsOverlay";
import { FormulaPanel, type PanelMessage } from "@/components/formula/FormulaPanel";
import { FormulaModuleNav } from "@/components/formula/FormulaModuleNav";
import { FormulaTabStrip } from "@/components/formula/FormulaTabStrip";
import { InstructionBlock } from "@/components/formula/InstructionBlock";
import { ArchPage } from "@/components/formula/pages/ArchPage";
import { AudiencesPage } from "@/components/formula/pages/AudiencesPage";
import { BarriersPage } from "@/components/formula/pages/BarriersPage";
import { BusinessObjectivesPage } from "@/components/formula/pages/BusinessObjectivesPage";
import { CampaignsPage } from "@/components/formula/pages/CampaignsPage";
import { CompetitiveLandscapePage } from "@/components/formula/pages/CompetitiveLandscapePage";
import { ExperiencePage } from "@/components/formula/pages/ExperiencePage";
import { MeasuresPage } from "@/components/formula/pages/MeasuresPage";
import { OutletsPage } from "@/components/formula/pages/OutletsPage";
import { TimelinePage } from "@/components/formula/pages/TimelinePage";

const PAGE_IDS = ALL_SECTION_IDS;

/**
 * FORMULA orchestrator — owns activePage state and the GESTALT INTELLIGENCE
 * panel feed. Renders the FORMULA-internal tab strip; the global app shell
 * (sidebar + topnav) is provided by AppLayout one level up.
 */
export function FormulaContent() {
  const [activePage, setActivePage] = useState<string>(PAGE_IDS[0] ?? "01.10");
  const [signedOff, setSignedOff] = useState<Record<string, boolean>>({});
  const [stepProgress] = useState<Record<string, number>>({});
  const [lastCompleted, setLastCompleted] = useState<string | null>(null);
  const [panelMessages, setPanelMessages] = useState<PanelMessage[]>([]);
  const [congratsSection, setCongratsSection] = useState<string | null>(null);

  const handleSignOff = useCallback((id: string) => {
    setSignedOff((prev) => ({ ...prev, [id]: true }));
    setLastCompleted(id);
    setCongratsSection(id);
  }, []);

  const triggerAi = useCallback((msg: PanelMessage) => {
    setPanelMessages((prev) => [...prev, msg]);
  }, []);

  const confirmMessage = useCallback((idx: number) => {
    setPanelMessages((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, confirmed: true } : m)),
    );
  }, []);

  const changePage = (id: string) => {
    setActivePage(id);
    setPanelMessages([]);
  };

  const renderPage = () => {
    switch (activePage) {
      case "01.10":
        return (
          <CompetitiveLandscapePage
            onAi={triggerAi}
            onSignOff={handleSignOff}
            signedOff={signedOff}
          />
        );
      case "01.20":
        return (
          <BusinessObjectivesPage
            onAi={triggerAi}
            onSignOff={handleSignOff}
            signedOff={signedOff}
          />
        );
      case "01.30":
        return <BarriersPage onAi={triggerAi} />;
      case "02.10":
        return <AudiencesPage onAi={triggerAi} />;
      case "02.20":
        return <ExperiencePage onAi={triggerAi} />;
      case "02.30":
        return <ArchPage onAi={triggerAi} />;
      case "03.10":
        return <OutletsPage onAi={triggerAi} />;
      case "03.20":
        return <CampaignsPage onAi={triggerAi} />;
      case "03.30":
        return <MeasuresPage onAi={triggerAi} />;
      case "04.10":
        return <TimelinePage onAi={triggerAi} />;
      default:
        return null;
    }
  };

  // 01.10 manages its own per-phase instructions internally.
  const showInstruction = activePage !== "01.10";

  return (
    <div className="formula-scope flex flex-col h-full">
      <FormulaModuleNav activeModuleId="formula" />
      <FormulaTabStrip activePage={activePage} signedOff={signedOff} onChange={changePage} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto px-12 py-9 pb-20">
          <div className="max-w-[760px] mx-auto">
            {showInstruction && <InstructionBlock text={TOUR_TIPS[activePage]} />}
            {renderPage()}
          </div>
        </div>
        <FormulaPanel
          messages={panelMessages}
          onConfirm={confirmMessage}
          signedOff={signedOff}
          activePage={activePage}
          stepProgress={stepProgress}
          lastCompleted={lastCompleted}
        />
      </div>

      {congratsSection && (
        <CongratsOverlay
          sectionId={congratsSection}
          onClose={() => setCongratsSection(null)}
        />
      )}
    </div>
  );
}
