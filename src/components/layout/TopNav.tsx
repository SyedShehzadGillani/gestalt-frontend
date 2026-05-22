import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { useRole, allRoles } from "./RoleSidebar";
import type { RoleType } from "./nav-data";
const LOGO_PATH = "/assets/GESTALT-Logo-1-v1.svg";

const roleAvatarData: Record<RoleType, { initials: string; name: string; roleLabel: string; email: string }> = {
  hq: { initials: "HQ", name: "Alex Chen", roleLabel: "HQ — PLATFORM ADMIN", email: "admin@gestalt.com" },
  agency: { initials: "JP", name: "Alex Chen", roleLabel: "AGENCY — GESTALT Partners", email: "alex@northgate.com" },
  client: { initials: "AC", name: "Alex Chen", roleLabel: "CLIENT — Northgate Solutions", email: "alex@northgate.com" },
  solopreneur: { initials: "AC", name: "Alex Chen", roleLabel: "SOLOPRENEUR — Northgate Solutions", email: "alex@northgate.com" },
  employee: { initials: "EM", name: "Alex Chen", roleLabel: "EMPLOYEE — Northgate Solutions", email: "alex@northgate.com" },
  investor: { initials: "IO", name: "Alex Chen", roleLabel: "INVESTOR / OWNER — Northgate Holdings", email: "alex@northgate.com" },
};

const searchPlaceholders: Record<RoleType, string> = {
  hq: "Search all companies, users, and platform data...",
  agency: "Search GESTALT Partners and all clients...",
  client: "Search Northgate Solutions...",
  solopreneur: "Search Northgate Solutions...",
  employee: "Search Northgate Solutions...",
  investor: "Search portfolio companies...",
};

// When HQ is previewing CLIENT role, override placeholder
function getSearchPlaceholder(role: RoleType, isHQUser: boolean): string {
  if (isHQUser && role !== "hq") return "Search Northgate Solutions...";
  return searchPlaceholders[role];
}

const mockNotifications = [
  { id: 1, title: "B.A.S.E. score updated", desc: "Northgate Solutions — 72.4", time: "2m ago" },
  { id: 2, title: "New message in #general", desc: "James Park sent a message", time: "15m ago" },
  { id: 3, title: "Project deadline approaching", desc: "Brand Refresh — Due in 3 days", time: "1h ago" },
];

const mockSearchResults = [
  { text: "FRAMEWORK assessment - Northgate Solutions", module: "B.A.S.E.", moduleColor: "#c9a227" },
  { text: "Alex Chen - Employee Profile", module: "H.I.V.E.", moduleColor: "#4882ff" },
  { text: "Brand Refresh - Active Project", module: "S.U.M.", moduleColor: "#c45c00" },
  { text: "Q1 Strategy Session - FORMULA", module: "FORMULA", moduleColor: "#c9a227" },
];

