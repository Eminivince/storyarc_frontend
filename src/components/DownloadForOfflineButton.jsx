import { useState } from "react";
import { useOfflineChapters } from "../hooks/useOfflineChapters";
import { useToast } from "../context/ToastContext";

export default function DownloadForOfflineButton({ storySlug, chapters, storyMeta, size = "sm" }) {
  const { isDownloading, progress, downloadedSlugs, downloadStory, removeStory } =
    useOfflineChapters(storySlug);
  const { showToast } = useToast();
  const [confirmRemove, setConfirmRemove] = useState(false);

  const allDownloaded =
    chapters?.length > 0 && downloadedSlugs.size >= chapters.length;

  async function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (isDownloading) return;

    if (allDownloaded) {
      if (!confirmRemove) {
        setConfirmRemove(true);
        window.setTimeout(() => setConfirmRemove(false), 3000);
        return;
      }

      await removeStory();
      setConfirmRemove(false);
      showToast("Offline copy removed.", { tone: "info" });
      return;
    }

    try {
      await downloadStory(chapters, storyMeta);
      showToast("Downloaded for offline reading.", { tone: "success" });
    } catch {
      showToast("Download failed. Try again later.", { tone: "error" });
    }
  }

  const isSmall = size === "sm";
  const baseClass = isSmall
    ? "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all"
    : "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all";

  if (isDownloading) {
    const percent =
      progress.total > 0
        ? Math.round((progress.done / progress.total) * 100)
        : 0;

    return (
      <span className={`${baseClass} cursor-wait border-primary/20 bg-primary/5 text-primary`}>
        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
        {percent}%
      </span>
    );
  }

  if (allDownloaded) {
    return (
      <button
        className={`${baseClass} ${
          confirmRemove
            ? "border-red-400/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            : "border-green-400/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
        }`}
        onClick={handleClick}
        type="button"
      >
        <span className="material-symbols-outlined text-sm">
          {confirmRemove ? "delete" : "download_done"}
        </span>
        {confirmRemove ? "Remove?" : "Saved"}
      </button>
    );
  }

  return (
    <button
      className={`${baseClass} border-primary/20 bg-primary/5 text-primary hover:bg-primary/10`}
      onClick={handleClick}
      type="button"
    >
      <span className="material-symbols-outlined text-sm">download</span>
      Download
    </button>
  );
}
