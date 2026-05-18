import { Clock, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import gestaltLogo from "@/assets/gestalt-logo.svg";

interface PollWelcomeScreenProps {
  pollType: "framework" | "focus" | "formula";
  clientName: string;
  totalQuestions: number;
  onBegin: () => void;
  onCancel?: () => void;
}

const pollConfig = {
  framework: {
    title: "21-Point Brand Assessment",
    subtitle: "B.A.S.E. Framework",
    description:
      "This assessment evaluates your brand across four critical dimensions: Perception, Clarity, Identity, and Culture. Your honest responses will help identify blindspots and opportunities.",
    estimatedTime: "5-7 minutes",
  },
  focus: {
    title: "100-Point Deep Dive",
    subtitle: "FOCUS Assessment",
    description:
      "A comprehensive analysis of your brand across 100 data points. This deep dive uncovers detailed insights and actionable recommendations for brand optimization.",
    estimatedTime: "20-30 minutes",
  },
  formula: {
    title: "Team Brand Poll",
    subtitle: "FORMULA Strategy Poll",
    description:
      "Gather perspectives from across your organization to understand how your team perceives the brand. Results are aggregated to identify alignment gaps.",
    estimatedTime: "3-5 minutes",
  },
};

export function PollWelcomeScreen({
  pollType,
  clientName,
  totalQuestions,
  onBegin,
  onCancel,
}: PollWelcomeScreenProps) {
  const config = pollConfig[pollType];

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col animate-fade-in px-4 py-8">
      <div className="w-full max-w-[600px] mx-auto text-center" style={{ marginTop: '5vh' }}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={gestaltLogo} alt="GESTALT" className="w-16 h-16 opacity-50 [.light_&]:invert" />
        </div>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-dim border border-gold mb-6">
          <span className="text-[11px] font-bold tracking-[2px] text-gold uppercase">
            {config.subtitle}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[32px] md:text-[40px] font-book text-gold leading-tight mb-4">
          {config.title}
        </h1>

        {/* Client Name */}
        <p className="text-[16px] text-foreground-muted mb-8">
          for <span className="text-foreground font-medium">{clientName}</span>
        </p>

        {/* Description */}
        <p className="text-[14px] text-foreground-muted leading-relaxed mb-10 max-w-[450px] mx-auto">
          {config.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-10">
          <div className="flex items-center gap-2 text-foreground-secondary">
            <Target className="w-4 h-4 text-gold" />
            <span className="text-[13px]">{totalQuestions} Questions</span>
          </div>
          <div className="flex items-center gap-2 text-foreground-secondary">
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-[13px]">{config.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground-secondary">
            <Users className="w-4 h-4 text-gold" />
            <span className="text-[13px]">Timed Responses</span>
          </div>
        </div>

        {/* Begin Button */}
        <Button
          onClick={onBegin}
          className="w-full md:w-auto min-w-[200px] h-14 text-[18px] font-medium tracking-[2px] bg-gold text-primary-foreground hover:bg-gold/90"
        >
          BEGIN ASSESSMENT
        </Button>

        {/* Cancel */}
        {onCancel && (
          <Button
            variant="ghost"
            onClick={onCancel}
            className="mt-4 text-foreground-muted hover:text-foreground"
          >
            Cancel
          </Button>
        )}

        {/* Info */}
        <div className="mt-10 p-4 bg-muted border border-border text-left">
          <p className="text-[12px] text-foreground-muted">
            <span className="text-foreground font-semibold">Note:</span> Your response times are
            measured to gauge confidence. Faster responses indicate higher certainty. Take your
            time if needed—you'll rate your overall confidence at the end.
          </p>
        </div>
      </div>
    </div>
  );
}
