import { REACTION_OPTIONS } from "./ParagraphReactionOverlay";

function intensityColor(total, maxTotal) {
  if (maxTotal === 0 || total === 0) return "bg-zinc-900";
  const ratio = total / maxTotal;
  if (ratio >= 0.75) return "bg-amber-500/40";
  if (ratio >= 0.5) return "bg-amber-500/25";
  if (ratio >= 0.25) return "bg-amber-500/15";
  return "bg-amber-500/5";
}

export default function ReactionHeatmap({ data }) {
  if (!data) return null;

  const { paragraphs, chapterReactions, chapterReactionTotal, totalUniqueReactors, totalParagraphs } = data;
  const maxTotal = Math.max(...paragraphs.map((p) => p.total), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">
          Reaction Heatmap
        </h3>
        <span className="text-xs text-zinc-500">
          {totalUniqueReactors} unique reactor{totalUniqueReactors !== 1 ? "s" : ""} · {totalParagraphs} paragraphs
        </span>
      </div>

      {/* Chapter-level summary */}
      {chapterReactionTotal > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
          <span className="text-xs font-medium text-zinc-400">Chapter overall:</span>
          {Object.entries(chapterReactions)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => {
              const opt = REACTION_OPTIONS.find((r) => r.type === type);
              return opt ? (
                <span key={type} className="flex items-center gap-0.5 text-xs text-zinc-400">
                  {opt.emoji} {count}
                </span>
              ) : null;
            })}
        </div>
      )}

      {/* Paragraph heatmap rows */}
      <div className="space-y-1">
        {paragraphs.map((p) => (
          <div
            key={p.index}
            className={`flex items-center gap-2 rounded px-2 py-1.5 ${intensityColor(p.total, maxTotal)}`}
          >
            <span className="w-6 shrink-0 text-right text-[10px] font-mono text-zinc-600">
              {p.index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs text-zinc-400">
              {p.preview}{p.preview.length >= 80 ? "…" : ""}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              {Object.entries(p.reactions)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([type, count]) => {
                  const opt = REACTION_OPTIONS.find((r) => r.type === type);
                  return opt ? (
                    <span key={type} className="text-[10px]" title={`${opt.label}: ${count}`}>
                      {opt.emoji}{count > 1 ? count : ""}
                    </span>
                  ) : null;
                })}
              {p.total > 0 && (
                <span className="ml-1 text-[10px] font-medium text-zinc-500">
                  {p.total}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
