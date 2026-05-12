import { useState, useMemo } from "react";
import { Search, ChevronDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockClients, uniqueAgencies, uniqueIndustries, Client } from "@/data/hqClientsData";
import { ClientDetailModal } from "@/components/hq/ClientDetailModal";

function StatusBadge({ status }: { status: Client["status"] }) {
  const styles = {
    Healthy: "bg-success/10 text-success",
    Warning: "bg-warning/10 text-warning",
    Critical: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}

function PlanBadge({ plan }: { plan: Client["agencyPlan"] }) {
  const styles = {
    FREE: "bg-muted text-foreground-muted",
    PRO: "bg-hq-purple-dim text-hq-purple",
    ENTERPRISE: "bg-gold-dim text-gold",
  };
  return (
    <span className={`px-1.5 py-0.5 text-[8px] font-bold ${styles[plan]}`}>{plan}</span>
  );
}

function ScoreColor(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

function ScoreBarColor(score: number) {
  if (score >= 75) return "bg-success";
  if (score >= 50) return "bg-warning";
  return "bg-destructive";
}

export default function HQClients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [agencyFilter, setAgencyFilter] = useState("All Agencies");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return mockClients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" || client.status === statusFilter;

      const matchesAgency =
        agencyFilter === "All Agencies" || client.agencyName === agencyFilter;

      const matchesIndustry =
        industryFilter === "All Industries" || client.industry === industryFilter;

      return matchesSearch && matchesStatus && matchesAgency && matchesIndustry;
    });
  }, [searchQuery, statusFilter, agencyFilter, industryFilter]);

  const stats = useMemo(() => {
    const total = mockClients.length;
    const healthy = mockClients.filter((c) => c.status === "Healthy").length;
    const warning = mockClients.filter((c) => c.status === "Warning").length;
    const critical = mockClients.filter((c) => c.status === "Critical").length;
    return { total, healthy, warning, critical };
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground mb-1">All Clients</h1>
          <p className="text-[13px] text-foreground-muted">
            {stats.total} Total •{" "}
            <span className="text-success">{stats.healthy} Healthy</span> •{" "}
            <span className="text-warning">{stats.warning} Warning</span> •{" "}
            <span className="text-destructive">{stats.critical} Critical</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-56 bg-card border-border"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {statusFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              {["All Status", "Healthy", "Warning", "Critical"].map((status) => (
                <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 max-w-[180px]">
                <span className="truncate">{agencyFilter}</span>
                <ChevronDown className="w-4 h-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border max-h-64 overflow-y-auto">
              <DropdownMenuItem onClick={() => setAgencyFilter("All Agencies")}>
                All Agencies
              </DropdownMenuItem>
              {uniqueAgencies.map((agency) => (
                <DropdownMenuItem key={agency} onClick={() => setAgencyFilter(agency)}>
                  {agency}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {industryFilter}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border max-h-64 overflow-y-auto">
              <DropdownMenuItem onClick={() => setIndustryFilter("All Industries")}>
                All Industries
              </DropdownMenuItem>
              {uniqueIndustries.map((industry) => (
                <DropdownMenuItem key={industry} onClick={() => setIndustryFilter(industry)}>
                  {industry}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">
                Client
              </TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">
                Industry
              </TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">
                Agency
              </TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">
                B.A.S.E. Score
              </TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">
                Status
              </TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">
                Assessments
              </TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide">
                Last Active
              </TableHead>
              <TableHead className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow
                key={client.id}
                className="border-border hover:bg-card-hover cursor-pointer"
                onClick={() => setSelectedClient(client)}
              >
                {/* Client */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-hq-purple-dim border border-hq-purple/30 flex items-center justify-center shrink-0">
                      <span className="text-[14px] font-bold text-hq-purple">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-foreground">{client.name}</p>
                      <p className="text-[12px] text-foreground-muted">{client.email}</p>
                    </div>
                  </div>
                </TableCell>
                {/* Industry */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">{client.industryIcon}</span>
                    <span className="text-[13px] text-foreground">{client.industry}</span>
                  </div>
                </TableCell>
                {/* Agency */}
                <TableCell>
                  <div>
                    <p className="text-[13px] text-foreground">{client.agencyName}</p>
                    <PlanBadge plan={client.agencyPlan} />
                  </div>
                </TableCell>
                {/* B.A.S.E. Score */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`text-[15px] font-medium w-8 ${ScoreColor(client.baseScore)}`}>
                      {client.baseScore.toFixed(1)}
                    </span>
                    <div className="w-16 h-1.5 bg-background-secondary overflow-hidden">
                      <div
                        className={`h-full ${ScoreBarColor(client.baseScore)}`}
                        style={{ width: `${client.baseScore}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                {/* Status */}
                <TableCell>
                  <StatusBadge status={client.status} />
                </TableCell>
                {/* Assessments */}
                <TableCell>
                  <div>
                    <p className="text-[13px] text-foreground">{client.assessmentCount}</p>
                    <p className="text-[11px] text-foreground-muted">{client.lastAssessmentDate}</p>
                  </div>
                </TableCell>
                {/* Last Active */}
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-[13px] text-foreground-secondary cursor-help">
                        {client.lastActive}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-border">
                      <p className="text-[11px]">{client.lastActiveDate}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                {/* Actions */}
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-[11px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClient(client);
                    }}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredClients.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-[13px] text-foreground-muted">No clients match your filters.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          open={!!selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
}
