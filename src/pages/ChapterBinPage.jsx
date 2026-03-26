import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useCreator } from "../context/CreatorContext";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  creatorStoriesHref,
  creatorStoryCreateHref,
  getCreatorChapterEditorHref,
  getCreatorStoryManagementHref,
} from "../data/creatorFlow";

function getChapterEditHref(storySlug, chapterId) {
  return chapterId
    ? `${getCreatorChapterEditorHref(storySlug)}?chapterId=${chapterId}`
    : getCreatorChapterEditorHref(storySlug);
}

function formatBinnedAt(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function DesktopChapterBin({ onRestore, restoringId, story }) {
  const binned = story.binnedChapters ?? [];

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex h-screen overflow-hidden">
        <AppDesktopSidebar mode="creator" storySlug={story.slug} />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-primary/10 bg-background-light px-8 dark:bg-background-dark/50">
            <div className="flex items-center gap-2">
              <MaterialSymbol name="delete_sweep" className="text-primary" />
              <h2 className="text-lg font-bold tracking-tight">Chapter bin</h2>
            </div>
            <Link
              className="text-sm font-semibold text-primary transition-colors hover:underline"
              to={getCreatorStoryManagementHref(story.slug)}
            >
              Back to story
            </Link>
          </header>

          <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
            <div className="mb-8 mt-4 max-w-3xl">
              <h1 className="text-3xl font-black tracking-tight">Parked chapters</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Chapters here stay out of your main studio lists and structure map. Restore a chapter when you want to work on it or publish again.
              </p>
            </div>

            {binned.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-primary/20 bg-slate-50 p-12 text-center dark:bg-primary/5">
                <MaterialSymbol name="inventory_2" className="mb-3 text-4xl text-primary/40" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Your bin is empty.</p>
                <p className="mt-1 text-xs text-slate-500">Move drafts here from the chapter editor to keep your workspace tidy.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm dark:bg-primary/5">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-primary/10 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:bg-background-dark/80 dark:text-slate-400">
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Binned</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {binned.map((chapter) => (
                      <tr className="transition-colors hover:bg-primary/5" key={chapter.id}>
                        <td className="px-6 py-4 font-mono text-sm text-slate-500 dark:text-primary/60">{chapter.number}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold">{chapter.title}</p>
                          <p className="text-xs text-slate-500 dark:text-primary/50">{chapter.detail}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-primary/20 dark:text-primary/80">
                            {chapter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{formatBinnedAt(chapter.binnedAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              className="rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                              to={getChapterEditHref(story.slug, chapter.chapterId)}
                            >
                              Open
                            </Link>
                            <button
                              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-background-dark transition-opacity hover:opacity-90 disabled:opacity-50"
                              disabled={restoringId === chapter.chapterId}
                              onClick={() => onRestore(chapter.chapterId)}
                              type="button"
                            >
                              {restoringId === chapter.chapterId ? "Restoring…" : "Restore"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileChapterBin({ onRestore, restoringId, story }) {
  const binned = story.binnedChapters ?? [];

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 border-b border-primary/10 bg-background-light px-4 py-3 dark:bg-background-dark">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Link className="flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/10" to={getCreatorStoryManagementHref(story.slug)}>
              <MaterialSymbol name="arrow_back" className="text-xl" />
            </Link>
            <h1 className="truncate text-base font-bold">Chapter bin</h1>
          </div>
        </div>
      </header>

      <main className="space-y-3 px-4 py-4 pb-28">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Restore a chapter to return it to your main studio lists and structure.
        </p>

        {binned.length === 0 ? (
          <Reveal className="rounded-xl border border-dashed border-primary/20 bg-slate-50 p-8 text-center dark:bg-primary/5">
            <p className="text-sm font-medium">Bin is empty</p>
          </Reveal>
        ) : (
          binned.map((chapter) => (
            <Reveal className="rounded-xl border border-primary/10 bg-white p-4 dark:bg-primary/5" key={chapter.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">{chapter.number}</span>
                    <h4 className="truncate text-sm font-bold">{chapter.title}</h4>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">{formatBinnedAt(chapter.binnedAt)}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  className="flex-1 rounded-lg border border-primary/20 py-2 text-center text-xs font-bold text-primary"
                  to={getChapterEditHref(story.slug, chapter.chapterId)}
                >
                  Open
                </Link>
                <button
                  className="flex-1 rounded-lg bg-primary py-2 text-xs font-bold text-background-dark disabled:opacity-50"
                  disabled={restoringId === chapter.chapterId}
                  onClick={() => onRestore(chapter.chapterId)}
                  type="button"
                >
                  {restoringId === chapter.chapterId ? "…" : "Restore"}
                </button>
              </div>
            </Reveal>
          ))
        )}
      </main>

      <AppMobileTabBar mode="creator" storySlug={story.slug} />
    </div>
  );
}

export default function ChapterBinPage() {
  const { storySlug } = useParams();
  const {
    enterWriterMode,
    getStory,
    isStudioLoading,
    restoreChapterFromStudioBin,
    setActiveStory,
  } = useCreator();
  const [restoringId, setRestoringId] = useState(null);

  const story = getStory(storySlug);

  useEffect(() => {
    enterWriterMode();
    if (storySlug) {
      setActiveStory(storySlug);
    }
  }, [storySlug]);

  async function handleRestore(chapterId) {
    setRestoringId(chapterId);
    try {
      await restoreChapterFromStudioBin(storySlug, chapterId);
    } finally {
      setRestoringId(null);
    }
  }

  if (!story && isStudioLoading) {
    return <RouteLoadingScreen />;
  }

  if (!story) {
    return (
      <ReaderStateScreen
        ctaLabel="Create A Story"
        ctaTo={creatorStoryCreateHref}
        description="That project is not in your studio right now."
        secondaryLabel="Back To Stories"
        secondaryTo={creatorStoriesHref}
        title="Story Not Found"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopChapterBin onRestore={handleRestore} restoringId={restoringId} story={story} />
      <MobileChapterBin onRestore={handleRestore} restoringId={restoringId} story={story} />
    </>
  );
}
