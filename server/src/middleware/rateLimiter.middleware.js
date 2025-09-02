import rateLimit from "express-rate-limit";
import { LRUCache } from "lru-cache";

const getClientIp = (req) => {
  const ip =
    req.headers["x-vercel-forwarded-for"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  return ip || req.ip;
};

// --- A Memory-Safe Store for Abusive IPs ---
// This cache will automatically evict the least recently used IPs
// if it reaches its size limit, preventing a memory leak.
// It will also automatically evict entries after their TTL (Time To Live).
const abuseTracker = new LRUCache({
  max: 100000, // A single, larger cache for all abuse tracking.
  // The TTL here is for how long a "strike" is remembered.
  ttl: 12 * 60 * 60 * 1000, // Strikes are forgotten after 12 hour.
});
const GLOBAL_ABUSE_THRESHOLD = 200; // How many times an IP can get rate-limited before a long-term block.
const AUTH_ABUSE_THRESHOLD = 10;

// Rate limiter for sensitive authentication actions like login and registration
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    const key = options.keyGenerator(req);
    // Increment the strike count for this user/IP.
    const strikeCount = (abuseTracker.get(key) || 0) + 1;
    abuseTracker.set(key, strikeCount); // The cache's TTL will handle eviction.

    if (strikeCount >= AUTH_ABUSE_THRESHOLD) {
      // On the final strike, send a harsher message.
      return res.status(options.statusCode).json({
        error:
          "Access has been temporarily restricted due to excessive requests. Please try again later.",
      });
    }

    // Send the standard "soft" rate-limit message.
    res.status(options.statusCode).json({ error: options.message.error });
  },
  keyGenerator: getClientIp,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// A more general rate limiter authenticated API endpoints
export const globalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1-minute window
  max: (req, res) => {
    const key = req.token ? req.token.id : getClientIp(req);

    const strikes = abuseTracker.get(key) || 0;
    // If this user/IP has reached the abuse threshold, block them.
    if (strikes >= GLOBAL_ABUSE_THRESHOLD) {
      return 0; // The "Penalty Box" logic.
    }

    return req.token ? 300 : 200; // Standard limits for everyone else.
  },
  keyGenerator: (req, res) => {
    return req.token ? req.token.id : getClientIp(req);
  },
  handler: (req, res, next, options) => {
    const key = options.keyGenerator(req);

    // Increment the strike count for this user/IP.
    const strikeCount = (abuseTracker.get(key) || 0) + 1;
    abuseTracker.set(key, strikeCount); // The cache's TTL will handle eviction.

    if (strikeCount >= GLOBAL_ABUSE_THRESHOLD) {
      // On the final strike, send a harsher message.
      return res.status(options.statusCode).json({
        error:
          "Access has been temporarily restricted due to excessive requests. Please try again later.",
      });
    }

    // Send the standard "soft" rate-limit message.
    res.status(options.statusCode).json({ error: options.message.error });
  },
  message: {
    error: "You are making requests too quickly. Please slow down.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
