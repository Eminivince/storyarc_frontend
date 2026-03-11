import { requestJson } from "../lib/apiClient";
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

export function saveOnboardingGenres(input) {
  return requestJson("/onboarding/genres", {
    body: input,
    headers: getAuthHeaders(),
    method: "PATCH",
  });
}

export function saveOnboardingPreferences(input) {
  return requestJson("/onboarding/preferences", {
    body: input,
    headers: getAuthHeaders(),
    method: "PATCH",
  });
}

export function uploadOnboardingProfilePicture(input) {
  return requestJson("/onboarding/profile-picture", {
    body: input,
    headers: getAuthHeaders(),
    method: "POST",
  });
}
