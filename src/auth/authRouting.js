import {
  APP_MODE_CREATOR,
  APP_MODE_READER,
  getStoredAppMode,
  isCreatorCapableRole,
  isCreatorEntryPath,
  isCreatorStudioPath,
} from "../lib/appMode";

export const authenticatedRoles = ["READER", "CREATOR", "MODERATOR", "ADMIN"];
export const creatorRoles = ["CREATOR", "ADMIN"];
export const adminRoles = ["ADMIN"];
const readerRoles = ["READER"];

const publicPaths = new Set(["/", "/about", "/terms"]);

export function isUnauthenticatedRoute(pathname) {
  if (publicPaths.has(pathname)) return true;
  if (pathname.startsWith("/reading-lists/shared")) return true;
  if (pathname.startsWith("/auth")) return true;
  return false;
}
export function getOnboardingEntryPath(user) {
  if (!user || !readerRoles.includes(user.role) || user.onboarding?.isComplete) {
    return null;
  }

  return user.onboarding?.step === "preferences"
    ? "/onboarding/preferences"
    : "/onboarding/genres";
}

export function getDefaultSignedInPath(userOrRole) {
  if (typeof userOrRole !== "string") {
    const onboardingPath = getOnboardingEntryPath(userOrRole);

    if (onboardingPath) {
      return onboardingPath;
    }
  }

  const role = typeof userOrRole === "string" ? userOrRole : userOrRole?.role;
  const preferredMode = isCreatorCapableRole(role) ? getStoredAppMode() : null;

  if (role === "ADMIN") {
    if (preferredMode === APP_MODE_READER) {
      return "/dashboard";
    }

    if (preferredMode === APP_MODE_CREATOR) {
      return "/creator/dashboard";
    }

    return "/admin";
  }

  if (role === "CREATOR") {
    return preferredMode === APP_MODE_READER ? "/dashboard" : "/creator/dashboard";
  }

  return "/dashboard";
}

export function getRouteAccess(pathname) {
  if (publicPaths.has(pathname)) {
    return { kind: "public" };
  }

  if (pathname.startsWith("/reading-lists/shared")) {
    return { kind: "public" };
  }

  if (pathname.startsWith("/auth")) {
    return { kind: "guest" };
  }

  if (isCreatorEntryPath(pathname)) {
    return {
      kind: "authenticated",
      roles: authenticatedRoles,
    };
  }

  if (isCreatorStudioPath(pathname)) {
    return {
      kind: "authenticated",
      roles: creatorRoles,
    };
  }

  if (pathname.startsWith("/admin")) {
    return {
      kind: "authenticated",
      roles: adminRoles,
    };
  }

  return {
    kind: "authenticated",
    roles: authenticatedRoles,
  };
}

export function canAccessPath(pathname, role) {
  if (!role) {
    return publicPaths.has(pathname);
  }

  const access = getRouteAccess(pathname);

  if (access.kind === "public") {
    return true;
  }

  if (access.kind === "guest") {
    return false;
  }

  return access.roles.includes(role);
}

export function resolvePostLoginPath(user, requestedLocation) {
  const onboardingPath = getOnboardingEntryPath(user);

  if (onboardingPath) {
    return onboardingPath;
  }

  const requestedPath =
    typeof requestedLocation === "string"
      ? requestedLocation.split("?")[0]
      : requestedLocation?.pathname;

  if (requestedPath && canAccessPath(requestedPath, user?.role)) {
    const search =
      typeof requestedLocation === "object" && requestedLocation?.search
        ? requestedLocation.search
        : typeof requestedLocation === "string" && requestedLocation.includes("?")
          ? "?" + requestedLocation.split("?")[1]
          : "";
    const hash =
      typeof requestedLocation === "object" && requestedLocation?.hash
        ? requestedLocation.hash
        : typeof requestedLocation === "string" && requestedLocation.includes("#")
          ? requestedLocation.slice(requestedLocation.indexOf("#"))
          : "";
    return requestedPath + search + hash;
  }

  return getDefaultSignedInPath(user);
}
