import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNotice from "../components/AccountNotice";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import { useAccount } from "../context/AccountContext";
import {
  accountSettingsTabs,
  notificationSections,
  notificationsHref,
  profileHref,
} from "../data/accountFlow";

function Toggle({ checked, disabled, onClick }) {
  return (
    <button
      className={`relative h-6 w-12 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
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

function NotificationInbox({
  notificationFeed,
  onMarkAllRead,
  onMarkRead,
  unreadNotificationCount,
}) {
  if (!notificationFeed.length) {
    return (
      <div className="rounded-xl border border-primary/10 bg-slate-100/60 p-5 text-sm text-slate-500 dark:bg-primary/5 dark:text-slate-400">
        No notifications yet. StoryArc will show rewards, referral, and community activity here.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Notification Center</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {unreadNotificationCount} unread update
            {unreadNotificationCount === 1 ? "" : "s"}
          </p>
        </div>
        <button
          className="rounded-lg border border-primary/20 px-3 py-2 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary/10"
          onClick={onMarkAllRead}
          type="button"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-3">
        {notificationFeed.map((item) => {
          const isUnread = !item.readAt;

          return (
            <div
              className={`rounded-xl border p-4 transition-colors ${
                isUnread
                  ? "border-primary/30 bg-primary/10"
                  : "border-primary/10 bg-slate-100/60 dark:bg-primary/5"
              }`}
              key={item.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.body}
                  </p>
                </div>
                {isUnread ? (
                  <button
                    className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-background-dark"
                    onClick={() => onMarkRead(item.id)}
                    type="button"
                  >
                    New
                  </button>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Read
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DesktopNotifications({
  clearNotice,
  draft,
  notice,
  notificationFeed,
  onSave,
  onMarkAllRead,
  onMarkRead,
  toggleDraft,
  unreadNotificationCount,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/20 bg-background-light px-6 py-3 dark:bg-background-dark">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background-dark">
                <span className="material-symbols-outlined font-bold">menu_book</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">StoryArc</h2>
            </div>
            <label className="flex h-10 min-w-64 flex-col">
              <div className="flex h-full w-full items-stretch rounded-lg">
                <div className="flex items-center justify-center rounded-l-lg bg-slate-200 pl-4 text-slate-500 dark:bg-primary/10 dark:text-slate-400">
                  <span className="material-symbols-outlined text-xl">search</span>
                </div>
                <input
                  className="w-full rounded-r-lg border-none bg-slate-200 px-4 text-base outline-none placeholder:text-slate-500 dark:bg-primary/10 dark:text-slate-100 dark:placeholder:text-slate-400"
                  placeholder="Search notification settings..."
                  type="text"
                />
              </div>
            </label>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 transition-colors hover:bg-primary/20 dark:bg-primary/10"
              to={notificationsHref}
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 transition-colors hover:bg-primary/20 dark:bg-primary/10"
              to={profileHref}
            >
              <span className="material-symbols-outlined">person</span>
            </Link>
          </div>
        </header>

        <div className="flex flex-1">
          <AppDesktopSidebar />

          <main className="custom-scrollbar flex-1 overflow-y-auto bg-background-light p-6 dark:bg-background-dark md:p-10">
            <div className="mx-auto flex max-w-4xl flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black leading-tight tracking-tight">
                  Notification Settings
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                  Manage how you receive updates, social alerts, and security
                  notifications from StoryArc.
                </p>
              </div>

              <AccountNotice notice={notice} onDismiss={clearNotice} />

              <div className="flex border-b border-primary/10">
                {accountSettingsTabs.map((tab) => (
                  <Link
                    className={`px-6 py-3 ${
                      tab.href === notificationsHref
                        ? "border-b-2 border-primary font-bold text-primary"
                        : "font-medium text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                    key={tab.id}
                    to={tab.href}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>

              <NotificationInbox
                notificationFeed={notificationFeed}
                onMarkAllRead={onMarkAllRead}
                onMarkRead={onMarkRead}
                unreadNotificationCount={unreadNotificationCount}
              />

              <div className="flex flex-col gap-10">
                {notificationSections.map((section) => (
                  <section className="flex flex-col gap-4" key={section.id}>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        {section.icon}
                      </span>
                      <h2 className="text-xl font-bold">{section.title}</h2>
                    </div>
                    <div className="grid gap-3">
                      {section.items.map((item) => (
                        <div
                          className="flex items-center justify-between rounded-xl border border-primary/10 bg-slate-100/50 p-5 transition-colors hover:bg-slate-100 dark:bg-primary/5 dark:hover:bg-primary/10"
                          key={item.key}
                        >
                          <div className="max-w-[80%]">
                            <p className="font-bold">{item.title}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          </div>
                          <Toggle
                            checked={draft[item.key]}
                            disabled={item.locked}
                            onClick={() => toggleDraft(item.key)}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                onClick={onSave}
                type="button"
              >
                <span className="material-symbols-outlined">save</span>
                Save Settings
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function MobileNotifications({
  clearNotice,
  draft,
  notice,
  notificationFeed,
  onSave,
  onMarkAllRead,
  onMarkRead,
  toggleDraft,
  unreadNotificationCount,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
        <header className="flex items-center bg-background-light p-4 dark:bg-background-dark">
          <Link className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-white/10" to={profileHref}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="ml-2 flex-1 text-xl font-bold leading-tight tracking-tight">
            Notification Settings
          </h1>
        </header>

        <nav className="shrink-0 border-b border-slate-200 bg-background-light dark:border-white/10 dark:bg-background-dark">
          <div className="hide-scrollbar flex gap-6 overflow-x-auto px-4">
            {accountSettingsTabs.map((tab) => (
              <Link
                className={`flex shrink-0 flex-col items-center justify-center border-b-2 pb-3 pt-2 ${
                  tab.href === notificationsHref
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 dark:text-slate-400"
                }`}
                key={tab.id}
                to={tab.href}
              >
                <span className="text-sm font-bold tracking-wide">{tab.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto pb-32">
          <div className="px-4 pt-4">
            <AccountNotice notice={notice} onDismiss={clearNotice} />
          </div>
          <div className="px-4 pt-4">
            <NotificationInbox
              notificationFeed={notificationFeed}
              onMarkAllRead={onMarkAllRead}
              onMarkRead={onMarkRead}
              unreadNotificationCount={unreadNotificationCount}
            />
          </div>
          {notificationSections.map((section) => (
            <section className="mt-4" key={section.id}>
              <h3 className="px-4 pb-3 text-xs font-bold uppercase tracking-widest text-primary">
                {section.title}
              </h3>
              {section.items.map((item) => (
                <div
                  className="flex min-h-[72px] items-center gap-4 border-b border-slate-200 bg-white/5 px-4 py-3 dark:border-white/5 dark:bg-white/5"
                  key={item.key}
                >
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-base font-semibold">{item.title}</p>
                    <p className="text-sm leading-snug text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Toggle
                      checked={draft[item.key]}
                      disabled={item.locked}
                      onClick={() => toggleDraft(item.key)}
                    />
                  </div>
                </div>
              ))}
            </section>
          ))}
        </main>

        <footer className="absolute bottom-0 left-0 w-full bg-background-light p-6 dark:bg-background-dark">
          <button
            className="w-full rounded-xl bg-primary py-4 font-bold text-background-dark shadow-lg transition-transform active:scale-[0.98]"
            onClick={onSave}
            type="button"
          >
            Save Settings
          </button>
        </footer>
        <AppMobileTabBar className="bottom-[104px]" />
      </div>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const {
    clearNotice,
    markAllNotificationsRead,
    markNotificationRead,
    notice,
    notificationFeed,
    notifications,
    unreadNotificationCount,
    updateNotifications,
  } = useAccount();
  const [draft, setDraft] = useState(notifications);

  useEffect(() => {
    setDraft(notifications);
  }, [notifications]);

  function toggleDraft(key) {
    setDraft((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function onSave() {
    updateNotifications(draft);
  }

  return (
    <>
      <DesktopNotifications
        clearNotice={clearNotice}
        draft={draft}
        notice={notice}
        notificationFeed={notificationFeed}
        onMarkAllRead={markAllNotificationsRead}
        onMarkRead={markNotificationRead}
        onSave={onSave}
        toggleDraft={toggleDraft}
        unreadNotificationCount={unreadNotificationCount}
      />
      <MobileNotifications
        clearNotice={clearNotice}
        draft={draft}
        notice={notice}
        notificationFeed={notificationFeed}
        onMarkAllRead={markAllNotificationsRead}
        onMarkRead={markNotificationRead}
        onSave={onSave}
        toggleDraft={toggleDraft}
        unreadNotificationCount={unreadNotificationCount}
      />
    </>
  );
}
