import rateLimit, { MemoryStore } from "express-rate-limit";
import { LRUCache } from "lru-cache";
import { redis, redisConnect } from "../services/redis.js";
import { RedisStore } from "rate-limit-redis";

try {
  await redisConnect();
} catch {

}
console.log(
  !redis.isReady
    ? `Redis not connected using Memory Store with lru cache for rate limiter`
    : `Redis connected to rate limiter`
);

const getClientIp = (req) => {
  const ip =
    req.headers["x-vercel-forwarded-for"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  return ip || req.ip;
};

const ttl = 12 * 60 * 60 * 1000; // 12 hours;
const GLOBAL_ABUSE_THRESHOLD = 1000; // How many times an IP can get rate-limited before a long-term block.
const AUTH_ABUSE_THRESHOLD = 10;

// --- A Memory-Safe Store for Abusive IPs ---
// This cache will automatically evict the least recently used IPs
// if it reaches its size limit, preventing a memory leak.
// It will also automatically evict entries after their TTL (Time To Live).
const abuseTracker = new LRUCache({
  max: 100000, // A single, larger cache for all abuse tracking.
  // The TTL here is for how long a "strike" is remembered.
  ttl, // Strikes are forgotten after 12 hour.
});

// Rate limiter for sensitive authentication actions like login and registration
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: async (req, res) => {
    const key = getClientIp(req);

    const strikes = redis.isReady
      ? Number(await redis.get(key))
      : abuseTracker.get(key) || 0;
    // If this user/IP has reached the abuse threshold, block them.
    if (strikes >= AUTH_ABUSE_THRESHOLD) {
      return -1; // The "Penalty Box" logic.
    }

    return 10; // Limit each IP to 10 requests per windowMs
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: async (req, res, next, options) => {
    const key = options.keyGenerator(req);
    // Increment the strike count for this user/IP.
    const strikeCount =
      (redis.isReady
        ? Number(await redis.get(key))
        : abuseTracker.get(key) || 0) + 1;

    if (redis.isReady) {
      await redis.set(key, strikeCount.toString(), { EX: ttl }); // The cache's TTL will handle eviction.
    } else {
      abuseTracker.set(key, strikeCount);
    }

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
  store: redis.isReady
    ? new RedisStore({
      sendCommand: (...args) => {
        // edge case left to handle later 
        if (!redis.isReady) return [];
        try {
          return redis.sendCommand(args)
        } catch (e) {
          // fail silently? 
        }
      },
    })
    : new MemoryStore(),
});

// A more general rate limiter authenticated API endpoints
export const globalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1-minute window
  max: async (req, res) => {
    const key = req.token ? req.token.id : getClientIp(req);
    const whiteListIp = process.env.WHITELIST_IP?.split(",") || [];
    if (whiteListIp.includes(key)) {
      return Number.MAX_SAFE_INTEGER;
    }

    const strikes = redis.isReady
      ? Number(await redis.get(key))
      : abuseTracker.get(key) || 0;
    // If this user/IP has reached the abuse threshold, block them.
    if (strikes >= GLOBAL_ABUSE_THRESHOLD) {
      return -1; // The "Penalty Box" logic.
    }

    return req.token ? 400 : 250; // Standard limits for everyone else.
  },
  keyGenerator: (req, res) => {
    return req.token ? req.token.id : getClientIp(req);
  },
  handler: async (req, res, next, options) => {
    const key = options.keyGenerator(req);

    // Increment the strike count for this user/IP.
    const strikeCount =
      (redis.isReady
        ? Number(await redis.get(key))
        : abuseTracker.get(key) || 0) + 1;

    if (redis.isReady) {
      await redis.set(key, strikeCount.toString(), { EX: ttl }); // The cache's TTL will handle eviction.
    } else {
      abuseTracker.set(key, strikeCount);
    }

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
  store: redis.isReady
    ? new RedisStore({
      sendCommand: (...args) => {
        // edge case left to handle later 
        if (!redis.isReady) return [];
        try {
          return redis.sendCommand(args)
        } catch (e) {
          // fail silently? 
        }
      },
    })
    : new MemoryStore(),
});
