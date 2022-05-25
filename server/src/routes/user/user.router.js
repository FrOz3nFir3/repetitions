const {
  httpGetAuthDetails,
  httpCreateNewUser,
  httpLoginUser,
  httpLoginGoogleUser,
  httpLogoutUser,
  httpUpdateUser,
} = require("./user.controller");
const { requireAuthentication } = require("../../middleware/auth.middleware");

const express = require("express");
const userRouter = express.Router();

userRouter.get("/authed", requireAuthentication, httpGetAuthDetails);
userRouter.post("/", httpUpdateUser);
userRouter.post("/register", httpCreateNewUser);
userRouter.post("/login", httpLoginUser);
userRouter.post("/google-login", httpLoginGoogleUser);
userRouter.post("/logout", httpLogoutUser);

module.exports = userRouter;
