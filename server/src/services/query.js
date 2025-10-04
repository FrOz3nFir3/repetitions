const DEFAULT_PAGE_LIMIT = 9;

export function getPagination(query) {
  const page = Math.abs(Number(query.page || 1));
  const limit = DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;
  return { skip, limit };
}
