import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAccount } from "../context/AccountContext";
import { useOnboarding } from "../context/OnboardingContext";
import { profileHref } from "../data/accountFlow";

const MAX_PROFILE_PICTURE_SIZE_BYTES = 5 * 1024 * 1024;

function DesktopEditProfile({
  form,
  isProfileSaving,
  isUploadingProfilePicture,
  onChange,
  onProfilePictureClick,
  onSave,
  onTogglePreference,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-neutral-900 transition-colors duration-300 dark:bg-background-dark dark:text-neutral-100 md:block">
      <div className="flex h-screen overflow-hidden">
        <AppDesktopSidebar avatar={form.avatar} memberName={form.displayName} />

        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="z-10 flex h-16 items-center justify-between border-b border-primary/10 bg-background-light/80 px-6 backdrop-blur-md dark:bg-background-dark/80">
            <h2 className="text-lg font-bold">Edit Profile</h2>
            <div className="flex items-center gap-3">
              <Link className="px-4 py-2 text-sm font-medium text-primary/80 transition-colors hover:text-neutral-900 dark:text-primary/70 dark:hover:text-white" to={profileHref}>
                Cancel
              </Link>
              <button
                className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-background-dark transition-all hover:shadow-[0_0_15px_rgba(244,192,37,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isProfileSaving}
                onClick={onSave}
                type="button"
              >
                {isProfileSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </header>

          <div className="custom-scrollbar flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-6 py-8">
              <section className="relative mb-12">
                <div className="group relative h-48 w-full overflow-hidden rounded-xl border border-primary/10 bg-surface-dark">
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      background:
                        "radial-gradient(circle at top left, rgba(244,192,37,0.35), transparent 42%), linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.82) 58%, rgba(217,119,6,0.42))",
                    }}
                  />
                  <div className="absolute bottom-4 right-4 rounded-lg border border-white/10 bg-background-dark/60 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-md">
                    Banner customization coming soon
                  </div>
                </div>

                <div className="absolute -bottom-8 left-8 flex items-end gap-6">
                  <div className="relative group">
                    <UserAvatar
                      className="h-32 w-32 rounded-full border-4 border-background-dark bg-surface-dark shadow-xl"
                      fallbackClassName="text-4xl"
                      name={form.displayName}
                      src={form.avatar}
                    />
                    <button
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-100"
                      disabled={isUploadingProfilePicture}
                      onClick={onProfilePictureClick}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-3xl text-white">
                        {isUploadingProfilePicture ? "progress_activity" : "add_a_photo"}
                      </span>
                    </button>
                  </div>
                  <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Profile Photo</h3>
                      <p className="text-sm text-primary/70 dark:text-primary/60">
                        JPG, GIF or PNG. 400x400px recommended.
                      </p>
                    </div>
                    <button
                      className="inline-flex items-center gap-2 self-start rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary transition hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={isUploadingProfilePicture}
                      onClick={onProfilePictureClick}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isUploadingProfilePicture ? "progress_activity" : "upload"}
                      </span>
                      {isUploadingProfilePicture
                        ? "Uploading..."
                        : form.avatar
                          ? "Change Photo"
                          : "Upload Photo"}
                    </button>
                  </div>
                </div>
              </section>

              <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                      <span className="h-px w-8 bg-primary/30" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          Display Name
                        </label>
                        <input
                          className="w-full rounded-lg border border-primary/10 bg-primary/5 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/40 dark:border-primary/10 dark:bg-primary/5 dark:text-neutral-100"
                          disabled={isProfileSaving}
                          onChange={onChange("displayName")}
                          type="text"
                          value={form.displayName}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          Location
                        </label>
                        <input
                          className="w-full rounded-lg border border-primary/10 bg-primary/5 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/40 dark:border-primary/10 dark:bg-primary/5 dark:text-neutral-100"
                          disabled={isProfileSaving}
                          onChange={onChange("location")}
                          type="text"
                          value={form.location}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Tagline
                      </label>
                      <input
                        className="w-full rounded-lg border border-primary/10 bg-primary/5 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/40 dark:border-primary/10 dark:bg-primary/5 dark:text-neutral-100"
                        disabled={isProfileSaving}
                        onChange={onChange("tagline")}
                        type="text"
                        value={form.tagline}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Bio
                      </label>
                      <textarea
                        className="w-full resize-none rounded-lg border border-primary/10 bg-primary/5 px-4 py-2.5 text-sm text-neutral-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/40 dark:border-primary/10 dark:bg-primary/5 dark:text-neutral-100"
                        disabled={isProfileSaving}
                        onChange={onChange("bio")}
                        rows="5"
                        value={form.bio}
                      />
                      <p className="text-right text-[11px] text-primary/70">
                        Character limit: {form.bio.length}/500
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                      <span className="h-px w-8 bg-primary/30" />
                      Social Connectivity
                    </h4>
                    <div className="space-y-4">
                      {[
                        ["website", "language", "Personal Website"],
                        ["twitter", "alternate_email", "X / Twitter Username"],
                        ["discord", "forum", "Discord Tag"],
                      ].map(([key, icon, label]) => (
                        <div
                          className="flex items-center gap-4 rounded-lg border border-primary/10 bg-primary/5 p-1 dark:border-primary/5 dark:bg-primary/5"
                          key={key}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-primary/70 dark:bg-surface-dark dark:text-primary/60">
                            <span className="material-symbols-outlined">{icon}</span>
                          </div>
                          <input
                            className="flex-1 bg-transparent py-2 text-sm outline-none"
                            disabled={isProfileSaving}
                            onChange={onChange(key)}
                            placeholder={label}
                            type="text"
                            value={form[key]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Reveal className="space-y-4 rounded-2xl border border-primary/10 bg-primary/5 p-6">
                    <span className="material-symbols-outlined text-3xl text-primary">
                      lightbulb
                    </span>
                    <h5 className="font-bold">Profile Tips</h5>
                    <ul className="space-y-3 text-sm text-primary/70 dark:text-primary/60">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Add a banner to stand out in the library.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        Linking your social media increases reader trust.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        A compelling bio helps conversion to subscribers.
                      </li>
                    </ul>
                  </Reveal>

                  <Reveal className="rounded-2xl border border-primary/10 bg-background-light p-6 dark:border-primary/5 dark:bg-primary/5">
                    <h5 className="mb-4 font-bold">Account Privacy</h5>
                    <div className="space-y-4">
                      {[
                        ["privateLibrary", "Private Library", "Hide your reading list from others"],
                        ["allowMessages", "Allow Messages", "Let followers DM you"],
                        ["showActivity", "Show Activity", 'Display "Reading Now" status'],
                      ].map(([key, title, description]) => (
                        <div className="flex items-center justify-between" key={key}>
                          <div>
                            <p className="font-semibold">{title}</p>
                            <p className="text-xs text-primary/70 dark:text-primary/60">
                              {description}
                            </p>
                          </div>
                          <button
                            className={`relative h-6 w-11 rounded-full transition-colors ${
                              form[key] ? "bg-primary" : "bg-primary/20 dark:bg-primary/10"
                            }`}
                            disabled={isProfileSaving}
                            onClick={() => onTogglePreference(key)}
                            type="button"
                          >
                            <div
                              className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${
                                form[key]
                                  ? "right-0.5 bg-background-dark"
                                  : "left-0.5 bg-white dark:bg-neutral-300"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileEditProfile({
  form,
  isProfileSaving,
  isUploadingProfilePicture,
  onChange,
  onProfilePictureClick,
  onSave,
  onTogglePreference,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-neutral-900 antialiased dark:bg-background-dark dark:text-neutral-100 md:hidden">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light px-4 py-3 dark:bg-background-dark">
        <Link className="text-sm font-medium text-primary/80 dark:text-primary/70" to={profileHref}>
          Cancel
        </Link>
        <h1 className="text-lg font-bold tracking-tight">Edit Profile</h1>
        <button
          className="text-sm font-bold text-primary disabled:opacity-70"
          disabled={isProfileSaving}
          onClick={onSave}
          type="button"
        >
          {isProfileSaving ? "Saving..." : "Save"}
        </button>
      </header>

      <main className="pb-24">
        <section className="relative">
          <div className="relative h-40 w-full overflow-hidden bg-primary/20">
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  "radial-gradient(circle at top left, rgba(244,192,37,0.35), transparent 42%), linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.82) 58%, rgba(217,119,6,0.42))",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-md">
                Banner customization coming soon
              </div>
            </div>
          </div>
          <div className="relative z-10 -mt-12 flex flex-col items-center px-4">
            <div className="relative group">
              <UserAvatar
                className="h-24 w-24 rounded-full border-4 border-background-dark bg-surface-dark shadow-xl"
                fallbackClassName="text-3xl"
                name={form.displayName}
                src={form.avatar}
              />
              <button
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background-dark bg-primary text-background-dark shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isUploadingProfilePicture}
                onClick={onProfilePictureClick}
                type="button"
              >
                <span className="material-symbols-outlined text-sm">
                  {isUploadingProfilePicture ? "progress_activity" : "edit"}
                </span>
              </button>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-primary/70 dark:text-primary/60">
                {isUploadingProfilePicture ? "Uploading photo..." : "Tap to update photo"}
              </p>
              <button
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-primary disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isUploadingProfilePicture}
                onClick={onProfilePictureClick}
                type="button"
              >
                <span className="material-symbols-outlined text-sm">
                  {isUploadingProfilePicture ? "progress_activity" : "upload"}
                </span>
                {isUploadingProfilePicture
                  ? "Uploading..."
                  : form.avatar
                    ? "Change Photo"
                    : "Upload Photo"}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-6 px-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary/80">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Display Name
              </label>
              <input
                className="w-full rounded-lg border-none bg-primary/5 px-4 py-3 text-neutral-900 transition-all focus:ring-2 focus:ring-primary dark:bg-primary/5 dark:text-neutral-100"
                disabled={isProfileSaving}
                onChange={onChange("displayName")}
                type="text"
                value={form.displayName}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Location
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary/60">
                  location_on
                </span>
                <input
                  className="w-full rounded-lg border-none bg-primary/5 py-3 pl-10 pr-4 text-neutral-900 transition-all focus:ring-2 focus:ring-primary dark:bg-primary/5 dark:text-neutral-100"
                  disabled={isProfileSaving}
                  onChange={onChange("location")}
                  type="text"
                  value={form.location}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Tagline
              </label>
              <input
                className="w-full rounded-lg border-none bg-primary/5 px-4 py-3 text-neutral-900 transition-all focus:ring-2 focus:ring-primary dark:bg-primary/5 dark:text-neutral-100"
                disabled={isProfileSaving}
                onChange={onChange("tagline")}
                type="text"
                value={form.tagline}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="ml-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Bio
              </label>
              <textarea
                className="w-full resize-none rounded-lg border-none bg-primary/5 px-4 py-3 text-neutral-900 transition-all focus:ring-2 focus:ring-primary dark:bg-primary/5 dark:text-neutral-100"
                disabled={isProfileSaving}
                onChange={onChange("bio")}
                rows="4"
                value={form.bio}
              />
              <div className="flex justify-end">
                <span className="text-[10px] text-primary/70">
                  {form.bio.length}/500
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 px-4 text-xs font-bold uppercase tracking-widest text-primary/80">
            Social Connectivity
          </h2>
          <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
            {[
              ["twitter", "link", "Twitter"],
              ["website", "language", "Website"],
              ["discord", "forum", "Discord"],
            ].map(([key, icon, label]) => (
              <div className="flex-shrink-0" key={key}>
                <label className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 dark:bg-primary/5">
                    <span className="material-symbols-outlined text-2xl text-primary">
                      {icon}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium">{label}</span>
                </label>
                <input
                  className="mt-2 w-28 rounded-lg border-none bg-primary/5 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary dark:bg-primary/5"
                  disabled={isProfileSaving}
                  onChange={onChange(key)}
                  type="text"
                  value={form[key]}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-4 px-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary/80">
            Account Privacy
          </h2>
          <div className="overflow-hidden rounded-xl bg-primary/5 divide-y divide-primary/5 dark:bg-primary/5">
            {[
              ["privateLibrary", "Private Library", "Hide your reading list from others"],
              ["allowMessages", "Allow Messages", "Let followers DM you"],
              ["showActivity", "Show Activity", 'Display "Reading Now" status'],
            ].map(([key, title, description]) => (
              <div className="flex items-center justify-between p-4" key={key}>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{title}</span>
                  <span className="text-xs text-primary/70">{description}</span>
                </div>
                <button
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form[key] ? "bg-primary" : "bg-primary/20 dark:bg-primary/10"
                  }`}
                  disabled={isProfileSaving}
                  onClick={() => onTogglePreference(key)}
                  type="button"
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${
                      form[key]
                        ? "right-0.5 bg-background-dark"
                        : "left-0.5 bg-white dark:bg-neutral-300"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 px-4 pb-10">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 py-4 font-bold text-red-500" type="button">
            <span className="material-symbols-outlined">no_accounts</span>
            Deactivate Account
          </button>
          <p className="mt-3 px-8 text-center text-[11px] text-primary/70">
            Deactivating will temporarily hide your profile and works. You can
            restore it anytime.
          </p>
        </section>
      </main>
      <AppMobileTabBar />
    </div>
  );
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const profilePictureInputRef = useRef(null);
  const { isProfileSaving, profile, showNotice, updateProfile } = useAccount();
  const { isUploadingProfilePicture, uploadProfilePicture } = useOnboarding();
  const [form, setForm] = useState(profile);
  const [hasPendingEdits, setHasPendingEdits] = useState(false);

  useEffect(() => {
    if (!hasPendingEdits) {
      setForm(profile);
    }
  }, [hasPendingEdits, profile]);

  function onChange(key) {
    return (event) => {
      setHasPendingEdits(true);
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));
    };
  }

  function onTogglePreference(key) {
    setHasPendingEdits(true);
    setForm((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function openProfilePicturePicker() {
    profilePictureInputRef.current?.click();
  }

  async function onProfilePictureSelected(event) {
    const [file] = event.target.files ?? [];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showNotice("Choose a valid image file for your profile photo.", "info");
      return;
    }

    if (file.size > MAX_PROFILE_PICTURE_SIZE_BYTES) {
      showNotice("Profile pictures must be 5 MB or smaller.", "info");
      return;
    }

    try {
      const nextAvatarUrl = await uploadProfilePicture(file);

      if (nextAvatarUrl) {
        setHasPendingEdits(true);
        setForm((current) => ({
          ...current,
          avatar: nextAvatarUrl,
        }));
      }

      showNotice("Profile picture updated.");
    } catch (error) {
      showNotice(
        error instanceof Error
          ? error.message
          : "Profile picture upload failed.",
        "info",
      );
    }
  }

  async function onSave() {
    try {
      await updateProfile(form);
      setHasPendingEdits(false);
      navigate(profileHref);
    } catch {
      return;
    }
  }

  return (
    <>
      <input
        accept="image/*"
        className="hidden"
        onChange={onProfilePictureSelected}
        ref={profilePictureInputRef}
        type="file"
      />
      <DesktopEditProfile
        form={form}
        isProfileSaving={isProfileSaving}
        isUploadingProfilePicture={isUploadingProfilePicture}
        onChange={onChange}
        onProfilePictureClick={openProfilePicturePicker}
        onSave={onSave}
        onTogglePreference={onTogglePreference}
      />
      <MobileEditProfile
        form={form}
        isProfileSaving={isProfileSaving}
        isUploadingProfilePicture={isUploadingProfilePicture}
        onChange={onChange}
        onProfilePictureClick={openProfilePicturePicker}
        onSave={onSave}
        onTogglePreference={onTogglePreference}
      />
    </>
  );
}
