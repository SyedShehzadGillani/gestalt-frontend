import { useState } from "react";
import { Search, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InviteClientModal } from "./InviteClientModal";

interface Client {
  id: string;
  name: string;
  industry: string;
  status: "healthy" | "warning" | "critical";
  score: number;
  projects: number;
  lastActivity: string;
}

const mockClients: Client[] = [
  { id: "1", name: "Meridian Tech", industry: "Software", status: "healthy", score: 82, projects: 3, lastActivity: "2 days ago" },
  { id: "2", name: "Coastal Living", industry: "Real Estate", status: "warning", score: 61, projects: 2, lastActivity: "5 days ago" },
  { id: "3", name: "Summit Fitness", industry: "Health & Wellness", status: "healthy", score: 78, projects: 4, lastActivity: "5 hours ago" },
  { id: "4", name: "Nova Financial", industry: "Financial Services", status: "critical", score: 43, projects: 1, lastActivity: "14 days ago" },
];

const statusStyles = {
  healthy: { bg: "bg-success-dim", text: "text-success", label: "HEALTHY" },
  warning: { bg: "bg-warning-dim", text: "text-warning", label: "WARNING" },
  critical: { bg: "bg-red-dim", text: "text-red", label: "CRITICAL" },
};

interface ClientsPageProps {
  onSelectClient: (clientId: string) => void;
}

export function ClientsPage({ onSelectClient }: ClientsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score: number) => {
    if (score > 75) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-red";
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-semibold text-foreground">Clients</h1>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-[240px] pl-9 bg-muted border-border text-foreground placeholder:text-foreground-muted"
            />
          </div>

          {/* Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-muted border-border text-foreground">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              <SelectItem value="all" className="text-foreground hover:bg-muted focus:bg-muted">
                All Status
              </SelectItem>
              <SelectItem value="healthy" className="text-foreground hover:bg-muted focus:bg-muted">
                Healthy
              </SelectItem>
              <SelectItem value="warning" className="text-foreground hover:bg-muted focus:bg-muted">
                Warning
              </SelectItem>
              <SelectItem value="critical" className="text-foreground hover:bg-muted focus:bg-muted">
                Critical
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Invite Button */}
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-gold text-primary-foreground hover:bg-gold/90"
          >
            + Invite Client
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border">
        {/* Table Header */}
        <div className="bg-muted grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr_1.2fr_1fr] gap-4 px-5 py-3">
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Client
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Industry
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Status
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            B.A.S.E. Score
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Projects
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Last Activity
          </span>
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-foreground-secondary">
            Actions
          </span>
        </div>

        {/* Table Rows */}
        {filteredClients.map((client) => {
          const statusStyle = statusStyles[client.status];
          return (
            <div
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className="grid grid-cols-[2fr_1.5fr_1fr_1fr_0.8fr_1.2fr_1fr] gap-4 px-5 py-4 border-b border-border hover:bg-card cursor-pointer transition-colors"
            >
              {/* Client */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gold-dim flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-semibold text-gold">
                    {getInitials(client.name)}
                  </span>
                </div>
                <span className="text-[14px] font-medium text-foreground">
                  {client.name}
                </span>
              </div>

              {/* Industry */}
              <div className="flex items-center">
                <span className="text-[13px] text-foreground-muted">
                  {client.industry}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <span
                  className={`text-[9px] font-bold tracking-[1px] px-2 py-1 ${statusStyle.bg} ${statusStyle.text}`}
                >
                  {statusStyle.label}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center">
                <span className={`text-[14px] font-semibold ${getScoreColor(client.score)}`}>
                  {client.score}
                </span>
              </div>

              {/* Projects */}
              <div className="flex items-center">
                <span className="text-[13px] text-foreground">{client.projects}</span>
              </div>

              {/* Last Activity */}
              <div className="flex items-center">
                <span className="text-[13px] text-foreground-muted">
                  {client.lastActivity}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-[11px] h-7 px-3"
                  onClick={() => onSelectClient(client.id)}
                >
                  View
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border z-50">
                    <DropdownMenuItem className="text-foreground hover:bg-muted focus:bg-muted cursor-pointer">
                      Edit Client
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-foreground hover:bg-muted focus:bg-muted cursor-pointer">
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red hover:bg-red-dim focus:bg-red-dim cursor-pointer">
                      Remove Client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-[14px] text-foreground-muted">No clients found.</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <InviteClientModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
