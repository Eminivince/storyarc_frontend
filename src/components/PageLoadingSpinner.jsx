import LoadingIndicator from "./ui/loading-indicator";

/**
 * Full-screen custom loading spinner for unauthenticated / simple pages
 * (landing, sign in/up, about). Uses SqueezeLoader - no skeleton.
 */
export default function PageLoadingSpinner() {
  return (
    <LoadingIndicator
      fullScreen
      size={56}
      color1="#f4c025"
      color2="#2a261f"
      spinDuration={10}
      squeezeDuration={3}
    />
  );
}
