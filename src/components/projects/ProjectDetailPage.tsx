import { useState } from "react";
import { ArrowLeft, Check, Clock, FileText, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectDetailPageProps {
  projectId: string;
  isAgencyView: boolean;
  onBack: () => void;
}

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: "completed" | "approved" | "awaiting-signoff" | "pending";
  signedOffBy?: string;
  daysAgo?: number;
}

const mockMilestones: Milestone[] = [
  { id: "1", name: "Discovery & Research", dueDate: "Jan 5, 2026", status: "completed" },
  { id: "2", name: "Strategy Document", dueDate: "Jan 12, 2026", status: "approved", signedOffBy: "Sarah Chen" },
  { id: "3", name: "Design Concepts", dueDate: "Jan 25, 2026", status: "awaiting-signoff", daysAgo: 3 },
  { id: "4", name: "Development", dueDate: "Feb 5, 2026", status: "pending" },
  { id: "5", name: "Launch", dueDate: "Feb 15, 2026", status: "pending" },
];

const teamMembers = [
  { name: "Sarah Chen", role: "Project Lead", initials: "SC" },
  { name: "Mike Johnson", role: "Designer", initials: "MJ" },
  { name: "Alex Rivera", role: "Developer", initials: "AR" },
];

const recentActivity = [
  { action: "Design mockups uploaded", user: "Mike Johnson", time: "2 hours ago" },
  { action: "Strategy approved", user: "Sarah Chen", time: "3 days ago" },
  { action: "Research document added", user: "Alex Rivera", time: "1 week ago" },
];

const documents = [
  { name: "Brand_Strategy_v2.pdf", size: "2.4 MB" },
  { name: "Design_Concepts.fig", size: "18 MB" },
  { name: "Research_Summary.docx", size: "842 KB" },
];

export function ProjectDetailPage({ projectId, isAgencyView, onBack }: ProjectDetailPageProps) {
  const [status, setStatus] = useState("active");

  return (
    <div className="animate-fade-in">
      {/* Back Link */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[13px] text-foreground-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground mb-1">
            Website Rebrand
          </h1>
          <div className="text-[13px] text-foreground-secondary">
            Meridian Tech
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px] bg-muted border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              <SelectItem value="active" className="text-foreground">Active</SelectItem>
              <SelectItem value="paused" className="text-foreground">Paused</SelectItem>
              <SelectItem value="completed" className="text-foreground">Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2" data-tour="project-progress">
            <div className="w-[100px] h-2 bg-muted">
              <div className="h-full bg-gold" style={{ width: "65%" }} />
            </div>
            <span className="text-[14px] font-medium text-gold">65%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
        {/* Left - Milestone Timeline */}
        <div data-tour="milestone-timeline">
          <h2 className="text-[16px] font-semibold text-foreground mb-6">
            Milestone Timeline
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-border" />

            {/* Milestones */}
            <div className="space-y-4">
              {mockMilestones.map((milestone, index) => {
                const isComplete = milestone.status === "completed" || milestone.status === "approved";
                const isAwaitingSignoff = milestone.status === "awaiting-signoff";
                const isPending = milestone.status === "pending";

                return (
                  <div key={milestone.id} className="relative flex gap-4">
                    {/* Circle Indicator */}
                    <div
                      className={`relative z-10 flex-shrink-0 flex items-center justify-center ${
                        isAwaitingSignoff
                          ? "w-7 h-7 bg-gold"
                          : isComplete
                          ? "w-6 h-6 bg-gold"
                          : "w-6 h-6 bg-muted border-2 border-border"
                      }`}
                    >
                      {isComplete && <Check className="w-3 h-3 text-primary-foreground" />}
                      {isAwaitingSignoff && <Clock className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>

                    {/* Card Content */}
                    <div
                      className={`flex-1 p-4 ${
                        isAwaitingSignoff
                          ? "border-2 border-dashed border-gold bg-gold-dim"
                          : "bg-card border border-border"
                      }`}
                      data-tour={isAwaitingSignoff ? "signoff-milestone" : undefined}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-[16px] font-medium text-foreground">
                            {milestone.name}
                          </div>
                          <div className="text-[12px] text-foreground-secondary mt-0.5">
                            {milestone.dueDate}
                          </div>
                        </div>
                        {isComplete && (
                          <span className="text-[9px] font-bold tracking-[0.5px] px-2 py-1 bg-success-dim text-success">
                            {milestone.status === "approved" ? "Approved" : "Completed"}
                          </span>
                        )}
                        {isPending && (
                          <span className="text-[9px] font-bold tracking-[0.5px] px-2 py-1 bg-muted text-foreground-muted">
                            Pending
                          </span>
                        )}
                      </div>

                      {milestone.signedOffBy && (
                        <div className="text-[11px] text-success mt-2">
                          ✓ Signed off by {milestone.signedOffBy}
                        </div>
                      )}

                      {/* Sign-off UI */}
                      {isAwaitingSignoff && (
                        <div className="mt-4 pt-4 border-t border-gold/30">
                          <div className="flex items-center gap-2 text-[12px] text-warning mb-2">
                            <span className="animate-pulse">⏳</span>
                            Awaiting Client Approval
                          </div>
                          <p className="text-[12px] text-foreground-muted mb-4">
                            This milestone has been submitted for review {milestone.daysAgo} days ago
                          </p>
                          {isAgencyView ? (
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary">
                                Remind Client
                              </Button>
                              <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90">
                                Mark Complete
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                                <Check className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="secondary">
                                Request Changes
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Team Members */}
          <div className="bg-card border border-border p-5">
            <h3 className="text-[14px] font-semibold text-foreground mb-4">Team</h3>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold-dim flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-gold">
                      {member.initials}
                    </span>
                  </div>
                  <div>
                    <div className="text-[13px] text-foreground">{member.name}</div>
                    <div className="text-[11px] text-foreground-secondary">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border p-5">
            <h3 className="text-[14px] font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 bg-muted flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3 h-3 text-foreground-muted" />
                  </div>
                  <div>
                    <div className="text-[12px] text-foreground">{activity.action}</div>
                    <div className="text-[11px] text-foreground-secondary">
                      {activity.user} · {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-card border border-border p-5">
            <h3 className="text-[14px] font-semibold text-foreground mb-4">Documents</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center gap-3 p-2 hover:bg-muted cursor-pointer transition-colors"
                >
                  <FileText className="w-4 h-4 text-foreground-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-foreground truncate">{doc.name}</div>
                    <div className="text-[10px] text-foreground-secondary">{doc.size}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-3">
              Upload Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
