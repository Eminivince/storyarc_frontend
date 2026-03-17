import { Link } from "react-router-dom";
import { Logo } from "./Logo";

/**
 * Standard logo + "TaleStead" brand block used across the app.
 * Matches PublicNav pattern: flex items-baseline, Logo with align-baseline, font-extrabold text.
 *
 * @param {string} [to] - If provided, wraps in Link to this href; otherwise a div
 * @param {boolean} [compact] - Tighter gap and responsive logo/text sizes (PublicNav compact mode)
 * @param {"sm"|"md"|"lg"} [size] - sm = sidebar, md = default, lg = footer/hero
 * @param {string} [className] - Wrapper className
 * @param {string} [textClassName] - Extra class for the "TaleStead" span (e.g. text-white, text-slate-100)
 * @param {React.ReactNode} [suffix] - Optional content after "TaleStead" (e.g. " Missions")
 */
export function LogoBrand({
  to,
  compact = false,
  size = "md",
  className = "",
  textClassName = "",
  suffix = null,
  ...rest
}) {
  const isLink = Boolean(to);
  const gapClass = compact ? "gap-0.5" : "gap-1";
  const logoSizes = {
    sm: "h-6 w-6",
    md: compact ? "h-5 w-5 md:h-7 md:w-7" : "h-7 w-7",
    lg: "h-9 w-9 md:h-10 md:w-10",
  };
  const textSizes = {
    sm: "text-lg",
    md: compact ? "text-base md:text-xl" : "text-xl",
    lg: "text-2xl",
  };
  const Wrapper = isLink ? Link : "div";
  const wrapperProps = isLink ? { to, style: { lineHeight: 1 } } : { style: { lineHeight: 1 } };

  return (
    <Wrapper
      className={`flex items-baseline text-primary ${gapClass} ${className}`.trim()}
      {...wrapperProps}
      {...rest}
    >
      <Logo
        alt=""
        aria-hidden
        className={`${logoSizes[size]} align-baseline`}
        style={{
          display: "inline-block",
          verticalAlign: "baseline",
        }}
      />
      <span
        className={`font-extrabold tracking-tight ${textSizes[size]} ${textClassName}`.trim()}
        style={{
          display: "inline-block",
          verticalAlign: "baseline",
        }}
      >
        TaleStead
        {suffix}
      </span>
    </Wrapper>
  );
}
