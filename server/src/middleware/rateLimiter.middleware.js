import rateLimit from "express-rate-limit";

// Rate limiter for sensitive authentication actions like login and registration
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: "Too many requests from this IP, please try again after 10 minutes",
  },
});

// A more general rate limiter for other authenticated API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
});

export const accessLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 mins
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Too many requests from this IP, please try again after half an hour",
  },
});
