import { useState } from "react";
import { useParams } from "react-router-dom";
import { Users, Clock, BarChart3, Send, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigation } from "@/contexts/NavigationContext";
import { SparkChart } from "@/components/assessment/SparkChart";
import { PollFlow } from "@/components/poll/PollFlow";
import { assessmentQuestions } from "@/data/assessmentQuestions";
import type { PollSubmission, PollSummary } from "@/components/poll/PollTypes";

// Convert assessment questions to poll format
const pollQuestions = assessmentQuestions.map((q) => ({
  id: q.id,
  category: q.category,
  text: q.text,
  impactMessage: q.impactMessage,
}));

// Mock poll data for dashboard
const mockPollSummary: PollSummary = {
  pollType: "formula",
  totalResponses: 12,
  avgConfidenceRating: 6.8,
  avgResponseTime: 4200,
  questionMetrics: assessmentQuestions.slice(0, 5).map((q, idx) => ({
    questionId: q.id,
    yesPercentage: 60 + Math.random() * 30,
    avgResponseTime: 2500 + Math.random() * 3000,
    responseTimes: Array.from({ length: 12 }, () => 1500 + Math.random() * 5000),
  })),
  completionRate: 85,
};

const mockRespondents = [
  { email: "sarah@company.com", status: "completed" as const, completedAt: "2024-01-25T10:30:00Z" },
  { email: "mike@company.com", status: "completed" as const, completedAt: "2024-01-25T14:15:00Z" },
  { email: "jenny@company.com", status: "pending" as const },
  { email: "tom@company.com", status: "completed" as const, completedAt: "2024-01-26T09:00:00Z" },
];

