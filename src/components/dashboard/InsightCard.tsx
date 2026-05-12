import { Button } from "@/components/ui/button";

interface InsightCardProps {
  type: "ALERT" | "OPPORTUNITY" | "RISK";
  title: string;
  description: string;
}

export function InsightCard({ type, title, description }: InsightCardProps) {
  return (
    <div className="bg-muted border border-border p-4 mb-3 last:mb-0">
      <div className="text-[10px] font-bold tracking-[1px] text-gold mb-1.5">
        {type}
      </div>
      <div className="text-[13px] font-semibold text-foreground mb-1">
        {title}
      </div>
      <div className="text-[12px] text-foreground-muted line-clamp-2 mb-3">
        {description}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-[11px] h-7 px-3 bg-gold-dim text-gold hover:bg-gold hover:text-primary-foreground"
      >
        Take Action →
      </Button>
    </div>
  );
}
