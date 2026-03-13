import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBookmark,
  fetchBookmarks,
  fetchChapter,
  fetchReaderDashboard,
  fetchReaderHome,
  fetchReaderStories,
  fetchStoryDetails,
  removeBookmark,
  saveReadingProgress,
  searchReaderCatalog,
  updateStoryRating,
} from "./readerApi";

const STALE_2_MIN = 2 * 60 * 1000;

export function useReaderDashboardQuery() {
  return useQuery({
    queryKey: ["reader", "dashboard"],
    queryFn: fetchReaderDashboard,
    staleTime: STALE_2_MIN,
  });
}

export function useReaderHomeQuery() {
  return useQuery({
    queryKey: ["reader", "home"],
    queryFn: fetchReaderHome,
    staleTime: STALE_2_MIN,
  });
}

export function useReaderStoriesQuery(input) {
  return useQuery({
    queryKey: ["reader", "stories", input ?? {}],
    queryFn: () => fetchReaderStories(input),
    staleTime: STALE_2_MIN,
  });
}

export function useReaderSearchQuery(query) {
  return useQuery({
    queryKey: ["reader", "search", query ?? ""],
    queryFn: () => searchReaderCatalog({ query }),
    staleTime: STALE_2_MIN,
  });
}

export function useStoryDetailsQuery(storySlug) {
  return useQuery({
    enabled: Boolean(storySlug),
    queryKey: ["reader", "story", storySlug],
    queryFn: () => fetchStoryDetails(storySlug),
    staleTime: 90_000,
  });
}

export function useChapterQuery(storySlug, chapterSlug) {
  return useQuery({
    enabled: Boolean(storySlug && chapterSlug),
    queryKey: ["reader", "chapter", storySlug, chapterSlug],
    queryFn: () => fetchChapter(storySlug, chapterSlug),
    staleTime: 90_000,
  });
}

export function useBookmarksQuery() {
  return useQuery({
    queryKey: ["reader", "bookmarks"],
    queryFn: fetchBookmarks,
    staleTime: 60_000,
  });
}

export function useSaveReadingProgressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveReadingProgress,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reader", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "story", variables.storySlug] });
    },
  });
}

export function useCreateBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBookmark,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reader", "bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "story", variables.storySlug] });
      queryClient.invalidateQueries({
        queryKey: ["reader", "chapter", variables.storySlug, variables.chapterSlug],
      });
    },
  });
}

export function useUpdateStoryRatingMutation(storySlug) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => updateStoryRating(storySlug, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reader", "story", storySlug] });
      queryClient.invalidateQueries({ queryKey: ["reader", "stories"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "search"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "home"] });
    },
  });
}

export function useRemoveBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reader", "bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "story"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "chapter"] });
    },
  });
}

export function prefetchStoryDetails(queryClient, storySlug) {
  if (!storySlug) return;
  queryClient.prefetchQuery({
    queryKey: ["reader", "story", storySlug],
    queryFn: () => fetchStoryDetails(storySlug),
    staleTime: 90_000,
  });
}

export function prefetchChapter(queryClient, storySlug, chapterSlug) {
  if (!storySlug || !chapterSlug) return;
  prefetchStoryDetails(queryClient, storySlug);
  queryClient.prefetchQuery({
    queryKey: ["reader", "chapter", storySlug, chapterSlug],
    queryFn: () => fetchChapter(storySlug, chapterSlug),
    staleTime: 90_000,
  });
}
