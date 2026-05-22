import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NORTHGATE, VAULT, MODULES, SCORES, TOKENS, type VaultRecord } from "./shared/northgate-mock";
import { EndChoiceScreen } from "./shared/EndChoiceScreen";
import "./shared/onboarding.css";

const { GOLD, GOLD_BRIGHT: GB, GOLD_DIM: GD, RED_BRIGHT: RB } = TOKENS;

type ChatMsg = { who: "gi" | "user"; text: string };

type Beat = {
  who: "gi" | "user" | "card";
  text?: string;
  card?: VaultRecord;
};

// Pre-scripted conversation. Each "card" beat spawns a vault record.
const BEATS: Beat[] = [
  { who: "gi", text: `Hi. I'm GESTALT INTELLIGENCE. I'll find what's hiding in ${NORTHGATE.company}. Ready?` },
  { who: "user", text: "Let's go." },
  { who: "gi", text: "Do you have a documented brand strategy?" },
  { who: "user", text: "Yes — updated last year." },
  { who: "card", card: VAULT[0] },
  { who: "gi", text: "Can your team articulate your competitive advantage in one sentence?" },
  { who: "user", text: "Most can." },
  { who: "card", card: VAULT[1] },
  { who: "gi", text: "Do you formally measure customer loyalty?" },
  { who: "user", text: "No — we've talked about NPS but never set it up." },
  { who: "card", card: VAULT[2] },
  { who: "gi", text: "Got it. That's a blind spot — Bain data shows it costs ~$800K/yr in revenue leakage for companies your size. I'm tagging it red." },
  { who: "gi", text: "Pricing — value-based or competitor-based?" },
  { who: "user", text: "Value-based, mostly." },
  { who: "card", card: VAULT[3] },
  { who: "gi", text: "Quarterly brand metric review with leadership?" },
  { who: "user", text: "We don't formally review." },
  { who: "card", card: VAULT[4] },
  { who: "gi", text: "Logging governance gap. Now connecting to FOCUS — perception layer." },
  { who: "card", card: VAULT[5] },
  { who: "card", card: VAULT[6] },
  { who: "card", card: VAULT[7] },
  { who: "gi", text: "Pulling FINANCIALS from QuickBooks…" },
  { who: "card", card: VAULT[8] },
  { who: "card", card: VAULT[9] },
  { who: "gi", text: "Generating FORMULA — your customer journey + a remediation plan for the loyalty gap." },
  { who: "card", card: VAULT[10] },
  { who: "card", card: VAULT[11] },
  { who: "gi", text: "Importing H.I.V.E. signals…" },
  { who: "card", card: VAULT[12] },
  { who: "card", card: VAULT[13] },
  { who: "gi", text: "Adding S.U.M., PROJECTS, and VAULT assets…" },
  { who: "card", card: VAULT[14] },
  { who: "card", card: VAULT[15] },
  { who: "card", card: VAULT[16] },
  { who: "card", card: VAULT[17] },
  { who: "gi", text: `Done. ${VAULT.length} permanent records. ${VAULT.filter((v) => v.status === "red").length} blind spots tagged. Want to see your knowledge bank?` },
];

type Phase = "chat" | "sphere" | "end";

