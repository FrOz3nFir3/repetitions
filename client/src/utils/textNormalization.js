export function normalizeCategory(category) {
  // Convert to title case: "programming" -> "Programming", "react hooks" -> "React Hooks"
  return category
    .trim()
    .replace(/\s+/g, " ") // Normalize whitespace first
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
