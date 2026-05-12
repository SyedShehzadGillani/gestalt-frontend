import { useAgencyContext, Client } from "@/hooks/use-agency-context";
import { Building2, ArrowRight, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<Client["status"], string> = {
  active: "bg-success text-success-foreground",
  onboarding: "bg-warning text-warning-foreground",
  paused: "bg-muted text-muted-foreground",
};

const statusLabels: Record<Client["status"], string> = {
  active: "Active",
  onboarding: "Onboarding",
  paused: "Paused",
};

export function ClientsPage() {
  const { clients, selectClient } = useAgencyContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your client portfolio
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          + Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple/15 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clients.length}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Clients
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-success/15 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {clients.filter((c) => c.status === "active").length}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Active
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-warning/15 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {clients.filter((c) => c.status === "onboarding").length}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Onboarding
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-2 gap-4">
        {clients.map((client) => (
          <button
            key={client.id}
            onClick={() => selectClient(client.id)}
            className="p-4 bg-card border border-border hover:border-primary hover:bg-card-hover transition-all text-left group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-muted flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">
                    {client.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary transition-colors">
                    {client.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {client.industry}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 uppercase tracking-wider",
                  statusColors[client.status]
                )}
              >
                {statusLabels[client.status]}
              </span>
              <span className="text-xs text-muted-foreground">
                View Dashboard →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
