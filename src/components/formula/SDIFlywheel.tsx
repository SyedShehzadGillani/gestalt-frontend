import { useEffect, useState } from "react";

const SURPRISE = "#58d3ff";
const DELIGHT = "#e3398c";
const INSPIRE = "#9aca3e";

const STEPS = [
  { label: "SURPRISE", color: SURPRISE },
  { label: "DELIGHT", color: DELIGHT },
  { label: "INSPIRE", color: INSPIRE },
  { label: "DESIRE", color: "hsl(var(--gold))" },
];

/** "Cult Loop" S+D+I → Desire flywheel — animated SVG ring + commentary. */
export function SDIFlywheel() {
  const [rot, setRot] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setRot((r) => r + 0.25), 30);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-card border border-border border-t-2 border-t-gold mt-6 mb-2">
      <div className="px-7 pt-4 pb-3 border-b border-border flex items-center justify-between">
        <div>
          <div className="text-gold text-[9px] font-extrabold tracking-[3px]">THE CULT LOOP™</div>
          <div className="text-foreground text-[22px] font-black mt-1 tracking-[-0.5px]">
            Surprise → Delight → Inspire → Desire
          </div>
        </div>
        <div className="px-2.5 py-1 border border-gold/40 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-gold rounded-full" />
          <span className="text-gold text-[8px] font-extrabold tracking-[2px]">CULT LOOP™</span>
        </div>
      </div>

      <div className="grid grid-cols-[240px_1fr]">
        <div className="p-7 border-r border-border flex items-center justify-center">
          <svg viewBox="0 0 200 200" width={200} height={200}>
            <g style={{ transformOrigin: "100px 100px", transform: `rotate(${rot}deg)` }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="6 4" />
            </g>
            <path d="M 100 10 A 90 90 0 0 1 190 100" fill="none" stroke={SURPRISE} strokeWidth="3.5" opacity="0.9" strokeLinecap="round" />
            <path d="M 190 100 A 90 90 0 0 1 100 190" fill="none" stroke={DELIGHT} strokeWidth="3.5" opacity="0.9" strokeLinecap="round" />
            <path d="M 100 190 A 90 90 0 0 1 100 10" fill="none" stroke={INSPIRE} strokeWidth="3.5" opacity="0.9" strokeLinecap="round" />
            <text x="152" y="45" fill={SURPRISE} fontSize="7.5" fontWeight="800" letterSpacing="1.5">SURPRISE</text>
            <text x="152" y="148" fill={DELIGHT} fontSize="7.5" fontWeight="800" letterSpacing="1.5">DELIGHT</text>
            <text x="8" y="104" fill={INSPIRE} fontSize="7.5" fontWeight="800" letterSpacing="1.5">INSPIRE</text>
            <circle cx="100" cy="100" r="30" fill="hsl(var(--background))" stroke="hsl(var(--gold))" strokeWidth="2" />
            <text x="100" y="96" textAnchor="middle" fill="hsl(var(--gold))" fontSize="8.5" fontWeight="900" letterSpacing="2">DESIRE</text>
            <text x="100" y="108" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="5.5" letterSpacing="1">NEVER STOPS</text>
            <circle cx="100" cy="10" r="3.5" fill={SURPRISE} />
            <circle cx="190" cy="100" r="3.5" fill={DELIGHT} />
            <circle cx="100" cy="190" r="3.5" fill={INSPIRE} />
          </svg>
        </div>

        <div className="px-7 pt-7 pb-6">
          <div className="flex items-center gap-1.5 mb-5 flex-nowrap">
            {STEPS.map((s, i) => (
              <span
                key={s.label}
                className="px-3 py-[5px] text-[9px] font-extrabold tracking-[2px] whitespace-nowrap inline-flex items-center gap-1.5"
                style={{ color: s.color, border: `1px solid ${s.color}`, background: `${s.color}10` }}
              >
                {s.label}
                {i < STEPS.length - 1 && <span className="text-muted-foreground text-base font-light">→</span>}
              </span>
            ))}
            <span className="text-gold text-[14px] font-black ml-2">=</span>
            <span className="px-3.5 py-[5px] text-[9px] font-black tracking-[2px] whitespace-nowrap text-black bg-gold">
              CULT LOOP™
            </span>
          </div>

          <p className="text-foreground text-[15px] leading-[1.9] mb-5">
            S+D+I doesn't stop after the sale — it{" "}
            <strong className="text-gold">multiplies</strong>. When you{" "}
            <strong style={{ color: SURPRISE }}>SURPRISE</strong> a customer,{" "}
            <strong style={{ color: DELIGHT }}>DELIGHT</strong> them at every touchpoint, and{" "}
            <strong style={{ color: INSPIRE }}>INSPIRE</strong> them with the outcome —{" "}
            <strong className="text-gold">DESIRE</strong> is created. Not for you.{" "}
            <em>By</em> them. For others.
          </p>
          <p className="text-muted-foreground text-[14px] leading-[1.9] mb-5">
            Cult Brands are driven by authenticity. But they can be{" "}
            <strong className="text-foreground">activated and curated</strong> by listening to your
            audience and consistently delivering the value they desire in your vertical. This isn't
            luck — it's a system. And this section is where you build it.
          </p>

          <div className="px-5 py-4 bg-gold/[0.03] border border-gold/30 border-l-[3px] border-l-gold mb-4">
            <div className="text-gold text-[14px] font-black mb-1.5">
              <span style={{ color: SURPRISE }}>Surprise</span>
              {" → "}<span style={{ color: DELIGHT }}>Delight</span>
              {" → "}<span style={{ color: INSPIRE }}>Inspire</span>
              {" → "}<span className="text-gold">Desire</span>
              {" = "}<span className="text-gold">CULT BRAND</span>
            </div>
            <p className="text-muted-foreground text-[12px] leading-[1.7]">
              Tesla. Apple. Geek Squad. They didn't buy their way to cult status — they{" "}
              <em>earned</em> it by delivering exactly what their audience desired, in a way nobody
              else could replicate. Creating unanimous desire = owning the market.
            </p>
          </div>

          <div className="px-3.5 py-2.5 bg-background border border-border flex gap-3.5 items-baseline">
            <span className="text-gold text-[18px] font-black flex-shrink-0">5–25×</span>
            <span className="text-muted-foreground text-[11px] leading-[1.6]">
              lower customer acquisition cost for brands with active customer advocacy loops —
              versus those that rely on paid acquisition alone.
            </span>
          </div>
          <div className="text-muted-foreground text-[9px] italic mt-1.5">
            — Bain &amp; Company, Customer Loyalty Economics
          </div>
        </div>
      </div>
    </div>
  );
}
