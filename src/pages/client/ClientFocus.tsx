import { useState } from "react";
import { useParams } from "react-router-dom";
import { Target, Clock, Users, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/contexts/NavigationContext";
import { useToast } from "@/hooks/use-toast";
import { PollFlow } from "@/components/poll/PollFlow";
import { SparkChart } from "@/components/assessment/SparkChart";
import type { PollSubmission } from "@/components/poll/PollTypes";

// Generate 100-point questions (4 categories x 25 questions each)
const generateFocusQuestions = () => {
  const categories = ["PERCEPTION", "CLARITY", "IDENTITY", "CULTURE"];
  const questions = [];
  
  const questionTemplates = {
    PERCEPTION: [
      "Do customers associate your brand with quality?",
      "Is your brand perceived as innovative in your industry?",
      "Do customers trust your brand more than competitors?",
      "Is your brand seen as a thought leader?",
      "Do customers feel emotionally connected to your brand?",
      "Is your pricing perceived as fair for the value delivered?",
      "Do customers believe your brand understands their needs?",
      "Is your brand associated with positive experiences?",
      "Do customers view your brand as authentic?",
      "Is your brand perceived as socially responsible?",
      "Do customers see your brand as reliable?",
      "Is your brand perceived as modern and current?",
      "Do customers associate your brand with expertise?",
      "Is your brand seen as approachable?",
      "Do customers perceive your brand as premium?",
      "Is your brand associated with innovation?",
      "Do customers feel your brand is honest?",
      "Is your brand perceived as customer-centric?",
      "Do customers see your brand as unique?",
      "Is your brand associated with success?",
      "Do customers perceive consistency in your brand?",
      "Is your brand seen as forward-thinking?",
      "Do customers trust your brand's promises?",
      "Is your brand perceived as industry-leading?",
      "Do customers feel proud to use your brand?",
    ],
    CLARITY: [
      "Is your value proposition clearly communicated?",
      "Can employees articulate your brand mission?",
      "Is your messaging consistent across all channels?",
      "Are your brand guidelines documented and followed?",
      "Is your target audience clearly defined?",
      "Do all departments understand brand priorities?",
      "Is your competitive positioning clearly stated?",
      "Are brand decisions made with clear criteria?",
      "Is your brand story consistently told?",
      "Do stakeholders understand brand objectives?",
      "Is your brand architecture clearly defined?",
      "Are naming conventions consistent?",
      "Is your tone of voice clearly documented?",
      "Do partners understand your brand requirements?",
      "Is your brand strategy clearly communicated?",
      "Are success metrics clearly defined?",
      "Is brand terminology used consistently?",
      "Do new hires receive brand training?",
      "Is your brand hierarchy clear?",
      "Are brand decisions documented?",
      "Is customer feedback integrated into brand strategy?",
      "Are brand standards enforced?",
      "Is your messaging framework documented?",
      "Do vendors align with brand guidelines?",
      "Is brand performance regularly reviewed?",
    ],
    IDENTITY: [
      "Is your logo instantly recognizable?",
      "Are your brand colors used consistently?",
      "Is your typography distinctive and consistent?",
      "Do your visuals create emotional impact?",
      "Is your brand name memorable?",
      "Are your icons and graphics cohesive?",
      "Is your photography style distinctive?",
      "Do your materials look premium?",
      "Is your website design on-brand?",
      "Are your social media visuals consistent?",
      "Is your packaging design distinctive?",
      "Do your presentations follow brand guidelines?",
      "Is your email design consistent?",
      "Are your advertisements recognizable?",
      "Is your signage impactful?",
      "Do your videos maintain brand consistency?",
      "Is your app design on-brand?",
      "Are your infographics distinctive?",
      "Is your print material consistent?",
      "Do your events reflect brand identity?",
      "Is your merchandise on-brand?",
      "Are your proposals professionally branded?",
      "Is your physical space branded consistently?",
      "Do your uniforms reflect brand identity?",
      "Is your vehicle branding consistent?",
    ],
    CULTURE: [
      "Do employees embody brand values?",
      "Is company culture aligned with brand promise?",
      "Are brand values integrated into hiring?",
      "Do leaders model brand behaviors?",
      "Is brand advocacy encouraged internally?",
      "Are brand achievements celebrated?",
      "Do employees receive brand training?",
      "Is cross-department collaboration strong?",
      "Are brand values reflected in policies?",
      "Do employees feel connected to brand mission?",
      "Is innovation encouraged and rewarded?",
      "Are customer stories shared internally?",
      "Do employees understand brand impact?",
      "Is feedback on brand experience collected?",
      "Are brand ambassadors identified?",
      "Do teams work toward shared brand goals?",
      "Is brand knowledge tested and measured?",
      "Are brand wins communicated company-wide?",
      "Do employees suggest brand improvements?",
      "Is brand consistency rewarded?",
      "Are brand failures discussed openly?",
      "Do employees feel ownership of brand?",
      "Is brand heritage preserved and shared?",
      "Are brand values visible in workspace?",
      "Do exit interviews include brand feedback?",
    ],
  };

  let id = 1;
  for (const category of categories) {
    for (const text of questionTemplates[category as keyof typeof questionTemplates]) {
      questions.push({
        id: id++,
        category,
        text,
      });
    }
  }
  
  return questions;
};

const focusQuestions = generateFocusQuestions();

// Mock summary data
const mockFocusSummary = {
  totalResponses: 8,
  avgConfidenceRating: 7.2,
  avgResponseTime: 3800,
  categoryScores: {
    PERCEPTION: 72,
    CLARITY: 68,
    IDENTITY: 81,
    CULTURE: 65,
  },
};

export default function ClientFocus() {
  const { id } = useParams();
  const { currentClient } = useNavigation();
  const { toast } = useToast();
  const [view, setView] = useState<"overview" | "poll">("overview");
  const [hasStarted, setHasStarted] = useState(false);

  const handleStartPoll = () => {
    setView("poll");
  };

  const handlePollComplete = (submission: PollSubmission) => {
    console.log("Focus poll submission:", submission);
    toast({
      title: "FOCUS Assessment Complete",
      description: "Your 100-point deep dive has been recorded.",
    });
    setHasStarted(true);
    setView("overview");
  };

  if (view === "poll") {
    return (
      <div className="p-6">
        <PollFlow
          pollType="focus"
          questions={focusQuestions}
          clientName={currentClient?.name || "Client"}
          respondentType="owner"
          onComplete={handlePollComplete}
          onCancel={() => setView("overview")}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-dim border border-gold mb-3">
            <span className="text-[10px] font-bold tracking-[2px] text-gold uppercase">
              FOCUS
            </span>
          </div>
          <h1 className="text-[28px] font-semibold text-foreground mb-1">100-Point Deep Dive</h1>
          <p className="text-[14px] text-foreground-muted">
            Comprehensive brand analysis with timing-based confidence measurement
          </p>
        </div>
        <Button onClick={handleStartPoll} className="gap-2 bg-gold text-primary-foreground hover:bg-gold/90">
          <Target className="w-4 h-4" />
          {hasStarted ? "Retake Assessment" : "Start Deep Dive"}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-5">
          <div className="flex items-center gap-2 text-foreground-muted mb-2">
            <Target className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[1px] uppercase">Questions</span>
          </div>
          <div className="text-[32px] font-bold text-gold">100</div>
          <div className="text-[12px] text-foreground-muted">across 4 categories</div>
        </div>
        <div className="bg-card border border-border p-5">
          <div className="flex items-center gap-2 text-foreground-muted mb-2">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[1px] uppercase">Responses</span>
          </div>
          <div className="text-[32px] font-bold text-foreground">{mockFocusSummary.totalResponses}</div>
          <div className="text-[12px] text-foreground-muted">team submissions</div>
        </div>
        <div className="bg-card border border-border p-5">
          <div className="flex items-center gap-2 text-foreground-muted mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[1px] uppercase">Avg Confidence</span>
          </div>
          <div className="text-[32px] font-bold text-foreground">{mockFocusSummary.avgConfidenceRating}</div>
          <div className="text-[12px] text-foreground-muted">out of 10</div>
        </div>
        <div className="bg-card border border-border p-5">
          <div className="flex items-center gap-2 text-foreground-muted mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[1px] uppercase">Avg Time</span>
          </div>
          <div className="text-[32px] font-bold text-foreground">{(mockFocusSummary.avgResponseTime / 1000).toFixed(1)}s</div>
          <div className="text-[12px] text-foreground-muted">per question</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-card border border-border p-6 mb-8">
        <h2 className="text-[16px] font-semibold text-foreground mb-6">Category Analysis</h2>
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(mockFocusSummary.categoryScores).map(([category, score]) => (
            <div key={category} className="bg-muted border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] font-bold tracking-[1px] text-gold uppercase mb-1">
                    {category}
                  </div>
                  <div className="text-[12px] text-foreground-muted">25 questions</div>
                </div>
                <div className="text-right">
                  <div className={`text-[28px] font-bold ${score >= 75 ? "text-success" : score >= 50 ? "text-warning" : "text-red"}`}>
                    {score}%
                  </div>
                </div>
              </div>
              {/* Mock spark chart for timing */}
              <SparkChart
                data={Array.from({ length: 25 }, () => 1500 + Math.random() * 5000)}
                width={200}
                height={32}
                threshold={3000}
              />
              <div className="text-[11px] text-foreground-muted mt-2">
                Response time pattern — spikes indicate uncertainty
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Poll CTA */}
      <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-foreground mb-2">
              Gather Team Perspectives
            </h3>
            <p className="text-[14px] text-foreground-muted max-w-[500px]">
              Send the 100-point FOCUS poll to your entire team. Aggregate responses reveal alignment gaps and areas of uncertainty.
            </p>
          </div>
          <Button variant="secondary" className="gap-2">
            <Users className="w-4 h-4" />
            Invite Team via S.U.M.
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
