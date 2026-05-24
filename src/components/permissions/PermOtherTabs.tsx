// Non-people tabs: Companies, Assets, Audit, Downloads, Notifications.
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  ChevronDown,
  Download,
  FileText,
  Folder,
  Pause,
  X,
} from "lucide-react";
import { AUDITS, CATS, DL_ALERTS, DL_LOG } from "@/data/permissions/permissions-mock";
import { alpha, c, F, roleC } from "./permissions-utils";
import { usePerm } from "./PermContext";
import { PermUserRow } from "./PermUserRow";
import { Drop, Toggle } from "./PermControls";

const sectionLbl: React.CSSProperties = {
  color: c.textDim,
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: "0.1em",
};

export function PermCompaniesTab() {
  const { co, compV, setCompV, getAS } = usePerm();

  if (compV) {
    const members = co[compV] || [];
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 32px 40px" }}>
        <button onClick={() => setCompV(null)} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.grayBlue, padding: "0 12px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 28, display: "flex", alignItems: "center", gap: 5, marginBottom: 16 }}>
          <ArrowLeft size={10} color={c.grayBlue} />
          ALL COMPANIES
        </button>
        <div style={{ border: `1px solid ${c.border}`, padding: "18px 20px", marginBottom: 14, background: c.bg2 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Building2 size={18} color={c.goldHi} />
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: c.text }}>{compV}</div>
                <div style={{ fontSize: 10, color: c.textDim, marginTop: 3 }}>
                  {members.filter((m) => m.status === "active").length} active ·{" "}
                  {members.reduce((s, m) => s + m.downloads, 0)} downloads
                </div>
              </div>
            </div>
            <button style={{ background: "transparent", border: `1px solid ${alpha(c.red, 27)}`, color: c.red, padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28, display: "flex", alignItems: "center", gap: 4 }}>
              <X size={12} color={c.red} />
              REVOKE ALL
            </button>
          </div>
        </div>
        <div style={{ border: `1px solid ${c.border}` }}>
          {members.map((u, i) => (
            <PermUserRow key={u.id} user={u} idx={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 32px 40px" }}>
      <div style={{ ...sectionLbl, padding: "8px 0 14px" }}>{Object.keys(co).length} ORGANIZATIONS</div>
      <div style={{ border: `1px solid ${c.border}` }}>
        {Object.entries(co).map(([name, members], idx) => {
          const aM = members.filter((m) => m.status === "active");
          const hA = members.some((m) => getAS(m.id) === "high");
          const roles = [...new Set(members.map((m) => m.role))];
          const cDl = members.reduce((s, m) => s + m.downloads, 0);
          return (
            <div
              key={name}
              onClick={() => setCompV(name)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 20px",
                gap: 16,
                borderTop: idx > 0 ? `1px solid ${c.border}` : "none",
                cursor: "pointer",
                background: hA ? c.alertBg : "transparent",
                borderLeft: hA ? `3px solid ${c.red}` : "3px solid transparent",
              }}
              onMouseEnter={(e) => { if (!hA) e.currentTarget.style.background = c.hoverRow; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = hA ? c.alertBg : "transparent"; }}
            >
              <div style={{ width: 38, height: 38, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={16} color={c.grayBlue} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{name}</div>
                <div style={{ fontSize: 10, color: c.textDim, marginTop: 3 }}>{aM.length} active · {roles.join(", ")}</div>
              </div>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: hA ? c.red : c.textDim, display: "flex", alignItems: "center", gap: 4 }}>
                <Download size={12} color={hA ? c.red : c.textDim} />
                {cDl}
              </span>
              <ChevronDown size={12} color={c.textDim} style={{ transform: "rotate(-90deg)" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PermAssetsTab() {
  const {
    users,
    perms,
    collCats,
    toggleAssetCat,
    assetExp,
    setAssetExp,
    getUsersForAsset,
    setAssetPerm,
    pauseUser,
  } = usePerm();
  const totalU = users.filter((u) => u.status === "active").length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 32px 40px" }}>
      <div style={{ ...sectionLbl, letterSpacing: "0.08em", padding: "8px 0 14px" }}>
        ASSET-CENTRIC ACCESS — Click any item to manage access
      </div>
      {CATS.filter((cat) => !cat.locked).map((cat) => {
        const isCatCol = collCats.has(`asset_${cat.key}`);
        return (
          <div key={cat.key} style={{ marginBottom: 14 }}>
            <div onClick={() => toggleAssetCat(cat.key)} style={{ padding: "10px 0 6px", borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div style={{ transform: isCatCol ? "rotate(-90deg)" : "rotate(0)", transition: "transform 0.15s", display: "flex" }}>
                <ChevronDown size={10} color={c.textDim} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: c.goldHi, letterSpacing: "0.06em" }}>{cat.label}</span>
              <span style={{ fontSize: 10, color: c.textDim }}>{cat.desc}</span>
            </div>
            {!isCatCol &&
              cat.items.map((item, j) => {
                const isExp = assetExp === item.id;
                const usersWithAccess = getUsersForAsset(item.id);
                return (
                  <div key={item.id} style={{ borderBottom: `1px solid ${c.borderLt}`, background: isExp ? c.bgExp : j % 2 === 1 ? c.rowAlt : "transparent" }}>
                    <div onClick={() => setAssetExp(isExp ? null : item.id)} style={{ display: "flex", alignItems: "center", padding: "10px 16px", cursor: "pointer", gap: 12 }}>
                      <Folder size={14} color={usersWithAccess.length > 0 ? c.goldDim : c.textDim} />
                      <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: c.text }}>{item.name}</span>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: usersWithAccess.length > 0 ? c.green : c.textDim, fontWeight: 600 }}>
                        {usersWithAccess.length}
                        <span style={{ color: c.textDim, fontWeight: 400 }}>/{totalU}</span>
                      </span>
                      <div style={{ transform: isExp ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s", display: "flex" }}>
                        <ChevronDown size={12} color={c.textDim} />
                      </div>
                    </div>
                    {isExp && (
                      <div style={{ padding: "4px 16px 14px", borderTop: `1px solid ${c.border}` }}>
                        {usersWithAccess.length > 0 ? (
                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: c.grayBlue, letterSpacing: "0.06em", marginBottom: 6 }}>USERS WITH ACCESS</div>
                            {usersWithAccess.map((u, ui) => (
                              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderTop: ui > 0 ? `1px solid ${c.borderLt}` : "none" }}>
                                <div style={{ width: 24, height: 24, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: c.grayBlue, flexShrink: 0 }}>{u.av}</div>
                                <div style={{ flex: 1 }}>
                                  <span style={{ fontSize: 11, fontWeight: 600, color: c.text }}>{u.name}</span>
                                  <span style={{ color: c.slash, margin: "0 6px" }}>/</span>
                                  <span style={{ fontSize: 10, color: roleC(u.role) }}>{u.role}</span>
                                </div>
                                <Drop value={perms[u.id][item.id]} onChange={(v) => setAssetPerm(item.id, u.id, v)} />
                                <button onClick={() => pauseUser(u.id)} style={{ background: "transparent", border: `1px solid ${alpha(c.amber, 20)}`, color: c.amber, padding: "0 8px", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 20, display: "flex", alignItems: "center", gap: 3 }}>
                                  <Pause size={8} color={c.amber} />
                                  PAUSE
                                </button>
                                <button onClick={() => setAssetPerm(item.id, u.id, "No Access")} style={{ background: "transparent", border: `1px solid ${alpha(c.red, 20)}`, color: c.red, padding: "0 8px", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 20, display: "flex", alignItems: "center", gap: 3 }}>
                                  <X size={8} color={c.red} />
                                  REVOKE
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: 10, color: c.textDim, padding: "10px 0" }}>No users have access to this item.</div>
                        )}
                        <div style={{ marginTop: 10 }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: c.textDim, letterSpacing: "0.06em", marginBottom: 6 }}>GRANT ACCESS</div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            {users
                              .filter((u) => u.status === "active" && perms[u.id] && perms[u.id][item.id] === "No Access")
                              .slice(0, 8)
                              .map((u) => (
                                <button key={u.id} onClick={() => setAssetPerm(item.id, u.id, "Can View")} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textSec, padding: "0 10px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 24, display: "flex", alignItems: "center", gap: 4 }}>
                                  <span style={{ fontSize: 8, fontWeight: 700 }}>{u.av}</span>
                                  {u.name}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

export function PermAuditTab() {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 32px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={sectionLbl}>IMMUTABLE AUDIT LOG</div>
        <button style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.grayBlue, padding: "0 12px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 26, display: "flex", alignItems: "center", gap: 5 }}>
          <FileText size={12} color={c.grayBlue} />
          EXPORT CSV
        </button>
      </div>
      <div style={{ border: `1px solid ${c.border}` }}>
        {AUDITS.map((e, i) => (
          <div key={i} style={{ display: "flex", borderTop: i > 0 ? `1px solid ${c.borderLt}` : "none", fontSize: 11, background: e.alert ? c.alertBg : i % 2 === 1 ? c.rowAlt : "transparent" }}>
            <span style={{ color: c.textDim, fontFamily: "monospace", fontSize: 10, padding: "9px 14px", width: 150, flexShrink: 0, borderRight: `1px solid ${c.borderLt}` }}>{e.ts}</span>
            <span style={{ color: e.alert ? c.red : c.goldDim, fontWeight: 600, padding: "9px 14px", width: 190, flexShrink: 0, borderRight: `1px solid ${c.borderLt}` }}>
              {e.who}{e.role ? ` / ${e.role}` : ""}
            </span>
            <span style={{ color: e.alert ? c.red : c.text, padding: "9px 14px", flex: 1, fontWeight: e.alert ? 600 : 400, display: "flex", alignItems: "center", gap: 5 }}>
              {e.alert && <AlertTriangle size={12} color={c.red} />}
              {e.act}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PermDownloadsTab() {
  const { users, dlExpId, setDlExpId, getAS, pauseUser } = usePerm();
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 32px 40px" }}>
      {DL_ALERTS.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...sectionLbl, color: c.red, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
            <AlertTriangle size={12} color={c.red} />
            ACTIVE ALERTS
          </div>
          {DL_ALERTS.map((a: { ts: string; uid: number; type: string; msg: string; sev: string }, i: number) => {
            const u = users.find((x) => x.id === a.uid);
            return (
              <div key={i} style={{ padding: "12px 16px", marginBottom: 6, background: a.sev === "high" ? c.alertBg : c.warnBg, border: `1px solid ${a.sev === "high" ? c.alertBorder : c.warnBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <AlertTriangle size={14} color={a.sev === "high" ? c.red : c.amber} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: a.sev === "high" ? c.red : c.amber }}>{a.type} — {u?.name} ({u?.company})</div>
                    <div style={{ fontSize: 10, color: c.textSec, marginTop: 3 }}>{a.msg}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button style={{ background: c.red, border: "none", color: "#fff", padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28 }}>REVOKE</button>
                  <button onClick={() => { if (u) pauseUser(u.id); }} style={{ background: "transparent", border: `1px solid ${c.amber}`, color: c.amber, padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28 }}>PAUSE</button>
                  <button style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textSec, padding: "0 14px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 28 }}>DISMISS</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ ...sectionLbl, marginBottom: 10 }}>DOWNLOAD ACTIVITY BY USER</div>
      <div style={{ border: `1px solid ${c.border}` }}>
        <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", background: c.bg3, borderBottom: `1px solid ${c.border}`, fontSize: 8, fontWeight: 700, color: c.textDim, letterSpacing: "0.06em" }}>
          <span style={{ flex: 1 }}>USER / COMPANY</span>
          <span style={{ width: 80, textAlign: "center" }}>ROLE</span>
          <span style={{ width: 80, textAlign: "center" }}>DOWNLOADS</span>
          <span style={{ width: 130, textAlign: "center" }}>LAST DOWNLOAD</span>
          <span style={{ width: 80, textAlign: "center" }}>STATUS</span>
        </div>
        {users
          .filter((u) => u.status === "active" || u.status === "paused")
          .sort((a, b) => b.downloads - a.downloads)
          .map((user, idx) => {
            const aS2 = getAS(user.id);
            const isE = dlExpId === user.id;
            const uDl = DL_LOG.filter((d) => d.uid === user.id);
            return (
              <div key={user.id}>
                <div onClick={() => setDlExpId(isE ? null : user.id)} style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderTop: idx > 0 ? `1px solid ${c.borderLt}` : "none", background: aS2 === "high" ? c.alertBg : idx % 2 === 1 ? c.rowAlt : "transparent", cursor: "pointer", borderLeft: aS2 === "high" ? `3px solid ${c.red}` : aS2 === "medium" ? `3px solid ${c.amber}` : "3px solid transparent" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: c.grayBlue, border: `1px solid ${c.border}` }}>{user.av}</div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: user.status === "paused" ? c.amber : c.text }}>{user.name}</span>
                      {user.status === "paused" && <span style={{ fontSize: 8, color: c.amber, marginLeft: 6 }}>PAUSED</span>}
                      <div style={{ fontSize: 9, color: c.textDim }}>{user.company}</div>
                    </div>
                  </div>
                  <span style={{ width: 80, textAlign: "center", fontSize: 10, color: roleC(user.role) }}>{user.role}</span>
                  <span style={{ width: 80, textAlign: "center", fontSize: 14, fontWeight: 700, fontFamily: "monospace", color: aS2 === "high" ? c.red : aS2 === "medium" ? c.amber : c.text }}>{user.downloads}</span>
                  <span style={{ width: 130, textAlign: "center", fontSize: 10, fontFamily: "monospace", color: c.textDim }}>{user.lastDl || "—"}</span>
                  <span style={{ width: 80, textAlign: "center" }}>
                    {aS2 === "high" && <span style={{ fontSize: 8, fontWeight: 700, color: c.red, padding: "2px 8px", border: `1px solid ${alpha(c.red, 27)}` }}>FLAGGED</span>}
                    {aS2 === "medium" && <span style={{ fontSize: 8, fontWeight: 700, color: c.amber, padding: "2px 8px", border: `1px solid ${alpha(c.amber, 27)}` }}>ELEVATED</span>}
                    {!aS2 && <span style={{ fontSize: 8, color: c.green }}>NORMAL</span>}
                  </span>
                </div>
                {isE && uDl.length > 0 && (
                  <div style={{ padding: "4px 16px 12px 52px", borderTop: `1px solid ${c.borderLt}` }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: c.textDim, letterSpacing: "0.06em", padding: "8px 0 6px" }}>FILES DOWNLOADED</div>
                    {uDl.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", borderTop: i > 0 ? `1px solid ${c.borderLt}` : "none", fontSize: 10, padding: "4px 0" }}>
                        <span style={{ fontFamily: "monospace", color: c.textDim, fontSize: 9, width: 130, flexShrink: 0 }}>{d.ts}</span>
                        <span style={{ color: d.flag ? c.red : c.text, flex: 1, fontWeight: d.flag ? 600 : 400, display: "flex", alignItems: "center", gap: 4 }}>
                          {d.flag && <AlertTriangle size={9} color={c.red} />}
                          {d.file}
                        </span>
                        <span style={{ fontFamily: "monospace", color: c.textDim, fontSize: 9, width: 70, textAlign: "right" }}>{d.size}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export function PermNotificationsTab() {
  const { notif, setNotif } = usePerm();
  const groupBox: React.CSSProperties = { flex: "1 1 280px", border: `1px solid ${c.border}`, background: c.bg2, padding: 20 };
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 32px 40px" }}>
      <div style={{ ...sectionLbl, marginBottom: 16 }}>NOTIFICATION PREFERENCES</div>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
        <div style={groupBox}>
          <div style={{ fontSize: 10, fontWeight: 700, color: c.goldHi, letterSpacing: "0.06em", marginBottom: 12 }}>PERMISSION EVENTS</div>
          <Toggle on={notif.permChange} onToggle={() => setNotif((p) => ({ ...p, permChange: !p.permChange }))} label="Permission level changed" />
          <Toggle on={notif.newInvite} onToggle={() => setNotif((p) => ({ ...p, newInvite: !p.newInvite }))} label="New user invited" />
          <Toggle on={notif.accessRevoked} onToggle={() => setNotif((p) => ({ ...p, accessRevoked: !p.accessRevoked }))} label="Access revoked, paused, or expired" />
          <Toggle on={notif.vendorExpiry} onToggle={() => setNotif((p) => ({ ...p, vendorExpiry: !p.vendorExpiry }))} label="Vendor access nearing expiry" />
          <Toggle on={notif.vendorDepart} onToggle={() => setNotif((p) => ({ ...p, vendorDepart: !p.vendorDepart }))} label="Vendor member departure" />
        </div>
        <div style={groupBox}>
          <div style={{ fontSize: 10, fontWeight: 700, color: c.red, letterSpacing: "0.06em", marginBottom: 12 }}>SECURITY ALERTS</div>
          <Toggle on={notif.downloadAlert} onToggle={() => setNotif((p) => ({ ...p, downloadAlert: !p.downloadAlert }))} label="Any file downloaded" />
          <Toggle on={notif.bulkDownload} onToggle={() => setNotif((p) => ({ ...p, bulkDownload: !p.bulkDownload }))} label="Bulk download detected (HIGH)" />
          <Toggle on={notif.systemAlert} onToggle={() => setNotif((p) => ({ ...p, systemAlert: !p.systemAlert }))} label="System auto-revocation events" />
        </div>
        <div style={groupBox}>
          <div style={{ fontSize: 10, fontWeight: 700, color: c.grayBlue, letterSpacing: "0.06em", marginBottom: 12 }}>PLATFORM EVENTS</div>
          <Toggle on={notif.hiveReview} onToggle={() => setNotif((p) => ({ ...p, hiveReview: !p.hiveReview }))} label="H.I.V.E. review cycle notifications" />
        </div>
      </div>
    </div>
  );
}
