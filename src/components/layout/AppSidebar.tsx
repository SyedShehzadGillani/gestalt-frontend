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
  Shield,
  Award,
  Sparkles,
  BookOpen,
  DollarSign,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigation } from "@/contexts/NavigationContext";
import { ThemeToggle } from "./ThemeToggle";
import { TourTrigger } from "@/components/tour/TourTrigger";

type NavItem = {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ComponentType<any>;
  locked?: boolean;
};

type NavSection = {
  label: string;
  accentColor?: boolean; // true = use role accent color for section label
  items: NavItem[];
};

const agencySections: NavSection[] = [
  {
    label: "AGENCY",
    accentColor: true,
    items: [
      { id: "command", label: "COMMAND CENTER", subLabel: "Agency Overview", icon: LayoutGrid },
      { id: "clients", label: "CLIENTS", subLabel: "Manage Clients", icon: Users },
      { id: "analytics", label: "AGENCY ANALYTICS", subLabel: "Portfolio History", icon: BarChart3 },
      { id: "billing", label: "BILLING", subLabel: "Invoices and Payments", icon: CreditCard },
    ],
  },
  {
    label: "B.A.S.E.",
    items: [
      { id: "overview", label: "OVERVIEW", subLabel: "Command Center", icon: LayoutGrid },
      { id: "framework", label: "FRAMEWORK", subLabel: "21-PT Assessment", icon: Target },
      { id: "focus", label: "FOCUS", subLabel: "100-PT Deep Dive", icon: Search },
      { id: "formula", label: "FORMULA", subLabel: "Strategy Measured", icon: MoreHorizontal },
    ],
  },
  {
    label: "H.I.V.E.",
    items: [
      { id: "performance", label: "PERFORMANCE", subLabel: "Human Capital Performance System", icon: Cog },
    ],
  },
  {
    label: "S.U.M.",
    items: [
      { id: "messaging", label: "MESSAGING", subLabel: "Team Communication", icon: MessageSquare },
      { id: "vault", label: "VAULT", subLabel: "Brand Assets", icon: Lock },
      { id: "timeline", label: "TIMELINE", subLabel: "Brand History", icon: Calendar },
      { id: "projects", label: "PROJECTS", subLabel: "Active Initiatives", icon: FolderOpen },
    ],
  },
];

const agencyBottomItems: NavItem[] = [
  { id: "nav-analytics", label: "ANALYTICS", subLabel: "Data and Trends", icon: Activity },
];

const agencyLockedItems: NavItem[] = [
  { id: "certified", label: "CERTIFIED", subLabel: "Exit Badge", icon: Award, locked: true },
  { id: "transformation", label: "TRANSFORMATION", subLabel: "Apply to Qualify", icon: Sparkles, locked: true },
];

const clientSections: NavSection[] = [
  {
    label: "",
    items: [
      { id: "command", label: "COMMAND CENTER", subLabel: "Your Dashboard", icon: LayoutGrid },
      { id: "onboarding", label: "ONBOARDING", subLabel: "Getting Started", icon: UserPlus },
    ],
  },
  {
    label: "B.A.S.E.",
    items: [
      { id: "overview", label: "OVERVIEW", subLabel: "Command Center", icon: LayoutGrid },
      { id: "framework", label: "FRAMEWORK", subLabel: "21-PT Assessment", icon: Target },
      { id: "financials", label: "FINANCIALS", subLabel: "Revenue and Margins", icon: DollarSign },
      { id: "focus", label: "FOCUS", subLabel: "100-PT Deep Dive", icon: Search },
      { id: "formula", label: "FORMULA", subLabel: "Strategy Measured", icon: MoreHorizontal },
    ],
  },
  {
    label: "H.I.V.E.",
    items: [
      { id: "performance", label: "PERFORMANCE", subLabel: "Human Capital Performance System", icon: Cog },
    ],
  },
  {
    label: "S.U.M.",
    items: [
      { id: "messaging", label: "MESSAGING", subLabel: "Team Communication", icon: MessageSquare },
      { id: "vault", label: "VAULT", subLabel: "Brand Assets", icon: Lock },
      { id: "timeline", label: "TIMELINE", subLabel: "Brand History", icon: Calendar },
      { id: "projects", label: "PROJECTS", subLabel: "Active Initiatives", icon: FolderOpen },
    ],
  },
];

const clientBottomItems: NavItem[] = [
  { id: "research", label: "RESEARCH", subLabel: "Intelligence Library", icon: BookOpen },
];

const clientAnalyticsItem: NavItem = { id: "nav-analytics", label: "ANALYTICS", subLabel: "Data and Trends", icon: Activity };

const clientLockedItems: NavItem[] = [
  { id: "certified", label: "CERTIFIED", subLabel: "Exit Badge", icon: Award, locked: true },
  { id: "transformation", label: "TRANSFORMATION", subLabel: "Apply to Qualify", icon: Sparkles, locked: true },
];

