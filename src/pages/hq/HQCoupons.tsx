import { useState } from "react";
import {
  Ticket,
  Plus,
  Search,
  Calendar,
  Percent,
  DollarSign,
  Users,
  Copy,
  Trash2,
  Edit2,
  Pause,
  Play,
  Check,
  RefreshCw,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  appliesTo: ("free" | "pro" | "enterprise")[];
  paymentScope: "first" | "first_x" | "forever";
  paymentScopeMonths?: number;
  usageCount: number;
  maxRedemptions: number | null;
  maxPerCustomer: number;
  startDate: string;
  endDate: string | null;
  status: "active" | "expired" | "maxed" | "paused";
}

const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "LAUNCH50",
    name: "Launch Special",
    description: "Special launch promotion for early adopters",
    discountType: "percentage",
    discountValue: 50,
    appliesTo: ["pro", "enterprise"],
    paymentScope: "first",
    usageCount: 45,
    maxRedemptions: 100,
    maxPerCustomer: 1,
    startDate: "2024-01-01",
    endDate: "2026-03-31",
    status: "active",
  },
  {
    id: "2",
    code: "PARTNER20",
    name: "Partner Program",
    description: "Discount for partner agencies",
    discountType: "percentage",
    discountValue: 20,
    appliesTo: ["pro", "enterprise"],
    paymentScope: "forever",
    usageCount: 12,
    maxRedemptions: null,
    maxPerCustomer: 1,
    startDate: "2024-01-01",
    endDate: null,
    status: "active",
  },
  {
    id: "3",
    code: "ANNUAL25",
    name: "Annual Discount",
    description: "25% off first year for annual subscriptions",
    discountType: "percentage",
    discountValue: 25,
    appliesTo: ["pro", "enterprise"],
    paymentScope: "first_x",
    paymentScopeMonths: 12,
    usageCount: 28,
    maxRedemptions: 50,
    maxPerCustomer: 1,
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    status: "active",
  },
  {
    id: "4",
    code: "FRIEND10",
    name: "Referral Bonus",
    description: "$10 off for referred customers",
    discountType: "fixed",
    discountValue: 10,
    appliesTo: ["pro"],
    paymentScope: "first",
    usageCount: 42,
    maxRedemptions: null,
    maxPerCustomer: 1,
    startDate: "2024-01-01",
    endDate: null,
    status: "active",
  },
  {
    id: "5",
    code: "WELCOME15",
    name: "Welcome Offer",
    description: "Welcome discount for new users",
    discountType: "percentage",
    discountValue: 15,
    appliesTo: ["pro"],
    paymentScope: "first_x",
    paymentScopeMonths: 3,
    usageCount: 67,
    maxRedemptions: 200,
    maxPerCustomer: 1,
    startDate: "2024-01-01",
    endDate: "2026-06-30",
    status: "active",
  },
  {
    id: "6",
    code: "BETA100",
    name: "Beta Special",
    description: "Free access for beta testers",
    discountType: "percentage",
    discountValue: 100,
    appliesTo: ["pro"],
    paymentScope: "first_x",
    paymentScopeMonths: 3,
    usageCount: 15,
    maxRedemptions: 15,
    maxPerCustomer: 1,
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    status: "maxed",
  },
  {
    id: "7",
    code: "HOLIDAY30",
    name: "Holiday Sale",
    description: "Holiday season promotion",
    discountType: "percentage",
    discountValue: 30,
    appliesTo: ["pro", "enterprise"],
    paymentScope: "first",
    usageCount: 89,
    maxRedemptions: 100,
    maxPerCustomer: 1,
    startDate: "2024-12-01",
    endDate: "2026-01-01",
    status: "expired",
  },
  {
    id: "8",
    code: "VIP50",
    name: "VIP Client",
    description: "Special discount for VIP clients",
    discountType: "percentage",
    discountValue: 50,
    appliesTo: ["enterprise"],
    paymentScope: "forever",
    usageCount: 3,
    maxRedemptions: 5,
    maxPerCustomer: 1,
    startDate: "2024-01-01",
    endDate: null,
    status: "active",
  },
];

