import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Globe,
  Mail,
  Shield,
  Palette,
  Database,
  Zap,
  Bell,
  Key,
  Link2,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Save,
  AlertTriangle,
  Server,
  Clock,
  FileText,
  Users,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
}

const mockIntegrations: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing and subscription management",
    icon: "💳",
    status: "connected",
    lastSync: "2 minutes ago",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Transactional and marketing email delivery",
    icon: "📧",
    status: "connected",
    lastSync: "5 minutes ago",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team notifications and alerts",
    icon: "💬",
    status: "disconnected",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Website and app analytics tracking",
    icon: "📊",
    status: "connected",
    lastSync: "1 hour ago",
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Customer support and live chat",
    icon: "💭",
    status: "error",
    lastSync: "Failed 3 hours ago",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Workflow automation with 5000+ apps",
    icon: "⚡",
    status: "disconnected",
  },
];

export default function HQConfiguration() {
  const [integrations] = useState<Integration[]>(mockIntegrations);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Platform Settings
  const [platformName, setPlatformName] = useState("GESTALT");
  const [supportEmail, setSupportEmail] = useState("support@gestalt.io");
  const [defaultTimezone, setDefaultTimezone] = useState("America/New_York");
  const [dateFormat, setDateFormat] = useState("MMM DD, YYYY");

  // Security Settings
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [passwordMinLength, setPasswordMinLength] = useState("12");

  // Email Settings
  const [emailFromName, setEmailFromName] = useState("GESTALT Platform");
  const [emailFromAddress, setEmailFromAddress] = useState("noreply@gestalt.io");
  const [welcomeEmailEnabled, setWelcomeEmailEnabled] = useState(true);
  const [weeklyDigestEnabled, setWeeklyDigestEnabled] = useState(true);

  // Feature Flags
  const [betaFeatures, setBetaFeatures] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [signupsEnabled, setSignupsEnabled] = useState(true);
  const [apiAccessEnabled, setApiAccessEnabled] = useState(true);

  const handleChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    // Save logic would go here
  };

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="rounded-none bg-green-500/10 text-green-500 border-0">
            <Check className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case "disconnected":
        return (
          <Badge className="rounded-none bg-gray-500/10 text-gray-500 border-0">
            <X className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        );
      case "error":
        return (
          <Badge className="rounded-none bg-red-500/10 text-red-500 border-0">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage platform settings, integrations, and system preferences
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className="rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {hasUnsavedChanges && (
        <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span className="text-sm">You have unsaved changes</span>
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="rounded-none bg-muted/50 p-1">
          <TabsTrigger value="general" className="rounded-none gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-none gap-2">
            <Zap className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-none gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="email" className="rounded-none gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="features" className="rounded-none gap-2">
            <Zap className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="api" className="rounded-none gap-2">
            <Key className="w-4 h-4" />
            API
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Platform Identity
                </CardTitle>
                <CardDescription>
                  Basic platform branding and identity settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">Platform Name</Label>
                  <Input
                    value={platformName}
                    onChange={(e) => {
                      setPlatformName(e.target.value);
                      handleChange();
                    }}
                    className="rounded-none"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Support Email</Label>
                  <Input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => {
                      setSupportEmail(e.target.value);
                      handleChange();
                    }}
                    className="rounded-none"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Platform Logo</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold text-[hsl(var(--hq-accent))]">G</span>
                    </div>
                    <Button variant="outline" className="rounded-none">
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Regional Settings
                </CardTitle>
                <CardDescription>
                  Configure timezone and date format preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">Default Timezone</Label>
                  <Select
                    value={defaultTimezone}
                    onValueChange={(v) => {
                      setDefaultTimezone(v);
                      handleChange();
                    }}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">Date Format</Label>
                  <Select
                    value={dateFormat}
                    onValueChange={(v) => {
                      setDateFormat(v);
                      handleChange();
                    }}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="MMM DD, YYYY">Jan 27, 2026</SelectItem>
                      <SelectItem value="DD/MM/YYYY">27/01/2026</SelectItem>
                      <SelectItem value="MM/DD/YYYY">01/27/2026</SelectItem>
                      <SelectItem value="YYYY-MM-DD">2026-01-27</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger className="rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the platform's visual appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="mb-1.5 block">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[hsl(var(--hq-accent))]" />
                    <Input defaultValue="#9b59b6" className="rounded-none flex-1" />
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 block">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[hsl(var(--gold))]" />
                    <Input defaultValue="#c9a227" className="rounded-none flex-1" />
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 block">Default Theme</Label>
                  <Select defaultValue="dark">
                    <SelectTrigger className="rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="rounded-none">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted flex items-center justify-center text-2xl">
                        {integration.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{integration.name}</h3>
                          {getStatusBadge(integration.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                        {integration.lastSync && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last sync: {integration.lastSync}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status === "connected" && (
                        <>
                          <Button variant="outline" size="sm" className="rounded-none gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Sync
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-none gap-1">
                            <Settings className="w-3 h-3" />
                            Configure
                          </Button>
                        </>
                      )}
                      {integration.status === "disconnected" && (
                        <Button size="sm" className="rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90 gap-1">
                          <Link2 className="w-3 h-3" />
                          Connect
                        </Button>
                      )}
                      {integration.status === "error" && (
                        <>
                          <Button variant="outline" size="sm" className="rounded-none gap-1 text-red-500">
                            <AlertTriangle className="w-3 h-3" />
                            Fix Issue
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-none gap-1">
                            <RefreshCw className="w-3 h-3" />
                            Retry
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-none border-dashed">
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold mb-2">Need a custom integration?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our team to discuss custom API integrations
              </p>
              <Button variant="outline" className="rounded-none gap-2">
                <ExternalLink className="w-4 h-4" />
                Request Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Authentication
                </CardTitle>
                <CardDescription>
                  Configure login and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-[800] tracking-[1.5px] uppercase text-foreground">
                          TWO-FACTOR AUTHENTICATION
                        </p>
                      </div>
                      <span
                        className="px-2 py-0.5 text-[7px] font-[800] border"
                        style={{
                          background: "rgba(95,204,0,0.15)",
                          borderColor: "#5fcc00",
                          color: "#5fcc00",
                        }}
                      >
                        REQUIRED FOR HQ + AGENCY ACCOUNTS
                      </span>
                    </div>
                    <p className="text-[8px] italic mt-2" style={{ color: "#606060" }}>
                      MFA is permanently required for all HQ and Agency accounts. This setting cannot be disabled.
                    </p>
                  </div>
                <div>
                  <Label className="mb-1.5 block">Session Timeout (minutes)</Label>
                  <Select
                    value={sessionTimeout}
                    onValueChange={(v) => {
                      setSessionTimeout(v);
                      handleChange();
                    }}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">Minimum Password Length</Label>
                  <Select
                    value={passwordMinLength}
                    onValueChange={(v) => {
                      setPasswordMinLength(v);
                      handleChange();
                    }}
                  >
                    <SelectTrigger className="rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="8">8 characters</SelectItem>
                      <SelectItem value="10">10 characters</SelectItem>
                      <SelectItem value="12">12 characters</SelectItem>
                      <SelectItem value="16">16 characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Access Control
                </CardTitle>
                <CardDescription>
                  Restrict access by IP or domain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">IP Whitelist</Label>
                  <Textarea
                    placeholder="Enter IP addresses, one per line..."
                    value={ipWhitelist}
                    onChange={(e) => {
                      setIpWhitelist(e.target.value);
                      handleChange();
                    }}
                    className="rounded-none min-h-[100px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to allow all IPs
                  </p>
                </div>
                <div className="flex items-center justify-between p-3 border border-border">
                  <div>
                    <Label>Block Suspicious Activity</Label>
                    <p className="text-xs text-muted-foreground">
                      Auto-block after 5 failed login attempts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription>
                  Configure outgoing email settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">From Name</Label>
                  <Input
                    value={emailFromName}
                    onChange={(e) => {
                      setEmailFromName(e.target.value);
                      handleChange();
                    }}
                    className="rounded-none"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">From Address</Label>
                  <Input
                    type="email"
                    value={emailFromAddress}
                    onChange={(e) => {
                      setEmailFromAddress(e.target.value);
                      handleChange();
                    }}
                    className="rounded-none"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Reply-To Address</Label>
                  <Input
                    type="email"
                    defaultValue="support@gestalt.io"
                    className="rounded-none"
                  />
                </div>
                <Button variant="outline" className="rounded-none w-full">
                  Send Test Email
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure automated email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border">
                  <div>
                    <Label>Welcome Email</Label>
                    <p className="text-xs text-muted-foreground">
                      Send to new agency signups
                    </p>
                  </div>
                  <Switch
                    checked={welcomeEmailEnabled}
                    onCheckedChange={(v) => {
                      setWelcomeEmailEnabled(v);
                      handleChange();
                    }}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border border-border">
                  <div>
                    <Label>Weekly Digest</Label>
                    <p className="text-xs text-muted-foreground">
                      Platform summary every Monday
                    </p>
                  </div>
                  <Switch
                    checked={weeklyDigestEnabled}
                    onCheckedChange={(v) => {
                      setWeeklyDigestEnabled(v);
                      handleChange();
                    }}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border border-border">
                  <div>
                    <Label>Payment Receipts</Label>
                    <p className="text-xs text-muted-foreground">
                      Send after successful payments
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border border-border">
                  <div>
                    <Label>Failed Payment Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify on payment failures
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Flags */}
        <TabsContent value="features" className="space-y-6">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Feature Flags
              </CardTitle>
              <CardDescription>
                Enable or disable platform features globally
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[hsl(var(--hq-accent))]/10">
                    <Zap className="w-5 h-5 text-[hsl(var(--hq-accent))]" />
                  </div>
                  <div>
                    <Label className="text-base">Beta Features</Label>
                    <p className="text-sm text-muted-foreground">
                      Show beta features to all users
                    </p>
                  </div>
                </div>
                <Switch
                  checked={betaFeatures}
                  onCheckedChange={(v) => {
                    setBetaFeatures(v);
                    handleChange();
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-red-500/30 bg-red-500/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-500/10">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Show maintenance page to all non-admin users
                    </p>
                  </div>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={(v) => {
                    setMaintenanceMode(v);
                    handleChange();
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/10">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <Label className="text-base">New Signups</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new agency registrations
                    </p>
                  </div>
                </div>
                <Switch
                  checked={signupsEnabled}
                  onCheckedChange={(v) => {
                    setSignupsEnabled(v);
                    handleChange();
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10">
                    <Key className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <Label className="text-base">API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable public API endpoints
                    </p>
                  </div>
                </div>
                <Switch
                  checked={apiAccessEnabled}
                  onCheckedChange={(v) => {
                    setApiAccessEnabled(v);
                    handleChange();
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage platform API keys
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Production API Key</Label>
                    <Badge variant="outline" className="rounded-none">Live</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                      readOnly
                      className="rounded-none font-mono text-sm"
                    />
                    <Button variant="outline" size="sm" className="rounded-none">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created Jan 1, 2026 • Last used 2 hours ago
                  </p>
                </div>

                <div className="p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Test API Key</Label>
                    <Badge variant="outline" className="rounded-none text-yellow-500 border-yellow-500">
                      Test
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      value="sk_test_xxxxxxxxxxxxxxxxxxxxxxxx"
                      readOnly
                      className="rounded-none font-mono text-sm"
                    />
                    <Button variant="outline" size="sm" className="rounded-none">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created Jan 1, 2026 • Last used 5 minutes ago
                  </p>
                </div>

                <Button variant="outline" className="rounded-none w-full">
                  Regenerate Keys
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Webhooks
                </CardTitle>
                <CardDescription>
                  Configure webhook endpoints for events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">Webhook URL</Label>
                  <Input
                    placeholder="https://your-server.com/webhook"
                    className="rounded-none"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Events</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked id="agency.created" />
                      <Label htmlFor="agency.created" className="text-sm">agency.created</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked id="subscription.updated" />
                      <Label htmlFor="subscription.updated" className="text-sm">subscription.updated</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="payment.failed" />
                      <Label htmlFor="payment.failed" className="text-sm">payment.failed</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="assessment.completed" />
                      <Label htmlFor="assessment.completed" className="text-sm">assessment.completed</Label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-none flex-1">
                    Test Webhook
                  </Button>
                  <Button className="rounded-none flex-1 bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90">
                    Save Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5" />
                Rate Limits
              </CardTitle>
              <CardDescription>
                Configure API rate limiting per plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border border-border">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Free Plan
                  </Label>
                  <div className="mt-2">
                    <Input defaultValue="100" className="rounded-none" />
                    <p className="text-xs text-muted-foreground mt-1">
                      requests per minute
                    </p>
                  </div>
                </div>
                <div className="p-4 border border-border">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Pro Plan
                  </Label>
                  <div className="mt-2">
                    <Input defaultValue="1000" className="rounded-none" />
                    <p className="text-xs text-muted-foreground mt-1">
                      requests per minute
                    </p>
                  </div>
                </div>
                <div className="p-4 border border-border">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Enterprise Plan
                  </Label>
                  <div className="mt-2">
                    <Input defaultValue="5000" className="rounded-none" />
                    <p className="text-xs text-muted-foreground mt-1">
                      requests per minute
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
