import { COMPANY_SCORES } from '@/data/mockData';
import { formatScore } from '@/lib/formatScore';

export default function ClientCreative() {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p
        style={{
          fontFamily: "'Gotham', 'Montserrat', system-ui, sans-serif",
          fontSize: 24,
          fontWeight: 900,
          color: '#c9a227',
          letterSpacing: '2px',
        }}
      >
        GESTALT SCORE: {formatScore(COMPANY_SCORES.gestaltScore)}
      </p>
      <p className="text-[11px] text-foreground-muted mt-4" style={{ letterSpacing: '1px' }}>
        MOCK DATA IMPORT CONFIRMED
      </p>
    </div>
  );
}
