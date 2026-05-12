import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ChevronDown,
  Download,
  AlertCircle,
  Eye,
  RotateCcw,
  Calendar,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - 12 months of MRR growth
const revenueData = [
  { month: "Feb", mrr: 5200, revenue: 5800, newMrr: 420, churn: 180 },
  { month: "Mar", mrr: 5840, revenue: 6200, newMrr: 720, churn: 80 },
  { month: "Apr", mrr: 6480, revenue: 7100, newMrr: 780, churn: 140 },
  { month: "May", mrr: 7120, revenue: 7800, newMrr: 820, churn: 180 },
  { month: "Jun", mrr: 7680, revenue: 8200, newMrr: 700, churn: 140 },
  { month: "Jul", mrr: 8420, revenue: 9100, newMrr: 880, churn: 140 },
  { month: "Aug", mrr: 9180, revenue: 10200, newMrr: 920, churn: 160 },
  { month: "Sep", mrr: 9860, revenue: 10800, newMrr: 840, churn: 160 },
  { month: "Oct", mrr: 10540, revenue: 11600, newMrr: 880, churn: 200 },
  { month: "Nov", mrr: 11220, revenue: 12400, newMrr: 880, churn: 200 },
  { month: "Dec", mrr: 11840, revenue: 13100, newMrr: 820, churn: 200 },
  { month: "Jan", mrr: 12450, revenue: 14200, newMrr: 810, churn: 200 },
];

// Sparkline data for MRR card
const mrrSparkline = revenueData.slice(-7).map((d) => ({ value: d.mrr }));

const revenueByPlan = [
  { name: "Founding", value: 3686, count: 38, color: "hsl(var(--hq-purple))" },
  { name: "Standard", value: 1188, count: 4, color: "hsl(var(--gold))" },
  { name: "Trial", value: 0, count: 5, color: "hsl(var(--foreground-muted))" },
];

const billingCycleData = [
  { cycle: "Monthly", agencies: 35, revenue: 3395 },
  { cycle: "Annual", agencies: 7, revenue: 1479 },
];

type TransactionType = "Subscription" | "Upgrade" | "Downgrade" | "Refund" | "Failed Payment";
type TransactionStatus = "Completed" | "Pending" | "Failed" | "Refunded";

interface Transaction {
  id: string;
  date: string;
  agency: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
}

const transactions: Transaction[] = [
  { id: "txn_001", date: "Jan 27, 2026", agency: "Pixel Perfect", type: "Subscription", amount: 297, status: "Completed" },
  { id: "txn_002", date: "Jan 27, 2026", agency: "Brand Architects", type: "Subscription", amount: 97, status: "Completed" },
  { id: "txn_003", date: "Jan 26, 2026", agency: "Growth Labs", type: "Upgrade", amount: 200, status: "Completed" },
  { id: "txn_004", date: "Jan 26, 2026", agency: "Summit Strategy", type: "Subscription", amount: 297, status: "Completed" },
  { id: "txn_005", date: "Jan 25, 2026", agency: "GESTALT Partners", type: "Subscription", amount: 97, status: "Completed" },
  { id: "txn_006", date: "Jan 25, 2026", agency: "Elevate Agency", type: "Failed Payment", amount: 97, status: "Failed" },
  { id: "txn_007", date: "Jan 24, 2026", agency: "Spark Digital", type: "Subscription", amount: 97, status: "Completed" },
  { id: "txn_008", date: "Jan 24, 2026", agency: "Visionary Group", type: "Subscription", amount: 297, status: "Completed" },
  { id: "txn_009", date: "Jan 23, 2026", agency: "Create Studio", type: "Upgrade", amount: 200, status: "Completed" },
  { id: "txn_010", date: "Jan 23, 2026", agency: "Thrive Brands", type: "Subscription", amount: 97, status: "Completed" },
  { id: "txn_011", date: "Jan 22, 2026", agency: "Nova Agency", type: "Refund", amount: -97, status: "Refunded" },
  { id: "txn_012", date: "Jan 22, 2026", agency: "Apex Creative", type: "Subscription", amount: 97, status: "Completed" },
  { id: "txn_013", date: "Jan 21, 2026", agency: "Fusion Labs", type: "Downgrade", amount: -100, status: "Completed" },
  { id: "txn_014", date: "Jan 20, 2026", agency: "Horizon Digital", type: "Subscription", amount: 97, status: "Pending" },
  { id: "txn_015", date: "Jan 19, 2026", agency: "Catalyst Agency", type: "Subscription", amount: 297, status: "Completed" },
];

