const express = require("express");
const cardsRouter = express.Router();
const {
  httpGetCardsByCategory,
  httpPostCreateNewCard,
  httpGetAllCards,
  httpPostCardsByIds,
} = require("./cards.controller");
const { requireAuthentication } = require("../../middleware/auth.middleware");
const { apiLimiter } = require("../../middleware/rateLimiter.middleware");

// Apply the API rate limiter to all routes in this router
cardsRouter.use(apiLimiter);

cardsRouter.post("/ids", httpPostCardsByIds);
cardsRouter.get("/all", httpGetAllCards);
cardsRouter.get("/:category", httpGetCardsByCategory);
cardsRouter.post("/", requireAuthentication, httpPostCreateNewCard);

module.exports = cardsRouter;
