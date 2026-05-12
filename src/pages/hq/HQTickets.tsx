import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Send,
  Lock,
  ArrowLeft,
  Building2,
  User,
  Calendar,
  Clock,
  Tag,
  ExternalLink,
  Gift,
  ChevronDown,
  Circle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type Priority = "critical" | "high" | "medium" | "low";
type Status = "open" | "pending" | "in_progress" | "resolved" | "closed";

interface Message {
  id: string;
  sender: string;
  senderType: "customer" | "support";
  content: string;
  timestamp: string;
  isInternal?: boolean;
}

interface Ticket {
  id: string;
  subject: string;
  priority: Priority;
  status: Status;
  fromName: string;
  fromEmail: string;
  agency: string;
  agencyPlan: "free" | "pro" | "enterprise";
  createdAt: string;
  assignee: string | null;
  tags: string[];
  messages: Message[];
  relatedTickets?: string[];
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Can't access my account",
    priority: "critical",
    status: "open",
    fromName: "Sarah Chen",
    fromEmail: "sarah@brandarch.io",
    agency: "Brand Architects",
    agencyPlan: "enterprise",
    createdAt: "2h ago",
    assignee: null,
    tags: ["account", "urgent", "login"],
    messages: [
      { id: "m1", sender: "Sarah Chen", senderType: "customer", content: "I've been trying to log in for the past hour but keep getting an 'Invalid credentials' error. I've tried resetting my password twice but the reset email never arrives. This is urgent - we have a client presentation in 3 hours!", timestamp: "2h ago" },
    ],
    relatedTickets: ["TKT-089"],
  },
  {
    id: "TKT-002",
    subject: "Assessment not saving",
    priority: "high",
    status: "in_progress",
    fromName: "Mike Johnson",
    fromEmail: "mike@pixelperfect.io",
    agency: "Pixel Perfect",
    agencyPlan: "pro",
    createdAt: "5h ago",
    assignee: "Emily R.",
    tags: ["bug", "assessment"],
    messages: [
      { id: "m1", sender: "Mike Johnson", senderType: "customer", content: "When I complete a B.A.S.E. assessment and click save, the loading spinner appears but then nothing happens. I've lost 2 complete assessments already.", timestamp: "5h ago" },
      { id: "m2", sender: "Emily R.", senderType: "support", content: "Hi Mike, I'm sorry to hear about this issue. I'm looking into it now. Can you tell me which browser you're using and if you see any error messages in the console?", timestamp: "4h ago" },
      { id: "m3", sender: "Mike Johnson", senderType: "customer", content: "I'm using Chrome 120. I checked the console and there's a '403 Forbidden' error appearing.", timestamp: "3h ago" },
      { id: "m4", sender: "Emily R.", senderType: "support", content: "Thanks for that detail. This looks like a session timeout issue. I've escalated to engineering and we're working on a fix.", timestamp: "2h ago", isInternal: false },
    ],
  },
  {
    id: "TKT-003",
    subject: "How do I add team members?",
    priority: "medium",
    status: "pending",
    fromName: "Amy Lee",
    fromEmail: "amy@startupstudio.io",
    agency: "StartUp Studio",
    agencyPlan: "pro",
    createdAt: "1d ago",
    assignee: "Marcus W.",
    tags: ["how-to", "team"],
    messages: [
      { id: "m1", sender: "Amy Lee", senderType: "customer", content: "I just upgraded to Pro and want to add my colleagues. Where can I find the team management settings?", timestamp: "1d ago" },
      { id: "m2", sender: "Marcus W.", senderType: "support", content: "Hi Amy! Great question. You can add team members by going to Settings > Team Management > Invite Members. Would you like me to send you a quick video walkthrough?", timestamp: "23h ago" },
    ],
  },
  {
    id: "TKT-004",
    subject: "Request: Export to PDF",
    priority: "medium",
    status: "open",
    fromName: "David Kim",
    fromEmail: "david@growthlabs.io",
    agency: "Growth Labs",
    agencyPlan: "enterprise",
    createdAt: "1d ago",
    assignee: null,
    tags: ["feature-request", "export"],
    messages: [
      { id: "m1", sender: "David Kim", senderType: "customer", content: "Is there a way to export client reports to PDF? Our clients prefer receiving formatted documents rather than links to the dashboard.", timestamp: "1d ago" },
    ],
  },
  {
    id: "TKT-005",
    subject: "Dashboard suggestion",
    priority: "low",
    status: "open",
    fromName: "Lisa Park",
    fromEmail: "lisa@elevate.io",
    agency: "Elevate Agency",
    agencyPlan: "pro",
    createdAt: "2d ago",
    assignee: null,
    tags: ["feedback", "ui"],
    messages: [
      { id: "m1", sender: "Lisa Park", senderType: "customer", content: "Love the platform! One suggestion: it would be helpful to have a dark mode toggle. Sometimes I work late and the bright screen is hard on the eyes.", timestamp: "2d ago" },
    ],
  },
  {
    id: "TKT-006",
    subject: "Billing discrepancy",
    priority: "high",
    status: "resolved",
    fromName: "James Wilson",
    fromEmail: "james@summit.io",
    agency: "Summit Strategy",
    agencyPlan: "pro",
    createdAt: "3d ago",
    assignee: "Sarah M.",
    tags: ["billing", "urgent"],
    messages: [
      { id: "m1", sender: "James Wilson", senderType: "customer", content: "I was charged $194 this month instead of the usual $97. Can you explain the extra charge?", timestamp: "3d ago" },
      { id: "m2", sender: "Sarah M.", senderType: "support", content: "Hi James, I've reviewed your account. The additional charge was for the API add-on that was activated on the 15th. Would you like me to remove it?", timestamp: "3d ago" },
      { id: "m3", sender: "James Wilson", senderType: "customer", content: "Ah yes, I forgot I added that. All good, thanks for clarifying!", timestamp: "2d ago" },
    ],
  },
  {
    id: "TKT-007",
    subject: "White-label customization help",
    priority: "medium",
    status: "in_progress",
    fromName: "Anna Foster",
    fromEmail: "anna@visionary.io",
    agency: "Visionary Group",
    agencyPlan: "enterprise",
    createdAt: "3d ago",
    assignee: "Emily R.",
    tags: ["white-label", "customization"],
    messages: [
      { id: "m1", sender: "Anna Foster", senderType: "customer", content: "We're trying to set up white-label but the logo upload keeps failing. File is 500x500 PNG, 45KB.", timestamp: "3d ago" },
    ],
  },
  {
    id: "TKT-008",
    subject: "API rate limit questions",
    priority: "low",
    status: "closed",
    fromName: "Tom Brown",
    fromEmail: "tom@nova.io",
    agency: "Nova Agency",
    agencyPlan: "enterprise",
    createdAt: "5d ago",
    assignee: "Marcus W.",
    tags: ["api", "technical"],
    messages: [
      { id: "m1", sender: "Tom Brown", senderType: "customer", content: "What are the API rate limits for Enterprise plan?", timestamp: "5d ago" },
      { id: "m2", sender: "Marcus W.", senderType: "support", content: "Enterprise plans have a rate limit of 5,000 requests per minute. Let me know if you need this increased.", timestamp: "5d ago" },
      { id: "m3", sender: "Tom Brown", senderType: "customer", content: "Perfect, that's more than enough. Thanks!", timestamp: "5d ago" },
    ],
  },
  {
    id: "TKT-009",
    subject: "Client data not syncing",
    priority: "high",
    status: "pending",
    fromName: "Rachel Green",
    fromEmail: "rachel@spark.io",
    agency: "Spark Digital",
    agencyPlan: "pro",
    createdAt: "1d ago",
    assignee: "Sarah M.",
    tags: ["bug", "sync"],
    messages: [
      { id: "m1", sender: "Rachel Green", senderType: "customer", content: "Updates I make to client profiles aren't appearing on the dashboard. There's about a 2-hour delay.", timestamp: "1d ago" },
    ],
  },
  {
    id: "TKT-010",
    subject: "Upgrade to Enterprise",
    priority: "low",
    status: "open",
    fromName: "Kevin Hart",
    fromEmail: "kevin@catalyst.io",
    agency: "Catalyst Creative",
    agencyPlan: "pro",
    createdAt: "4d ago",
    assignee: null,
    tags: ["upgrade", "sales"],
    messages: [
      { id: "m1", sender: "Kevin Hart", senderType: "customer", content: "We're considering upgrading to Enterprise. Can you tell me more about the white-label features and API capabilities?", timestamp: "4d ago" },
    ],
  },
];

