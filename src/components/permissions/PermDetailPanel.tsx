import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Check,
  CheckSquare,
  Clock,
  Download,
  Eye,
  FileText,
  Folder,
  Key,
  MapPin,
  Pause,
  Play,
  Shield,
  Stamp,
  Trash2,
  X,
} from "lucide-react";
import {
  AiTier,
  AI_TIERS_DATA,
  AGENCY_OPTIN_MODULES,
  CATS,
  DL_LOG,
  FULL_ROLES,
  LEVELS,
  LOCS,
  TOTAL,
} from "@/data/permissions/permissions-mock";
import { alpha, c, F, lvlC, roleC } from "./permissions-utils";
import { usePerm } from "./PermContext";
import { Drop } from "./PermControls";

const AI_TIER_DETAIL: {
  k: AiTier;
  price: number;
  queries: string;
  overage: string;
  desc: string;
  who: string;
  warn?: boolean;
}[] = [
  { k: "STANDARD", price: 29, queries: "75 queries/mo", overage: "$0.10/query overage", desc: "Daily priorities, H.I.V.E. insights, journal prompts, S.U.M. assistance. Haiku + Sonnet models. 30-day context window.", who: "Every employee — receptionist, sales rep, ops manager." },
  { k: "STRATEGIST", price: 79, queries: "500 queries/mo", overage: "$0.10/query overage", desc: "Extended thinking for FORMULA + ANALYTICS. Full RESEARCH deep analysis. FORMULA session facilitation. Full company history context. Batch recommendations. PDF export.", who: "Department heads, senior managers, agency strategists running FORMULA." },
  { k: "POWER", price: 149, queries: "2,000 queries/mo", overage: "$0.15/query overage", desc: "Opus model access. Extended thinking on ALL interactions. Persistent AI memory across sessions. Voice input. Custom AI behavior rules. Proactive alerts. Priority queue. FORMULA co-facilitation.", who: "CEOs who live in GESTALT daily, agency owners with 20+ clients." },
  { k: "UNLIMITED", price: 299, queries: "Uncapped (3,000 base)", overage: "$0.10/query above 3,000", desc: "All models auto-routed by complexity. Multi-window sessions. API access (10K calls/mo). Competitive intelligence feed. ANALYTICS natural language. White-glove monthly AI review.", who: "The 14-hour/day operator who replaced their consulting stack with GESTALT.", warn: true },
];

const label9 = (color: string): React.CSSProperties => ({
  fontSize: 9,
  fontWeight: 700,
  color,
  letterSpacing: "0.06em",
});

