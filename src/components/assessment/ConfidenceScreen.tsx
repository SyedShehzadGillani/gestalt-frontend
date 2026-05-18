import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import gestaltLogo from "@/assets/gestalt-logo.svg";

interface ConfidenceQuestion {
  id: number;
  text: string;
}

interface ConfidenceAnswer {
  questionId: number;
  answer: boolean;
  responseTime: number; // in milliseconds
  isValid: boolean; // true if answered within threshold
}

interface ConfidenceScreenProps {
  question: ConfidenceQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (answer: ConfidenceAnswer) => void;
  onPrevious: () => void;
  isFirst: boolean;
}

const CONFIDENCE_THRESHOLD_MS = 5000; // 5 seconds - more subtle timing

export function ConfidenceScreen({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onPrevious,
  isFirst,
}: ConfidenceScreenProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questionNumber = currentIndex + 1;
  const progress = Math.min(100, (elapsedTime / CONFIDENCE_THRESHOLD_MS) * 100);

  const categories = ["WELCOME", "PERCEPTION", "CLARITY", "IDENTITY", "CULTURE", "CONFIDENCE"];
  const currentCategoryIndex = 5; // CONFIDENCE is last

  useEffect(() => {
    // Reset timer when question changes
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    setAnswer(null);

    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [question.id]);

  const handleAnswer = (value: boolean) => {
    setAnswer(value);
  };

  const handleSubmit = () => {
    if (answer === null) return;

    const responseTime = Date.now() - startTimeRef.current;
    const isValid = responseTime <= CONFIDENCE_THRESHOLD_MS;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    onAnswer({
      questionId: question.id,
      answer,
      responseTime,
      isValid,
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col animate-fade-in px-4 py-8">
      {/* Subtle Timer Bar - at top, no number */}
      <div className="w-full max-w-[700px] mx-auto mb-4">
        <div className="h-1 bg-muted/30 overflow-hidden">
          <div
            className="h-full transition-all duration-100 bg-gold/40"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="w-full max-w-[700px] mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 text-[11px] font-medium tracking-[2px] uppercase">
          {categories.map((cat, index) => (
            <div key={cat} className="flex items-center gap-2">
              <span
                className={
                  index < currentCategoryIndex
                    ? "text-gold/50"
                    : index === currentCategoryIndex
                    ? "text-gold text-[13px]"
                    : "text-foreground-muted"
                }
              >
                {cat}
              </span>
              {index < categories.length - 1 && (
                <span className="text-foreground-muted">/</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Question Container - matching 21-pt identity */}
      <div className="w-full max-w-[700px] mx-auto text-left" style={{ marginTop: "5vh" }}>
        {/* Question Number / Category + Previous Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[18px] md:text-[21px] font-normal text-gold">
              {String(questionNumber).padStart(2, "0")}
            </span>
            <span className="text-[18px] md:text-[21px] font-light text-gold">/</span>
            <span className="text-[18px] md:text-[21px] font-book tracking-[2px] text-white [.light_&]:text-black uppercase">
              CONFIDENCE
            </span>
          </div>
          {!isFirst && (
            <Button
              variant="ghost"
              onClick={onPrevious}
              className="group gap-2 font-book text-foreground-muted/50 hover:bg-transparent hover:text-gold/50 active:text-gold focus:text-gold p-0 h-auto mr-[25px] mt-[5px]"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Previous Question
            </Button>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gold mb-8 opacity-20" />

        {/* Question Text - matching 21-pt style */}
        <h2 className="text-[33px] md:text-[38px] font-book text-gold leading-relaxed mb-10">
          {question.text}
        </h2>

        {/* Answer Buttons - matching 21-pt style */}
        <div className="space-y-3 mb-8 pl-[25px]">
          <button
            onClick={() => handleAnswer(true)}
            className={`w-[175px] h-14 flex items-center justify-center text-[18px] font-medium tracking-[1px] border transition-all ${
              answer === true
                ? "bg-gold/25 text-gold border-gold"
                : "bg-dark-gray text-gold border-gold/50 hover:border-gold"
            }`}
          >
            YES
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className={`w-[175px] h-14 flex items-center justify-center text-[18px] font-medium tracking-[1px] border transition-all ${
              answer === false
                ? "bg-gold/25 text-gold border-gold"
                : "bg-dark-gray text-gold border-gold/50 hover:border-gold"
            }`}
          >
            NO
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gold mb-8 opacity-20" />

        {/* Submit Button - matching 21-pt style */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleSubmit}
            disabled={answer === null}
            className="w-[calc(100%-50px)] h-14 text-[18px] font-semibold tracking-[1px] bg-gold/25 border border-gold text-gold hover:bg-gold hover:text-primary-foreground disabled:opacity-50"
          >
            SUBMIT
          </Button>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-muted border border-border mb-8">
          <p className="text-[13px] text-foreground-muted">
            <span className="text-foreground font-semibold">Measuring confidence:</span>{" "}
            These questions assess how certain you are about your brand knowledge. 
            Your response time is measured to gauge conviction—faster answers indicate higher confidence.
          </p>
        </div>

        {/* GESTALT Logo */}
        <div className="flex justify-center pt-4">
          <img src={gestaltLogo} alt="GESTALT" className="w-10 h-10 opacity-30" />
        </div>
      </div>
    </div>
  );
}
