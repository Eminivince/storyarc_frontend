import { getJson, requestJson } from "../lib/apiClient";
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

export function fetchStudioStories() {
  return getJson("/studio/stories", {
    headers: getAuthHeaders(),
  });
}

export function fetchStudioAnalytics({ days, storySlug } = {}) {
  const params = new URLSearchParams();

  if (days) {
    params.set("days", String(days));
  }

  if (storySlug) {
    params.set("storySlug", storySlug);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";

  return getJson(`/studio/analytics${suffix}`, {
    headers: getAuthHeaders(),
  });
}

export function fetchStudioStory(storySlug) {
  return getJson(`/studio/stories/${storySlug}`, {
    headers: getAuthHeaders(),
  });
}

export function createStudioStory(input) {
  return requestJson("/studio/stories", {
    body: input,
    headers: getAuthHeaders(),
    method: "POST",
  });
}

export function updateStudioStory(storySlug, input) {
  return requestJson(`/studio/stories/${storySlug}`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PATCH",
  });
}

export function saveStudioChapterDraft(storySlug, input) {
  return requestJson(`/studio/stories/${storySlug}/chapters/draft`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function fetchStudioChapterDraft(storySlug, chapterId) {
  return getJson(`/studio/stories/${storySlug}/chapters/${chapterId}`, {
    headers: getAuthHeaders(),
  });
}

export function publishStudioChapter(chapterId, input) {
  return requestJson(`/studio/chapters/${chapterId}/publish`, {
    body: input,
    headers: getAuthHeaders(),
    method: "POST",
  });
}

export function moveStudioChapterToBin(storySlug, chapterId) {
  return requestJson(`/studio/stories/${storySlug}/chapters/${chapterId}/bin`, {
    headers: getAuthHeaders(),
    method: "POST",
  });
}

export function restoreStudioChapterFromBin(storySlug, chapterId) {
  return requestJson(`/studio/stories/${storySlug}/chapters/${chapterId}/restore`, {
    headers: getAuthHeaders(),
    method: "POST",
  });
}

export function saveStudioStructure(storySlug, input) {
  return requestJson(`/studio/stories/${storySlug}/structure`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function uploadStudioCover(input) {
  return requestJson("/studio/covers", {
    body: input,
    headers: getAuthHeaders(),
    method: "POST",
    timeoutMs: 30000,
  });
}

export function fetchCreatorScorecard() {
  return getJson("/engagement/creator-scorecard", {
    headers: getAuthHeaders(),
  });
}
