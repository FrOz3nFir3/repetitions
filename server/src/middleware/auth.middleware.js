import jwt from "jsonwebtoken";
import { verifyCSRFToken } from "../routes/user/auth.controller.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Pure authentication middleware - only validates JWT
export function requireAuthentication(req, res, next) {
  const token = req.signedCookies.jwt_access;

  if (!token) {
    return res.status(401).json({ error: "User not Logged In." });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Authentication token expired." });
      }
      return res.status(401).json({ error: "Invalid authentication token." });
    }

    req.token = decoded;
    next();
  });
}

// Combined auth + CSRF middleware for protected routes
export function requireAuthenticationWithCSRF(req, res, next) {
  const token = req.signedCookies.jwt_access;

  if (!token) {
    return res.status(401).json({ error: "User not Logged In." });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Authentication token expired." });
      }
      return res.status(401).json({ error: "Invalid authentication token." });
    }

    // CSRF validation for authenticated routes
    const cookieToken = req.cookies.csrf_token;
    const headerToken = req.headers["x-csrf-token"];

    // Both cookie and header must be present
    if (!cookieToken || !headerToken) {
      return res.status(403).json({
        error: "CSRF token missing - request will be automatically retried.",
      });
    }

    // Both tokens must match
    if (cookieToken !== headerToken) {
      return res.status(403).json({
        error: "CSRF token mismatch - request will be automatically retried.",
      });
    }

    // Verify token signature
    if (!verifyCSRFToken(cookieToken)) {
      return res.status(403).json({
        error: "Invalid CSRF token - request will be automatically retried.",
      });
    }

    req.token = decoded;
    next();
  });
}
