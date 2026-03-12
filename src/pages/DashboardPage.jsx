import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { notificationsHref } from "../data/accountFlow";
import {
  buildChapterHref,
  buildSearchHref,
  buildStoryHref,
} from "../data/readerFlow";
import { useCreator } from "../context/CreatorContext";
import { useOnboarding } from "../context/OnboardingContext";
import { useReaderDashboardQuery } from "../reader/readerHooks";

function LoadingState() {
  return <RouteLoadingScreen />;
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center">
      <h2 className="text-2xl font-bold">Your library is ready for real stories</h2>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        Seed the reader catalog in the backend, then your dashboard rows will appear here.
      </p>
    </div>
  );
}

function getDashboardErrorMessage(error) {
  if (error?.status === 404) {
    return "The reader catalog is empty right now. Seed the backend stories and chapters, then reload this page.";
  }

  return error?.message || "We could not load your dashboard right now.";
}

function StoryRow({ row }) {
  if (!row?.stories?.length) {
    return null;
  }

  return (
    <Reveal as="section" className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{row.title}</h2>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          {row.stories.length} stories
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        {row.stories.map((story, index) => (
          <Link key={story.slug} to={buildStoryHref(story.slug)}>
            <motion.article
              className="group flex h-full flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.04, duration: 0.28 }}
              whileHover={{ y: -4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.15, once: true }}
            >
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
          </Link>
        ))}
      </div>
    </Reveal>
  );
}

