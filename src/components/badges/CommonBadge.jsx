import { motion } from "framer-motion";

export default function CommonBadge({ title, earned }) {
  return (
    <motion.div
      className="flex items-center justify-center"
      animate={earned ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 80 80" className="h-14 w-14" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring */}
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={earned ? "#9ca3af" : "#6b7280"}
          strokeWidth="3"
          opacity={earned ? 1 : 0.4}
        />
        {/* Inner fill */}
        <circle
          cx="40"
          cy="40"
          r="30"
          fill={earned ? "#9ca3af" : "#6b7280"}
          opacity={earned ? 0.9 : 0.3}
        />
        {/* Letter */}
        <text
          x="40"
          y="40"
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
    </motion.div>
  );
}
