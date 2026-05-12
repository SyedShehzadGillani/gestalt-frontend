import { useState } from "react";
import {
  Settings,
  Building2,
  LayoutGrid,
  Users,
  BarChart3,
  CreditCard,
  Target,
  Search,
  MoreHorizontal,
  Cog,
  MessageSquare,
  Lock,
  Calendar,
  FolderOpen,
  Activity,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
type AgencyContext = { type: 'agency' };
type ClientContext = { type: 'client'; clientId: string; clientName: string; clientIndustry: string };
type CurrentContext = AgencyContext | ClientContext;

type NavItem = {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  hasPro?: boolean;
};

// Mock data
const mockClients = [
  { id: '1', name: 'Meridian Tech', industry: 'Software', status: 'healthy', score: 82 },
  { id: '2', name: 'Coastal Living', industry: 'Real Estate', status: 'warning', score: 61 },
  { id: '3', name: 'Summit Fitness', industry: 'Health & Wellness', status: 'healthy', score: 78 },
  { id: '4', name: 'Nova Financial', industry: 'Financial Services', status: 'critical', score: 43 }
];

const agencyItems: NavItem[] = [
  { id: "command", label: "COMMAND CENTER", subLabel: "Agency Overview", icon: LayoutGrid, isActive: true },
  { id: "clients", label: "CLIENTS", subLabel: "Manage Clients", icon: Users },
  { id: "analytics", label: "AGENCY ANALYTICS", subLabel: "Portfolio Metrics", icon: BarChart3 },
  { id: "billing", label: "BILLING", subLabel: "Invoices & Payments", icon: CreditCard },
];

const baseItems: NavItem[] = [
  { id: "overview", label: "OVERVIEW", subLabel: "Command Center", icon: LayoutGrid },
  { id: "framework", label: "FRAMEWORK", subLabel: "21-PT Assessment", icon: Target },
  { id: "focus", label: "FOCUS", subLabel: "100-PT Deep Dive", icon: Search, hasPro: true },
  { id: "formula", label: "FORMULA", subLabel: "Strategy Measured", icon: MoreHorizontal, hasPro: true },
];

const hiveItems: NavItem[] = [
  { id: "performance", label: "PERFORMANCE", subLabel: "Human Capital System", icon: Cog },
];

const sumItems: NavItem[] = [
  { id: "messaging", label: "MESSAGING", subLabel: "Team Communication", icon: MessageSquare },
];

const standaloneItems: NavItem[] = [
  { id: "vault", label: "VAULT", subLabel: "Brand Assets", icon: Lock, hasPro: true },
  { id: "timeline", label: "TIMELINE", subLabel: "Brand History", icon: Calendar },
  { id: "projects", label: "PROJECTS", subLabel: "Active Initiatives", icon: FolderOpen },
  { id: "nav-analytics", label: "ANALYTICS", subLabel: "Data + Trends", icon: Activity },
];

function NavItemComponent({ 
  item, 
  isDimmed = false,
  isActive = false,
  onClick 
}: { 
  item: NavItem; 
  isDimmed?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const active = isActive || item.isActive;
  
  const content = (
    <div
      onClick={isDimmed ? undefined : onClick}
      className={`
        flex items-center gap-3 px-5 py-3.5 transition-all duration-150
        border-l-[3px] border-transparent
        ${active 
          ? "bg-[hsl(var(--dark-gray))] border-l-[hsl(var(--gold))]" 
          : "hover:bg-[hsl(var(--dark-gray))]"
        }
        ${isDimmed ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <Icon 
        className={`w-[18px] h-[18px] flex-shrink-0 ${
          active ? "text-[hsl(var(--gold))]" : "text-[hsl(var(--text-light))]"
        }`} 
      />
      <div className="flex-1 min-w-0">
        <div className={`text-[11px] font-medium tracking-[1px] uppercase ${
          active ? "text-foreground" : "text-[hsl(var(--text-light))]"
        }`}>
          {item.label}
        </div>
        <div className="text-[10px] font-normal text-[hsl(var(--text-gray))] mt-0.5">
          {item.subLabel}
        </div>
      </div>
      {item.hasPro && (
        <span className="text-[8px] font-bold tracking-[1px] border border-[hsl(var(--gold))] text-[hsl(var(--gold))] px-1.5 py-0.5 ml-auto">
          PRO
        </span>
      )}
    </div>
  );

  if (isDimmed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-[hsl(var(--dark-gray))] text-foreground border-[hsl(var(--border-gray))]">
          Select a client first
        </TooltipContent>
      </Tooltip>
    );
  }

  return <div className="group">{content}</div>;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="text-[9px] font-bold tracking-[2px] uppercase text-[hsl(var(--text-gray))] px-5 pt-4 pb-2">
      {label}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[hsl(var(--border-gray))] mx-5 my-2" />;
}

interface SidebarProps {
  currentContext: CurrentContext;
  activeItemId: string;
  onNavClick: (itemId: string) => void;
  onSelectClient: (clientId: string) => void;
  onReturnToAgency: () => void;
}

export function Sidebar({
  currentContext,
  activeItemId,
  onNavClick,
  onSelectClient,
  onReturnToAgency,
}: SidebarProps) {
  const isAgencyView = currentContext.type === "agency";

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[hsl(var(--border-gray))]">
        <div className="w-7 h-7 border-2 border-[hsl(var(--gold))] flex items-center justify-center">
          <Settings className="w-4 h-4 text-[hsl(var(--gold))]" />
        </div>
        <span className="text-sm font-medium tracking-[3px] text-foreground">
          GESTALT
        </span>
      </div>

      {/* Context Card */}
      <div className="mx-5 my-4">
        {isAgencyView ? (
          <div
            className="p-3 flex items-center gap-3"
            style={{
              background: "rgba(155, 89, 182, 0.15)",
              border: "1px solid rgba(155, 89, 182, 0.4)",
            }}
          >
            <div className="w-8 h-8 bg-[hsl(var(--purple))] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-4 h-4 text-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-foreground">
                GESTALT Partners
              </div>
              <div className="text-[10px] text-[hsl(var(--purple))]">PRO PLAN</div>
            </div>
          </div>
        ) : (
          <div
            className="p-3"
            style={{
              background: "rgba(201, 162, 39, 0.15)",
              border: "1px solid rgba(201, 162, 39, 0.4)",
            }}
          >
            <button
              onClick={onReturnToAgency}
              className="flex items-center gap-1.5 text-[12px] text-[hsl(var(--text-light))] hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Agency
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[hsl(var(--gold))] flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-[hsl(var(--black))]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground">
                  {currentContext.type === "client" && currentContext.clientName}
                </div>
                <div className="text-[10px] text-[hsl(var(--gold))]">
                  {currentContext.type === "client" && currentContext.clientIndustry}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto">
        {isAgencyView && (
          <>
            <SectionHeader label="AGENCY" />
            {agencyItems.map((item) => (
              <NavItemComponent
                key={item.id}
                item={item}
                isActive={activeItemId === item.id}
                onClick={() => onNavClick(item.id)}
              />
            ))}
            <Divider />
          </>
        )}

        <SectionHeader label="B.A.S.E." />
        {baseItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isDimmed={isAgencyView}
            isActive={activeItemId === item.id}
            onClick={() => onNavClick(item.id)}
          />
        ))}

        <SectionHeader label="H.I.V.E." />
        {hiveItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isDimmed={isAgencyView}
            isActive={activeItemId === item.id}
            onClick={() => onNavClick(item.id)}
          />
        ))}

        <SectionHeader label="S.U.M." />
        {sumItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isDimmed={isAgencyView}
            isActive={activeItemId === item.id}
            onClick={() => onNavClick(item.id)}
          />
        ))}

        <Divider />

        {standaloneItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isDimmed={isAgencyView}
            isActive={activeItemId === item.id}
            onClick={() => onNavClick(item.id)}
          />
        ))}
      </div>

      {/* User Section */}
      <div className="mt-auto px-5 py-3.5 border-t border-[hsl(var(--border-gray))] flex items-center gap-3">
        <div className="w-7 h-7 bg-[hsl(var(--dark-gray))] border border-[hsl(var(--border-gray))] flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] font-semibold text-foreground">JP</span>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-foreground">Jeffery P. Ess</div>
          <div className="text-[10px] text-[hsl(var(--text-gray))]">Account</div>
        </div>
      </div>

      {/* Quick Select Client */}
      {isAgencyView && (
        <div className="px-5 pb-4 border-t border-[hsl(var(--border-gray))] pt-3">
          <div className="text-[9px] font-bold tracking-[2px] uppercase text-[hsl(var(--text-gray))] mb-2">
            Quick Select Client
          </div>
          <div className="space-y-1">
            {mockClients.map((client) => (
              <button
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className="w-full text-left px-2 py-1.5 text-[10px] text-[hsl(var(--text-light))] hover:text-foreground hover:bg-[hsl(var(--dark-gray))] transition-colors"
              >
                {client.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}