import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NORTHGATE, VAULT, MODULES, SCORES, TOKENS, type VaultRecord } from "./shared/northgate-mock";
import { EndChoiceScreen } from "./shared/EndChoiceScreen";
import "./shared/onboarding.css";

const { GOLD, GOLD_BRIGHT: GB, GOLD_DIM: GD, RED_BRIGHT: RB } = TOKENS;

// Onboarding step → module(s) activated
const STEPS = [
  { key: "intro", label: "INTRO", activates: [] as string[], copy: "Your business has 8 intelligence hubs. Each hub will light up as we map your operation. Watch the wheel build itself." },
  { key: "framework", label: "FRAMEWORK", activates: ["FRAMEWORK"], copy: "21 yes/no questions establish your brand strategy baseline. Each answer becomes a spoke." },
  { key: "focus", label: "PERCEPTION", activates: ["FOCUS"], copy: "How the world sees Northgate. Companies above 70 command 1.8x acquisition offers." },
  { key: "financials", label: "FINANCIALS", activates: ["FINANCIALS"], copy: "QuickBooks sync. EBITDA bridge model. Revenue leakage detection." },
  { key: "formula", label: "FORMULA", activates: ["FORMULA"], copy: "Customer journey + interaction strategy. Plans generated from your data." },
  { key: "hive", label: "H.I.V.E.", activates: ["HIVE"], copy: "Org graph. Key-man risk triangulation. 5-signal employee scoring." },
  { key: "sum", label: "S.U.M.", activates: ["SUM"], copy: "Strategic Unified Messaging. 7 tabs of internal comms feeding intelligence." },
  { key: "vault", label: "VAULT + PROJECTS", activates: ["VAULT", "PROJECTS"], copy: "Every campaign connects to every asset, file, and metric. Click anything to inspect the web." },
];

type ViewMode = "build" | "interactive";

export default function DemoC_HubWheel() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [view, setView] = useState<ViewMode>("build");
  const [center, setCenter] = useState<string>("HUB"); // 'HUB' or VaultRecord id
  const [search, setSearch] = useState("");
  const [scene, setScene] = useState<"flow" | "end">("flow");

  const activated = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i <= step; i++) STEPS[i].activates.forEach((m) => set.add(m));
    return set;
  }, [step]);

  const onNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else if (view === "build") setView("interactive");
    else setScene("end");
  };

  const focusedRec = VAULT.find((v) => v.id === center);
  const visibleRecords = useMemo(() => {
    if (search) {
      const q = search.toLowerCase();
      const matched = VAULT.filter((v) => v.title.toLowerCase().includes(q) || v.tags.some((t) => t.toLowerCase().includes(q)) || v.module.toLowerCase().includes(q));
      const ids = new Set<string>();
      matched.forEach((m) => { ids.add(m.id); m.connectedTo.forEach((c) => ids.add(c)); });
      return VAULT.filter((v) => ids.has(v.id));
    }
    if (focusedRec) {
      const ids = new Set<string>([focusedRec.id, ...focusedRec.connectedTo]);
      focusedRec.connectedTo.forEach((id) => {
        VAULT.find((v) => v.id === id)?.connectedTo.forEach((c) => ids.add(c));
      });
      return VAULT.filter((v) => ids.has(v.id));
    }
    return VAULT.filter((v) => activated.has(v.module));
  }, [search, focusedRec, activated]);

  if (scene === "end") {
    return (
      <div className="onboarding-scope">
        <button className="ob-exit" onClick={() => nav("/onboarding")}>✕ EXIT</button>
        <EndChoiceScreen
          demoName="Hub & Spokes"
          vaultView={<MiniWheel />}
          onEnterVault={() => nav("/client/1/vault")}
        />
      </div>
    );
  }

  return (
    <div className="onboarding-scope">
      <button className="ob-exit" onClick={() => nav("/onboarding")}>✕ EXIT</button>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Wheel
            activated={activated}
            visibleRecords={visibleRecords}
            center={center}
            focusedRec={focusedRec}
            view={view}
            onSelect={(id) => setCenter(id)}
            onReset={() => { setCenter("HUB"); setSearch(""); }}
          />
        </div>

        <div style={{ width: 460, minWidth: 380, borderLeft: "1px solid #111", padding: "48px 40px", display: "flex", flexDirection: "column", gap: 18, overflowY: "auto" }}>
          {view === "build" ? (
            <BuildPanel step={step} onNext={onNext} />
          ) : (
            <InteractivePanel
              search={search}
              setSearch={setSearch}
              focusedRec={focusedRec}
              onClear={() => { setCenter("HUB"); setSearch(""); }}
              onFinish={() => setScene("end")}
            />
          )}
          <Progress step={step} total={STEPS.length} view={view} />
        </div>
      </div>
    </div>
  );
}

