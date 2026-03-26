import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MaterialSymbol from "./MaterialSymbol";

const SLICE_COLORS = [
  "#6b7280", // gray — 25 Points (common)
  "#22c55e", // green — 50 Points (standard)
  "#3b82f6", // blue — 75 Points (uncommon)
  "#8b5cf6", // purple — 100 Points (rare)
  "#f59e0b", // amber — 150 Points (very rare)
  "#ec4899", // pink — 2× Bonus (epic)
  "#f59e0b", // gold — 250 Points (legendary)
  "#ef4444", // red — Jackpot 500 (mythic)
];

const SLICE_LABELS = [
  "25 Pts",
  "50 Pts",
  "75 Pts",
  "100 Pts",
  "150 Pts",
  "2× Bonus",
  "250 Pts",
  "Jackpot",
];

const TOTAL_SLICES = 8;
const SLICE_ANGLE = 360 / TOTAL_SLICES;

function getSliceRotation(index) {
  return SLICE_ANGLE * index;
}

export default function RewardWheel({ isSpinning, onComplete, wheelResult }) {
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (isSpinning && wheelResult && !hasSpun) {
      // Calculate target rotation: multiple full spins + land on the correct slice
      // The pointer is at the top (12 o'clock). We need the winning slice to end up there.
      // Slice 0 starts at 0°, so to land on wheelIndex we rotate to align it with the top.
      const targetSliceAngle = wheelResult.wheelIndex * SLICE_ANGLE + SLICE_ANGLE / 2;
      const fullSpins = 360 * 5; // 5 full rotations for drama
      const targetRotation = fullSpins + (360 - targetSliceAngle);

      setRotation(targetRotation);
      setHasSpun(true);

      // Show result after spin animation completes
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [isSpinning, wheelResult, hasSpun]);

  useEffect(() => {
    if (showResult && onComplete && wheelResult) {
      const timer = setTimeout(() => {
        onComplete(wheelResult);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showResult, onComplete, wheelResult]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Pointer arrow at top */}
        <div className="relative z-10 -mb-4">
          <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <div className="relative h-72 w-72 sm:h-80 sm:w-80">
          <motion.div
            className="h-full w-full rounded-full border-4 border-primary/30 shadow-2xl shadow-primary/20"
            style={{
              background: generateConicGradient(),
            }}
            animate={{ rotate: rotation }}
            initial={{ rotate: 0 }}
            transition={{
              duration: 3,
              ease: [0.2, 0.8, 0.3, 1],
            }}
          >
            {/* Slice labels */}
            {SLICE_LABELS.map((label, i) => {
              const angle = getSliceRotation(i) + SLICE_ANGLE / 2;
              return (
                <div
                  className="absolute left-1/2 top-1/2 origin-center"
                  key={i}
                  style={{
                    transform: `rotate(${angle}deg) translateY(-100px) rotate(-${angle}deg)`,
                    marginLeft: "-24px",
                    marginTop: "-10px",
                  }}
                >
                  <span className="text-[10px] font-bold text-white drop-shadow-md sm:text-xs">
                    {label}
                  </span>
                </div>
              );
            })}

            {/* Center circle */}
            <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary/30 bg-background-dark shadow-inner">
              <MaterialSymbol name="toll" className="text-2xl text-primary" />
            </div>
          </motion.div>
        </div>

        {/* Result display */}
        <AnimatePresence>
          {showResult && wheelResult && (
            <motion.div
              className="flex flex-col items-center gap-2 rounded-2xl border border-primary/30 bg-background-dark/90 px-8 py-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <MaterialSymbol name="celebration" className="text-4xl text-primary" />
              <p className="text-lg font-bold text-white">
                {wheelResult.label}
              </p>
              <p className="text-3xl font-bold text-primary">
                +{wheelResult.finalPoints}
              </p>
              {wheelResult.streakMultiplier > 1 && (
                <p className="text-xs text-slate-400">
                  {wheelResult.streakMultiplier}× streak multiplier applied
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function generateConicGradient() {
  const parts = [];
  const sliceSize = 100 / TOTAL_SLICES;

  for (let i = 0; i < TOTAL_SLICES; i++) {
    const start = sliceSize * i;
    const end = sliceSize * (i + 1);
    parts.push(`${SLICE_COLORS[i]} ${start}% ${end}%`);
  }

  return `conic-gradient(from 0deg, ${parts.join(", ")})`;
}
