import { useState } from "react";
import {
  Clock,
  Timer,
  Users,
  FileCheck,
  FolderKanban,
  ChevronDown,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - Daily usage for last 30 days
const dailyUsage = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  return {
    day: `${date.getMonth() + 1}/${date.getDate()}`,
    hours: isWeekend ? Math.floor(Math.random() * 80) + 40 : Math.floor(Math.random() * 120) + 100,
  };
});

const featureUsage = [
  { name: "Dashboard", percentage: 35, color: "hsl(var(--hq-purple))" },
  { name: "Assessments", percentage: 28, color: "hsl(var(--gold))" },
  { name: "Projects", percentage: 18, color: "hsl(var(--success))" },
  { name: "Messaging", percentage: 12, color: "hsl(var(--info))" },
  { name: "Other", percentage: 7, color: "hsl(var(--foreground-muted))" },
];

// Peak hours heatmap data
const peakHoursData = [
  { day: "Mon", hours: [2, 5, 15, 45, 78, 92, 85, 72, 55, 35, 18, 8, 3, 2, 1, 0, 0] },
  { day: "Tue", hours: [1, 4, 12, 42, 75, 88, 90, 76, 58, 38, 20, 10, 4, 2, 1, 0, 0] },
  { day: "Wed", hours: [2, 6, 18, 48, 82, 95, 88, 74, 52, 32, 15, 6, 2, 1, 0, 0, 0] },
  { day: "Thu", hours: [1, 5, 14, 44, 76, 90, 86, 70, 54, 36, 18, 8, 3, 1, 1, 0, 0] },
  { day: "Fri", hours: [2, 4, 10, 38, 68, 82, 78, 62, 45, 28, 12, 5, 2, 1, 0, 0, 0] },
  { day: "Sat", hours: [0, 1, 3, 8, 15, 22, 25, 20, 15, 8, 4, 2, 1, 0, 0, 0, 0] },
  { day: "Sun", hours: [0, 1, 2, 5, 10, 18, 20, 18, 12, 6, 3, 1, 0, 0, 0, 0, 0] },
];

const hourLabels = ["6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm"];

const retentionData = [
  { week: "Week 1", retention: 78 },
  { week: "Week 4", retention: 62 },
  { week: "Week 12", retention: 45 },
];

interface AgencyUsageData {
  rank: number;
  agency: string;
  plan: "Founding" | "Standard";
  timeHours: number;
  sessions: number;
  lastActive: string;
  users: number;
  clients: number;
  avgSessionMin: number;
  assessmentsRun: number;
  projectsActive: number;
  weeklyUsage: { day: string; hours: number }[];
  featureBreakdown: { name: string; percentage: number; color: string }[];
  topUsers: { name: string; hours: number; sessions: number }[];
}

