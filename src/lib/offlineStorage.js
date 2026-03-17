const DB_NAME = "talestead-offline-reading";
const DB_VERSION = 1;
const STORIES_STORE = "stories";
const CHAPTERS_STORE = "chapters";

function openDb() {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(STORIES_STORE)) {
          db.createObjectStore(STORIES_STORE, { keyPath: "storySlug" });
        }

        if (!db.objectStoreNames.contains(CHAPTERS_STORE)) {
          const chaptersStore = db.createObjectStore(CHAPTERS_STORE, {
            keyPath: ["storySlug", "chapterSlug"],
          });
          chaptersStore.createIndex("byStory", "storySlug", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch {
      reject(new Error("IndexedDB not available"));
    }
  });
}

export async function saveChapterOffline(storySlug, chapterSlug, chapterData, storyMeta) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORIES_STORE, CHAPTERS_STORE], "readwrite");

    // Upsert story metadata
    const storyStore = tx.objectStore(STORIES_STORE);
    const getRequest = storyStore.get(storySlug);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      const chapterSlugs = existing?.chapterSlugs || [];

      if (!chapterSlugs.includes(chapterSlug)) {
        chapterSlugs.push(chapterSlug);
      }

      storyStore.put({
        storySlug,
        title: storyMeta?.title || existing?.title || storySlug,
        coverUrl: storyMeta?.coverUrl || existing?.coverUrl || "",
        authorName: storyMeta?.authorName || existing?.authorName || "",
        downloadedAt: existing?.downloadedAt || Date.now(),
        chapterSlugs,
      });
    };

    // Store chapter data
    const chapterStore = tx.objectStore(CHAPTERS_STORE);
    chapterStore.put({
      storySlug,
      chapterSlug,
      chapterNumber: chapterData.chapterNumber || 0,
      title: chapterData.chapterTitle || chapterSlug,
      content: chapterData,
      downloadedAt: Date.now(),
    });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineChapter(storySlug, chapterSlug) {
  try {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(CHAPTERS_STORE, "readonly");
      const store = tx.objectStore(CHAPTERS_STORE);
      const request = store.get([storySlug, chapterSlug]);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.content || null);
      };

      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

export async function getOfflineStories() {
  try {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORIES_STORE, "readonly");
      const store = tx.objectStore(STORIES_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

export async function getOfflineChaptersForStory(storySlug) {
  try {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(CHAPTERS_STORE, "readonly");
      const store = tx.objectStore(CHAPTERS_STORE);
      const index = store.index("byStory");
      const request = index.getAll(storySlug);

      request.onsuccess = () =>
        resolve((request.result || []).map((entry) => entry.chapterSlug));
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

export async function isChapterAvailableOffline(storySlug, chapterSlug) {
  try {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(CHAPTERS_STORE, "readonly");
      const store = tx.objectStore(CHAPTERS_STORE);
      const request = store.get([storySlug, chapterSlug]);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return false;
  }
}

export async function removeOfflineStory(storySlug) {
  try {
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORIES_STORE, CHAPTERS_STORE], "readwrite");

      // Remove story entry
      tx.objectStore(STORIES_STORE).delete(storySlug);

      // Remove all chapters for this story
      const chapterStore = tx.objectStore(CHAPTERS_STORE);
      const index = chapterStore.index("byStory");
      const cursorRequest = index.openCursor(storySlug);

      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Silently fail
  }
}

export async function getOfflineStorageEstimate() {
  try {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
      };
    }
  } catch {
    // Unsupported
  }

  return { usage: 0, quota: 0 };
}
