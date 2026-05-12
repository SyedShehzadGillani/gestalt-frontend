import { createContext, useContext, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: "healthy" | "warning" | "critical";
  score: number;
}

const mockClients: Client[] = [
  { id: "1", name: "Meridian Tech", industry: "Software", status: "healthy", score: 82 },
  { id: "2", name: "Coastal Living", industry: "Real Estate", status: "warning", score: 61 },
  { id: "3", name: "Summit Fitness", industry: "Health & Wellness", status: "healthy", score: 78 },
  { id: "4", name: "Nova Financial", industry: "Financial Services", status: "critical", score: 43 },
];

interface NavigationContextType {
  clients: Client[];
  currentClient: Client | null;
  isAgencyView: boolean;
  activeItemId: string;
  selectClient: (clientId: string) => void;
  returnToAgency: () => void;
  navigateToItem: (itemId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getClientIdFromPath = (): string | null => {
    const match = location.pathname.match(/\/client\/(\d+)/);
    return match ? match[1] : null;
  };

  const clientId = getClientIdFromPath();
  const currentClient = clientId ? mockClients.find(c => c.id === clientId) || null : null;
  const isAgencyView = !clientId;

  const getActiveItemId = (): string => {
    const path = location.pathname;

    // Agency routes
    if (path === "/" || path === "/agency" || path === "/agency/dashboard") return "command";
    if (path === "/agency/clients") return "client-dashboard";
    if (path === "/agency/analytics") return "analytics";
    if (path === "/agency/billing") return "billing";

    // Client routes
    if (path.includes("/overview")) return "overview";
    if (path.includes("/framework")) return "framework";
    if (path.includes("/financials")) return "financials";
    if (path.includes("/focus")) return "focus";
    if (path.includes("/formula")) return "formula";
    if (path.includes("/hive")) return "performance";
    if (path.includes("/messaging")) return "messaging";
    if (path.includes("/vault")) return "vault";
    if (path.includes("/timeline")) return "timeline";
    if (path.includes("/projects")) return "projects";
    if (path.includes("/onboarding")) return "onboarding";
    if (path.includes("/research")) return "research";
    if (path.includes("/analytics") && clientId) return "nav-analytics";

    // Default for client root
    if (clientId && path === `/client/${clientId}`) return "overview";

    return "command";
  };

  const activeItemId = getActiveItemId();

  const selectClient = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  const returnToAgency = () => {
    navigate("/agency/dashboard");
  };

  const navigateToItem = (itemId: string) => {
    if (isAgencyView) {
      switch (itemId) {
        case "command": navigate("/agency/dashboard"); break;
        case "clients": navigate("/agency/clients"); break;
        case "analytics": navigate("/agency/analytics"); break;
        case "billing": navigate("/agency/billing"); break;
        default: break;
      }
    } else if (clientId) {
      switch (itemId) {
        case "command": navigate(`/client/${clientId}`); break;
        case "overview": navigate(`/client/${clientId}`); break;
        case "framework": navigate(`/client/${clientId}/framework`); break;
        case "financials": navigate(`/client/${clientId}/financials`); break;
        case "focus": navigate(`/client/${clientId}/focus`); break;
        case "formula": navigate(`/client/${clientId}/formula`); break;
        case "performance": navigate(`/client/${clientId}/hive`); break;
        case "messaging": navigate(`/client/${clientId}/messaging`); break;
        case "vault": navigate(`/client/${clientId}/vault`); break;
        case "timeline": navigate(`/client/${clientId}/timeline`); break;
        case "projects": navigate(`/client/${clientId}/projects`); break;
        case "onboarding": navigate(`/client/${clientId}/onboarding`); break;
        case "research": navigate(`/client/${clientId}/research`); break;
        case "nav-analytics": navigate(`/client/${clientId}/analytics`); break;
        default: break;
      }
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        clients: mockClients,
        currentClient,
        isAgencyView,
        activeItemId,
        selectClient,
        returnToAgency,
        navigateToItem,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
