import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
  Eye,
  Pencil,
  Ticket,
  MessageSquare,
  Pause,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockAgencies, Agency } from "@/data/hqAgenciesData";
import { AgencyDetailPanel } from "@/components/hq/AgencyDetailPanel";
import { PlanBadge } from "@/components/hq/PlanBadge";

function StatusBadge({ status }: { status: Agency["status"] }) {
  const styles = {
    Active: "bg-success/10 text-success",
    Trial: "bg-info/10 text-info",
    "Past Due": "bg-warning/10 text-warning",
    Canceled: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold ${styles[status]}`}>{status.toUpperCase()}</span>
  );
}

function TrendIcon({ trend }: { trend: Agency["hoursTrend"] }) {
  if (trend === "up") return <TrendingUp className="w-3 h-3 text-success" />;
  if (trend === "down") return <TrendingDown className="w-3 h-3 text-destructive" />;
  return <Minus className="w-3 h-3 text-foreground-muted" />;
}

export default function HQAgencies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("All Plans");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  const maxClients = Math.max(...mockAgencies.map((a) => a.clients));

  const filteredAgencies = useMemo(() => {
    return mockAgencies.filter((agency) => {
      const matchesSearch =
        agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const planMap: Record<string, string> = { "Founding": "PRO", "Standard": "ENTERPRISE", "Trial": "FREE" };
      const matchesPlan =
        planFilter === "All Plans" ||
        agency.plan === (planMap[planFilter] || planFilter.toUpperCase());

      const matchesStatus =
        statusFilter === "All Status" ||
        agency.status === statusFilter;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [searchQuery, planFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = mockAgencies.length;
    const pro = mockAgencies.filter((a) => a.plan === "PRO").length;
    const enterprise = mockAgencies.filter((a) => a.plan === "ENTERPRISE").length;
    const free = mockAgencies.filter((a) => a.plan === "FREE").length;
    return { total, pro, enterprise, free };
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground mb-1">All Agencies</h1>
          <p className="text-[13px] text-foreground-muted">
            {stats.total} Total • {stats.pro} Founding • {stats.enterprise} Standard • {stats.free} Trial
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search agencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 bg-card border-border"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {planFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              {["All Plans", "Trial", "Founding", "Standard"].map((plan) => (
                <DropdownMenuItem key={plan} onClick={() => setPlanFilter(plan)}>
                  {plan}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {statusFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              {["All Status", "Active", "Trial", "Past Due", "Canceled"].map((status) => (
                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Agency</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Owner</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Plan</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Status</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Clients</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Revenue</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Time Used</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">Joined</TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgencies.map((agency) => (
              <TableRow key={agency.id} className="border-border hover:bg-card-hover">
                {/* Agency */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-hq-purple-dim border border-hq-purple/30 flex items-center justify-center shrink-0">
                      <span className="text-[14px] font-bold text-hq-purple">{agency.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-foreground">{agency.name}</p>
                      <p className="text-[12px] text-foreground-muted">{agency.website}</p>
                    </div>
                  </div>
                </TableCell>
                {/* Owner */}
                <TableCell>
                  <p className="text-[13px] text-foreground">{agency.ownerName}</p>
                  <p className="text-[12px] text-foreground-muted">{agency.ownerEmail}</p>
                </TableCell>
                {/* Plan */}
                <TableCell>
                  <PlanBadge plan={agency.plan} />
                </TableCell>
                {/* Status */}
                <TableCell>
                  <StatusBadge status={agency.status} />
                </TableCell>
                {/* Clients */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-foreground w-6">{agency.clients}</span>
                    <div className="w-16 h-1.5 bg-background-secondary overflow-hidden">
                      <div
                        className="h-full bg-hq-purple"
                        style={{ width: `${(agency.clients / maxClients) * 100}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                {/* Revenue */}
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-[13px] text-foreground cursor-help">
                        ${agency.monthlyRevenue}/mo
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-border">
                      <p className="text-[11px]">Lifetime: ${agency.lifetimeRevenue}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                {/* Time Used */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] text-foreground">{agency.hoursThisMonth}h</span>
                    <TrendIcon trend={agency.hoursTrend} />
                  </div>
                </TableCell>
                {/* Joined */}
                <TableCell>
                  <span className="text-[13px] text-foreground-secondary">{agency.joined}</span>
                </TableCell>
                {/* Actions */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-[11px]"
                      onClick={() => setSelectedAgency(agency)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Ticket className="w-3.5 h-3.5" /> Apply Coupon
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <MessageSquare className="w-3.5 h-3.5" /> Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem className="gap-2 text-warning">
                          <Pause className="w-3.5 h-3.5" /> Pause
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAgencies.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-[13px] text-foreground-muted">No agencies match your filters.</p>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedAgency && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedAgency(null)}
          />
          <AgencyDetailPanel
            agency={selectedAgency}
            onClose={() => setSelectedAgency(null)}
          />
        </>
      )}
    </div>
  );
}
