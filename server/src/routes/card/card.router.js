const express = require("express");
const cardRouter = express.Router();
const { httpPatchUpdateCard, httpGetCardById } = require("./card.controller");
const { requireAuthentication } = require("../../middleware/auth.middleware");

cardRouter.get("/:id", httpGetCardById);
cardRouter.patch("/", requireAuthentication, httpPatchUpdateCard);

module.exports = cardRouter;
