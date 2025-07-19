// implemented from https://web.dev/articles/fetch-metadata

function csrfProtectionMiddleware(req, res, next) {
  const secFetchSite = req.headers["sec-fetch-site"];
  const secFetchMode = req.headers["sec-fetch-mode"];
  const secFetchDest = req.headers["sec-fetch-dest"];

  if (!secFetchSite) {
    return next();
  }

  if (["same-origin", "same-site", "none"].includes(secFetchSite)) {
    return next();
  }

  if (
    secFetchMode === "navigate" &&
    req.method === "GET" &&
    !["object", "embed"].includes(secFetchDest)
  ) {
    return next();
  }

  console.warn(
    `CSRF_BLOCKED: A cross-site request to ${req.path} was blocked. Details:`,
    {
      method: req.method,
      secFetchSite,
      secFetchMode,
      secFetchDest,
      origin: req.headers["origin"],
    }
  );

  // 403 Forbidden is a more appropriate status code than 401 Unauthorized.
  return res.status(403).json({
    error: "Forbidden: Cross-site request blocked.",
  });
}

module.exports = {
  csrfProtectionMiddleware,
};
