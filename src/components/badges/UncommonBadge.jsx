import { motion } from "framer-motion";

export default function UncommonBadge({ title, earned }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Shimmer overlay */}
      {earned && (
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-lg"
          style={{ zIndex: 1, pointerEvents: "none" }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(34,197,94,0.15) 45%, rgba(34,197,94,0.3) 50%, rgba(34,197,94,0.15) 55%, transparent 60%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          />
        </motion.div>
      )}

      <svg viewBox="0 0 80 90" className="h-14 w-14" xmlns="http://www.w3.org/2000/svg">
        {/* Shield shape */}
        <path
          d="M40 5 L72 20 L72 50 Q72 75 40 87 Q8 75 8 50 L8 20 Z"
          fill={earned ? "#22c55e" : "#6b7280"}
          opacity={earned ? 0.9 : 0.3}
          stroke={earned ? "#16a34a" : "#6b7280"}
          strokeWidth="2"
        />
        {/* Inner shield accent */}
        <path
          d="M40 14 L64 26 L64 48 Q64 68 40 78 Q16 68 16 48 L16 26 Z"
          fill="none"
          stroke={earned ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}
          strokeWidth="1.5"
        />
        {/* Letter */}
        <text
          x="40"
          y="48"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="24"
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
        >
          {title?.charAt(0) ?? "?"}
        </text>
      </svg>
    </div>
  );
}
