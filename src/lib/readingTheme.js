export const READING_THEME_COOKIE_NAME = "talestead.reading-theme";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** Normalized cookie/API value; used when no stored or profile preference exists. */
export const DEFAULT_READING_THEME = "dark";
/** Matches backend {@link READING_THEMES} labels for onboarding state. */
export const DEFAULT_READING_THEME_LABEL = "Dark";

function canUseDocument() {
  return typeof document !== "undefined";
}

export function normalizeReadingTheme(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value).toLowerCase();

  if (normalized === "light" || normalized === "dark" || normalized === "sepia") {
    return normalized;
  }

  return null;
}

export function getStoredReadingTheme() {
  if (!canUseDocument()) {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const value = cookies
    .find((entry) => entry.startsWith(`${READING_THEME_COOKIE_NAME}=`))
    ?.slice(READING_THEME_COOKIE_NAME.length + 1);

  return normalizeReadingTheme(value ?? null);
}

export function persistReadingTheme(theme) {
  const normalizedTheme = normalizeReadingTheme(theme);

  if (!normalizedTheme || !canUseDocument()) {
    return;
  }

  const parts = [
    `${READING_THEME_COOKIE_NAME}=${normalizedTheme}`,
    "Path=/",
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

