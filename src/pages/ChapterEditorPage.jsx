import { useEffect, useState } from "react";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import PageLoadingSpinner from "../components/PageLoadingSpinner";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useCreator } from "../context/CreatorContext";
import {
  authorDashboardHref,
  creatorStoryCreateHref,
  getCreatorChapterBinHref,
  getCreatorPublishedChaptersHref,
  getCreatorScheduledChaptersHref,
  getCreatorStoryManagementHref,
} from "../data/creatorFlow";
import { getRichTextPlainText } from "../editor/richText";

const warningOptions = ["Violence", "Strong Language", "Mature Themes"];

function getWordCount(body) {
  const plainText = getRichTextPlainText(body);

  return plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
}

function toggleWarning(warnings, warning) {
  if (warnings.includes(warning)) {
    return warnings.filter((entry) => entry !== warning);
  }

  return [...warnings, warning];
}

function getVolumeOptions(story) {
  return story.volumes.map((volume) => ({
    label: volume.title,
    value: volume.id,
  }));
}

function getArcOptions(story, volumeId) {
  const selectedVolume =
    story.volumes.find((volume) => volume.id === volumeId) ??
    story.volumes[0] ??
    null;

  return (selectedVolume?.arcs ?? []).map((arc) => ({
    label: arc.title,
    value: arc.id,
  }));
}

