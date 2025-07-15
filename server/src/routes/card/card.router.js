const express = require("express");
const cardRouter = express.Router();
const {
  httpPatchUpdateCard,
  httpGetCardById,
  httpGetCardLogs,
} = require("./card.controller");
const { requireAuthentication } = require("../../middleware/auth.middleware");
const { apiLimiter } = require("../../middleware/rateLimiter.middleware");

cardRouter.use(apiLimiter);

cardRouter.get("/:id", httpGetCardById);
cardRouter.get("/:id/logs", httpGetCardLogs);
cardRouter.patch("/", requireAuthentication, httpPatchUpdateCard);

module.exports = cardRouter;
