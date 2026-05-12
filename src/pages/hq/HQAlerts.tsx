import { useState } from "react";
import {
  AlertTriangle,
  Shield,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  X,
  ChevronRight,
  Server,
  Users,
  CreditCard,
  Lock,
  RefreshCw,
  Eye,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type AlertType = "security" | "system" | "billing" | "user" | "action";
type AlertPriority = "critical" | "high" | "medium" | "low";
type AlertStatus = "active" | "acknowledged" | "resolved";

interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  actionRequired: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "security",
    priority: "critical",
    status: "active",
    title: "Multiple failed login attempts detected",
    description: "12 failed login attempts from IP 192.168.1.45 for user admin@pixelperfect.io",
    source: "Auth Service",
    timestamp: "2 min ago",
    actionRequired: true,
  },
  {
    id: "ALT-002",
    type: "billing",
    priority: "high",
    status: "active",
    title: "Payment failed for Elevate Agency",
    description: "Subscription payment of $97 failed. Card ending in 4242 was declined.",
    source: "Stripe",
    timestamp: "15 min ago",
    actionRequired: true,
  },
  {
    id: "ALT-003",
    type: "system",
    priority: "medium",
    status: "active",
    title: "Database connection pool reaching capacity",
    description: "Connection pool at 85% capacity. Consider scaling or optimizing queries.",
    source: "Database Monitor",
    timestamp: "1 hour ago",
    actionRequired: false,
  },
  {
    id: "ALT-004",
    type: "user",
    priority: "low",
    status: "acknowledged",
    title: "New agency signup requires verification",
    description: "Growth Labs Agency completed signup. Manual verification pending.",
    source: "Onboarding",
    timestamp: "2 hours ago",
    actionRequired: true,
  },
  {
    id: "ALT-005",
    type: "security",
    priority: "high",
    status: "active",
    title: "API rate limit exceeded",
    description: "API key api_key_7x8y9z exceeded rate limit. 500+ requests in 1 minute.",
    source: "API Gateway",
    timestamp: "3 hours ago",
    actionRequired: true,
  },
  {
    id: "ALT-006",
    type: "action",
    priority: "medium",
    status: "active",
    title: "3 support tickets awaiting response",
    description: "Tickets from Brand Architects, Summit Strategy, Visionary Group need attention.",
    source: "Support System",
    timestamp: "4 hours ago",
    actionRequired: true,
  },
  {
    id: "ALT-007",
    type: "system",
    priority: "low",
    status: "resolved",
    title: "Scheduled maintenance completed",
    description: "Database backup and optimization completed successfully.",
    source: "Maintenance",
    timestamp: "6 hours ago",
    actionRequired: false,
  },
  {
    id: "ALT-008",
    type: "billing",
    priority: "medium",
    status: "acknowledged",
    title: "Coupon LAUNCH2024 usage spike",
    description: "Unusual spike in coupon usage. 15 redemptions in the last hour.",
    source: "Billing Service",
    timestamp: "8 hours ago",
    actionRequired: false,
  },
  {
    id: "ALT-009",
    type: "security",
    priority: "critical",
    status: "resolved",
    title: "Suspicious API access pattern detected",
    description: "Unusual data access pattern from agency ID 847. Investigation complete - false positive.",
    source: "Security Monitor",
    timestamp: "1 day ago",
    actionRequired: false,
  },
  {
    id: "ALT-010",
    type: "user",
    priority: "low",
    status: "resolved",
    title: "User reported accessibility issue",
    description: "Screen reader compatibility issue reported on B.A.S.E. framework page.",
    source: "Feedback",
    timestamp: "2 days ago",
    actionRequired: false,
  },
];

const typeConfig: Record<AlertType, { icon: React.ElementType; label: string; color: string }> = {
  security: { icon: Shield, label: "Security", color: "hsl(var(--destructive))" },
  system: { icon: Server, label: "System", color: "hsl(var(--info))" },
  billing: { icon: CreditCard, label: "Billing", color: "hsl(var(--warning))" },
  user: { icon: Users, label: "User", color: "hsl(var(--hq-purple))" },
  action: { icon: Bell, label: "Action", color: "hsl(var(--gold))" },
};

const priorityConfig: Record<AlertPriority, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-destructive/20 text-destructive border-destructive/30" },
  high: { label: "High", className: "bg-warning/20 text-warning border-warning/30" },
  medium: { label: "Medium", className: "bg-info/20 text-info border-info/30" },
  low: { label: "Low", className: "bg-foreground-muted/20 text-foreground-muted border-foreground-muted/30" },
};

const statusConfig: Record<AlertStatus, { label: string; icon: React.ElementType }> = {
  active: { label: "Active", icon: AlertTriangle },
  acknowledged: { label: "Acknowledged", icon: Eye },
  resolved: { label: "Resolved", icon: CheckCircle2 },
};

