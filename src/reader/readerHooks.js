import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addStoryToReadingList,
  createReadingList,
  createChapterComment,
  createBookmark,
  deleteReadingList,
  deleteStoryReview,
  deleteChapterComment,
  fetchChapterComments,
  fetchPublicReadingLists,
  fetchReadingListDetails,
  fetchReadingLists,
  fetchStoryRankings,
  fetchReaderFollowing,
  fetchBookmarks,
  fetchChapter,
  fetchReaderDashboard,
  fetchReaderHome,
  fetchReaderStories,
  fetchSharedReadingList,
  fetchStoryReviews,
  fetchStoryDetails,
  followAuthor,
  followStory,
  removeStoryFromReadingList,
  removeBookmark,
  regenerateReadingListShareSlug,
  saveReadingProgress,
  searchReaderCatalog,
  upsertStoryReview,
  unfollowAuthor,
  unfollowStory,
  updateReadingList,
  updateChapterComment,
  updateStoryRating,
} from "./readerApi";

const STALE_2_MIN = 2 * 60 * 1000;

async function invalidateFollowQueries(queryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["reader", "dashboard"] }),
    queryClient.invalidateQueries({ queryKey: ["reader", "following"] }),
    queryClient.invalidateQueries({ queryKey: ["reader", "rankings"] }),
    queryClient.invalidateQueries({ queryKey: ["reader", "search"] }),
    queryClient.invalidateQueries({ queryKey: ["reader", "story"] }),
  ]);
}

async function invalidateCommentQueries(queryClient, storySlug, chapterSlug) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["reader", "chapter", storySlug, chapterSlug],
    }),
    queryClient.invalidateQueries({
      queryKey: ["reader", "chapter-comments", storySlug, chapterSlug],
    }),
    queryClient.invalidateQueries({ queryKey: ["reader", "rankings"] }),
  ]);
}

async function invalidateStoryReviewQueries(queryClient, storySlug) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: ["reader", "story", storySlug],
    }),
    queryClient.invalidateQueries({
      queryKey: ["reader", "story-reviews", storySlug],
    }),
    queryClient.invalidateQueries({ queryKey: ["reader", "stories"] }),
    queryClient.invalidateQueries({ queryKey: ["reader", "rankings"] }),
    queryClient.invalidateQueries({ queryKey: ["reader", "search"] }),
    queryClient.invalidateQueries({ queryKey: ["reader", "dashboard"] }),
    queryClient.invalidateQueries({ queryKey: ["reader", "home"] }),
  ]);
}

async function invalidateReadingListQueries(queryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["reader", "reading-lists"] }),
    queryClient.invalidateQueries({ queryKey: ["reader", "public-reading-lists"] }),
    queryClient.invalidateQueries({ queryKey: ["engagement"] }),
  ]);
}

export function useReaderDashboardQuery() {
  return useQuery({
    queryKey: ["reader", "dashboard"],
    queryFn: fetchReaderDashboard,
    staleTime: STALE_2_MIN,
  });
}

