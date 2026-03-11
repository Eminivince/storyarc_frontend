import { getJson, postJson, requestJson } from "../lib/apiClient";
import { getAccessToken } from "./authStorage";

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

export function registerAccount(input) {
  return postJson("/auth/register", input);
}

export function resendRegistrationCode(input) {
  return postJson("/auth/register/resend-code", input);
}

export function verifyRegistrationCode(input) {
  return postJson("/auth/register/verify-code", input);
}

export function loginAccount(input) {
  return postJson("/auth/login", input);
}

export function logoutAccount() {
  return postJson("/auth/logout", undefined, {
    headers: getAuthHeaders(),
  });
}

export function refreshAccountSession(input) {
  return postJson("/auth/refresh", input);
}

export function fetchCurrentUser() {
  return getJson("/me", {
    headers: getAuthHeaders(),
  });
}

export function updateCurrentUserProfile(input) {
  return requestJson("/me/profile", {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function requestPasswordReset(input) {
  return postJson("/auth/forgot-password", input);
}

export function verifyPasswordResetCode(input) {
  return postJson("/auth/verify-reset-code", input);
}

export function resetPasswordWithToken(input) {
  return postJson("/auth/reset-password", input);
}

export function listSessions() {
  return getJson("/auth/sessions", {
    headers: getAuthHeaders(),
  });
}

export function revokeSession(sessionId) {
  return requestJson(`/auth/sessions/${sessionId}`, {
    headers: getAuthHeaders(),
    method: "DELETE",
  });
}
