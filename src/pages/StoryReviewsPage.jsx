import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import StoryReviewCard, { ReviewStars } from "../components/StoryReviewCard";
import { useToast } from "../context/ToastContext";
import { buildStoryHref } from "../data/readerFlow";
import {
  useDeleteStoryReviewMutation,
  useStoryDetailsQuery,
  useStoryReviewsQuery,
  useUpsertStoryReviewMutation,
} from "../reader/readerHooks";

function RatingPicker({ disabled, onChange, rating }) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;

        return (
          <button
            aria-label={`Set rating to ${value}`}
            className={`material-symbols-outlined text-2xl transition-colors sm:text-3xl ${
              value <= rating
                ? "fill-1 text-primary"
                : "text-slate-300 dark:text-slate-600"
            } ${disabled ? "cursor-not-allowed opacity-70" : "hover:text-primary"}`}
            disabled={disabled}
            key={value}
            onClick={() => onChange(value)}
            type="button"
          >
            star
          </button>
        );
      })}
    </div>
  );
}

function DistributionBar({ count, percent, stars }) {
  return (
    <div className="grid grid-cols-[20px_1fr_36px] items-center gap-2 sm:grid-cols-[24px_1fr_48px] sm:gap-3">
      <span className="text-xs font-bold sm:text-sm">{stars}</span>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-primary/10 sm:h-2">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
      <span className="text-right text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
        {count}
      </span>
    </div>
  );
}

