import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAccount } from "../context/AccountContext";
import { useAuth } from "../context/AuthContext";
import {
  editProfileHref,
  leaderboardHref,
  missionsHref,
  profileHref,
  referralsHref,
  rewardsHref,
} from "../data/accountFlow";

function RewardsCalendar({ checkedInToday, rewardCalendar }) {
  return (
    <div className="grid grid-cols-7 gap-1 text-center">
      {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
        <span className="pb-2 text-[10px] font-bold text-slate-500" key={day}>
          {day}
        </span>
      ))}
      {[27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7].map((day) => {
        const completed =
          rewardCalendar.completedDays.includes(day) ||
          (checkedInToday && day === rewardCalendar.today);
        const isToday = day === rewardCalendar.today;

        return (
          <div
            className={`flex h-10 items-center justify-center rounded-lg text-xs font-medium ${
              isToday
                ? completed
                  ? "bg-primary text-background-dark font-bold shadow-lg shadow-primary/20"
                  : "border border-primary/30 bg-primary/10 text-primary"
                : completed
                  ? "text-slate-200"
                  : "text-slate-600"
            }`}
            key={day}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}

function DesktopRewards({
  claimedMissionIds,
  missionList,
  onCheckIn,
  points,
  rewardCalendar,
  streakDays,
  weeklyEarned,
}) {
  const { user } = useAuth();
  const quickTasks = missionList.filter((mission) =>
    ["deep-dive", "active-critic", "profile-complete"].includes(mission.id),
  );

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
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
            <Link className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20" to={missionsHref}>
              <span className="material-symbols-outlined">assignment</span>
            </Link>
            <Link to={profileHref}>
              <UserAvatar
                className="h-10 w-10 rounded-full border-2 border-primary/30"
                fallbackClassName="text-sm"
                name={user?.displayName}
                src={user?.avatarUrl}
              />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-8 lg:px-40">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-transparent p-8 md:col-span-2">
              <h1 className="mb-2 text-3xl font-bold">Welcome back, Reader</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Complete your daily missions to unlock premium chapters and stronger streak rewards.
              </p>
              <div className="mt-6">
                <button
                  className="rounded-xl bg-primary px-8 py-3 text-lg font-bold text-background-dark transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={claimedMissionIds.includes("daily-check-in")}
                  onClick={onCheckIn}
                  type="button"
                >
                  {claimedMissionIds.includes("daily-check-in")
                    ? "Checked In"
                    : "Check-in Now"}
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Current Arc Points
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    toll
                  </span>
                  <p className="text-4xl font-bold">{points}</p>
                </div>
              </div>
              <div className="mt-4 border-t border-primary/10 pt-4">
                <p className="flex items-center gap-1 text-xs font-medium text-green-500">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +{weeklyEarned} earned this week
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-primary/10 dark:bg-slate-900/50 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Daily Check-in</h2>
                <div className="flex items-center gap-4">
                  <button className="rounded-lg p-2 text-slate-500 hover:bg-primary/10" type="button">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <p className="font-bold">{rewardCalendar.month}</p>
                  <button className="rounded-lg p-2 text-slate-500 hover:bg-primary/10" type="button">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
              <RewardsCalendar
                checkedInToday={claimedMissionIds.includes("daily-check-in")}
                rewardCalendar={rewardCalendar}
              />
            </div>

            <div className="flex flex-col gap-6">
              <Reveal className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
                <div className="absolute -bottom-4 -right-4 rotate-12 text-primary/10">
                  <span className="material-symbols-outlined text-9xl">
                    workspace_premium
                  </span>
                </div>
                <h3 className="mb-4 text-lg font-bold">Streak Reward</h3>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm text-slate-300">7 Day Milestone</p>
                  <p className="text-sm font-bold text-primary">{streakDays} / 7 Days</p>
                </div>
                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min((streakDays / 7) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <span className="material-symbols-outlined text-primary">
                      redeem
                    </span>
                  </div>
                  <div>
                    <p className="font-bold">Golden Ticket</p>
                    <p className="text-xs text-slate-400">
                      Unlock any 3 premium chapters
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-primary/10 dark:bg-slate-900/50">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold">Quick Tasks</h3>
                  <Link className="text-xs font-bold uppercase tracking-widest text-primary" to={missionsHref}>
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {quickTasks.map((task) => {
                    const claimed = claimedMissionIds.includes(task.id);
                    const ready = task.current >= task.target;
                    const href =
                      task.id === "deep-dive"
                        ? missionsHref
                        : task.id === "active-critic"
                          ? referralsHref
                          : editProfileHref;

                    return (
                      <div className={`flex items-center justify-between ${claimed ? "opacity-50" : ""}`} key={task.id}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 ${
                            claimed ? "bg-green-500/20 text-green-500" : "text-primary"
                          }`}>
                            <span className="material-symbols-outlined text-sm">
                              {claimed ? "check" : task.icon}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{task.title}</p>
                            <p className="text-xs text-slate-500">
                              {claimed ? "Completed" : `Earn ${task.reward} Points`}
                            </p>
                          </div>
                        </div>
                        {claimed ? (
                          <span className="text-xs font-bold text-green-500">Done</span>
                        ) : (
                          <Link className={`rounded px-3 py-1 text-xs font-bold transition-all ${
                            ready ? "bg-primary/10 text-primary hover:bg-primary hover:text-background-dark" : "bg-primary/10 text-primary hover:bg-primary hover:text-background-dark"
                          }`} to={href}>
                            {ready ? "Claim" : "Go"}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Reveal>

              <Reveal className="grid gap-3">
                {[
                  ["Missions", missionsHref, "assignment"],
                  ["Referrals", referralsHref, "share"],
                  ["Leaderboard", leaderboardHref, "emoji_events"],
                ].map(([label, href, icon]) => (
                  <Link
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/5 dark:border-primary/10 dark:bg-primary/5"
                    key={label}
                    to={href}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">{icon}</span>
                      <span className="font-semibold">{label}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">
                      chevron_right
                    </span>
                  </Link>
                ))}
              </Reveal>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileRewards({
  claimedMissionIds,
  missionList,
  onCheckIn,
  points,
  rewardCalendar,
  streakDays,
  streakRewards,
}) {
  const quickTasks = missionList.filter((mission) =>
    ["share-results", "active-critic", "profile-complete"].includes(mission.id),
  );

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 antialiased dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background-light p-4 pb-2 dark:bg-background-dark">
          <Link className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary" to={profileHref}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="flex-1 text-center text-lg font-bold uppercase tracking-widest">
            Rewards
          </h2>
          <div className="flex h-10 w-10 items-center justify-end">
            <Link className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-primary" to={missionsHref}>
              <span className="material-symbols-outlined">help</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <section className="p-4">
            <div className="flex flex-col gap-2 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 p-6 shadow-lg shadow-primary/5">
              <p className="text-sm font-medium uppercase tracking-wider text-slate-400">
                Total Balance
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-primary">
                  {points}
                </span>
                <span className="text-sm font-semibold uppercase text-primary/70">
                  Points
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[65%] bg-primary" />
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                550 points until next tier (Gold Explorer)
              </p>
            </div>
          </section>

          <section className="px-4 py-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Daily Check-in</h3>
              <span className="rounded bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                DAY {streakDays} STREAK
              </span>
            </div>
            <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
              <div className="mb-4 flex items-center justify-between">
                <button className="text-slate-400 transition-colors hover:text-primary" type="button">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-200">
                  {rewardCalendar.month}
                </p>
                <button className="text-slate-400 transition-colors hover:text-primary" type="button">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
              <RewardsCalendar
                checkedInToday={claimedMissionIds.includes("daily-check-in")}
                rewardCalendar={rewardCalendar}
              />
              <button
                className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={claimedMissionIds.includes("daily-check-in")}
                onClick={onCheckIn}
                type="button"
              >
                {claimedMissionIds.includes("daily-check-in")
                  ? "Today's Reward Claimed"
                  : "Claim Today's +50 Points"}
              </button>
            </div>
          </section>

          <section className="py-4">
            <div className="mb-3 flex items-center justify-between px-4">
              <h3 className="text-lg font-bold">Streak Rewards</h3>
              <Link className="text-xs font-bold uppercase text-primary" to={missionsHref}>
                View All
              </Link>
            </div>
            <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2">
              {streakRewards.map((reward) => (
                <div
                  className="w-40 flex-none rounded-xl border border-slate-700 bg-slate-800/50 p-4"
                  key={reward.title}
                >
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${
                    reward.unlocked ? "bg-primary/20" : "bg-slate-700"
                  }`}>
                    <span className={`material-symbols-outlined ${
                      reward.unlocked ? "text-primary" : "text-slate-500"
                    }`}>
                      {reward.icon}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-400">{reward.title}</p>
                  <p className="mt-1 text-sm font-bold">{reward.reward}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="px-4 py-2">
            <h3 className="mb-3 text-lg font-bold">Quick Tasks</h3>
            <div className="flex flex-col gap-3">
              {quickTasks.map((task) => {
                const claimed = claimedMissionIds.includes(task.id);
                const href =
                  task.id === "share-results"
                    ? referralsHref
                    : task.id === "active-critic"
                      ? missionsHref
                      : editProfileHref;

                return (
                  <div
                    className={`flex items-center gap-4 rounded-xl border p-4 ${
                      claimed
                        ? "border-slate-700/50 bg-slate-800/30 opacity-60"
                        : "border-slate-700/50 bg-slate-800/30"
                    }`}
                    key={task.id}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      claimed ? "bg-primary/20 text-primary" : "bg-blue-500/20 text-blue-400"
                    }`}>
                      <span className="material-symbols-outlined">
                        {claimed ? "check_circle" : task.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${claimed ? "line-through" : ""}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {claimed ? "Done" : `+${task.reward} Points`}
                      </p>
                    </div>
                    {claimed ? (
                      <span className="material-symbols-outlined text-primary">
                        verified
                      </span>
                    ) : (
                      <Link className="rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase text-primary" to={href}>
                        Go
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around border-t border-primary/10 bg-background-dark/95 px-4 pb-6 pt-3 backdrop-blur-md">
          <Link className="flex flex-col items-center gap-1 text-slate-500" to="/dashboard">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <p className="text-[10px] font-bold uppercase tracking-tighter">Home</p>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-primary" to={rewardsHref}>
            <span className="material-symbols-outlined text-[24px] fill-current">
              military_tech
            </span>
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

export default function RewardsPage() {
  const {
    claimDailyCheckIn,
    claimedMissionIds,
    missions,
    rewardCalendar,
    rewards,
    streakRewards,
  } = useAccount();

  return (
    <>
      <DesktopRewards
        claimedMissionIds={claimedMissionIds}
        missionList={missions}
        onCheckIn={claimDailyCheckIn}
        points={rewards.points}
        rewardCalendar={rewardCalendar}
        streakDays={rewards.streakDays}
        weeklyEarned={rewards.weeklyEarned}
      />
      <MobileRewards
        claimedMissionIds={claimedMissionIds}
        missionList={missions}
        onCheckIn={claimDailyCheckIn}
        points={rewards.points}
        rewardCalendar={rewardCalendar}
        streakDays={rewards.streakDays}
        streakRewards={streakRewards}
      />
    </>
  );
}