export function useReaderFollowingQuery() {
  return useQuery({
    queryKey: ["reader", "following"],
    queryFn: fetchReaderFollowing,
    staleTime: 60_000,
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

export function useStoryRankingsQuery(input) {
  return useQuery({
    queryKey: ["reader", "rankings", input ?? {}],
    queryFn: () => fetchStoryRankings(input),
    staleTime: 60_000,
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

export function useStoryReviewsQuery(storySlug, input = {}) {
  return useQuery({
    enabled: Boolean(storySlug),
    queryKey: ["reader", "story-reviews", storySlug, input],
    queryFn: () => fetchStoryReviews(storySlug, input),
    staleTime: 30_000,
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

export function useChapterCommentsQuery(storySlug, chapterSlug, sort = "top") {
  return useQuery({
    enabled: Boolean(storySlug && chapterSlug),
    queryKey: ["reader", "chapter-comments", storySlug, chapterSlug, sort],
    queryFn: () => fetchChapterComments(storySlug, chapterSlug, { sort }),
    staleTime: 30_000,
  });
}

export function useBookmarksQuery() {
  return useQuery({
    queryKey: ["reader", "bookmarks"],
    queryFn: fetchBookmarks,
    staleTime: 60_000,
  });
}

export function useReadingListsQuery() {
  return useQuery({
    queryKey: ["reader", "reading-lists"],
    queryFn: fetchReadingLists,
    staleTime: 30_000,
  });
}

export function useReadingListDetailsQuery(listId) {
  return useQuery({
    enabled: Boolean(listId),
    queryKey: ["reader", "reading-lists", listId],
    queryFn: () => fetchReadingListDetails(listId),
    staleTime: 30_000,
  });
}

export function useSharedReadingListQuery(shareSlug) {
  return useQuery({
    enabled: Boolean(shareSlug),
    queryKey: ["reader", "reading-lists", "shared", shareSlug],
    queryFn: () => fetchSharedReadingList(shareSlug),
    staleTime: 30_000,
  });
}

export function usePublicReadingListsQuery(input = {}) {
  return useQuery({
    queryKey: ["reader", "public-reading-lists", input],
    queryFn: () => fetchPublicReadingLists(input),
    staleTime: 60_000,
  });
}

export function useSaveReadingProgressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveReadingProgress,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reader", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "rankings"] });
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
      queryClient.invalidateQueries({ queryKey: ["reader", "rankings"] });
      queryClient.invalidateQueries({
        queryKey: ["reader", "chapter", variables.storySlug, variables.chapterSlug],
      });
    },
  });
}

export function useCreateChapterCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chapterSlug, input, storySlug }) =>
      createChapterComment(storySlug, chapterSlug, input),
    onSuccess: (_, variables) =>
      invalidateCommentQueries(
        queryClient,
        variables.storySlug,
        variables.chapterSlug,
      ),
  });
}

export function useUpdateChapterCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, input }) => updateChapterComment(commentId, input),
    onSuccess: (_, variables) =>
      invalidateCommentQueries(
        queryClient,
        variables.storySlug,
        variables.chapterSlug,
      ),
  });
}

export function useDeleteChapterCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }) => deleteChapterComment(commentId),
    onSuccess: (_, variables) =>
      invalidateCommentQueries(
        queryClient,
        variables.storySlug,
        variables.chapterSlug,
      ),
  });
}

export function useUpdateStoryRatingMutation(storySlug) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => updateStoryRating(storySlug, input),
    onSuccess: () => invalidateStoryReviewQueries(queryClient, storySlug),
  });
}

export function useUpsertStoryReviewMutation(storySlug) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => upsertStoryReview(storySlug, input),
    onSuccess: () => invalidateStoryReviewQueries(queryClient, storySlug),
  });
}

export function useDeleteStoryReviewMutation(storySlug) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteStoryReview(storySlug),
    onSuccess: () => invalidateStoryReviewQueries(queryClient, storySlug),
  });
}

export function useFollowStoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: followStory,
    onSuccess: () => invalidateFollowQueries(queryClient),
  });
}

export function useUnfollowStoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfollowStory,
    onSuccess: () => invalidateFollowQueries(queryClient),
  });
}

export function useFollowAuthorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: followAuthor,
    onSuccess: () => invalidateFollowQueries(queryClient),
  });
}

export function useUnfollowAuthorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfollowAuthor,
    onSuccess: () => invalidateFollowQueries(queryClient),
  });
}

export function useRemoveBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reader", "bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "rankings"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "story"] });
      queryClient.invalidateQueries({ queryKey: ["reader", "chapter"] });
    },
  });
}

export function useCreateReadingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReadingList,
    onSuccess: () => invalidateReadingListQueries(queryClient),
  });
}

export function useUpdateReadingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, input }) => updateReadingList(listId, input),
    onSuccess: () => invalidateReadingListQueries(queryClient),
  });
}

export function useDeleteReadingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReadingList,
    onSuccess: () => invalidateReadingListQueries(queryClient),
  });
}

export function useAddStoryToReadingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input, listId }) => addStoryToReadingList(listId, input),
    onSuccess: () => invalidateReadingListQueries(queryClient),
  });
}

export function useRemoveStoryFromReadingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, storySlug }) =>
      removeStoryFromReadingList(listId, storySlug),
    onSuccess: () => invalidateReadingListQueries(queryClient),
  });
}

export function useRegenerateReadingListShareSlugMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateReadingListShareSlug,
    onSuccess: () => invalidateReadingListQueries(queryClient),
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
