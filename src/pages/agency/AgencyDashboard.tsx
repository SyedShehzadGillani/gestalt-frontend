import { useNavigate } from "react-router-dom";
import { RefreshCw, Users, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { InsightCard } from "@/components/dashboard/InsightCard";

const mockClients = [
  { id: "1", name: "Meridian Tech", industry: "Software", status: "healthy" as const, score: 82 },
  { id: "2", name: "Coastal Living", industry: "Real Estate", status: "warning" as const, score: 61 },
  { id: "3", name: "Summit Fitness", industry: "Health & Wellness", status: "healthy" as const, score: 78 },
  { id: "4", name: "Nova Financial", industry: "Financial Services", status: "critical" as const, score: 43 },
];

const mockInsights = [
  {
    type: "ALERT" as const,
    title: "Coastal Living score dropped",
    description: "Perception category declined 12 points. Review needed.",
  },
  {
    type: "OPPORTUNITY" as const,
    title: "Summit Fitness ready for upsell",
    description: "High engagement signals FOCUS audit timing.",
  },
  {
    type: "RISK" as const,
    title: "Nova Financial churn risk",
    description: "No activity in 14 days. 3 overdue milestones.",
  },
];

export default function AgencyDashboard() {
  const navigate = useNavigate();

  const handleSelectClient = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  const handleViewAllClients = () => {
    navigate("/agency/clients");
  };

  return (
    <div className="animate-fade-in p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground">Command Center</h1>
          <p className="text-[13px] text-foreground-secondary">Agency Overview</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-foreground-muted">January 26, 2026</span>
          <Button variant="secondary" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-5 mb-6" data-tour="stats-row">
        <StatCard
          icon={Users}
          iconColorClass="text-gold"
          iconBgClass="bg-gold-dim"
          iconBorderClass="border-gold"
          value="4"
          label="Active Clients"
          subtext="+1 this month"
          subtextColorClass="text-success"
        />
        <StatCard
          icon={DollarSign}
          iconColorClass="text-info"
          iconBgClass="bg-info-dim"
          iconBorderClass="border-info"
          value="$47,500"
          label="Monthly Revenue"
          subtext="+18% vs last month"
          subtextColorClass="text-success"
        />
        <StatCard
          icon={Clock}
          iconColorClass="text-warning"
          iconBgClass="bg-warning-dim"
          iconBorderClass="border-warning"
          value="7"
          label="Pending Sign-offs"
          subtext="3 overdue"
          subtextColorClass="text-red"
        />
        <StatCard
          icon={AlertTriangle}
          iconColorClass="text-red"
          iconBgClass="bg-red-dim"
          iconBorderClass="border-red"
          value="4"
          label="AI Alerts"
          subtext="2 critical"
          subtextColorClass="text-red"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 380px" }}>
        {/* Left Column - Clients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-foreground">Clients</h2>
            <button 
              onClick={handleViewAllClients}
              className="text-[13px] text-gold hover:text-gold/80 transition-colors"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {mockClients.map((client) => (
              <ClientCard
                key={client.id}
                {...client}
                onDashboardClick={handleSelectClient}
              />
            ))}
          </div>
        </div>

        {/* Right Column - AI Insights */}
        <div className="bg-card border border-border border-l-4 border-l-gold p-6" data-tour="ai-insights-panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-foreground">🤖 GESTALT INTELLIGENCE</h2>
            <button className="text-[13px] text-gold hover:text-gold/80 transition-colors">
              View All →
            </button>
          </div>
          {mockInsights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>
      </div>
    </div>
  );
}
