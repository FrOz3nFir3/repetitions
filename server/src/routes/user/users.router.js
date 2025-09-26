import express from "express";
import {
  httpGetPublicUserByUsername,
  httpSearchUsers,
} from "./user.controller.js";
import { httpGetCardsByAuthor } from "../cards/cards.controller.js";
import { requireAuthenticationWithCSRF } from "../../middleware/auth.middleware.js";
import { checkReviewPermissions } from "../../middleware/reviewPermission.middleware.js";

const usersRouter = express.Router();

// More specific routes should come first
usersRouter.get(
  "/search",
  requireAuthenticationWithCSRF,
  checkReviewPermissions,
  httpSearchUsers
);

// Parameterized routes should come after specific routes
usersRouter.get("/:username", httpGetPublicUserByUsername);
usersRouter.get("/:username/cards", httpGetCardsByAuthor);

export default usersRouter;
