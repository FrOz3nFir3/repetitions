import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export function getTextFromHTML(html) {
  if (!html) return "";
  const sanitizedHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    RETURN_DOM: true,
  });

  return sanitizedHtml.textContent || sanitizedHtml.innerText || "";
}

export function sanitizeHTML(html) {
  return DOMPurify.sanitize(html);
}
