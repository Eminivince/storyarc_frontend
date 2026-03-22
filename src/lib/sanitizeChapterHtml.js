/**
 * Client-side HTML allowlist for published chapter blocks.
 * Keep in sync with `backend/src/utils/rich-text.ts` (sanitizeConfig).
 */
import sanitizeHtml from "sanitize-html";

const sanitizeConfig = {
  allowedAttributes: {
    a: ["href", "rel", "target"],
    code: ["class"],
    pre: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedTags: [
    "a",
    "blockquote",
    "br",
    "code",
    "del",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "li",
    "ol",
    "p",
    "pre",
    "s",
    "strike",
    "strong",
    "u",
    "ul",
  ],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer nofollow",
      target: "_blank",
    }),
    b: "strong",
    i: "em",
    strike: "s",
  },
};

export function sanitizeChapterParagraphHtml(value) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return "";
  }
  return sanitizeHtml(raw, sanitizeConfig).trim();
}

/** Plain text for meta descriptions (strips tags after sanitizing). */
export function chapterHtmlToPlainTextSnippet(html) {
  const safe = sanitizeChapterParagraphHtml(html);
  return safe.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
