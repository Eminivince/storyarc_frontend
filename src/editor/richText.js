const richTextTagPattern = /<\/?[a-z][\s\S]*>/i;

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function isRichTextHtml(value) {
  return richTextTagPattern.test(String(value ?? "").trim());
}

export function normalizeRichTextBody(value) {
  const text = String(value ?? "").trim();

  if (!text) {
    return "";
  }

  if (isRichTextHtml(text)) {
    return text;
  }

  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function getRichTextPlainText(value) {
  const normalized = normalizeRichTextBody(value);

  if (!normalized) {
    return "";
  }

  if (typeof document !== "undefined") {
    const container = document.createElement("div");
    container.innerHTML = normalized;
    return (container.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return normalized.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function getRichTextWordCount(value) {
  const plainText = getRichTextPlainText(value);

  return plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
}
