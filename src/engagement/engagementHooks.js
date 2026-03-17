import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  claimChallengeReward,
  fetchActiveChallenges,
  fetchBadges,
  fetchChallengeLeaderboard,
  fetchChapterReactions,
  fetchReactionHeatmap,
  purchaseStreakShield,
  recordReadingTime,
  removeParagraphReaction,
  removeChapterReaction,
  toggleBadgeFeatured,
  upsertChapterReaction,
  upsertParagraphReaction,
} from "./engagementApi";

const STALE_5_MIN = 5 * 60 * 1000;

export function useBadgesQuery() {
  return useQuery({
    queryKey: ["badges"],
    queryFn: fetchBadges,
    staleTime: STALE_5_MIN,
  });
}

export function usePurchaseStreakShieldMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseStreakShield,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engagement-overview"] });
      queryClient.invalidateQueries({ queryKey: ["engagement"] });
    },
  });
}

export function useRecordReadingTimeMutation() {
  return useMutation({
    mutationFn: recordReadingTime,
  });
}

export function useToggleBadgeFeaturedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBadgeFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["badges"] });
    },
  });
}

// ── Reactions ──────────────────────────────────────────────────────

export function useChapterReactionsQuery(storySlug, chapterSlug) {
  return useQuery({
    queryKey: ["chapter-reactions", storySlug, chapterSlug],
    queryFn: () => fetchChapterReactions({ storySlug, chapterSlug }),
    staleTime: 60 * 1000,
    enabled: Boolean(storySlug && chapterSlug),
  });
}

export function useUpsertParagraphReactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertParagraphReaction,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter-reactions", variables.storySlug, variables.chapterSlug],
      });
    },
  });
}

export function useRemoveParagraphReactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeParagraphReaction,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter-reactions", variables.storySlug, variables.chapterSlug],
      });
    },
  });
}

export function useUpsertChapterReactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertChapterReaction,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter-reactions", variables.storySlug, variables.chapterSlug],
      });
    },
  });
}

export function useRemoveChapterReactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeChapterReaction,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter-reactions", variables.storySlug, variables.chapterSlug],
      });
    },
  });
}

export function useReactionHeatmapQuery(storySlug, chapterSlug) {
  return useQuery({
    queryKey: ["reaction-heatmap", storySlug, chapterSlug],
    queryFn: () => fetchReactionHeatmap({ storySlug, chapterSlug }),
    staleTime: STALE_5_MIN,
    enabled: Boolean(storySlug && chapterSlug),
  });
}

// ── Challenges ─────────────────────────────────────────────────────

export function useActiveChallengesQuery() {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: fetchActiveChallenges,
    staleTime: STALE_5_MIN,
  });
}

export function useClaimChallengeRewardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimChallengeReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["engagement-overview"] });
      queryClient.invalidateQueries({ queryKey: ["engagement"] });
    },
  });
}

export function useChallengeLeaderboardQuery(challengeId) {
  return useQuery({
    queryKey: ["challenge-leaderboard", challengeId],
    queryFn: () => fetchChallengeLeaderboard(challengeId),
    staleTime: STALE_5_MIN,
    enabled: Boolean(challengeId),
  });
}
