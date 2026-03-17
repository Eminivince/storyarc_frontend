import { useQuery } from "@tanstack/react-query";
import { fetchCreatorScorecard, fetchStudioAnalytics } from "./studioApi";

const STALE_5_MIN = 5 * 60 * 1000;

export function useStudioAnalyticsQuery(input) {
  return useQuery({
    queryKey: ["studio", "analytics", input ?? {}],
    queryFn: () => fetchStudioAnalytics(input),
    staleTime: 60_000,
  });
}

export function useCreatorScorecardQuery() {
  return useQuery({
    queryKey: ["creator", "scorecard"],
    queryFn: fetchCreatorScorecard,
    staleTime: STALE_5_MIN,
  });
}
