import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import RouteLoadingScreen from "../components/RouteLoadingScreen";
import { useToast } from "../context/ToastContext";
import {
  useActiveChallengesQuery,
  useClaimChallengeRewardMutation,
  useChallengeLeaderboardQuery,
} from "../engagement/engagementHooks";

const METRIC_LABELS = {
  CHAPTERS_READ: "chapters read",
  READING_TIME_MINUTES: "minutes read",
  STORIES_COMPLETED: "stories completed",
  REVIEWS_WRITTEN: "reviews written",
  COMMENTS_WRITTEN: "comments written",
  DAYS_STREAK: "day streak",
  BOOKS_STARTED: "books started",
};

const TYPE_BADGES = {
  SEASONAL: { label: "Seasonal", color: "bg-amber-500/20 text-amber-400" },
  WEEKLY: { label: "Weekly", color: "bg-blue-500/20 text-blue-400" },
  SPECIAL: { label: "Special", color: "bg-purple-500/20 text-purple-400" },
};

function formatTimeRemaining(ms) {
  const hours = Math.floor(ms / 3_600_000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h left`;
  if (hours > 0) return `${hours}h left`;
  return "Ending soon";
}

function ChallengeCard({ challenge, onClaim, isClaiming, onViewLeaderboard }) {
  const progress = Math.min(challenge.currentValue / challenge.targetValue, 1);
  const isCompleted = Boolean(challenge.completedAt);
  const isClaimed = Boolean(challenge.claimedAt);
  const typeBadge = TYPE_BADGES[challenge.type] ?? TYPE_BADGES.SPECIAL;
  const metricLabel = METRIC_LABELS[challenge.targetMetric] ?? challenge.targetMetric;

  return (
    <motion.div
      className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${typeBadge.color}`}>
            {typeBadge.label}
          </span>
          <h3 className="text-sm font-bold text-zinc-100">{challenge.title}</h3>
        </div>
        <span className="text-[10px] font-medium text-zinc-500">
          {formatTimeRemaining(challenge.timeRemainingMs)}
        </span>
      </div>

      <p className="mb-3 text-xs text-zinc-400">{challenge.description}</p>

      <div className="mb-2">
        <div className="flex items-center justify-between text-[10px] font-medium text-zinc-500">
          <span>
            {challenge.currentValue} / {challenge.targetValue} {metricLabel}
          </span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-800">
          <motion.div
            className={`h-full rounded-full ${isCompleted ? "bg-green-500" : "bg-primary"}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-amber-400">
          +{challenge.rewardPoints} pts
          {challenge.rewardBadge && (
            <span className="ml-1 text-zinc-500">+ badge</span>
          )}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onViewLeaderboard(challenge.id)}
            className="rounded-lg px-2 py-1 text-[10px] font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
          >
            Leaderboard
          </button>
          {isCompleted && !isClaimed && (
            <button
              onClick={() => onClaim(challenge.id)}
              disabled={isClaiming}
              className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-background-dark transition-all hover:brightness-110 disabled:opacity-50"
            >
              {isClaiming ? "Claiming..." : "Claim"}
            </button>
          )}
          {isClaimed && (
            <span className="rounded-lg bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
              Claimed
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function LeaderboardModal({ challengeId, onClose }) {
  const { data, isLoading } = useChallengeLeaderboardQuery(challengeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-100">
            {data?.title ?? "Challenge"} Leaderboard
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">✕</button>
        </div>

        {isLoading && <p className="text-sm text-zinc-500">Loading...</p>}

        {data?.leaderboard && (
          <div className="space-y-2">
            {data.leaderboard.map((entry) => (
              <div key={entry.userId} className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-3 py-2">
                <span className={`w-6 text-center text-sm font-bold ${entry.rank <= 3 ? "text-amber-400" : "text-zinc-500"}`}>
                  {entry.rank}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200">{entry.displayName}</p>
                </div>
                <span className="text-sm font-bold text-primary">
                  {entry.currentValue}/{data.targetValue}
                </span>
              </div>
            ))}
            {data.leaderboard.length === 0 && (
              <p className="text-center text-sm text-zinc-500">No participants yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopChallenges({ challenges, onClaim, isClaiming, onViewLeaderboard }) {
  return (
    <div className="hidden min-h-screen bg-background-dark font-display text-slate-100 md:block">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <Link className="text-xs font-bold uppercase tracking-widest text-primary hover:underline" to="/account/rewards">
            Rewards
          </Link>
          <h1 className="mt-1 text-2xl font-bold">Reading Challenges</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Complete challenges to earn bonus points and exclusive badges.
          </p>
        </div>

        {challenges.length === 0 && (
          <p className="text-center text-sm text-zinc-500">No active challenges right now. Check back soon!</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              onClaim={onClaim}
              isClaiming={isClaiming}
              onViewLeaderboard={onViewLeaderboard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileChallenges({ challenges, onClaim, isClaiming, onViewLeaderboard }) {
  return (
    <div className="min-h-screen bg-background-dark font-display text-slate-100 md:hidden">
      <div className="px-4 py-6">
        <div className="mb-6">
          <Link className="text-xs font-bold uppercase tracking-widest text-primary hover:underline" to="/account/rewards">
            Rewards
          </Link>
          <h1 className="mt-1 text-xl font-bold">Reading Challenges</h1>
        </div>

        {challenges.length === 0 && (
          <p className="text-center text-sm text-zinc-500">No active challenges right now.</p>
        )}

        <div className="space-y-4">
          {challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              onClaim={onClaim}
              isClaiming={isClaiming}
              onViewLeaderboard={onViewLeaderboard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const { showToast } = useToast();
  const { data, isLoading } = useActiveChallengesQuery();
  const claimMutation = useClaimChallengeRewardMutation();
  const [leaderboardChallengeId, setLeaderboardChallengeId] = useState(null);

  if (isLoading) return <RouteLoadingScreen />;

  const challenges = data ?? [];

  async function handleClaim(challengeId) {
    try {
      await claimMutation.mutateAsync(challengeId);
      showToast("Challenge reward claimed!", { title: "Reward" });
    } catch (err) {
      showToast(err?.message ?? "Failed to claim reward.", { title: "Error", tone: "error" });
    }
  }

  return (
    <>
      <DesktopChallenges
        challenges={challenges}
        onClaim={handleClaim}
        isClaiming={claimMutation.isPending}
        onViewLeaderboard={setLeaderboardChallengeId}
      />
      <MobileChallenges
        challenges={challenges}
        onClaim={handleClaim}
        isClaiming={claimMutation.isPending}
        onViewLeaderboard={setLeaderboardChallengeId}
      />
      {leaderboardChallengeId && (
        <LeaderboardModal
          challengeId={leaderboardChallengeId}
          onClose={() => setLeaderboardChallengeId(null)}
        />
      )}
    </>
  );
}
