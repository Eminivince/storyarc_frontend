import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useScrollHide } from "../hooks/useScrollHide";
import { useAuth } from "../context/AuthContext";
import { LogoBrand } from "./LogoBrand";
import { useToast } from "../context/ToastContext";
import {
  accountSettingsHref,
  profileHref,
  rewardsHref,
} from "../data/accountFlow";
import {
  adminActivityHref,
  adminBooksHref,
  adminContractsHref,
  adminDashboardHref,
  adminMessagesHref,
  adminModerationHref,
  adminMonetizationHref,
  adminSettingsHref,
  adminUsersHref,
} from "../data/adminFlow";
import {
  authorDashboardHref,
  creatorCommunityHref,
  creatorEarningsHref,
  creatorStoriesHref,
  getCreatorScheduledChaptersHref,
  getCreatorVolumeManagerHref,
} from "../data/creatorFlow";
import { preloadRoute } from "../lib/routePreload";
import { useCreator } from "../context/CreatorContext";
import {
  buildBrowseHref,
  followingHref,
  buildSearchHref,
  readerLibraryHref,
  readingListsHref,
  rankingsHref,
} from "../data/readerFlow";
import UserAvatar from "./UserAvatar";

function getReaderConfig(topGenre, creatorEntryHref = "/creator") {
  return {
    homeHref: "/dashboard",
    primary: [
      { id: "home", icon: "home", label: "Home", href: "/dashboard" },
      {
        id: "browse",
        icon: "explore",
        label: "Browse",
        href: buildBrowseHref(topGenre),
      },
      { id: "rankings", icon: "trophy", label: "Rankings", href: rankingsHref },
      { id: "library", icon: "auto_stories", label: "Library", href: readerLibraryHref },
      {
        id: "profile",
        icon: "person",
        label: "Profile",
        href: profileHref,
      },
    ],
    secondaryTitle: "Collections",
    secondary: [
      {
        id: "reading-lists",
        icon: "format_list_bulleted",
        label: "Reading Lists",
        href: readingListsHref,
      },
      {
        id: "following",
        icon: "favorite",
        label: "Following",
        href: followingHref,
      },
      {
        id: "rewards",
        icon: "history",
        label: "Rewards",
        href: rewardsHref,
      },
    ],
    mobile: [
      { id: "home", icon: "home", label: "Home", href: "/dashboard" },
      { id: "rankings", icon: "leaderboard", label: "Rankings", href: rankingsHref },
      { id: "reading-lists", icon: "format_list_bulleted", label: "Lists", href: readingListsHref },
      {
        id: "write",
        icon: "edit_square",
        label: "Write",
        href: creatorEntryHref,
      },
      {
        id: "library",
        icon: "auto_stories",
        label: "Library",
        href: readerLibraryHref,
        dot: true,
      },
      {
        id: "profile",
        icon: "person",
        label: "Profile",
        href: profileHref,
      },
    ],
  };
}

function getCreatorConfig(storySlug) {
  return {
    homeHref: authorDashboardHref,
    primary: [
      {
        id: "home",
        icon: "home",
        label: "Home",
        href: authorDashboardHref,
      },
      {
        id: "stories",
        icon: "auto_stories",
        label: "Stories",
        href: creatorStoriesHref,
      },
      {
        id: "queue",
        icon: "schedule",
        label: "Queue",
        href: getCreatorScheduledChaptersHref(storySlug),
      },
      {
        id: "structure",
        icon: "account_tree",
        label: "Structure",
        href: getCreatorVolumeManagerHref(storySlug),
      },
    ],
    secondaryTitle: "Studio",
    secondary: [
      {
        id: "earnings",
        icon: "payments",
        label: "Earnings",
        href: creatorEarningsHref,
      },
      {
        id: "community",
        icon: "campaign",
        label: "Community",
        href: creatorCommunityHref,
      },
      {
        id: "profile",
        icon: "person",
        label: "Profile",
        href: profileHref,
      },
      {
        id: "reader-mode",
        icon: "switch_account",
        label: "Reader Mode",
        href: "/dashboard",
      },
    ],
    mobile: [
      {
        id: "home",
        icon: "home",
        label: "Home",
        href: authorDashboardHref,
      },
      {
        id: "stories",
        icon: "auto_stories",
        label: "Stories",
        href: creatorStoriesHref,
      },
      {
        id: "read",
        icon: "menu_book",
        label: "Read",
        href: "/dashboard",
      },
      {
        id: "earnings",
        icon: "payments",
        label: "Earnings",
        href: creatorEarningsHref,
      },
      {
        id: "community",
        icon: "campaign",
        label: "Community",
        href: creatorCommunityHref,
      },
      {
        id: "queue",
        icon: "schedule",
        label: "Queue",
        href: getCreatorScheduledChaptersHref(storySlug),
      },
    ],
  };
}

