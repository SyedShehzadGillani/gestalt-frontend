import { SECTIONS } from "@/components/formula/formula-data";

interface Props {
  activePage: string;
  signedOff: Record<string, boolean>;
  onChange: (pageId: string) => void;
}

/**
 * FORMULA-internal section sub-tab strip. Lives inside the route content
 * (the global AppLayout already provides sidebar/topnav/breadcrumb).
 * Mirrors source lines 6487–6544 — group label + per-section tabs with
 * progress check and active highlight.
 */
export function FormulaTabStrip({ activePage, signedOff, onChange }: Props) {
  const activeGroup = SECTIONS.find((s) => s.items.some((i) => i.id === activePage));
  return (
    <div className="bg-background border-b border-border overflow-x-auto">
      <div className="flex items-stretch min-w-fit h-[52px]">
        {SECTIONS.map((section, si) => {
          const groupActive = activeGroup?.group === section.group;
          const hasVisited = section.items.some((i) => signedOff[i.id] || activePage === i.id);
          return (
            <div key={section.group} className="flex items-stretch">
              <div
                className={`flex items-center pl-4 pr-2.5 ${
                  groupActive ? "border-b-2 border-gold" : "border-b-2 border-transparent"
                }`}
              >
                <span
                  className={`text-[8px] font-extrabold tracking-[2px] whitespace-nowrap ${
                    groupActive
                      ? "text-gold"
                      : hasVisited
                        ? "text-gold/45"
                        : "text-muted-foreground"
                  }`}
                >
                  {section.group}
                </span>
              </div>
              {section.items.map((item) => {
                const isActive = activePage === item.id;
                const isDone = signedOff[item.id];
                const dimmed = !groupActive && !isActive && !isDone;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChange(item.id)}
                    className={`px-3.5 cursor-pointer text-left flex flex-col items-start justify-center gap-[3px] flex-shrink-0 transition-all ${
                      isActive
                        ? "bg-background border-b-2 border-gold"
                        : "border-b-2 border-transparent"
                    } ${dimmed ? "opacity-40" : "opacity-100"}`}
                  >
                    <div className="flex items-center gap-[3px] leading-none">
                      {isDone ? (
                        <span className="text-success text-[8px]">✓</span>
                      ) : (
                        <span
                          className={`text-[8px] ${
                            isActive ? "text-gold" : "text-muted-foreground"
                          }`}
                        >
                          {item.id}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] whitespace-nowrap leading-none ${
                        isActive
                          ? "text-gold font-extrabold"
                          : isDone
                            ? "text-gold/60 font-semibold"
                            : groupActive
                              ? "text-foreground/80 font-semibold"
                              : "text-muted-foreground font-semibold"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
              {si < SECTIONS.length - 1 && (
                <div className="w-px bg-border my-2 flex-shrink-0" aria-hidden />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
