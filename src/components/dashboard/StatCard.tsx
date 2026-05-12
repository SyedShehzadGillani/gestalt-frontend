import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  iconBorderClass: string;
  value: string;
  label: string;
  subtext: string;
  subtextColorClass: string;
}

export function StatCard({
  icon: Icon,
  iconColorClass,
  iconBgClass,
  iconBorderClass,
  value,
  label,
  subtext,
  subtextColorClass,
}: StatCardProps) {
  return (
    <div className="bg-card border border-border p-6">
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 flex items-center justify-center border ${iconBgClass} ${iconBorderClass}`}
        >
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
        </div>
        <div>
          <div className="text-[32px] font-light text-foreground">{value}</div>
          <div className="text-[12px] text-foreground-secondary">{label}</div>
          <div className={`text-[11px] mt-1 ${subtextColorClass}`}>{subtext}</div>
        </div>
      </div>
    </div>
  );
}
