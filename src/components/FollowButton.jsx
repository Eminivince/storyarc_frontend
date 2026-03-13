export default function FollowButton({
  active = false,
  compact = false,
  disabled = false,
  icon = "favorite",
  label,
  onClick,
  pending = false,
}) {
  const baseClassName = compact
    ? "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold"
    : "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold";
  const toneClassName = active
    ? "bg-primary text-background-dark"
    : "border border-primary/20 bg-primary/5 text-slate-900 dark:text-slate-100";

  return (
    <button
      className={`${baseClassName} ${toneClassName} ${disabled || pending ? "cursor-not-allowed opacity-70" : "transition-colors hover:border-primary/40 hover:bg-primary/10"}`}
      disabled={disabled || pending}
      onClick={onClick}
      type="button"
    >
      <span className={`material-symbols-outlined ${compact ? "text-base" : "text-lg"}`}>
        {pending ? "progress_activity" : icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
