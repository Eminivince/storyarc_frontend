import { getJson, postJson } from "../lib/apiClient";
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

export function fetchSupportTickets() {
  return getJson("/support/tickets", {
    headers: getAuthHeaders(),
  });
}

export function fetchSupportHelpCenter() {
  return getJson("/support/help-center", {
    headers: getAuthHeaders(),
  });
}

export function createSupportTicket(input) {
  return postJson("/support/tickets", input, {
    headers: getAuthHeaders(),
  });
}
