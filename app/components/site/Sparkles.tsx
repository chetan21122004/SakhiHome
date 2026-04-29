import { useMemo } from "react";

interface SparklesProps {
  count?: number;
  className?: string;
}

function pseudoRandom(seed: number) {
  let x = (seed ^ 0x9e3779b9) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
  x = (x ^ (x >>> 16)) >>> 0;
  return x / 4294967296;
}

/** Subtle glowing particles for dark sections — matches the logo stars ✨ */
const Sparkles = ({ count = 18, className = "" }: SparklesProps) => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: pseudoRandom(i + count * 11) * 100,
        left: pseudoRandom(i + count * 22) * 100,
        size: 4 + pseudoRandom(i + count * 33) * 6,
        delay: pseudoRandom(i + count * 44) * 3,
        duration: 2 + pseudoRandom(i + count * 55) * 2.5,
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
