function normalizeWhitespace(text) {
  // Only normalize whitespace, preserve case:
  // 1. Trim leading/trailing spaces
  // 2. Replace multiple spaces with single space
  return text.trim().replace(/\s+/g, " ");
}

function normalizeTextForComparison(text) {
  // Normalize whitespace and case for comparison only:
  // 1. Trim leading/trailing spaces
  // 2. Replace multiple spaces with single space
  // 3. Convert to lowercase for comparison
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeCategory(category) {
  // Convert to title case: "programming" -> "Programming", "react hooks" -> "React Hooks"
  return category
    .trim()
    .replace(/\s+/g, " ") // Normalize whitespace first
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function escapeRegex(string) {
  // Escape special regex characters
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  normalizeWhitespace,
  normalizeTextForComparison,
  normalizeCategory,
  escapeRegex,
};
