import { ArrowLeft, Check, Clock, Download, FileText, X } from "lucide-react";
import {
  INVITE_COMPANY,
  LOCS,
  PermRole,
} from "@/data/permissions/permissions-mock";
import { alpha, c, F, InviteRow } from "./permissions-utils";
import { usePerm } from "./PermContext";

const AI_TIERS = ["STANDARD $29", "STRATEGIST $79", "POWER $149", "UNLIMITED $299"];
const INVITE_ROLES: PermRole[] = ["EMPLOYEE", "MANAGER", "ADMIN", "VENDOR"];
const HRIS = [
  { name: "BambooHR", desc: "Full roster + org chart sync" },
  { name: "ADP Workforce", desc: "Employee records + department mapping" },
  { name: "Workday", desc: "Enterprise HR + compensation tiers" },
  { name: "Gusto", desc: "SMB payroll + employee directory" },
  { name: "Rippling", desc: "IT + HR unified employee data" },
  { name: "Namely", desc: "Mid-market HR + onboarding" },
];

const lbl: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  color: c.textDim,
  letterSpacing: "0.06em",
  marginBottom: 6,
};

function downloadTemplate() {
  const csv =
    "First Name,Last Name,Email,Role,Location,AI Status\nJohn,Smith,john@company.com,EMPLOYEE,Downtown Clinic,STANDARD\nJane,Doe,jane@company.com,MANAGER,Corporate HQ,STRATEGIST\n";
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gestalt-invite-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function PermInviteModal() {
  const {
    inviteOpen,
    closeInvite,
    inviteMode,
    setInviteMode,
    inviteStep,
    setInviteStep,
    inviteSingle,
    setInviteSingle,
    submitSingle,
    pasteText,
    setPasteText,
    handleParsePaste,
    handleCsvUpload,
    bulkDefaults,
    setBulkDefaults,
    invitePreview,
    setInvitePreview,
    removePreviewRow,
    updatePreviewRow,
    sendInvites,
  } = usePerm();

  if (!inviteOpen) return null;
  const readyCount = invitePreview.filter((r) => r.valid && !r.duplicate).length;

  return (
    <>
      <div onClick={closeInvite} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 2000 }} />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 2001,
          background: c.bg2,
          border: `1px solid ${c.border}`,
          width: "min(720px, calc(100vw - 40px))",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: c.dropShadow,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${c.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: c.text }}>Invite People</span>
            {inviteStep === 2 && <span style={{ fontSize: 10, color: c.goldHi, fontWeight: 600 }}>{readyCount} ready to send</span>}
            {inviteStep === 3 && <span style={{ fontSize: 10, color: c.green, fontWeight: 600 }}>Invitations sent</span>}
          </div>
          <button onClick={closeInvite} style={{ background: "transparent", border: `1px solid ${c.border}`, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={12} color={c.textDim} />
          </button>
        </div>

        {inviteStep === 1 && (
          <div style={{ overflowY: "auto", flex: 1 }}>
            <div style={{ display: "flex", padding: "0 24px", borderBottom: `1px solid ${c.border}` }}>
              {[
                { k: "single", l: "SINGLE INVITE" },
                { k: "paste", l: "PASTE LIST" },
                { k: "csv", l: "CSV UPLOAD" },
                { k: "hris", l: "HRIS SYNC" },
              ].map((m) => (
                <button
                  key={m.k}
                  onClick={() => setInviteMode(m.k)}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: inviteMode === m.k ? `2px solid ${c.goldHi}` : "2px solid transparent",
                    color: inviteMode === m.k ? c.goldHi : c.textDim,
                    padding: "12px 20px",
                    fontSize: 9,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: F,
                    letterSpacing: "0.08em",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {m.l}
                  {m.k === "hris" && (
                    <span style={{ fontSize: 7, color: c.amber, fontWeight: 700, padding: "1px 5px", border: `1px solid ${alpha(c.amber, 27)}` }}>COMING SOON</span>
                  )}
                </button>
              ))}
            </div>

            {inviteMode === "single" && (
              <div style={{ padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={lbl}>FULL NAME</div>
                    <input type="text" value={inviteSingle.name} onChange={(e) => setInviteSingle((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Sarah Mitchell" style={{ width: "100%", background: c.inputBg, border: `1px solid ${c.border}`, color: c.text, padding: "8px 12px", fontSize: 11, fontFamily: F, outline: "none" }} />
                  </div>
                  <div>
                    <div style={lbl}>EMAIL</div>
                    <input type="email" value={inviteSingle.email} onChange={(e) => setInviteSingle((p) => ({ ...p, email: e.target.value }))} placeholder="sarah@northgatesolutions.com" style={{ width: "100%", background: c.inputBg, border: `1px solid ${c.border}`, color: c.text, padding: "8px 12px", fontSize: 11, fontFamily: F, outline: "none" }} />
                  </div>
                  <div>
                    <div style={lbl}>ROLE</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {INVITE_ROLES.map((r) => (
                        <button key={r} onClick={() => setInviteSingle((p) => ({ ...p, role: r }))} style={{ background: inviteSingle.role === r ? alpha(c.gold, 8) : "transparent", border: `1px solid ${inviteSingle.role === r ? alpha(c.gold, 27) : c.border}`, color: inviteSingle.role === r ? c.goldHi : c.textDim, padding: "0 10px", fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: F, height: 28 }}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={lbl}>LOCATION</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {LOCS.map((loc) => (
                        <button key={loc} onClick={() => setInviteSingle((p) => ({ ...p, location: p.location === loc ? "" : loc }))} style={{ background: inviteSingle.location === loc ? alpha(c.green, 5) : "transparent", border: `1px solid ${inviteSingle.location === loc ? alpha(c.green, 27) : c.border}`, color: inviteSingle.location === loc ? c.green : c.textDim, padding: "0 8px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 28 }}>
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={lbl}>AI STATUS</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {AI_TIERS.map((t) => {
                        const k = t.split(" ")[0];
                        return (
                          <button key={k} onClick={() => setInviteSingle((p) => ({ ...p, aiStatus: k }))} style={{ background: inviteSingle.aiStatus === k ? alpha(c.gold, 8) : "transparent", border: `1px solid ${inviteSingle.aiStatus === k ? alpha(c.gold, 27) : c.border}`, color: inviteSingle.aiStatus === k ? c.goldHi : c.textDim, padding: "0 12px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 28, fontWeight: 600 }}>
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, gap: 8 }}>
                  <button onClick={closeInvite} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textDim, padding: "0 16px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 32 }}>CANCEL</button>
                  <button onClick={submitSingle} style={{ background: c.goldHi, border: "none", color: c.onGold, padding: "0 20px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 32 }}>REVIEW</button>
                </div>
              </div>
            )}

            {inviteMode === "paste" && (
              <div style={{ padding: 24 }}>
                <div style={lbl}>PASTE EMAILS — one per line, or comma/tab separated</div>
                <div style={{ fontSize: 10, color: c.textDim, marginBottom: 12, lineHeight: 1.6 }}>
                  Accepted formats: "email" or "Name, email" or "Name &lt;tab&gt; email" — paste directly from
                  Excel, Google Sheets, or any list.
                </div>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={"John Smith, john@northgatesolutions.com\nJane Doe, jane@northgatesolutions.com\nsarah@northgatesolutions.com\n\n— or paste a column from Excel/Sheets"}
                  style={{ width: "100%", minHeight: 180, background: c.inputBg, border: `1px solid ${c.border}`, color: c.text, padding: "12px 14px", fontSize: 11, fontFamily: "monospace", outline: "none", resize: "vertical", lineHeight: 1.8 }}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 8 }}>
                  <BulkDefaultPills />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={closeInvite} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textDim, padding: "0 16px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 32 }}>CANCEL</button>
                    <button onClick={handleParsePaste} disabled={!pasteText.trim()} style={{ background: pasteText.trim() ? c.goldHi : alpha(c.goldHi, 27), border: "none", color: c.onGold, padding: "0 20px", fontSize: 9, fontWeight: 700, cursor: pasteText.trim() ? "pointer" : "not-allowed", fontFamily: F, height: 32 }}>
                      PARSE &amp; REVIEW
                    </button>
                  </div>
                </div>
              </div>
            )}

            {inviteMode === "csv" && (
              <div style={{ padding: 24 }}>
                <div style={lbl}>UPLOAD CSV FILE</div>
                <div style={{ fontSize: 10, color: c.textDim, marginBottom: 16, lineHeight: 1.6 }}>
                  Upload a .csv file with columns for name and email. The parser will auto-detect columns — no
                  specific header names required. Optional columns: role, department, location.
                </div>
                <label style={{ display: "block", border: `2px dashed ${c.border}`, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: c.bg }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                    <FileText size={28} color={c.textDim} />
                  </div>
                  <div style={{ fontSize: 12, color: c.text, fontWeight: 600, marginBottom: 6 }}>Drop CSV here or click to browse</div>
                  <div style={{ fontSize: 10, color: c.textDim }}>Accepts .csv and .txt files</div>
                  <input type="file" accept=".csv,.txt" onChange={handleCsvUpload} style={{ display: "none" }} />
                </label>
                <div style={{ marginTop: 20, padding: "12px 16px", border: `1px solid ${c.border}`, background: c.bg }}>
                  <div style={{ ...lbl, color: c.goldHi, marginBottom: 8 }}>DOWNLOAD TEMPLATE</div>
                  <div style={{ fontSize: 10, color: c.textSec, lineHeight: 1.6, marginBottom: 10 }}>Pre-formatted CSV with the correct columns. Fill it in and upload.</div>
                  <button onClick={downloadTemplate} style={{ background: "transparent", border: `1px solid ${alpha(c.goldHi, 27)}`, color: c.goldHi, padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28, display: "flex", alignItems: "center", gap: 5 }}>
                    <Download size={10} color={c.goldHi} />
                    DOWNLOAD TEMPLATE.CSV
                  </button>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                  <BulkDefaultPills />
                </div>
              </div>
            )}

            {inviteMode === "hris" && (
              <div style={{ padding: 24 }}>
                <div style={lbl}>CONNECT YOUR HR SYSTEM</div>
                <div style={{ fontSize: 10, color: c.textDim, marginBottom: 20, lineHeight: 1.6 }}>
                  Automatically sync your employee roster from your HRIS. New hires added as PENDING. Departures
                  flagged for review. Roles, departments, and locations sync automatically.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {HRIS.map((hr) => (
                    <div key={hr.name} style={{ padding: "14px 16px", border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 0.5 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{hr.name}</div>
                        <div style={{ fontSize: 9, color: c.textDim, marginTop: 2 }}>{hr.desc}</div>
                      </div>
                      <button disabled style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textDim, padding: "0 12px", fontSize: 8, fontWeight: 700, cursor: "not-allowed", fontFamily: F, height: 26, opacity: 0.5 }}>CONNECT</button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, padding: "10px 14px", border: `1px solid ${alpha(c.amber, 13)}`, background: alpha(c.amber, 4), display: "flex", alignItems: "center", gap: 10 }}>
                  <Clock size={14} color={c.amber} />
                  <div style={{ fontSize: 10, color: c.amber }}>HRIS integration is on the Phase 2 roadmap. Use CSV Upload or Paste List for bulk onboarding today.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {inviteStep === 2 && (
          <div style={{ overflowY: "auto", flex: 1 }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 10, color: c.text, fontWeight: 600 }}>{invitePreview.length} parsed</span>
                {invitePreview.some((r) => r.duplicate) && (
                  <span style={{ fontSize: 9, color: c.amber, fontWeight: 600 }}>{invitePreview.filter((r) => r.duplicate).length} duplicates</span>
                )}
              </div>
              <button onClick={() => { setInviteStep(1); setInvitePreview([]); }} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textDim, padding: "0 12px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 26, display: "flex", alignItems: "center", gap: 4 }}>
                <ArrowLeft size={10} color={c.textDim} />
                BACK
              </button>
            </div>
            <div style={{ padding: "0 24px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0", fontSize: 8, fontWeight: 700, color: c.textDim, letterSpacing: "0.06em", borderBottom: `1px solid ${c.border}` }}>
                <span style={{ width: 28 }} />
                <span style={{ flex: 2, paddingLeft: 8 }}>NAME</span>
                <span style={{ flex: 3 }}>EMAIL</span>
                <span style={{ flex: 1 }}>ROLE</span>
                <span style={{ flex: 1 }}>AI STATUS</span>
                <span style={{ width: 60, textAlign: "center" }}>STATUS</span>
                <span style={{ width: 30 }} />
              </div>
              {invitePreview.map((row, i) => (
                <div key={row.id} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${c.borderLt}`, background: row.duplicate ? c.warnBg : i % 2 === 1 ? c.rowAlt : "transparent", opacity: row.duplicate ? 0.6 : 1 }}>
                  <span style={{ width: 28, fontSize: 9, color: c.textDim, textAlign: "center" }}>{i + 1}</span>
                  <span style={{ flex: 2, paddingLeft: 8 }}>
                    <input type="text" value={row.name} onChange={(e) => updatePreviewRow(row.id, "name", e.target.value)} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.text, padding: "4px 8px", fontSize: 10, fontFamily: F, width: "90%", outline: "none" }} />
                  </span>
                  <span style={{ flex: 3 }}>
                    <input type="text" value={row.email} onChange={(e) => updatePreviewRow(row.id, "email", e.target.value)} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.text, padding: "4px 8px", fontSize: 10, fontFamily: "monospace", width: "95%", outline: "none" }} />
                  </span>
                  <span style={{ flex: 1 }}>
                    <select value={row.role} onChange={(e) => updatePreviewRow(row.id, "role", e.target.value)} style={{ background: c.inputBg, border: `1px solid ${c.border}`, color: c.text, padding: "4px 6px", fontSize: 9, fontFamily: F, outline: "none" }}>
                      {INVITE_ROLES.map((r) => (<option key={r} value={r}>{r}</option>))}
                    </select>
                  </span>
                  <span style={{ flex: 1 }}>
                    <select value={row.aiStatus} onChange={(e) => updatePreviewRow(row.id, "aiStatus", e.target.value)} style={{ background: c.inputBg, border: `1px solid ${c.border}`, color: c.text, padding: "4px 6px", fontSize: 9, fontFamily: F, outline: "none" }}>
                      {["STANDARD", "STRATEGIST", "POWER", "UNLIMITED"].map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </span>
                  <span style={{ width: 60, textAlign: "center" }}>
                    {row.duplicate ? (
                      <span style={{ fontSize: 8, color: c.amber, fontWeight: 700 }}>EXISTS</span>
                    ) : (
                      <span style={{ fontSize: 8, color: c.green }}>READY</span>
                    )}
                  </span>
                  <span style={{ width: 30, textAlign: "center" }}>
                    <button onClick={() => removePreviewRow(row.id)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}>
                      <X size={10} color={c.red} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 24px 20px", borderTop: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: c.textDim }}>
                {invitePreview.filter((r) => r.duplicate).length > 0 && (
                  <span style={{ color: c.amber }}>Duplicates will be skipped. </span>
                )}
                <span>{readyCount} invitations will be sent.</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={closeInvite} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textDim, padding: "0 16px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 32 }}>CANCEL</button>
                <button onClick={sendInvites} disabled={readyCount === 0} style={{ background: c.goldHi, border: "none", color: c.onGold, padding: "0 24px", fontSize: 10, fontWeight: 700, cursor: readyCount === 0 ? "not-allowed" : "pointer", fontFamily: F, height: 32, letterSpacing: "0.04em", opacity: readyCount === 0 ? 0.5 : 1 }}>
                  SEND {readyCount} INVITE{readyCount !== 1 ? "S" : ""}
                </button>
              </div>
            </div>
          </div>
        )}

        {inviteStep === 3 && (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, border: `2px solid ${c.green}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={24} color={c.green} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: c.text, marginBottom: 8 }}>Invitations Sent</div>
            <div style={{ fontSize: 11, color: c.textSec, marginBottom: 24, lineHeight: 1.6 }}>
              {readyCount} people have been invited to {INVITE_COMPANY}. They'll appear as PENDING until they
              accept.
            </div>
            <button onClick={closeInvite} style={{ background: c.goldHi, border: "none", color: c.onGold, padding: "0 24px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 34 }}>DONE</button>
          </div>
        )}
      </div>
    </>
  );
}

function BulkDefaultPills() {
  const { bulkDefaults, setBulkDefaults } = usePerm();
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <div>
        <span style={{ fontSize: 9, fontWeight: 700, color: c.textDim, marginRight: 6 }}>DEFAULT ROLE</span>
        {(["EMPLOYEE", "MANAGER"] as PermRole[]).map((r) => (
          <button key={r} onClick={() => setBulkDefaults((p) => ({ ...p, role: r }))} style={{ background: bulkDefaults.role === r ? alpha(c.gold, 8) : "transparent", border: `1px solid ${bulkDefaults.role === r ? alpha(c.gold, 20) : c.border}`, color: bulkDefaults.role === r ? c.goldHi : c.textDim, padding: "0 8px", fontSize: 8, fontWeight: 600, cursor: "pointer", fontFamily: F, height: 24, marginLeft: 4 }}>
            {r}
          </button>
        ))}
      </div>
      <div>
        <span style={{ fontSize: 9, fontWeight: 700, color: c.textDim, marginRight: 6 }}>AI STATUS</span>
        {AI_TIERS.slice(0, 2).map((t) => {
          const k = t.split(" ")[0];
          return (
            <button key={k} onClick={() => setBulkDefaults((p) => ({ ...p, aiStatus: k }))} style={{ background: bulkDefaults.aiStatus === k ? alpha(c.gold, 8) : "transparent", border: `1px solid ${bulkDefaults.aiStatus === k ? alpha(c.gold, 20) : c.border}`, color: bulkDefaults.aiStatus === k ? c.goldHi : c.textDim, padding: "0 8px", fontSize: 8, fontWeight: 600, cursor: "pointer", fontFamily: F, height: 24, marginLeft: 4 }}>
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}
