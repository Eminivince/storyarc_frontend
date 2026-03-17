import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REACTION_OPTIONS } from "./ParagraphReactionOverlay";

export default function ChapterReactionBar({
  chapterCounts,
  totalReactions,
  userReaction,
  onReact,
  onRemoveReaction,
}) {
  const [hoveredType, setHoveredType] = useState(null);

  return (
    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <p className="mb-3 text-center text-sm font-medium text-zinc-400">
        How did this chapter make you feel?
      </p>

      <div className="flex items-center justify-center gap-2">
        {REACTION_OPTIONS.map((r) => {
          const count = chapterCounts?.[r.type] || 0;
          const isSelected = userReaction === r.type;

          return (
            <motion.button
              key={r.type}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredType(r.type)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => {
                if (isSelected) {
                  onRemoveReaction();
                } else {
                  onReact(r.type);
                }
              }}
              className={`relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 transition-colors ${
                isSelected
                  ? "bg-amber-500/15 ring-1 ring-amber-500/60"
                  : "hover:bg-zinc-800"
              }`}
            >
              <span className="text-2xl">{r.emoji}</span>
              {count > 0 && (
                <span className="text-[10px] font-medium text-zinc-500">
                  {count}
                </span>
              )}

              <AnimatePresence>
                {hoveredType === r.type && (
                  <motion.span
                    className="absolute -top-6 whitespace-nowrap rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                  >
                    {r.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {totalReactions > 0 && (
        <p className="mt-2 text-center text-xs text-zinc-600">
          {totalReactions} {totalReactions === 1 ? "reader" : "readers"} reacted
        </p>
      )}
    </div>
  );
}
