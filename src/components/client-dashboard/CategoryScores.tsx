interface CategoryScore {
  name: string;
  score: number;
}

interface CategoryScoresProps {
  scores: CategoryScore[];
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-lime-400";
  if (score >= 40) return "text-warning";
  return "text-red";
}

function getBarColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-lime-400";
  if (score >= 40) return "bg-warning";
  return "bg-red";
}

export function CategoryScores({ scores }: CategoryScoresProps) {
  return (
    <div className="grid grid-cols-4 gap-5 mt-6" data-tour="category-scores">
      {scores.map((category) => (
        <div
          key={category.name}
          className="bg-muted border border-border p-5"
        >
          <div className="text-[10px] font-bold tracking-[2px] text-foreground-secondary uppercase mb-3">
            {category.name}
          </div>
          <div className={`text-[28px] font-semibold mb-3 ${getScoreColor(category.score)}`}>
            {category.score}%
          </div>
          <div className="h-2 bg-card">
            <div
              className={`h-full ${getBarColor(category.score)} transition-all duration-300`}
              style={{ width: `${category.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
