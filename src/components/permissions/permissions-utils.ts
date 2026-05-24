// Shared helpers + CSS-var color map for the Permissions page.
// `c` holds CSS custom-property references so inline styles theme via `.perms-scope` + `.light`.

import {
  AccessLevel,
  CATS,
  DL_ALERTS,
  FULL_ROLES,
  PermRole,
  PermUser,
} from "@/data/permissions/permissions-mock";

export const c = {
  bg: "var(--perm-bg)",
  bg2: "var(--perm-bg2)",
  bg3: "var(--perm-bg3)",
  bgExp: "var(--perm-bg-exp)",
  border: "var(--perm-border)",
  borderLt: "var(--perm-border-lt)",
  text: "var(--perm-text)",
  textSec: "var(--perm-text-sec)",
  textDim: "var(--perm-text-dim)",
  gold: "var(--perm-gold)",
  goldHi: "var(--perm-gold-hi)",
  goldDim: "var(--perm-gold-dim)",
  grayBlue: "var(--perm-gray-blue)",
  red: "var(--perm-red)",
  green: "var(--perm-green)",
  orange: "var(--perm-orange)",
  amber: "var(--perm-amber)",
  dropShadow: "var(--perm-drop-shadow)",
  rowAlt: "var(--perm-row-alt)",
  hoverRow: "var(--perm-hover-row)",
  inputBg: "var(--perm-input-bg)",
  roleFull: "var(--perm-role-full)",
  roleScoped: "var(--perm-role-scoped)",
  roleVendor: "var(--perm-role-vendor)",
  roleHQ: "var(--perm-role-hq)",
  slash: "var(--perm-slash)",
  pending: "var(--perm-pending)",
  pendingBg: "var(--perm-pending-bg)",
  alertBg: "var(--perm-alert-bg)",
  alertBorder: "var(--perm-alert-border)",
  warnBg: "var(--perm-warn-bg)",
  warnBorder: "var(--perm-warn-border)",
  pausedBg: "var(--perm-paused-bg)",
  detailBg: "var(--perm-detail-bg)",
  selectedRow: "var(--perm-selected-row)",
  onGold: "var(--perm-on-gold)",
} as const;

export const F = "Gotham, Montserrat, sans-serif";

// Translucent helper for CSS-var colors (color-mix keeps theme-awareness that hex+alpha can't).
export const alpha = (color: string, pct: number) =>
  `color-mix(in srgb, ${color} ${pct}%, transparent)`;

export const lvlC = (l: AccessLevel): string =>
  ({
    "Full Access": c.green,
    "No Access": c.red,
    "Can View": c.grayBlue,
    "Can Export": c.goldDim,
    "Can Comment": c.gold,
  })[l] || c.grayBlue;

export const roleC = (r: PermRole): string =>
  r === "GESTALT HQ"
    ? c.roleHQ
    : FULL_ROLES.includes(r)
      ? c.roleFull
      : r === "VENDOR"
        ? c.roleVendor
        : c.roleScoped;

export type PermMap = Record<number, Record<string, AccessLevel>>;

export function mkDef(role: PermRole): Record<string, AccessLevel> {
  const p: Record<string, AccessLevel> = {};
  // Locked categories (owner-only JOURNAL) are never grantable — keep them out of the perms map.
  CATS.filter((cat) => !cat.locked).forEach((cat) =>
    cat.items.forEach((i) => {
      if (FULL_ROLES.includes(role)) p[i.id] = "Full Access";
      else if (role === "MANAGER")
        p[i.id] = ["vault", "timelines", "analytics", "presentations"].includes(
          cat.key,
        )
          ? "Can View"
          : "Can Comment";
      else p[i.id] = "No Access";
    }),
  );
  return p;
}

export function getAccessSeverity(uid: number): "high" | "medium" | null {
  const a = DL_ALERTS.filter((x) => x.uid === uid);
  if (a.some((x) => x.sev === "high")) return "high";
  if (a.some((x) => x.sev === "medium")) return "medium";
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface InviteRow {
  id: string;
  name: string;
  email: string;
  role: PermRole;
  location: string;
  aiStatus: string;
  valid: boolean;
  duplicate: boolean;
}

export function parsePasteRows(
  text: string,
  users: PermUser[],
  defaults: { role: PermRole; location: string; aiStatus: string },
): InviteRow[] {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const rows: InviteRow[] = [];
  lines.forEach((line, i) => {
    const parts = line
      .split(/[,\t;|]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const emailPart = parts.find((p) => EMAIL_RE.test(p));
    if (!emailPart) return;
    const nameParts = parts.filter(
      (p) => p !== emailPart && !/^\$?\d/.test(p),
    );
    rows.push({
      id: `inv_${i}`,
      name: nameParts.join(" ") || emailPart.split("@")[0],
      email: emailPart,
      role: defaults.role,
      location: defaults.location,
      aiStatus: defaults.aiStatus,
      valid: true,
      duplicate: users.some(
        (u) => u.email.toLowerCase() === emailPart.toLowerCase(),
      ),
    });
  });
  return rows;
}

export function parseCsvText(
  text: string,
  users: PermUser[],
  defaults: { role: PermRole; location: string; aiStatus: string },
): InviteRow[] {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const header = lines[0]?.toLowerCase() || "";
  const dataLines = header.includes("email") ? lines.slice(1) : lines;
  const rows: InviteRow[] = [];
  dataLines.forEach((line, i) => {
    const parts = line.split(/[,\t]+/).map((s) => s.trim().replace(/^"|"$/g, ""));
    const emailIdx = parts.findIndex((p) => EMAIL_RE.test(p));
    if (emailIdx === -1) return;
    const email = parts[emailIdx];
    const name =
      parts
        .filter((_, j) => j !== emailIdx && !/^\$?\d/.test(parts[j]))
        .slice(0, 2)
        .join(" ") || email.split("@")[0];
    rows.push({
      id: `csv_${i}`,
      name,
      email,
      role: defaults.role,
      location: defaults.location,
      aiStatus: defaults.aiStatus,
      valid: true,
      duplicate: users.some((u) => u.email.toLowerCase() === email.toLowerCase()),
    });
  });
  return rows;
}
