import { Agency } from "@/data/hqAgenciesData";

const planLabels: Record<Agency["plan"], string> = {
  PRO: "FOUNDING",
  ENTERPRISE: "STANDARD",
  FREE: "TRIAL",
};

const planStyles: Record<Agency["plan"], React.CSSProperties> = {
  PRO: {
    background: "rgba(201,162,39,0.15)",
    border: "1px solid #c9a227",
    color: "#c9a227",
  },
  ENTERPRISE: {
    background: "rgba(96,96,96,0.15)",
    border: "1px solid #666",
    color: "#666",
  },
  FREE: {
    background: "rgba(72,130,255,0.12)",
    border: "1px solid #4882ff",
    color: "#4882ff",
  },
};

export function PlanBadge({ plan }: { plan: Agency["plan"] }) {
  return (
    <span
      className="px-2 py-0.5 text-[10px] font-bold"
      style={{ borderRadius: 2, ...planStyles[plan] }}
    >
      {planLabels[plan]}
    </span>
  );
}
