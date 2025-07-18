const {
  getCardById,
  updateCard,
  getCardLogs,
  getQuizAnswer,
  getAuthorOfCard,
  getQuizById,
} = require("../../models/cards/cards.model");
const { getTextFromHTML, sanitizeHTML } = require("../../utils/dom");

async function httpGetCardById(req, res) {
  const { id } = req.params;
  try {
    const card = await getCardById(id);
    if (card && card.logs) {
      card.logs = card.logs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 6);
    }
    res.json(card);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function httpGetCardLogs(req, res) {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const data = await getCardLogs(id, page, limit);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
}

async function httpPatchUpdateCard(req, res) {
  const token = req.token;

  if (token == null) {
    return res.status(401).json({ error: "Authentication / Login required" });
  }

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
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  httpGetCardById,
  httpPatchUpdateCard,
  httpGetCardLogs,
};
