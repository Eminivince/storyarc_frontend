import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useToast } from "../context/ToastContext";
import { profileHref } from "../data/accountFlow";
import {
  buildChapterHref,
  buildSearchHref,
  buildStoryHref,
} from "../data/readerFlow";
import {
  useChapterCompletionStatsQuery,
  useChapterQuery,
  useStoryDetailsQuery,
  useUpdateStoryRatingMutation,
} from "../reader/readerHooks";
import {
  useChapterReactionsQuery,
  useUpsertChapterReactionMutation,
  useRemoveChapterReactionMutation,
} from "../engagement/engagementHooks";
import ChapterReactionBar from "../components/ChapterReactionBar";

const desktopReactionOptions = [
  { label: "Loved it", icon: "favorite", color: "text-red-500" },
  {
    label: "Intense",
    icon: "local_fire_department",
    color: "text-orange-500",
  },
  {
    label: "Funny",
    icon: "sentiment_very_satisfied",
    color: "text-blue-500",
  },
  { label: "Epic", icon: "auto_awesome", color: "text-fuchsia-500" },
];

const mobileReactionOptions = [
  { label: "Love", icon: "favorite" },
  { label: "Like", icon: "thumb_up" },
  { label: "Good", icon: "sentiment_satisfied" },
  { label: "Wow", icon: "auto_awesome" },
];

function LoadingState() {
  return <RouteLoadingScreen />;
}

function getChapterCompleteErrorMessage(error) {
  if (error?.status === 404) {
    return "This chapter wrap-up is not available right now. Open the chapter directly from the story page and try again.";
  }

  return error?.message || "We could not load this chapter wrap-up right now.";
}

function formatCount(value) {
  return Number(value ?? 0).toLocaleString();
}

function AverageStars({ rating, starClassName = "text-primary" }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          className={`material-symbols-outlined ${index < Math.round(rating) ? `fill-1 ${starClassName}` : "text-slate-300 dark:text-slate-600"}`}
          key={index}
        >
          star
        </span>
      ))}
    </div>
  );
}

function RatingStars({
  currentRating,
  disabled,
  onRate,
  sizeClassName = "text-3xl",
}) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;

        return (
          <button
            aria-label={`Rate this book ${value} star${value === 1 ? "" : "s"}`}
            className={`material-symbols-outlined transition-colors ${
              value <= currentRating
                ? "fill-1 text-primary"
                : "text-slate-300 dark:text-slate-600"
            } ${sizeClassName} ${disabled ? "cursor-not-allowed opacity-70" : "hover:text-primary"}`}
            disabled={disabled}
            key={value}
            onClick={() => onRate(value)}
            type="button"
          >
            star
          </button>
        );
      })}
    </div>
  );
}

function getRatingHelperText(story) {
  if (!story) {
    return "";
  }

  if (story.canRate) {
    return story.userRating
      ? `Your rating is ${story.userRating}/5. Tap a star to update it.`
      : "You finished the book. Tap a star to rate it.";
  }

  return (
    story.ratingEligibilityMessage ??
    "Finish the full book and unlock every chapter before rating."
  );
}

