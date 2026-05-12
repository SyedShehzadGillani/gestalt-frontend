import { X, Mail, Phone, CreditCard, Calendar, Users, FileText, FolderOpen } from "lucide-react";
import { Agency } from "@/data/hqAgenciesData";
import { PlanBadge } from "@/components/hq/PlanBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AgencyDetailPanelProps {
  agency: Agency;
  onClose: () => void;
}

const activityData = [
  { day: "Mon", hours: 6 },
  { day: "Tue", hours: 8 },
  { day: "Wed", hours: 7 },
  { day: "Thu", hours: 9 },
  { day: "Fri", hours: 5 },
  { day: "Sat", hours: 2 },
  { day: "Sun", hours: 1 },
];

const paymentHistory = [
  { date: "Jan 15, 2026", amount: "$97.00", status: "Paid" },
  { date: "Dec 15, 2025", amount: "$97.00", status: "Paid" },
  { date: "Nov 15, 2025", amount: "$97.00", status: "Paid" },
  { date: "Oct 15, 2025", amount: "$97.00", status: "Paid" },
  { date: "Sep 15, 2025", amount: "$97.00", status: "Paid" },
];

const recentActions = [
  { action: "Completed BASE assessment for Client A", time: "2 hours ago" },
  { action: "Created new project milestone", time: "5 hours ago" },
  { action: "Invited team member", time: "1 day ago" },
  { action: "Exported client report", time: "2 days ago" },
  { action: "Updated brand guidelines", time: "3 days ago" },
];

const ticketHistory = [
  { subject: "Question about API access", status: "Resolved", date: "Jan 10, 2026" },
  { subject: "Billing inquiry", status: "Resolved", date: "Dec 28, 2025" },
];


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

