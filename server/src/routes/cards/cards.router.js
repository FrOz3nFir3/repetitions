const express = require("express");
const cardsRouter = express.Router();
const {
  httpGetCardsByCategory,
  httpPostCreateNewCard,
  httpGetAllCards,
  httpPostCardsByIds
} = require("./cards.controller");
const { requireAuthentication } = require("../../middleware/auth.middleware");

cardsRouter.post("/ids", httpPostCardsByIds);
cardsRouter.get("/all", httpGetAllCards);
cardsRouter.get("/:category", httpGetCardsByCategory);
cardsRouter.post("/", requireAuthentication, httpPostCreateNewCard);

module.exports = cardsRouter;
