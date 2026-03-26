import Reveal from "./Reveal";
import ActivityFeedCard from "./ActivityFeedCard";
import MaterialSymbol from "./MaterialSymbol";

function EmptyFeed({ own = false }) {
  return (
    <div className="rounded-xl border border-primary/10 bg-primary/5 p-5 text-center">
      <MaterialSymbol name={own ? "history" : "group"} className="text-2xl text-primary" />
      <p className="mt-2 text-sm font-bold">
        {own ? "No activity yet" : "No updates from people you follow"}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {own
          ? "Start reading stories to build your activity history."
          : "Follow authors to see their reading activity here."}
      </p>
    </div>
  );
}

function FeedSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div className="flex items-start gap-3" key={i}>
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-primary/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-primary/10" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-primary/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ActivityFeedSection({
  data,
  isLoading,
  own = false,
  title = "Activity Feed",
  icon = "group",
  className = "",
}) {
  const items = data?.items ?? [];

  return (
    <Reveal as="section" className={className}>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <MaterialSymbol name={icon} className="text-primary" />
        {title}
      </h3>

      {isLoading && !items.length ? (
        <FeedSkeleton count={own ? 3 : 4} />
      ) : !items.length ? (
        <EmptyFeed own={own} />
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <ActivityFeedCard
              item={item}
              key={item.id}
              showUser={!own}
            />
          ))}
        </div>
      )}
    </Reveal>
  );
}