export function AgencyDetailPanel({ agency, onClose }: AgencyDetailPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-card border-l border-border z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center gap-4">
        <div className="w-12 h-12 bg-hq-purple-dim border border-hq-purple/30 flex items-center justify-center">
          <span className="text-[18px] font-bold text-hq-purple">{agency.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-semibold text-foreground">{agency.name}</h2>
            <StatusBadge status={agency.status} />
          </div>
          <p className="text-[12px] text-foreground-muted">{agency.website}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-foreground-secondary" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start border-b border-border bg-transparent px-5 py-0 h-auto">
          {["Overview", "Billing", "Activity", "Support"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="py-3 px-4 text-[12px] data-[state=active]:border-b-2 data-[state=active]:border-hq-purple data-[state=active]:text-foreground rounded-none bg-transparent"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {/* Overview Tab */}
          <TabsContent value="overview" className="p-5 space-y-6 m-0">
            {/* Owner Info */}
            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Owner</h3>
              <div className="bg-background-secondary p-4 space-y-2">
                <p className="text-[13px] text-foreground">{agency.ownerName}</p>
                <div className="flex items-center gap-2 text-[12px] text-foreground-secondary">
                  <Mail className="w-3.5 h-3.5" />
                  {agency.ownerEmail}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-foreground-secondary">
                  <Phone className="w-3.5 h-3.5" />
                  {agency.ownerPhone}
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Plan Details</h3>
              <div className="bg-background-secondary p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[12px] text-foreground-secondary">Current Plan</span>
                  <PlanBadge plan={agency.plan} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-foreground-secondary">Billing Cycle</span>
                  <span className="text-[12px] text-foreground">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-foreground-secondary">Price</span>
                  <span className="text-[12px] text-foreground">${agency.monthlyRevenue}/mo</span>
                </div>
                {agency.couponApplied && (
                  <div className="flex justify-between">
                    <span className="text-[12px] text-foreground-secondary">Coupon</span>
                    <span className="text-[12px] text-success font-mono">{agency.couponApplied}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background-secondary p-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-hq-purple" />
                  <div>
                    <p className="text-[18px] font-light text-foreground">{agency.clients}</p>
                    <p className="text-[10px] text-foreground-muted">Clients</p>
                  </div>
                </div>
                <div className="bg-background-secondary p-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-hq-purple" />
                  <div>
                    <p className="text-[18px] font-light text-foreground">{agency.assessmentsRun}</p>
                    <p className="text-[10px] text-foreground-muted">Assessments</p>
                  </div>
                </div>
                <div className="bg-background-secondary p-4 flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-hq-purple" />
                  <div>
                    <p className="text-[18px] font-light text-foreground">{agency.projectsActive}</p>
                    <p className="text-[10px] text-foreground-muted">Active Projects</p>
                  </div>
                </div>
                <div className="bg-background-secondary p-4 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-hq-purple" />
                  <div>
                    <p className="text-[18px] font-light text-foreground">{agency.joined}</p>
                    <p className="text-[10px] text-foreground-muted">Joined</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="p-5 space-y-6 m-0">
            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Subscription</h3>
              <div className="bg-background-secondary p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-foreground-secondary">Plan</span>
                  <PlanBadge plan={agency.plan} />
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-foreground-secondary">Monthly</span>
                  <span className="text-[13px] text-foreground font-medium">${agency.monthlyRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[12px] text-foreground-secondary">Lifetime Revenue</span>
                  <span className="text-[13px] text-foreground font-medium">${agency.lifetimeRevenue}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="bg-hq-purple hover:bg-hq-purple/90 text-white">Change Plan</Button>
              <Button size="sm" variant="secondary">Apply Coupon</Button>
              <Button size="sm" variant="outline">Issue Refund</Button>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Payment History</h3>
              <div className="space-y-2">
                {paymentHistory.map((payment, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-[12px] text-foreground">{payment.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] text-foreground font-medium">{payment.amount}</span>
                      <span className="text-[10px] text-success bg-success/10 px-2 py-0.5">{payment.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="p-5 space-y-6 m-0">
            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Time Spent (Last 7 Days)</h3>
              <div className="h-40 bg-background-secondary p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="day" stroke="hsl(var(--foreground-muted))" fontSize={10} tickLine={false} />
                    <YAxis stroke="hsl(var(--foreground-muted))" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 0,
                        fontSize: 11,
                      }}
                      formatter={(value: number) => [`${value}h`, "Time"]}
                    />
                    <Bar dataKey="hours" fill="hsl(var(--hq-purple))" radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Recent Actions</h3>
              <div className="space-y-2">
                {recentActions.map((action, idx) => (
                  <div key={idx} className="py-2 border-b border-border last:border-0">
                    <p className="text-[12px] text-foreground">{action.action}</p>
                    <p className="text-[10px] text-foreground-muted">{action.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Most Used Features</h3>
              <div className="space-y-2">
                {["BASE Assessment", "Project Management", "AI Chat", "Client Reports"].map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-[12px] text-foreground">{feature}</span>
                    <div className="w-24 h-2 bg-background-secondary overflow-hidden">
                      <div
                        className="h-full bg-hq-purple"
                        style={{ width: `${100 - idx * 20}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="p-5 space-y-6 m-0">
            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Open Tickets</h3>
              <div className="bg-background-secondary p-4 text-center">
                <p className="text-[12px] text-foreground-muted">No open tickets</p>
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">Ticket History</h3>
              <div className="space-y-2">
                {ticketHistory.map((ticket, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-[12px] text-foreground">{ticket.subject}</p>
                      <p className="text-[10px] text-foreground-muted">{ticket.date}</p>
                    </div>
                    <span className="text-[10px] text-success bg-success/10 px-2 py-0.5">{ticket.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-hq-purple uppercase tracking-wide mb-3">HQ Notes</h3>
              <div className="bg-background-secondary p-4">
                <p className="text-[12px] text-foreground-muted italic">No internal notes yet.</p>
              </div>
            </div>

            <Button className="w-full bg-hq-purple hover:bg-hq-purple/90 text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
