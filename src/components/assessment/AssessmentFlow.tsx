import { useState } from "react";
import { WelcomeScreen } from "./WelcomeScreen";
import { QuestionScreen } from "./QuestionScreen";
import { ConfidenceScreen } from "./ConfidenceScreen";
import { ResultsScreen } from "./ResultsScreen";
import { ConfidenceSlider } from "./ConfidenceSlider";
import { useToast } from "@/hooks/use-toast";
import { assessmentQuestions, confidenceQuestions } from "@/data/assessmentQuestions";

interface AssessmentFlowProps {
  clientName?: string;
  onComplete: () => void;
}

type Screen = "welcome" | "questions" | "confidence" | "confidenceSlider" | "results";

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

export function AssessmentFlow({ clientName, onComplete }: AssessmentFlowProps) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [questionTimings, setQuestionTimings] = useState<QuestionTiming[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [confidenceIndex, setConfidenceIndex] = useState(0);
  const [confidenceAnswers, setConfidenceAnswers] = useState<ConfidenceAnswer[]>([]);
  const [finalConfidenceRating, setFinalConfidenceRating] = useState<number>(5);
  const { toast } = useToast();

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id] ?? null;
  const currentConfidenceQuestion = confidenceQuestions[confidenceIndex];

  const handleBegin = () => {
    setScreen("questions");
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = (value: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setQuestionStartTime(Date.now());
      // Remove last timing entry when going back
      setQuestionTimings((prev) => prev.slice(0, -1));
    }
  };

  const handleNavigateToCategory = (category: string) => {
    // Find the first question index of the given category
    const categoryMap: Record<string, number> = {
      "PERCEPTION": 0,
      "CLARITY": 5,
      "IDENTITY": 10,
      "CULTURE": 15,
    };
    
    const targetIndex = categoryMap[category];
    if (targetIndex !== undefined && targetIndex <= currentQuestionIndex) {
      setCurrentQuestionIndex(targetIndex);
      setQuestionStartTime(Date.now());
      // Trim timings to match the new position
      setQuestionTimings((prev) => prev.slice(0, targetIndex));
    }
  };

  const handleSubmit = () => {
    // Record timing for this question
    const responseTime = Date.now() - questionStartTime;
    setQuestionTimings((prev) => [
      ...prev,
      { questionId: currentQuestion.id, responseTime },
    ]);

    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      const nextQuestion = assessmentQuestions[currentQuestionIndex + 1];
      const currentCategory = currentQuestion.category;
      const nextCategory = nextQuestion.category;
      
      if (currentCategory !== nextCategory) {
        toast({
          title: `${currentCategory} Complete`,
          description: `Moving to ${nextCategory} section...`,
        });
      }
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      // Move to confidence questions
      toast({
        title: "Main Assessment Complete!",
        description: "Now measuring your confidence...",
      });
      setScreen("confidence");
    }
  };

  const handleConfidenceAnswer = (answer: ConfidenceAnswer) => {
    setConfidenceAnswers((prev) => [...prev, answer]);

    if (confidenceIndex < confidenceQuestions.length - 1) {
      setConfidenceIndex((prev) => prev + 1);
    } else {
      // All confidence questions answered, show slider
      toast({
        title: "Almost Done!",
        description: "Rate your overall confidence...",
      });
      setScreen("confidenceSlider");
    }
  };

  const handleConfidencePrevious = () => {
    if (confidenceIndex > 0) {
      setConfidenceIndex((prev) => prev - 1);
      setConfidenceAnswers((prev) => prev.slice(0, -1));
    } else {
      // Go back to last question
      setScreen("questions");
      setCurrentQuestionIndex(assessmentQuestions.length - 1);
      setQuestionTimings((prev) => prev.slice(0, -1));
      setQuestionStartTime(Date.now());
    }
  };

  const handleFinalConfidenceSubmit = (rating: number) => {
    setFinalConfidenceRating(rating);
    toast({
      title: "Assessment Complete!",
      description: "Calculating your results...",
    });
    setScreen("results");
  };

  const handleSliderPrevious = () => {
    setScreen("confidence");
    setConfidenceIndex(confidenceQuestions.length - 1);
    setConfidenceAnswers((prev) => prev.slice(0, -1));
  };

  if (screen === "welcome") {
    return <WelcomeScreen clientName={clientName} onBegin={handleBegin} />;
  }

  if (screen === "questions" && currentQuestion) {
    return (
      <QuestionScreen
        question={currentQuestion}
        currentIndex={currentQuestionIndex}
        totalQuestions={assessmentQuestions.length}
        answer={currentAnswer}
        onAnswer={handleAnswer}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        onNavigateToCategory={handleNavigateToCategory}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === assessmentQuestions.length - 1}
      />
    );
  }

  if (screen === "confidence" && currentConfidenceQuestion) {
    return (
      <ConfidenceScreen
        question={currentConfidenceQuestion}
        currentIndex={confidenceIndex}
        totalQuestions={confidenceQuestions.length}
        onAnswer={handleConfidenceAnswer}
        onPrevious={handleConfidencePrevious}
        isFirst={confidenceIndex === 0}
      />
    );
  }

  if (screen === "confidenceSlider") {
    return (
      <ConfidenceSlider
        onSubmit={handleFinalConfidenceSubmit}
        onPrevious={handleSliderPrevious}
        showPrevious={true}
      />
    );
  }

  if (screen === "results") {
    return (
      <ResultsScreen
        onReturnToDashboard={onComplete}
        confidenceAnswers={confidenceAnswers}
        answers={answers}
        questionTimings={questionTimings}
        finalConfidenceRating={finalConfidenceRating}
      />
    );
  }

  return null;
}
