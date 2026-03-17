import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchBadges,
  purchaseStreakShield,
  recordReadingTime,
  toggleBadgeFeatured,
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
