import { Link } from "react-router-dom";
import AccountNotice from "../components/AccountNotice";
import AccountSettingsNav from "../components/AccountSettingsNav";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import { useAccount } from "../context/AccountContext";
import {
  displayLanguages,
  editProfileHref,
  linkedAccounts,
  profileHref,
} from "../data/accountFlow";

function PreferenceToggle({ checked, disabled = false, onClick }) {
  return (
    <button
      className={`relative h-6 w-12 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span
        className={`absolute top-[2px] h-5 w-5 rounded-full border border-gray-300 bg-white transition-all ${
          checked ? "left-[26px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

function SettingsSections({
  isProfileSaving,
  onConnectAccount,
  onToggleFiltering,
  onUpdateLanguage,
  onWarnDeactivate,
  profile,
}) {
  return (
    <>
      <section className="rounded-3xl border border-primary/10 bg-white/80 p-6 dark:bg-primary/5">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Profile Details</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update your personal information and public identity.
            </p>
          </div>
          <Link
            className="text-sm font-bold text-primary transition-colors hover:opacity-80"
            to={editProfileHref}
          >
            Edit Info
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-primary/10 dark:bg-background-dark/50">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Username
            </p>
            <p className="mt-2 font-semibold">{profile.username}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-primary/10 dark:bg-background-dark/50">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Email Address
            </p>
            <p className="mt-2 font-semibold">{profile.email}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-primary/10 pt-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Linked Accounts
          </h3>
          <div className="flex flex-wrap gap-3">
            {linkedAccounts.map((account) => (
              <button
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/5 dark:border-primary/10 dark:bg-background-dark/50"
                key={account.id}
                onClick={() => onConnectAccount(account)}
                type="button"
              >
                <span className={`material-symbols-outlined ${account.accent ?? "text-primary"}`}>
                  {account.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{account.label}</p>
                  <p
                    className={`text-xs font-bold ${
                      account.status === "Linked" ? "text-emerald-500" : "text-primary"
                    }`}
                  >
                    {account.status}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-primary/10 bg-white/80 p-6 dark:bg-primary/5">
        <h2 className="text-xl font-bold">Preferences</h2>
        <div className="mt-6 space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold">Display Language</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                The language used across the StoryArc interface.
              </p>
            </div>
            <select
              className="rounded-2xl border-none bg-slate-100 px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary dark:bg-background-dark/70"
              disabled={isProfileSaving}
              onChange={(event) => onUpdateLanguage(event.target.value)}
              value={profile.displayLanguage}
            >
              {displayLanguages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-primary/10 dark:bg-background-dark/50">
            <div>
              <p className="font-semibold">Content Filtering</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enable AI-powered sensitivity warnings across your library.
              </p>
            </div>
            <PreferenceToggle
              checked={profile.contentFiltering}
              disabled={isProfileSaving}
              onClick={onToggleFiltering}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="mb-4 flex items-center gap-2 text-red-500">
          <span className="material-symbols-outlined">warning</span>
          <h2 className="text-lg font-bold">Danger Zone</h2>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">Deactivate Account</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This pauses your profile and signed-in sessions until support verifies the request.
            </p>
          </div>
          <button
            className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
            onClick={onWarnDeactivate}
            type="button"
          >
            Deactivate Account
          </button>
        </div>
      </section>
    </>
  );
}

function DesktopAccountSettings({
  clearNotice,
  isProfileSaving,
  notice,
  onConnectAccount,
  onToggleFiltering,
  onUpdateLanguage,
  onWarnDeactivate,
  profile,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <AppDesktopSidebar avatar={profile.avatar} memberName={profile.displayName} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl space-y-8">
            <Reveal>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
                  Account Center
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight">Account Settings</h1>
                <p className="mt-2 max-w-2xl text-base text-slate-500 dark:text-slate-400">
                  Update your personal information, connected identities, and reader
                  preferences without leaving the main StoryArc shell.
                </p>
              </div>
            </Reveal>

            <AccountNotice notice={notice} onDismiss={clearNotice} />

            <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <AccountSettingsNav />

              <div className="space-y-6">
                <Reveal>
                  <SettingsSections
                    isProfileSaving={isProfileSaving}
                    onConnectAccount={onConnectAccount}
                    onToggleFiltering={onToggleFiltering}
                    onUpdateLanguage={onUpdateLanguage}
                    onWarnDeactivate={onWarnDeactivate}
                    profile={profile}
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileAccountSettings({
  clearNotice,
  isProfileSaving,
  notice,
  onConnectAccount,
  onToggleFiltering,
  onUpdateLanguage,
  onWarnDeactivate,
  profile,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <header className="flex items-center border-b border-primary/10 px-4 py-4">
          <Link
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            to={profileHref}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="ml-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
              Account Center
            </p>
            <h1 className="text-xl font-bold">Account Settings</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-28">
          <div className="space-y-6 px-4 py-5">
            <AccountNotice notice={notice} onDismiss={clearNotice} />
            <AccountSettingsNav />
            <SettingsSections
              isProfileSaving={isProfileSaving}
              onConnectAccount={onConnectAccount}
              onToggleFiltering={onToggleFiltering}
              onUpdateLanguage={onUpdateLanguage}
              onWarnDeactivate={onWarnDeactivate}
              profile={profile}
            />
          </div>
        </main>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function AccountSettingsPage() {
  const { clearNotice, isProfileSaving, notice, profile, showNotice, updateProfile } =
    useAccount();

  function handleConnectAccount(account) {
    showNotice(
      account.status === "Linked"
        ? `${account.label} is already linked to this account.`
        : `${account.label} connection started.`,
      account.status === "Linked" ? "info" : "success",
    );
  }

  async function handleLanguageChange(nextLanguage) {
    try {
      await updateProfile({
        ...profile,
        displayLanguage: nextLanguage,
      });
    } catch {
      return;
    }
  }

  async function handleToggleFiltering() {
    try {
      await updateProfile({
        ...profile,
        contentFiltering: !profile.contentFiltering,
      });
    } catch {
      return;
    }
  }

  function handleWarnDeactivate() {
    showNotice("Account deactivation flow started. Support confirmation is required.", "info");
  }

  return (
    <>
      <DesktopAccountSettings
        clearNotice={clearNotice}
        isProfileSaving={isProfileSaving}
        notice={notice}
        onConnectAccount={handleConnectAccount}
        onToggleFiltering={handleToggleFiltering}
        onUpdateLanguage={handleLanguageChange}
        onWarnDeactivate={handleWarnDeactivate}
        profile={profile}
      />
      <MobileAccountSettings
        clearNotice={clearNotice}
        isProfileSaving={isProfileSaving}
        notice={notice}
        onConnectAccount={handleConnectAccount}
        onToggleFiltering={handleToggleFiltering}
        onUpdateLanguage={handleLanguageChange}
        onWarnDeactivate={handleWarnDeactivate}
        profile={profile}
      />
    </>
  );
}
