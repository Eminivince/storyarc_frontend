import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useCreator } from "../context/CreatorContext";
import {
  authorDashboardHref,
  creatorStoryCreateHref,
  getCreatorChapterEditorHref,
  getCreatorPublishedChaptersHref,
  getCreatorScheduledChaptersHref,
  getCreatorStoryManagementHref,
  getCreatorVolumeManagerHref,
} from "../data/creatorFlow";

function getChapterEditHref(storySlug, chapterId) {
  return chapterId
    ? `${getCreatorChapterEditorHref(storySlug)}?chapterId=${chapterId}`
    : getCreatorChapterEditorHref(storySlug);
}

function DesktopScheduledChapters({ onReschedule, story }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex h-screen overflow-hidden">
        <AppDesktopSidebar mode="creator" storySlug={story.slug} />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b border-primary/10 bg-background-light px-8 dark:bg-background-dark/50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_stories</span>
              <h2 className="text-lg font-bold tracking-tight">Scheduled Releases</h2>
            </div>
            <div className="flex items-center gap-4">
              <label className="relative hidden lg:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">search</span>
                <input
                  className="h-10 w-64 rounded-lg border-none bg-slate-100 pl-10 pr-4 text-sm placeholder:text-slate-500 focus:ring-1 focus:ring-primary dark:bg-primary/5"
                  placeholder="Search chapters..."
                  type="text"
                />
              </label>
              <button className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:text-primary dark:bg-primary/5 dark:text-slate-400" type="button">
                <span className="material-symbols-outlined">notifications</span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-8 mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h1 className="mb-2 text-4xl font-black tracking-tight">Queue Management</h1>
                <p className="max-w-lg text-slate-500 dark:text-slate-400">
                  Monitor and reschedule your upcoming story releases. Your queue is currently active with{" "}
                  <span className="font-semibold text-primary">{story.scheduledChapters.length} chapters</span> pending.
                </p>
              </div>
              <Link
                className="flex h-11 items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-6 text-sm font-bold text-primary transition-all hover:bg-primary/20"
                to={getChapterEditHref(story.slug)}
              >
                <span className="material-symbols-outlined">calendar_month</span>
                Schedule New
              </Link>
            </div>

            <div className="mb-6 flex gap-8 border-b border-primary/10">
              <button className="flex items-center gap-2 border-b-2 border-primary pb-4 text-sm font-bold text-primary" type="button">
                All Queued
                <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px]">{String(story.scheduledChapters.length).padStart(2, "0")}</span>
              </button>
              <button className="border-b-2 border-transparent pb-4 text-sm font-medium text-slate-400 transition-colors hover:text-slate-200" type="button">
                Drafts
              </button>
              <Link className="border-b-2 border-transparent pb-4 text-sm font-medium text-slate-400 transition-colors hover:text-slate-200" to={getCreatorPublishedChaptersHref(story.slug)}>
                Recently Published
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-primary/10 bg-background-light shadow-2xl shadow-black/20 dark:bg-primary/5">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-primary/10 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:bg-background-dark/80 dark:text-slate-400">
                      <th className="px-6 py-4">Chapter Title</th>
                      <th className="px-6 py-4">Story Series</th>
                      <th className="px-6 py-4">Scheduled Date & Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {story.scheduledChapters.map((chapter) => (
                      <tr className="group transition-colors hover:bg-primary/5" key={chapter.id}>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold leading-tight transition-colors group-hover:text-primary">{chapter.chapterTitle}</span>
                            <span className="mt-0.5 text-[11px] text-slate-500">{chapter.wordCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-400">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-primary/60">auto_awesome</span>
                            {chapter.storySeries}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{chapter.scheduledDate}</span>
                            <span className="text-[11px] text-primary/70">{chapter.scheduledTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {chapter.status}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="rounded bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary transition-all hover:bg-primary hover:text-background-dark"
                              onClick={() => onReschedule(chapter)}
                              type="button"
                            >
                              Reschedule
                            </button>
                            <button className="flex size-8 items-center justify-center rounded text-slate-400 transition-colors hover:bg-white/5 hover:text-white" type="button">
                              <span className="material-symbols-outlined text-lg">more_vert</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileScheduledChapters({ onReschedule, story }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-background-light/80 px-2 py-1.5 backdrop-blur-md dark:border-primary/20 dark:bg-background-dark/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-primary/10" to={getCreatorStoryManagementHref(story.slug)}>
              <span className="material-symbols-outlined text-base text-slate-900 dark:text-slate-100">arrow_back</span>
            </Link>
            <h1 className="text-sm font-bold tracking-tight">Scheduled Chapters</h1>
          </div>
          <Link
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-background-dark transition-colors hover:bg-primary/90"
            to={getChapterEditHref(story.slug)}
          >
            <span className="material-symbols-outlined text-base">add</span>
            Schedule New
          </Link>
        </div>
      </header>

      <nav className="sticky top-[45px] z-10 flex border-b border-slate-200 bg-background-light dark:border-primary/10 dark:bg-background-dark">
        <button className="flex-1 border-b-2 border-primary py-2.5 text-center text-xs font-bold text-primary" type="button">
          All Queued
        </button>
        <button className="flex-1 border-b-2 border-transparent py-2.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400" type="button">
          Drafts
        </button>
        <Link className="flex-1 border-b-2 border-transparent py-2.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400" to={getCreatorPublishedChaptersHref(story.slug)}>
          Recently Published
        </Link>
      </nav>

      <main className="space-y-2 p-2 pb-20">
        {story.scheduledChapters.map((chapter) => (
          <Reveal className="flex gap-2 rounded-lg border border-slate-200 bg-white p-2 dark:border-primary/10 dark:bg-primary/5" key={chapter.id}>
            <div className="h-16 w-14 shrink-0 rounded-md bg-cover bg-center" style={{ backgroundImage: `url("${chapter.coverImage}")` }} />
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold leading-tight line-clamp-1">{chapter.chapterTitle}</h3>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Story: {chapter.storySeries}</p>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1 text-[10px] font-medium text-primary">
                  <span className="material-symbols-outlined shrink-0 text-xs">calendar_today</span>
                  <span className="truncate">{chapter.scheduledDate}, {chapter.scheduledTime.replace(" (Local)", "")}</span>
                </div>
                <button
                  className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-900 dark:bg-primary/20 dark:text-primary"
                  onClick={() => onReschedule(chapter)}
                  type="button"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </Reveal>
        ))}

        <div className="pt-4 pb-1">
          <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-primary/60">Publishing Tools</h2>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/20 to-transparent p-2.5 dark:from-primary/10">
              <div className="rounded-md bg-primary/20 p-1.5">
                <span className="material-symbols-outlined text-base text-primary">auto_awesome</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold">Smart Scheduling</h4>
                <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                  AI-driven slots based on reader activity.
                </p>
                <button className="mt-1 flex items-center gap-1 text-[10px] font-bold text-primary" type="button">
                  Optimize Queue <span className="material-symbols-outlined text-xs">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-primary/10 dark:bg-primary/5">
              <div className="rounded-md bg-slate-100 p-1.5 dark:bg-primary/10">
                <span className="material-symbols-outlined text-base text-slate-600 dark:text-primary">sync</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold">Cross-Platform Sync</h4>
                <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                  Push scheduled posts to audience channels.
                </p>
                <button className="mt-1 flex items-center gap-1 text-[10px] font-bold text-primary" type="button">
                  Manage Integrations <span className="material-symbols-outlined text-xs">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AppMobileTabBar mode="creator" storySlug={story.slug} />
    </div>
  );
}

export default function ScheduledChaptersPage() {
  const navigate = useNavigate();
  const { storySlug } = useParams();
  const {
    enterWriterMode,
    getStory,
    isStudioLoading,
    setActiveStory,
    showCreatorNotice,
  } = useCreator();

  const story = getStory(storySlug);

  useEffect(() => {
    enterWriterMode();

    if (storySlug) {
      setActiveStory(storySlug);
    }
  }, [storySlug]);

  function handleReschedule(chapter) {
    showCreatorNotice(`${chapter.chapterTitle} is ready to edit in the chapter studio.`);
    navigate(getChapterEditHref(story.slug, chapter.chapterId));
  }

  if (!story && isStudioLoading) {
    return <RouteLoadingScreen />;
  }

  if (!story) {
    return (
      <ReaderStateScreen
        ctaLabel="Create A Story"
        ctaTo={creatorStoryCreateHref}
        description="That story is not currently available in your studio scheduling queue."
        secondaryLabel="Back To Dashboard"
        secondaryTo={authorDashboardHref}
        title="Story Not Found"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopScheduledChapters onReschedule={handleReschedule} story={story} />
      <MobileScheduledChapters onReschedule={handleReschedule} story={story} />
    </>
  );
}
