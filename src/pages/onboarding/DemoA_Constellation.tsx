import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { NORTHGATE, FRAMEWORK_Q, FRAMEWORK_DEMO_ANSWERS, VAULT, SCORES, TOKENS, type VaultRecord } from "./shared/northgate-mock";
import { EndChoiceScreen } from "./shared/EndChoiceScreen";
import "./shared/onboarding.css";

type Node = { id: string; x: number; y: number; tx: number; ty: number; r: number; o: number; born: number; hue: number; type: "gold" | "red" | "neutral"; rec?: VaultRecord };
type Edge = { a: number; b: number; o: number; born: number; type: "gold" | "red" | "mixed" };

const { GOLD, GOLD_BRIGHT: GB, GOLD_DIM: GD, RED, RED_BRIGHT: RB } = TOKENS;

export default function DemoA_Constellation() {
  const nav = useNavigate();
  const [scene, setScene] = useState(0);
  const [fade, setFade] = useState(true);
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [fw, setFw] = useState<("Y" | "N")[]>([]);
  const [progress, setProgress] = useState(0);
  const [zoomedOut, setZoomedOut] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<VaultRecord | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);

  const go = () => { setFade(false); setTimeout(() => { setScene((p) => p + 1); setFade(true); }, 450); };

  const addNodes = (count: number, prog: number, type: "gold" | "red", recs?: VaultRecord[]) => {
    setProgress(prog);
    const curr = nodesRef.current;
    const startIdx = curr.length;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 260;
      const cx = 400, cy = 450;
      curr.push({
        id: recs?.[i]?.id ?? `${type}-${startIdx + i}`,
        x: cx + Math.cos(angle) * dist * 1.3,
        y: cy + Math.sin(angle) * dist,
        tx: cx + Math.cos(angle) * (dist * 0.55),
        ty: cy + Math.sin(angle) * (dist * 0.55),
        r: type === "red" ? 1.4 + Math.random() * 1.8 : 1.6 + Math.random() * 2.4,
        o: 0.35 + Math.random() * 0.5,
        born: Date.now(),
        hue: Math.random(),
        type,
        rec: recs?.[i],
      });
    }
    // wire edges
    for (let i = startIdx; i < curr.length; i++) {
      for (let j = 0; j < curr.length; j++) {
        if (i === j) continue;
        const dx = curr[i].tx - curr[j].tx, dy = curr[i].ty - curr[j].ty;
        const d = Math.sqrt(dx * dx + dy * dy);
        const same = curr[i].type === curr[j].type;
        if (d < (same ? 130 : 100) && Math.random() > (same ? 0.6 : 0.85)) {
          edgesRef.current.push({
            a: i, b: j, o: 0.06 + Math.random() * 0.1, born: Date.now(),
            type: curr[i].type === "red" && curr[j].type === "red" ? "red" : curr[i].type === "gold" && curr[j].type === "gold" ? "gold" : "mixed",
          });
        }
      }
    }
  };

  // canvas loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0;
    const resize = () => {
      const parent = cv.parentElement!;
      w = parent.clientWidth; h = parent.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.width = w + "px"; cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, w, h);
      const intensity = progress / 100;
      const sx = w / 800, sy = h / 900;

      // background glow
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.6);
      bg.addColorStop(0, `rgba(201,162,39,${0.01 + intensity * 0.04})`);
      bg.addColorStop(1, "rgba(10,10,10,0)");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      const nodes = nodesRef.current, edges = edgesRef.current, now = Date.now();
      const matchIds = new Set<string>();
      if (search) {
        const q = search.toLowerCase();
        nodes.forEach((n) => {
          const r = n.rec;
          if (!r) return;
          if (r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)) || r.module.toLowerCase().includes(q)) {
            matchIds.add(n.id);
            r.connectedTo.forEach((id) => matchIds.add(id));
          }
        });
      }

      // physics drift
      nodes.forEach((n) => {
        n.x += (n.tx - n.x) * 0.006;
        n.y += (n.ty - n.y) * 0.006;
        n.x += Math.sin(t * 1.2 + n.hue * 10) * 0.12;
        n.y += Math.cos(t * 1.0 + n.hue * 8) * 0.12;
      });

      // edges
      edges.forEach((e) => {
        const a = nodes[e.a], b = nodes[e.b];
        if (!a || !b) return;
        const age = Math.min((now - e.born) / 2500, 1);
        const dim = search && !(matchIds.has(a.id) && matchIds.has(b.id)) ? 0.15 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x * sx, a.y * sy);
        const mx = (a.x + b.x) / 2 + Math.sin(t + e.a) * 6;
        const my = (a.y + b.y) / 2 + Math.cos(t + e.b) * 6;
        ctx.quadraticCurveTo(mx * sx, my * sy, b.x * sx, b.y * sy);
        const pulse = 0.4 + Math.sin(t * 2.5 + e.a * 0.3) * 0.3;
        ctx.strokeStyle = e.type === "red"
          ? `rgba(184,48,48,${e.o * age * pulse * 0.7 * dim})`
          : e.type === "gold"
            ? `rgba(201,162,39,${e.o * age * pulse * dim})`
            : `rgba(160,120,50,${e.o * age * pulse * 0.5 * dim})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // nodes
      nodes.forEach((n) => {
        const age = Math.min((now - n.born) / 800, 1);
        const px = n.x * sx, py = n.y * sy;
        const isRed = n.type === "red";
        const dim = search && !matchIds.has(n.id) ? 0.18 : 1;
        const glowR = n.r * (isRed ? 5 : 7);
        const glow = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        glow.addColorStop(0, isRed ? `rgba(184,48,48,${0.07 * age * dim})` : `rgba(201,162,39,${0.08 * age * dim})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(px - glowR, py - glowR, glowR * 2, glowR * 2);
        ctx.beginPath();
        ctx.arc(px, py, n.r * age, 0, Math.PI * 2);
        ctx.fillStyle = isRed
          ? `rgba(184,48,48,${n.o * age * dim})`
          : `rgba(226,181,63,${n.o * age * dim})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [progress, search]);

  // click → select
  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!zoomedOut) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left, py = e.clientY - rect.top;
    const sx = rect.width / 800, sy = rect.height / 900;
    let best: Node | null = null;
    let bestD = 20;
    nodesRef.current.forEach((n) => {
      const d = Math.hypot(n.x * sx - px, n.y * sy - py);
      if (d < bestD) { bestD = d; best = n; }
    });
    if (best && (best as Node).rec) setSelected((best as Node).rec!);
  };

  const answerFw = (a: "Y" | "N") => {
    const next = [...fw, a];
    setFw(next);
    const recs = VAULT.filter((v) => v.module === "FRAMEWORK").slice(next.length - 1, next.length);
    if (a === "Y") addNodes(5, 15 + next.length * 6, "gold", recs);
    else { addNodes(3, 15 + next.length * 6, "red", recs); addNodes(2, 15 + next.length * 6, "gold"); }
    if (next.length >= FRAMEWORK_DEMO_ANSWERS.length) {
      // pour in remaining vault records
      const remaining = VAULT.filter((v) => v.module !== "FRAMEWORK");
      const goldRecs = remaining.filter((r) => r.status === "gold");
      const redRecs = remaining.filter((r) => r.status === "red");
      addNodes(goldRecs.length, 60, "gold", goldRecs);
      addNodes(redRecs.length, 65, "red", redRecs);
      setTimeout(go, 500);
    }
  };

  const yes = fw.filter((a) => a === "Y").length;
  const no = fw.filter((a) => a === "N").length;

  const scenes: Array<() => React.ReactNode> = [
    () => (
      <Pane>
        <div className="ob-label">GESTALT INTELLIGENCE</div>
        <h1 style={h1}>Every business has<br />intelligence trapped<br />inside its operations.</h1>
        <p style={pBody}>Gold = confirmed value. Red = blind spots draining value silently. Watch both emerge as we map what's really happening at {NORTHGATE.company}.</p>
        <button className="ob-btn" onClick={() => { addNodes(4, 4, "gold"); go(); }}>DISCOVER</button>
      </Pane>
    ),
    () => (
      <Pane>
        <p style={pBody}>I'm GESTALT INTELLIGENCE. I find patterns humans miss, I remember everything, I never stop learning about your business.</p>
        <h2 style={h2}>Who am I working with?</h2>
        <input
          autoFocus
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && nameInput) { setName(nameInput); addNodes(3, 8, "gold"); go(); } }}
          placeholder="Your name"
          style={input}
        />
        {nameInput && <button className="ob-btn" onClick={() => { setName(nameInput); addNodes(3, 8, "gold"); go(); }}>CONTINUE</button>}
      </Pane>
    ),
    () => (
      <Pane>
        <div className="ob-label">FRAMEWORK · 21 QUESTIONS</div>
        <h2 style={h2}>Yes confirms value. No reveals a blind spot.</h2>
        <p style={pBody}>Welcome {name || "operator"}. Each answer becomes a permanent record in your VAULT — searchable forever, cross-referenced with 2,400+ company profiles.</p>
        <button className="ob-btn" onClick={go}>BEGIN</button>
      </Pane>
    ),
    () => (
      <Pane>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, maxWidth: 420 }}>
          <span className="ob-label" style={{ marginBottom: 0 }}>FRAMEWORK</span>
          <div style={{ display: "flex", gap: 14, fontSize: 11 }}>
            {yes > 0 && <span style={{ color: GB, fontWeight: 600 }}>{yes} <span style={{ fontSize: 8, color: "#444" }}>confirmed</span></span>}
            {no > 0 && <span style={{ color: RB, fontWeight: 600 }}>{no} <span style={{ fontSize: 8, color: "#444" }}>blind</span></span>}
            <span style={{ color: "#666" }}>{fw.length + 1} / {FRAMEWORK_DEMO_ANSWERS.length}</span>
          </div>
        </div>
        <h2 style={{ ...h2, fontSize: 22, minHeight: 80 }}>{FRAMEWORK_Q[fw.length] || FRAMEWORK_Q[0]}</h2>
        <div style={{ height: 1, background: "#141414", margin: "32px 0 28px", maxWidth: 420 }}>
          <div style={{ height: 1, background: `linear-gradient(to right, ${GOLD}, ${GB})`, width: `${(fw.length / FRAMEWORK_DEMO_ANSWERS.length) * 100}%`, transition: "width .5s ease" }} />
        </div>
        <div style={{ display: "flex", gap: 14, maxWidth: 420 }}>
          <button onClick={() => answerFw("Y")} style={ynBtn(GOLD)}>YES</button>
          <button onClick={() => answerFw("N")} style={ynBtn(RED)}>NO</button>
        </div>
      </Pane>
    ),
    () => (
      <Pane>
        <div className="ob-label">DIAGNOSTIC COMPLETE</div>
        <div style={{ fontSize: 64, fontWeight: 800, color: GB }}>{SCORES.framework.value}<span style={{ fontSize: 24, color: "#333" }}> / {SCORES.framework.of}</span></div>
        <p style={pBody}>{VAULT.length} permanent records created. {VAULT.filter((v) => v.status === "red").length} blind spots mapped. Your knowledge bank is alive.</p>
        <p style={{ ...pBody, color: GD, fontSize: 12 }}>Next: zoom out. See everything at once.</p>
        <button className="ob-btn" onClick={() => { setZoomedOut(true); go(); }}>OPEN CONSTELLATION</button>
      </Pane>
    ),
    () => (
      <Pane wide>
        <div className="ob-label">YOUR CONSTELLATION</div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search · campaigns, files, blind spots..."
          style={{ ...input, fontSize: 16, maxWidth: 360 }}
        />
        <p style={{ ...pBody, fontSize: 12, marginTop: 16 }}>
          Try "loyalty" — every record connected to that blind spot will light up. The rest fades. This is how your team will navigate VAULT.
        </p>
        {selected ? (
          <ResearchPanel rec={selected} onClose={() => setSelected(null)} />
        ) : (
          <p style={{ ...pBody, fontSize: 11, color: "#444", marginTop: 24 }}>Click any node in the constellation to inspect its source, confidence, and connections.</p>
        )}
        <button className="ob-btn" onClick={go} style={{ marginTop: 24 }}>FINISH</button>
      </Pane>
    ),
    () => (
      <EndChoiceScreen
        demoName="Constellation"
        vaultView={
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {["FRAMEWORK", "FOCUS", "FINANCIALS", "FORMULA", "HIVE", "SUM", "VAULT", "PROJECTS"].map((m) => (
              <div key={m} style={{ background: "#0e0e0e", border: "1px solid #1a1a1a", padding: 12, textAlign: "left" }}>
                <div style={{ fontSize: 7, letterSpacing: 3, color: GD, fontWeight: 800 }}>{m}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: GB, marginTop: 4 }}>{VAULT.filter((v) => v.module === m).length}</div>
                <div style={{ fontSize: 9, color: "#555" }}>records</div>
              </div>
            ))}
          </div>
        }
        onEnterVault={() => nav("/client/1/vault")}
      />
    ),
  ];

  return (
    <div className="onboarding-scope">
      <button className="ob-exit" onClick={() => nav("/onboarding")}>✕ EXIT</button>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <div style={{ flex: zoomedOut ? 2 : 1, position: "relative", transition: "flex 1.2s ease", overflow: "hidden" }}>
          <canvas ref={canvasRef} onClick={onCanvasClick} style={{ position: "absolute", inset: 0, cursor: zoomedOut ? "pointer" : "default" }} />
          {zoomedOut && (
            <div style={{ position: "absolute", top: 24, left: 24, fontSize: 9, letterSpacing: 3, color: GD, fontWeight: 700 }}>
              {NORTHGATE.company.toUpperCase()} · {nodesRef.current.length} NODES · {edgesRef.current.length} CONNECTIONS
            </div>
          )}
        </div>
        <div style={{ width: zoomedOut ? 460 : "46%", maxWidth: 560, minWidth: 380, borderLeft: "1px solid #111", position: "relative", opacity: fade ? 1 : 0, transition: "opacity .45s ease, width 1.2s ease" }}>
          {scenes[Math.min(scene, scenes.length - 1)]()}
          <div style={{ position: "absolute", bottom: 22, left: 48, right: 48, display: "flex", gap: 3 }}>
            {scenes.map((_, i) => (
              <div key={i} style={{ flex: i === scene ? 3 : 1, height: 2, background: i <= scene ? `rgba(201,162,39,${0.2 + (i / scenes.length) * 0.5})` : "#0e0e0e", transition: "all .6s ease" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pane({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: wide ? "0 48px" : "0 56px" }}>{children}</div>;
}

function ResearchPanel({ rec, onClose }: { rec: VaultRecord; onClose: () => void }) {
  return (
    <div style={{ marginTop: 20, padding: "16px 18px", background: "#0e0e0e", border: `1px solid ${rec.status === "red" ? "#2a1414" : "#1a1a1a"}`, maxWidth: 380 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 7, letterSpacing: 3, color: rec.status === "red" ? RB : GD, fontWeight: 800 }}>RESEARCH · {rec.module}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 12 }}>✕</button>
      </div>
      <div style={{ fontSize: 14, fontWeight: 400, color: "#ddd", marginBottom: 12 }}>{rec.title}</div>
      <Row k="Source" v={rec.source} />
      <Row k="Confidence" v={`${(rec.confidence * 100).toFixed(0)}%`} />
      <Row k="Recorded" v={rec.date} />
      <Row k="Connections" v={String(rec.connectedTo.length)} />
      <Row k="Tags" v={rec.tags.join(" · ")} />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: "1px solid #141414", fontSize: 11 }}>
      <span style={{ color: "#555" }}>{k}</span>
      <span style={{ color: "#bbb" }}>{v}</span>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: 38, fontWeight: 200, lineHeight: 1.3, color: "#ddd", margin: 0, maxWidth: 480 };
const h2: React.CSSProperties = { fontSize: 28, fontWeight: 200, color: "#bbb", margin: "0 0 24px" };
const pBody: React.CSSProperties = { fontSize: 14, color: "#555", marginTop: 18, lineHeight: 1.8, maxWidth: 400, fontWeight: 300 };
const input: React.CSSProperties = { width: "100%", maxWidth: 340, height: 48, background: "transparent", border: "none", borderBottom: "1px solid rgba(201,162,39,.18)", color: GB, fontFamily: "inherit", fontSize: 20, fontWeight: 300, outline: "none", padding: 0 };
const ynBtn = (border: string): React.CSSProperties => ({ flex: 1, padding: 20, background: "transparent", border: `1px solid ${border}40`, color: border === GOLD ? GOLD : "#553333", fontFamily: "inherit", fontSize: 16, fontWeight: 600, letterSpacing: 5, cursor: "pointer" });
