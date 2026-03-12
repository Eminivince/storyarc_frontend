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

function NotificationInbox({
  compact = false,
  notificationFeed,
  onMarkAllRead,
  onMarkRead,
  unreadNotificationCount,
}) {
  if (!notificationFeed.length) {
    return (
      <div
        className={`rounded-xl border border-primary/10 bg-slate-100/60 text-slate-500 dark:bg-primary/5 dark:text-slate-400 ${
          compact ? "p-3 text-xs" : "p-5 text-sm"
        }`}
      >
        No notifications yet. StoryArc will show rewards, referral, and community activity here.
      </div>
    );
  }

  return (
    <section className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
            Notification Center
          </h2>
          <p className={compact ? "text-xs text-slate-500" : "text-sm text-slate-500 dark:text-slate-400"}>
            {unreadNotificationCount} unread update
            {unreadNotificationCount === 1 ? "" : "s"}
          </p>
        </div>
        <button
          className={`rounded-lg border border-primary/20 text-primary transition-colors hover:bg-primary/10 ${
            compact ? "px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider" : "px-3 py-2 text-xs font-bold uppercase tracking-widest"
          }`}
          onClick={onMarkAllRead}
          type="button"
        >
          Mark all read
        </button>
      </div>

      <div className={compact ? "space-y-2" : "space-y-3"}>
        {notificationFeed.map((item) => {
          const isUnread = !item.readAt;

          return (
            <div
              className={`rounded-xl border transition-colors ${
                compact ? "p-3" : "p-4"
              } ${
                isUnread
                  ? "border-primary/30 bg-primary/10"
                  : "border-primary/10 bg-slate-100/60 dark:bg-primary/5"
              }`}
              key={item.id}
            >
              <div className={`flex items-start justify-between ${compact ? "gap-3" : "gap-4"}`}>
                <div>
                  <p className={compact ? "text-sm font-bold" : "font-bold"}>{item.title}</p>
                  <p className={`text-slate-500 dark:text-slate-400 ${compact ? "mt-0.5 text-xs" : "mt-1 text-sm"}`}>
                    {item.body}
                  </p>
                </div>
                {isUnread ? (
                  <button
                    className={`rounded-full bg-primary text-background-dark ${
                      compact ? "px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" : "px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                    }`}
                    onClick={() => onMarkRead(item.id)}
                    type="button"
                  >
                    New
                  </button>
                ) : (
                  <span className={compact ? "text-[9px] font-bold uppercase tracking-wider text-slate-400" : "text-[10px] font-bold uppercase tracking-widest text-slate-400"}>
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
  onMarkAllRead,
  onMarkRead,
  toggleDraft,
  unreadNotificationCount,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
        <header className="flex shrink-0 items-center border-b border-primary/10 bg-background-light px-4 py-3 dark:bg-background-dark">
          <Link
            className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-primary/20"
            to={profileHref}
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <h1 className="ml-2 flex-1 text-base font-bold leading-tight tracking-tight">
            Notification Settings
          </h1>
        </header>

        <nav className="shrink-0 border-b border-primary/10 bg-background-light dark:bg-background-dark">
          <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4">
            {accountSettingsTabs.map((tab) => (
              <Link
                className={`flex shrink-0 flex-col items-center justify-center border-b-2 pb-2 pt-1.5 ${
                  tab.href === notificationsHref
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 dark:text-slate-400"
                }`}
                key={tab.id}
                to={tab.href}
              >
                <span className="text-xs font-bold tracking-wide">{tab.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="px-4 pt-3">
            <AccountNotice notice={notice} onDismiss={clearNotice} />
          </div>
          <div className="px-4 pt-3">
            <NotificationInbox
              compact
              notificationFeed={notificationFeed}
              onMarkAllRead={onMarkAllRead}
              onMarkRead={onMarkRead}
              unreadNotificationCount={unreadNotificationCount}
            />
          </div>
          {notificationSections.map((section) => (
            <section className="mt-3" key={section.id}>
              <h3 className="px-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                {section.title}
              </h3>
              {section.items.map((item) => (
                <div
                  className="flex min-h-[56px] items-center gap-3 border-b border-slate-200 px-4 py-2.5 dark:border-primary/10 dark:bg-white/5"
                  key={item.key}
                >
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Toggle
                      checked={draft[item.key]}
                      compact
                      disabled={item.locked}
                      onClick={() => toggleDraft(item.key)}
                    />
                  </div>
                </div>
              ))}
            </section>
          ))}
        </main>

        <AppMobileTabBar />
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

  function handleToggle(key) {
    const next = { ...draft, [key]: !draft[key] };
    setDraft(next);
    updateNotifications(next);
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
        toggleDraft={handleToggle}
        unreadNotificationCount={unreadNotificationCount}
      />
      <MobileNotifications
        clearNotice={clearNotice}
        draft={draft}
        notice={notice}
        notificationFeed={notificationFeed}
        onMarkAllRead={markAllNotificationsRead}
        onMarkRead={markNotificationRead}
        toggleDraft={handleToggle}
        unreadNotificationCount={unreadNotificationCount}
      />
    </>
  );
}
