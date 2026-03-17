import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FollowButton from "../components/FollowButton";
import { LogoBrand } from "../components/LogoBrand";
import {
  PrefetchableChapterLink,
  PrefetchableStoryLink,
} from "../components/PrefetchableLink";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import SeoMetadata, { createSeoDescription } from "../components/SeoMetadata";
import StoryReviewCard from "../components/StoryReviewCard";
import { useToast } from "../context/ToastContext";
import { buildGiftSendingHref } from "../data/communityFlow";
import {
  buildChapterHref,
  readingListsHref,
  buildSearchHref,
  buildStoryHref,
  buildStoryReviewsHref,
} from "../data/readerFlow";
import {
  useAddStoryToReadingListMutation,
  useFollowAuthorMutation,
  useFollowStoryMutation,
  useReadingListsQuery,
  useStoryDetailsQuery,
  useStoryReviewsQuery,
  useUnfollowAuthorMutation,
  useUnfollowStoryMutation,
  useUpdateStoryRatingMutation,
} from "../reader/readerHooks";

function getStoryErrorMessage(error) {
  if (error?.status === 404) {
    return "This story is not available right now. If you just wired a fresh backend, the catalog may not be seeded yet.";
  }

  return error?.message || "We could not load this story right now.";
}

function getStorySeoDescription(story) {
  if (!story) {
    return "";
  }

  return createSeoDescription(
    story.synopsis ||
      story.shortSynopsis ||
      `Read ${story.title} by ${story.authorName} on TaleStead.`,
    190,
  );
}

function LoadingState() {
  return <RouteLoadingScreen />;
}

function StoryAction({
  children,
  compact = false,
  disabled = false,
  onClick,
  prefetchChapter,
  to,
  tone = "primary",
}) {
  const sizeCls = compact ? "h-10 gap-1.5 rounded-xl px-4 text-sm" : "h-14 gap-2 rounded-2xl px-6 text-base";
  const className =
    tone === "primary"
      ? `flex items-center justify-center font-bold text-background-dark shadow-lg shadow-primary/20 bg-primary ${sizeCls}`
      : `flex items-center justify-center font-bold text-slate-900 dark:text-slate-100 border border-primary/20 bg-primary/5 ${sizeCls}`;
  const interactiveClassName = disabled
    ? `${className} cursor-not-allowed opacity-60`
    : className;

  if (onClick) {
    return (
      <button
        className={interactiveClassName}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {children}
      </button>
    );
  }

  if (prefetchChapter) {
    return (
      <PrefetchableChapterLink
        chapterSlug={prefetchChapter.chapterSlug}
        className={interactiveClassName}
        storySlug={prefetchChapter.storySlug}
        to={to}
      >
        {children}
      </PrefetchableChapterLink>
    );
  }

  return (
    <Link className={interactiveClassName} to={to}>
      {children}
    </Link>
  );
}

function getReadingListActionLabel(listCount) {
  if (!listCount) {
    return "Add to List";
  }

  return listCount === 1 ? "Saved in 1 List" : `Saved in ${listCount} Lists`;
}

function getListsContainingStory(lists, storySlug) {
  if (!storySlug) {
    return [];
  }

  return (lists ?? []).filter((list) =>
    list.stories?.some((savedStory) => savedStory.slug === storySlug),
  );
}