function resolveCreatorStorySlug(explicitStorySlug, activeStorySlug, stories) {
  if (explicitStorySlug) {
    return explicitStorySlug;
  }

  if (activeStorySlug) {
    return activeStorySlug;
  }

  return stories[0]?.slug ?? null;
}

function getAdminConfig() {
  return {
    homeHref: adminDashboardHref,
    primary: [
      {
        id: "home",
        icon: "space_dashboard",
        label: "Dashboard",
        href: adminDashboardHref,
      },
      {
        id: "books",
        icon: "auto_stories",
        label: "Books",
        href: adminBooksHref,
      },
      {
        id: "contracts",
        icon: "description",
        label: "Contracts",
        href: adminContractsHref,
      },
      {
        id: "users",
        icon: "group",
        label: "Users",
        href: adminUsersHref,
      },
      {
        id: "moderation",
        icon: "gavel",
        label: "Moderation",
        href: adminModerationHref,
      },
      {
        id: "revenue",
        icon: "payments",
        label: "Revenue",
        href: adminMonetizationHref,
      },
      {
        id: "messages",
        icon: "chat_bubble",
        label: "Messages",
        href: adminMessagesHref,
      },
    ],
    secondaryTitle: "Platform",
    secondary: [
      {
        id: "settings",
        icon: "settings",
        label: "Settings",
        href: adminSettingsHref,
      },
      {
        id: "activity",
        icon: "history",
        label: "Activity",
        href: adminActivityHref,
      },
      {
        id: "reader-mode",
        icon: "switch_account",
        label: "Reader Mode",
        href: "/dashboard",
      },
    ],
    mobile: [
      {
        id: "home",
        icon: "space_dashboard",
        label: "Home",
        href: adminDashboardHref,
      },
      {
        id: "books",
        icon: "auto_stories",
        label: "Books",
        href: adminBooksHref,
      },
      {
        id: "contracts",
        icon: "description",
        label: "Contracts",
        href: adminContractsHref,
      },
      {
        id: "users",
        icon: "group",
        label: "Users",
        href: adminUsersHref,
      },
      {
        id: "moderation",
        icon: "gavel",
        label: "Reports",
        href: adminModerationHref,
      },
      {
        id: "revenue",
        icon: "payments",
        label: "Revenue",
        href: adminMonetizationHref,
      },
      {
        id: "messages",
        icon: "chat_bubble",
        label: "Inbox",
        href: adminMessagesHref,
      },
    ],
  };
}

