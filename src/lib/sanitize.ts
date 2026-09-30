import DOMPurify, { type Config } from "isomorphic-dompurify";

/**
 * Robust HTML sanitizer for user/CMS-authored rich text content.
 * Prevents Stored and DOM XSS across both client and SSR environments.
 *
 * Configured specifically for rich-text output from the Tiptap editor:
 * - Allows standard formatting tags (headings, paragraphs, lists, tables, links, images).
 * - Disallows script, iframe, object, embed, form, event handlers, javascript: and data: URIs.
 * - Forces safe rel attributes on external links.
 */

const SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "hr",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "blockquote",
    "code",
    "pre",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "span",
  ],
  ALLOWED_ATTR: [
    "href",
    "title",
    "target",
    "rel",
    "src",
    "alt",
    "width",
    "height",
    "loading",
    "class",
  ],
  ALLOWED_URI_REGEXP:
    /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  ADD_ATTR: ["target"],
  FORBID_TAGS: [
    "script",
    "iframe",
    "object",
    "embed",
    "base",
    "form",
    "svg",
    "math",
    "input",
    "button",
  ],
  FORBID_ATTR: [
    "style",
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onfocus",
    "onblur",
  ],
  RETURN_TRUSTED_TYPE: false,
};

/** Approved CMS semantic utility classes for rich-text color and highlight formatting. */
export const ALLOWED_CMS_CLASSES = new Set([
  "cms-color-emerald",
  "cms-color-electric",
  "cms-color-foreground",
  "cms-color-muted",
  "cms-highlight-emerald",
  "cms-highlight-electric",
]);

// Configure DOMPurify hook to ensure all target="_blank" links have rel="noopener noreferrer",
// and strictly enforce that only whitelisted CMS semantic classes survive on any element.
if (typeof DOMPurify.addHook === "function") {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }

    if (node.hasAttribute("class")) {
      const rawClasses = node.getAttribute("class") || "";
      const validClasses = rawClasses
        .split(/\s+/)
        .filter((cls) => ALLOWED_CMS_CLASSES.has(cls));

      if (validClasses.length > 0) {
        node.setAttribute("class", validClasses.join(" "));
      } else {
        node.removeAttribute("class");
      }
    }
  });
}


/**
 * Sanitizes an untrusted HTML string for safe rendering in the browser.
 * Returns empty string if input is nullish or empty.
 */
export function sanitizeHtml(dirtyHtml: string | null | undefined): string {
  if (!dirtyHtml || typeof dirtyHtml !== "string") {
    return "";
  }
  return String(DOMPurify.sanitize(dirtyHtml, SANITIZE_CONFIG));
}
