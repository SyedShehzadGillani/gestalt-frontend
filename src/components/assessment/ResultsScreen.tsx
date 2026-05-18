import { Download, Share2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrendLineChart } from "./TrendLineChart";
import { SparkChart } from "./SparkChart";
import { assessmentQuestions } from "@/data/assessmentQuestions";
interface ConfidenceAnswer {
  questionId: number;
  answer: boolean;
  responseTime: number;
  isValid: boolean;
}
interface QuestionTiming {
  questionId: number;
  responseTime: number;
}
interface ResultsScreenProps {
  onReturnToDashboard: () => void;
  confidenceAnswers?: ConfidenceAnswer[];
  answers?: Record<number, boolean | null>;
  questionTimings?: QuestionTiming[];
  finalConfidenceRating?: number;
}
const segments = [{
  min: 0,
  max: 20,
  label: "LIQUIDATION",
  color: "text-red"
}, {
  min: 21,
  max: 40,
  label: "EXIT UNLIKELY",
  color: "text-warning"
}, {
  min: 41,
  max: 60,
  label: "DISRUPTION IMMINENT",
  color: "text-yellow-400"
}, {
  min: 61,
  max: 75,
  label: "MARKET VULNERABLE",
  color: "text-lime-400"
}, {
  min: 76,
  max: 90,
  label: "EXIT POSSIBLE",
  color: "text-success"
}, {
  min: 91,
  max: 100,
  label: "EXIT READY",
  color: "text-emerald-400"
}];
const categoryConfig = {
  PERCEPTION: {
    count: 5
  },
  CLARITY: {
    count: 5
  },
  IDENTITY: {
    count: 5
  },
  CULTURE: {
    count: 6
  }
};