export function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole, isHQUser } = useRole();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(e.target as Node)) setRoleSwitcherOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchValue("");
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setProfileOpen(false); setNotifOpen(false); setRoleSwitcherOpen(false); setSearchValue(""); }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", keyHandler); };
  }, []);

  const accentColor = allRoles.find(r => r.type === role)?.accent || "#c9a227";
  const avatarData = roleAvatarData[role];
  const currentRoleLabel = allRoles.find(r => r.type === role)?.headerLabel || "CLIENT VIEW";

  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const text4 = isDark ? "#666" : "#999";
  const text2 = isDark ? "#ccc" : "#333";
  const text1 = isDark ? "#fff" : "#1a1a1a";
  const text3 = isDark ? "#888" : "#777";
  const bg2 = isDark ? "#141414" : "#f0efe9";
  const bg3 = isDark ? "#1a1a1a" : "#e8e7e2";
  const navBg = isDark ? "var(--sidebar-bg, #0a0a0a)" : "var(--sidebar-bg-light, #f5f4ef)";

  const handleRoleSwitch = (newRole: RoleType) => {
    setRole(newRole);
    setRoleSwitcherOpen(false);
    if (newRole === "hq") navigate("/hq/dashboard");
    else if (newRole === "agency") navigate("/agency/dashboard");
    else if (newRole === "investor") navigate("/investor/1");
    else navigate("/client/1");
  };

  const iconBtnStyle: React.CSSProperties = {
    width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
    background: "transparent", borderRadius: 2, border: "none", cursor: "pointer",
    transition: "background 150ms",
  };

  const searchBorderColor = searchFocused ? "rgba(201,162,39,0.4)" : borderColor;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between"
      style={{ height: 52, backgroundColor: bg2, borderBottom: `1px solid ${borderColor}`, borderRadius: 0 }}
    >
      {/* LEFT — Logo */}
      <div className="flex items-center" style={{ paddingLeft: 20 }}>
        <img
          src={LOGO_PATH}
          alt="GESTALT"
          style={{ height: 24, filter: isDark ? 'sepia(1) saturate(3) brightness(0.85) hue-rotate(5deg)' : 'brightness(0.4)' }}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = document.createElement('span');
            fallback.textContent = 'GESTALT';
            fallback.style.cssText = `font-family:'Gotham',sans-serif;font-size:13px;font-weight:900;letter-spacing:4px;color:${text1}`;
            target.parentElement?.appendChild(fallback);
          }}
        />
      </div>

      {/* RIGHT — Icon row */}
      <div className="flex items-center" style={{ gap: 8, paddingRight: 20 }}>

        {/* TEMP: Onboarding demo launcher — remove once client picks a concept (see DEC-010) */}
        <button
          onClick={() => navigate("/onboarding")}
          style={{
            marginRight: 12,
            padding: "6px 14px",
            background: "#c9a227",
            color: "#0a0a0a",
            border: "none",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 2,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          title="Temporary — client demo launcher"
        >
          ONBOARDING DEMOS
        </button>

        {/* 1. Search */}
        <div className="relative" ref={searchRef} style={{ marginRight: 12 }}>
          <div
            className="gold-input flex items-center"
            style={{
              width: 320, height: 32, background: bg3, border: `1px solid ${searchBorderColor}`,
              borderRadius: 2, paddingLeft: 10, paddingRight: 10, gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={getSearchPlaceholder(role, isHQUser)}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontFamily: "'Gotham', sans-serif", fontSize: 9, fontWeight: 400,
                color: text3,
              }}
            />
          </div>
          {searchValue.length > 0 && (
            <div
              style={{
                position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
                background: bg2, border: `1px solid ${borderColor}`, borderRadius: 2,
                maxHeight: 320, overflowY: "auto", zIndex: 200,
              }}
            >
              {mockSearchResults.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between"
                  style={{
                    height: 40, padding: "0 16px", cursor: "pointer", borderRadius: 0,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = bg3}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontFamily: "'Gotham', sans-serif", fontSize: 10, fontWeight: 500, color: text2 }}>
                    {item.text}
                  </span>
                  <span style={{ fontFamily: "'Gotham', sans-serif", fontSize: 8, fontWeight: 700, color: item.moduleColor, letterSpacing: 0.5, textTransform: "uppercase" }}>
                    {item.module}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. HQ Role Switcher (HQ only) — left of bell */}
        {isHQUser && (
          <div className="relative" ref={roleSwitcherRef}>
            <button
              onClick={() => { setRoleSwitcherOpen(!roleSwitcherOpen); setProfileOpen(false); setNotifOpen(false); }}
              className="flex items-center gap-1.5"
              style={{ background: "transparent", border: "none", cursor: "pointer", borderRadius: 0 }}
            >
              <span style={{ fontFamily: "'Gotham', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" as const, color: text1 }}>
                {currentRoleLabel}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4882ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: "transform 200ms", transform: roleSwitcherOpen ? "rotate(180deg)" : "rotate(0)" }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {roleSwitcherOpen && (
              <div style={{
                position: "absolute", top: "100%", right: 0, marginTop: 4, width: 200,
                background: bg2, border: `1px solid ${borderColor}`, borderRadius: 2, zIndex: 200,
              }}>
                {allRoles.map(r => (
                  <button
                    key={r.type}
                    onClick={() => handleRoleSwitch(r.type)}
                    style={{
                      width: "100%", height: 36, display: "flex", alignItems: "center", paddingLeft: 16, paddingRight: 16,
                      fontFamily: "'Gotham', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1,
                      textTransform: "uppercase" as const, border: "none", cursor: "pointer", borderRadius: 0,
                      color: r.type === role ? r.accent : text4,
                      background: r.type === role ? `${r.accent}14` : "transparent",
                    }}
                    onMouseEnter={(e) => { if (r.type !== role) e.currentTarget.style.background = bg3; }}
                    onMouseLeave={(e) => { if (r.type !== role) e.currentTarget.style.background = "transparent"; }}
                  >
                    {r.headerLabel}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); setRoleSwitcherOpen(false); }}
            style={iconBtnStyle}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={notifOpen ? accentColor : text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span style={{ position: "absolute", top: 4, right: 5, width: 6, height: 6, borderRadius: "50%", background: "#873025" }} />
          </button>
          {notifOpen && (
            <div style={{
              position: "absolute", top: "100%", right: 0, marginTop: 4, width: 280,
              background: bg2, border: `1px solid ${borderColor}`, borderRadius: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 200,
            }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${borderColor}`, fontFamily: "'Gotham', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase" as const, color: text4 }}>
                NOTIFICATIONS
              </div>
              {mockNotifications.map(n => (
                <div key={n.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${borderColor}`, cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = bg3}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ fontFamily: "'Gotham', sans-serif", fontSize: 11, fontWeight: 700, color: text1 }}>{n.title}</div>
                  <div style={{ fontFamily: "'Gotham', sans-serif", fontSize: 10, fontWeight: 400, color: text2, marginTop: 2 }}>{n.desc}</div>
                  <div style={{ fontFamily: "'Gotham', sans-serif", fontSize: 9, fontWeight: 400, color: text4, marginTop: 2 }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Help */}
        <button
          style={iconBtnStyle}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>

        {/* 5. Settings */}
        <button
          onClick={() => navigate(role === "hq" ? "/hq/settings" : "/settings")}
          style={iconBtnStyle}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        {/* 6. Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          style={iconBtnStyle}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
        >
          {isDark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "opacity 150ms" }}>
              <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={text4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "opacity 150ms" }}>
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>

        {/* 6. User Avatar + Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setRoleSwitcherOpen(false); }}
            className="!rounded-full"
            style={{
              width: 32, height: 32, background: accentColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer", overflow: "hidden",
              fontFamily: "'Gotham', sans-serif", fontSize: 10, fontWeight: 800, color: "#000",
            }}
          >
            {avatarData.initials}
          </button>
          {profileOpen && (
            <div style={{
              position: "absolute", top: "100%", right: 0, marginTop: 4, width: 220,
              background: bg2, border: `1px solid ${borderColor}`, borderRadius: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 200,
            }}>
              {/* User info block */}
              <div style={{ padding: 16, borderBottom: `1px solid ${borderColor}`, display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", background: accentColor,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  fontFamily: "'Gotham', sans-serif", fontSize: 12, fontWeight: 800, color: "#000",
                }}>
                  {avatarData.initials}
                </div>
                <div>
                  <div style={{ fontFamily: "'Gotham', sans-serif", fontSize: 11, fontWeight: 700, color: text1 }}>{avatarData.name}</div>
                  <div style={{ fontFamily: "'Gotham', sans-serif", fontSize: 8, fontWeight: 400, color: text4, marginTop: 1 }}>{avatarData.roleLabel}</div>
                  <div style={{ fontFamily: "'Gotham', sans-serif", fontSize: 8, fontWeight: 400, color: text4, marginTop: 1 }}>{avatarData.email}</div>
                </div>
              </div>
              {/* Menu items */}
              {(() => {
                const profileRoute =
                  role === "client" || role === "solopreneur" ? "/client/1/profile" :
                  role === "agency" ? "/agency/profile" :
                  role === "hq" ? "/hq/profile" :
                  role === "investor" ? "/investor/1/profile" :
                  "/profile";
                return [
                  { icon: "user", label: "MY PROFILE", route: profileRoute },
                  { icon: "settings", label: "ACCOUNT SETTINGS", route: "/settings" },
                  ...(role !== "employee" ? [{ icon: "billing", label: "BILLING", route: "/billing" }] : []),
                ];
              })().map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setProfileOpen(false); navigate(item.route); }}
                  style={{
                    width: "100%", height: 36, display: "flex", alignItems: "center", gap: 8,
                    padding: "0 16px", background: "transparent", border: "none", cursor: "pointer", borderRadius: 0,
                    fontFamily: "'Gotham', sans-serif", fontSize: 9, fontWeight: 700,
                    textTransform: "uppercase" as const, letterSpacing: 0.5,
                    color: isDark ? "#ccc" : "#444",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = bg3}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <ProfileMenuIcon type={item.icon} color={text4} />
                  {item.label}
                </button>
              ))}
              <div style={{ height: 1, background: borderColor }} />
              <button
                onClick={() => setProfileOpen(false)}
                style={{
                  width: "100%", height: 36, display: "flex", alignItems: "center", gap: 8,
                  padding: "0 16px", background: "transparent", border: "none", cursor: "pointer", borderRadius: 0,
                  fontFamily: "'Gotham', sans-serif", fontSize: 9, fontWeight: 700,
                  textTransform: "uppercase" as const, letterSpacing: 0.5, color: isDark ? "#ccc" : "#444",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = bg3}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <ProfileMenuIcon type="help" color={text4} />
                HELP CENTER
              </button>
              <div style={{ height: 1, background: borderColor }} />
              <button
                onClick={() => setProfileOpen(false)}
                style={{
                  width: "100%", height: 36, display: "flex", alignItems: "center", gap: 8,
                  padding: "0 16px", background: "transparent", border: "none", cursor: "pointer", borderRadius: 0,
                  fontFamily: "'Gotham', sans-serif", fontSize: 9, fontWeight: 700,
                  textTransform: "uppercase" as const, letterSpacing: 0.5, color: "#873025",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = bg3}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#873025" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                SIGN OUT
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProfileMenuIcon({ type, color }: { type: string; color: string }) {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "user":
      return <svg {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case "settings":
      return <svg {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "billing":
      return <svg {...props}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
    case "help":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
    default:
      return null;
  }
}
