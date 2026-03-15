import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountSettingsNav from "../components/AccountSettingsNav";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import { useAccount } from "../context/AccountContext";
import {
  notificationSections,
  notificationsHref,
  profileHref,
} from "../data/accountFlow";

function Toggle({ checked, compact, disabled, onClick }) {
  return (
    <button
      className={`relative rounded-full transition-colors ${
        compact ? "h-5 w-9" : "h-6 w-12"
      } ${
        checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
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

function SettingsSections({ compact = false, draft, toggleDraft }) {
  return (
    <div className={compact ? "space-y-3" : "space-y-6"}>
      <section
        className={`rounded-xl border border-primary/20 bg-primary/10 ${
          compact ? "p-4" : "rounded-3xl p-6"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
              Delivery Preferences
            </h2>
            <p
              className={
                compact
                  ? "mt-1 text-xs text-slate-600 dark:text-slate-300"
                  : "mt-2 text-sm text-slate-600 dark:text-slate-300"
              }
            >
              Control where StoryArc should notify you. Your live inbox stays on a
              separate notifications page.
            </p>
          </div>
          <Link
            className={`shrink-0 rounded-xl border border-primary/30 font-bold text-primary transition-colors hover:bg-primary/10 ${
              compact ? "px-3 py-2 text-[10px] uppercase tracking-widest" : "px-4 py-3 text-sm"
            }`}
            to={notificationsHref}
          >
            Open Inbox
          </Link>
        </div>
      </section>

      {notificationSections.map((section) => (
        <section
          className={`rounded-xl border border-primary/10 bg-white/80 dark:bg-primary/5 ${
            compact ? "p-4" : "rounded-3xl p-6"
          }`}
          key={section.id}
        >
          <div className={`flex items-center gap-2 ${compact ? "mb-4" : "mb-5"}`}>
            <span className="material-symbols-outlined text-primary">
              {section.icon}
            </span>
            <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
              {section.title}
            </h2>
          </div>

          <div className={compact ? "space-y-3" : "space-y-4"}>
            {section.items.map((item) => (
              <div
                className={`flex items-center justify-between gap-3 border border-slate-200 bg-slate-50 dark:border-primary/10 dark:bg-background-dark/50 ${
                  compact ? "rounded-lg px-3 py-3" : "rounded-2xl px-4 py-4"
                }`}
                key={item.key}
              >
                <div className="min-w-0 flex-1">
                  <p className={compact ? "text-sm font-semibold" : "font-semibold"}>
                    {item.title}
                  </p>
                  <p
                    className={
                      compact
                        ? "mt-0.5 text-xs text-slate-500"
                        : "text-sm text-slate-500 dark:text-slate-400"
                    }
                  >
                    {item.description}
                  </p>
                </div>
                <Toggle
                  checked={draft[item.key]}
                  compact={compact}
                  disabled={item.locked}
                  onClick={() => toggleDraft(item.key)}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function DesktopNotificationSettings({ draft, profile, toggleDraft }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <AppDesktopSidebar avatar={profile.avatar} memberName={profile.displayName} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl space-y-8">
            <Reveal>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
                  Alert Controls
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight">
                  Notification Settings
                </h1>
                <p className="mt-2 max-w-2xl text-base text-slate-500 dark:text-slate-400">
                  Choose which email, app, and push alerts you want to receive
                  without mixing those controls into the inbox itself.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <AccountSettingsNav />

              <div className="space-y-6">
                <Reveal>
                  <SettingsSections draft={draft} toggleDraft={toggleDraft} />
                </Reveal>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileNotificationSettings({ draft, toggleDraft }) {
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
              Alert Controls
            </p>
            <h1 className="text-base font-bold">Notification Settings</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="space-y-3 px-4 pt-3">
            <AccountSettingsNav compact />
            <SettingsSections compact draft={draft} toggleDraft={toggleDraft} />
          </div>
        </main>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const { notifications, profile, updateNotifications } = useAccount();
  const [draft, setDraft] = useState(notifications);

  useEffect(() => {
    setDraft(notifications);
  }, [notifications]);

  function handleToggle(key) {
    const next = { ...draft, [key]: !draft[key] };
    setDraft(next);
    updateNotifications(next);
  }

  return (
    <>
      <DesktopNotificationSettings
        draft={draft}
        profile={profile}
        toggleDraft={handleToggle}
      />
      <MobileNotificationSettings draft={draft} toggleDraft={handleToggle} />
    </>
  );
}
