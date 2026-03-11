import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import { buildGiftSendingHref } from "../data/communityFlow";
import {
  buildChapterHref,
  buildSearchHref,
} from "../data/readerFlow";
import { useStoryDetailsQuery } from "../reader/readerHooks";

function getStoryErrorMessage(error) {
  if (error?.status === 404) {
    return "This story is not available right now. If you just wired a fresh backend, the catalog may not be seeded yet.";
  }

  return error?.message || "We could not load this story right now.";
}

function LoadingState() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading story details...
        </p>
      </div>
    </div>
  );
}

function StoryAction({ children, to, tone = "primary" }) {
  const className =
    tone === "primary"
      ? "flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-base font-bold text-background-dark shadow-lg shadow-primary/20"
      : "flex h-14 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-6 text-base font-bold text-slate-900 dark:text-slate-100";

  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

function getSequenceBlockedLabel(chapter) {
  if (!chapter?.requiredPreviousChapter) {
    return "Available after the previous chapter";
  }

  return `Available after Chapter ${chapter.requiredPreviousChapter.chapterNumber}`;
}

function DesktopStoryDetails({
  onSearchSubmit,
  searchTerm,
  setSearchTerm,
  story,
  storyData,
}) {
  const primaryChapterSlug =
    storyData.continueReading?.chapterSlug || story.firstChapterSlug;

  return (
    <div className="hidden min-h-screen flex-col bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:flex">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light/90 px-6 py-3 backdrop-blur-md dark:bg-background-dark/90 lg:px-10">
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-3 text-primary" to="/dashboard">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background-dark">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">StoryArc</h2>
          </Link>

          <form className="hidden min-w-56 md:block" onSubmit={onSearchSubmit}>
            <div className="flex h-11 items-center rounded-xl bg-slate-100 dark:bg-primary/10">
              <span className="material-symbols-outlined px-4 text-slate-400">search</span>
              <input
                className="h-full w-full border-none bg-transparent pr-4 text-sm focus:ring-0"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search stories, authors..."
                type="text"
                value={searchTerm}
              />
            </div>
          </form>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/10"
            to="/dashboard"
          >
            Browse
          </Link>
          <Link
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/10"
            to={buildSearchHref(story.genres[0] || "Fantasy")}
          >
            More like this
          </Link>
        </nav>
      </header>

      <main className="flex-1 px-6 py-10 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-12">
          <Reveal>
            <div className="grid gap-10 xl:grid-cols-[360px_minmax(0,1fr)]">
              <motion.div className="overflow-hidden rounded-[2rem] border border-primary/10 shadow-2xl" whileHover={{ y: -4 }}>
                <img
                  alt={story.title}
                  className="aspect-[3/4] h-full w-full object-cover"
                  src={story.coverImage}
                />
              </motion.div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {story.genres.map((genre) => (
                      <span
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary"
                        key={genre}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-5xl font-black leading-tight">{story.title}</h1>
                  <p className="text-xl text-primary">by {story.authorName}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Rating
                    </p>
                    <p className="mt-2 text-2xl font-black">{story.rating.toFixed(1)}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Reads
                    </p>
                    <p className="mt-2 text-2xl font-black">{story.readsLabel}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Chapters
                    </p>
                    <p className="mt-2 text-2xl font-black">{story.chapterCount}</p>
                  </div>
                  <div className="rounded-2xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Status
                    </p>
                    <p className="mt-2 text-2xl font-black">{story.status}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Synopsis</h2>
                  <p className="max-w-4xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                    {story.synopsis}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {primaryChapterSlug ? (
                    <StoryAction to={buildChapterHref(story.slug, primaryChapterSlug)}>
                      <span className="material-symbols-outlined">menu_book</span>
                      {storyData.continueReading ? "Continue Reading" : "Start Reading"}
                    </StoryAction>
                  ) : null}
                  <StoryAction to={buildGiftSendingHref(story.slug)} tone="secondary">
                    <span className="material-symbols-outlined">card_giftcard</span>
                    Send Gift
                  </StoryAction>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal as="section" className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Chapters</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {story.chapterCount} published chapters
                </p>
              </div>

              <div className="space-y-3">
                {storyData.chapters.map((chapter, index) => {
                  const isSequenceBlocked = chapter.accessState === "SEQUENCE_BLOCKED";
                  const chapterCard = (
                    <motion.article
                      className={`flex items-center justify-between gap-4 rounded-3xl border border-primary/10 bg-white p-4 dark:bg-primary/5 ${
                        isSequenceBlocked ? "cursor-not-allowed opacity-70" : ""
                      }`}
                      initial={{ opacity: 0, x: -18 }}
                      transition={{ delay: index * 0.03, duration: 0.24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      whileHover={isSequenceBlocked ? undefined : { y: -3 }}
                      viewport={{ amount: 0.15, once: true }}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-black text-primary">
                            {String(chapter.chapterNumber).padStart(2, "0")}
                          </span>
                          <h3 className="line-clamp-1 text-lg font-bold">{chapter.title}</h3>
                          {chapter.premium ? (
                            <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-black uppercase tracking-wide text-background-dark">
                              Premium
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          {chapter.publishedAtLabel}
                        </p>
                        {isSequenceBlocked ? (
                          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
                            {getSequenceBlockedLabel(chapter)}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3">
                        {chapter.isCurrent ? (
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            Continue here
                          </span>
                        ) : null}
                        <span className="material-symbols-outlined text-slate-400">
                          {isSequenceBlocked ? "lock" : "chevron_right"}
                        </span>
                      </div>
                    </motion.article>
                  );

                  if (isSequenceBlocked) {
                    return (
                      <div
                        aria-disabled="true"
                        className="block"
                        key={chapter.chapterSlug}
                      >
                        {chapterCard}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={chapter.chapterSlug}
                      to={buildChapterHref(story.slug, chapter.chapterSlug)}
                    >
                      {chapterCard}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-primary/10 bg-white p-6 dark:bg-primary/5">
              <h3 className="text-xl font-bold">Story snapshot</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {story.shortSynopsis}
              </p>
              <div className="space-y-3">
                {story.tagLabels.map((tag) => (
                  <div
                    className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold"
                    key={tag}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
}

function MobileStoryDetails({ story, storyData }) {
  const primaryChapterSlug =
    storyData.continueReading?.chapterSlug || story.firstChapterSlug;

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <main className="space-y-8 px-4 pb-28 pt-5">
        <Reveal>
          <Link className="inline-flex items-center gap-2 text-primary" to="/dashboard">
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </Link>
        </Reveal>

        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-primary/10">
            <img
              alt={story.title}
              className="aspect-[3/4] w-full object-cover"
              src={story.coverImage}
            />
          </div>
        </Reveal>

        <Reveal className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {story.genres.map((genre) => (
              <span
                className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary"
                key={genre}
              >
                {genre}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-black leading-tight">{story.title}</h1>
          <p className="text-lg text-primary">by {story.authorName}</p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {story.synopsis}
          </p>
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Rating
            </p>
            <p className="mt-2 text-2xl font-black">{story.rating.toFixed(1)}</p>
          </div>
          <div className="rounded-3xl border border-primary/10 bg-white p-4 dark:bg-primary/5">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Chapters
            </p>
            <p className="mt-2 text-2xl font-black">{story.chapterCount}</p>
          </div>
        </Reveal>

        <Reveal className="space-y-3">
          {primaryChapterSlug ? (
            <StoryAction to={buildChapterHref(story.slug, primaryChapterSlug)}>
              <span className="material-symbols-outlined">menu_book</span>
              {storyData.continueReading ? "Continue Reading" : "Start Reading"}
            </StoryAction>
          ) : null}
          <StoryAction to={buildGiftSendingHref(story.slug)} tone="secondary">
            <span className="material-symbols-outlined">card_giftcard</span>
            Send Gift
          </StoryAction>
        </Reveal>

        <Reveal as="section" className="space-y-4">
          <h2 className="text-2xl font-bold">Chapters</h2>
          <div className="space-y-3">
            {storyData.chapters.map((chapter) => {
              const isSequenceBlocked = chapter.accessState === "SEQUENCE_BLOCKED";
              const chapterCard = (
                <article
                  className={`rounded-3xl border border-primary/10 bg-white p-4 dark:bg-primary/5 ${
                    isSequenceBlocked ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Chapter {chapter.chapterNumber}
                      </p>
                      <h3 className="mt-2 line-clamp-1 font-bold">{chapter.title}</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {chapter.publishedAtLabel}
                      </p>
                      {isSequenceBlocked ? (
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">
                          {getSequenceBlockedLabel(chapter)}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {chapter.premium ? (
                        <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-background-dark">
                          Premium
                        </span>
                      ) : null}
                      {isSequenceBlocked ? (
                        <span className="material-symbols-outlined text-slate-400">lock</span>
                      ) : null}
                    </div>
                  </div>
                </article>
              );

              if (isSequenceBlocked) {
                return (
                  <div
                    aria-disabled="true"
                    className="block"
                    key={chapter.chapterSlug}
                  >
                    {chapterCard}
                  </div>
                );
              }

              return (
                <Link
                  key={chapter.chapterSlug}
                  to={buildChapterHref(story.slug, chapter.chapterSlug)}
                >
                  {chapterCard}
                </Link>
              );
            })}
          </div>
        </Reveal>
      </main>
    </div>
  );
}

export default function StoryDetailsPage() {
  const navigate = useNavigate();
  const { storySlug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isError, isLoading } = useStoryDetailsQuery(storySlug);
  const story = useMemo(() => data?.story ?? null, [data]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    navigate(buildSearchHref(searchTerm || story?.genres?.[0] || "Fantasy"));
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <LoadingState />
      </div>
    );
  }

  if (isError || !story) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Dashboard"
        ctaTo="/dashboard"
        description={getStoryErrorMessage(error)}
        secondaryLabel="Browse Stories"
        secondaryTo={buildSearchHref("Fantasy")}
        title="Story Not Available"
        tone="error"
      />
    );
  }

  return (
    <>
      <DesktopStoryDetails
        onSearchSubmit={handleSearchSubmit}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        story={story}
        storyData={data}
      />
      <MobileStoryDetails story={story} storyData={data} />
    </>
  );
}
