import { useState } from "react";

export function ConfidenceStep({
  module,
  onSubmit,
}: {
  module: "FRAMEWORK" | "FOCUS";
  onSubmit: (rating: number) => void;
}) {
  const [rating, setRating] = useState<number | null>(null);
  return (
    <div className="ob-confidence">
      <div className="ob-label">{module} · CONFIDENCE CHECK</div>
      <h2 className="ob-confidence-h2">How confident are you in your answers?</h2>
      <p className="ob-confidence-sub">Rate your self-assessed confidence from 1 to 10.</p>
      <div className="ob-confidence-scale">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`ob-confidence-dot ${rating === n ? "picked" : ""}`}
            onClick={() => setRating(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <button
        className={`ob-q-submit ${rating ? "active" : ""}`}
        disabled={!rating}
        onClick={() => rating && onSubmit(rating)}
      >
        SEE MY RESULTS
      </button>
    </div>
  );
}
