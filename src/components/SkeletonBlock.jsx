export default function SkeletonBlock({ as: Component = "div", className = "" }) {
  return (
    <Component
      className={`animate-pulse rounded-2xl bg-slate-200/80 dark:bg-white/10 ${className}`.trim()}
    />
  );
}
