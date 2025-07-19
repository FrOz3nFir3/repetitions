const jwt = require("jsonwebtoken");
const { checkFetchSiteHeaders } = require("./csrf.middleware");
require("dotenv").config({ path: "../.env" });
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

function requireAuthentication(req, res, next) {
  checkFetchSiteHeaders(req, res);
  if (res.headersSent) {
    return;
  }

  const token = req.signedCookies.jwt_access;
  // cookie can also be deleted
  if (!token) {
    return res.status(401).json({ message: "Authentication token expired." });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Authentication token expired." });
      }
    }
    req.token = decoded;
    next();
  });
}

module.exports = { requireAuthentication };
