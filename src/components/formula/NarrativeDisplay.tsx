interface Props {
  text: string;
  /** Color used for `[BRACKETED]` highlight words. Defaults to gold. */
  wordColor?: string;
}

/**
 * Renders narrative prose with `[WORD]` markers swapped for bold colored
 * uppercase tokens — used by the manifesto and competitor-narrative outputs.
 */
export function NarrativeDisplay({ text, wordColor = "#e2b53f" }: Props) {
  if (!text) return null;
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <p className="text-foreground text-[18px] leading-[2] font-normal">
      {parts.map((part, i) => {
        const isWord = /^\[.+\]$/.test(part);
        if (isWord) {
          const word = part.slice(1, -1).toUpperCase();
          return (
            <strong key={i} className="text-[19px] font-black" style={{ color: wordColor }}>
              {word}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
