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

export function saveReadingProgress(input) {
  return requestJson("/reader/progress", {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
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