function DesktopChapterComplete({
  chapter,
  completionStats,
  isSubmittingRating,
  nextHref,
  nextLabel,
  onRate,
  recommendations,
  reviewCountLabel,
  searchHref,
  selectedReaction,
  setSelectedReaction,
  story,
  reactionsData,
  onChapterReact,
  onRemoveChapterReaction,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
        <header className="flex items-center justify-between border-b border-primary/20 px-6 py-4 lg:px-40">
          <Link className="flex items-center gap-4 text-primary" to="/dashboard">
            <div className="h-6 w-6">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              TaleStead
            </h2>
          </Link>

          <div className="flex gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              type="button"
            >
              <span className="material-symbols-outlined">share</span>
            </button>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              to={buildStoryHref(story.slug)}
            >
              <span className="material-symbols-outlined">menu_book</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center px-6 py-10 lg:px-40">
          <div className="w-full max-w-[960px]">
            <Reveal className="mb-12 text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                End of Chapter {chapter.chapterNumber}
              </span>
              <h1 className="mb-3 mt-2 text-4xl font-extrabold">What did you think?</h1>
              <p className="text-sm text-slate-500 dark:text-primary/60">
                You finished "{chapter.chapterTitle}" from {story.title}.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-10 rounded-xl border border-primary/10 bg-primary/5 p-8 md:flex-row">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-5xl font-black leading-tight">
                    {story.rating.toFixed(1)}
                  </p>
                  <AverageStars rating={story.rating} starClassName="text-primary" />
                  <p className="text-sm font-medium text-slate-500 dark:text-primary/60">
                    {reviewCountLabel} reviews
                  </p>
                  <div className="mt-3 space-y-2 text-center">
                    <RatingStars
                      currentRating={story.userRating ?? 0}
                      disabled={!story.canRate || isSubmittingRating}
                      onRate={onRate}
                      sizeClassName="text-2xl"
                    />
                    <p className="max-w-[260px] text-xs font-semibold leading-relaxed text-slate-500 dark:text-primary/60">
                      {getRatingHelperText(story)}
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-primary/20 md:h-20 md:w-px" />

                <div className="flex flex-wrap justify-center gap-4">
                  {desktopReactionOptions.map((reaction) => (
                    <button
                      className={`group flex flex-col items-center gap-2 rounded-xl border px-5 py-3 transition-all ${
                        selectedReaction === reaction.label
                          ? "border-primary bg-background-light dark:bg-background-dark"
                          : "border-primary/20 bg-background-light dark:bg-background-dark"
                      }`}
                      key={reaction.label}
                      onClick={() => setSelectedReaction(reaction.label)}
                      type="button"
                    >
                      <span
                        className={`material-symbols-outlined transition-transform group-hover:scale-110 ${reaction.color}`}
                      >
                        {reaction.icon}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-primary/80">
                        {reaction.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="mx-auto mb-12 max-w-xl">
              <ChapterReactionBar
                chapterCounts={reactionsData?.chapterCounts}
                totalReactions={reactionsData?.totalChapterReactions ?? 0}
                userReaction={reactionsData?.userChapterReaction}
                onReact={onChapterReact}
                onRemoveReaction={onRemoveChapterReaction}
              />
            </Reveal>

            <Reveal className="mb-16 flex justify-center">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  className="group flex h-16 min-w-[320px] items-center justify-between overflow-hidden rounded-xl bg-primary px-8 text-lg font-bold text-background-dark shadow-xl shadow-primary/10"
                  to={nextHref}
                >
                  <span>{nextLabel}</span>
                  {completionStats?.nextChapter?.estimatedMinutes && (
                    <span className="text-sm font-normal opacity-70">
                      ~{completionStats.nextChapter.estimatedMinutes} min read
                    </span>
                  )}
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </motion.div>
            </Reveal>

            <Reveal className="mb-12 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Story
                </p>
                <p className="mt-2 text-lg font-bold">{story.title}</p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Reads
                </p>
                <p className="mt-2 text-lg font-bold">{story.readsLabel}</p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Chapters
                </p>
                <p className="mt-2 text-lg font-bold">{story.chapterCount}</p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Status
                </p>
                <p className="mt-2 text-lg font-bold">{story.status}</p>
              </div>
            </Reveal>

            {completionStats && (
              <Reveal className="mb-12 grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center rounded-2xl border border-primary/10 bg-primary/5 p-6">
                  <div className="relative mb-3 h-20 w-20">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray={`${(completionStats.percentile ?? 0)}, 100`} strokeLinecap="round" className="text-primary" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                      {completionStats.percentile ?? 0}%
                    </span>
                  </div>
                  <p className="text-center text-sm font-semibold">
                    You're further than {completionStats.percentile ?? 0}% of readers
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 p-6">
                  <span className="material-symbols-outlined mb-2 text-3xl text-primary">group</span>
                  <p className="text-2xl font-bold">{(completionStats.totalReaders ?? 0).toLocaleString()}</p>
                  <p className="text-sm text-slate-400">readers finished this chapter</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 p-6">
                  <span className="material-symbols-outlined mb-2 text-3xl text-primary">local_fire_department</span>
                  <p className="text-2xl font-bold">{completionStats.streakDays ?? 0}-day streak</p>
                  <p className="text-sm text-slate-400">{completionStats.streakMultiplier ?? 1}x multiplier</p>
                </div>
              </Reveal>
            )}

            {completionStats?.missionProgress?.length > 0 && (
              <Reveal className="mb-12">
                <h3 className="mb-4 text-xl font-bold">Mission Progress</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  {completionStats.missionProgress.slice(0, 3).map((mission) => (
                    <div
                      className="flex items-center gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4"
                      key={mission.id ?? mission.title}
                    >
                      {mission.current >= mission.target ? (
                        <span className="material-symbols-outlined text-2xl text-green-500">check_circle</span>
                      ) : (
                        <span className="material-symbols-outlined text-2xl text-primary">flag</span>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-bold">{mission.title}</p>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min((mission.current / mission.target) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{mission.current}/{mission.target}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal className="border-t border-primary/10 pt-12">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-bold">You Might Also Like</h3>
                <Link className="text-sm font-bold text-primary hover:underline" to={searchHref}>
                  View all
                </Link>
              </div>

              {recommendations.length ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {recommendations.map((item, index) => (
                    <Link className="group cursor-pointer" key={item.slug} to={buildStoryHref(item.slug)}>
                      <motion.article
                        initial={{ opacity: 0, y: 24 }}
                        transition={{ delay: index * 0.06, duration: 0.35 }}
                        whileHover={{ y: -6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.2, once: true }}
                      >
                        <div className="relative mb-4 aspect-[2/3] w-full overflow-hidden rounded-xl border border-primary/10 shadow-lg">
                          <img
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={item.coverImage}
                          />
                          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background-dark/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="rounded-full bg-primary p-2 text-background-dark">
                              <span className="material-symbols-outlined">menu_book</span>
                            </span>
                          </div>
                        </div>
                        <h4 className="text-lg font-bold leading-tight transition-colors group-hover:text-primary">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-primary/60">
                          {item.genreLabel} • {item.averageRating.toFixed(1)} ★
                        </p>
                      </motion.article>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 text-center">
                  <h4 className="text-lg font-bold">No recommendations yet</h4>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Open the catalog to keep exploring live stories.
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </main>

        <footer className="border-t border-primary/10 bg-black/20 px-6 py-8">
          <div className="mx-auto flex max-w-[960px] flex-col items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-primary/40 md:flex-row">
            <p>© 2024 TaleStead Media</p>
            <div className="flex gap-6">
              <a className="transition-colors hover:text-primary" href="#">
                Privacy
              </a>
              <a className="transition-colors hover:text-primary" href="#">
                Terms
              </a>
              <a className="transition-colors hover:text-primary" href="#">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function MobileChapterComplete({
  chapter,
  chapterHref,
  completionStats,
  isSubmittingRating,
  nextHref,
  nextLabel,
  onRate,
  recommendations,
  reviewCountLabel,
  searchHref,
  selectedReaction,
  setSelectedReaction,
  story,
  reactionsData,
  onChapterReact,
  onRemoveChapterReaction,
}) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light/90 p-4 backdrop-blur-md dark:bg-background-dark/90">
        <Link
          className="flex h-10 w-10 items-center justify-center text-slate-900 dark:text-slate-100"
          to={chapterHref}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="flex-1 text-center text-lg font-bold tracking-tight">
          Chapter {chapter.chapterNumber} Complete
        </h2>
        <div className="flex w-10 items-center justify-end">
          <button className="flex items-center justify-center rounded-lg text-slate-900 dark:text-slate-100" type="button">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <Reveal as="section" className="px-4 pb-6 pt-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <span className="material-symbols-outlined text-5xl text-primary">
              check_circle
            </span>
          </div>
          <h2 className="mb-2 text-3xl font-black leading-tight">Great Reading!</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You finished "{chapter.chapterTitle}" from {story.title}.
          </p>
        </Reveal>

        <Reveal as="section" className="border-y border-primary/10 bg-primary/5 px-4 py-6">
          <h3 className="mb-4 text-center text-lg font-bold">What did you think?</h3>
          <div className="mb-6 flex items-center justify-around">
            {mobileReactionOptions.map((reaction) => (
              <button
                className="group flex flex-col items-center gap-2"
                key={reaction.label}
                onClick={() => setSelectedReaction(reaction.label)}
                type="button"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                    selectedReaction === reaction.label
                      ? "bg-primary/20"
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined transition-colors ${
                      selectedReaction === reaction.label
                        ? "text-primary"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {reaction.icon}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {reaction.label}
                </p>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            <AverageStars rating={story.rating} starClassName="text-primary" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {story.rating.toFixed(1)} average across {reviewCountLabel} reviews
            </p>
            <div className="space-y-2 text-center">
              <RatingStars
                currentRating={story.userRating ?? 0}
                disabled={!story.canRate || isSubmittingRating}
                onRate={onRate}
                sizeClassName="text-2xl"
              />
              <p className="max-w-[280px] text-xs font-semibold leading-relaxed text-slate-500 dark:text-slate-400">
                {getRatingHelperText(story)}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="px-4 py-2">
          <ChapterReactionBar
            chapterCounts={reactionsData?.chapterCounts}
            totalReactions={reactionsData?.totalChapterReactions ?? 0}
            userReaction={reactionsData?.userChapterReaction}
            onReact={onChapterReact}
            onRemoveReaction={onRemoveChapterReaction}
          />
        </Reveal>

        {completionStats && (
          <Reveal as="section" className="px-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center rounded-xl border border-primary/10 bg-primary/5 p-3">
                <div className="relative mb-2 h-14 w-14">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray={`${completionStats.percentile ?? 0}, 100`} strokeLinecap="round" className="text-primary" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {completionStats.percentile ?? 0}%
                  </span>
                </div>
                <p className="text-center text-[10px] font-bold text-slate-400">Percentile</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-primary/10 bg-primary/5 p-3">
                <span className="material-symbols-outlined mb-1 text-xl text-primary">group</span>
                <p className="text-lg font-bold">{(completionStats.totalReaders ?? 0).toLocaleString()}</p>
                <p className="text-center text-[10px] font-bold text-slate-400">Readers</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-primary/10 bg-primary/5 p-3">
                <span className="material-symbols-outlined mb-1 text-xl text-primary">local_fire_department</span>
                <p className="text-lg font-bold">{completionStats.streakDays ?? 0}d</p>
                <p className="text-center text-[10px] font-bold text-slate-400">{completionStats.streakMultiplier ?? 1}x</p>
              </div>
            </div>
          </Reveal>
        )}

        {completionStats?.missionProgress?.length > 0 && (
          <Reveal as="section" className="px-4 py-2">
            <h3 className="mb-3 text-base font-bold">Missions</h3>
            <div className="space-y-2">
              {completionStats.missionProgress.slice(0, 3).map((mission) => (
                <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 p-3" key={mission.id ?? mission.title}>
                  <span className={`material-symbols-outlined text-lg ${mission.current >= mission.target ? "text-green-500" : "text-primary"}`}>
                    {mission.current >= mission.target ? "check_circle" : "flag"}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold">{mission.title}</p>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-700">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((mission.current / mission.target) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{mission.current}/{mission.target}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal as="section" className="flex flex-col gap-3 p-4">
          <Link
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-transform active:scale-95"
            to={nextHref}
          >
            {nextLabel}
            {completionStats?.nextChapter?.estimatedMinutes && (
              <span className="text-xs font-normal opacity-70">~{completionStats.nextChapter.estimatedMinutes} min</span>
            )}
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-200 py-4 font-bold text-slate-900 dark:bg-slate-800 dark:text-slate-100"
            to={buildStoryHref(story.slug)}
          >
            <span className="material-symbols-outlined">menu_book</span>
            Back to Story
          </Link>
        </Reveal>

        <Reveal as="section" className="py-6">
          <div className="mb-4 flex items-center justify-between px-4">
            <h3 className="text-lg font-bold">You Might Also Like</h3>
            <Link className="text-sm font-semibold text-primary" to={searchHref}>
              View all
            </Link>
          </div>

          {recommendations.length ? (
            <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-4">
              {recommendations.map((item) => (
                <Link className="w-32 flex-none" key={item.slug} to={buildStoryHref(item.slug)}>
                  <div className="mb-2 aspect-[2/3] overflow-hidden rounded-lg bg-slate-200 shadow-md dark:bg-slate-800">
                    <img alt={item.title} className="h-full w-full object-cover" src={item.coverImage} />
                  </div>
                  <p className="truncate text-sm font-bold">{item.title}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {item.authorName}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Live recommendations will appear here as more stories land in the catalog.
                </p>
              </div>
            </div>
          )}
        </Reveal>

        <Reveal as="section" className="mb-10 px-4 py-6">
          <div className="rounded-2xl border border-primary/10 bg-background-light p-4 dark:bg-slate-800/50">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-3xl font-black leading-tight">{story.rating.toFixed(1)}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Global average
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{reviewCountLabel}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Reviews
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                  <p className="text-lg font-bold">{story.readsLabel}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Reads
                  </p>
                </div>
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                  <p className="text-lg font-bold">{story.chapterCount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Chapters
                  </p>
                </div>
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                  <p className="text-lg font-bold">{story.status}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 mx-auto flex max-w-md items-center justify-between border-t border-primary/10 bg-background-light/95 px-4 py-3 backdrop-blur-md dark:bg-background-dark/95">
        <Link className="flex flex-col items-center gap-1 text-primary" to="/dashboard">
          <span className="material-symbols-outlined fill-1">home</span>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link className="flex flex-col items-center gap-1 text-slate-400" to={buildStoryHref(story.slug)}>
          <span className="material-symbols-outlined">library_books</span>
          <span className="text-[10px] font-bold">Story</span>
        </Link>
        <Link className="flex flex-col items-center gap-1 text-slate-400" to={searchHref}>
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-bold">Discover</span>
        </Link>
        <Link className="flex flex-col items-center gap-1 text-slate-400" to={profileHref}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}

export default function ChapterCompletePage() {
  const { storySlug, chapterSlug } = useParams();
  const { showToast } = useToast();
  const chapterQuery = useChapterQuery(storySlug, chapterSlug);
  const storyQuery = useStoryDetailsQuery(storySlug);
  const updateStoryRatingMutation = useUpdateStoryRatingMutation(storySlug);
  const completionStatsQuery = useChapterCompletionStatsQuery(storySlug, chapterSlug);
  const completionStats = completionStatsQuery.data ?? null;
  const story = storyQuery.data?.story ?? null;
  const chapter = chapterQuery.data?.chapter ?? null;
  const primaryGenre = story?.genres?.[0] ?? "";
  const [desktopReaction, setDesktopReaction] = useState("Loved it");
  const [mobileReaction, setMobileReaction] = useState("Love");
  const recommendations = storyQuery.data?.recommendations ?? [];
  const reactionsQuery = useChapterReactionsQuery(storySlug, chapterSlug);
  const upsertChapterReaction = useUpsertChapterReactionMutation();
  const removeChapterReaction = useRemoveChapterReactionMutation();

  if (chapterQuery.isLoading || storyQuery.isLoading) {
    return <LoadingState />;
  }

  if (chapterQuery.isError || storyQuery.isError || !chapter || !story) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Dashboard"
        ctaTo="/dashboard"
        description={getChapterCompleteErrorMessage(
          chapterQuery.error ?? storyQuery.error,
        )}
        secondaryLabel="Open Story"
        secondaryTo={buildStoryHref(storySlug)}
        title="Chapter Wrap-Up Unavailable"
        tone="error"
      />
    );
  }

  const chapterHref = buildChapterHref(story.slug, chapter.chapterSlug);

  if (chapter.isLocked || chapter.accessState !== "READABLE") {
    return (
      <ReaderStateScreen
        ctaLabel="Open Chapter"
        ctaTo={chapterHref}
        description="Open the chapter first, then return here after you finish reading."
        secondaryLabel="Back to Story"
        secondaryTo={buildStoryHref(story.slug)}
        title="Finish the Chapter First"
      />
    );
  }

  const nextHref = chapter.nextChapter
    ? buildChapterHref(story.slug, chapter.nextChapter.chapterSlug)
    : buildStoryHref(story.slug);
  const nextLabel = chapter.nextChapter
    ? `Continue to Chapter ${chapter.nextChapter.chapterNumber}`
    : "Back to Story";
  const searchHref = buildSearchHref(primaryGenre || "Fantasy");
  const reviewCountLabel = formatCount(story.reviewCount);

  async function handleRate(nextRating) {
    if (!story?.canRate || updateStoryRatingMutation.isPending) {
      return;
    }

    try {
      await updateStoryRatingMutation.mutateAsync({ rating: nextRating });
      showToast("Your book rating has been saved.", {
        title: "Rating updated",
      });
    } catch (error) {
      showToast(
        error?.message || "We could not save your rating right now.",
        {
          title: "Rating failed",
          tone: "error",
        },
      );
    }
  }

  return (
    <>
      <DesktopChapterComplete
        chapter={chapter}
        completionStats={completionStats}
        isSubmittingRating={updateStoryRatingMutation.isPending}
        nextHref={nextHref}
        nextLabel={nextLabel}
        onRate={handleRate}
        recommendations={recommendations.slice(0, 3)}
        reviewCountLabel={reviewCountLabel}
        searchHref={searchHref}
        selectedReaction={desktopReaction}
        setSelectedReaction={setDesktopReaction}
        story={story}
        reactionsData={reactionsQuery.data}
        onChapterReact={(reactionType) =>
          upsertChapterReaction.mutate({ storySlug, chapterSlug, reactionType })
        }
        onRemoveChapterReaction={() =>
          removeChapterReaction.mutate({ storySlug, chapterSlug })
        }
      />
      <MobileChapterComplete
        chapter={chapter}
        chapterHref={chapterHref}
        completionStats={completionStats}
        isSubmittingRating={updateStoryRatingMutation.isPending}
        nextHref={nextHref}
        nextLabel={nextLabel}
        onRate={handleRate}
        recommendations={recommendations}
        reviewCountLabel={reviewCountLabel}
        searchHref={searchHref}
        selectedReaction={mobileReaction}
        setSelectedReaction={setMobileReaction}
        story={story}
        reactionsData={reactionsQuery.data}
        onChapterReact={(reactionType) =>
          upsertChapterReaction.mutate({ storySlug, chapterSlug, reactionType })
        }
        onRemoveChapterReaction={() =>
          removeChapterReaction.mutate({ storySlug, chapterSlug })
        }
      />
    </>
  );
}
