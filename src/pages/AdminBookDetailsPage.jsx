import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import AdminPageLayout from "../components/AdminPageLayout";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { fetchAdminBookDetails, updateAdminBookConfig } from "../admin/adminApi";
import { useAdmin } from "../context/AdminContext";
import {
  adminBookLockWindowOptions,
  adminBookVisibilityModes,
  getAdminLockWindowLabel,
} from "../data/adminBookFlow";
import { adminBooksHref } from "../data/adminFlow";

function cloneBookDetail(detail) {
  return JSON.parse(JSON.stringify(detail));
}

function toneForVisibility(mode) {
  if (mode === "LIVE") {
    return "bg-emerald-500/10 text-emerald-500";
  }

  if (mode === "PENDING_APPROVAL") {
    return "bg-primary/15 text-primary";
  }

  return "bg-slate-500/10 text-slate-500 dark:text-slate-400";
}

function getChangedCount(draft, saved) {
  let total = 0;

  if (draft.visibilityMode !== saved.visibilityMode) {
    total += 1;
  }

  if (draft.globalLockWindowHours !== saved.globalLockWindowHours) {
    total += 1;
  }

  if (draft.globalCoinCap !== saved.globalCoinCap) {
    total += 1;
  }

  draft.chapters.forEach((chapter, index) => {
    const savedChapter = saved.chapters[index];

    if (!savedChapter) {
      total += 1;
      return;
    }

    if (
      chapter.adminOverrideEnabled !== savedChapter.adminOverrideEnabled ||
      chapter.adminLocked !== savedChapter.adminLocked ||
      chapter.coinPrice !== savedChapter.coinPrice ||
      chapter.lockWindowHours !== savedChapter.lockWindowHours
    ) {
      total += 1;
    }
  });

  return total;
}

function parseWindowHours(value) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return parsedValue < 0 ? -1 : parsedValue;
}

function ChapterOverrideBadge({ chapter }) {
  if (!chapter.adminOverrideEnabled) {
    return (
      <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:bg-white/10 dark:text-slate-400">
        Author
      </span>
    );
  }

  return (
    <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
      Override
    </span>
  );
}

function NotFoundState({ description = "Open the admin inventory again and choose a book from the current list." }) {
  return (
    <AdminPageLayout
      subtitle="The requested book record could not be found."
      title="Manage Book"
    >
      <div className="rounded-[28px] border border-dashed border-primary/20 bg-white px-6 py-12 text-center text-sm text-slate-500 dark:bg-primary/5 dark:text-slate-400">
        <p className="text-base font-bold text-slate-900 dark:text-slate-100">
          Book not found
        </p>
        <p className="mt-2">{description}</p>
        <Link
          className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-background-dark"
          to={adminBooksHref}
        >
          Back to Book Management
        </Link>
      </div>
    </AdminPageLayout>
  );
}

