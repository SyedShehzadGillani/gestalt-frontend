import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AgencyCommandCenter } from "@/components/dashboard/AgencyCommandCenter";
import { ClientsPage } from "@/components/clients/ClientsPage";
import { BASEOverviewPage } from "@/components/base-overview/BASEOverviewPage";
import { AssessmentFlow } from "@/components/assessment/AssessmentFlow";
import { HivePerformancePage } from "@/components/hive/HivePerformancePage";
import { SUMMessagingPage } from "@/components/sum/SUMMessagingPage";
import { ProjectsListPage } from "@/components/projects/ProjectsListPage";
import { ProjectDetailPage } from "@/components/projects/ProjectDetailPage";
import { BillingPage } from "@/components/billing/BillingPage";

type AgencyContext = { type: "agency" };
type ClientContext = { type: "client"; clientId: string; clientName: string; clientIndustry: string };
type CurrentContext = AgencyContext | ClientContext;

const mockClients = [
  { id: "1", name: "Meridian Tech", industry: "Software", status: "healthy" as const, score: 82 },
  { id: "2", name: "Coastal Living", industry: "Real Estate", status: "warning" as const, score: 61 },
  { id: "3", name: "Summit Fitness", industry: "Health & Wellness", status: "healthy" as const, score: 78 },
  { id: "4", name: "Nova Financial", industry: "Financial Services", status: "critical" as const, score: 43 },
];

const Index = () => {
  const [currentContext, setCurrentContext] = useState<CurrentContext>({ type: "agency" });
  const [activeItemId, setActiveItemId] = useState<string>("command");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectClient = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    if (client) {
      setCurrentContext({
        type: "client",
        clientId: client.id,
        clientName: client.name,
        clientIndustry: client.industry,
      });
      setActiveItemId("overview");
      setSelectedProjectId(null);
    }
  };

  const returnToAgency = () => {
    setCurrentContext({ type: "agency" });
    setActiveItemId("command");
    setSelectedProjectId(null);
  };

  const handleNavClick = (itemId: string) => {
    setActiveItemId(itemId);
    setSelectedProjectId(null);
  };

  const isAgencyView = currentContext.type === "agency";

  const currentClientData =
    currentContext.type === "client"
      ? mockClients.find((c) => c.id === currentContext.clientId)
      : null;

  const renderContent = () => {
    if (isAgencyView) {
      if (activeItemId === "command") {
        return <AgencyCommandCenter onSelectClient={selectClient} />;
      }
      if (activeItemId === "clients") {
        return <ClientsPage onSelectClient={selectClient} />;
      }
      if (activeItemId === "billing") {
        return <BillingPage />;
      }
      // Other agency pages placeholder
      return (
        <div className="text-foreground-secondary">
          <h1 className="text-[24px] font-semibold text-foreground mb-2">
            {activeItemId.charAt(0).toUpperCase() + activeItemId.slice(1)}
          </h1>
          <p className="text-[13px]">Agency section coming soon...</p>
        </div>
      );
    }

    // Client view - show B.A.S.E. Overview for overview
    if (activeItemId === "overview" && currentClientData) {
      return (
        <BASEOverviewPage
          clientName={currentClientData.name}
          score={currentClientData.score}
          onNavigate={handleNavClick}
        />
      );
    }

    // Framework Assessment
    if (activeItemId === "framework" && currentContext.type === "client") {
      return (
        <AssessmentFlow
          clientName={currentContext.clientName}
          onComplete={() => setActiveItemId("overview")}
        />
      );
    }

    // H.I.V.E. Performance
    if (activeItemId === "performance" && currentContext.type === "client") {
      return <HivePerformancePage clientName={currentContext.clientName} />;
    }

    // S.U.M. Messaging
    if (activeItemId === "messaging" && currentContext.type === "client") {
      return <SUMMessagingPage clientName={currentContext.clientName} />;
    }

    // Projects
    if (activeItemId === "projects") {
      if (selectedProjectId) {
        return (
          <ProjectDetailPage
            projectId={selectedProjectId}
            isAgencyView={isAgencyView}
            onBack={() => setSelectedProjectId(null)}
          />
        );
      }
      return (
        <ProjectsListPage
          clientName={currentContext.type === "client" ? currentContext.clientName : undefined}
          isAgencyView={isAgencyView}
          onViewProject={(projectId) => setSelectedProjectId(projectId)}
        />
      );
    }

    // Other client pages placeholder
    return (
      <div className="text-foreground-secondary">
        <h1 className="text-[24px] font-semibold text-foreground mb-2">
          {activeItemId.charAt(0).toUpperCase() + activeItemId.slice(1)}
        </h1>
        <p className="text-[13px]">
          {currentContext.type === "client" && currentContext.clientName} • Client section coming soon...
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentContext={currentContext}
        activeItemId={activeItemId}
        onNavClick={handleNavClick}
        onSelectClient={selectClient}
        onReturnToAgency={returnToAgency}
      />
      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default Index;