function DesktopChapterEditor({
  arcOptions,
  chapterBinned,
  draft,
  isBinActionPending,
  onBack,
  onBodyChange,
  onCoinPriceChange,
  onFieldChange,
  onMoveToBin,
  onPremiumToggle,
  onPreview,
  onPublish,
  onPublishTypeChange,
  onRestoreFromBin,
  onSaveDraft,
  onToggleSettings,
  onWarningToggle,
  readTime,
  showSettings,
  story,
  volumeOptions,
  wordCount,
}) {
  const bodyValue = getRichTextPlainText(draft.body);

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex h-screen overflow-hidden">
        <AppDesktopSidebar mode="creator" storySlug={story.slug} />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#393528] px-8">
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link
                className="text-slate-500 transition-colors hover:text-primary"
                to={getCreatorStoryManagementHref(story.slug)}>
                My Stories
              </Link>
              <MaterialSymbol name="chevron_right" className="text-xs text-slate-500" />
              <Link
                className="text-slate-500 transition-colors hover:text-primary"
                to={getCreatorStoryManagementHref(story.slug)}>
                {story.title}
              </Link>
              <MaterialSymbol name="chevron_right" className="text-xs text-slate-500" />
              <span className="text-white">New Chapter</span>
            </nav>

            <div className="flex items-center gap-3">
              <button
                className="flex h-10 items-center gap-2 rounded-lg bg-[#393528] px-4 text-sm font-bold text-white transition-colors hover:bg-[#393528]/80"
                onClick={onPreview}
                type="button">
                <MaterialSymbol name="visibility" className="text-sm" />
                Preview
              </button>
              <button
                className="h-10 rounded-lg bg-[#393528] px-4 text-sm font-bold text-white transition-colors hover:bg-[#393528]/80"
                onClick={onSaveDraft}
                type="button">
                Save Draft
              </button>
              {draft.chapterId && !chapterBinned ? (
                <button
                  className="h-10 rounded-lg border border-amber-500/40 px-3 text-sm font-bold text-amber-100 transition-colors hover:border-amber-400/60 hover:bg-amber-500/10 disabled:opacity-50"
                  disabled={isBinActionPending}
                  onClick={onMoveToBin}
                  type="button">
                  Move to bin
                </button>
              ) : null}
              <button
                className="h-10 rounded-lg bg-primary px-6 text-sm font-bold text-background-dark transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={chapterBinned || isBinActionPending}
                onClick={onPublish}
                title={chapterBinned ? "Restore from bin to publish or schedule" : undefined}
                type="button">
                {draft.publishType === "scheduled" ? "Schedule" : "Publish"}
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#393528] text-white transition-colors hover:bg-[#393528]/80"
                type="button">
                <MaterialSymbol name="more_vert" />
              </button>
            </div>
          </header>

          {chapterBinned ? (
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-amber-500/25 bg-amber-500/10 px-8 py-3 text-sm text-amber-950 dark:text-amber-50">
              <p className="flex min-w-0 flex-1 items-center gap-2">
                <MaterialSymbol name="inventory_2" className="shrink-0 text-amber-600 dark:text-amber-300" />
                <span>
                  This chapter is in your studio bin. Restore it to publish or show it in your main chapter lists again.
                </span>
              </p>
              <button
                className="shrink-0 rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                disabled={isBinActionPending}
                onClick={onRestoreFromBin}
                type="button">
                {isBinActionPending ? "Restoring…" : "Restore from bin"}
              </button>
            </div>
          ) : null}

          <div className="relative flex flex-1 overflow-hidden">
            <button
              aria-label={
                showSettings ? "Hide chapter settings" : "Show chapter settings"
              }
              className={`fixed bottom-20 z-[60] flex size-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 ${
                showSettings
                  ? "right-[21rem] bg-[#393528] text-white hover:bg-[#393528]/90"
                  : "right-8 bg-primary text-slate-900 hover:bg-primary/90"
              }`}
              onClick={onToggleSettings}
              type="button">
              <MaterialSymbol name="settings" className="text-2xl" />
            </button>
            <section className="flex flex-1 justify-center overflow-y-auto p-10">
              <div className="flex w-full max-w-3xl flex-col gap-8">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
                      Chapter Title
                    </label>
                    <input
                      className="w-full outline-none border-none bg-transparent p-0 text-3xl font-black text-white placeholder:text-slate-600 focus:ring-0"
                      name="title"
                      onChange={onFieldChange}
                      placeholder="Enter chapter title..."
                      type="text"
                      value={draft.title}
                    />
                  </div>
                  <div className="w-32">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
                      Number
                    </label>
                    <input
                      className="w-full outline-none border-none bg-transparent p-0 text-right text-3xl font-black text-white placeholder:text-slate-600 focus:ring-0"
                      name="number"
                      onChange={onFieldChange}
                      placeholder="CH-12"
                      type="text"
                      value={draft.number}
                    />
                  </div>
                </div>

                <hr className="border-[#393528]" />

                <textarea
                  className="min-h-[500px] outline-none w-full resize-none border-none bg-transparent p-0 text-lg leading-relaxed text-slate-100/90 placeholder:text-slate-600 focus:ring-0"
                  name="body"
                  onChange={(event) => onBodyChange(event.target.value)}
                  placeholder="Start writing your masterpiece here..."
                  value={bodyValue}
                />
              </div>
            </section>

            <div className="pointer-events-none absolute inset-0 z-40">
              <button
                aria-hidden={!showSettings}
                className={`absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${
                  showSettings ? "pointer-events-auto opacity-100" : "opacity-0"
                }`}
                onClick={onToggleSettings}
                tabIndex={showSettings ? 0 : -1}
                type="button"
              />
              <aside
                className={`pointer-events-auto absolute inset-y-0 right-0 w-80 max-w-full overflow-y-auto border-l border-[#393528]/80 bg-[#27241b]/80 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${
                  showSettings ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                        Chapter Settings
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Publishing, pricing, structure, and warnings.
                      </p>
                    </div>
                    <button
                      className="flex size-9 items-center justify-center rounded-full bg-[#393528] text-white transition-colors hover:bg-[#4b4535]"
                      onClick={onToggleSettings}
                      type="button"
                    >
                      <MaterialSymbol name="close" className="text-lg" />
                    </button>
                  </div>

                  <hr className="border-[#393528]" />

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                      <MaterialSymbol name="calendar_month" className="text-lg text-primary" />
                      Publishing Schedule
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input
                          checked={draft.publishType === "now"}
                          className="border-[#393528] bg-[#27241b] text-primary focus:ring-primary disabled:opacity-40"
                          disabled={chapterBinned}
                          name="publish_type"
                          onChange={() => onPublishTypeChange("now")}
                          type="radio"
                        />
                        <span className="text-sm text-slate-100">
                          Publish immediately
                        </span>
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            checked={draft.publishType === "scheduled"}
                            className="border-[#393528] bg-[#27241b] text-primary focus:ring-primary disabled:opacity-40"
                            disabled={chapterBinned}
                            name="publish_type"
                            onChange={() => onPublishTypeChange("scheduled")}
                            type="radio"
                          />
                          <span className="text-sm text-slate-100">
                            Schedule for later
                          </span>
                        </label>
                        <input
                          className="w-full rounded-lg border border-[#393528] bg-[#27241b] p-2.5 text-sm text-slate-300 focus:border-primary focus:ring-0 disabled:opacity-40"
                          disabled={chapterBinned}
                          name="scheduledFor"
                          onChange={onFieldChange}
                          type="datetime-local"
                          value={draft.scheduledFor}
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#393528]" />

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                      <MaterialSymbol name="local_atm" className="text-lg text-primary" />
                      Chapter Access
                    </h3>
                    <div className="space-y-4 rounded-lg bg-[#27241b] p-4">
                      <label className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Premium Chapter
                          </p>
                          <p className="text-xs text-slate-500">
                            You control chapter pricing. Admin controls release
                            timing and live status.
                          </p>
                        </div>
                        <input
                          checked={draft.premiumEnabled}
                          className="h-4 w-4 rounded border-[#393528] bg-[#151006] text-primary focus:ring-primary"
                          onChange={onPremiumToggle}
                          type="checkbox"
                        />
                      </label>
                      <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
                          Coin Price
                        </label>
                        <input
                          className="w-full rounded-lg border border-[#393528] bg-[#151006] p-2.5 text-sm text-slate-300 focus:border-primary focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={!draft.premiumEnabled}
                          min="0"
                          onChange={onCoinPriceChange}
                          type="number"
                          value={draft.coinUnlockPrice}
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-[#393528]" />

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                      <MaterialSymbol name="account_tree" className="text-lg text-primary" />
                      Story Structure
                    </h3>
                    <div className="space-y-3">
                      <select
                        className="w-full rounded-lg border border-[#393528] bg-[#27241b] p-2.5 text-sm text-slate-300 focus:border-primary focus:ring-0"
                        name="volumeId"
                        onChange={onFieldChange}
                        value={draft.volumeId ?? ""}>
                        <option value="">Select volume</option>
                        {volumeOptions.map((volume) => (
                          <option key={volume.value} value={volume.value}>
                            {volume.label}
                          </option>
                        ))}
                      </select>
                      <select
                        className="w-full rounded-lg border border-[#393528] bg-[#27241b] p-2.5 text-sm text-slate-300 focus:border-primary focus:ring-0"
                        name="arcId"
                        onChange={onFieldChange}
                        value={draft.arcId ?? ""}>
                        <option value="">Select arc</option>
                        {arcOptions.map((arc) => (
                          <option key={arc.value} value={arc.value}>
                            {arc.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <hr className="border-[#393528]" />

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                      <MaterialSymbol name="edit_note" className="text-lg text-primary" />
                      Author&apos;s Note
                    </h3>
                    <textarea
                      className="h-32 w-full rounded-lg border border-[#393528] bg-[#27241b] p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-primary focus:ring-0"
                      name="authorsNote"
                      onChange={onFieldChange}
                      placeholder="Share some thoughts with your readers..."
                      value={draft.authorsNote}
                    />
                  </div>

                  <hr className="border-[#393528]" />

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                      <MaterialSymbol name="warning" className="text-lg text-primary" />
                      Content Warnings
                    </h3>
                    <div className="space-y-2">
                      {warningOptions.map((warning) => (
                        <label
                          className="flex cursor-pointer items-center gap-3 text-sm text-slate-400 transition-colors hover:text-white"
                          key={warning}>
                          <input
                            checked={draft.warnings.includes(warning)}
                            className="rounded border-[#393528] bg-[#27241b] text-primary focus:ring-primary"
                            onChange={() => onWarningToggle(warning)}
                            type="checkbox"
                          />
                          {warning}
                        </label>
                      ))}
                    </div>
                  </div>

                  <hr className="border-[#393528]" />

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
                      <MaterialSymbol name="info" className="text-lg text-primary" />
                      Chapter Stats
                    </h3>
                    <div className="space-y-3 rounded-lg bg-[#27241b] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          Word Count
                        </span>
                        <span className="text-xs font-bold text-white">
                          {wordCount.toLocaleString()} words
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          Read Time
                        </span>
                        <span className="text-xs font-bold text-white">
                          ~{readTime} mins
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-slate-500">
                          Server copy
                        </span>
                        <span className="text-right text-[10px] font-medium text-slate-400">
                          Save draft or publish to persist
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <footer className="flex h-12 shrink-0 items-center gap-6 border-t border-[#393528] bg-[#27241b] px-8">
            <div className="flex items-center gap-4">
              {[
                "format_bold",
                "format_italic",
                "format_list_bulleted",
                "format_quote",
                "image",
              ].map((icon) => (
                <button
                  className="flex items-center gap-1 text-slate-500 transition-colors hover:text-primary"
                  key={icon}
                  type="button">
                  <MaterialSymbol name={icon} className="text-lg" />
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-[#393528]" />
            <div className="ml-auto text-xs font-medium text-slate-500">
              Last saved: {draft.lastSavedAt}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

function MobileChapterEditor({
  arcOptions,
  chapterBinned,
  draft,
  isBinActionPending,
  onBack,
  onBodyChange,
  onCoinPriceChange,
  onFieldChange,
  onMoveToBin,
  onPublish,
  onPremiumToggle,
  onPublishTypeChange,
  onRestoreFromBin,
  onToggleSettings,
  onWarningToggle,
  showSettings,
  story,
  volumeOptions,
  wordCount,
}) {
  const bodyValue = getRichTextPlainText(draft.body);

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-background-light/80 px-4 py-3 backdrop-blur-md dark:border-primary/10 dark:bg-background-dark/80">
        <div className="flex items-center gap-2">
          <button
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/10"
            onClick={onBack}
            type="button">
            <MaterialSymbol name="arrow_back" className="text-xl" />
          </button>
          <div className="flex flex-col min-w-0">
            <h1 className="max-w-[160px] truncate text-base font-bold leading-tight">
              {story.title}
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
              Editing Draft
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/10"
            type="button">
            <MaterialSymbol name="more_vert" className="text-xl" />
          </button>
          <button
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-background-dark transition-transform active:scale-95 disabled:opacity-40"
            disabled={chapterBinned || isBinActionPending}
            onClick={onPublish}
            type="button">
            {draft.publishType === "scheduled" ? "Schedule" : "Publish"}
          </button>
        </div>
      </header>

      {chapterBinned ? (
        <div className="space-y-2 border-b border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-950 dark:text-amber-50">
          <p className="flex items-start gap-2">
            <MaterialSymbol name="inventory_2" className="shrink-0 text-base text-amber-600 dark:text-amber-300" />
            <span>In bin — restore to publish or show in main lists.</span>
          </p>
          <button
            className="w-full rounded-lg bg-amber-600 py-2 text-xs font-bold text-white disabled:opacity-50"
            disabled={isBinActionPending}
            onClick={onRestoreFromBin}
            type="button">
            {isBinActionPending ? "Restoring…" : "Restore from bin"}
          </button>
        </div>
      ) : null}

      <main className="flex flex-1 flex-col overflow-y-auto pb-24">
        <div className="px-4 pt-4 pb-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {draft.number}
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {wordCount.toLocaleString()} words
            </div>
          </div>
          <input
            className="mb-3 outline-none w-full border-none bg-transparent p-0 text-xl font-bold placeholder:text-slate-400 focus:ring-0 dark:placeholder:text-slate-600"
            name="title"
            onChange={onFieldChange}
            placeholder="Chapter Title..."
            type="text"
            value={draft.title}
          />
        </div>

        <div className="flex-1 px-4">
          <textarea
            className="h-screen outline-none w-full resize-none border-none bg-transparent p-0 pb-32 text-base leading-relaxed placeholder:text-slate-400 focus:ring-0 dark:placeholder:text-slate-600"
            name="body"
            onChange={(event) => onBodyChange(event.target.value)}
            placeholder="Start writing your story here..."
            value={bodyValue}
          />
        </div>
      </main>

      <button
        aria-label={
          showSettings ? "Hide chapter settings" : "Show chapter settings"
        }
        className={`fixed bottom-24 right-4 z-50 flex size-12 items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
          showSettings
            ? "bg-slate-700 text-white dark:bg-slate-600"
            : "bg-primary text-slate-900"
        }`}
        onClick={onToggleSettings}
        type="button">
        <MaterialSymbol name="settings" className="text-2xl" />
      </button>

      {/* <div className="fixed bottom-24 left-1/2 z-40 flex w-[90%] max-w-md -translate-x-1/2 items-center justify-around rounded-xl border border-slate-200 bg-white/90 p-1.5 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/90">
        {["format_bold", "format_italic", "format_list_bulleted", "image"].map(
          (icon) => (
            <button
              className="p-1.5 transition-colors hover:text-primary"
              key={icon}
              type="button">
              <MaterialSymbol name={icon} className="text-lg" />
            </button>
          ),
        )}
        <div className="mx-0.5 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        {["undo", "redo", "settings_suggest"].map((icon) => (
          <button
            className={`p-1.5 transition-colors ${
              icon === "settings_suggest" ? "text-primary" : "hover:text-primary"
            }`}
            key={icon}
            type="button">
            <MaterialSymbol name={icon} className="text-lg" />
          </button>
        ))}
      </div> */}

      <div className="pointer-events-none fixed inset-0 z-[70] md:hidden">
        <button
          aria-hidden={!showSettings}
          className={`absolute inset-0 bg-slate-950/55 backdrop-blur-sm transition-opacity duration-300 ${
            showSettings ? "pointer-events-auto opacity-100" : "opacity-0"
          }`}
          onClick={onToggleSettings}
          tabIndex={showSettings ? 0 : -1}
          type="button"
        />

        <section
          className={`pointer-events-auto absolute inset-x-0 bottom-0 max-h-[78vh] overflow-y-auto rounded-t-[1.75rem] border-t border-slate-200/70 bg-white/95 px-4 pb-8 pt-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out dark:border-white/10 dark:bg-slate-950/90 ${
            showSettings ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">Chapter Settings</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Adjust chapter access, structure, and release details.
              </p>
            </div>
            <button
              className="flex size-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              onClick={onToggleSettings}
              type="button"
            >
              <MaterialSymbol name="close" className="text-lg" />
            </button>
          </div>

          <div className="space-y-3 pb-6">
            <div className="mx-auto h-1.5 w-14 rounded-full bg-slate-300 dark:bg-slate-700" />

            <div className="rounded-lg border border-slate-200 p-3 dark:border-primary/10">
              <div className="mb-2 flex items-center gap-2">
                <MaterialSymbol name="account_tree" className="text-base text-primary" />
                <span className="text-sm font-medium">Story Structure</span>
              </div>
              <div className="space-y-2">
                <select
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-primary/10 dark:bg-background-dark/70"
                  name="volumeId"
                  onChange={onFieldChange}
                  value={draft.volumeId ?? ""}>
                  <option value="">Select volume</option>
                  {volumeOptions.map((volume) => (
                    <option key={volume.value} value={volume.value}>
                      {volume.label}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-primary/10 dark:bg-background-dark/70"
                  name="arcId"
                  onChange={onFieldChange}
                  value={draft.arcId ?? ""}>
                  <option value="">Select arc</option>
                  {arcOptions.map((arc) => (
                    <option key={arc.value} value={arc.value}>
                      {arc.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            

            <details
              className="group rounded-lg border border-slate-200 bg-slate-50 dark:border-primary/10 dark:bg-primary/5"
              open>
              <summary className="flex cursor-pointer list-none items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="edit_note" className="text-base text-primary" />
                  <span className="text-sm font-medium">
                    Author&apos;s Note
                  </span>
                </div>
                <MaterialSymbol name="expand_more" className="text-lg transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-3 pb-3">
                <textarea
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-background-dark"
                  name="authorsNote"
                  onChange={onFieldChange}
                  placeholder="Add a note for your readers..."
                  rows="3"
                  value={draft.authorsNote}
                />
              </div>
            </details>

            <div className="rounded-lg border border-slate-200 p-3 dark:border-primary/10">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MaterialSymbol name="calendar_month" className="text-base text-primary" />
                  <span className="text-sm font-medium">Schedule Publish</span>
                </div>
                <span className="text-xs font-bold text-primary">
                  {draft.publishType === "scheduled" ? "On" : "Off"}
                </span>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    checked={draft.publishType === "now"}
                    className="size-3.5"
                    disabled={chapterBinned}
                    onChange={() => onPublishTypeChange("now")}
                    type="radio"
                  />
                  Publish immediately
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    checked={draft.publishType === "scheduled"}
                    className="size-3.5"
                    disabled={chapterBinned}
                    onChange={() => onPublishTypeChange("scheduled")}
                    type="radio"
                  />
                  Schedule for later
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-primary/10 dark:bg-background-dark/70 disabled:opacity-40"
                  disabled={chapterBinned}
                  name="scheduledFor"
                  onChange={onFieldChange}
                  type="datetime-local"
                  value={draft.scheduledFor}
                />
              </div>
            </div>

            {draft.chapterId && !chapterBinned ? (
              <button
                className="w-full rounded-lg border border-amber-500/40 py-2.5 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-500/10 dark:text-amber-200"
                disabled={isBinActionPending}
                onClick={onMoveToBin}
                type="button"
              >
                Move chapter to bin
              </button>
            ) : null}

            <div className="rounded-lg border border-slate-200 p-3 dark:border-primary/10">
              <div className="mb-2 flex items-center gap-2">
                <MaterialSymbol name="warning" className="text-base text-primary" />
                <span className="text-sm font-medium">Content Warnings</span>
              </div>
              <div className="space-y-1.5">
                {warningOptions.map((warning) => (
                  <label
                    className="flex items-center gap-2 text-xs"
                    key={warning}>
                    <input
                      checked={draft.warnings.includes(warning)}
                      className="size-3.5"
                      onChange={() => onWarningToggle(warning)}
                      type="checkbox"
                    />
                    {warning}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <AppMobileTabBar mode="creator" storySlug={story.slug} />
    </div>
  );
}

export default function ChapterEditorPage() {
  const navigate = useNavigate();
  const { storySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    enterWriterMode,
    getChapterDraft,
    getStory,
    isLoadingChapterDraft,
    isStudioLoading,
    loadChapterDraft,
    moveChapterToStudioBin,
    publishChapter,
    restoreChapterFromStudioBin,
    saveChapterDraft,
    scheduleChapter,
    setActiveStory,
    showCreatorNotice,
    updateChapterDraft,
  } = useCreator();
  const chapterId = searchParams.get("chapterId");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isBinActionPending, setIsBinActionPending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const story = getStory(storySlug);
  const draft = getChapterDraft(storySlug, chapterId);
  const chapterBinned = Boolean(draft.isBinned);
  const wordCount = getWordCount(draft.body);
  const readTime = Math.max(1, Math.ceil(wordCount / 225));
  const volumeOptions = story ? getVolumeOptions(story) : [];
  const arcOptions = story ? getArcOptions(story, draft.volumeId) : [];

  useEffect(() => {
    enterWriterMode();

    if (storySlug) {
      setActiveStory(storySlug);
    }
  }, [storySlug]);

  useEffect(() => {
    if (!storySlug || !chapterId) {
      return;
    }

    loadChapterDraft(storySlug, chapterId).catch(() => {});
  }, [chapterId, storySlug]);

  function handleFieldChange(event) {
    const { name, value } = event.target;
    const nextValue =
      (name === "volumeId" || name === "arcId") && !value ? null : value;
    const nextDraft =
      name === "volumeId"
        ? {
            ...draft,
            arcId: null,
            [name]: nextValue,
          }
        : {
            ...draft,
            [name]: nextValue,
          };

    updateChapterDraft(story.slug, nextDraft, chapterId);
  }

  function handleBodyChange(body) {
    updateChapterDraft(
      story.slug,
      {
        ...draft,
        body,
      },
      chapterId,
    );
  }

  function handlePublishTypeChange(value) {
    updateChapterDraft(
      story.slug,
      {
        ...draft,
        publishType: value,
      },
      chapterId,
    );
  }

  function handlePremiumToggle() {
    updateChapterDraft(
      story.slug,
      {
        ...draft,
        coinUnlockPrice: draft.premiumEnabled
          ? 0
          : Math.max(1, Number(draft.coinUnlockPrice) || 50),
        premiumEnabled: !draft.premiumEnabled,
      },
      chapterId,
    );
  }

  function handleCoinPriceChange(event) {
    updateChapterDraft(
      story.slug,
      {
        ...draft,
        coinUnlockPrice: Math.max(0, Number(event.target.value) || 0),
      },
      chapterId,
    );
  }

  function handleWarningToggle(warning) {
    updateChapterDraft(
      story.slug,
      {
        ...draft,
        warnings: toggleWarning(draft.warnings, warning),
      },
      chapterId,
    );
  }

  async function handleSaveDraft() {
    try {
      const response = await saveChapterDraft(story.slug, draft);

      if (!chapterId && response.chapterDraft.chapterId) {
        setSearchParams(
          (currentParams) => {
            const nextParams = new URLSearchParams(currentParams);
            nextParams.set("chapterId", response.chapterDraft.chapterId);
            return nextParams;
          },
          { replace: true },
        );
      }
    } catch {
      // Errors are surfaced through the creator notice system.
    }
  }

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

  async function handlePublish() {
    if (chapterBinned) {
      showCreatorNotice("Restore this chapter from the bin before publishing or scheduling.", "info");
      return;
    }

    setIsPublishing(true);
    try {
      if (draft.publishType === "scheduled") {
        await scheduleChapter(story.slug, draft);
        navigate(getCreatorScheduledChaptersHref(story.slug));
        return;
      }

      await publishChapter(story.slug, draft);
      navigate(getCreatorPublishedChaptersHref(story.slug));
    } catch {
      // Errors are surfaced through the creator notice system.
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleMoveToBin() {
    if (!draft.chapterId) {
      return;
    }

    const ok = globalThis.confirm(
      "Move this chapter to the bin? It will disappear from your main chapter lists and structure until you restore it. Scheduled releases for this chapter will be cleared.",
    );

    if (!ok) {
      return;
    }

    setIsBinActionPending(true);
    try {
      await moveChapterToStudioBin(story.slug, draft.chapterId);
      navigate(getCreatorChapterBinHref(story.slug));
    } catch {
      // Errors are surfaced through the creator notice system.
    } finally {
      setIsBinActionPending(false);
    }
  }

  async function handleRestoreFromBin() {
    if (!draft.chapterId) {
      return;
    }

    setIsBinActionPending(true);
    try {
      await restoreChapterFromStudioBin(story.slug, draft.chapterId);
    } catch {
      // Errors are surfaced through the creator notice system.
    } finally {
      setIsBinActionPending(false);
    }
  }

  function handleBack() {
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
        description="That studio project is not available yet. Start a new story or return to your dashboard."
        secondaryLabel="Back To Dashboard"
        secondaryTo={authorDashboardHref}
        title="Story Not Found"
        tone="error"
      />
    );
  }

  if (chapterId && isLoadingChapterDraft && !draft.chapterId) {
    return <RouteLoadingScreen />;
  }

  if (isPublishing) {
    return <PageLoadingSpinner />;
  }

  return (
    <>
      <DesktopChapterEditor
        arcOptions={arcOptions}
        chapterBinned={chapterBinned}
        draft={draft}
        isBinActionPending={isBinActionPending}
        onBack={handleBack}
        onBodyChange={handleBodyChange}
        onCoinPriceChange={handleCoinPriceChange}
        onFieldChange={handleFieldChange}
        onMoveToBin={handleMoveToBin}
        onPremiumToggle={handlePremiumToggle}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onPublishTypeChange={handlePublishTypeChange}
        onRestoreFromBin={handleRestoreFromBin}
        onSaveDraft={handleSaveDraft}
        onToggleSettings={() => setShowSettings((s) => !s)}
        onWarningToggle={handleWarningToggle}
        readTime={readTime}
        showSettings={showSettings}
        story={story}
        volumeOptions={volumeOptions}
        wordCount={wordCount}
      />
      <MobileChapterEditor
        arcOptions={arcOptions}
        chapterBinned={chapterBinned}
        draft={draft}
        isBinActionPending={isBinActionPending}
        onBack={handleBack}
        onBodyChange={handleBodyChange}
        onCoinPriceChange={handleCoinPriceChange}
        onFieldChange={handleFieldChange}
        onMoveToBin={handleMoveToBin}
        onPublish={handlePublish}
        onPremiumToggle={handlePremiumToggle}
        onPublishTypeChange={handlePublishTypeChange}
        onRestoreFromBin={handleRestoreFromBin}
        onToggleSettings={() => setShowSettings((s) => !s)}
        onWarningToggle={handleWarningToggle}
        showSettings={showSettings}
        story={story}
        volumeOptions={volumeOptions}
        wordCount={wordCount}
      />
    </>
  );
}
