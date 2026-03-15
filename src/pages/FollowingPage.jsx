import { Link } from "react-router-dom";
import FollowButton from "../components/FollowButton";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import {
  PrefetchableChapterLink,
  PrefetchableStoryLink,
} from "../components/PrefetchableLink";
import ReaderStateScreen from "../components/ReaderStateScreen";
import Reveal from "../components/Reveal";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { notificationsHref } from "../data/accountFlow";
import { buildBrowseHref, buildChapterHref, buildSearchHref } from "../data/readerFlow";
import { useToast } from "../context/ToastContext";
import {
  useReaderFollowingQuery,
  useUnfollowAuthorMutation,
  useUnfollowStoryMutation,
} from "../reader/readerHooks";

function getFollowingErrorMessage(error) {
  return error?.message || "Your following feed could not be loaded right now.";
}

function formatFeedDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently published";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EmptyFollowingState() {
  return (
    <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center">
      <h2 className="text-2xl font-black">Your following feed is empty</h2>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
        Follow a story or author from any story page and new chapter drops will show up here.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-background-dark"
          to={buildBrowseHref("Fantasy")}
        >
          Browse Stories
        </Link>
        <Link
          className="rounded-2xl border border-primary/20 bg-white px-5 py-3 text-sm font-bold dark:bg-primary/5"
          to={buildSearchHref("Fantasy")}
        >
          Search Authors
        </Link>
      </div>
    </div>
  );
}

