import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REACTION_OPTIONS = [
  { type: "SHOCKED", emoji: "\ud83d\ude2e", label: "Shocked" },
  { type: "SAD", emoji: "\ud83d\ude22", label: "Sad" },
  { type: "LAUGHING", emoji: "\ud83d\ude02", label: "Laughing" },
  { type: "HEART", emoji: "\u2764\ufe0f", label: "Heart" },
  { type: "FIRE", emoji: "\ud83d\udd25", label: "Fire" },
  { type: "SCARED", emoji: "\ud83d\ude31", label: "Scared" },
];

function ReactionPicker({ onSelect, onClose, currentReaction }) {
  return (
    <motion.div
      className="absolute -top-12 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-zinc-700 bg-zinc-900/95 px-2 py-1.5 shadow-xl backdrop-blur-sm"
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.9 }}
      transition={{ duration: 0.15 }}
    >
      {REACTION_OPTIONS.map((r) => (
        <button
          key={r.type}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(r.type);
          }}
          className={`rounded-full p-1 text-lg transition-transform hover:scale-125 ${
            currentReaction === r.type
              ? "bg-amber-500/20 ring-1 ring-amber-500"
              : "hover:bg-zinc-800"
          }`}
          title={r.label}
        >
          {r.emoji}
        </button>
      ))}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="ml-0.5 rounded-full p-1 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
        title="Close"
      >
        ✕
      </button>
    </motion.div>
  );
}

function InlineReactionCounts({ counts }) {
  if (!counts || Object.keys(counts).length === 0) return null;

  const sorted = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const total = Object.values(counts).reduce((s, v) => s + v, 0);

  return (
    <div className="mt-1 flex items-center gap-1">
      {sorted.map(([type]) => {
        const option = REACTION_OPTIONS.find((r) => r.type === type);
        return option ? (
          <span key={type} className="text-xs">
            {option.emoji}
          </span>
        ) : null;
      })}
      {total > 0 && (
        <span className="text-xs text-zinc-500">{total}</span>
      )}
    </div>
  );
}

export default function ParagraphReactionOverlay({
  paragraphIndex,
  paragraphCounts,
  userReaction,
  onReact,
  onRemoveReaction,
  children,
}) {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = useCallback(
    (reactionType) => {
      if (userReaction === reactionType) {
        onRemoveReaction(paragraphIndex);
      } else {
        onReact(paragraphIndex, reactionType);
      }
      setShowPicker(false);
    },
    [paragraphIndex, userReaction, onReact, onRemoveReaction],
  );

  const counts = paragraphCounts?.[paragraphIndex];

  return (
    <div className="group relative">
      <button
        className="absolute -left-8 top-1 hidden h-6 w-6 items-center justify-center rounded-full text-sm text-zinc-600 opacity-0 transition-opacity hover:bg-zinc-800 hover:text-zinc-300 group-hover:opacity-100 md:flex"
        onClick={(e) => {
          e.stopPropagation();
          setShowPicker((v) => !v);
        }}
        title="React to this paragraph"
      >
        {userReaction
          ? REACTION_OPTIONS.find((r) => r.type === userReaction)?.emoji
          : "+"}
      </button>

      <AnimatePresence>
        {showPicker && (
          <ReactionPicker
            onSelect={handleSelect}
            onClose={() => setShowPicker(false)}
            currentReaction={userReaction}
          />
        )}
      </AnimatePresence>

      {children}

      <InlineReactionCounts counts={counts} />
    </div>
  );
}

export function MobileParagraphReactionOverlay({
  paragraphIndex,
  paragraphCounts,
  userReaction,
  onReact,
  onRemoveReaction,
  children,
}) {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = useCallback(
    (reactionType) => {
      if (userReaction === reactionType) {
        onRemoveReaction(paragraphIndex);
      } else {
        onReact(paragraphIndex, reactionType);
      }
      setShowPicker(false);
    },
    [paragraphIndex, userReaction, onReact, onRemoveReaction],
  );

  const counts = paragraphCounts?.[paragraphIndex];

  return (
    <div className="relative">
      <div
        onDoubleClick={(e) => {
          e.preventDefault();
          setShowPicker((v) => !v);
        }}
      >
        {children}
      </div>

      <AnimatePresence>
        {showPicker && (
          <ReactionPicker
            onSelect={handleSelect}
            onClose={() => setShowPicker(false)}
            currentReaction={userReaction}
          />
        )}
      </AnimatePresence>

      <InlineReactionCounts counts={counts} />
    </div>
  );
}

export { REACTION_OPTIONS };
