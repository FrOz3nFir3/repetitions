import { Router } from "express";
const cardRouter = Router();
import {
  httpPatchUpdateCard,
  httpGetCardById,
  httpGetCardLogs,
  httpAcceptReviewItem,
  httpRejectReviewItem,
  httpGetCardReviewers,
  httpAddCardReviewers,
  httpRemoveCardReviewer,
  httpGetReviewQueueItems,
} from "./card.controller.js";
import { requireAuthenticationWithCSRF } from "../../middleware/auth.middleware.js";
import { checkReviewPermissions } from "../../middleware/reviewPermission.middleware.js";

cardRouter.get("/:id", httpGetCardById);
cardRouter.get("/:id/logs", httpGetCardLogs);
cardRouter.get("/:id/review-queue", httpGetReviewQueueItems);
cardRouter.get("/:id/reviewers", requireAuthenticationWithCSRF, checkReviewPermissions, httpGetCardReviewers);
cardRouter.post("/:id/reviewers", requireAuthenticationWithCSRF, checkReviewPermissions, httpAddCardReviewers);
cardRouter.delete("/:id/reviewers/:userId", requireAuthenticationWithCSRF, checkReviewPermissions, httpRemoveCardReviewer);
cardRouter.patch("/", requireAuthenticationWithCSRF, checkReviewPermissions, httpPatchUpdateCard);
cardRouter.post("/:id/review-queue/:itemId/accept", requireAuthenticationWithCSRF, checkReviewPermissions, httpAcceptReviewItem);
cardRouter.post("/:id/review-queue/:itemId/reject", requireAuthenticationWithCSRF, checkReviewPermissions, httpRejectReviewItem);

export default cardRouter;
