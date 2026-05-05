import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Plus,
  Search,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Mail,
  Edit,
  Trash2,
  Key,
  Clock,
  UserPlus,
  Crown,
  Headphones,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import ActivityLogCard from "@/components/hq/ActivityLogCard";
import { useActivityLog } from "@/hooks/useActivityLog";

type TeamRole = "super_admin" | "admin" | "support" | "viewer";
type TeamStatus = "active" | "invited" | "suspended";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamStatus;
  lastActive: string;
  joinedAt: string;
  twoFactorEnabled: boolean;
  permissions: string[];
}

const roleConfig: Record<TeamRole, { label: string; icon: typeof Shield; color: string; bgColor: string }> = {
  super_admin: { label: "Super Admin", icon: Crown, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  admin: { label: "Admin", icon: ShieldCheck, color: "text-[hsl(var(--hq-accent))]", bgColor: "bg-[hsl(var(--hq-accent))]/10" },
  support: { label: "Support", icon: Headphones, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  viewer: { label: "Viewer", icon: Eye, color: "text-gray-500", bgColor: "bg-gray-500/10" },
};

const statusConfig: Record<TeamStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Active", color: "text-green-500", bgColor: "bg-green-500/10" },
  invited: { label: "Pending", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  suspended: { label: "Suspended", color: "text-red-500", bgColor: "bg-red-500/10" },
};

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alex Thompson",
    email: "alex@gestalt.io",
    role: "super_admin",
    status: "active",
    lastActive: "Just now",
    joinedAt: "Jan 2025",
    twoFactorEnabled: true,
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "sarah@gestalt.io",
    role: "admin",
    status: "active",
    lastActive: "5 minutes ago",
    joinedAt: "Mar 2025",
    twoFactorEnabled: true,
    permissions: ["agencies", "clients", "billing", "support"],
  },
  {
    id: "3",
    name: "Jordan Lee",
    email: "jordan@gestalt.io",
    role: "admin",
    status: "active",
    lastActive: "1 hour ago",
    joinedAt: "Jun 2025",
    twoFactorEnabled: true,
    permissions: ["agencies", "clients", "support"],
  },
  {
    id: "4",
    name: "Morgan Chen",
    email: "morgan@gestalt.io",
    role: "support",
    status: "active",
    lastActive: "30 minutes ago",
    joinedAt: "Sep 2025",
    twoFactorEnabled: false,
    permissions: ["tickets", "announcements"],
  },
  {
    id: "5",
    name: "Casey Williams",
    email: "casey@gestalt.io",
    role: "support",
    status: "active",
    lastActive: "2 hours ago",
    joinedAt: "Nov 2025",
    twoFactorEnabled: true,
    permissions: ["tickets", "announcements"],
  },
  {
    id: "6",
    name: "Taylor Brown",
    email: "taylor@gestalt.io",
    role: "viewer",
    status: "invited",
    lastActive: "Never",
    joinedAt: "Jan 2026",
    twoFactorEnabled: false,
    permissions: ["view_only"],
  },
  {
    id: "7",
    name: "Jamie Garcia",
    email: "jamie@gestalt.io",
    role: "support",
    status: "suspended",
    lastActive: "2 weeks ago",
    joinedAt: "Aug 2025",
    twoFactorEnabled: false,
    permissions: ["tickets"],
  },
];

const permissionsList = [
  { id: "agencies", label: "Manage Agencies", description: "View, edit, and delete agency accounts" },
  { id: "clients", label: "Manage Clients", description: "View and manage client data across agencies" },
  { id: "billing", label: "Billing & Revenue", description: "Access billing, invoices, and revenue data" },
  { id: "tickets", label: "Support Tickets", description: "Handle support tickets and customer issues" },
  { id: "announcements", label: "Announcements", description: "Create and publish platform announcements" },
  { id: "coupons", label: "Coupons", description: "Create and manage discount codes" },
  { id: "permissions", label: "Permissions", description: "Modify feature access and plan limits" },
  { id: "configuration", label: "Configuration", description: "Modify platform settings" },
  { id: "team", label: "Team Management", description: "Invite and manage team members" },
];

