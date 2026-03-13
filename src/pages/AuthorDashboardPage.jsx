import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useStudioAnalyticsQuery } from "../creator/studioHooks";
import { useAuth } from "../context/AuthContext";
import { useCreator } from "../context/CreatorContext";
import { profileHref } from "../data/accountFlow";
import {
  creatorEarningsHref,
  creatorStoryCreateHref,
  getCreatorChapterEditorHref,
  getCreatorScheduledChaptersHref,
  getCreatorStoryManagementHref,
  getCreatorVolumeManagerHref,
} from "../data/creatorFlow";

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US", {
    compactDisplay: "short",
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value ?? 0);
}

function formatCurrency(cents) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format((cents ?? 0) / 100);
}

function formatRate(value) {
  return `${Number(value ?? 0).toFixed(1)}%`;
}

function getStoryAccentClasses(accent) {
  if (accent === "emerald") {
    return {
      badge: "bg-emerald-500/20 text-emerald-500",
      bar: "bg-emerald-500",
      text: "text-emerald-500",
    };
  }

  if (accent === "slate") {
    return {
      badge: "bg-slate-500/20 text-slate-500",
      bar: "bg-slate-500",
      text: "text-slate-400",
    };
  }

  return {
    badge: "bg-primary/20 text-primary",
    bar: "bg-primary",
    text: "text-primary",
  };
}

function getAuthorStats(stories) {
  const totalStories = stories.length;
  const totalChapters = stories.reduce(
    (count, story) => count + Number(story.stats.chapters || 0),
    0,
  );
  const scheduledCount = stories.reduce(
    (count, story) => count + story.scheduledChapters.length,
    0,
  );
  const publishedCount = stories.reduce(
    (count, story) => count + story.publishedChapters.length,
    0,
  );
  const liveStories = stories.filter(
    (story) => story.dashboardStatus === "Live",
  ).length;

  return [
    {
      delta: `${liveStories} live`,
      icon: "auto_stories",
      label: "Active Stories",
      progress: totalStories
        ? Math.max(18, Math.round((liveStories / totalStories) * 100))
        : 12,
      value: String(totalStories).padStart(2, "0"),
    },
    {
      delta: `${scheduledCount} queued`,
      icon: "edit_note",
      label: "Total Chapters",
      progress: totalChapters ? Math.min(100, totalChapters * 10) : 8,
      value: String(totalChapters).padStart(2, "0"),
    },
    {
      delta: `${publishedCount} live`,
      icon: "schedule",
      label: "Scheduled + Live",
      progress:
        scheduledCount + publishedCount
          ? Math.min(100, (scheduledCount + publishedCount) * 12)
          : 8,
      value: String(scheduledCount + publishedCount).padStart(2, "0"),
    },
  ];
}

function getAuthorQuickActions(stories) {
  const primaryStorySlug = stories[0]?.slug ?? null;

  return [
    {
      detail: primaryStorySlug
        ? "Open the editor and continue your manuscript."
        : "Start the first story in your workspace.",
      href: primaryStorySlug
        ? getCreatorChapterEditorHref(primaryStorySlug)
        : creatorStoryCreateHref,
      icon: "edit_note",
      title: primaryStorySlug ? "Draft Chapter" : "Create Story",
    },
    {
      detail: primaryStorySlug
        ? "Manage upcoming chapter drops."
        : "Build a story first to schedule releases.",
      href: primaryStorySlug
        ? getCreatorScheduledChaptersHref(primaryStorySlug)
        : creatorStoryCreateHref,
      icon: "schedule",
      title: "Release Queue",
    },
    {
      detail: "Review read velocity, retention, and gross revenue trends.",
      href: creatorEarningsHref,
      icon: "analytics",
      title: "Revenue View",
    },
    {
      detail: primaryStorySlug
        ? "Refine volumes and arcs."
        : "Structure tools unlock once you create a story.",
      href: primaryStorySlug
        ? getCreatorVolumeManagerHref(primaryStorySlug)
        : creatorStoryCreateHref,
      icon: "account_tree",
      title: "Volume Planner",
    },
  ];
}

