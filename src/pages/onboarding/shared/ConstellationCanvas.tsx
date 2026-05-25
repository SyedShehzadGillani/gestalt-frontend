import { useEffect, useRef } from "react";

// Constantly-building constellation. Caller pushes nodes via addNode() — once added,
// they stay forever. Gold = YES / confirmed. Red = NO / blindspot.

export type ConstellationNode = {
  id: string;
  type: "gold" | "red";
  born: number;
  x: number; y: number; tx: number; ty: number;
  r: number; o: number; hue: number;
};

export type ConstellationHandle = {
  addNodes: (count: number, type: "gold" | "red") => void;
  nodeCount: () => number;
};

export function useConstellation(canvasRef: React.RefObject<HTMLCanvasElement>): ConstellationHandle {
  const nodesRef = useRef<ConstellationNode[]>([]);
  const edgesRef = useRef<{ a: number; b: number; o: number; born: number; type: "gold" | "red" | "mixed" }[]>([]);
  const animRef = useRef<number>(0);

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
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const now = Date.now();
      // Constellation visual center sits at the 1/3 mark of the page:
      // node x=400 → draw_x = w/3 (sx = w/1200), node y=450 → draw_y = h/2.
      const sx = w / 1200, sy = h / 900;
      const intensity = Math.min(nodes.length / 200, 1);

      const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.6);
      bg.addColorStop(0, `rgba(201,162,39,${0.01 + intensity * 0.05})`);
      bg.addColorStop(1, "rgba(10,10,10,0)");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      nodes.forEach((n) => {
        n.x += (n.tx - n.x) * 0.006;
        n.y += (n.ty - n.y) * 0.006;
        n.x += Math.sin(t * 1.2 + n.hue * 10) * 0.12;
        n.y += Math.cos(t * 1.0 + n.hue * 8) * 0.12;
      });

      edges.forEach((e) => {
        const a = nodes[e.a], b = nodes[e.b];
        if (!a || !b) return;
        const age = Math.min((now - e.born) / 2500, 1);
        ctx.beginPath();
        ctx.moveTo(a.x * sx, a.y * sy);
        const mx = (a.x + b.x) / 2 + Math.sin(t + e.a) * 6;
        const my = (a.y + b.y) / 2 + Math.cos(t + e.b) * 6;
        ctx.quadraticCurveTo(mx * sx, my * sy, b.x * sx, b.y * sy);
        const pulse = 0.4 + Math.sin(t * 2.5 + e.a * 0.3) * 0.3;
        ctx.strokeStyle = e.type === "red"
          ? `rgba(184,48,48,${e.o * age * pulse * 0.7})`
          : e.type === "gold"
            ? `rgba(201,162,39,${e.o * age * pulse})`
            : `rgba(160,120,50,${e.o * age * pulse * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      nodes.forEach((n) => {
        const age = Math.min((now - n.born) / 800, 1);
        const px = n.x * sx, py = n.y * sy;
        const isRed = n.type === "red";
        const glowR = n.r * (isRed ? 5 : 7);
        const glow = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        glow.addColorStop(0, isRed ? `rgba(184,48,48,${0.07 * age})` : `rgba(201,162,39,${0.08 * age})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(px - glowR, py - glowR, glowR * 2, glowR * 2);
        ctx.beginPath();
        ctx.arc(px, py, n.r * age, 0, Math.PI * 2);
        ctx.fillStyle = isRed
          ? `rgba(184,48,48,${n.o * age})`
          : `rgba(226,181,63,${n.o * age})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [canvasRef]);

  return {
    addNodes: (count, type) => {
      const curr = nodesRef.current;
      const startIdx = curr.length;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 260;
        const cx = 400, cy = 450;
        curr.push({
          id: `${type}-${startIdx + i}`,
          type,
          born: Date.now(),
          x: cx + Math.cos(angle) * dist * 1.3,
          y: cy + Math.sin(angle) * dist,
          tx: cx + Math.cos(angle) * (dist * 0.55),
          ty: cy + Math.sin(angle) * (dist * 0.55),
          r: type === "red" ? 1.4 + Math.random() * 1.8 : 1.6 + Math.random() * 2.4,
          o: 0.35 + Math.random() * 0.5,
          hue: Math.random(),
        });
      }
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
    },
    nodeCount: () => nodesRef.current.length,
  };
}
