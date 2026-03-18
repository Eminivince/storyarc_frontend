import { motion } from "framer-motion";

function hexagonPoints(cx, cy, r) {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");
}

export default function RareBadge({ title, earned }) {
  const outer = hexagonPoints(40, 42, 36);
  const inner = hexagonPoints(40, 42, 28);

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated conic-gradient border glow */}
      {earned && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: "conic-gradient(from 0deg, #3b82f6, #60a5fa, #93c5fd, #3b82f6)",
            opacity: 0.2,
            filter: "blur(8px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}

      <svg viewBox="0 0 80 84" className="relative z-10 h-14 w-14" xmlns="http://www.w3.org/2000/svg">
        {/* Glow filter */}
        {earned && (
          <defs>
            <filter id="rare-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}

        {/* Outer hexagon */}
        <polygon
          points={outer}
          fill={earned ? "#3b82f6" : "#6b7280"}
          opacity={earned ? 0.9 : 0.3}
          stroke={earned ? "#2563eb" : "#6b7280"}
          strokeWidth="2"
          filter={earned ? "url(#rare-glow)" : undefined}
        />
        {/* Inner hexagon accent */}
        <polygon
          points={inner}
          fill="none"
          stroke={earned ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}
          strokeWidth="1.5"
        />
        {/* Letter */}
        <text
          x="40"
          y="42"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="22"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          {title?.charAt(0) ?? "?"}
        </text>
      </svg>
    </div>
  );
}
