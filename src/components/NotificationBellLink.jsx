import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "../context/AccountContext";
import MaterialSymbol from "./MaterialSymbol";
import {
  notificationSettingsHref,
  notificationsHref,
} from "../data/accountFlow";

function formatUnreadCount(count) {
  if (count > 99) {
    return "99+";
  }

  return String(count);
}

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

export default function NotificationBellLink({
  badgeClassName = "",
  className = "",
  iconClassName = "",
  menuClassName = "",
  showZeroBadge = false,
}) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const {
    markAllNotificationsRead,
    markNotificationRead,
    notificationFeed,
    unreadNotificationCount,
  } = useAccount();
  const latestNotifications = notificationFeed.slice(0, 5);
  const shouldShowBadge = unreadNotificationCount > 0 || showZeroBadge;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  async function handleOpenItem(item) {
    if (!item.readAt) {
      try {
        await markNotificationRead(item.id);
      } catch {
        return;
      }
    }

    setIsOpen(false);
    navigate(item.ctaHref || notificationsHref);
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
    } catch {
      return;
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={
          unreadNotificationCount > 0
            ? `Open notifications, ${unreadNotificationCount} unread`
            : "Open notifications"
        }
        className={`relative ${className}`.trim()}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <MaterialSymbol
          className={iconClassName.trim()}
          name="notifications"
        />
        {shouldShowBadge ? (
          <span
            className={`absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold leading-none text-background-dark ${badgeClassName}`.trim()}
          >
            {formatUnreadCount(unreadNotificationCount)}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className={`absolute right-0 top-full z-50 mt-3 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-primary/10 bg-background-light p-4 shadow-2xl shadow-black/15 dark:bg-background-dark ${menuClassName}`.trim()}
          role="dialog"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
                Notifications
              </p>
              <h2 className="mt-1 text-lg font-black">
                {unreadNotificationCount} unread
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Latest alerts from your stories, rewards, and community activity.
              </p>
            </div>
            <button
              className="shrink-0 rounded-xl border border-primary/20 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={unreadNotificationCount === 0}
              onClick={handleMarkAllRead}
              type="button"
            >
              Mark all read
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {latestNotifications.length ? (
              latestNotifications.map((item) => {
                const isUnread = !item.readAt;

                return (
                  <button
                    className={`w-full rounded-2xl border p-3 text-left transition-colors ${
                      isUnread
                        ? "border-primary/30 bg-primary/10"
                        : "border-primary/10 bg-slate-100/60 dark:bg-primary/5"
                    }`}
                    key={item.id}
                    onClick={() => handleOpenItem(item)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold">{item.title}</p>
                          {isUnread ? (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-background-dark">
                              New
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                          {item.body}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          <span>{formatNotificationTimestamp(item.createdAt)}</span>
                          <span>&bull;</span>
                          <span>{item.ctaLabel || "Open notification"}</span>
                        </div>
                      </div>
                      <MaterialSymbol name="chevron_right" className="shrink-0 text-base text-slate-400" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-primary/10 bg-slate-100/60 p-4 text-sm text-slate-500 dark:bg-primary/5 dark:text-slate-400">
                No notifications yet.
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-primary/10 pt-4">
            <Link
              className="text-sm font-bold text-primary transition-opacity hover:opacity-80"
              onClick={() => setIsOpen(false)}
              to={notificationsHref}
            >
              View all notifications
            </Link>
            <Link
              className="text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
              onClick={() => setIsOpen(false)}
              to={notificationSettingsHref}
            >
              Alert settings
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
