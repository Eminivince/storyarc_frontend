import { useQuery } from "@tanstack/react-query";
import { fetchStudioAnalytics } from "./studioApi";

export function useStudioAnalyticsQuery(input) {
  return useQuery({
    queryKey: ["studio", "analytics", input ?? {}],
    queryFn: () => fetchStudioAnalytics(input),
    staleTime: 60_000,
  });
}