const cannedResponses = [
  { id: "1", title: "Acknowledge receipt", content: "Thank you for reaching out! I've received your ticket and will look into this right away. I'll get back to you within 24 hours." },
  { id: "2", title: "Request more info", content: "Thank you for the details. To help me investigate further, could you please provide:\n\n1. The exact steps to reproduce the issue\n2. Your browser and version\n3. Any error messages you're seeing\n\nThis will help me resolve your issue faster." },
  { id: "3", title: "Issue resolved", content: "Great news! I've resolved the issue you reported. Please try again and let me know if you experience any further problems. Don't hesitate to reach out if you need anything else!" },
  { id: "4", title: "Escalate to engineering", content: "I've escalated this to our engineering team for further investigation. They'll be looking into it as a priority. I'll keep you updated on the progress." },
  { id: "5", title: "Feature request noted", content: "Thank you for this suggestion! I've logged it as a feature request and shared it with our product team. We regularly review feedback to improve the platform." },
];

const priorityConfig: Record<Priority, { icon: string; color: string; label: string }> = {
  critical: { icon: "🔴", color: "hsl(var(--status-red))", label: "Critical" },
  high: { icon: "🟠", color: "hsl(var(--status-orange))", label: "High" },
  medium: { icon: "🟡", color: "hsl(var(--status-yellow))", label: "Medium" },
  low: { icon: "⚪", color: "hsl(var(--muted-foreground))", label: "Low" },
};

