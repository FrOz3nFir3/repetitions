import { Router } from "express";
const cardsRouter = Router();
import {
  httpGetCardsByCategory,
  httpPostCreateNewCard,
  httpGetAllCategoriesPaginated,
} from "./cards.controller.js";
import { requireAuthenticationWithCSRF } from "../../middleware/auth.middleware.js";
import { createCacheMiddleware } from "../../middleware/cache.middleware.js";
import { createInvalidationMiddleware } from "../../middleware/cacheInvalidation.middleware.js";

// Apply cache middleware to GET endpoints
cardsRouter.get("/categories", createCacheMiddleware.cards(), httpGetAllCategoriesPaginated);
cardsRouter.get("/:category", createCacheMiddleware.cards(), httpGetCardsByCategory);

// Apply invalidation middleware to POST endpoint
cardsRouter.post("/", requireAuthenticationWithCSRF, createInvalidationMiddleware.cards(), httpPostCreateNewCard);

export default cardsRouter;
