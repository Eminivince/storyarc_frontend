import { appEnv } from "../config/env";

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
  constructor(message, { payload = null, status = 500, url = "" } = {}) {
    super(message);
    this.name = "ApiError";
    this.payload = payload;
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

export async function requestJson(path, init = {}) {
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
