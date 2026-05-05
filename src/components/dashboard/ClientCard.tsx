import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ClientCardProps {
  id: string;
  name: string;
  industry: string;
  status: "healthy" | "warning" | "critical";
  score: number;
  projects?: number;
  activity?: string;
  onDashboardClick: (clientId: string) => void;
}

const statusStyles = {
  healthy: {
    bg: "bg-success-dim",
    text: "text-success",
    label: "HEALTHY",
  },
  warning: {
    bg: "bg-warning-dim",
    text: "text-warning",
    label: "WARNING",
  },
  critical: {
    bg: "bg-red-dim",
    text: "text-red",
    label: "CRITICAL",
  },
};

export function ClientCard({
  id,
  name,
  industry,
  status,
  score,
  projects = 3,
  activity = "2d",
  onDashboardClick,
}: ClientCardProps) {
  const statusStyle = statusStyles[status];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-muted border border-border p-5 transition-all duration-150 hover:border-gold hover:-translate-y-0.5 hover:shadow-lg cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 bg-gold-dim flex items-center justify-center flex-shrink-0">
          <span className="text-[13px] font-semibold text-gold">{initials}</span>
        </div>
        <span
          className={`text-[9px] font-bold tracking-[1px] px-2 py-1 ${statusStyle.bg} ${statusStyle.text}`}
        >
          {statusStyle.label}
        </span>
      </div>

      {/* Info */}
      <div className="text-[15px] font-semibold text-foreground">{name}</div>
      <div className="text-[11px] text-foreground-secondary mt-0.5">{industry}</div>

      {/* Divider */}
      <div className="h-px bg-border my-3" />

      {/* Metrics */}
      <div className="flex items-center gap-4 text-[11px]">
        <div>
          <span className="text-foreground-secondary">B.A.S.E.</span>
          <span className="text-gold font-semibold ml-1.5">{score}</span>
        </div>
        <div>
          <span className="text-foreground-secondary">Projects</span>
          <span className="text-foreground font-medium ml-1.5">{projects}</span>
        </div>
        <div>
          <span className="text-foreground-secondary">Activity</span>
          <span className="text-foreground-muted ml-1.5">{activity}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <Button
          variant="secondary"
          size="sm"
          className="text-[11px] h-7 px-3"
          onClick={(e) => {
            e.stopPropagation();
            onDashboardClick(id);
          }}
        >
          Dashboard
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          className="text-[11px] h-7 px-3"
          onClick={(e) => e.stopPropagation()}
        >
          Message
        </Button>
      </div>
    </div>
  );
}
