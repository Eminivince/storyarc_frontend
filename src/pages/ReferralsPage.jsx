import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { useAccount } from "../context/AccountContext";
import {
  notificationsHref,
  profileHref,
  referralShareChannels,
  referralsHref,
  rewardsHref,
} from "../data/accountFlow";

const desktopTrustSignals = [
  {
    title: "Trustworthy Rewards",
    description:
      "Points are credited within 24 hours after a friend starts their premium journey.",
    icon: "verified",
  },
  {
    title: "Unlimited Invites",
    description: "There is no cap on how many readers you can bring into StoryArc.",
    icon: "group_add",
  },
  {
    title: "Redeem Points",
    description: "Use Arc Points for premium chapters, avatar drops, and bonus reads.",
    icon: "redeem",
  },
];

const shareAccentClasses = {
  WhatsApp: "bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white",
  "Twitter X": "bg-sky-500/20 text-sky-500 hover:bg-sky-500 hover:text-white",
  Email: "bg-primary/20 text-primary hover:bg-primary hover:text-background-dark",
  Others: "bg-slate-500/20 text-slate-500 hover:bg-slate-500 hover:text-white",
};

function DesktopReferrals({
  onCopyCode,
  onShare,
  points,
  referralHistory,
  referrals,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-primary/20 bg-background-light px-6 py-4 dark:bg-background-dark lg:px-10">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">StoryArc</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
                to="/dashboard"
              >
                Home
              </Link>
              <Link
                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
                to={profileHref}
              >
                My Library
              </Link>
              <Link className="border-b-2 border-primary pb-1 text-sm font-bold text-primary" to={referralsHref}>
                Referrals
              </Link>
            </nav>
            <Link
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              to={notificationsHref}
            >
              <span className="material-symbols-outlined">settings</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          <Reveal className="mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/30 to-background-dark p-8">
            <div className="relative">
              <div className="pointer-events-none absolute right-0 top-0 opacity-20">
                <span className="material-symbols-outlined text-[120px] text-primary">
                  auto_awesome
                </span>
              </div>
              <span className="mb-4 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-black uppercase tracking-widest text-background-dark">
                Limited Time Offer
              </span>
              <h2 className="max-w-2xl text-3xl font-black tracking-tight lg:text-4xl">
                Invite Your Inner Circle
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-slate-700 dark:text-slate-300">
                Share the magic of StoryArc. Give a week of Premium access to your
                friends and earn <span className="font-bold text-primary">{referrals.rewardLabel}</span> for every
                successful journey they begin.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/40 px-4 py-2 text-sm font-semibold dark:bg-background-dark/40">
                <span className="material-symbols-outlined text-primary">toll</span>
                Referral balance: {points} Arc Points
              </div>
            </div>
          </Reveal>

          <div className="mb-12 grid gap-6 md:grid-cols-2">
            <Reveal className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-background-light p-6 dark:bg-primary/5">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <span className="material-symbols-outlined text-primary">qr_code_2</span>
                Your Unique Referral Code
              </h3>
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-white p-1 dark:bg-background-dark">
                <input
                  className="flex-1 bg-transparent px-4 py-3 font-mono text-xl font-bold uppercase tracking-[0.2em] text-primary outline-none"
                  readOnly
                  type="text"
                  value={referrals.code}
                />
                <button
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-background-dark transition-colors hover:brightness-105"
                  onClick={onCopyCode}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copy
                </button>
              </div>
              <p className="text-sm italic text-slate-500 dark:text-slate-400">
                Share this code directly or send it through the channels below.
              </p>
            </Reveal>

            <Reveal className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-background-light p-6 dark:bg-primary/5">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <span className="material-symbols-outlined text-primary">share</span>
                Quick Share
              </h3>
              <div className="grid grid-cols-4 gap-4 pt-2">
                {referralShareChannels.map((channel) => (
                  <button
                    className="group flex flex-col items-center gap-2"
                    key={channel.label}
                    onClick={() => onShare(channel.label)}
                    type="button"
                  >
                    <div
                      className={`flex size-12 items-center justify-center rounded-full transition-all ${shareAccentClasses[channel.label]}`}
                    >
                      <span className="material-symbols-outlined">{channel.icon}</span>
                    </div>
                    <span className="text-xs font-medium">{channel.label}</span>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-primary/20 pb-4">
              <h3 className="flex items-center gap-2 text-2xl font-bold">
                <span className="material-symbols-outlined text-primary">history</span>
                Referral History
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-slate-500 dark:text-slate-400">Total Earned:</span>
                <span className="flex items-center gap-1 text-lg font-bold text-primary">
                  <span className="material-symbols-outlined text-sm">toll</span>
                  {referrals.totalEarned}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {referralHistory.map((entry) => {
                const completed = entry.status === "completed";

                return (
                  <Reveal
                    className={`flex items-center justify-between rounded-2xl border border-primary/10 bg-background-light p-4 transition-all hover:border-primary/30 dark:bg-primary/5 ${
                      completed ? "" : "opacity-80"
                    }`}
                    key={entry.name}
                  >
                    <div className="flex items-center gap-4">
                      <UserAvatar
                        className="size-10 rounded-full border border-primary/30"
                        fallbackClassName="text-sm"
                        name={entry.name}
                        src={entry.image}
                      />
                      <div>
                        <h4 className="font-bold">{entry.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{entry.joined}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          completed
                            ? "bg-green-500/10 text-green-500"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {entry.status}
                      </span>
                      <span className={`text-sm font-bold ${completed ? "text-primary" : "text-slate-500"}`}>
                        {entry.reward}
                      </span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        </main>

        <footer className="border-t border-primary/10 bg-background-light px-6 py-10 dark:bg-background-dark/50">
          <div className="mx-auto grid max-w-5xl gap-8 text-center md:grid-cols-3 md:text-left">
            {desktopTrustSignals.map((item) => (
              <div className="flex flex-col items-center gap-3 md:items-start" key={item.title}>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

function MobileReferrals({
  onCopyCode,
  onShare,
  referralHistory,
  referrals,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-x-hidden border-primary/10">
        <header className="sticky top-0 z-30 flex items-center border-b border-primary/10 bg-background-light p-4 dark:bg-background-dark">
          <Link
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
            to={rewardsHref}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="flex-1 pr-10 text-center text-lg font-bold uppercase tracking-wide">
            Refer &amp; Earn
          </h1>
        </header>

        <main className="flex-1 pb-24">
          <section className="px-4 pb-2 pt-4">
            <Reveal className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-t from-background-dark to-transparent p-6">
              <img
                alt="Referral rewards"
                className="absolute inset-0 h-full w-full object-cover opacity-60"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLbpapalQkpBGpkNy6whtq5Qk9xQPSFNppQaTlsOnfGHVI1z0CTrn6jWB48UIzTEXiahbC8Bf2fE058PtzVpezkGw5cEPGqdzS5Q0tcN9lZTiZX8kr5kfmB-knw2dsTBwOG_oETdhAHyFSqoJZtkluhfhTEHp2UowfthOHkOjaP1ROBCQaQpQ-8AAFn4FCX6DMvAhRUnk2wkPXgyEpPIildjhlyLN0A3u8CvYV67Qa1fGB_FLaH06Rq-u5BRFbiQAiRjRjTijdOAY"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="inline-flex rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background-dark">
                  Limited Offer
                </span>
                <h2 className="text-3xl font-bold leading-tight text-white">Give $20, Get $20</h2>
                <p className="text-sm text-slate-300">
                  Invite friends to join the premium StoryArc circle.
                </p>
              </div>
            </Reveal>
          </section>

          <section className="space-y-4 px-4 py-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
              Your Unique Referral Code
            </p>
            <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <span className="pl-4 text-2xl font-bold tracking-widest text-primary">
                {referrals.mobileCode}
              </span>
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-background-dark transition-transform active:scale-95"
                onClick={onCopyCode}
                type="button"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                COPY
              </button>
            </div>
          </section>

          <section className="border-b border-primary/10 px-4 pb-8">
            <p className="mb-4 text-center text-xs text-slate-500 dark:text-slate-400">
              Share via
            </p>
            <div className="flex justify-center gap-6">
              {referralShareChannels.map((channel) => (
                <button
                  className="flex flex-col items-center gap-2"
                  key={channel.label}
                  onClick={() => onShare(channel.label)}
                  type="button"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-primary transition-colors hover:bg-primary/20 dark:bg-primary/10">
                    <span className="material-symbols-outlined">{channel.icon}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{channel.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="flex-1 px-4 py-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Referral History</h3>
              <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Total Earned: $120
              </span>
            </div>
            <div className="space-y-3">
              {referralHistory.map((entry) => {
                const completed = entry.status === "completed";

                return (
                  <Reveal
                    className={`flex items-center justify-between rounded-xl border border-primary/5 bg-primary/[0.02] p-3 ${
                      completed ? "" : "opacity-70"
                    }`}
                    key={entry.name}
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        className="size-10 rounded-full"
                        fallbackClassName="text-sm"
                        name={entry.name}
                        src={entry.image}
                      />
                      <div>
                        <p className="text-sm font-bold">{entry.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {entry.joined}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${completed ? "text-primary" : "text-slate-400"}`}>
                        {completed ? "+$20.00" : "$20.00"}
                      </p>
                      <p
                        className={`text-[10px] font-medium ${
                          completed ? "text-green-500" : "italic text-primary/60"
                        }`}
                      >
                        {completed ? "Completed" : "Pending"}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <button className="mt-6 w-full rounded-lg border border-primary/30 py-3 text-xs font-bold text-primary transition-colors hover:bg-primary/5" type="button">
              VIEW ALL HISTORY
            </button>
          </section>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-center">
          <div className="flex w-full max-w-md gap-2 border-t border-primary/20 bg-background-dark px-4 pb-4 pt-3">
            <Link className="flex flex-1 flex-col items-center gap-1 text-slate-500" to="/dashboard">
              <span className="material-symbols-outlined">home</span>
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link className="flex flex-1 flex-col items-center gap-1 text-slate-500" to={rewardsHref}>
              <span className="material-symbols-outlined">card_giftcard</span>
              <span className="text-[10px] font-medium">Rewards</span>
            </Link>
            <Link className="flex flex-1 flex-col items-center gap-1 text-primary" to={referralsHref}>
              <span className="material-symbols-outlined">share</span>
              <span className="text-[10px] font-medium">Refer</span>
            </Link>
            <Link className="flex flex-1 flex-col items-center gap-1 text-slate-500" to={profileHref}>
              <span className="material-symbols-outlined">person</span>
              <span className="text-[10px] font-medium">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function ReferralsPage() {
  const {
    copyValue,
    referralHistory,
    referrals,
    rewards,
    shareReferral,
  } = useAccount();

  return (
    <>
      <DesktopReferrals
        onCopyCode={() => copyValue("Referral code", referrals.code)}
        onShare={shareReferral}
        points={rewards.points}
        referralHistory={referralHistory}
        referrals={referrals}
      />
      <MobileReferrals
        onCopyCode={() => copyValue("Referral code", referrals.mobileCode)}
        onShare={shareReferral}
        referralHistory={referralHistory}
        referrals={referrals}
      />
    </>
  );
}
