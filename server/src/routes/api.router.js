import express from "express";
const apiRouter = express.Router();

import userRouter from "./user/user.router.js";
import cardsRouter from "./cards/cards.router.js";
import cardRouter from "./card/card.router.js";
import usersRouter from "./user/users.router.js";
import { csrfProtectionMiddleware } from "../middleware/csrf.middleware.js";

apiRouter.use(csrfProtectionMiddleware);
apiRouter.use("/card", cardRouter);
apiRouter.use("/cards", cardsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/user", userRouter);

export default apiRouter;
