import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import NotificationBellLink from "../components/NotificationBellLink";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useCreator } from "../context/CreatorContext";
import MaterialSymbol from "../components/MaterialSymbol";
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

function DesktopPublishedChapters({ onArchive, story }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex h-screen overflow-hidden">
        <AppDesktopSidebar mode="creator" storySlug={story.slug} />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-background-light/50 px-8 backdrop-blur-md dark:border-primary/10 dark:bg-background-dark/50">
            <div className="flex max-w-xl flex-1 items-center gap-4">
              <label className="relative w-full">
                <MaterialSymbol name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
                <input
                  className="w-full rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary dark:bg-primary/5"
                  placeholder="Search chapters, stories or tags..."
                  type="text"
                />
              </label>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBellLink
                badgeClassName="right-1 top-1"
                className="flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-primary/10"
                iconClassName="text-slate-600 dark:text-slate-400"
              />
              <Link
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark transition-opacity hover:opacity-90"
                to={getChapterEditHref(story.slug)}
              >
                <MaterialSymbol name="add" className="text-sm" />
                Create New Chapter
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-8 mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <nav className="mb-2 flex gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                  <span>My Stories</span>
                  <span>/</span>
                  <span className="text-slate-500">{story.title}</span>
                </nav>
                <h1 className="mb-2 text-4xl font-black tracking-tight">Published Chapters</h1>
                <p className="max-w-2xl text-slate-500 dark:text-slate-400">
                  Manage your active narrative arcs and monitor reader engagement across all published installments of your series.
                </p>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-primary/10">
                <button className="rounded-md bg-white px-4 py-1.5 text-sm font-bold text-slate-900 shadow-sm dark:bg-primary dark:text-background-dark" type="button">
                  All Chapters
                </button>
                <button className="rounded-md px-4 py-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-primary dark:text-slate-400" type="button">
                  Drafts
                </button>
                <button className="rounded-md px-4 py-1.5 text-sm font-bold text-slate-500 transition-colors hover:text-primary dark:text-slate-400" type="button">
                  Archived
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-primary/10 dark:bg-primary/5">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-primary/10 dark:bg-primary/10">
                      {["Chapter Title", "Status", "Reads", "Likes", "Comments", "Actions"].map((label, index) => (
                        <th
                          className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-primary/70 ${index >= 2 && index <= 4 ? "text-center" : ""} ${index === 5 ? "text-right" : ""}`}
                          key={label}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-primary/10">
                    {story.publishedChapters.map((chapter) => (
                      <tr className="group transition-colors hover:bg-slate-50 dark:hover:bg-primary/5" key={chapter.id}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-primary/20 dark:bg-primary/20">
                              <img alt={chapter.title} className="size-full object-cover" src={chapter.coverImage} />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{chapter.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{chapter.publishedAt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {chapter.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center font-medium">{chapter.reads}</td>
                        <td className="px-6 py-5 text-center font-medium">{chapter.likes}</td>
                        <td className="px-6 py-5 text-center font-medium">{chapter.comments}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              className="p-2 text-slate-400 transition-colors hover:text-primary"
                              to={getChapterEditHref(story.slug, chapter.chapterId)}
                            >
                              <MaterialSymbol name="edit_note" className="text-xl" />
                            </Link>
                            <button className="p-2 text-slate-400 transition-colors hover:text-red-400" onClick={() => onArchive(chapter.title)} type="button">
                              <MaterialSymbol name="archive" className="text-xl" />
                            </button>
                            <button className="p-2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-100" type="button">
                              <MaterialSymbol name="more_vert" className="text-xl" />
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

function MobilePublishedChapters({ onArchive, story }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 border-b border-primary/10 bg-background-light px-4 py-3 dark:bg-background-dark">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <Link className="flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/10" to={getCreatorStoryManagementHref(story.slug)}>
              <MaterialSymbol name="arrow_back" className="text-xl text-slate-900 dark:text-slate-100" />
            </Link>
            <h2 className="truncate text-base font-bold tracking-tight">Published Chapters</h2>
          </div>
          <button className="flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-primary/10" type="button">
            <MaterialSymbol name="more_vert" className="text-lg text-primary" />
          </button>
        </div>
        <div className="mt-3">
          <label className="relative flex w-full items-center">
            <MaterialSymbol name="search" className="absolute left-2.5 text-base text-slate-400 dark:text-slate-500" />
            <input
              className="h-9 w-full rounded-lg border-none bg-slate-200 pl-9 pr-3 text-sm placeholder:text-slate-500 focus:ring-2 focus:ring-primary dark:bg-primary/10 dark:text-slate-100"
              placeholder="Search chapters..."
              type="text"
            />
          </label>
        </div>
        <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto">
          <button className="whitespace-nowrap border-b-2 border-primary pb-2 pt-1.5 text-xs font-bold text-primary" type="button">
            All Chapters
          </button>
          <button className="whitespace-nowrap border-b-2 border-transparent pb-2 pt-1.5 text-xs font-bold text-slate-500" type="button">
            Drafts
          </button>
          <button className="whitespace-nowrap border-b-2 border-transparent pb-2 pt-1.5 text-xs font-bold text-slate-500" type="button">
            Archived
          </button>
        </div>
      </header>

      <main className="space-y-2 px-4 py-3 pb-28">
        <div className="mb-1.5 flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Published ({story.publishedChapters.length})</h3>
          <MaterialSymbol name="filter_list" className="text-base text-slate-500" />
        </div>

        {story.publishedChapters.map((chapter) => (
          <Reveal className="flex flex-col gap-2 rounded-xl border border-primary/10 bg-white p-3 shadow-sm dark:bg-primary/5" key={chapter.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="truncate text-sm font-bold">{chapter.title}</h4>
                <span className="inline-flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <span className="mr-1 size-1 rounded-full bg-emerald-500" />
                  {chapter.status}
                </span>
              </div>
              <div className="flex shrink-0 gap-0.5">
                <Link
                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-primary/10"
                  to={getChapterEditHref(story.slug, chapter.chapterId)}
                >
                  <MaterialSymbol name="edit" className="text-base" />
                </Link>
                <button className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-primary/10" onClick={() => onArchive(chapter.title)} type="button">
                  <MaterialSymbol name="archive" className="text-base" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
              <div className="flex items-center gap-0.5">
                <MaterialSymbol name="visibility" className="text-sm" />
                <span>{chapter.reads}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <MaterialSymbol name="favorite" className="text-sm" />
                <span>{chapter.likes}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <MaterialSymbol name="chat_bubble" className="text-sm" />
                <span>{chapter.comments}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </main>

      <AppMobileTabBar mode="creator" storySlug={story.slug} />
    </div>
  );
}

export default function PublishedChaptersPage() {
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

  function handleArchive(chapterTitle) {
    showCreatorNotice(`${chapterTitle} was archived from the live shelf.`);
    navigate(getCreatorStoryManagementHref(story.slug));
  }

  if (!story && isStudioLoading) {
    return <RouteLoadingScreen />;
  }

  if (!story) {
    return (
      <ReaderStateScreen
        ctaLabel="Create A Story"
        ctaTo={creatorStoryCreateHref}
        description="That story is not currently available in your published library."
        secondaryLabel="Back To Dashboard"
        secondaryTo={authorDashboardHref}
        title="Story Not Found"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopPublishedChapters onArchive={handleArchive} story={story} />
      <MobilePublishedChapters onArchive={handleArchive} story={story} />
    </>
  );
}
