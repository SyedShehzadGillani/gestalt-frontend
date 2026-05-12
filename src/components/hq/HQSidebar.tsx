import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Icon, ICO } from "@/icons";
import { NAV_ICONS, CREATIVE_ICON_IDS } from "@/components/layout/nav-data";

const HQ_ACCENT = "#4882ff";

interface NavItem {
  id: string;
  label: string;
  subLabel: string;
  path: string;
  badge?: string;
}

interface NavSection {
  title: string;
  accentColor?: boolean;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "HQ",
    accentColor: true,
    items: [
      { id: "hq-dashboard", label: "DASHBOARD", subLabel: "GESTALT Headquarters", path: "/hq/dashboard" },
      { id: "hq-alerts", label: "ALERTS", subLabel: "Platform Alerts", path: "/hq/alerts", badge: "3" },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { id: "hq-agencies", label: "AGENCIES", subLabel: "Partner Management", path: "/hq/agencies" },
      { id: "hq-clients", label: "CLIENTS", subLabel: "All Companies", path: "/hq/clients" },
      { id: "hq-revenue", label: "REVENUE", subLabel: "MRR and Billing", path: "/hq/revenue" },
      { id: "hq-usage", label: "USAGE", subLabel: "Platform Activity", path: "/hq/usage" },
    ],
  },
  {
    title: "TOOLS",
    items: [
      { id: "hq-coupons", label: "COUPONS", subLabel: "Discount Codes", path: "/hq/coupons" },
      { id: "hq-permissions", label: "PERMISSIONS", subLabel: "Global Role Settings", path: "/hq/permissions" },
      { id: "hq-announcements", label: "ANNOUNCEMENTS", subLabel: "Platform Messages", path: "/hq/announcements" },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      { id: "hq-tickets", label: "TICKETS", subLabel: "Open Issues", path: "/hq/tickets" },
      { id: "hq-ai-help", label: "AI HELP", subLabel: "GESTALT INTELLIGENCE Diagnostics", path: "/hq/ai-help" },
      { id: "hq-features", label: "FEATURES", subLabel: "Requested Features", path: "/hq/features" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { id: "hq-settings", label: "SETTINGS", subLabel: "Platform Config", path: "/hq/settings" },
      { id: "hq-team", label: "TEAM", subLabel: "HQ Users", path: "/hq/team" },
    ],
  },
];

const hqBaseSections: NavSection[] = [
  {
    title: "B.A.S.E.",
    items: [
      { id: "hq-overview", label: "OVERVIEW", subLabel: "Score Summary", path: "/hq/base-overview" },
      { id: "hq-framework", label: "FRAMEWORK", subLabel: "Assessment Data", path: "/hq/base-framework" },
      { id: "hq-focus", label: "FOCUS", subLabel: "Audit Results", path: "/hq/base-focus" },
      { id: "hq-formula", label: "FORMULA", subLabel: "Strategy Sessions", path: "/hq/base-formula" },
    ],
  },
  {
    title: "H.I.V.E.",
    items: [
      { id: "hq-performance", label: "PERFORMANCE", subLabel: "Human Capital Performance System", path: "/hq/hive-performance" },
    ],
  },
  {
    title: "S.U.M.",
    items: [
      { id: "hq-messaging", label: "MESSAGING", subLabel: "Platform Comms", path: "/hq/sum-messaging" },
      { id: "hq-vault", label: "VAULT", subLabel: "Asset Storage", path: "/hq/sum-vault" },
      { id: "hq-timeline", label: "TIMELINE", subLabel: "History", path: "/hq/sum-timeline" },
      { id: "hq-projects", label: "PROJECTS", subLabel: "Active Work", path: "/hq/sum-projects" },
    ],
  },
];

const hqAnalyticsItem: NavItem = {
  id: "hq-analytics",
  label: "ANALYTICS",
  subLabel: "Platform Intelligence",
  path: "/hq/analytics",
};

function NavIcon({ itemId, active }: { itemId: string; active: boolean }) {
  const iconPath = NAV_ICONS[itemId];
  if (!iconPath) return null;
  const isCreative = CREATIVE_ICON_IDS.has(itemId);
  const color = isCreative ? "#e2b53f" : HQ_ACCENT;
  const opacity = active ? 1 : 0.45;
  return (
    <svg
      className="nav-icon flex-shrink-0"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity, transition: 'opacity 150ms ease' }}
    >
      <path d={iconPath} />
    </svg>
  );
}

const SECTION_FULL_NAMES: Record<string, string> = {
  "B.A.S.E.": "Brand and Strategy Engine",
  "H.I.V.E.": "Human Capital Performance System",
  "S.U.M.": "Strategic Unified Messaging",
};

