import { PAGE_HEADERS } from "@/components/formula/formula-data";

interface Props {
  pageId: string;
}

/** "Why this matters" hero block — headline + stat callout + payoff. */
export function FormulaPageHeader({ pageId }: Props) {
  const h = PAGE_HEADERS[pageId];
  if (!h) return null;
  return (
    <div className="mb-9">
      <h1 className="text-foreground text-[44px] font-black tracking-[-1.5px] leading-[1.05] mb-3">
        {h.headline}
      </h1>
      <div className="flex items-baseline gap-2 mb-4 flex-wrap">
        <span className="text-gold text-[21px] font-black">{h.statNum}</span>
        <span className="text-gold-dimlight text-[21px] font-semibold">{h.statLabel}</span>
        <span className="text-gold/50 text-[20px] italic">— {h.source}</span>
      </div>
      <p className="text-muted-foreground text-[15px] leading-[1.85] text-slate-800 font-bold">{h.payoff}</p>
    </div>
  );
}
