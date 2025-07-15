const {
  getCardById,
  updateCard,
  getTextFromHTML,
  getCardLogs,
} = require("../../models/cards/cards.model");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

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

  let {
    question,
    answer,
    option,
    quizQuestion,
    quizAnswer,
    options: newOptions,
    minimumOptions,
    ...otherBody
  } = req.body;

  // --- Input Validation ---
  if (question) {
    if (
      getTextFromHTML(question)?.trim() === "" &&
      !otherBody.isUpdatingOption
    ) {
      return res.status(400).json({ error: "Question cannot be empty" });
    }
    question = DOMPurify.sanitize(question);
  }

  if (answer) {
    if (getTextFromHTML(answer)?.trim() === "") {
      return res.status(400).json({ error: "Answer cannot be empty" });
    }
    answer = DOMPurify.sanitize(answer);
  }

  if (option) {
    if (getTextFromHTML(option)?.trim() === "") {
      return res.status(400).json({ error: "Option cannot be empty" });
    }
    option = DOMPurify.sanitize(option);
  }

  if (quizQuestion) {
    if (getTextFromHTML(quizQuestion)?.trim() === "") {
      return res.status(400).json({ error: "Quiz Question cannot be empty" });
    }
    quizQuestion = DOMPurify.sanitize(quizQuestion);
  }

  if (quizAnswer) {
    if (getTextFromHTML(quizAnswer)?.trim() === "") {
      return res.status(400).json({ error: "Quiz Answer cannot be empty" });
    }
    quizAnswer = DOMPurify.sanitize(quizAnswer);
  }

  if (newOptions) {
    if (
      !Array.isArray(newOptions) ||
      newOptions.some((opt) => getTextFromHTML(opt)?.trim() === "")
    ) {
      return res.status(400).json({ error: "Options cannot be empty" });
    }
    newOptions = newOptions.map((opt) => DOMPurify.sanitize(opt));
  }

  if (minimumOptions) {
    if (typeof minimumOptions !== "number" || minimumOptions < 2) {
      return res
        .status(400)
        .json({
          error: "Minimum options must be a number greater than or equal to 2",
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
