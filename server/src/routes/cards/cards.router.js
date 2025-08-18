import { Router } from "express";
const cardsRouter = Router();
import {
  httpGetCardsByCategory,
  httpPostCreateNewCard,
  httpGetAllCards,
} from "./cards.controller.js";
import { requireAuthenticationWithCSRF } from "../../middleware/auth.middleware.js";
import { apiLimiter } from "../../middleware/rateLimiter.middleware.js";

// Apply the API rate limiter to all routes in this router
cardsRouter.use(apiLimiter);

cardsRouter.get("/all", httpGetAllCards);
// TODO: add pagination later
cardsRouter.get("/:category", httpGetCardsByCategory);
cardsRouter.post("/", requireAuthenticationWithCSRF, httpPostCreateNewCard);

export default cardsRouter;
