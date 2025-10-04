import {
  httpPostAuthDetails,
  httpCreateNewUser,
  httpLoginUser,
  httpLoginGoogleUser,
  httpLogoutUser,
  httpUpdateUser,
  httpGetDetailedReport,
  httpGetUserProgressPaginated,
  httpGetUserStats,
  httpGetQuizProgress,
  httpGetCardReviewProgress,
  httpUpdateUserReviewProgress,
  httpRefreshToken,
  httpGetCSRFToken,
  httpUpdateWeakCards,
  httpGetFocusReviewData,
  httpUpdateUserQuizProgress,
  httpGetFocusQuizData,
  httpUpdateUserStrugglingQuiz,
} from "./user.controller.js";
import {
  requireAuthentication,
  requireAuthenticationWithCSRF,
} from "../../middleware/auth.middleware.js";
import { authLimiter } from "../../middleware/rateLimiter.middleware.js";
import { createCacheMiddleware } from "../../middleware/cache.middleware.js";
import { createInvalidationMiddleware } from "../../middleware/cacheInvalidation.middleware.js";

import { Router } from "express";
const userRouter = Router();

// Apply the API limiter to the authenticated user details endpoint
// /authed provides CSRF token, so only requires authentication (not CSRF)
userRouter.post("/authed", requireAuthentication, httpPostAuthDetails);

// Apply cache middleware to GET endpoints for user data, progress, and stats
userRouter.get(
  "/progress",
  requireAuthenticationWithCSRF,
  createCacheMiddleware.progress(),
  httpGetUserProgressPaginated
);

userRouter.get("/stats",
  requireAuthenticationWithCSRF,
  createCacheMiddleware.users(),
  httpGetUserStats);

userRouter.get(
  "/quiz-progress",
  requireAuthenticationWithCSRF,
  createCacheMiddleware.progress(),
  httpGetQuizProgress
);

userRouter.get(
  "/review-progress/:card_id",
  requireAuthenticationWithCSRF,
  createCacheMiddleware.progress(),
  httpGetCardReviewProgress
);

userRouter.get(
  "/report/:card_id",
  requireAuthenticationWithCSRF,
  createCacheMiddleware.progress(),
  httpGetDetailedReport
);

// Apply the stricter auth limiter to registration and login routes
userRouter.post("/register", authLimiter, httpCreateNewUser);
userRouter.post("/login", authLimiter, httpLoginUser);
userRouter.post("/google-login", authLimiter, httpLoginGoogleUser);

userRouter.post(
  "/logout",
  authLimiter,
  requireAuthenticationWithCSRF,
  httpLogoutUser
);
userRouter.post("/refresh", httpRefreshToken);

// Dedicated CSRF token endpoint for lightweight token refresh
userRouter.post("/csrf-refresh", requireAuthentication, httpGetCSRFToken);

// Apply invalidation middleware to user update operations
userRouter.patch("/",
  requireAuthenticationWithCSRF,
  createInvalidationMiddleware.users(),
  httpUpdateUser);

userRouter.patch(
  "/quiz-progress",
  requireAuthenticationWithCSRF,
  createInvalidationMiddleware.progress(),
  httpUpdateUserQuizProgress
);
userRouter.patch(
  "/review-progress",
  requireAuthenticationWithCSRF,
  createInvalidationMiddleware.progress(),
  httpUpdateUserReviewProgress
);

userRouter.patch(
  "/weak-cards",
  requireAuthenticationWithCSRF,
  createInvalidationMiddleware.progress(),
  httpUpdateWeakCards
);

// Apply cache middleware to focus review/quiz GET endpoints
userRouter.get(
  "/focus-review/:card_id",
  requireAuthenticationWithCSRF,
  createCacheMiddleware.progress(),
  httpGetFocusReviewData
);

userRouter.patch(
  "/struggling-quiz",
  requireAuthenticationWithCSRF,
  createInvalidationMiddleware.progress(),
  httpUpdateUserStrugglingQuiz
);

userRouter.get(
  "/focus-quiz/:card_id",
  requireAuthenticationWithCSRF,
  createCacheMiddleware.progress(),
  httpGetFocusQuizData
);

export default userRouter;
