import { Router } from "express";
const cardsRouter = Router();
import {
  httpGetCardsByCategory,
  httpPostCreateNewCard,
  httpGetAllCategoriesPaginated,
} from "./cards.controller.js";
import { requireAuthenticationWithCSRF } from "../../middleware/auth.middleware.js";
import { apiLimiter } from "../../middleware/rateLimiter.middleware.js";

// Apply the API rate limiter to all routes in this router
cardsRouter.use(apiLimiter);

cardsRouter.get("/categories", httpGetAllCategoriesPaginated);
cardsRouter.get("/:category", httpGetCardsByCategory);
cardsRouter.post("/", requireAuthenticationWithCSRF, httpPostCreateNewCard);

export default cardsRouter;
