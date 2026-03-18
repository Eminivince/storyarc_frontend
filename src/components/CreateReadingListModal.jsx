import { useEffect } from "react";
import { motion } from "framer-motion";

const VISIBILITY_OPTIONS = [
  { value: "private", label: "Private", icon: "lock", description: "Only you can see this list" },
  { value: "public", label: "Public", icon: "public", description: "Anyone can discover and view this list" },
];

function DesktopCreateReadingListModal({
  title,
  description,
  visibility,
  onTitleChange,
  onDescriptionChange,
  onVisibilityChange,
  onSubmit,
  onClose,
  heading,
  submitLabel,
}) {
  const canSubmit = title.trim().length > 0;

  return (
    <div className="hidden md:block">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="create-list-title">
        <motion.div
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative flex w-full max-w-[480px] flex-col overflow-hidden rounded-xl border border-primary/10 bg-background-light shadow-2xl dark:bg-[#2d2818]"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          transition={{ duration: 0.2 }}
        >
          <header className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background-dark">
                <span className="material-symbols-outlined text-xl font-bold">add_circle</span>
              </div>
              <h2 id="create-list-title" className="text-xl font-bold leading-tight">
                {heading}
              </h2>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-primary/10 hover:text-slate-700 dark:text-slate-400 dark:hover:text-primary" onClick={onClose} type="button" aria-label="Close">
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          <form
            className="space-y-5 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit) onSubmit();
            }}
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="list-title">List name</label>
              <input
                autoFocus
                className="w-full rounded-lg border border-primary/10 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 dark:border-primary/20 dark:bg-[#221e10] dark:text-slate-100"
                id="list-title"
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g. Summer Reading, Favorites"
                type="text"
                value={title}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="list-description">Description (optional)</label>
              <textarea
                className="min-h-[88px] w-full resize-none rounded-lg border border-primary/10 bg-white p-4 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 dark:border-primary/20 dark:bg-[#221e10] dark:text-slate-100"
                id="list-description"
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="What's this list about?"
                value={description}
              />
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold">Visibility</span>
              <div className="grid gap-2">
                {VISIBILITY_OPTIONS.map((opt) => {
                  const isSelected = visibility === opt.value;
                  return (
                    <button
                      className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-all ${
                        isSelected ? "border-primary/40 bg-primary/5" : "border-primary/10 hover:border-primary/40 dark:border-primary/20"
                      }`}
                      key={opt.value}
                      onClick={() => onVisibilityChange(opt.value)}
                      type="button"
                    >
                      <span className={`material-symbols-outlined text-primary ${isSelected ? "fill-1" : ""}`}>{opt.icon}</span>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold">{opt.label}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{opt.description}</span>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary">check_circle</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>

          <div className="flex items-center justify-end gap-3 border-t border-primary/10 bg-primary/5 px-6 py-5">
            <button className="rounded-lg border border-primary/20 px-6 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-primary/10 dark:text-slate-300" onClick={onClose} type="button">
              Cancel
            </button>
            <button
              className="rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-background-dark shadow-lg shadow-primary/10 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onSubmit}
              type="button"
              disabled={!canSubmit}
            >
              {submitLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MobileCreateReadingListModal({
  title,
  description,
  visibility,
  onTitleChange,
  onDescriptionChange,
  onVisibilityChange,
  onSubmit,
  onClose,
  heading,
  submitLabel,
}) {
  const canSubmit = title.trim().length > 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-dark/60 p-3 font-display md:hidden" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="create-list-title-mobile">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-primary/10 dark:bg-zinc-900/95"
        initial={{ opacity: 0, y: 18 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.22 }}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-primary/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary">add_circle</span>
            <h1 id="create-list-title-mobile" className="text-base text-primary font-bold tracking-tight">
              {heading}
            </h1>
          </div>
          <button
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-primary/10 dark:hover:text-primary"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form
          className="space-y-4 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) onSubmit();
          }}
        >
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-primary/70" htmlFor="list-title-mob">List name</label>
            <input
              autoFocus
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-background-dark dark:text-slate-100"
              id="list-title-mob"
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Summer Reading"
              type="text"
              value={title}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-primary/70" htmlFor="list-desc-mob">Description (optional)</label>
            <textarea
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-primary/20 dark:bg-background-dark dark:text-slate-100"
              id="list-desc-mob"
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="What's this list about?"
              rows="2"
              value={description}
            />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-primary/70">Visibility</span>
            <div className="flex gap-2">
              {VISIBILITY_OPTIONS.map((opt) => {
                const isSelected = visibility === opt.value;
                return (
                  <button
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2.5 text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/20 text-primary dark:border-primary dark:bg-primary/20"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/40 dark:border-primary/20 dark:bg-primary/5 dark:text-slate-400"
                    }`}
                    key={opt.value}
                    onClick={() => onVisibilityChange(opt.value)}
                    type="button"
                  >
                    <span className={`material-symbols-outlined text-base ${isSelected ? "fill-1" : ""}`}>{opt.icon}</span>
                    <span className="text-xs font-semibold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 dark:border-primary/10">
          <button
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/10 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onSubmit}
            type="button"
            disabled={!canSubmit}
          >
            {submitLabel}
          </button>
          <button className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/20" onClick={onClose} type="button">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CreateReadingListModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  visibility,
  onTitleChange,
  onDescriptionChange,
  onVisibilityChange,
  heading = "Create New List",
  submitLabel = "Create List",
}) {
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <DesktopCreateReadingListModal
        description={description}
        onClose={onClose}
        onDescriptionChange={onDescriptionChange}
        onSubmit={onSubmit}
        onTitleChange={onTitleChange}
        onVisibilityChange={onVisibilityChange}
        heading={heading}
        submitLabel={submitLabel}
        title={title}
        visibility={visibility}
      />
      <MobileCreateReadingListModal
        description={description}
        onClose={onClose}
        onDescriptionChange={onDescriptionChange}
        onSubmit={onSubmit}
        onTitleChange={onTitleChange}
        onVisibilityChange={onVisibilityChange}
        heading={heading}
        submitLabel={submitLabel}
        title={title}
        visibility={visibility}
      />
    </>
  );
}
