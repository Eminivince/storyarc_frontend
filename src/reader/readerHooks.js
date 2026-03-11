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
} from "./readerApi";

export function useReaderDashboardQuery() {
  return useQuery({
    queryKey: ["reader", "dashboard"],
    queryFn: fetchReaderDashboard,
  });
}

export function useReaderHomeQuery() {
  return useQuery({
    queryKey: ["reader", "home"],
    queryFn: fetchReaderHome,
  });
}

export function useReaderStoriesQuery(input) {
  return useQuery({
    queryKey: ["reader", "stories", input ?? {}],
    queryFn: () => fetchReaderStories(input),
  });
}

export function useReaderSearchQuery(query) {
  return useQuery({
    queryKey: ["reader", "search", query ?? ""],
    queryFn: () => searchReaderCatalog({ query }),
  });
}

export function useStoryDetailsQuery(storySlug) {
  return useQuery({
    enabled: Boolean(storySlug),
    queryKey: ["reader", "story", storySlug],
    queryFn: () => fetchStoryDetails(storySlug),
  });
}

export function useChapterQuery(storySlug, chapterSlug) {
  return useQuery({
    enabled: Boolean(storySlug && chapterSlug),
    queryKey: ["reader", "chapter", storySlug, chapterSlug],
    queryFn: () => fetchChapter(storySlug, chapterSlug),
  });
}

export function useBookmarksQuery() {
  return useQuery({
    queryKey: ["reader", "bookmarks"],
    queryFn: fetchBookmarks,
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
