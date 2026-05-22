import { useLocation } from "react-router-dom";
import { MODULE_NAV } from "@/components/formula/formula-data";

interface Props {
  activeModuleId?: string;
}

/**
 * Maps the current pathname to a MODULE_NAV id. Returns null if the route
 * is not a journey-module page (header should not render).
 */
function detectModuleFromPath(pathname: string): string | null {
  const p = pathname.toLowerCase();
  if (/\/framework(\/|$)/.test(p)) return "framework";
  if (/\/financials(\/|$)/.test(p)) return "financials";
  if (/\/focus(\/|$)/.test(p)) return "focus";
  if (/\/formula(\/|$)/.test(p)) return "formula";
  if (/\/hive(\/|$)/.test(p)) return "hive";
  if (/\/vault(\/|$)/.test(p)) return "vault";
  if (/\/analytics(\/|$)/.test(p)) return "analytics";
  // S.U.M. = messaging + the standalone S.U.M. surfaces per glossary
  if (/\/(messaging|journal|story-engine|polls|timeline|projects|notes)(\/|$)/.test(p)) return "sum";
  if (/\/sum-/.test(p)) return "sum";
  return null;
}

/**
 * Route-aware wrapper: renders `FormulaModuleNav` for the active module on
 * any journey-module route (framework / financials / focus / formula /
 * sum / hive / vault / analytics). Returns null elsewhere.
 */
export function ModuleJourneyHeader() {
  const { pathname } = useLocation();
  const id = detectModuleFromPath(pathname);
  if (!id) return null;
  return <FormulaModuleNav activeModuleId={id} />;
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
