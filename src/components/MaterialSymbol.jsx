import { resolveSnakeCaseAntIcon } from "../lib/snakeCaseAntIconMap";

/**
 * Renders an Ant Design icon for a legacy snake_case name (e.g. check_circle).
 * `filled` picks a filled variant when the map provides one.
 */
export function MaterialSymbol({
  name,
  className = "",
  filled = false,
  style,
  ...rest
}) {
  const Cmp = resolveSnakeCaseAntIcon(name, filled);
  return (
    <Cmp
      aria-hidden
      className={className.trim()}
      style={{ fontSize: "1em", lineHeight: 1, ...style }}
      {...rest}
    />
  );
}

export default MaterialSymbol;
