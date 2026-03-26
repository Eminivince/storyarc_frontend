import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PrefetchableChapterLink, PrefetchableStoryLink } from "../components/PrefetchableLink";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import UserAvatar from "../components/UserAvatar";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  buildBrowseHref,
  buildChapterHref,
  buildSearchHref,
  buildStoryHref,
} from "../data/readerFlow";
import { useStoryRankingsQuery } from "../reader/readerHooks";

const DEFAULT_KIND = "trending";

function LoadingState() {
  return <RouteLoadingScreen />;
}

function getRankingsErrorMessage(error) {
  return error?.message || "Rankings could not be loaded right now.";
}

function getRankBadgeClass(rank) {
  if (rank === 1) return "bg-primary text-background-dark";
  if (rank === 2) {
    return "bg-slate-300 text-slate-900 dark:bg-slate-700 dark:text-slate-100";
  }
  if (rank === 3) return "bg-orange-700 text-white";
  return "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function StoryRankCard({ story }) {
  const chapterHref = story.firstChapterSlug
    ? buildChapterHref(story.slug, story.firstChapterSlug)
    : buildStoryHref(story.slug);

  return (
    <motion.article
      className="rounded-3xl border border-primary/10 bg-white/95 p-4 shadow-sm transition-colors dark:bg-primary/5"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.1, once: true }}
    >
      <div className="flex gap-4">
        <div className="flex w-12 shrink-0 items-start justify-center">
          <span
            className={`flex size-10 items-center justify-center rounded-2xl text-sm font-black shadow-sm ${getRankBadgeClass(
              story.rank,
            )}`}
          >
            {story.rank}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex gap-4">
            <PrefetchableStoryLink
              className="block h-32 w-24 shrink-0 overflow-hidden rounded-2xl border border-primary/10"
              storySlug={story.slug}
              to={buildStoryHref(story.slug)}
            >
              <img
                alt={story.title}
                className="h-full w-full object-cover"
                src={story.coverImage}
              />
            </PrefetchableStoryLink>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    {story.genreLabel}
                  </span>
                  <PrefetchableStoryLink
                    className="mt-2 block text-xl font-black tracking-tight transition-colors hover:text-primary"
                    storySlug={story.slug}
                    to={buildStoryHref(story.slug)}
                  >
                    {story.title}
                  </PrefetchableStoryLink>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    by {story.authorName} • {story.statusLabel}
                  </p>
                </div>

                <div className="rounded-2xl bg-primary/5 px-3 py-2 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Score
                  </p>
                  <p className="mt-1 text-sm font-black text-primary">
                    {story.ranking.scoreLabel}
                  </p>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {story.shortSynopsis}
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <MaterialSymbol name="star" filled className="text-sm text-primary" />
                  {story.averageRating.toFixed(1)} • {story.reviewCount.toLocaleString()} ratings
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MaterialSymbol name="visibility" className="text-sm text-primary" />
                  {story.readsLabel} readers
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MaterialSymbol name="favorite" className="text-sm text-primary" />
                  {story.followerCountLabel} followers
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MaterialSymbol name="menu_book" className="text-sm text-primary" />
                  {story.chapterCount} chapters
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 px-3 py-3 text-sm">
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {story.ranking.signalLabel}
                </p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  {story.ranking.activityLabel}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {story.firstChapterSlug ? (
                  <PrefetchableChapterLink
                    chapterSlug={story.firstChapterSlug}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-background-dark"
                    storySlug={story.slug}
                    to={chapterHref}
                  >
                    <MaterialSymbol name="play_arrow" className="text-lg" />
                    Read Now
                  </PrefetchableChapterLink>
                ) : (
                  <PrefetchableStoryLink
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-background-dark"
                    storySlug={story.slug}
                    to={buildStoryHref(story.slug)}
                  >
                    <MaterialSymbol name="visibility" className="text-lg" />
                    Open Story
                  </PrefetchableStoryLink>
                )}

                <PrefetchableStoryLink
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-primary/15 px-5 text-sm font-bold text-slate-900 transition-colors hover:bg-primary/5 dark:text-slate-100"
                  storySlug={story.slug}
                  to={buildStoryHref(story.slug)}
                >
                  <MaterialSymbol name="auto_stories" className="text-lg" />
                  Story Details
                </PrefetchableStoryLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function EmptyRankingsState({ browseHref }) {
  return (
    <div className="rounded-3xl border border-dashed border-primary/20 bg-white px-6 py-16 text-center dark:bg-primary/5">
      <p className="text-lg font-bold">No ranked stories matched this filter.</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Try another genre or browse the full catalog while fresh rankings build up.
      </p>
      <Link
        className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-bold text-background-dark"
        to={browseHref}
      >
        Browse Stories
      </Link>
    </div>
  );
}

