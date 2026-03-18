import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BadgeUnlockAnimation from "../components/badges/BadgeUnlockAnimation";
import BadgeVisual from "../components/badges/BadgeVisual";
import Reveal from "../components/Reveal";
import { useSocketEvent } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";
import {
  useBadgesQuery,
  useToggleBadgeFeaturedMutation,
} from "../engagement/engagementHooks";
import {
  missionsHref,
  profileHref,
  rewardsHref,
} from "../data/accountFlow";

const CATEGORIES = ["All", "Reading", "Streak", "Social", "Collection", "Creator"];

const RARITY_BORDER = {
  COMMON: "border-gray-400",
  UNCOMMON: "border-green-500",
  RARE: "border-blue-500",
  EPIC: "border-purple-500",
  LEGENDARY: "border-amber-500",
};

const RARITY_BG = {
  COMMON: "bg-gray-400",
  UNCOMMON: "bg-green-500",
  RARE: "bg-blue-500",
  EPIC: "bg-purple-500",
  LEGENDARY: "bg-amber-500",
};

function BadgeCard({ badge, isFeatured, onToggleFeatured, featuredCount, showToast }) {
  const isLegendary = badge.rarity === "LEGENDARY";

  const handleFeatureToggle = () => {
    if (!isFeatured && featuredCount >= 3) {
      showToast("Maximum 3 featured badges", "error");
      return;
    }
    onToggleFeatured(badge.id);
  };

  return (
    <Reveal>
      <div
        className={`relative rounded-xl border p-4 transition-all ${
          badge.earned
            ? `${RARITY_BORDER[badge.rarity]} border-2 bg-white dark:bg-slate-900/50 ${
                isLegendary ? "shadow-lg shadow-amber-500/30" : ""
              }`
            : "border-primary/10 bg-slate-100 dark:bg-slate-900/30"
        }`}
      >
        {/* Feature star toggle for earned badges */}
        {badge.earned && (
          <button
            className="absolute right-3 top-3 text-slate-400 transition-colors hover:text-amber-400"
            onClick={handleFeatureToggle}
            type="button"
          >
            <span
              className={`material-symbols-outlined text-xl ${
                isFeatured ? "text-amber-400 fill-current" : ""
              }`}
            >
              star
            </span>
          </button>
        )}

        {/* Locked overlay for unearned badges */}
        {!badge.earned && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-slate-900/30">
            <span className="material-symbols-outlined text-3xl text-slate-400">lock</span>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          {/* Badge visual */}
          <div className="mb-3">
            <BadgeVisual rarity={badge.rarity} title={badge.title} earned={badge.earned} />
          </div>

          <h3
            className={`text-sm font-bold ${
              badge.earned ? "" : "text-slate-500 dark:text-slate-500"
            }`}
          >
            {badge.title}
          </h3>
          <p
            className={`mt-1 text-xs ${
              badge.earned
                ? "text-slate-600 dark:text-slate-400"
                : "text-slate-400 dark:text-slate-600"
            }`}
          >
            {badge.description}
          </p>

          {/* Earned date or progress */}
          {badge.earned ? (
            <p className="mt-2 text-xs font-medium text-green-500">
              Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </p>
          ) : (
            <div className="mt-2 w-full">
              <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(
                      (badge.currentValue / badge.requirementValue) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                {badge.currentValue}/{badge.requirementValue} {badge.requirementLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}

function SkeletonGrid({ columns }) {
  return (
    <div className={`grid gap-4 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          className="animate-pulse rounded-xl border border-primary/10 p-4"
          key={i}
        >
          <div className="flex flex-col items-center">
            <div className="mb-3 h-14 w-14 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="mb-2 h-4 w-20 rounded bg-slate-300 dark:bg-slate-700" />
            <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="material-symbols-outlined mb-4 text-5xl text-slate-400">error</span>
      <p className="mb-2 text-lg font-bold">Something went wrong</p>
      <p className="mb-6 text-sm text-slate-500">Could not load your badges. Please try again.</p>
      <button
        className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-background-dark transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
        onClick={onRetry}
        type="button"
      >
        Retry
      </button>
    </div>
  );
}

function CategoryTabs({ activeTab, onTabChange, scrollable }) {
  return (
    <div
      className={`flex gap-2 ${
        scrollable ? "no-scrollbar overflow-x-auto px-4 pb-2" : "flex-wrap"
      }`}
    >
      {CATEGORIES.map((cat) => (
        <button
          className={`flex-none rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === cat
              ? "bg-primary text-background-dark"
              : "bg-primary/10 text-slate-600 hover:bg-primary/20 dark:text-slate-300"
          }`}
          key={cat}
          onClick={() => onTabChange(cat)}
          type="button"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function DesktopBadges({ badges, readerTitle, featuredBadgeIds, activeTab, setActiveTab, toggleFeatured, showToast, isLoading, isError, refetch }) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background-light px-6 py-4 dark:bg-background-dark lg:px-40">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">TaleStead</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              to={rewardsHref}
            >
              <span className="material-symbols-outlined">military_tech</span>
            </Link>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              to={profileHref}
            >
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-8 lg:px-40">
          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Badges</h1>
            {readerTitle && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {readerTitle}
              </p>
            )}
          </div>

          {/* Category tabs */}
          <div className="mb-8">
            <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} scrollable={false} />
          </div>

          {/* Content */}
          {isLoading ? (
            <SkeletonGrid columns={3} />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : (
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {badges.map((badge) => (
                <BadgeCard
                  badge={badge}
                  featuredCount={featuredBadgeIds.length}
                  isFeatured={featuredBadgeIds.includes(badge.id)}
                  key={badge.id}
                  onToggleFeatured={toggleFeatured}
                  showToast={showToast}
                />
              ))}
            </motion.div>
          )}

          {!isLoading && !isError && badges.length === 0 && (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined mb-4 text-5xl text-slate-400">
                emoji_events
              </span>
              <p className="text-lg font-bold">No badges in this category</p>
              <p className="mt-1 text-sm text-slate-500">
                Try selecting a different category above.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function MobileBadges({ badges, readerTitle, featuredBadgeIds, activeTab, setActiveTab, toggleFeatured, showToast, isLoading, isError, refetch }) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light p-4 pb-2 dark:bg-background-dark">
          <Link
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
            to={profileHref}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold uppercase tracking-widest">
            Badges
          </h2>
          <div className="h-10 w-10" />
        </header>

        {/* Reader title */}
        {readerTitle && (
          <div className="px-4 pt-3 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">{readerTitle}</p>
          </div>
        )}

        {/* Category tabs */}
        <div className="py-3">
          <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} scrollable />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 pb-24">
          {isLoading ? (
            <SkeletonGrid columns={2} />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : (
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {badges.map((badge) => (
                <BadgeCard
                  badge={badge}
                  featuredCount={featuredBadgeIds.length}
                  isFeatured={featuredBadgeIds.includes(badge.id)}
                  key={badge.id}
                  onToggleFeatured={toggleFeatured}
                  showToast={showToast}
                />
              ))}
            </motion.div>
          )}

          {!isLoading && !isError && badges.length === 0 && (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined mb-4 text-5xl text-slate-400">
                emoji_events
              </span>
              <p className="text-lg font-bold">No badges in this category</p>
              <p className="mt-1 text-sm text-slate-500">
                Try selecting a different category above.
              </p>
            </div>
          )}
        </main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around border-t border-primary/10 bg-background-dark/95 px-4 pb-6 pt-3 backdrop-blur-md">
          <Link className="flex flex-col items-center gap-1 text-slate-500" to="/dashboard">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <p className="text-[10px] font-bold uppercase tracking-tighter">Home</p>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-slate-500" to={rewardsHref}>
            <span className="material-symbols-outlined text-[24px]">military_tech</span>
            <p className="text-[10px] font-bold uppercase tracking-tighter">Rewards</p>
          </Link>
          <div className="relative -top-4">
            <Link
              className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-background-dark bg-primary text-background-dark shadow-lg shadow-primary/40"
              to={missionsHref}
            >
              <span className="material-symbols-outlined text-[32px]">add</span>
            </Link>
          </div>
          <Link className="flex flex-col items-center gap-1 text-slate-500" to={missionsHref}>
            <span className="material-symbols-outlined text-[24px]">assignment</span>
            <p className="text-[10px] font-bold uppercase tracking-tighter">Tasks</p>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-slate-500" to={profileHref}>
            <span className="material-symbols-outlined text-[24px]">account_circle</span>
            <p className="text-[10px] font-bold uppercase tracking-tighter">Profile</p>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default function BadgesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [unlockBadge, setUnlockBadge] = useState(null);
  const { showToast } = useToast();
  const { data, isLoading, isError, refetch } = useBadgesQuery();
  const { mutate: toggleFeatured } = useToggleBadgeFeaturedMutation();

  useSocketEvent(
    "badge:earned",
    useCallback(
      (payload) => {
        setUnlockBadge(payload);
        refetch();
      },
      [refetch],
    ),
  );

  const allBadges = data?.badges ?? [];
  const readerTitle = data?.readerTitle ?? "";
  const featuredBadgeIds = data?.featuredBadgeIds ?? [];

  const filteredBadges =
    activeTab === "All"
      ? allBadges
      : allBadges.filter(
          (b) => b.category.toLowerCase() === activeTab.toLowerCase()
        );

  const sharedProps = {
    badges: filteredBadges,
    readerTitle,
    featuredBadgeIds,
    activeTab,
    setActiveTab,
    toggleFeatured,
    showToast,
    isLoading,
    isError,
    refetch,
  };

  return (
    <>
      <DesktopBadges {...sharedProps} />
      <MobileBadges {...sharedProps} />
      <BadgeUnlockAnimation
        badge={unlockBadge}
        onDismiss={() => setUnlockBadge(null)}
      />
    </>
  );
}