function StatCard({
  icon: Icon,
  title,
  value,
  subValue,
  highlight,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "w-8 h-8 border flex items-center justify-center",
          highlight 
            ? "bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))]/30" 
            : "bg-hq-purple-dim border-hq-purple/30"
        )}>
          <Icon className={cn(
            "w-4 h-4",
            highlight ? "text-[hsl(var(--primary))]" : "text-hq-purple"
          )} />
        </div>
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{title}</span>
      </div>
      <p className={cn(
        "text-[28px] font-light text-foreground",
        highlight && "font-mono text-lg"
      )}>{value}</p>
      {subValue && <p className="text-[11px] text-muted-foreground mt-0.5">{subValue}</p>}
    </div>
  );
}

const getStatusBadgeClass = (status: Coupon["status"]) => {
  switch (status) {
    case "active":
      return "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))] border-[hsl(var(--status-green))]/30";
    case "expired":
      return "bg-[hsl(var(--muted-foreground))]/20 text-[hsl(var(--muted-foreground))] border-[hsl(var(--muted-foreground))]/30";
    case "maxed":
      return "bg-[hsl(var(--status-orange))]/20 text-[hsl(var(--status-orange))] border-[hsl(var(--status-orange))]/30";
    case "paused":
      return "bg-[hsl(var(--status-yellow))]/20 text-[hsl(var(--status-yellow))] border-[hsl(var(--status-yellow))]/30";
  }
};

const getStatusLabel = (status: Coupon["status"]) => {
  switch (status) {
    case "active": return "Active";
    case "expired": return "Expired";
    case "maxed": return "Maxed Out";
    case "paused": return "Paused";
  }
};

const generateRandomCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function HQCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    appliesTo: [] as ("free" | "pro" | "enterprise")[],
    paymentScope: "first" as "first" | "first_x" | "forever",
    paymentScopeMonths: 1,
    maxRedemptions: "",
    maxPerCustomer: 1,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCoupons = coupons.filter((c) => c.status === "active").length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usageCount, 0);
  const discountGiven = 4230;
  const mostPopular = coupons.reduce((max, c) => c.usageCount > max.usageCount ? c : max, coupons[0]);

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: "Copied!",
      description: `Coupon code "${code}" copied to clipboard`,
    });
  };

  const handleCreate = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      appliesTo: [],
      paymentScope: "first",
      paymentScopeMonths: 1,
      maxRedemptions: "",
      maxPerCustomer: 1,
      startDate: undefined,
      endDate: undefined,
    });
    setIsEditing(false);
    setIsCreateOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      appliesTo: coupon.appliesTo,
      paymentScope: coupon.paymentScope,
      paymentScopeMonths: coupon.paymentScopeMonths || 1,
      maxRedemptions: coupon.maxRedemptions?.toString() || "",
      maxPerCustomer: coupon.maxPerCustomer,
      startDate: new Date(coupon.startDate),
      endDate: coupon.endDate ? new Date(coupon.endDate) : undefined,
    });
    setSelectedCoupon(coupon);
    setIsEditing(true);
    setIsCreateOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCoupon) {
      setCoupons(coupons.filter((c) => c.id !== selectedCoupon.id));
      setIsDeleteOpen(false);
      setSelectedCoupon(null);
      toast({ title: "Coupon deleted", description: `${selectedCoupon.code} has been removed.` });
    }
  };

  const handleTogglePause = (coupon: Coupon) => {
    setCoupons(coupons.map((c) =>
      c.id === coupon.id
        ? { ...c, status: c.status === "paused" ? "active" : "paused" }
        : c
    ));
    toast({
      title: coupon.status === "paused" ? "Coupon activated" : "Coupon paused",
      description: `${coupon.code} is now ${coupon.status === "paused" ? "active" : "paused"}.`,
    });
  };

  const handleSave = () => {
    const now = new Date().toISOString().split("T")[0];

    if (isEditing && selectedCoupon) {
      setCoupons(coupons.map((c) =>
        c.id === selectedCoupon.id
          ? {
              ...c,
              code: formData.code,
              name: formData.name,
              description: formData.description,
              discountType: formData.discountType,
              discountValue: formData.discountValue,
              appliesTo: formData.appliesTo,
              paymentScope: formData.paymentScope,
              paymentScopeMonths: formData.paymentScopeMonths,
              maxRedemptions: formData.maxRedemptions ? parseInt(formData.maxRedemptions) : null,
              maxPerCustomer: formData.maxPerCustomer,
              startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : now,
              endDate: formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : null,
            }
          : c
      ));
      toast({ title: "Coupon updated", description: `${formData.code} has been updated.` });
    } else {
      const newCoupon: Coupon = {
        id: String(Date.now()),
        code: formData.code,
        name: formData.name,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        appliesTo: formData.appliesTo,
        paymentScope: formData.paymentScope,
        paymentScopeMonths: formData.paymentScopeMonths,
        usageCount: 0,
        maxRedemptions: formData.maxRedemptions ? parseInt(formData.maxRedemptions) : null,
        maxPerCustomer: formData.maxPerCustomer,
        startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : now,
        endDate: formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : null,
        status: "active",
      };
      setCoupons([newCoupon, ...coupons]);
      toast({ title: "Coupon created", description: `${formData.code} is now active.` });
    }

    setIsCreateOpen(false);
    setSelectedCoupon(null);
  };

  const handlePlanToggle = (plan: "free" | "pro" | "enterprise") => {
    setFormData((prev) => ({
      ...prev,
      appliesTo: prev.appliesTo.includes(plan)
        ? prev.appliesTo.filter((p) => p !== plan)
        : [...prev.appliesTo, plan],
    }));
  };

  const getDiscountPreview = () => {
    const basePrice = 97;
    if (formData.discountType === "percentage") {
      const discounted = basePrice * (1 - formData.discountValue / 100);
      return `Users pay $${discounted.toFixed(2)}/mo instead of $${basePrice}/mo`;
    } else {
      const discounted = Math.max(0, basePrice - formData.discountValue);
      return `Users pay $${discounted.toFixed(2)}/mo instead of $${basePrice}/mo`;
    }
  };

  const getPaymentScopeLabel = (coupon: Coupon) => {
    switch (coupon.paymentScope) {
      case "first": return "First payment";
      case "first_x": return coupon.paymentScopeMonths === 12 ? "First year" : `First ${coupon.paymentScopeMonths} months`;
      case "forever": return "Forever";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Coupon Codes</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px] bg-card border-border rounded-none"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-card border-border rounded-none">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-none">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="maxed">Maxed Out</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreate} className="gap-2 bg-hq-purple hover:bg-hq-purple/90 text-white rounded-none">
            <Plus className="w-4 h-4" />
            Create Coupon
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard icon={Ticket} title="Active Coupons" value={activeCoupons.toString()} />
        <StatCard icon={Users} title="Total Redemptions" value={totalRedemptions.toLocaleString()} subValue="All time" />
        <StatCard icon={DollarSign} title="Discount Given" value={`$${discountGiven.toLocaleString()}`} subValue="This month" />
        <StatCard icon={TrendingUp} title="Most Popular" value={mostPopular.code} subValue={`${mostPopular.usageCount} uses`} highlight />
      </div>

      {/* Coupons Table */}
      <div className="bg-card border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Code</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Name</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Discount</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Applies To</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Usage</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Valid Until</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Status</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id} className="border-border hover:bg-muted/30 group">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="text-[13px] font-mono text-hq-purple font-medium bg-hq-purple-dim px-2 py-0.5">
                      {coupon.code}
                    </code>
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--status-green))]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-foreground">{coupon.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">
                    {coupon.discountType === "percentage" 
                      ? `${coupon.discountValue}% off` 
                      : `$${coupon.discountValue} off`}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      {coupon.appliesTo.map((plan) => (
                        <Badge 
                          key={plan} 
                          variant="outline" 
                          className="rounded-none text-[10px] capitalize px-1.5 py-0"
                        >
                          {plan}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {getPaymentScopeLabel(coupon)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 w-20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{coupon.usageCount}</span>
                      <span className="text-muted-foreground">
                        / {coupon.maxRedemptions ?? "∞"}
                      </span>
                    </div>
                    {coupon.maxRedemptions && (
                      <Progress 
                        value={(coupon.usageCount / coupon.maxRedemptions) * 100} 
                        className="h-1"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[12px] text-muted-foreground">
                    {coupon.endDate ? format(new Date(coupon.endDate), "MMM d, yyyy") : "No expiry"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`rounded-none text-[10px] ${getStatusBadgeClass(coupon.status)}`}>
                    {getStatusLabel(coupon.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    {coupon.status !== "expired" && coupon.status !== "maxed" && (
                      <button
                        onClick={() => handleTogglePause(coupon)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      >
                        {coupon.status === "paused" ? (
                          <Play className="w-3.5 h-3.5 text-[hsl(var(--status-green))]" />
                        ) : (
                          <Pause className="w-3.5 h-3.5 text-[hsl(var(--status-yellow))]" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon)}
                      className="p-1.5 text-muted-foreground hover:text-[hsl(var(--status-red))] hover:bg-[hsl(var(--status-red))]/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-card border-border max-w-2xl rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Ticket className="w-5 h-5 text-hq-purple" />
              {isEditing ? "Edit Coupon" : "Create Coupon"}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the coupon details below." : "Configure the discount settings for your new coupon code."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Basic Info</h3>
              
              <div className="space-y-2">
                <Label className="text-xs">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., SUMMER25"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="bg-background border-border rounded-none font-mono uppercase"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, code: generateRandomCode() })}
                    className="rounded-none gap-2 shrink-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Name (Internal Reference)</Label>
                <Input
                  placeholder="e.g., Summer Sale 2024"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background border-border rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Description (Optional)</Label>
                <Textarea
                  placeholder="Internal notes about this coupon..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-background border-border rounded-none min-h-[60px]"
                />
              </div>
            </div>

            {/* Discount */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Discount</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(v: "percentage" | "fixed") => setFormData({ ...formData, discountType: v })}
                  >
                    <SelectTrigger className="bg-background border-border rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-none">
                      <SelectItem value="percentage">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4" />
                          Percentage
                        </div>
                      </SelectItem>
                      <SelectItem value="fixed">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Fixed Amount
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Value</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      {formData.discountType === "percentage" ? "%" : "$"}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      max={formData.discountType === "percentage" ? 100 : undefined}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                      className="pl-8 bg-background border-border rounded-none"
                    />
                  </div>
                </div>
              </div>

              {formData.discountValue > 0 && (
                <div className="p-3 bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
                    <span className="text-muted-foreground">{getDiscountPreview()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Applies To */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Applies To</h3>
              
              <div className="space-y-3">
                <Label className="text-xs">Plans</Label>
                <div className="flex gap-4">
                  {(["free", "pro", "enterprise"] as const).map((plan) => (
                    <label key={plan} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.appliesTo.includes(plan)}
                        onCheckedChange={() => handlePlanToggle(plan)}
                      />
                      <span className="text-sm capitalize">{plan}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Payment Scope</Label>
                <Select
                  value={formData.paymentScope}
                  onValueChange={(v: "first" | "first_x" | "forever") => setFormData({ ...formData, paymentScope: v })}
                >
                  <SelectTrigger className="bg-background border-border rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-none">
                    <SelectItem value="first">First payment only</SelectItem>
                    <SelectItem value="first_x">First X months</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.paymentScope === "first_x" && (
                <div className="space-y-2">
                  <Label className="text-xs">Number of Months</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.paymentScopeMonths}
                    onChange={(e) => setFormData({ ...formData, paymentScopeMonths: Number(e.target.value) })}
                    className="bg-background border-border rounded-none w-32"
                  />
                </div>
              )}
            </div>

            {/* Limits */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Limits</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Max Total Redemptions</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Unlimited"
                    value={formData.maxRedemptions}
                    onChange={(e) => setFormData({ ...formData, maxRedemptions: e.target.value })}
                    className="bg-background border-border rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Max Per Customer</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.maxPerCustomer}
                    onChange={(e) => setFormData({ ...formData, maxPerCustomer: Number(e.target.value) })}
                    className="bg-background border-border rounded-none"
                  />
                </div>
              </div>
            </div>

            {/* Validity */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Validity</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-none",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 w-4 h-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-none",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 w-4 h-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "No expiry"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData({ ...formData, endDate: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-none gap-2 bg-hq-purple hover:bg-hq-purple/90"
              disabled={!formData.code || !formData.name || formData.appliesTo.length === 0}
            >
              <Ticket className="w-4 h-4" />
              {isEditing ? "Update Coupon" : "Create Coupon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-card border-border max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCoupon?.code}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="rounded-none gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