export default function DemoB_CardDeck() {
  const nav = useNavigate();
  const [beatIdx, setBeatIdx] = useState(0);
  const [stack, setStack] = useState<VaultRecord[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [phase, setPhase] = useState<Phase>("chat");
  const [showStack, setShowStack] = useState(false);
  const stackRef = useRef<HTMLDivElement | null>(null);

  // Auto-advance beats
  useEffect(() => {
    if (phase !== "chat") return;
    if (beatIdx >= BEATS.length) return;
    const b = BEATS[beatIdx];
    const delay = b.who === "card" ? 350 : b.who === "user" ? 700 : 1100;
    const t = setTimeout(() => {
      if (b.who === "card" && b.card) {
        setStack((s) => [...s, b.card!]);
      } else if (b.text) {
        setChat((c) => [...c, { who: b.who as "gi" | "user", text: b.text! }]);
      }
      setBeatIdx((i) => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [beatIdx, phase]);

  // auto-scroll chat
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [chat]);

  if (phase === "end") {
    return (
      <div className="onboarding-scope">
        <button className="ob-exit" onClick={() => nav("/onboarding")}>✕ EXIT</button>
        <EndChoiceScreen
          demoName="Card Deck"
          vaultView={
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
              {stack.slice(0, 12).map((r) => (
                <CardThumb key={r.id} rec={r} />
              ))}
            </div>
          }
          onEnterVault={() => nav("/client/1/vault")}
        />
      </div>
    );
  }

  if (phase === "sphere") {
    return (
      <div className="onboarding-scope">
        <button className="ob-exit" onClick={() => nav("/onboarding")}>✕ EXIT</button>
        <SphereView records={stack} onFinish={() => setPhase("end")} />
      </div>
    );
  }

  const done = beatIdx >= BEATS.length;

  return (
    <div className="onboarding-scope">
      <button className="ob-exit" onClick={() => nav("/onboarding")}>✕ EXIT</button>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* Chat panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "48px 56px 24px", maxWidth: 720 }}>
          <div className="ob-label">GESTALT INTELLIGENCE · {NORTHGATE.company.toUpperCase()}</div>
          <div ref={chatBoxRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingRight: 12 }}>
            {chat.map((m, i) => <Bubble key={i} msg={m} />)}
            {!done && BEATS[beatIdx]?.who === "gi" && <Typing />}
          </div>
          {done ? (
            <button className="ob-btn" style={{ alignSelf: "flex-start" }} onClick={() => setPhase("sphere")}>OPEN KNOWLEDGE BANK</button>
          ) : (
            <div style={{ fontSize: 10, color: "#333", letterSpacing: 2, marginTop: 16 }}>GI IS WORKING…</div>
          )}
        </div>

        {/* Card stack panel */}
        <div style={{ width: 420, minWidth: 380, borderLeft: "1px solid #111", padding: "48px 36px", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div className="ob-label">VAULT</div>
            <button onClick={() => setShowStack((s) => !s)} style={{ background: "none", border: "none", color: GD, fontSize: 10, letterSpacing: 2, cursor: "pointer" }}>{showStack ? "STACK" : "FAN OUT"}</button>
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, color: GB, marginTop: 8 }}>{stack.length}</div>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: 1 }}>PERMANENT RECORDS</div>

          <div ref={stackRef} style={{ position: "relative", flex: 1, marginTop: 28, overflow: "hidden" }}>
            {stack.map((r, i) => (
              <Card key={r.id} rec={r} index={i} total={stack.length} fanOut={showStack} />
            ))}
            {stack.length === 0 && (
              <div style={{ fontSize: 12, color: "#333", textAlign: "center", marginTop: 80, lineHeight: 1.7 }}>Cards will materialize here as you answer.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: ChatMsg }) {
  const isGi = msg.who === "gi";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isGi ? "flex-start" : "flex-end" }}>
      <div style={{ fontSize: 7, letterSpacing: 3, color: isGi ? GD : "#444", fontWeight: 800, marginBottom: 4 }}>{isGi ? "GI" : "YOU"}</div>
      <div style={{ maxWidth: 480, padding: "12px 16px", background: isGi ? "rgba(201,162,39,.05)" : "#0e0e0e", border: `1px solid ${isGi ? "rgba(201,162,39,.15)" : "#1a1a1a"}`, color: isGi ? "#ddd" : "#aaa", fontSize: 13, lineHeight: 1.7, fontWeight: 300 }}>
        {msg.text}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 5, height: 5, background: GD, borderRadius: "50%", opacity: 0.4, animation: `pulse 1s ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: .2; } 50% { opacity: .8; } }`}</style>
    </div>
  );
}

function Card({ rec, index, total, fanOut }: { rec: VaultRecord; index: number; total: number; fanOut: boolean }) {
  const mod = MODULES.find((m) => m.id === rec.module);
  const color = rec.status === "red" ? RB : mod?.color ?? GOLD;
  const isLatest = index === total - 1;
  // stack mode: offset slightly. fanOut: vertical list.
  const style: React.CSSProperties = fanOut
    ? { position: "relative", marginBottom: 8, transform: "none", animation: isLatest ? "fly 0.5s ease" : "none" }
    : {
        position: "absolute",
        top: (total - 1 - index) * 6,
        left: (total - 1 - index) * 3,
        transform: `rotate(${((index * 31) % 6) - 3}deg)`,
        zIndex: index,
        animation: isLatest ? "fly 0.6s ease" : "none",
      };

  return (
    <div style={{ ...style, background: "#0e0e0e", border: `1px solid ${color}40`, borderLeft: `3px solid ${color}`, padding: 12, width: "100%" }}>
      <style>{`@keyframes fly { from { opacity: 0; transform: translateX(120px) rotate(20deg); } to { opacity: 1; } }`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 7, letterSpacing: 2, color, fontWeight: 800 }}>{rec.module}</span>
        <span style={{ fontSize: 7, color: "#444" }}>{rec.status === "red" ? "BLIND SPOT" : rec.type.toUpperCase()}</span>
      </div>
      <div style={{ fontSize: 12, color: "#ddd", fontWeight: 400, marginBottom: 4 }}>{rec.title}</div>
      <div style={{ fontSize: 9, color: "#555" }}>{rec.source} · {(rec.confidence * 100).toFixed(0)}% conf · {rec.date}</div>
    </div>
  );
}