function getActiveKey(mode, pathname) {
  if (mode === "admin") {
    if (pathname === adminDashboardHref) {
      return "home";
    }

    if (pathname.startsWith("/admin/users")) {
      return "users";
    }

    if (pathname.startsWith(adminBooksHref)) {
      return "books";
    }

    if (pathname.startsWith(adminContractsHref)) {
      return "contracts";
    }

    if (pathname.startsWith(adminModerationHref)) {
      return "moderation";
    }

    if (pathname.startsWith(adminMonetizationHref)) {
      return "revenue";
    }

    if (pathname.startsWith(adminMessagesHref)) {
      return "messages";
    }

    if (pathname.startsWith(adminSettingsHref)) {
      return "settings";
    }

    if (pathname.startsWith(adminActivityHref)) {
      return "activity";
    }

    return "home";
  }

  if (mode === "creator") {
    if (pathname === authorDashboardHref) {
      return "home";
    }

    if (pathname.startsWith("/account")) {
      return "profile";
    }

    if (pathname.startsWith(creatorEarningsHref) || pathname.startsWith("/creator/withdrawal")) {
      return "earnings";
    }

    if (pathname.startsWith(creatorCommunityHref)) {
      return "community";
    }

    if (pathname.includes("/schedule")) {
      return "queue";
    }

    if (pathname.includes("/structure")) {
      return "structure";
    }

    if (pathname.startsWith("/creator/stories")) {
      return "stories";
    }

    return "home";
  }

  if (pathname === "/dashboard") {
    return "home";
  }

  if (pathname === "/rankings" || pathname.startsWith("/rankings")) {
    return "rankings";
  }

  if (pathname === followingHref || pathname.startsWith(`${followingHref}/`)) {
    return "following";
  }

  if (pathname === readingListsHref || pathname.startsWith(`${readingListsHref}/`)) {
    return "reading-lists";
  }

  if (pathname.startsWith("/search") || pathname.startsWith("/browse")) {
    return "browse";
  }

  if (pathname === readerLibraryHref || pathname.startsWith(`${readerLibraryHref}/`)) {
    return "library";
  }

  if (pathname.startsWith("/stories") || pathname.startsWith("/read")) {
    return "library";
  }

  if (
    pathname.startsWith("/account/rewards") ||
    pathname.startsWith("/account/missions") ||
    pathname.startsWith("/account/referrals") ||
    pathname.startsWith("/account/leaderboard")
  ) {
    return "rewards";
  }

  if (pathname.startsWith("/account")) {
    return "profile";
  }

  return "home";
}

