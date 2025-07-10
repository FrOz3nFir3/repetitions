const {
  httpGetAuthDetails,
  httpCreateNewUser,
  httpLoginUser,
  httpLoginGoogleUser,
  httpLogoutUser,
  httpUpdateUser,
  httpGetDetailedReport,
  httpGetUserProgress,
  httpUpdateUserProgress,
} = require("./user.controller");
const { requireAuthentication } = require("../../middleware/auth.middleware");
const {
  authLimiter,
  apiLimiter,
} = require("../../middleware/rateLimiter.middleware");

const express = require("express");
const userRouter = express.Router();

// Apply the API limiter to the authenticated user details endpoint
userRouter.get(
  "/authed",
  apiLimiter,
  requireAuthentication,
  httpGetAuthDetails
);

userRouter.get(
  "/progress",
  apiLimiter,
  requireAuthentication,
  httpGetUserProgress
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

userRouter.post("/logout", httpLogoutUser);
userRouter.patch("/", apiLimiter, requireAuthentication, httpUpdateUser);
userRouter.patch(
  "/progress",
  apiLimiter,
  requireAuthentication,
  httpUpdateUserProgress
);

module.exports = userRouter;
