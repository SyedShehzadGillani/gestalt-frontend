import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AnalyticsCardData {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number; // positive or negative percentage
}

export const AnalyticsCard: React.FC<{ data: AnalyticsCardData; presentation?: boolean }> = ({ data, presentation }) => {
  const trendColor = data.trend == null ? "" : data.trend >= 0 ? "text-green-500" : "text-red-500";
  const cardClasses = presentation
    ? "bg-black/75 border-transparent backdrop-blur-sm"
    : "bg-card/60 backdrop-blur border-border";
  return (
    <Card className={cardClasses}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm text-muted-foreground ${presentation ? 'text-base' : ''}`}>{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`font-semibold text-foreground ${presentation ? 'text-5xl' : 'text-3xl'}`}>{data.value}</div>
        {data.subtitle && <div className="text-sm text-muted-foreground mt-1">{data.subtitle}</div>}
        {data.trend != null && (
          <div className={`text-xs mt-2 ${trendColor}`}>{data.trend > 0 ? "+" : ""}{data.trend}% vs last period</div>
        )}
      </CardContent>
    </Card>
  );
};