function NavItemComponent({
  item,
  isDimmed = false,
  isActive = false,
  onClick,
  accentColor,
  dataTour,
}: {
  item: NavItem;
  isDimmed?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  accentColor: string;
  dataTour?: string;
}) {
  const Icon = item.icon;
  const isLocked = item.locked;

  const content = (
    <div
      onClick={isDimmed || isLocked ? undefined : onClick}
      data-tour={dataTour}
      className={`
        flex items-center gap-3 px-5 py-3 transition-all duration-150
        rounded-none
        ${isActive
          ? "text-white"
          : "hover:bg-white/[0.04]"
        }
        ${isDimmed || isLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      `}
      style={isActive ? {
        borderLeft: `2px solid ${accentColor}`,
        backgroundColor: `${accentColor}14`,
      } : {
        borderLeft: '2px solid transparent',
      }}
    >
      <Icon
        className="w-[16px] h-[16px] flex-shrink-0"
        strokeWidth={1.5}
        style={{ color: isActive ? accentColor : undefined }}
      />
      <div className="flex-1 min-w-0">
        <div className={`text-[11px] font-medium tracking-[1px] uppercase ${
          isActive ? "text-white" : "text-[hsl(var(--sidebar-foreground)/0.6)]"
        }`}>
          {item.label}
        </div>
        <div className="text-[10px] font-normal text-[hsl(var(--sidebar-foreground)/0.35)] mt-0.5">
          {item.subLabel}
        </div>
      </div>
      {isLocked && (
        <Lock className="w-3.5 h-3.5 text-[hsl(var(--sidebar-foreground)/0.3)] flex-shrink-0" strokeWidth={1.5} />
      )}
    </div>
  );

  if (isDimmed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
          Select a client first
        </TooltipContent>
      </Tooltip>
    );
  }

  return <div className="group">{content}</div>;
}

