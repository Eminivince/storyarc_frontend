import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import UserAvatar from "../components/UserAvatar";
import { LogoBrand } from "../components/LogoBrand";
import { useAccount } from "../context/AccountContext";
import { useToast } from "../context/ToastContext";
import {
  useReferralDashboardQuery,
  useReferralWithdrawalMutation,
} from "../engagement/engagementHooks";
import {
  buildReferralLink,
  notificationsHref,
  profileHref,
  referralShareChannels,
  referralsHref,
  rewardsHref,
} from "../data/accountFlow";

const shareAccentClasses = {
  WhatsApp: "bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white",
  "Twitter X": "bg-sky-500/20 text-sky-500 hover:bg-sky-500 hover:text-white",
  Email: "bg-primary/20 text-primary hover:bg-primary hover:text-background-dark",
  Others: "bg-slate-500/20 text-slate-500 hover:bg-slate-500 hover:text-white",
};

function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function EarningsDashboard({ dashboard, isLoading }) {
  if (isLoading || !dashboard) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="animate-pulse rounded-2xl border border-primary/10 bg-primary/5 p-5" key={i}>
            <div className="h-4 w-20 rounded bg-primary/10" />
            <div className="mt-3 h-8 w-24 rounded bg-primary/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Total Earned
        </p>
        <p className="mt-2 text-2xl font-black text-primary">
          {formatCents(dashboard.totalEarningsCents)}
        </p>
      </div>
      <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Available Balance
        </p>
        <p className="mt-2 text-2xl font-black">
          {formatCents(dashboard.availableBalanceCents)}
        </p>
      </div>
      <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Commission Rate
        </p>
        <p className="mt-2 text-2xl font-black text-primary">
          {Math.round((dashboard.commissionRate ?? 0.1) * 100)}%
        </p>
      </div>
    </div>
  );
}

