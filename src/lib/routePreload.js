const preloadBySegment = {
  "": () => import("../pages/HomePage"),
  dashboard: () => import("../pages/DashboardPage"),
  browse: () => import("../pages/BrowsePage"),
  library: () => import("../pages/ReaderLibraryPage"),
  search: () => import("../pages/SearchResultsPage"),
  auth: () => import("../pages/AuthPage"),
  profile: () => import("../pages/ProfilePage"),
  account: () => import("../pages/AccountSettingsPage"),
  rewards: () => import("../pages/RewardsPage"),
  stories: () => import("../pages/StoryDetailsPage"),
  read: () => import("../pages/ReadingPage"),
  creator: () => import("../pages/AuthorDashboardPage"),
  admin: () => import("../pages/AdminDashboardPage"),
};

const preloaded = new Set();

export function preloadRoute(pathname) {
  if (!pathname) return;
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  if (preloaded.has(segment)) return;
  const loader = preloadBySegment[segment];
  if (loader) {
    preloaded.add(segment);
    loader().catch(() => {});
  }
}
