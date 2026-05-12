import * as React from "react";
import { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import type { Slide } from "./PresentationPanel";

interface GenerateBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (slides: Slide[]) => void;
}

type BriefingLength = "quick" | "standard" | "comprehensive";

interface ContentOption {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

const defaultOptions: ContentOption[] = [
  { id: "scores", label: "Score Overview", description: "FRAMEWORK, FOCUS, H.I.V.E.", checked: true },
  { id: "alerts", label: "Critical Alerts", description: "Flight risks, score drops", checked: true },
  { id: "celebrations", label: "Wins & Celebrations", description: "From S.U.M.", checked: true },
  { id: "projects", label: "Project Status", description: "Active projects", checked: true },
  { id: "financial", label: "Financial Trends", description: "EBITDA, revenue", checked: true },
  { id: "milestones", label: "Upcoming Milestones", description: "From Timeline", checked: true },
];

const generateSlides = (options: ContentOption[], length: BriefingLength): Slide[] => {
  const slides: Slide[] = [];
  const timestamp = Date.now();

  // Always start with Brand Health Spectrum
  slides.push({
    id: `gen-${timestamp}-spectrum`,
    widgetType: "spectrum",
    widgetTitle: "Brand Health Overview",
    data: { overallScore: 76, status: "EXIT POSSIBLE" },
  });

  const selectedIds = options.filter((o) => o.checked).map((o) => o.id);

  if (selectedIds.includes("scores")) {
    slides.push({
      id: `gen-${timestamp}-framework`,
      widgetType: "score",
      widgetTitle: "FRAMEWORK Score",
      data: { score: 16, maxScore: 21, trend: "+12%", status: "EXIT POSSIBLE" },
    });

    if (length !== "quick") {
      slides.push({
        id: `gen-${timestamp}-hive`,
        widgetType: "score",
        widgetTitle: "H.I.V.E. Team Health",
        data: { score: 78, maxScore: 100, trend: "+5", status: "HEALTHY" },
      });
    }

    if (length === "comprehensive") {
      slides.push({
        id: `gen-${timestamp}-focus`,
        widgetType: "score",
        widgetTitle: "FOCUS Score",
        data: { score: 72, maxScore: 100, trend: "+8", status: "EXIT POSSIBLE" },
      });
    }
  }

  if (selectedIds.includes("alerts")) {
    slides.push({
      id: `gen-${timestamp}-alert1`,
      widgetType: "alert",
      widgetTitle: "Alert: Coastal Living Score Drop",
      data: { severity: "critical", change: "-12 points", category: "Perception" },
    });

    if (length !== "quick") {
      slides.push({
        id: `gen-${timestamp}-alert2`,
        widgetType: "alert",
        widgetTitle: "Flight Risk: Tom Zimmerman",
        data: { severity: "warning", riskScore: 87, action: "Schedule 1:1" },
      });
    }
  }

  if (selectedIds.includes("projects")) {
    slides.push({
      id: `gen-${timestamp}-projects`,
      widgetType: "progress",
      widgetTitle: "Active Projects Status",
      data: { onTrack: 2, atRisk: 1, overdue: 1 },
    });
  }

  if (selectedIds.includes("financial") && length !== "quick") {
    slides.push({
      id: `gen-${timestamp}-ebitda`,
      widgetType: "chart",
      widgetTitle: "EBITDA Trend",
      data: { trend: "+12%", period: "Year-over-year" },
    });

    if (length === "comprehensive") {
      slides.push({
        id: `gen-${timestamp}-revenue`,
        widgetType: "stat",
        widgetTitle: "Monthly Revenue",
        data: { value: "$47,500", trend: "+18%" },
      });
    }
  }

  if (selectedIds.includes("celebrations") && length !== "quick") {
    slides.push({
      id: `gen-${timestamp}-celebrations`,
      widgetType: "list",
      widgetTitle: "Team Celebrations",
      data: { items: ["Sarah Chen - Birthday", "David Kim - 5 Year Anniversary"] },
    });
  }

  if (selectedIds.includes("milestones")) {
    slides.push({
      id: `gen-${timestamp}-milestones`,
      widgetType: "list",
      widgetTitle: "Upcoming Milestones",
      data: { items: ["Q1 Review - Feb 1", "Brand Launch - Feb 15"] },
    });
  }

  return slides;
};

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex items-center gap-2 mb-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: "#c9a227",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "#c9a227",
          fontWeight: 500,
        }}
      >
        GESTALT INTELLIGENCE is building your briefing...
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "#666666",
          marginTop: "8px",
        }}
      >
        Analyzing client data and generating insights
      </div>
    </div>
  );
}

