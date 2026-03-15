/**
 * Form input sanitization utilities for auth and other forms.
 */

const DISPLAY_NAME_MAX_LENGTH = 64;

/**
 * Sanitize display name: trim, collapse multiple spaces, limit length.
 */
export function sanitizeDisplayName(value) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, DISPLAY_NAME_MAX_LENGTH);
}

/**
 * Sanitize email: trim and lowercase.
 */
export function sanitizeEmail(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

/**
 * Sanitize password: remove all whitespace (spaces, tabs, newlines).
 * Passwords should not contain spaces.
 */
export function sanitizePassword(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\s/g, "");
}

/**
 * Check if password contains invalid characters (e.g. spaces).
 */
export function isPasswordValid(value) {
  if (typeof value !== "string") return false;
  return !/\s/.test(value);
}
