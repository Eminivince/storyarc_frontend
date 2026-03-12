/**
 * Simple spinning ring loader.
 * Props: size (default 48), className, fullScreen (boolean).
 * When fullScreen=true: min-h-screen, centered, bg matches theme.
 * Uses primary color (border-t-primary, border-primary/20).
 */
export default function LoadingSpinner({
  size = 48,
  className = "",
  fullScreen = false,
}) {
  const ring = (
    <div
      className={`animate-spin rounded-full border-2 border-primary/20 border-t-primary ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        {ring}
      </div>
    );
  }

  return ring;
}
