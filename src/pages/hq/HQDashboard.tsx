import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  Activity,
  DollarSign,
  Clock,
  Ticket,
  ChevronDown,
  Download,
  ArrowUpRight,
  Plus,
  Megaphone,
  Lightbulb,
  Bot,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const revenueData = [
  { month: "Aug", value: 8000 },
  { month: "Sep", value: 9200 },
  { month: "Oct", value: 10100 },
  { month: "Nov", value: 11000 },
  { month: "Dec", value: 11800 },
  { month: "Jan", value: 12450 },
];

const activityData = [
  { day: "Mon", users: 145 },
  { day: "Tue", users: 168 },
  { day: "Wed", users: 172 },
  { day: "Thu", users: 165 },
  { day: "Fri", users: 158 },
  { day: "Sat", users: 89 },
  { day: "Sun", users: 76 },
];

const recentSignups = [
  { name: "Meridian Creative", plan: "FOUNDING", time: "2 hours ago" },
  { name: "Coastal Marketing", plan: "STANDARD", time: "5 hours ago" },
  { name: "Summit Studios", plan: "FOUNDING", time: "1 day ago" },
  { name: "Nova Digital", plan: "FOUNDING", time: "2 days ago" },
  { name: "Apex Branding", plan: "STANDARD", time: "3 days ago" },
];

const activeCoupons = [
  { code: "LAUNCH50", used: 45, limit: 100, discount: "50% off" },
  { code: "WELCOME25", used: 78, limit: 200, discount: "25% off" },
  { code: "PARTNER20", used: 12, limit: 50, discount: "20% off" },
];

const openTickets = [
  { subject: "Unable to export BASE report", priority: "High", time: "2 hours ago" },
  { subject: "Billing question about Enterprise", priority: "Medium", time: "5 hours ago" },
  { subject: "Feature request: custom branding", priority: "Low", time: "1 day ago" },
];

const sparklineData = [
  { v: 42 }, { v: 43 }, { v: 44 }, { v: 44 }, { v: 45 }, { v: 46 }, { v: 47 },
];

function CurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-[13px] text-foreground-secondary font-mono">
      {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </div>
  );
}

