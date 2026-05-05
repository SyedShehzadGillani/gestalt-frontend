import { useState } from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";

type AgencyContext = { type: "agency" };
type ClientContext = { type: "client"; clientId: string; clientName: string; clientIndustry: string };
type CurrentContext = AgencyContext | ClientContext;

const mockClients = [
  { id: "1", name: "Meridian Tech", industry: "Software" },
  { id: "2", name: "Coastal Living", industry: "Real Estate" },
  { id: "3", name: "Summit Fitness", industry: "Health & Wellness" },
  { id: "4", name: "Nova Financial", industry: "Financial Services" },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [currentContext, setCurrentContext] = useState<CurrentContext>({ type: "agency" });
  const [activeItemId, setActiveItemId] = useState<string>("command");

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
    }
  };

  const returnToAgency = () => {
    setCurrentContext({ type: "agency" });
    setActiveItemId("command");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <Sidebar
        currentContext={currentContext}
        activeItemId={activeItemId}
        onNavClick={setActiveItemId}
        onSelectClient={selectClient}
        onReturnToAgency={returnToAgency}
      />
      <main className="main-content p-6">{children}</main>
    </div>
  );
}
