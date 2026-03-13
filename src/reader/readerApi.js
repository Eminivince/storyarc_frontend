import { getJson, postJson, requestJson } from "../lib/apiClient";
import { getAccessToken } from "../auth/authStorage";

function getAuthHeaders(headers = {}) {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${accessToken}`,
  };
}

export function fetchReaderDashboard() {
  return getJson("/reader/dashboard", {
    headers: getAuthHeaders(),
  });
}

export function fetchReaderFollowing() {
  return getJson("/reader/following", {
    headers: getAuthHeaders(),
  });
}

export function fetchReaderHome() {
  return getJson("/reader/home", {
    headers: getAuthHeaders(),
  });
}

export function fetchReaderStories({ genre, query } = {}) {
  const params = new URLSearchParams();

  if (genre) {
    params.set("genre", genre);
  }

  if (query) {
    params.set("q", query);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return getJson(`/reader/stories${suffix}`, {
    headers: getAuthHeaders(),
  });
}

export function fetchStoryRankings({ genre, kind, limit } = {}) {
  const params = new URLSearchParams();

  if (genre) {
    params.set("genre", genre);
  }

  if (kind) {
    params.set("kind", kind);
  }

  if (limit) {
    params.set("limit", String(limit));
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return getJson(`/reader/rankings${suffix}`, {
    headers: getAuthHeaders(),
  });
}

export function searchReaderCatalog({ query } = {}) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return getJson(`/reader/search${suffix}`, {
    headers: getAuthHeaders(),
  });
}

export function fetchStoryDetails(storySlug) {
  return getJson(`/reader/stories/${storySlug}`, {
    headers: getAuthHeaders(),
  });
}

export function fetchStoryReviews(storySlug, { limit, sort } = {}) {
  const params = new URLSearchParams();

  if (sort) {
    params.set("sort", sort);
  }

  if (limit) {
    params.set("limit", String(limit));
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return getJson(`/reader/stories/${storySlug}/reviews${suffix}`, {
    headers: getAuthHeaders(),
  });
}

export function upsertStoryReview(storySlug, input) {
  return requestJson(`/reader/stories/${storySlug}/review`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function deleteStoryReview(storySlug) {
  return requestJson(`/reader/stories/${storySlug}/review`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
}

export function followStory(storySlug) {
  return postJson(`/reader/stories/${storySlug}/follow`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function unfollowStory(storySlug) {
  return requestJson(`/reader/stories/${storySlug}/follow`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
}

export function followAuthor(authorId) {
  return postJson(`/reader/authors/${authorId}/follow`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function unfollowAuthor(authorId) {
  return requestJson(`/reader/authors/${authorId}/follow`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
}

export function updateStoryRating(storySlug, input) {
  return requestJson(`/reader/stories/${storySlug}/rating`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function fetchChapter(storySlug, chapterSlug) {
  return getJson(`/reader/stories/${storySlug}/chapters/${chapterSlug}`, {
    headers: getAuthHeaders(),
  });
}

export function fetchChapterComments(storySlug, chapterSlug, { sort } = {}) {
  const params = new URLSearchParams();

  if (sort) {
    params.set("sort", sort);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return getJson(`/reader/stories/${storySlug}/chapters/${chapterSlug}/comments${suffix}`, {
    headers: getAuthHeaders(),
  });
}

export function createChapterComment(storySlug, chapterSlug, input) {
  return postJson(`/reader/stories/${storySlug}/chapters/${chapterSlug}/comments`, input, {
    headers: getAuthHeaders(),
  });
}

export function updateChapterComment(commentId, input) {
  return requestJson(`/reader/comments/${commentId}`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function deleteChapterComment(commentId) {
  return requestJson(`/reader/comments/${commentId}`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
}

export function saveReadingProgress(input) {
  return requestJson("/reader/progress", {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function fetchReadingLists() {
  return getJson("/reader/reading-lists", {
    headers: getAuthHeaders(),
  });
}

export function fetchReadingListDetails(listId) {
  return getJson(`/reader/reading-lists/${listId}`, {
    headers: getAuthHeaders(),
  });
}

export function fetchSharedReadingList(shareSlug) {
  return getJson(`/reader/reading-lists/shared/${shareSlug}`);
}

export function fetchPublicReadingLists({ limit, query } = {}) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (limit) {
    params.set("limit", String(limit));
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return getJson(`/reader/public-reading-lists${suffix}`);
}

export function createReadingList(input) {
  return postJson("/reader/reading-lists", input, {
    headers: getAuthHeaders(),
  });
}

export function updateReadingList(listId, input) {
  return requestJson(`/reader/reading-lists/${listId}`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function deleteReadingList(listId) {
  return requestJson(`/reader/reading-lists/${listId}`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
}

export function addStoryToReadingList(listId, input) {
  return postJson(`/reader/reading-lists/${listId}/stories`, input, {
    headers: getAuthHeaders(),
  });
}

export function removeStoryFromReadingList(listId, storySlug) {
  return requestJson(`/reader/reading-lists/${listId}/stories/${storySlug}`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
}

export function regenerateReadingListShareSlug(listId) {
  return postJson(`/reader/reading-lists/${listId}/regenerate-share-slug`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function fetchBookmarks() {
  return getJson("/reader/bookmarks", {
    headers: getAuthHeaders(),
  });
}

export function createBookmark(input) {
  return postJson("/reader/bookmarks", input, {
    headers: getAuthHeaders(),
  });
}

export function removeBookmark(bookmarkId) {
  return requestJson(`/reader/bookmarks/${bookmarkId}`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
}