export function PermDetailPanel() {
  const {
    selUserObj,
    setSelUser,
    perms,
    setPerm,
    setAllP,
    setCatP,
    pauseUser,
    resumeUser,
    delId,
    setDelId,
    doDel,
    setAiStatus,
    toggleAgencyOptIn,
    addIp,
    removeIp,
    toggleCat,
    collCats,
    getAS,
    cnt,
    smallDepts,
  } = usePerm();

  const detailRef = useRef<HTMLDivElement>(null);
  const [ipInput, setIpInput] = useState("");
  useEffect(() => {
    if (detailRef.current) detailRef.current.scrollTop = 0;
  }, [selUserObj?.id]);

  if (!selUserObj) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          flexDirection: "column",
          gap: 12,
          opacity: 0.4,
        }}
      >
        <Shield size={40} color={c.textDim} />
        <div style={{ fontSize: 12, color: c.textDim, letterSpacing: "0.1em", fontWeight: 600 }}>
          SELECT A USER
        </div>
        <div style={{ fontSize: 10, color: c.textDim }}>
          Click any person to manage permissions
        </div>
      </div>
    );
  }

  const user = selUserObj;
  const isF = FULL_ROLES.includes(user.role);
  const isPaused = user.status === "paused";
  const isP = user.status === "pending" || user.status === "pending-approval";
  const isD = user.status === "departed";
  const aS = getAS(user.id);
  const act = cnt(user.id);
  const rCol = roleC(user.role);
  const reqMfa = user.role === "GESTALT HQ";
  const mfaWarnCol = reqMfa ? c.red : c.amber;

  return (
    <div ref={detailRef} style={{ flex: 1, overflowY: "auto", background: c.detailBg, minWidth: 0 }}>
      <div style={{ padding: "28px 24px 40px" }}>
        {/* USER HEADER */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: isPaused ? alpha(c.amber, 7) : isF ? alpha(c.gold, 6) : alpha(c.grayBlue, 6),
                border: isPaused
                  ? `1px solid ${alpha(c.amber, 27)}`
                  : isF
                    ? `1px solid ${alpha(c.gold, 20)}`
                    : `1px solid ${c.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: isPaused ? c.amber : isF ? c.goldHi : c.grayBlue,
                flexShrink: 0,
              }}
            >
              {user.av}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: isPaused ? c.amber : c.text,
                  textDecoration: isD ? "line-through" : "none",
                }}
              >
                {user.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: rCol, fontWeight: 600 }}>{user.role}</span>
                <span style={{ color: c.slash }}>·</span>
                <span style={{ fontSize: 10, color: c.textDim, fontFamily: "monospace" }}>{user.email}</span>
              </div>
            </div>
            <button
              onClick={() => setSelUser(null)}
              style={{
                background: "transparent",
                border: `1px solid ${c.border}`,
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <X size={12} color={c.textDim} />
            </button>
          </div>

          {/* META ROW */}
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              fontSize: 9,
              color: c.textDim,
              padding: "12px 0",
              borderTop: `1px solid ${c.border}`,
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Building2 size={10} color={c.textDim} />
              {user.company}
            </span>
            {user.dept && <span>{user.dept}</span>}
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Key size={10} color={c.textDim} />
              Granted by {user.grantedBy} · {user.grantedAt}
            </span>
            {user.locations.length > 0 && user.locations.length < LOCS.length && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={10} color={c.grayBlue} />
                {user.locations.join(", ")}
              </span>
            )}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontWeight: 600,
                color: act === TOTAL ? c.green : act > 0 ? c.goldDim : c.textDim,
              }}
            >
              {act}/{TOTAL} items
            </span>
            {user.downloads > 0 && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: aS === "high" ? c.red : aS === "medium" ? c.amber : c.textDim,
                }}
              >
                <Download size={10} color={aS === "high" ? c.red : aS === "medium" ? c.amber : c.textDim} />
                {user.downloads} downloads
              </span>
            )}
            {user.tenureMonths != null && user.tenureMonths > 0 && (
              <span>
                {Math.floor(user.tenureMonths / 12)}y {user.tenureMonths % 12}m tenure
              </span>
            )}
            {user.aiStatus && (
              <span style={{ fontWeight: 600, color: c.goldDim }}>
                AI: {user.aiStatus} (${AI_TIERS_DATA.find((t) => t.k === user.aiStatus)?.price}/mo)
              </span>
            )}
          </div>
        </div>

        {/* SECURITY: MFA + LAST LOGIN */}
        {!isP && !isD && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            <div
              style={{
                flex: "1 1 200px",
                padding: "10px 14px",
                border: `1px solid ${user.mfa === "active" ? alpha(c.green, 20) : reqMfa ? alpha(c.red, 27) : alpha(c.amber, 20)}`,
                background: user.mfa === "active" ? "transparent" : alpha(mfaWarnCol, 4),
              }}
            >
              <div style={{ ...label9(c.textDim), marginBottom: 6 }}>MULTI-FACTOR AUTHENTICATION</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {user.mfa === "active" ? (
                  <Shield size={12} color={c.green} />
                ) : (
                  <AlertTriangle size={12} color={mfaWarnCol} />
                )}
                <span style={{ fontSize: 11, fontWeight: 600, color: user.mfa === "active" ? c.green : mfaWarnCol }}>
                  {user.mfa === "active" ? "ACTIVE — verified" : "NOT CONFIGURED"}
                </span>
              </div>
              {user.mfa !== "active" && reqMfa && (
                <div style={{ fontSize: 9, color: c.red, marginTop: 4 }}>
                  Multi-factor authentication is required for this role. A second verification step
                  (authenticator app) must be set up before full access is granted.
                </div>
              )}
              {user.mfa !== "active" && (
                <button
                  style={{
                    marginTop: 8,
                    background: "transparent",
                    border: `1px solid ${alpha(c.amber, 27)}`,
                    color: c.amber,
                    padding: "0 10px",
                    fontSize: 8,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: F,
                    height: 22,
                  }}
                >
                  SEND SETUP LINK
                </button>
              )}
            </div>
            {user.lastLogin && (
              <div style={{ flex: "1 1 280px", padding: "10px 14px", border: `1px solid ${c.border}` }}>
                <div style={{ ...label9(c.textDim), marginBottom: 6 }}>LAST LOGIN</div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 10 }}>
                  <div>
                    <span style={{ color: c.textDim }}>When: </span>
                    <span style={{ color: c.text, fontFamily: "monospace" }}>{user.lastLogin}</span>
                  </div>
                  <div>
                    <span style={{ color: c.textDim }}>IP: </span>
                    <span style={{ color: c.text, fontFamily: "monospace" }}>{user.lastLoginIp}</span>
                  </div>
                  <div>
                    <span style={{ color: c.textDim }}>Device: </span>
                    <span style={{ color: c.text }}>{user.lastLoginDevice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STATUS BADGES */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {isPaused && (
            <span style={{ fontSize: 9, fontWeight: 700, color: c.amber, padding: "4px 10px", border: `1px solid ${alpha(c.amber, 27)}`, display: "flex", alignItems: "center", gap: 4 }}>
              <Pause size={9} color={c.amber} />
              PAUSED
            </span>
          )}
          {isD && (
            <span style={{ fontSize: 9, fontWeight: 700, color: c.red, padding: "4px 10px", border: `1px solid ${alpha(c.red, 27)}` }}>
              DEPARTED {user.departedAt}
            </span>
          )}
          {user.expires && user.status === "active" && (
            <span style={{ fontSize: 9, color: c.amber, padding: "4px 10px", border: `1px solid ${alpha(c.amber, 20)}`, display: "flex", alignItems: "center", gap: 4 }}>
              <Clock size={10} color={c.amber} />
              Expires {user.expires}
            </span>
          )}
          {user.watermark && (user.status === "active" || isPaused) && (
            <span style={{ fontSize: 9, color: c.textDim, padding: "4px 10px", border: `1px solid ${c.border}`, display: "flex", alignItems: "center", gap: 4 }}>
              <Stamp size={9} color={c.textDim} />
              WATERMARKED
            </span>
          )}
          {user.isVC && (
            <span style={{ fontSize: 9, color: c.goldDim, padding: "4px 10px", border: `1px solid ${alpha(c.goldDim, 20)}` }}>
              VENDOR CONTACT
            </span>
          )}
          {user.canGrantProjects && !isF && (
            <span style={{ fontSize: 9, color: c.green, padding: "4px 10px", border: `1px solid ${alpha(c.green, 20)}`, display: "flex", alignItems: "center", gap: 4 }}>
              <Folder size={9} color={c.green} />
              CAN GRANT
            </span>
          )}
          {aS === "high" && (
            <span style={{ fontSize: 9, fontWeight: 700, color: c.red, padding: "4px 10px", border: `1px solid ${alpha(c.red, 27)}`, display: "flex", alignItems: "center", gap: 4 }}>
              <AlertTriangle size={9} color={c.red} />
              FLAGGED
            </span>
          )}
          {aS === "medium" && (
            <span style={{ fontSize: 9, fontWeight: 700, color: c.amber, padding: "4px 10px", border: `1px solid ${alpha(c.amber, 27)}` }}>
              ELEVATED
            </span>
          )}
        </div>

        {/* PAUSE REASON */}
        {isPaused && user.pauseReason && (
          <div style={{ marginBottom: 20, padding: "12px 14px", background: alpha(c.amber, 5), border: `1px solid ${alpha(c.amber, 13)}` }}>
            <div style={{ ...label9(c.amber), letterSpacing: "0.08em", marginBottom: 6 }}>PAUSE REASON</div>
            <div style={{ fontSize: 11, color: c.textSec, lineHeight: 1.5 }}>{user.pauseReason}</div>
            <div style={{ fontSize: 9, color: c.textDim, marginTop: 6 }}>
              Paused by {user.pausedBy} on {user.pausedAt}. All access frozen.
            </div>
          </div>
        )}

        {/* ROLE-SPECIFIC CARDS */}
        {user.role === "GESTALT HQ" && (
          <div style={{ marginBottom: 20, padding: "10px 14px", borderLeft: `2px solid ${c.goldHi}`, fontSize: 10, color: c.goldHi, lineHeight: 1.6 }}>
            GESTALT HQ — Super-admin. Full platform access across all client companies.
          </div>
        )}
        {user.role === "MANAGER" && (
          <div style={{ marginBottom: 20, padding: "12px 14px", background: alpha(c.grayBlue, 5), border: `1px solid ${c.border}` }}>
            <div style={{ ...label9(c.grayBlue), marginBottom: 8 }}>LOCATION SCOPE</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {LOCS.map((loc) => {
                const a = user.locations.includes(loc);
                return (
                  <div
                    key={loc}
                    style={{
                      padding: "0 10px",
                      fontSize: 10,
                      height: 26,
                      display: "flex",
                      alignItems: "center",
                      border: `1px solid ${a ? alpha(c.green, 33) : c.border}`,
                      background: a ? alpha(c.green, 5) : "transparent",
                      color: a ? c.green : c.textDim,
                      fontWeight: a ? 600 : 400,
                      gap: 4,
                    }}
                  >
                    {a && <Check size={9} color={c.green} />}
                    {loc}
                  </div>
                );
              })}
            </div>
            {user.canGrantProjects && (
              <div style={{ marginTop: 8, padding: "6px 10px", borderLeft: `2px solid ${c.green}`, fontSize: 9, color: c.green }}>
                PROJECT GRANT ENABLED — Can assign direct reports to projects without CEO/ADMIN approval.
              </div>
            )}
          </div>
        )}
        {user.role === "EMPLOYEE" && (
          <div style={{ marginBottom: 20, padding: "10px 14px", borderLeft: `2px solid ${c.grayBlue}`, fontSize: 10, color: c.textSec, lineHeight: 1.6 }}>
            Always included: Own H.I.V.E. scorecard · JOURNAL (private, owner-only) · S.U.M. channels ·
            Company H.I.V.E. aggregate
          </div>
        )}

        {/* VENDOR CATEGORY + NDA + SCORECARD */}
        {user.role === "VENDOR" && user.vendorCategory && (
          <div style={{ marginBottom: 20, padding: "12px 14px", background: alpha(c.goldDim, 4), border: `1px solid ${c.border}` }}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={label9(c.goldDim)}>CATEGORY</div>
                <div style={{ fontSize: 11, color: c.text, marginTop: 3 }}>{user.vendorCategory}</div>
              </div>
              <div style={{ width: 1, height: 20, background: c.border }} />
              <div>
                <div style={label9(c.goldDim)}>NDA STATUS</div>
                <div style={{ fontSize: 11, color: user.ndaStatus === "signed" ? c.green : c.amber, marginTop: 3, fontWeight: 600 }}>
                  {(user.ndaStatus || "none").toUpperCase()}
                </div>
              </div>
              {user.vendorScore != null && (
                <>
                  <div style={{ width: 1, height: 20, background: c.border }} />
                  <div>
                    <div style={label9(c.goldDim)}>VENDOR SCORECARD</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: user.vendorScore >= 70 ? c.green : user.vendorScore >= 50 ? c.amber : c.red, marginTop: 3 }}>
                      {user.vendorScore}
                      <span style={{ fontSize: 9, fontWeight: 400, color: c.textDim }}>/100</span>
                    </div>
                  </div>
                </>
              )}
              <div style={{ width: 1, height: 20, background: c.border }} />
              <div>
                <div style={label9(c.goldDim)}>TEMPLATE</div>
                <div style={{ fontSize: 10, color: c.textSec, marginTop: 3 }}>Applied: {user.vendorCategory}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div style={label9(c.goldDim)}>EXPIRATION</div>
                <div style={{ fontSize: 11, color: c.text, marginTop: 3 }}>{user.expires || "None set"}</div>
              </div>
              <div style={{ width: 1, height: 20, background: c.border }} />
              <div>
                <div style={label9(c.goldDim)}>WATERMARK</div>
                <div style={{ fontSize: 11, color: user.watermark ? c.green : c.textDim, marginTop: 3 }}>
                  {user.watermark ? "All exports watermarked" : "Clean exports"}
                </div>
              </div>
              {user.isVC && (
                <>
                  <div style={{ width: 1, height: 20, background: c.border }} />
                  <div>
                    <div style={label9(c.goldDim)}>SELF-SERVICE</div>
                    <div style={{ fontSize: 10, color: c.textSec, marginTop: 3 }}>Can revoke sub-members</div>
                  </div>
                </>
              )}
              <button
                style={{
                  marginLeft: "auto",
                  background: "transparent",
                  border: `1px solid ${c.border}`,
                  color: c.textSec,
                  padding: "0 10px",
                  fontSize: 9,
                  cursor: "pointer",
                  fontFamily: F,
                  height: 24,
                }}
              >
                CHANGE DATE
              </button>
            </div>
          </div>
        )}

        {/* AI STATUS SELECTOR */}
        {user.aiStatus && !isP && !isD && (
          <div style={{ marginBottom: 20, padding: "16px 14px", border: `1px solid ${c.border}`, background: c.bg }}>
            <div style={{ ...label9(c.textDim), marginBottom: 4 }}>AI STATUS — assigned by admin</div>
            <div style={{ fontSize: 10, color: c.textDim, marginBottom: 12, lineHeight: 1.5 }}>
              Controls how much GESTALT INTELLIGENCE this person can use. This is not about access — it's
              about whether they are a casual user or a power user who lives in the AI every day.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {AI_TIER_DETAIL.map((t) => {
                const sel = user.aiStatus === t.k;
                return (
                  <div
                    key={t.k}
                    onClick={() => setAiStatus(user.id, t.k)}
                    style={{
                      padding: "12px 14px",
                      border: `1px solid ${sel ? alpha(c.gold, 27) : c.border}`,
                      background: sel ? alpha(c.gold, 5) : "transparent",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: sel ? 8 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            border: `1px solid ${sel ? c.goldHi : c.border}`,
                            background: sel ? c.goldHi : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {sel && <Check size={9} color={c.onGold} />}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: sel ? c.goldHi : c.text }}>{t.k}</span>
                        <span style={{ fontSize: 11, color: sel ? c.goldHi : c.textDim, fontWeight: 600 }}>${t.price}/mo</span>
                        {t.warn && (
                          <span style={{ fontSize: 8, color: c.amber, fontWeight: 700, padding: "2px 6px", border: `1px solid ${alpha(c.amber, 20)}` }}>
                            + OVERAGE
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 9, color: c.textDim, fontFamily: "monospace" }}>{t.queries}</span>
                        <span style={{ fontSize: 8, color: c.textDim }}>{t.overage}</span>
                      </div>
                    </div>
                    {sel && (
                      <div style={{ paddingLeft: 24 }}>
                        <div style={{ fontSize: 10, color: c.textSec, lineHeight: 1.6, marginBottom: 6 }}>{t.desc}</div>
                        <div style={{ fontSize: 9, color: c.textDim, fontStyle: "italic" }}>{t.who}</div>
                        {t.warn && (
                          <div style={{ marginTop: 8, padding: "8px 10px", border: `1px solid ${alpha(c.amber, 20)}`, background: alpha(c.amber, 4), fontSize: 10, color: c.amber, lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <AlertTriangle size={14} color={c.amber} style={{ flexShrink: 0, marginTop: 1 }} />
                            <div>
                              <strong>Billing notice:</strong> UNLIMITED is not a flat rate. The $299/mo base
                              includes 3,000 queries. Every query above 3,000 is billed at $0.10 each. A heavy
                              user (5,040 queries/mo) would pay $299 + $204 overage = <strong>$503/mo</strong> for
                              this seat. The admin will see overage charges on the monthly invoice.
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RETENTION CONSENT */}
        {!isP && !isD && (
          <div
            style={{
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              border: `1px solid ${user.retentionConsent ? c.border : alpha(c.amber, 27)}`,
              background: user.retentionConsent ? "transparent" : alpha(c.amber, 4),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {user.retentionConsent ? (
                <CheckSquare size={14} color={c.green} />
              ) : (
                <AlertTriangle size={14} color={c.amber} />
              )}
              <div>
                <div style={label9(user.retentionConsent ? c.green : c.amber)}>RETENTION CONSENT</div>
                <div style={{ fontSize: 10, color: c.textSec, marginTop: 2 }}>
                  {user.retentionConsent
                    ? "Data retention consent granted"
                    : "Consent not yet recorded — required for C.O.R.E. contributions"}
                </div>
              </div>
            </div>
            {!user.retentionConsent && (
              <button style={{ background: "transparent", border: `1px solid ${alpha(c.amber, 27)}`, color: c.amber, padding: "0 10px", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 24 }}>
                SEND REMINDER
              </button>
            )}
          </div>
        )}

        {/* AI QUERY CONSUMPTION */}
        {user.aiQueries && !isP && !isD && (
          <div style={{ marginBottom: 20, padding: 14, border: `1px solid ${c.border}`, background: c.bg }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={label9(c.textDim)}>GESTALT INTELLIGENCE USAGE — this billing cycle</div>
              <div style={{ fontSize: 9, color: c.textDim }}>Resets {user.aiQueries.resetDate}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ height: 8, background: c.border, position: "relative" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (user.aiQueries.used / user.aiQueries.allocation) * 100)}%`, background: c.goldDim, transition: "width 0.3s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 9, color: c.textDim }}>0</span>
                <span style={{ fontSize: 9, color: c.textDim }}>
                  {user.aiQueries.allocation.toLocaleString()}
                  {user.aiStatus === "UNLIMITED" ? " base" : ""}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 10 }}>
              <div>
                <span style={{ color: c.textDim }}>Used: </span>
                <span style={{ color: c.text, fontFamily: "monospace", fontWeight: 600 }}>{user.aiQueries.used.toLocaleString()}</span>
              </div>
              <div>
                <span style={{ color: c.textDim }}>Allocation: </span>
                <span style={{ color: c.text, fontFamily: "monospace" }}>
                  {user.aiStatus === "UNLIMITED" ? "3,000 base (uncapped)" : user.aiQueries.allocation.toLocaleString()}
                </span>
              </div>
              {user.aiQueries.rollover > 0 && (
                <div>
                  <span style={{ color: c.textDim }}>Rolled over: </span>
                  <span style={{ color: c.goldDim, fontFamily: "monospace" }}>+{user.aiQueries.rollover}</span>
                </div>
              )}
              {user.aiQueries.overage > 0 && (
                <div>
                  <span style={{ color: c.textDim }}>Overage: </span>
                  <span style={{ color: c.text, fontFamily: "monospace" }}>${user.aiQueries.overage.toFixed(2)}</span>
                  <span style={{ color: c.textDim }}> ({user.aiQueries.used - user.aiQueries.allocation} queries above base)</span>
                </div>
              )}
            </div>
            {user.aiQueries.used >= user.aiQueries.allocation * 0.9 && user.aiQueries.overage === 0 && (
              <div style={{ fontSize: 9, color: c.textDim, marginTop: 8 }}>
                This user is at {Math.round((user.aiQueries.used / user.aiQueries.allocation) * 100)}% of their
                monthly allocation.
              </div>
            )}
            {user.aiQueries.used < user.aiQueries.allocation * 0.3 && user.aiStatus !== "STANDARD" && (
              <div style={{ marginTop: 10, padding: "8px 12px", border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 10, color: c.textDim, lineHeight: 1.5 }}>
                  This user has only used{" "}
                  <strong style={{ color: c.text }}>{Math.round((user.aiQueries.used / user.aiQueries.allocation) * 100)}%</strong>{" "}
                  of their {user.aiStatus} allocation this cycle. At current usage, a{" "}
                  <strong style={{ color: c.text }}>
                    {user.aiStatus === "UNLIMITED" ? "POWER" : user.aiStatus === "POWER" ? "STRATEGIST" : "STANDARD"}
                  </strong>{" "}
                  tier would cover their needs and save{" "}
                  <strong style={{ color: c.text }}>
                    ${user.aiStatus === "UNLIMITED" ? 150 : user.aiStatus === "POWER" ? 70 : 50}/mo
                  </strong>{" "}
                  on this seat.
                </div>
                <button style={{ background: "transparent", border: `1px solid ${alpha(c.goldDim, 20)}`, color: c.goldDim, padding: "0 12px", fontSize: 8, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 24, flexShrink: 0, marginLeft: 12 }}>
                  DOWNGRADE
                </button>
              </div>
            )}
          </div>
        )}

        {/* AGENCY VISIBILITY OPT-IN */}
        {(user.role === "CEO" || user.role === "ADMIN") && user.agencyOptIn && (
          <div style={{ marginBottom: 20, padding: "12px 14px", border: `1px solid ${c.border}`, background: c.bg }}>
            <div style={{ ...label9(c.grayBlue), marginBottom: 4 }}>AGENCY PARTNER VISIBILITY</div>
            <div style={{ fontSize: 10, color: c.textDim, marginBottom: 10 }}>
              Default: Signals + Scores + Transformation Readiness. Never visible: Journal, Channels, Stories,
              Polls, individual H.I.V.E.
            </div>
            <div style={{ ...label9(c.textDim), marginBottom: 6 }}>PER-MODULE OPT-IN</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {AGENCY_OPTIN_MODULES.map((m) => {
                const on = user.agencyOptIn?.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() => toggleAgencyOptIn(user.id, m)}
                    style={{
                      background: on ? alpha(c.green, 5) : "transparent",
                      border: `1px solid ${on ? alpha(c.green, 27) : c.border}`,
                      color: on ? c.green : c.textDim,
                      padding: "0 10px",
                      fontSize: 9,
                      cursor: "pointer",
                      fontFamily: F,
                      height: 26,
                      fontWeight: on ? 600 : 400,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {on && <Check size={9} color={c.green} />}
                    {m}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 9, color: c.textDim, display: "flex", alignItems: "center", gap: 5 }}>
                <Eye size={10} color={c.grayBlue} />
                Shadow View lets Agency Partners see a read-only version of this client's dashboard without
                logging in as this user.
              </div>
              <button
                style={{
                  background: "transparent",
                  border: `1px solid ${c.grayBlue}`,
                  color: c.grayBlue,
                  padding: "0 14px",
                  fontSize: 9,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: F,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  flexShrink: 0,
                }}
              >
                <Eye size={10} color={c.grayBlue} />
                LAUNCH SHADOW VIEW
              </button>
            </div>
          </div>
        )}

        {/* SMALL-TEAM DE-IDENTIFICATION */}
        {user.dept && smallDepts.includes(user.dept) && !isD && (
          <div style={{ marginBottom: 20, padding: "10px 14px", background: alpha(c.amber, 4), border: `1px solid ${alpha(c.amber, 13)}`, display: "flex", alignItems: "center", gap: 10 }}>
            <AlertTriangle size={14} color={c.amber} />
            <div>
              <div style={label9(c.amber)}>SMALL-TEAM ANONYMIZATION</div>
              <div style={{ fontSize: 10, color: c.textSec, marginTop: 2 }}>
                {user.dept} has fewer than 3 active members — H.I.V.E. attribution will auto-generalize to
                prevent re-identification.
              </div>
            </div>
          </div>
        )}

        {/* DEPARTED: EXPORT PACKAGE + KNOWLEDGE GAP */}
        {isD && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ padding: "12px 14px", border: `1px solid ${c.border}`, marginBottom: 8 }}>
              <div style={{ ...label9(c.red), marginBottom: 6 }}>DATA PORTABILITY</div>
              <div style={{ fontSize: 10, color: c.textSec, marginBottom: 10 }}>
                Auto-generated export bundle delivered to departing contributor per retention policy.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "transparent", border: `1px solid ${alpha(c.goldHi, 27)}`, color: c.goldHi, padding: "0 12px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 26, display: "flex", alignItems: "center", gap: 4 }}>
                  <Download size={10} color={c.goldHi} />
                  GENERATE EXPORT PACKAGE
                </button>
                <button style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textDim, padding: "0 12px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 26 }}>
                  VIEW HISTORY
                </button>
              </div>
            </div>
            {user.tenureMonths && user.tenureMonths >= 60 && (
              <div style={{ padding: "12px 14px", border: `1px solid ${alpha(c.amber, 20)}`, background: alpha(c.amber, 4) }}>
                <div style={{ ...label9(c.amber), marginBottom: 6 }}>KNOWLEDGE-GAP EXTRACTION</div>
                <div style={{ fontSize: 10, color: c.textSec, marginBottom: 8 }}>
                  This contributor had {Math.floor(user.tenureMonths / 12)}+ years tenure (authority threshold:
                  60 months). C.O.R.E. interview sequence should have fired before departure.
                </div>
                <button style={{ background: "transparent", border: `1px solid ${c.amber}`, color: c.amber, padding: "0 12px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 26, display: "flex", alignItems: "center", gap: 4 }}>
                  <FileText size={10} color={c.amber} />
                  VIEW C.O.R.E. EXTRACTION STATUS
                </button>
              </div>
            )}
          </div>
        )}

        {/* DOWNLOAD ACTIVITY */}
        {user.downloads > 0 && (
          <div style={{ marginBottom: 20, padding: "12px 14px", background: aS === "high" ? c.alertBg : alpha(c.grayBlue, 4), border: `1px solid ${aS === "high" ? c.alertBorder : c.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {aS === "high" && <AlertTriangle size={12} color={c.red} />}
              <span style={{ ...label9(aS === "high" ? c.red : c.grayBlue) }}>
                DOWNLOAD ACTIVITY — {user.downloads} FILES
              </span>
            </div>
            {DL_LOG.filter((d) => d.uid === user.id)
              .slice(0, 5)
              .map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", borderTop: i > 0 ? `1px solid ${c.borderLt}` : "none", fontSize: 10, padding: "4px 0" }}>
                  <span style={{ fontFamily: "monospace", color: c.textDim, fontSize: 9, width: 120, flexShrink: 0 }}>{d.ts}</span>
                  <span style={{ color: d.flag ? c.red : c.text, flex: 1, fontWeight: d.flag ? 600 : 400, display: "flex", alignItems: "center", gap: 4 }}>
                    {d.flag && <AlertTriangle size={9} color={c.red} />}
                    {d.file}
                  </span>
                  <span style={{ fontFamily: "monospace", color: c.textDim, fontSize: 9, width: 70, textAlign: "right" }}>{d.size}</span>
                </div>
              ))}
          </div>
        )}

        {/* VENDOR IP RESTRICTION */}
        {user.role === "VENDOR" && !isP && !isD && (
          <div style={{ marginBottom: 20, padding: "12px 14px", border: `1px solid ${c.border}`, background: c.bg }}>
            <div style={{ ...label9(c.textDim), marginBottom: 4 }}>IP ADDRESS RESTRICTION</div>
            <div style={{ fontSize: 10, color: c.textDim, marginBottom: 10, lineHeight: 1.5 }}>
              Limit this vendor's access to specific network addresses. Any login attempt from an IP address
              outside the allowed list will be blocked automatically. Leave empty to allow access from any
              location.
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {(user.ipAllowlist || []).map((ip, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", border: `1px solid ${alpha(c.green, 20)}`, background: alpha(c.green, 4), fontSize: 10, fontFamily: "monospace", color: c.green }}>
                  {ip}
                  <button onClick={() => removeIp(user.id, i)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, marginLeft: 4 }}>
                    <X size={9} color={c.green} />
                  </button>
                </div>
              ))}
              {(!user.ipAllowlist || user.ipAllowlist.length === 0) && (
                <span style={{ fontSize: 10, color: c.textDim }}>No restrictions — accessible from any IP address</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="e.g. 104.28.55.0/24 or 192.168.1.100"
                style={{ background: c.inputBg, border: `1px solid ${c.border}`, color: c.text, padding: "4px 10px", fontSize: 10, fontFamily: "monospace", flex: 1, outline: "none" }}
              />
              <button
                onClick={() => {
                  if (ipInput.trim()) {
                    addIp(user.id, ipInput.trim());
                    setIpInput("");
                  }
                }}
                style={{ background: "transparent", border: `1px solid ${alpha(c.goldDim, 20)}`, color: c.goldDim, padding: "0 12px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 26 }}
              >
                ADD
              </button>
            </div>
          </div>
        )}

        {/* SESSION + COMPLIANCE ACTIONS */}
        {!isP && !isD && (
          <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px", padding: "12px 14px", border: `1px solid ${c.border}` }}>
              <div style={{ ...label9(c.textDim), marginBottom: 4 }}>ACTIVE SESSIONS</div>
              <div style={{ fontSize: 10, color: c.textDim, marginBottom: 8, lineHeight: 1.5 }}>
                Immediately terminate all of this person's active sessions across every device. They will be
                logged out everywhere and must sign in again to regain access.
              </div>
              <button style={{ background: "transparent", border: `1px solid ${alpha(c.red, 27)}`, color: c.red, padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28, display: "flex", alignItems: "center", gap: 5 }}>
                <X size={10} color={c.red} />
                END ALL ACTIVE SESSIONS
              </button>
            </div>
            <div style={{ flex: "1 1 200px", padding: "12px 14px", border: `1px solid ${c.border}` }}>
              <div style={{ ...label9(c.textDim), marginBottom: 4 }}>COMPLIANCE EXPORT</div>
              <div style={{ fontSize: 10, color: c.textDim, marginBottom: 8, lineHeight: 1.5 }}>
                Generate a complete audit report for this person: every permission change, login, download, AI
                query, and action — for legal review, due diligence, or regulatory compliance.
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ background: "transparent", border: `1px solid ${alpha(c.goldDim, 20)}`, color: c.goldDim, padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28, display: "flex", alignItems: "center", gap: 5 }}>
                  <FileText size={10} color={c.goldDim} />
                  GENERATE PDF
                </button>
                <button style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textDim, padding: "0 14px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 28, display: "flex", alignItems: "center", gap: 5 }}>
                  <Download size={10} color={c.textDim} />
                  EXPORT CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SET ALL + ACTIONS */}
        {!isP && !isD && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", marginBottom: 8, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}`, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ ...label9(c.textDim), marginRight: 6 }}>SET ALL</span>
              {LEVELS.map((l) => (
                <button key={l} onClick={() => setAllP(user.id, l)} style={{ background: "transparent", border: `1px solid ${c.border}`, color: lvlC(l), padding: "0 8px", fontSize: 9, fontFamily: F, fontWeight: 600, cursor: "pointer", height: 24 }}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {user.status === "active" && (
                <button onClick={() => pauseUser(user.id)} style={{ background: "transparent", border: `1px solid ${c.amber}`, color: c.amber, height: 28, padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 5 }}>
                  <Pause size={10} color={c.amber} />
                  PAUSE
                </button>
              )}
              {isPaused && (
                <button onClick={() => resumeUser(user.id)} style={{ background: "transparent", border: `1px solid ${alpha(c.green, 33)}`, color: c.green, height: 28, padding: "0 14px", fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 5 }}>
                  <Play size={10} color={c.green} />
                  RESUME
                </button>
              )}
              <button onClick={() => setDelId(user.id)} style={{ background: "transparent", border: `1px solid ${alpha(c.red, 27)}`, color: c.red, height: 28, padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, display: "flex", alignItems: "center", gap: 5 }}>
                <Trash2 size={10} color={c.red} />
                DELETE
              </button>
            </div>
          </div>
        )}

        {/* DELETE CONFIRM */}
        {delId === user.id && (
          <div style={{ margin: "0 0 16px", padding: "12px 16px", background: alpha(c.red, 4), border: `1px solid ${alpha(c.red, 20)}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 11, color: c.text }}>
              Remove <strong>{user.name}</strong>? Immutable.
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => doDel(user.id)} style={{ background: c.red, border: "none", color: "#fff", padding: "0 14px", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: F, height: 28 }}>
                CONFIRM
              </button>
              <button onClick={() => setDelId(null)} style={{ background: "transparent", border: `1px solid ${c.border}`, color: c.textDim, padding: "0 14px", fontSize: 9, cursor: "pointer", fontFamily: F, height: 28 }}>
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* PERMISSION CATEGORIES */}
        {!isP && !isD && (
          <>
            {user.role === "VENDOR" && user.vendorCategory && (
              <div style={{ marginBottom: 8, padding: "8px 14px", border: `1px solid ${alpha(c.goldDim, 13)}`, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: c.goldDim, padding: "2px 8px", border: `1px solid ${alpha(c.goldDim, 20)}` }}>TEMPLATE</span>
                <span style={{ fontSize: 10, color: c.textSec }}>
                  Default permissions applied from <strong style={{ color: c.goldDim }}>{user.vendorCategory}</strong> template. Override individual items below.
                </span>
              </div>
            )}
            {CATS.filter((cat) => cat.locked).map((cat) => (
              <div key={cat.key} style={{ marginBottom: 4, padding: "10px 0 8px", borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Shield size={12} color={c.red} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.red, letterSpacing: "0.06em" }}>{cat.label}</span>
                  <span style={{ fontSize: 10, color: c.textDim }}>{cat.desc}</span>
                </div>
                <span style={{ fontSize: 8, fontWeight: 700, color: c.red, padding: "3px 10px", border: `1px solid ${alpha(c.red, 20)}` }}>
                  OWNER-ONLY — CANNOT BE GRANTED
                </span>
              </div>
            ))}
            {CATS.filter((cat) => !cat.locked).map((cat) => {
              const ca = cat.items.filter(
                (i) => perms[user.id] && perms[user.id][i.id] !== "No Access",
              ).length;
              const isCol = collCats.has(`${user.id}_${cat.key}`);
              return (
                <div key={cat.key} style={{ marginBottom: 4 }}>
                  <div onClick={() => toggleCat(user.id, cat.key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", borderBottom: `1px solid ${c.border}`, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ transform: isCol ? "rotate(-90deg)" : "rotate(0)", transition: "transform 0.15s", display: "flex" }}>
                        <ChevronGlyph />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: c.goldHi, letterSpacing: "0.06em" }}>{cat.label}</span>
                      <span style={{ fontSize: 10, color: c.textDim }}>{cat.desc}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: ca > 0 ? c.green : c.textDim, fontWeight: 600 }}>
                        {ca}/{cat.items.length}
                      </span>
                      <button onClick={() => setCatP(user.id, cat.key, "Full Access")} style={{ background: "transparent", border: "none", color: c.green, fontSize: 8, cursor: "pointer", fontFamily: F, fontWeight: 700 }}>
                        ALL
                      </button>
                      <button onClick={() => setCatP(user.id, cat.key, "No Access")} style={{ background: "transparent", border: "none", color: c.red, fontSize: 8, cursor: "pointer", fontFamily: F, fontWeight: 700 }}>
                        NONE
                      </button>
                    </div>
                  </div>
                  {!isCol &&
                    cat.items.map((item, j) => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0 7px 24px", borderBottom: `1px solid ${c.borderLt}`, background: j % 2 === 1 ? c.rowAlt : "transparent" }}>
                        <span style={{ fontSize: 11, color: perms[user.id] && perms[user.id][item.id] === "No Access" ? c.textDim : c.text }}>{item.name}</span>
                        <Drop
                          value={perms[user.id] ? perms[user.id][item.id] : "No Access"}
                          onChange={(v) => setPerm(user.id, item.id, v)}
                        />
                      </div>
                    ))}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function ChevronGlyph() {
  return (
    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={c.textDim} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
