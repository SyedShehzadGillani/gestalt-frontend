import { AnalyticsContent } from "@/components/analytics/AnalyticsContent";

export default function ClientAnalytics() {
  return (
    <div style={{ margin: "-24px", height: "calc(100vh - var(--nav-height))" }}>
      <AnalyticsContent />
    </div>
  );
}
