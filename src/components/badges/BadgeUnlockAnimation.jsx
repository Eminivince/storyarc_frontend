import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BadgeVisual from "./BadgeVisual";

const RARITY_COLORS = {
  COMMON: { bg: "from-gray-900/90 to-gray-800/90", accent: "text-gray-300", ring: "ring-gray-400" },
  UNCOMMON: { bg: "from-green-950/90 to-green-900/90", accent: "text-green-400", ring: "ring-green-500" },
  RARE: { bg: "from-blue-950/90 to-blue-900/90", accent: "text-blue-400", ring: "ring-blue-500" },
  EPIC: { bg: "from-purple-950/90 to-purple-900/90", accent: "text-purple-400", ring: "ring-purple-500" },
  LEGENDARY: { bg: "from-amber-950/90 to-amber-900/90", accent: "text-amber-400", ring: "ring-amber-500" },
};

export default function BadgeUnlockAnimation({ badge, onDismiss }) {
  const colors = RARITY_COLORS[badge?.rarity] ?? RARITY_COLORS.COMMON;

  useEffect(() => {
    if (!badge) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [badge, onDismiss]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onDismiss}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Content */}
          <motion.div
            className={`relative flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-b ${colors.bg} p-8 ring-2 ${colors.ring}`}
            initial={{ scale: 0.5, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
          >
            {/* Badge visual */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, damping: 12 }}
            >
              <div className="scale-[2]">
                <BadgeVisual rarity={badge.rarity} title={badge.badgeTitle} earned />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              className="mt-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className={`text-xs font-bold uppercase tracking-widest ${colors.accent}`}>
                {badge.rarity} Badge
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                {badge.badgeTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-400">Tap anywhere to dismiss</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
