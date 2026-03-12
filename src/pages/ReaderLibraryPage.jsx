import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import SkeletonBlock from "../components/SkeletonBlock";
import { useAccount } from "../context/AccountContext";
import {
  buildChapterHref,
  buildSearchHref,
  buildStoryHref,
} from "../data/readerFlow";

function SectionEmptyState({ body, ctaHref, ctaLabel, title }) {
  return (
    <div className="rounded-3xl border border-primary/10 bg-primary/5 p-6 text-center">
      <span className="material-symbols-outlined text-3xl text-primary">
        auto_stories
      </span>
      <h3 className="mt-3 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{body}</p>
      {ctaHref && ctaLabel ? (
        <Link
          className="mt-5 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-background-dark"
          to={ctaHref}
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

function LibraryShelfSkeleton({ mobile = false }) {
  if (mobile) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="flex gap-3 rounded-3xl border border-primary/10 bg-white p-3 dark:bg-primary/5"
            key={index}
          >
            <SkeletonBlock className="h-28 w-24 flex-shrink-0 rounded-2xl" />
            <div className="flex flex-1 flex-col justify-center gap-3">
              <SkeletonBlock className="h-5 w-3/4" />
              <SkeletonBlock className="h-4 w-1/2" />
              <SkeletonBlock className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
          <SkeletonBlock className="aspect-[3/4] w-full rounded-3xl" />
          <SkeletonBlock className="mt-4 h-5 w-3/4" />
          <SkeletonBlock className="mt-2 h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ContinueReadingCard({ currentReading, mobile = false }) {
  if (!currentReading) {
    return (
      <SectionEmptyState
        body="Start reading a story and your active progress will appear here."
        ctaHref={buildSearchHref("")}
        ctaLabel="Discover Stories"
        title="Nothing in progress yet"
      />
    );
  }

  const cardClassName = mobile
    ? "rounded-3xl border border-primary/10 bg-white p-4 dark:bg-primary/5"
    : "overflow-hidden rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm dark:bg-primary/5";

  return (
    <Link
      className="block"
      to={buildChapterHref(currentReading.storySlug, currentReading.chapterSlug)}
    >
      <motion.article className={cardClassName} whileHover={{ y: -4 }}>
        <div className={`flex ${mobile ? "gap-4" : "gap-6"}`}>
          <img
            alt={currentReading.storyTitle}
            className={`rounded-2xl object-cover shadow-lg ${
              mobile ? "h-28 w-24" : "h-40 w-28"
            }`}
            src={currentReading.coverImage}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
              Continue Reading
            </p>
            <h3 className={`mt-2 font-black ${mobile ? "text-xl" : "text-3xl"}`}>
              {currentReading.storyTitle}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {currentReading.chapterLabel} • {currentReading.authorName}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {currentReading.resumeLabel || "Resume reading where you left off."}
            </p>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                <span>Progress</span>
                <span>{currentReading.progressPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/10">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${currentReading.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-background-dark">
              Continue Reading
              <span className="material-symbols-outlined text-sm">
                menu_book
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function DesktopLibrary({ currentReading, isLoading, profile, readingList }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <AppDesktopSidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl space-y-10 px-8 py-10">
            <Reveal>
              <div className="rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent p-8">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Reader Library
                </p>
                <h1 className="mt-4 text-5xl font-black tracking-tight">
                  {profile.displayName
                    ? `${profile.displayName}'s bookshelves`
                    : "Your bookshelves"}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  Pick up where you left off, reopen saved stories, and keep your
                  reading momentum in one place.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-primary/15 bg-white px-4 py-3 dark:bg-background-dark">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      Saved Stories
                    </p>
                    <p className="mt-2 text-2xl font-black">{readingList.length}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/15 bg-white px-4 py-3 dark:bg-background-dark">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      In Progress
                    </p>
                    <p className="mt-2 text-2xl font-black">
                      {currentReading ? "1" : "0"}
                    </p>
                  </div>
                  <Link
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-background-dark"
                    to={buildSearchHref("")}
                  >
                    Discover More
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal as="section" className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Continue reading</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Your active chapter
                </span>
              </div>
              {isLoading ? (
                <LibraryShelfSkeleton />
              ) : (
                <ContinueReadingCard currentReading={currentReading} />
              )}
            </Reveal>

            <Reveal as="section" className="space-y-5 pb-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Saved stories</h2>
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {readingList.length} in your library
                </span>
              </div>

              {isLoading ? (
                <LibraryShelfSkeleton />
              ) : readingList.length ? (
                <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
                  {readingList.map((story, index) => (
                    <Link key={story.storySlug} to={buildStoryHref(story.storySlug)}>
                      <motion.article
                        className="group"
                        initial={{ opacity: 0, y: 16 }}
                        transition={{ delay: index * 0.04, duration: 0.24 }}
                        whileHover={{ y: -6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.15, once: true }}
                      >
                        <div className="aspect-[3/4] overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm dark:bg-primary/5">
                          <img
                            alt={story.storyTitle}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={story.coverImage}
                          />
                        </div>
                        <h3 className="mt-4 line-clamp-1 text-lg font-bold transition-colors group-hover:text-primary">
                          {story.storyTitle}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {story.authorName}
                        </p>
                      </motion.article>
                    </Link>
                  ))}
                </div>
              ) : (
                <SectionEmptyState
                  body="Bookmark or open stories to build your library."
                  ctaHref={buildSearchHref("")}
                  ctaLabel="Browse Stories"
                  title="Your library is empty"
                />
              )}
            </Reveal>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileLibrary({ currentReading, isLoading, profile, readingList }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="mx-auto min-h-screen max-w-md bg-background-light dark:bg-background-dark">
        <main className="space-y-8 px-4 pb-28 pt-5">
          <Reveal>
            <div className="rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                Reader Library
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight">
                {profile.displayName ? `${profile.displayName}'s shelf` : "Your shelf"}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Keep your saved books and active chapter in one place.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-primary/15 bg-white p-3 dark:bg-background-dark">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Saved
                  </p>
                  <p className="mt-2 text-2xl font-black">{readingList.length}</p>
                </div>
                <div className="rounded-2xl border border-primary/15 bg-white p-3 dark:bg-background-dark">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Active
                  </p>
                  <p className="mt-2 text-2xl font-black">{currentReading ? "1" : "0"}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Continue reading</h2>
              <Link
                className="text-[11px] font-black uppercase tracking-[0.18em] text-primary"
                to={buildSearchHref("")}
              >
                Discover
              </Link>
            </div>
            {isLoading ? (
              <LibraryShelfSkeleton mobile />
            ) : (
              <ContinueReadingCard currentReading={currentReading} mobile />
            )}
          </Reveal>

          <Reveal as="section" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Saved stories</h2>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                {readingList.length} titles
              </span>
            </div>
            {isLoading ? (
              <LibraryShelfSkeleton mobile />
            ) : readingList.length ? (
              <div className="space-y-3">
                {readingList.map((story) => (
                  <Link key={story.storySlug} to={buildStoryHref(story.storySlug)}>
                    <motion.article
                      className="flex gap-3 rounded-3xl border border-primary/10 bg-white p-3 dark:bg-primary/5"
                      whileHover={{ y: -4 }}
                    >
                      <img
                        alt={story.storyTitle}
                        className="h-28 w-24 rounded-2xl object-cover"
                        src={story.coverImage}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-base font-bold">
                          {story.storyTitle}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {story.authorName}
                        </p>
                        <div className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
                          Open Story
                          <span className="material-symbols-outlined text-sm">
                            arrow_forward
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            ) : (
              <SectionEmptyState
                body="You have not saved any stories yet."
                ctaHref={buildSearchHref("")}
                ctaLabel="Browse Stories"
                title="Your library is empty"
              />
            )}
          </Reveal>
        </main>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function ReaderLibraryPage() {
  const {
    currentReading,
    isAccountLoading,
    profile,
    readingList,
  } = useAccount();

  return (
    <>
      <DesktopLibrary
        currentReading={currentReading}
        isLoading={isAccountLoading}
        profile={profile}
        readingList={readingList}
      />
      <MobileLibrary
        currentReading={currentReading}
        isLoading={isAccountLoading}
        profile={profile}
        readingList={readingList}
      />
    </>
  );
}
