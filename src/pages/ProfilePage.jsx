import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AccountNotice from "../components/AccountNotice";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAccount } from "../context/AccountContext";
import {
  accountQuickLinks,
  editProfileHref,
  notificationsHref,
  profileTabs,
} from "../data/accountFlow";
import {
  buildChapterHref,
  buildSearchHref,
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
      <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
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

function ProfileStatsGrid({ items, mobile = false }) {
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
    <section className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <div
          className="rounded-xl border border-slate-200 bg-white p-5 text-center dark:border-white/10 dark:bg-white/5"
          key={item.label}
        >
          <p className="text-2xl font-black">{item.value}</p>
          <p className="mt-1 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
            {item.label}
          </p>
        </div>
      ))}
    </section>
  );
}

function DesktopCurrentReading({ currentReading, isLoading }) {
  return (
    <Reveal>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">Currently Reading</h3>
        <Link
          className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
          to="/dashboard"
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
          body={
            isLoading
              ? "Loading your reading progress."
              : "Start a story and your active read will appear here."
          }
          ctaHref={buildSearchHref("")}
          ctaLabel="Explore Stories"
          title="Nothing in progress yet"
        />
      )}
    </Reveal>
  );
}

function MobileCurrentReading({ currentReading, isLoading }) {
  return (
    <div className="px-4 py-4">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span className="material-symbols-outlined text-primary">
          auto_stories
        </span>
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
          body={
            isLoading
              ? "Loading your reading progress."
              : "Pick a story from the library to start building your reading history."
          }
          ctaHref={buildSearchHref("")}
          ctaLabel="Explore Stories"
          title="Nothing in progress yet"
        />
      )}
    </div>
  );
}

