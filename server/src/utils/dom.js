const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

function getTextFromHTML(html) {
  if (!html) return "";
  const sanitizedHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    RETURN_DOM: true,
  });

  return sanitizedHtml.textContent;
}

function sanitizeHTML(html) {
  return DOMPurify.sanitize(html);
}

module.exports = {
  getTextFromHTML,
  sanitizeHTML,
  // other utility functions can be added here
};
