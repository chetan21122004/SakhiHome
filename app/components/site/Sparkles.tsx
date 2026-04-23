import { useMemo } from "react";

interface SparklesProps {
  count?: number;
  className?: string;
}

/** Subtle glowing particles for dark sections — matches the logo stars ✨ */
const Sparkles = ({ count = 18, className = "" }: SparklesProps) => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2.5,
      })),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {sparkles.map((s) => (
        <svg
          key={s.id}
          className="absolute text-accent animate-sparkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            filter: "drop-shadow(0 0 6px hsl(var(--accent) / 0.7))",
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L13.5 9L22 10.5L13.5 12L12 21L10.5 12L2 10.5L10.5 9L12 0Z" />
        </svg>
      ))}
    </div>
  );
};

export default Sparkles;
