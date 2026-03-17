import { useCallback, useEffect, useRef, useState } from "react";
import { fetchChapter } from "../reader/readerApi";
import {
  getOfflineChaptersForStory,
  removeOfflineStory,
  saveChapterOffline,
} from "../lib/offlineStorage";

export function useOfflineChapters(storySlug) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [downloadedSlugs, setDownloadedSlugs] = useState(new Set());
  const abortRef = useRef(null);

  useEffect(() => {
    if (!storySlug) return;

    let cancelled = false;

    getOfflineChaptersForStory(storySlug).then((slugs) => {
      if (!cancelled) {
        setDownloadedSlugs(new Set(slugs));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [storySlug]);

  const downloadStory = useCallback(
    async (chapters, storyMeta) => {
      if (!storySlug || !chapters?.length || isDownloading) return;

      const controller = new AbortController();
      abortRef.current = controller;
      setIsDownloading(true);
      setProgress({ done: 0, total: chapters.length });

      const newSlugs = new Set(downloadedSlugs);

      for (let i = 0; i < chapters.length; i++) {
        if (controller.signal.aborted) break;

        const chapter = chapters[i];

        // Skip already-downloaded chapters
        if (newSlugs.has(chapter.chapterSlug)) {
          setProgress({ done: i + 1, total: chapters.length });
          continue;
        }

        try {
          const chapterData = await fetchChapter(storySlug, chapter.chapterSlug);

          if (controller.signal.aborted) break;

          await saveChapterOffline(storySlug, chapter.chapterSlug, chapterData.chapter || chapterData, storyMeta);
          newSlugs.add(chapter.chapterSlug);
        } catch (error) {
          if (error.name === "QuotaExceededError" || error.message?.includes("quota")) {
            break;
          }
          // Skip individual failures, continue with others
        }

        setProgress({ done: i + 1, total: chapters.length });
      }

      setDownloadedSlugs(new Set(newSlugs));
      setIsDownloading(false);
      abortRef.current = null;

      return newSlugs.size;
    },
    [storySlug, downloadedSlugs, isDownloading],
  );

  const removeStory = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    await removeOfflineStory(storySlug);
    setDownloadedSlugs(new Set());
    setIsDownloading(false);
    setProgress({ done: 0, total: 0 });
  }, [storySlug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  return {
    isDownloading,
    progress,
    downloadedSlugs,
    downloadStory,
    removeStory,
  };
}
