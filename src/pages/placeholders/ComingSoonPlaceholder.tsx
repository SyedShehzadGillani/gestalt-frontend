import { Clock } from "lucide-react";

interface ComingSoonPlaceholderProps {
  title: string;
  subtitle?: string;
}

export function ComingSoonPlaceholder({ title, subtitle }: ComingSoonPlaceholderProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-muted flex items-center justify-center mb-6">
        <Clock className="w-10 h-10 text-foreground-muted" />
      </div>
      <h1 className="text-[24px] font-semibold text-foreground mb-2">{title}</h1>
      {subtitle && (
        <p className="text-[14px] text-foreground-secondary max-w-md">
          {subtitle}
        </p>
      )}
      <p className="text-[13px] text-foreground-muted mt-4">Coming soon...</p>
    </div>
  );
}
