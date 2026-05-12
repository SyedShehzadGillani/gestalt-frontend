import { useState, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { Icon, ICO } from "@/icons";
import { ThemeToggle } from "./ThemeToggle";
import { TourTrigger } from "@/components/tour/TourTrigger";
import {
  RoleType,
  RoleConfig,
  NavEntry,
  NavSection,
  NavItem,
  roleConfigs,
  getRouteForItem,
  NAV_ICONS,
  CREATIVE_ICON_IDS,
} from "./nav-data";

// ─── Role Context ──────────────────────────────────
interface RoleContextType {
  role: RoleType;
  setRole: (r: RoleType) => void;
  isHQUser: boolean;
  setIsHQUser: (v: boolean) => void;
}

const RoleContext = createContext<RoleContextType>({ role: "client", setRole: () => {}, isHQUser: true, setIsHQUser: () => {} });

export function useRole() {
  return useContext(RoleContext);
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<RoleType>("client");
  const [isHQUser, setIsHQUser] = useState(true);
  
  const handleSetRole = (r: RoleType) => {
    setRole(r);
    if (r === "hq") setIsHQUser(true);
  };

  return (
    <RoleContext.Provider value={{ role, setRole: handleSetRole, isHQUser, setIsHQUser }}>
      {children}
    </RoleContext.Provider>
  );
}

// allRoles data used by HQ header dropdown
export const allRoles: { type: RoleType; label: string; headerLabel: string; accent: string }[] = [
  { type: "hq", label: "HQ", headerLabel: "GESTALT HQ", accent: "#4882ff" },
  { type: "agency", label: "AGENCY", headerLabel: "AGENCY", accent: "#7c3aed" },
  { type: "client", label: "CLIENT", headerLabel: "CLIENT", accent: "#c9a227" },
  { type: "solopreneur", label: "SOLOPRENEUR", headerLabel: "SOLOPRENEUR", accent: "#e2b53f" },
  { type: "employee", label: "EMPLOYEE", headerLabel: "EMPLOYEE", accent: "#888888" },
];

// ─── Section Header (collapsible) ──────────────────
function CollapsibleSection({
  section,
  accentColor,
  children,
}: {
  section: NavSection;
  accentColor: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(!section.collapsedByDefault);

  const labelColor = section.accentColor ? accentColor : 'var(--sidebar-text-muted)';

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between h-[44px] mt-3"
        style={{ borderRadius: 0, paddingTop: '6px', paddingLeft: 20, paddingRight: 16 }}
      >
        <div className="flex flex-col items-start min-w-0">
          <span
            className="text-[10px] font-[900] tracking-[2px] uppercase whitespace-nowrap leading-tight"
            style={{ color: accentColor }}
          >
            {section.label}
          </span>
          {section.fullName && (
            <span
              className="text-[8px] font-[400] tracking-[1px] uppercase whitespace-nowrap leading-tight"
              style={{ color: accentColor, opacity: 0.6 }}
            >
              {section.fullName}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <Icon
            d={ICO.chevronUp}
            size={12}
            color={accentColor}
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

// ─── Nav Item ──────────────────────────────────────
function NavItemRow({
  item,
  isActive,
  accentColor,
  onClick,
  isBottomLocked,
  indented,
}: {
  item: NavItem;
  isActive: boolean;
  accentColor: string;
  onClick: () => void;
  isBottomLocked?: boolean;
  indented?: boolean;
}) {
  const isLocked = item.locked;
  const iconPath = NAV_ICONS[item.id];
  const isCreative = CREATIVE_ICON_IDS.has(item.id);

  // Label colors (unchanged)
  const labelColor = isBottomLocked
    ? (isLocked ? accentColor : accentColor)
    : (isActive ? 'var(--content-text1)' : 'var(--sidebar-text-secondary)');
  const labelOpacity = isBottomLocked ? (isLocked ? 0.5 : 1) : 1;
  const subLabelColor = isBottomLocked ? accentColor : 'var(--sidebar-text-muted)';
  const subLabelOpacity = isBottomLocked ? 0.35 : 1;
  const lockColor = isBottomLocked ? accentColor : 'var(--sidebar-text-muted)';
  const lockOpacity = isBottomLocked ? 0.5 : 1;

  // Icon color logic
  const getIconColor = () => {
    if (isCreative) return "#e2b53f";
    if (isBottomLocked && isLocked) return 'var(--sidebar-text-muted)';
    if (isBottomLocked && !isLocked) return "#c9a227";
    return accentColor;
  };
  const getIconOpacity = () => {
    if (isCreative) return isActive ? 1 : 0.45;
    if (isBottomLocked && isLocked) return 0.35;
    if (isBottomLocked && !isLocked) return 1;
    if (isActive) return 1;
    return 0.45;
  };

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      className="w-full flex items-center h-[40px] transition-all duration-150 group"
      style={{
        paddingLeft: indented ? '32px' : '20px',
        paddingRight: '20px',
        borderRadius: 0,
        borderLeft: isActive ? `2px solid ${accentColor}` : '2px solid transparent',
        backgroundColor: isActive ? `${accentColor}14` : 'transparent',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isBottomLocked ? 1 : (isLocked ? 0.5 : 1),
      }}
      onMouseEnter={(e) => {
        if (!isActive && !isLocked) {
          e.currentTarget.style.backgroundColor = 'var(--sidebar-hover-bg)';
          const svg = e.currentTarget.querySelector('.nav-icon') as SVGElement;
          if (svg) svg.style.opacity = '0.8';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive && !isLocked) {
          e.currentTarget.style.backgroundColor = 'transparent';
          const svg = e.currentTarget.querySelector('.nav-icon') as SVGElement;
          if (svg) svg.style.opacity = String(getIconOpacity());
        }
      }}
    >
      {iconPath && (
        <svg
          className="nav-icon flex-shrink-0"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={getIconColor()}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: getIconOpacity(),
            marginRight: 10,
            transition: 'opacity 150ms ease',
          }}
        >
          <path d={iconPath} />
        </svg>
      )}
      <div className="flex-1 min-w-0 text-left">
        <div
          className="text-[11px] font-[700] tracking-[0.5px] uppercase leading-tight"
          style={{ color: labelColor, opacity: labelOpacity }}
        >
          {item.label}
        </div>
        {item.subLabel && (
          <div
            className="text-[9px] font-[400] leading-tight mt-px"
            style={{ color: subLabelColor, opacity: subLabelOpacity }}
          >
            {item.subLabel}
          </div>
        )}
      </div>
      {isLocked && (
        <Icon
          d={ICO.lock}
          size={12}
          color={lockColor}
          style={{ opacity: lockOpacity, flexShrink: 0, marginLeft: 4 }}
        />
      )}
    </button>
  );
}

// ─── Divider ───────────────────────────────────────
function NavDivider() {
  return <div className="h-px mx-4 my-2" style={{ backgroundColor: 'var(--sidebar-border-color)' }} />;
}

// ─── Main Sidebar ──────────────────────────────────
export function RoleSidebar() {
  const { role, setRole } = useRole();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const config = roleConfigs[role];

  // Collect all nav item IDs in order so only one exact route match can be active
  const allItemIds: string[] = (() => {
    const ids: string[] = [];
    for (const entry of config.entries) {
      if (entry.type === "standalone") ids.push(entry.item.id);
      else if (entry.type === "section") {
        for (const item of entry.section.items) ids.push(item.id);
      }
    }
    for (const item of config.bottomLocked) ids.push(item.id);
    return ids;
  })();

  // Exact pathname matching only
  const activeItemId = allItemIds.find((id) => {
    const route = getRouteForItem(id, role, "1");
    return route !== "#" && location.pathname === route;
  }) ?? null;

  const isActive = (itemId: string) => itemId === activeItemId;

  const handleNav = (itemId: string) => {
    const route = getRouteForItem(itemId, role, "1");
    if (route !== "#") navigate(route);
  };

  const isDark = theme === "dark";
  const sidebarBg = isDark ? config.darkBg : config.lightBg;

  const handleRoleSwitch = (newRole: RoleType) => {
    setRole(newRole);
    if (newRole === "hq") navigate("/hq/dashboard");
    else navigate("/platform");
  };

  const renderEntry = (entry: NavEntry, idx: number) => {
    if (entry.type === "divider") {
      return <NavDivider key={`div-${idx}`} />;
    }
    if (entry.type === "standalone") {
      return (
        <NavItemRow
          key={entry.item.id}
          item={entry.item}
          isActive={isActive(entry.item.id)}
          accentColor={config.accent}
          onClick={() => handleNav(entry.item.id)}
        />
      );
    }
    if (entry.type === "section") {
      return (
        <CollapsibleSection
          key={entry.section.label + idx}
          section={entry.section}
          accentColor={config.accent}
        >
          {entry.section.items.map((item) => (
            <NavItemRow
              key={item.id}
              item={item}
              isActive={isActive(item.id)}
              accentColor={config.accent}
              onClick={() => handleNav(item.id)}
              indented
            />
          ))}
        </CollapsibleSection>
      );
    }
    return null;
  };

    const sidebarStyle: React.CSSProperties = {
      backgroundColor: sidebarBg,
    };

    return (
    <aside
      className="role-sidebar"
      style={sidebarStyle}
    >
      {/* Spacer for TopNav */}
      <div style={{ height: 52, flexShrink: 0 }} />

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto py-1 sidebar-scroll">
        {config.entries.map((entry, idx) => renderEntry(entry, idx))}

        {/* Bottom locked items */}
        {config.bottomLocked.length > 0 && (
          <>
            <NavDivider />
            {config.bottomLocked.map((item) => (
              <NavItemRow
                key={item.id}
                item={item}
                isActive={false}
                accentColor={config.accent}
                onClick={() => {}}
                isBottomLocked
              />
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--sidebar-border-color)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 flex items-center justify-center"
            style={{
              backgroundColor: config.accent,
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <span className="text-[9px] font-[700]" style={{ color: '#000' }}>JP</span>
          </div>
          <div>
            <div className="text-[10px] font-[700]" style={{ color: 'var(--sidebar-text-secondary)' }}>Jeffery P. Ess</div>
            <div className="text-[8px] font-[700] tracking-[0.5px] uppercase" style={{ color: config.accent }}>
              {role === 'hq' ? 'GESTALT HQ' : config.label}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <TourTrigger />
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