function CardThumb({ rec }: { rec: VaultRecord }) {
  const mod = MODULES.find((m) => m.id === rec.module);
  const color = rec.status === "red" ? RB : mod?.color ?? GOLD;
  return (
    <div style={{ background: "#0e0e0e", border: `1px solid ${color}40`, borderLeft: `2px solid ${color}`, padding: 8, fontSize: 8 }}>
      <div style={{ color, fontWeight: 800, letterSpacing: 1, marginBottom: 3 }}>{rec.module}</div>
      <div style={{ color: "#aaa", fontSize: 9, fontWeight: 400, lineHeight: 1.3 }}>{rec.title.slice(0, 28)}</div>
    </div>
  );
}

// === SPHERE VIEW ===
function SphereView({ records, onFinish }: { records: VaultRecord[]; onFinish: () => void }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<VaultRecord | null>(null);
  const [rot, setRot] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => { setRot((r) => r + 0.0015); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const matchIds = useMemo(() => {
    if (!search) return null;
    const q = search.toLowerCase();
    const ids = new Set<string>();
    records.forEach((r) => {
      if (r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)) || r.module.toLowerCase().includes(q)) {
        ids.add(r.id);
        r.connectedTo.forEach((c) => ids.add(c));
      }
    });
    return ids;
  }, [search, records]);

  // 3D positions on sphere
  const W = 720, H = 720;
  const cx = W / 2, cy = H / 2;
  const R = 260;
  const positioned = records.map((r, i) => {
    const phi = Math.acos(-1 + (2 * i) / records.length);
    const theta = Math.sqrt(records.length * Math.PI) * phi + rot;
    const x = Math.cos(theta) * Math.sin(phi);
    const y = Math.cos(phi);
    const z = Math.sin(theta) * Math.sin(phi);
    return { rec: r, x, y, z };
  });
  positioned.sort((a, b) => a.z - b.z);

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 720, height: "auto" }}>
          <defs>
            <radialGradient id="sphere-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={R * 1.4} fill="url(#sphere-glow)" />
          {/* connecting lines */}
          {records.map((r) =>
            r.connectedTo.map((cid) => {
              const a = positioned.find((p) => p.rec.id === r.id);
              const b = positioned.find((p) => p.rec.id === cid);
              if (!a || !b) return null;
              const dim = matchIds && !(matchIds.has(r.id) && matchIds.has(cid)) ? 0.1 : 0.4;
              return (
                <line
                  key={`${r.id}-${cid}`}
                  x1={cx + a.x * R} y1={cy + a.y * R}
                  x2={cx + b.x * R} y2={cy + b.y * R}
                  stroke={GOLD} strokeWidth="0.5" opacity={dim}
                />
              );
            })
          )}
          {positioned.map(({ rec, x, y, z }) => {
            const mod = MODULES.find((m) => m.id === rec.module);
            const color = rec.status === "red" ? RB : mod?.color ?? GOLD;
            const depth = (z + 1) / 2;
            const dim = matchIds && !matchIds.has(rec.id) ? 0.15 : 1;
            const size = 4 + depth * 4;
            return (
              <g key={rec.id} style={{ cursor: "pointer" }} onClick={() => setSelected(rec)}>
                <circle cx={cx + x * R} cy={cy + y * R} r={size} fill={color} opacity={(0.4 + depth * 0.6) * dim} />
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ width: 420, minWidth: 380, borderLeft: "1px solid #111", padding: "48px 36px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="ob-label">KNOWLEDGE BANK · 360°</div>
        <h2 style={{ fontSize: 24, fontWeight: 200, color: "#ddd", margin: 0 }}>{records.length} records orbiting.</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search "loyalty" "Q4" "blind"…'
          style={{ width: "100%", padding: 12, background: "#0e0e0e", border: "1px solid #1a1a1a", color: GB, fontFamily: "inherit", fontSize: 13, outline: "none" }}
        />
        {selected ? (
          <div style={{ background: "#0e0e0e", border: "1px solid #1a1a1a", padding: 16 }}>
            <div style={{ fontSize: 7, letterSpacing: 3, color: GD, fontWeight: 800 }}>RESEARCH · {selected.module}</div>
            <div style={{ fontSize: 14, color: "#ddd", margin: "8px 0 12px" }}>{selected.title}</div>
            <Row k="Source" v={selected.source} />
            <Row k="Confidence" v={`${(selected.confidence * 100).toFixed(0)}%`} />
            <Row k="Connections" v={String(selected.connectedTo.length)} />
            <Row k="Tags" v={selected.tags.join(" · ")} />
          </div>
        ) : (
          <p style={{ fontSize: 12, color: "#555", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
            Click any node to see its source, confidence, and connections. Search filters the sphere in real time.
          </p>
        )}
        <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
          <button className="ob-btn" onClick={onFinish} style={{ flex: 1, marginTop: 0 }}>FINISH</button>
        </div>
      </div>
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