export default function AdminBookDetailsPage() {
  const { bookId } = useParams();
  const queryClient = useQueryClient();
  const { adminNotice, clearAdminNotice, showAdminNotice } = useAdmin();
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [draft, setDraft] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  const bookQuery = useQuery({
    enabled: Boolean(bookId),
    queryKey: ["admin", "book", bookId],
    queryFn: () => fetchAdminBookDetails(bookId),
    staleTime: 15_000,
  });

  useEffect(() => {
    if (!bookQuery.data?.book) {
      return;
    }

    const nextSnapshot = cloneBookDetail(bookQuery.data.book);
    setSavedSnapshot(nextSnapshot);
    setDraft(cloneBookDetail(bookQuery.data.book));
  }, [bookQuery.data?.book]);

  const saveConfigMutation = useMutation({
    mutationFn: ({ bookSlug, input }) => updateAdminBookConfig(bookSlug, input),
    onError: (error) => {
      showAdminNotice(
        error.message || "Could not save this book configuration.",
        "info",
      );
    },
    onSuccess: (response) => {
      const nextBook = cloneBookDetail(response.book);
      setSavedSnapshot(nextBook);
      setDraft(nextBook);
      showAdminNotice(response.message || "Book controls saved.");
      queryClient.invalidateQueries({ queryKey: ["admin", "books"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "book", bookId] });
    },
  });

  const visibleChapters = useMemo(() => {
    if (!draft) {
      return [];
    }

    const query = deferredSearch.trim().toLowerCase();

    return draft.chapters.filter((chapter) => {
      if (!query) {
        return true;
      }

      return (
        chapter.title.toLowerCase().includes(query) ||
        chapter.publishedAt.toLowerCase().includes(query) ||
        chapter.authorLockLabel.toLowerCase().includes(query)
      );
    });
  }, [deferredSearch, draft]);

  const unsavedCount = useMemo(() => {
    if (!draft || !savedSnapshot) {
      return 0;
    }

    return getChangedCount(draft, savedSnapshot);
  }, [draft, savedSnapshot]);

  function updateDraft(patch) {
    setDraft((current) => ({
      ...current,
      ...patch,
    }));
  }

  function updateChapter(chapterId, updater) {
    setDraft((current) => ({
      ...current,
      chapters: current.chapters.map((chapter) =>
        chapter.id === chapterId ? updater(chapter, current) : chapter,
      ),
    }));
  }

  function toggleVisibilityMode(nextMode) {
    updateDraft({
      visibilityMode: nextMode,
    });
  }

  function resetToAuthorDefaults() {
    setDraft((current) => ({
      ...current,
      chapters: current.chapters.map((chapter) => ({
        ...chapter,
        adminLocked: chapter.authorLockState === "locked",
        adminOverrideEnabled: false,
        coinPrice: chapter.authorDefaultCoinPrice,
        lockWindow: chapter.authorDefaultLockWindow,
        lockWindowHours: chapter.authorDefaultLockWindowHours,
      })),
    }));
    showAdminNotice("Chapter overrides reset to the author defaults.", "info");
  }

  function saveChanges() {
    saveConfigMutation.mutate({
      bookSlug: bookId,
      input: {
        chapters: draft.chapters.map((chapter) => ({
          coinPriceOverride: chapter.adminOverrideEnabled ? chapter.coinPrice : null,
          lockedOverride: chapter.adminOverrideEnabled ? chapter.adminLocked : null,
          overrideEnabled: chapter.adminOverrideEnabled,
          premiumWindowHoursOverride: chapter.adminOverrideEnabled
            ? chapter.lockWindowHours
            : null,
          publishedChapterId: chapter.id,
        })),
        defaultPremiumWindowHours: draft.globalLockWindowHours,
        globalCoinCap: draft.globalCoinCap,
        reviewNotes: draft.reviewNotes || null,
        visibilityState: draft.visibilityMode,
      },
    });
  }

  function applyLockWindowToAll() {
    setDraft((current) => ({
      ...current,
      chapters: current.chapters.map((chapter) => ({
        ...chapter,
        adminLocked:
          chapter.authorDefaultCoinPrice > 0 || chapter.adminOverrideEnabled
            ? true
            : chapter.adminLocked,
        adminOverrideEnabled:
          chapter.authorDefaultCoinPrice > 0 || chapter.adminOverrideEnabled,
        lockWindow: getAdminLockWindowLabel(current.globalLockWindowHours),
        lockWindowHours: current.globalLockWindowHours,
      })),
    }));
    showAdminNotice(
      `Applied ${getAdminLockWindowLabel(draft.globalLockWindowHours)} to the locked chapters in ${draft.title}.`,
    );
  }

  function applyCoinCapToAll() {
    setDraft((current) => ({
      ...current,
      chapters: current.chapters.map((chapter) => {
        const shouldLock = chapter.authorDefaultCoinPrice > 0 || chapter.adminOverrideEnabled;

        if (!shouldLock) {
          return chapter;
        }

        return {
          ...chapter,
          adminLocked: true,
          adminOverrideEnabled: true,
          coinPrice: current.globalCoinCap,
        };
      }),
    }));
    showAdminNotice(
      `Applied the ${draft.globalCoinCap} coin cap to every locked chapter in ${draft.title}.`,
    );
  }

  function toggleChapterOverride(chapterId) {
    updateChapter(chapterId, (chapter, current) => {
      if (chapter.adminOverrideEnabled) {
        return {
          ...chapter,
          adminLocked: chapter.authorLockState === "locked",
          adminOverrideEnabled: false,
          coinPrice: chapter.authorDefaultCoinPrice,
          lockWindow: chapter.authorDefaultLockWindow,
          lockWindowHours: chapter.authorDefaultLockWindowHours,
        };
      }

      const nextPrice =
        chapter.authorDefaultCoinPrice > 0 ? chapter.authorDefaultCoinPrice : current.globalCoinCap;

      return {
        ...chapter,
        adminLocked: nextPrice > 0,
        adminOverrideEnabled: true,
        coinPrice: nextPrice,
        lockWindow: getAdminLockWindowLabel(current.globalLockWindowHours),
        lockWindowHours: current.globalLockWindowHours,
      };
    });
  }

  function updateChapterPrice(chapterId, value) {
    updateChapter(chapterId, (chapter) => {
      const nextPrice = Math.max(0, Number(value) || 0);

      return {
        ...chapter,
        adminLocked: nextPrice > 0,
        adminOverrideEnabled: true,
        coinPrice: nextPrice,
      };
    });
  }

  function updateChapterLocked(chapterId, nextLocked) {
    updateChapter(chapterId, (chapter, current) => {
      const fallbackPrice = Math.max(
        1,
        current.globalCoinCap || chapter.authorDefaultCoinPrice || 1,
      );

      return {
        ...chapter,
        adminLocked: nextLocked,
        adminOverrideEnabled: true,
        coinPrice:
          nextLocked && chapter.coinPrice <= 0 ? fallbackPrice : chapter.coinPrice,
      };
    });
  }

  function updateChapterWindow(chapterId, value) {
    const nextWindowHours = parseWindowHours(value);

    updateChapter(chapterId, (chapter) => ({
      ...chapter,
      adminOverrideEnabled: true,
      lockWindow: getAdminLockWindowLabel(nextWindowHours),
      lockWindowHours: nextWindowHours,
    }));
  }

  if (bookQuery.isLoading && !draft) {
    return <RouteLoadingScreen />;
  }

  if (bookQuery.isError && bookQuery.error?.status === 404) {
    return <NotFoundState />;
  }

  if (bookQuery.isError) {
    return (
      <NotFoundState
        description={
          bookQuery.error?.message ||
          "The admin book service is unavailable right now."
        }
      />
    );
  }

  if (!draft || !savedSnapshot) {
    return <NotFoundState />;
  }

  return (
    <AdminPageLayout
      notice={adminNotice}
      onDismissNotice={clearAdminNotice}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search chapters..."
      searchTerm={searchTerm}
      subtitle="Review per-book visibility, global lock overrides, and chapter-level admin pricing before the release profile goes live."
      title="Manage Book"
    >
      <Reveal className="rounded-[28px] border border-primary/10 bg-[#151006] p-6 text-white shadow-[0_28px_80px_-40px_rgba(16,12,8,0.9)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-6">
            <div className="group relative">
              <img
                alt={draft.title}
                className="h-40 w-28 rounded-lg border-2 border-primary/20 object-cover shadow-2xl"
                src={draft.cover}
              />
              <div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-3">
                <h2 className="text-3xl font-black tracking-tight">{draft.title}</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.18em] ${toneForVisibility(
                    draft.visibilityMode,
                  )}`}
                >
                  {draft.visibilityMode === "PENDING_APPROVAL"
                    ? "Pending"
                    : draft.visibilityMode === "LIVE"
                      ? "Live"
                      : "Hidden"}
                </span>
              </div>
              <p className="text-sm font-medium text-primary/70">{draft.subtitle}</p>

              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-200">
                  Visibility Status:
                </span>
                <div className="flex flex-wrap rounded-lg border border-primary/10 bg-background-dark/20 p-1">
                  {adminBookVisibilityModes.map((mode) => (
                    <button
                      className={`rounded-md px-4 py-1.5 text-xs font-bold transition-colors ${
                        draft.visibilityMode === mode.value
                          ? "bg-primary text-background-dark"
                          : "text-slate-400 hover:text-primary"
                      }`}
                      key={mode.value}
                      onClick={() => toggleVisibilityMode(mode.value)}
                      type="button"
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="rounded-lg border border-primary/20 bg-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-primary/30 hover:text-primary dark:bg-slate-800 dark:text-slate-300"
              onClick={resetToAuthorDefaults}
              type="button"
            >
              Reset to Author Defaults
            </button>
            <button
              className="rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saveConfigMutation.isPending}
              onClick={saveChanges}
              type="button"
            >
              {saveConfigMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Reveal>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal className="rounded-[24px] border border-primary/10 bg-white p-6 shadow-sm dark:bg-primary/5">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">
              history_toggle_off
            </span>
            <h2 className="text-lg font-black tracking-tight">Global Lock Window</h2>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Apply a uniform release delay for all chapters from this book.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <select
              className="flex-1 rounded-lg border border-primary/20 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) =>
                  updateDraft({
                    globalLockWindow: getAdminLockWindowLabel(event.target.value),
                    globalLockWindowHours: parseWindowHours(event.target.value),
                  })
                }
              value={draft.globalLockWindowHours}
            >
              {adminBookLockWindowOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20"
              onClick={applyLockWindowToAll}
              type="button"
            >
              Apply to All
            </button>
          </div>
        </Reveal>

        <Reveal className="rounded-[24px] border border-primary/10 bg-white p-6 shadow-sm dark:bg-primary/5">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined rounded-lg bg-primary/10 p-2 text-primary">
              toll
            </span>
            <h2 className="text-lg font-black tracking-tight">Default Coin Cap</h2>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Set the maximum coins required per chapter for the entire book.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative flex-1">
              <input
                className="w-full rounded-lg border border-primary/20 bg-slate-50 px-4 py-3 text-sm focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark/50"
                onChange={(event) =>
                  updateDraft({
                    globalCoinCap: Math.max(0, Number(event.target.value) || 0),
                  })
                }
                type="number"
                value={draft.globalCoinCap}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-primary/40">
                COINS
              </span>
            </div>
            <button
              className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20"
              onClick={applyCoinCapToAll}
              type="button"
            >
              Apply to All
            </button>
          </div>
        </Reveal>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-primary/10 bg-white shadow-sm dark:bg-primary/5">
        <div className="flex flex-col gap-4 border-b border-primary/10 bg-primary/5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="material-symbols-outlined text-primary">list_alt</span>
            Chapter Management ({draft.chapterCount} Chapters)
          </h2>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
            onClick={() =>
              showAdminNotice(
                `${unsavedCount} override changes are pending in this book.`,
                "info",
              )
            }
            type="button"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            {unsavedCount ? `${unsavedCount} Unsaved` : "Filters"}
          </button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-background-light text-left text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 dark:bg-slate-900/40 dark:text-primary/40">
                <th className="px-6 py-4">Chapter Name</th>
                <th className="px-6 py-4">Author&apos;s Lock Settings</th>
                <th className="px-6 py-4">Admin Override</th>
                <th className="px-6 py-4">Coin Price</th>
                <th className="px-6 py-4">Lock Window</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {visibleChapters.map((chapter) => (
                <tr className="group transition-colors hover:bg-primary/5" key={chapter.id}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{chapter.title}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {chapter.publishedAt}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">
                        {chapter.authorLockState === "locked" ? "lock" : "lock_open"}
                      </span>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {chapter.authorLockLabel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          checked={chapter.adminOverrideEnabled}
                          className="peer sr-only"
                          onChange={() => toggleChapterOverride(chapter.id)}
                          type="checkbox"
                        />
                        <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-slate-700" />
                      </label>
                      <div className="space-y-1">
                        <ChapterOverrideBadge chapter={chapter} />
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          {chapter.adminOverrideEnabled
                            ? chapter.adminLocked
                              ? "Locked"
                              : "Unlocked"
                            : "Author Default"}
                        </p>
                        <div className="flex gap-1">
                          <button
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                              chapter.adminOverrideEnabled && chapter.adminLocked
                                ? "bg-rose-500/10 text-rose-500"
                                : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                            }`}
                            disabled={!chapter.adminOverrideEnabled}
                            onClick={() => updateChapterLocked(chapter.id, true)}
                            type="button"
                          >
                            Lock
                          </button>
                          <button
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] ${
                              chapter.adminOverrideEnabled && !chapter.adminLocked
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                            }`}
                            disabled={!chapter.adminOverrideEnabled}
                            onClick={() => updateChapterLocked(chapter.id, false)}
                            type="button"
                          >
                            Free
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      className="w-20 rounded border border-primary/10 bg-background-light px-2 py-1 text-center text-xs outline-none focus:border-primary/30 dark:bg-slate-800"
                      disabled={!chapter.adminOverrideEnabled}
                      onChange={(event) => updateChapterPrice(chapter.id, event.target.value)}
                      type="number"
                      value={chapter.coinPrice}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="rounded border border-primary/10 bg-background-light px-2 py-1 text-xs text-slate-600 outline-none focus:border-primary/30 dark:bg-slate-800 dark:text-slate-400"
                      disabled={!chapter.adminOverrideEnabled}
                      onChange={(event) => updateChapterWindow(chapter.id, event.target.value)}
                      value={chapter.lockWindowHours}
                    >
                      {adminBookLockWindowOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {chapter.effectiveLockLabel}
                      </p>
                      <button
                        className="text-slate-400 transition-colors hover:text-primary"
                        onClick={() =>
                          showAdminNotice(`${chapter.title} is editable inline.`, "info")
                        }
                        type="button"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {visibleChapters.map((chapter) => (
            <Reveal
              className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
              key={chapter.id}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4 dark:border-white/5">
                <div>
                  <p className="font-bold leading-none">{chapter.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Author: {chapter.authorDefaultLockWindow} / {chapter.authorDefaultCoinPrice} Coins
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1">
                  <ChapterOverrideBadge chapter={chapter} />
                  <label className="relative inline-flex cursor-pointer items-center origin-right scale-75">
                    <input
                      checked={chapter.adminOverrideEnabled}
                      className="peer sr-only"
                      onChange={() => toggleChapterOverride(chapter.id)}
                      type="checkbox"
                    />
                    <div className="h-5 w-9 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full dark:bg-white/20" />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4">
                <div className="col-span-2 flex items-center justify-between rounded-xl bg-background-light px-3 py-2 text-xs dark:bg-background-dark/60">
                  <span className="font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Current Effect
                  </span>
                  <span
                    className={`font-bold ${
                      chapter.effectiveLockState === "locked"
                        ? "text-rose-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {chapter.effectiveLockLabel}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Lock Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`h-10 rounded-lg text-xs font-bold uppercase tracking-[0.16em] ${
                        chapter.adminOverrideEnabled && chapter.adminLocked
                          ? "bg-rose-500/10 text-rose-500"
                          : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                      }`}
                      disabled={!chapter.adminOverrideEnabled}
                      onClick={() => updateChapterLocked(chapter.id, true)}
                      type="button"
                    >
                      Lock
                    </button>
                    <button
                      className={`h-10 rounded-lg text-xs font-bold uppercase tracking-[0.16em] ${
                        chapter.adminOverrideEnabled && !chapter.adminLocked
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                      }`}
                      disabled={!chapter.adminOverrideEnabled}
                      onClick={() => updateChapterLocked(chapter.id, false)}
                      type="button"
                    >
                      Free
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Price (Coins)
                  </label>
                  <input
                    className="h-10 w-full rounded-lg border-none bg-slate-100 text-sm focus:ring-primary dark:bg-white/10"
                    disabled={!chapter.adminOverrideEnabled}
                    onChange={(event) => updateChapterPrice(chapter.id, event.target.value)}
                    type="number"
                    value={chapter.coinPrice}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">
                    Lock Window
                  </label>
                  <select
                    className="h-10 w-full rounded-lg border-none bg-slate-100 text-sm focus:ring-primary dark:bg-white/10"
                    disabled={!chapter.adminOverrideEnabled}
                    onChange={(event) => updateChapterWindow(chapter.id, event.target.value)}
                    value={chapter.lockWindowHours}
                  >
                    {adminBookLockWindowOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {!visibleChapters.length ? (
          <div className="px-6 py-10 text-sm text-slate-500 dark:text-slate-400">
            No chapters match the current search.
          </div>
        ) : null}
      </section>
    </AdminPageLayout>
  );
}