function StatCard({
  icon: Icon,
  iconColor,
  title,
  value,
  change,
  changeColor = "text-success",
  subtext,
  showSparkline = false,
  link,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  value: string;
  change?: string;
  changeColor?: string;
  subtext?: string;
  showSparkline?: boolean;
  link?: { text: string; to: string };
}) {
  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 flex items-center justify-center border bg-hq-purple-dim border-hq-purple/30`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-[11px] text-foreground-secondary uppercase tracking-wide mb-1">{title}</p>
            <p className="text-[28px] font-light text-foreground leading-none">{value}</p>
            {change && <p className={`text-[11px] mt-1.5 ${changeColor}`}>{change}</p>}
            {subtext && <p className="text-[11px] text-foreground-muted mt-0.5">{subtext}</p>}
            {link && (
              <Link to={link.to} className="text-[11px] text-hq-purple hover:underline mt-2 inline-flex items-center gap-1">
                {link.text} <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
        {showSparkline && (
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="hsl(var(--hq-purple))"
                  fill="hsl(var(--hq-purple) / 0.2)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HQDashboard() {
  const [dateRange, setDateRange] = useState("Last 30 days");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground mb-1">Platform Dashboard</h1>
          <p className="text-[13px] text-foreground-muted">GESTALT Headquarters</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {dateRange}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => setDateRange("Last 7 days")}>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("Last 30 days")}>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("Last 90 days")}>Last 90 days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("This year")}>This year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <CurrentTime />
        </div>
      </div>

      {/* Stats Grid - 2 rows of 3 */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={Building2}
          iconColor="text-hq-purple"
          title="Total Agencies"
          value="47"
          change="+5 this month"
          changeColor="text-success"
          showSparkline
        />
        <StatCard
          icon={Users}
          iconColor="text-info"
          title="Total Clients"
          value="312"
          change="+28 this month"
          changeColor="text-success"
        />
        <StatCard
          icon={Activity}
          iconColor="text-success"
          title="Active Users"
          value="189"
          subtext="Online now: 23"
        />
        <StatCard
          icon={DollarSign}
          iconColor="text-success"
          title="Monthly Revenue (MRR)"
          value="$12,450"
          change="+18% vs last month"
          changeColor="text-success"
          subtext="$3,686 Founding + $1,188 Standard"
        />
        <StatCard
          icon={Clock}
          iconColor="text-warning"
          title="Time on Platform"
          value="4,230 hrs"
          change="+12% engagement"
          changeColor="text-success"
          subtext="This month"
        />
        <StatCard
          icon={Ticket}
          iconColor="text-destructive"
          title="Support Tickets"
          value="3 Open"
          subtext="12 resolved this week"
          link={{ text: "View All", to: "/hq/tickets" }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-card border border-border p-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-5">Revenue Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--hq-purple))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--hq-purple))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--foreground-muted))"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--foreground-muted))"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${v / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "MRR"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--hq-purple))"
                  strokeWidth={2}
                  fill="url(#purpleGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-card border border-border p-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-5">User Activity</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--foreground-muted))"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="hsl(var(--foreground-muted))"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [value, "Active Users"]}
                />
                <Bar
                  dataKey="users"
                  fill="hsl(var(--hq-purple))"
                  radius={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section - 3 columns */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Recent Signups */}
        <div className="bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-foreground">Recent Signups</h3>
            <Link to="/hq/agencies" className="text-[11px] text-hq-purple hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentSignups.map((signup, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-[12px] text-foreground">{signup.name}</p>
                  <p className="text-[10px] text-foreground-muted">{signup.time}</p>
                </div>
                <span
                  className="px-2 py-0.5 text-[9px] font-bold"
                  style={{
                    borderRadius: 2,
                    ...(signup.plan === "STANDARD"
                      ? { background: "rgba(96,96,96,0.15)", border: "1px solid #666", color: "#666" }
                      : { background: "rgba(201,162,39,0.15)", border: "1px solid #c9a227", color: "#c9a227" }),
                  }}
                >
                  {signup.plan}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Coupons */}
        <div className="bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-foreground">Active Coupons</h3>
            <Link to="/hq/coupons" className="text-[11px] text-hq-purple hover:underline flex items-center gap-1">
              Manage Coupons <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {activeCoupons.map((coupon, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-[12px] text-foreground font-mono">{coupon.code}</p>
                  <p className="text-[10px] text-foreground-muted">{coupon.used}/{coupon.limit} used</p>
                </div>
                <span className="text-[11px]" style={{ color: "#c9a227" }}>{coupon.discount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Tickets */}
        <div className="bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-foreground">Open Tickets</h3>
            <Link to="/hq/tickets" className="text-[11px] text-hq-purple hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {openTickets.map((ticket, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-foreground truncate">{ticket.subject}</p>
                  <p className="text-[10px] text-foreground-muted">{ticket.time}</p>
                </div>
                <span
                  className={`px-2 py-0.5 text-[9px] font-bold ml-2 ${
                    ticket.priority === "High"
                      ? "bg-destructive/10 text-destructive"
                      : ticket.priority === "Medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-foreground-muted"
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-card border border-border p-5">
        <p className="text-[11px] text-foreground-muted uppercase tracking-wide mb-4">Quick Actions</p>
        <div className="flex items-center gap-3">
          <Button className="bg-hq-purple hover:bg-hq-purple/90 text-white gap-2">
            <Plus className="w-4 h-4" />
            Create Coupon
          </Button>
          <Button variant="secondary" className="gap-2">
            <Megaphone className="w-4 h-4" />
            Send Announcement
          </Button>
          <Button variant="secondary" className="gap-2">
            <Lightbulb className="w-4 h-4" />
            View Feature Requests
          </Button>
          <Button variant="secondary" className="gap-2">
            <Bot className="w-4 h-4" />
            OPEN GESTALT INTELLIGENCE
          </Button>
        </div>
      </div>
    </div>
  );
}
