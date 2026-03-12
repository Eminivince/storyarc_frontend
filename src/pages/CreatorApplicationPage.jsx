import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountNotice from "../components/AccountNotice";
import {
  useCreator,
} from "../context/CreatorContext";
import {
  creatorExperienceLevels,
  creatorGenres,
  creatorMobileGenres,
  creatorSubmittedHref,
} from "../data/creatorFlow";

function DesktopCreatorApplication({
  clearNotice,
  form,
  isSaving,
  isSubmitted,
  isSubmitting,
  notice,
  onChange,
  onExperienceSelect,
  onSaveDraft,
  onSubmit,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-background-light px-6 py-3 backdrop-blur-md dark:border-primary/20 dark:bg-background-dark/50 lg:px-40">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">StoryArc</h2>
          </div>
          <div className="flex flex-1 items-center justify-end gap-8">
            <nav className="hidden items-center gap-8 md:flex">
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" to="/search">
                Browse
              </Link>
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" to="/about">
                Features
              </Link>
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" to="/about">
                Community
              </Link>
            </nav>
            <Link
              className="flex min-w-[100px] items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-background-dark transition-transform hover:scale-105"
              to="/dashboard"
            >
              Sign In
            </Link>
            <Link
              className="size-10 rounded-full border-2 border-primary/30 bg-cover bg-center"
              to="/account/profile"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuACmFzaknY8aYP_LEZT5Vc8NxoF8ewNP6xE-nwHbLG_KS5ToUpzFKNvqFIIjkmGNMjGfoVBXDGLZ-BUpIJzI4vB7Vd49ECMVdi3gChDEKDarTYbJALiCqzGnMBkDwsQRRVP4l4Nrfl1WAX8zH-_DRbh2lW7woxyr2bQSmsAdskXyhiOT8rPKPCism3CGhUgJ5xhoTsb5Zz_9OB3PU6BeKPXitewYFBuyWf3rDFMzM7yaoXEIyBE9129odSf6QxH65GweyLTtxcIdhI')",
              }}
            />
          </div>
        </header>

        <main className="flex flex-1 justify-center px-6 py-12">
          <div className="flex w-full max-w-[800px] flex-col gap-8">
            <AccountNotice notice={notice} onDismiss={clearNotice} />

            <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-primary/20 bg-primary/5 p-8">
              <div className="flex max-w-lg flex-col gap-3">
                <h1 className="text-4xl font-black leading-tight tracking-tight lg:text-5xl">
                  Become a StoryArc Author
                </h1>
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Join our community of elite storytellers and share your voice with a
                  global audience of passionate readers.
                </p>
              </div>
              <Link
                className="flex min-w-[200px] items-center justify-center rounded-lg border border-primary/20 bg-slate-200 px-6 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-primary/20 dark:bg-primary/10 dark:text-primary"
                to="/account/help"
              >
                <span className="material-symbols-outlined mr-2 text-lg">description</span>
                Author Guidelines
              </Link>
            </div>

            <form
              className="flex flex-col gap-10 rounded-xl border border-slate-200 bg-white p-8 shadow-xl shadow-black/5 dark:border-primary/10 dark:bg-background-dark/30 lg:p-12"
              onSubmit={onSubmit}
            >
              <section className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary font-bold text-background-dark">
                    1
                  </span>
                  <h2 className="text-xl font-bold">Primary Writing Genre</h2>
                </div>
                <div className="max-w-md">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Choose the genre that best represents your work
                    </span>
                    <select
                      className="h-12 rounded-lg border border-slate-300 bg-slate-50 px-4 text-slate-900 transition-all focus:border-primary focus:ring-primary dark:border-primary/20 dark:bg-background-dark dark:text-white disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={isSubmitted}
                      onChange={onChange("primaryGenre")}
                      value={form.primaryGenre}
                    >
                      {creatorGenres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary font-bold text-background-dark">
                    2
                  </span>
                  <h2 className="text-xl font-bold">Writing Experience</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {creatorExperienceLevels.map((level) => {
                    const selected = form.experience === level.id;

                    return (
                      <button
                        className={`rounded-lg border p-5 text-left transition-colors ${
                          selected
                            ? "border-primary/60 bg-primary/10"
                            : "border-slate-200 bg-slate-50/50 hover:border-primary/60 dark:border-primary/20 dark:bg-transparent"
                        } ${isSubmitted ? "cursor-default" : ""}`}
                        disabled={isSubmitted}
                        key={level.id}
                        onClick={() => onExperienceSelect(level.id)}
                        type="button"
                      >
                        <span className="font-bold">{level.title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {level.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary font-bold text-background-dark">
                    3
                  </span>
                  <h2 className="text-xl font-bold">Portfolio or Writing Sample</h2>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Share a link to your blog, portfolio, or a published sample
                  </label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="material-symbols-outlined text-primary/60 group-focus-within:text-primary">
                        link
                      </span>
                    </div>
                    <input
                      className="block h-12 w-full rounded-lg border border-slate-300 bg-slate-50 pl-12 pr-4 text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-primary/20 dark:bg-background-dark dark:text-white dark:placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={isSubmitted}
                      onChange={onChange("portfolioUrl")}
                      placeholder="https://yourportfolio.com/writing-sample"
                      type="url"
                      value={form.portfolioUrl}
                    />
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary font-bold text-background-dark">
                    4
                  </span>
                  <h2 className="text-xl font-bold">Why StoryArc?</h2>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Tell us what draws you to our platform and your goals as an author
                    (min 100 words)
                  </label>
                  <textarea
                    className="block w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-4 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-primary/20 dark:bg-background-dark dark:text-white dark:placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isSubmitted}
                    onChange={onChange("motivation")}
                    placeholder="I want to join StoryArc because..."
                    rows="5"
                    value={form.motivation}
                  />
                </div>
              </section>

              <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-6 dark:border-primary/10 md:flex-row">
                <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  {isSubmitted ? (
                    "Your application has been submitted and is under review."
                  ) : (
                    <>
                      By submitting this form, you agree to our{" "}
                      <Link className="text-primary hover:underline" to="/terms">
                        Author Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link className="text-primary hover:underline" to="/privacy">
                        Privacy Policy
                      </Link>
                      .
                    </>
                  )}
                </p>
                <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
                  {isSubmitted ? (
                    <Link
                      className="flex min-w-[240px] items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-lg font-black text-background-dark transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
                      to={creatorSubmittedHref}
                    >
                      View Application Status
                      <span className="material-symbols-outlined ml-2">arrow_forward</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        disabled={isSaving || isSubmitting}
                        className="h-14 rounded-lg px-6 text-base font-semibold text-slate-500 transition-colors hover:text-primary"
                        onClick={onSaveDraft}
                        type="button"
                      >
                        {isSaving ? "Saving Draft..." : "Save Draft and Exit"}
                      </button>
                      <button
                        className="flex min-w-[240px] items-center justify-center rounded-lg bg-primary px-8 text-lg font-black text-background-dark transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isSaving || isSubmitting}
                        type="submit"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                        <span className="material-symbols-outlined ml-2">send</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>

            <div className="flex justify-center gap-8 py-6">
              <Link
                className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
                to="/account/help"
              >
                <span className="material-symbols-outlined text-base">help</span>
                Need help with your application?
              </Link>
              <Link
                className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
                to="/account/help"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                Contact Support
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileCreatorApplication({
  clearNotice,
  form,
  isSaving,
  isSubmitted,
  isSubmitting,
  notice,
  onChange,
  onExperienceSelect,
  onGenreSelect,
  onSaveDraft,
  onSubmit,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
        <header className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
          <Link className="flex size-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-slate-200 dark:hover:bg-primary/20" to="/creator">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <h2 className="flex-1 pr-9 text-center text-base font-bold tracking-tight">
            Become an Author
          </h2>
        </header>

        <div className="flex flex-col gap-2 px-4 py-3">
          <div className="flex justify-between gap-4">
            <p className="text-sm font-medium">Step 2 of 5</p>
            <p className="text-xs font-bold text-primary">40% Complete</p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-primary/20">
            <div className="h-full rounded-full bg-primary" style={{ width: "40%" }} />
          </div>
        </div>

        <div className="px-4 pt-3">
          <h3 className="text-lg font-bold leading-tight">Application Form</h3>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
            Tell us about your creative journey.
          </p>
        </div>

        <div className="px-4 pt-3">
          <AccountNotice notice={notice} onDismiss={clearNotice} />
        </div>

        <form className="flex flex-col gap-4 p-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Personal Information
            </h4>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Full Name</label>
              <input
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-primary/30 dark:bg-background-dark/50 dark:text-slate-100 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitted}
                onChange={onChange("fullName")}
                placeholder="Enter your legal name"
                type="text"
                value={form.fullName}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Email Address</label>
              <input
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-primary/30 dark:bg-background-dark/50 dark:text-slate-100 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitted}
                onChange={onChange("email")}
                placeholder="hello@example.com"
                type="email"
                value={form.email}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Primary Genre
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {creatorMobileGenres.map((genre) => {
                const selected = form.primaryGenre === genre;

                return (
                  <button
                    className={`rounded-lg border p-2.5 text-sm font-semibold transition-colors ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-slate-300 bg-white text-slate-900 dark:border-primary/20 dark:bg-background-dark/50 dark:text-slate-100"
                    } ${isSubmitted ? "cursor-default" : ""}`}
                    disabled={isSubmitted}
                    key={genre}
                    onClick={() => onGenreSelect(genre)}
                    type="button"
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Writing Experience
            </h4>
            <div className="flex flex-col gap-2">
              {creatorExperienceLevels.map((level) => {
                const selected = form.experience === level.id;

                return (
                  <button
                    className={`flex items-center rounded-lg border border-slate-300 bg-white p-3 text-left transition-colors hover:border-primary/60 dark:border-primary/20 dark:bg-background-dark/50 ${isSubmitted ? "cursor-default" : ""}`}
                    disabled={isSubmitted}
                    key={level.id}
                    onClick={() => onExperienceSelect(level.id)}
                    type="button"
                  >
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-slate-400">
                      <div
                        className={`h-2 w-2 rounded-full bg-primary transition-transform ${
                          selected ? "scale-100" : "scale-0"
                        }`}
                      />
                    </div>
                    <div className="ml-3 min-w-0">
                      <p className="text-sm font-bold">{level.title}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        {level.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Your Motivation
            </h4>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Why do you want to join us?</label>
              <textarea
                className="min-h-[100px] resize-none rounded-lg border border-slate-300 bg-white p-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-primary/30 dark:bg-background-dark/50 dark:text-slate-100 dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitted}
                onChange={onChange("motivation")}
                placeholder="Describe your goals as an author..."
                value={form.motivation}
              />
              <p className="text-right text-[10px] text-slate-500 dark:text-slate-400">
                Min. 200 characters
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Portfolio (Optional)
            </h4>
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white p-5 text-center dark:border-primary/30 dark:bg-background-dark/30">
              <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
              <div>
                <p className="text-sm font-medium">Upload writing samples</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  PDF, DOCX up to 10MB
                </p>
              </div>
              <button
                className="mt-1 rounded-full border border-primary px-4 py-1.5 text-xs font-bold text-primary disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitted}
                type="button"
              >
                Browse Files
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 pb-8">
            {isSubmitted ? (
              <Link
                className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
                to={creatorSubmittedHref}
              >
                View Application Status
                <span className="material-symbols-outlined ml-2 text-base">arrow_forward</span>
              </Link>
            ) : (
              <>
                <button
                  className="h-12 rounded-xl bg-primary text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSaving || isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  disabled={isSaving || isSubmitting}
                  className="h-10 rounded-xl bg-transparent text-sm font-medium text-slate-500 dark:text-slate-400"
                  onClick={onSaveDraft}
                  type="button"
                >
                  {isSaving ? "Saving Draft..." : "Save Draft and Exit"}
                </button>
              </>
            )}
          </div>
        </form>

        <div className="h-8 bg-gradient-to-t from-primary/10 to-transparent" />
      </div>
    </div>
  );
}

export default function CreatorApplicationPage() {
  const navigate = useNavigate();
  const {
    applicationDraft,
    clearCreatorNotice,
    creatorApplicationStatus,
    creatorNotice,
    enterReaderMode,
    enterWriterMode,
    isCreatorApplicationLoading,
    isSavingCreatorDraft,
    isSubmittingCreatorApplication,
    saveCreatorDraft,
    submitCreatorApplication,
  } = useCreator();
  const [form, setForm] = useState(applicationDraft);

  useEffect(() => {
    enterWriterMode();
  }, []);

  useEffect(() => {
    setForm(applicationDraft);
  }, [applicationDraft]);

  function handleChange(key) {
    return (event) => {
      const value = event.target.value;

      setForm((current) => ({
        ...current,
        [key]: value,
      }));
    };
  }

  function handleExperienceSelect(experience) {
    setForm((current) => ({
      ...current,
      experience,
    }));
  }

  function handleGenreSelect(primaryGenre) {
    setForm((current) => ({
      ...current,
      primaryGenre,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (creatorApplicationStatus === "SUBMITTED") {
      return;
    }

    try {
      await submitCreatorApplication(form);
      navigate(creatorSubmittedHref);
    } catch {
      // Notice state is handled in the creator context.
    }
  }

  async function handleSaveDraft() {
    try {
      await saveCreatorDraft(form);
      enterReaderMode();
      navigate("/dashboard");
    } catch {
      // Notice state is handled in the creator context.
    }
  }

  return (
    <>
      <DesktopCreatorApplication
        clearNotice={clearCreatorNotice}
        form={form}
        isSaving={isSavingCreatorDraft}
        isSubmitted={creatorApplicationStatus === "SUBMITTED"}
        isSubmitting={isSubmittingCreatorApplication || isCreatorApplicationLoading}
        notice={creatorNotice}
        onChange={handleChange}
        onExperienceSelect={handleExperienceSelect}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
      />
      <MobileCreatorApplication
        clearNotice={clearCreatorNotice}
        form={form}
        isSaving={isSavingCreatorDraft}
        isSubmitted={creatorApplicationStatus === "SUBMITTED"}
        isSubmitting={isSubmittingCreatorApplication || isCreatorApplicationLoading}
        notice={creatorNotice}
        onChange={handleChange}
        onExperienceSelect={handleExperienceSelect}
        onGenreSelect={handleGenreSelect}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
      />
    </>
  );
}
