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

export function fetchMonetizationCatalog() {
  return getJson("/monetization/catalog", {
    headers: getAuthHeaders(),
  });
}

export function fetchMonetizationStatus() {
  return getJson("/monetization/status", {
    headers: getAuthHeaders(),
  });
}

export function fetchMonetizationPurchases() {
  return getJson("/monetization/purchases", {
    headers: getAuthHeaders(),
  });
}

export function fetchChapterBatchUnlockOptionsApi(storySlug, chapterSlug) {
  return getJson(
    `/monetization/chapters/${storySlug}/${chapterSlug}/batch-options`,
    {
      headers: getAuthHeaders(),
    },
  );
}

export function createMonetizationCheckoutSession(input) {
  return postJson("/monetization/checkout-session", input, {
    headers: getAuthHeaders(),
  });
}

export function confirmMonetizationCheckoutSession(input) {
  return postJson("/monetization/checkout-session/confirm", input, {
    headers: getAuthHeaders(),
  });
}

export function unlockChapterWithCoinsApi({ chapterSlug, storySlug, ...body }) {
  return postJson(
    `/monetization/chapters/${storySlug}/${chapterSlug}/unlock-with-coins`,
    body,
    {
      headers: getAuthHeaders(),
    },
  );
}

export function unlockChapterBatchWithCoinsApi({
  chapterSlug,
  storySlug,
  ...body
}) {
  return postJson(
    `/monetization/chapters/${storySlug}/${chapterSlug}/unlock-batch`,
    body,
    {
      headers: getAuthHeaders(),
    },
  );
}

export function sendGiftApi(input) {
  return postJson("/monetization/gifts", input, {
    headers: getAuthHeaders(),
  });
}
