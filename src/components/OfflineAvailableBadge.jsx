import { useEffect, useState } from "react";
import { isChapterAvailableOffline } from "../lib/offlineStorage";

export default function OfflineAvailableBadge({ storySlug, chapterSlug }) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!storySlug || !chapterSlug) return;

    isChapterAvailableOffline(storySlug, chapterSlug).then(setAvailable).catch(() => {});
  }, [storySlug, chapterSlug]);

  if (!available) return null;

  return (
    <span
      className="inline-flex items-center gap-0.5 rounded bg-green-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-400"
      title="Available offline"
    >
      <span className="material-symbols-outlined text-[10px]">download_done</span>
      Offline
    </span>
  );
}