function getAuthorRecentActivity(stories) {
  return stories
    .flatMap((story) => [
      ...story.publishedChapters.slice(0, 2).map((chapter) => ({
        detail: story.title,
        icon: "public",
        time: chapter.publishedAt,
        title: `${chapter.title} is live for readers.`,
      })),
      ...story.scheduledChapters.slice(0, 2).map((chapter) => ({
        detail: `${chapter.scheduledDate} • ${chapter.scheduledTime.replace(" (Local)", "")}`,
        icon: "schedule",
        time: "Scheduled",
        title: `${chapter.chapterTitle} is in the release queue.`,
      })),
      ...story.recentChapters
        .filter((chapter) => chapter.status === "Draft")
        .slice(0, 1)
        .map((chapter) => ({
          detail: story.title,
          icon: "edit_note",
          time: chapter.detail,
          title: `Draft updated: ${chapter.title}.`,
        })),
    ])
    .slice(0, 6);
}

function getAnalyticsMetricCards(analytics) {
  return [
    {
      detail: `${formatCompactNumber(analytics.overview.uniqueReaders)} distinct readers`,
      icon: "visibility",
      label: "Views",
      value: formatCompactNumber(analytics.overview.views),
    },
    {
      detail: `${analytics.overview.activeStories} active stories in the current filter`,
      icon: "groups",
      label: "Readers",
      value: formatCompactNumber(analytics.overview.uniqueReaders),
    },
    {
      detail: "Average chapter completion",
      icon: "favorite",
      label: "Retention",
      value: formatRate(analytics.overview.averageCompletionRate),
    },
    {
      detail: analytics.focusStory
        ? `Readers reaching the latest chapter in ${analytics.focusStory.title}`
        : "Readers reaching the latest available chapter",
      icon: "trending_up",
      label: "Read-through",
      value: formatRate(analytics.overview.readThroughRate),
    },
    {
      detail: "Gross revenue from unlocks and gifts",
      icon: "payments",
      label: "Revenue",
      value: formatCurrency(analytics.overview.grossRevenueCents),
    },
  ];
}

function getChartBarHeight(value, maxValue) {
  if (!value || maxValue <= 0) {
    return 0;
  }

  return Math.max(8, Math.round((value / maxValue) * 100));
}

