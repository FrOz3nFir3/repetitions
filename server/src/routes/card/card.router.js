import { Router } from "express";
const cardRouter = Router();
import {
  httpPatchUpdateCard,
  httpGetCardById,
  httpGetCardLogs,
} from "./card.controller.js";
import { requireAuthenticationWithCSRF } from "../../middleware/auth.middleware.js";

cardRouter.get("/:id", httpGetCardById);
cardRouter.get("/:id/logs", httpGetCardLogs);
cardRouter.patch("/", requireAuthenticationWithCSRF, httpPatchUpdateCard);

export default cardRouter;