export default function HQTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { logActivity } = useActivityLog();

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("support");
  const [invitePermissions, setInvitePermissions] = useState<string[]>(["tickets"]);

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter((m) => m.status === "active").length,
    admins: teamMembers.filter((m) => m.role === "super_admin" || m.role === "admin").length,
    support: teamMembers.filter((m) => m.role === "support").length,
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInvite = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
      lastActive: "Never",
      joinedAt: "Jan 2026",
      twoFactorEnabled: false,
      permissions: invitePermissions,
    };
    setTeamMembers([...teamMembers, newMember]);
    
    logActivity({
      actionType: "member_invited",
      description: `invited ${inviteName} (${inviteEmail}) as ${roleConfig[inviteRole].label}`,
      metadata: { email: inviteEmail, role: inviteRole, permissions: invitePermissions },
    });
    
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("support");
    setInvitePermissions(["tickets"]);
  };

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleSuspend = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (!member) return;
    
    const newStatus = member.status === "suspended" ? "active" : "suspended";
    setTeamMembers(
      teamMembers.map((m) =>
        m.id === memberId ? { ...m, status: newStatus } : m
      )
    );
    
    logActivity({
      actionType: newStatus === "suspended" ? "member_suspended" : "member_reactivated",
      description: `${newStatus === "suspended" ? "suspended" : "reactivated"} ${member.name}`,
      metadata: { memberId, memberEmail: member.email },
    });
  };

  const handleDelete = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (!member) return;
    
    setTeamMembers(teamMembers.filter((m) => m.id !== memberId));
    
    logActivity({
      actionType: "member_removed",
      description: `removed ${member.name} from the team`,
      metadata: { memberId, memberEmail: member.email },
    });
  };

  const handleResendInvite = (memberId: string) => {
    // Mock resend logic
    console.log("Resending invite to:", memberId);
  };

  const togglePermission = (permId: string) => {
    setInvitePermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const RoleIcon = ({ role }: { role: TeamRole }) => {
    const config = roleConfig[role];
    const Icon = config.icon;
    return <Icon className={`w-4 h-4 ${config.color}`} />;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Team Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage platform administrators, support staff, and permissions
          </p>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Team Member
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="rounded-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[hsl(var(--hq-accent))]/10">
                <Users className="w-5 h-5 text-[hsl(var(--hq-accent))]" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10">
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.admins}</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10">
                <Headphones className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stats.support}</p>
                <p className="text-xs text-muted-foreground">Support Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-none mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-none pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="rounded-none w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Table */}
      <Card className="rounded-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>2FA</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="rounded-none h-9 w-9">
                      <AvatarFallback className="rounded-none bg-muted">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 ${roleConfig[member.role].bgColor}`}>
                      <RoleIcon role={member.role} />
                    </div>
                    <span className="text-sm">{roleConfig[member.role].label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`rounded-none border-0 ${statusConfig[member.status].bgColor} ${statusConfig[member.status].color}`}
                  >
                    {statusConfig[member.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {member.twoFactorEnabled ? (
                    <span className="flex items-center gap-1 text-green-500 text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      Enabled
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground text-sm">
                      <ShieldAlert className="w-4 h-4" />
                      Disabled
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {member.lastActive}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{member.joinedAt}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-none">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none">
                      <DropdownMenuItem onClick={() => handleEditMember(member)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key className="w-4 h-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      {member.status === "invited" && (
                        <DropdownMenuItem onClick={() => handleResendInvite(member.id)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Resend Invite
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {member.role !== "super_admin" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleSuspend(member.id)}
                            className={member.status === "suspended" ? "text-green-500" : "text-yellow-500"}
                          >
                            {member.status === "suspended" ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Reactivate
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Suspend
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(member.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Role Legend */}
      <Card className="rounded-none mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Role Permissions</CardTitle>
          <CardDescription>Overview of what each role can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(roleConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <div key={key} className="p-4 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`p-2 ${config.bgColor}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {key === "super_admin" && (
                      <>
                        <li>• Full platform access</li>
                        <li>• Manage all team members</li>
                        <li>• Platform configuration</li>
                        <li>• Cannot be suspended</li>
                      </>
                    )}
                    {key === "admin" && (
                      <>
                        <li>• Manage agencies & clients</li>
                        <li>• Billing & revenue access</li>
                        <li>• Support ticket handling</li>
                        <li>• Announcements & coupons</li>
                      </>
                    )}
                    {key === "support" && (
                      <>
                        <li>• Handle support tickets</li>
                        <li>• View agency details</li>
                        <li>• Create announcements</li>
                        <li>• Limited billing access</li>
                      </>
                    )}
                    {key === "viewer" && (
                      <>
                        <li>• View-only access</li>
                        <li>• Dashboard & analytics</li>
                        <li>• No editing capabilities</li>
                        <li>• Ideal for stakeholders</li>
                      </>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <div className="mt-6">
        <ActivityLogCard />
      </div>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[hsl(var(--hq-accent))]" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Send an invitation to join the GESTALT HQ team
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-1.5 block">Full Name</Label>
              <Input
                placeholder="John Doe"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="rounded-none"
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Email Address</Label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="rounded-none"
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as TeamRole)}>
                <SelectTrigger className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[hsl(var(--hq-accent))]" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="support">
                    <div className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-blue-500" />
                      Support
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      Viewer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {inviteRole !== "viewer" && (
              <div>
                <Label className="mb-2 block">Permissions</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-border p-3">
                  {permissionsList.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex items-center justify-between p-2 hover:bg-muted/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.description}</p>
                      </div>
                      <Switch
                        checked={invitePermissions.includes(perm.id)}
                        onCheckedChange={() => togglePermission(perm.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInviteModal(false)}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!inviteEmail || !inviteName}
              className="rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Member Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Edit Team Member
            </DialogTitle>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 bg-muted">
                <Avatar className="rounded-none h-12 w-12">
                  <AvatarFallback className="rounded-none">
                    {selectedMember.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedMember.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                </div>
              </div>

              <div>
                <Label className="mb-1.5 block">Role</Label>
                <Select defaultValue={selectedMember.role}>
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Permissions</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-border p-3">
                  {permissionsList.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex items-center justify-between p-2 hover:bg-muted/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{perm.label}</p>
                        <p className="text-xs text-muted-foreground">{perm.description}</p>
                      </div>
                      <Switch defaultChecked={selectedMember.permissions.includes(perm.id)} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-border">
                <div>
                  <Label>Require 2FA</Label>
                  <p className="text-xs text-muted-foreground">
                    Force two-factor authentication
                  </p>
                </div>
                <Switch defaultChecked={selectedMember.twoFactorEnabled} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setShowEditModal(false)}
              className="rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