function StatCard({
  icon: Icon,
  title,
  value,
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-[11px] text-foreground-muted uppercase tracking-wide">{title}</p>
          <p className="text-[28px] font-light text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ alert, onAction }: { alert: Alert; onAction: (id: string, action: string) => void }) {
  const TypeIcon = typeConfig[alert.type].icon;
  const StatusIcon = statusConfig[alert.status].icon;

  return (
    <div
      className={`border border-border p-4 transition-colors hover:bg-card-hover ${
        alert.status === "resolved" ? "opacity-60" : ""
      } ${alert.priority === "critical" && alert.status === "active" ? "border-l-2 border-l-destructive" : ""}`}
    >
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div
          className="w-9 h-9 flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{
            backgroundColor: `${typeConfig[alert.type].color}20`,
            border: `1px solid ${typeConfig[alert.type].color}40`,
          }}
        >
          <TypeIcon className="w-4 h-4" style={{ color: typeConfig[alert.type].color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[13px] font-medium text-foreground">{alert.title}</h3>
                {alert.actionRequired && alert.status === "active" && (
                  <Badge variant="outline" className="text-[9px] bg-gold/10 text-gold border-gold/30">
                    ACTION REQUIRED
                  </Badge>
                )}
              </div>
              <p className="text-[12px] text-foreground-muted mb-2">{alert.description}</p>
              <div className="flex items-center gap-4 text-[10px] text-foreground-muted">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {alert.timestamp}
                </span>
                <span>Source: {alert.source}</span>
                <span>ID: {alert.id}</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className={`text-[9px] ${priorityConfig[alert.priority].className}`}>
                {priorityConfig[alert.priority].label}
              </Badge>
              <div className="flex items-center gap-1 text-[10px] text-foreground-muted">
                <StatusIcon className="w-3 h-3" />
                {statusConfig[alert.status].label}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  {alert.status === "active" && (
                    <>
                      <DropdownMenuItem onClick={() => onAction(alert.id, "acknowledge")}>
                        <Eye className="w-3.5 h-3.5 mr-2" />
                        Acknowledge
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAction(alert.id, "resolve")}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                        Mark Resolved
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                    </>
                  )}
                  {alert.status === "acknowledged" && (
                    <DropdownMenuItem onClick={() => onAction(alert.id, "resolve")}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                      Mark Resolved
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onAction(alert.id, "details")}>
                    <ChevronRight className="w-3.5 h-3.5 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction(alert.id, "archive")}>
                    <Archive className="w-3.5 h-3.5 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={() => onAction(alert.id, "dismiss")} className="text-destructive">
                    <X className="w-3.5 h-3.5 mr-2" />
                    Dismiss
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HQAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const handleAction = (id: string, action: string) => {
    if (action === "acknowledge") {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "acknowledged" as AlertStatus } : a))
      );
      toast({ title: "Alert acknowledged", description: `Alert ${id} has been acknowledged.` });
    } else if (action === "resolve") {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "resolved" as AlertStatus } : a))
      );
      toast({ title: "Alert resolved", description: `Alert ${id} has been marked as resolved.` });
    } else if (action === "dismiss" || action === "archive") {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast({ title: `Alert ${action}ed`, description: `Alert ${id} has been ${action}ed.` });
    } else if (action === "details") {
      toast({ title: "View Details", description: `Opening details for ${id}...` });
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const stats = {
    total: alerts.length,
    critical: alerts.filter((a) => a.priority === "critical" && a.status !== "resolved").length,
    active: alerts.filter((a) => a.status === "active").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground mb-1">System Alerts</h1>
          <p className="text-[13px] text-foreground-muted">
            Monitor security events, system notifications, and action items
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="secondary" className="gap-2">
            <Lock className="w-4 h-4" />
            Security Log
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard icon={Bell} title="Total Alerts" value={stats.total} color="hsl(var(--hq-purple))" />
        <StatCard icon={AlertTriangle} title="Critical" value={stats.critical} color="hsl(var(--destructive))" />
        <StatCard icon={Clock} title="Active" value={stats.active} color="hsl(var(--warning))" />
        <StatCard icon={CheckCircle2} title="Resolved" value={stats.resolved} color="hsl(var(--success))" />
      </div>

      {/* Filters */}
      <div className="bg-card border border-border p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-foreground-muted" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] bg-background border-border">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="action">Action</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px] bg-background border-border">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] bg-background border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-[11px] text-foreground-muted ml-auto">
            {filteredAlerts.length} of {alerts.length} alerts
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="text-[14px] font-medium text-foreground mb-1">No alerts found</h3>
            <p className="text-[12px] text-foreground-muted">
              {searchQuery || typeFilter !== "all" || priorityFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "All systems operating normally"}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} onAction={handleAction} />
          ))
        )}
      </div>
    </div>
  );
}
