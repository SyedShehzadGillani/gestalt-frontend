import { X, Mail, Building2, FolderOpen, FileText, ExternalLink } from "lucide-react";
import { Client } from "@/data/hqClientsData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClientDetailModalProps {
  client: Client;
  open: boolean;
  onClose: () => void;
}

function PlanBadge({ plan }: { plan: Client["agencyPlan"] }) {
  const styles = {
    FREE: "bg-muted text-foreground-muted",
    PRO: "bg-hq-purple-dim text-hq-purple",
    ENTERPRISE: "bg-gold-dim text-gold",
  };
  return (
    <span className={`px-2 py-0.5 text-[9px] font-bold ${styles[plan]}`}>{plan}</span>
  );
}

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

export function ClientDetailModal({ client, open, onClose }: ClientDetailModalProps) {
  const categories = [
    { name: "Perception", score: client.categoryScores.perception },
    { name: "Clarity", score: client.categoryScores.clarity },
    { name: "Identity", score: client.categoryScores.identity },
    { name: "Culture", score: client.categoryScores.culture },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border p-0 gap-0">
        <DialogHeader className="p-5 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-hq-purple-dim border border-hq-purple/30 flex items-center justify-center">
              <span className="text-[22px] font-bold text-hq-purple">{client.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-[18px] font-semibold text-foreground">
                  {client.name}
                </DialogTitle>
                <StatusBadge status={client.status} />
              </div>
              <div className="flex items-center gap-2 text-[12px] text-foreground-muted mt-1">
                <span>{client.industryIcon} {client.industry}</span>
                <span>•</span>
                <span>{client.agencyName}</span>
                <PlanBadge plan={client.agencyPlan} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-5">
          {/* B.A.S.E. Score */}
          <div>
            <p className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">
              B.A.S.E. Score
            </p>
            <div className="bg-background-secondary p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[42px] font-light ${ScoreColor(client.baseScore)}`}>
                  {client.baseScore.toFixed(1)}
                </span>
                <span className="text-[12px] text-foreground-muted">/ 100</span>
              </div>
              {/* Spectrum bar */}
              <div className="h-2 w-full bg-gradient-to-r from-destructive via-warning to-success relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-4 bg-white border-2 border-foreground"
                  style={{ left: `${client.baseScore}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <p className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">
              Category Breakdown
            </p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div key={cat.name} className="bg-background-secondary p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] text-foreground-secondary">{cat.name}</span>
                    <span className={`text-[13px] font-medium ${ScoreColor(cat.score)}`}>
                      {cat.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted overflow-hidden">
                    <div className={`h-full ${ScoreBarColor(cat.score)}`} style={{ width: `${cat.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background-secondary p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <FileText className="w-4 h-4 text-hq-purple" />
              </div>
              <p className="text-[18px] font-light text-foreground">{client.assessmentCount}</p>
              <p className="text-[10px] text-foreground-muted">Assessments</p>
            </div>
            <div className="bg-background-secondary p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <FolderOpen className="w-4 h-4 text-hq-purple" />
              </div>
              <p className="text-[18px] font-light text-foreground">{client.projectCount}</p>
              <p className="text-[10px] text-foreground-muted">Projects</p>
            </div>
            <div className="bg-background-secondary p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Building2 className="w-4 h-4 text-hq-purple" />
              </div>
              <p className="text-[12px] font-medium text-foreground truncate">{client.agencyName}</p>
              <p className="text-[10px] text-foreground-muted">Managing Agency</p>
            </div>
          </div>

          {/* Assessment History */}
          <div>
            <p className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">
              Assessment History
            </p>
            <div className="bg-background-secondary p-3 text-[12px] text-foreground-secondary">
              <p>Last assessment: <span className="text-foreground">{client.lastAssessmentDate}</span></p>
              <p className="mt-1">Total completed: <span className="text-foreground">{client.assessmentCount}</span></p>
            </div>
          </div>

          {/* Agency Contact */}
          <div>
            <p className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">
              Agency Contact
            </p>
            <div className="bg-background-secondary p-3 space-y-1">
              <p className="text-[13px] text-foreground">{client.agencyContactName}</p>
              <div className="flex items-center gap-2 text-[12px] text-foreground-secondary">
                <Mail className="w-3.5 h-3.5" />
                {client.agencyContactEmail}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border">
          <Button className="w-full bg-hq-purple hover:bg-hq-purple/90 text-white gap-2">
            <ExternalLink className="w-4 h-4" />
            View in Agency Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
