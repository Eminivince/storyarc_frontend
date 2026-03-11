import { useDeferredValue, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AppDesktopSidebar, AppMobileTabBar } from "../components/AppShellNav";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { fetchLeaderboard } from "../engagement/engagementApi";
import { useAuth } from "../context/AuthContext";
import {
  leaderboard as fallbackLeaderboard,
  leaderboardHref,
  notificationsHref,
  profileHref,
  rewardsHref,
} from "../data/accountFlow";

function filterEntries(entries, searchTerm) {
  if (!searchTerm) {
    return entries;
  }

  const normalized = searchTerm.trim().toLowerCase();

  return entries.filter((entry) => entry.name.toLowerCase().includes(normalized));
}

function formatRank(rank) {
  if (rank === 1) {
    return "1st";
  }

  if (rank === 2) {
    return "2nd";
  }

  if (rank === 3) {
    return "3rd";
  }

  return `${rank}th`;
}

function DesktopLeaderboard({
  activeTab,
  leaderboardData,
  onTabChange,
  searchTerm,
  setSearchTerm,
}) {
  const { user } = useAuth();
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const leaderboard = leaderboardData ?? fallbackLeaderboard;
  const visibleEntries = filterEntries(leaderboard.entries, deferredSearchTerm);

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex h-screen w-full overflow-hidden">
        <AppDesktopSidebar />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-primary/10 bg-background-dark/50 px-8 backdrop-blur-md">
            <div className="flex items-center gap-8">
              <h2 className="text-xl font-bold text-slate-100">Leaderboard</h2>
              <div className="flex h-full gap-6">
                <button className="flex h-16 items-center border-b-2 border-primary text-sm font-bold text-primary" type="button">
                  Global
                </button>
                <button className="flex h-16 items-center text-sm font-medium text-slate-500 transition-colors hover:text-primary" type="button">
                  Friends
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="group relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </span>
                <input
                  className="w-64 rounded-xl border border-primary/20 bg-primary/5 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search rankings..."
                  type="text"
                  value={searchTerm}
                />
              </label>
              <Link
                className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-primary/10 dark:text-slate-300"
                to={notificationsHref}
              >
                <span className="material-symbols-outlined">notifications</span>
              </Link>
              <Link to={profileHref}>
                <UserAvatar
                  alt="Your avatar"
                  className="h-10 w-10 rounded-full border-2 border-primary ring-2 ring-primary/20"
                  fallbackClassName="text-sm"
                  name={user?.displayName ?? leaderboard.userRank.name}
                  src={user?.avatarUrl ?? leaderboard.userRank.image ?? null}
                />
              </Link>
            </div>
          </header>

          <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
            <div className="mb-8 flex w-fit gap-2 rounded-xl bg-slate-100 p-1 dark:bg-primary/5">
              {leaderboard.tabs.map((tab) => (
                <button
                  className={`rounded-lg px-6 py-2 text-sm transition-all ${
                    tab === activeTab
                      ? "bg-primary font-bold text-background-dark shadow-lg shadow-primary/20"
                      : "font-medium text-slate-500 hover:text-primary dark:text-slate-400"
                  }`}
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 items-end gap-6 md:grid-cols-3">
              {leaderboard.podium.map((entry) => {
                const isChampion = entry.rank === 1;
                const accentClass =
                  entry.rank === 1
                    ? "border-primary ring-4 ring-primary/20 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    : entry.rank === 2
                      ? "border-slate-300 shadow-[0_0_15px_rgba(192,192,192,0.2)]"
                      : "border-[#cd7f32] shadow-[0_0_15px_rgba(205,127,50,0.2)]";
                const badgeClass =
                  entry.rank === 1
                    ? "bg-primary text-background-dark font-black uppercase tracking-wider"
                    : entry.rank === 2
                      ? "bg-slate-300 text-slate-800"
                      : "bg-[#cd7f32] text-white";

                return (
                  <Reveal
                    className={`flex flex-col items-center gap-4 ${
                      isChampion ? "order-1 scale-110 md:order-2" : entry.rank === 2 ? "order-2 md:order-1" : "order-3"
                    }`}
                    key={entry.rank}
                  >
                    <div className="relative">
                      {isChampion ? (
                        <span className="material-symbols-outlined absolute -top-8 left-1/2 -translate-x-1/2 fill-1 text-4xl text-primary">
                          crown
                        </span>
                      ) : null}
                      <UserAvatar
                        className={`rounded-full border-4 ${
                          isChampion ? "h-32 w-32" : "h-24 w-24"
                        } ${accentClass}`.trim()}
                        fallbackClassName={isChampion ? "text-4xl" : "text-3xl"}
                        name={entry.name}
                        src={entry.image}
                      />
                      <div
                        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}
                      >
                        {isChampion ? "Champion" : `${entry.rank}${entry.rank === 2 ? "nd" : "rd"}`}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`${isChampion ? "text-2xl font-black" : "text-lg font-bold"}`}>
                        {entry.name}
                      </p>
                      <p className={`${isChampion ? "text-base font-black" : "text-sm font-bold"} text-primary`}>
                        {entry.points}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div className="mx-auto max-w-4xl space-y-3">
              <Reveal className="mb-8 flex items-center justify-between rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-transparent p-5 shadow-lg shadow-primary/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 text-xl font-black text-primary">
                    #{leaderboard.userRank.rank}
                  </div>
                  <UserAvatar
                    className="h-12 w-12 rounded-full border-2 border-primary"
                    fallbackClassName="text-base"
                    name={leaderboard.userRank.name}
                    src={leaderboard.userRank.image ?? user?.avatarUrl ?? null}
                  />
                  <div>
                    <p className="font-bold">{leaderboard.userRank.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {leaderboard.userRank.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-primary">{leaderboard.userRank.points}</p>
                  <button className="text-xs font-bold text-primary/80 underline transition-colors hover:text-primary" type="button">
                    View Stats
                  </button>
                </div>
              </Reveal>

              <div className="overflow-hidden rounded-2xl border border-primary/10 bg-background-dark shadow-xl">
                <div className="grid grid-cols-12 border-b border-primary/10 px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-7">User</div>
                  <div className="col-span-2 text-right">Story Level</div>
                  <div className="col-span-2 text-right">Arc Points</div>
                </div>

                <div className="divide-y divide-primary/10">
                  {visibleEntries.map((entry) => (
                    <div
                      className="grid grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-primary/5"
                      key={entry.rank}
                    >
                      <div className="col-span-1 font-bold text-slate-400">{entry.rank}</div>
                      <div className="col-span-7 flex items-center gap-3">
                        <UserAvatar
                          className="h-10 w-10 rounded-full bg-slate-200"
                          fallbackClassName="text-sm"
                          name={entry.name}
                          src={entry.image}
                        />
                        <span className="font-semibold">{entry.name}</span>
                      </div>
                      <div className="col-span-2 text-right font-medium">{entry.tier}</div>
                      <div className="col-span-2 text-right font-bold text-primary">{entry.points}</div>
                    </div>
                  ))}
                  {visibleEntries.length === 0 ? (
                    <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                      No readers matched that search.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileLeaderboard({ activeTab, leaderboardData, onTabChange }) {
  const { user } = useAuth();
  const leaderboard = leaderboardData ?? fallbackLeaderboard;

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-primary/10 bg-background-light p-4 dark:bg-background-dark">
          <Link
            className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
            to={rewardsHref}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold tracking-tight">Leaderboard</h2>
          <div className="flex size-10 items-center justify-center text-primary">
            <span className="material-symbols-outlined">military_tech</span>
          </div>
        </header>

        <div className="shrink-0 bg-background-light dark:bg-background-dark">
          <div className="flex border-b border-primary/10 px-4">
            {leaderboard.tabs.map((tab) => (
              <button
                className={`flex flex-1 flex-col items-center justify-center border-b-2 pb-3 pt-4 ${
                  tab === activeTab
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 dark:text-slate-400"
                }`}
                key={tab}
                onClick={() => onTabChange(tab)}
                type="button"
              >
                <span className="text-sm font-bold">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <main className="hide-scrollbar flex-1 overflow-y-auto pb-40">
          <section className="flex items-end justify-center gap-2 bg-gradient-to-b from-primary/5 to-transparent px-4 pb-8 pt-10">
            {leaderboard.podium.map((entry) => {
              const isChampion = entry.rank === 1;
              const sizeClass = isChampion ? "size-24" : "size-16";
              const borderClass =
                entry.rank === 1
                  ? "border-primary shadow-[0_0_20px_rgba(244,192,37,0.3)]"
                  : entry.rank === 2
                    ? "border-slate-400"
                    : "border-orange-400/50";
              const labelClass =
                entry.rank === 1
                  ? "bg-primary text-background-dark"
                  : entry.rank === 2
                    ? "bg-slate-400 text-white"
                    : "bg-orange-700 text-white";

              return (
                <Reveal
                  className={`flex w-1/3 flex-col items-center ${
                    isChampion ? "-mt-6" : ""
                  }`}
                  key={entry.rank}
                >
                  <div className="relative mb-2">
                    {isChampion ? (
                      <span className="material-symbols-outlined absolute -top-8 left-1/2 -translate-x-1/2 fill-1 text-3xl text-primary">
                        workspace_premium
                      </span>
                    ) : null}
                    <UserAvatar
                      className={`${sizeClass} rounded-full border-4 ${borderClass}`.trim()}
                      fallbackClassName={isChampion ? "text-3xl" : "text-xl"}
                      name={entry.name}
                      src={entry.image}
                    />
                    <div
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-bold ${labelClass}`}
                    >
                      {formatRank(entry.rank)}
                    </div>
                  </div>
                  <p className={`w-full truncate text-center ${isChampion ? "text-sm font-bold" : "text-xs font-bold"}`}>
                    {entry.name}
                  </p>
                  <p className={`${isChampion ? "text-xs font-bold" : "text-[10px]"} text-primary`}>
                    {entry.points.replace(" Arc Points", " pts")}
                  </p>
                </Reveal>
              );
            })}
          </section>

          <section className="space-y-3 px-4">
            {leaderboard.entries.map((entry) => (
              <Reveal
                className="flex items-center gap-4 rounded-xl border border-primary/10 bg-primary/5 p-3 dark:bg-white/5"
                key={entry.rank}
              >
                <p className="w-4 text-sm font-bold text-slate-500">{entry.rank}</p>
                <UserAvatar
                  className="size-10 rounded-full bg-center bg-cover"
                  fallbackClassName="text-sm"
                  name={entry.name}
                  src={entry.image}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold">{entry.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{entry.tier}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{entry.points}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">pts</p>
                </div>
              </Reveal>
            ))}
          </section>
        </main>

        <div className="fixed bottom-20 left-4 right-4 z-10">
          <div className="flex items-center gap-4 rounded-xl bg-primary p-4 shadow-lg">
            <div className="flex size-8 items-center justify-center rounded-full bg-background-dark text-sm font-bold text-primary">
              {leaderboard.userRank.rank}
            </div>
            <UserAvatar
              className="size-12 rounded-full border-2 border-background-dark"
              fallbackClassName="text-base text-background-dark"
              name={leaderboard.userRank.name}
              src={leaderboard.userRank.image ?? user?.avatarUrl ?? null}
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-background-dark">{leaderboard.userRank.name}</p>
              <p className="text-xs font-medium text-background-dark/70">
                {leaderboard.userRank.mobileSubtitle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-background-dark">{leaderboard.userRank.points}</p>
              <p className="text-[10px] font-bold uppercase text-background-dark/70">Points</p>
            </div>
          </div>
        </div>

        <AppMobileTabBar />
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("Weekly");
  const [searchTerm, setSearchTerm] = useState("");
  const activePeriod =
    activeTab === "Monthly"
      ? "monthly"
      : activeTab === "All Time" || activeTab === "All-Time"
        ? "all-time"
        : "weekly";
  const leaderboardQuery = useQuery({
    queryKey: ["engagement", "leaderboard", activePeriod],
    queryFn: () => fetchLeaderboard(activePeriod),
  });
  const leaderboardData = leaderboardQuery.data ?? {
    ...fallbackLeaderboard,
    tabs: fallbackLeaderboard.tabs.map((tab) =>
      tab === "All-Time" ? "All Time" : tab,
    ),
  };

  return (
    <>
      <DesktopLeaderboard
        activeTab={activeTab}
        leaderboardData={leaderboardData}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <MobileLeaderboard
        activeTab={activeTab}
        leaderboardData={leaderboardData}
        onTabChange={setActiveTab}
      />
    </>
  );
}