function WithdrawalModal({ availableBalanceCents, onClose, onWithdraw }) {
  const [amount, setAmount] = useState("");
  const amountCents = Math.round(parseFloat(amount || "0") * 100);
  const isValid = amountCents >= 500 && amountCents <= availableBalanceCents;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-primary/20 bg-background-light p-6 dark:bg-background-dark">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Withdraw Earnings</h3>
          <button onClick={onClose} type="button">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Available: {formatCents(availableBalanceCents)} (min. $5.00)
        </p>

        <div className="mt-4">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500" htmlFor="withdrawal-amount">
            Amount (USD)
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-primary/20 bg-white p-1 dark:bg-background-dark">
            <span className="pl-3 text-lg font-bold text-primary">$</span>
            <input
              className="flex-1 bg-transparent px-2 py-3 text-lg font-bold outline-none"
              id="withdrawal-amount"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              type="number"
              min="5"
              step="0.01"
              value={amount}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 rounded-xl border border-primary/20 py-3 text-sm font-bold text-primary"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-background-dark disabled:opacity-50"
            disabled={!isValid}
            onClick={() => onWithdraw(amountCents)}
            type="button"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

function ReferredUsersList({ users }) {
  if (!users || !users.length) {
    return (
      <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        No referred users yet. Share your code to start earning!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => {
        const statusClasses =
          user.status === "completed"
            ? "bg-green-500/10 text-green-500"
            : user.status === "signed_up"
              ? "bg-blue-500/10 text-blue-500"
              : "bg-primary/10 text-primary";

        return (
          <Reveal
            className="flex items-center justify-between rounded-2xl border border-primary/10 bg-background-light p-4 dark:bg-primary/5"
            key={user.id}
          >
            <div className="flex items-center gap-4">
              <UserAvatar
                className="size-10 rounded-full border border-primary/30"
                fallbackClassName="text-sm"
                name={user.name}
              />
              <div>
                <h4 className="font-bold">{user.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(user.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClasses}`}>
              {user.status === "signed_up" ? "signed up" : user.status}
            </span>
          </Reveal>
        );
      })}
    </div>
  );
}

function WithdrawalHistory({ history }) {
  if (!history || !history.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-bold">
        <span className="material-symbols-outlined text-primary">receipt_long</span>
        Withdrawal History
      </h3>
      <div className="space-y-2">
        {history.map((entry) => (
          <div
            className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/[0.02] p-3"
            key={entry.id}
          >
            <div>
              <p className="text-sm font-bold">{formatCents(entry.amountCents)}</p>
              <p className="text-[10px] text-slate-500">{new Date(entry.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
              entry.status === "released"
                ? "bg-green-500/10 text-green-500"
                : entry.status === "rejected"
                  ? "bg-red-500/10 text-red-500"
                  : "bg-primary/10 text-primary"
            }`}>
              {entry.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DesktopReferrals({
  dashboard,
  isDashboardLoading,
  onCopyCode,
  onShare,
  onWithdraw,
  points,
  referrals,
  showWithdrawalModal,
  setShowWithdrawalModal,
}) {
  return (
    <div className="hidden min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:block">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-primary/20 bg-background-light px-6 py-4 dark:bg-background-dark lg:px-10">
          <LogoBrand to="/dashboard" size="md" />
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-8 md:flex">
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" to="/dashboard">Home</Link>
              <Link className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" to={profileHref}>My Library</Link>
              <Link className="border-b-2 border-primary pb-1 text-sm font-bold text-primary" to={referralsHref}>Referrals</Link>
            </nav>
            <Link className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors hover:bg-primary/20" to={notificationsHref}>
              <span className="material-symbols-outlined">settings</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 space-y-8">
          <Reveal className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/30 to-background-dark p-8">
            <div className="relative">
              <div className="pointer-events-none absolute right-0 top-0 opacity-20">
                <span className="material-symbols-outlined text-[120px] text-primary">auto_awesome</span>
              </div>
              <span className="mb-4 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-black uppercase tracking-widest text-background-dark">
                Affiliate Program
              </span>
              <h2 className="max-w-2xl text-3xl font-black tracking-tight lg:text-4xl">
                Earn 10% on Every Coin Purchase
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-slate-700 dark:text-slate-300">
                Refer readers to TaleStead and earn <span className="font-bold text-primary">10% commission</span> on every coin purchase they make. Withdraw your earnings as real money.
              </p>
              {dashboard?.availableBalanceCents > 0 && (
                <button
                  className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-background-dark transition-transform hover:brightness-105 active:scale-95"
                  onClick={() => setShowWithdrawalModal(true)}
                  type="button"
                >
                  Withdraw {formatCents(dashboard.availableBalanceCents)}
                </button>
              )}
            </div>
          </Reveal>

          <EarningsDashboard dashboard={dashboard} isLoading={isDashboardLoading} />

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-background-light p-6 dark:bg-primary/5">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <span className="material-symbols-outlined text-primary">qr_code_2</span>
                Your Referral Code
              </h3>
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-white p-1 dark:bg-background-dark">
                <input
                  className="flex-1 bg-transparent px-4 py-3 font-mono text-sm font-bold text-primary outline-none"
                  readOnly
                  type="text"
                  value={dashboard?.referralCode ? buildReferralLink(dashboard.referralCode) : ""}
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
                    <div className={`flex size-12 items-center justify-center rounded-full transition-all ${shareAccentClasses[channel.label]}`}>
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
                <span className="material-symbols-outlined text-primary">group</span>
                Referred Users
              </h3>
            </div>
            <ReferredUsersList users={dashboard?.referredUsers} />
          </section>

          <WithdrawalHistory history={dashboard?.withdrawalHistory} />
        </main>
      </div>

      {showWithdrawalModal && dashboard && (
        <WithdrawalModal
          availableBalanceCents={dashboard.availableBalanceCents}
          onClose={() => setShowWithdrawalModal(false)}
          onWithdraw={onWithdraw}
        />
      )}
    </div>
  );
}

function MobileReferrals({
  dashboard,
  isDashboardLoading,
  onCopyCode,
  onShare,
  onWithdraw,
  referrals,
  showWithdrawalModal,
  setShowWithdrawalModal,
}) {
  return (
    <div className="min-h-screen bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100 md:hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col overflow-x-hidden border-primary/10">
        <header className="sticky top-0 z-30 flex items-center border-b border-primary/10 bg-background-light p-4 dark:bg-background-dark">
          <Link className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-primary/10" to={rewardsHref}>
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="flex-1 pr-10 text-center text-lg font-bold uppercase tracking-wide">
            Refer &amp; Earn
          </h1>
        </header>

        <main className="flex-1 pb-24 space-y-6">
          <section className="px-4 pt-4">
            <Reveal className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 to-background-dark p-6">
              <span className="inline-flex rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-background-dark">
                Affiliate Program
              </span>
              <h2 className="mt-2 text-2xl font-bold leading-tight text-white">
                Earn 10% Commission
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                On every coin purchase your referrals make.
              </p>
              {dashboard?.availableBalanceCents > 0 && (
                <button
                  className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-background-dark active:scale-95"
                  onClick={() => setShowWithdrawalModal(true)}
                  type="button"
                >
                  Withdraw {formatCents(dashboard.availableBalanceCents)}
                </button>
              )}
            </Reveal>
          </section>

          <section className="px-4">
            <EarningsDashboard dashboard={dashboard} isLoading={isDashboardLoading} />
          </section>

          <section className="space-y-4 px-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
              Your Referral Code
            </p>
            <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <span className="min-w-0 flex-1 truncate pl-2 text-sm font-bold text-primary">
                {dashboard?.referralCode ? buildReferralLink(dashboard.referralCode) : ""}
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

          <section className="border-b border-primary/10 px-4 pb-6">
            <p className="mb-4 text-center text-xs text-slate-500 dark:text-slate-400">Share via</p>
            <div className="flex justify-center gap-6">
              {referralShareChannels.map((channel) => (
                <button className="flex flex-col items-center gap-2" key={channel.label} onClick={() => onShare(channel.label)} type="button">
                  <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-primary transition-colors hover:bg-primary/20 dark:bg-primary/10">
                    <span className="material-symbols-outlined">{channel.icon}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{channel.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="px-4">
            <h3 className="mb-4 text-lg font-bold">Referred Users</h3>
            <ReferredUsersList users={dashboard?.referredUsers} />
          </section>

          <section className="px-4">
            <WithdrawalHistory history={dashboard?.withdrawalHistory} />
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

      {showWithdrawalModal && dashboard && (
        <WithdrawalModal
          availableBalanceCents={dashboard.availableBalanceCents}
          onClose={() => setShowWithdrawalModal(false)}
          onWithdraw={onWithdraw}
        />
      )}
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
  const { showToast } = useToast();
  const dashboardQuery = useReferralDashboardQuery();
  const withdrawalMutation = useReferralWithdrawalMutation();
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  function handleShare(channel, referralCode) {
    if (!referralCode) {
      shareReferral(channel);
      return;
    }

    const link = buildReferralLink(referralCode);
    const text = `Join TaleStead and start reading amazing stories! ${link}`;

    if (channel === "WhatsApp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    } else if (channel === "Twitter X") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
    } else if (channel === "Email") {
      window.open(`mailto:?subject=${encodeURIComponent("Join TaleStead!")}&body=${encodeURIComponent(text)}`, "_blank");
    } else if (navigator.share) {
      navigator.share({ title: "Join TaleStead!", text, url: link }).catch(() => {});
    } else {
      copyValue("Referral link", link);
    }
  }

  async function handleWithdraw(amountCents) {
    try {
      const result = await withdrawalMutation.mutateAsync(amountCents);
      showToast(result.message || "Withdrawal requested.");
      setShowWithdrawalModal(false);
    } catch (error) {
      showToast(error?.message || "Withdrawal failed.");
    }
  }

  return (
    <>
      <DesktopReferrals
        dashboard={dashboardQuery.data}
        isDashboardLoading={dashboardQuery.isLoading}
        onCopyCode={() => copyValue("Referral link", dashboardQuery.data?.referralCode ? buildReferralLink(dashboardQuery.data.referralCode) : "")}
        onShare={(channel) => handleShare(channel, dashboardQuery.data?.referralCode)}
        onWithdraw={handleWithdraw}
        points={rewards.points}
        referrals={referrals}
        showWithdrawalModal={showWithdrawalModal}
        setShowWithdrawalModal={setShowWithdrawalModal}
      />
      <MobileReferrals
        dashboard={dashboardQuery.data}
        isDashboardLoading={dashboardQuery.isLoading}
        onCopyCode={() => copyValue("Referral link", dashboardQuery.data?.referralCode ? buildReferralLink(dashboardQuery.data.referralCode) : "")}
        onShare={(channel) => handleShare(channel, dashboardQuery.data?.referralCode)}
        onWithdraw={handleWithdraw}
        referrals={referrals}
        showWithdrawalModal={showWithdrawalModal}
        setShowWithdrawalModal={setShowWithdrawalModal}
      />
    </>
  );
}
