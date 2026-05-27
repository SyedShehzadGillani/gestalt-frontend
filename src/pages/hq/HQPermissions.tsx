import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Shield,
  Check,
  X,
  Search,
  Edit2,
  Plus,
  Trash2,
  Sparkles,
  Crown,
  Building2,
  Zap,
  HardDrive,
  DollarSign,
  AlertCircle,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionTier {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  icon: "shield" | "zap" | "crown" | "building";
  isPopular: boolean;
  isFounding: boolean;
  features: { name: string; included: boolean }[];
}

interface FeatureFlag {
  id: string;
  name: string;
  foundingStandard: boolean | string;
  foundingWhiteLabel: boolean | string;
  regularStandard: boolean | string;
  regularWhiteLabel: boolean | string;
  status: "enabled" | "beta" | "disabled";
}

interface CustomOverride {
  id: string;
  agencyName: string;
  plan: string;
  feature: string;
  type: "add" | "remove";
}

interface StorageConfig {
  pricePerUnit: number;
  unitSizeGB: number;
  maxStorageGB: number;
}

const initialTiers: SubscriptionTier[] = [
  {
    id: "founding-standard",
    name: "Founding Standard",
    subtitle: "FOUNDING STANDARD",
    price: 797,
    icon: "shield",
    isPopular: false,
    isFounding: true,
    features: [
      { name: "All Phase 1 modules", included: true },
      { name: "Standard GESTALT INTELLIGENCE (75 queries/mo)", included: true },
      { name: "Up to 3 admin seats", included: true },
      { name: "5GB VAULT storage", included: true },
      { name: "Founding pricing — locked permanently", included: true },
      { name: "White-label referral model", included: false },
      { name: "Agency command center", included: false },
    ],
  },
  {
    id: "founding-whitelabel",
    name: "Founding White Label",
    subtitle: "FOUNDING WHITE LABEL",
    price: 997,
    icon: "zap",
    isPopular: false,
    isFounding: true,
    features: [
      { name: "Everything in Founding Standard", included: true },
      { name: "White-label referral model", included: true },
      { name: "Agency command center", included: true },
      { name: "5GB VAULT storage", included: true },
      { name: "Founding pricing — locked permanently", included: true },
    ],
  },
  {
    id: "regular-standard",
    name: "Regular Standard",
    subtitle: "REGULAR STANDARD",
    price: 997,
    icon: "crown",
    isPopular: true,
    isFounding: false,
    features: [
      { name: "Everything in Founding Standard", included: true },
      { name: "10GB VAULT storage", included: true },
      { name: "10% off with annual billing", included: true },
      { name: "Post-launch standard rate", included: true },
      { name: "White-label referral model", included: false },
      { name: "Agency command center", included: false },
    ],
  },
  {
    id: "regular-whitelabel",
    name: "Regular White Label",
    subtitle: "REGULAR WHITE LABEL",
    price: 1497,
    icon: "building",
    isPopular: false,
    isFounding: false,
    features: [
      { name: "Everything in Regular Standard", included: true },
      { name: "White-label agency features", included: true },
      { name: "25GB VAULT storage", included: true },
      { name: "10% off with annual billing", included: true },
    ],
  },
];

const initialFeatureFlags: FeatureFlag[] = [
  { id: "1", name: "21-PT Framework", foundingStandard: true, foundingWhiteLabel: true, regularStandard: true, regularWhiteLabel: true, status: "enabled" },
  { id: "2", name: "100-PT FOCUS", foundingStandard: true, foundingWhiteLabel: true, regularStandard: true, regularWhiteLabel: true, status: "enabled" },
  { id: "3", name: "FORMULA", foundingStandard: true, foundingWhiteLabel: true, regularStandard: true, regularWhiteLabel: true, status: "enabled" },
  { id: "4", name: "H.I.V.E.", foundingStandard: true, foundingWhiteLabel: true, regularStandard: true, regularWhiteLabel: true, status: "enabled" },
  { id: "5", name: "S.U.M. Chat", foundingStandard: true, foundingWhiteLabel: true, regularStandard: true, regularWhiteLabel: true, status: "enabled" },
  { id: "6", name: "VAULT Storage", foundingStandard: "5GB", foundingWhiteLabel: "5GB", regularStandard: "10GB", regularWhiteLabel: "25GB", status: "enabled" },
  { id: "7", name: "GESTALT INTELLIGENCE", foundingStandard: "75 queries/mo", foundingWhiteLabel: "75 queries/mo", regularStandard: "75 queries/mo", regularWhiteLabel: "75 queries/mo", status: "enabled" },
  { id: "8", name: "White Label", foundingStandard: false, foundingWhiteLabel: true, regularStandard: false, regularWhiteLabel: true, status: "enabled" },
  { id: "9", name: "Agency Command Center", foundingStandard: false, foundingWhiteLabel: true, regularStandard: false, regularWhiteLabel: true, status: "enabled" },
  { id: "10", name: "Admin Seats", foundingStandard: "3", foundingWhiteLabel: "3", regularStandard: "3", regularWhiteLabel: "3", status: "enabled" },
];

