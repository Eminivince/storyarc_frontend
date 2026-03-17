import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  claimChallengeReward,
  fetchActiveChallenges,
  fetchBadges,
  fetchChallengeLeaderboard,
  fetchChapterReactions,
  fetchChurnMetrics,
  fetchReactionHeatmap,
  fetchReturningUserCheck,
  purchaseStreakShield,
  recordInterventionClick,
  recordInterventionConversion,
  recordReadingTime,
  removeParagraphReaction,
  removeChapterReaction,
  toggleBadgeFeatured,
  fetchActivityFeed,
  fetchMyShopItems,
  fetchOwnActivity,
  fetchShopCatalog,
  purchaseShopItem,
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

// ── Point Shop ─────────────────────────────────────────────────────

export function useShopCatalogQuery() {
  return useQuery({
    queryKey: ["shop-catalog"],
    queryFn: fetchShopCatalog,
    staleTime: STALE_5_MIN,
  });
}

export function usePurchaseShopItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: purchaseShopItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-catalog"] });
      queryClient.invalidateQueries({ queryKey: ["my-shop-items"] });
      queryClient.invalidateQueries({ queryKey: ["engagement-overview"] });
      queryClient.invalidateQueries({ queryKey: ["engagement"] });
    },
  });
}

export function useMyShopItemsQuery() {
  return useQuery({
    queryKey: ["my-shop-items"],
    queryFn: fetchMyShopItems,
    staleTime: STALE_5_MIN,
  });
}

// ── Activity Feed ──────────────────────────────────────────────────

export function useActivityFeedQuery() {
  return useQuery({
    queryKey: ["activity-feed"],
    queryFn: () => fetchActivityFeed(),
    staleTime: 60 * 1000,
  });
}

export function useOwnActivityQuery() {
  return useQuery({
    queryKey: ["own-activity"],
    queryFn: () => fetchOwnActivity(),
    staleTime: 60 * 1000,
  });
}

// ── Churn / Returning User ────────────────────────────────────────

export function useReturningUserCheckQuery() {
  return useQuery({
    queryKey: ["returning-user-check"],
    queryFn: fetchReturningUserCheck,
    staleTime: STALE_5_MIN,
  });
}

export function useInterventionClickMutation() {
  return useMutation({
    mutationFn: recordInterventionClick,
  });
}

export function useInterventionConversionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: recordInterventionConversion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returning-user-check"] });
    },
  });
}

export function useChurnMetricsQuery() {
  return useQuery({
    queryKey: ["churn-metrics"],
    queryFn: fetchChurnMetrics,
    staleTime: STALE_5_MIN,
  });
}
