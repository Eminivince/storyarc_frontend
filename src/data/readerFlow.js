export const readerLibraryHref = "/dashboard";

export function buildSearchHref(query = "Fantasy") {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  const search = params.toString();

  return search ? `/search?${search}` : "/search";
}

export function buildStoryHref(storySlug) {
  return storySlug ? `/stories/${storySlug}` : readerLibraryHref;
}

export function buildChapterHref(storySlug, chapterSlug) {
  if (storySlug && chapterSlug) {
    return `/read/${storySlug}/${chapterSlug}`;
  }

  return buildStoryHref(storySlug);
}

export function buildChapterCompleteHref(storySlug, chapterSlug) {
  if (storySlug && chapterSlug) {
    return `/read/${storySlug}/${chapterSlug}/complete`;
  }

  return buildChapterHref(storySlug, chapterSlug);
}

export function buildLockedChapterHref(storySlug, chapterSlug) {
  if (storySlug && chapterSlug) {
    return `/read/${storySlug}/${chapterSlug}/locked`;
  }

  return buildChapterHref(storySlug, chapterSlug);
}

export function buildReportChapterHref(storySlug, chapterSlug) {
  if (storySlug && chapterSlug) {
    return `/read/${storySlug}/${chapterSlug}/report`;
  }

  return buildChapterHref(storySlug, chapterSlug);
}

export const desktopLockedPreview = {
  storyTitle: "The Golden Weaver",
  chapterLabel: "Chapter 12",
  title: "The Loom of Fate",
  storyCoins: "420",
  unlockCost: "25 StoryCoins",
  unlockedToday: "1.2k readers unlocked this today",
  paragraphs: [
    "The silver threads hummed with a low, rhythmic vibration that resonated deep within Elara's chest. She had never seen the Great Loom so active, its golden shuttles dancing like fireflies in the dim twilight of the Sanctum. 'Stay back,' the Elder had warned, but the pull was magnetic, an ancient calling she couldn't ignore...",
    "As she reached out, the air grew thick with the scent of ozone and crushed jasmine. Her fingertips brushed the surface of the weave, and for a fleeting second, the entire universe seemed to hold its breath. Visions of a thousand timelines flickered across her mind, each more vibrant and terrifying than the last. She saw herself standing at the edge of the world, a crown of starlight upon her head...",
  ],
  blurredParagraphs: [
    "But the crown was not of gold. It was forged from the very essence of the void, pulsing with a dark energy that threatened to consume everything she held dear. Elara pulled her hand back, but it was too late. The threads had already begun to wrap around her wrist, binding her to a destiny she was not yet ready to face.",
    "The Elder's voice echoed through the chamber, frantic and distorted. 'The Great Weave has chosen its architect!' he cried, his silhouette flickering against the erupting brilliance of the loom. Elara felt the floor dissolve beneath her feet as the Sanctum began to warp.",
  ],
  avatars: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD98z2HWSfxoP0vL7RMkpX2efsMdbpP703BV1cd9XVWlCTmbOSQqzV9HKikQFp9UXSgz5Do51e3NKaTnCGFNMbzFATkRM4BgKGDHFtN0SgDrvZpXe5QjsekOA2uVwFa100ye90qvTiCCKH96OwJVJyR63xnwYV25NPMng4TA9m0gEkIINX8uoOwH156BZ5HFHCXVhiigTmjzRCTj_I_KMKtjqHSaPODv0LZNSrauU4U3cDLiO_C6nmctjT4a1JftRdhVGZaqPezKhU",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDnLzyFZfS572hoK1XrToemo3gS1JAiVYnFvGrsaYkB98DOY5ZTVhTzSUElZtxhx78incwTgfQjDrOfZ3xO7E4HtZ2kgHxiVkndQ_qLdSYp2HBliTWlq702T7NsTRRLnsPIxZNYbTL5lrIJyCwyfVwRiXRA1y9owblwJYst_psQ2Zr_RufTCW0167vocRZuVLvcvlxcGAx2CNv8uOetXTum71wo9K0h5UDEHEaZvmNQnZ4KtMUtWfrcfgyw_fBmn1XJDhCDWV8IoiU",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAHs-qmA3ZPx6CrVKtkghngAIMn18v2TI43JjXLwj9SA3_9Hr-6x2CpG6rJ0tbTvsGs-ljfald0SHZty6N0Ezs_vwJNxtCcDSX9k0xHOpYK877nUOBpsCVW55roc_TAlmusrHzPR6URqwARpVyEoN-YEyUw4FQqNKxNxR-shLQ-WNzgh-IE3DKKWodAVHZtNeES3qSRhNfi0wCanjgF978TUzn7qBvfY6-jM0svev9VZql6S6yfhK4u9cFzf3bfCLrk8D-CLkOGYVk",
  ],
};

export const mobileLockedPreview = {
  chapterTitle: "Chapter 42: The Golden Weaver",
  storyTitle: "The Eternal Threads",
  unlockTitle: "Unlock the Full Chapter",
  unlockCost: "50",
  balance: "1,240",
  paragraphs: [
    "The air was thick with the scent of ancient parchment and ozone. Elara reached out, her fingers trembling as they brushed the surface of the loom. It wasn't just wood; it was a living conduit of the cosmic energies that bound their world together.",
    "\"You shouldn't be here,\" a voice rasped from the shadows. Elara froze. She didn't need to turn around to know it was Master Kaelen. His presence always carried the faint hum of a thousand unfinished spells.",
  ],
  blurredParagraphs: [
    "\"I am only seeking the truth,\" Elara whispered, her gaze fixed on the glowing golden threads. The loom began to vibrate, a low-frequency thrum that vibrated in her very marrow.",
    "Kaelen stepped into the soft light. His eyes, once vibrant blue, were now milky orbs reflecting the shifting patterns of the fabric. \"The truth is a heavy burden, child. One that has crushed stronger souls than yours.\"",
    "Suddenly, the Weaver's Hand flashed. A spark of pure radiance arced from the center of the mechanism, illuminating the hidden runes carved into the walls.",
  ],
};

export const desktopReportReasons = [
  {
    title: "Inappropriate Content",
    description: "Explicit, offensive, or harmful material",
  },
  {
    title: "Plagiarism or Copyright",
    description: "Content copied from another source without permission",
  },
  {
    title: "Spacing / Formatting / Typos",
    description: "The reading experience is hindered by technical errors",
  },
  {
    title: "Other Issues",
    description: "Anything else not listed above",
  },
];

export const mobileReportReasons = [
  "Inappropriate Content",
  "Plagiarism or Copyright",
  "Spam or Misleading",
  "Harassment or Hate Speech",
];
