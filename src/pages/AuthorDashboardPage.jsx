import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../context/AuthContext";
import { useCreator } from "../context/CreatorContext";
import {
  creatorStoryCreateHref,
  getCreatorChapterEditorHref,
  getCreatorScheduledChaptersHref,
  getCreatorStoryManagementHref,
  getCreatorVolumeManagerHref,
} from "../data/creatorFlow";

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
  const liveStories = stories.filter((story) => story.dashboardStatus === "Live").length;

  return [
    {
      delta: `${liveStories} live`,
      icon: "auto_stories",
      label: "Active Stories",
      progress: totalStories ? Math.max(18, Math.round((liveStories / totalStories) * 100)) : 12,
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
      progress: scheduledCount + publishedCount ? Math.min(100, (scheduledCount + publishedCount) * 12) : 8,
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

function DesktopAuthorDashboard({
  authorName,
  quickActions,
  recentActivity,
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
            <label className="hidden h-10 min-w-64 md:flex flex-col">
              <div className="flex h-full w-full items-stretch rounded-lg bg-slate-200/50 dark:bg-primary/5">
                <div className="flex items-center justify-center pl-4 text-slate-500 dark:text-primary/60">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="w-full border-none bg-transparent text-sm placeholder:text-slate-500 focus:ring-0 dark:placeholder:text-primary/40"
                  placeholder="Search stories, chapters, or readers..."
                  type="text"
                />
              </div>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="flex size-10 items-center justify-center rounded-lg bg-slate-200/50 transition-colors hover:bg-primary/20 dark:bg-primary/5" type="button">
                <span className="material-symbols-outlined text-slate-700 dark:text-primary">notifications</span>
              </button>
              <Link className="flex size-10 items-center justify-center rounded-lg bg-slate-200/50 transition-colors hover:bg-primary/20 dark:bg-primary/5" to="/account/notifications">
                <span className="material-symbols-outlined text-slate-700 dark:text-primary">settings</span>
              </Link>
            </div>
            <div className="mx-2 h-10 w-px bg-slate-300 dark:bg-primary/10" />
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold leading-none">{authorName}</p>
                <p className="text-xs text-slate-500 dark:text-primary/60">Pro Creator</p>
              </div>
              <Link className="size-10" to="/account/profile">
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
          <AppDesktopSidebar memberLabel="Pro Creator" memberName={authorName} mode="creator" />

          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h1 className="text-3xl font-black tracking-tight">Welcome back, {authorName.split(" ")[0]}</h1>
                  <p className="text-slate-500 dark:text-primary/60">
                    {welcomeMessage}
                  </p>
                </div>
                <Link className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-bold text-background-dark transition-opacity hover:opacity-90" to={creatorStoryCreateHref}>
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  <span>Create New Story</span>
                </Link>
              </div>

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
                      <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <span className="flex items-center text-sm font-bold text-emerald-500">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                        {stat.delta}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${stat.progress}%` }} />
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
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
                    {stories.length ? stories.map((story) => {
                      const accent = getStoryAccentClasses(story.accent);

                      return (
                        <Reveal
                          className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-100 p-5 dark:border-primary/10 dark:bg-primary/5"
                          key={story.title}
                        >
                          <Link className="flex size-20 shrink-0 overflow-hidden rounded-lg bg-primary/20" to={getCreatorStoryManagementHref(story.slug)}>
                            <img alt={story.title} className="h-full w-full object-cover" src={story.image} />
                          </Link>
                          <Link className="min-w-0 flex-1" to={getCreatorStoryManagementHref(story.slug)}>
                            <div className="mb-1 flex items-start justify-between gap-4">
                              <h3 className="truncate text-lg font-bold">{story.title}</h3>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accent.badge}`}>
                                {story.dashboardStatus}
                              </span>
                            </div>
                            <p className="mb-3 text-sm text-slate-500 dark:text-primary/60">
                              {story.chapterLabel}
                            </p>
                            <div className="flex items-center gap-4">
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                              <div className={`h-full rounded-full ${accent.bar}`} style={{ width: `${story.progress}%` }} />
                            </div>
                            <span className={`text-xs font-bold ${accent.text}`}>{story.progress}%</span>
                          </div>
                          </Link>
                        </Reveal>
                      );
                    }) : (
                      <Reveal className="rounded-xl border border-slate-200 bg-slate-100 p-6 dark:border-primary/10 dark:bg-primary/5">
                        <h3 className="text-lg font-bold">Your studio is ready</h3>
                        <p className="mt-2 text-sm text-slate-500 dark:text-primary/60">
                          Create your first story to unlock the editor, release queue, and published library.
                        </p>
                        <Link
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-bold text-background-dark"
                          to={creatorStoryCreateHref}
                        >
                          <span className="material-symbols-outlined text-lg">add_circle</span>
                          Create New Story
                        </Link>
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
                          to={action.href}
                          key={action.title}
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary transition-transform group-hover:scale-110">
                              {action.icon}
                            </span>
                            <div>
                              <p className="text-sm font-bold">{action.title}</p>
                              <p className="text-xs text-slate-500 dark:text-primary/60">{action.detail}</p>
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
                        {recentActivity.length ? recentActivity.map((item) => (
                          <div className="flex items-start gap-3 p-4" key={`${item.title}-${item.time}`}>
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                              <span className="material-symbols-outlined text-sm text-primary">{item.icon}</span>
                            </div>
                            <div>
                              <p className="text-sm">{item.title}</p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-primary/60">{item.detail}</p>
                              <p className="mt-2 text-[10px] text-slate-400">{item.time}</p>
                            </div>
                          </div>
                        )) : (
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
  authorName,
  quickActions,
  recentActivity,
  stats,
  stories,
}) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-[#0F0E0C] dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-200 bg-background-light px-4 py-3 dark:border-primary/10 dark:bg-[#0F0E0C]">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative size-9 shrink-0 rounded-full border-2 border-primary p-0.5">
              <UserAvatar
                className="size-full rounded-full"
                fallbackClassName="text-xs"
                name={authorName}
                src={user?.avatarUrl}
              />
              <div className="absolute bottom-0 right-0 flex size-3 items-center justify-center rounded-full border-2 border-background-dark bg-primary">
                <span className="material-symbols-outlined text-[8px] font-bold text-background-dark">check</span>
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold leading-tight">{authorName}</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Pro Creator
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <button className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-primary/10 dark:text-primary" type="button">
              <span className="material-symbols-outlined text-lg">notifications</span>
            </button>
            <Link className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-primary/10 dark:text-primary" to="/account/notifications">
              <span className="material-symbols-outlined text-lg">settings</span>
            </Link>
          </div>
        </header>

        <main className="custom-scrollbar flex-1 overflow-y-auto pb-24">
          <section className="grid grid-cols-3 gap-2 px-4 pt-3 pb-1">
            {stats.map((stat) => (
              <Reveal className="rounded-xl border border-transparent bg-slate-100 p-3 dark:border-white/10 dark:bg-white/5" key={stat.label}>
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
              <Link className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-background-dark" to={quickActions[0].href}>
                <span className="material-symbols-outlined text-lg">edit_note</span>
                {quickActions[0].title}
              </Link>
              {quickActions.slice(1).map((action) => (
                <Link className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 dark:bg-white/5 dark:text-white" key={action.title} to={action.href}>
                  <span className="material-symbols-outlined text-lg text-primary">{action.icon}</span>
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
              {stories.length ? stories.map((story) => {
                const accent = getStoryAccentClasses(story.accent);

                return (
                  <Reveal className="flex gap-3 rounded-xl border border-transparent bg-slate-100 p-2.5 dark:border-white/10 dark:bg-white/5" key={story.title}>
                    <Link className="h-20 w-14 shrink-0 overflow-hidden rounded-lg shadow-lg shadow-black/40" to={getCreatorStoryManagementHref(story.slug)}>
                      <img alt={story.title} className="h-full w-full object-cover" src={story.image} />
                    </Link>
                    <Link className="flex min-w-0 flex-1 flex-col justify-between py-0.5" to={getCreatorStoryManagementHref(story.slug)}>
                      <div>
                        <h3 className="mb-0.5 truncate text-sm font-bold leading-tight">{story.title}</h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${accent.badge}`}>
                            {story.dashboardStatus}
                          </span>
                          <span className="text-[10px] text-slate-500">{story.chapterLabel.replace("Chapter ", "Ch. ")}</span>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="mb-0.5 flex items-center justify-between">
                          <span className="text-[9px] text-slate-400">Progress</span>
                          <span className={`text-[9px] font-bold ${accent.text}`}>{story.progress}%</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                          <div className={`h-full ${accent.bar}`} style={{ width: `${story.progress}%` }} />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              }) : (
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
              {recentActivity.length ? recentActivity.map((item) => (
                <Reveal className="flex gap-2.5" key={`${item.title}-${item.time}`}>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1 border-b border-slate-200 pb-2.5 dark:border-white/5">
                    <p className="text-xs leading-relaxed">{item.title}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{item.detail}</p>
                    <p className="mt-0.5 text-[9px] text-slate-500">{item.time}</p>
                  </div>
                </Reveal>
              )) : (
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
  const { user } = useAuth();
  const {
    applicationDraft,
    enterWriterMode,
    stories,
  } = useCreator();

  useEffect(() => {
    enterWriterMode();
  }, []);

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

  return (
    <>
      <DesktopAuthorDashboard
        authorName={authorName}
        quickActions={quickActions}
        recentActivity={recentActivity}
        stats={stats}
        stories={stories}
        welcomeMessage={welcomeMessage}
      />
      <MobileAuthorDashboard
        authorName={authorName}
        quickActions={quickActions}
        recentActivity={recentActivity}
        stats={stats}
        stories={stories}
      />
    </>
  );
}
