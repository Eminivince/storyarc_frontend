import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import { PrefetchableStoryLink } from "../components/PrefetchableLink";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useOnboarding } from "../context/OnboardingContext";
import { buildStoryHref, DASHBOARD_SHELF_IDS } from "../data/readerFlow";
import { useReaderDashboardShelfInfiniteQuery } from "../reader/readerHooks";

function ShelfStoryGrid({ stories }) {
  if (!stories.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-6">
      {stories.map((story, index) => (
        <PrefetchableStoryLink
          key={`${story.slug}-${index}`}
          storySlug={story.slug}
          to={buildStoryHref(story.slug)}>
          <motion.article
            className="group flex h-full flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: (index % 10) * 0.04, duration: 0.28 }}
            whileHover={{ y: -4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.15, once: true }}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-primary/10 bg-slate-200 dark:bg-primary/5">
              <img
                alt={story.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={story.coverImage}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background-dark">
                    {story.genreLabel}
                  </span>
                  <span className="rounded-full bg-black/45 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    {story.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="line-clamp-1 text-base font-bold transition-colors group-hover:text-primary">
                {story.title}
              </h3>
              <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                {story.authorName}
              </p>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <span>{story.readsLabel} reads</span>
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                <span>{story.statusLabel}</span>
              </div>
            </div>
          </motion.article>
        </PrefetchableStoryLink>
      ))}
    </div>
  );
}

export default function DashboardShelfPage() {
  const { shelfId } = useParams();
  const { selectedGenres } = useOnboarding();
  const topGenre = selectedGenres[0] || "Fantasy";
  const validShelf = typeof shelfId === "string" && DASHBOARD_SHELF_IDS.includes(shelfId);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
  } = useReaderDashboardShelfInfiniteQuery(shelfId);

  const stories = data?.pages.flatMap((page) => page.stories) ?? [];
  const title = data?.pages[0]?.title ?? "Stories";

  if (!validShelf) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to dashboard"
        ctaTo="/dashboard"
        description="This shelf link is not valid."
        title="Shelf not found"
        tone="error"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <div className="hidden md:flex">
          <AppDesktopSidebar topGenre={topGenre} />
          <main className="flex-1 p-8">
            <RouteLoadingScreen />
          </main>
        </div>
        <div className="md:hidden">
          <RouteLoadingScreen />
          <AppMobileTabBar topGenre={topGenre} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to dashboard"
        ctaTo="/dashboard"
        description={error?.message || "We could not load this shelf."}
        title="Could not load shelf"
        tone="error"
      />
    );
  }

  return (
    <>
      <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
        <div className="relative flex min-h-screen w-full">
          <AppDesktopSidebar topGenre={topGenre} />

          <main className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary/10 bg-background-light/85 px-6 backdrop-blur-md dark:bg-background-dark/85 lg:px-10">
              <div className="flex min-w-0 items-center gap-4">
                <Link
                  className="shrink-0 text-sm font-semibold text-primary hover:underline"
                  to="/dashboard">
                  ← Dashboard
                </Link>
                <h1 className="truncate text-lg font-bold lg:text-xl">{title}</h1>
              </div>
              <Link
                className="hidden text-sm font-semibold text-slate-500 hover:text-primary lg:inline"
                to={buildSearchHref(topGenre)}>
                Search
              </Link>
            </header>

            <div className="flex-1 space-y-8 px-6 py-10 lg:px-10">
              <Reveal as="section" className="space-y-6">
                {!stories.length ? (
                  <div className="rounded-xl border border-primary/10 bg-primary/5 p-8 text-center">
                    <p className="text-slate-600 dark:text-slate-400">No stories in this shelf yet.</p>
                    <Link className="mt-4 inline-block text-sm font-semibold text-primary hover:underline" to="/dashboard">
                      Back to dashboard
                    </Link>
                  </div>
                ) : (
                  <>
                    <ShelfStoryGrid stories={stories} />
                    {hasNextPage ? (
                      <div className="flex justify-center pt-4">
                        <button
                          className="rounded-full border border-primary/20 bg-primary/10 px-6 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15 disabled:opacity-50"
                          disabled={isFetchingNextPage}
                          onClick={() => fetchNextPage()}
                          type="button">
                          {isFetchingNextPage ? "Loading…" : "Load more"}
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </Reveal>
            </div>
          </main>
        </div>
      </div>

      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
        <main className="space-y-5 px-4 pb-28 pt-4">
          <div className="flex items-center justify-between gap-3">
            <Link className="shrink-0 text-sm font-semibold text-primary hover:underline" to="/dashboard">
              ← Back
            </Link>
            <h1 className="min-w-0 truncate text-base font-bold">{title}</h1>
          </div>

          {!stories.length ? (
            <div className="rounded-xl border border-primary/10 bg-primary/5 p-6 text-center text-sm text-slate-600 dark:text-slate-400">
              No stories in this shelf yet.
            </div>
          ) : (
            <>
              <ShelfStoryGrid stories={stories} />
              {hasNextPage ? (
                <button
                  className="w-full rounded-xl border border-primary/20 bg-primary/10 py-3 text-sm font-bold text-primary disabled:opacity-50"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  type="button">
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </button>
              ) : null}
            </>
          )}
        </main>
        <AppMobileTabBar topGenre={topGenre} />
      </div>
    </>
  );
}
