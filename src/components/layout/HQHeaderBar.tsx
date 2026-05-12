import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, MultiIcon, ICO } from "@/icons";
import { useRole, allRoles } from "./RoleSidebar";
import { useTheme } from "@/hooks/use-theme";
import type { RoleType } from "./nav-data";

export function HQHeaderBar() {
  const { role, setRole, isHQUser } = useRole();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRoleData = allRoles.find((r) => r.type === role)!;
  const isDark = theme === "dark";

  const handleSwitch = (newRole: RoleType) => {
    setRole(newRole);
    setOpen(false);
    if (newRole === "hq") navigate("/hq/dashboard");
    else if (newRole === "agency") navigate("/agency/dashboard");
    else navigate("/client/1");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!isHQUser) return null;

  const headerBg = isDark ? '#0a0a0a' : '#e8e7e2';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#c8c7c2';
  const iconColor = isDark ? '#888' : '#444444';
  const dropdownBg = isDark ? '#141414' : '#e6e5e0';

  return (
    <header
      className="fixed top-0 right-0 z-[110] flex items-center justify-end gap-3 px-5"
      style={{
        height: '44px',
        left: '260px',
        backgroundColor: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        borderRadius: 0,
      }}
    >
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
          style={{ borderRadius: 0, background: 'transparent' }}
        >
          <span
            className="text-[9px] font-[800] tracking-[1.5px] uppercase"
            style={{ color: currentRoleData.accent }}
          >
            {currentRoleData.headerLabel}
          </span>
          <Icon
            d={ICO.chevronDown}
            size={12}
            color={currentRoleData.accent}
            strokeWidth={1.5}
            style={{ transition: "transform 200ms", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {open && (
          <div
            className="absolute top-full right-0 mt-1 w-[180px] z-[120] border"
            style={{
              backgroundColor: dropdownBg,
              borderColor: borderColor,
              borderRadius: '2px',
            }}
          >
            {allRoles.map((r) => (
              <button
                key={r.type}
                onClick={() => handleSwitch(r.type)}
                className="w-full h-[36px] flex items-center px-4 text-[9px] font-[700] tracking-[1px] uppercase transition-colors"
                style={{
                  borderRadius: 0,
                  color: r.type === role ? r.accent : (isDark ? '#888' : '#666'),
                  backgroundColor: r.type === role ? `${r.accent}14` : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (r.type !== role) e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (r.type !== role) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {r.headerLabel}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className="relative flex items-center justify-center transition-colors hover:opacity-80"
        style={{ width: '32px', height: '32px', borderRadius: 0, background: 'transparent' }}
      >
        <MultiIcon paths={[{ d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }, { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" }]} size={16} color={iconColor} />
        <span
          className="absolute"
          style={{ width: '6px', height: '6px', top: '4px', right: '5px', borderRadius: '50%', backgroundColor: '#ef4444' }}
        />
      </button>

      <button
        className="flex items-center justify-center transition-colors hover:opacity-80"
        style={{ width: '32px', height: '32px', borderRadius: 0, background: 'transparent' }}
      >
        <MultiIcon paths={[{ d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }, { d: "M12 17h.01" }]} circles={[{ cx: 12, cy: 12, r: 10 }]} size={16} color={iconColor} />
      </button>

      <button
        className="flex items-center justify-center transition-colors hover:opacity-80"
        style={{ width: '32px', height: '32px', borderRadius: 0, background: 'transparent' }}
      >
        <MultiIcon paths={[{ d: ICO.gear }]} circles={[{ cx: 12, cy: 12, r: 3 }]} size={16} color={iconColor} />
      </button>
    </header>
  );
}
