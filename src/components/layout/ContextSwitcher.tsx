import { ArrowLeft, Building2, Briefcase } from "lucide-react";
import { useAgencyContext } from "@/hooks/use-agency-context";
import { cn } from "@/lib/utils";

export function ContextSwitcher() {
  const { agency, currentClient, isAgencyView, backToAgency } = useAgencyContext();

  return (
    <div className="p-4 border-b border-border">
      {/* Back to Agency Link - only when viewing client */}
      {!isAgencyView && (
        <button
          onClick={backToAgency}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-3 group"
        >
          <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
          Back to Agency
        </button>
      )}

      {/* Context Card */}
      <div
        className={cn(
          "p-3 border transition-colors",
          isAgencyView
            ? "border-purple bg-purple/10"
            : "border-primary bg-gold-muted"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className={cn(
              "h-10 w-10 flex items-center justify-center",
              isAgencyView
                ? "bg-purple/20 text-purple"
                : "bg-gold-muted text-primary"
            )}
          >
            {isAgencyView ? (
              <Building2 className="h-5 w-5" />
            ) : (
              <Briefcase className="h-5 w-5" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {isAgencyView ? agency.name : currentClient?.name}
            </p>
            <p
              className={cn(
                "text-xs font-medium uppercase tracking-wider",
                isAgencyView ? "text-purple" : "text-primary"
              )}
            >
              {isAgencyView ? agency.plan : currentClient?.industry}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
