export default function AccountNotice({ notice, onDismiss }) {
  if (!notice) {
    return null;
  }

  const toneClasses =
    notice.tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-100"
      : "border-primary/30 bg-primary/10 text-slate-900 dark:text-slate-100";

  return (
    <div className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 ${toneClasses}`}>
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined mt-0.5 text-lg">
          notifications_active
        </span>
        <p className="text-sm font-medium">{notice.message}</p>
      </div>
      <button
        className="text-xs font-bold uppercase tracking-widest opacity-80 transition-opacity hover:opacity-100"
        onClick={onDismiss}
        type="button"
      >
        Dismiss
      </button>
    </div>
  );
}
