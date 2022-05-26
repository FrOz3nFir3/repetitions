const { getToken } = require("../routes/user/auth.controller");

function requireAuthentication(req, res, next) {
  const jwt = req.signedCookies.jwt;

  const decodedToken = getToken(jwt);
  req.token = decodedToken;

  next();
}

module.exports = { requireAuthentication, getToken };
