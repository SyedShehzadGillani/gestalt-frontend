import { AlertTriangle, Play, Send, X } from "lucide-react";
import { FULL_ROLES, PermUser, TOTAL } from "@/data/permissions/permissions-mock";
import { alpha, c, F, roleC } from "./permissions-utils";
import { usePerm } from "./PermContext";
import { Chk } from "./PermControls";

export function PermUserRow({ user, idx }: { user: PermUser; idx: number }) {
  const {
    selUser,
    setSelUser,
    setDelId,
    selected,
    toggleSel,
    tab,
    getAS,
    cnt,
    resumeUser,
    doDel,
  } = usePerm();

  const isSel = selUser === user.id;
  const isPaused = user.status === "paused";
  const isP = user.status === "pending" || user.status === "pending-approval";
  const isPA = user.status === "pending-approval";
  const isD = user.status === "departed";
  const aS = getAS(user.id);
  const act = cnt(user.id);
  const rCol = roleC(user.role);
  const isFull = FULL_ROLES.includes(user.role);
  const leftBorder = isPA
    ? `3px solid ${c.orange}`
    : isPaused
      ? `3px solid ${c.amber}`
      : aS === "high"
        ? `3px solid ${c.red}`
        : aS === "medium"
          ? `3px solid ${c.amber}`
          : "3px solid transparent";
  const canSelect = !isPA && !isD;
  const restingBg = isSel
    ? c.selectedRow
    : isPaused
      ? c.pausedBg
      : isP
        ? c.pendingBg
        : isD
          ? c.bg3
          : "transparent";

  return (
    <div
      style={{
        borderTop: idx > 0 ? `1px solid ${c.border}` : "none",
        borderLeft: leftBorder,
        background: restingBg,
        opacity: isP ? 0.7 : isD ? 0.45 : isPaused ? 0.65 : 1,
        cursor: canSelect ? "pointer" : "default",
        transition: "background 0.15s",
      }}
      onClick={() => {
        if (canSelect) setSelUser(isSel ? null : user.id);
        setDelId(null);
      }}
      onMouseEnter={(e) => {
        if (canSelect && !isSel) e.currentTarget.style.background = c.hoverRow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = restingBg;
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 10 }}
      >
        {tab === "people" && (
          <Chk checked={selected.has(user.id)} onChange={() => toggleSel(user.id)} />
        )}
        <div
          style={{
            width: 30,
            height: 30,
            background:
              isP || isD
                ? alpha(c.pending, 9)
                : isPaused
                  ? alpha(c.amber, 7)
                  : isFull
                    ? alpha(c.gold, 5)
                    : alpha(c.grayBlue, 5),
            border:
              isP || isD
                ? `1px dashed ${c.pending}`
                : isPaused
                  ? `1px solid ${alpha(c.amber, 27)}`
                  : isFull
                    ? `1px solid ${alpha(c.gold, 20)}`
                    : `1px solid ${c.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 700,
            color: isP || isD ? c.pending : isPaused ? c.amber : isFull ? c.goldHi : c.grayBlue,
            flexShrink: 0,
          }}
        >
          {user.av}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: isSel ? c.goldHi : isPaused ? c.amber : isD ? c.textDim : c.text,
                textDecoration: isD ? "line-through" : "none",
              }}
            >
              {user.name}
            </span>
            <span style={{ fontSize: 10, color: rCol, fontWeight: 500 }}>{user.role}</span>
          </div>
          <div
            style={{
              fontSize: 9,
              color: c.textDim,
              marginTop: 2,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {user.company}
            {user.dept && (
              <>
                <span style={{ color: c.slash }}>·</span>
                <span>{user.dept}</span>
              </>
            )}
            {user.aiStatus && (
              <span
                style={{
                  color:
                    user.aiStatus === "UNLIMITED"
                      ? c.goldHi
                      : user.aiStatus === "POWER"
                        ? c.goldDim
                        : c.textDim,
                  fontWeight: 600,
                  fontSize: 8,
                  letterSpacing: "0.04em",
                }}
              >
                {user.aiStatus}
              </span>
            )}
            {!user.retentionConsent &&
              (user.status === "active" || user.status === "paused") && (
                <span style={{ color: c.amber, fontSize: 7, fontWeight: 700 }}>
                  NO CONSENT
                </span>
              )}
          </div>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}
        >
          {isPaused && (
            <span style={{ fontSize: 8, fontWeight: 700, color: c.amber, letterSpacing: "0.06em" }}>
              PAUSED
            </span>
          )}
          {isPA && (
            <span style={{ fontSize: 8, fontWeight: 700, color: c.orange }}>
              AWAITING APPROVAL
            </span>
          )}
          {isP && !isPA && <span style={{ fontSize: 8, color: c.textDim }}>PENDING</span>}
          {isD && <span style={{ fontSize: 8, color: c.red }}>DEPARTED</span>}
          {(user.status === "active" || isPaused) && (
            <>
              {aS === "high" && <AlertTriangle size={11} color={c.red} />}
              {aS === "medium" && <AlertTriangle size={11} color={c.amber} />}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: act === TOTAL ? c.green : act > 0 ? c.goldDim : c.textDim,
                  fontFamily: "monospace",
                }}
              >
                {act}
                <span style={{ color: c.textDim, fontWeight: 400 }}>/{TOTAL}</span>
              </span>
            </>
          )}
          {isP && !isPA && (
            <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
              <button
                style={{
                  background: "transparent",
                  border: `1px solid ${c.goldDim}`,
                  color: c.goldDim,
                  padding: "0 8px",
                  fontSize: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: F,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Send size={8} color={c.goldDim} />
                RESEND
              </button>
              <button
                onClick={() => doDel(user.id)}
                style={{
                  background: "transparent",
                  border: `1px solid ${alpha(c.red, 27)}`,
                  color: c.red,
                  padding: "0 8px",
                  fontSize: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: F,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <X size={8} color={c.red} />
                REVOKE
              </button>
            </div>
          )}
          {isPaused && (
            <div style={{ display: "flex", gap: 4 }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => resumeUser(user.id)}
                style={{
                  background: "transparent",
                  border: `1px solid ${alpha(c.green, 27)}`,
                  color: c.green,
                  padding: "0 8px",
                  fontSize: 8,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: F,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Play size={8} color={c.green} />
                RESUME
              </button>
            </div>
          )}
          {isSel && canSelect && !isPaused && (
            <div style={{ width: 6, height: 6, background: c.goldHi }} />
          )}
        </div>
      </div>
    </div>
  );
}
