import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  ChevronUp,
  MessageSquare,
  User,
  Bell,
  Send,
  Lightbulb,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  LayoutGrid,
  List,
} from "lucide-react";

type FeatureStatus = "new" | "under_review" | "planned" | "in_progress" | "completed" | "declined";

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  votes: number;
  comments: Comment[];
  internalNotes: string[];
  requestedBy: string;
  agency: string;
  tags: string[];
  status: FeatureStatus;
  createdAt: string;
  voters: string[];
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
}

const statusConfig: Record<FeatureStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: "New", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  under_review: { label: "Under Review", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  planned: { label: "Planned", color: "text-purple-500", bgColor: "bg-purple-500/10" },
  in_progress: { label: "In Progress", color: "text-orange-500", bgColor: "bg-orange-500/10" },
  completed: { label: "Completed", color: "text-green-500", bgColor: "bg-green-500/10" },
  declined: { label: "Declined", color: "text-gray-500", bgColor: "bg-gray-500/10" },
};

const mockFeatures: FeatureRequest[] = [
  {
    id: "1",
    title: "Slack integration",
    description: "Allow agencies to receive notifications and updates directly in their Slack workspace. This would include new client alerts, assessment completions, and team mentions.",
    votes: 47,
    comments: [
      { id: "c1", author: "Sarah Chen", content: "This would be huge for our team workflow!", timestamp: "2 days ago", isInternal: false },
      { id: "c2", author: "Mike Johnson", content: "We'd use this daily", timestamp: "1 day ago", isInternal: false },
    ],
    internalNotes: ["Evaluate Slack API costs", "Consider webhooks first"],
    requestedBy: "Sarah Chen",
    agency: "Brand Architects",
    tags: ["Integration", "Communication"],
    status: "under_review",
    createdAt: "Jan 15, 2026",
    voters: ["Sarah Chen", "Mike Johnson", "David Kim", "Lisa Park", "Tom Wilson"],
  },
  {
    id: "2",
    title: "Export to PDF",
    description: "Generate professional PDF reports from assessments, including brand scores, recommendations, and visual charts for client presentations.",
    votes: 38,
    comments: [
      { id: "c3", author: "David Kim", content: "Essential for client deliverables", timestamp: "3 days ago", isInternal: false },
    ],
    internalNotes: ["Use react-pdf library", "Include white-label option"],
    requestedBy: "David Kim",
    agency: "Growth Labs",
    tags: ["Export", "Reports"],
    status: "planned",
    createdAt: "Jan 10, 2026",
    voters: ["David Kim", "Emma Davis", "Chris Taylor", "Amy Lee"],
  },
  {
    id: "3",
    title: "Mobile app",
    description: "Native iOS and Android apps for on-the-go access to client dashboards, quick assessments, and push notifications.",
    votes: 35,
    comments: [
      { id: "c4", author: "Tom Wilson", content: "Would love to check client scores from my phone", timestamp: "5 days ago", isInternal: false },
    ],
    internalNotes: ["Consider React Native", "Start with PWA?"],
    requestedBy: "Tom Wilson",
    agency: "Nova Creative",
    tags: ["Mobile", "App"],
    status: "under_review",
    createdAt: "Jan 8, 2026",
    voters: ["Tom Wilson", "Rachel Green", "James Brown"],
  },
  {
    id: "4",
    title: "Custom branding colors",
    description: "Allow agencies to customize the platform colors to match their brand identity when presenting to clients.",
    votes: 31,
    comments: [],
    internalNotes: ["Part of white-label feature"],
    requestedBy: "Rachel Green",
    agency: "Summit Strategy",
    tags: ["Customization", "Branding"],
    status: "in_progress",
    createdAt: "Jan 5, 2026",
    voters: ["Rachel Green", "Morgan White", "Casey Miller"],
  },
  {
    id: "5",
    title: "API webhooks",
    description: "Send real-time webhooks when events occur (assessment completed, client added, score changed) for custom integrations.",
    votes: 28,
    comments: [
      { id: "c5", author: "James Brown", content: "Need this for our CRM sync", timestamp: "1 week ago", isInternal: false },
    ],
    internalNotes: ["Enterprise tier only"],
    requestedBy: "James Brown",
    agency: "Spark Digital",
    tags: ["API", "Integration"],
    status: "planned",
    createdAt: "Jan 3, 2026",
    voters: ["James Brown", "Jordan Lee"],
  },
  {
    id: "6",
    title: "Bulk client import",
    description: "Import multiple clients at once via CSV upload with field mapping for faster onboarding.",
    votes: 24,
    comments: [],
    internalNotes: [],
    requestedBy: "Emma Davis",
    agency: "Blueprint Co",
    tags: ["Import", "Onboarding"],
    status: "planned",
    createdAt: "Dec 28, 2025",
    voters: ["Emma Davis", "Amy Lee"],
  },
  {
    id: "7",
    title: "Team roles & permissions",
    description: "More granular permission controls for team members - view only, edit, admin levels per client.",
    votes: 22,
    comments: [],
    internalNotes: ["Complex - needs design review"],
    requestedBy: "Chris Taylor",
    agency: "Thrive Brands",
    tags: ["Team", "Security"],
    status: "under_review",
    createdAt: "Dec 25, 2025",
    voters: ["Chris Taylor", "Lisa Park"],
  },
  {
    id: "8",
    title: "Dark mode",
    description: "System-wide dark mode toggle for reduced eye strain during long working sessions.",
    votes: 19,
    comments: [
      { id: "c6", author: "Alex Rivera", content: "Please! My eyes at night", timestamp: "2 weeks ago", isInternal: false },
    ],
    internalNotes: ["Already implemented!"],
    requestedBy: "Alex Rivera",
    agency: "Momentum Agency",
    tags: ["UI", "Accessibility"],
    status: "completed",
    createdAt: "Dec 20, 2025",
    voters: ["Alex Rivera", "Jordan Lee"],
  },
  {
    id: "9",
    title: "Client portal",
    description: "Allow clients to log in and view their own brand scores and recommendations without agency intervention.",
    votes: 17,
    comments: [],
    internalNotes: ["Major feature - Q3 roadmap"],
    requestedBy: "Jordan Lee",
    agency: "Visionary Group",
    tags: ["Client", "Portal"],
    status: "under_review",
    createdAt: "Dec 18, 2025",
    voters: ["Jordan Lee"],
  },
  {
    id: "10",
    title: "Zapier integration",
    description: "Connect GESTALT with 5000+ apps through Zapier for automated workflows.",
    votes: 15,
    comments: [],
    internalNotes: ["After API webhooks"],
    requestedBy: "Morgan White",
    agency: "Create Studio",
    tags: ["Integration", "Automation"],
    status: "new",
    createdAt: "Dec 15, 2025",
    voters: ["Morgan White"],
  },
  {
    id: "11",
    title: "Assessment templates",
    description: "Create and save custom assessment templates for different industries or client types.",
    votes: 14,
    comments: [],
    internalNotes: [],
    requestedBy: "Casey Miller",
    agency: "Brandworks",
    tags: ["Templates", "Customization"],
    status: "new",
    createdAt: "Dec 12, 2025",
    voters: ["Casey Miller"],
  },
  {
    id: "12",
    title: "Calendar integration",
    description: "Sync project milestones and deadlines with Google Calendar or Outlook.",
    votes: 12,
    comments: [],
    internalNotes: [],
    requestedBy: "Amy Lee",
    agency: "StartUp Studio",
    tags: ["Calendar", "Integration"],
    status: "declined",
    createdAt: "Dec 10, 2025",
    voters: ["Amy Lee"],
  },
  {
    id: "13",
    title: "AI recommendations",
    description: "AI-powered suggestions for improving brand scores based on assessment results.",
    votes: 11,
    comments: [],
    internalNotes: ["Using OpenAI API - cost analysis needed"],
    requestedBy: "Lisa Park",
    agency: "Elevate Agency",
    tags: ["AI", "Insights"],
    status: "in_progress",
    createdAt: "Dec 8, 2025",
    voters: ["Lisa Park"],
  },
  {
    id: "14",
    title: "Competitor benchmarking",
    description: "Compare client brand scores against industry averages and competitors.",
    votes: 10,
    comments: [],
    internalNotes: ["Need industry data source"],
    requestedBy: "Mike Johnson",
    agency: "Pixel Perfect",
    tags: ["Analytics", "Benchmarking"],
    status: "new",
    createdAt: "Dec 5, 2025",
    voters: ["Mike Johnson"],
  },
  {
    id: "15",
    title: "Multi-language support",
    description: "Localize the platform interface and assessments for international clients.",
    votes: 8,
    comments: [],
    internalNotes: ["Low priority - most users English"],
    requestedBy: "Jeffery Morrison",
    agency: "GESTALT Partners",
    tags: ["i18n", "Localization"],
    status: "declined",
    createdAt: "Dec 1, 2025",
    voters: ["Jeffery Morrison"],
  },
];

