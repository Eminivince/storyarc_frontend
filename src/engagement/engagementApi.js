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
