const express = require("express");
const apiRouter = express.Router();

const userRouter = require("./user/user.router");
const cardsRouter = require("./cards/cards.router");
const cardRouter = require("./card/card.router");

apiRouter.use("/card", cardRouter);
apiRouter.use("/cards", cardsRouter);
apiRouter.use("/user", userRouter);

module.exports = apiRouter;
