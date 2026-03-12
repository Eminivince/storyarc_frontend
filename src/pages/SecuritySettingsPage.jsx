import { useState } from "react";
import { Link } from "react-router-dom";
import AccountNotice from "../components/AccountNotice";
import AccountSettingsNav from "../components/AccountSettingsNav";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import { useAccount } from "../context/AccountContext";
import {
  mfaChooseHref,
  mfaSuccessHref,
  profileHref,
  securityCheckItems,
  securitySessions,
} from "../data/accountFlow";

function PasswordForm({ compact = false, fields, onChange, onSubmit, stacked = false }) {
  const layoutClass = stacked ? "grid gap-4" : "grid gap-4 md:grid-cols-2";

  return (
    <section
      className={`rounded-xl border border-primary/10 bg-white/80 dark:bg-primary/5 ${
        compact ? "p-4" : "rounded-3xl p-6"
      }`}
    >
      <div className={compact ? "mb-4" : "mb-6"}>
        <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>Password</h2>
        <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
          Update your password to keep the account secure.
        </p>
      </div>

      <div className={compact ? "grid gap-3" : layoutClass}>
        <label className="flex flex-col gap-1.5">
          <span className={compact ? "text-xs font-medium text-slate-500" : "text-sm font-medium text-slate-500 dark:text-slate-400"}>
            Current Password
          </span>
          <input
            className={`rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary dark:border-primary/10 dark:bg-background-dark/60 ${
              compact ? "px-3 py-2.5 text-base" : "rounded-2xl px-4 py-3"
            }`}
            name="currentPassword"
            onChange={onChange}
            placeholder="••••••••"
            type="password"
            value={fields.currentPassword}
          />
        </label>

        {!stacked ? <div /> : null}

        <label className="flex flex-col gap-1.5">
          <span className={compact ? "text-xs font-medium text-slate-500" : "text-sm font-medium text-slate-500 dark:text-slate-400"}>
            New Password
          </span>
          <input
            className={`rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary dark:border-primary/10 dark:bg-background-dark/60 ${
              compact ? "px-3 py-2.5 text-base" : "rounded-2xl px-4 py-3"
            }`}
            name="newPassword"
            onChange={onChange}
            placeholder="••••••••"
            type="password"
            value={fields.newPassword}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={compact ? "text-xs font-medium text-slate-500" : "text-sm font-medium text-slate-500 dark:text-slate-400"}>
            Confirm Password
          </span>
          <input
            className={`rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary dark:border-primary/10 dark:bg-background-dark/60 ${
              compact ? "px-3 py-2.5 text-base" : "rounded-2xl px-4 py-3"
            }`}
            name="confirmPassword"
            onChange={onChange}
            placeholder="••••••••"
            type="password"
            value={fields.confirmPassword}
          />
        </label>
      </div>

      <div className={`flex justify-end ${compact ? "mt-4" : "mt-5"}`}>
        <button
          className={`rounded-xl bg-primary font-bold text-background-dark transition-opacity hover:opacity-90 ${
            compact ? "px-4 py-2.5 text-xs" : "rounded-2xl px-5 py-3 text-sm"
          }`}
          onClick={onSubmit}
          type="button"
        >
          Update Password
        </button>
      </div>
    </section>
  );
}

