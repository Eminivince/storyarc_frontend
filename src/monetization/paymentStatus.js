import { buildChapterHref } from "../data/readerFlow";

export function parseLockedChapterTarget(path) {
  if (!path) {
    return null;
  }

  const normalizedPath = path.startsWith("http")
    ? new URL(path).pathname
    : path;
  const match = normalizedPath.match(/^\/read\/([^/]+)\/([^/]+)\/locked\/?$/);

  if (!match) {
    return null;
  }

  const storySlug = decodeURIComponent(match[1]);
  const chapterSlug = decodeURIComponent(match[2]);

  return {
    chapterHref: buildChapterHref(storySlug, chapterSlug),
    chapterSlug,
    storySlug,
  };
}

export function getResumeReadingLabel(resumeTo, returnTo) {
  if (resumeTo && resumeTo !== returnTo) {
    return "Resume Unlocked Chapter";
  }

  return "Resume Reading";
}
