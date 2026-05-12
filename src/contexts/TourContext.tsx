import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { tours, Tour, TourStep } from '@/data/tourData';

interface TourState {
  isActive: boolean;
  tourId: string | null;
  currentStep: number;
}

interface TourContextType {
  state: TourState;
  currentTour: Tour | null;
  currentStepData: TourStep | null;
  startTour: (tourId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  isTourCompleted: (tourId: string) => boolean;
  resetTour: (tourId: string) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const STORAGE_KEY = 'gestalt-completed-tours';

function getCompletedTours(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setCompletedTours(tours: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
}

export function TourProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TourState>({
    isActive: false,
    tourId: null,
    currentStep: 0
  });

  const currentTour = state.tourId ? tours[state.tourId] || null : null;
  const currentStepData = currentTour?.steps[state.currentStep] || null;

  const isTourCompleted = useCallback((tourId: string) => {
    return getCompletedTours().includes(tourId);
  }, []);

  const markTourCompleted = useCallback((tourId: string) => {
    const completed = getCompletedTours();
    if (!completed.includes(tourId)) {
      setCompletedTours([...completed, tourId]);
    }
  }, []);

  const startTour = useCallback((tourId: string) => {
    if (tours[tourId]) {
      setState({
        isActive: true,
        tourId,
        currentStep: 0
      });
    }
  }, []);

  const nextStep = useCallback(() => {
    if (!currentTour) return;
    
    if (state.currentStep < currentTour.steps.length - 1) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    } else {
      // Last step - complete the tour
      if (state.tourId) {
        markTourCompleted(state.tourId);
      }
      setState({
        isActive: false,
        tourId: null,
        currentStep: 0
      });
    }
  }, [currentTour, state.currentStep, state.tourId, markTourCompleted]);

  const prevStep = useCallback(() => {
    if (state.currentStep > 0) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1
      }));
    }
  }, [state.currentStep]);

  const skipTour = useCallback(() => {
    if (state.tourId) {
      markTourCompleted(state.tourId);
    }
    setState({
      isActive: false,
      tourId: null,
      currentStep: 0
    });
  }, [state.tourId, markTourCompleted]);

  const completeTour = useCallback(() => {
    if (state.tourId) {
      markTourCompleted(state.tourId);
    }
    setState({
      isActive: false,
      tourId: null,
      currentStep: 0
    });
  }, [state.tourId, markTourCompleted]);

  const resetTour = useCallback((tourId: string) => {
    const completed = getCompletedTours();
    setCompletedTours(completed.filter(id => id !== tourId));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!state.isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          skipTour();
          break;
        case 'Enter':
        case 'ArrowRight':
          nextStep();
          break;
        case 'ArrowLeft':
          prevStep();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isActive, nextStep, prevStep, skipTour]);

  return (
    <TourContext.Provider
      value={{
        state,
        currentTour,
        currentStepData,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        completeTour,
        isTourCompleted,
        resetTour
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
