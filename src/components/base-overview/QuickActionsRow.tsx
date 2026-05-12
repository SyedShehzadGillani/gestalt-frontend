import { Play, Eye, History, Download, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAction {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  isPrimary?: boolean;
  buttonLabel: string;
}

const quickActions: QuickAction[] = [
  {
    id: "framework",
    icon: Play,
    title: "Run New Assessment",
    description: "Start the FRAMEWORK 21-PT Assessment",
    isPrimary: true,
    buttonLabel: "Start Assessment",
  },
  {
    id: "blindspots",
    icon: Eye,
    title: "View Blindspots",
    description: "See identified gaps",
    buttonLabel: "View Gaps",
  },
  {
    id: "history",
    icon: History,
    title: "Compare History",
    description: "Track progress over time",
    buttonLabel: "View History",
  },
  {
    id: "export",
    icon: Download,
    title: "Export Report",
    description: "Download PDF summary",
    buttonLabel: "Download",
  },
];

interface QuickActionsRowProps {
  onNavigate?: (itemId: string) => void;
}

export function QuickActionsRow({ onNavigate }: QuickActionsRowProps) {
  const handleAction = (actionId: string) => {
    if (onNavigate) {
      onNavigate(actionId);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-6">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <div
            key={action.title}
            className="bg-card border border-border p-4 md:p-5 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 flex items-center justify-center ${
                action.isPrimary ? "bg-gold-dim" : "bg-muted"
              }`}>
                <Icon className={`w-5 h-5 ${action.isPrimary ? "text-gold" : "text-foreground-muted"}`} />
              </div>
              <div>
                <div className="text-[12px] md:text-[13px] font-medium text-foreground">
                  {action.title}
                </div>
                <div className="text-[10px] md:text-[11px] text-foreground-secondary">
                  {action.description}
                </div>
              </div>
            </div>
            <Button
              variant={action.isPrimary ? "default" : "secondary"}
              size="sm"
              onClick={() => handleAction(action.id)}
              className={`mt-auto ${
                action.isPrimary
                  ? "bg-gold text-primary-foreground hover:bg-gold/90"
                  : ""
              }`}
            >
              {action.buttonLabel}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
