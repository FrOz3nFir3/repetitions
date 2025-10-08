import {
  getCardById,
  updateCard,
  getCardLogs,
  getQuizAnswer,
  getAuthorOfCard,
  getQuizById,
  findExistingCard,
  processUpdateRequest,
  acceptReviewItem,
  rejectReviewItem,
  getCardReviewers,
  addCardReviewers,
  removeCardReviewer,
  getReviewQueueItems,
} from "../../models/cards/cards.model.js";
import { getTextFromHTML, sanitizeHTML } from "../../utils/dom.js";

export async function httpGetCardById(req, res) {
  const { id } = req.params;
  const { view, skipLogs } = req.query;
  const shouldSkipLogs = skipLogs === 'true';
  try {
    const card = await getCardById(id, view, shouldSkipLogs);
    res.json(card);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

export async function httpGetCardLogs(req, res) {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 10;
  const search = req.query.search || "";

  try {
    const data = await getCardLogs(id, page, limit, search);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
}

export async function httpGetReviewQueueItems(req, res) {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 7; // Default to 7 items as requested

  try {
    const data = await getReviewQueueItems(id, page, limit);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch review queue items" });
  }
}

export async function httpPatchUpdateCard(req, res) {
  const token = req.token;

  if (token == null) {
    return res.status(401).json({ error: "Authentication / Login required" });
  }

  // Allow all authenticated users to make any changes
  // Users with review permission (authors/reviewers) will have changes applied directly
  // Non-reviewers will have their changes (including deletions) go to review queue

  let {
    question,
    answer,
    option,
    quizQuestion,
    quizAnswer,
    options: newOptions,
    minimumOptions,
    description,
    ...otherBody
  } = req.body;

  // --- Input Validation ---
  if (description) {
    if (getTextFromHTML(description)?.trim() === "") {
      return res.status(400).json({ error: "Description cannot be empty" });
    }
    description = sanitizeHTML(description);
  }
  if (question) {
    if (
      getTextFromHTML(question)?.trim() === "" &&
      !otherBody.isUpdatingOption
    ) {
      return res.status(400).json({ error: "Question cannot be empty" });
    }
    question = sanitizeHTML(question);
  }

  if (answer) {
    if (getTextFromHTML(answer)?.trim() === "") {
      return res.status(400).json({ error: "Answer cannot be empty" });
    }
    answer = sanitizeHTML(answer);
  }

  if (quizQuestion) {
    if (getTextFromHTML(quizQuestion)?.trim() === "") {
      return res.status(400).json({ error: "Quiz Question cannot be empty" });
    }
    quizQuestion = sanitizeHTML(quizQuestion);
  }

  if (quizAnswer) {
    if (getTextFromHTML(quizAnswer)?.trim() === "") {
      return res.status(400).json({ error: "Quiz Answer cannot be empty" });
    }
    quizAnswer = sanitizeHTML(quizAnswer);
  }

  if (newOptions) {
    if (
      !Array.isArray(newOptions) ||
      newOptions.some((opt) => getTextFromHTML(opt)?.trim() === "")
    ) {
      return res.status(400).json({ error: "Options cannot be empty" });
    }
    newOptions = newOptions.map((opt) => sanitizeHTML(opt));

    const textOptions = newOptions.map((opt) => getTextFromHTML(opt));
    const hasDuplicateOptions =
      new Set(textOptions).size !== textOptions.length;
    if (hasDuplicateOptions) {
      return res
        .status(400)
        .json({ error: "Options must not contain duplicate values" });
    }

    const answerHtml = await getQuizAnswer(
      otherBody._id,
      otherBody.cardId,
      otherBody.quizId
    );
    const answerText = getTextFromHTML(answerHtml);
    if (answerText && textOptions.includes(answerText)) {
      return res
        .status(400)
        .json({ error: "Options must not be the same as the answer" });
    }
  }

  if (option) {
    if (getTextFromHTML(option)?.trim() === "") {
      return res.status(400).json({ error: "Option cannot be empty" });
    }
    option = sanitizeHTML(option);
    const answerHtml = await getQuizAnswer(
      otherBody._id,
      otherBody.cardId,
      otherBody.quizId
    );
    const answerText = getTextFromHTML(answerHtml);

    if (answerText && answerText === option) {
      return res.status(400).json({
        error: "Option must not be the same as the quiz answer",
      });
    }
  }

  if (minimumOptions) {
    let optionsLength = newOptions?.length;
    if (newOptions && optionsLength < minimumOptions - 1) {
      return res.status(400).json({
        error: "Add more options as per the minimum options.",
      });
    }
    if (typeof minimumOptions !== "number" || minimumOptions < 2) {
      return res.status(400).json({
        error: "Minimum options must be a number greater than or equal to 2",
      });
    }

    const quiz = await getQuizById(
      otherBody._id,
      otherBody.quizId,
      otherBody.quizId
    );
    if (quiz && quiz.options?.length > minimumOptions - 1) {
      return res.status(400).json({
        error: `Please remove existing options manually before reducing the minimum options below ${quiz.options.length + 1
          }.`,
      });
    }
    // causing issues in updating check later fixed for now
    if (quiz && newOptions?.length < minimumOptions - 1) {
      return res.status(400).json({
        error: `Add more options as per minimum options.`,
      });
    }
  }
  // --- End Validation ---

  // Check for duplicate cards when updating main fields
  const isUpdatingMainFields =
    otherBody["main-topic"] !== undefined ||
    otherBody["sub-topic"] !== undefined ||
    otherBody.category !== undefined;

  if (isUpdatingMainFields) {
    try {
      // Get the current card to compare with
      const currentCard = await getCardById(otherBody._id);
      if (!currentCard) {
        return res.status(404).json({ error: "Card not found" });
      }

      // Use current values if not being updated
      const finalMainTopic =
        otherBody["main-topic"] !== undefined
          ? otherBody["main-topic"]
          : currentCard["main-topic"];
      const finalSubTopic =
        otherBody["sub-topic"] !== undefined
          ? otherBody["sub-topic"]
          : currentCard["sub-topic"];
      const finalCategory =
        otherBody.category !== undefined
          ? otherBody.category
          : currentCard.category;

      // Check if this combination would create a duplicate (excluding the current card)
      const existingCard = await findExistingCard(
        finalMainTopic,
        finalSubTopic,
        finalCategory
      );
      if (existingCard && existingCard._id.toString() !== otherBody._id) {
        return res.status(409).json({
          error: `A card with the same Main Topic "${finalMainTopic}", Sub Topic "${finalSubTopic}", and Category "${finalCategory}" already exists. Please use different values to avoid confusion.`,
        });
      }
    } catch (error) {
      console.log("Error checking for duplicates:", error);
      return res
        .status(500)
        .json({ error: "Error validating card uniqueness" });
    }
  }

  try {
    await processUpdateRequest(
      otherBody._id,
      {
        question,
        answer,
        option,
        quizQuestion,
        quizAnswer,
        options: newOptions,
        description,
        minimumOptions,
        ...otherBody,
        userId: token.id,
      },
      token.id,
      req.hasReviewPermission
    );

    if (req.hasReviewPermission) {
      return res.json({ ok: true, message: "Card updated successfully" });
    } else {
      return res.json({
        ok: true,
        message: "Your changes have been added to Review Queue for approval",
        reviewQueue: true,
      });
    }
  } catch (error) {
    console.log(error);
    if (error.message.includes("duplicate key error collection")) {
      // fix later with actual values
      return res.status(409).json({
        error: `A card with the same Main Topic, Sub Topic, and Category already exists. Please use different values to avoid confusion.`,
      });
    }
    return res.status(400).json({ error: error.message });
  }
}

export async function httpAcceptReviewItem(req, res) {
  const token = req.token;
  const { id: cardId, itemId } = req.params;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user has review permissions (already checked by middleware)
  if (!req.hasReviewPermission) {
    return res.status(403).json({
      error: "You don't have permission to review changes for this card.",
    });
  }

  try {
    const updatedCard = await acceptReviewItem(cardId, itemId, token.id);

    if (!updatedCard) {
      return res.status(404).json({ error: "Card or review item not found" });
    }

    res.json({
      ok: true,
      message: "Review item accepted and change applied successfully",
    });
  } catch (error) {
    console.log("Error accepting review item:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("expired")) {
      return res.status(410).json({ error: error.message });
    }
    if (error.message.includes("Invalid")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to accept review item" });
  }
}

export async function httpRejectReviewItem(req, res) {
  const token = req.token;
  const { id: cardId, itemId } = req.params;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user has review permissions (already checked by middleware)
  if (!req.hasReviewPermission) {
    return res.status(403).json({
      error: "You don't have permission to review changes for this card.",
    });
  }

  try {
    const updatedCard = await rejectReviewItem(cardId, itemId, token.id);

    if (!updatedCard) {
      return res.status(404).json({ error: "Card or review item not found" });
    }

    res.json({
      ok: true,
      message: "Review item rejected successfully",
    });
  } catch (error) {
    console.log("Error rejecting review item:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("Invalid")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to reject review item" });
  }
}
export async function httpGetCardReviewers(req, res) {
  const token = req.token;
  const { id: cardId } = req.params;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user has review permissions (already checked by middleware)
  if (!req.hasReviewPermission) {
    return res.status(403).json({
      error: "You don't have permission to view reviewers for this card.",
    });
  }

  try {
    const reviewers = await getCardReviewers(cardId);
    res.json({ reviewers });
  } catch (error) {
    console.log("Error getting card reviewers:", error);

    if (error.message.includes("Invalid card ID")) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes("Card not found")) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to get card reviewers" });
  }
}
export async function httpAddCardReviewers(req, res) {
  const token = req.token;
  const { id: cardId } = req.params;
  const { usernames } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user has review permissions (already checked by middleware)
  if (!req.hasReviewPermission) {
    return res.status(403).json({
      error: "You don't have permission to manage reviewers for this card.",
    });
  }

  // Validate input
  if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
    return res.status(400).json({
      error: "usernames must be a non-empty array of usernames",
    });
  }

  try {
    const { addCardReviewersByUsername } = await import("../../models/cards/cards.model.js");
    await addCardReviewersByUsername(cardId, usernames, token.id);
    res.json({
      ok: true,
      message: "Reviewers added successfully",
    });
  } catch (error) {
    console.log("Error adding card reviewers:", error);

    if (
      error.message.includes("Invalid card ID") ||
      error.message.includes("Usernames must")
    ) {
      return res.status(400).json({ error: error.message });
    }
    if (
      error.message.includes("Card not found") ||
      error.message.includes("Users not found")
    ) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("already reviewers")) {
      return res.status(409).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to add reviewers" });
  }
}
export async function httpRemoveCardReviewer(req, res) {
  const token = req.token;
  const { id: cardId, username } = req.params;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user has review permissions (already checked by middleware)
  if (!req.hasReviewPermission) {
    return res.status(403).json({
      error: "You don't have permission to manage reviewers for this card.",
    });
  }

  try {
    const { removeCardReviewerByUsername } = await import("../../models/cards/cards.model.js");
    await removeCardReviewerByUsername(cardId, username, token.id);
    res.json({
      ok: true,
      message: "Reviewer removed successfully",
    });
  } catch (error) {
    console.log("Error removing card reviewer:", error);

    if (
      error.message.includes("Invalid card ID") ||
      error.message.includes("Invalid")
    ) {
      return res.status(400).json({ error: error.message });
    }
    if (
      error.message.includes("Card not found") ||
      error.message.includes("User not found")
    ) {
      return res.status(404).json({ error: error.message });
    }
    if (
      error.message.includes("Cannot remove") ||
      error.message.includes("not a reviewer")
    ) {
      return res.status(409).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to remove reviewer" });
  }
}
