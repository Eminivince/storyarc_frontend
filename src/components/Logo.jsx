/**
 * App logo using the shared Logo.svg from public.
 * Use className for size (e.g. h-8 w-8, h-9 w-9, text-3xl equivalent via size).
 */
export function Logo({ alt = "TaleStead", className = "", ...props }) {
  return (
    <img
      src="/Logo.svg"
      alt={alt}
      className={`shrink-0 object-contain ${className}`.trim()}
      {...props}
    />
  );
}
