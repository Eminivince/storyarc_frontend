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

export function fetchAdminOverview() {
  return getJson("/admin/dashboard", {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminBooks() {
  return getJson("/admin/books", {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminContracts() {
  return getJson("/admin/contracts", {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminContract(contractId) {
  return getJson(`/admin/contracts/${contractId}`, {
    headers: getAuthHeaders(),
  });
}

export function createAdminContract(input) {
  return postJson("/admin/contracts", input, {
    headers: getAuthHeaders(),
  });
}

export function updateAdminContract(contractId, input) {
  return requestJson(`/admin/contracts/${contractId}`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function fetchAdminContractLookups() {
  return getJson("/admin/contracts/lookups", {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminContractTemplates() {
  return getJson("/admin/contracts/templates", {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminContractTemplate(templateId) {
  return getJson(`/admin/contracts/templates/${templateId}`, {
    headers: getAuthHeaders(),
  });
}

export function createAdminContractTemplate(input) {
  return postJson("/admin/contracts/templates", input, {
    headers: getAuthHeaders(),
  });
}

export function updateAdminContractTemplate(templateId, input) {
  return requestJson(`/admin/contracts/templates/${templateId}`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function fetchAdminBookDetails(bookSlug) {
  return getJson(`/admin/books/${bookSlug}`, {
    headers: getAuthHeaders(),
  });
}

export function updateAdminBookPolicy(input) {
  return requestJson("/admin/books/policy", {
    body: input,
    headers: getAuthHeaders(),
    method: "PATCH",
  });
}

export function updateAdminBookVisibility(bookSlug, input) {
  return requestJson(`/admin/books/${bookSlug}/visibility`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PATCH",
  });
}

export function updateAdminBookConfig(bookSlug, input) {
  return requestJson(`/admin/books/${bookSlug}/config`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function fetchAdminUsers() {
  return getJson("/admin/users", {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminUserDetails(userId) {
  return getJson(`/admin/users/${userId}`, {
    headers: getAuthHeaders(),
  });
}

export function updateAdminUser(userId, input) {
  return requestJson(`/admin/users/${userId}`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function updateAdminUserStatus(userId, action) {
  return requestJson(`/admin/users/${userId}/status`, {
    body: { action },
    headers: getAuthHeaders(),
    method: "PATCH",
  });
}

export function resetAdminUserPassword(userId) {
  return postJson(`/admin/users/${userId}/reset-password`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminReports() {
  return getJson("/admin/reports", {
    headers: getAuthHeaders(),
  });
}

export function updateAdminReport(reportId, input) {
  return requestJson(`/admin/reports/${reportId}`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PATCH",
  });
}

export function fetchAdminMonetization() {
  return getJson("/admin/monetization", {
    headers: getAuthHeaders(),
  });
}

export function releaseAdminPayout(payoutId) {
  return postJson(`/admin/payouts/${payoutId}/release`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function reviewAdminPayout(payoutId) {
  return postJson(`/admin/payouts/${payoutId}/review`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminSettings() {
  return getJson("/admin/settings", {
    headers: getAuthHeaders(),
  });
}

export function toggleAdminSetting(settingKey) {
  return postJson(`/admin/settings/${settingKey}/toggle`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function updateAdminSetting(settingKey, input) {
  return requestJson(`/admin/settings/${settingKey}`, {
    body: input,
    headers: getAuthHeaders(),
    method: "PUT",
  });
}

export function runAdminMaintenance(actionId) {
  return postJson(`/admin/maintenance/${actionId}`, undefined, {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminActivity() {
  return getJson("/admin/activity", {
    headers: getAuthHeaders(),
  });
}

export function fetchAdminMessages() {
  return getJson("/admin/messages", {
    headers: getAuthHeaders(),
  });
}

export function replyAdminMessage(ticketId, body) {
  return postJson(
    `/admin/messages/${ticketId}/reply`,
    { body },
    {
      headers: getAuthHeaders(),
    },
  );
}
