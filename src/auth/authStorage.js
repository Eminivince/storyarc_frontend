const REFRESH_TOKEN_STORAGE_KEY = "talestead.auth.refresh-token";

let accessToken = null;

function getLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function getStoredRefreshToken() {
  return getLocalStorage()?.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? null;
}

export function hasStoredRefreshToken() {
  return Boolean(getStoredRefreshToken());
}

export function persistAuthTokens(tokens) {
  setAccessToken(tokens?.accessToken ?? null);

  const storage = getLocalStorage();

  if (!storage) {
    return;
  }

  if (tokens?.refreshToken) {
    storage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
    return;
  }

  storage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function clearAuthTokens() {
  setAccessToken(null);
  getLocalStorage()?.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}