export default function HQFeatures() {
  const [features, setFeatures] = useState<FeatureRequest[]>(mockFeatures);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"votes" | "newest">("votes");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [selectedFeature, setSelectedFeature] = useState<FeatureRequest | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newNote, setNewNote] = useState("");

  // Stats
  const stats = {
    total: features.length,
    new: features.filter((f) => f.status === "new").length,
    under_review: features.filter((f) => f.status === "under_review").length,
    planned: features.filter((f) => f.status === "planned").length,
    in_progress: features.filter((f) => f.status === "in_progress").length,
    completed: features.filter((f) => f.status === "completed").length,
    declined: features.filter((f) => f.status === "declined").length,
  };

  // Filter and sort
  const filteredFeatures = features
    .filter(
      (f) =>
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getFeaturesByStatus = (status: FeatureStatus) =>
    filteredFeatures.filter((f) => f.status === status);

  const handleStatusChange = (featureId: string, newStatus: FeatureStatus) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, status: newStatus } : f))
    );
    if (selectedFeature?.id === featureId) {
      setSelectedFeature((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleVote = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, votes: f.votes + 1 } : f))
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedFeature) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: "Admin",
      content: newComment,
      timestamp: "Just now",
      isInternal: false,
    };
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === selectedFeature.id
          ? { ...f, comments: [...f.comments, comment] }
          : f
      )
    );
    setSelectedFeature((prev) =>
      prev ? { ...prev, comments: [...prev.comments, comment] } : null
    );
    setNewComment("");
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedFeature) return;
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === selectedFeature.id
          ? { ...f, internalNotes: [...f.internalNotes, newNote] }
          : f
      )
    );
    setSelectedFeature((prev) =>
      prev ? { ...prev, internalNotes: [...prev.internalNotes, newNote] } : null
    );
    setNewNote("");
  };

  const FeatureCard = ({ feature }: { feature: FeatureRequest }) => (
    <Card
      className="rounded-none cursor-pointer hover:border-[hsl(var(--hq-accent))]/50 transition-colors"
      onClick={() => setSelectedFeature(feature)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVote(feature.id);
            }}
            className="flex flex-col items-center p-2 hover:bg-[hsl(var(--hq-accent))]/10 transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-[hsl(var(--hq-accent))]" />
            <span className="text-sm font-semibold">{feature.votes}</span>
          </button>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm mb-1 truncate">{feature.title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {feature.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {feature.comments.length}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {feature.requestedBy}
              </span>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {feature.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-none text-[10px] px-1.5 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const KanbanColumn = ({
    status,
    features,
  }: {
    status: FeatureStatus;
    features: FeatureRequest[];
  }) => (
    <div className="flex-1 min-w-[280px] max-w-[320px]">
      <div
        className={`flex items-center gap-2 p-3 mb-3 ${statusConfig[status].bgColor}`}
      >
        <span className={`text-sm font-semibold ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </span>
        <Badge variant="secondary" className="rounded-none text-xs">
          {features.length}
        </Badge>
      </div>
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="space-y-3 pr-2">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
          {features.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No features
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Feature Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage feature requests from agencies
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Idea
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <Card className="rounded-none">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
            <div className="text-xs text-muted-foreground">New</div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.under_review}</div>
            <div className="text-xs text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{stats.planned}</div>
            <div className="text-xs text-muted-foreground">Planned</div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.in_progress}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-500">{stats.declined}</div>
            <div className="text-xs text-muted-foreground">Declined</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-none pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as "votes" | "newest")}>
          <SelectTrigger className="rounded-none w-40">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="votes">Most Voted</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex border border-border">
          <Button
            variant={viewMode === "kanban" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn status="new" features={getFeaturesByStatus("new")} />
          <KanbanColumn status="under_review" features={getFeaturesByStatus("under_review")} />
          <KanbanColumn status="planned" features={getFeaturesByStatus("planned")} />
          <KanbanColumn status="in_progress" features={getFeaturesByStatus("in_progress")} />
          <KanbanColumn status="completed" features={getFeaturesByStatus("completed")} />
          <KanbanColumn status="declined" features={getFeaturesByStatus("declined")} />
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card className="rounded-none">
          <div className="divide-y divide-border">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className="p-4 flex items-center gap-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedFeature(feature)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(feature.id);
                  }}
                  className="flex flex-col items-center p-2 hover:bg-[hsl(var(--hq-accent))]/10 transition-colors min-w-[60px]"
                >
                  <ChevronUp className="w-4 h-4 text-[hsl(var(--hq-accent))]" />
                  <span className="text-sm font-semibold">{feature.votes}</span>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{feature.title}</h4>
                    <Badge
                      className={`rounded-none text-xs ${statusConfig[feature.status].bgColor} ${statusConfig[feature.status].color} border-0`}
                    >
                      {statusConfig[feature.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {feature.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {feature.comments.length}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {feature.requestedBy}
                  </span>
                  <span className="text-xs">{feature.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Feature Detail Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="rounded-none max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedFeature && (
            <>
              <DialogHeader className="border-b border-border pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center p-3 bg-muted">
                      <ChevronUp className="w-5 h-5 text-[hsl(var(--hq-accent))]" />
                      <span className="text-lg font-bold">{selectedFeature.votes}</span>
                      <span className="text-xs text-muted-foreground">votes</span>
                    </div>
                    <div>
                      <DialogTitle className="text-xl mb-2">
                        {selectedFeature.title}
                      </DialogTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Requested by {selectedFeature.requestedBy}</span>
                        <span>•</span>
                        <span>{selectedFeature.agency}</span>
                        <span>•</span>
                        <span>{selectedFeature.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <Select
                    value={selectedFeature.status}
                    onValueChange={(v) => handleStatusChange(selectedFeature.id, v as FeatureStatus)}
                  >
                    <SelectTrigger
                      className={`rounded-none w-40 ${statusConfig[selectedFeature.status].bgColor}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 py-4">
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Description
                    </h4>
                    <p className="text-sm">{selectedFeature.description}</p>
                    <div className="flex gap-1 mt-3">
                      {selectedFeature.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Voters */}
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Voters ({selectedFeature.voters.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeature.voters.map((voter) => (
                        <Badge key={voter} variant="secondary" className="rounded-none">
                          <User className="w-3 h-3 mr-1" />
                          {voter}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Comments ({selectedFeature.comments.length})
                    </h4>
                    <div className="space-y-3 mb-3">
                      {selectedFeature.comments.map((comment) => (
                        <Card key={comment.id} className="rounded-none">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {comment.timestamp}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                      {selectedFeature.comments.length === 0 && (
                        <p className="text-sm text-muted-foreground">No comments yet</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="rounded-none"
                      />
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="rounded-none"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Internal Notes
                    </h4>
                    <Card className="rounded-none bg-yellow-500/5 border-yellow-500/20">
                      <CardContent className="p-3">
                        {selectedFeature.internalNotes.length > 0 ? (
                          <ul className="space-y-1 text-sm mb-3">
                            {selectedFeature.internalNotes.map((note, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-yellow-500">•</span>
                                {note}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground mb-3">
                            No internal notes
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add internal note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="rounded-none"
                          />
                          <Button
                            variant="outline"
                            onClick={handleAddNote}
                            disabled={!newNote.trim()}
                            className="rounded-none"
                          >
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>

              {/* Footer Actions */}
              <div className="border-t border-border pt-4 flex justify-between">
                <Button variant="outline" className="rounded-none gap-2">
                  <Bell className="w-4 h-4" />
                  Notify Voters
                </Button>
                <div className="flex gap-2">
                  {selectedFeature.status !== "completed" && (
                    <Button
                      onClick={() => handleStatusChange(selectedFeature.id, "completed")}
                      className="rounded-none bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Complete
                    </Button>
                  )}
                  {selectedFeature.status !== "declined" && (
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedFeature.id, "declined")}
                      className="rounded-none gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Idea Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[hsl(var(--hq-accent))]" />
              Add New Feature Idea
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Title</label>
              <Input placeholder="Feature title..." className="rounded-none" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea
                placeholder="Describe the feature..."
                className="rounded-none min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Requested By</label>
                <Input placeholder="Name" className="rounded-none" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Agency</label>
                <Select>
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Select agency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="gestalt">GESTALT Partners</SelectItem>
                    <SelectItem value="brand">Brand Architects</SelectItem>
                    <SelectItem value="pixel">Pixel Perfect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tags</label>
              <Input placeholder="Integration, Mobile, API..." className="rounded-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowAddModal(false)}
              className="rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
            >
              Add Feature
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
