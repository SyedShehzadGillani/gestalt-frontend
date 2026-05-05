import { CheckCircle } from "lucide-react";
import { SparkChart } from "@/components/assessment/SparkChart";
import type { PollQuestion, PollResponse } from "./PollTypes";

interface PollResultsScreenProps {
  responses: PollResponse[];
  confidenceRating: number;
  questions: PollQuestion[];
  pollType: "framework" | "focus" | "formula";
}

export function PollResultsScreen({
  responses,
  confidenceRating,
  questions,
  pollType,
}: PollResultsScreenProps) {
  const yesCount = responses.filter((r) => r.answer === true).length;
  const totalQuestions = questions.length;
  const percentageScore = Math.round((yesCount / totalQuestions) * 100);
  const avgResponseTime =
    responses.reduce((sum, r) => sum + r.responseTime, 0) / responses.length / 1000;

  // Group by category
  const categoryGroups = questions.reduce((acc, q) => {
    if (!acc[q.category]) {
      acc[q.category] = {
        questions: [],
        responses: [],
      };
    }
    acc[q.category].questions.push(q);
    const response = responses.find((r) => r.questionId === q.id);
    if (response) {
      acc[q.category].responses.push(response);
    }
    return acc;
  }, {} as Record<string, { questions: PollQuestion[]; responses: PollResponse[] }>);

  return (
    <div className="min-h-[calc(100vh-64px)] animate-fade-in px-4 py-8">
      <div className="max-w-[800px] mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
          </div>
          <h1 className="text-[28px] md:text-[36px] font-bold text-foreground mb-2">
            Poll Complete
          </h1>
          <p className="text-[14px] text-foreground-muted">
            Thank you for completing the {pollType === "framework" ? "21-point" : pollType === "focus" ? "100-point" : "team"} assessment.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-card border border-border p-5 text-center">
            <div className="text-[10px] font-bold tracking-[2px] text-foreground-secondary uppercase mb-2">
              Score
            </div>
            <div className="text-[36px] font-bold text-gold">{yesCount}</div>
            <div className="text-[12px] text-foreground-muted">of {totalQuestions}</div>
          </div>
          <div className="bg-card border border-border p-5 text-center">
            <div className="text-[10px] font-bold tracking-[2px] text-foreground-secondary uppercase mb-2">
              Confidence
            </div>
            <div className="text-[36px] font-bold text-gold">{confidenceRating}</div>
            <div className="text-[12px] text-foreground-muted">of 10</div>
          </div>
          <div className="bg-card border border-border p-5 text-center">
            <div className="text-[10px] font-bold tracking-[2px] text-foreground-secondary uppercase mb-2">
              Avg Time
            </div>
            <div className="text-[36px] font-bold text-foreground">{avgResponseTime.toFixed(1)}s</div>
            <div className="text-[12px] text-foreground-muted">per question</div>
          </div>
        </div>

        {/* Category Breakdown with Spark Charts */}
        <div className="mb-10">
          <h2 className="text-[16px] font-semibold text-foreground mb-4">
            Response Timing by Category
          </h2>
          <div className="space-y-4">
            {Object.entries(categoryGroups).map(([category, data]) => {
              const categoryYes = data.responses.filter((r) => r.answer === true).length;
              const categoryTotal = data.questions.length;
              const responseTimes = data.responses.map((r) => r.responseTime);

              return (
                <div
                  key={category}
                  className="bg-card border border-border p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-[11px] font-bold tracking-[1px] text-gold uppercase">
                        {category}
                      </div>
                      <div className="text-[13px] text-foreground-muted">
                        {categoryYes}/{categoryTotal} positive
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <SparkChart
                      data={responseTimes}
                      width={100}
                      height={28}
                      threshold={3000}
                    />
                    <div className="text-right min-w-[60px]">
                      <div className="text-[14px] font-semibold text-foreground">
                        {(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000).toFixed(1)}s
                      </div>
                      <div className="text-[10px] text-foreground-muted">avg</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confidence Interpretation */}
        <div className="bg-muted border border-border p-6 text-center">
          <p className="text-[14px] text-foreground-muted">
            Your responses have been recorded and will be aggregated with other team members.{" "}
            <span className="text-foreground">
              {confidenceRating >= 7
                ? "Your high confidence indicates strong brand clarity."
                : confidenceRating >= 4
                ? "Moderate confidence suggests some areas need clarification."
                : "Lower confidence may indicate a need for additional brand training."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
