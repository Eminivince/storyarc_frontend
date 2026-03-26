import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogoBrand } from "../components/LogoBrand";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAccount } from "../context/AccountContext";
import { useAuth } from "../context/AuthContext";
import MaterialSymbol from "../components/MaterialSymbol";
import {
  leaderboardHref,
  missionsHref,
  profileHref,
  rewardsHref,
} from "../data/accountFlow";

function useCountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setUTCDate(midnight.getUTCDate() + 1);
      midnight.setUTCHours(0, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    }

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

function getMissionStatus(mission, claimedMissionIds, rewards) {
  if (claimedMissionIds.includes(mission.id)) {
    return "claimed";
  }

  if (mission.id === "daily-check-in" && rewards.checkedInToday) {
    return "claimed";
  }

  if (mission.current >= mission.target) {
    return "ready";
  }

  return "progress";
}

function DesktopMissions({
  claimedMissionIds,
  missionList,
  onClaim,
  points,
  rewards,
}) {
  const { user } = useAuth();
  const readerMissions = missionList.filter((mission) => mission.group === "Reader");
  const authorMissions = missionList.filter((mission) => mission.group === "Author");

  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/20 bg-background-dark/50 px-6 py-4 backdrop-blur-md lg:px-40">
          <LogoBrand
            suffix={<span className="text-primary"> Missions</span>}
            textClassName="text-slate-100"
          />
          <div className="flex flex-1 items-center justify-end gap-4 lg:gap-8">
            <div className="flex gap-2">
              <Link className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors hover:bg-primary/20" to={rewardsHref}>
                <MaterialSymbol name="notifications" />
              </Link>
              <Link className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors hover:bg-primary/20" to={profileHref}>
                <MaterialSymbol name="account_circle" />
              </Link>
            </div>
            <Link to={profileHref}>
              <UserAvatar
                className="h-10 w-10 rounded-full ring-2 ring-primary/30"
                fallbackClassName="text-sm"
                name={user?.displayName}
                src={user?.avatarUrl}
              />
            </Link>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-8 p-4 lg:p-8">
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <aside className="flex flex-col gap-2 lg:col-span-1">
              <nav className="flex flex-col gap-1">
                <Link className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-primary/5 hover:text-primary" to="/dashboard">
                  <MaterialSymbol name="home" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-primary shadow-lg shadow-primary/5" to={missionsHref}>
                  <MaterialSymbol name="task_alt" filled />
                  <span className="font-medium">Missions</span>
                </Link>
                <Link className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-primary/5 hover:text-primary" to={profileHref}>
                  <MaterialSymbol name="library_books" />
                  <span className="font-medium">Library</span>
                </Link>
                <Link className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-primary/5 hover:text-primary" to={leaderboardHref}>
                  <MaterialSymbol name="military_tech" />
                  <span className="font-medium">Leaderboard</span>
                </Link>
              </nav>
              <div className="mt-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-transparent p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MaterialSymbol name="stars" className="text-primary" />
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-100">
                    Your Balance
                  </span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {points} <span className="text-xs font-normal text-slate-400">Arc Points</span>
                </div>
              </div>
            </aside>

            <div className="flex flex-col gap-6 lg:col-span-3">
              <div className="mb-2 flex flex-wrap gap-2 border-b border-primary/10">
                {["Daily", "Weekly", "Achievements"].map((tab, index) => (
                  <button
                    className={`px-6 py-3 text-sm font-bold ${
                      index === 0
                        ? "border-b-2 border-primary text-primary"
                        : "border-b-2 border-transparent text-slate-400 hover:text-slate-100"
                    }`}
                    key={tab}
                    type="button"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-100">
                    <MaterialSymbol name="event" className="text-primary" />
                    Today's Missions
                  </h3>
                  <MissionRefreshCountdown />
                </div>
                {readerMissions.map((mission) => {
                  const status = getMissionStatus(mission, claimedMissionIds, rewards);
                  const progress = Math.min((mission.current / mission.target) * 100, 100);

                  return (
                    <Reveal
                      className="group flex flex-col items-center gap-6 rounded-xl border border-primary/10 bg-background-dark p-5 transition-all hover:border-primary/30 md:flex-row"
                      key={mission.id}
                    >
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialSymbol name={mission.icon} className="text-3xl" />
                        {mission.poolOnly && (
                          <span className="absolute -right-1 -top-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold text-black">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="w-full flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-100">{mission.title}</h4>
                            <p className="text-sm text-slate-400">{mission.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-primary">+{mission.reward}</span>
                            <span className="block text-[10px] uppercase text-primary/60">
                              Arc Points
                            </span>
                          </div>
                        </div>
                        <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-xs font-medium">
                          <span className={status === "claimed" ? "text-primary" : "text-slate-500"}>
                            {status === "claimed"
                              ? "Completed"
                              : `Progress: ${mission.current} / ${mission.target}`}
                          </span>
                          <span className="text-primary">{Math.round(progress)}%</span>
                        </div>
                      </div>
                      <div className="w-full shrink-0 md:w-auto">
                        {status === "ready" ? (
                          <button
                            className="flex w-full items-center justify-center gap-1 rounded-lg border border-primary/40 bg-primary/20 px-4 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/30"
                            onClick={() => onClaim(mission.id)}
                            type="button"
                          >
                            Claim
                          </button>
                        ) : status === "claimed" ? (
                          <span className="flex w-full items-center justify-center gap-1 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary md:w-28">
                            Claimed
                          </span>
                        ) : (
                          <Link className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-bold text-background-dark transition-all hover:brightness-110 md:w-28" to={mission.href || rewardsHref}>
                            {mission.actionLabel}
                          </Link>
                        )}
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-100">
                  <MaterialSymbol name="edit_note" className="text-primary" />
                  Author Missions
                </h3>
                {authorMissions.map((mission) => {
                  const progress = Math.min((mission.current / mission.target) * 100, 100);

                  return (
                    <Reveal
                      className="group flex flex-col items-center gap-6 rounded-xl border border-primary/10 bg-background-dark p-5 transition-all hover:border-primary/30 md:flex-row"
                      key={mission.id}
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MaterialSymbol name={mission.icon} className="text-3xl" />
                      </div>
                      <div className="w-full flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-slate-100">{mission.title}</h4>
                            <p className="text-sm text-slate-400">{mission.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-primary">+{mission.reward}</span>
                            <span className="block text-[10px] uppercase text-primary/60">
                              Arc Points
                            </span>
                          </div>
                        </div>
                        <div className="relative mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-xs font-medium">
                          <span className="text-slate-500">
                            Progress: {mission.current} / {mission.target}
                          </span>
                          <span className="text-primary">{Math.round(progress)}%</span>
                        </div>
                      </div>
                      <Link className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-bold text-background-dark transition-all hover:brightness-110 md:w-28" to={mission.href || profileHref}>
                        {mission.actionLabel}
                      </Link>
                    </Reveal>
                  );
                })}

                <MissionRefreshBanner />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MobileMissions({
  claimedMissionIds,
  missionList,
  onClaim,
  points,
  rewards,
}) {
  const dailyMissions = missionList.filter((mission) => mission.group === "Reader");
  const authorMissions = missionList.filter((mission) => mission.group === "Author");

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-background-light/80 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link className="text-slate-900 dark:text-slate-100" to={rewardsHref}>
              <MaterialSymbol name="arrow_back" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">Missions & Tasks</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            <MaterialSymbol name="payments" className="text-sm text-primary" />
            <span className="text-sm font-bold text-primary">{points}</span>
          </div>
        </div>
        <div className="flex px-4">
          {["Daily", "Weekly", "Achievements"].map((tab, index) => (
            <button
              className={`flex-1 py-3 text-sm ${
                index === 0
                  ? "border-b-2 border-primary font-bold text-primary"
                  : "border-b-2 border-transparent font-medium text-slate-500 dark:text-slate-400"
              }`}
              key={tab}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 space-y-6 overflow-y-auto p-4 pb-24">
        <section>
          <div className="relative mb-4 aspect-[16/7] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqNNtCTxBuAClGUqEjSfp198G2yRpjzNEhQSg2ZHXDRnyHa0oL5oF1wZcCawX3iKDnGwEYjlDhZrHx8zNN_D8o23wfPqrB4cuB6ukyE3vVBbQ_FxF5Ty34uQL3X_eNB6lVyTW_T1F-avvF43-Fel4z9r8vLtSlleK0089FFOyg2MF8lO7xQFetfMFFwzZkFGbBluOU1EfHp0ok_Hh8Z0v8LH8LFX3U0mbkE74YSEf-HF7J3-ZQAtJgmk1bw-1cf-grbsYjHG-fJtc')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <span className="mb-2 inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background-dark">
                Featured
              </span>
              <h2 className="text-lg font-bold text-white">Elite Champion&apos;s Challenge</h2>
              <p className="mt-1 text-xs text-slate-300">
                Complete 10 tasks to unlock the golden crate.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Daily Missions
            </h3>
            <MissionRefreshCountdown />
          </div>
          {dailyMissions.map((mission) => {
            const status = getMissionStatus(mission, claimedMissionIds, rewards);
            const progress = Math.min((mission.current / mission.target) * 100, 100);

            return (
              <div
                className={`flex items-center gap-4 rounded-xl border p-4 ${
                  status === "ready"
                    ? "border-primary/50 bg-white dark:bg-slate-900/50 shadow-lg shadow-primary/5"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50"
                }`}
                key={mission.id}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MaterialSymbol name={mission.icon} className="text-2xl text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between">
                    <p className="truncate text-sm font-bold">{mission.title}</p>
                    <span className="text-[10px] font-bold text-primary">
                      +{mission.reward} XP
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                  <p className={`mt-1 text-[10px] font-medium ${
                    status === "ready" ? "text-primary" : "text-slate-500 dark:text-slate-400"
                  }`}>
                    {status === "claimed"
                      ? "Claimed"
                      : status === "ready"
                        ? "Ready to claim!"
                        : `Progress: ${mission.current}/${mission.target}`}
                  </p>
                </div>
                {status === "ready" ? (
                  <button
                    className="animate-pulse rounded-lg bg-primary px-4 py-2 text-xs font-black text-background-dark hover:brightness-110"
                    onClick={() => onClaim(mission.id)}
                    type="button"
                  >
                    Claim
                  </button>
                ) : status === "claimed" ? (
                  <span className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-bold text-slate-400 dark:bg-slate-800">
                    Claimed
                  </span>
                ) : (
                  <Link className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-background-dark hover:brightness-110" to={mission.href || rewardsHref}>
                    Go
                  </Link>
                )}
              </div>
            );
          })}
        </section>

        {authorMissions.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Author Missions
              </h3>
            </div>
            {authorMissions.map((mission) => {
              const status = getMissionStatus(mission, claimedMissionIds, rewards);
              const progress = Math.min((mission.current / mission.target) * 100, 100);

              return (
                <div
                  className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4"
                  key={mission.id}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <h4 className="font-bold text-white">{mission.title}</h4>
                    <span className="text-[10px] font-bold text-primary">+{mission.reward} XP</span>
                  </div>
                  <p className="mb-3 text-xs text-slate-400">{mission.description}</p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {mission.current}/{mission.target}
                    </div>
                    {status === "ready" ? (
                      <button
                        className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-background-dark"
                        onClick={() => onClaim(mission.id)}
                        type="button"
                      >
                        Claim
                      </button>
                    ) : status === "claimed" ? (
                      <span className="text-xs font-bold text-primary">Claimed</span>
                    ) : (
                      <Link className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-slate-900" to={mission.href || profileHref}>
                        {mission.actionLabel}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        ) : null}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-background-light px-6 py-3 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link className="flex flex-col items-center gap-1 text-slate-400" to="/dashboard">
            <MaterialSymbol name="home" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-primary" to={missionsHref}>
            <MaterialSymbol name="target" className="fill-[1]" />
            <span className="text-[10px] font-bold">Missions</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-slate-400" to={rewardsHref}>
            <MaterialSymbol name="account_balance_wallet" />
            <span className="text-[10px] font-medium">Wallet</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-slate-400" to={profileHref}>
            <MaterialSymbol name="person" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

function MissionRefreshCountdown() {
  const timeLeft = useCountdownToMidnight();

  return (
    <span className="flex items-center gap-1 text-xs font-medium text-primary">
      <MaterialSymbol name="schedule" className="text-sm" />
      Refreshes in {timeLeft}
    </span>
  );
}

function MissionRefreshBanner() {
  const timeLeft = useCountdownToMidnight();

  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-primary/20 bg-primary/5 p-5">
      <div className="flex items-center gap-2 text-center">
        <MaterialSymbol name="autorenew" className="text-sm text-primary" />
        <p className="text-sm italic text-slate-400">
          New missions in {timeLeft}
        </p>
      </div>
    </div>
  );
}

export default function MissionsPage() {
  const {
    claimMission,
    claimedMissionIds,
    missions,
    rewards,
  } = useAccount();

  return (
    <>
      <DesktopMissions
        claimedMissionIds={claimedMissionIds}
        missionList={missions}
        onClaim={claimMission}
        points={rewards.points}
        rewards={rewards}
      />
      <MobileMissions
        claimedMissionIds={claimedMissionIds}
        missionList={missions}
        onClaim={claimMission}
        points={rewards.points}
        rewards={rewards}
      />
    </>
  );
}
