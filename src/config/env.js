function normalizeRelativeBaseUrl(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue === "/") {
    return "/api";
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue.replace(/\/+$/, "");
  }

  const withLeadingSlash = trimmedValue.startsWith("/")
    ? trimmedValue
    : `/${trimmedValue}`;

  return withLeadingSlash.replace(/\/+$/, "");
}

function parseTimeout(value, fallback) {
  const parsedValue = Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

export const appEnv = Object.freeze({
  apiBaseUrl: normalizeRelativeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? "/api"),
  apiTimeoutMs: parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS, 40000),
  backendOrigin: (import.meta.env.VITE_BACKEND_ORIGIN ?? "http://localhost:4000")
    .trim()
    .replace(/\/+$/, ""),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
});

export const apiBaseUrlStrategy = Object.freeze({
  defaultBaseUrl: "/api",
  development:
    "Use the Vite dev proxy so the frontend always calls /api while requests are forwarded to VITE_BACKEND_ORIGIN.",
  production:
    "Prefer same-origin deployment with the backend mounted at /api. If that is not available, set VITE_API_BASE_URL to the deployed API root.",
});
