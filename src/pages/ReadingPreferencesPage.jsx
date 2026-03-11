import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../context/AuthContext";
import { useOnboarding } from "../context/OnboardingContext";
import { useToast } from "../context/ToastContext";

const readingStyles = [
  {
    name: "Daily Reads",
    desktopDescription: "Short, bite-sized chapters for busy schedules.",
    mobileDescription: "Short chapters for a quick break",
  },
  {
    name: "Binge-Worthy",
    desktopDescription:
      "Long chapters and completed stories for marathon sessions.",
    mobileDescription: "Longer arcs for deep immersion",
  },
  {
    name: "Community Focused",
    desktopDescription: "Highly interactive stories with active discussions.",
    mobileDescription: "Highly interactive stories with active discussions",
  },
];

const themes = [
  {
    name: "Light",
    desktopLabelClass: "text-slate-900",
    mobileLabelClass: "text-slate-800",
    cardClass: "bg-white dark:bg-white",
    previewClass: "border border-slate-200 bg-white",
  },
  {
    name: "Sepia",
    desktopLabelClass: "text-[#5f4b32]",
    mobileLabelClass: "text-[#5f4b32]",
    cardClass: "bg-[#f4ecd8]",
    previewClass: "bg-[#f4ecd8]",
    previewInnerClass: "bg-[#e8dcc4]",
  },
  {
    name: "Dark",
    desktopLabelClass: "text-primary",
    mobileLabelClass: "text-white",
    cardClass: "bg-background-dark",
    previewClass: "border border-primary/40 bg-slate-800",
  },
];

function getErrorMessage(error) {
  return error?.message || "We could not save your reading preferences.";
}

function getProfilePictureErrorMessage(error) {
  return error?.message || "We could not upload your profile picture.";
}

async function uploadSelectedProfilePicture(file, uploadProfilePicture, showToast) {
  if (!file) {
    return;
  }

  try {
    await uploadProfilePicture(file);
    showToast("Profile photo uploaded.");
  } catch (error) {
    showToast(getProfilePictureErrorMessage(error), {
      tone: "error",
      title: "Could not upload photo",
    });
  }
}

