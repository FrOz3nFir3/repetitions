function checkFetchSiteHeaders(req, res, next) {
  const secFetchSite = req.headers["sec-fetch-site"];
  // to limit csrf attacks
  if (
    secFetchSite !== "same-origin" &&
    secFetchSite !== "same-site" &&
    secFetchSite !== "none"
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next?.();
}

module.exports = {
  checkFetchSiteHeaders,
};
