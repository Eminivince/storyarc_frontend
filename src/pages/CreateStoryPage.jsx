import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import { useCreator } from "../context/CreatorContext";
import {
  authorDashboardHref,
  createStoryCallouts,
  getCreatorStoryManagementHref,
  storyAudienceOptions,
  storyGenreOptions,
  storyTagSuggestions,
} from "../data/creatorFlow";

function updateTags(tags, tag) {
  if (tags.includes(tag)) {
    return tags.filter((entry) => entry !== tag);
  }

  return [...tags, tag];
}

function DesktopCreateStory({
  form,
  isCreating,
  isUploadingCover,
  onAudienceChange,
  onChange,
  onCoverChange,
  onSubmit,
  onTagToggle,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen overflow-hidden">
        <AppDesktopSidebar mode="creator" />

        <main className="flex-1 overflow-y-auto bg-white/50 dark:bg-black/20">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light/80 px-8 py-4 backdrop-blur-md dark:bg-background-dark/80">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                My Stories
              </span>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="font-semibold text-primary">
                Create New Story
              </span>
            </div>
            <div className="flex items-center gap-4">
              <label className="relative hidden lg:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  className="w-64 rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-base focus:ring-1 focus:ring-primary dark:bg-slate-800"
                  placeholder="Search documentation..."
                  type="text"
                />
              </label>
              <button
                className="relative p-2 text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
                type="button">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-5xl px-8 py-10">
            <div className="mb-8 mt-6">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Create New Story
              </h2>
              <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
                Embark on a new literary journey. Fill out the details below to
                set up your serial profile and move directly into chapter
                production.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <label className="mb-4 block text-base font-semibold text-slate-700 dark:text-slate-300">
                    Story Cover
                  </label>
                  <label className="group relative block aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
                    <input
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="sr-only"
                      onChange={onCoverChange}
                      type="file"
                    />
                    {form.coverImage ? (
                      <img
                        alt="Story cover"
                        className="absolute inset-0 size-full object-cover opacity-40"
                        src={form.coverImage}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                      <span className="material-symbols-outlined text-4xl text-primary/70">
                        add_photo_alternate
                      </span>
                      <div>
                        <p className="text-sm font-medium">
                          {isUploadingCover
                            ? "Uploading cover..."
                            : "Upload Portrait Cover"}
                        </p>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                          Recommended: 600x900px
                          <br />
                          JPG, PNG, WebP
                        </p>
                      </div>
                    </div>
                  </label>
                  <div className="mt-4 space-y-3">
                    {createStoryCallouts.map((item) => (
                      <div
                        className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400"
                        key={item}>
                        <span className="material-symbols-outlined text-sm text-primary">
                          info
                        </span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8 lg:col-span-2">
                <Reveal className="space-y-6 rounded-xl border border-primary/5 bg-slate-50 p-6 dark:bg-slate-900/40">
                  <div>
                    <label
                      className="mb-2 block text-base font-semibold text-slate-700 dark:text-slate-300"
                      htmlFor="story-title">
                      Story Title
                    </label>
                    <input
                      className="w-full outline-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-base transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                      id="story-title"
                      name="title"
                      onChange={onChange}
                      placeholder="Enter a catchy title for your novel"
                      type="text"
                      value={form.title}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-base font-semibold text-slate-700 dark:text-slate-300"
                      htmlFor="story-synopsis">
                      Synopsis / Description
                    </label>
                    <textarea
                      className="w-full outline-none resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-base transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                      id="story-synopsis"
                      name="synopsis"
                      onChange={onChange}
                      placeholder="What is your story about? Hook your readers..."
                      rows="6"
                      value={form.synopsis}
                    />
                    <p className="mt-1 text-right text-xs text-slate-500">
                      {form.synopsis.length} / 2000 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label
                        className="mb-2 block text-base font-semibold text-slate-700 dark:text-slate-300"
                        htmlFor="story-genre">
                        Primary Genre
                      </label>
                      <div className="relative">
                        <select
                          className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-transparent focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                          id="story-genre"
                          name="genre"
                          onChange={onChange}
                          value={form.genre}>
                          <option value="">Select Genre</option>
                          {storyGenreOptions.map((genre) => (
                            <option key={genre} value={genre}>
                              {genre}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-base font-semibold text-slate-700 dark:text-slate-300">
                        Target Audience
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {storyAudienceOptions.map((option) => {
                          const isActive = form.audience === option;

                          return (
                            <button
                              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                                isActive
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary dark:border-primary/20 dark:text-slate-400"
                              }`}
                              key={option}
                              onClick={() => onAudienceChange(option)}
                              type="button">
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Tags
                    </label>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <button
                          className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary"
                          key={tag}
                          onClick={() => onTagToggle(tag)}
                          type="button">
                          {tag}
                          <span className="material-symbols-outlined text-[14px]">
                            close
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {storyTagSuggestions.map((tag) => {
                        const isActive = form.tags.includes(tag);

                        return (
                          <button
                            className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                              isActive
                                ? "border-primary bg-primary text-slate-900"
                                : "border-slate-200 text-slate-500 hover:border-primary/30 hover:text-primary dark:border-primary/20 dark:text-slate-400"
                            }`}
                            key={tag}
                            onClick={() => onTagToggle(tag)}
                            type="button">
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>

                <section className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      checked={form.termsAccepted}
                      className="mt-1 size-5 rounded border-slate-300 bg-transparent text-primary focus:ring-primary"
                      id="story-terms"
                      name="termsAccepted"
                      onChange={onChange}
                      type="checkbox"
                    />
                    <label
                      className="text-sm text-slate-600 dark:text-slate-400"
                      htmlFor="story-terms">
                      I confirm that I own the rights to this story and agree to
                      TaleStead&apos;s{" "}
                      <Link
                        className="text-primary hover:underline"
                        onClick={(event) => event.stopPropagation()}
                        to="/terms">
                        Terms of Service
                      </Link>
                      .
                    </label>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      className="flex items-center justify-center gap-2 rounded-lg bg-primary px-12 py-4 font-black uppercase tracking-wider text-background-dark transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isCreating || !form.termsAccepted}
                      onClick={onSubmit}
                      type="button">
                      <span className="material-symbols-outlined font-bold">
                        auto_awesome
                      </span>
                      {isCreating ? "Creating..." : "Create Story"}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileCreateStory({
  form,
  isCreating,
  isUploadingCover,
  onAudienceChange,
  onChange,
  onCoverChange,
  onSubmit,
  onTagToggle,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-background-light px-4 py-3 dark:border-primary/20 dark:bg-background-dark">
        <div className="flex items-center gap-2">
          <Link
            className="flex size-9 items-center justify-center rounded-lg text-slate-900 transition-colors hover:bg-slate-200 dark:text-slate-100 dark:hover:bg-primary/20"
            to={authorDashboardHref}>
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
          </Link>
          <h2 className="text-base font-bold tracking-tight text-primary">
            TaleStead
          </h2>
        </div>
        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-lg">person</span>
        </div>
      </header>

      <main className="space-y-5 px-4 py-4 pb-24">
        <h1 className="text-xl font-bold tracking-tight">Create New Story</h1>

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Story Cover</h3>
          <label className="relative mx-auto block aspect-[3/4] w-full max-w-[200px] cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 dark:border-primary/30 dark:bg-primary/5">
            <input
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              onChange={onCoverChange}
              type="file"
            />
            {form.coverImage ? (
              <img
                alt="Story cover"
                className="absolute inset-0 size-full object-cover opacity-40"
                src={form.coverImage}
              />
            ) : null}
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
              <span className="material-symbols-outlined mb-1 text-3xl text-primary">
                add_a_photo
              </span>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {isUploadingCover ? "Uploading..." : "Tap to upload"}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-500">
                600×800px
              </p>
            </div>
          </label>
        </section>

        <section className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              htmlFor="mobile-story-title">
              Story Title
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-base outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-primary/5 dark:placeholder:text-slate-600"
              id="mobile-story-title"
              name="title"
              onChange={onChange}
              placeholder="Enter your story title..."
              type="text"
              value={form.title}
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              htmlFor="mobile-story-synopsis">
              Synopsis / Description
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-base outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-primary/5 dark:placeholder:text-slate-600"
              id="mobile-story-synopsis"
              name="synopsis"
              onChange={onChange}
              placeholder="Write a brief overview..."
              rows="3"
              value={form.synopsis}
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              htmlFor="mobile-story-genre">
              Primary Genre
            </label>
            <select
              className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-base outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-primary/5"
              id="mobile-story-genre"
              name="genre"
              onChange={onChange}
              value={form.genre}>
              <option value="">Select a genre</option>
              {storyGenreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Audience
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {storyAudienceOptions.map((option) => {
                const isActive = form.audience === option;

                return (
                  <button
                    className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-slate-200 text-slate-600 dark:border-primary/20 dark:text-slate-400"
                    }`}
                    key={option}
                    onClick={() => onAudienceChange(option)}
                    type="button">
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tags
            </label>
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <button
                  className="inline-flex items-center gap-0.5 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-slate-900"
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  type="button">
                  {tag}
                  <span className="material-symbols-outlined text-xs">
                    close
                  </span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {storyTagSuggestions.map((tag) => {
                const isActive = form.tags.includes(tag);

                return (
                  <button
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-slate-200 text-slate-500 dark:border-primary/20 dark:text-slate-400"
                    }`}
                    key={tag}
                    onClick={() => onTagToggle(tag)}
                    type="button">
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              checked={form.termsAccepted}
              className="mt-0.5 size-4 rounded border-slate-300 bg-transparent text-primary focus:ring-primary"
              id="mobile-story-terms"
              name="termsAccepted"
              onChange={onChange}
              type="checkbox"
            />
            <label
              className="text-xs text-slate-600 dark:text-slate-400"
              htmlFor="mobile-story-terms">
              I agree to the{" "}
              <Link
                className="text-primary hover:underline"
                onClick={(event) => event.stopPropagation()}
                to="/terms">
                Terms of Service
              </Link>{" "}
              and confirm I own all rights to this content.
            </label>
          </div>

          <div className="pt-6">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-slate-900 shadow-lg shadow-primary/20 transition-all disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isCreating || !form.termsAccepted}
              onClick={onSubmit}
              type="button">
              <span className="material-symbols-outlined text-lg">
                auto_stories
              </span>
              {isCreating ? "Creating..." : "Create Story"}
            </button>
          </div>
        </section>
      </main>

      <AppMobileTabBar mode="creator" />
    </div>
  );
}

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const {
    createStory,
    enterWriterMode,
    isSavingStory,
    isUploadingStoryCover,
    storyDraft,
    uploadStoryCover,
    updateStoryDraft,
  } = useCreator();

  useEffect(() => {
    enterWriterMode();
  }, []);

  function handleChange(event) {
    const { checked, name, type, value } = event.target;

    updateStoryDraft({
      ...storyDraft,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleAudienceChange(option) {
    updateStoryDraft({
      ...storyDraft,
      audience: option,
    });
  }

  function handleTagToggle(tag) {
    updateStoryDraft({
      ...storyDraft,
      tags: updateTags(storyDraft.tags, tag),
    });
  }

  async function handleCoverChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      await uploadStoryCover(file);
    } catch {
      // Errors are surfaced through the creator notice system.
    } finally {
      event.target.value = "";
    }
  }

  async function handleSubmit() {
    try {
      const nextSlug = await createStory(storyDraft);
      navigate(getCreatorStoryManagementHref(nextSlug));
    } catch {
      // Errors are surfaced through the creator notice system.
    }
  }

  return (
    <>
      <DesktopCreateStory
        form={storyDraft}
        isCreating={isSavingStory}
        isUploadingCover={isUploadingStoryCover}
        onAudienceChange={handleAudienceChange}
        onChange={handleChange}
        onCoverChange={handleCoverChange}
        onSubmit={handleSubmit}
        onTagToggle={handleTagToggle}
      />
      <MobileCreateStory
        form={storyDraft}
        isCreating={isSavingStory}
        isUploadingCover={isUploadingStoryCover}
        onAudienceChange={handleAudienceChange}
        onChange={handleChange}
        onCoverChange={handleCoverChange}
        onSubmit={handleSubmit}
        onTagToggle={handleTagToggle}
      />
    </>
  );
}
