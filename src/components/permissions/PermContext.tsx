// Central state + handlers for the Permissions page, shared via context to avoid prop drilling.
import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  AccessLevel,
  AiTier,
  ALL_IDS,
  AI_TIERS_DATA,
  DL_ALERTS,
  INVITE_COMPANY,
  PermRole,
  PermTab,
  PermUser,
  USERS,
  CATS,
} from "@/data/permissions/permissions-mock";
import {
  getAccessSeverity,
  InviteRow,
  mkDef,
  parseCsvText,
  parsePasteRows,
  PermMap,
} from "./permissions-utils";

interface NotifPrefs {
  permChange: boolean;
  newInvite: boolean;
  accessRevoked: boolean;
  downloadAlert: boolean;
  bulkDownload: boolean;
  vendorExpiry: boolean;
  vendorDepart: boolean;
  hiveReview: boolean;
  systemAlert: boolean;
}

interface SingleInvite {
  name: string;
  email: string;
  role: PermRole;
  location: string;
  aiStatus: string;
}

interface BulkDefaults {
  role: PermRole;
  location: string;
  aiStatus: string;
  watermark: boolean;
}

interface PermCtx {
  users: PermUser[];
  perms: PermMap;
  selUser: number | null;
  setSelUser: (id: number | null) => void;
  selUserObj: PermUser | undefined;
  search: string;
  setSearch: (s: string) => void;
  roleF: string;
  setRoleF: (r: string) => void;
  statusF: string;
  setStatusF: (s: string) => void;
  tab: PermTab;
  setTab: (t: PermTab) => void;
  selected: Set<number>;
  delId: number | null;
  setDelId: (id: number | null) => void;
  dlExpId: number | null;
  setDlExpId: (id: number | null) => void;
  killC: boolean;
  setKillC: (b: boolean) => void;
  compV: string | null;
  setCompV: (s: string | null) => void;
  assetExp: string | null;
  setAssetExp: (s: string | null) => void;
  collCats: Set<string>;
  notif: NotifPrefs;
  setNotif: React.Dispatch<React.SetStateAction<NotifPrefs>>;
  // invite
  inviteOpen: boolean;
  inviteMode: string;
  setInviteMode: (m: string) => void;
  inviteStep: number;
  setInviteStep: (n: number) => void;
  inviteSingle: SingleInvite;
  setInviteSingle: React.Dispatch<React.SetStateAction<SingleInvite>>;
  pasteText: string;
  setPasteText: (s: string) => void;
  invitePreview: InviteRow[];
  setInvitePreview: React.Dispatch<React.SetStateAction<InviteRow[]>>;
  bulkDefaults: BulkDefaults;
  setBulkDefaults: React.Dispatch<React.SetStateAction<BulkDefaults>>;
  // derived
  filt: PermUser[];
  co: Record<string, PermUser[]>;
  actU: PermUser[];
  pendA: PermUser[];
  flagU: PermUser[];
  totDl: number;
  pausedU: PermUser[];
  aiSeatCost: number;
  noConsent: PermUser[];
  smallDepts: string[];
  // handlers
  doDel: (id: number) => void;
  setAllP: (uid: number, lvl: AccessLevel) => void;
  setCatP: (uid: number, key: string, lvl: AccessLevel) => void;
  setPerm: (uid: number, id: string, lvl: AccessLevel) => void;
  cnt: (uid: number) => number;
  appInv: (id: number) => void;
  rejInv: (id: number) => void;
  pauseUser: (id: number) => void;
  resumeUser: (id: number) => void;
  getAS: (uid: number) => "high" | "medium" | null;
  toggleSel: (id: number) => void;
  selAll: () => void;
  bulkSetLevel: (lvl: AccessLevel) => void;
  bulkPause: () => void;
  bulkRevoke: () => void;
  clearSel: () => void;
  toggleCat: (uid: number, key: string) => void;
  toggleAssetCat: (key: string) => void;
  setAiStatus: (uid: number, tier: AiTier) => void;
  toggleAgencyOptIn: (uid: number, mod: string) => void;
  addIp: (uid: number, ip: string) => void;
  removeIp: (uid: number, idx: number) => void;
  getUsersForAsset: (assetId: string) => PermUser[];
  setAssetPerm: (assetId: string, uid: number, lvl: AccessLevel) => void;
  // invite handlers
  openInvite: () => void;
  closeInvite: () => void;
  handleParsePaste: () => void;
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitSingle: () => void;
  removePreviewRow: (id: string) => void;
  updatePreviewRow: (id: string, field: keyof InviteRow, val: string) => void;
  sendInvites: () => void;
}

