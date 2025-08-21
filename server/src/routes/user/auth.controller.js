import jwt from "jsonwebtoken";
import crypto from "crypto";
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

// CSRF Token Functions (Optimized for size + security)
export function createCSRFToken() {
  // Generate 32 bytes of cryptographically secure random data
  const randomToken = crypto.randomBytes(32).toString("hex");

  // Sign with HMAC using existing secret
  const signature = crypto
    .createHmac("sha256", ACCESS_TOKEN_SECRET)
    .update(randomToken)
    .digest("hex");

  // Return compact format: token.signature (128 chars total)
  return `${randomToken}.${signature}`;
}

export function verifyCSRFToken(signedToken) {
  try {
    if (!signedToken || typeof signedToken !== "string") {
      return false;
    }

    const parts = signedToken.split(".");
    if (parts.length !== 2) {
      return false;
    }

    const [token, signature] = parts;

    // Validate token and signature format
    if (!token || !signature) {
      return false;
    }

    // Recreate signature
    const expectedSignature = crypto
      .createHmac("sha256", ACCESS_TOKEN_SECRET)
      .update(token)
      .digest("hex");

    // Ensure both signatures are the same length before comparison
    if (signature.length !== expectedSignature.length) {
      return false;
    }

    // Convert to buffers with error handling
    let receivedBuffer, expectedBuffer;
    try {
      receivedBuffer = Buffer.from(signature, "hex");
      expectedBuffer = Buffer.from(expectedSignature, "hex");
    } catch (bufferError) {
      // Invalid hex string
      return false;
    }

    // Final length check (extra safety)
    if (receivedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    // Timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch (error) {
    return false;
  }
}

export function setTokens(res, user) {
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);
  const csrfToken = createCSRFToken(); // Generate CSRF token

  const isProduction = process.env.NODE_ENV === "production";

  // TODO: make samesite back to lax after domain is same
  res.cookie("jwt_access", accessToken, {
    httpOnly: true,
    signed: true,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api",
  });

  res.cookie("jwt_refresh", refreshToken, {
    httpOnly: true,
    signed: true,
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/user",
  });

  res.cookie("session-status", "active", {
    httpOnly: false,
    signed: false,
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  // Set CSRF token as HttpOnly session cookie (expires when browser closes)
  res.cookie("csrf_token", csrfToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api",
  });

  return csrfToken;
}
