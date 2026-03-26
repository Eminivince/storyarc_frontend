import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AccountSettingsNav from "../components/AccountSettingsNav";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import { useAccount } from "../context/AccountContext";
import { useAuth } from "../context/AuthContext";
import { deleteAccount } from "../auth/authApi";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  displayLanguages,
  editProfileHref,
  linkedAccounts,
  profileHref,
} from "../data/accountFlow";

function PreferenceToggle({ checked, compact, disabled = false, onClick }) {
  return (
    <button
      className={`relative rounded-full transition-colors ${
        compact ? "h-5 w-9" : "h-6 w-12"
      } ${
        checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span
        className={`absolute top-[2px] rounded-full border border-gray-300 bg-white transition-all ${
          compact ? "h-4 w-4" : "h-5 w-5"
        } ${checked ? (compact ? "left-[19px]" : "left-[26px]") : "left-[2px]"}`}
      />
    </button>
  );
}

function DeleteAccountModal({
  error,
  isDeleting,
  isOpen,
  onClose,
  onConfirm,
  password,
  setPassword,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 p-4 backdrop-blur-sm"
      onClick={isDeleting ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-white p-6 shadow-2xl dark:bg-[#241c1c]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center gap-3">
          <MaterialSymbol name="delete_forever" className="text-2xl text-red-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100" id="delete-account-title">
            Delete Account
          </h2>
        </div>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          This will permanently delete your account and all associated data. This cannot be undone.
        </p>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm();
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="delete-account-password">
              Confirm your password
            </label>
            <input
              className="w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:border-red-900/40 dark:bg-[#1c1515] dark:text-slate-100"
              id="delete-account-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />
          </div>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600/40 dark:text-slate-300 dark:hover:bg-slate-700/30"
              disabled={isDeleting}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isDeleting}
              type="submit"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingsSections({
  compact = false,
  isProfileSaving,
  onConnectAccount,
  onDeleteAccount,
  onToggleFiltering,
  onUpdateLanguage,
  onWarnDeactivate,
  profile,
}) {
  return (
    <div className={compact ? "space-y-3" : "space-y-6"}>
      <section
        className={`rounded-xl border border-primary/10 bg-white/80 dark:bg-primary/5 ${
          compact ? "p-4" : "rounded-3xl p-6"
        }`}
      >
        <div className={`flex items-center justify-between gap-4 ${compact ? "mb-4" : "mb-6"}`}>
          <div>
            <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
              Profile Details
            </h2>
            <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
              Update your personal information and public identity.
            </p>
          </div>
          <Link
            className={`font-bold text-primary transition-colors hover:opacity-80 ${
              compact ? "text-xs" : "text-sm"
            }`}
            to={editProfileHref}
          >
            Edit Info
          </Link>
        </div>

        <div className={`grid md:grid-cols-2 ${compact ? "gap-3" : "gap-4"}`}>
          <div
            className={`border border-slate-200 bg-slate-50 dark:border-primary/10 dark:bg-background-dark/50 ${
              compact ? "rounded-lg px-3 py-2.5" : "rounded-2xl px-4 py-3"
            }`}
          >
            <p className={`font-bold uppercase tracking-widest text-slate-400 ${
              compact ? "text-[10px]" : "text-[11px]"
            }`}>
              Username
            </p>
            <p className={`font-semibold ${compact ? "mt-1 text-sm" : "mt-2"}`}>{profile.username}</p>
          </div>
          <div
            className={`border border-slate-200 bg-slate-50 dark:border-primary/10 dark:bg-background-dark/50 ${
              compact ? "rounded-lg px-3 py-2.5" : "rounded-2xl px-4 py-3"
            }`}
          >
            <p className={`font-bold uppercase tracking-widest text-slate-400 ${
              compact ? "text-[10px]" : "text-[11px]"
            }`}>
              Email Address
            </p>
            <p className={`font-semibold ${compact ? "mt-1 text-sm" : "mt-2"}`}>{profile.email}</p>
          </div>
        </div>

        
      </section>

      <section
        className={`rounded-xl border border-primary/10 bg-white/80 dark:bg-primary/5 ${
          compact ? "p-4" : "rounded-3xl p-6"
        }`}
      >
        <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>Preferences</h2>
        <div className={compact ? "mt-4 space-y-4" : "mt-6 space-y-5"}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={compact ? "text-sm font-semibold" : "font-semibold"}>
                Display Language
              </p>
              <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
                The language used across the TaleStead interface.
              </p>
            </div>
            <select
              className={`border-none bg-slate-100 font-bold focus:ring-2 focus:ring-primary dark:bg-background-dark/70 ${
                compact ? "rounded-lg px-3 py-2 text-sm" : "rounded-2xl px-4 py-3 text-sm"
              }`}
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

          <div
            className={`flex items-center justify-between gap-3 border border-slate-200 bg-slate-50 dark:border-primary/10 dark:bg-background-dark/50 ${
              compact ? "rounded-lg px-3 py-3" : "rounded-2xl px-4 py-4"
            }`}
          >
            <div>
              <p className={compact ? "text-sm font-semibold" : "font-semibold"}>Content Filtering</p>
              <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
                Enable AI-powered sensitivity warnings across your library.
              </p>
            </div>
            <PreferenceToggle
              checked={profile.contentFiltering}
              compact={compact}
              disabled={isProfileSaving}
              onClick={onToggleFiltering}
            />
          </div>
        </div>
      </section>

      <section
        className={`rounded-xl border border-red-500/20 bg-red-500/5 ${
          compact ? "p-4" : "rounded-3xl p-6"
        }`}
      >
        <div className={`flex items-center gap-2 text-red-500 ${compact ? "mb-3" : "mb-4"}`}>
          <MaterialSymbol name="warning" className="text-lg" />
          <h2 className={compact ? "text-base font-bold" : "text-lg font-bold"}>Danger Zone</h2>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <p className={compact ? "text-sm font-semibold" : "font-semibold"}>Deactivate Account</p>
            <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
              This pauses your profile and signed-in sessions until support verifies the request.
            </p>
          </div>
          <button
            className={`bg-red-600 font-bold text-white transition-colors hover:bg-red-700 ${
              compact ? "rounded-lg px-3 py-2 text-xs" : "rounded-2xl px-4 py-3 text-sm"
            }`}
            onClick={onWarnDeactivate}
            type="button"
          >
            Deactivate
          </button>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className={compact ? "text-sm font-semibold" : "font-semibold"}>Delete Account</p>
            <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
              Permanently remove your account and all associated data.
            </p>
          </div>
          <button
            className={`border border-red-500/40 bg-red-500/10 font-bold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-300 ${
              compact ? "rounded-lg px-3 py-2 text-xs" : "rounded-2xl px-4 py-3 text-sm"
            }`}
            onClick={onDeleteAccount}
            type="button"
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}

function DesktopAccountSettings({
  isProfileSaving,
  onConnectAccount,
  onDeleteAccount,
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
                  preferences without leaving the main TaleStead shell.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <AccountSettingsNav />

              <div className="space-y-6">
                <Reveal>
                  <SettingsSections
                    isProfileSaving={isProfileSaving}
                    onConnectAccount={onConnectAccount}
                    onDeleteAccount={onDeleteAccount}
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
  isProfileSaving,
  onConnectAccount,
  onDeleteAccount,
  onToggleFiltering,
  onUpdateLanguage,
  onWarnDeactivate,
  profile,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <header className="flex shrink-0 items-center border-b border-primary/10 bg-background-light px-4 py-3 dark:bg-background-dark">
          <Link
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/20"
            to={profileHref}
          >
            <MaterialSymbol name="arrow_back" className="text-xl" />
          </Link>
          <div className="ml-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Account Center
            </p>
            <h1 className="text-base font-bold">Account Settings</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="space-y-3 px-4 pt-3">
            <AccountSettingsNav compact />
            <SettingsSections
              compact
              isProfileSaving={isProfileSaving}
              onConnectAccount={onConnectAccount}
              onDeleteAccount={onDeleteAccount}
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
  const { isProfileSaving, profile, showNotice, updateProfile } = useAccount();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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

  function handleOpenDelete() {
    setDeletePassword("");
    setDeleteError(null);
    setIsDeleteOpen(true);
  }

  function handleCloseDelete() {
    if (isDeletingAccount) {
      return;
    }

    setIsDeleteOpen(false);
  }

  async function handleConfirmDelete() {
    const trimmedPassword = deletePassword.trim();

    if (!trimmedPassword) {
      setDeleteError("Please enter your password to confirm.");
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError(null);

    try {
      await deleteAccount({ password: trimmedPassword });
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      const message = error?.message || "Could not delete your account.";
      setDeleteError(message);
      showNotice(message, "info");
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <>
      <DesktopAccountSettings
        isProfileSaving={isProfileSaving}
        onConnectAccount={handleConnectAccount}
        onDeleteAccount={handleOpenDelete}
        onToggleFiltering={handleToggleFiltering}
        onUpdateLanguage={handleLanguageChange}
        onWarnDeactivate={handleWarnDeactivate}
        profile={profile}
      />
      <MobileAccountSettings
        isProfileSaving={isProfileSaving}
        onConnectAccount={handleConnectAccount}
        onDeleteAccount={handleOpenDelete}
        onToggleFiltering={handleToggleFiltering}
        onUpdateLanguage={handleLanguageChange}
        onWarnDeactivate={handleWarnDeactivate}
        profile={profile}
      />
      <DeleteAccountModal
        error={deleteError}
        isDeleting={isDeletingAccount}
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        password={deletePassword}
        setPassword={setDeletePassword}
      />
    </>
  );
}