function TwoFactorSection({ compact = false, enabled }) {
  const badgeClasses = enabled
    ? "bg-emerald-500/15 text-emerald-500"
    : "bg-red-500/15 text-red-500";

  return (
    <section
      className={`rounded-xl border border-primary/10 bg-white/80 dark:bg-primary/5 ${
        compact ? "p-4" : "rounded-3xl p-6"
      }`}
    >
      <div className={`flex items-start justify-between gap-4 ${compact ? "mb-4" : "mb-6"}`}>
        <div>
          <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
            Two-Factor Authentication
          </h2>
          <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
            Add an authenticator app or SMS code before premium purchases are approved.
          </p>
        </div>
        <span className={`rounded-full font-bold uppercase ${badgeClasses} ${
          compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
        }`}>
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <div className={`rounded-xl border border-dashed border-primary/30 bg-primary/5 ${
        compact ? "p-3" : "rounded-2xl p-4"
      }`}>
        <div className={`flex items-start ${compact ? "gap-3" : "gap-4"}`}>
          <div className={`rounded-full bg-primary/15 text-primary ${
            compact ? "p-2" : "p-3"
          }`}>
            <span className={`material-symbols-outlined ${compact ? "text-lg" : ""}`}>
              app_shortcut
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={compact ? "text-sm font-bold" : "font-bold"}>Authenticator App</h3>
            <p className={`text-slate-500 dark:text-slate-400 ${
              compact ? "mt-0.5 text-xs" : "mt-1 text-sm"
            }`}>
              Use Google Authenticator, Authy, or 1Password to generate secure codes.
            </p>
            <Link
              className={`inline-flex rounded-xl border-2 border-primary font-bold text-primary transition-colors hover:bg-primary hover:text-background-dark ${
                compact ? "mt-3 px-3 py-1.5 text-xs" : "mt-4 rounded-2xl px-4 py-2 text-sm"
              }`}
              to={enabled ? mfaSuccessHref : mfaChooseHref}
            >
              {enabled ? "Manage 2FA" : "Setup Authenticator"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SessionsSection({ compact = false, onRevoke }) {
  return (
    <section
      className={`rounded-xl border border-primary/10 bg-white/80 dark:bg-primary/5 ${
        compact ? "p-4" : "rounded-3xl p-6"
      }`}
    >
      <div className={compact ? "mb-4" : "mb-6"}>
        <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>Active Sessions</h2>
        <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
          Review every device that has recently accessed your account.
        </p>
      </div>

      <div className={compact ? "space-y-2" : "space-y-3"}>
        {securitySessions.map((session) => (
          <div
            className={`flex items-center justify-between gap-3 border border-slate-200 bg-slate-50 dark:border-primary/10 dark:bg-background-dark/50 ${
              compact ? "rounded-lg px-3 py-3" : "rounded-2xl px-4 py-4"
            }`}
            key={session.id}
          >
            <div className={`flex items-center min-w-0 flex-1 ${compact ? "gap-3" : "gap-4"}`}>
              <div className={`shrink-0 rounded-xl bg-primary/10 text-primary ${
                compact ? "p-2" : "rounded-2xl p-3"
              }`}>
                <span className={`material-symbols-outlined ${compact ? "text-lg" : ""}`}>
                  {session.icon}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className={compact ? "text-sm font-bold" : "font-bold"}>{session.device}</p>
                  {session.current ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-500">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
                  {session.location}
                </p>
                <p className={compact ? "text-[10px] text-slate-400" : "text-xs text-slate-400"}>
                  {session.lastActive}
                </p>
              </div>
            </div>

            <button
              className={`shrink-0 rounded-lg font-bold uppercase ${
                compact ? "px-2.5 py-1.5 text-[10px]" : "rounded-xl px-3 py-2 text-xs"
              } tracking-widest ${
                session.current
                  ? "bg-primary/10 text-primary"
                  : "bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/15"
              }`}
              onClick={() => onRevoke(session)}
              type="button"
            >
              {session.current ? "Secured" : "Revoke"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function DesktopSecuritySettings({
  clearNotice,
  fields,
  mfaEnabled,
  notice,
  onChange,
  onRevoke,
  onSubmit,
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
                  Trust Layer
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight">Security Settings</h1>
                <p className="mt-2 max-w-2xl text-base text-slate-500 dark:text-slate-400">
                  Manage your password, authentication methods, and active sessions in one
                  place.
                </p>
              </div>
            </Reveal>

            <AccountNotice notice={notice} onDismiss={clearNotice} />

            <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <AccountSettingsNav />

              <div className="space-y-6">
                <Reveal>
                  <PasswordForm fields={fields} onChange={onChange} onSubmit={onSubmit} />
                </Reveal>
                <Reveal>
                  <TwoFactorSection enabled={mfaEnabled} />
                </Reveal>
                <Reveal>
                  <SessionsSection onRevoke={onRevoke} />
                </Reveal>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileSecuritySettings({
  clearNotice,
  fields,
  mfaEnabled,
  notice,
  onChange,
  onRevoke,
  onSubmit,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen flex-col overflow-hidden">
        <header className="flex shrink-0 items-center border-b border-primary/10 bg-background-light px-4 py-3 dark:bg-background-dark">
          <Link
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/20"
            to={profileHref}
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <div className="ml-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Trust Layer
            </p>
            <h1 className="text-base font-bold">Security Settings</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="space-y-3 px-4 pt-3">
            <AccountNotice notice={notice} onDismiss={clearNotice} />
            <AccountSettingsNav compact />

            <section className="rounded-xl border border-primary/20 bg-primary/10 p-3">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-lg">shield</span>
                <div>
                  <h2 className="text-sm font-bold text-primary">Security Checkup</h2>
                  <div className="mt-1.5 space-y-0.5">
                    {securityCheckItems.map((item) => (
                      <p className="text-xs text-slate-600 dark:text-slate-300" key={item.label}>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.label}:
                        </span>{" "}
                        {item.detail}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <PasswordForm compact fields={fields} onChange={onChange} onSubmit={onSubmit} stacked />
            <TwoFactorSection compact enabled={mfaEnabled} />
            <SessionsSection compact onRevoke={onRevoke} />
          </div>
        </main>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function SecuritySettingsPage() {
  const { clearNotice, mfa, notice, profile, showNotice } = useAccount();
  const [fields, setFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFields((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit() {
    if (!fields.currentPassword || !fields.newPassword || !fields.confirmPassword) {
      showNotice("Complete every password field before saving.", "info");
      return;
    }

    if (fields.newPassword !== fields.confirmPassword) {
      showNotice("New password and confirmation do not match.", "info");
      return;
    }

    setFields({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    showNotice("Password updated successfully.");
  }

  function handleRevoke(session) {
    showNotice(
      session.current
        ? `${session.device} is your current secured device.`
        : `${session.device} session revoked.`,
      session.current ? "info" : "success",
    );
  }

  return (
    <>
      <DesktopSecuritySettings
        clearNotice={clearNotice}
        fields={fields}
        mfaEnabled={mfa.enabled}
        notice={notice}
        onChange={handleChange}
        onRevoke={handleRevoke}
        onSubmit={handleSubmit}
        profile={profile}
      />
      <MobileSecuritySettings
        clearNotice={clearNotice}
        fields={fields}
        mfaEnabled={mfa.enabled}
        notice={notice}
        onChange={handleChange}
        onRevoke={handleRevoke}
        onSubmit={handleSubmit}
      />
    </>
  );
}
