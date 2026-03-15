import { Link, useParams } from "react-router-dom";
import ReaderStateScreen from "../components/ReaderStateScreen";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import {
  buildSearchHref,
  buildStoryHref,
} from "../data/readerFlow";
import { useSharedReadingListQuery } from "../reader/readerHooks";

function SharedListStoryCard({ story }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm dark:bg-primary/5">
      <img
        alt={story.title}
        className="aspect-[3/4] w-full object-cover"
        src={story.coverImage}
      />
      <div className="space-y-3 p-5">
        <div>
          <p className="line-clamp-1 text-xl font-bold">{story.title}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {story.authorName}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span>{story.statusLabel}</span>
          <span>{story.chapterCount} chapters</span>
        </div>
        <Link
          className="inline-flex rounded-2xl bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-background-dark"
          to={buildStoryHref(story.slug)}
        >
          Open Story
        </Link>
      </div>
    </article>
  );
}

export default function SharedReadingListPage() {
  const { shareSlug = "" } = useParams();
  const sharedListQuery = useSharedReadingListQuery(shareSlug);
  const list = sharedListQuery.data?.list ?? null;

  if (sharedListQuery.isLoading) {
    return <RouteLoadingScreen />;
  }

  if (sharedListQuery.isError || !list) {
    return (
      <ReaderStateScreen
        ctaLabel="Browse Stories"
        ctaTo={buildSearchHref("")}
        description={
          sharedListQuery.error?.message ||
          "This public reading list could not be loaded."
        }
        secondaryLabel="Back Home"
        secondaryTo="/"
        title="Reading List Unavailable"
        tone="error"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
            Shared Reading List
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
            {list.name}
          </h1>
          <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Curated by {list.ownerDisplayName}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
            {list.description || "A public TaleStead shelf shared with the community."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-primary/15 bg-white px-4 py-3 dark:bg-background-dark">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Stories
              </p>
              <p className="mt-2 text-2xl font-black">{list.storyCount}</p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-white px-4 py-3 dark:bg-background-dark">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Updated
              </p>
              <p className="mt-2 text-sm font-black">{list.updatedAtLabel}</p>
            </div>
            <Link
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-background-dark"
              to={buildSearchHref("")}
            >
              Browse More
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        <section className="mt-8">
          {list.stories.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {list.stories.map((story) => (
                <SharedListStoryCard key={story.slug} story={story} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-primary">
                auto_stories
              </span>
              <h2 className="mt-3 text-xl font-bold">This list is empty</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                The owner has not added any live stories to this public collection yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
