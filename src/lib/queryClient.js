import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      networkMode: "offlineFirst",
      retry: false,
    },
    queries: {
      networkMode: "offlineFirst",
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 0,
    },
  },
});
