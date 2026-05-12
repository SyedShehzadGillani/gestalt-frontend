import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PollQuestionScreen } from "./PollQuestionScreen";
import { ConfidenceSlider } from "@/components/assessment/ConfidenceSlider";
import { PollWelcomeScreen } from "./PollWelcomeScreen";
import { PollResultsScreen } from "./PollResultsScreen";
import type { PollQuestion, PollResponse, PollSubmission } from "./PollTypes";

interface PollFlowProps {
  pollType: "framework" | "focus" | "formula";
  questions: PollQuestion[];
  clientName: string;
  respondentType: "owner" | "employee";
  onComplete: (submission: PollSubmission) => void;
  onCancel?: () => void;
}

type Screen = "welcome" | "questions" | "confidence" | "results";

export function PollFlow({
  pollType,
  questions,
  clientName,
  respondentType,
  onComplete,
  onCancel,
}: PollFlowProps) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<PollResponse[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [confidenceRating, setConfidenceRating] = useState<number>(5);
  const { toast } = useToast();

  const currentQuestion = questions[currentIndex];

  const handleBegin = () => {
    setScreen("questions");
  };

  const handleAnswer = (answer: boolean, responseTime: number) => {
    const newResponse: PollResponse = {
      questionId: currentQuestion.id,
      answer,
      responseTime,
    };

    setResponses((prev) => [...prev, newResponse]);

    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      const currentCategory = currentQuestion.category;
      const nextCategory = nextQuestion.category;

      if (currentCategory !== nextCategory) {
        toast({
          title: `${currentCategory} Complete`,
          description: `Moving to ${nextCategory} section...`,
        });
      }
      setCurrentIndex((prev) => prev + 1);
    } else {
      toast({
        title: "Questions Complete!",
        description: "Please rate your confidence...",
      });
      setScreen("confidence");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setResponses((prev) => prev.slice(0, -1));
    }
  };

  const handleConfidenceSubmit = (rating: number) => {
    setConfidenceRating(rating);
    
    const submission: PollSubmission = {
      id: crypto.randomUUID(),
      pollType,
      respondentType,
      responses,
      confidenceRating: rating,
      totalTime: Date.now() - startTime,
      completedAt: new Date().toISOString(),
    };

    toast({
      title: "Poll Complete!",
      description: "Thank you for your responses.",
    });

    setScreen("results");
    onComplete(submission);
  };

  const handleConfidencePrevious = () => {
    setScreen("questions");
    setCurrentIndex(questions.length - 1);
    setResponses((prev) => prev.slice(0, -1));
  };

  if (screen === "welcome") {
    return (
      <PollWelcomeScreen
        pollType={pollType}
        clientName={clientName}
        totalQuestions={questions.length}
        onBegin={handleBegin}
        onCancel={onCancel}
      />
    );
  }

  if (screen === "questions" && currentQuestion) {
    return (
      <PollQuestionScreen
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        onPrevious={handlePrevious}
        isFirst={currentIndex === 0}
        isLast={currentIndex === questions.length - 1}
        showTimer={true}
      />
    );
  }

  if (screen === "confidence") {
    return (
      <ConfidenceSlider
        onSubmit={handleConfidenceSubmit}
        onPrevious={handleConfidencePrevious}
        showPrevious={true}
      />
    );
  }

  if (screen === "results") {
    return (
      <PollResultsScreen
        responses={responses}
        confidenceRating={confidenceRating}
        questions={questions}
        pollType={pollType}
      />
    );
  }

  return null;
}
