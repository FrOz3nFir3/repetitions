import rateLimit from "express-rate-limit";

const getClientIp = (req) => {
  // 'x-vercel-forwarded-for' is a trusted header provided by Vercel.
  // It contains the real client IP and cannot be spoofed.
  const ip =
    req.headers["x-vercel-forwarded-for"] ?? req.headers["x-forwarded-for"];

  // Fallback to req.ip for local development and other environments.
  // req.ip is determined by Express's 'trust proxy' setting.
  return ip || req.ip;
};

// Rate limiter for sensitive authentication actions like login and registration
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: getClientIp,
  message: {
    error: "Too many requests from this IP, please try again after 10 minutes",
  },
});

// A more general rate limiter for other authenticated API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 350, // Limit each IP to 350 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
});

export const accessLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 mins
  max: 700, // Limit each IP to 700 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: getClientIp,
  message: {
    error:
      "Too many requests from this IP, please try again after half an hour",
  },
});