function ProfilePictureSection({
  compact = false,
  inputId,
  isUploadingProfilePicture,
  onSelectProfilePicture,
  user,
}) {
  const hasAvatar = Boolean(user?.avatarUrl);
  const displayName = user?.displayName ?? "StoryArc User";

  return (
    <section className={compact ? "px-4 pt-10" : "flex flex-col gap-4 px-4"}>
      <div className={compact ? "" : "flex flex-col gap-1"}>
        <h3 className={compact ? "pb-4 text-[22px] font-bold tracking-[-0.015em]" : "text-xl font-bold"}>
          Profile Picture
        </h3>
        {!compact ? (
          <p className="text-sm text-slate-600 dark:text-primary/60">
            Optional, but it makes your account feel like yours.
          </p>
        ) : null}
      </div>

      <div
        className={`flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-primary/20 dark:bg-primary/5 ${
          compact ? "" : "md:p-5"
        }`.trim()}
      >
        <UserAvatar
          className={`${compact ? "size-20" : "size-24"} rounded-full border-4 border-primary/20 shadow-lg`}
          fallbackClassName={compact ? "text-3xl" : "text-4xl"}
          name={displayName}
          src={user?.avatarUrl}
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold md:text-base">
            {hasAvatar ? "Your photo is live." : "Upload a photo for your profile."}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
            JPG, PNG, GIF, or WebP up to 5 MB.
          </p>
        </div>

        <label
          className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-background-dark transition-opacity hover:opacity-90 ${
            isUploadingProfilePicture ? "pointer-events-none opacity-60" : ""
          }`.trim()}
          htmlFor={inputId}
        >
          <input
            accept="image/*"
            className="hidden"
            disabled={isUploadingProfilePicture}
            id={inputId}
            onChange={onSelectProfilePicture}
            type="file"
          />
          {isUploadingProfilePicture
            ? "Uploading..."
            : hasAvatar
              ? "Change photo"
              : "Upload photo"}
        </label>
      </div>
    </section>
  );
}

function DesktopReadingPreferences() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const {
    isSavingPreferences,
    isUploadingProfilePicture,
    persistPreferences,
    readingStyle,
    readingTheme,
    setReadingStyle,
    setReadingTheme,
    uploadProfilePicture,
  } = useOnboarding();

  async function handleComplete() {
    try {
      await persistPreferences();
      navigate("/dashboard");
    } catch (error) {
      showToast(getErrorMessage(error), {
        tone: "error",
        title: "Could not save preferences",
      });
    }
  }

  async function handleProfilePictureChange(event) {
    const file = event.target.files?.[0] ?? null;

    event.target.value = "";

    await uploadSelectedProfilePicture(file, uploadProfilePicture, showToast);
  }

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col px-4 py-5 md:px-10">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 px-4 py-3 dark:border-primary/20">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">
                auto_stories
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">StoryArc</h2>
          </div>
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-700 transition-colors hover:bg-primary hover:text-white dark:bg-primary/10 dark:text-primary"
            to="/onboarding/genres"
          >
            <span className="material-symbols-outlined">close</span>
          </Link>
        </header>

        <Reveal as="main" className="flex flex-col gap-8 py-8" distance={14}>
          <div className="flex flex-col gap-2 px-4">
            <h1 className="text-4xl font-black tracking-tight">
              Customize your experience
            </h1>
            <p className="text-base text-slate-600 dark:text-primary/60">
              Final step: Tailor your reading journey to your liking.
            </p>
          </div>

          <ProfilePictureSection
            inputId="desktop-onboarding-profile-picture"
            isUploadingProfilePicture={isUploadingProfilePicture}
            onSelectProfilePicture={handleProfilePictureChange}
            user={user}
          />

          <section className="flex flex-col gap-4 px-4">
            <h3 className="text-xl font-bold">Reading Style</h3>
            <div className="grid gap-4">
              {readingStyles.map((style) => {
                const selected = readingStyle === style.name;

                return (
                  <motion.button
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-primary/50 dark:border-primary/20 dark:bg-primary/5"
                    key={style.name}
                    onClick={() => setReadingStyle(style.name)}
                    type="button"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`h-6 w-6 rounded-full border-2 border-primary/40 ${
                        selected ? "border-primary bg-primary" : "bg-transparent"
                      }`}
                    >
                      {selected && (
                        <div className="m-auto mt-1 h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex grow flex-col">
                      <p className="text-base font-semibold">{style.name}</p>
                      <p className="text-sm text-slate-600 dark:text-primary/60">
                        {style.desktopDescription}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="flex flex-col gap-4 px-4">
            <h3 className="text-xl font-bold">Reading Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => {
                const selected = readingTheme === theme.name;

                return (
                  <motion.button
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all ${
                      selected
                        ? "border-2 border-primary"
                        : "border border-slate-200 dark:border-primary/20"
                    } ${theme.cardClass}`}
                    key={theme.name}
                    onClick={() => setReadingTheme(theme.name)}
                    type="button"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`h-8 w-8 rounded-full ${
                        theme.previewInnerClass || theme.previewClass
                      }`}
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${theme.desktopLabelClass}`}
                    >
                      {theme.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <div className="mt-8 px-4 pb-10">
            <motion.button
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-lg font-extrabold text-background-dark shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSavingPreferences}
              onClick={handleComplete}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{isSavingPreferences ? "Saving..." : "Complete Setup"}</span>
              <span className="material-symbols-outlined">check_circle</span>
            </motion.button>
            <p className="mt-4 text-center text-xs text-slate-500 dark:text-primary/40">
              You can change these preferences at any time in settings.
            </p>
          </div>
        </Reveal>

        <div className="relative h-24 w-full overflow-hidden rounded-xl px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-50" />
          <div className="flex h-full items-center justify-between px-6 opacity-30 grayscale">
            {["book_2", "history_edu", "forum", "bookmarks"].map((icon) => (
              <span className="material-symbols-outlined text-6xl" key={icon}>
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileReadingPreferences() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const {
    isSavingPreferences,
    isUploadingProfilePicture,
    persistPreferences,
    readingStyle,
    readingTheme,
    setReadingStyle,
    setReadingTheme,
    uploadProfilePicture,
  } = useOnboarding();

  async function handleComplete() {
    try {
      await persistPreferences();
      navigate("/dashboard");
    } catch (error) {
      showToast(getErrorMessage(error), {
        tone: "error",
        title: "Could not save preferences",
      });
    }
  }

  async function handleProfilePictureChange(event) {
    const file = event.target.files?.[0] ?? null;

    event.target.value = "";

    await uploadSelectedProfilePicture(file, uploadProfilePicture, showToast);
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="flex items-center justify-between p-4 pb-2">
          <Link className="flex size-10 items-center justify-center" to="/onboarding/genres">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
              arrow_back
            </span>
          </Link>
          <h2 className="flex-1 pr-10 text-center text-lg font-bold tracking-[-0.015em]">
            Reading Preferences
          </h2>
        </header>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-end justify-between gap-6">
            <p className="text-sm font-medium">Setup Progress</p>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Step 4 of 4
            </p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-primary/20">
            <div className="h-full w-[80%] rounded-full bg-primary" />
          </div>
        </div>

        <main className="flex-1 pb-24">
          <ProfilePictureSection
            compact
            inputId="mobile-onboarding-profile-picture"
            isUploadingProfilePicture={isUploadingProfilePicture}
            onSelectProfilePicture={handleProfilePictureChange}
            user={user}
          />

          <section className="px-4 pt-6">
            <h2 className="pb-4 text-[22px] font-bold tracking-[-0.015em]">
              Reading Style
            </h2>
            <div className="flex flex-col gap-3">
              {readingStyles.slice(0, 2).map((style) => {
                const selected = readingStyle === style.name;

                return (
                  <motion.button
                    className="flex items-center gap-4 rounded-xl border-2 border-slate-200 p-4 text-left transition-all dark:border-primary/20"
                    key={style.name}
                    onClick={() => setReadingStyle(style.name)}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex grow flex-col">
                      <p className="text-base font-bold">{style.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {style.mobileDescription}
                      </p>
                    </div>
                    <div
                      className={`h-6 w-6 rounded-full border-2 border-slate-300 dark:border-primary/40 ${
                        selected ? "border-primary" : ""
                      }`}
                    >
                      {selected && (
                        <div className="m-auto mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="px-4 pt-10">
            <h2 className="pb-4 text-[22px] font-bold tracking-[-0.015em]">
              Reading Theme
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {themes.map((theme) => {
                const selected = readingTheme === theme.name;

                return (
                  <motion.button
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                      selected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-slate-200 dark:border-primary/10"
                    } ${theme.name === "Light" ? "bg-white" : theme.cardClass}`}
                    key={theme.name}
                    onClick={() => setReadingTheme(theme.name)}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={`flex aspect-square w-full items-center justify-center rounded-lg ${
                        theme.name === "Light"
                          ? "border border-slate-200 bg-white"
                          : theme.name === "Sepia"
                            ? "border border-[#e5dcc3] bg-[#f4ecd8]"
                            : "border border-slate-700 bg-slate-800"
                      }`}
                    >
                      <span
                        className={`text-xl font-bold ${
                          theme.name === "Light"
                            ? "text-slate-800"
                            : theme.name === "Sepia"
                              ? "text-[#5f4b32]"
                              : "text-white"
                        }`}
                      >
                        Aa
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${theme.mobileLabelClass}`}>
                      {theme.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 bg-background-light/80 p-4 backdrop-blur-md dark:bg-background-dark/80">
          <motion.button
            className="w-full rounded-xl bg-primary py-4 font-bold text-slate-900 shadow-lg shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSavingPreferences}
            onClick={handleComplete}
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSavingPreferences ? "Saving..." : "Complete Setup"}
          </motion.button>
        </footer>
      </div>
    </div>
  );
}

export default function ReadingPreferencesPage() {
  return (
    <>
      <DesktopReadingPreferences />
      <MobileReadingPreferences />
    </>
  );
}