// Mock historical data
const assessmentHistory = [{
  date: "Jan 2024",
  score: 8
}, {
  date: "Apr 2024",
  score: 10
}, {
  date: "Jul 2024",
  score: 12
}, {
  date: "Oct 2024",
  score: 11
}];
export function ResultsScreen({
  onReturnToDashboard,
  confidenceAnswers = [],
  answers = {},
  questionTimings = [],
  finalConfidenceRating = 5
}: ResultsScreenProps) {
  // Calculate actual scores based on answers
  const calculateCategoryScores = () => {
    const categories: Record<string, {
      yes: number;
      total: number;
      timings: number[];
    }> = {
      PERCEPTION: {
        yes: 0,
        total: 0,
        timings: []
      },
      CLARITY: {
        yes: 0,
        total: 0,
        timings: []
      },
      IDENTITY: {
        yes: 0,
        total: 0,
        timings: []
      },
      CULTURE: {
        yes: 0,
        total: 0,
        timings: []
      }
    };
    assessmentQuestions.forEach(q => {
      categories[q.category].total++;
      if (answers[q.id] === true) {
        categories[q.category].yes++;
      }
      const timing = questionTimings.find(t => t.questionId === q.id);
      if (timing) {
        categories[q.category].timings.push(timing.responseTime);
      }
    });
    return Object.entries(categories).map(([name, data]) => {
      const score = data.total > 0 ? Math.round(data.yes / data.total * 100) : 0;
      const color = score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-red";
      const barColor = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-red";
      return {
        name,
        score,
        points: `${data.yes}/${data.total}`,
        color,
        barColor,
        timings: data.timings
      };
    });
  };
  const categoryScores = calculateCategoryScores();
  const totalYes = Object.values(answers).filter(a => a === true).length;
  const totalScore = totalYes;
  const percentageScore = Math.round(totalYes / 21 * 100);

  // Determine status based on percentage
  const getStatus = () => {
    if (percentageScore >= 91) return {
      label: "EXIT READY",
      color: "text-emerald-400",
      bg: "bg-emerald-400/15"
    };
    if (percentageScore >= 76) return {
      label: "EXIT POSSIBLE",
      color: "text-success",
      bg: "bg-success/15"
    };
    if (percentageScore >= 61) return {
      label: "MARKET VULNERABLE",
      color: "text-lime-400",
      bg: "bg-lime-400/15"
    };
    if (percentageScore >= 41) return {
      label: "DISRUPTION IMMINENT",
      color: "text-yellow-400",
      bg: "bg-yellow-400/15"
    };
    if (percentageScore >= 21) return {
      label: "EXIT UNLIKELY",
      color: "text-warning",
      bg: "bg-warning/15"
    };
    return {
      label: "LIQUIDATION",
      color: "text-red",
      bg: "bg-red/15"
    };
  };
  const status = getStatus();

  // Get blindspots (questions answered "no")
  const blindspots = assessmentQuestions.filter(q => answers[q.id] === false).slice(0, 5) // Show top 5 blindspots
  .map(q => ({
    category: q.category,
    questionNumber: q.id,
    question: q.text,
    impactMessage: q.impactMessage,
    quoteHighlight: q.citations[0]?.highlight || "",
    quoteText: q.citations[0]?.text || "This gap is limiting your brand potential.",
    source: q.citations[0]?.source || "",
    solution: getSolution(q.category),
    timeline: getTimeline(q.category),
    priority: q.id <= 10 ? "CRITICAL" : q.id <= 15 ? "HIGH" : "MEDIUM",
    impact: q.id <= 10 ? "HIGH" : "MEDIUM"
  }));
  function getSolution(category: string) {
    switch (category) {
      case "PERCEPTION":
        return "Brand Clarity Audit";
      case "CLARITY":
        return "Messaging Alignment Workshop";
      case "IDENTITY":
        return "Visual Identity System";
      case "CULTURE":
        return "Culture Alignment Program";
      default:
        return "Strategic Assessment";
    }
  }
  function getTimeline(category: string) {
    switch (category) {
      case "PERCEPTION":
        return "2-4 weeks";
      case "CLARITY":
        return "1-2 weeks";
      case "IDENTITY":
        return "4-6 weeks";
      case "CULTURE":
        return "2-3 weeks";
      default:
        return "2-4 weeks";
    }
  }

  // Calculate confidence metrics
  const validConfidenceAnswers = confidenceAnswers.filter(a => a.isValid);
  const confidenceScore = confidenceAnswers.length > 0 ? Math.round(validConfidenceAnswers.length / confidenceAnswers.length * 100) : 0;
  const avgResponseTime = confidenceAnswers.length > 0 ? Math.round(confidenceAnswers.reduce((sum, a) => sum + a.responseTime, 0) / confidenceAnswers.length / 1000 * 10) / 10 : 0;
  return <div className="animate-fade-in pb-12 px-4">
      <div className="max-w-[900px] mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12" data-tour="main-score">
          <div className="text-[100px] md:text-[120px] font-extrabold text-gold leading-none">
            {totalScore}
          </div>
        <div className="text-[14px] font-bold tracking-[3px] text-foreground-secondary uppercase mb-4">
          OF 21 POINTS
        </div>
        <div className={`inline-flex px-4 py-2 ${status.bg} mb-4`}>
          <span className={`text-[12px] font-bold tracking-[1px] ${status.color} uppercase`}>
            {status.label}
          </span>
        </div>
        <p className="text-[15px] text-foreground-muted max-w-[500px] mx-auto">
          {percentageScore >= 76 ? "Your brand shows strong fundamentals. Focus on the identified gaps to maximize exit potential." : "Your brand has significant opportunities for improvement before achieving exit-ready status."}
        </p>
        </div>

        {/* Confidence Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gold-dim border border-gold p-5">
            <div className="text-[10px] font-bold tracking-[2px] text-gold uppercase mb-2">
              Final Confidence
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-gold">{finalConfidenceRating}</span>
              <span className="text-[12px] text-foreground-muted">/10</span>
            </div>
            <p className="text-[11px] text-foreground-muted mt-2">
              Self-rated confidence level
            </p>
          </div>
          {confidenceAnswers.length > 0 && <div className="bg-muted border border-border p-5">
              <div className="text-[10px] font-bold tracking-[2px] text-foreground-secondary uppercase mb-2">
                Quick Answers
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-bold text-foreground">{confidenceScore}%</span>
                <span className="text-[12px] text-foreground-muted">
                  ({validConfidenceAnswers.length}/{confidenceAnswers.length})
                </span>
              </div>
              <p className="text-[11px] text-foreground-muted mt-2">
                Within 5 second threshold
              </p>
            </div>}
          <div className="bg-muted border border-border p-5">
            <div className="text-[10px] font-bold tracking-[2px] text-foreground-secondary uppercase mb-2">
              Avg Response Time
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] font-bold text-foreground">
                {questionTimings.length > 0 ? (questionTimings.reduce((sum, t) => sum + t.responseTime, 0) / questionTimings.length / 1000).toFixed(1) : avgResponseTime}s
              </span>
            </div>
            <p className="text-[11px] text-foreground-muted mt-2">
              Across all {questionTimings.length || confidenceAnswers.length} questions
            </p>
          </div>
        </div>

        {/* Trend Line Chart */}
        <TrendLineChart history={assessmentHistory} currentScore={totalScore} />

        {/* Brand Spectrum */}
        <div className="bg-card border border-border p-6 md:p-8 mb-8" data-tour="results-spectrum">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[48px] md:text-[56px] font-bold text-gold leading-none">{percentageScore}</span>
              <span className="text-[20px] text-foreground-secondary">/100</span>
            </div>
            <span className="text-[11px] font-bold tracking-[2px] text-foreground-secondary uppercase">
              Brand Health Spectrum
            </span>
          </div>

          {/* Spectrum Bar */}
          <div className="relative">
            <div className="h-6 w-full" style={{
            background: "linear-gradient(to right, #e74c3c 0%, #f39c12 25%, #f1c40f 50%, #27ae60 100%)"
          }} />
            {/* Position Marker */}
            <div className="absolute top-0 -translate-x-1/2" style={{
            left: `${percentageScore}%`
          }}>
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
              <div className="w-1 h-6 bg-white mx-auto" />
            </div>
          </div>

          {/* Segment Labels */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
            {segments.map(segment => <div key={segment.label} className="text-center">
                <div className="text-[10px] font-bold tracking-[1px] text-foreground-muted mb-1">
                  {segment.min}-{segment.max}
                </div>
                <div className={`text-[8px] md:text-[9px] font-bold tracking-[0.5px] ${segment.color}`}>
                  {segment.label}
                </div>
              </div>)}
          </div>
        </div>

        {/* Category Scores with Spark Charts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-8">
          {categoryScores.map(category => <div key={category.name} className="bg-muted border border-border p-4 md:p-5">
              <div className="text-[9px] md:text-[10px] font-bold tracking-[2px] text-foreground-secondary uppercase mb-2">
                {category.name}
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-[24px] md:text-[28px] font-semibold ${category.color}`}>
                  {category.score}%
                </span>
                <span className="text-[11px] md:text-[12px] text-foreground-muted">({category.points})</span>
              </div>
              <div className="h-2 bg-card mb-3">
                <div className={`h-full ${category.barColor} transition-all duration-300`} style={{
              width: `${category.score}%`
            }} />
              </div>
              {/* Spark Chart for timing */}
              {category.timings.length > 0 && <div>
                  <SparkChart data={category.timings} width={100} height={24} threshold={5000} />
                  <div className="text-[9px] text-foreground-muted mt-1">
                    Response timing
                  </div>
                </div>}
            </div>)}
        </div>

        {/* Blindspots Section */}
        {blindspots.length > 0 && <div className="mb-8" data-tour="blindspots-section">
          <div className="flex items-center gap-3 mb-2 mt-[150px]">
            <span className="w-[66px] h-[66px] flex items-center justify-center bg-red-dim text-[33px] font-bold" style={{ color: '#ff0701' }}>{blindspots.length}</span>
            <h2 className="text-[32px] md:text-[36px] font-semibold text-foreground">
              IDENTIFIED BLINDSPOTS
            </h2>
          </div>
          <p className="text-[20px] text-foreground-secondary mb-6">
            These gaps are limiting your brand's potential and exit valuation.
          </p>

          <div className="space-y-[50px]">
            {blindspots.map((blindspot, index) => <div key={index} className="bg-[#0d0000] border border-[#1d0000] p-5 md:p-6 relative overflow-hidden">
                {/* Gradient left border */}
                <div className="absolute left-0 top-0 bottom-0 w-1 opacity-75" style={{
              background: 'linear-gradient(to bottom, #ff0000, #280000)'
            }} />
                {/* Header */}
                <div className="text-[17px] font-bold tracking-[1px] uppercase mb-3">
                  <span className="text-gold">{String(blindspot.questionNumber).padStart(2, '0')}</span>
                  <span className="text-foreground-muted"> / </span>
                  <span className="text-white [.light_&]:text-black">{blindspot.category}</span>
                </div>

                {/* Question */}
                <p className="text-[28px] text-gold py-8 mb-4">
                  {blindspot.question} <span className="text-foreground-muted font-bold">NO.</span>
                </p>

                {/* Impact Message */}
                <p className="text-[24px] text-foreground leading-relaxed mb-[50px] px-[50px]">
                  {blindspot.impactMessage}
                </p>

                {/* Quote Box */}
                <div className="p-4 mb-4">
                  <p className="text-[18px] md:text-[19px] text-foreground-muted leading-relaxed">
                    "
                    <span className="text-foreground font-book">
                      {blindspot.quoteHighlight.split(/([$€£]?\d+(?:\.\d+)?[%xkKmMbBtT]?(?:\s*(?:trillion|billion|million|thousand))?)/g).map((part, i) => 
                        /[$€£]?\d+(?:\.\d+)?[%xkKmMbBtT]?(?:\s*(?:trillion|billion|million|thousand))?/.test(part) ? <strong key={i} className="font-bold text-foreground">{part}</strong> : part
                      )}
                    </span>{" "}
                    {blindspot.quoteText.split(/([$€£]?\d+(?:\.\d+)?[%xkKmMbBtT]?(?:\s*(?:trillion|billion|million|thousand))?)/g).map((part, i) => 
                      /[$€£]?\d+(?:\.\d+)?[%xkKmMbBtT]?(?:\s*(?:trillion|billion|million|thousand))?/.test(part) ? <strong key={i} className="font-bold text-foreground">{part}</strong> : part
                    )}
                    "
                  </p>
                  {blindspot.source && (
                    <p className="text-[12px] italic mt-1" style={{ color: '#394150' }}>
                      -{blindspot.source}
                    </p>
                  )}
                </div>

                {/* Solution */}
                <div className="inline-flex items-center gap-2 mb-[25px]" data-tour={index === 0 ? "gestalt-solution" : undefined}>
                  <span className="text-[17px] font-book" style={{
                color: '#6c727f'
              }}>
                    GESTALT SOLUTION: {blindspot.solution}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[11px]">
                  <div>
                    <span className="text-foreground-secondary">Timeline: </span>
                    <span className="text-foreground">{blindspot.timeline}</span>
                  </div>
                  <div>
                    <span className="text-foreground-secondary">Priority: </span>
                    <span className={`font-semibold ${blindspot.priority === "CRITICAL" ? "text-red" : blindspot.priority === "HIGH" ? "text-warning" : "text-foreground"}`}>
                      {blindspot.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-foreground-secondary">Impact: </span>
                    <span className={`font-semibold ${blindspot.impact === "HIGH" ? "text-success" : "text-foreground"}`}>
                      {blindspot.impact}
                    </span>
                  </div>
                </div>
              </div>)}
          </div>
        </div>}

        {/* Upsell Section */}
        <div className="relative mb-8 mt-[50px] p-[2px] bg-gradient-to-r from-gold/50 via-gold to-gold/50">
          <div className="bg-card p-6 md:p-8">
            <div className="inline-flex px-3 py-1 bg-gold-dim mb-4">
              <span className="text-[10px] font-bold tracking-[2px] text-gold uppercase">
                Next Step
              </span>
            </div>
            <h3 className="text-[18px] md:text-[20px] font-semibold text-foreground mb-2">
              Go Deeper with 100-Point FOCUS Audit
            </h3>
            <p className="text-[14px] text-foreground-muted mb-6 max-w-[500px]">Uncover 100 data-driven reasons why customers should choose you. Get a comprehensive analysis with actionable recommendations.</p>
            <Button className="w-full md:w-auto gap-2 bg-gold text-primary-foreground hover:bg-gold/90">
              SCHEDULE FOCUS AUDIT
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3 md:gap-4">
          <Button variant="secondary" className="gap-2 text-gold">
            <Download className="w-4 h-4 text-white [.light_&]:text-black" />
            Download PDF Report
          </Button>
          <Button variant="secondary" className="gap-2 text-gold">
            <Share2 className="w-4 h-4 text-white [.light_&]:text-black" />
            Share Results
          </Button>
          <Button variant="secondary" className="gap-2 text-gold" onClick={onReturnToDashboard}>
            <ArrowLeft className="w-4 h-4 text-white [.light_&]:text-black" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>;
}