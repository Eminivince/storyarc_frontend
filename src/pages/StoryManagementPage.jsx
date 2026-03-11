import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AccountNotice from "../components/AccountNotice";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../context/AuthContext";
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

function getQuickManagementCards(storySlug) {
  return [
    {
      title: "Add New Chapter",
      description: "Continue the saga and move directly into the editor.",
      icon: "add_notes",
      href: getCreatorChapterEditorHref(storySlug),
      tone: "primary",
    },
    {
      title: "Manage Library",
      description: "Review live chapters and clean up the published shelf.",
      icon: "edit_document",
      href: getCreatorPublishedChaptersHref(storySlug),
      tone: "subtle",
    },
    {
      title: "Volume Planner",
      description: "Rework the long-form structure, arcs, and pacing map.",
      icon: "account_tree",
      href: getCreatorVolumeManagerHref(storySlug),
      tone: "subtle",
    },
    {
      title: "Release Queue",
      description: "See upcoming chapter drops and keep cadence steady.",
      icon: "schedule",
      href: getCreatorScheduledChaptersHref(storySlug),
      tone: "subtle",
    },
  ];
}

function DesktopStoryManagement({ clearNotice, notice, onPreview, story }) {
  const { user } = useAuth();
  const cards = getQuickManagementCards(story.slug);

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex h-screen overflow-hidden">
        <AppDesktopSidebar mode="creator" storySlug={story.slug} />

        <main className="custom-scrollbar flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/5 bg-background-light/80 px-8 py-4 backdrop-blur-md dark:bg-background-dark/80">
            <div className="flex flex-1 items-center gap-4">
              <label className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-primary/40">
                  search
                </span>
                <input
                  className="w-full rounded-xl border-none bg-slate-200 py-2 pl-10 pr-4 text-sm placeholder:text-slate-500 focus:ring-1 focus:ring-primary dark:bg-primary/5 dark:placeholder:text-primary/30"
                  placeholder="Search stories, chapters, or fans..."
                  type="text"
                />
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-primary/10 dark:text-primary/60" type="button">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
              </button>
              <div className="mx-2 h-8 w-px bg-primary/10" />
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold">{user?.displayName ?? "StoryArc Creator"}</p>
                  <p className="text-[10px] font-semibold uppercase text-primary/70">Author</p>
                </div>
                <UserAvatar
                  alt="Creator avatar"
                  className="h-10 w-10 rounded-full border-2 border-primary/20 bg-primary/10 p-0.5"
                  fallbackClassName="text-sm"
                  name={user?.displayName ?? "StoryArc Creator"}
                  src={user?.avatarUrl}
                />
              </div>
            </div>
          </header>

          <div className="space-y-8 px-8 py-6">
            <AccountNotice notice={notice} onDismiss={clearNotice} />

            <section className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-slate-100 dark:bg-[#2d281a]">
              <div className="absolute inset-0 opacity-10 transition-opacity duration-700 group-hover:opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent" />
              </div>
              <div className="relative flex flex-col items-center gap-8 p-8 md:flex-row">
                <div className="h-64 w-48 shrink-0 overflow-hidden rounded-xl border-2 border-primary/20 shadow-2xl shadow-black/40">
                  <img alt={story.title} className="size-full object-cover" src={story.image} />
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                    <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                      {story.heroStatus}
                    </span>
                    <h2 className="text-4xl font-bold tracking-tight md:text-5xl">{story.title}</h2>
                    <p className="font-medium text-slate-500 dark:text-primary/70">{story.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6 md:justify-start">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl text-primary">visibility</span>
                      <span className="text-lg font-bold">
                        {story.stats.reads} <span className="text-sm font-medium text-slate-500 dark:text-primary/40">Reads</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl text-primary fill-1">grade</span>
                      <span className="text-lg font-bold">
                        {story.stats.stars} <span className="text-sm font-medium text-slate-500 dark:text-primary/40">Stars</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl text-primary">forum</span>
                      <span className="text-lg font-bold">
                        {story.stats.reviews} <span className="text-sm font-medium text-slate-500 dark:text-primary/40">Reviews</span>
                      </span>
                    </div>
                  </div>

                  <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{story.synopsis}</p>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
                    <Link
                      className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-bold text-background-dark shadow-lg shadow-primary/20"
                      to={getCreatorChapterEditorHref(story.slug)}
                    >
                      <span className="material-symbols-outlined">add_notes</span>
                      Add Chapter
                    </Link>
                    <button
                      className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-6 py-2.5 font-bold text-primary transition-colors hover:bg-primary/20"
                      onClick={onPreview}
                      type="button"
                    >
                      <span className="material-symbols-outlined">open_in_new</span>
                      View on Site
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold">Quick Management</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {cards.map((card, index) => (
                  <Reveal
                    className={`rounded-2xl border p-6 shadow-sm transition-all duration-300 ${
                      card.tone === "primary"
                        ? "border-primary/10 bg-primary text-background-dark"
                        : "border-primary/10 bg-slate-100 hover:bg-primary hover:text-background-dark dark:bg-primary/5"
                    }`}
                    delay={index * 0.05}
                    key={card.title}
                  >
                    <Link className="group block" to={card.href}>
                      <div className="flex items-start gap-4">
                        <div className={`rounded-xl p-4 ${card.tone === "primary" ? "bg-background-dark/15" : "bg-primary/20 group-hover:bg-background-dark/20"}`}>
                          <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">{card.title}</h4>
                          <p className={`mt-1 text-sm ${card.tone === "primary" ? "text-background-dark/80" : "text-slate-500 dark:text-primary/60 group-hover:text-background-dark/70"}`}>
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>

            <section className="pb-12">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">Recent Chapters</h3>
                  <span className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    {story.recentChapters.length} VISIBLE
                  </span>
                </div>
                <Link className="flex items-center gap-1 text-sm font-bold text-primary hover:underline" to={getCreatorPublishedChaptersHref(story.slug)}>
                  See All Chapters
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>

              <div className="overflow-hidden rounded-2xl border border-primary/10 bg-slate-100 dark:bg-[#2d281a]">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-primary/10 bg-primary/5">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-primary/40">Index</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-primary/40">Title</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-primary/40">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-primary/40">Views</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-primary/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {story.recentChapters.map((chapter) => (
                      <tr className="group transition-colors hover:bg-primary/5" key={chapter.id}>
                        <td className="px-6 py-4 font-mono text-sm dark:text-primary/60">{chapter.number}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold transition-colors group-hover:text-primary">{chapter.title}</p>
                            <p className="text-xs text-slate-500 dark:text-primary/40">{chapter.detail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                              chapter.status === "Published"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : chapter.status === "Scheduled"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-slate-500/10 text-slate-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                chapter.status === "Published"
                                  ? "bg-emerald-500"
                                  : chapter.status === "Scheduled"
                                    ? "bg-primary"
                                    : "bg-slate-500"
                              }`}
                            />
                            {chapter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold">{chapter.views}</td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-primary hover:text-background-dark"
                            to={getChapterEditHref(story.slug, chapter.chapterId)}
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileStoryManagement({ clearNotice, notice, onPreview, story }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light/80 p-4 backdrop-blur-md dark:bg-background-dark/80">
        <Link className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-primary/10" to={authorDashboardHref}>
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">arrow_back</span>
        </Link>
        <h1 className="text-lg font-bold tracking-tight">StoryArc</h1>
        <button className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-primary/10" type="button">
          <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">more_vert</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        <div className="flex flex-col items-center gap-6 p-6">
          <div className="relative aspect-[3/4] w-40 overflow-hidden rounded-xl bg-primary/20 shadow-2xl">
            <img alt={story.title} className="absolute inset-0 size-full object-cover" src={story.image} />
          </div>
          <div className="text-center">
            <h2 className="mb-1 text-3xl font-bold tracking-tight">{story.title}</h2>
            <p className="font-medium text-slate-600 dark:text-primary/70">Story Management Dashboard</p>
          </div>
          <div className="flex w-full max-w-md gap-3">
            <Link
              className="flex-1 rounded-lg border border-primary/20 bg-slate-200 px-4 py-3 text-center text-sm font-bold transition-all hover:bg-primary/20 dark:bg-primary/10"
              to={getCreatorChapterEditorHref(story.slug)}
            >
              Add New Chapter
            </Link>
            <Link
              className="flex-1 rounded-lg bg-primary px-4 py-3 text-center text-sm font-bold text-background-dark shadow-lg shadow-primary/20"
              to={getCreatorPublishedChaptersHref(story.slug)}
            >
              Manage Library
            </Link>
          </div>
          <div className="flex w-full max-w-md gap-3">
            <Link
              className="flex-1 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center text-xs font-bold text-primary"
              to={getCreatorVolumeManagerHref(story.slug)}
            >
              Volume Planner
            </Link>
            <Link
              className="flex-1 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-center text-xs font-bold text-primary"
              to={getCreatorScheduledChaptersHref(story.slug)}
            >
              Release Queue
            </Link>
          </div>
          <button
            className="rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-sm font-bold text-primary"
            onClick={onPreview}
            type="button"
          >
            View on Site
          </button>
        </div>

        <div className="px-4">
          <AccountNotice notice={notice} onDismiss={clearNotice} />
        </div>

        <section className="grid grid-cols-3 gap-3 px-4 py-4">
          {[
            ["Reads", story.stats.reads],
            ["Stars", story.stats.stars],
            ["Reviews", story.stats.reviews],
          ].map(([label, value]) => (
            <Reveal className="rounded-xl border border-primary/10 bg-slate-100 p-4 text-center dark:bg-primary/5" key={label}>
              <span className="block text-2xl font-bold">{value}</span>
              <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-primary/60">
                {label}
              </span>
            </Reveal>
          ))}
        </section>

        <section className="mt-8 px-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Chapters</h3>
            <Link className="text-sm font-semibold text-primary" to={getCreatorPublishedChaptersHref(story.slug)}>
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {story.recentChapters.map((chapter) => (
              <Reveal className="flex items-center gap-4 rounded-xl border border-transparent bg-slate-50 p-4 transition-colors dark:border-primary/5 dark:bg-primary/5" key={chapter.id}>
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/20 font-bold text-primary">{chapter.number}</div>
                <div className="flex-1">
                  <h4 className="font-bold leading-tight">{chapter.title}</h4>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        chapter.status === "Published"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : chapter.status === "Scheduled"
                            ? "bg-primary/20 text-primary"
                            : "bg-slate-200 text-slate-500 dark:bg-primary/20 dark:text-primary/60"
                      }`}
                    >
                      {chapter.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-primary/50">
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      {chapter.views}
                    </span>
                  </div>
                </div>
                <Link className="text-slate-400" to={getChapterEditHref(story.slug, chapter.chapterId)}>
                  <span className="material-symbols-outlined">edit</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <AppMobileTabBar mode="creator" storySlug={story.slug} />
    </div>
  );
}

export default function StoryManagementPage() {
  const navigate = useNavigate();
  const { storySlug } = useParams();
  const {
    clearCreatorNotice,
    creatorNotice,
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

  function handlePreview() {
    if (story.publishedChapters.length > 0) {
      navigate(`/stories/${story.slug}`);
      return;
    }

    showCreatorNotice(
      "Publish at least one chapter before opening the live reader preview.",
      "info",
    );
  }

  if (!story && isStudioLoading) {
    return <RouteLoadingScreen />;
  }

  if (!story) {
    return (
      <ReaderStateScreen
        ctaLabel="Create A Story"
        ctaTo={creatorStoryCreateHref}
        description="That project is not in your studio right now. Start a new one or head back to the creator dashboard."
        secondaryLabel="Back To Dashboard"
        secondaryTo={authorDashboardHref}
        title="Story Not Found"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopStoryManagement clearNotice={clearCreatorNotice} notice={creatorNotice} onPreview={handlePreview} story={story} />
      <MobileStoryManagement clearNotice={clearCreatorNotice} notice={creatorNotice} onPreview={handlePreview} story={story} />
    </>
  );
}
