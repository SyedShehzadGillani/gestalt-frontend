import { useEffect, useState } from 'react';
import { useTour } from '@/contexts/TourContext';
import { TourTooltip } from './TourTooltip';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TourOverlay() {
  const { state, currentTour, currentStepData, nextStep, prevStep, skipTour } = useTour();
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);

  useEffect(() => {
    if (!state.isActive || !currentStepData) {
      setSpotlight(null);
      return;
    }

    const updateSpotlight = () => {
      const targetElement = document.querySelector(currentStepData.target);
      if (!targetElement) {
        setSpotlight(null);
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      const padding = 8;

      setSpotlight({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Scroll element into view if needed
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(updateSpotlight, 100);

    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
    };
  }, [state.isActive, currentStepData, state.currentStep]);

  if (!state.isActive || !currentTour || !currentStepData) {
    return null;
  }

  return (
    <>
      {/* Overlay with spotlight cutout */}
      <div className="fixed inset-0 z-[1000] pointer-events-auto">
        <svg
          className="absolute inset-0 w-full h-full transition-all duration-300 ease-out"
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {spotlight && (
                <rect
                  x={spotlight.left}
                  y={spotlight.top}
                  width={spotlight.width}
                  height={spotlight.height}
                  fill="black"
                  className="transition-all duration-300 ease-out"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.6)"
            mask="url(#spotlight-mask)"
          />
        </svg>

        {/* Spotlight border/glow effect */}
        {spotlight && (
          <div
            className="absolute transition-all duration-300 ease-out pointer-events-none"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
              boxShadow: '0 0 0 2px hsl(var(--gold)), 0 0 20px rgba(201, 162, 39, 0.4)',
              animation: 'pulse-spotlight 2s ease-in-out infinite',
            }}
          />
        )}

        {/* Click blocker for the overlay area */}
        <div 
          className="absolute inset-0" 
          onClick={(e) => {
            // Only allow clicks on the spotlighted element
            if (spotlight) {
              const rect = {
                top: spotlight.top,
                left: spotlight.left,
                right: spotlight.left + spotlight.width,
                bottom: spotlight.top + spotlight.height,
              };
              const clickX = e.clientX;
              const clickY = e.clientY;
              
              if (
                clickX >= rect.left &&
                clickX <= rect.right &&
                clickY >= rect.top &&
                clickY <= rect.bottom
              ) {
                // Click is within spotlight, allow it
                return;
              }
            }
            // Block other clicks
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </div>

      {/* Tooltip */}
      <TourTooltip
        step={currentStepData}
        stepNumber={state.currentStep + 1}
        totalSteps={currentTour.steps.length}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipTour}
        isFirstStep={state.currentStep === 0}
        isLastStep={state.currentStep === currentTour.steps.length - 1}
      />

      {/* Keyframe animation styles */}
      <style>{`
        @keyframes pulse-spotlight {
          0%, 100% {
            box-shadow: 0 0 0 2px hsl(var(--gold)), 0 0 20px rgba(201, 162, 39, 0.4);
          }
          50% {
            box-shadow: 0 0 0 2px hsl(var(--gold)), 0 0 30px rgba(201, 162, 39, 0.6);
          }
        }
      `}</style>
    </>
  );
}
