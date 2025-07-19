const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ONE_HOUR = 3600; // in seconds
const THIRTY_DAYS = "30d";

function createAccessToken(id) {
  return jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
    expiresIn: 60,
  });
}

function createRefreshToken(id) {
  return jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
    expiresIn: THIRTY_DAYS,
  });
}

function verifyRefreshToken(token = "") {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (e) {
    return null;
  }
}

function setTokens(res, user) {
  // TODO: Add CSRF protection
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt_access", accessToken, {
    httpOnly: true,
    signed: true,
    maxAge: ONE_HOUR * 1000, // 1 hour
    secure: isProduction,
    sameSite: "lax",
    path: "/api",
  });

  res.cookie("jwt_refresh", refreshToken, {
    httpOnly: true,
    signed: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: isProduction,
    sameSite: "lax",
    path: "/api/user/refresh",
  });
}

module.exports = {
  createAccessToken,
  setTokens,
  verifyRefreshToken,
};
