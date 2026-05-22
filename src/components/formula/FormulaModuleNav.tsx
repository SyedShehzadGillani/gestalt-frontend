import { MODULE_NAV } from "@/components/formula/formula-data";

interface Props {
  activeModuleId?: string;
}

/**
 * FORMULA master journey header — 8-pill timeline (FRAMEWORK → ANALYTICS).
 * Read-only display per DEC-009 (multi-module routing is a non-port; this
 * renders the v230 visual header without route switching).
 */
export function FormulaModuleNav({ activeModuleId = "formula" }: Props) {
  const activeIdx = MODULE_NAV.findIndex((m) => m.id === activeModuleId);

  return (
    <div
      className="bg-background border-b border-border flex items-stretch flex-shrink-0 overflow-x-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <style>{`.formula-module-nav::-webkit-scrollbar{display:none}`}</style>
      <div className="formula-module-nav flex items-stretch flex-1 min-w-fit">
        {MODULE_NAV.map((mod, idx) => {
          const isPast = idx < activeIdx;
          const isActive = idx === activeIdx;
          const isFuture = idx > activeIdx;
          const ec = mod.color;
          return (
            <div
              key={mod.id}
              className={`flex-1 min-w-[100px] min-h-[52px] px-3 pt-[9px] flex flex-col justify-start gap-[3px] relative overflow-hidden ${
                idx < MODULE_NAV.length - 1 ? "border-r border-border" : ""
              } ${isFuture ? "opacity-40" : "opacity-100"}`}
              style={{
                background: isActive ? `${ec}40` : "transparent",
              }}
            >
              <span
                className="text-[6px] font-bold tracking-[2px] leading-none"
                style={{ color: isActive ? ec : isPast ? `${ec}99` : "hsl(var(--muted-foreground))" }}
              >
                {mod.time}
              </span>
              <span
                className={`text-[9px] tracking-[1px] leading-none whitespace-nowrap overflow-hidden text-ellipsis ${
                  isActive ? "font-black text-foreground" : isPast ? "font-bold text-foreground" : "font-semibold text-muted-foreground"
                }`}
              >
                {mod.label}
              </span>
              <span
                className="text-[6px] font-semibold tracking-[1px] leading-none mt-[1px]"
                style={{ color: isActive ? ec : isPast ? `${ec}99` : "hsl(var(--muted-foreground))" }}
              >
                {mod.sub}
              </span>
              {(isPast || isActive) && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[3px]"
                  style={{ background: isActive ? ec : `${ec}66` }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
