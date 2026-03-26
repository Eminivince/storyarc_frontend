import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import SkeletonBlock from "../components/SkeletonBlock";
import UserAvatar from "../components/UserAvatar";
import { useAccount } from "../context/AccountContext";
import { useBadgesQuery } from "../engagement/engagementHooks";
import { useAuth } from "../context/AuthContext";
import { useMonetization } from "../context/MonetizationContext";
import { useToast } from "../context/ToastContext";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  accountQuickLinks,
  billingSettingsHref,
  editProfileHref,
  notificationsHref,
  profileTabs,
} from "../data/accountFlow";
import {
  buildChapterHref,
  buildSearchHref,
  readerLibraryHref,
  buildStoryHref,
} from "../data/readerFlow";

function SectionEmptyState({
  body,
  ctaHref,
  ctaLabel,
  icon = "auto_stories",
  title,
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 text-center">
      <MaterialSymbol name={icon} className="text-3xl text-primary" />
      <h4 className="mt-3 text-lg font-bold">{title}</h4>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{body}</p>
      {ctaHref && ctaLabel ? (
        <Link
          className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-background-dark"
          to={ctaHref}
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

function ProfileStatsGrid({ isLoading = false, items, mobile = false }) {
  if (isLoading && !items.length) {
    if (mobile) {
      return (
        <div className="flex flex-wrap gap-3 px-4 py-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="flex min-w-[80px] flex-1 basis-[fit-content] flex-col gap-2 rounded-xl border border-slate-200 bg-white/50 p-3 dark:border-primary/20 dark:bg-primary/5"
              key={index}
            >
              <SkeletonBlock className="mx-auto h-6 w-12" />
              <SkeletonBlock className="mx-auto h-3 w-14" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="rounded-lg border border-slate-200 bg-white p-3 text-center dark:border-white/10 dark:bg-white/5"
            key={index}
          >
            <SkeletonBlock className="mx-auto h-6 w-14" />
            <SkeletonBlock className="mx-auto mt-1.5 h-3 w-16" />
          </div>
        ))}
      </section>
    );
  }

  if (!items.length) {
    return null;
  }

  if (mobile) {
    return (
      <div className="flex flex-wrap gap-3 px-4 py-3">
        {items.map((item) => (
          <div
            className="flex min-w-[80px] flex-1 basis-[fit-content] flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white/50 p-3 text-center dark:border-primary/20 dark:bg-primary/5"
            key={item.label}
          >
            <p className="text-xl font-bold">{item.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          className="rounded-lg border border-slate-200 bg-white p-3 text-center dark:border-white/10 dark:bg-white/5"
          key={item.label}
        >
          <p className="text-xl font-black">{item.value}</p>
          <p className="mt-0.5 text-[10px] font-medium uppercase text-slate-500 dark:text-slate-400">
            {item.label}
          </p>
        </div>
      ))}
    </section>
  );
}

function ProfileMediaSkeleton({ mobile = false }) {
  if (mobile) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-primary/20 dark:bg-primary/5">
        <div className="flex gap-4">
          <SkeletonBlock className="h-32 w-24 flex-shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-3/4" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
            <div className="space-y-3">
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-2 w-full rounded-full" />
              <SkeletonBlock className="h-8 w-full rounded-lg bg-primary/20 dark:bg-primary/15" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
      <div className="flex gap-6">
        <SkeletonBlock className="h-36 w-24 flex-shrink-0 rounded-lg" />
        <div className="flex flex-1 flex-col justify-center space-y-3">
          <SkeletonBlock className="h-5 w-1/2" />
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-2 w-full rounded-full" />
          <SkeletonBlock className="h-8 w-36 rounded-lg bg-primary/20 dark:bg-primary/15" />
        </div>
      </div>
    </div>
  );
}

function ProfileShelfSkeleton({ mobile = false }) {
  if (mobile) {
    return (
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="w-32 flex-shrink-0" key={index}>
            <SkeletonBlock className="aspect-[2/3] w-full rounded-xl" />
            <SkeletonBlock className="mt-2 h-4 w-3/4" />
            <SkeletonBlock className="mt-1 h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index}>
          <SkeletonBlock className="mb-3 aspect-[2/3] w-full rounded-xl" />
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="mt-1 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function ActivitySkeleton({ mobile = false }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: mobile ? 3 : 4 }).map((_, index) => (
        <div
          className={
            mobile
              ? "flex items-start gap-3"
              : "rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          }
          key={index}
        >
          <SkeletonBlock className="h-8 w-8 flex-shrink-0 rounded-full bg-primary/20 dark:bg-primary/15" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-4 w-4/5" />
            <SkeletonBlock className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function WalletSection({ coinBalance, isLoading = false, mobile = false }) {
  const content = (
    <div
      className={`overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 ${
        mobile ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
            StoryCoins Balance
          </p>
          {isLoading ? (
            <SkeletonBlock className="mt-3 h-10 w-32 rounded-lg" />
          ) : (
            <p className={`${mobile ? "mt-2 text-3xl" : "mt-3 text-4xl"} font-black`}>
              {coinBalance.toLocaleString()}
            </p>
          )}
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Use coins for chapter unlocks, gifts, and other premium reader actions.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-background-dark shadow-lg shadow-primary/20">
          <MaterialSymbol name="monetization_on" className="text-2xl" />
        </div>
      </div>
      <Link
        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background-light px-4 py-2 text-xs font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary/5 dark:bg-background-dark"
        to={billingSettingsHref}
      >
        Manage Billing
        <MaterialSymbol name="chevron_right" className="text-sm" />
      </Link>
    </div>
  );

  if (mobile) {
    return (
      <div className="px-4 py-4">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <MaterialSymbol name="monetization_on" className="text-primary" />
          Wallet
        </h3>
        {content}
      </div>
    );
  }

  return (
    <Reveal>
      <h3 className="mb-4 text-lg font-bold">Wallet</h3>
      {content}
    </Reveal>
  );
}

function DesktopCurrentReading({ currentReading, isLoading }) {
  if (isLoading && !currentReading) {
    return (
      <Reveal>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Currently Reading</h3>
          <Link
            className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
            to={readerLibraryHref}
          >
            View Library
          </Link>
        </div>
        <ProfileMediaSkeleton />
      </Reveal>
    );
  }

  return (
    <Reveal>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Currently Reading</h3>
        <Link
          className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
          to={readerLibraryHref}
        >
          View Library
        </Link>
      </div>
      {currentReading ? (
        <div className="flex gap-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="h-36 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800 shadow-lg">
            <img
              alt={currentReading.storyTitle}
              className="h-full w-full object-cover"
              src={currentReading.coverImage}
            />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <h4 className="mb-1 text-lg font-bold">{currentReading.storyTitle}</h4>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              By {currentReading.authorName}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-primary">
                  {currentReading.progressPercent}% Complete
                </span>
                <span className="text-slate-400">{currentReading.chapterLabel}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${currentReading.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {currentReading.resumeLabel}
              </p>
            </div>
            <Link
              className="mt-4 self-start rounded bg-primary px-4 py-1.5 text-xs font-black uppercase text-background-dark"
              to={buildChapterHref(
                currentReading.storySlug,
                currentReading.chapterSlug,
              )}
            >
              Continue Reading
            </Link>
          </div>
        </div>
      ) : (
        <SectionEmptyState
          body={"Start a story and your active read will appear here."}
          ctaHref={buildSearchHref("")}
          ctaLabel="Explore Stories"
          title="Nothing in progress yet"
        />
      )}
    </Reveal>
  );
}

function MobileCurrentReading({ currentReading, isLoading }) {
  if (isLoading && !currentReading) {
    return (
      <div className="px-4 py-4">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
          <MaterialSymbol name="auto_stories" className="text-primary" />
          Currently Reading
        </h3>
        <ProfileMediaSkeleton mobile />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <MaterialSymbol name="auto_stories" className="text-primary" />
        Currently Reading
      </h3>
      {currentReading ? (
        <div className="flex gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 dark:border-primary/20 dark:bg-primary/5">
          <div className="h-32 w-24 flex-shrink-0 rounded-lg bg-cover bg-center shadow-lg">
            <img
              alt={currentReading.storyTitle}
              className="h-full w-full rounded-lg object-cover"
              src={currentReading.coverImage}
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <p className="text-lg font-bold leading-tight">
                {currentReading.storyTitle}
              </p>
              <p className="text-sm font-medium text-primary">
                by {currentReading.authorName}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>{currentReading.chapterLabel}</span>
                <span>{currentReading.progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-primary/20">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${currentReading.progressPercent}%` }}
                />
              </div>
              <Link
                className="block w-full rounded-lg bg-primary py-2 text-center text-xs font-black uppercase tracking-widest text-background-dark transition-colors hover:bg-primary/90"
                to={buildChapterHref(
                  currentReading.storySlug,
                  currentReading.chapterSlug,
                )}
              >
                Continue Reading
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <SectionEmptyState
          body={"Pick a story from the library to start building your reading history."}
          ctaHref={buildSearchHref("")}
          ctaLabel="Explore Stories"
          title="Nothing in progress yet"
        />
      )}
    </div>
  );
}

function DesktopReadingList({ isLoading, readingList }) {
  if (isLoading && !readingList.length) {
    return (
      <Reveal>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Reading List</h3>
          <Link
            className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
            to={buildSearchHref("")}
          >
            Explore
          </Link>
        </div>
        <ProfileShelfSkeleton />
      </Reveal>
    );
  }

  return (
    <Reveal>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Reading List</h3>
        <Link
          className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
          to={buildSearchHref("")}
        >
          Explore
        </Link>
      </div>
      {readingList.length ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {readingList.map((story, index) => (
            <Link key={story.storySlug} to={buildStoryHref(story.storySlug)}>
              <motion.article
                className="group cursor-pointer"
                whileHover={{ y: -6 }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2, once: true }}
                transition={{ delay: index * 0.04, duration: 0.24 }}
              >
                <div className="mb-3 aspect-[2/3] overflow-hidden rounded-xl bg-slate-800 shadow-md ring-2 ring-transparent transition-all group-hover:ring-primary">
                  <img
                    alt={story.storyTitle}
                    className="h-full w-full object-cover"
                    src={story.coverImage}
                  />
                </div>
                <h5 className="truncate text-sm font-bold">{story.storyTitle}</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {story.authorName}
                </p>
              </motion.article>
            </Link>
          ))}
        </div>
      ) : (
        <SectionEmptyState
          body={"Bookmark chapters and they will show up here as your reading list."}
          ctaHref={buildSearchHref("")}
          ctaLabel="Find Stories"
          icon="bookmark"
          title="Your reading list is empty"
        />
      )}
    </Reveal>
  );
}

function MobileReadingList({ isLoading, readingList }) {
  if (isLoading && !readingList.length) {
    return (
      <div className="px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <MaterialSymbol name="bookmark" className="text-primary" />
            Reading List
          </h3>
          <Link
            className="text-[11px] font-bold uppercase tracking-widest text-primary"
            to={buildSearchHref("")}
          >
            Explore
          </Link>
        </div>
        <ProfileShelfSkeleton mobile />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <MaterialSymbol name="bookmark" className="text-primary" />
          Reading List
        </h3>
        <Link
          className="text-[11px] font-bold uppercase tracking-widest text-primary"
          to={buildSearchHref("")}
        >
          Explore
        </Link>
      </div>
      {readingList.length ? (
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {readingList.map((story) => (
            <Link
              className="w-32 flex-shrink-0"
              key={story.storySlug}
              to={buildStoryHref(story.storySlug)}
            >
              <div className="aspect-[2/3] overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-primary/20 dark:bg-primary/5">
                <img
                  alt={story.storyTitle}
                  className="h-full w-full object-cover"
                  src={story.coverImage}
                />
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-bold">
                {story.storyTitle}
              </p>
              <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                {story.authorName}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <SectionEmptyState
          body={"Bookmark chapters to build a real reading list."}
          ctaHref={buildSearchHref("")}
          ctaLabel="Browse Stories"
          icon="bookmark"
          title="Nothing saved yet"
        />
      )}
    </div>
  );
}

function RecentActivityList({ isLoading, items, mobile = false }) {
  if (isLoading && !items.length) {
    return <ActivitySkeleton mobile={mobile} />;
  }

  if (!items.length) {
    return (
      <SectionEmptyState
        body={"Your account activity will appear here as you read, bookmark, and check in."}
        icon="history"
        title="No activity yet"
      />
    );
  }

  if (mobile) {
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <div className="flex items-start gap-3" key={`${item.title}-${index}`}>
            <div className="rounded-full bg-primary/10 p-2 text-primary dark:bg-primary/20">
              <MaterialSymbol name={item.icon} className="text-sm" />
            </div>
            <div className="w-full border-b border-slate-200 pb-3 dark:border-primary/5">
              <p className="text-sm">{item.title}</p>
              {item.detail ? (
                <p className="mt-1 text-xs italic text-slate-500">{item.detail}</p>
              ) : null}
              <p className="mt-1 text-[10px] text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5"
          key={`${item.title}-${index}`}
        >
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
              <MaterialSymbol name={item.icon} className="text-lg text-primary" />
            </div>
            <div>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                {item.time}
              </p>
              <p className="text-sm leading-snug">{item.title}</p>
              {item.detail ? (
                <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
                  {item.detail}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileLogoutSection({ isLoggingOut, onLogout }) {
  return (
    <div className="px-4 pb-32 pt-2">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 dark:border-red-400/20 dark:bg-red-500/10">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-red-500/10 p-2 text-red-500 dark:bg-red-500/15">
            <MaterialSymbol name="logout" className="text-lg" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black uppercase tracking-widest">
              Exit TaleStead
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Log out of this device and end your current session. You can sign
              back in any time.
            </p>
          </div>
        </div>
        <motion.button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-black uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoggingOut}
          onClick={onLogout}
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <MaterialSymbol name="logout" className="text-base" />
          {isLoggingOut ? "Signing Out..." : "Log Out"}
        </motion.button>
      </div>
    </div>
  );
}

function DesktopBadgesTab({ badgesData, isBadgesLoading }) {
  return (
    <Reveal className="mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Badges</h3>
      </div>
      {badgesData ? (
        <>
          {badgesData.badges.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              {badgesData.badges.map((badge) => (
                <div
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 ${
                    badge.earned
                      ? "border-primary/20 bg-primary/5"
                      : "border-slate-200 bg-slate-50 opacity-50 dark:border-white/10 dark:bg-white/5"
                  }`}
                  key={badge.id}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-bold ${
                    badge.rarity === "LEGENDARY" ? "bg-amber-500" :
                    badge.rarity === "EPIC" ? "bg-purple-500" :
                    badge.rarity === "RARE" ? "bg-blue-500" :
                    badge.rarity === "UNCOMMON" ? "bg-green-500" : "bg-gray-400"
                  }`}>
                    {badge.title?.[0] ?? "?"}
                  </div>
                  <p className="text-xs font-bold text-center">{badge.title}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    badge.rarity === "LEGENDARY" ? "text-amber-500" :
                    badge.rarity === "EPIC" ? "text-purple-500" :
                    badge.rarity === "RARE" ? "text-blue-500" :
                    badge.rarity === "UNCOMMON" ? "text-green-500" : "text-gray-400"
                  }`}>
                    {badge.rarity}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {badgesData.badges.filter((b) => b.earned).length} of {badgesData.badges.length} badges earned
          </p>
        </>
      ) : isBadgesLoading ? (
        <div className="mt-4 flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="h-24 w-24 animate-pulse rounded-xl bg-primary/10" key={i} />
          ))}
        </div>
      ) : null}
    </Reveal>
  );
}

function MyStoriesTab() {
  return (
    <Reveal>
      <SectionEmptyState
        body="Have a story to tell? Start writing and share it with the TaleStead community."
        ctaHref="/creator"
        ctaLabel="Start Writing"
        icon="edit_note"
        title="Your stories will appear here"
      />
    </Reveal>
  );
}

function DesktopProfile({
  activeTab,
  accountTier,
  badgesData,
  coinBalance,
  currentReading,
  hasPremium,
  isAccountLoading,
  isBadgesLoading,
  isCoinBalanceLoading,
  onTabChange,
  profile,
  profileStats,
  readingList,
}) {
  return (
    <div className="hidden h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex h-full min-h-0">
        <AppDesktopSidebar
          avatar={profile.avatar}
          memberLabel="Basic Member"
          memberName={profile.displayName}
        />

        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-background-light dark:bg-[#12100b]">
          <div className="mx-auto max-w-4xl px-5 py-6">
            <header className="mb-6 flex flex-col items-center gap-4 md:flex-row md:items-end">
              <div className="relative shrink-0">
                <UserAvatar
                  className="h-20 w-20 rounded-full border-2 border-primary shadow-lg md:h-24 md:w-24"
                  fallbackClassName="text-2xl md:text-3xl"
                  name={profile.displayName}
                  src={profile.avatar}
                />
                <div className="absolute bottom-0 right-0 rounded-full border-2 border-background-dark bg-primary p-1 text-background-dark">
                  <MaterialSymbol name="verified" className="text-xs font-bold" />
                </div>
              </div>

              <div className="min-w-0 flex-1 text-center md:text-left">
                <div className="mb-1 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <h2 className="text-xl font-bold md:text-2xl">{profile.displayName}</h2>
                  {hasPremium && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-black uppercase tracking-tighter text-background-dark">
                      {accountTier}
                    </span>
                  )}
                </div>
                {badgesData?.readerTitle && (
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/70">
                    {badgesData.readerTitle}
                  </p>
                )}
                {profile.tagline ? (
                  <p className="max-w-xl text-sm text-primary">{profile.tagline}</p>
                ) : null}
                {profile.bio ? (
                  <p className="mt-2 line-clamp-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="mt-2 max-w-xl text-xs text-slate-500 dark:text-slate-400">
                    Add a bio and tagline in Edit Profile to personalize this page.
                  </p>
                )}
              </div>

              <Link
                className="shrink-0 flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-200 px-3 py-2 text-xs font-bold transition-all hover:bg-primary/20 hover:text-primary dark:border-white/10 dark:bg-white/5"
                to={editProfileHref}
              >
                <MaterialSymbol name="edit" className="text-sm" />
                Edit Profile
              </Link>
            </header>

            <ProfileStatsGrid isLoading={isAccountLoading} items={profileStats} />

            <div className="mb-5 overflow-x-auto border-b border-slate-200 dark:border-white/10">
              <div className="flex gap-6">
                {profileTabs.map((tab) => (
                  <button
                    className={`whitespace-nowrap border-b-2 pb-3 text-xs font-bold ${
                      activeTab === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    type="button"
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "Library" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <DesktopCurrentReading
                    currentReading={currentReading}
                    isLoading={isAccountLoading}
                  />
                  <DesktopReadingList
                    isLoading={isAccountLoading}
                    readingList={readingList}
                  />
                </div>

                <div className="space-y-5">
                  <WalletSection
                    coinBalance={coinBalance}
                    isLoading={isCoinBalanceLoading}
                  />
                </div>
              </div>
            )}

            {activeTab === "My Stories" && <MyStoriesTab />}

            {activeTab === "Badges" && (
              <DesktopBadgesTab badgesData={badgesData} isBadgesLoading={isBadgesLoading} />
            )}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Reveal>
                  <h3 className="mb-4 text-lg font-bold">Account Center</h3>
                  <div className="grid gap-2">
                    {accountQuickLinks.map((item) => (
                      <Link
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5 dark:border-white/10 dark:bg-white/5"
                        key={item.label}
                        to={item.href}
                      >
                        <div className="flex items-center gap-2">
                          <MaterialSymbol name={item.icon} className="text-lg text-primary" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <MaterialSymbol name="chevron_right" className="text-slate-400" />
                      </Link>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileBadgesTab({ badgesData, isBadgesLoading }) {
  return (
    <div className="px-4 py-4">
      <h3 className="flex items-center gap-2 text-lg font-bold">
        <MaterialSymbol name="military_tech" className="text-primary" />
        Badges
      </h3>
      {badgesData ? (
        <>
          {badgesData.badges.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {badgesData.badges.map((badge) => (
                <div
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 ${
                    badge.earned
                      ? "border-primary/10 bg-primary/5"
                      : "border-slate-200 bg-slate-50 opacity-50 dark:border-white/10 dark:bg-white/5"
                  }`}
                  key={badge.id}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold ${
                    badge.rarity === "LEGENDARY" ? "bg-amber-500" :
                    badge.rarity === "EPIC" ? "bg-purple-500" :
                    badge.rarity === "RARE" ? "bg-blue-500" :
                    badge.rarity === "UNCOMMON" ? "bg-green-500" : "bg-gray-400"
                  }`}>
                    {badge.title?.[0] ?? "?"}
                  </div>
                  <p className="text-[10px] font-bold text-center">{badge.title}</p>
                </div>
              ))}
            </div>
          ) : null}
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {badgesData.badges.filter((b) => b.earned).length} of {badgesData.badges.length} earned
          </p>
        </>
      ) : isBadgesLoading ? (
        <div className="mt-3 flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="h-20 w-20 animate-pulse rounded-xl bg-primary/10" key={i} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileProfile({
  activeTab,
  accountTier,
  badgesData,
  coinBalance,
  currentReading,
  hasPremium,
  isAccountLoading,
  isBadgesLoading,
  isCoinBalanceLoading,
  isLoggingOut,
  onLogout,
  onTabChange,
  profile,
  profileStats,
  readingList,
  recentActivity,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-x-hidden bg-background-light shadow-2xl dark:bg-background-dark">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 pb-2 dark:bg-background-dark">
          <Link className="flex h-12 w-12 items-center justify-center" to={notificationsHref}>
            <MaterialSymbol name="settings" className="text-2xl" />
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold uppercase tracking-widest">
            TaleStead
          </h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex h-12 items-center justify-center rounded-lg bg-transparent" type="button">
              <MaterialSymbol name="share" className="text-2xl" />
            </button>
          </div>
        </div>

        <main className="pb-24">
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="relative">
              <UserAvatar
                className="size-32 rounded-full border-2 border-primary p-1"
                fallbackClassName="text-4xl"
                name={profile.displayName}
                src={profile.avatar}
              />
              {hasPremium && (
                <div className="absolute bottom-0 right-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-background-dark">
                  {accountTier}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-[24px] font-bold leading-tight">
                {profile.displayName}
              </p>
              {badgesData?.readerTitle && (
                <p className="mt-0.5 text-xs font-bold uppercase tracking-widest text-primary/70">
                  {badgesData.readerTitle}
                </p>
              )}
              {profile.tagline ? (
                <p className="mt-1 text-center text-sm font-medium text-primary">
                  {profile.tagline}
                </p>
              ) : null}
              {profile.bio ? (
                <p className="mt-2 px-6 text-center text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {profile.bio}
                </p>
              ) : null}
            </div>
            <Link
              className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary"
              to={editProfileHref}
            >
              Edit Profile
            </Link>
          </div>

          <ProfileStatsGrid isLoading={isAccountLoading} items={profileStats} mobile />

          <div className="mt-2 pb-3">
            <div className="flex justify-between border-b border-slate-200 px-4 dark:border-primary/10">
              {profileTabs.map((tab) => (
                <button
                  className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    activeTab === tab
                      ? "border-b-primary text-primary"
                      : "border-b-transparent text-slate-500 dark:text-slate-400"
                  }`}
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  type="button"
                >
                  <p className="text-sm font-bold">{tab}</p>
                </button>
              ))}
            </div>
          </div>

          {activeTab === "Library" && (
            <>
              <MobileCurrentReading
                currentReading={currentReading}
                isLoading={isAccountLoading}
              />
              <MobileReadingList
                isLoading={isAccountLoading}
                readingList={readingList}
              />
            </>
          )}

          {activeTab === "My Stories" && (
            <div className="px-4 py-4">
              <SectionEmptyState
                body="Have a story to tell? Start writing and share it with the TaleStead community."
                ctaHref="/creator"
                ctaLabel="Start Writing"
                icon="edit_note"
                title="Your stories will appear here"
              />
            </div>
          )}

          {activeTab === "Badges" && (
            <MobileBadgesTab badgesData={badgesData} isBadgesLoading={isBadgesLoading} />
          )}

          <WalletSection
            coinBalance={coinBalance}
            isLoading={isCoinBalanceLoading}
            mobile
          />

          <div className="px-4 py-4">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <MaterialSymbol name="bolt" className="text-primary" />
              Account Center
            </h3>
            <div className="space-y-3">
              {accountQuickLinks.map((item) => (
                <Link
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-primary/10 dark:bg-primary/5"
                  key={item.label}
                  to={item.href}
                >
                  <div className="flex items-center gap-3">
                    <MaterialSymbol name={item.icon} className="text-primary" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <MaterialSymbol name="chevron_right" className="text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          <div className="px-4 py-4">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <MaterialSymbol name="history" className="text-primary" />
              Recent Activity
            </h3>
            <RecentActivityList
              isLoading={isAccountLoading}
              items={recentActivity}
              mobile
            />
          </div>

          <MobileLogoutSection
            isLoggingOut={isLoggingOut}
            onLogout={onLogout}
          />
        </main>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout, isLoggingOut } = useAuth();
  const { accountTier, coinBalance, hasPremium, isStatusLoading } = useMonetization();
  const {
    currentReading,
    isAccountLoading,
    profile,
    profileStats,
    readingList,
    recentActivity,
  } = useAccount();
  const { showToast } = useToast();
  const badgesQuery = useBadgesQuery();
  const badgesData = badgesQuery.data ?? null;
  const [activeTab, setActiveTab] = useState("Library");

  async function handleLogout() {
    await logout();
    showToast("Signed out.");
    navigate("/auth", { replace: true });
  }

  return (
    <>
      <DesktopProfile
        activeTab={activeTab}
        accountTier={accountTier}
        badgesData={badgesData}
        coinBalance={coinBalance}
        currentReading={currentReading}
        hasPremium={hasPremium}
        isAccountLoading={isAccountLoading}
        isBadgesLoading={badgesQuery.isLoading}
        isCoinBalanceLoading={isStatusLoading}
        onTabChange={setActiveTab}
        profile={profile}
        profileStats={profileStats}
        readingList={readingList}
      />
      <MobileProfile
        activeTab={activeTab}
        accountTier={accountTier}
        badgesData={badgesData}
        coinBalance={coinBalance}
        currentReading={currentReading}
        hasPremium={hasPremium}
        isAccountLoading={isAccountLoading}
        isBadgesLoading={badgesQuery.isLoading}
        isCoinBalanceLoading={isStatusLoading}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
        onTabChange={setActiveTab}
        profile={profile}
        profileStats={profileStats}
        readingList={readingList}
        recentActivity={recentActivity}
      />
    </>
  );
}
