import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import gestaltLogo from "@/assets/gestalt-logo.svg";

interface Question {
  id: number;
  category: string;
  text: string;
  citations: {
    text: string;
    highlight: string;
    source: string;
  }[];
}

interface QuestionScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  answer: boolean | null;
  onAnswer: (value: boolean) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onNavigateToCategory?: (category: string) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function QuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  answer,
  onAnswer,
  onPrevious,
  onSubmit,
  onNavigateToCategory,
  isFirst,
  isLast,
}: QuestionScreenProps) {
  const questionNumber = currentIndex + 1;

  const categories = ["WELCOME", "PERCEPTION", "CLARITY", "IDENTITY", "CULTURE", "EXIT"];
  const currentCategoryIndex = categories.indexOf(question.category.toUpperCase());

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col animate-fade-in px-4 py-8">
      {/* Breadcrumbs */}
      <div className="w-full max-w-[700px] mx-auto mb-8">
        <div className="flex items-center justify-center gap-2 text-[11px] font-medium tracking-[2px] uppercase">
          {categories.map((cat, index) => {
            const isClickable = index > 0 && index < categories.length - 1 && index < currentCategoryIndex;
            const canNavigate = index > 0 && index < categories.length - 1 && index <= currentCategoryIndex;
            
            return (
              <div key={cat} className="flex items-center gap-2">
                <span 
                  className={`${
                    index < currentCategoryIndex 
                      ? "text-gold/50" 
                      : index === currentCategoryIndex 
                        ? "text-white [.light_&]:text-black text-[13px]" 
                        : "text-foreground-muted"
                  } ${canNavigate ? "cursor-pointer hover:text-gold transition-colors duration-200" : ""}`}
                  onClick={() => {
                    if (canNavigate && onNavigateToCategory) {
                      onNavigateToCategory(cat);
                    }
                  }}
                >
                  {cat}
                </span>
                {index < categories.length - 1 && (
                  <span className="text-foreground-muted">/</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Container - anchored at 25% from top */}
      <div className="w-full max-w-[700px] mx-auto text-left" style={{ marginTop: '5vh' }}>
        {/* Question Number / Category + Previous Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[18px] md:text-[21px] font-normal text-gold">
              {String(questionNumber).padStart(2, "0")}
            </span>
            <span className="text-[18px] md:text-[21px] font-light text-gold">/</span>
            <span className="text-[18px] md:text-[21px] font-book tracking-[2px] text-white [.light_&]:text-black uppercase">
              {question.category}
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

        {/* Question Text - Gotham Book */}
        <h2 className="text-[33px] md:text-[38px] font-book text-gold leading-relaxed mb-10">
          {question.text}
        </h2>

        {/* Answer Buttons - stacked, aligned with centered SUBMIT */}
        <div className="space-y-3 mb-8 pl-[25px]">
          <button
            onClick={() => onAnswer(true)}
            className={`w-[175px] h-14 flex items-center justify-center text-[18px] font-medium tracking-[1px] border transition-all ${
              answer === true
                ? "bg-gold/25 text-gold border-gold"
                : "bg-dark-gray text-gold border-gold/50 hover:border-gold"
            }`}
          >
            YES
          </button>
          <button
            onClick={() => onAnswer(false)}
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

        {/* Submit Button - Centered */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={onSubmit}
            disabled={answer === null}
            className="w-[calc(100%-50px)] h-14 text-[18px] font-semibold tracking-[1px] bg-gold/25 border border-gold text-gold hover:bg-gold hover:text-primary-foreground disabled:opacity-50"
          >
            SUBMIT
          </Button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gold mb-8 opacity-20" />

        {/* Citations */}
        <div className="space-y-6">
          {question.citations.map((citation, index) => (
            <div key={index} className="text-left">
              <p className="text-[18px] md:text-[19px] text-foreground-muted leading-relaxed">
                <span className="text-white [.light_&]:text-black font-book">
                  {citation.highlight.split(/([$€£]?\d+(?:\.\d+)?[%xkKmMbBtT]?(?:\s*(?:trillion|billion|million|thousand))?)/g).map((part, i) => 
                    /[$€£]?\d+(?:\.\d+)?[%xkKmMbBtT]?(?:\s*(?:trillion|billion|million|thousand))?/.test(part) ? <strong key={i} className="font-bold text-white [.light_&]:text-black">{part}</strong> : part
                  )}
                </span>{" "}
                {citation.text.split(/([$€£]?\d+(?:\.\d+)?[%xkKmMbBtT]?(?:\s*(?:trillion|billion|million|thousand))?)/g).map((part, i) => 
                  /[$€£]?\d+(?:\.\d+)?[%xkKmMbBtT]?(?:\s*(?:trillion|billion|million|thousand))?/.test(part) ? <strong key={i} className="font-bold text-foreground">{part}</strong> : part
                )}
              </p>
              <p className="text-[12px] italic mt-1" style={{ color: '#394150' }}>
                -{citation.source}
              </p>
            </div>
          ))}
          
          {/* GESTALT Logo */}
          <div className="flex justify-center pt-8">
            <img 
              src={gestaltLogo} 
              alt="GESTALT" 
              className="w-10 h-10 opacity-30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