function CollapsibleSection({
  label,
  accentColor,
  children,
}: {
  label: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const fullName = SECTION_FULL_NAMES[label];
  const chevronColor = accentColor || HQ_ACCENT;

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full relative flex items-center h-[44px] mt-3"
        style={{ borderRadius: 0, paddingTop: '6px', paddingLeft: 20, paddingRight: 16 }}
      >
        <div className="flex flex-col items-start min-w-0" style={{ maxWidth: 'calc(100% - 32px)' }}>
          <span
            className="text-[10px] font-[900] tracking-[2px] uppercase whitespace-nowrap leading-tight"
            style={{ color: accentColor || undefined }}
          >
            {!accentColor && <span className="hq-text-muted">{label}</span>}
            {accentColor && label}
          </span>
          {fullName && (
            <span
              className="text-[8px] font-[400] tracking-[1px] uppercase whitespace-nowrap leading-tight"
              style={{ color: accentColor || undefined, opacity: 0.6 }}
            >
              {!accentColor && <span className="hq-text-muted" style={{ opacity: 0.6 }}>{fullName}</span>}
              {accentColor && fullName}
            </span>
          )}
        </div>
        <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>
          <Icon
            d={ICO.chevronUp}
            size={12}
            color={chevronColor}
            strokeWidth={2}
            style={{
              opacity: 0.9,
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease',
            }}
          />
        </div>
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{ maxHeight: expanded ? '1000px' : '0px', opacity: expanded ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px mx-5 my-2" style={{ backgroundColor: 'var(--hq-border)' }} />;
}

function HQNavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.path}
      className={`hq-nav-link flex items-center gap-[10px] py-2.5 rounded-none group ${active ? 'hq-text hq-nav-active' : 'hq-text-dim'}`}
      style={{
        borderLeft: active ? `2px solid ${HQ_ACCENT}` : '2px solid transparent',
        paddingLeft: 18,
        paddingRight: 16,
        width: '100%',
        boxSizing: 'border-box' as const,
        marginRight: 0,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          const svg = e.currentTarget.querySelector('.nav-icon') as SVGElement;
          if (svg) svg.style.opacity = '0.8';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const svg = e.currentTarget.querySelector('.nav-icon') as SVGElement;
          if (svg) svg.style.opacity = '0.45';
        }
      }}
    >
      <NavIcon itemId={item.id} active={active} />
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-medium tracking-[1px] uppercase block">
          {item.label}
        </span>
        <span className="text-[10px] block mt-0.5 hq-text-sub">
          {item.subLabel}
        </span>
      </div>
      {item.badge && (
        <span
          className="px-1.5 py-0.5 text-white text-[9px] font-bold rounded-[2px]"
          style={{ backgroundColor: HQ_ACCENT }}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function HQSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, adminRole, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/hq/login");
  };

  const getUserInitials = () => {
    if (!user?.email) return "??";
    const email = user.email;
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getRoleLabel = () => {
    switch (adminRole) {
      case "super_admin": return "Super Admin";
      case "admin": return "Admin";
      case "support": return "Support";
      case "viewer": return "Viewer";
      default: return "User";
    }
  };

  return (
    <aside className="hq-sidebar">
      {/* Logo Section */}
      <div className="px-5 py-4 border-b border-[var(--hq-border)]">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-bold hq-text tracking-wide">GESTALT</span>
          <span
            className="px-2 py-0.5 text-white text-[10px] font-bold tracking-wider rounded-[2px]"
            style={{ backgroundColor: HQ_ACCENT }}
          >
            HQ
          </span>
        </div>
        <p className="text-[10px] hq-text-muted mt-1">Headquarters</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 sidebar-scroll" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        {navSections.map((section) => (
          <CollapsibleSection
            key={section.title}
            label={section.title}
            accentColor={section.accentColor ? HQ_ACCENT : undefined}
          >
            {section.items.map((item) => (
              <HQNavLink key={item.id} item={item} active={isActive(item.path)} />
            ))}
          </CollapsibleSection>
        ))}

        <Divider />

        {/* B.A.S.E. / H.I.V.E. / S.U.M. sections */}
        {hqBaseSections.map((section) => (
          <CollapsibleSection key={section.title} label={section.title}>
            {section.items.map((item) => (
              <HQNavLink key={item.id} item={item} active={isActive(item.path)} />
            ))}
          </CollapsibleSection>
        ))}

        <Divider />

        {/* ANALYTICS */}
        <HQNavLink item={hqAnalyticsItem} active={isActive(hqAnalyticsItem.path)} />
      </nav>

      {/* User Section */}
      <div className="p-4" style={{ borderTop: '1px solid var(--hq-border)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 border-2 flex items-center justify-center rounded-none"
            style={{ borderColor: HQ_ACCENT, backgroundColor: 'var(--hq-border)' }}
          >
            <span className="text-[11px] font-bold hq-text">{getUserInitials()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium hq-text truncate">
              {user?.email || "Unknown"}
            </p>
            <p className="text-[10px]" style={{ color: HQ_ACCENT }}>{getRoleLabel()}</p>
          </div>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => navigate("/agency/dashboard")}
            className="flex items-center gap-2 text-[11px] hq-text-muted hover:hq-text transition-colors w-full rounded-none"
          >
            <Icon d={ICO.arrowLeft} size={14} strokeWidth={1.5} />
            <span>Back to App</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[11px] hq-text-muted hover:text-destructive transition-colors w-full rounded-none"
          >
            <Icon d={ICO.close} size={14} strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
