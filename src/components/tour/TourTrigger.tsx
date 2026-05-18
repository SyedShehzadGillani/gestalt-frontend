import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTour } from '@/contexts/TourContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { useLocation } from 'react-router-dom';

export function TourTrigger() {
  const { startTour, isTourCompleted, resetTour } = useTour();
  const { isAgencyView } = useNavigation();
  const location = useLocation();

  const isAssessmentPage = location.pathname.includes('/framework');
  const isProjectDetailPage = location.pathname.match(/\/projects\/[^/]+$/);
  const isMessagingPage = location.pathname.includes('/messaging');
  
  const getAvailableTours = () => {
    const tours: { id: string; name: string; completed: boolean }[] = [];
    
    if (isAssessmentPage) {
      tours.push({
        id: 'assessmentIntro',
        name: 'Assessment Guide',
        completed: isTourCompleted('assessmentIntro')
      });
      tours.push({
        id: 'resultsIntro',
        name: 'Results Guide',
        completed: isTourCompleted('resultsIntro')
      });
    } else if (isProjectDetailPage) {
      tours.push({
        id: 'projectsIntro',
        name: 'Projects Guide',
        completed: isTourCompleted('projectsIntro')
      });
    } else if (isMessagingPage) {
      tours.push({
        id: 'chatIntro',
        name: 'GESTALT INTELLIGENCE Guide',
        completed: isTourCompleted('chatIntro')
      });
    } else if (isAgencyView) {
      tours.push({
        id: 'agencyOnboarding',
        name: 'Agency Tour',
        completed: isTourCompleted('agencyOnboarding')
      });
    } else {
      tours.push({
        id: 'clientOnboarding',
        name: 'Client Tour',
        completed: isTourCompleted('clientOnboarding')
      });
    }
    
    return tours;
  };

  const availableTours = getAvailableTours();

  const handleStartTour = (tourId: string) => {
    if (isTourCompleted(tourId)) {
      resetTour(tourId);
    }
    startTour(tourId);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          data-tour="help-menu"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-56 p-2"
        style={{ border: '1px solid hsl(var(--border))' }}
      >
        <div className="space-y-1">
          {availableTours.map((tour) => (
            <button
              key={tour.id}
              onClick={() => handleStartTour(tour.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors text-left"
            >
              <HelpCircle className="h-4 w-4" />
              {tour.completed ? `Restart ${tour.name}` : `Take ${tour.name}`}
            </button>
          ))}
          {availableTours.some(t => t.completed) && (
            <p className="px-3 py-1 text-xs text-muted-foreground">
              ✓ Tour completed
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