const statusConfig: Record<Status, { color: string; bgColor: string; label: string }> = {
  open: { color: "hsl(var(--status-red))", bgColor: "bg-[hsl(var(--status-red))]/20 text-[hsl(var(--status-red))] border-[hsl(var(--status-red))]/30", label: "Open" },
  pending: { color: "hsl(var(--status-yellow))", bgColor: "bg-[hsl(var(--status-yellow))]/20 text-[hsl(var(--status-yellow))] border-[hsl(var(--status-yellow))]/30", label: "Pending" },
  in_progress: { color: "hsl(var(--status-blue))", bgColor: "bg-[hsl(var(--status-blue))]/20 text-[hsl(var(--status-blue))] border-[hsl(var(--status-blue))]/30", label: "In Progress" },
  resolved: { color: "hsl(var(--status-green))", bgColor: "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))] border-[hsl(var(--status-green))]/30", label: "Resolved" },
  closed: { color: "hsl(var(--muted-foreground))", bgColor: "bg-muted text-muted-foreground border-border", label: "Closed" },
};

export default function HQTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.agency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    open: tickets.filter((t) => t.status === "open").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    resolvedThisWeek: tickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
  };

  const handleSendReply = (isInternal: boolean) => {
    if (!selectedTicket || !replyContent.trim()) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      sender: "You",
      senderType: "support",
      content: replyContent,
      timestamp: "Just now",
      isInternal,
    };

    setTickets(tickets.map((t) =>
      t.id === selectedTicket.id
        ? { ...t, messages: [...t.messages, newMessage] }
        : t
    ));

    setSelectedTicket((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMessage] } : null
    );

    setReplyContent("");
    toast({
      title: isInternal ? "Internal note added" : "Reply sent",
      description: isInternal ? "Your note has been saved" : "Your reply has been sent to the customer",
    });
  };

  const handleStatusChange = (ticketId: string, newStatus: Status) => {
    setTickets(tickets.map((t) =>
      t.id === ticketId ? { ...t, status: newStatus } : t
    ));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => prev ? { ...prev, status: newStatus } : null);
    }
    toast({ title: "Status updated", description: `Ticket marked as ${statusConfig[newStatus].label}` });
  };

  const handleCannedResponse = (content: string) => {
    setReplyContent(content);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Support Tickets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-[hsl(var(--status-red))]">{stats.open} Open</span>
            <span className="mx-2">•</span>
            <span className="text-[hsl(var(--status-yellow))]">{stats.pending} Pending</span>
            <span className="mx-2">•</span>
            <span className="text-[hsl(var(--status-green))]">{stats.resolvedThisWeek} Resolved this week</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px] bg-card border-border rounded-none"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-card border-border rounded-none">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-none">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px] bg-card border-border rounded-none">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-none">
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="critical">🔴 Critical</SelectItem>
              <SelectItem value="high">🟠 High</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="low">⚪ Low</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-hq-purple hover:bg-hq-purple/90 rounded-none">
            <Plus className="w-4 h-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {selectedTicket ? (
        /* Ticket Detail View */
        <div className="grid grid-cols-3 gap-6">
          {/* Left - Conversation */}
          <div className="col-span-2 bg-card border border-border">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3 mb-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSelectedTicket(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{priorityConfig[selectedTicket.priority].icon}</span>
                    <h2 className="text-lg font-semibold text-foreground">{selectedTicket.subject}</h2>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`rounded-none text-[10px] ${statusConfig[selectedTicket.status].bgColor}`}>
                      {statusConfig[selectedTicket.status].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{selectedTicket.id}</span>
                  </div>
                </div>
                <Select
                  value={selectedTicket.status}
                  onValueChange={(v) => handleStatusChange(selectedTicket.id, v as Status)}
                >
                  <SelectTrigger className="w-[140px] bg-background border-border rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-none">
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4">
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border ${
                      message.isInternal
                        ? "bg-[hsl(var(--status-yellow))]/5 border-[hsl(var(--status-yellow))]/30"
                        : message.senderType === "support"
                        ? "bg-hq-purple-dim border-hq-purple/30"
                        : "bg-background border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 flex items-center justify-center text-xs font-medium ${
                          message.senderType === "support" ? "bg-hq-purple text-white" : "bg-muted text-foreground"
                        }`}>
                          {message.sender.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">{message.sender}</span>
                          {message.isInternal && (
                            <Badge variant="outline" className="ml-2 rounded-none text-[9px] bg-[hsl(var(--status-yellow))]/20 text-[hsl(var(--status-yellow))] border-[hsl(var(--status-yellow))]/30">
                              <Lock className="w-2.5 h-2.5 mr-1" />
                              Internal
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Reply Box */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs text-muted-foreground">Reply</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      Canned Responses
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border rounded-none w-64">
                    {cannedResponses.map((response) => (
                      <DropdownMenuItem
                        key={response.id}
                        onClick={() => handleCannedResponse(response.content)}
                        className="cursor-pointer"
                      >
                        {response.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Textarea
                placeholder="Type your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="bg-background border-border rounded-none min-h-[100px] mb-3"
              />
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <Paperclip className="w-4 h-4" />
                  Attach
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSendReply(true)}
                    disabled={!replyContent.trim()}
                    className="rounded-none gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Internal Note
                  </Button>
                  <Button
                    onClick={() => handleSendReply(false)}
                    disabled={!replyContent.trim()}
                    className="rounded-none gap-2 bg-hq-purple hover:bg-hq-purple/90"
                  >
                    <Send className="w-4 h-4" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="space-y-4">
            {/* Ticket Info */}
            <div className="bg-card border border-border p-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Ticket Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Ticket ID</span>
                  <span className="text-sm font-mono text-foreground">{selectedTicket.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <span className="text-sm text-foreground">{selectedTicket.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Priority</span>
                  <span className="text-sm text-foreground">
                    {priorityConfig[selectedTicket.priority].icon} {priorityConfig[selectedTicket.priority].label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Assignee</span>
                  <span className="text-sm text-foreground">{selectedTicket.assignee || "Unassigned"}</span>
                </div>
              </div>
            </div>

            {/* Agency Info */}
            <div className="bg-card border border-border p-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Agency</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{selectedTicket.agency}</span>
                </div>
                <Badge
                  variant="outline"
                  className={`rounded-none text-[10px] capitalize ${
                    selectedTicket.agencyPlan === "enterprise"
                      ? "bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] border-[hsl(var(--primary))]/30"
                      : selectedTicket.agencyPlan === "pro"
                      ? "bg-hq-purple-dim text-hq-purple border-hq-purple/30"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {selectedTicket.agencyPlan} Plan
                </Badge>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-card border border-border p-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">User</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{selectedTicket.fromName}</span>
                </div>
                <span className="text-xs text-muted-foreground">{selectedTicket.fromEmail}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border p-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-none gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Agency
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-none gap-2">
                  <Gift className="w-4 h-4" />
                  Apply Coupon
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-card border border-border p-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTicket.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-none text-[10px]">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Related Tickets */}
            {selectedTicket.relatedTickets && selectedTicket.relatedTickets.length > 0 && (
              <div className="bg-card border border-border p-4">
                <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Related Tickets</h3>
                <div className="space-y-2">
                  {selectedTicket.relatedTickets.map((ticketId) => (
                    <Button key={ticketId} variant="ghost" className="w-full justify-start text-sm text-hq-purple hover:text-hq-purple">
                      {ticketId}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tickets Table */
        <div className="bg-card border border-border">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide w-[80px]">Priority</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Subject</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">From</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Agency</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Status</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Created</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Assignee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <TableCell>
                    <span className="text-lg">{priorityConfig[ticket.priority].icon}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{ticket.subject}</span>
                      {ticket.messages.length > 1 && (
                        <Badge variant="outline" className="rounded-none text-[9px]">
                          {ticket.messages.length}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">{ticket.fromName}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{ticket.agency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-none text-[10px] ${statusConfig[ticket.status].bgColor}`}>
                      {statusConfig[ticket.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{ticket.createdAt}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{ticket.assignee || "—"}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Ticket Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card border-border max-w-lg rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Create Support Ticket</DialogTitle>
            <DialogDescription>Create a ticket on behalf of a customer</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs">Subject</Label>
              <Input placeholder="Ticket subject..." className="bg-background border-border rounded-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Priority</Label>
                <Select defaultValue="medium">
                  <SelectTrigger className="bg-background border-border rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-none">
                    <SelectItem value="critical">🔴 Critical</SelectItem>
                    <SelectItem value="high">🟠 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">⚪ Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Agency</Label>
                <Select>
                  <SelectTrigger className="bg-background border-border rounded-none">
                    <SelectValue placeholder="Select agency..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-none">
                    <SelectItem value="brand">Brand Architects</SelectItem>
                    <SelectItem value="pixel">Pixel Perfect</SelectItem>
                    <SelectItem value="growth">Growth Labs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Description</Label>
              <Textarea placeholder="Describe the issue..." className="bg-background border-border rounded-none min-h-[120px]" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsCreateOpen(false);
                toast({ title: "Ticket created" });
              }}
              className="rounded-none bg-hq-purple hover:bg-hq-purple/90"
            >
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