const mockOverrides: CustomOverride[] = [
  { id: "1", agencyName: "Pixel Perfect", plan: "pro", feature: "API Access", type: "add" },
  { id: "2", agencyName: "Brand Architects", plan: "pro", feature: "White Label", type: "add" },
  { id: "3", agencyName: "Growth Labs", plan: "enterprise", feature: "Unlimited assessments", type: "remove" },
];

const mockAgencies = [
  { id: "1", name: "Pixel Perfect", plan: "pro" },
  { id: "2", name: "Brand Architects", plan: "pro" },
  { id: "3", name: "Growth Labs", plan: "enterprise" },
  { id: "4", name: "Summit Strategy", plan: "pro" },
  { id: "5", name: "Elevate Agency", plan: "free" },
  { id: "6", name: "Spark Digital", plan: "pro" },
  { id: "7", name: "Visionary Group", plan: "enterprise" },
  { id: "8", name: "Nova Agency", plan: "pro" },
];

const availableFeatures = [
  "API Access",
  "White Label",
  "Priority Support",
  "100-PT FOCUS",
  "FORMULA",
  "Unlimited assessments",
  "Unlimited clients",
  "100GB Vault storage",
];

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  zap: Zap,
  crown: Crown,
  building: Building2,
};

function SortablePlanCard({
  tier,
  onEdit,
  onDelete,
  canDelete,
}: {
  tier: SubscriptionTier;
  onEdit: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tier.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = iconMap[tier.icon];
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border ${tier.isPopular ? "border-hq-purple" : "border-border"} relative`}
    >
      {tier.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-hq-purple text-white border-0 rounded-none text-[10px] uppercase tracking-wider">
            Popular
          </Badge>
        </div>
      )}
      
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 flex items-center justify-center ${
            tier.isPopular ? "bg-hq-purple-dim border-hq-purple/30" : "bg-muted border-border"
          } border`}>
            <Icon className={`w-5 h-5 ${tier.isPopular ? "text-hq-purple" : "text-muted-foreground"}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
            <p className="text-2xl font-light text-foreground">
              ${tier.price.toLocaleString()}<span className="text-sm text-muted-foreground">/mo</span>
            </p>
          </div>
        </div>

        <div className="space-y-2.5 mb-6 max-h-[200px] overflow-y-auto">
          {tier.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {feature.included ? (
                <div className="w-4 h-4 bg-[hsl(var(--status-green))]/20 border border-[hsl(var(--status-green))]/30 flex items-center justify-center">
                  <Check className="w-3 h-3 text-[hsl(var(--status-green))]" />
                </div>
              ) : (
                <div className="w-4 h-4 bg-muted border border-border flex items-center justify-center">
                  <X className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
              <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit} className="flex-1 rounded-none gap-2">
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
          {canDelete && (
            <Button 
              variant="outline" 
              onClick={onDelete} 
              className="rounded-none text-[hsl(var(--status-red))] hover:text-[hsl(var(--status-red))] hover:bg-[hsl(var(--status-red))]/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HQPermissions() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>(initialTiers);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(initialFeatureFlags);
  const [overrides, setOverrides] = useState<CustomOverride[]>(mockOverrides);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOverrideOpen, setIsAddOverrideOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [isAddTierOpen, setIsAddTierOpen] = useState(false);
  const [isStorageConfigOpen, setIsStorageConfigOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null);
  const { toast } = useToast();

  const [storageConfig, setStorageConfig] = useState<StorageConfig>({
    pricePerUnit: 20,
    unitSizeGB: 20,
    maxStorageGB: 500,
  });

  const [newTier, setNewTier] = useState({
    name: "",
    price: 0,
    icon: "shield" as "shield" | "zap" | "crown",
    isPopular: false,
  });

  const [newOverride, setNewOverride] = useState({
    agencyId: "",
    feature: "",
    type: "add" as "add" | "remove",
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTiers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      toast({ title: "Tier order updated" });
    }
  };

  const filteredOverrides = overrides.filter((o) =>
    o.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.feature.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOverride = () => {
    const agency = mockAgencies.find((a) => a.id === newOverride.agencyId);
    if (!agency) return;

    const override: CustomOverride = {
      id: String(Date.now()),
      agencyName: agency.name,
      plan: agency.plan,
      feature: newOverride.feature,
      type: newOverride.type,
    };

    setOverrides([...overrides, override]);
    setIsAddOverrideOpen(false);
    setNewOverride({ agencyId: "", feature: "", type: "add" });
    toast({
      title: "Override added",
      description: `${override.type === "add" ? "+" : "-"}${override.feature} for ${override.agencyName}`,
    });
  };

  const handleDeleteOverride = (id: string) => {
    setOverrides(overrides.filter((o) => o.id !== id));
    toast({ title: "Override removed" });
  };

  const handleEditPlan = (tier: SubscriptionTier) => {
    setEditingTier({ ...tier });
    setIsEditPlanOpen(true);
  };

  const handleSavePlan = () => {
    if (!editingTier) return;
    setTiers(tiers.map(t => t.id === editingTier.id ? editingTier : t));
    setIsEditPlanOpen(false);
    setEditingTier(null);
    toast({ title: "Plan updated", description: `${editingTier.name} has been saved.` });
  };

  const handleDeleteTier = (tierId: string) => {
    if (tiers.length <= 1) {
      toast({ title: "Cannot delete", description: "At least one tier must exist.", variant: "destructive" });
      return;
    }
    setTiers(tiers.filter(t => t.id !== tierId));
    toast({ title: "Tier deleted" });
  };

  const handleAddTier = () => {
    const tier: SubscriptionTier = {
      id: `tier-${Date.now()}`,
      name: newTier.name,
      subtitle: newTier.name.toUpperCase(),
      price: newTier.price,
      icon: newTier.icon,
      isPopular: newTier.isPopular,
      isFounding: false,
      features: [
        { name: "Basic features", included: true },
      ],
    };
    setTiers([...tiers, tier]);
    setIsAddTierOpen(false);
    setNewTier({ name: "", price: 0, icon: "shield", isPopular: false });
    toast({ title: "Tier added", description: `${tier.name} has been created.` });
  };

  const handleSaveStorageConfig = () => {
    setIsStorageConfigOpen(false);
    toast({ title: "Storage pricing updated", description: `$${storageConfig.pricePerUnit} per ${storageConfig.unitSizeGB}GB, max ${storageConfig.maxStorageGB}GB` });
  };

  const handleToggleFeature = (featureIndex: number) => {
    if (!editingTier) return;
    const updatedFeatures = [...editingTier.features];
    updatedFeatures[featureIndex] = {
      ...updatedFeatures[featureIndex],
      included: !updatedFeatures[featureIndex].included,
    };
    setEditingTier({ ...editingTier, features: updatedFeatures });
  };

  const handleAddFeatureToTier = () => {
    if (!editingTier) return;
    setEditingTier({
      ...editingTier,
      features: [...editingTier.features, { name: "New feature", included: true }],
    });
  };

  const handleRemoveFeatureFromTier = (index: number) => {
    if (!editingTier) return;
    const updatedFeatures = editingTier.features.filter((_, i) => i !== index);
    setEditingTier({ ...editingTier, features: updatedFeatures });
  };

  const handleUpdateFeatureName = (index: number, name: string) => {
    if (!editingTier) return;
    const updatedFeatures = [...editingTier.features];
    updatedFeatures[index] = { ...updatedFeatures[index], name };
    setEditingTier({ ...editingTier, features: updatedFeatures });
  };

  // Toggle feature flag for a specific tier
  const handleToggleFeatureFlag = (flagId: string, tier: "foundingStandard" | "foundingWhiteLabel" | "regularStandard" | "regularWhiteLabel") => {
    setFeatureFlags(flags => flags.map(flag => {
      if (flag.id !== flagId) return flag;
      const currentValue = flag[tier];
      if (typeof currentValue === "string") return flag;
      return { ...flag, [tier]: !currentValue };
    }));
    toast({ title: "Feature flag updated" });
  };

  // Toggle feature flag status
  const handleToggleFeatureFlagStatus = (flagId: string) => {
    setFeatureFlags(flags => flags.map(flag => {
      if (flag.id !== flagId) return flag;
      const statusOrder: ("enabled" | "beta" | "disabled")[] = ["enabled", "beta", "disabled"];
      const currentIndex = statusOrder.indexOf(flag.status);
      const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      return { ...flag, status: nextStatus };
    }));
    toast({ title: "Feature status updated" });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Permissions & Access Control</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage what each subscription tier can access</p>
      </div>

      {/* Section 1: Subscription Tiers with Drag & Drop */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Subscription Tiers</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Drag to reorder display position</p>
          </div>
          <Button onClick={() => setIsAddTierOpen(true)} className="gap-2 bg-hq-purple hover:bg-hq-purple/90 rounded-none">
            <Plus className="w-4 h-4" />
            Add Tier
          </Button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tiers.map(t => t.id)} strategy={horizontalListSortingStrategy}>
            <div className={`grid gap-6 ${tiers.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {tiers.map((tier) => (
                <SortablePlanCard
                  key={tier.id}
                  tier={tier}
                  onEdit={() => handleEditPlan(tier)}
                  onDelete={() => handleDeleteTier(tier.id)}
                  canDelete={tiers.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <p className="text-[8px] mt-4" style={{ color: "#ba702a" }}>
          ⚠ One missed payment permanently removes Founding pricing — no reinstatement.
        </p>
      </div>

      {/* Section 2: Storage Pricing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Storage Pricing</h2>
          <Button 
            variant="outline" 
            onClick={() => setIsStorageConfigOpen(true)} 
            className="gap-2 rounded-none"
          >
            <Edit2 className="w-4 h-4" />
            Configure
          </Button>
        </div>
        <div className="bg-card border border-border p-6">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-hq-purple-dim border border-hq-purple/30 flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-hq-purple" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">VAULT Storage Pricing</h3>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Founding Tiers</p>
                  <p className="text-2xl font-light text-foreground">5GB</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Regular Standard</p>
                  <p className="text-2xl font-light text-foreground">10GB</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Agency / White Label</p>
                  <p className="text-2xl font-light text-foreground">25GB</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Add-on</p>
                  <p className="text-2xl font-light text-foreground">
                    +$20<span className="text-sm text-muted-foreground"> / 20GB</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Feature Flags Table (Editable) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Feature Flags</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Click toggles to enable/disable features per tier</p>
        </div>
        <div className="bg-card border border-border">
          <Table>
             <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Feature</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide text-center">Founding Std</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide text-center">Founding WL</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide text-center">Regular Std</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide text-center">Regular WL</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {featureFlags.map((flag) => (
                <TableRow key={flag.id} className="border-border hover:bg-muted/30">
                  <TableCell>
                    <span className="text-sm font-medium text-foreground">{flag.name}</span>
                  </TableCell>
                  {(["foundingStandard", "foundingWhiteLabel", "regularStandard", "regularWhiteLabel"] as const).map((tier) => (
                    <TableCell key={tier} className="text-center">
                      {typeof flag[tier] === "string" ? (
                        <span className="text-sm text-muted-foreground">{flag[tier]}</span>
                      ) : (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={flag[tier] as boolean}
                          onClick={() => handleToggleFeatureFlag(flag.id, tier)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors mx-auto ${
                            flag[tier]
                              ? "bg-[hsl(var(--status-green))] border-[hsl(var(--status-green))]"
                              : "bg-muted border-border"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                              flag[tier] ? "translate-x-[18px]" : "translate-x-[2px]"
                            }`}
                          />
                        </button>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatureFlagStatus(flag.id)}
                      className="p-0 h-auto"
                    >
                      <Badge
                        variant="outline"
                        className={`rounded-none text-[10px] cursor-pointer ${
                          flag.status === "enabled"
                            ? "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))] border-[hsl(var(--status-green))]/30"
                            : flag.status === "beta"
                            ? "bg-[hsl(var(--status-purple))]/20 text-[hsl(var(--status-purple))] border-[hsl(var(--status-purple))]/30"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {flag.status === "enabled" ? "Enabled" : flag.status === "beta" ? "Beta" : "Disabled"}
                      </Badge>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Section 4: Custom Overrides */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Custom Overrides</h2>
            <p className="text-xs text-muted-foreground mt-1">For agencies needing custom access beyond their plan</p>
          </div>
          <Button onClick={() => setIsAddOverrideOpen(true)} className="gap-2 bg-hq-purple hover:bg-hq-purple/90 rounded-none">
            <Plus className="w-4 h-4" />
            Add Override
          </Button>
        </div>

        <div className="bg-card border border-border">
          <div className="p-4 border-b border-border">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search overrides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background border-border rounded-none"
              />
            </div>
          </div>

          {filteredOverrides.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Agency</TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Current Plan</TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Override</TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOverrides.map((override) => (
                  <TableRow key={override.id} className="border-border hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{override.agencyName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-none text-[10px] capitalize ${
                          override.plan === "enterprise"
                            ? "bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] border-[hsl(var(--primary))]/30"
                            : override.plan === "pro"
                            ? "bg-hq-purple-dim text-hq-purple border-hq-purple/30"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {override.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`rounded-none text-[10px] ${
                            override.type === "add"
                              ? "bg-[hsl(var(--status-green))]/20 text-[hsl(var(--status-green))] border-[hsl(var(--status-green))]/30"
                              : "bg-[hsl(var(--status-red))]/20 text-[hsl(var(--status-red))] border-[hsl(var(--status-red))]/30"
                          }`}
                        >
                          {override.type === "add" ? "+" : "−"}
                        </Badge>
                        <span className="text-sm text-foreground">{override.feature}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-[hsl(var(--status-red))]"
                        onClick={() => handleDeleteOverride(override.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No custom overrides configured</p>
              <p className="text-xs text-muted-foreground mt-1">Add overrides to grant or restrict features for specific agencies</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Override Modal */}
      <Dialog open={isAddOverrideOpen} onOpenChange={setIsAddOverrideOpen}>
        <DialogContent className="bg-card border-border max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">Add Custom Override</DialogTitle>
            <DialogDescription>Grant or restrict a feature for a specific agency</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs">Agency</Label>
              <Select value={newOverride.agencyId} onValueChange={(v) => setNewOverride({ ...newOverride, agencyId: v })}>
                <SelectTrigger className="bg-background border-border rounded-none">
                  <SelectValue placeholder="Select agency..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-none">
                  {mockAgencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      <div className="flex items-center gap-2">
                        <span>{agency.name}</span>
                        <Badge variant="outline" className="rounded-none text-[9px] capitalize">
                          {agency.plan}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Feature</Label>
              <Select value={newOverride.feature} onValueChange={(v) => setNewOverride({ ...newOverride, feature: v })}>
                <SelectTrigger className="bg-background border-border rounded-none">
                  <SelectValue placeholder="Select feature..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-none">
                  {availableFeatures.map((feature) => (
                    <SelectItem key={feature} value={feature}>
                      {feature}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Override Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={newOverride.type === "add"}
                    onCheckedChange={() => setNewOverride({ ...newOverride, type: "add" })}
                  />
                  <span className="text-sm text-[hsl(var(--status-green))]">+ Add feature</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={newOverride.type === "remove"}
                    onCheckedChange={() => setNewOverride({ ...newOverride, type: "remove" })}
                  />
                  <span className="text-sm text-[hsl(var(--status-red))]">− Remove feature</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOverrideOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button
              onClick={handleAddOverride}
              className="rounded-none gap-2 bg-hq-purple hover:bg-hq-purple/90"
              disabled={!newOverride.agencyId || !newOverride.feature}
            >
              <Plus className="w-4 h-4" />
              Add Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
        <DialogContent className="bg-card border-border max-w-lg rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Edit Subscription Tier
            </DialogTitle>
            <DialogDescription>Configure the name, price, and features for this tier</DialogDescription>
          </DialogHeader>

          {editingTier && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Tier Name</Label>
                  <Input
                    value={editingTier.name}
                    onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                    className="bg-background border-border rounded-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Price ($/month)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={editingTier.price}
                      onChange={(e) => setEditingTier({ ...editingTier, price: Number(e.target.value) })}
                      className="bg-background border-border rounded-none pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Icon</Label>
                  <Select 
                    value={editingTier.icon} 
                    onValueChange={(v: "shield" | "zap" | "crown") => setEditingTier({ ...editingTier, icon: v })}
                  >
                    <SelectTrigger className="bg-background border-border rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border rounded-none">
                      <SelectItem value="shield">Shield</SelectItem>
                      <SelectItem value="zap">Zap</SelectItem>
                      <SelectItem value="crown">Crown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Mark as Popular</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Checkbox
                      checked={editingTier.isPopular}
                      onCheckedChange={(checked) => setEditingTier({ ...editingTier, isPopular: !!checked })}
                    />
                    <span className="text-sm text-muted-foreground">Show "Popular" badge</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Features</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAddFeatureToTier}
                    className="text-xs text-hq-purple hover:text-hq-purple"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Feature
                  </Button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {editingTier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 border border-border bg-background">
                      <Checkbox
                        checked={feature.included}
                        onCheckedChange={() => handleToggleFeature(idx)}
                      />
                      <Input
                        value={feature.name}
                        onChange={(e) => handleUpdateFeatureName(idx, e.target.value)}
                        className="flex-1 h-8 bg-transparent border-0 focus-visible:ring-0 px-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-[hsl(var(--status-red))]"
                        onClick={() => handleRemoveFeatureFromTier(idx)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditPlanOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button
              onClick={handleSavePlan}
              className="rounded-none bg-hq-purple hover:bg-hq-purple/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tier Modal */}
      <Dialog open={isAddTierOpen} onOpenChange={setIsAddTierOpen}>
        <DialogContent className="bg-card border-border max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">Add Subscription Tier</DialogTitle>
            <DialogDescription>Create a new subscription tier</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs">Tier Name</Label>
              <Input
                value={newTier.name}
                onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                placeholder="e.g., Business Plan"
                className="bg-background border-border rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Price ($/month)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={newTier.price}
                  onChange={(e) => setNewTier({ ...newTier, price: Number(e.target.value) })}
                  className="bg-background border-border rounded-none pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Icon</Label>
              <Select 
                value={newTier.icon} 
                onValueChange={(v: "shield" | "zap" | "crown") => setNewTier({ ...newTier, icon: v })}
              >
                <SelectTrigger className="bg-background border-border rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-none">
                  <SelectItem value="shield">Shield</SelectItem>
                  <SelectItem value="zap">Zap</SelectItem>
                  <SelectItem value="crown">Crown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={newTier.isPopular}
                onCheckedChange={(checked) => setNewTier({ ...newTier, isPopular: !!checked })}
              />
              <span className="text-sm text-muted-foreground">Mark as Popular</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddTierOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button
              onClick={handleAddTier}
              className="rounded-none gap-2 bg-hq-purple hover:bg-hq-purple/90"
              disabled={!newTier.name}
            >
              <Plus className="w-4 h-4" />
              Add Tier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Storage Config Modal */}
      <Dialog open={isStorageConfigOpen} onOpenChange={setIsStorageConfigOpen}>
        <DialogContent className="bg-card border-border max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">Storage Pricing Configuration</DialogTitle>
            <DialogDescription>Set the volume storage pricing and limits</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Price per Unit ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={storageConfig.pricePerUnit}
                    onChange={(e) => setStorageConfig({ ...storageConfig, pricePerUnit: Number(e.target.value) })}
                    className="bg-background border-border rounded-none pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Unit Size (GB)</Label>
                <div className="relative">
                  <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={storageConfig.unitSizeGB}
                    onChange={(e) => setStorageConfig({ ...storageConfig, unitSizeGB: Number(e.target.value) })}
                    className="bg-background border-border rounded-none pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Maximum Storage Cap (GB)</Label>
              <div className="relative">
                <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={storageConfig.maxStorageGB}
                  onChange={(e) => setStorageConfig({ ...storageConfig, maxStorageGB: Number(e.target.value) })}
                  className="bg-background border-border rounded-none pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">Users exceeding this limit will be prompted to contact sales</p>
            </div>

            <div className="p-3 bg-muted/50 border border-border">
              <p className="text-sm text-foreground font-medium">Pricing Summary</p>
              <p className="text-xs text-muted-foreground mt-1">
                ${storageConfig.pricePerUnit} per {storageConfig.unitSizeGB}GB block, up to {storageConfig.maxStorageGB}GB maximum
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsStorageConfigOpen(false)} className="rounded-none">
              Cancel
            </Button>
            <Button
              onClick={handleSaveStorageConfig}
              className="rounded-none bg-hq-purple hover:bg-hq-purple/90"
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
