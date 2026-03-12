import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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

function getStructureStats(story) {
  const totalVolumes = story.volumes.length;
  const totalArcs = story.volumes.reduce((count, volume) => count + volume.arcCount, 0);
  const totalChapters = story.volumes.reduce((count, volume) => count + volume.chapterCount, 0);
  const completion = story.stats.completion || `${story.progress}%`;

  return {
    totalVolumes,
    totalArcs,
    totalChapters,
    completion,
  };
}

function DesktopVolumeManager({
  onAddArc,
  onAddVolume,
  onSave,
  stats,
  story,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <AppDesktopSidebar mode="creator" storySlug={story.slug} />

        <main className="min-h-screen flex-1 bg-background-dark">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-dark/80 px-8 py-4 backdrop-blur-md">
            <div className="flex items-center gap-8">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-100">
                <span className="material-symbols-outlined text-primary">account_tree</span>
                Volume Manager
              </h2>
              <nav className="flex items-center gap-6">
                <button className="text-sm font-medium text-slate-400 transition-colors hover:text-primary" type="button">
                  Project Info
                </button>
                <button className="border-b-2 border-primary pb-4 text-sm font-medium text-primary" type="button">
                  Structure
                </button>
                <button className="text-sm font-medium text-slate-400 transition-colors hover:text-primary" type="button">
                  Timeline
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <label className="group relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary">
                  search
                </span>
                <input
                  className="w-64 rounded-lg border-none bg-[#2a271e] py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:ring-primary"
                  placeholder="Search arcs or chapters..."
                  type="text"
                />
              </label>
              <button
                className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-background-dark shadow-lg shadow-primary/10 transition-transform hover:scale-[1.02]"
                onClick={onSave}
                type="button"
              >
                Save Changes
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-6xl p-8">
            <div className="mb-8 mt-6 flex items-end justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                  <span>Projects</span>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <span>{story.title}</span>
                  <span className="material-symbols-outlined text-xs">chevron_right</span>
                  <span className="font-medium text-primary">Volume Manager</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-100">Narrative Architecture</h1>
                <p className="mt-2 text-slate-500">Drag-and-drop is not live yet, but the structure map is fully wired into the creator flow.</p>
              </div>

              <button
                className="flex items-center gap-2 rounded-lg border border-primary/20 bg-[#2a271e] px-4 py-2 text-sm font-bold text-primary transition-all hover:border-primary/50"
                onClick={onAddVolume}
                type="button"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                New Volume
              </button>
            </div>

            <div className="space-y-10">
              {story.volumes.map((volume, index) => (
                <section className={`relative ${index > 0 && volume.status === "Outline Only" ? "opacity-60 transition-opacity hover:opacity-100" : ""}`} key={volume.id}>
                  <div className="mb-4 flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold ${index === 0 ? "bg-primary text-background-dark" : "border border-primary/30 bg-[#2a271e] text-primary"}`}>
                        {volume.number}
                      </div>
                      <h2 className={`text-xl font-bold ${index === 0 ? "text-slate-100" : "text-slate-300"}`}>{volume.title}</h2>
                      <span className="rounded border border-slate-800 bg-[#2a271e] px-2 py-1 text-xs font-medium uppercase tracking-widest text-slate-500">
                        {volume.status}
                      </span>
                    </div>
                    <button className="p-2 text-slate-500 transition-colors hover:text-primary" type="button">
                      <span className="material-symbols-outlined">{index === 0 ? "more_vert" : "expand_more"}</span>
                    </button>
                  </div>

                  {volume.arcs.length ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {volume.arcs.map((arc) => (
                        <Reveal className="flex flex-col overflow-hidden rounded-xl border border-primary/10 bg-[#221e10] transition-all hover:border-primary/30" key={arc.id}>
                          <div className="flex items-center justify-between border-b border-primary/10 bg-primary/5 p-4">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-lg text-primary">drag_indicator</span>
                              <h3 className="text-sm font-bold text-slate-200">{arc.title}</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {arc.chapterCount} Chapters
                            </span>
                          </div>
                          <div className="flex-grow space-y-1 p-2">
                            {arc.chapters.length ? (
                              arc.chapters.map((chapter) => (
                                <div className="flex items-center justify-between rounded-lg border border-transparent bg-[#2a271e] p-3 transition-colors hover:border-primary/20" key={`${arc.id}-${chapter.number}`}>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-slate-600">{chapter.number}</span>
                                    <span className="text-sm text-slate-300">{chapter.title}</span>
                                  </div>
                                  <span className="material-symbols-outlined text-sm text-slate-700">reorder</span>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-lg border border-dashed border-primary/10 p-4 text-sm text-slate-500">
                                This arc is still outline-only.
                              </div>
                            )}
                          </div>
                          <Link
                            className="flex items-center justify-center gap-2 border-t border-primary/5 p-3 text-center text-xs text-slate-500 transition-all hover:bg-primary/5 hover:text-primary"
                            to={getCreatorChapterEditorHref(story.slug)}
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Chapter
                          </Link>
                        </Reveal>
                      ))}

                      <button
                        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/10 bg-primary/5 p-8 transition-all hover:border-primary/40"
                        onClick={() => onAddArc(volume.id)}
                        type="button"
                      >
                        <span className="material-symbols-outlined mb-2 text-3xl text-primary">add_circle</span>
                        <span className="text-sm font-bold text-slate-400 transition-colors hover:text-primary">Create New Arc</span>
                        <p className="mt-1 text-[10px] uppercase tracking-tighter text-slate-600">Volume {volume.number}</p>
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-primary/10 bg-[#2a271e]">
                      <p className="text-sm italic text-slate-600">Click to expand and begin structuring arcs for this volume.</p>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-4 gap-8 rounded-2xl border border-primary/10 bg-[#221e10] p-6">
              {[
                ["Total Volumes", String(stats.totalVolumes).padStart(2, "0"), "text-primary"],
                ["Total Arcs", String(stats.totalArcs), "text-slate-100"],
                ["Total Chapters", String(stats.totalChapters), "text-slate-100"],
                ["Est. Completion", stats.completion, "text-slate-100"],
              ].map(([label, value, valueClass]) => (
                <div className="flex flex-col gap-1" key={label}>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
                  <span className={`text-2xl font-black ${valueClass}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileVolumeManager({ onAddVolume, story }) {
  const stats = getStructureStats(story);

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light/80 px-4 py-4 backdrop-blur-md dark:bg-background-dark/80">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          <h1 className="text-xl font-bold tracking-tight">Manuscript Manager</h1>
        </div>
        <button className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20" type="button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-40">
        <div className="mb-6 mt-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Volumes & Arcs</h2>
          <button
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-transform active:scale-95"
            onClick={onAddVolume}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Volume
          </button>
        </div>

        <div className="space-y-4">
          {story.volumes.map((volume) => (
            <Reveal className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-primary/10 dark:bg-primary/5" key={volume.id}>
              <div className="flex items-center gap-3 p-4">
                <span className="material-symbols-outlined text-slate-400 dark:text-primary/40">drag_indicator</span>
                <div className="flex-1">
                  <h3 className="font-bold">{volume.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-primary/60">
                    {volume.arcCount} Arcs • {volume.chapterCount} Chapters
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 dark:text-primary/60">expand_more</span>
              </div>
              <div className="space-y-2 px-4 pb-4">
                {volume.arcs.map((arc) => (
                  <div className="ml-8 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-primary/5 dark:bg-background-dark/40" key={arc.id}>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs text-primary">circle</span>
                      <span className="text-sm font-medium">{arc.title}</span>
                    </div>
                    <span className="text-xs italic text-slate-500">{arc.chapterCount} Ch.</span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </main>

      <div className="fixed bottom-20 left-4 right-4 z-20 rounded-2xl border border-primary/20 bg-white p-4 shadow-2xl backdrop-blur-xl dark:bg-slate-900/90">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            ["Volumes", String(stats.totalVolumes)],
            ["Arcs", String(stats.totalArcs)],
            ["Chapters", String(stats.totalChapters)],
            ["Done", stats.completion],
          ].map(([label, value]) => (
            <div className="flex flex-col gap-1" key={label}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-primary/60">{label}</span>
              <span className="text-lg font-bold text-primary">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
          <div className="h-full rounded-full bg-primary" style={{ width: stats.completion }} />
        </div>
      </div>

      <AppMobileTabBar mode="creator" storySlug={story.slug} />
    </div>
  );
}

export default function VolumeManagerPage() {
  const { storySlug } = useParams();
  const {
    addStoryArc,
    addStoryVolume,
    enterWriterMode,
    getStory,
    isStudioLoading,
    saveVolumeStructure,
    setActiveStory,
  } = useCreator();

  const story = getStory(storySlug);
  const stats = story ? getStructureStats(story) : null;

  useEffect(() => {
    enterWriterMode();

    if (storySlug) {
      setActiveStory(storySlug);
    }
  }, [storySlug]);

  if (!story || !stats) {
    if (isStudioLoading) {
      return <RouteLoadingScreen />;
    }

    return (
      <ReaderStateScreen
        ctaLabel="Create A Story"
        ctaTo={creatorStoryCreateHref}
        description="The structure map is only available for studio stories that exist in your workspace."
        secondaryLabel="Back To Dashboard"
        secondaryTo={authorDashboardHref}
        title="Story Not Found"
        tone="error"
      />
    );
  }

  function handleAddVolume() {
    addStoryVolume(story.slug);
  }

  function handleAddArc(volumeId) {
    addStoryArc(story.slug, volumeId);
  }

  async function handleSave() {
    try {
      await saveVolumeStructure(story.slug);
    } catch {
      // Errors are surfaced through the creator notice system.
    }
  }

  return (
    <>
      <DesktopVolumeManager
        onAddArc={handleAddArc}
        onAddVolume={handleAddVolume}
        onSave={handleSave}
        stats={stats}
        story={story}
      />
      <MobileVolumeManager onAddVolume={handleAddVolume} story={story} />
    </>
  );
}
