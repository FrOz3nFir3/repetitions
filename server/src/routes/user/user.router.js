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
import {
  authLimiter,
  apiLimiter,
} from "../../middleware/rateLimiter.middleware.js";

import { Router } from "express";
const userRouter = Router();

// Apply the API limiter to the authenticated user details endpoint
// /authed provides CSRF token, so only requires authentication (not CSRF)
userRouter.post(
  "/authed",
  apiLimiter,
  requireAuthentication,
  httpPostAuthDetails
);

userRouter.get(
  "/progress",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpGetUserProgressPaginated
);

userRouter.get(
  "/stats",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpGetUserStats
);

userRouter.get(
  "/quiz-progress",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpGetQuizProgress
);

userRouter.get(
  "/review-progress/:card_id",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpGetCardReviewProgress
);

userRouter.get(
  "/report/:card_id",
  apiLimiter,
  requireAuthenticationWithCSRF,
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
userRouter.post("/refresh", apiLimiter, httpRefreshToken);

// Dedicated CSRF token endpoint for lightweight token refresh
userRouter.post(
  "/csrf-refresh",
  apiLimiter,
  requireAuthentication,
  httpGetCSRFToken
);

userRouter.patch(
  "/",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpUpdateUser
);
userRouter.patch(
  "/quiz-progress",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpUpdateUserQuizProgress
);
userRouter.patch(
  "/review-progress",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpUpdateUserReviewProgress
);

userRouter.patch(
  "/weak-cards",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpUpdateWeakCards
);

userRouter.get(
  "/focus-review/:card_id",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpGetFocusReviewData
);

userRouter.patch(
  "/struggling-quiz",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpUpdateUserStrugglingQuiz
);

userRouter.get(
  "/focus-quiz/:card_id",
  apiLimiter,
  requireAuthenticationWithCSRF,
  httpGetFocusQuizData
);

export default userRouter;
