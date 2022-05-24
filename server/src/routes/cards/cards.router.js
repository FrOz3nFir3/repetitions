const express = require("express");
const cardsRouter = express.Router();
const {
  httpGetCardsByCategory,
  httpPostCreateNewCard,
  httpGetAllCards,
} = require("./cards.controller");
const { requireAuthentication } = require("../../middleware/auth.middleware");

cardsRouter.get("/all", httpGetAllCards);
cardsRouter.get("/:category", httpGetCardsByCategory);
cardsRouter.post("/", requireAuthentication, httpPostCreateNewCard);

module.exports = cardsRouter;
