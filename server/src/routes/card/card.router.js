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
import { createCacheMiddleware } from "../../middleware/cache.middleware.js";
import { createInvalidationMiddleware } from "../../middleware/cacheInvalidation.middleware.js";

// Apply cache middleware to GET endpoints with view-specific caching
cardRouter.get("/:id", createCacheMiddleware.cards(), httpGetCardById);
cardRouter.get("/:id/logs", createCacheMiddleware.cards(), httpGetCardLogs);
cardRouter.get("/:id/review-queue", createCacheMiddleware.reviewQueue(), httpGetReviewQueueItems);
cardRouter.get("/:id/reviewers", requireAuthenticationWithCSRF, checkReviewPermissions, createCacheMiddleware.cards(), httpGetCardReviewers);

// Apply invalidation middleware to mutation endpoints
cardRouter.post("/:id/reviewers", requireAuthenticationWithCSRF, checkReviewPermissions, createInvalidationMiddleware.auto(), httpAddCardReviewers);
cardRouter.delete("/:id/reviewers/:userId", requireAuthenticationWithCSRF, checkReviewPermissions, createInvalidationMiddleware.auto(), httpRemoveCardReviewer);
cardRouter.patch("/", requireAuthenticationWithCSRF, checkReviewPermissions, createInvalidationMiddleware.cards(), httpPatchUpdateCard);
cardRouter.post("/:id/review-queue/:itemId/accept", requireAuthenticationWithCSRF, checkReviewPermissions, createInvalidationMiddleware.auto(), httpAcceptReviewItem);
cardRouter.post("/:id/review-queue/:itemId/reject", requireAuthenticationWithCSRF, checkReviewPermissions, createInvalidationMiddleware.auto(), httpRejectReviewItem);

export default cardRouter;