function DesktopReadingList({ isLoading, readingList }) {
  return (
    <Reveal>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">Reading List</h3>
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
          body={
            isLoading
              ? "Loading your saved stories."
              : "Bookmark chapters and they will show up here as your reading list."
          }
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
  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold">
          <span className="material-symbols-outlined text-primary">bookmark</span>
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
          body={
            isLoading
              ? "Loading your saved stories."
              : "Bookmark chapters to build a real reading list."
          }
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
  if (!items.length) {
    return (
      <SectionEmptyState
        body={
          isLoading
            ? "Loading your recent activity."
            : "Your account activity will appear here as you read, bookmark, and check in."
        }
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
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
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
              <span className="material-symbols-outlined text-lg text-primary">
                {item.icon}
              </span>
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

function DesktopProfile({
  clearNotice,
  currentReading,
  isAccountLoading,
  notice,
  profile,
  profileStats,
  readingList,
  recentActivity,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen overflow-hidden">
        <AppDesktopSidebar
          avatar={profile.avatar}
          memberLabel="Gold Member"
          memberName={profile.displayName}
        />

        <main className="custom-scrollbar flex-1 overflow-y-auto bg-background-light dark:bg-[#12100b]">
          <div className="mx-auto max-w-5xl px-8 py-10">
            <AccountNotice notice={notice} onDismiss={clearNotice} />

            <header className="mb-10 flex flex-col items-center gap-8 md:flex-row md:items-end">
              <div className="relative group">
                <UserAvatar
                  className="h-32 w-32 rounded-full border-4 border-primary shadow-2xl"
                  fallbackClassName="text-4xl"
                  name={profile.displayName}
                  src={profile.avatar}
                />
                <div className="absolute bottom-1 right-1 rounded-full border-4 border-background-dark bg-primary p-1.5 text-background-dark">
                  <span className="material-symbols-outlined text-sm font-bold">
                    verified
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="mb-2 flex items-center justify-center gap-3 md:justify-start">
                  <h2 className="text-3xl font-bold">{profile.displayName}</h2>
                  <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-background-dark">
                    Pro
                  </span>
                </div>
                {profile.tagline ? (
                  <p className="max-w-xl text-base text-primary">{profile.tagline}</p>
                ) : null}
                {profile.bio ? (
                  <p className="mt-3 max-w-xl text-base text-slate-500 dark:text-slate-400">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                    Add a bio and tagline in Edit Profile to personalize this page.
                  </p>
                )}
              </div>

              <Link
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-200 px-5 py-2.5 text-sm font-bold transition-all hover:bg-primary/20 hover:text-primary dark:border-white/10 dark:bg-white/5"
                to={editProfileHref}
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Profile
              </Link>
            </header>

            <ProfileStatsGrid items={profileStats} />

            <div className="mb-8 overflow-x-auto border-b border-slate-200 dark:border-white/10">
              <div className="flex gap-10">
                {profileTabs.map((tab, index) => (
                  <button
                    className={`border-b-2 pb-4 text-sm font-bold whitespace-nowrap ${
                      index === 0
                        ? "border-primary text-primary"
                        : "border-transparent text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                    key={tab}
                    type="button"
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="space-y-10 lg:col-span-2">
                <DesktopCurrentReading
                  currentReading={currentReading}
                  isLoading={isAccountLoading}
                />
                <DesktopReadingList
                  isLoading={isAccountLoading}
                  readingList={readingList}
                />
              </div>

              <div className="space-y-8">
                <Reveal>
                  <h3 className="mb-6 text-xl font-bold">Account Center</h3>
                  <div className="grid gap-3">
                    {accountQuickLinks.map((item) => (
                      <Link
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/5 dark:border-white/10 dark:bg-white/5"
                        key={item.label}
                        to={item.href}
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">
                            {item.icon}
                          </span>
                          <span className="text-sm font-semibold">{item.label}</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">
                          chevron_right
                        </span>
                      </Link>
                    ))}
                  </div>
                </Reveal>

                <Reveal>
                  <h3 className="mb-6 text-xl font-bold">Recent Activity</h3>
                  <RecentActivityList
                    isLoading={isAccountLoading}
                    items={recentActivity}
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileProfile({
  clearNotice,
  currentReading,
  isAccountLoading,
  notice,
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
            <span className="material-symbols-outlined text-2xl">settings</span>
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold uppercase tracking-widest">
            StoryArc
          </h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex h-12 items-center justify-center rounded-lg bg-transparent" type="button">
              <span className="material-symbols-outlined text-2xl">share</span>
            </button>
          </div>
        </div>

        <main className="pb-24">
          <div className="px-4 pt-3">
            <AccountNotice notice={notice} onDismiss={clearNotice} />
          </div>

          <div className="flex flex-col items-center gap-4 p-4">
            <div className="relative">
              <UserAvatar
                className="size-32 rounded-full border-2 border-primary p-1"
                fallbackClassName="text-4xl"
                name={profile.displayName}
                src={profile.avatar}
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-background-dark">
                Pro
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-[24px] font-bold leading-tight">
                {profile.displayName}
              </p>
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

          <ProfileStatsGrid items={profileStats} mobile />

          <div className="mt-2 pb-3">
            <div className="flex justify-between border-b border-slate-200 px-4 dark:border-primary/10">
              {profileTabs.map((tab, index) => (
                <button
                  className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                    index === 0
                      ? "border-b-primary text-primary"
                      : "border-b-transparent text-slate-500 dark:text-slate-400"
                  }`}
                  key={tab}
                  type="button"
                >
                  <p className="text-sm font-bold">{tab}</p>
                </button>
              ))}
            </div>
          </div>

          <MobileCurrentReading
            currentReading={currentReading}
            isLoading={isAccountLoading}
          />
          <MobileReadingList
            isLoading={isAccountLoading}
            readingList={readingList}
          />

          <div className="px-4 py-4">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="material-symbols-outlined text-primary">bolt</span>
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
                    <span className="material-symbols-outlined text-primary">
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">
                    chevron_right
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-20 px-4 py-4">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Activity
            </h3>
            <RecentActivityList
              isLoading={isAccountLoading}
              items={recentActivity}
              mobile
            />
          </div>
        </main>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const {
    clearNotice,
    currentReading,
    isAccountLoading,
    notice,
    profile,
    profileStats,
    readingList,
    recentActivity,
  } = useAccount();

  return (
    <>
      <DesktopProfile
        clearNotice={clearNotice}
        currentReading={currentReading}
        isAccountLoading={isAccountLoading}
        notice={notice}
        profile={profile}
        profileStats={profileStats}
        readingList={readingList}
        recentActivity={recentActivity}
      />
      <MobileProfile
        clearNotice={clearNotice}
        currentReading={currentReading}
        isAccountLoading={isAccountLoading}
        notice={notice}
        profile={profile}
        profileStats={profileStats}
        readingList={readingList}
        recentActivity={recentActivity}
      />
    </>
  );
}
