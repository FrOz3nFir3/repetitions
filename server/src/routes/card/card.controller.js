import {
  getCardById,
  updateCard,
  getCardLogs,
  getQuizAnswer,
  getAuthorOfCard,
  getQuizById,
  findExistingCard,
} from "../../models/cards/cards.model.js";
import { getTextFromHTML, sanitizeHTML } from "../../utils/dom.js";

export async function httpGetCardById(req, res) {
  const { id } = req.params;
  const { view } = req.query;
  try {
    const card = await getCardById(id, view);
    res.json(card);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

export async function httpGetCardLogs(req, res) {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || "";

  try {
    const data = await getCardLogs(id, page, limit, search);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
}

export async function httpPatchUpdateCard(req, res) {
  const token = req.token;

  if (token == null) {
    return res.status(401).json({ error: "Authentication / Login required" });
  }

  // have this extracted ? like is authorOptions?
  if (req.body.deleteCard || req.body.deleteQuiz || req.body.deleteOption) {
    const authorObjectId = await getAuthorOfCard(req.body._id);
    if (!authorObjectId) {
      return res.status(404).json({ error: "Card not found" });
    }
    if (authorObjectId.toString() !== token.id) {
      return res.status(403).json({
        error:
          "You don't have access to delete. Only the author has access for deletion.",
      });
    }
  }

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
    if (typeof minimumOptions !== "number" || minimumOptions < 2) {
      return res.status(400).json({
        error: "Minimum options must be a number greater than or equal to 2",
      });
    }

    const quiz = await getQuizById(
      otherBody._id,
      otherBody.cardId,
      otherBody.quizId
    );
    if (quiz && quiz.options.length > minimumOptions - 1) {
      return res.status(400).json({
        error: `Please remove existing options manually before reducing the minimum options below ${
          quiz.options.length + 1
        }.`,
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
    const updatedCard = await updateCard({
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
    });

    return res.json({ ok: true });
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