export default function ClientFormula() {
  const { id } = useParams();
  const { currentClient } = useNavigation();
  const { toast } = useToast();
  const [view, setView] = useState<"dashboard" | "poll" | "invite">("dashboard");
  const [newEmail, setNewEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  const handleStartPoll = () => {
    setView("poll");
  };

  const handlePollComplete = (submission: PollSubmission) => {
    console.log("Poll submission:", submission);
    toast({
      title: "Response Recorded",
      description: "Your poll responses have been saved.",
    });
    setView("dashboard");
  };

  const handleAddEmail = () => {
    if (newEmail && newEmail.includes("@")) {
      setInvitedEmails((prev) => [...prev, newEmail]);
      setNewEmail("");
    }
  };

  const handleSendInvites = () => {
    toast({
      title: "Invites Sent",
      description: `${invitedEmails.length} team members have been invited via S.U.M.`,
    });
    setInvitedEmails([]);
    setView("dashboard");
  };

  if (view === "poll") {
    return (
      <div className="p-6">
        <PollFlow
          pollType="formula"
          questions={pollQuestions}
          clientName={currentClient?.name || "Client"}
          respondentType="employee"
          onComplete={handlePollComplete}
          onCancel={() => setView("dashboard")}
        />
      </div>
    );
  }

  if (view === "invite") {
    return (
      <div className="p-6 max-w-[600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-[24px] font-semibold text-foreground mb-2">Invite Team Members</h1>
          <p className="text-[14px] text-foreground-muted">
            Send poll invites through S.U.M. messaging. Team members will receive a mandatory poll request.
          </p>
        </div>

        {/* Email Input */}
        <div className="flex gap-3 mb-6">
          <Input
            type="email"
            placeholder="Enter email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
            className="flex-1"
          />
          <Button onClick={handleAddEmail} className="gap-2 bg-gold text-primary-foreground hover:bg-gold/90">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Added Emails */}
        {invitedEmails.length > 0 && (
          <div className="bg-card border border-border p-4 mb-6">
            <div className="text-[11px] font-bold tracking-[1px] text-foreground-secondary uppercase mb-3">
              Pending Invites ({invitedEmails.length})
            </div>
            <div className="space-y-2">
              {invitedEmails.map((email, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-[14px] text-foreground">{email}</span>
                  <button
                    onClick={() => setInvitedEmails((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-[12px] text-red hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setView("dashboard")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendInvites}
            disabled={invitedEmails.length === 0}
            className="gap-2 bg-gold text-primary-foreground hover:bg-gold/90"
          >
            <Send className="w-4 h-4" />
            Send via S.U.M.
          </Button>
        </div>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-dim border border-gold mb-3">
            <span className="text-[10px] font-bold tracking-[2px] text-gold uppercase">
              FORMULA
            </span>
          </div>
          <h1 className="text-[28px] font-semibold text-foreground mb-1">Team Brand Poll</h1>
          <p className="text-[14px] text-foreground-muted">
            Measure brand alignment across your organization
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setView("invite")} className="gap-2">
            <Users className="w-4 h-4" />
            Invite Team
          </Button>
          <Button onClick={handleStartPoll} className="gap-2 bg-gold text-primary-foreground hover:bg-gold/90">
            Take Poll
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-5">
          <div className="flex items-center gap-2 text-foreground-muted mb-2">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[1px] uppercase">Responses</span>
          </div>
          <div className="text-[32px] font-bold text-gold">{mockPollSummary.totalResponses}</div>
          <div className="text-[12px] text-foreground-muted">{mockPollSummary.completionRate}% completion</div>
        </div>
        <div className="bg-card border border-border p-5">
          <div className="flex items-center gap-2 text-foreground-muted mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[1px] uppercase">Avg Confidence</span>
          </div>
          <div className="text-[32px] font-bold text-foreground">{mockPollSummary.avgConfidenceRating.toFixed(1)}</div>
          <div className="text-[12px] text-foreground-muted">out of 10</div>
        </div>
        <div className="bg-card border border-border p-5">
          <div className="flex items-center gap-2 text-foreground-muted mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[1px] uppercase">Avg Response Time</span>
          </div>
          <div className="text-[32px] font-bold text-foreground">{(mockPollSummary.avgResponseTime / 1000).toFixed(1)}s</div>
          <div className="text-[12px] text-foreground-muted">per question</div>
        </div>
        <div className="bg-card border border-border p-5">
          <div className="flex items-center gap-2 text-foreground-muted mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[1px] uppercase">Alignment Score</span>
          </div>
          <div className="text-[32px] font-bold text-success">78%</div>
          <div className="text-[12px] text-foreground-muted">team consensus</div>
        </div>
      </div>

      {/* Question Metrics with Spark Charts */}
      <div className="bg-card border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[16px] font-semibold text-foreground mb-1">Response Timing Analysis</h2>
            <p className="text-[12px] text-foreground-muted">
              Spark charts show response time patterns—longer times indicate uncertainty
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {mockPollSummary.questionMetrics.map((metric, idx) => {
            const question = assessmentQuestions.find((q) => q.id === metric.questionId);
            return (
              <div key={metric.questionId} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                <div className="w-8 text-[14px] font-medium text-gold">
                  Q{metric.questionId}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-foreground truncate">
                    {question?.text}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <SparkChart
                    data={metric.responseTimes}
                    width={120}
                    height={32}
                    threshold={3000}
                  />
                  <div className="text-right min-w-[80px]">
                    <div className="text-[14px] font-semibold text-foreground">
                      {Math.round(metric.yesPercentage)}% Yes
                    </div>
                    <div className="text-[11px] text-foreground-muted">
                      {(metric.avgResponseTime / 1000).toFixed(1)}s avg
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Respondents */}
      <div className="bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[16px] font-semibold text-foreground mb-1">Team Respondents</h2>
            <p className="text-[12px] text-foreground-muted">
              Track poll completion across your team
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setView("invite")}>
            + Add More
          </Button>
        </div>

        <div className="divide-y divide-border">
          {mockRespondents.map((respondent, idx) => (
            <div key={idx} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted flex items-center justify-center">
                  <span className="text-[12px] font-medium text-foreground">
                    {respondent.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-[14px] text-foreground">{respondent.email}</span>
              </div>
              <div className="flex items-center gap-2">
                {respondent.status === "completed" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-[12px] text-success">Completed</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-[12px] text-warning">Pending</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