function AddToReadingListModal({
  existingListIds,
  isLoading,
  isOpen,
  isSubmitting,
  lists,
  onAddToList,
  onClose,
  storyTitle,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[80] flex items-end justify-center bg-background-dark/70 p-3 backdrop-blur-sm md:items-center md:p-6"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-primary/10 bg-background-light shadow-2xl dark:bg-background-dark"
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          onClick={(event) => event.stopPropagation()}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-start justify-between gap-4 border-b border-primary/10 px-5 py-4 md:px-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                Reading Lists
              </p>
              <h2 className="mt-2 text-xl font-black tracking-tight md:text-2xl">
                Save "{storyTitle}"
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Choose one of your custom lists.
              </p>
            </div>
            <button
              className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-primary/10 hover:text-slate-900 dark:hover:text-slate-100"
              onClick={onClose}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="max-h-[65vh] space-y-3 overflow-y-auto px-5 py-5 md:px-6">
            {isLoading ? (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                Loading your reading lists...
              </div>
            ) : lists.length ? (
              lists.map((list) => {
                const isSaved = existingListIds.has(list.id);

                return (
                  <button
                    className={`flex w-full items-center justify-between gap-4 rounded-3xl border px-4 py-4 text-left transition-colors ${
                      isSaved
                        ? "border-primary/20 bg-primary/10"
                        : "border-primary/10 bg-white hover:bg-primary/5 dark:bg-primary/5"
                    }`}
                    disabled={isSaved || isSubmitting}
                    key={list.id}
                    onClick={() => onAddToList(list.id)}
                    type="button"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="line-clamp-1 text-base font-bold">{list.name}</h3>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                          {list.visibility}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {list.storyCount} {list.storyCount === 1 ? "book" : "books"} • Updated{" "}
                        {list.updatedAtLabel}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-primary">
                      {isSaved ? "Saved" : isSubmitting ? "Saving..." : "Add"}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 px-5 py-10 text-center">
                <span className="material-symbols-outlined text-4xl text-primary">
                  format_list_bulleted
                </span>
                <h3 className="mt-3 text-lg font-bold">No reading lists yet</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Create your first custom list, then come back to save this story.
                </p>
                <Link
                  className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-background-dark"
                  onClick={onClose}
                  to={readingListsHref}
                >
                  Open Reading Lists
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function RatingStars({ compact = false, currentRating, disabled, onRate }) {
  const iconCls = compact ? "text-lg" : "text-2xl";
  return (
    <div className={`flex items-center ${compact ? "gap-0.5" : "gap-1"}`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;

        return (
          <button
            aria-label={`Rate this book ${value} star${value === 1 ? "" : "s"}`}
            className={`material-symbols-outlined ${iconCls} transition-colors ${
              value <= currentRating
                ? "fill-1 text-primary"
                : "text-slate-300 dark:text-slate-600"
            } ${disabled ? "cursor-not-allowed opacity-70" : "hover:text-primary"}`}
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
  if (story.canRate) {
    return story.userRating
      ? `Your rating is ${story.userRating}/5. Tap a star to update it.`
      : "You finished this book. Tap a star to rate it.";
  }

  return (
    story.ratingEligibilityMessage ??
    "Unlock every chapter and finish the book before rating."
  );
}

function StoryRatingPanel({ compact = false, isSubmittingRating, onRate, story }) {
  return (
    <div className={`rounded-3xl border border-primary/10 bg-white dark:bg-primary/5 ${compact ? "p-3" : "p-5"}`}>
      <div className={`flex items-start justify-between gap-3 ${compact ? "gap-2" : "gap-4"}`}>
        <div>
          <p className={`font-bold uppercase tracking-[0.18em] text-slate-400 ${compact ? "text-[10px]" : "text-xs"}`}>
            Reader Rating
          </p>
          <p className={`font-black ${compact ? "mt-1 text-2xl" : "mt-2 text-3xl"}`}>{story.rating.toFixed(1)}</p>
        </div>
        <div className="text-right">
          <Link
            className={`font-bold transition-colors hover:text-primary ${compact ? "text-xs" : "text-sm"}`}
            to={buildStoryReviewsHref(story.slug)}
          >
            {story.writtenReviewCount.toLocaleString()} Reviews
          </Link>
          <p className={`uppercase tracking-[0.18em] text-slate-400 ${compact ? "text-[10px]" : "text-xs"}`}>
            {story.reviewCount.toLocaleString()} ratings
          </p>
        </div>
      </div>
      <div className={compact ? "mt-2 space-y-1" : "mt-4 space-y-2"}>
        <RatingStars
          compact={compact}
          currentRating={story.userRating ?? 0}
          disabled={!story.canRate || isSubmittingRating}
          onRate={onRate}
        />
        <p className={`leading-relaxed text-slate-500 dark:text-slate-400 ${compact ? "text-[11px]" : "text-sm"}`}>
          {getRatingHelperText(story)}
        </p>
      </div>
    </div>
  );
}

function StoryReviewPreviewSection({ compact = false, story, reviews }) {
  return (
    <section className={compact ? "space-y-3" : "space-y-5"}>
      <div className={`flex flex-wrap items-center justify-between ${compact ? "gap-2" : "gap-4"}`}>
        <div>
          <p className={`font-bold uppercase tracking-[0.18em] text-primary ${compact ? "text-[10px]" : "text-xs"}`}>
            Reader Reviews
          </p>
          <h2 className={`font-black tracking-tight ${compact ? "mt-1 text-lg" : "mt-2 text-2xl"}`}>
            What readers are saying
          </h2>
        </div>
        <Link
          className={`rounded-full border border-primary/20 font-bold text-primary transition-colors hover:bg-primary/10 ${compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
          to={buildStoryReviewsHref(story.slug)}
        >
          View all reviews
        </Link>
      </div>

      {reviews.length ? (
        <div className={compact ? "space-y-2" : "space-y-4"}>
          {reviews.map((review) => (
            <StoryReviewCard key={review.id} preview review={review} />
          ))}
        </div>
      ) : (
        <div className={`rounded-3xl border border-dashed border-primary/20 bg-white text-center text-slate-500 dark:bg-primary/5 dark:text-slate-400 ${compact ? "px-3 py-6 text-xs" : "px-5 py-10 text-sm"}`}>
          No written reviews yet. Be the first to review this story.
        </div>
      )}
    </section>
  );
}

function StoryRecommendationsSection({ compact = false, recommendations }) {
  if (!recommendations?.length) {
    return null;
  }

  return (
    <section className={compact ? "space-y-3" : "space-y-5"}>
      <div className={`flex flex-wrap items-center justify-between ${compact ? "gap-2" : "gap-4"}`}>
        <div>
          <p className={`font-bold uppercase tracking-[0.18em] text-primary ${compact ? "text-[10px]" : "text-xs"}`}>
            Readers Also Enjoyed
          </p>
          <h2 className={`font-black tracking-tight ${compact ? "mt-1 text-lg" : "mt-2 text-2xl"}`}>
            More stories in your lane
          </h2>
        </div>
      </div>

      <div className={`grid md:grid-cols-2 xl:grid-cols-3 ${compact ? "gap-2" : "gap-4"}`}>
        {recommendations.map((item) => (
          <PrefetchableStoryLink
            className="block"
            key={item.slug}
            storySlug={item.slug}
            to={buildStoryHref(item.slug)}
          >
            <article className={`flex h-full border border-primary/10 bg-white transition-colors hover:bg-primary/5 dark:bg-primary/5 ${compact ? "gap-3 rounded-xl p-2.5" : "gap-4 rounded-3xl p-4"}`}>
              <img
                alt={item.title}
                className={`shrink-0 object-cover ${compact ? "h-20 w-14 rounded-lg" : "h-28 w-20 rounded-2xl"}`}
                src={item.coverImage}
              />
              <div className="min-w-0 flex-1">
                <p className={`font-bold uppercase tracking-[0.18em] text-primary ${compact ? "text-[9px]" : "text-[11px]"}`}>
                  {item.genreLabel}
                </p>
                <h3 className={`line-clamp-2 font-bold leading-tight ${compact ? "mt-1 text-sm" : "mt-2 text-lg"}`}>
                  {item.title}
                </h3>
                <p className={`text-slate-500 dark:text-slate-400 ${compact ? "mt-0.5 text-[11px]" : "mt-1 text-sm"}`}>
                  by {item.authorName}
                </p>
                <p className={`font-semibold uppercase tracking-[0.16em] text-slate-400 ${compact ? "mt-1.5 text-[9px]" : "mt-3 text-xs"}`}>
                  {item.averageRating.toFixed(1)} rating • {item.readsLabel} reads
                </p>
              </div>
            </article>
          </PrefetchableStoryLink>
        ))}
      </div>
    </section>
  );
}

function StoryFollowActions({
  compact = false,
  isAuthorFollowPending,
  isStoryFollowPending,
  onToggleAuthorFollow,
  onToggleStoryFollow,
  story,
}) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className={`flex flex-wrap ${compact ? "gap-2" : "gap-3"}`}>
        <FollowButton
          active={Boolean(story.isFollowingStory)}
          compact={compact}
          icon={story.isFollowingStory ? "favorite" : "favorite"}
          label={
            isStoryFollowPending
              ? "Updating..."
              : story.isFollowingStory
                ? "Following Story"
                : "Follow Story"
          }
          onClick={onToggleStoryFollow}
          pending={isStoryFollowPending}
        />
        {story.authorId ? (
          <FollowButton
            active={Boolean(story.isFollowingAuthor)}
            compact={compact}
            icon={story.isFollowingAuthor ? "person_check" : "person_add"}
            label={
              isAuthorFollowPending
                ? "Updating..."
                : story.isFollowingAuthor
                  ? "Following Author"
                  : "Follow Author"
            }
            onClick={onToggleAuthorFollow}
            pending={isAuthorFollowPending}
          />
        ) : null}
      </div>

      <p className={compact ? "text-[11px] text-slate-500 dark:text-slate-400" : "text-sm text-slate-500 dark:text-slate-400"}>
        {story.storyFollowerCountLabel} following this story
        {story.authorId
          ? ` • ${story.authorFollowerCountLabel} following ${story.authorName}`
          : ""}
      </p>
    </div>
  );
}

function getSequenceBlockedLabel(chapter) {
  if (!chapter?.requiredPreviousChapter) {
    return "Available after the previous chapter";
  }

  return `Available after Chapter ${chapter.requiredPreviousChapter.chapterNumber}`;
}

function DesktopStoryDetails({
  isAuthorFollowPending,
  isReadingListsLoading,
  isSubmittingRating,
  isStoryFollowPending,
  onOpenReadingListModal,
  onToggleAuthorFollow,
  onToggleStoryFollow,
  onRate,
  onSearchSubmit,
  readingListCount,
  reviewPreview,
  searchTerm,
  setSearchTerm,
  story,
  storyData,
}) {
  const primaryChapterSlug =
    storyData.continueReading?.chapterSlug || story.firstChapterSlug;

  return (
    <div className="hidden min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:flex">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light/90 px-6 py-3 backdrop-blur-md dark:bg-background-dark/90 lg:px-10">
        <div className="flex items-center gap-8">
          <LogoBrand to="/dashboard" />

          <form className="hidden min-w-56 md:block" onSubmit={onSearchSubmit}>
            <div className="flex h-11 items-center rounded-xl bg-slate-100 dark:bg-primary/10">
              <span className="material-symbols-outlined px-4 text-slate-400">search</span>
              <input
                className="h-full w-full border-none bg-transparent pr-4 text-base focus:ring-0"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search stories, authors..."
                type="text"
                value={searchTerm}
              />
            </div>
          </form>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/10"
            to="/dashboard"
          >
            Browse
          </Link>
          <Link
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/10"
            to={buildSearchHref(story.genres[0] || "Fantasy")}
          >
            More like this
          </Link>
        </nav>
      </header>

      <main className="flex-1 px-6 py-10 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-12">
          <Reveal>
            <div className="grid gap-10 xl:grid-cols-[360px_minmax(0,1fr)]">
              <motion.div className="overflow-hidden rounded-[2rem] border border-primary/10 shadow-2xl" whileHover={{ y: -4 }}>
                <img
                  alt={story.title}
                  className="aspect-[3/4] h-full w-full object-cover"
                  src={story.coverImage}
                />
              </motion.div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {story.genres.map((genre) => (
                      <span
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary"
                        key={genre}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-5xl font-black leading-tight">{story.title}</h1>
                  <p className="text-xl text-primary">by {story.authorName}</p>
                  <StoryFollowActions
                    isAuthorFollowPending={isAuthorFollowPending}
                    isStoryFollowPending={isStoryFollowPending}
                    onToggleAuthorFollow={onToggleAuthorFollow}
                    onToggleStoryFollow={onToggleStoryFollow}
                    story={story}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Rating
                    </p>
                    <p className="mt-2 text-2xl font-black">{story.rating.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Reads
                    </p>
                    <p className="mt-2 text-2xl font-black">{story.readsLabel}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Chapters
                    </p>
                    <p className="mt-2 text-2xl font-black">{story.chapterCount}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Status
                    </p>
                    <p className="mt-2 text-2xl font-black">{story.status}</p>
                  </div>
                </div>

                <StoryRatingPanel
                  isSubmittingRating={isSubmittingRating}
                  onRate={onRate}
                  story={story}
                />

                <div className="space-y-4 ">
                  <h2 className="text-xl font-bold">Synopsis</h2>
                  <p className="max-w-4xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {story.synopsis}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {primaryChapterSlug ? (
                    <StoryAction
                      prefetchChapter={{ chapterSlug: primaryChapterSlug, storySlug: story.slug }}
                      to={buildChapterHref(story.slug, primaryChapterSlug)}
                    >
                      <span className="material-symbols-outlined">menu_book</span>
                      {storyData.continueReading ? "Continue Reading" : "Start Reading"}
                    </StoryAction>
                  ) : null}
                  <StoryAction to={buildGiftSendingHref(story.slug)} tone="secondary">
                    <span className="material-symbols-outlined">card_giftcard</span>
                    Send Gift
                  </StoryAction>
                  <StoryAction
                    disabled={isReadingListsLoading}
                    onClick={onOpenReadingListModal}
                    tone="secondary"
                  >
                    <span className="material-symbols-outlined">
                      format_list_bulleted
                    </span>
                    {getReadingListActionLabel(readingListCount)}
                  </StoryAction>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Chapters</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {story.chapterCount} published chapters
                </p>
              </div>

              <div className="space-y-3 flex flex-col gap-1">
                {storyData.chapters.map((chapter, index) => {
                  const isSequenceBlocked = chapter.accessState === "SEQUENCE_BLOCKED";
                  const chapterCard = (
                    <motion.article
                      className={`flex items-center justify-between gap-4 rounded-3xl border border-primary/10 bg-white p-4 dark:bg-primary/5 ${
                        isSequenceBlocked ? "cursor-not-allowed opacity-70" : ""
                      }`}
                      initial={{ opacity: 0, x: -18 }}
                      transition={{ delay: index * 0.03, duration: 0.24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileHover={isSequenceBlocked ? undefined : { y: -3 }}
                      viewport={{ amount: 0.15, once: true }}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-black text-primary">
                            {String(chapter.chapterNumber).padStart(2, "0")}
                          </span>
                          <h3 className="line-clamp-1 text-lg font-bold">{chapter.title}</h3>
                          {chapter.premium ? (
                            <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-wide text-background-dark">
                              Premium
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          {chapter.publishedAtLabel}
                        </p>
                        {isSequenceBlocked ? (
                          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
                            {getSequenceBlockedLabel(chapter)}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3">
                        {chapter.isCurrent ? (
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            Continue here
                          </span>
                        ) : null}
                        <span className="material-symbols-outlined text-slate-400">
                          {isSequenceBlocked ? "lock" : "chevron_right"}
                        </span>
                      </div>
                    </motion.article>
                  );

                  if (isSequenceBlocked) {
                    return (
                      <div
                        aria-disabled="true"
                        className="block"
                        key={chapter.chapterSlug}
                      >
                        {chapterCard}
                      </div>
                    );
                  }

                  return (
                    <PrefetchableChapterLink
                      chapterSlug={chapter.chapterSlug}
                      key={chapter.chapterSlug}
                      storySlug={story.slug}
                      to={buildChapterHref(story.slug, chapter.chapterSlug)}
                    >
                      {chapterCard}
                    </PrefetchableChapterLink>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-primary/10 bg-white p-6 dark:bg-primary/5">
              <h3 className="text-xl font-bold">Story snapshot</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {story.shortSynopsis}
              </p>
              <div className="space-y-3">
                {story.tagLabels.map((tag) => (
                  <div
                    className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold"
                    key={tag}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal as="section">
            <StoryRecommendationsSection recommendations={storyData.recommendations} />
          </Reveal>

          <Reveal as="section">
            <StoryReviewPreviewSection reviews={reviewPreview.reviews} story={story} />
          </Reveal>
        </div>
      </main>
    </div>
  );
}

function MobileStoryDetails({
  isAuthorFollowPending,
  isReadingListsLoading,
  isSubmittingRating,
  isStoryFollowPending,
  onOpenReadingListModal,
  onToggleAuthorFollow,
  onToggleStoryFollow,
  onRate,
  readingListCount,
  reviewPreview,
  story,
  storyData,
}) {
  const primaryChapterSlug =
    storyData.continueReading?.chapterSlug || story.firstChapterSlug;
  const [isChapterListExpanded, setIsChapterListExpanded] = useState(false);
  const chapterListId = `mobile-story-chapters-${story.slug}`;

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <main className="space-y-3 px-2 pb-20 pt-2">
        <Reveal>
          <Link
            className="inline-flex items-center gap-1 text-xs font-medium text-primary"
            to="/dashboard"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back</span>
          </Link>
        </Reveal>

        <Reveal>
          <div className="overflow-hidden rounded-lg border border-primary/10">
            <img
              alt={story.title}
              className="aspect-[3/4] w-full object-cover"
              src={story.coverImage}
            />
          </div>
        </Reveal>

        <Reveal className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {story.genres.map((genre) => (
              <span
                className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-primary"
                key={genre}
              >
                {genre}
              </span>
            ))}
          </div>
          <h1 className="text-xl font-black leading-snug">{story.title}</h1>
          <p className="text-xs font-semibold text-primary">by {story.authorName}</p>
          <StoryFollowActions
            compact
            isAuthorFollowPending={isAuthorFollowPending}
            isStoryFollowPending={isStoryFollowPending}
            onToggleAuthorFollow={onToggleAuthorFollow}
            onToggleStoryFollow={onToggleStoryFollow}
            story={story}
          />
          <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
            {story.synopsis}
          </p>
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-primary/10 bg-white p-2 dark:bg-primary/5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Rating
            </p>
            <p className="mt-1 text-lg font-black">{story.rating.toFixed(1)}</p>
          </div>
          <div className="rounded-lg border border-primary/10 bg-white p-2 dark:bg-primary/5">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Chapters
            </p>
            <p className="mt-1 text-lg font-black">{story.chapterCount}</p>
          </div>
        </Reveal>

        <Reveal>
          <StoryRatingPanel
            compact
            isSubmittingRating={isSubmittingRating}
            onRate={onRate}
            story={story}
          />
        </Reveal>

        <Reveal className="space-y-2">
          {primaryChapterSlug ? (
            <StoryAction
              compact
              prefetchChapter={{ chapterSlug: primaryChapterSlug, storySlug: story.slug }}
              to={buildChapterHref(story.slug, primaryChapterSlug)}
            >
              <span className="material-symbols-outlined text-sm">menu_book</span>
              <span className="text-sm">
                {storyData.continueReading ? "Continue Reading" : "Start Reading"}
              </span>
            </StoryAction>
          ) : null}
          <StoryAction compact to={buildGiftSendingHref(story.slug)} tone="secondary">
            <span className="material-symbols-outlined text-sm">card_giftcard</span>
            <span className="text-sm">Send Gift</span>
          </StoryAction>
          <StoryAction
            compact
            disabled={isReadingListsLoading}
            onClick={onOpenReadingListModal}
            tone="secondary"
          >
            <span className="material-symbols-outlined text-sm">
              format_list_bulleted
            </span>
            <span className="text-sm">
              {getReadingListActionLabel(readingListCount)}
            </span>
          </StoryAction>
        </Reveal>

        <Reveal as="section" className="space-y-2">
          <button
            aria-controls={chapterListId}
            aria-expanded={isChapterListExpanded}
            className="flex w-full items-center justify-between rounded-xl border border-primary/10 bg-white px-3 py-2.5 text-left transition-colors hover:bg-primary/5 dark:bg-primary/5"
            onClick={() => setIsChapterListExpanded((current) => !current)}
            type="button"
          >
            <div>
              <h2 className="text-base font-bold">Chapters</h2>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                {story.chapterCount} published chapters
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-primary">
              {isChapterListExpanded ? "Hide" : "Show"}
              <motion.span
                animate={{ rotate: isChapterListExpanded ? 180 : 0 }}
                className="material-symbols-outlined text-base"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                expand_more
              </motion.span>
            </span>
          </button>

          <AnimatePresence initial={false}>
            {isChapterListExpanded ? (
              <motion.div
                key="chapter-list"
                animate={{ height: "auto", opacity: 1 }}
                className="overflow-hidden"
                exit={{ height: 0, opacity: 0 }}
                id={chapterListId}
                initial={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                <div className="flex flex-col gap-1.5 pt-1.5">
              {storyData.chapters.map((chapter) => {
                const isSequenceBlocked = chapter.accessState === "SEQUENCE_BLOCKED";
                const chapterCard = (
                  <article
                    className={`rounded-lg border border-primary/10 bg-white p-2.5 dark:bg-primary/5 ${
                      isSequenceBlocked ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
                          Chapter {chapter.chapterNumber}
                        </p>
                        <h3 className="mt-0.5 line-clamp-1 text-xs font-semibold">
                          {chapter.title}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {chapter.publishedAtLabel}
                        </p>
                        {isSequenceBlocked ? (
                          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">
                            {getSequenceBlockedLabel(chapter)}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        {chapter.premium ? (
                          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-background-dark">
                            Premium
                          </span>
                        ) : null}
                        {isSequenceBlocked ? (
                          <span className="material-symbols-outlined text-sm text-slate-400">
                            lock
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );

                if (isSequenceBlocked) {
                  return (
                    <div
                      aria-disabled="true"
                      className="block"
                      key={chapter.chapterSlug}
                    >
                      {chapterCard}
                    </div>
                  );
                }

                return (
                  <PrefetchableChapterLink
                    chapterSlug={chapter.chapterSlug}
                    key={chapter.chapterSlug}
                    storySlug={story.slug}
                    to={buildChapterHref(story.slug, chapter.chapterSlug)}
                  >
                    {chapterCard}
                  </PrefetchableChapterLink>
                );
              })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Reveal>

        <Reveal>
          <StoryRecommendationsSection compact recommendations={storyData.recommendations} />
        </Reveal>

        <Reveal>
          <StoryReviewPreviewSection compact reviews={reviewPreview.reviews} story={story} />
        </Reveal>
      </main>
    </div>
  );
}

export default function StoryDetailsPage() {
  const navigate = useNavigate();
  const { storySlug } = useParams();
  const { showToast } = useToast();
  const [isReadingListModalOpen, setIsReadingListModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isError, isLoading } = useStoryDetailsQuery(storySlug);
  const readingListsQuery = useReadingListsQuery();
  const reviewPreviewQuery = useStoryReviewsQuery(storySlug, {
    limit: 3,
    sort: "recent",
  });
  const addStoryToReadingListMutation = useAddStoryToReadingListMutation();
  const updateStoryRatingMutation = useUpdateStoryRatingMutation(storySlug);
  const followStoryMutation = useFollowStoryMutation();
  const unfollowStoryMutation = useUnfollowStoryMutation();
  const followAuthorMutation = useFollowAuthorMutation();
  const unfollowAuthorMutation = useUnfollowAuthorMutation();
  const story = useMemo(() => data?.story ?? null, [data]);
  const readingLists = readingListsQuery.data?.lists ?? [];
  const matchingReadingLists = useMemo(
    () => getListsContainingStory(readingLists, story?.slug),
    [readingLists, story?.slug],
  );
  const readingListIds = useMemo(
    () => new Set(matchingReadingLists.map((list) => list.id)),
    [matchingReadingLists],
  );
  const reviewPreview = reviewPreviewQuery.data ?? {
    reviews: [],
  };

  function handleSearchSubmit(event) {
    event.preventDefault();
    navigate(buildSearchHref(searchTerm || story?.genres?.[0] || "Fantasy"));
  }

  async function handleRate(nextRating) {
    if (!story?.canRate || updateStoryRatingMutation.isPending) {
      return;
    }

    try {
      await updateStoryRatingMutation.mutateAsync({ rating: nextRating });
      showToast("Your book rating has been saved.", {
        title: "Rating updated",
      });
    } catch (mutationError) {
      showToast(
        mutationError?.message || "We could not save your rating right now.",
        {
          title: "Rating failed",
          tone: "error",
        },
      );
    }
  }

  async function handleToggleStoryFollow() {
    if (!storySlug || followStoryMutation.isPending || unfollowStoryMutation.isPending) {
      return;
    }

    try {
      const response = story?.isFollowingStory
        ? await unfollowStoryMutation.mutateAsync(storySlug)
        : await followStoryMutation.mutateAsync(storySlug);
      showToast(
        response?.message ||
          (story?.isFollowingStory
            ? `Unfollowed ${story?.title || "story"}.`
            : `Following ${story?.title || "story"}.`),
        {
          title: "Story updated",
        },
      );
    } catch (mutationError) {
      showToast(
        mutationError?.message || "We could not update that story follow right now.",
        {
          title: "Follow failed",
          tone: "error",
        },
      );
    }
  }

  async function handleToggleAuthorFollow() {
    if (
      !story?.authorId ||
      followAuthorMutation.isPending ||
      unfollowAuthorMutation.isPending
    ) {
      return;
    }

    try {
      const response = story.isFollowingAuthor
        ? await unfollowAuthorMutation.mutateAsync(story.authorId)
        : await followAuthorMutation.mutateAsync(story.authorId);
      showToast(
        response?.message ||
          (story.isFollowingAuthor
            ? `Unfollowed ${story.authorName}.`
            : `Following ${story.authorName}.`),
        {
          title: "Author updated",
        },
      );
    } catch (mutationError) {
      showToast(
        mutationError?.message || "We could not update that author follow right now.",
        {
          title: "Follow failed",
          tone: "error",
        },
      );
    }
  }

  async function handleAddStoryToList(listId) {
    if (!story) {
      return;
    }

    try {
      const response = await addStoryToReadingListMutation.mutateAsync({
        input: {
          storySlug: story.slug,
        },
        listId,
      });
      setIsReadingListModalOpen(false);
      showToast(response?.message || `${story.title} added to your reading list.`, {
        title: "Story saved",
      });
    } catch (mutationError) {
      showToast(
        mutationError?.message || "We could not add this story to that list right now.",
        {
          title: "Save failed",
          tone: "error",
        },
      );
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <LoadingState />
      </div>
    );
  }

  if (isError || !story) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Dashboard"
        ctaTo="/dashboard"
        description={getStoryErrorMessage(error)}
        secondaryLabel="Browse Stories"
        secondaryTo={buildSearchHref("Fantasy")}
        title="Story Not Available"
        tone="error"
      />
    );
  }

  return (
    <>
      <SeoMetadata
        author={story.authorName}
        description={getStorySeoDescription(story)}
        image={story.coverImage}
        imageAlt={`${story.title} cover art`}
        title={`${story.title} by ${story.authorName}`}
        type="book"
        url={buildStoryHref(story.slug)}
      />
      <DesktopStoryDetails
        isAuthorFollowPending={
          followAuthorMutation.isPending || unfollowAuthorMutation.isPending
        }
        isReadingListsLoading={readingListsQuery.isLoading && !readingLists.length}
        isSubmittingRating={updateStoryRatingMutation.isPending}
        isStoryFollowPending={
          followStoryMutation.isPending || unfollowStoryMutation.isPending
        }
        onOpenReadingListModal={() => setIsReadingListModalOpen(true)}
        onToggleAuthorFollow={handleToggleAuthorFollow}
        onToggleStoryFollow={handleToggleStoryFollow}
        onRate={handleRate}
        onSearchSubmit={handleSearchSubmit}
        readingListCount={matchingReadingLists.length}
        reviewPreview={reviewPreview}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        story={story}
        storyData={data}
      />
      <MobileStoryDetails
        isAuthorFollowPending={
          followAuthorMutation.isPending || unfollowAuthorMutation.isPending
        }
        isReadingListsLoading={readingListsQuery.isLoading && !readingLists.length}
        isSubmittingRating={updateStoryRatingMutation.isPending}
        isStoryFollowPending={
          followStoryMutation.isPending || unfollowStoryMutation.isPending
        }
        onOpenReadingListModal={() => setIsReadingListModalOpen(true)}
        onToggleAuthorFollow={handleToggleAuthorFollow}
        onToggleStoryFollow={handleToggleStoryFollow}
        onRate={handleRate}
        readingListCount={matchingReadingLists.length}
        reviewPreview={reviewPreview}
        story={story}
        storyData={data}
      />
      <AddToReadingListModal
        existingListIds={readingListIds}
        isLoading={readingListsQuery.isLoading}
        isOpen={isReadingListModalOpen}
        isSubmitting={addStoryToReadingListMutation.isPending}
        lists={readingLists}
        onAddToList={handleAddStoryToList}
        onClose={() => setIsReadingListModalOpen(false)}
        storyTitle={story.title}
      />
    </>
  );
}
