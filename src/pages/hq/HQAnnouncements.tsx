import { useState } from "react";
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Send,
  Clock,
  CheckCircle,
  Users,
  Building2,
  Calendar,
  AlertTriangle,
  Info,
  Sparkles,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "feature" | "maintenance";
  status: "draft" | "scheduled" | "published" | "expired";
  audience: "all" | "pro" | "enterprise" | "free";
  createdAt: string;
  publishedAt?: string;
  scheduledFor?: string;
  expiresAt?: string;
  author: string;
  views: number;
  dismissals: number;
  pinned: boolean;
}

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "New B.A.S.E. Framework 2.0 Released",
    content: "We're excited to announce the release of B.A.S.E. Framework 2.0 with enhanced assessment capabilities, improved analytics, and a redesigned dashboard experience. Update your client workflows to take advantage of these new features.",
    type: "feature",
    status: "published",
    audience: "all",
    createdAt: "2024-01-25",
    publishedAt: "2024-01-26",
    author: "Product Team",
    views: 1247,
    dismissals: 89,
    pinned: true,
  },
  {
    id: "2",
    title: "Scheduled Maintenance - January 30th",
    content: "We will be performing scheduled maintenance on January 30th from 2:00 AM to 4:00 AM EST. During this time, the platform may be temporarily unavailable. We apologize for any inconvenience.",
    type: "maintenance",
    status: "scheduled",
    audience: "all",
    createdAt: "2024-01-24",
    scheduledFor: "2024-01-29",
    expiresAt: "2024-01-31",
    author: "Engineering Team",
    views: 0,
    dismissals: 0,
    pinned: false,
  },
  {
    id: "3",
    title: "Enterprise API Rate Limits Updated",
    content: "Enterprise plan API rate limits have been increased from 1,000 to 5,000 requests per minute. This change is effective immediately.",
    type: "info",
    status: "published",
    audience: "enterprise",
    createdAt: "2024-01-22",
    publishedAt: "2024-01-22",
    author: "API Team",
    views: 156,
    dismissals: 12,
    pinned: false,
  },
  {
    id: "4",
    title: "Action Required: Security Update",
    content: "A critical security update requires all agencies to re-authenticate their connected integrations. Please visit Settings > Integrations to complete this action by February 1st.",
    type: "warning",
    status: "published",
    audience: "all",
    createdAt: "2024-01-20",
    publishedAt: "2024-01-20",
    expiresAt: "2024-02-01",
    author: "Security Team",
    views: 892,
    dismissals: 234,
    pinned: true,
  },
  {
    id: "5",
    title: "Pro Plan: New Collaboration Features",
    content: "Pro plan users now have access to real-time collaboration features including shared workspaces, team comments, and activity feeds.",
    type: "feature",
    status: "published",
    audience: "pro",
    createdAt: "2024-01-18",
    publishedAt: "2024-01-19",
    author: "Product Team",
    views: 567,
    dismissals: 45,
    pinned: false,
  },
  {
    id: "6",
    title: "Welcome Message Update",
    content: "We've refreshed the welcome message and onboarding flow for new agencies. Check out the improved experience!",
    type: "info",
    status: "draft",
    audience: "all",
    createdAt: "2024-01-27",
    author: "Growth Team",
    views: 0,
    dismissals: 0,
    pinned: false,
  },
  {
    id: "7",
    title: "Holiday Support Hours",
    content: "Please note our support team will have limited availability during the upcoming holidays. Emergency support remains available 24/7.",
    type: "info",
    status: "expired",
    audience: "all",
    createdAt: "2024-01-01",
    publishedAt: "2024-01-01",
    expiresAt: "2024-01-15",
    author: "Support Team",
    views: 1089,
    dismissals: 567,
    pinned: false,
  },
  {
    id: "8",
    title: "Free Plan Upgrade Promotion",
    content: "Limited time offer: Upgrade from Free to Pro and get 2 months free! Use code UPGRADE2024 at checkout.",
    type: "feature",
    status: "published",
    audience: "free",
    createdAt: "2024-01-15",
    publishedAt: "2024-01-16",
    expiresAt: "2024-02-15",
    author: "Marketing Team",
    views: 234,
    dismissals: 12,
    pinned: false,
  },
];

const getTypeIcon = (type: Announcement["type"]) => {
  switch (type) {
    case "info":
      return <Info className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "feature":
      return <Sparkles className="h-4 w-4" />;
    case "maintenance":
      return <Clock className="h-4 w-4" />;
  }
};

