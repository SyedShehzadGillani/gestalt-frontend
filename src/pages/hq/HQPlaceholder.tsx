import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

const pageInfo: Record<string, { title: string; description: string }> = {
  "/hq/alerts": {
    title: "System Alerts",
    description: "Monitor platform notifications, warnings, and critical events.",
  },
  "/hq/agencies": {
    title: "Agencies",
    description: "View and manage all registered agencies on the platform.",
  },
  "/hq/clients": {
    title: "Clients",
    description: "Browse all clients across all agencies.",
  },
  "/hq/revenue": {
    title: "Revenue",
    description: "Track revenue, transactions, and financial metrics.",
  },
  "/hq/usage": {
    title: "Usage Analytics",
    description: "Monitor platform usage, active sessions, and engagement.",
  },
  "/hq/coupons": {
    title: "Coupons",
    description: "Create and manage discount codes and promotions.",
  },
  "/hq/permissions": {
    title: "Permissions",
    description: "Configure access control and role-based permissions.",
  },
  "/hq/announcements": {
    title: "Announcements",
    description: "Send communications to agencies and users.",
  },
  "/hq/tickets": {
    title: "Support Tickets",
    description: "Manage and respond to support requests.",
  },
  "/hq/ai-help": {
    title: "AI Help",
    description: "Smart assistant for platform administration.",
  },
  "/hq/features": {
    title: "Feature Requests",
    description: "Review and prioritize user-submitted feature ideas.",
  },
  "/hq/configuration": {
    title: "Configuration",
    description: "Platform settings, integrations, and system config.",
  },
  "/hq/team": {
    title: "HQ Team",
    description: "Manage headquarters team members and their access.",
  },
};

export default function HQPlaceholder() {
  const location = useLocation();
  const info = pageInfo[location.pathname] || {
    title: "Page",
    description: "This section is under development.",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-light text-foreground mb-1">{info.title}</h1>
        <p className="text-[13px] text-foreground-secondary">{info.description}</p>
      </div>

      <div className="bg-card border border-border p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 flex items-center justify-center bg-hq-purple-dim border border-hq-purple mb-6">
          <Construction className="w-8 h-8 text-hq-purple" />
        </div>
        <h2 className="text-[18px] font-medium text-foreground mb-2">Coming Soon</h2>
        <p className="text-[13px] text-foreground-secondary max-w-md">
          This section is currently under development. Check back soon for full functionality.
        </p>
      </div>
    </div>
  );
}
