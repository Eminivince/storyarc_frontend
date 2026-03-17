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

export function fetchEngagementOverview() {
  return getJson("/engagement/overview", {
    headers: getAuthHeaders(),
  });
}

export function fetchEngagementNotifications() {
  return getJson("/engagement/notifications", {
    headers: getAuthHeaders(),
  });
}

export function claimDailyCheckIn() {
  return postJson("/engagement/check-in", undefined, {
    headers: getAuthHeaders(),
  });
}

export function claimMission(missionKey) {
  return postJson(`/engagement/missions/${missionKey}/claim`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function shareReferral(input) {
  return postJson("/engagement/referrals/share", input, {
    headers: getAuthHeaders(),
  });
}

export function fetchLeaderboard(period = "weekly") {
  const params = new URLSearchParams();

  if (period) {
    params.set("period", period);
  }

  return getJson(`/engagement/leaderboard?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
}

export function fetchCommunity(storySlug) {
  const params = new URLSearchParams();

  if (storySlug) {
    params.set("storySlug", storySlug);
  }

  const suffix = params.toString();

  return getJson(`/engagement/community${suffix ? `?${suffix}` : ""}`, {
    headers: getAuthHeaders(),
  });
}

export function createAnnouncement(input) {
  return postJson("/engagement/community/announcements", input, {
    headers: getAuthHeaders(),
  });
}

export function createPoll(input) {
  return postJson("/engagement/community/polls", input, {
    headers: getAuthHeaders(),
  });
}

export function votePoll(postId, input) {
  return postJson(`/engagement/community/polls/${postId}/vote`, input, {
    headers: getAuthHeaders(),
  });
}

export function updateNotificationPreferences(input) {
  return requestJson("/engagement/notification-preferences", {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function markNotificationRead(notificationId) {
  return postJson(`/engagement/notifications/${notificationId}/read`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function markAllNotificationsRead() {
  return postJson("/engagement/notifications/read-all", undefined, {
    headers: getAuthHeaders(),
  });
}

export function purchaseStreakShield() {
  return postJson("/engagement/streak-shield/purchase", undefined, {
    headers: getAuthHeaders(),
  });
}

export function recordReadingTime(body) {
  return postJson("/engagement/reading-time", body, {
    headers: getAuthHeaders(),
  });
}

export function fetchBadges() {
  return getJson("/engagement/badges", {
    headers: getAuthHeaders(),
  });
}

export function toggleBadgeFeatured(badgeId) {
  return requestJson(`/engagement/badges/${badgeId}/feature`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
}

// ── Paragraph & Chapter Reactions ──────────────────────────────────

export function upsertParagraphReaction({ storySlug, chapterSlug, index, reactionType }) {
  return requestJson(
    `/engagement/stories/${storySlug}/chapters/${chapterSlug}/paragraphs/${index}/reaction`,
    { method: "PUT", body: { reactionType }, headers: getAuthHeaders() },
  );
}

export function removeParagraphReaction({ storySlug, chapterSlug, index }) {
  return requestJson(
    `/engagement/stories/${storySlug}/chapters/${chapterSlug}/paragraphs/${index}/reaction`,
    { method: "DELETE", headers: getAuthHeaders() },
  );
}

export function upsertChapterReaction({ storySlug, chapterSlug, reactionType }) {
  return requestJson(
    `/engagement/stories/${storySlug}/chapters/${chapterSlug}/reaction`,
    { method: "PUT", body: { reactionType }, headers: getAuthHeaders() },
  );
}

export function removeChapterReaction({ storySlug, chapterSlug }) {
  return requestJson(
    `/engagement/stories/${storySlug}/chapters/${chapterSlug}/reaction`,
    { method: "DELETE", headers: getAuthHeaders() },
  );
}

export function fetchChapterReactions({ storySlug, chapterSlug }) {
  return getJson(
    `/engagement/stories/${storySlug}/chapters/${chapterSlug}/reactions`,
    { headers: getAuthHeaders() },
  );
}

export function fetchReactionHeatmap({ storySlug, chapterSlug }) {
  return getJson(
    `/engagement/stories/${storySlug}/chapters/${chapterSlug}/reaction-heatmap`,
    { headers: getAuthHeaders() },
  );
}

// ── Reading Challenges ─────────────────────────────────────────────

export function fetchActiveChallenges() {
  return getJson("/engagement/challenges", {
    headers: getAuthHeaders(),
  });
}

export function claimChallengeReward(challengeId) {
  return postJson(`/engagement/challenges/${challengeId}/claim`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function fetchChallengeLeaderboard(challengeId) {
  return getJson(`/engagement/challenges/${challengeId}/leaderboard`, {
    headers: getAuthHeaders(),
  });
}

// ── Point Shop ─────────────────────────────────────────────────────

export function fetchShopCatalog() {
  return getJson("/engagement/shop", {
    headers: getAuthHeaders(),
  });
}

export function purchaseShopItem(itemId) {
  return postJson(`/engagement/shop/${itemId}/purchase`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function fetchMyShopItems() {
  return getJson("/engagement/shop/my-items", {
    headers: getAuthHeaders(),
  });
}

// ── Activity Feed ──────────────────────────────────────────────────

export function fetchActivityFeed({ cursor, limit = 20 } = {}) {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (limit) params.set("limit", String(limit));
  const suffix = params.toString();
  return getJson(`/engagement/activity-feed${suffix ? `?${suffix}` : ""}`, {
    headers: getAuthHeaders(),
  });
}

export function fetchOwnActivity({ cursor, limit = 20 } = {}) {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (limit) params.set("limit", String(limit));
  const suffix = params.toString();
  return getJson(`/engagement/activity-feed/me${suffix ? `?${suffix}` : ""}`, {
    headers: getAuthHeaders(),
  });
}