const getTypeBadgeClass = (type: Announcement["type"]) => {
  switch (type) {
    case "info":
      return "bg-[hsl(var(--status-blue))]/20 text-[hsl(var(--status-blue))] border-[hsl(var(--status-blue))]/30";
    case "warning":
      return "bg-[hsl(var(--status-orange))]/20 text-[hsl(var(--status-orange))] border-[hsl(var(--status-orange))]/30";
    case "feature":
      return "bg-[hsl(var(--status-purple))]/20 text-[hsl(var(--status-purple))] border-[hsl(var(--status-purple))]/30";
    case "maintenance":
      return "bg-[hsl(var(--muted-foreground))]/20 text-[hsl(var(--muted-foreground))] border-[hsl(var(--muted-foreground))]/30";
  }
};

const getStatusBadgeClass = (status: Announcement["status"]) => {
  switch (status) {
    case "published":
      return "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))] border-[hsl(var(--status-green))]/30";
    case "scheduled":
      return "bg-[hsl(var(--status-blue))]/20 text-[hsl(var(--status-blue))] border-[hsl(var(--status-blue))]/30";
    case "draft":
      return "bg-[hsl(var(--muted-foreground))]/20 text-[hsl(var(--muted-foreground))] border-[hsl(var(--muted-foreground))]/30";
    case "expired":
      return "bg-[hsl(var(--status-red))]/20 text-[hsl(var(--status-red))] border-[hsl(var(--status-red))]/30";
  }
};

const getAudienceLabel = (audience: Announcement["audience"]) => {
  switch (audience) {
    case "all":
      return "All Agencies";
    case "pro":
      return "Pro Only";
    case "enterprise":
      return "Enterprise Only";
    case "free":
      return "Free Only";
  }
};