function RankingsFilterBar({
  genres,
  onGenreChange,
  onKindChange,
  ranking,
  selectedGenre,
  selectedKind,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-primary/10 bg-white/95 p-4 shadow-sm dark:bg-primary/5">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <span>Genre</span>
        <select
          className="rounded-full border border-primary/15 bg-background-light px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary dark:bg-background-dark dark:text-slate-100"
          onChange={(event) => onGenreChange(event.target.value)}
          value={selectedGenre}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.slug} value={genre.slug}>
              {genre.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <span>Ranking</span>
        <select
          className="rounded-full border border-primary/15 bg-background-light px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary dark:bg-background-dark dark:text-slate-100"
          onChange={(event) => onKindChange(event.target.value)}
          value={selectedKind}
        >
          {ranking.tabs.map((tab) => (
            <option key={tab.kind} value={tab.kind}>
              {tab.label}
            </option>
          ))}
        </select>
      </label>

      <div className="ml-auto flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        <span className="rounded-full bg-primary/8 px-3 py-2 text-primary">
          {ranking.info.windowLabel}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-2 dark:bg-primary/10">
          {ranking.info.activityWindowLabel}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-2 dark:bg-primary/10">
          {ranking.info.updatedAtLabel}
        </span>
      </div>
    </div>
  );
}

