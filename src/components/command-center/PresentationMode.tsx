import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Slide } from "./PresentationPanel";

interface PresentationModeProps {
  slides: Slide[];
  isOpen: boolean;
  onClose: () => void;
  startIndex?: number;
}

export function PresentationMode({
  slides,
  isOpen,
  onClose,
  startIndex = 0,
}: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (currentIndex < slides.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  }, [currentIndex, slides.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  }, [currentIndex, isTransitioning]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
          e.preventDefault();
          goToNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          goToPrev();
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    },
    [goToNext, goToPrev, onClose, toggleFullscreen]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      
      // Request fullscreen on open
      document.documentElement.requestFullscreen?.().catch(() => {
        // Fullscreen not supported or blocked
      });
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex, isOpen]);

  if (!isOpen || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];
  const progress = ((currentIndex + 1) / slides.length) * 100;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        backgroundColor: "#000000",
        zIndex: 9999,
      }}
    >
      {/* Exit Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 transition-colors z-10"
        style={{ fontSize: "24px", color: "#666666" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation - Previous */}
      <button
        onClick={goToPrev}
        disabled={currentIndex === 0}
        className="fixed left-12 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all z-10 disabled:opacity-20 disabled:cursor-not-allowed"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#141414",
          border: "1px solid #1a1a1a",
        }}
        onMouseEnter={(e) => {
          if (currentIndex > 0) e.currentTarget.style.backgroundColor = "#1a1a1a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#141414";
        }}
      >
        <ChevronLeft className="w-6 h-6" style={{ color: "#ffffff" }} />
      </button>

      {/* Navigation - Next */}
      <button
        onClick={goToNext}
        disabled={currentIndex === slides.length - 1}
        className="fixed right-12 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all z-10 disabled:opacity-20 disabled:cursor-not-allowed"
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#141414",
          border: "1px solid #1a1a1a",
        }}
        onMouseEnter={(e) => {
          if (currentIndex < slides.length - 1) e.currentTarget.style.backgroundColor = "#1a1a1a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#141414";
        }}
      >
        <ChevronRight className="w-6 h-6" style={{ color: "#ffffff" }} />
      </button>

      {/* Slide Container */}
      <div
        className="relative transition-opacity duration-300"
        style={{
          maxWidth: "1200px",
          maxHeight: "80vh",
          width: "90vw",
          backgroundColor: "#0a0a0a",
          border: "1px solid #1a1a1a",
          padding: "48px",
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        {/* Slide Title */}
        <div
          className="mb-8"
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.02em",
          }}
        >
          {currentSlide.widgetTitle}
        </div>

        {/* Widget Type Badge */}
        <div className="mb-8">
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#c9a227",
              backgroundColor: "rgba(201, 162, 39, 0.1)",
              padding: "6px 16px",
              border: "1px solid #c9a227",
            }}
          >
            {currentSlide.widgetType}
          </span>
        </div>

        {/* Slide Content */}
        <div
          className="min-h-[300px] flex items-center justify-center"
          style={{
            backgroundColor: "#141414",
            border: "1px solid #1a1a1a",
            padding: "32px",
          }}
        >
          {currentSlide.preview || (
            <div className="text-center">
              <div
                style={{
                  fontSize: "64px",
                  fontWeight: 700,
                  color: "#c9a227",
                  marginBottom: "16px",
                  letterSpacing: "0.05em",
                }}
              >
                {currentSlide.widgetType.toUpperCase()}
              </div>
              <div style={{ fontSize: "18px", color: "#666666" }}>
                Widget data preview
              </div>
              {currentSlide.data && (
                <div
                  className="mt-6 text-left mx-auto max-w-md p-4"
                  style={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                    fontSize: "12px",
                    color: "#a0a0a0",
                    fontFamily: "monospace",
                  }}
                >
                  <pre className="overflow-auto">
                    {JSON.stringify(currentSlide.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* GESTALT Logo - Bottom Right */}
        <div
          className="absolute bottom-6 right-8 flex items-center gap-2"
          style={{ opacity: 0.5 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="24" fill="#c9a227" />
            <path
              d="M6 6h12v12H6z"
              fill="#0a0a0a"
            />
            <path
              d="M8 8h8v8H8z"
              fill="#c9a227"
            />
          </svg>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "#666666",
            }}
          >
            GESTALT
          </span>
        </div>
      </div>

      {/* Slide Counter - Bottom Center */}
      <div
        className="fixed bottom-12 left-1/2 -translate-x-1/2"
        style={{
          fontSize: "14px",
          color: "#666666",
        }}
      >
        {currentIndex + 1} / {slides.length}
      </div>

      {/* Progress Bar - Fixed Bottom */}
      <div
        className="fixed bottom-0 left-0 right-0"
        style={{
          height: "4px",
          backgroundColor: "#1a1a1a",
        }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: "#c9a227",
          }}
        />
      </div>

      {/* Keyboard Hints */}
      <div
        className="fixed bottom-12 left-6 flex items-center gap-6"
        style={{ fontSize: "11px", color: "#444444" }}
      >
        <span>← → Navigate</span>
        <span>Space Next</span>
        <span>F Fullscreen</span>
        <span>ESC Exit</span>
      </div>
    </div>
  );
}

export default PresentationMode;