export default function HQAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info" as Announcement["type"],
    audience: "all" as Announcement["audience"],
    pinned: false,
    scheduledFor: "",
    expiresAt: "",
  });

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: announcements.length,
    published: announcements.filter((a) => a.status === "published").length,
    scheduled: announcements.filter((a) => a.status === "scheduled").length,
    drafts: announcements.filter((a) => a.status === "draft").length,
    totalViews: announcements.reduce((sum, a) => sum + a.views, 0),
  };

  const handleCreate = () => {
    setFormData({
      title: "",
      content: "",
      type: "info",
      audience: "all",
      pinned: false,
      scheduledFor: "",
      expiresAt: "",
    });
    setIsEditing(false);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      audience: announcement.audience,
      pinned: announcement.pinned,
      scheduledFor: announcement.scheduledFor || "",
      expiresAt: announcement.expiresAt || "",
    });
    setSelectedAnnouncement(announcement);
    setIsEditing(true);
    setIsCreateModalOpen(true);
  };

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsViewModalOpen(true);
  };

  const handleDelete = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAnnouncement) {
      setAnnouncements(announcements.filter((a) => a.id !== selectedAnnouncement.id));
      setIsDeleteModalOpen(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleSave = (publish: boolean) => {
    const now = new Date().toISOString().split("T")[0];
    
    if (isEditing && selectedAnnouncement) {
      setAnnouncements(
        announcements.map((a) =>
          a.id === selectedAnnouncement.id
            ? {
                ...a,
                ...formData,
                status: publish ? "published" : formData.scheduledFor ? "scheduled" : "draft",
                publishedAt: publish ? now : a.publishedAt,
              }
            : a
        )
      );
    } else {
      const newAnnouncement: Announcement = {
        id: String(Date.now()),
        title: formData.title,
        content: formData.content,
        type: formData.type,
        audience: formData.audience,
        status: publish ? "published" : formData.scheduledFor ? "scheduled" : "draft",
        createdAt: now,
        publishedAt: publish ? now : undefined,
        scheduledFor: formData.scheduledFor || undefined,
        expiresAt: formData.expiresAt || undefined,
        author: "Admin",
        views: 0,
        dismissals: 0,
        pinned: formData.pinned,
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    setIsCreateModalOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage platform-wide announcements
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-none bg-[hsl(var(--primary))]/10">
                <Megaphone className="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-none bg-[hsl(var(--status-green))]/10">
                <CheckCircle className="h-5 w-5 text-[hsl(var(--status-green))]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.published}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-none bg-[hsl(var(--status-blue))]/10">
                <Clock className="h-5 w-5 text-[hsl(var(--status-blue))]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.scheduled}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-none bg-[hsl(var(--muted-foreground))]/10">
                <Edit2 className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.drafts}</p>
                <p className="text-xs text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-none bg-[hsl(var(--status-purple))]/10">
                <Eye className="h-5 w-5 text-[hsl(var(--status-purple))]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.totalViews.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-none"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] rounded-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] rounded-none">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">All Announcements</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Title</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Type</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Audience</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Views</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map((announcement) => (
                <TableRow 
                  key={announcement.id} 
                  className="border-border cursor-pointer hover:bg-muted/50"
                  onClick={() => handleView(announcement)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {announcement.pinned && (
                        <Bell className="h-3 w-3 text-[hsl(var(--primary))]" />
                      )}
                      <span className="font-medium text-foreground">{announcement.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-none gap-1 ${getTypeBadgeClass(announcement.type)}`}>
                      {getTypeIcon(announcement.type)}
                      {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-none ${getStatusBadgeClass(announcement.status)}`}>
                      {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      {announcement.audience === "all" ? (
                        <Users className="h-3 w-3" />
                      ) : (
                        <Building2 className="h-3 w-3" />
                      )}
                      {getAudienceLabel(announcement.audience)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">{announcement.views.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {announcement.status === "scheduled" && announcement.scheduledFor ? (
                        <span className="text-[hsl(var(--status-blue))]">
                          Scheduled: {announcement.scheduledFor}
                        </span>
                      ) : announcement.publishedAt ? (
                        <span className="text-muted-foreground">{announcement.publishedAt}</span>
                      ) : (
                        <span className="text-muted-foreground">{announcement.createdAt}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[hsl(var(--status-red))] hover:text-[hsl(var(--status-red))]"
                        onClick={() => handleDelete(announcement)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl rounded-none">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Announcement" : "Create New Announcement"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the announcement details below." 
                : "Fill in the details to create a new platform announcement."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Announcement title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your announcement content..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="rounded-none min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Announcement["type"]) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Audience</Label>
                <Select
                  value={formData.audience}
                  onValueChange={(value: Announcement["audience"]) =>
                    setFormData({ ...formData, audience: value })
                  }
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="all">All Agencies</SelectItem>
                    <SelectItem value="pro">Pro Only</SelectItem>
                    <SelectItem value="enterprise">Enterprise Only</SelectItem>
                    <SelectItem value="free">Free Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledFor">Schedule For (optional)</Label>
                <Input
                  id="scheduledFor"
                  type="date"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  className="rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires At (optional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="rounded-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="pinned"
                  checked={formData.pinned}
                  onCheckedChange={(checked) => setFormData({ ...formData, pinned: checked })}
                />
                <Label htmlFor="pinned" className="cursor-pointer">
                  Pin this announcement
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSave(false)}
              className="rounded-none gap-2"
              disabled={!formData.title || !formData.content}
            >
              <Edit2 className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              className="rounded-none gap-2"
              disabled={!formData.title || !formData.content}
            >
              <Send className="h-4 w-4" />
              {formData.scheduledFor ? "Schedule" : "Publish Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl rounded-none">
          {selectedAnnouncement && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`rounded-none gap-1 ${getTypeBadgeClass(selectedAnnouncement.type)}`}>
                    {getTypeIcon(selectedAnnouncement.type)}
                    {selectedAnnouncement.type.charAt(0).toUpperCase() + selectedAnnouncement.type.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={`rounded-none ${getStatusBadgeClass(selectedAnnouncement.status)}`}>
                    {selectedAnnouncement.status.charAt(0).toUpperCase() + selectedAnnouncement.status.slice(1)}
                  </Badge>
                  {selectedAnnouncement.pinned && (
                    <Badge variant="outline" className="rounded-none gap-1">
                      <Bell className="h-3 w-3" />
                      Pinned
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl">{selectedAnnouncement.title}</DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <p className="text-foreground leading-relaxed">{selectedAnnouncement.content}</p>
              </div>

              <div className="grid grid-cols-4 gap-4 py-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Author</p>
                  <p className="text-sm font-medium text-foreground">{selectedAnnouncement.author}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Audience</p>
                  <p className="text-sm font-medium text-foreground">{getAudienceLabel(selectedAnnouncement.audience)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Views</p>
                  <p className="text-sm font-medium text-foreground">{selectedAnnouncement.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Dismissals</p>
                  <p className="text-sm font-medium text-foreground">{selectedAnnouncement.dismissals.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Created</p>
                  <p className="text-sm text-foreground">{selectedAnnouncement.createdAt}</p>
                </div>
                {selectedAnnouncement.publishedAt && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Published</p>
                    <p className="text-sm text-foreground">{selectedAnnouncement.publishedAt}</p>
                  </div>
                )}
                {selectedAnnouncement.scheduledFor && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Scheduled</p>
                    <p className="text-sm text-[hsl(var(--status-blue))]">{selectedAnnouncement.scheduledFor}</p>
                  </div>
                )}
                {selectedAnnouncement.expiresAt && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Expires</p>
                    <p className="text-sm text-[hsl(var(--status-orange))]">{selectedAnnouncement.expiresAt}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="rounded-none">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEdit(selectedAnnouncement);
                  }}
                  className="rounded-none gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedAnnouncement?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="rounded-none gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