const statusConfig: Record<TransactionStatus, { className: string }> = {
  Completed: { className: "bg-success/20 text-success border-success/30" },
  Pending: { className: "bg-warning/20 text-warning border-warning/30" },
  Failed: { className: "bg-destructive/20 text-destructive border-destructive/30" },
  Refunded: { className: "bg-foreground-muted/20 text-foreground-muted border-foreground-muted/30" },
};

function MetricCard({
  title,
  value,
  valueColor,
  breakdown,
  trend,
  trendType,
  sparklineData,
  note,
  action,
}: {
  title: string;
  value: string;
  valueColor?: string;
  breakdown?: string;
  trend?: string;
  trendType?: "up" | "down";
  sparklineData?: { value: number }[];
  note?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="bg-card border border-border p-5">
      <p className="text-[11px] text-foreground-muted uppercase tracking-wide mb-3">{title}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-[36px] font-light ${valueColor || "text-foreground"}`}>{value}</p>
          {breakdown && <p className="text-[10px] text-foreground-muted mt-1 max-w-[200px]">{breakdown}</p>}
          {note && <p className="text-[10px] text-foreground-muted mt-1">{note}</p>}
          {action && (
            <button onClick={action.onClick} className="text-[10px] text-hq-purple hover:underline mt-1 flex items-center gap-1">
              {action.label} <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {trend && (
            <div className={`flex items-center gap-1 text-[11px] ${trendType === "up" ? "text-success" : "text-destructive"}`}>
              {trendType === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </div>
          )}
          {sparklineData && (
            <div className="w-20 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--success))"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HQRevenue() {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [chartView, setChartView] = useState<"mrr" | "revenue" | "comparison">("mrr");
  const [txnFilter, setTxnFilter] = useState<"all" | TransactionStatus>("all");

  const filteredTransactions = transactions.filter((txn) => {
    if (txnFilter === "all") return true;
    return txn.status === txnFilter;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground mb-1">Revenue & Transactions</h1>
          <p className="text-[13px] text-foreground-muted">Financial overview and payment history</p>
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
              <DropdownMenuItem onClick={() => setDateRange("Custom")}>Custom range...</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics - 4 large cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <MetricCard
          title="Monthly Recurring Revenue"
          value="$12,450"
          valueColor="text-success"
          breakdown="38 Founding × $97 = $3,686 | 4 Standard × $297 = $1,188"
          trend="+18%"
          trendType="up"
          sparklineData={mrrSparkline}
        />
        <MetricCard
          title="Annual Recurring Revenue"
          value="$149,400"
          note="MRR × 12"
          trend="+18%"
          trendType="up"
        />
        <MetricCard
          title="Revenue This Month"
          value="$14,200"
          note="Includes upgrades and one-time"
          trend="+$1,560"
          trendType="up"
        />
        <MetricCard
          title="Outstanding"
          value="$1,940"
          valueColor="text-warning"
          note="3 invoices past due"
          action={{ label: "View", onClick: () => {} }}
        />
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="bg-card border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[14px] font-semibold text-foreground">Revenue Trend</h2>
          <div className="flex items-center gap-2">
            <div className="flex bg-background border border-border">
              <button
                onClick={() => setChartView("mrr")}
                className={`px-3 py-1.5 text-[11px] transition-colors ${
                  chartView === "mrr" ? "bg-hq-purple text-white" : "text-foreground-muted hover:text-foreground"
                }`}
              >
                MRR
              </button>
              <button
                onClick={() => setChartView("revenue")}
                className={`px-3 py-1.5 text-[11px] transition-colors ${
                  chartView === "revenue" ? "bg-hq-purple text-white" : "text-foreground-muted hover:text-foreground"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setChartView("comparison")}
                className={`px-3 py-1.5 text-[11px] transition-colors ${
                  chartView === "comparison" ? "bg-hq-purple text-white" : "text-foreground-muted hover:text-foreground"
                }`}
              >
                New vs Churned
              </button>
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "comparison" ? (
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground-muted))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--foreground-muted))" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [
                    `$${Math.abs(value).toLocaleString()}`,
                    name === "newMrr" ? "New MRR" : "Churned MRR",
                  ]}
                />
                <Bar dataKey="newMrr" fill="hsl(var(--success))" name="newMrr" />
                <Bar dataKey="churn" fill="hsl(var(--destructive))" name="churn" />
              </BarChart>
            ) : (
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--hq-purple))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--hq-purple))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground-muted))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--foreground-muted))" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, chartView === "mrr" ? "MRR" : "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey={chartView === "mrr" ? "mrr" : "revenue"}
                  stroke="hsl(var(--hq-purple))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        {chartView === "comparison" && (
          <div className="flex items-center justify-center gap-6 mt-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-success" />
              <span className="text-foreground-muted">New MRR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-destructive" />
              <span className="text-foreground-muted">Churned MRR</span>
            </div>
          </div>
        )}
      </div>

      {/* Breakdown Section - 3 Columns */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* By Plan - Donut Chart */}
        <div className="bg-card border border-border p-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-5">By Plan</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByPlan}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueByPlan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 11,
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}/mo`, "Revenue"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {revenueByPlan.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ backgroundColor: plan.color }} />
                  <span className="text-[11px] text-foreground">{plan.name}</span>
                  <span className="text-[10px] text-foreground-muted">({plan.count} agencies)</span>
                </div>
                <span className="text-[11px] text-foreground font-medium">
                  {plan.value > 0 ? `$${plan.value.toLocaleString()}/mo` : "$0"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* By Billing Cycle - Bar Chart */}
        <div className="bg-card border border-border p-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-5">By Billing Cycle</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={billingCycleData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--foreground-muted))" fontSize={10} tickLine={false} />
                <YAxis dataKey="cycle" type="category" stroke="hsl(var(--foreground-muted))" fontSize={11} tickLine={false} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 0,
                    fontSize: 11,
                  }}
                  formatter={(value: number, name: string) => [
                    name === "agencies" ? `${value} agencies` : `$${value.toLocaleString()}`,
                    name === "agencies" ? "Count" : "Revenue",
                  ]}
                />
                <Bar dataKey="agencies" fill="hsl(var(--hq-purple))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-border">
            {billingCycleData.map((item) => (
              <div key={item.cycle} className="flex items-center justify-between">
                <span className="text-[11px] text-foreground">{item.cycle}</span>
                <div className="text-right">
                  <span className="text-[11px] text-foreground font-medium">{item.agencies} agencies</span>
                  <span className="text-[10px] text-foreground-muted ml-2">(${item.revenue.toLocaleString()}/mo)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Stats */}
        <div className="bg-card border border-border p-6">
          <h2 className="text-[14px] font-semibold text-foreground mb-5">Key Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-[11px] text-foreground-muted">Avg Revenue Per Agency</span>
              <span className="text-[14px] text-foreground font-medium">$265/mo</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-[11px] text-foreground-muted">Customer Lifetime Value</span>
              <span className="text-[14px] text-foreground font-medium">$2,340</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-[11px] text-foreground-muted">Churn Rate</span>
              <span className="text-[14px] text-destructive font-medium">2.3%</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-[11px] text-foreground-muted">Net Revenue Retention</span>
              <span className="text-[14px] text-success font-medium">108%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-border">
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-foreground">Recent Transactions</h2>
            <div className="flex items-center gap-2">
              {(["all", "Completed", "Pending", "Failed", "Refunded"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTxnFilter(filter)}
                  className={`px-3 py-1.5 text-[11px] transition-colors ${
                    txnFilter === filter
                      ? "bg-hq-purple text-white"
                      : "text-foreground-muted hover:text-foreground bg-background border border-border"
                  }`}
                >
                  {filter === "all" ? "All" : filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Date</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Agency</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Type</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Amount</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Status</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((txn) => (
              <TableRow key={txn.id} className="border-border hover:bg-card-hover">
                <TableCell className="text-[12px] text-foreground-muted">{txn.date}</TableCell>
                <TableCell className="text-[13px] text-foreground">{txn.agency}</TableCell>
                <TableCell>
                  <span className={`text-[11px] ${
                    txn.type === "Subscription" ? "text-foreground" :
                    txn.type === "Upgrade" ? "text-success" :
                    txn.type === "Downgrade" ? "text-warning" :
                    txn.type === "Refund" ? "text-foreground-muted" :
                    "text-destructive"
                  }`}>
                    {txn.type}
                  </span>
                </TableCell>
                <TableCell className={`text-[13px] font-medium ${txn.amount < 0 ? "text-foreground-muted" : "text-foreground"}`}>
                  {txn.amount < 0 ? `-$${Math.abs(txn.amount)}` : `$${txn.amount}`}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[9px] ${statusConfig[txn.status].className}`}>
                    {txn.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-7 h-7" title="View Details">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    {(txn.status === "Completed" || txn.status === "Pending") && txn.amount > 0 && (
                      <Button variant="ghost" size="icon" className="w-7 h-7" title="Issue Refund">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-foreground-muted mx-auto mb-3" />
            <p className="text-[13px] text-foreground-muted">No transactions found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
