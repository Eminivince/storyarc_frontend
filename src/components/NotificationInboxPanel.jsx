function formatNotificationTimestamp(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60_000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function NotificationInboxPanel({
  compact = false,
  emptyMessage = "No notifications yet. TaleStead will show rewards, referral, and community activity here.",
  notificationFeed,
  onMarkAllRead,
  onOpenItem,
  unreadNotificationCount,
}) {
  if (!notificationFeed.length) {
    return (
      <div
        className={`rounded-xl border border-primary/10 bg-slate-100/60 text-slate-500 dark:bg-primary/5 dark:text-slate-400 ${
          compact ? "p-3 text-xs" : "p-5 text-sm"
        }`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <section className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className={compact ? "text-base font-bold" : "text-xl font-bold"}>
            Notifications
          </h2>
          <p
            className={
              compact
                ? "text-xs text-slate-500"
                : "text-sm text-slate-500 dark:text-slate-400"
            }
          >
            {unreadNotificationCount} unread update
            {unreadNotificationCount === 1 ? "" : "s"}
          </p>
        </div>
        <button
          className={`rounded-lg border border-primary/20 text-primary transition-colors hover:bg-primary/10 ${
            compact
              ? "px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider"
              : "px-3 py-2 text-xs font-bold uppercase tracking-widest"
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
            <button
              className={`w-full rounded-xl border text-left transition-colors ${
                compact ? "p-3" : "p-4"
              } ${
                isUnread
                  ? "border-primary/30 bg-primary/10"
                  : "border-primary/10 bg-slate-100/60 dark:bg-primary/5"
              }`}
              key={item.id}
              onClick={() => onOpenItem(item)}
              type="button"
            >
              <div
                className={`flex items-start justify-between ${compact ? "gap-3" : "gap-4"}`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={compact ? "text-sm font-bold" : "font-bold"}>
                      {item.title}
                    </p>
                    {isUnread ? (
                      <span
                        className={`rounded-full bg-primary text-background-dark ${
                          compact
                            ? "px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                            : "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                        }`}
                      >
                        New
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={`text-slate-500 dark:text-slate-400 ${
                      compact ? "mt-0.5 text-xs" : "mt-1 text-sm"
                    }`}
                  >
                    {item.body}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    <span>{formatNotificationTimestamp(item.createdAt)}</span>
                    <span>&bull;</span>
                    <span>{item.ctaLabel || "Open notification"}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400">
                  chevron_right
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
