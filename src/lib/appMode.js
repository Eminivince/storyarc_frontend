export const APP_MODE_COOKIE_NAME = "talestead.app-mode";
export const APP_MODE_READER = "reader";
export const APP_MODE_CREATOR = "creator";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const creatorEntryPaths = new Set([
  "/creator",
  "/creator/apply",
  "/creator/application-submitted",
]);
const publicPaths = new Set(["/", "/about", "/terms"]);

function canUseDocument() {
  return typeof document !== "undefined";
}

export function normalizeAppMode(value) {
  if (value === APP_MODE_READER || value === APP_MODE_CREATOR) {
    return value;
  }

  return null;
}

export function isCreatorCapableRole(role) {
  return role === "CREATOR" || role === "ADMIN";
}

export function isCreatorCapableUser(userOrRole) {
  if (!userOrRole) {
    return false;
  }

  return isCreatorCapableRole(
    typeof userOrRole === "string" ? userOrRole : userOrRole.role,
  );
}

export function getStoredAppMode() {
  if (!canUseDocument()) {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const value = cookies
    .find((entry) => entry.startsWith(`${APP_MODE_COOKIE_NAME}=`))
    ?.slice(APP_MODE_COOKIE_NAME.length + 1);

  return normalizeAppMode(value ?? null);
}

export function persistAppMode(mode) {
  const normalizedMode = normalizeAppMode(mode);

  if (!normalizedMode || !canUseDocument()) {
    return;
  }

  const parts = [
    `${APP_MODE_COOKIE_NAME}=${normalizedMode}`,
    "Path=/",
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

export function clearStoredAppMode() {
  if (!canUseDocument()) {
    return;
  }

  const parts = [
    `${APP_MODE_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Lax",
  ];

  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

export function isCreatorEntryPath(pathname) {
  return creatorEntryPaths.has(pathname);
}

export function isCreatorStudioPath(pathname) {
  return (
    pathname.startsWith("/creator/dashboard") ||
    pathname.startsWith("/creator/community") ||
    pathname.startsWith("/creator/earnings") ||
    pathname.startsWith("/creator/withdrawal") ||
    pathname.startsWith("/creator/stories")
  );
}

export function isAdminPath(pathname) {
  return pathname.startsWith("/admin");
}

export function isPublicOrGuestPath(pathname) {
  if (publicPaths.has(pathname)) {
    return true;
  }

  if (pathname.startsWith("/reading-lists/shared")) {
    return true;
  }

  return pathname.startsWith("/auth");
}

export function resolveModeFromPath(pathname) {
  if (
    !pathname ||
    isAdminPath(pathname) ||
    isPublicOrGuestPath(pathname) ||
    pathname.startsWith("/onboarding")
  ) {
    return null;
  }

  if (isCreatorStudioPath(pathname)) {
    return APP_MODE_CREATOR;
  }

  if (isCreatorEntryPath(pathname)) {
    return null;
  }

  return APP_MODE_READER;
}

export function resolveNeutralModeRedirectPath(pathname, userOrRole) {
  if (!isCreatorCapableUser(userOrRole)) {
    return null;
  }

  const preferredMode = getStoredAppMode();

  if (pathname === "/dashboard" && preferredMode === APP_MODE_CREATOR) {
    return "/creator/dashboard";
  }

  if (isCreatorEntryPath(pathname)) {
    return preferredMode === APP_MODE_READER ? "/dashboard" : "/creator/dashboard";
  }

  return null;
}