const Ctx = createContext<PermCtx | null>(null);

export function usePerm(): PermCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePerm must be used within PermProvider");
  return v;
}

const NOW = "2026-02-24";

export function PermProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<PermUser[]>(USERS);
  const [perms, setPerms] = useState<PermMap>(() => {
    const m: PermMap = {};
    USERS.forEach((u) => {
      m[u.id] = mkDef(u.role);
    });
    return m;
  });
  const [selUser, setSelUser] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [roleF, setRoleF] = useState("ALL");
  const [statusF, setStatusF] = useState("ALL");
  const [tab, setTabState] = useState<PermTab>("people");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [delId, setDelId] = useState<number | null>(null);
  const [dlExpId, setDlExpId] = useState<number | null>(null);
  const [killC, setKillC] = useState(false);
  const [compV, setCompV] = useState<string | null>(null);
  const [assetExp, setAssetExp] = useState<string | null>(null);
  const [collCats, setCollCats] = useState<Set<string>>(new Set());
  const [notif, setNotif] = useState<NotifPrefs>({
    permChange: true,
    newInvite: true,
    accessRevoked: true,
    downloadAlert: true,
    bulkDownload: true,
    vendorExpiry: true,
    vendorDepart: true,
    hiveReview: true,
    systemAlert: true,
  });
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteMode, setInviteMode] = useState("single");
  const [inviteStep, setInviteStep] = useState(1);
  const [inviteSingle, setInviteSingle] = useState<SingleInvite>({
    name: "",
    email: "",
    role: "EMPLOYEE",
    location: "",
    aiStatus: "STANDARD",
  });
  const [pasteText, setPasteText] = useState("");
  const [invitePreview, setInvitePreview] = useState<InviteRow[]>([]);
  const [bulkDefaults, setBulkDefaults] = useState<BulkDefaults>({
    role: "EMPLOYEE",
    location: "",
    aiStatus: "STANDARD",
    watermark: true,
  });

  const setTab = (t: PermTab) => {
    setTabState(t);
    if (t !== "companies") setCompV(null);
    setSelected(new Set());
    if (t !== "people") setSelUser(null);
  };

  // ── Derived ──
  const filt = useMemo(
    () =>
      users.filter((u) => {
        const q = search.toLowerCase();
        const s =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.company.toLowerCase().includes(q);
        const r = roleF === "ALL" || u.role === roleF;
        const st =
          statusF === "ALL" ||
          (statusF === "ACTIVE" && u.status === "active") ||
          (statusF === "PENDING" &&
            (u.status === "pending" || u.status === "pending-approval")) ||
          (statusF === "DEPARTED" && u.status === "departed") ||
          (statusF === "PAUSED" && u.status === "paused");
        return s && r && st;
      }),
    [users, search, roleF, statusF],
  );

  const co = useMemo(() => {
    const m: Record<string, PermUser[]> = {};
    users.forEach((u) => {
      if (!m[u.company]) m[u.company] = [];
      m[u.company].push(u);
    });
    return m;
  }, [users]);

  const actU = useMemo(() => users.filter((u) => u.status === "active"), [users]);
  const pendA = useMemo(
    () => users.filter((u) => u.status === "pending-approval"),
    [users],
  );
  const flagU = useMemo(
    () =>
      users.filter((u) =>
        DL_ALERTS.some((a) => a.uid === u.id && a.sev === "high"),
      ),
    [users],
  );
  const totDl = useMemo(() => users.reduce((s, u) => s + u.downloads, 0), [users]);
  const pausedU = useMemo(
    () => users.filter((u) => u.status === "paused"),
    [users],
  );
  const aiSeatCost = useMemo(
    () =>
      users
        .filter((u) => u.status === "active" && u.aiStatus)
        .reduce((s, u) => {
          const t = AI_TIERS_DATA.find((t) => t.k === u.aiStatus);
          return s + (t ? t.price : 0);
        }, 0),
    [users],
  );
  const noConsent = useMemo(
    () =>
      users.filter(
        (u) =>
          (u.status === "active" || u.status === "paused") &&
          !u.retentionConsent,
      ),
    [users],
  );
  const smallDepts = useMemo(() => {
    const counts: Record<string, number> = {};
    users
      .filter((u) => u.status === "active" && u.dept)
      .forEach((u) => {
        counts[u.dept as string] = (counts[u.dept as string] || 0) + 1;
      });
    return Object.entries(counts)
      .filter(([, v]) => v < 3)
      .map(([k]) => k);
  }, [users]);

  const selUserObj = users.find((u) => u.id === selUser);

  // ── Handlers ──
  const patchUser = (id: number, patch: Partial<PermUser>) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));

  const doDel = (id: number) => {
    setUsers((p) => p.filter((u) => u.id !== id));
    setPerms((p) => {
      const n = { ...p };
      delete n[id];
      return n;
    });
    if (selUser === id) setSelUser(null);
    setDelId(null);
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };
  const setAllP = (uid: number, lvl: AccessLevel) =>
    setPerms((prev) => {
      const p = { ...prev[uid] };
      ALL_IDS.forEach((id) => (p[id] = lvl));
      return { ...prev, [uid]: p };
    });
  const setCatP = (uid: number, key: string, lvl: AccessLevel) =>
    setPerms((prev) => {
      const p = { ...prev[uid] };
      CATS.find((x) => x.key === key)?.items.forEach((i) => (p[i.id] = lvl));
      return { ...prev, [uid]: p };
    });
  const setPerm = (uid: number, id: string, lvl: AccessLevel) =>
    setPerms((prev) => ({ ...prev, [uid]: { ...prev[uid], [id]: lvl } }));
  const cnt = (uid: number) =>
    Object.values(perms[uid] || {}).filter((v) => v !== "No Access").length;
  const appInv = (id: number) =>
    patchUser(id, { status: "pending", pendingApproval: false });
  const rejInv = (id: number) => setUsers((p) => p.filter((u) => u.id !== id));
  const pauseUser = (id: number) =>
    patchUser(id, { status: "paused", pausedAt: NOW, pausedBy: "Admin" });
  const resumeUser = (id: number) =>
    patchUser(id, {
      status: "active",
      pausedAt: null,
      pausedBy: null,
      pauseReason: null,
    });
  const getAS = getAccessSeverity;
  const toggleSel = (id: number) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const selAll = () =>
    setSelected((prev) =>
      prev.size === filt.length ? new Set() : new Set(filt.map((u) => u.id)),
    );
  const clearSel = () => setSelected(new Set());
  const bulkSetLevel = (lvl: AccessLevel) =>
    setPerms((prev) => {
      const np = { ...prev };
      selected.forEach((uid) => {
        if (np[uid]) {
          np[uid] = { ...np[uid] };
          ALL_IDS.forEach((id) => (np[uid][id] = lvl));
        }
      });
      return np;
    });
  const bulkPause = () =>
    setUsers((p) =>
      p.map((u) =>
        selected.has(u.id) && u.status === "active"
          ? { ...u, status: "paused", pausedAt: NOW, pausedBy: "Admin" }
          : u,
      ),
    );
  const bulkRevoke = () => {
    setPerms((prev) => {
      const np = { ...prev };
      selected.forEach((uid) => {
        if (np[uid]) {
          np[uid] = { ...np[uid] };
          ALL_IDS.forEach((id) => (np[uid][id] = "No Access"));
        }
      });
      return np;
    });
    setSelected(new Set());
  };
  const toggleCat = (uid: number, key: string) => {
    const k = `${uid}_${key}`;
    setCollCats((prev) => {
      const n = new Set(prev);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  };
  const toggleAssetCat = (key: string) => {
    const k = `asset_${key}`;
    setCollCats((prev) => {
      const n = new Set(prev);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  };
  const setAiStatus = (uid: number, tier: AiTier) =>
    patchUser(uid, { aiStatus: tier });
  const toggleAgencyOptIn = (uid: number, mod: string) =>
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== uid) return u;
        const cur = u.agencyOptIn || [];
        return {
          ...u,
          agencyOptIn: cur.includes(mod)
            ? cur.filter((x) => x !== mod)
            : [...cur, mod],
        };
      }),
    );
  const addIp = (uid: number, ip: string) =>
    setUsers((prev) =>
      prev.map((u) =>
        u.id === uid
          ? { ...u, ipAllowlist: [...(u.ipAllowlist || []), ip] }
          : u,
      ),
    );
  const removeIp = (uid: number, idx: number) =>
    setUsers((prev) =>
      prev.map((u) =>
        u.id === uid
          ? {
              ...u,
              ipAllowlist: (u.ipAllowlist || []).filter((_, j) => j !== idx),
            }
          : u,
      ),
    );
  const getUsersForAsset = (assetId: string) =>
    users.filter(
      (u) =>
        u.status === "active" &&
        perms[u.id] &&
        perms[u.id][assetId] !== "No Access",
    );
  const setAssetPerm = (assetId: string, uid: number, lvl: AccessLevel) =>
    setPerm(uid, assetId, lvl);

  // ── Invite ──
  const openInvite = () => {
    setInviteOpen(true);
    setInviteStep(1);
    setInviteMode("single");
  };
  const closeInvite = () => {
    setInviteOpen(false);
    setInviteStep(1);
    setPasteText("");
    setInvitePreview([]);
    setInviteSingle({
      name: "",
      email: "",
      role: "EMPLOYEE",
      location: "",
      aiStatus: "STANDARD",
    });
  };
  const handleParsePaste = () => {
    setInvitePreview(parsePasteRows(pasteText, users, bulkDefaults));
    setInviteStep(2);
  };
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) || "";
      setInvitePreview(parseCsvText(text, users, bulkDefaults));
      setInviteStep(2);
    };
    reader.readAsText(file);
  };
  const submitSingle = () => {
    if (!inviteSingle.email) return;
    setInvitePreview([
      {
        id: "s_0",
        name: inviteSingle.name || inviteSingle.email.split("@")[0],
        email: inviteSingle.email,
        role: inviteSingle.role,
        location: inviteSingle.location,
        aiStatus: inviteSingle.aiStatus,
        valid: true,
        duplicate: users.some(
          (u) => u.email.toLowerCase() === inviteSingle.email.toLowerCase(),
        ),
      },
    ]);
    setInviteStep(2);
  };
  const removePreviewRow = (id: string) =>
    setInvitePreview((p) => p.filter((r) => r.id !== id));
  const updatePreviewRow = (id: string, field: keyof InviteRow, val: string) =>
    setInvitePreview((p) =>
      p.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    );
  const sendInvites = () => {
    const valid = invitePreview.filter((r) => r.valid && !r.duplicate);
    const newUsers: PermUser[] = valid.map((r, i) => ({
      id: 100 + users.length + i,
      name: r.name,
      email: r.email,
      role: r.role,
      av: r.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      company: INVITE_COMPANY,
      status: "pending",
      locations: r.location ? [r.location] : [],
      dept: null,
      expires: null,
      watermark: true,
      downloads: 0,
      lastDl: null,
      grantedBy: "Admin",
      grantedAt: NOW,
      canGrantProjects: false,
      aiStatus: (r.aiStatus as AiTier) || null,
      retentionConsent: false,
    }));
    setUsers((prev) => [...prev, ...newUsers]);
    setPerms((prev) => {
      const np = { ...prev };
      newUsers.forEach((u) => (np[u.id] = mkDef(u.role)));
      return np;
    });
    setInviteStep(3);
  };

  const value: PermCtx = {
    users,
    perms,
    selUser,
    setSelUser,
    selUserObj,
    search,
    setSearch,
    roleF,
    setRoleF,
    statusF,
    setStatusF,
    tab,
    setTab,
    selected,
    delId,
    setDelId,
    dlExpId,
    setDlExpId,
    killC,
    setKillC,
    compV,
    setCompV,
    assetExp,
    setAssetExp,
    collCats,
    notif,
    setNotif,
    inviteOpen,
    inviteMode,
    setInviteMode,
    inviteStep,
    setInviteStep,
    inviteSingle,
    setInviteSingle,
    pasteText,
    setPasteText,
    invitePreview,
    setInvitePreview,
    bulkDefaults,
    setBulkDefaults,
    filt,
    co,
    actU,
    pendA,
    flagU,
    totDl,
    pausedU,
    aiSeatCost,
    noConsent,
    smallDepts,
    doDel,
    setAllP,
    setCatP,
    setPerm,
    cnt,
    appInv,
    rejInv,
    pauseUser,
    resumeUser,
    getAS,
    toggleSel,
    selAll,
    bulkSetLevel,
    bulkPause,
    bulkRevoke,
    clearSel,
    toggleCat,
    toggleAssetCat,
    setAiStatus,
    toggleAgencyOptIn,
    addIp,
    removeIp,
    getUsersForAsset,
    setAssetPerm,
    openInvite,
    closeInvite,
    handleParsePaste,
    handleCsvUpload,
    submitSingle,
    removePreviewRow,
    updatePreviewRow,
    sendInvites,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
