import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useScrollHide } from "../hooks/useScrollHide";
import { Link, Navigate, useParams } from "react-router-dom";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useOnboarding } from "../context/OnboardingContext";
import {
  buildChapterHref,
  buildLockedChapterHref,
  buildReportChapterHref,
  buildStoryHref,
  readerLibraryHref,
} from "../data/readerFlow";
import { useToast } from "../context/ToastContext";
import {
  useChapterQuery,
  useCreateBookmarkMutation,
  useRemoveBookmarkMutation,
  useSaveReadingProgressMutation,
} from "../reader/readerHooks";

const readerThemes = {
  dark: {
    article: "text-slate-200",
    chrome: "border-primary/10 bg-background-dark/80",
    footerButton: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    muted: "text-slate-400",
    panel: "border-primary/20 bg-surface-dark/95 text-slate-100",
    panelSecondary: "border-primary/20 bg-surface-dark text-slate-100 hover:bg-accent-dark",
    shell: "bg-background-dark text-slate-100",
    sidebar: "border-primary/5 bg-background-dark/70",
    track: "bg-slate-800",
  },
  light: {
    article: "text-slate-800",
    chrome: "border-slate-200 bg-background-light/90",
    footerButton: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    muted: "text-slate-500",
    panel: "border-slate-200 bg-white text-slate-900",
    panelSecondary: "border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200",
    shell: "bg-background-light text-slate-900",
    sidebar: "border-slate-200 bg-background-light/90",
    track: "bg-slate-200",
  },
  sepia: {
    article: "text-[#4a3723]",
    chrome: "border-[#d9c7a9] bg-[#f4ecd8]/90",
    footerButton: "bg-[#efe2c8] text-[#3d2c1f] hover:bg-[#e3d2af]",
    muted: "text-[#7b6247]",
    panel: "border-[#d7c29b] bg-[#f8f1e2] text-[#3d2c1f]",
    panelSecondary: "border-[#d7c29b] bg-[#efe2c8] text-[#3d2c1f] hover:bg-[#e3d2af]",
    shell: "bg-[#f4ecd8] text-[#3d2c1f]",
    sidebar: "border-[#d9c7a9] bg-[#f4ecd8]/90",
    track: "bg-[#ddcfb5]",
  },
};

function mapPreferenceToTheme(value) {
  if (!value) {
    return "dark";
  }

  const normalized = value.toLowerCase();

  if (normalized === "light" || normalized === "sepia" || normalized === "dark") {
    return normalized;
  }

  return "dark";
}

function LoadingState() {
  return <RouteLoadingScreen />;
}

function getChapterErrorMessage(error) {
  if (error?.status === 404) {
    return "This chapter could not be found. The story may not be seeded yet, or the chapter slug no longer exists.";
  }

  return error?.message || "We could not open this chapter right now.";
}

function getSequentialAccessDescription(chapter) {
  if (!chapter?.requiredPreviousChapter) {
    return "Open the previous chapter first to continue in order.";
  }

  return `Continue with Chapter ${chapter.requiredPreviousChapter.chapterNumber}: ${chapter.requiredPreviousChapter.title} before opening this chapter.`;
}

function getVisibleReaderParagraphs() {
  return Array.from(
    document.querySelectorAll("[data-reader-paragraph-index]"),
  ).filter((element) => element.getClientRects().length > 0);
}

function getReaderResumeOffset() {
  return window.innerWidth >= 768 ? 112 : 88;
}

function resolveActiveParagraphIndex() {
  const paragraphs = getVisibleReaderParagraphs();

  if (!paragraphs.length) {
    return 0;
  }

  const anchor = getReaderResumeOffset() + Math.min(window.innerHeight * 0.18, 140);
  let activeIndex = Number(paragraphs[0]?.dataset.readerParagraphIndex ?? 0);

  for (const paragraph of paragraphs) {
    const nextIndex = Number(paragraph.dataset.readerParagraphIndex ?? 0);

    if (paragraph.getBoundingClientRect().top <= anchor) {
      activeIndex = nextIndex;
      continue;
    }

    break;
  }

  return Math.max(0, activeIndex);
}

function scrollToReaderParagraph(paragraphIndex) {
  const paragraphs = getVisibleReaderParagraphs();
  const target = paragraphs.find(
    (paragraph) =>
      Number(paragraph.dataset.readerParagraphIndex ?? "-1") === paragraphIndex,
  );

  if (!target) {
    return false;
  }

  const nextTop = Math.max(
    window.scrollY + target.getBoundingClientRect().top - getReaderResumeOffset(),
    0,
  );

  window.scrollTo({
    behavior: "auto",
    top: nextTop,
  });

  return true;
}

