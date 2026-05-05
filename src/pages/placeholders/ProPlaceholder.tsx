import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProPlaceholderProps {
  title: string;
  description: string;
}

export function ProPlaceholder({ title, description }: ProPlaceholderProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-gold-dim flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-gold" />
      </div>
      <h1 className="text-[24px] font-semibold text-foreground mb-2">{title}</h1>
      <p className="text-[14px] text-foreground-secondary mb-6 max-w-md">
        {description}
      </p>
      <div className="flex items-center gap-3">
        <Button className="bg-gold text-primary-foreground hover:bg-gold/90">
          Upgrade to PRO
        </Button>
        <Button variant="secondary">Learn More</Button>
      </div>
    </div>
  );
}