function FollowSummaries({
  compact = false,
  followedAuthors,
  followedStories,
  isAuthorPending,
  isStoryPending,
  onUnfollowAuthor,
  onUnfollowStory,
}) {
  return (
    <div className={`grid gap-4 xl:grid-cols-2 ${compact ? "gap-3" : "gap-6"}`}>
      <section className={`rounded-2xl border border-primary/10 bg-white dark:bg-primary/5 ${compact ? "p-3" : "rounded-3xl p-6"}`}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className={`font-bold uppercase tracking-[0.18em] text-primary ${compact ? "text-[10px]" : "text-xs"}`}>
              Authors
            </p>
            <h2 className={`font-black ${compact ? "mt-0.5 text-base" : "mt-2 text-2xl"}`}>Followed creators</h2>
          </div>
          <span className={`rounded-full bg-primary/10 font-bold text-primary ${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}>
            {followedAuthors.length}
          </span>
        </div>
        {followedAuthors.length ? (
          <div className={compact ? "mt-2 space-y-2" : "mt-5 space-y-3"}>
            {followedAuthors.map((author) => (
              <div
                className={`flex items-center justify-between gap-2 rounded-xl border border-primary/10 bg-primary/5 ${compact ? "p-2" : "rounded-2xl p-4"}`}
                key={author.id}
              >
                <div className={`flex min-w-0 items-center gap-2 ${compact ? "gap-2" : "gap-3"}`}>
                  {author.avatarUrl ? (
                    <img
                      alt={author.name}
                      className={`shrink-0 rounded-full object-cover ${compact ? "h-9 w-9" : "h-12 w-12"}`}
                      src={author.avatarUrl}
                    />
                  ) : (
                    <div className={`flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-black text-primary ${compact ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm"}`}>
                      {author.name
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className={`truncate font-bold ${compact ? "text-sm" : ""}`}>{author.name}</p>
                    <p className={`truncate text-slate-500 dark:text-slate-400 ${compact ? "text-[10px]" : "text-xs"}`}>
                      {author.storyCount} live {author.storyCount === 1 ? "story" : "stories"}
                    </p>
                  </div>
                </div>
                <FollowButton
                  active
                  compact
                  icon="person_remove"
                  label={isAuthorPending(author.id) ? "Updating..." : "Following"}
                  onClick={() => onUnfollowAuthor(author.id, author.name)}
                  pending={isAuthorPending(author.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-slate-500 dark:text-slate-400 ${compact ? "mt-2 text-[11px]" : "mt-5 text-sm"}`}>
            Followed authors will appear here.
          </p>
        )}
      </section>

      <section className={`rounded-2xl border border-primary/10 bg-white dark:bg-primary/5 ${compact ? "p-3" : "rounded-3xl p-6"}`}>
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className={`font-bold uppercase tracking-[0.18em] text-primary ${compact ? "text-[10px]" : "text-xs"}`}>
              Stories
            </p>
            <h2 className={`font-black ${compact ? "mt-0.5 text-base" : "mt-2 text-2xl"}`}>Tracked series</h2>
          </div>
          <span className={`rounded-full bg-primary/10 font-bold text-primary ${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}>
            {followedStories.length}
          </span>
        </div>
        {followedStories.length ? (
          <div className={compact ? "mt-2 space-y-2" : "mt-5 space-y-3"}>
            {followedStories.map((story) => (
              <div
                className={`flex items-center justify-between gap-2 rounded-xl border border-primary/10 bg-primary/5 ${compact ? "p-2" : "rounded-2xl p-4"}`}
                key={story.id}
              >
                <div className={`flex min-w-0 items-center gap-2 ${compact ? "gap-2" : "gap-3"}`}>
                  <PrefetchableStoryLink
                    className="block shrink-0"
                    storySlug={story.slug}
                    to={`/stories/${story.slug}`}
                  >
                    <img
                      alt={story.title}
                      className={`rounded-lg object-cover ${compact ? "h-12 w-9" : "h-16 w-12 rounded-xl"}`}
                      src={story.coverImage}
                    />
                  </PrefetchableStoryLink>
                  <div className="min-w-0">
                    <p className={`line-clamp-1 font-bold ${compact ? "text-sm" : ""}`}>{story.title}</p>
                    <p className={`line-clamp-1 text-slate-500 dark:text-slate-400 ${compact ? "text-[10px]" : "text-xs"}`}>
                      {story.authorName}
                    </p>
                    <p className={`line-clamp-1 uppercase tracking-[0.16em] text-primary ${compact ? "mt-0.5 text-[9px]" : "mt-1 text-[11px]"}`}>
                      {story.latestPublishedAtLabel || "Waiting for a new chapter"}
                    </p>
                  </div>
                </div>
                <FollowButton
                  active
                  compact
                  icon="close"
                  label={isStoryPending(story.slug) ? "Updating..." : "Following"}
                  onClick={() => onUnfollowStory(story.slug, story.title)}
                  pending={isStoryPending(story.slug)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-slate-500 dark:text-slate-400 ${compact ? "mt-2 text-[11px]" : "mt-5 text-sm"}`}>
            Followed stories will appear here.
          </p>
        )}
      </section>
    </div>
  );
}

function FeedList({ compact = false, items }) {
  if (!items.length) {
    return (
      <div className={`rounded-2xl border border-primary/10 bg-white text-slate-500 dark:bg-primary/5 dark:text-slate-400 ${compact ? "p-3 text-xs" : "rounded-3xl p-6 text-sm"}`}>
        No new chapters yet. We will stack fresh releases here as soon as followed authors or stories publish.
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-4"}>
      {items.map((item, index) => (
        <Reveal delay={index * 0.03} key={item.id}>
          <PrefetchableChapterLink
            chapterSlug={item.chapterSlug}
            className="block"
            storySlug={item.storySlug}
            to={buildChapterHref(item.storySlug, item.chapterSlug)}
          >
            <article className={`rounded-2xl border border-primary/10 bg-white transition-colors hover:bg-primary/5 dark:bg-primary/5 ${compact ? "p-2" : "rounded-3xl p-4"}`}>
              <div className={`flex gap-3 ${compact ? "gap-2" : "gap-4"}`}>
                <img
                  alt={item.storyTitle}
                  className={`shrink-0 rounded-xl object-cover ${compact ? "h-16 w-12" : "h-28 w-20 rounded-2xl"}`}
                  src={item.coverImage}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full bg-primary/10 font-bold uppercase tracking-[0.16em] text-primary ${compact ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]"}`}>
                      Ch. {item.chapterNumber}
                    </span>
                    <span className={`font-semibold uppercase tracking-[0.18em] text-slate-400 ${compact ? "text-[9px]" : "text-[11px]"}`}>
                      {item.publishedAtLabel}
                    </span>
                  </div>
                  <h3 className={`font-black ${compact ? "mt-1.5 line-clamp-1 text-sm" : "mt-3 text-xl"}`}>{item.chapterTitle}</h3>
                  <p className={`font-semibold text-primary ${compact ? "mt-0.5 line-clamp-1 text-xs" : "mt-1 text-sm"}`}>
                    {item.storyTitle} · {item.authorName}
                  </p>
                  {!compact && (
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      Published {formatFeedDate(item.publishedAt)}
                    </p>
                  )}
                </div>
                <div className="hidden shrink-0 items-center text-slate-400 md:flex">
                  <span className="material-symbols-outlined text-2xl">
                    chevron_right
                  </span>
                </div>
              </div>
            </article>
          </PrefetchableChapterLink>
        </Reveal>
      ))}
    </div>
  );
}

function DesktopFollowing({
  data,
  isAuthorPending,
  isStoryPending,
  onUnfollowAuthor,
  onUnfollowStory,
  topGenre,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen">
        <AppDesktopSidebar topGenre={topGenre} />

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary/10 bg-background-light/85 px-6 backdrop-blur-md dark:bg-background-dark/85 lg:px-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Reader Feed
              </p>
              <h1 className="text-2xl font-black">Following</h1>
            </div>
            <Link
              className="relative flex size-10 items-center justify-center rounded-full text-slate-600 hover:bg-primary/10 dark:text-slate-300"
              to={notificationsHref}
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
          </header>

          <div className="space-y-8 p-6 lg:p-10">
            <Reveal>
              <div className="max-w-3xl">
                <h2 className="text-4xl font-black tracking-tight">
                  New chapters from the stories and authors you track
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Follow a story or author from any story page, then use this feed to keep up with fresh releases.
                </p>
              </div>
            </Reveal>

            <FollowSummaries
              followedAuthors={data.followedAuthors}
              followedStories={data.followedStories}
              isAuthorPending={isAuthorPending}
              isStoryPending={isStoryPending}
              onUnfollowAuthor={onUnfollowAuthor}
              onUnfollowStory={onUnfollowStory}
            />

            <Reveal as="section" className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Feed
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Latest releases</h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {data.items.length} updates
                </span>
              </div>
              <FeedList items={data.items} />
            </Reveal>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileFollowing({
  data,
  isAuthorPending,
  isStoryPending,
  onUnfollowAuthor,
  onUnfollowStory,
  topGenre,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <main className="space-y-3 px-3 pb-24 pt-3">
        <Reveal>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Reader Feed
              </p>
              <h1 className="text-xl font-black">Following</h1>
            </div>
            <Link
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-white dark:bg-primary/5"
              to={notificationsHref}
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
            </Link>
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
            Fresh chapters from the stories and creators you follow.
          </p>
        </Reveal>

        <FollowSummaries
          compact
          followedAuthors={data.followedAuthors}
          followedStories={data.followedStories}
          isAuthorPending={isAuthorPending}
          isStoryPending={isStoryPending}
          onUnfollowAuthor={onUnfollowAuthor}
          onUnfollowStory={onUnfollowStory}
        />

        <Reveal as="section" className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-black">Latest releases</h2>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {data.items.length}
            </span>
          </div>
          <FeedList compact items={data.items} />
        </Reveal>
      </main>

      <AppMobileTabBar topGenre={topGenre} />
    </div>
  );
}

export default function FollowingPage() {
  const { showToast } = useToast();
  const followingQuery = useReaderFollowingQuery();
  const unfollowStoryMutation = useUnfollowStoryMutation();
  const unfollowAuthorMutation = useUnfollowAuthorMutation();
  const data = followingQuery.data ?? {
    followedAuthors: [],
    followedStories: [],
    items: [],
  };
  const topGenre = data.followedStories[0]?.genreLabel || "Fantasy";

  async function handleUnfollowStory(storySlug, storyTitle) {
    try {
      const response = await unfollowStoryMutation.mutateAsync(storySlug);
      showToast(response?.message || `Unfollowed ${storyTitle}.`, {
        title: "Story updated",
      });
    } catch (error) {
      showToast(error?.message || "Could not update that story follow yet.", {
        title: "Follow failed",
        tone: "error",
      });
    }
  }

  async function handleUnfollowAuthor(authorId, authorName) {
    try {
      const response = await unfollowAuthorMutation.mutateAsync(authorId);
      showToast(response?.message || `Unfollowed ${authorName}.`, {
        title: "Author updated",
      });
    } catch (error) {
      showToast(error?.message || "Could not update that author follow yet.", {
        title: "Follow failed",
        tone: "error",
      });
    }
  }

  function isStoryPending(storySlug) {
    return unfollowStoryMutation.isPending && unfollowStoryMutation.variables === storySlug;
  }

  function isAuthorPending(authorId) {
    return unfollowAuthorMutation.isPending && unfollowAuthorMutation.variables === authorId;
  }

  if (followingQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <div className="hidden lg:flex">
          <AppDesktopSidebar topGenre={topGenre} />
          <main className="flex-1 p-8">
            <RouteLoadingScreen />
          </main>
        </div>
        <div className="lg:hidden">
          <RouteLoadingScreen />
          <AppMobileTabBar topGenre={topGenre} />
        </div>
      </div>
    );
  }

  if (followingQuery.isError) {
    return (
      <ReaderStateScreen
        ctaLabel="Browse Stories"
        ctaTo={buildBrowseHref(topGenre)}
        description={getFollowingErrorMessage(followingQuery.error)}
        secondaryLabel="Search"
        secondaryTo={buildSearchHref(topGenre)}
        title="Following Unavailable"
        tone="error"
      />
    );
  }

  if (!data.followedAuthors.length && !data.followedStories.length) {
    return (
      <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
        <div className="hidden lg:flex">
          <AppDesktopSidebar topGenre={topGenre} />
          <main className="flex-1 p-8 lg:p-10">
            <EmptyFollowingState />
          </main>
        </div>
        <div className="px-4 pb-24 pt-6 lg:hidden">
          <EmptyFollowingState />
          <AppMobileTabBar topGenre={topGenre} />
        </div>
      </div>
    );
  }

  return (
    <>
      <DesktopFollowing
        data={data}
        isAuthorPending={isAuthorPending}
        isStoryPending={isStoryPending}
        onUnfollowAuthor={handleUnfollowAuthor}
        onUnfollowStory={handleUnfollowStory}
        topGenre={topGenre}
      />
      <MobileFollowing
        data={data}
        isAuthorPending={isAuthorPending}
        isStoryPending={isStoryPending}
        onUnfollowAuthor={handleUnfollowAuthor}
        onUnfollowStory={handleUnfollowStory}
        topGenre={topGenre}
      />
    </>
  );
}
