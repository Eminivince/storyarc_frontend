import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAccount } from "../context/AccountContext";
import { useAuth } from "../context/AuthContext";
import {
  leaderboardHref,
  missionsHref,
  profileHref,
  rewardsHref,
} from "../data/accountFlow";

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
          <div className="flex items-center gap-4">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">auto_stories</span>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-100">
              StoryArc <span className="text-primary">Missions</span>
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4 lg:gap-8">
            <div className="flex gap-2">
              <Link className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors hover:bg-primary/20" to={rewardsHref}>
                <span className="material-symbols-outlined">notifications</span>
              </Link>
              <Link className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors hover:bg-primary/20" to={profileHref}>
                <span className="material-symbols-outlined">account_circle</span>
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
                  <span className="material-symbols-outlined">home</span>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-primary shadow-lg shadow-primary/5" to={missionsHref}>
                  <span className="material-symbols-outlined fill-1">task_alt</span>
                  <span className="font-medium">Missions</span>
                </Link>
                <Link className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-primary/5 hover:text-primary" to={profileHref}>
                  <span className="material-symbols-outlined">library_books</span>
                  <span className="font-medium">Library</span>
                </Link>
                <Link className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-primary/5 hover:text-primary" to={leaderboardHref}>
                  <span className="material-symbols-outlined">military_tech</span>
                  <span className="font-medium">Leaderboard</span>
                </Link>
              </nav>
              <div className="mt-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/20 to-transparent p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">stars</span>
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
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-100">
                  <span className="material-symbols-outlined text-primary">event</span>
                  Reader Quests
                </h3>
                {readerMissions.map((mission) => {
                  const status = getMissionStatus(mission, claimedMissionIds, rewards);
                  const progress = Math.min((mission.current / mission.target) * 100, 100);

                  return (
                    <Reveal
                      className="group flex flex-col items-center gap-6 rounded-xl border border-primary/10 bg-background-dark p-5 transition-all hover:border-primary/30 md:flex-row"
                      key={mission.id}
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-3xl">
                          {mission.icon}
                        </span>
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
                  <span className="material-symbols-outlined text-primary">edit_note</span>
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
                        <span className="material-symbols-outlined text-3xl">
                          {mission.icon}
                        </span>
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

                <div className="flex items-center justify-center rounded-xl border border-dashed border-primary/20 bg-primary/5 p-5">
                  <div className="text-center">
                    <p className="text-sm italic text-slate-400">
                      New missions unlock in 14 hours...
                    </p>
                  </div>
                </div>
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
  const dailyMissions = missionList.filter((mission) =>
    ["daily-check-in", "share-results", "active-critic"].includes(mission.id),
  );
  const authorMission = missionList.find((mission) => mission.id === "writer-flow");

  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-background-light/80 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link className="text-slate-900 dark:text-slate-100" to={rewardsHref}>
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="text-xl font-bold tracking-tight">Missions & Tasks</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            <span className="material-symbols-outlined text-sm text-primary">payments</span>
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
            <span className="text-xs font-medium text-primary">Resets in 14h 22m</span>
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
                  <span className="material-symbols-outlined text-2xl text-primary">
                    {mission.icon}
                  </span>
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

        {authorMission ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Author Missions
              </h3>
              <span className="text-xs text-slate-400">Sponsored</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <div
                className="h-32 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhMXVqJ9LABvJDqy_eiLekhAwD5OJzEaKvyd07w2wuff2fJQFevdq-IynbAZ45EXLgvLe2t8mcymLsA8gTH_wH2dLdNPMqGu2O3GuUxr1t4MV8QKe1tigztFjCM9MFw9J0oQ4-FR3TAtZc7upBtmglabk8yegmdjrDm4zZ4vv3KLlUo__kPOokfHpix7bxzPbkuYkSz-ocUFAzETaEZyPcZWby0z5ycZQCjdNW_ecd88EO1TPmv27hKsxNjg7drN1eyAVyvj-AuOQ')",
                }}
              />
              <div className="p-4">
                <h4 className="mb-1 font-bold text-white">{authorMission.title}</h4>
                <p className="mb-4 text-xs text-slate-400">{authorMission.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    {authorMission.current}/{authorMission.target} words
                  </div>
                  <Link className="rounded-full bg-white px-6 py-2 text-xs font-bold text-slate-900" to={authorMission.href || profileHref}>
                    Start Quest
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-background-light px-6 py-3 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link className="flex flex-col items-center gap-1 text-slate-400" to="/dashboard">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-primary" to={missionsHref}>
            <span className="material-symbols-outlined fill-[1]">target</span>
            <span className="text-[10px] font-bold">Missions</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-slate-400" to={rewardsHref}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="text-[10px] font-medium">Wallet</span>
          </Link>
          <Link className="flex flex-col items-center gap-1 text-slate-400" to={profileHref}>
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
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
