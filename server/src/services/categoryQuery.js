const DEFAULT_CATEGORIES_PAGE_LIMIT = 12;

export function getCategoriesPagination(query) {
  const page = Math.abs(Number(query.page || 1));
  const limit = DEFAULT_CATEGORIES_PAGE_LIMIT;
  const skip = (page - 1) * limit;
  return { skip, limit };
}
