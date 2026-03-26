import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../context/AuthContext";
import { useCreator } from "../context/CreatorContext";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  authorDashboardHref,
  creatorStoryCreateHref,
  getCreatorChapterEditorHref,
  getCreatorPublishedChaptersHref,
  getCreatorStoryManagementHref,
} from "../data/creatorFlow";

function getStatusBadgeClass(heroStatus) {
  if (heroStatus === "Pending Review") {
    return "bg-slate-700 text-slate-100";
  }

  return "bg-primary text-background-dark";
}

function StoryCover({ image, title }) {
  if (image) {
    return <img alt={title} className="size-full object-cover" src={image} />;
  }

  return (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/30 via-primary/10 to-transparent">
      <MaterialSymbol name="auto_stories" className="text-5xl text-primary/80" />
    </div>
  );
}

function DesktopStoryCard({ onOpenStory, story }) {
  const chapterCount = story.publishedChapters?.length ?? 0;
  const reads = story.stats?.reads ?? "0";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-primary/10 bg-slate-100 transition-all hover:border-primary/40 dark:border-accent-dark/30 dark:bg-surface-dark/40">
      <div className="relative h-64 overflow-hidden">
        <StoryCover image={story.image ?? story.coverImage} title={story.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-80" />
        <div className="absolute left-4 top-4">
          <span
            className={`rounded px-2 py-1 text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(
              story.heroStatus,
            )}`}
          >
            {story.heroStatus || "Ongoing Series"}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
              {story.title}
            </h3>
            <p className="text-sm font-medium text-primary/80">{story.genre || story.subtitle}</p>
          </div>
          <button className="text-slate-500 transition-colors hover:text-white" type="button">
            <MaterialSymbol name="more_vert" />
          </button>
        </div>
        <div className="my-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-primary/10 bg-primary/5 p-3 dark:border-accent-dark/30 dark:bg-accent-dark/20">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Chapters
            </p>
            <p className="text-lg font-bold">{chapterCount}</p>
          </div>
          <div className="rounded-lg border border-primary/10 bg-primary/5 p-3 dark:border-accent-dark/30 dark:bg-accent-dark/20">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Total Reads
            </p>
            <p className="text-lg font-bold">{reads}</p>
          </div>
        </div>
        <div className="mt-auto flex gap-3">
          <button
            className="flex-1 rounded-lg bg-primary/20 py-2.5 text-sm font-bold text-slate-100 transition-colors hover:bg-primary/30 dark:bg-accent-dark dark:hover:bg-accent-dark/80"
            onClick={() => onOpenStory(story.slug)}
            type="button"
          >
            Open Studio
          </button>
          <Link
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/40 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            to={getCreatorChapterEditorHref(story.slug)}
          >
            Add Chapter
          </Link>
        </div>
      </div>
    </article>
  );
}

