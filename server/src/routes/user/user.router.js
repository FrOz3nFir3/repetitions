import {
  httpPostAuthDetails,
  httpCreateNewUser,
  httpLoginUser,
  httpLoginGoogleUser,
  httpLogoutUser,
  httpUpdateUser,
  httpGetDetailedReport,
  httpGetUserProgress,
  httpGetCardReviewProgress,
  httpUpdateUserProgress,
  httpUpdateUserReviewProgress,
  httpRefreshToken,
} from "./user.controller.js";
import { requireAuthentication } from "../../middleware/auth.middleware.js";
import {
  authLimiter,
  apiLimiter,
} from "../../middleware/rateLimiter.middleware.js";

import { Router } from "express";
const userRouter = Router();

// Apply the API limiter to the authenticated user details endpoint
userRouter.post(
  "/authed",
  apiLimiter,
  requireAuthentication,
  httpPostAuthDetails
);

userRouter.get(
  "/progress",
  apiLimiter,
  requireAuthentication,
  httpGetUserProgress
);

userRouter.get(
  "/card-progress/:card_id",
  apiLimiter,
  requireAuthentication,
  httpGetCardReviewProgress
);

userRouter.get(
  "/report/:card_id",
  apiLimiter,
  requireAuthentication,
  httpGetDetailedReport
);

// Apply the stricter auth limiter to registration and login routes
userRouter.post("/register", authLimiter, httpCreateNewUser);
userRouter.post("/login", authLimiter, httpLoginUser);
userRouter.post("/google-login", authLimiter, httpLoginGoogleUser);

userRouter.post("/logout", authLimiter, httpLogoutUser);
userRouter.post(
  "/refresh",
  apiLimiter,

  httpRefreshToken
);

userRouter.patch("/", apiLimiter, requireAuthentication, httpUpdateUser);
userRouter.patch(
  "/progress",
  apiLimiter,
  requireAuthentication,
  httpUpdateUserProgress
);
userRouter.patch(
  "/review-progress",
  apiLimiter,
  requireAuthentication,
  httpUpdateUserReviewProgress
);

export default userRouter;
