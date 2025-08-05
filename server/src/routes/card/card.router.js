import { Router } from "express";
const cardRouter = Router();
import {
  httpPatchUpdateCard,
  httpGetCardById,
  httpGetCardLogs,
} from "./card.controller.js";
import { requireAuthentication } from "../../middleware/auth.middleware.js";
import { apiLimiter } from "../../middleware/rateLimiter.middleware.js";

cardRouter.use(apiLimiter);

cardRouter.get("/:id", httpGetCardById);
cardRouter.get("/:id/logs", httpGetCardLogs);
cardRouter.patch("/", requireAuthentication, httpPatchUpdateCard);

export default cardRouter;
