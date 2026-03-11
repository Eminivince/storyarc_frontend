const pendingVerificationKey = "storyarc.auth.pending-verification";
const pendingPasswordResetKey = "storyarc.auth.pending-password-reset";

function getSessionStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

function readJson(key) {
  const storage = getSessionStorage();

  if (!storage) {
    return null;
  }

  const value = storage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    storage.removeItem(key);
    return null;
  }
}

function writeJson(key, value) {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  storage.setItem(key, JSON.stringify(value));
}

function removeItem(key) {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(key);
}

export function getPendingVerification() {
  return readJson(pendingVerificationKey);
}

export function persistPendingVerification(value) {
  writeJson(pendingVerificationKey, value);
}

export function clearPendingVerification() {
  removeItem(pendingVerificationKey);
}

export function getPendingPasswordReset() {
  return readJson(pendingPasswordResetKey);
}

export function persistPendingPasswordReset(value) {
  writeJson(pendingPasswordResetKey, value);
}

export function clearPendingPasswordReset() {
  removeItem(pendingPasswordResetKey);
}
