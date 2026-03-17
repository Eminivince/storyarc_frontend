import { appEnv } from "../config/env";
import {
  clearAuthTokens,
  getAccessToken,
  getStoredRefreshToken,
  persistAuthTokens,
} from "../auth/authStorage";

export const SESSION_EXPIRED_EVENT = "talestead:session-expired";

function isAbsoluteUrl(value) {
  return /^https?:\/\//i.test(value);
}

function normalizePath(path) {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

async function parseResponseBody(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();

  return text || null;
}

export class ApiError extends Error {
  constructor(
    message,
    { payload = null, retryAfterSeconds = null, status = 500, url = "" } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.payload = payload;
    this.retryAfterSeconds =
      typeof retryAfterSeconds === "number" ? retryAfterSeconds : null;
    this.status = status;
    this.url = url;
  }
}

export function buildApiUrl(path) {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  const normalizedPath = normalizePath(path);

  if (!isAbsoluteUrl(appEnv.apiBaseUrl)) {
    if (normalizedPath.startsWith(`${appEnv.apiBaseUrl}/`)) {
      return normalizedPath;
    }

    return appEnv.apiBaseUrl === "/"
      ? normalizedPath
      : `${appEnv.apiBaseUrl}${normalizedPath}`;
  }

  return new URL(normalizedPath.replace(/^\//, ""), `${appEnv.apiBaseUrl}/`).toString();
}

let refreshPromise = null;

async function tryRefreshTokens() {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    return null;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  const url = buildApiUrl("/auth/refresh");
  refreshPromise = (async () => {
    try {
      const response = await fetch(url, {
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = await parseResponseBody(response);

      if (!response.ok || !payload?.tokens) {
        return null;
      }

      persistAuthTokens(payload.tokens);
      return payload.tokens;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function isAuthEndpoint(path) {
  const url = buildApiUrl(path);
  return url.includes("/auth/refresh") || url.includes("/auth/login");
}

function parseRetryAfterSeconds(value) {
  if (!value) {
    return null;
  }

  const numeric = Number(value);

  if (Number.isFinite(numeric) && numeric >= 0) {
    return Math.ceil(numeric);
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const diffSeconds = Math.ceil((parsedDate.getTime() - Date.now()) / 1000);

  return Math.max(diffSeconds, 0);
}

const QUEUEABLE_PATTERNS = [
  { method: "PUT", pattern: "/reader/progress" },
  { method: "POST", pattern: "/engagement/reading-time" },
  { method: "POST", pattern: "/engagement/check-in" },
  { method: "POST", pattern: "/reader/bookmarks" },
  { method: "DELETE", pattern: "/reader/bookmarks/" },
];

function isQueueableOfflineMutation(url, method) {
  return QUEUEABLE_PATTERNS.some(
    (entry) => entry.method === method && url.includes(entry.pattern),
  );
}

export async function requestJson(path, init = {}, isRetry = false) {
  const {
    body,
    credentials = "include",
    headers,
    signal,
    timeoutMs = appEnv.apiTimeoutMs,
    ...rest
  } = init;
  const controller = new AbortController();
  const url = buildApiUrl(path);
  const requestHeaders = new Headers(headers ?? {});
  const shouldSerializeBody = isPlainObject(body);
  const requestBody = shouldSerializeBody ? JSON.stringify(body) : body;

  if (shouldSerializeBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  const abortRequest = () => controller.abort();

  if (signal) {
    if (signal.aborted) {
      abortRequest();
    } else {
      signal.addEventListener("abort", abortRequest, { once: true });
    }
  }

  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...rest,
      body: requestBody,
      credentials,
      headers: requestHeaders,
      signal: controller.signal,
    });
    const payload = await parseResponseBody(response);
    const retryAfterSeconds = parseRetryAfterSeconds(
      response.headers.get("retry-after"),
    );

    if (response.status === 429) {
      const message = retryAfterSeconds
        ? `Too many attempts. Please wait ${retryAfterSeconds} seconds.`
        : "Too many attempts. Please wait a moment.";
      throw new ApiError(message, {
        payload,
        retryAfterSeconds,
        status: response.status,
        url,
      });
    }

    if (response.status === 401 && !isRetry && !isAuthEndpoint(path)) {
      const hadAuth = requestHeaders.has("Authorization");
      if (hadAuth) {
        const tokens = await tryRefreshTokens();
        if (tokens) {
          const newToken = tokens.accessToken ?? getAccessToken();
          if (newToken) {
            requestHeaders.set("Authorization", `Bearer ${newToken}`);
            return requestJson(path, { ...init, headers: requestHeaders }, true);
          }
        }
        clearAuthTokens();
        globalThis.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
      }
    }

    if (!response.ok) {
      throw new ApiError(
        payload?.message || payload?.error || `Request failed with status ${response.status}.`,
        {
          payload,
          status: response.status,
          url,
        },
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === "AbortError") {
      throw new ApiError("Request timed out.", {
        status: 408,
        url,
      });
    }

    const method = (rest.method || "GET").toUpperCase();

    if (method !== "GET" && isQueueableOfflineMutation(url, method)) {
      try {
        const { enqueueMutation } = await import("./offlineQueue");
        await enqueueMutation({ url, method, body: requestBody });
        return { queued: true, _offline: true };
      } catch {
        // Fall through to original error if queueing fails
      }
    }

    throw new ApiError(error.message || "Unexpected network error.", {
      status: 500,
      url,
    });
  } finally {
    globalThis.clearTimeout(timeoutId);

    if (signal) {
      signal.removeEventListener("abort", abortRequest);
    }
  }
}

export function getJson(path, init = {}) {
  return requestJson(path, {
    ...init,
    method: "GET",
  });
}

export function postJson(path, body, init = {}) {
  return requestJson(path, {
    ...init,
    body,
    method: "POST",
  });
}
