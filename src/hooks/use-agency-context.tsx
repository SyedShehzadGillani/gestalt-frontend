import { createContext, useContext, useState, ReactNode } from "react";

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: "active" | "onboarding" | "paused";
  logo?: string;
}

export interface Agency {
  id: string;
  name: string;
  plan: string;
}

interface AgencyContextType {
  agency: Agency;
  clients: Client[];
  currentClient: Client | null;
  isAgencyView: boolean;
  selectClient: (clientId: string) => void;
  backToAgency: () => void;
}

const mockAgency: Agency = {
  id: "agency-1",
  name: "GESTALT Partners",
  plan: "PRO PLAN",
};

const mockClients: Client[] = [
  { id: "client-1", name: "Meridian Tech", industry: "Software", status: "active" },
  { id: "client-2", name: "Coastal Living", industry: "Real Estate", status: "active" },
  { id: "client-3", name: "Summit Fitness", industry: "Health & Wellness", status: "onboarding" },
  { id: "client-4", name: "Nova Financial", industry: "Finance", status: "active" },
];

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export function AgencyProvider({ children }: { children: ReactNode }) {
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);

  const currentClient = currentClientId 
    ? mockClients.find(c => c.id === currentClientId) || null 
    : null;

  const selectClient = (clientId: string) => {
    setCurrentClientId(clientId);
  };

  const backToAgency = () => {
    setCurrentClientId(null);
  };

  return (
    <AgencyContext.Provider
      value={{
        agency: mockAgency,
        clients: mockClients,
        currentClient,
        isAgencyView: !currentClientId,
        selectClient,
        backToAgency,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgencyContext() {
  const context = useContext(AgencyContext);
  if (context === undefined) {
    throw new Error("useAgencyContext must be used within an AgencyProvider");
  }
  return context;
}
