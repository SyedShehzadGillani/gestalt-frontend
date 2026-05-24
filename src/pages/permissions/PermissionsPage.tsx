import { AlertTriangle, Check, Clock, Shield, X } from "lucide-react";
import {
  AccessLevel,
  DL_ALERTS,
  INVITE_COMPANY,
  LEVELS,
  PermTab,
  TABS,
} from "@/data/permissions/permissions-mock";
import { alpha, c, F, lvlC } from "@/components/permissions/permissions-utils";
import { PermProvider, usePerm } from "@/components/permissions/PermContext";
import { Chk } from "@/components/permissions/PermControls";
import { PermUserRow } from "@/components/permissions/PermUserRow";
import { PermDetailPanel } from "@/components/permissions/PermDetailPanel";
import { PermInviteModal } from "@/components/permissions/PermInviteModal";
import {
  PermAssetsTab,
  PermAuditTab,
  PermCompaniesTab,
  PermDownloadsTab,
  PermNotificationsTab,
} from "@/components/permissions/PermOtherTabs";
import "@/components/permissions/permissions.css";

const ALL_ROLES = [
  "ALL",
  "GESTALT HQ",
  "CEO",
  "ADMIN",
  "IT SUPPORT",
  "ATTORNEY",
  "MANAGER",
  "EMPLOYEE",
  "VENDOR",
];

function Toolbar() {
  const { killC, setKillC, openInvite } = usePerm();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: `1px solid ${c.border}`, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: c.text, fontSize: 14, fontWeight: 600 }}>{INVITE_COMPANY}</span>
        <span style={{ color: c.grayBlue, fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", padding: "0 10px", border: `1px solid ${c.border}`, height: 24, display: "flex", alignItems: "center", gap: 5 }}>
          <Shield size={12} color={c.grayBlue} />
          PERMISSIONS
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <button onClick={() => setKillC(!killC)} style={{ background: "transparent", border: `1px solid ${alpha(c.red, 27)}`, color: c.red, padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 5 }}>
            <X size={12} color={c.red} />
            KILL SWITCH
          </button>
          {killC && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 1000, background: c.bg2, border: `1px solid ${c.red}`, padding: 20, width: 320, boxShadow: c.dropShadow }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.red, marginBottom: 8 }}>CONFIRM KILL SWITCH</div>
              <div style={{ fontSize: 10, color: c.textSec, marginBottom: 14, lineHeight: 1.6 }}>
                Immediately revokes ALL external access. Logged and immutable.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: c.red, border: "none", color: "#fff", padding: "0 16px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28 }}>DISABLE ALL EXTERNAL</button>
                <button onClick={() => setKillC(false)} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textDim, padding: "0 16px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 28 }}>CANCEL</button>
              </div>
            </div>
          )}
        </div>
        <button onClick={openInvite} style={{ background: c.goldHi, border: "none", color: c.onGold, padding: "0 16px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28, letterSpacing: "0.06em" }}>
          + INVITE
        </button>
      </div>
    </div>
  );
}

