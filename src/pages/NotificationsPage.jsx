import { Link, useNavigate } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import NotificationInboxPanel from "../components/NotificationInboxPanel";
import Reveal from "../components/Reveal";
import { useAccount } from "../context/AccountContext";
import {
  notificationSettingsHref,
  notificationsHref,
  profileHref,
} from "../data/accountFlow";

function DesktopNotificationsPage({
  notificationFeed,
  onMarkAllRead,
  onOpenItem,
  profile,
  unreadNotificationCount,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen">
        <AppDesktopSidebar avatar={profile.avatar} memberName={profile.displayName} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-5xl space-y-8">
            <Reveal>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
                    Inbox
                  </p>
                  <h1 className="mt-3 text-4xl font-black tracking-tight">
                    Notifications
                  </h1>
                  <p className="mt-2 max-w-2xl text-base text-slate-500 dark:text-slate-400">
                    Track unread alerts, recent creator updates, rewards, and community
                    activity in one place.
                  </p>
                </div>

                <Link
                  className="rounded-2xl border border-primary/30 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                  to={notificationSettingsHref}
                >
                  Manage Alert Settings
                </Link>
              </div>
            </Reveal>

            <Reveal>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-primary/10 bg-white/80 p-5 dark:bg-primary/5">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                    Unread
                  </p>
                  <p className="mt-2 text-3xl font-black text-primary">
                    {unreadNotificationCount}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Waiting for your attention
                  </p>
                </div>
                <div className="rounded-3xl border border-primary/10 bg-white/80 p-5 dark:bg-primary/5">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                    Latest
                  </p>
                  <p className="mt-2 text-lg font-bold">
                    {notificationFeed[0]?.title ?? "No recent activity"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Most recent event in your inbox
                  </p>
                </div>
                <div className="rounded-3xl border border-primary/10 bg-white/80 p-5 dark:bg-primary/5">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                    Settings
                  </p>
                  <p className="mt-2 text-lg font-bold">Delivery controls</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Tune email, app, and push alerts separately.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-3xl border border-primary/10 bg-white/80 p-6 shadow-sm dark:bg-primary/5">
                <NotificationInboxPanel
                  notificationFeed={notificationFeed}
                  onMarkAllRead={onMarkAllRead}
                  onOpenItem={onOpenItem}
                  unreadNotificationCount={unreadNotificationCount}
                />
              </div>
            </Reveal>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileNotificationsPage({
  notificationFeed,
  onMarkAllRead,
  onOpenItem,
  unreadNotificationCount,
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
          <div className="ml-2 min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Inbox
            </p>
            <h1 className="truncate text-base font-bold">Notifications</h1>
          </div>
          <Link
            className="rounded-lg border border-primary/20 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-primary"
            to={notificationSettingsHref}
          >
            Settings
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <div className="space-y-3 px-4 pt-3">
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                Unread Now
              </p>
              <p className="mt-1 text-2xl font-black">{unreadNotificationCount}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Tap any notification to jump to its live destination.
              </p>
            </div>

            <NotificationInboxPanel
              compact
              notificationFeed={notificationFeed}
              onMarkAllRead={onMarkAllRead}
              onOpenItem={onOpenItem}
              unreadNotificationCount={unreadNotificationCount}
            />
          </div>
        </main>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    markAllNotificationsRead,
    markNotificationRead,
    notificationFeed,
    profile,
    unreadNotificationCount,
  } = useAccount();

  async function handleOpenItem(item) {
    if (!item.readAt) {
      try {
        await markNotificationRead(item.id);
      } catch {
        return;
      }
    }

    navigate(item.ctaHref || notificationsHref);
  }

  return (
    <>
      <DesktopNotificationsPage
        notificationFeed={notificationFeed}
        onMarkAllRead={markAllNotificationsRead}
        onOpenItem={handleOpenItem}
        profile={profile}
        unreadNotificationCount={unreadNotificationCount}
      />
      <MobileNotificationsPage
        notificationFeed={notificationFeed}
        onMarkAllRead={markAllNotificationsRead}
        onOpenItem={handleOpenItem}
        unreadNotificationCount={unreadNotificationCount}
      />
    </>
  );
}
