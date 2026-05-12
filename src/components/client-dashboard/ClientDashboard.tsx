import { MessageSquare, FileText, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandHealthSpectrum } from "./BrandHealthSpectrum";
import { CategoryScores } from "./CategoryScores";
import { ActiveProjects } from "./ActiveProjects";
import { AIAnalysis } from "./AIAnalysis";

interface ClientData {
  id: string;
  name: string;
  industry: string;
  status: "healthy" | "warning" | "critical";
  score: number;
}

interface ClientDashboardProps {
  client: ClientData;
}

const statusStyles = {
  healthy: { bg: "bg-success-dim", text: "text-success", label: "HEALTHY" },
  warning: { bg: "bg-warning-dim", text: "text-warning", label: "WARNING" },
  critical: { bg: "bg-red-dim", text: "text-red", label: "CRITICAL" },
};

// Mock data for Meridian Tech
const mockCategoryScores = [
  { name: "PERCEPTION", score: 78 },
  { name: "CLARITY", score: 85 },
  { name: "IDENTITY", score: 72 },
  { name: "CULTURE", score: 88 },
];

const mockProjects = [
  { id: "1", name: "Website Rebrand", status: "in-progress" as const, progress: 65, dueDate: "Feb 15" },
  { id: "2", name: "Brand Guidelines v2", status: "awaiting-signoff" as const, progress: 90, dueDate: "Jan 30" },
  { id: "3", name: "Q1 Marketing Campaign", status: "not-started" as const, progress: 0, dueDate: "Mar 1" },
];

const mockAIAnalysis = {
  date: "January 20, 2026",
  summary:
    "Meridian Tech shows strong brand fundamentals with particular strength in Culture alignment. Primary opportunity exists in Perception category where customer clarity can be improved through targeted messaging updates.",
  findings: [
    "Culture score (88%) indicates excellent internal brand alignment",
    "Perception gap of 10 points vs industry leaders suggests messaging optimization opportunity",
    "Identity consistency improved 8% since last assessment",
  ],
};

export function ClientDashboard({ client }: ClientDashboardProps) {
  const statusStyle = statusStyles[client.status];
  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gold-dim flex items-center justify-center flex-shrink-0">
            <span className="text-[24px] font-semibold text-gold">{initials}</span>
          </div>
          
          {/* Client Info */}
          <div>
            <h1 className="text-[28px] font-semibold text-foreground mb-2">
              {client.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-[12px] px-2 py-1 bg-muted border border-border text-foreground-muted">
                {client.industry}
              </span>
              <span
                className={`text-[9px] font-bold tracking-[1px] px-2 py-1 ${statusStyle.bg} ${statusStyle.text}`}
              >
                {statusStyle.label}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Message
          </Button>
          <Button variant="secondary" className="gap-2">
            <FileText className="w-4 h-4" />
            Create Invoice
          </Button>
          <Button className="gap-2 bg-gold text-primary-foreground hover:bg-gold/90">
            <Play className="w-4 h-4" />
            Run Assessment
          </Button>
        </div>
      </div>

      {/* Brand Health Spectrum */}
      <BrandHealthSpectrum score={client.score} />

      {/* Category Scores */}
      <CategoryScores scores={mockCategoryScores} />

      {/* Two Column Layout */}
      <div className="grid gap-6 mt-6" style={{ gridTemplateColumns: "1fr 400px" }}>
        {/* Left - Active Projects */}
        <ActiveProjects projects={mockProjects} />

        {/* Right - AI Analysis */}
        <AIAnalysis {...mockAIAnalysis} />
      </div>
    </div>
  );
}