const topAgencies: AgencyUsageData[] = [
  { 
    rank: 1, 
    agency: "GESTALT Partners", 
    plan: "Standard", 
    timeHours: 342, 
    sessions: 456, 
    lastActive: "Just now",
    users: 12,
    clients: 8,
    avgSessionMin: 45,
    assessmentsRun: 156,
    projectsActive: 12,
    weeklyUsage: [
      { day: "Mon", hours: 52 },
      { day: "Tue", hours: 48 },
      { day: "Wed", hours: 55 },
      { day: "Thu", hours: 50 },
      { day: "Fri", hours: 58 },
      { day: "Sat", hours: 42 },
      { day: "Sun", hours: 37 },
    ],
    featureBreakdown: [
      { name: "Dashboard", percentage: 32, color: "hsl(var(--hq-purple))" },
      { name: "Assessments", percentage: 28, color: "hsl(var(--gold))" },
      { name: "Projects", percentage: 22, color: "hsl(var(--success))" },
      { name: "Messaging", percentage: 12, color: "hsl(var(--info))" },
      { name: "Other", percentage: 6, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "Sarah Chen", hours: 68, sessions: 92 },
      { name: "Marcus Webb", hours: 54, sessions: 78 },
      { name: "Emily Rodriguez", hours: 48, sessions: 65 },
    ],
  },
  { 
    rank: 2, 
    agency: "Pixel Perfect", 
    plan: "Founding", 
    timeHours: 298, 
    sessions: 398, 
    lastActive: "5 min ago",
    users: 8,
    clients: 6,
    avgSessionMin: 38,
    assessmentsRun: 124,
    projectsActive: 9,
    weeklyUsage: [
      { day: "Mon", hours: 45 },
      { day: "Tue", hours: 42 },
      { day: "Wed", hours: 48 },
      { day: "Thu", hours: 44 },
      { day: "Fri", hours: 50 },
      { day: "Sat", hours: 35 },
      { day: "Sun", hours: 34 },
    ],
    featureBreakdown: [
      { name: "Assessments", percentage: 35, color: "hsl(var(--gold))" },
      { name: "Dashboard", percentage: 28, color: "hsl(var(--hq-purple))" },
      { name: "Projects", percentage: 20, color: "hsl(var(--success))" },
      { name: "Messaging", percentage: 10, color: "hsl(var(--info))" },
      { name: "Other", percentage: 7, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "David Kim", hours: 52, sessions: 74 },
      { name: "Lisa Thompson", hours: 45, sessions: 62 },
      { name: "James Wilson", hours: 38, sessions: 51 },
    ],
  },
  { 
    rank: 3, 
    agency: "Brand Architects", 
    plan: "Standard", 
    timeHours: 276, 
    sessions: 342, 
    lastActive: "1 hour ago",
    users: 10,
    clients: 7,
    avgSessionMin: 42,
    assessmentsRun: 112,
    projectsActive: 11,
    weeklyUsage: [
      { day: "Mon", hours: 42 },
      { day: "Tue", hours: 38 },
      { day: "Wed", hours: 45 },
      { day: "Thu", hours: 40 },
      { day: "Fri", hours: 46 },
      { day: "Sat", hours: 32 },
      { day: "Sun", hours: 33 },
    ],
    featureBreakdown: [
      { name: "Projects", percentage: 30, color: "hsl(var(--success))" },
      { name: "Dashboard", percentage: 28, color: "hsl(var(--hq-purple))" },
      { name: "Assessments", percentage: 25, color: "hsl(var(--gold))" },
      { name: "Messaging", percentage: 12, color: "hsl(var(--info))" },
      { name: "Other", percentage: 5, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "Anna Foster", hours: 48, sessions: 65 },
      { name: "Michael Brown", hours: 42, sessions: 58 },
      { name: "Jennifer Lee", hours: 35, sessions: 48 },
    ],
  },
  { 
    rank: 4, 
    agency: "Growth Labs", 
    plan: "Founding", 
    timeHours: 245, 
    sessions: 287, 
    lastActive: "2 hours ago",
    users: 6,
    clients: 5,
    avgSessionMin: 35,
    assessmentsRun: 98,
    projectsActive: 7,
    weeklyUsage: [
      { day: "Mon", hours: 38 },
      { day: "Tue", hours: 35 },
      { day: "Wed", hours: 40 },
      { day: "Thu", hours: 36 },
      { day: "Fri", hours: 42 },
      { day: "Sat", hours: 28 },
      { day: "Sun", hours: 26 },
    ],
    featureBreakdown: [
      { name: "Dashboard", percentage: 35, color: "hsl(var(--hq-purple))" },
      { name: "Assessments", percentage: 30, color: "hsl(var(--gold))" },
      { name: "Projects", percentage: 18, color: "hsl(var(--success))" },
      { name: "Messaging", percentage: 10, color: "hsl(var(--info))" },
      { name: "Other", percentage: 7, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "Chris Taylor", hours: 45, sessions: 58 },
      { name: "Amy Johnson", hours: 38, sessions: 48 },
      { name: "Ryan Martinez", hours: 32, sessions: 42 },
    ],
  },
  { 
    rank: 5, 
    agency: "Summit Strategy", 
    plan: "Founding", 
    timeHours: 218, 
    sessions: 256, 
    lastActive: "3 hours ago",
    users: 7,
    clients: 4,
    avgSessionMin: 32,
    assessmentsRun: 86,
    projectsActive: 6,
    weeklyUsage: [
      { day: "Mon", hours: 34 },
      { day: "Tue", hours: 30 },
      { day: "Wed", hours: 36 },
      { day: "Thu", hours: 32 },
      { day: "Fri", hours: 38 },
      { day: "Sat", hours: 24 },
      { day: "Sun", hours: 24 },
    ],
    featureBreakdown: [
      { name: "Assessments", percentage: 32, color: "hsl(var(--gold))" },
      { name: "Dashboard", percentage: 28, color: "hsl(var(--hq-purple))" },
      { name: "Messaging", percentage: 20, color: "hsl(var(--info))" },
      { name: "Projects", percentage: 15, color: "hsl(var(--success))" },
      { name: "Other", percentage: 5, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "Kevin Park", hours: 40, sessions: 52 },
      { name: "Diana Scott", hours: 35, sessions: 45 },
      { name: "Tom Harris", hours: 28, sessions: 38 },
    ],
  },
  { 
    rank: 6, 
    agency: "Elevate Agency", 
    plan: "Founding", 
    timeHours: 195, 
    sessions: 234, 
    lastActive: "4 hours ago",
    users: 5,
    clients: 3,
    avgSessionMin: 28,
    assessmentsRun: 72,
    projectsActive: 5,
    weeklyUsage: [
      { day: "Mon", hours: 30 },
      { day: "Tue", hours: 28 },
      { day: "Wed", hours: 32 },
      { day: "Thu", hours: 28 },
      { day: "Fri", hours: 34 },
      { day: "Sat", hours: 22 },
      { day: "Sun", hours: 21 },
    ],
    featureBreakdown: [
      { name: "Dashboard", percentage: 38, color: "hsl(var(--hq-purple))" },
      { name: "Projects", percentage: 25, color: "hsl(var(--success))" },
      { name: "Assessments", percentage: 22, color: "hsl(var(--gold))" },
      { name: "Messaging", percentage: 10, color: "hsl(var(--info))" },
      { name: "Other", percentage: 5, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "Laura White", hours: 38, sessions: 48 },
      { name: "Steve Adams", hours: 32, sessions: 42 },
      { name: "Nancy Clark", hours: 25, sessions: 35 },
    ],
  },
  { 
    rank: 7, 
    agency: "Spark Digital", 
    plan: "Founding", 
    timeHours: 178, 
    sessions: 198, 
    lastActive: "5 hours ago",
    users: 6,
    clients: 4,
    avgSessionMin: 30,
    assessmentsRun: 64,
    projectsActive: 6,
    weeklyUsage: [
      { day: "Mon", hours: 28 },
      { day: "Tue", hours: 25 },
      { day: "Wed", hours: 30 },
      { day: "Thu", hours: 26 },
      { day: "Fri", hours: 32 },
      { day: "Sat", hours: 18 },
      { day: "Sun", hours: 19 },
    ],
    featureBreakdown: [
      { name: "Messaging", percentage: 30, color: "hsl(var(--info))" },
      { name: "Dashboard", percentage: 28, color: "hsl(var(--hq-purple))" },
      { name: "Assessments", percentage: 24, color: "hsl(var(--gold))" },
      { name: "Projects", percentage: 12, color: "hsl(var(--success))" },
      { name: "Other", percentage: 6, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "Paul Green", hours: 35, sessions: 42 },
      { name: "Maria Lopez", hours: 28, sessions: 35 },
      { name: "John Davis", hours: 22, sessions: 28 },
    ],
  },
  { 
    rank: 8, 
    agency: "Visionary Group", 
    plan: "Standard", 
    timeHours: 156, 
    sessions: 176, 
    lastActive: "6 hours ago",
    users: 4,
    clients: 3,
    avgSessionMin: 35,
    assessmentsRun: 58,
    projectsActive: 4,
    weeklyUsage: [
      { day: "Mon", hours: 24 },
      { day: "Tue", hours: 22 },
      { day: "Wed", hours: 26 },
      { day: "Thu", hours: 22 },
      { day: "Fri", hours: 28 },
      { day: "Sat", hours: 17 },
      { day: "Sun", hours: 17 },
    ],
    featureBreakdown: [
      { name: "Assessments", percentage: 35, color: "hsl(var(--gold))" },
      { name: "Dashboard", percentage: 30, color: "hsl(var(--hq-purple))" },
      { name: "Projects", percentage: 20, color: "hsl(var(--success))" },
      { name: "Messaging", percentage: 10, color: "hsl(var(--info))" },
      { name: "Other", percentage: 5, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "Sandra Hill", hours: 32, sessions: 38 },
      { name: "Mark Turner", hours: 26, sessions: 32 },
      { name: "Beth Young", hours: 20, sessions: 25 },
    ],
  },
  { 
    rank: 9, 
    agency: "Nova Agency", 
    plan: "Founding", 
    timeHours: 142, 
    sessions: 165, 
    lastActive: "8 hours ago",
    users: 5,
    clients: 3,
    avgSessionMin: 28,
    assessmentsRun: 48,
    projectsActive: 4,
    weeklyUsage: [
      { day: "Mon", hours: 22 },
      { day: "Tue", hours: 20 },
      { day: "Wed", hours: 24 },
      { day: "Thu", hours: 20 },
      { day: "Fri", hours: 26 },
      { day: "Sat", hours: 15 },
      { day: "Sun", hours: 15 },
    ],
    featureBreakdown: [
      { name: "Dashboard", percentage: 40, color: "hsl(var(--hq-purple))" },
      { name: "Assessments", percentage: 25, color: "hsl(var(--gold))" },
      { name: "Projects", percentage: 18, color: "hsl(var(--success))" },
      { name: "Messaging", percentage: 12, color: "hsl(var(--info))" },
      { name: "Other", percentage: 5, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "Alex Reed", hours: 28, sessions: 35 },
      { name: "Kate Morgan", hours: 24, sessions: 30 },
      { name: "Dan Cooper", hours: 18, sessions: 22 },
    ],
  },
  { 
    rank: 10, 
    agency: "Catalyst Creative", 
    plan: "Founding", 
    timeHours: 128, 
    sessions: 148, 
    lastActive: "12 hours ago",
    users: 4,
    clients: 2,
    avgSessionMin: 26,
    assessmentsRun: 42,
    projectsActive: 3,
    weeklyUsage: [
      { day: "Mon", hours: 20 },
      { day: "Tue", hours: 18 },
      { day: "Wed", hours: 22 },
      { day: "Thu", hours: 18 },
      { day: "Fri", hours: 24 },
      { day: "Sat", hours: 13 },
      { day: "Sun", hours: 13 },
    ],
    featureBreakdown: [
      { name: "Projects", percentage: 35, color: "hsl(var(--success))" },
      { name: "Dashboard", percentage: 28, color: "hsl(var(--hq-purple))" },
      { name: "Assessments", percentage: 22, color: "hsl(var(--gold))" },
      { name: "Messaging", percentage: 10, color: "hsl(var(--info))" },
      { name: "Other", percentage: 5, color: "hsl(var(--foreground-muted))" },
    ],
    topUsers: [
      { name: "Jason Blake", hours: 25, sessions: 32 },
      { name: "Linda Carter", hours: 20, sessions: 26 },
      { name: "Tim Evans", hours: 16, sessions: 20 },
    ],
  },
];

