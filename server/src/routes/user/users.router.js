import express from "express";
import { httpGetPublicUserByUsername } from "./user.controller.js";
import { httpGetCardsByAuthor } from "../cards/cards.controller.js";

const usersRouter = express.Router();

usersRouter.get("/:username", httpGetPublicUserByUsername);
usersRouter.get("/:authorId/cards", httpGetCardsByAuthor);

export default usersRouter;
