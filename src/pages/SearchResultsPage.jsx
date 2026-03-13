import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PrefetchableStoryLink } from "../components/PrefetchableLink";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { buildSearchHref, buildStoryHref } from "../data/readerFlow";
import { useCreator } from "../context/CreatorContext";
import { useReaderSearchQuery } from "../reader/readerHooks";

function LoadingState() {
  return <RouteLoadingScreen />;
}

function EmptyState({ query }) {
  return (
    <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center">
      <h2 className="text-2xl font-bold">No results for "{query}"</h2>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        Try a broader genre, tag, or author name.
      </p>
    </div>
  );
}

function getSearchErrorMessage(error) {
  if (error?.status === 404) {
    return "The reader catalog is not available yet. Seed the backend stories first, then search again.";
  }

  return error?.message || "We could not search the catalog right now.";
}

function DesktopSearchResults({
  data,
  onSearchSubmit,
  onWriteStory,
  query,
  searchTerm,
  setSearchTerm,
  topGenre,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:flex">
      <AppDesktopSidebar topGenre={topGenre} />

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
                  placeholder="Search stories, tags, authors..."
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

          <Reveal as="section" className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Search query
            </p>
            <h1 className="text-4xl font-black tracking-tight">Results for "{query}"</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {data.authors.length} authors and {data.stories.length} stories found
            </p>
          </Reveal>

          {data.authors.length ? (
            <Reveal as="section" className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Authors</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Matched by published stories
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {data.authors.map((author, index) => (
                  <motion.article
                    className="rounded-3xl border border-primary/10 bg-white p-5 dark:bg-primary/5"
                    initial={{ opacity: 0, y: 20 }}
                    key={author.name}
                    transition={{ delay: index * 0.05, duration: 0.28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.2, once: true }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-black text-primary">
                        {author.name
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{author.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {author.storyCount} published stories
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {author.genres.map((genre) => (
                        <span
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                          key={genre}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      {author.totalReadsLabel} reads
                    </p>
                  </motion.article>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal as="section" className="space-y-5 pb-12">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Stories</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Open a story to start reading
              </span>
            </div>

            {data.stories.length ? (
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 xl:grid-cols-5">
                {data.stories.map((story, index) => (
                  <PrefetchableStoryLink className="group block" key={story.slug} storySlug={story.slug} to={buildStoryHref(story.slug)}>
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
                  </PrefetchableStoryLink>
                ))}
              </div>
            ) : (
              <EmptyState query={query} />
            )}
          </Reveal>
        </div>
      </main>
    </div>
  );
}

function MobileSearchResults({
  data,
  onSearchSubmit,
  query,
  searchTerm,
  setSearchTerm,
  topGenre,
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
          <h1 className="flex-1 text-center text-lg font-bold tracking-tight">Search</h1>
          <div className="w-10" />
        </div>

        <form onSubmit={onSearchSubmit}>
          <div className="flex h-12 items-center rounded-2xl bg-slate-100 dark:bg-primary/10">
            <span className="material-symbols-outlined px-4 text-slate-400">search</span>
            <input
              className="h-full w-full border-none bg-transparent pr-4 text-base focus:ring-0"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search the catalog"
              value={searchTerm}
            />
          </div>
        </form>
      </header>

      <main className="space-y-8 px-4 pb-28 pt-6">
        <Reveal as="section">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Results
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">{query}</h2>
        </Reveal>

        {data.authors.length ? (
          <Reveal as="section" className="space-y-4">
            <h3 className="text-xl font-bold">Authors</h3>
            <div className="space-y-3">
              {data.authors.map((author) => (
                <article
                  className="rounded-3xl border border-primary/10 bg-white p-4 dark:bg-primary/5"
                  key={author.name}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                      {author.name
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-bold">{author.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {author.storyCount} stories • {author.totalReadsLabel} reads
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        ) : null}

        <Reveal as="section" className="space-y-4">
          <h3 className="text-xl font-bold">Stories</h3>
          {data.stories.length ? (
            <div className="space-y-4 flex flex-col gap-1">
              {data.stories.map((story) => (
                <PrefetchableStoryLink key={story.slug} storySlug={story.slug} to={buildStoryHref(story.slug)}>
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
                      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                        {story.shortSynopsis}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                          {story.genreLabel}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                          {story.statusLabel}
                        </span>
                      </div>
                    </div>
                  </article>
                </PrefetchableStoryLink>
              ))}
            </div>
          ) : (
            <EmptyState query={query} />
          )}
        </Reveal>
      </main>

      <AppMobileTabBar topGenre={topGenre} />
    </div>
  );
}

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { enterWriterMode, getCreatorEntryHref } = useCreator();
  const query = useMemo(() => searchParams.get("q")?.trim() || "Fantasy", [searchParams]);
  const [searchTerm, setSearchTerm] = useState(query);
  const { data, error, isError, isLoading } = useReaderSearchQuery(query);
  const browseGenre =
    data?.stories?.[0]?.genreLabel ??
    data?.authors?.[0]?.genres?.[0] ??
    "Fantasy";

  function handleSearchSubmit(event) {
    event.preventDefault();
    navigate(buildSearchHref(searchTerm || "Fantasy"));
  }

  function handleWriteStory() {
    enterWriterMode();
    navigate(getCreatorEntryHref());
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <div className="hidden lg:flex">
          <AppDesktopSidebar topGenre={browseGenre} />
          <main className="flex-1 p-8">
            <LoadingState />
          </main>
        </div>
        <div className="lg:hidden">
          <LoadingState />
          <AppMobileTabBar topGenre={browseGenre} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Dashboard"
        ctaTo="/dashboard"
        description={getSearchErrorMessage(error)}
        secondaryLabel="Try Another Search"
        secondaryTo={buildSearchHref("Fantasy")}
        title="Search Unavailable"
        tone="error"
      />
    );
  }

  const safeData = data ?? { authors: [], stories: [] };

  return (
    <>
      <DesktopSearchResults
        data={safeData}
        onSearchSubmit={handleSearchSubmit}
        onWriteStory={handleWriteStory}
        query={query}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        topGenre={browseGenre}
      />
      <MobileSearchResults
        data={safeData}
        onSearchSubmit={handleSearchSubmit}
        query={query}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        topGenre={browseGenre}
      />
    </>
  );
}