function BuildPanel({ step, onNext }: { step: number; onNext: () => void }) {
  const s = STEPS[step];
  return (
    <>
      <div className="ob-label">STEP {step + 1} / {STEPS.length}</div>
      <h2 style={{ fontSize: 30, fontWeight: 200, color: "#ddd", margin: 0 }}>{s.label}</h2>
      <p style={{ fontSize: 14, color: "#666", lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{s.copy}</p>
      <div style={{ marginTop: 8, fontSize: 11, color: "#444", lineHeight: 1.7 }}>
        {s.activates.length === 0
          ? `Wheel is empty. ${NORTHGATE.company} is your seed.`
          : `Activating ${s.activates.join(" + ")}. ${VAULT.filter((v) => s.activates.includes(v.module)).length} records spawning as spokes.`}
      </div>
      <button className="ob-btn" onClick={onNext}>{step === STEPS.length - 1 ? "EXPLORE WHEEL" : "ACTIVATE"}</button>
    </>
  );
}

function InteractivePanel({ search, setSearch, focusedRec, onClear, onFinish }: { search: string; setSearch: (v: string) => void; focusedRec?: VaultRecord; onClear: () => void; onFinish: () => void }) {
  return (
    <>
      <div className="ob-label">EXPLORE THE WHEEL</div>
      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
        Click any spoke to recenter. Search a campaign or tag and the wheel rebuilds around it.
      </p>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Try "loyalty" or "Q4"...'
        style={{ width: "100%", padding: 12, background: "#0e0e0e", border: "1px solid #1a1a1a", color: GB, fontFamily: "inherit", fontSize: 13, outline: "none" }}
      />
      {focusedRec ? (
        <div style={{ background: "#0e0e0e", border: "1px solid #1a1a1a", padding: 16 }}>
          <div style={{ fontSize: 7, letterSpacing: 3, color: GD, fontWeight: 800 }}>RECORD · {focusedRec.module}</div>
          <div style={{ fontSize: 16, color: "#ddd", margin: "8px 0 12px" }}>{focusedRec.title}</div>
          <Row k="Source" v={focusedRec.source} />
          <Row k="Confidence" v={`${(focusedRec.confidence * 100).toFixed(0)}%`} />
          <Row k="Tags" v={focusedRec.tags.join(" · ")} />
          <Row k="Connections" v={String(focusedRec.connectedTo.length)} />
        </div>
      ) : (
        <div style={{ fontSize: 11, color: "#444", lineHeight: 1.7 }}>
          Active hubs are lit. Each hub's spokes are real records from {NORTHGATE.company}'s VAULT. Hover for source data.
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="ob-btn ob-btn-ghost" onClick={onClear} style={{ flex: 1, marginTop: 0 }}>RESET</button>
        <button className="ob-btn" onClick={onFinish} style={{ flex: 1, marginTop: 0 }}>FINISH</button>
      </div>
    </>
  );
}

function Progress({ step, total, view }: { step: number; total: number; view: ViewMode }) {
  const filled = view === "interactive" ? total : step + 1;
  return (
    <div style={{ marginTop: "auto", display: "flex", gap: 3 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ flex: i === step && view === "build" ? 3 : 1, height: 2, background: i < filled ? `rgba(201,162,39,${0.25 + (i / total) * 0.55})` : "#0e0e0e", transition: "all .5s ease" }} />
      ))}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid #141414", fontSize: 11 }}>
      <span style={{ color: "#555" }}>{k}</span>
      <span style={{ color: "#bbb" }}>{v}</span>
    </div>
  );
}

// === THE WHEEL ===
type WheelProps = {
  activated: Set<string>;
  visibleRecords: VaultRecord[];
  center: string;
  focusedRec?: VaultRecord;
  view: ViewMode;
  onSelect: (id: string) => void;
  onReset: () => void;
};

function Wheel({ activated, visibleRecords, center, focusedRec, view, onSelect, onReset }: WheelProps) {
  const W = 720, H = 720;
  const cx = W / 2, cy = H / 2;
  const innerR = 70;
  const hubR = 200;
  const spokeR = 320;

  const recordsByModule = useMemo(() => {
    const map: Record<string, VaultRecord[]> = {};
    visibleRecords.forEach((r) => { (map[r.module] ||= []).push(r); });
    return map;
  }, [visibleRecords]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 720, height: "auto" }}>
      <defs>
        <radialGradient id="cglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.3" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={innerR * 2.5} fill="url(#cglow)" />

      {/* Hub-to-center spokes */}
      {MODULES.map((m, i) => {
        const angle = (i / MODULES.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * hubR;
        const y = cy + Math.sin(angle) * hubR;
        const isOn = activated.has(m.id);
        return (
          <line
            key={`l-${m.id}`}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke={isOn ? m.color : "#1e1e1e"}
            strokeWidth={isOn ? 1.5 : 0.5}
            opacity={isOn ? 0.6 : 0.4}
          />
        );
      })}

      {/* Module hubs */}
      {MODULES.map((m, i) => {
        const angle = (i / MODULES.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * hubR;
        const y = cy + Math.sin(angle) * hubR;
        const isOn = activated.has(m.id);
        const records = recordsByModule[m.id] ?? [];

        return (
          <g key={m.id}>
            {/* Spokes from hub to records */}
            {isOn && records.map((r, ri) => {
              const subAngle = angle + ((ri - (records.length - 1) / 2) * 0.18);
              const sx = cx + Math.cos(subAngle) * spokeR;
              const sy = cy + Math.sin(subAngle) * spokeR;
              const isFocused = focusedRec?.id === r.id || focusedRec?.connectedTo.includes(r.id);
              const dim = focusedRec && !isFocused ? 0.18 : 1;
              return (
                <g key={r.id} style={{ cursor: view === "interactive" ? "pointer" : "default" }} onClick={() => view === "interactive" && onSelect(r.id)}>
                  <line x1={x} y1={y} x2={sx} y2={sy} stroke={r.status === "red" ? RB : m.color} strokeWidth={isFocused ? 1.5 : 0.7} opacity={0.5 * dim} />
                  <circle cx={sx} cy={sy} r={isFocused ? 7 : 5} fill={r.status === "red" ? RB : m.color} opacity={0.85 * dim} />
                  <text x={sx} y={sy + 16} textAnchor="middle" fontSize="7" fill={r.status === "red" ? "#aa4444" : "#888"} opacity={0.7 * dim} style={{ pointerEvents: "none", letterSpacing: 1 }}>{r.title.length > 18 ? r.title.slice(0, 18) + "…" : r.title}</text>
                </g>
              );
            })}

            {/* Hub circle */}
            <circle
              cx={x} cy={y}
              r={isOn ? 32 : 22}
              fill={isOn ? m.color : "#0e0e0e"}
              stroke={isOn ? m.color : "#222"}
              strokeWidth={1.5}
              opacity={isOn ? 0.95 : 0.5}
              style={{ transition: "all .6s ease" }}
            />
            <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="1.5" fill={isOn ? "#0a0a0a" : "#444"}>{m.label.replace(".", "")}</text>
            {isOn && records.length > 0 && (
              <text x={x} y={y + 46} textAnchor="middle" fontSize="8" fill="#555" letterSpacing="1">{records.length} REC</text>
            )}
          </g>
        );
      })}

      {/* Center */}
      <circle cx={cx} cy={cy} r={innerR} fill="#0a0a0a" stroke={GOLD} strokeWidth="1.5" style={{ cursor: "pointer" }} onClick={onReset} />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9" fontWeight="800" letterSpacing="2" fill={GD}>NORTHGATE</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="22" fontWeight="800" fill={GB}>{SCORES.gestalt.toFixed(1)}</text>
      <text x={cx} y={cy + 24} textAnchor="middle" fontSize="6" letterSpacing="2" fill="#555">GESTALT</text>
    </svg>
  );
}

function MiniWheel() {
  return (
    <svg viewBox="0 0 320 320" style={{ width: 320, height: 320, margin: "0 auto", display: "block" }}>
      {MODULES.map((m, i) => {
        const a = (i / MODULES.length) * Math.PI * 2 - Math.PI / 2;
        const x = 160 + Math.cos(a) * 110;
        const y = 160 + Math.sin(a) * 110;
        return (
          <g key={m.id}>
            <line x1={160} y1={160} x2={x} y2={y} stroke={m.color} strokeWidth="0.8" opacity="0.5" />
            <circle cx={x} cy={y} r="18" fill={m.color} opacity="0.9" />
            <text x={x} y={y + 3} textAnchor="middle" fontSize="7" fontWeight="800" fill="#0a0a0a">{m.label.replace(".", "")}</text>
          </g>
        );
      })}
      <circle cx="160" cy="160" r="40" fill="#0a0a0a" stroke={GOLD} strokeWidth="1.2" />
      <text x="160" y="158" textAnchor="middle" fontSize="7" fontWeight="800" letterSpacing="1.5" fill={GD}>NORTHGATE</text>
      <text x="160" y="174" textAnchor="middle" fontSize="14" fontWeight="800" fill={GB}>{SCORES.gestalt.toFixed(1)}</text>
    </svg>
  );
}
