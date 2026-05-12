import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ConfidenceSliderProps {
  onSubmit: (rating: number) => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
}

const confidenceLevels = [
  { value: 0, label: "Completely Uncertain" },
  { value: 1, label: "Very Uncertain" },
  { value: 2, label: "Mostly Uncertain" },
  { value: 3, label: "Somewhat Uncertain" },
  { value: 4, label: "Slightly Uncertain" },
  { value: 5, label: "Neutral" },
  { value: 6, label: "Slightly Confident" },
  { value: 7, label: "Somewhat Confident" },
  { value: 8, label: "Mostly Confident" },
  { value: 9, label: "Very Confident" },
  { value: 10, label: "Completely Confident" },
];

export function ConfidenceSlider({
  onSubmit,
  onPrevious,
  showPrevious = false,
}: ConfidenceSliderProps) {
  const [rating, setRating] = useState<number>(5);

  const currentLevel = confidenceLevels.find((l) => l.value === rating);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col animate-fade-in px-4 py-8">
      <div className="w-full max-w-[700px] mx-auto text-left" style={{ marginTop: '5vh' }}>
        {/* Header */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-dim border border-gold">
            <span className="text-[11px] font-bold tracking-[2px] text-gold uppercase">
              Final Confidence Rating
            </span>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-[28px] md:text-[33px] font-book text-gold leading-relaxed mb-4">
          How confident are you in the answers you provided?
        </h2>

        {/* Subtext */}
        <p className="text-[14px] text-foreground-muted mb-12">
          Rate your overall confidence level on a scale of 1-10. This helps us understand how certain you are about your brand's current state.
        </p>

        {/* Slider Value Display */}
        <div className="text-center mb-8">
          <div className="text-[72px] font-bold text-gold leading-none mb-2">
            {rating}
          </div>
          <div className="text-[14px] font-medium text-foreground-secondary uppercase tracking-[1px]">
            {currentLevel?.label}
          </div>
        </div>

        {/* Slider */}
        <div className="mb-12 relative">
          {/* Animated hint text */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="text-[12px] text-gold font-medium animate-pulse">Drag to set your confidence</span>
          </div>
          
          
          <Slider
            value={[rating]}
            onValueChange={(values) => setRating(values[0])}
            min={0}
            max={10}
            step={1}
            className="w-full"
          />
          {/* Scale labels */}
          <div className="flex justify-between mt-3">
            <span className="text-[11px] text-foreground-muted">0 - Uncertain</span>
            <span className="text-[11px] text-foreground-muted">10 - Confident</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={() => onSubmit(rating)}
          className="w-full h-14 text-[18px] font-semibold tracking-[1px] bg-gold/25 border border-gold text-gold hover:bg-gold hover:text-primary-foreground"
        >
          SUBMIT FINAL RATING
        </Button>

        {/* Previous Button */}
        {showPrevious && onPrevious && (
          <div className="flex justify-end mt-4">
            <Button
              variant="ghost"
              onClick={onPrevious}
              className="group gap-2 font-book text-foreground-muted/50 hover:bg-transparent hover:text-gold/50 active:text-gold focus:text-gold p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Previous Question
            </Button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 border border-border">
          <p className="text-[13px] text-foreground-muted">
            <span className="text-foreground font-semibold">Why we ask this:</span>{" "}
            Your confidence rating helps weight your responses. Lower confidence may indicate 
            areas where additional research or consultation could provide clarity.
          </p>
        </div>
      </div>
    </div>
  );
}
