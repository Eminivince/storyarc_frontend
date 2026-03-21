import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PrefetchableChapterLink,
  PrefetchableStoryLink,
} from "../components/PrefetchableLink";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { notificationsHref } from "../data/accountFlow";
import {
  buildChapterHref,
  buildDashboardShelfHref,
  buildSearchHref,
  buildStoryHref,
  followingHref,
} from "../data/readerFlow";
import { useCreator } from "../context/CreatorContext";
import { useMonetization } from "../context/MonetizationContext";
import { useOnboarding } from "../context/OnboardingContext";
import {
  useReaderDashboardPersonalizationQuery,
  useReaderDashboardQuery,
} from "../reader/readerHooks";
import {
  useActiveChallengesQuery,
  useActivityFeedQuery,
  useInterventionClickMutation,
  useInterventionConversionMutation,
  useReturningUserCheckQuery,
} from "../engagement/engagementHooks";
import ActivityFeedSection from "../components/ActivityFeedSection";
import WelcomeBackModal from "../components/WelcomeBackModal";

function LoadingState() {
  return <RouteLoadingScreen />;
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-center md:rounded-3xl md:p-8">
      <h2 className="text-lg font-bold md:text-2xl">
        Your library is ready for real stories
      </h2>
    </div>
  );
}

function getDashboardErrorMessage(error) {
  if (error?.status === 404) {
    return "The reader catalog is empty right now. Seed the backend stories and chapters, then reload this page.";
  }

  return error?.message || "We could not load your dashboard right now.";
}

function mergeDashboardData(dashboard, personalization) {
  if (!personalization) {
    return dashboard;
  }

  return {
    ...dashboard,
    availableGenres: personalization.availableGenres,
    personalizationPending: false,
    rows: dashboard.rows.map((row) =>
      row.id === "for-you" ? { ...personalization.forYouRow } : row,
    ),
  };
}