function SectionHeader({ label, accentColor, dataTour }: { label: string; accentColor?: string; dataTour?: string }) {
  if (!label) return null;
  return (
    <div
      className="text-[7px] font-[800] tracking-[2px] uppercase px-5 pt-4 pb-2 rounded-none"
      style={{ color: accentColor || 'hsl(var(--sidebar-foreground) / 0.35)' }}
      data-tour={dataTour}
    >
      {label}
      {label === "H.I.V.E." && (
        <span className="block text-[6px] font-normal tracking-[1px] mt-0.5 opacity-60">
          Human Capital Performance System
        </span>
      )}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[hsl(var(--sidebar-foreground)/0.08)] mx-5 my-2" />;
}

export function AppSidebar() {
  const {
    clients,
    currentClient,
    isAgencyView,
    activeItemId,
    selectClient,
    returnToAgency,
    navigateToItem,
  } = useNavigation();

  const accentColor = isAgencyView ? "#7c3aed" : "#c9a227";
  const sidebarBg = isAgencyView ? undefined : undefined; // handled via CSS classes

  const sections = isAgencyView ? agencySections : clientSections;
  const bottomItems = isAgencyView ? agencyBottomItems : clientBottomItems;
  const lockedItems = isAgencyView ? agencyLockedItems : clientLockedItems;

  return (
    <aside
      className={`sidebar ${isAgencyView ? 'sidebar-agency' : 'sidebar-client'}`}
    >
      {/* Logo Section */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b border-[hsl(var(--sidebar-foreground)/0.08)] rounded-none"
        data-tour="sidebar-logo"
      >
        <div
          className="w-7 h-7 border-2 flex items-center justify-center rounded-none"
          style={{ borderColor: accentColor }}
        >
          <Settings className="w-4 h-4" strokeWidth={1.5} style={{ color: accentColor }} />
        </div>
        <span className="text-sm font-medium tracking-[3px] text-[hsl(var(--sidebar-foreground))]">
          GESTALT
        </span>
      </div>

      {/* Context Card */}
      <div className="mx-5 my-4" data-tour="context-switcher">
        {isAgencyView ? (
          <div
            className="p-3 flex items-center gap-3 rounded-[2px]"
            style={{
              background: `${accentColor}1A`,
              border: `1px solid ${accentColor}66`,
            }}
          >
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-none"
              style={{ backgroundColor: accentColor }}
            >
              <Building2 className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[hsl(var(--sidebar-foreground))]">
                GESTALT Partners
              </div>
              <div className="text-[10px]" style={{ color: accentColor }}>AGENCY</div>
            </div>
          </div>
        ) : (
          <div
            className="p-3 rounded-[2px]"
            style={{
              background: `${accentColor}1A`,
              border: `1px solid ${accentColor}66`,
            }}
            data-tour="client-header"
          >
            <button
              onClick={returnToAgency}
              data-tour="back-to-agency"
              className="flex items-center gap-1.5 text-[12px] text-[hsl(var(--sidebar-foreground)/0.6)] hover:text-[hsl(var(--sidebar-foreground))] transition-colors mb-2 rounded-none"
            >
              <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
              Back to Agency
            </button>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-none"
                style={{ backgroundColor: accentColor }}
              >
                <Briefcase className="w-4 h-4 text-black" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[hsl(var(--sidebar-foreground))]">
                  {currentClient?.name}
                </div>
                <div className="text-[10px]" style={{ color: accentColor }}>
                  {currentClient?.industry}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            {sIdx > 0 && section.label && (
              <SectionHeader
                label={section.label}
                accentColor={section.accentColor ? accentColor : undefined}
                dataTour={
                  section.label === "B.A.S.E." ? "base-section" :
                  section.label === "H.I.V.E." ? "hive-section" :
                  undefined
                }
              />
            )}
            {sIdx === 0 && section.label && (
              <SectionHeader
                label={section.label}
                accentColor={section.accentColor ? accentColor : undefined}
              />
            )}
            {section.items.map((item) => (
              <NavItemComponent
                key={item.id}
                item={item}
                isActive={activeItemId === item.id}
                isDimmed={isAgencyView && !["command", "clients", "analytics", "billing"].includes(item.id)}
                onClick={() => navigateToItem(item.id)}
                accentColor={accentColor}
                dataTour={
                  item.id === "command" ? "nav-command" :
                  item.id === "clients" ? "nav-clients" :
                  item.id === "billing" ? "nav-billing" :
                  item.id === "overview" ? "nav-overview" :
                  item.id === "framework" ? "nav-framework" :
                  item.id === "focus" ? "nav-focus" :
                  item.id === "performance" ? "nav-hive" :
                  item.id === "messaging" ? "nav-messaging" :
                  item.id === "projects" ? "nav-projects" :
                  undefined
                }
              />
            ))}
            {/* Divider after AGENCY section */}
            {sIdx === 0 && isAgencyView && <Divider />}
          </div>
        ))}

        <Divider />

        {/* Bottom items (RESEARCH for client, ANALYTICS for agency) */}
        {bottomItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isActive={activeItemId === item.id}
            isDimmed={isAgencyView && !["nav-analytics"].includes(item.id)}
            onClick={() => navigateToItem(item.id)}
            accentColor={accentColor}
          />
        ))}

        {/* Client also gets ANALYTICS after RESEARCH */}
        {!isAgencyView && (
          <>
            <Divider />
            <NavItemComponent
              item={clientAnalyticsItem}
              isActive={activeItemId === "nav-analytics"}
              onClick={() => navigateToItem("nav-analytics")}
              accentColor={accentColor}
            />
          </>
        )}

        <Divider />

        {/* CERTIFIED and TRANSFORMATION - always at bottom */}
        {lockedItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            isActive={false}
            onClick={() => {}}
            accentColor={accentColor}
          />
        ))}
      </div>

      {/* User Section with Theme Toggle */}
      <div className="mt-auto px-5 py-3.5 border-t border-[hsl(var(--sidebar-foreground)/0.08)] flex items-center justify-between">
        <div className="flex items-center gap-3" data-tour="user-profile">
          <div className="w-7 h-7 bg-[hsl(var(--sidebar-foreground)/0.08)] border border-[hsl(var(--sidebar-foreground)/0.1)] flex items-center justify-center flex-shrink-0 rounded-none">
            <span className="text-[11px] font-semibold text-[hsl(var(--sidebar-foreground))]">JP</span>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[hsl(var(--sidebar-foreground))]">Jeffery P. Ess</div>
            <div className="text-[10px] text-[hsl(var(--sidebar-foreground)/0.4)]">Account</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/hq/dashboard"
                className="flex items-center justify-center w-8 h-8 text-[hsl(var(--sidebar-foreground)/0.5)] hover:text-[#4882ff] transition-colors rounded-none"
              >
                <Shield className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-card border-border">
              <p className="text-xs">GESTALT HQ</p>
            </TooltipContent>
          </Tooltip>
          <TourTrigger />
          <div data-tour="theme-toggle">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Quick Select Client */}
      {isAgencyView && (
        <div className="px-5 pb-4 border-t border-[hsl(var(--sidebar-foreground)/0.08)] pt-3">
          <div className="text-[7px] font-[800] tracking-[2px] uppercase text-[hsl(var(--sidebar-foreground)/0.35)] mb-2">
            Quick Select Client
          </div>
          <div className="space-y-1">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => selectClient(client.id)}
                className="w-full text-left px-2 py-1.5 text-[10px] text-[hsl(var(--sidebar-foreground)/0.6)] hover:text-[hsl(var(--sidebar-foreground))] hover:bg-white/[0.04] transition-colors rounded-none"
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