export default function StoryReviewsPage() {
  const { storySlug } = useParams();
  const { showToast } = useToast();
  const [sortBy, setSortBy] = useState("recent");
  const [form, setForm] = useState({
    body: "",
    containsSpoilers: false,
    rating: 0,
    title: "",
  });
  const storyQuery = useStoryDetailsQuery(storySlug);
  const reviewsQuery = useStoryReviewsQuery(storySlug, {
    sort: sortBy,
  });
  const upsertReviewMutation = useUpsertStoryReviewMutation(storySlug);
  const deleteReviewMutation = useDeleteStoryReviewMutation(storySlug);
  const story = storyQuery.data?.story ?? null;
  const reviewsData = reviewsQuery.data ?? null;
  const currentUserReview = reviewsData?.currentUserReview ?? null;

  useEffect(() => {
    setForm({
      body: currentUserReview?.body ?? "",
      containsSpoilers: currentUserReview?.containsSpoilers ?? false,
      rating: currentUserReview?.rating ?? story?.userRating ?? 0,
      title: currentUserReview?.title ?? "",
    });
  }, [currentUserReview, story?.userRating]);

  if (storyQuery.isLoading || reviewsQuery.isLoading) {
    return <RouteLoadingScreen />;
  }

  if (storyQuery.isError || reviewsQuery.isError || !story || !reviewsData) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Story"
        ctaTo={buildStoryHref(storySlug)}
        description={
          storyQuery.error?.message ||
          reviewsQuery.error?.message ||
          "Reviews could not be loaded right now."
        }
        secondaryLabel="Browse Stories"
        secondaryTo="/browse"
        title="Reviews Unavailable"
        tone="error"
      />
    );
  }

  const averageRating = reviewsData.summary.averageRating ?? story.rating;
  const distribution = reviewsData.summary.distribution ?? [];
  const ratingCount = reviewsData.summary.ratingCount ?? story.reviewCount;
  const writtenReviewCount =
    reviewsData.summary.writtenReviewCount ?? story.writtenReviewCount ?? 0;
  const canSubmitReview = reviewsData.canReview;
  const reviewPending =
    upsertReviewMutation.isPending || deleteReviewMutation.isPending;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmitReview || reviewPending) {
      return;
    }

    try {
      const response = await upsertReviewMutation.mutateAsync({
        body: form.body,
        containsSpoilers: form.containsSpoilers,
        rating: form.rating,
        title: form.title.trim() || null,
      });

      showToast(response.message || "Review saved.");
    } catch (error) {
      showToast(error?.message || "Could not save your review.", {
        title: "Review failed",
        tone: "error",
      });
    }
  }

  async function handleDelete() {
    if (reviewPending || !currentUserReview?.canDelete) {
      return;
    }

    if (!window.confirm("Delete your review and rating for this story?")) {
      return;
    }

    try {
      const response = await deleteReviewMutation.mutateAsync();
      showToast(response.message || "Review deleted.");
    } catch (error) {
      showToast(error?.message || "Could not delete your review.", {
        title: "Delete failed",
        tone: "error",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <Link
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary sm:gap-2 sm:text-sm"
              to={buildStoryHref(story.slug)}
            >
              <span className="material-symbols-outlined text-sm sm:text-base">arrow_back</span>
              Back to story
            </Link>
            <h1 className="mt-2 line-clamp-2 text-xl font-black tracking-tight sm:mt-3 sm:text-3xl sm:line-clamp-none lg:text-4xl">
              {story.title} Reviews
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-sm">
              by {story.authorName}
            </p>
          </div>
          <Link
            className="shrink-0 rounded-full border border-primary/20 px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10 sm:px-5 sm:py-3 sm:text-sm"
            to={buildStoryHref(story.slug)}
          >
            Open Story
          </Link>
        </div>

        <section className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:mt-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5 sm:rounded-[1.5rem] lg:rounded-[2rem] lg:p-6">
            <div className="flex gap-4 sm:block sm:gap-0">
              <img
                alt={story.title}
                className="h-28 w-20 shrink-0 rounded-xl object-cover shadow-md sm:h-64 sm:w-full sm:rounded-[1.5rem] sm:shadow-lg"
                src={story.coverImage}
              />
              <div className="min-w-0 flex-1 space-y-3 sm:mt-6 sm:flex-none sm:space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
                    Average Rating
                  </p>
                  <p className="mt-1 text-4xl font-black sm:mt-2 sm:text-5xl">{averageRating.toFixed(1)}</p>
                  <div className="mt-1.5 sm:mt-2">
                    <ReviewStars rating={Math.round(averageRating)} />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-sm">
                    {ratingCount.toLocaleString()} ratings • {writtenReviewCount.toLocaleString()} reviews
                  </p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {distribution.map((item) => (
                    <DistributionBar
                      count={item.count}
                      key={item.stars}
                      percent={item.percent}
                      stars={item.stars}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <section className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5 sm:rounded-[1.5rem] sm:p-6 lg:rounded-[2rem]">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
                    Your Review
                  </p>
                  <h2 className="mt-1.5 text-lg font-black tracking-tight sm:mt-2 sm:text-2xl">
                    {currentUserReview ? "Edit your review" : "Write a review"}
                  </h2>
                </div>
                {currentUserReview?.statusLabel ? (
                  <span className="rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                    {currentUserReview.statusLabel}
                  </span>
                ) : null}
              </div>

              {currentUserReview?.moderationNotes ? (
                <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-800 dark:text-amber-200 sm:mt-4 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
                  {currentUserReview.moderationNotes}
                </div>
              ) : null}

              {canSubmitReview ? (
                <form className="mt-4 space-y-3 sm:mt-6 sm:space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
                      Rating
                    </label>
                    <div className="mt-1.5 sm:mt-2">
                      <RatingPicker
                        disabled={reviewPending}
                        onChange={(rating) =>
                          setForm((current) => ({
                            ...current,
                            rating,
                          }))
                        }
                        rating={form.rating}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:text-xs"
                      htmlFor="review-title"
                    >
                      Title
                    </label>
                    <input
                      className="mt-1.5 h-10 w-full rounded-xl border border-primary/10 bg-slate-50 px-3 text-sm outline-none transition-colors focus:border-primary dark:bg-background-dark/40 sm:mt-2 sm:h-12 sm:rounded-2xl sm:px-4"
                      id="review-title"
                      maxLength={140}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      placeholder="Summarize your take"
                      value={form.title}
                    />
                  </div>

                  <div>
                    <label
                      className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:text-xs"
                      htmlFor="review-body"
                    >
                      Review
                    </label>
                    <textarea
                      className="mt-1.5 min-h-[120px] w-full rounded-2xl border border-primary/10 bg-slate-50 px-3 py-3 text-sm leading-6 outline-none transition-colors focus:border-primary dark:bg-background-dark/40 sm:mt-2 sm:min-h-[180px] sm:rounded-3xl sm:px-4 sm:py-4 sm:leading-7"
                      id="review-body"
                      maxLength={4000}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          body: event.target.value,
                        }))
                      }
                      placeholder="Tell readers what worked, what did not, and who this story is for."
                      value={form.body}
                    />
                  </div>

                  <label className="flex items-center gap-2 rounded-xl border border-primary/10 bg-slate-50 px-3 py-2.5 text-xs dark:bg-background-dark/40 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
                    <input
                      checked={form.containsSpoilers}
                      className="size-4 accent-primary"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          containsSpoilers: event.target.checked,
                        }))
                      }
                      type="checkbox"
                    />
                    This review contains spoilers
                  </label>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      className="rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-background-dark transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-3 sm:text-sm"
                      disabled={reviewPending || form.rating < 1 || form.body.trim().length < 12}
                      type="submit"
                    >
                      {currentUserReview ? "Save Review" : "Publish Review"}
                    </button>
                    {currentUserReview?.canDelete ? (
<button
                      className="rounded-full border border-rose-500/20 px-4 py-2.5 text-xs font-bold text-rose-600 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:text-rose-300 sm:px-5 sm:py-3 sm:text-sm"
                        disabled={reviewPending}
                        onClick={handleDelete}
                        type="button"
                      >
                        Delete Review
                      </button>
                    ) : null}
                  </div>
                </form>
              ) : (
                <div className="mt-4 rounded-xl border border-primary/10 bg-slate-50 px-3 py-3 text-xs text-slate-600 dark:bg-background-dark/40 dark:text-slate-300 sm:mt-6 sm:rounded-2xl sm:px-4 sm:py-4 sm:text-sm">
                  {reviewsData.reviewEligibilityMessage ||
                    "Finish the story and unlock every published chapter before leaving a review."}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5 sm:rounded-[1.5rem] sm:p-6 lg:rounded-[2rem]">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
                    Reader Reviews
                  </p>
                  <h2 className="mt-1.5 text-lg font-black tracking-tight sm:mt-2 sm:text-2xl">
                    Community feedback
                  </h2>
                </div>
                <select
                  className="rounded-full border border-primary/10 bg-slate-50 px-3 py-1.5 text-xs font-bold outline-none dark:bg-background-dark/40 sm:px-4 sm:py-2 sm:text-sm"
                  onChange={(event) => setSortBy(event.target.value)}
                  value={sortBy}
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>

              <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                {reviewsData.reviews.length ? (
                  reviewsData.reviews.map((review) => (
                    <StoryReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-primary/20 bg-slate-50 px-3 py-6 text-center text-xs text-slate-500 dark:bg-background-dark/40 dark:text-slate-400 sm:rounded-2xl sm:px-4 sm:py-10 sm:text-sm">
                    No written reviews have been published yet.
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
