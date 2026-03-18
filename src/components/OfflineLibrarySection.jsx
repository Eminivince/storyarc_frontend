import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getOfflineStories, getOfflineStorageEstimate, removeOfflineStory } from "../lib/offlineStorage";
import { useToast } from "../context/ToastContext";
import { buildStoryHref } from "../data/readerFlow";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function OfflineLibrarySection({ mobile = false }) {
  const [stories, setStories] = useState([]);
  const [storageUsage, setStorageUsage] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [offlineStories, estimate] = await Promise.all([
        getOfflineStories(),
        getOfflineStorageEstimate(),
      ]);
      setStories(offlineStories);
      setStorageUsage(estimate.usage);
    } catch {
      // IndexedDB unavailable
    }
  }

  async function handleRemove(event, storySlug) {
    event.preventDefault();
    event.stopPropagation();
    await removeOfflineStory(storySlug);
    setStories((prev) => prev.filter((s) => s.storySlug !== storySlug));
    showToast("Offline copy removed.", { tone: "info" });
  }

  if (!stories.length) return null;

  if (mobile) {
    return (
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold">
            <span className="material-symbols-outlined mr-1 align-middle text-sm text-green-400">download_done</span>
            Downloaded
          </h2>
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
            {stories.length} {stories.length === 1 ? "story" : "stories"} &bull; {formatBytes(storageUsage)}
          </span>
        </div>
        <div className="space-y-1.5">
          {stories.map((story) => (
            <Link key={story.storySlug} to={buildStoryHref(story.storySlug)} className="flex flex-col">
              <motion.article
                className="flex items-center gap-2 rounded-lg border border-green-500/10 bg-green-500/5 p-2"
                whileHover={{ y: -2 }}
              >
                {story.coverUrl && (
                  <img
                    alt={story.title}
                    className="h-12 w-9 shrink-0 rounded object-cover"
                    src={story.coverUrl}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 text-xs font-bold">{story.title}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {story.chapterSlugs?.length || 0} chapter{story.chapterSlugs?.length === 1 ? "" : "s"} saved
                  </p>
                </div>
                <button
                  className="rounded p-1 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  onClick={(e) => handleRemove(e, story.storySlug)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </motion.article>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <span className="material-symbols-outlined text-green-400">download_done</span>
          Downloaded for offline
        </h2>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          {stories.length} {stories.length === 1 ? "story" : "stories"} &bull; {formatBytes(storageUsage)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 xl:grid-cols-4">
        {stories.map((story) => (
          <Link key={story.storySlug} to={buildStoryHref(story.storySlug)}>
            <motion.article className="group" whileHover={{ y: -6 }}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-green-500/15 bg-white shadow-sm dark:bg-primary/5">
                {story.coverUrl ? (
                  <img
                    alt={story.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={story.coverUrl}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <span className="material-symbols-outlined text-4xl text-slate-400">menu_book</span>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 rounded-lg bg-green-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                  {story.chapterSlugs?.length || 0} ch.
                </span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-lg font-bold transition-colors group-hover:text-primary">
                    {story.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {story.authorName || "Unknown author"}
                  </p>
                </div>
                <button
                  className="mt-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  onClick={(e) => handleRemove(e, story.storySlug)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
}