function DesktopNavLink({ active, href, icon, label, onClick }) {
  return (
    <Link
      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
        active
          ? "bg-primary font-bold text-background-dark"
          : "hover:bg-primary/10"
      }`}
      onClick={onClick}
      onFocus={() => preloadRoute(href)}
      onMouseEnter={() => preloadRoute(href)}
      to={href}
    >
      <span
        className={`material-symbols-outlined ${
          active ? "" : "text-primary"
        }`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ active, dot, href, icon, label, onClick }) {
  return (
    <Link
      className="group flex flex-col items-center gap-0.5"
      onClick={onClick}
      onFocus={() => preloadRoute(href)}
      onMouseEnter={() => preloadRoute(href)}
      to={href}
    >
      <div className="relative">
        <span
          className={`material-symbols-outlined text-xl transition-all duration-300 ${
            active
              ? "fill-1 scale-110 text-primary"
              : "text-slate-400 dark:text-slate-500 group-hover:text-primary"
          }`}
        >
          {icon}
        </span>
        {dot ? (
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border-2 border-background-dark bg-primary" />
        ) : null}
      </div>
      <span
        className={`text-[10px] ${
          active
            ? "font-semibold text-primary"
            : "font-medium text-slate-400 dark:text-slate-500"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export function AppDesktopSidebar({
  avatar,
  memberLabel,
  memberName,
  mode = "reader",
  storySlug = null,
  topGenre,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, isLoggingOut, user } = useAuth();
  const { activeStorySlug, enterReaderMode, stories } = useCreator();
  const { showToast } = useToast();
  let config = getReaderConfig(topGenre);
  const resolvedCreatorStorySlug = resolveCreatorStorySlug(
    storySlug,
    activeStorySlug,
    stories,
  );

  if (mode === "creator") {
    config = getCreatorConfig(resolvedCreatorStorySlug);
  }

  if (mode === "admin") {
    config = getAdminConfig();
  }

  const activeKey = getActiveKey(mode, pathname);
  const resolvedMemberName = memberName ?? user?.displayName ?? "TaleStead Reader";
  const roleLabel =
    memberLabel ??
    (user?.role === "ADMIN"
      ? "Admin"
      : user?.role === "CREATOR"
        ? "Creator"
        : user?.role === "MODERATOR"
          ? "Moderator"
          : mode === "creator"
            ? "Pro Creator"
            : mode === "admin"
              ? "Admin"
              : "Reader");
  const settingsHref = mode === "admin" ? adminSettingsHref : accountSettingsHref;
  const resolvedAvatar = avatar ?? user?.avatarUrl ?? null;

  async function handleSignOut() {
    await logout();
    showToast("Signed out.");
    navigate("/auth", { replace: true });
  }

  const logoHref = config.homeHref ?? "/dashboard";

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-primary/10 bg-background-light dark:bg-background-dark lg:flex">
      <div className="shrink-0 px-4 pt-4 pb-2">
        <LogoBrand className="text-slate-900 dark:text-slate-100" size="sm" to={logoHref} />
      </div>
      <nav className="mt-2 flex-1 space-y-2 px-4">
        {config.primary.map((item) => (
          <DesktopNavLink
            active={activeKey === item.id}
            href={item.href}
            icon={item.icon}
            key={item.label}
            label={item.label}
          />
        ))}

        <div className="px-4 pb-2 pt-6 text-xs font-bold uppercase tracking-widest text-slate-500">
          {config.secondaryTitle}
        </div>

        {config.secondary.map((item) => (
          <DesktopNavLink
            active={activeKey === item.id}
            href={item.href}
            icon={item.icon}
            key={item.label}
            label={item.label}
            onClick={item.id === "reader-mode" ? enterReaderMode : undefined}
          />
        ))}
      </nav>

      <div className="border-t border-primary/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-2">
          <UserAvatar
            className="size-10 rounded-full border-2 border-primary"
            fallbackClassName="text-sm"
            name={resolvedMemberName}
            src={resolvedAvatar}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{resolvedMemberName}</p>
            <p className="text-xs font-medium text-primary">{roleLabel}</p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              className="text-sm text-slate-400 transition-colors hover:text-primary"
              to={settingsHref}
            >
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <button
              className="text-sm text-slate-400 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoggingOut}
              onClick={handleSignOut}
              type="button"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AppMobileTabBar({
  className = "",
  mode = "reader",
  storySlug = null,
  topGenre,
}) {
  const { pathname } = useLocation();
  const { activeStorySlug, enterReaderMode, enterWriterMode, getCreatorEntryHref, stories } = useCreator();
  const navVisible = useScrollHide();
  let config = getReaderConfig(topGenre, getCreatorEntryHref());
  const resolvedCreatorStorySlug = resolveCreatorStorySlug(
    storySlug,
    activeStorySlug,
    stories,
  );

  if (mode === "creator") {
    config = getCreatorConfig(resolvedCreatorStorySlug);
  }

  if (mode === "admin") {
    config = getAdminConfig();
  }

  const activeKey = getActiveKey(mode, pathname);
  const maxWidthClass =
    config.mobile.length > 5 ? "max-w-full" : config.mobile.length > 4 ? "max-w-lg" : "max-w-md";

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-primary/10 bg-background-light px-2 pb-1.5 pt-1.5 transition-transform duration-300 ease-out dark:bg-background-dark lg:hidden ${className}`.trim()}
      style={{ transform: navVisible ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className={`mx-auto flex w-full max-w-full items-center ${maxWidthClass}`.trim()}>
        {config.mobile.map((item) => (
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center py-0.5" key={item.label}>
            <MobileNavLink
              active={activeKey === item.id}
              dot={item.dot}
              href={item.href}
              icon={item.icon}
              label={item.label}
              onClick={
                mode === "reader" && item.id === "write"
                  ? enterWriterMode
                  : mode === "creator" && item.id === "read"
                    ? enterReaderMode
                    : undefined
              }
            />
          </div>
        ))}
      </div>
    </nav>
  );
}
