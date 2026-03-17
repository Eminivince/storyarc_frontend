import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactionHeatmap from "../components/ReactionHeatmap";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useReactionHeatmapQuery } from "../engagement/engagementHooks";
import { useStoryDetailsQuery } from "../reader/readerHooks";

export default function ReactionHeatmapPage() {
  const { storySlug } = useParams();
  const storyQuery = useStoryDetailsQuery(storySlug);
  const story = storyQuery.data?.story;
  const chapters = story?.chapters ?? [];
  const [selectedChapterSlug, setSelectedChapterSlug] = useState(null);
  const activeSlug = selectedChapterSlug || chapters[0]?.slug;
  const heatmapQuery = useReactionHeatmapQuery(storySlug, activeSlug);

  if (storyQuery.isLoading) {
    return <RouteLoadingScreen />;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden min-h-screen bg-background-dark font-display text-slate-100 md:block">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link
                className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                to="/creator/dashboard"
              >
                Creator Dashboard
              </Link>
              <h1 className="mt-1 text-2xl font-bold">
                Reaction Heatmap — {story?.title ?? storySlug}
              </h1>
            </div>
          </div>

          {chapters.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {chapters.map((ch) => (
                <button
                  key={ch.slug}
                  onClick={() => setSelectedChapterSlug(ch.slug)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeSlug === ch.slug
                      ? "bg-primary text-background-dark"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  Ch. {ch.chapterNumber}
                </button>
              ))}
            </div>
          )}

          {heatmapQuery.isLoading && (
            <p className="text-sm text-zinc-500">Loading heatmap data...</p>
          )}

          {heatmapQuery.data && <ReactionHeatmap data={heatmapQuery.data} />}

          {!heatmapQuery.isLoading && !heatmapQuery.data && chapters.length === 0 && (
            <p className="text-sm text-zinc-500">No published chapters yet.</p>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="min-h-screen bg-background-dark font-display text-slate-100 md:hidden">
        <div className="px-4 py-6">
          <div className="mb-4">
            <Link
              className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
              to="/creator/dashboard"
            >
              Back to Dashboard
            </Link>
            <h1 className="mt-1 text-lg font-bold">
              Reaction Heatmap
            </h1>
            <p className="text-xs text-zinc-500">{story?.title}</p>
          </div>

          {chapters.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {chapters.map((ch) => (
                <button
                  key={ch.slug}
                  onClick={() => setSelectedChapterSlug(ch.slug)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeSlug === ch.slug
                      ? "bg-primary text-background-dark"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  Ch. {ch.chapterNumber}
                </button>
              ))}
            </div>
          )}

          {heatmapQuery.isLoading && (
            <p className="text-sm text-zinc-500">Loading...</p>
          )}

          {heatmapQuery.data && <ReactionHeatmap data={heatmapQuery.data} />}
        </div>
      </div>
    </>
  );
}
