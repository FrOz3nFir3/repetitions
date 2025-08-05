import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRY_HOURS = 2;
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

// JWT `expiresIn` as a string (e.g., "2h", "30d")
const ACCESS_TOKEN_EXPIRY_JWT = `${ACCESS_TOKEN_EXPIRY_HOURS}h`;
const REFRESH_TOKEN_EXPIRY_JWT = `${REFRESH_TOKEN_EXPIRY_DAYS}d`;

// Cookie `maxAge` in milliseconds
export const ACCESS_TOKEN_MAX_AGE_MS =
  ACCESS_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE_MS =
  REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export function createAccessToken(id) {
  return jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY_JWT,
  });
}

export function createRefreshToken(id) {
  return jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY_JWT,
  });
}

export function verifyRefreshToken(token = "") {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (e) {
    return null;
  }
}

export function setTokens(res, user) {
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt_access", accessToken, {
    httpOnly: true,
    signed: true,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    secure: isProduction,
    sameSite: "lax",
    path: "/api",
  });

  res.cookie("jwt_refresh", refreshToken, {
    httpOnly: true,
    signed: true,
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/user",
  });
}
