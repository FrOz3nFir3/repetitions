// Environment configuration - load first
import env from "./config/env.js";

// Core imports - load upfront for better response times
import express from "express";
import path from "node:path";
import compression from "compression";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/api.router.js";
import helmet from "helmet";
import cors from "cors";
import { globalApiLimiter } from "./middleware/rateLimiter.middleware.js";
import { attachTokenIfAuthenticated } from "./middleware/auth.middleware.js";

const app = express();
const __dirname = import.meta.dirname;
const cookieSecret = env.COOKIE_SECRET;
// Basic app configuration
const runningInProduction = env.NODE_ENV === "production";

// helmet js for fixing common vulnerabilities
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "https://accounts.google.com"],
        "frame-src": [
          "'self'",
          "https://accounts.google.com",
          "https://www.googleapis.com",
        ],
        "connect-src": [
          "'self'",
          "https://accounts.google.com",
          "https://www.googleapis.com",
        ],
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// HTTPS redirect first
if (env.ENABLE_PROXY) {
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    if (runningInProduction && req.secure == false) {
      res.redirect("https://" + req.headers.host + req.url);
    }
    next();
  });
}

// to save bandwidth if content not modified
app.use((req, res, next) => {
  // personal server need this caching to save transfer cost
  const url = req.url;
  const method = req.method;

  if (method !== "GET") return next();

  const isAuthenticatedRequest = url.startsWith('/api/user');
  if (isAuthenticatedRequest) {
    res.set('Cache-Control', "private, no-cache, must-revalidate");
  } else {
    res.set("Cache-Control", "no-cache, must-revalidate");
  }

  next();
});

// Compression for static files
app.use((req, res, next) => {
  // commented as personal server require all caching
  // if (req.path.startsWith("/api")) {
  //   return next();
  // }

  compression({
    level: 9,
    threshold: 1024, // Only compress files > 1KB
  })(req, res, next);
});

// Essential middleware
app.use(express.json({ limit: "10mb" })); // Add limit for security
app.use(express.static(path.join(__dirname, "..", "public")));

// Cookie parser for API routes
app.use("/api", cookieParser(cookieSecret));

// CORS configuration
const corsOptions = {
  origin: runningInProduction
    ? true
    : "http://localhost",
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use("/api", cors(corsOptions));

app.use(attachTokenIfAuthenticated);
app.use((req, res, next) => {
  const url = req.url;
  // we have individual authLimited for this routes
  if (
    url === "/api/user/login" ||
    url === "/api/user/register" ||
    url === "/api/user/google-login"
  ) {
    next();
    return;
  }

  globalApiLimiter(req, res, next);
});
app.use("/api", apiRouter);

// This middleware only runs if no other /api route was matched
app.use((req, res, next) => {
  if (!runningInProduction) {
    // this will only run in development mode
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  } else {
    res.status(404).json({ error: "API endpoint not found" });
  }
});

export default app;
