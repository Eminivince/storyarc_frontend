export const authenticatedRoles = ["READER", "CREATOR", "MODERATOR", "ADMIN"];
export const creatorRoles = ["CREATOR", "ADMIN"];
export const adminRoles = ["ADMIN"];
const readerRoles = ["READER"];

const publicPaths = new Set(["/", "/about"]);
const creatorEntryPaths = new Set([
  "/creator",
  "/creator/apply",
  "/creator/application-submitted",
]);

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

  if (role === "ADMIN") {
    return "/admin";
  }

  if (role === "CREATOR") {
    return "/creator/dashboard";
  }

  return "/dashboard";
}

export function getRouteAccess(pathname) {
  if (publicPaths.has(pathname)) {
    return { kind: "public" };
  }

  if (pathname.startsWith("/auth")) {
    return { kind: "guest" };
  }

  if (creatorEntryPaths.has(pathname)) {
    return {
      kind: "authenticated",
      roles: authenticatedRoles,
    };
  }

  if (
    pathname.startsWith("/creator/dashboard") ||
    pathname.startsWith("/creator/community") ||
    pathname.startsWith("/creator/stories")
  ) {
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