function StoryRow({ isForYouPersonalizationLoading, row }) {
  const isForYou = row.id === "for-you";
  const showForYouSkeleton =
    isForYou &&
    isForYouPersonalizationLoading &&
    !(row.stories && row.stories.length > 0);

  if (!showForYouSkeleton && !row?.stories?.length) {
    return null;
  }

  if (showForYouSkeleton) {
    return (
      <Reveal as="section" className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">{row.title}</h2>
          <Link
            className="shrink-0 text-xs font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:underline"
            to={buildDashboardShelfHref(row.id)}>
            See all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="flex flex-col gap-3" key={`for-you-skel-${index}`}>
              <div className="aspect-[3/4] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal as="section" className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{row.title}</h2>
        <Link
          className="shrink-0 text-xs font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:underline"
          to={buildDashboardShelfHref(row.id)}>
          See all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        {row.stories.map((story, index) => (
          <PrefetchableStoryLink
            key={story.slug}
            storySlug={story.slug}
            to={buildStoryHref(story.slug)}>
            <motion.article
              className="group flex h-full flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.04, duration: 0.28 }}
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
    </Reveal>
  );
}

function ActiveChallengesWidget({ challenges }) {
  if (!challenges?.length) return null;
  const top = challenges.slice(0, 3);

  return (
    <Reveal as="section" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold md:text-xl">Active Challenges</h2>
        <Link className="text-xs font-semibold text-primary hover:underline" to="/account/challenges">
          View all
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {top.map((c) => {
          const progress = Math.min(c.currentValue / c.targetValue, 1);
          return (
            <Link
              key={c.id}
              to="/account/challenges"
              className="rounded-xl border border-primary/10 bg-primary/5 p-3 transition-colors hover:bg-primary/10"
            >
              <p className="text-sm font-bold">{c.title}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-zinc-500">
                {c.currentValue}/{c.targetValue} · +{c.rewardPoints} pts
              </p>
            </Link>
          );
        })}
      </div>
    </Reveal>
  );
}

function DesktopDashboard({
  accountTier,
  activeChallenges,
  activityFeed,
  data,
  hasPremium,
  isActivityLoading,
  isForYouPersonalizationLoading,
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
                  className="w-full rounded-full border-none bg-slate-200/60 py-2.5 pl-11 pr-4 text-base transition-all focus:ring-2 focus:ring-primary/50 dark:bg-primary/5"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search for stories, tags, or authors..."
                  type="text"
                  value={searchTerm}
                />
              </form>
            </div>

            <div className="ml-4 flex items-center gap-4">
              <Link
                className="hidden rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/10 lg:inline-flex"
                to={followingHref}>
                Following
              </Link>
              {hasPremium && (
                <span className="hidden rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary lg:inline-flex">
                  {accountTier}
                </span>
              )}
              <Link
                className="relative flex size-10 items-center justify-center rounded-full text-slate-600 hover:bg-primary/10 dark:text-slate-300"
                to={notificationsHref}>
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
              </Link>
              <button
                className="hidden rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-background-dark sm:block"
                onClick={onWriteStory}
                type="button">
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
                          key={genre}>
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-4">
                      <PrefetchableChapterLink
                        chapterSlug={
                          data.featured.firstChapterSlug || "chapter-1"
                        }
                        className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-background-dark"
                        storySlug={data.featured.slug}
                        to={buildChapterHref(
                          data.featured.slug,
                          data.featured.firstChapterSlug || "chapter-1",
                        )}>
                        <span className="material-symbols-outlined">
                          play_arrow
                        </span>
                        Start Reading
                      </PrefetchableChapterLink>
                      <PrefetchableStoryLink
                        className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-sm"
                        storySlug={data.featured.slug}
                        to={buildStoryHref(data.featured.slug)}>
                        <span className="material-symbols-outlined">
                          auto_stories
                        </span>
                        View Story
                      </PrefetchableStoryLink>
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
                    <PrefetchableChapterLink
                      chapterSlug={entry.chapterSlug}
                      key={`${entry.storySlug}-${entry.chapterSlug}`}
                      storySlug={entry.storySlug}
                      to={buildChapterHref(entry.storySlug, entry.chapterSlug)}>
                      <motion.article
                        className="flex h-full gap-4 rounded-3xl border border-primary/10 bg-white p-4 shadow-sm transition-colors hover:bg-primary/5 dark:bg-primary/5"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ y: -4 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.2, once: true }}>
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
                    </PrefetchableChapterLink>
                  ))}
                </div>
              </Reveal>
            ) : null}

            <ActiveChallengesWidget challenges={activeChallenges} />

            {/* <ActivityFeedSection
              data={activityFeed}
              isLoading={isActivityLoading}
            /> */}

            {data?.rows?.length ? (
              data.rows.map((row) => (
                <StoryRow
                  isForYouPersonalizationLoading={isForYouPersonalizationLoading}
                  key={row.id}
                  row={row}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileShelfRow({ isForYouPersonalizationLoading, row }) {
  const isForYou = row.id === "for-you";
  const showForYouSkeleton =
    isForYou &&
    isForYouPersonalizationLoading &&
    !(row.stories && row.stories.length > 0);

  if (!showForYouSkeleton && !row.stories?.length) {
    return null;
  }

  if (showForYouSkeleton) {
    return (
      <Reveal as="section" className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold">{row.title}</h2>
          <Link
            className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary hover:underline"
            to={buildDashboardShelfHref(row.id)}>
            See all
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="block w-32 shrink-0 space-y-2" key={`m-for-you-skel-${index}`}>
              <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal as="section" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold">{row.title}</h2>
        <Link
          className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary hover:underline"
          to={buildDashboardShelfHref(row.id)}>
          See all
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {row.stories.map((story) => (
          <PrefetchableStoryLink
            className="block w-32 shrink-0"
            key={story.slug}
            storySlug={story.slug}
            to={buildStoryHref(story.slug)}>
            <article className="space-y-2">
              <img
                alt={story.title}
                className="aspect-[3/4] w-full rounded-xl object-cover"
                src={story.coverImage}
              />
              <div>
                <h3 className="line-clamp-1 text-xs font-bold">{story.title}</h3>
                <p className="line-clamp-1 text-[10px] text-slate-500 dark:text-slate-400">
                  {story.authorName}
                </p>
              </div>
            </article>
          </PrefetchableStoryLink>
        ))}
      </div>
    </Reveal>
  );
}

function MobileDashboard({
  activeChallenges,
  activityFeed,
  data,
  isActivityLoading,
  isForYouPersonalizationLoading,
  onSearchSubmit,
  searchTerm,
  setSearchTerm,
  topGenre,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <main className="space-y-5 px-4 pb-24 pt-4">
        <form className="group relative" onSubmit={onSearchSubmit}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary">
            search
          </span>
          <input
            className="h-10 w-full rounded-xl border-none bg-slate-100 pl-10 pr-4 text-base focus:ring-2 focus:ring-primary/50 dark:bg-primary/10"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={`Search ${topGenre || "Fantasy"} stories`}
            type="text"
            value={searchTerm}
          />
        </form>

        <Link
          className="flex items-center justify-between rounded-2xl border border-primary/10 bg-white px-4 py-3 dark:bg-primary/5"
          to={followingHref}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Following
            </p>
            <p className="text-sm font-semibold">
              Open your tracked release feed
            </p>
          </div>
          <span className="material-symbols-outlined text-slate-400">
            chevron_right
          </span>
        </Link>

        {data?.featured ? (
          <Reveal>
            <PrefetchableStoryLink
              className="block"
              storySlug={data.featured.slug}
              to={buildStoryHref(data.featured.slug)}>
              <article className="overflow-hidden rounded-xl border border-primary/10">
                <div className="relative min-h-[200px]">
                  <img
                    alt={data.featured.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={data.featured.bannerImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/70 to-transparent" />
                  <div className="relative flex min-h-[200px] flex-col justify-end p-4">
                    <span className="inline-flex w-fit rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-background-dark">
                      Featured
                    </span>
                    <h2 className="mt-2 line-clamp-2 text-xl font-black leading-tight text-white">
                      {data.featured.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-200">
                      {data.featured.shortSynopsis}
                    </p>
                  </div>
                </div>
              </article>
            </PrefetchableStoryLink>
          </Reveal>
        ) : null}

        {data?.continueReading?.length ? (
          <Reveal as="section" className="space-y-3">
            <h2 className="text-base font-bold">Continue reading</h2>
            <div className="flex flex-col gap-2">
              {data.continueReading.slice(0, 1).map((entry) => (
                <PrefetchableChapterLink
                  chapterSlug={entry.chapterSlug}
                  key={`${entry.storySlug}-${entry.chapterSlug}`}
                  storySlug={entry.storySlug}
                  to={buildChapterHref(entry.storySlug, entry.chapterSlug)}>
                  <article className="flex gap-2.5 rounded-xl border border-primary/10 bg-white p-2.5 dark:bg-primary/5">
                    <img
                      alt={entry.storyTitle}
                      className="h-20 w-16 shrink-0 rounded-lg object-cover"
                      src={entry.coverImage}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                        {entry.chapterLabel}
                      </p>
                      <h3 className="mt-1 line-clamp-1 text-sm font-bold">
                        {entry.storyTitle}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                        {entry.chapterTitle}
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${entry.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </article>
                </PrefetchableChapterLink>
              ))}
            </div>
          </Reveal>
        ) : null}

        <ActiveChallengesWidget challenges={activeChallenges} />

        {/* <ActivityFeedSection
          data={activityFeed}
          isLoading={isActivityLoading}
        /> */}

        {data?.rows?.map((row) => (
          <MobileShelfRow
            isForYouPersonalizationLoading={isForYouPersonalizationLoading}
            key={row.id}
            row={row}
          />
        ))}

        {!data?.rows?.some((row) => row.stories?.length) &&
        !isForYouPersonalizationLoading ? (
          <EmptyState />
        ) : null}
      </main>

      <AppMobileTabBar topGenre={topGenre} />
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { enterWriterMode, getCreatorEntryHref } = useCreator();
  const { accountTier, hasPremium } = useMonetization();
  const { selectedGenres } = useOnboarding();
  const dashboardQuery = useReaderDashboardQuery();
  const personalizationQuery = useReaderDashboardPersonalizationQuery({
    enabled: Boolean(
      dashboardQuery.data && !dashboardQuery.isError && dashboardQuery.data.rows?.length > 0,
    ),
  });

  const data = useMemo(() => {
    if (!dashboardQuery.data) {
      return undefined;
    }

    return mergeDashboardData(dashboardQuery.data, personalizationQuery.data);
  }, [dashboardQuery.data, personalizationQuery.data]);

  const isForYouPersonalizationLoading = Boolean(
    dashboardQuery.data &&
      !dashboardQuery.isError &&
      dashboardQuery.data.rows?.length > 0 &&
      personalizationQuery.isLoading,
  );

  const { error, isError, isLoading } = dashboardQuery;
  const challengesQuery = useActiveChallengesQuery();
  const activityFeedQuery = useActivityFeedQuery();
  const returningUserQuery = useReturningUserCheckQuery();
  const interventionClick = useInterventionClickMutation();
  const interventionConvert = useInterventionConversionMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  const returningData = returningUserQuery.data;

  useEffect(() => {
    if (returningData?.interventionId) {
      setShowWelcomeBack(true);
      interventionClick.mutate(returningData.interventionId);
    }
  }, [returningData?.interventionId]);
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
        secondaryLabel="About TaleStead"
        secondaryTo="/about"
        title="Dashboard Unavailable"
        tone="error"
      />
    );
  }

  return (
    <>
      <WelcomeBackModal
        data={returningData}
        onClose={() => setShowWelcomeBack(false)}
        onConvert={() => {
          if (returningData?.interventionId) {
            interventionConvert.mutate(returningData.interventionId);
          }
        }}
        open={showWelcomeBack}
      />
      <DesktopDashboard
        accountTier={accountTier}
        activeChallenges={challengesQuery.data}
        activityFeed={activityFeedQuery.data}
        data={data}
        hasPremium={hasPremium}
        isActivityLoading={activityFeedQuery.isLoading}
        isForYouPersonalizationLoading={isForYouPersonalizationLoading}
        onSearchSubmit={handleSearchSubmit}
        onWriteStory={handleWriteStory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        topGenre={topGenre}
      />
      <MobileDashboard
        activeChallenges={challengesQuery.data}
        activityFeed={activityFeedQuery.data}
        data={data}
        isActivityLoading={activityFeedQuery.isLoading}
        isForYouPersonalizationLoading={isForYouPersonalizationLoading}
        onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        topGenre={topGenre}
      />
    </>
  );
}
