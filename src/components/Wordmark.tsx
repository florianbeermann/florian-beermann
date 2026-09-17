import { BrandMark } from "./BrandMark";

/* The drawing uses only the surname; its accessible name keeps the full
   trading name. Relative measurements let each caller scale the whole logo. */
export function Wordmark({
  className,
  layout = "horizontal",
}: {
  className?: string;
  layout?: "horizontal" | "stacked";
}) {
  return (
    <span
      className={className ? `wordmark ${className}` : "wordmark"}
      data-layout={layout}
      role="img"
      aria-label="Beermann & Company"
    >
      <BrandMark className="wordmark-mark" />
      <span className="wordmark-name" aria-hidden="true">BEERMANN</span>
    </span>
  );
}