function MobileStoryCard({ onOpenStory, story }) {
  const chapterCount = story.publishedChapters?.length ?? 0;
  const reads = story.stats?.reads ?? "0";
  const isPending = story.heroStatus === "Pending Review";

  return (
    <article className="overflow-hidden rounded-lg border border-white/5 bg-slate-900/40 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] dark:border-primary/10 dark:bg-surface-dark">
      <div className="flex gap-4 p-4">
        <div className="relative aspect-[3/4] w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800 shadow-lg">
          <StoryCover image={story.image ?? story.coverImage} title={story.title} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <MaterialSymbol name={isPending ? "menu_book" : "rocket_launch"} className="text-3xl text-primary/40" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between py-1">
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h3 className="line-clamp-2 text-lg font-bold leading-tight">{story.title}</h3>
              <MaterialSymbol name="more_vert" className="text-xl text-slate-500" />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span
                className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isPending
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                }`}
              >
                {story.heroStatus || "Ongoing Series"}
              </span>
              <span className="rounded border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {story.genre || "Fiction"}
              </span>
            </div>
          </div>
          {!isPending ? (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{chapterCount} Chapters</span>
              <span>{reads} Reads</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Last edited: 2 hours ago</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-white/5 bg-black/20">
        <button
          className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
          onClick={() => onOpenStory(story.slug)}
          type="button"
        >
          <MaterialSymbol name="edit" className="text-lg" />
          Open Studio
        </button>
        <Link
          className="flex items-center justify-center gap-2 border-l border-white/5 py-3.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5"
          to={getCreatorChapterEditorHref(story.slug)}
        >
          <MaterialSymbol name="add_circle" className="text-lg" />
          Add Chapter
        </Link>
      </div>
    </article>
  );
}

function DesktopCreatorStories({ memberName, onOpenStory, searchTerm, setSearchTerm, stories }) {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const filteredStories =
    activeTab === "all"
      ? stories
      : activeTab === "published"
        ? stories.filter((s) => (s.publishedChapters?.length ?? 0) > 0)
        : stories.filter((s) => (s.publishedChapters?.length ?? 0) === 0);

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex h-screen overflow-hidden">
        <AppDesktopSidebar mode="creator" />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-primary/10 px-8 dark:border-accent-dark/30">
            <div className="flex max-w-xl flex-1 items-center">
              <div className="relative w-full">
                <MaterialSymbol name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-lg border-none bg-slate-200 py-2 pl-10 pr-4 text-sm placeholder:text-slate-500 focus:ring-1 focus:ring-primary dark:bg-primary/5 dark:text-slate-100 dark:placeholder:text-primary/30"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your library..."
                  type="text"
                  value={searchTerm}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                className="rounded-lg p-2 text-slate-400 transition-colors hover:text-primary"
                to="/account/notifications"
              >
                <MaterialSymbol name="notifications" />
              </Link>
              <Link
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark shadow-lg shadow-primary/10 transition-all hover:bg-primary/90"
                to={creatorStoryCreateHref}
              >
                <MaterialSymbol name="add" className="text-[18px]" />
                Start a New Story
              </Link>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            <section className="flex-1 overflow-y-auto p-8">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Studio Library</h2>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Manage and grow your creative manuscripts.
                  </p>
                </div>
                <div className="flex gap-2 rounded-lg bg-primary/5 p-1 dark:bg-accent-dark/20">
                  <button
                    className={`rounded px-4 py-1.5 text-sm font-semibold transition-colors ${
                      activeTab === "all"
                        ? "bg-primary text-background-dark dark:bg-accent-dark dark:text-white"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All Stories
                  </button>
                  <button
                    className={`rounded px-4 py-1.5 text-sm font-semibold transition-colors ${
                      activeTab === "published"
                        ? "bg-primary text-background-dark dark:bg-accent-dark dark:text-white"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    onClick={() => setActiveTab("published")}
                  >
                    Published
                  </button>
                  <button
                    className={`rounded px-4 py-1.5 text-sm font-semibold transition-colors ${
                      activeTab === "drafts"
                        ? "bg-primary text-background-dark dark:bg-accent-dark dark:text-white"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    onClick={() => setActiveTab("drafts")}
                  >
                    Drafts
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                {filteredStories.map((story) => (
                  <DesktopStoryCard
                    key={story.slug}
                    onOpenStory={onOpenStory}
                    story={story}
                  />
                ))}
                <Link
                  className="group flex min-h-[400px] flex-col cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-primary/20 p-8 transition-all hover:border-primary/40 hover:bg-primary/5 dark:border-accent-dark/40 dark:hover:border-primary/40"
                  to={creatorStoryCreateHref}
                >
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20 dark:bg-accent-dark/30">
                    <MaterialSymbol name="add" className="text-4xl text-slate-500 transition-colors group-hover:text-primary" />
                  </div>
                  <p className="text-lg font-bold text-slate-400 transition-colors group-hover:text-slate-200">
                    Start a New Story
                  </p>
                  <p className="mt-2 max-w-[200px] text-center text-sm text-slate-600">
                    Create a new universe and share it with the world.
                  </p>
                </Link>
              </div>
            </section>

            <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-primary/10 p-8 dark:border-accent-dark/30 2xl:block">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                <MaterialSymbol name="analytics" className="text-primary" />
                Author Insights
              </h3>
              <div className="space-y-4">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      Weekly Growth
                    </span>
                    <span className="flex items-center text-xs text-green-500">
                      +12% <MaterialSymbol name="trending_up" className="text-[14px]" />
                    </span>
                  </div>
                  <p className="text-2xl font-bold">2,482</p>
                  <p className="mt-1 text-xs text-slate-500">New readers across all titles</p>
                </div>
                <div className="rounded-xl border border-primary/10 p-4 dark:border-accent-dark/30 dark:bg-accent-dark/20">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Active Milestone
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 overflow-hidden rounded-full bg-primary/10 dark:bg-accent-dark">
                      <div className="h-2 w-3/4 rounded-full bg-primary" />
                    </div>
                    <span className="text-xs font-bold">75%</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    15/20 chapters written this month
                  </p>
                </div>
              </div>
              <h3 className="mb-6 mt-10 flex items-center gap-2 text-lg font-bold">
                <MaterialSymbol name="history" className="text-primary" />
                Recent Activity
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-2 size-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(244,192,37,0.5)]" />
                  <div>
                    <p className="text-sm font-bold">New Comment</p>
                    <p className="text-xs text-slate-500">
                      &quot;This twist was incredible! Didn&apos;t see it coming.&quot;
                    </p>
                    <p className="mt-1 text-[10px] text-primary/60">2 mins ago • Final Boss</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-2 size-2 shrink-0 rounded-full bg-slate-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-300">Manuscript Approved</p>
                    <p className="text-xs text-slate-500">
                      Chapter 11 of &quot;The Homecoming&quot; passed review.
                    </p>
                    <p className="mt-1 text-[10px] text-slate-600">3 hours ago</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileCreatorStories({ memberName, onOpenStory, stories }) {
  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 md:hidden">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-background-dark/80 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-primary/10"
            to={authorDashboardHref}
          >
            <MaterialSymbol name="menu" className="text-slate-100" />
          </Link>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-primary">
            TaleStead
          </h2>
        </div>
        <Link
          className="flex size-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10"
          to="/account/profile"
        >
          <UserAvatar
            className="size-10 rounded-full"
            fallbackClassName="text-sm"
            name={memberName}
          />
        </Link>
      </header>

      <main className="flex-1 space-y-6 overflow-y-auto px-4 py-6 pb-32">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">My Stories</h1>
          <p className="text-sm font-medium tracking-wide text-slate-400">STUDIO LIBRARY</p>
        </div>

        <div className="space-y-4">
          {stories.map((story) => (
            <MobileStoryCard key={story.slug} onOpenStory={onOpenStory} story={story} />
          ))}
          <Link
            className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 py-6 font-bold text-primary transition-all hover:bg-primary/10"
            to={creatorStoryCreateHref}
          >
            <MaterialSymbol name="add_circle" />
            Start a New Story
          </Link>
        </div>
      </main>

      <AppMobileTabBar mode="creator" />
    </div>
  );
}

export default function CreatorStoriesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enterWriterMode, isStudioLoading, setActiveStory, stories } = useCreator();
  const [searchTerm, setSearchTerm] = useState("");
  const memberName = user?.displayName ?? "TaleStead Creator";

  useEffect(() => {
    enterWriterMode();
  }, [enterWriterMode]);

  function handleOpenStory(storySlug) {
    setActiveStory(storySlug);
    navigate(getCreatorStoryManagementHref(storySlug));
  }

  if (isStudioLoading) {
    return <RouteLoadingScreen />;
  }

  if (!stories.length) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <div className="hidden min-h-screen md:flex">
          <AppDesktopSidebar mode="creator" />
          <main className="flex flex-1 items-center justify-center px-8">
            <div className="max-w-xl rounded-3xl border border-primary/10 bg-slate-100 p-10 text-center dark:bg-[#2d281a]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary/70">
                Studio Library
              </p>
              <h1 className="mt-3 text-3xl font-bold">No stories yet</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Your Stories tab is ready. Create your first book, then come back here to choose
                which project you want to manage.
              </p>
              <Link
                className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/20"
                to={creatorStoryCreateHref}
              >
                Create Your First Story
              </Link>
            </div>
          </main>
        </div>

        <div className="flex min-h-screen flex-col px-4 py-6 pb-24 md:hidden">
          <header className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">TaleStead</h2>
            <Link
              className="flex size-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10"
              to="/account/profile"
            >
              <UserAvatar className="size-10" fallbackClassName="text-sm" name={memberName} />
            </Link>
          </header>
          <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-primary/10 bg-slate-900/40 p-6 text-center dark:border-primary/10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary/70">
              Studio Library
            </p>
            <h1 className="mt-3 text-2xl font-bold text-white">No stories yet</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Create your first book and it will appear here as a selectable studio project.
            </p>
            <Link
              className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-background-dark"
              to={creatorStoryCreateHref}
            >
              Create Story
            </Link>
          </div>
          <AppMobileTabBar mode="creator" />
        </div>
      </div>
    );
  }

  return (
    <>
      <DesktopCreatorStories
        memberName={memberName}
        onOpenStory={handleOpenStory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        stories={stories}
      />
      <MobileCreatorStories memberName={memberName} onOpenStory={handleOpenStory} stories={stories} />
    </>
  );
}
