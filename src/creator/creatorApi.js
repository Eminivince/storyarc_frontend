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

export function fetchCreatorApplication() {
  return getJson("/creator/application", {
    headers: getAuthHeaders(),
  });
}

export function saveCreatorApplicationDraft(input) {
  return requestJson("/creator/application/draft", {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function submitCreatorApplication(input) {
  return requestJson("/creator/application/submit", {
    body: input,
    headers: getAuthHeaders(),
    method: "POST",
  });
}

export function listAdminCreatorApplications(status) {
  const searchParams = new URLSearchParams();

  if (status) {
    searchParams.set("status", status);
  }

  const suffix = searchParams.toString();

  return getJson(
    `/admin/creator-applications${suffix ? `?${suffix}` : ""}`,
    {
      headers: getAuthHeaders(),
    },
  );
}

export function approveCreatorApplication(applicationId, input) {
  return requestJson(`/admin/creator-applications/${applicationId}/approve`, {
    body: input,
    headers: getAuthHeaders(),
    method: "POST",
  });
}

export function rejectCreatorApplication(applicationId, input) {
  return requestJson(`/admin/creator-applications/${applicationId}/reject`, {
    body: input,
    headers: getAuthHeaders(),
    method: "POST",
  });
}