function DesktopReader({
  chapter,
  fontFamily,
  fontSize,
  nextHref,
  nextLabel,
  onBookmarkToggle,
  onIncreaseFont,
  onNextClick,
  onSetFontFamily,
  onSetReaderTheme,
  onSetFontSize,
  onToggleSettings,
  progressPercent,
  readerTheme,
  settingsOpen,
  story,
}) {
  const theme = readerThemes[readerTheme];
  const fontClass = fontFamily === "serif" ? "font-serif" : "font-display";

  return (
    <div className={`hidden min-h-screen font-display antialiased selection:bg-primary/30 md:block ${theme.shell}`}>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${theme.chrome}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link className="flex items-center gap-4 text-primary" to={readerLibraryHref}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background-dark">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">StoryArc</h1>
          </Link>

          <div className="flex items-center gap-2 md:gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              <Link className="text-sm font-medium transition-colors hover:text-primary" to={buildStoryHref(story.slug)}>
                Story
              </Link>
              <Link className="text-sm font-medium transition-colors hover:text-primary" to={readerLibraryHref}>
                Library
              </Link>
            </nav>
            <div className="mx-2 hidden h-6 w-px bg-primary/20 md:block" />
            <div className="flex items-center gap-2">
              <button
                className={`rounded-lg p-2 transition-colors hover:bg-primary/10 ${theme.muted}`}
                onClick={onIncreaseFont}
                type="button"
              >
                <span className="material-symbols-outlined">format_size</span>
              </button>
              <button
                className={`rounded-lg p-2 transition-colors hover:bg-primary/10 ${
                  chapter.isBookmarked ? "text-primary" : theme.muted
                }`}
                onClick={onBookmarkToggle}
                type="button"
              >
                <span className="material-symbols-outlined">
                  {chapter.isBookmarked ? "bookmark" : "bookmark_add"}
                </span>
              </button>
              <Link
                className={`rounded-lg p-2 transition-colors hover:bg-primary/10 ${theme.muted}`}
                to={buildReportChapterHref(story.slug, chapter.chapterSlug)}
              >
                <span className="material-symbols-outlined">flag</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className={`fixed left-0 top-16 z-40 h-1 w-full ${theme.track}`}>
        <div className="h-full bg-primary" style={{ width: `${progressPercent}%` }} />
      </div>

      <main className="relative px-4 pb-24 pt-12">
        <article className="mx-auto max-w-[720px]">
          <header className="mb-16 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
              Chapter {chapter.chapterNumber}
            </p>
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              {chapter.chapterTitle}
            </h2>
            <div className={`flex items-center justify-center gap-3 ${theme.muted}`}>
              <span className="font-medium text-inherit">{story.title}</span>
              <span className="opacity-30">•</span>
              <span>by {chapter.authorName}</span>
              <span className="opacity-30">•</span>
              <span>{chapter.readingMinutes} min read</span>
            </div>
          </header>

          <div
            className={`space-y-8 leading-[1.85] ${fontClass} ${theme.article}`}
            style={{ fontSize: `${fontSize + 4}px` }}
          >
            {chapter.paragraphs.map((paragraph, index) => (
              <motion.p
                data-reader-paragraph-index={index}
                initial={{ opacity: 0, y: 18 }}
                key={`${chapter.chapterSlug}-${index}`}
                transition={{ delay: index * 0.03, duration: 0.25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2, once: true }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <nav className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-primary/10 pt-10 md:flex-row">
            <Link
              className="group flex max-w-[240px] flex-col items-start gap-2"
              to={
                chapter.previousChapter
                  ? buildChapterHref(story.slug, chapter.previousChapter.chapterSlug)
                  : buildStoryHref(story.slug)
              }
            >
              <span className={`text-xs font-bold uppercase tracking-widest ${theme.muted}`}>
                Previous
              </span>
              <span className="flex items-center gap-2 text-lg font-bold transition-colors group-hover:text-primary">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                {(chapter.previousChapter?.title
                  ? chapter.previousChapter.title.slice(0, 8)
                  : "Back to")}
              </span>
            </Link>

            <div className="flex flex-col items-center">
              <p className={`mb-2 text-sm ${theme.muted}`}>{progressPercent}% through this chapter</p>
              <div className={`h-1 w-32 overflow-hidden rounded-full ${theme.track}`}>
                <div className="h-full bg-primary" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <Link
              className="group flex max-w-[240px] flex-col items-end gap-2 text-right"
              onClick={onNextClick}
              to={nextHref}
            >
              <span className={`text-xs font-bold uppercase tracking-widest ${theme.muted}`}>
                Next
              </span>
              <span className="flex items-center gap-2 text-lg font-bold transition-colors group-hover:text-primary">
                {nextLabel}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </Link>
          </nav>
        </article>
      </main>

      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {settingsOpen ? (
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`mb-2 hidden w-64 rounded-xl border p-4 shadow-2xl backdrop-blur-md lg:flex lg:flex-col ${theme.panel}`}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
            >
              <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-primary">
                <span className="material-symbols-outlined text-sm">settings</span>
                Reading Settings
              </h4>

              <div className="space-y-4">
                <div>
                  <p className={`mb-2 text-xs font-bold uppercase ${theme.muted}`}>Background</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["light", "bg-background-light border-slate-200"],
                      ["sepia", "bg-[#f4ecd8] border-[#e8dfc5]"],
                      ["dark", "bg-background-dark border-primary/40"],
                    ].map(([value, swatch]) => (
                      <button
                        className={`h-8 rounded border transition-all ${swatch} ${
                          readerTheme === value ? "ring-2 ring-primary/30" : ""
                        }`}
                        key={value}
                        onClick={() => onSetReaderTheme(value)}
                        type="button"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className={`mb-2 text-xs font-bold uppercase ${theme.muted}`}>Text Size</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs">A</span>
                    <input
                      className="h-1 flex-1 accent-primary"
                      max="24"
                      min="18"
                      onChange={(event) => onSetFontSize(Number(event.target.value))}
                      type="range"
                      value={fontSize}
                    />
                    <span className="text-xl">A</span>
                  </div>
                </div>

                <div>
                  <p className={`mb-2 text-xs font-bold uppercase ${theme.muted}`}>Font Family</p>
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 rounded border py-1 text-xs ${
                        fontFamily === "serif"
                          ? "border-primary/40 bg-primary/20"
                          : theme.panelSecondary
                      }`}
                      onClick={() => onSetFontFamily("serif")}
                      type="button"
                    >
                      Serif
                    </button>
                    <button
                      className={`flex-1 rounded border py-1 text-xs ${
                        fontFamily === "sans"
                          ? "border-primary/40 bg-primary/20"
                          : theme.panelSecondary
                      }`}
                      onClick={() => onSetFontFamily("sans")}
                      type="button"
                    >
                      Sans
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex justify-end gap-3">
          <Link
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-background-dark shadow-lg transition-transform hover:scale-105"
            to={buildStoryHref(story.slug)}
          >
            <span className="material-symbols-outlined">menu_book</span>
          </Link>
          <button
            className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-colors ${theme.panelSecondary}`}
            onClick={onToggleSettings}
            type="button"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileReader({
  chapter,
  fontFamily,
  fontSize,
  nextHref,
  nextLabel,
  onBookmarkToggle,
  onNextClick,
  onSetFontFamily,
  onSetReaderTheme,
  onSetFontSize,
  onToggleSettings,
  progressPercent,
  readerTheme,
  settingsOpen,
  story,
}) {
  const theme = readerThemes[readerTheme];
  const fontClass = fontFamily === "serif" ? "font-serif" : "font-display";
  const barVisible = useScrollHide();

  return (
    <div className={`min-h-screen font-display antialiased md:hidden ${theme.shell}`}>
      <header className={`fixed left-0 right-0 top-0 z-50 flex flex-col border-b backdrop-blur-md ${theme.chrome}`}>
        <div className="flex items-center justify-between px-3 py-2.5">
          <Link className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-primary/10" to={buildStoryHref(story.slug)}>
            <span className="material-symbols-outlined text-lg text-primary">arrow_back</span>
          </Link>
          <h1 className={`truncate px-2 text-xs font-semibold uppercase tracking-wide ${theme.muted}`}>{story.title}</h1>
          <Link className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-primary/10" to={buildReportChapterHref(story.slug, chapter.chapterSlug)}>
            <span className="material-symbols-outlined text-lg text-primary">flag</span>
          </Link>
        </div>
        <div className={`h-0.5 w-full ${theme.track}`}>
          <div className="h-full bg-primary" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-24 pt-20">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Chapter {chapter.chapterNumber}
          </span>
          <h2 className="mt-1.5 text-2xl font-bold">{chapter.chapterTitle}</h2>
        </div>

        <article
          className={`leading-relaxed ${fontClass} ${theme.article}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {chapter.paragraphs.map((paragraph, index) => (
            <motion.p
              className="mb-4"
              data-reader-paragraph-index={index}
              initial={{ opacity: 0, y: 16 }}
              key={`${chapter.chapterSlug}-${index}`}
              transition={{ delay: index * 0.03, duration: 0.25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.2, once: true }}
            >
              {paragraph}
            </motion.p>
          ))}
        </article>

        <nav className="mt-10 flex items-center justify-between gap-3">
          <Link
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${theme.panelSecondary}`}
            to={
              chapter.previousChapter
                ? buildChapterHref(story.slug, chapter.previousChapter.chapterSlug)
                : buildStoryHref(story.slug)
            }
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            Previous
          </Link>
          <Link
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:brightness-110"
            onClick={onNextClick}
            to={nextHref}
          >
            {nextLabel}
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </Link>
        </nav>
      </main>

      <section
        className={`fixed bottom-0 left-0 right-0 z-50 border-t pb-safe transition-transform duration-300 ease-out ${theme.chrome}`}
        style={{ transform: barVisible ? "translateY(0)" : "translateY(100%)" }}
      >
        <div className="flex items-center justify-around px-3 py-2.5">
          <button
            className={`flex flex-col items-center gap-0.5 transition-colors ${settingsOpen ? "text-primary" : theme.muted}`}
            onClick={onToggleSettings}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">format_size</span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Text</span>
          </button>
          <Link className={`flex flex-col items-center gap-0.5 transition-colors ${theme.muted}`} to={buildStoryHref(story.slug)}>
            <span className="material-symbols-outlined text-xl">menu_book</span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Index</span>
          </Link>
          <button
            className={`flex flex-col items-center gap-0.5 transition-colors ${
              chapter.isBookmarked ? "text-primary" : theme.muted
            }`}
            onClick={onBookmarkToggle}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">
              {chapter.isBookmarked ? "bookmark" : "bookmark_add"}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">Save</span>
          </button>
          <div className={`flex flex-col items-center gap-0.5 transition-colors ${theme.muted}`}>
            <span className="material-symbols-outlined text-xl">percent</span>
            <span className="text-[9px] font-bold uppercase tracking-tighter">{progressPercent}%</span>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {settingsOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={`fixed bottom-20 left-3 right-3 z-[60] rounded-xl border p-4 shadow-2xl ${theme.panel}`}
            exit={{ opacity: 0, y: 16 }}
            initial={{ opacity: 0, y: 24 }}
          >
            <div className="space-y-4">
              <div>
                <span className={`mb-2 block text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}>
                  Background
                </span>
                <div className="flex gap-2">
                  {[
                    ["light", "bg-[#f8f8f5] border-primary"],
                    ["sepia", "bg-[#f4ecd8] border-slate-200"],
                    ["dark", "bg-[#221e10] border-primary/30"],
                  ].map(([value, swatch]) => (
                    <button
                      aria-label={`${value} theme`}
                      className={`h-8 flex-1 rounded-lg border-2 transition-all ${swatch} ${
                        readerTheme === value ? "ring-2 ring-primary/20" : ""
                      }`}
                      key={value}
                      onClick={() => onSetReaderTheme(value)}
                      type="button"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}>
                  Font Size
                </span>
                <div className="flex items-center gap-4">
                  <button
                    className="transition-colors hover:text-primary"
                    onClick={() => onSetFontSize(Math.max(fontSize - 1, 18))}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">text_fields</span>
                  </button>
                  <span className="text-base font-bold">{fontSize}</span>
                  <button
                    className="transition-colors hover:text-primary"
                    onClick={() => onSetFontSize(Math.min(fontSize + 1, 24))}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-2xl">text_fields</span>
                  </button>
                </div>
              </div>

              <div>
                <span className={`mb-2 block text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}>
                  Typeface
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`rounded-lg border px-3 py-1.5 text-xs ${
                      fontFamily === "serif"
                        ? "border-primary bg-primary/10 text-primary"
                        : theme.panelSecondary
                    }`}
                    onClick={() => onSetFontFamily("serif")}
                    type="button"
                  >
                    Serif
                  </button>
                  <button
                    className={`rounded-lg border px-3 py-1.5 text-xs ${
                      fontFamily === "sans"
                        ? "border-primary bg-primary/10 text-primary"
                        : theme.panelSecondary
                    }`}
                    onClick={() => onSetFontFamily("sans")}
                    type="button"
                  >
                    Sans
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function ReadingPage() {
  const { storySlug, chapterSlug } = useParams();
  const { readingTheme } = useOnboarding();
  const { showToast } = useToast();
  const { data, error, isError, isLoading } = useChapterQuery(storySlug, chapterSlug);
  const saveProgressMutation = useSaveReadingProgressMutation();
  const createBookmarkMutation = useCreateBookmarkMutation();
  const removeBookmarkMutation = useRemoveBookmarkMutation();
  const [fontFamily, setFontFamily] = useState("serif");
  const [fontSize, setFontSize] = useState(20);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [readerTheme, setReaderTheme] = useState(mapPreferenceToTheme(readingTheme));
  const [bookmarkState, setBookmarkState] = useState({
    bookmarkId: null,
    isBookmarked: false,
  });
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isRestoringResume, setIsRestoringResume] = useState(false);
  const lastPersistedProgressRef = useRef({
    paragraphIndex: 0,
    progressPercent: 0,
  });
  const restoredChapterKeyRef = useRef(null);

  const story = data?.story;
  const chapter = useMemo(() => {
    if (!data?.chapter) {
      return null;
    }

    return {
      ...data.chapter,
      ...bookmarkState,
    };
  }, [bookmarkState, data]);

  useEffect(() => {
    setReaderTheme(mapPreferenceToTheme(readingTheme));
  }, [readingTheme]);

  useEffect(() => {
    if (!data?.chapter) {
      return;
    }

    setBookmarkState({
      bookmarkId: data.chapter.bookmarkId,
      isBookmarked: data.chapter.isBookmarked,
    });
    setParagraphIndex(data.chapter.paragraphIndex);
    setProgressPercent(data.chapter.progressPercent);
    setIsRestoringResume(data.chapter.paragraphIndex > 0);
    restoredChapterKeyRef.current = null;
    lastPersistedProgressRef.current = {
      paragraphIndex: data.chapter.paragraphIndex,
      progressPercent: data.chapter.progressPercent,
    };
  }, [data]);

  useEffect(() => {
    if (!story || !chapter || chapter.isLocked || chapter.accessState !== "READABLE") {
      return undefined;
    }

    const chapterKey = `${story.slug}:${chapter.chapterSlug}`;

    if (restoredChapterKeyRef.current === chapterKey) {
      return undefined;
    }

    restoredChapterKeyRef.current = chapterKey;

    if (chapter.paragraphIndex <= 0) {
      setIsRestoringResume(false);
      return undefined;
    }

    let cancelled = false;
    const initialTimeoutId = window.setTimeout(() => {
      const attemptRestore = (attempt = 0) => {
        if (cancelled) {
          return;
        }

        if (scrollToReaderParagraph(chapter.paragraphIndex) || attempt >= 8) {
          setIsRestoringResume(false);
          return;
        }

        window.setTimeout(() => {
          attemptRestore(attempt + 1);
        }, 90);
      };

      attemptRestore();
    }, 60);

    return () => {
      cancelled = true;
      window.clearTimeout(initialTimeoutId);
    };
  }, [chapter, story]);

  useEffect(() => {
    if (!story || !chapter || chapter.accessState !== "READABLE") {
      return undefined;
    }

    function handleScroll() {
      const scrollContainer = document.documentElement;
      const maxScroll = scrollContainer.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) {
        setProgressPercent((current) => Math.max(current, 5));
        return;
      }

      const nextProgress = Math.min(
        100,
        Math.max(0, Math.round((window.scrollY / maxScroll) * 100)),
      );
      const nextParagraphIndex = resolveActiveParagraphIndex();

      setProgressPercent((current) => (Math.abs(current - nextProgress) >= 1 ? nextProgress : current));
      setParagraphIndex((current) =>
        current !== nextParagraphIndex ? nextParagraphIndex : current,
      );
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [chapter, story]);

  useEffect(() => {
    if (!story || !chapter || isRestoringResume || chapter.accessState !== "READABLE") {
      return undefined;
    }

    const shouldPersist =
      Math.abs(
        progressPercent - lastPersistedProgressRef.current.progressPercent,
      ) >= 5 ||
      paragraphIndex !== lastPersistedProgressRef.current.paragraphIndex ||
      progressPercent === 100;

    if (!shouldPersist) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      lastPersistedProgressRef.current = {
        paragraphIndex,
        progressPercent,
      };
      saveProgressMutation.mutate({
        chapterSlug: chapter.chapterSlug,
        paragraphIndex,
        progressPercent,
        storySlug: story.slug,
      });
    }, 700);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [chapter, isRestoringResume, paragraphIndex, progressPercent, saveProgressMutation, story]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !story || !chapter) {
    return (
      <ReaderStateScreen
        ctaLabel="Back to Library"
        ctaTo={readerLibraryHref}
        description={getChapterErrorMessage(error)}
        secondaryLabel={storySlug ? "Open Story" : "Browse Stories"}
        secondaryTo={storySlug ? buildStoryHref(storySlug) : "/search?q=Fantasy"}
        title="Chapter Not Available"
        tone="error"
      />
    );
  }

  if (chapter.accessState === "SEQUENCE_BLOCKED") {
    return (
      <ReaderStateScreen
        ctaLabel={
          chapter.requiredPreviousChapter
            ? `Open Chapter ${chapter.requiredPreviousChapter.chapterNumber}`
            : "Open Story"
        }
        ctaTo={
          chapter.requiredPreviousChapter
            ? buildChapterHref(story.slug, chapter.requiredPreviousChapter.chapterSlug)
            : buildStoryHref(story.slug)
        }
        description={getSequentialAccessDescription(chapter)}
        secondaryLabel="Back to Story"
        secondaryTo={buildStoryHref(story.slug)}
        title="Continue in Order"
      />
    );
  }

  if (chapter.isLocked) {
    return (
      <Navigate
        replace
        to={buildLockedChapterHref(story.slug, chapter.chapterSlug)}
      />
    );
  }

  const nextHref = chapter.nextChapter
    ? buildChapterHref(story.slug, chapter.nextChapter.chapterSlug)
    : readerLibraryHref;
  const nextLabel = chapter.nextChapter ? chapter.nextChapter.title : "Back to Library";

  async function handleBookmarkToggle() {
    try {
      if (bookmarkState.isBookmarked && bookmarkState.bookmarkId) {
        await removeBookmarkMutation.mutateAsync(bookmarkState.bookmarkId);
        setBookmarkState({
          bookmarkId: null,
          isBookmarked: false,
        });
        showToast("Bookmark removed.", { title: "Saved location updated" });
        return;
      }

      const response = await createBookmarkMutation.mutateAsync({
        chapterSlug: chapter.chapterSlug,
        storySlug: story.slug,
      });

      setBookmarkState({
        bookmarkId: response.bookmarkId,
        isBookmarked: true,
      });
      showToast("Bookmark saved for this chapter.", { title: "Saved" });
    } catch (error) {
      showToast(error?.message || "Bookmark action failed.", {
        title: "Could not update bookmark",
        tone: "error",
      });
    }
  }

  function handleNextClick() {
    saveProgressMutation.mutate({
      chapterSlug: chapter.chapterSlug,
      paragraphIndex: Math.max(chapter.paragraphs.length - 1, 0),
      progressPercent: 100,
      storySlug: story.slug,
    });
  }

  function handleSetFontSize(nextValue) {
    setFontSize(nextValue);
  }

  return (
    <>
      <DesktopReader
        chapter={chapter}
        fontFamily={fontFamily}
        fontSize={fontSize}
        nextHref={nextHref}
        nextLabel={nextLabel}
        onBookmarkToggle={handleBookmarkToggle}
        onIncreaseFont={() => setFontSize((current) => Math.min(current + 1, 24))}
        onNextClick={handleNextClick}
        onSetFontFamily={setFontFamily}
        onSetReaderTheme={setReaderTheme}
        onSetFontSize={handleSetFontSize}
        onToggleSettings={() => setSettingsOpen((current) => !current)}
        progressPercent={progressPercent}
        readerTheme={readerTheme}
        settingsOpen={settingsOpen}
        story={story}
      />
      <MobileReader
        chapter={chapter}
        fontFamily={fontFamily}
        fontSize={fontSize}
        nextHref={nextHref}
        nextLabel={nextLabel}
        onBookmarkToggle={handleBookmarkToggle}
        onNextClick={handleNextClick}
        onSetFontFamily={setFontFamily}
        onSetReaderTheme={setReaderTheme}
        onSetFontSize={handleSetFontSize}
        onToggleSettings={() => setSettingsOpen((current) => !current)}
        progressPercent={progressPercent}
        readerTheme={readerTheme}
        settingsOpen={settingsOpen}
        story={story}
      />
    </>
  );
}