function DesktopRankings({
  data,
  onGenreChange,
  onKindChange,
  onSearchSubmit,
  searchTerm,
  selectedGenre,
  selectedKind,
  setSearchTerm,
  topGenre,
}) {
  const browseHref = buildBrowseHref(selectedGenre || topGenre);

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex">
        <AppDesktopSidebar topGenre={topGenre} />
        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-primary/10 bg-background-light/85 px-8 backdrop-blur-md dark:bg-background-dark/85">
            <div className="flex items-center gap-8">
              <nav className="flex items-center gap-6">
                <Link
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
                  to={buildBrowseHref(topGenre)}
                >
                  Browse
                </Link>
                <Link
                  className="border-b-2 border-primary pb-1 text-sm font-semibold text-slate-900 dark:text-slate-100"
                  to="/rankings"
                >
                  Rankings
                </Link>
                <Link
                  className="text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
                  to="/following"
                >
                  Following
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <form className="relative" onSubmit={onSearchSubmit}>
                <MaterialSymbol name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                <input
                  className="w-72 rounded-full border border-primary/10 bg-white py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary dark:bg-primary/5"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search stories..."
                  type="text"
                  value={searchTerm}
                />
              </form>
              <Link
                className="flex size-9 items-center justify-center rounded-full border border-primary/20 transition-colors hover:bg-primary/10"
                to="/account/notifications"
              >
                <MaterialSymbol name="notifications" className="text-slate-500" />
              </Link>
              <Link
                className="flex size-9 overflow-hidden rounded-full border border-primary/20"
                to="/account/profile"
              >
                <UserAvatar className="size-full" name="" />
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div className="mx-auto max-w-6xl space-y-6">
              <section className="rounded-[2rem] border border-primary/10 bg-[radial-gradient(circle_at_top_left,_rgba(213,149,70,0.18),_transparent_48%),linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(250,243,232,0.94))] p-8 shadow-sm dark:bg-[radial-gradient(circle_at_top_left,_rgba(213,149,70,0.18),_transparent_48%),linear-gradient(135deg,_rgba(23,23,23,0.92),_rgba(32,18,7,0.86))]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Story Rankings
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight">
                  {data.ranking.label}
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {data.ranking.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  <span>{data.ranking.windowLabel}</span>
                  <span>•</span>
                  <span>{data.ranking.updatedAtLabel}</span>
                  <span>•</span>
                  <span>{data.ranking.totalStories.toLocaleString()} ranked stories</span>
                </div>
              </section>

              <RankingsFilterBar
                genres={data.genres}
                onGenreChange={onGenreChange}
                onKindChange={onKindChange}
                ranking={{ info: data.ranking, tabs: data.tabs }}
                selectedGenre={selectedGenre}
                selectedKind={selectedKind}
              />

              <div className="grid gap-4">
                {data.stories.length ? (
                  data.stories.map((story) => (
                    <StoryRankCard key={`${selectedKind}-${story.slug}`} story={story} />
                  ))
                ) : (
                  <EmptyRankingsState browseHref={browseHref} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileRankings({
  data,
  onGenreChange,
  onKindChange,
  selectedGenre,
  selectedKind,
  topGenre,
}) {
  const browseHref = buildBrowseHref(selectedGenre || topGenre);

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full max-w-md flex-col overflow-x-hidden">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-background-light/95 px-3 py-3 backdrop-blur-sm dark:border-primary/10 dark:bg-background-dark/95">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Story Rankings
          </p>
          <h1 className="mt-0.5 text-xl font-black tracking-tight">
            {data.ranking.label}
          </h1>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {data.ranking.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              {data.ranking.windowLabel}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-primary/10">
              {data.ranking.updatedAtLabel}
            </span>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-3 px-3 py-3 pb-24">
          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Genre
              </span>
              <select
                className="w-full rounded-xl border border-primary/15 bg-white px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary dark:bg-primary/5"
                onChange={(event) => onGenreChange(event.target.value)}
                value={selectedGenre}
              >
                <option value="">All Genres</option>
                {data.genres.map((genre) => (
                  <option key={genre.slug} value={genre.slug}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Ranking
              </span>
              <select
                className="w-full rounded-xl border border-primary/15 bg-white px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary dark:bg-primary/5"
                onChange={(event) => onKindChange(event.target.value)}
                value={selectedKind}
              >
                {data.tabs.map((tab) => (
                  <option key={tab.kind} value={tab.kind}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white/95 px-3 py-2.5 shadow-sm dark:bg-primary/5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Activity Window
            </p>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
              {data.ranking.activityWindowLabel} • {data.ranking.totalStories.toLocaleString()} ranked stories
            </p>
          </div>

          {data.stories.length ? (
            data.stories.map((story) => (
              <article
                className="rounded-2xl border border-primary/10 bg-white/95 p-3 shadow-sm dark:bg-primary/5"
                key={`${selectedKind}-${story.slug}`}
              >
                <div className="flex gap-2.5">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${getRankBadgeClass(
                      story.rank,
                    )}`}
                  >
                    {story.rank}
                  </div>
                  <PrefetchableStoryLink
                    className="block h-24 w-16 shrink-0 overflow-hidden rounded-xl border border-primary/10"
                    storySlug={story.slug}
                    to={buildStoryHref(story.slug)}
                  >
                    <img
                      alt={story.title}
                      className="h-full w-full object-cover"
                      src={story.coverImage}
                    />
                  </PrefetchableStoryLink>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
                          {story.genreLabel}
                        </p>
                        <PrefetchableStoryLink
                          className="mt-0.5 block text-sm font-black leading-tight line-clamp-1"
                          storySlug={story.slug}
                          to={buildStoryHref(story.slug)}
                        >
                          {story.title}
                        </PrefetchableStoryLink>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {story.authorName} • {story.statusLabel}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
                        {story.ranking.scoreLabel}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>{story.averageRating.toFixed(1)} star</span>
                      <span>{story.readsLabel} readers</span>
                      <span>{story.followerCountLabel} followers</span>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                  {story.ranking.signalLabel}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {story.ranking.activityLabel}
                </p>

                {story.firstChapterSlug ? (
                  <PrefetchableChapterLink
                    chapterSlug={story.firstChapterSlug}
                    className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-primary text-xs font-bold text-background-dark"
                    storySlug={story.slug}
                    to={buildChapterHref(story.slug, story.firstChapterSlug)}
                  >
                    <MaterialSymbol name="play_arrow" className="text-base" />
                    Read Now
                  </PrefetchableChapterLink>
                ) : (
                  <PrefetchableStoryLink
                    className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-primary text-xs font-bold text-background-dark"
                    storySlug={story.slug}
                    to={buildStoryHref(story.slug)}
                  >
                    <MaterialSymbol name="visibility" className="text-base" />
                    Open Story
                  </PrefetchableStoryLink>
                )}
              </article>
            ))
          ) : (
            <EmptyRankingsState browseHref={browseHref} />
          )}
        </main>

        <AppMobileTabBar topGenre={topGenre} />
      </div>
    </div>
  );
}

export default function StoryRankingsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const selectedGenre = useMemo(
    () => searchParams.get("genre")?.trim() || "",
    [searchParams],
  );
  const selectedKind = useMemo(() => {
    const rawKind = searchParams.get("kind")?.trim().toLowerCase();

    if (
      rawKind === "trending" ||
      rawKind === "popular" ||
      rawKind === "top-rated" ||
      rawKind === "rising"
    ) {
      return rawKind;
    }

    return DEFAULT_KIND;
  }, [searchParams]);

  const rankingsQuery = useStoryRankingsQuery({
    genre: selectedGenre || undefined,
    kind: selectedKind,
    limit: 50,
  });
  const data = rankingsQuery.data;
  const topGenre = data?.genres?.[0]?.slug ?? "fantasy";

  function updateFilters(nextValues) {
    const nextParams = new URLSearchParams(searchParams);

    if (typeof nextValues.genre === "string") {
      if (nextValues.genre) {
        nextParams.set("genre", nextValues.genre);
      } else {
        nextParams.delete("genre");
      }
    }

    if (typeof nextValues.kind === "string") {
      if (nextValues.kind && nextValues.kind !== DEFAULT_KIND) {
        nextParams.set("kind", nextValues.kind);
      } else {
        nextParams.delete("kind");
      }
    }

    setSearchParams(nextParams);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    navigate(buildSearchHref(searchTerm));
  }

  if (rankingsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <div className="hidden md:block">
          <div className="flex">
            <AppDesktopSidebar topGenre={topGenre} />
            <main className="flex-1 p-8">
              <LoadingState />
            </main>
          </div>
        </div>
        <div className="md:hidden">
          <LoadingState />
          <AppMobileTabBar topGenre={topGenre} />
        </div>
      </div>
    );
  }

  if (rankingsQuery.isError || !data) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Browse"
        ctaTo={buildBrowseHref(topGenre)}
        description={getRankingsErrorMessage(rankingsQuery.error)}
        secondaryLabel="Dashboard"
        secondaryTo="/dashboard"
        title="Rankings Unavailable"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopRankings
        data={data}
        onGenreChange={(genre) => updateFilters({ genre })}
        onKindChange={(kind) => updateFilters({ kind })}
        onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        selectedGenre={selectedGenre}
        selectedKind={selectedKind}
        setSearchTerm={setSearchTerm}
        topGenre={topGenre}
      />
      <MobileRankings
        data={data}
        onGenreChange={(genre) => updateFilters({ genre })}
        onKindChange={(kind) => updateFilters({ kind })}
        selectedGenre={selectedGenre}
        selectedKind={selectedKind}
        topGenre={topGenre}
      />
    </>
  );
}
