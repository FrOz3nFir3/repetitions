import { getAuthorOfCard } from "../models/cards/cards.model.js";
import Card from "../models/cards/cards.mongo.js";
import { Types } from "mongoose";

/**
 * Middleware to check if user has review permissions for a card
 * Adds isAuthor and hasReviewPermission flags to req object
 */
export async function checkReviewPermissions(req, res, next) {
  const token = req.token;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const cardId = req.body?._id || req.params?.id || req.query?.id;
  if (!cardId) {
    return res.status(400).json({ error: "Card ID is required" });
  }

  if (!Types.ObjectId.isValid(cardId)) {
    throw new Error("Invalid card ID ");
  }

  try {
    // Get card with reviewers array
    const card = await Card.findById(cardId, {
      author: 1,
      reviewers: 1,
    }).lean();

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const userId = new Types.ObjectId(`${token.id}`);
    const isAuthor = card.author.toString() === userId.toString();

    // Check if user is in reviewers array
    const hasReviewPermission = card.reviewers.some(
      (reviewerId) => reviewerId.toString() === userId.toString()
    );

    // Add flags to request object for use in controllers
    req.isAuthor = isAuthor;
    req.hasReviewPermission = hasReviewPermission;
    req.cardAuthor = card.author;

    next();
  } catch (error) {
    console.error("Error checking review permissions:", error);
    return res.status(500).json({ error: "Failed to check permissions" });
  }
}

/**
 * Middleware to require author permissions for destructive operations
 */
export function requireAuthorPermission(req, res, next) {
  if (!req.isAuthor) {
    return res.status(403).json({
      error: "Only the card author can perform this action",
    });
  }
  next();
}

/**
 * Middleware to require review permissions (author or reviewer)
 */
export function requireReviewPermission(req, res, next) {
  if (!req.hasReviewPermission) {
    return res.status(403).json({
      error: "You don't have permission to review this card",
    });
  }
  next();
}
