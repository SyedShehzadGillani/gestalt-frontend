import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TourStep } from '@/data/tourData';

interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

interface TourTooltipProps {
  step: TourStep;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function TourTooltip({
  step,
  stepNumber,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  isFirstStep,
  isLastStep
}: TourTooltipProps) {
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculatePosition = () => {
      const targetElement = document.querySelector(step.target);
      if (!targetElement || !tooltipRef.current) return;

      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 16;
      const offset = 12;

      let placement = step.placement || 'right';
      let top = 0;
      let left = 0;

      // Calculate best placement if not specified or if specified placement doesn't fit
      const spaceRight = viewportWidth - targetRect.right;
      const spaceLeft = targetRect.left;
      const spaceBottom = viewportHeight - targetRect.bottom;
      const spaceTop = targetRect.top;

      // Auto-adjust placement based on available space
      if (placement === 'right' && spaceRight < tooltipRect.width + padding) {
        placement = spaceLeft > spaceRight ? 'left' : 'bottom';
      } else if (placement === 'left' && spaceLeft < tooltipRect.width + padding) {
        placement = spaceRight > spaceLeft ? 'right' : 'bottom';
      } else if (placement === 'bottom' && spaceBottom < tooltipRect.height + padding) {
        placement = spaceTop > spaceBottom ? 'top' : 'right';
      } else if (placement === 'top' && spaceTop < tooltipRect.height + padding) {
        placement = spaceBottom > spaceTop ? 'bottom' : 'right';
      }

      switch (placement) {
        case 'right':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.right + offset;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.left - tooltipRect.width - offset;
          break;
        case 'bottom':
          top = targetRect.bottom + offset;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'top':
          top = targetRect.top - tooltipRect.height - offset;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
      }

      // Keep tooltip within viewport
      top = Math.max(padding, Math.min(top, viewportHeight - tooltipRect.height - padding));
      left = Math.max(padding, Math.min(left, viewportWidth - tooltipRect.width - padding));

      setPosition({ top, left, placement });
    };

    // Initial calculation
    setIsVisible(false);
    const timer = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, 50);

    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [step]);

  const getArrowStyles = () => {
    if (!position) return {};
    
    const arrowSize = 8;
    const baseStyles = {
      position: 'absolute' as const,
      width: 0,
      height: 0,
      borderStyle: 'solid' as const,
    };

    switch (position.placement) {
      case 'right':
        return {
          ...baseStyles,
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: 'transparent hsl(var(--card)) transparent transparent',
        };
      case 'left':
        return {
          ...baseStyles,
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: 'transparent transparent transparent hsl(var(--card))',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: 'transparent transparent hsl(var(--card)) transparent',
        };
      case 'top':
        return {
          ...baseStyles,
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: 'hsl(var(--card)) transparent transparent transparent',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div
      ref={tooltipRef}
      className={`fixed z-[1001] transition-all duration-300 ease-out ${
        isVisible && position ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{
        top: position?.top ?? -9999,
        left: position?.left ?? -9999,
        maxWidth: '320px',
      }}
    >
      {/* Arrow */}
      <div style={getArrowStyles()} />
      
      {/* Tooltip Content */}
      <div
        className="bg-card p-5"
        style={{
          border: '1px solid hsl(var(--gold))',
          boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)',
        }}
      >
        {/* Step Indicator with optional badge */}
        <div className="flex items-center justify-between mb-2">
          <p 
            className="text-muted-foreground"
            style={{ fontSize: '10px' }}
          >
            Step {stepNumber} of {totalSteps}
          </p>
          {step.badge && (
            <span 
              className="text-primary border border-primary px-1.5 py-0.5"
              style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '1px' }}
            >
              {step.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 
          className="text-foreground mb-2"
          style={{ fontSize: '16px', fontWeight: 600 }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p 
          className="text-muted-foreground"
          style={{ fontSize: '14px', lineHeight: 1.6 }}
        >
          {step.description}
        </p>

        {/* Optional Note */}
        {step.note && (
          <p 
            className="text-muted-foreground/70 mt-2 italic"
            style={{ fontSize: '12px' }}
          >
            {step.note}
          </p>
        )}

        {/* Button Row */}
        <div className="flex items-center justify-between gap-3 mt-5">
          <button
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontSize: '12px' }}
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrev}
                className="h-8 px-3"
                style={{ fontSize: '12px' }}
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Back
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={onNext}
              className="h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
              style={{ fontSize: '12px' }}
            >
              {isLastStep ? (step.ctaText || 'Get Started') : (
                <>
                  Next
                  <ChevronRight className="w-3 h-3 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