export function GenerateBriefingModal({
  isOpen,
  onClose,
  onGenerate,
}: GenerateBriefingModalProps) {
  const [options, setOptions] = useState(defaultOptions);
  const [length, setLength] = useState<BriefingLength>("standard");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleToggleOption = (id: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, checked: !opt.checked } : opt
      )
    );
  };

  const handleGenerate = async () => {
    setIsLoading(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const slides = generateSlides(options, length);
    onGenerate(slides);
    setIsLoading(false);

    toast({
      title: "✓ Briefing generated",
      description: `${slides.length} slides created`,
    });

    onClose();
  };

  const selectedCount = options.filter((o) => o.checked).length;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
        style={{
          backgroundColor: "#0a0a0a",
          border: "1px solid #1a1a1a",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Header */}
            <div
              className="shrink-0 px-6 py-5 border-b"
              style={{ borderColor: "#1a1a1a" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" style={{ color: "#c9a227" }} />
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  Generate Executive Briefing
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#a0a0a0" }}>
                GESTALT INTELLIGENCE will create a presentation based on:
              </p>
            </div>

            {/* Content Options */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                {options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-start gap-3 p-3 cursor-pointer transition-colors hover:bg-[#141414]"
                    style={{
                      border: "1px solid #1a1a1a",
                      backgroundColor: option.checked
                        ? "rgba(201, 162, 39, 0.05)"
                        : "transparent",
                    }}
                  >
                    <Checkbox
                      checked={option.checked}
                      onCheckedChange={() => handleToggleOption(option.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "#ffffff",
                        }}
                      >
                        {option.label}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666666",
                          marginTop: "2px",
                        }}
                      >
                        {option.description}
                      </div>
                    </div>
                    {option.checked && (
                      <Check className="w-4 h-4 shrink-0" style={{ color: "#c9a227" }} />
                    )}
                  </label>
                ))}
              </div>

              {/* Briefing Length */}
              <div className="mt-6">
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#666666",
                    marginBottom: "12px",
                  }}
                >
                  Briefing Length
                </div>
                <RadioGroup
                  value={length}
                  onValueChange={(val) => setLength(val as BriefingLength)}
                  className="space-y-2"
                >
                  {[
                    { value: "quick", label: "Quick", description: "3-5 slides" },
                    { value: "standard", label: "Standard", description: "6-10 slides" },
                    { value: "comprehensive", label: "Comprehensive", description: "10+ slides" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-[#141414]"
                      style={{
                        border: "1px solid #1a1a1a",
                        backgroundColor:
                          length === opt.value
                            ? "rgba(201, 162, 39, 0.05)"
                            : "transparent",
                      }}
                    >
                      <RadioGroupItem value={opt.value} />
                      <div className="flex-1">
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#ffffff",
                          }}
                        >
                          {opt.label}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#666666",
                            marginLeft: "8px",
                          }}
                        >
                          {opt.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Footer */}
            <div
              className="shrink-0 px-6 py-4 border-t flex items-center justify-between gap-4"
              style={{ borderColor: "#1a1a1a" }}
            >
              <button
                onClick={onClose}
                style={{
                  fontSize: "13px",
                  color: "#666666",
                }}
                className="hover:text-white transition-colors"
              >
                Cancel
              </button>

              <Button
                onClick={handleGenerate}
                disabled={selectedCount === 0}
                className="flex items-center gap-2 px-6"
                style={{
                  backgroundColor: selectedCount > 0 ? "#c9a227" : "#1a1a1a",
                  color: selectedCount > 0 ? "#000000" : "#666666",
                  height: "44px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                <Sparkles className="w-4 h-4" />
                Generate Briefing
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GenerateBriefingModal;