function AlertBanners() {
  const { pendA, flagU, appInv, rejInv, users, setTab } = usePerm();
  return (
    <>
      {pendA.length > 0 && (
        <div style={{ padding: "10px 32px", background: c.warnBg, borderBottom: `1px solid ${c.warnBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock size={14} color={c.orange} />
            <span style={{ fontSize: 11, fontWeight: 600, color: c.orange }}>
              {pendA.length} INVITE{pendA.length > 1 ? "S" : ""} AWAITING CEO APPROVAL
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {pendA.map((u) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: c.text }}>{u.name}</span>
                <button onClick={() => appInv(u.id)} style={{ background: c.green, border: "none", color: "#fff", padding: "0 10px", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 22, display: "flex", alignItems: "center", gap: 3 }}>
                  <Check size={8} color="#fff" />
                  APPROVE
                </button>
                <button onClick={() => rejInv(u.id)} style={{ background: "transparent", border: `1px solid ${alpha(c.red, 27)}`, color: c.red, padding: "0 10px", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 22, display: "flex", alignItems: "center", gap: 3 }}>
                  <X size={8} color={c.red} />
                  REJECT
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {flagU.length > 0 && (
        <div style={{ padding: "10px 32px", background: c.alertBg, borderBottom: `1px solid ${c.alertBorder}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0, flexWrap: "wrap" }}>
          <AlertTriangle size={14} color={c.red} />
          <span style={{ fontSize: 11, fontWeight: 700, color: c.red }}>SUSPICIOUS DOWNLOAD ACTIVITY</span>
          <span style={{ color: c.textDim }}>—</span>
          {DL_ALERTS.filter((a) => a.sev === "high").map((a, i) => {
            const u = users.find((x) => x.id === a.uid);
            return u ? (
              <span key={i} style={{ fontSize: 10, color: c.text }}>
                <strong>{u.name}</strong> — {a.msg}
              </span>
            ) : null;
          })}
          <button onClick={() => setTab("downloads")} style={{ marginLeft: "auto", background: "transparent", border: `1px solid ${alpha(c.red, 27)}`, color: c.red, padding: "0 12px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 24 }}>
            VIEW DETAILS
          </button>
        </div>
      )}
    </>
  );
}

function TabAndStats() {
  const { tab, setTab, actU, pausedU, flagU, totDl, aiSeatCost, noConsent } = usePerm();
  const stats = [
    { l: "ACTIVE", v: actU.length },
    { l: "PAUSED", v: pausedU.length },
    { l: "FLAGGED", v: flagU.length },
    { l: "DOWNLOADS", v: totDl },
    { l: "AI SEATS", v: "$" + aiSeatCost + "/mo" },
    { l: "NO CONSENT", v: noConsent.length },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", borderBottom: `1px solid ${c.border}`, background: c.bg2, flexShrink: 0, flexWrap: "wrap" }}>
      <div style={{ display: "flex" }}>
        {TABS.map((v) => {
          const act = tab === v;
          return (
            <button key={v} onClick={() => setTab(v as PermTab)} style={{ background: "transparent", color: act ? c.goldHi : c.textDim, border: "none", padding: "12px 20px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: F, letterSpacing: "0.1em", position: "relative", borderBottom: act ? `2px solid ${c.goldHi}` : "2px solid transparent", transition: "all 150ms ease" }}>
              {v.toUpperCase()}
              {v === "downloads" && flagU.length > 0 && (
                <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, background: c.red, borderRadius: "50%" }} />
              )}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ color: s.l === "FLAGGED" && (s.v as number) > 0 ? c.red : c.textDim, fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>{s.v}</span>
            <span style={{ color: c.textDim, fontSize: 7, fontWeight: 600, letterSpacing: "0.1em" }}>{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterBar() {
  const { tab, selected, filt, selAll, search, setSearch, statusF, setStatusF, roleF, setRoleF } = usePerm();
  if (tab !== "people" && tab !== "downloads") return null;
  return (
    <div style={{ padding: "12px 32px", borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center", gap: 16, flexShrink: 0, flexWrap: "wrap" }}>
      {tab === "people" && <Chk checked={selected.size === filt.length && filt.length > 0} onChange={selAll} />}
      <input type="text" placeholder="Search name, email, company..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ background: c.inputBg, border: `1px solid ${c.border}`, color: c.text, padding: "6px 14px", fontSize: 11, fontFamily: F, width: 220, outline: "none" }} />
      {tab === "people" && (
        <>
          <div style={{ display: "flex", gap: 3, padding: 2, border: `1px solid ${c.border}`, background: c.bg }}>
            {["ALL", "ACTIVE", "PAUSED", "PENDING", "DEPARTED"].map((s) => {
              const act = statusF === s;
              return (
                <button key={s} onClick={() => setStatusF(s)} style={{ background: act ? alpha(c.gold, 8) : "transparent", color: act ? c.goldHi : c.textDim, border: "none", padding: "0 12px", fontSize: 9, fontWeight: act ? 700 : 500, cursor: "pointer", fontFamily: F, height: 26, transition: "all 150ms ease" }}>
                  {s}
                </button>
              );
            })}
          </div>
          <div style={{ width: 1, height: 20, background: c.border }} />
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {ALL_ROLES.map((r) => {
              const act = roleF === r;
              return (
                <button key={r} onClick={() => setRoleF(r)} style={{ background: act ? alpha(c.gold, 7) : "transparent", color: act ? c.goldHi : c.textDim, border: `1px solid ${act ? alpha(c.gold, 20) : "transparent"}`, padding: "0 10px", fontSize: 9, fontWeight: act ? 700 : 500, cursor: "pointer", fontFamily: F, height: 26, transition: "all 150ms ease" }}>
                  {r}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function BulkBar() {
  const { tab, selected, bulkSetLevel, bulkPause, bulkRevoke, clearSel } = usePerm();
  if (tab !== "people" || selected.size === 0) return null;
  return (
    <div style={{ padding: "10px 32px", background: alpha(c.gold, 4), borderBottom: `1px solid ${alpha(c.gold, 13)}`, display: "flex", alignItems: "center", gap: 14, flexShrink: 0, flexWrap: "wrap" }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: c.goldHi }}>{selected.size} SELECTED</span>
      <div style={{ width: 1, height: 18, background: c.border }} />
      {LEVELS.map((l: AccessLevel) => (
        <button key={l} onClick={() => bulkSetLevel(l)} style={{ background: "transparent", border: `1px solid ${c.border}`, color: lvlC(l), padding: "0 8px", fontSize: 8, fontFamily: F, fontWeight: 700, cursor: "pointer", height: 22 }}>
          {l}
        </button>
      ))}
      <div style={{ width: 1, height: 18, background: c.border }} />
      <button onClick={bulkPause} style={{ background: "transparent", border: `1px solid ${alpha(c.amber, 27)}`, color: c.amber, padding: "0 10px", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 22 }}>PAUSE</button>
      <button onClick={bulkRevoke} style={{ background: "transparent", border: `1px solid ${alpha(c.red, 27)}`, color: c.red, padding: "0 10px", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 22 }}>REVOKE ALL</button>
      <button style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.grayBlue, padding: "0 10px", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 22 }}>EXPORT</button>
      <button onClick={clearSel} style={{ marginLeft: "auto", background: "transparent", border: "none", color: c.textDim, fontSize: 8, cursor: "pointer", fontFamily: F }}>CLEAR</button>
    </div>
  );
}

function ContentArea() {
  const { tab, selUser, filt } = usePerm();
  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
      {tab === "people" && (
        <div style={{ width: selUser != null ? "45%" : "100%", minWidth: selUser != null ? 380 : 0, borderRight: selUser != null ? `1px solid ${c.border}` : "none", overflowY: "auto", transition: "width 0.2s ease" }}>
          <div style={{ padding: "10px 32px 6px" }}>
            <span style={{ color: c.textDim, fontSize: 9, fontWeight: 600, letterSpacing: "0.08em" }}>
              {filt.length} {filt.length === 1 ? "PERSON" : "PEOPLE"}
            </span>
          </div>
          <div style={{ margin: "0 32px 40px", border: `1px solid ${c.border}` }}>
            {filt.map((u, i) => (
              <PermUserRow key={u.id} user={u} idx={i} />
            ))}
          </div>
        </div>
      )}
      {tab === "people" && selUser != null && <PermDetailPanel />}
      {tab === "companies" && <PermCompaniesTab />}
      {tab === "assets" && <PermAssetsTab />}
      {tab === "audit" && <PermAuditTab />}
      {tab === "downloads" && <PermDownloadsTab />}
      {tab === "notifications" && <PermNotificationsTab />}
    </div>
  );
}

function PermLayout() {
  return (
    <div className="perms-scope">
      <Toolbar />
      <PermInviteModal />
      <AlertBanners />
      <TabAndStats />
      <FilterBar />
      <BulkBar />
      <ContentArea />
      <div style={{ borderTop: `1px solid ${c.border}`, padding: "10px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: c.textDim, fontSize: 8, letterSpacing: "0.1em" }}>© 2026 GESTALT PARTNERS</span>
        <span style={{ color: c.textDim, fontSize: 8 }}>PRODUCT BIBLE v2.2</span>
      </div>
    </div>
  );
}

export default function PermissionsPage() {
  return (
    <PermProvider>
      <PermLayout />
    </PermProvider>
  );
}
