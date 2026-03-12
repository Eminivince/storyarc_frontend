/**
 * SqueezeLoader / LoadingIndicator
 * Custom animated loading spinner with two morphing shapes.
 * Matches StoryArc color scheme: primary gold #f4c025, surface-dark #2a261f.
 * Use for unauthenticated pages (landing, sign in/up, about) - no skeleton.
 *
 * Keyframes: index.css (squeeze-loader-squeeze, squeeze-loader-spin)
 *
 * @param {Object} props
 * @param {number} [props.size=60] - Size in pixels
 * @param {string} [props.color1] - First color (default: primary gold)
 * @param {string} [props.color2] - Second color (default: surface-dark)
 * @param {number} [props.spinDuration=10] - Spin duration in seconds
 * @param {number} [props.squeezeDuration=3] - Squeeze morph duration in seconds
 * @param {string} [props.className] - Inner wrapper classes
 * @param {string} [props.containerClassName] - Outer container classes
 * @param {boolean} [props.fullScreen=false] - Full viewport centering
 */
export default function LoadingIndicator({
  size = 60,
  color1 = "#f4c025",
  color2 = "#2a261f",
  spinDuration = 10,
  squeezeDuration = 3,
  className = "",
  containerClassName = "",
  fullScreen = false,
}) {
  const containerStyles = fullScreen
    ? "flex min-h-screen min-w-full items-center justify-center bg-background-light dark:bg-background-dark"
    : "flex items-center justify-center bg-background-light dark:bg-background-dark";

  return (
    <div className={`${containerStyles} ${containerClassName}`}>
      <div className={`flex justify-center ${className}`}>
        <div
          className="relative animate-squeeze-spin"
          style={{
            "--color1": color1,
            "--color2": color2,
            "--spin-duration": `${spinDuration}s`,
            "--squeeze-duration": `${squeezeDuration}s`,
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <div
            className="absolute animate-squeeze rounded-sm"
            style={{
              background: "var(--color1)",
            }}
          />
          <div
            className="absolute animate-squeeze-delayed rounded-full"
            style={{
              background: "var(--color2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