function MetricCard({
  icon: Icon,
  title,
  value,
  change,
  changeType,
  note,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  note?: string;
}) {
  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-hq-purple-dim border border-hq-purple/30 flex items-center justify-center">
            <Icon className="w-4 h-4 text-hq-purple" />
          </div>
          <span className="text-[11px] text-foreground-muted uppercase tracking-wide">{title}</span>
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-[10px] ${changeType === "up" ? "text-success" : "text-destructive"}`}>
            {changeType === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-[28px] font-light text-foreground">{value}</p>
      {note && <p className="text-[10px] text-foreground-muted mt-1">{note}</p>}
    </div>
  );
}

function HeatmapCell({ value, maxValue }: { value: number; maxValue: number }) {
  const intensity = value / maxValue;
  const opacity = Math.max(0.1, intensity);
  
  return (
    <div
      className="w-full h-6 flex items-center justify-center text-[8px]"
      style={{
        backgroundColor: `hsl(var(--hq-purple) / ${opacity})`,
        color: intensity > 0.5 ? "white" : "hsl(var(--foreground-muted))",
      }}
      title={`${value}% activity`}
    >
      {value > 20 && value}
    </div>
  );
}

function AgencyUsageModal({
  agency,
  open,
  onClose,
}: {
  agency: AgencyUsageData | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!agency) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 pb-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-[18px] font-semibold text-foreground mb-1">
                {agency.agency}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={`text-[9px] ${
                    agency.plan === "Standard"
                      ? "bg-[rgba(96,96,96,0.15)] border-[#666] text-[#666]"
                      : "bg-[rgba(201,162,39,0.15)] border-[#c9a227] text-[#c9a227]"
                  }`}
                >
                  {agency.plan}
                </Badge>
                <span className="text-[11px] text-foreground-muted">Last active: {agency.lastActive}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-foreground-muted">Rank</span>
              <span className={`text-[18px] font-medium ${
                agency.rank === 1 ? "text-gold" :
                agency.rank === 2 ? "text-foreground-muted" :
                agency.rank === 3 ? "text-warning" :
                "text-foreground"
              }`}>
                #{agency.rank}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-background border border-border p-4 text-center">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wide mb-1">Total Time</p>
              <p className="text-[20px] font-light text-foreground">{agency.timeHours}h</p>
            </div>
            <div className="bg-background border border-border p-4 text-center">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wide mb-1">Sessions</p>
              <p className="text-[20px] font-light text-foreground">{agency.sessions}</p>
            </div>
            <div className="bg-background border border-border p-4 text-center">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wide mb-1">Avg Session</p>
              <p className="text-[20px] font-light text-foreground">{agency.avgSessionMin}m</p>
            </div>
            <div className="bg-background border border-border p-4 text-center">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wide mb-1">Users</p>
              <p className="text-[20px] font-light text-foreground">{agency.users}</p>
            </div>
            <div className="bg-background border border-border p-4 text-center">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wide mb-1">Assessments</p>
              <p className="text-[20px] font-light text-foreground">{agency.assessmentsRun}</p>
            </div>
            <div className="bg-background border border-border p-4 text-center">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wide mb-1">Projects</p>
              <p className="text-[20px] font-light text-foreground">{agency.projectsActive}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Weekly Usage */}
            <div className="bg-background border border-border p-4">
              <h3 className="text-[12px] font-semibold text-foreground mb-4">Weekly Usage</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agency.weeklyUsage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--foreground-muted))" fontSize={10} tickLine={false} />
                    <YAxis stroke="hsl(var(--foreground-muted))" fontSize={10} tickLine={false} tickFormatter={(v) => `${v}h`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 0,
                        fontSize: 11,
                      }}
                      formatter={(value: number) => [`${value} hours`, "Usage"]}
                    />
                    <Bar dataKey="hours" fill="hsl(var(--hq-purple))" radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Feature Breakdown */}
            <div className="bg-background border border-border p-4">
              <h3 className="text-[12px] font-semibold text-foreground mb-4">Feature Breakdown</h3>
              <div className="flex">
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={agency.featureBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="percentage"
                      >
                        {agency.featureBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2 ml-4">
                  {agency.featureBreakdown.map((feature) => (
                    <div key={feature.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2" style={{ backgroundColor: feature.color }} />
                        <span className="text-[11px] text-foreground">{feature.name}</span>
                      </div>
                      <span className="text-[11px] text-foreground-muted">{feature.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Users */}
          <div className="bg-background border border-border p-4">
            <h3 className="text-[12px] font-semibold text-foreground mb-4">Top Users</h3>
            <div className="grid grid-cols-3 gap-4">
              {agency.topUsers.map((user, index) => (
                <div key={user.name} className="flex items-center gap-3 p-3 border border-border">
                  <div className={`w-8 h-8 flex items-center justify-center text-[12px] font-medium ${
                    index === 0 ? "bg-gold/20 text-gold" :
                    index === 1 ? "bg-foreground-muted/20 text-foreground-muted" :
                    "bg-warning/20 text-warning"
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] text-foreground font-medium">{user.name}</p>
                    <p className="text-[10px] text-foreground-muted">{user.hours}h • {user.sessions} sessions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-[11px] text-foreground-muted">
              <span>Clients managed: <span className="text-foreground font-medium">{agency.clients}</span></span>
            </div>
            <Button variant="outline" size="sm" className="gap-1 text-[11px]">
              View Full Agency Profile
              <ArrowUpRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HQUsage() {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [selectedAgency, setSelectedAgency] = useState<AgencyUsageData | null>(null);

  // Calculate max value for heatmap
  const maxHeatValue = Math.max(...peakHoursData.flatMap((d) => d.hours));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground mb-1">Platform Usage</h1>
          <p className="text-[13px] text-foreground-muted">Time and activity metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
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
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics - 5 cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <MetricCard
          icon={Clock}
          title="Total Time This Month"
          value="4,230 hours"
          change="+12% vs last month"
          changeType="up"
        />
        <MetricCard
          icon={Timer}
          title="Avg Session Duration"
          value="34 min"
          change="+8%"
          changeType="up"
        />
        <MetricCard
          icon={Users}
          title="Daily Active Users"
          value="156"
          note="Peak: Yesterday at 2pm"
        />
        <MetricCard
          icon={FileCheck}
          title="Assessments Run"
          value="1,247"
          note="This month"
        />
        <MetricCard
          icon={FolderKanban}
          title="Projects Active"
          value="89"
          note="Across all clients"
        />
      </div>

      {/* Charts Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* TOP LEFT - Usage Over Time */}
        <div className="bg-card border border-border p-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-5">Usage Over Time</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyUsage}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--hq-purple))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--hq-purple))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--foreground-muted))" 
                  fontSize={9} 
                  tickLine={false}
                  interval={4}
                />
                <YAxis 
                  stroke="hsl(var(--foreground-muted))" 
                  fontSize={10} 
                  tickLine={false} 
                  tickFormatter={(v) => `${v}h`} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 11,
                  }}
                  formatter={(value: number) => [`${value} hours`, "Usage"]}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(var(--hq-purple))"
                  strokeWidth={2}
                  fill="url(#usageGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP RIGHT - Usage by Feature */}
        <div className="bg-card border border-border p-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-5">Usage by Feature</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="hsl(var(--foreground-muted))" 
                  fontSize={10} 
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 40]}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="hsl(var(--foreground-muted))" 
                  fontSize={11} 
                  tickLine={false} 
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 11,
                  }}
                  formatter={(value: number) => [`${value}%`, "Usage"]}
                />
                <Bar dataKey="percentage" radius={0}>
                  {featureUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM LEFT - Peak Hours Heatmap */}
        <div className="bg-card border border-border p-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-5">Peak Hours</h2>
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Hour labels */}
              <div className="grid grid-cols-[40px_repeat(17,1fr)] gap-0.5 mb-1">
                <div />
                {hourLabels.map((hour) => (
                  <div key={hour} className="text-[8px] text-foreground-muted text-center">
                    {hour}
                  </div>
                ))}
              </div>
              {/* Heatmap rows */}
              {peakHoursData.map((dayData) => (
                <div key={dayData.day} className="grid grid-cols-[40px_repeat(17,1fr)] gap-0.5 mb-0.5">
                  <div className="text-[10px] text-foreground-muted flex items-center">
                    {dayData.day}
                  </div>
                  {dayData.hours.map((value, i) => (
                    <HeatmapCell key={i} value={value} maxValue={maxHeatValue} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-[10px] text-foreground-muted">
            <span>Low activity</span>
            <div className="flex items-center gap-1">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity) => (
                <div
                  key={opacity}
                  className="w-4 h-3"
                  style={{ backgroundColor: `hsl(var(--hq-purple) / ${opacity})` }}
                />
              ))}
            </div>
            <span>High activity</span>
          </div>
        </div>

        {/* BOTTOM RIGHT - User Retention */}
        <div className="bg-card border border-border p-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-5">User Retention</h2>
          <div className="space-y-6">
            {retentionData.map((item) => (
              <div key={item.week} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-foreground">{item.week}</span>
                  <span className="text-[14px] text-foreground font-medium">{item.retention}%</span>
                </div>
                <div className="h-3 bg-border">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${item.retention}%`,
                      backgroundColor:
                        item.retention >= 70
                          ? "hsl(var(--success))"
                          : item.retention >= 50
                          ? "hsl(var(--gold))"
                          : "hsl(var(--warning))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-foreground-muted uppercase tracking-wide">Avg Retention</p>
                <p className="text-[20px] font-light text-foreground mt-1">62%</p>
              </div>
              <div>
                <p className="text-[10px] text-foreground-muted uppercase tracking-wide">Target</p>
                <p className="text-[20px] font-light text-success mt-1">70%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Users Table */}
      <div className="bg-card border border-border">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-foreground">Most Active Agencies</h2>
          <span className="text-[10px] text-foreground-muted">Click row to view details</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide w-16">Rank</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Agency</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Plan</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Time This Month</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Sessions</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topAgencies.map((agency) => (
              <TableRow 
                key={agency.rank} 
                className="border-border hover:bg-card-hover cursor-pointer transition-colors"
                onClick={() => setSelectedAgency(agency)}
              >
                <TableCell>
                  <span className={`text-[13px] font-medium ${
                    agency.rank === 1 ? "text-gold" :
                    agency.rank === 2 ? "text-foreground-muted" :
                    agency.rank === 3 ? "text-warning" :
                    "text-foreground-muted"
                  }`}>
                    #{agency.rank}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-foreground font-medium">{agency.agency}</span>
                    <ArrowUpRight className="w-3 h-3 text-foreground-muted opacity-0 group-hover:opacity-100" />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`text-[9px] ${
                      agency.plan === "Standard" 
                        ? "bg-[rgba(96,96,96,0.15)] border-[#666] text-[#666]" 
                        : "bg-[rgba(201,162,39,0.15)] border-[#c9a227] text-[#c9a227]"
                    }`}
                  >
                    {agency.plan}
                  </Badge>
                </TableCell>
                <TableCell className="text-[13px] text-foreground">{agency.timeHours} hrs</TableCell>
                <TableCell className="text-[12px] text-foreground-muted">{agency.sessions}</TableCell>
                <TableCell className="text-[11px] text-foreground-muted">{agency.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Agency Usage Modal */}
      <AgencyUsageModal
        agency={selectedAgency}
        open={!!selectedAgency}
        onClose={() => setSelectedAgency(null)}
      />
    </div>
  );
}