function DesktopDashboard({
  data,
  onSearchSubmit,
  searchTerm,
  setSearchTerm,
  topGenre,
  onWriteStory,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen w-full">
        <AppDesktopSidebar topGenre={topGenre} />

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary/10 bg-background-light/85 px-6 backdrop-blur-md dark:bg-background-dark/85 lg:px-10">
            <div className="max-w-xl flex-1">
              <form className="group relative" onSubmit={onSearchSubmit}>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary">
                  search
                </span>
                <input
                  className="w-full rounded-full border-none bg-slate-200/60 py-2.5 pl-11 pr-4 text-sm transition-all focus:ring-2 focus:ring-primary/50 dark:bg-primary/5"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search for stories, tags, or authors..."
                  type="text"
                  value={searchTerm}
                />
              </form>
            </div>

            <div className="ml-4 flex items-center gap-4">
              <Link
                className="relative flex size-10 items-center justify-center rounded-full text-slate-600 hover:bg-primary/10 dark:text-slate-300"
                to={notificationsHref}
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
              </Link>
              <button
                className="hidden rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-background-dark sm:block"
                onClick={onWriteStory}
                type="button"
              >
                Write Story
              </button>
            </div>
          </header>

          <div className="space-y-10 p-6 lg:p-10">
            {data?.featured ? (
              <Reveal as="section">
                <div className="group relative overflow-hidden rounded-[2rem] border border-primary/10">
                  <img
                    alt={data.featured.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={data.featured.bannerImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/70 to-background-dark/20" />
                  <div className="relative flex min-h-[420px] max-w-3xl flex-col justify-end p-10">
                    <span className="mb-5 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-background-dark">
                      Featured today
                    </span>
                    <h1 className="max-w-2xl text-4xl font-black leading-tight text-white lg:text-5xl">
                      {data.featured.title}
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-slate-200">
                      {data.featured.shortSynopsis}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {data.featured.genres.map((genre) => (
                        <span
                          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm"
                          key={genre}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <Link
                        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-background-dark"
                        to={buildChapterHref(
                          data.featured.slug,
                          data.featured.firstChapterSlug || "chapter-1",
                        )}
                      >
                        <span className="material-symbols-outlined">play_arrow</span>
                        Start Reading
                      </Link>
                      <Link
                        className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-sm"
                        to={buildStoryHref(data.featured.slug)}
                      >
                        <span className="material-symbols-outlined">auto_stories</span>
                        View Story
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ) : null}

            {data?.continueReading?.length ? (
              <Reveal as="section" className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold">Continue reading</h2>
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Pick up where you left off
                  </span>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                  {data.continueReading.map((entry, index) => (
                    <Link
                      key={`${entry.storySlug}-${entry.chapterSlug}`}
                      to={buildChapterHref(entry.storySlug, entry.chapterSlug)}
                    >
                      <motion.article
                        className="flex h-full gap-4 rounded-3xl border border-primary/10 bg-white p-4 shadow-sm transition-colors hover:bg-primary/5 dark:bg-primary/5"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ y: -4 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.2, once: true }}
                      >
                        <img
                          alt={entry.storyTitle}
                          className="h-28 w-20 rounded-2xl object-cover"
                          src={entry.coverImage}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                            {entry.chapterLabel}
                          </p>
                          <h3 className="mt-2 line-clamp-1 text-lg font-bold">
                            {entry.storyTitle}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                            {entry.chapterTitle}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {entry.resumeLabel || "Resume reading"}
                          </p>
                          <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-400">
                              <span>Progress</span>
                              <span>{entry.progressPercent}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${entry.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  ))}
                </div>
              </Reveal>
            ) : null}

            {data?.rows?.length
              ? data.rows.map((row) => <StoryRow key={row.id} row={row} />)
              : <EmptyState />}
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileDashboard({
  data,
  onSearchSubmit,
  searchTerm,
  setSearchTerm,
  topGenre,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <main className="space-y-8 px-4 pb-28 pt-5">
        {/* <Reveal>
          <div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                Reader mode
              </p>
              <h1 className="mt-2 text-xl font-black tracking-tight">
                Discover stories
              </h1>
            </div>
          </div>
        </Reveal> */}

        <Reveal>
          <form className="group relative" onSubmit={onSearchSubmit}>
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary">
              search
            </span>
            <input
              className="w-full rounded-2xl border-none bg-slate-100 py-4 pl-12 pr-4 text-base focus:ring-2 focus:ring-primary/50 dark:bg-primary/10"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={`Search ${topGenre || "Fantasy"} stories`}
              type="text"
              value={searchTerm}
            />
          </form>
        </Reveal>

        {data?.featured ? (
          <Reveal>
            <Link className="block" to={buildStoryHref(data.featured.slug)}>
              <article className="overflow-hidden rounded-[2rem] border border-primary/10">
                <div className="relative min-h-[340px]">
                  <img
                    alt={data.featured.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={data.featured.bannerImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent" />
                  <div className="relative flex min-h-[340px] flex-col justify-end p-6">
                    <span className="inline-flex w-fit rounded-full bg-primary px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-background-dark">
                      Featured
                    </span>
                    <h2 className="mt-4 text-3xl font-black leading-tight text-white">
                      {data.featured.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-200">
                      {data.featured.shortSynopsis}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          </Reveal>
        ) : null}

        {data?.continueReading?.length ? (
          <Reveal as="section" className="space-y-4">
            <h2 className="text-xl font-bold">Continue reading</h2>
            <div className="space-y-3 flex flex-col gap-3">
              {data.continueReading.map((entry) => (
                <Link
                  key={`${entry.storySlug}-${entry.chapterSlug}`}
                  to={buildChapterHref(entry.storySlug, entry.chapterSlug)}
                >
                  <article className="flex gap-3 rounded-3xl border border-primary/10 bg-white p-3 dark:bg-primary/5">
                    <img
                      alt={entry.storyTitle}
                      className="h-24 w-20 rounded-2xl object-cover"
                      src={entry.coverImage}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                        {entry.chapterLabel}
                      </p>
                      <h3 className="mt-2 line-clamp-1 text-base font-bold">
                        {entry.storyTitle}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                        {entry.chapterTitle}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {entry.resumeLabel || "Resume reading"}
                      </p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${entry.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </Reveal>
        ) : null}

        {data?.rows?.map((row) =>
          row.stories?.length ? (
            <Reveal as="section" className="space-y-4" key={row.id}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">{row.title}</h2>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {row.stories.length}
                </span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {row.stories.map((story) => (
                  <Link
                    className="block w-40 shrink-0"
                    key={story.slug}
                    to={buildStoryHref(story.slug)}
                  >
                    <article className="space-y-3">
                      <img
                        alt={story.title}
                        className="aspect-[3/4] w-full rounded-3xl object-cover"
                        src={story.coverImage}
                      />
                      <div>
                        <h3 className="line-clamp-1 text-sm font-bold">{story.title}</h3>
                        <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                          {story.authorName}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </Reveal>
          ) : null,
        )}

        {!data?.rows?.some((row) => row.stories?.length) ? <EmptyState /> : null}
      </main>

      <AppMobileTabBar topGenre={topGenre} />
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { enterWriterMode, getCreatorEntryHref } = useCreator();
  const { selectedGenres } = useOnboarding();
  const { data, error, isError, isLoading } = useReaderDashboardQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const topGenre = selectedGenres[0] || data?.availableGenres?.[0] || "Fantasy";

  function handleSearchSubmit(event) {
    event.preventDefault();
    navigate(buildSearchHref(searchTerm || topGenre));
  }

  function handleWriteStory() {
    enterWriterMode();
    navigate(getCreatorEntryHref());
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <div className="hidden lg:flex">
          <AppDesktopSidebar topGenre={topGenre} />
          <main className="flex-1 p-8">
            <LoadingState />
          </main>
        </div>
        <div className="lg:hidden">
          <LoadingState />
          <AppMobileTabBar topGenre={topGenre} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ReaderStateScreen
        ctaLabel="Try Search"
        ctaTo={buildSearchHref(topGenre)}
        description={getDashboardErrorMessage(error)}
        secondaryLabel="About StoryArc"
        secondaryTo="/about"
        title="Dashboard Unavailable"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopDashboard
        data={data}
        onSearchSubmit={handleSearchSubmit}
        onWriteStory={handleWriteStory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        topGenre={topGenre}
      />
      <MobileDashboard
        data={data}
        onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        topGenre={topGenre}
      />
    </>
  );
}
