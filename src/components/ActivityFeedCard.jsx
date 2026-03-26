import { Link } from "react-router-dom";
import { buildStoryHref } from "../data/readerFlow";
import UserAvatar from "./UserAvatar";
import MaterialSymbol from "./MaterialSymbol";

const EVENT_CONFIG = {
  STARTED_STORY: {
    icon: "auto_stories",
    label: "started reading",
    color: "text-blue-400",
  },
  FINISHED_STORY: {
    icon: "celebration",
    label: "finished",
    color: "text-amber-400",
  },
  REVIEWED_STORY: {
    icon: "rate_review",
    label: "reviewed",
    color: "text-purple-400",
  },
  ADDED_TO_LIST: {
    icon: "bookmark_add",
    label: "added to reading list",
    color: "text-green-400",
  },
  REACHED_MILESTONE: {
    icon: "emoji_events",
    label: "reached a milestone",
    color: "text-amber-500",
  },
  EARNED_BADGE: {
    icon: "military_tech",
    label: "earned a badge",
    color: "text-primary",
  },
};

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function getEventDescription(item) {
  const config = EVENT_CONFIG[item.eventType] ?? {
    icon: "info",
    label: "did something",
    color: "text-slate-400",
  };

  const meta = item.metadata ?? {};
  let detail = null;

  if (item.eventType === "REACHED_MILESTONE" && meta.milestone) {
    detail = meta.milestone;
  } else if (item.eventType === "EARNED_BADGE" && meta.badgeTitle) {
    detail = meta.badgeTitle;
  } else if (item.eventType === "REVIEWED_STORY" && meta.rating) {
    detail = `${meta.rating}/5`;
  }

  return { ...config, detail };
}

export default function ActivityFeedCard({ item, showUser = true }) {
  const { icon, label, color, detail } = getEventDescription(item);
  const userName = showUser
    ? item.user?.displayName ?? "Reader"
    : "You";

  return (
    <div className="flex items-start gap-3">
      {showUser && (
        <UserAvatar
          className="h-8 w-8 shrink-0 rounded-full"
          fallbackClassName="text-xs"
          name={item.user?.displayName}
          src={item.user?.avatarUrl}
        />
      )}
      {!showUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <MaterialSymbol name={icon} className={`text-base ${color}`} />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">
          <span className="font-bold">{userName}</span>{" "}
          <span className="text-slate-500 dark:text-slate-400">{label}</span>
          {item.story && (
            <>
              {" "}
              <Link
                className="font-semibold text-primary hover:underline"
                to={buildStoryHref(item.story.slug)}
              >
                {item.story.title}
              </Link>
            </>
          )}
          {detail && (
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
              — {detail}
            </span>
          )}
        </p>
        <p className="mt-0.5 text-[10px] text-slate-400">
          {formatTimeAgo(item.createdAt)}
        </p>
      </div>

      {item.story?.coverImageUrl && (
        <Link
          className="shrink-0"
          to={buildStoryHref(item.story.slug)}
        >
          <img
            alt={item.story.title}
            className="h-10 w-7 rounded object-cover"
            src={item.story.coverImageUrl}
          />
        </Link>
      )}
    </div>
  );
}
