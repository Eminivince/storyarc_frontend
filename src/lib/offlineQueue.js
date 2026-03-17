import { getAccessToken } from "../auth/authStorage";
import { requestJson } from "./apiClient";

const DB_NAME = "talestead-offline-mutations";
const STORE_NAME = "pending-mutations";
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch {
      reject(new Error("IndexedDB not available"));
    }
  });
}

export async function enqueueMutation({ url, method, body }) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.add({ url, method, body, timestamp: Date.now() });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function replayQueue() {
  let db;
  try {
    db = await openDb();
  } catch {
    return;
  }

  const entries = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  if (!entries.length) {
    return;
  }

  for (const entry of entries) {
    try {
      const headers = {};
      const token = getAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      await requestJson(entry.url, {
        method: entry.method,
        body: entry.body,
        headers,
      });

      await removeEntry(db, entry.id);
    } catch {
      // Stop replaying on failure — remaining entries stay queued
      break;
    }
  }
}

function removeEntry(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getQueueSize() {
  try {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return 0;
  }
}

export async function clearQueue() {
  try {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      store.clear();

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Silently fail if IndexedDB unavailable
  }
}

// Auto-replay when coming back online
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    replayQueue();
  });
}
