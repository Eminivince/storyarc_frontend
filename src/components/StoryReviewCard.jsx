import { useState } from "react";
import UserAvatar from "./UserAvatar";

function truncateCopy(value, maxLength) {
  if (!value || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

export function ReviewStars({ rating, size = "base" }) {
  const sizeClass = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className={`flex ${sizeClass} text-primary`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;

        return (
          <span
            className={`material-symbols-outlined ${value <= rating ? "fill-1" : ""}`}
            key={value}
            style={value <= rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            star
          </span>
        );
      })}
    </div>
  );
}

export default function StoryReviewCard({
  preview = false,
  review,
}) {
  const [revealedSpoiler, setRevealedSpoiler] = useState(false);
  const shouldHideSpoilers = review.containsSpoilers && !revealedSpoiler;
  const renderedBody = preview ? truncateCopy(review.body, 240) : review.body;

  return (
    <article className="rounded-2xl border border-primary/10 bg-white p-3 dark:bg-primary/5 sm:rounded-3xl sm:p-5">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <UserAvatar
          className="size-9 shrink-0 rounded-full border border-primary/20 sm:size-11"
          name={review.author.displayName}
          src={review.author.avatarUrl}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <p className="text-sm font-bold sm:text-base">{review.author.displayName}</p>
            <ReviewStars rating={review.rating} size="sm" />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
              {review.createdAtLabel}
            </span>
            {review.editedLabel ? (
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {review.editedLabel}
              </span>
            ) : null}
          </div>

          {review.title ? (
            <h3 className="mt-2 text-base font-black tracking-tight text-primary sm:mt-3 sm:text-lg">
              {review.title}
            </h3>
          ) : null}

          {shouldHideSpoilers ? (
            <div className="mt-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-3 text-xs text-amber-700 dark:text-amber-200 sm:mt-3 sm:rounded-2xl sm:px-4 sm:py-4 sm:text-sm">
              <p className="font-bold uppercase tracking-[0.16em]">
                Spoiler warning
              </p>
              <p className="mt-2">
                This review contains plot spoilers.
              </p>
              {!preview ? (
                <button
                  className="mt-3 rounded-full bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
                  onClick={() => setRevealedSpoiler(true)}
                  type="button"
                >
                  Reveal Review
                </button>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-300 sm:mt-3 sm:text-sm sm:leading-7">
              {renderedBody}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
