import { useEffect } from "react";

const SITE_NAME = "StoryArc";
const DEFAULT_DESCRIPTION =
  "Read, write, and share serialized stories on StoryArc.";
const DEFAULT_IMAGE = "/favicon.svg";

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function createSeoDescription(value, maxLength = 180) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return "";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(maxLength - 1, 0)).trimEnd()}…`;
}

function buildTitle(title) {
  const normalized = normalizeText(title);

  if (!normalized) {
    return SITE_NAME;
  }

  if (normalized === SITE_NAME || normalized.endsWith(`| ${SITE_NAME}`)) {
    return normalized;
  }

  return `${normalized} | ${SITE_NAME}`;
}

function resolveAbsoluteUrl(value) {
  if (typeof window === "undefined") {
    return value ?? "";
  }

  const fallbackPath = `${window.location.pathname}${window.location.search}`;
  const candidate = value || fallbackPath || "/";

  try {
    return new URL(candidate, window.location.origin).toString();
  } catch {
    return window.location.origin;
  }
}

function setMetaTag(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`;
  const existing = document.head.querySelector(selector);

  if (!content) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement("meta");
  element.setAttribute(attribute, key);
  element.setAttribute("content", content);

  if (!existing) {
    document.head.appendChild(element);
  }
}

function setLinkTag(rel, href) {
  const existing = document.head.querySelector(`link[rel="${rel}"]`);

  if (!href) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement("link");
  element.setAttribute("rel", rel);
  element.setAttribute("href", href);

  if (!existing) {
    document.head.appendChild(element);
  }
}

function applySeoMetadata({
  author,
  description,
  image,
  imageAlt,
  robots,
  title,
  type,
  url,
}) {
  const pageTitle = buildTitle(title);
  const pageDescription = createSeoDescription(description || DEFAULT_DESCRIPTION);
  const pageType = type || "website";
  const pageUrl = resolveAbsoluteUrl(url);
  const pageImage = resolveAbsoluteUrl(image || DEFAULT_IMAGE);
  const pageImageAlt = normalizeText(imageAlt || title || SITE_NAME);
  const twitterCard = image ? "summary_large_image" : "summary";

  document.title = pageTitle;

  setMetaTag("name", "description", pageDescription);
  setMetaTag("name", "robots", robots || "index,follow");
  setMetaTag("name", "author", normalizeText(author));
  setMetaTag("name", "twitter:card", twitterCard);
  setMetaTag("name", "twitter:title", pageTitle);
  setMetaTag("name", "twitter:description", pageDescription);
  setMetaTag("name", "twitter:image", pageImage);
  setMetaTag("name", "twitter:image:alt", pageImageAlt);
  setMetaTag("property", "og:site_name", SITE_NAME);
  setMetaTag("property", "og:title", pageTitle);
  setMetaTag("property", "og:description", pageDescription);
  setMetaTag("property", "og:type", pageType);
  setMetaTag("property", "og:url", pageUrl);
  setMetaTag("property", "og:image", pageImage);
  setMetaTag("property", "og:image:alt", pageImageAlt);
  setMetaTag(
    "property",
    "article:author",
    pageType === "article" ? normalizeText(author) : "",
  );
  setMetaTag(
    "property",
    "book:author",
    pageType === "book" ? normalizeText(author) : "",
  );
  setLinkTag("canonical", pageUrl);
}

export default function SeoMetadata(props) {
  useEffect(() => {
    applySeoMetadata(props);

    return () => {
      applySeoMetadata({});
    };
  }, [
    props.author,
    props.description,
    props.image,
    props.imageAlt,
    props.robots,
    props.title,
    props.type,
    props.url,
  ]);

  return null;
}
