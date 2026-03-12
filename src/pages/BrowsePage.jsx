import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import {
  buildBrowseHref,
  buildSearchHref,
  buildStoryHref,
} from "../data/readerFlow";
import { useCreator } from "../context/CreatorContext";
import { useReaderStoriesQuery } from "../reader/readerHooks";

function LoadingState() {
  return <RouteLoadingScreen />;
}

function EmptyState({ activeGenre, query }) {
  const description = query
    ? `No stories matched "${query}"${activeGenre ? ` in ${activeGenre}` : ""}.`
    : activeGenre
      ? `No published stories are available in ${activeGenre} yet.`
      : "No published stories are available to browse yet.";

  return (
    <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center">
      <h2 className="text-2xl font-bold">Nothing to browse yet</h2>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function getBrowseErrorMessage(error) {
  if (error?.status === 404) {
    return "The browse catalog is empty right now. Publish stories in the backend to populate it.";
  }

  return error?.message || "We could not load the browse catalog right now.";
}

function GenrePill({ active = false, label, onClick }) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-colors ${
        active
          ? "bg-primary text-background-dark"
          : "bg-primary/10 text-primary hover:bg-primary/20"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function StoryGrid({ stories }) {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 xl:grid-cols-5">
      {stories.map((story, index) => (
        <Link className="group block" key={story.slug} to={buildStoryHref(story.slug)}>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.04, duration: 0.28 }}
            whileHover={{ y: -5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.15, once: true }}
          >
            <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-2xl border border-primary/10">
              <img
                alt={story.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={story.coverImage}
              />
              <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                {story.averageRating.toFixed(1)}
              </div>
            </div>

            <h3 className="line-clamp-1 text-base font-bold transition-colors group-hover:text-primary">
              {story.title}
            </h3>
            <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
              {story.authorName}
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <span>{story.genreLabel}</span>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              <span>{story.statusLabel}</span>
            </div>
          </motion.article>
        </Link>
      ))}
    </div>
  );
}

function MobileStoryList({ stories }) {
  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <Link key={story.slug} to={buildStoryHref(story.slug)}>
          <article className="flex gap-3 rounded-3xl border border-primary/10 bg-white p-3 dark:bg-primary/5">
            <img
              alt={story.title}
              className="h-28 w-24 rounded-2xl object-cover"
              src={story.coverImage}
            />
            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-2 text-base font-bold">{story.title}</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {story.authorName}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {story.genreLabel}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  {story.statusLabel}
                </span>
              </div>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {story.readsLabel} reads
              </p>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

function DesktopBrowse({
  activeGenreLabel,
  data,
  onGenreChange,
  onSearchSubmit,
  onWriteStory,
  query,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:flex">
      <AppDesktopSidebar topGenre={activeGenreLabel} />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <Reveal>
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
              <form className="relative flex-1" onSubmit={onSearchSubmit}>
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  className="w-full rounded-2xl border-none bg-slate-100 py-4 pl-12 pr-4 text-lg shadow-sm focus:ring-2 focus:ring-primary dark:bg-primary/10"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Browse stories, tags, authors..."
                  type="text"
                  value={searchTerm}
                />
              </form>

              <button
                className="rounded-2xl bg-primary px-6 py-4 font-bold text-background-dark"
                onClick={onWriteStory}
                type="button"
              >
                Write a Story
              </button>
            </div>
          </Reveal>

          <Reveal as="section" className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Browse catalog
            </p>
            <h1 className="text-4xl font-black tracking-tight">
              {activeGenreLabel ? `${activeGenreLabel} stories` : "All stories"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {data.stories.length} backend-backed stories
              {query ? ` matching "${query}"` : ""}
            </p>
          </Reveal>

          <Reveal as="section" className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <GenrePill
                active={!activeGenreLabel}
                label="All"
                onClick={() => onGenreChange("")}
              />
              {data.genres.map((genre) => (
                <GenrePill
                  active={activeGenreLabel === genre.label || activeGenreLabel === genre.slug}
                  key={genre.slug}
                  label={genre.label}
                  onClick={() => onGenreChange(genre.slug)}
                />
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="space-y-5 pb-12">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Stories</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Open a story to start reading
              </span>
            </div>

            {data.stories.length ? (
              <StoryGrid stories={data.stories} />
            ) : (
              <EmptyState activeGenre={activeGenreLabel} query={query} />
            )}
          </Reveal>
        </div>
      </main>
    </div>
  );
}

function MobileBrowse({
  activeGenreLabel,
  data,
  onGenreChange,
  onSearchSubmit,
  query,
  searchTerm,
  setSearchTerm,
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background-light/95 px-4 pb-4 pt-5 backdrop-blur-sm dark:bg-background-dark/95">
        <div className="mb-4 flex items-center justify-between gap-4">
          <button
            className="flex h-10 w-10 items-center justify-center text-primary"
            onClick={() => navigate(-1)}
            type="button"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold tracking-tight">
            Browse
          </h1>
          <div className="w-10" />
        </div>

        <form onSubmit={onSearchSubmit}>
          <div className="flex h-12 items-center rounded-2xl bg-slate-100 dark:bg-primary/10">
            <span className="material-symbols-outlined px-4 text-slate-400">
              search
            </span>
            <input
              className="h-full w-full border-none bg-transparent pr-4 text-base focus:ring-0"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search the browse catalog"
              value={searchTerm}
            />
          </div>
        </form>
      </header>

      <main className="space-y-8 px-4 pb-28 pt-6">
        <Reveal as="section">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Browse catalog
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            {activeGenreLabel ? activeGenreLabel : "All stories"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {data.stories.length} backend-backed stories
            {query ? ` matching "${query}"` : ""}
          </p>
        </Reveal>

        <Reveal as="section" className="space-y-3">
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
            <GenrePill
              active={!activeGenreLabel}
              label="All"
              onClick={() => onGenreChange("")}
            />
            {data.genres.map((genre) => (
              <GenrePill
                active={activeGenreLabel === genre.label || activeGenreLabel === genre.slug}
                key={genre.slug}
                label={genre.label}
                onClick={() => onGenreChange(genre.slug)}
              />
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="space-y-4">
          <h3 className="text-xl font-bold">Stories</h3>
          {data.stories.length ? (
            <MobileStoryList stories={data.stories} />
          ) : (
            <EmptyState activeGenre={activeGenreLabel} query={query} />
          )}
        </Reveal>
      </main>

      <AppMobileTabBar topGenre={activeGenreLabel} />
    </div>
  );
}

export default function BrowsePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { enterWriterMode, getCreatorEntryHref } = useCreator();
  const activeGenre = useMemo(
    () => searchParams.get("genre")?.trim() || "",
    [searchParams],
  );
  const query = useMemo(
    () => searchParams.get("q")?.trim() || "",
    [searchParams],
  );
  const [searchTerm, setSearchTerm] = useState(query);
  const { data, error, isError, isLoading } = useReaderStoriesQuery({
    genre: activeGenre,
    query,
  });
  const activeGenreLabel =
    data?.genres.find((genre) => genre.slug === activeGenre)?.label ||
    activeGenre ||
    data?.stories[0]?.genreLabel ||
    "";

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    navigate(buildBrowseHref(activeGenre, searchTerm));
  }

  function handleGenreChange(nextGenre) {
    navigate(buildBrowseHref(nextGenre || undefined, searchTerm || undefined));
  }

  function handleWriteStory() {
    enterWriterMode();
    navigate(getCreatorEntryHref());
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <div className="hidden lg:flex">
          <AppDesktopSidebar topGenre={activeGenreLabel} />
          <main className="flex-1 p-8">
            <LoadingState />
          </main>
        </div>
        <div className="lg:hidden">
          <LoadingState />
          <AppMobileTabBar topGenre={activeGenreLabel} />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ReaderStateScreen
        ctaLabel="Open Search"
        ctaTo={buildSearchHref(query || activeGenreLabel || "Fantasy")}
        description={getBrowseErrorMessage(error)}
        secondaryLabel="Back to Dashboard"
        secondaryTo="/dashboard"
        title="Browse Unavailable"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopBrowse
        activeGenreLabel={activeGenreLabel}
        data={data}
        onGenreChange={handleGenreChange}
        onSearchSubmit={handleSearchSubmit}
        onWriteStory={handleWriteStory}
        query={query}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <MobileBrowse
        activeGenreLabel={activeGenreLabel}
        data={data}
        onGenreChange={handleGenreChange}
        onSearchSubmit={handleSearchSubmit}
        query={query}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </>
  );
}