function AnalyticsLoadingPanel() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          className="rounded-3xl border border-primary/10 bg-white/90 p-5 dark:bg-primary/5"
          key={index}
        >
          <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-primary/10" />
          <div className="mt-3 h-3 w-48 animate-pulse rounded-full bg-slate-200 dark:bg-primary/10" />
          <div className="mt-6 flex h-40 items-end gap-2">
            {Array.from({ length: 10 }).map((__, barIndex) => (
              <div
                className="h-full flex-1 animate-pulse rounded-t-2xl bg-slate-200/80 dark:bg-primary/10"
                key={barIndex}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsErrorPanel({ message }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
      {message}
    </div>
  );
}

function AnalyticsEmptyPanel({ onCreateStory }) {
  return (
    <div className="rounded-3xl border border-dashed border-primary/20 bg-white/90 px-6 py-10 text-center dark:bg-primary/5">
      <p className="text-lg font-bold">Analytics will appear after you publish chapters.</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-primary/60">
        StoryArc is ready to track daily views, retention, chapter drop-off, and revenue as soon as readers arrive.
      </p>
      <button
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-background-dark"
        onClick={onCreateStory}
        type="button"
      >
        <span className="material-symbols-outlined text-lg">add_circle</span>
        Create New Story
      </button>
    </div>
  );
}

function AnalyticsFilterBar({
  days,
  onDaysChange,
  onStoryChange,
  selectedStorySlug,
  storyOptions,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-primary/10 bg-white/90 px-4 py-4 dark:bg-primary/5">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <span>Story</span>
        <select
          className="rounded-full border border-primary/15 bg-background-light px-3 py-2 text-sm outline-none focus:border-primary dark:bg-background-dark"
          onChange={(event) => onStoryChange(event.target.value)}
          value={selectedStorySlug}
        >
          <option value="">All Stories</option>
          {storyOptions.map((story) => (
            <option key={story.slug} value={story.slug}>
              {story.title}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-2">
        {[7, 14, 30].map((option) => (
          <button
            className={`rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
              option === days
                ? "bg-primary text-background-dark"
                : "border border-primary/15 text-slate-500 hover:bg-primary/10 hover:text-primary dark:text-slate-300"
            }`}
            key={option}
            onClick={() => onDaysChange(option)}
            type="button"
          >
            {option}d
          </button>
        ))}
      </div>
    </div>
  );
}

function AnalyticsMetricGrid({ analytics }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {getAnalyticsMetricCards(analytics).map((metric) => (
        <Reveal
          className="rounded-3xl border border-primary/10 bg-white/90 p-5 dark:bg-primary/5"
          key={metric.label}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {metric.label}
              </p>
              <p className="mt-3 text-3xl font-black tracking-tight">{metric.value}</p>
            </div>
            <span className="material-symbols-outlined text-2xl text-primary">
              {metric.icon}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-primary/60">
            {metric.detail}
          </p>
        </Reveal>
      ))}
    </div>
  );
}

function DualSeriesChart({
  description,
  emptyCopy,
  primaryClassName,
  primaryKey,
  primaryLabel,
  secondaryClassName,
  secondaryKey,
  secondaryLabel,
  series,
  title,
  valueFormatter,
}) {
  const maxValue = Math.max(
    ...series.map((point) =>
      Math.max(point[primaryKey] ?? 0, point[secondaryKey] ?? 0),
    ),
    0,
  );
  const hasData = maxValue > 0;

  return (
    <Reveal className="rounded-3xl border border-primary/10 bg-white/90 p-5 dark:bg-primary/5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-primary/60">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500 dark:text-primary/60">
          <span className="inline-flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${primaryClassName}`} />
            {primaryLabel}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${secondaryClassName}`} />
            {secondaryLabel}
          </span>
        </div>
      </div>

      {hasData ? (
        <div className="custom-scrollbar mt-6 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-3">
            {series.map((point) => (
              <div className="flex w-10 flex-col items-center gap-2" key={point.label}>
                <div className="flex h-40 items-end gap-1.5">
                  <div className="flex h-full items-end">
                    <div
                      className={`w-3 rounded-t-2xl ${primaryClassName}`}
                      style={{
                        height: `${getChartBarHeight(point[primaryKey] ?? 0, maxValue)}%`,
                      }}
                      title={`${primaryLabel}: ${valueFormatter(point[primaryKey] ?? 0)}`}
                    />
                  </div>
                  <div className="flex h-full items-end">
                    <div
                      className={`w-3 rounded-t-2xl ${secondaryClassName}`}
                      style={{
                        height: `${getChartBarHeight(point[secondaryKey] ?? 0, maxValue)}%`,
                      }}
                      title={`${secondaryLabel}: ${valueFormatter(point[secondaryKey] ?? 0)}`}
                    />
                  </div>
                </div>
                <div className="text-center text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  {point.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-primary/20 px-4 py-8 text-center text-sm text-slate-500 dark:text-primary/60">
          {emptyCopy}
        </div>
      )}
    </Reveal>
  );
}

function ChapterDropOffPanel({ chapters, focusStory }) {
  return (
    <Reveal className="rounded-3xl border border-primary/10 bg-white/90 p-5 dark:bg-primary/5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-lg font-bold">Chapter Drop-off</h3>
          <p className="text-sm text-slate-500 dark:text-primary/60">
            {focusStory
              ? `Reach and completion rates across ${focusStory.title}.`
              : "Follow how readers move from the first chapter through the latest release."}
          </p>
        </div>
        {focusStory ? (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            {focusStory.title}
          </span>
        ) : null}
      </div>

      {chapters.length ? (
        <div className="mt-6 space-y-3">
          {chapters.map((chapter) => (
            <div
              className="rounded-2xl border border-primary/10 bg-background-light/80 p-4 dark:bg-background-dark/40"
              key={chapter.publishedChapterId}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                    Chapter {chapter.chapterNumber}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{chapter.title}</p>
                </div>
                <div className="text-sm text-slate-500 dark:text-primary/60">
                  {formatCompactNumber(chapter.views)} views
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    <span>Reach</span>
                    <span>{formatRate(chapter.reachRate)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(chapter.reachRate, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    <span>Completion</span>
                    <span>{formatRate(chapter.completionRate)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${Math.min(chapter.completionRate, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-xs font-semibold text-slate-500 dark:text-primary/60">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                      Readers
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">
                      {formatCompactNumber(chapter.uniqueReaders)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                      Finished
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">
                      {formatCompactNumber(chapter.completedReaders)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                      Avg. Progress
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">
                      {formatRate(chapter.averageProgressPercent)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-primary/20 px-4 py-8 text-center text-sm text-slate-500 dark:text-primary/60">
          Publish chapters and let readers start moving through the story to unlock drop-off data.
        </div>
      )}
    </Reveal>
  );
}

function StoryPerformancePanel({ stories }) {
  return (
    <Reveal className="rounded-3xl border border-primary/10 bg-white/90 p-5 dark:bg-primary/5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Story Performance</h3>
          <p className="text-sm text-slate-500 dark:text-primary/60">
            Compare read velocity, retention, and gross revenue across your catalog.
          </p>
        </div>
      </div>

      {stories.length ? (
        <div className="mt-6 space-y-3">
          {stories.map((story) => (
            <div
              className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-background-light/80 p-4 dark:bg-background-dark/40 md:flex-row md:items-center"
              key={story.slug}
            >
              <Link
                className="flex items-center gap-3 md:min-w-0 md:flex-1"
                to={getCreatorStoryManagementHref(story.slug)}
              >
                <img
                  alt={story.title}
                  className="h-20 w-14 shrink-0 rounded-xl object-cover"
                  src={story.coverImage}
                />
                <div className="min-w-0">
                  <p className="truncate text-base font-bold">{story.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-primary/60">
                    {story.chapterCount} chapters • {formatRate(story.readThroughRate)} read-through
                  </p>
                </div>
              </Link>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:text-right">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Views
                  </p>
                  <p className="mt-1 text-sm font-black">{formatCompactNumber(story.views)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Readers
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {formatCompactNumber(story.uniqueReaders)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Retention
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {formatRate(story.averageCompletionRate)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Revenue
                  </p>
                  <p className="mt-1 text-sm font-black">
                    {formatCurrency(story.grossRevenueCents)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-primary/20 px-4 py-8 text-center text-sm text-slate-500 dark:text-primary/60">
          Story-level performance cards will appear here after your stories start receiving traffic.
        </div>
      )}
    </Reveal>
  );
}

function AnalyticsSection({
  analytics,
  analyticsError,
  analyticsLoading,
  onDaysChange,
  onStoryChange,
  onCreateStory,
  selectedDays,
  selectedStorySlug,
}) {
  if (analyticsError) {
    return <AnalyticsErrorPanel message={analyticsError} />;
  }

  if (analyticsLoading) {
    return <AnalyticsLoadingPanel />;
  }

  if (!analytics) {
    return null;
  }

  if (!analytics.filters.storyOptions.length) {
    return <AnalyticsEmptyPanel onCreateStory={onCreateStory} />;
  }

  return (
    <div className="space-y-4">
      <AnalyticsFilterBar
        days={selectedDays}
        onDaysChange={onDaysChange}
        onStoryChange={onStoryChange}
        selectedStorySlug={selectedStorySlug}
        storyOptions={analytics.filters.storyOptions}
      />
      <AnalyticsMetricGrid analytics={analytics} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DualSeriesChart
          description="Daily chapter views compared with distinct readers in the selected window."
          emptyCopy="Reader traffic will appear here after your published chapters start getting opened."
          primaryClassName="bg-primary"
          primaryKey="views"
          primaryLabel="Views"
          secondaryClassName="bg-slate-400"
          secondaryKey="uniqueReaders"
          secondaryLabel="Readers"
          series={analytics.charts.dailyViews}
          title="Daily Views"
          valueFormatter={(value) => formatCompactNumber(value)}
        />
        <DualSeriesChart
          description="Unlock revenue and gifts grouped by day."
          emptyCopy="Revenue bars will appear when readers unlock premium chapters or send gifts."
          primaryClassName="bg-emerald-500"
          primaryKey="unlockRevenueCents"
          primaryLabel="Unlocks"
          secondaryClassName="bg-amber-400"
          secondaryKey="giftRevenueCents"
          secondaryLabel="Gifts"
          series={analytics.charts.revenue}
          title="Revenue Over Time"
          valueFormatter={(value) => formatCurrency(value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ChapterDropOffPanel
          chapters={analytics.chapterDropOff}
          focusStory={analytics.focusStory}
        />
        <StoryPerformancePanel stories={analytics.storyPerformance} />
      </div>
    </div>
  );
}

function DesktopAuthorDashboard({
  analytics,
  analyticsError,
  analyticsLoading,
  authorName,
  onCreateStory,
  onDaysChange,
  onStoryChange,
  quickActions,
  recentActivity,
  selectedDays,
  selectedStorySlug,
  stats,
  stories,
  welcomeMessage,
}) {
  const { user } = useAuth();

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light px-6 py-3 dark:bg-background-dark lg:px-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 text-primary">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <span className="material-symbols-outlined">auto_stories</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                StoryArc
              </h2>
            </div>
            <label className="hidden min-w-64 md:flex">
              <div className="flex h-10 w-full items-center rounded-lg bg-slate-200/50 px-4 dark:bg-primary/5">
                <span className="material-symbols-outlined text-[20px] text-slate-500 dark:text-primary/60">
                  analytics
                </span>
                <span className="ml-3 text-sm text-slate-500 dark:text-primary/60">
                  Creator analytics now update from live reader progress.
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                className="flex size-10 items-center justify-center rounded-lg bg-slate-200/50 transition-colors hover:bg-primary/20 dark:bg-primary/5"
                type="button"
              >
                <span className="material-symbols-outlined text-slate-700 dark:text-primary">
                  notifications
                </span>
              </button>
              <Link
                className="flex size-10 items-center justify-center rounded-lg bg-slate-200/50 transition-colors hover:bg-primary/20 dark:bg-primary/5"
                to="/account/notifications"
              >
                <span className="material-symbols-outlined text-slate-700 dark:text-primary">
                  settings
                </span>
              </Link>
            </div>
            <div className="mx-2 h-10 w-px bg-slate-300 dark:bg-primary/10" />
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold leading-none">{authorName}</p>
                <p className="text-xs text-slate-500 dark:text-primary/60">Pro Creator</p>
              </div>
              <Link className="size-10" to={profileHref}>
                <UserAvatar
                  className="size-10 rounded-full border-2 border-primary bg-primary/20"
                  fallbackClassName="text-sm"
                  name={authorName}
                  src={user?.avatarUrl}
                />
              </Link>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          <AppDesktopSidebar
            memberLabel="Pro Creator"
            memberName={authorName}
            mode="creator"
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
              <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <h1 className="text-3xl font-black tracking-tight">
                    Welcome back, {authorName.split(" ")[0]}
                  </h1>
                  <p className="text-slate-500 dark:text-primary/60">{welcomeMessage}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    className="flex items-center gap-2 rounded-2xl border border-primary/15 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-primary/5"
                    to={creatorEarningsHref}
                  >
                    <span className="material-symbols-outlined text-lg">payments</span>
                    Earnings
                  </Link>
                  <button
                    className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 font-bold text-background-dark transition-opacity hover:opacity-90"
                    onClick={onCreateStory}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    <span>Create New Story</span>
                  </button>
                </div>
              </div>

              <AnalyticsSection
                analytics={analytics}
                analyticsError={analyticsError}
                analyticsLoading={analyticsLoading}
                onCreateStory={onCreateStory}
                onDaysChange={onDaysChange}
                onStoryChange={onStoryChange}
                selectedDays={selectedDays}
                selectedStorySlug={selectedStorySlug}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                  <Reveal
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-100 p-6 dark:border-primary/10 dark:bg-primary/5"
                    key={stat.label}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-primary/60">
                        {stat.label}
                      </p>
                      <span className="material-symbols-outlined text-primary">
                        {stat.icon}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <span className="flex items-center text-sm font-bold text-emerald-500">
                        <span className="material-symbols-outlined text-sm">
                          trending_up
                        </span>
                        {stat.delta}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                <div className="space-y-4 xl:col-span-2">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-bold">My Stories</h2>
                    <Link
                      className="text-sm font-bold text-primary hover:underline"
                      to={
                        stories[0]
                          ? getCreatorStoryManagementHref(stories[0].slug)
                          : creatorStoryCreateHref
                      }
                    >
                      View All
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {stories.length ? (
                      stories.map((story) => {
                        const accent = getStoryAccentClasses(story.accent);

                        return (
                          <Reveal
                            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-100 p-5 dark:border-primary/10 dark:bg-primary/5"
                            key={story.slug}
                          >
                            <Link
                              className="flex size-20 shrink-0 overflow-hidden rounded-lg bg-primary/20"
                              to={getCreatorStoryManagementHref(story.slug)}
                            >
                              <img
                                alt={story.title}
                                className="h-full w-full object-cover"
                                src={story.image}
                              />
                            </Link>
                            <Link
                              className="min-w-0 flex-1"
                              to={getCreatorStoryManagementHref(story.slug)}
                            >
                              <div className="mb-1 flex items-start justify-between gap-4">
                                <h3 className="truncate text-lg font-bold">
                                  {story.title}
                                </h3>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accent.badge}`}
                                >
                                  {story.dashboardStatus}
                                </span>
                              </div>
                              <p className="mb-3 text-sm text-slate-500 dark:text-primary/60">
                                {story.chapterLabel}
                              </p>
                              <div className="flex items-center gap-4">
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                                  <div
                                    className={`h-full rounded-full ${accent.bar}`}
                                    style={{ width: `${story.progress}%` }}
                                  />
                                </div>
                                <span className={`text-xs font-bold ${accent.text}`}>
                                  {story.progress}%
                                </span>
                              </div>
                            </Link>
                          </Reveal>
                        );
                      })
                    ) : (
                      <Reveal className="rounded-xl border border-slate-200 bg-slate-100 p-6 dark:border-primary/10 dark:bg-primary/5">
                        <h3 className="text-lg font-bold">Your studio is ready</h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-primary/60">
                          Create your first story to unlock the editor, release queue, and published library.
                        </p>
                        <button
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-bold text-background-dark"
                          onClick={onCreateStory}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-lg">
                            add_circle
                          </span>
                          Create New Story
                        </button>
                      </Reveal>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="px-2 text-xl font-bold">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {quickActions.map((action) => (
                        <Link
                          className="group w-full rounded-xl border border-primary/10 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
                          key={action.title}
                          to={action.href}
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary transition-transform group-hover:scale-110">
                              {action.icon}
                            </span>
                            <div>
                              <p className="text-sm font-bold">{action.title}</p>
                              <p className="text-xs text-slate-500 dark:text-primary/60">
                                {action.detail}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="px-2 text-xl font-bold">Recent Activity</h2>
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-primary/10 dark:bg-primary/5">
                      <div className="divide-y divide-slate-200 dark:divide-primary/10">
                        {recentActivity.length ? (
                          recentActivity.map((item) => (
                            <div
                              className="flex items-start gap-3 p-4"
                              key={`${item.title}-${item.time}`}
                            >
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                <span className="material-symbols-outlined text-sm text-primary">
                                  {item.icon}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm">{item.title}</p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-primary/60">
                                  {item.detail}
                                </p>
                                <p className="mt-2 text-[10px] text-slate-400">
                                  {item.time}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-sm text-slate-500 dark:text-primary/60">
                            Activity will appear here as soon as you create chapters and publish them.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function MobileAuthorDashboard({
  analytics,
  analyticsError,
  analyticsLoading,
  authorName,
  onCreateStory,
  onDaysChange,
  onStoryChange,
  quickActions,
  recentActivity,
  selectedDays,
  selectedStorySlug,
  stats,
  stories,
}) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-[#0F0E0C] dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-200 bg-background-light px-4 py-3 dark:border-primary/10 dark:bg-[#0F0E0C]">
          <Link className="flex min-w-0 items-center gap-2.5" to={profileHref}>
            <div className="relative size-9 shrink-0 rounded-full border-2 border-primary p-0.5">
              <UserAvatar
                className="size-full rounded-full"
                fallbackClassName="text-xs"
                name={authorName}
                src={user?.avatarUrl}
              />
              <div className="absolute bottom-0 right-0 flex size-3 items-center justify-center rounded-full border-2 border-background-dark bg-primary">
                <span className="material-symbols-outlined text-[8px] font-bold text-background-dark">
                  check
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold leading-tight">{authorName}</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Pro Creator
              </span>
            </div>
          </Link>
          <div className="flex shrink-0 gap-1.5">
            <button
              className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-primary/10 dark:text-primary"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
            </button>
            <Link
              className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-primary/10 dark:text-primary"
              to="/account/notifications"
            >
              <span className="material-symbols-outlined text-lg">settings</span>
            </Link>
          </div>
        </header>

        <main className="custom-scrollbar flex-1 overflow-y-auto pb-24">
          <section className="px-4 pt-3">
            <div className="rounded-3xl border border-primary/10 bg-white/90 px-4 py-4 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    Live Analytics
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-tight">
                    Reader pulse
                  </h2>
                </div>
                <button
                  className="rounded-2xl bg-primary px-3 py-2 text-xs font-bold text-background-dark"
                  onClick={onCreateStory}
                  type="button"
                >
                  New Story
                </button>
              </div>
            </div>
          </section>

          <section className="px-4 py-3">
            {analyticsError ? (
              <AnalyticsErrorPanel message={analyticsError} />
            ) : analyticsLoading ? (
              <AnalyticsLoadingPanel />
            ) : analytics ? (
              <div className="space-y-3">
                <AnalyticsFilterBar
                  days={selectedDays}
                  onDaysChange={onDaysChange}
                  onStoryChange={onStoryChange}
                  selectedStorySlug={selectedStorySlug}
                  storyOptions={analytics.filters.storyOptions}
                />
                <div className="custom-scrollbar flex gap-3 overflow-x-auto pb-1">
                  {getAnalyticsMetricCards(analytics).map((metric) => (
                    <Reveal
                      className="w-44 shrink-0 rounded-3xl border border-primary/10 bg-white/90 p-4 dark:bg-white/5"
                      key={metric.label}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          {metric.label}
                        </p>
                        <span className="material-symbols-outlined text-lg text-primary">
                          {metric.icon}
                        </span>
                      </div>
                      <p className="mt-3 text-2xl font-black">{metric.value}</p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-primary/60">
                        {metric.detail}
                      </p>
                    </Reveal>
                  ))}
                </div>
                <DualSeriesChart
                  description="Views versus readers"
                  emptyCopy="Reader traffic will appear here after your chapters start getting opened."
                  primaryClassName="bg-primary"
                  primaryKey="views"
                  primaryLabel="Views"
                  secondaryClassName="bg-slate-400"
                  secondaryKey="uniqueReaders"
                  secondaryLabel="Readers"
                  series={analytics.charts.dailyViews}
                  title="Daily Views"
                  valueFormatter={(value) => formatCompactNumber(value)}
                />
                <DualSeriesChart
                  description="Unlocks and gifts"
                  emptyCopy="Revenue bars will appear after premium chapter unlocks or gifts."
                  primaryClassName="bg-emerald-500"
                  primaryKey="unlockRevenueCents"
                  primaryLabel="Unlocks"
                  secondaryClassName="bg-amber-400"
                  secondaryKey="giftRevenueCents"
                  secondaryLabel="Gifts"
                  series={analytics.charts.revenue}
                  title="Revenue Over Time"
                  valueFormatter={(value) => formatCurrency(value)}
                />
                <ChapterDropOffPanel
                  chapters={analytics.chapterDropOff}
                  focusStory={analytics.focusStory}
                />
                <StoryPerformancePanel stories={analytics.storyPerformance} />
              </div>
            ) : null}
          </section>

          <section className="grid grid-cols-3 gap-2 px-4 pt-1 pb-1">
            {stats.map((stat) => (
              <Reveal
                className="rounded-xl border border-transparent bg-slate-100 p-3 dark:border-white/10 dark:bg-white/5"
                key={stat.label}
              >
                <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500 dark:text-slate-400">
                  {stat.label.split(" ")[0]}
                </p>
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500">
                  <span className="material-symbols-outlined text-[10px]">trending_up</span>
                  {stat.delta}
                </p>
              </Reveal>
            ))}
          </section>

          <section className="px-4 py-1.5">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Quick Actions
            </h2>
            <div className="custom-scrollbar flex gap-2 overflow-x-auto pb-1">
              {quickActions.map((action, index) => (
                <Link
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${
                    index === 0
                      ? "bg-primary text-background-dark"
                      : "border border-white/10 bg-slate-100 text-slate-900 dark:bg-white/5 dark:text-white"
                  }`}
                  key={action.title}
                  to={action.href}
                >
                  <span className="material-symbols-outlined text-lg">
                    {action.icon}
                  </span>
                  {action.title}
                </Link>
              ))}
            </div>
          </section>

          <section className="px-4 py-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold">My Stories</h2>
              <Link
                className="text-xs font-semibold text-primary"
                to={
                  stories[0]
                    ? getCreatorStoryManagementHref(stories[0].slug)
                    : creatorStoryCreateHref
                }
              >
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {stories.length ? (
                stories.map((story) => {
                  const accent = getStoryAccentClasses(story.accent);

                  return (
                    <Reveal
                      className="flex gap-3 rounded-xl border border-transparent bg-slate-100 p-2.5 dark:border-white/10 dark:bg-white/5"
                      key={story.slug}
                    >
                      <Link
                        className="h-20 w-14 shrink-0 overflow-hidden rounded-lg shadow-lg shadow-black/40"
                        to={getCreatorStoryManagementHref(story.slug)}
                      >
                        <img
                          alt={story.title}
                          className="h-full w-full object-cover"
                          src={story.image}
                        />
                      </Link>
                      <Link
                        className="flex min-w-0 flex-1 flex-col justify-between py-0.5"
                        to={getCreatorStoryManagementHref(story.slug)}
                      >
                        <div>
                          <h3 className="mb-0.5 truncate text-sm font-bold leading-tight">
                            {story.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${accent.badge}`}
                            >
                              {story.dashboardStatus}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {story.chapterLabel.replace("Chapter ", "Ch. ")}
                            </span>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="mb-0.5 flex items-center justify-between">
                            <span className="text-[9px] text-slate-400">
                              Progress
                            </span>
                            <span className={`text-[9px] font-bold ${accent.text}`}>
                              {story.progress}%
                            </span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                            <div
                              className={`h-full ${accent.bar}`}
                              style={{ width: `${story.progress}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })
              ) : (
                <Reveal className="rounded-xl border border-transparent bg-slate-100 p-3 dark:border-white/10 dark:bg-white/5">
                  <h3 className="text-sm font-bold">No stories yet</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Create your first story to turn on the creator production flow.
                  </p>
                </Reveal>
              )}
            </div>
          </section>

          <section className="px-4 py-2 pb-4">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Recent Activity
            </h2>
            <div className="space-y-2">
              {recentActivity.length ? (
                recentActivity.map((item) => (
                  <Reveal className="flex gap-2.5" key={`${item.title}-${item.time}`}>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <span className="material-symbols-outlined text-sm">
                        {item.icon}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 border-b border-slate-200 pb-2.5 dark:border-white/5">
                      <p className="text-xs leading-relaxed">{item.title}</p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {item.detail}
                      </p>
                      <p className="mt-0.5 text-[9px] text-slate-500">
                        {item.time}
                      </p>
                    </div>
                  </Reveal>
                ))
              ) : (
                <Reveal className="text-xs text-slate-500">
                  Activity will appear here after you start drafting and publishing.
                </Reveal>
              )}
            </div>
          </section>
        </main>

        <AppMobileTabBar mode="creator" />
      </div>
    </div>
  );
}

export default function AuthorDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applicationDraft, enterWriterMode, stories } = useCreator();
  const [selectedDays, setSelectedDays] = useState(14);
  const [selectedStorySlug, setSelectedStorySlug] = useState("");

  useEffect(() => {
    enterWriterMode();
  }, [enterWriterMode]);

  const analyticsQuery = useStudioAnalyticsQuery({
    days: selectedDays,
    storySlug: selectedStorySlug || undefined,
  });
  const analytics = analyticsQuery.data ?? null;
  const authorName =
    applicationDraft.fullName || user?.displayName || "StoryArc Creator";
  const stats = getAuthorStats(stories);
  const quickActions = getAuthorQuickActions(stories);
  const recentActivity = getAuthorRecentActivity(stories);
  const totalPublishedChapters = stories.reduce(
    (count, story) => count + story.publishedChapters.length,
    0,
  );
  const totalScheduledChapters = stories.reduce(
    (count, story) => count + story.scheduledChapters.length,
    0,
  );
  const welcomeMessage =
    stories.length > 0
      ? `You currently have ${totalPublishedChapters} live chapters and ${totalScheduledChapters} in the queue.`
      : "Create your first story to unlock the full studio production loop.";
  const analyticsError = analyticsQuery.isError
    ? analyticsQuery.error?.message ||
      "Analytics could not be loaded right now."
    : null;

  useEffect(() => {
    if (!analytics?.filters?.storyOptions?.length) {
      return;
    }

    if (
      selectedStorySlug &&
      !analytics.filters.storyOptions.some((story) => story.slug === selectedStorySlug)
    ) {
      setSelectedStorySlug("");
    }
  }, [analytics, selectedStorySlug]);

  const handleCreateStory = () => {
    navigate(creatorStoryCreateHref);
  };

  return (
    <>
      <DesktopAuthorDashboard
        analytics={analytics}
        analyticsError={analyticsError}
        analyticsLoading={analyticsQuery.isLoading}
        authorName={authorName}
        onCreateStory={handleCreateStory}
        onDaysChange={setSelectedDays}
        onStoryChange={setSelectedStorySlug}
        quickActions={quickActions}
        recentActivity={recentActivity}
        selectedDays={selectedDays}
        selectedStorySlug={selectedStorySlug}
        stats={stats}
        stories={stories}
        welcomeMessage={welcomeMessage}
      />
      <MobileAuthorDashboard
        analytics={analytics}
        analyticsError={analyticsError}
        analyticsLoading={analyticsQuery.isLoading}
        authorName={authorName}
        onCreateStory={handleCreateStory}
        onDaysChange={setSelectedDays}
        onStoryChange={setSelectedStorySlug}
        quickActions={quickActions}
        recentActivity={recentActivity}
        selectedDays={selectedDays}
        selectedStorySlug={selectedStorySlug}
        stats={stats}
        stories={stories}
      />
    </>
  );
}
