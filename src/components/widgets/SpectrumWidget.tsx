import * as React from "react";
import { Widget } from "./Widget";

interface ScoreItem {
  label: string;
  value: number;
  maxValue: number;
}

export interface SpectrumWidgetProps {
  title?: string;
  icon?: React.ReactNode;
  scores: ScoreItem[];
  overallScore: number;
  status: string;
  statusColor: string;
  size?: "medium" | "large" | "wide";
  showSegmentLabels?: boolean;
  className?: string;
}

// Spectrum segments
const segments = [
  { min: 0, max: 20, label: "LIQUIDATION" },
  { min: 21, max: 40, label: "EXIT UNLIKELY" },
  { min: 41, max: 60, label: "DISRUPTION" },
  { min: 61, max: 75, label: "VULNERABLE" },
  { min: 76, max: 90, label: "EXIT POSSIBLE" },
  { min: 91, max: 100, label: "EXIT READY" },
];

// Get spectrum color based on percentage
const getSpectrumColor = (percentage: number): string => {
  if (percentage <= 20) return "#5d1414";
  if (percentage <= 40) return "#8b2020";
  if (percentage <= 60) return "#c45c00";
  if (percentage <= 75) return "#c9a227";
  if (percentage <= 90) return "#5a8a3a";
  return "#78b956";
};

export function SpectrumWidget({
  title = "Brand Health Spectrum",
  icon,
  scores,
  overallScore,
  status,
  statusColor,
  size = "wide",
  showSegmentLabels = true,
  className,
}: SpectrumWidgetProps) {
  const markerPosition = `${overallScore}%`;

  return (
    <Widget
      title={title}
      icon={icon}
      size={size}
      className={className}
    >
      <div>
        {/* Category Scores Row */}
        {scores.length > 0 && (
          <div className="mb-6">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${scores.length}, 1fr)`,
              }}
            >
              {scores.map((score, index) => {
                const percentage = Math.round((score.value / score.maxValue) * 100);
                const dotColor = getSpectrumColor(percentage);

                return (
                  <div key={index} className="text-center">
                    <div
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--content-text3)",
                        marginBottom: "4px",
                      }}
                    >
                      {score.label}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "var(--content-text1)",
                        marginBottom: "8px",
                      }}
                    >
                      {percentage}%
                    </div>
                    <div className="flex justify-center">
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: dotColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                height: "2px",
                backgroundColor: "var(--content-border)",
                marginTop: "-7px",
                marginBottom: "16px",
              }}
            />
          </div>
        )}

        {/* Spectrum Bar */}
        <div className="relative">
          <div
            style={{
              height: "20px",
              borderRadius: "9999px",
              background:
                "linear-gradient(to right, #5d1414 0%, #8b2020 20%, #c45c00 40%, #c9a227 60%, #5a8a3a 80%, #78b956 100%)",
            }}
          />

          {/* Position Marker */}
          <div
            className="absolute -translate-x-1/2"
            style={{ 
              left: markerPosition,
              top: "-12px",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "10px solid var(--content-text1)",
              }}
            />
            <div
              style={{
                width: "2px",
                height: "20px",
                backgroundColor: "var(--content-text1)",
                margin: "0 auto",
              }}
            />
            <div
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--content-text1)",
                textAlign: "center",
                marginTop: "4px",
              }}
            >
              {overallScore}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mt-4 mb-4">
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "6px 14px",
              backgroundColor: `${statusColor}26`,
              color: statusColor,
            }}
          >
            {status}
          </span>
        </div>

        {/* Segment Labels */}
        {showSegmentLabels && (
          <div
            className="grid mt-4"
            style={{ gridTemplateColumns: "repeat(6, 1fr)" }}
          >
            {segments.map((segment, index) => (
              <div key={index} className="text-center">
                <div
                  style={{
                    fontSize: "9px",
                    color: "var(--content-text3)",
                    marginBottom: "2px",
                  }}
                >
                  {segment.min}-{segment.max}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--content-text3)",
                  }}
                >
                  {segment.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Widget>
  );
}

SpectrumWidget.displayName = "SpectrumWidget";
