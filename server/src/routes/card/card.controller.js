const {
  getCardById,
  updateCard,
  getTextFromHTML,
} = require("../../models/cards/cards.model");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

async function httpGetCardById(req, res) {
  const { id } = req.params;
  try {
    const card = await getCardById(id);
    res.json(card);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function httpPatchUpdateCard(req, res) {
  const token = req.token;

  if (token == null) {
    return res.status(401).json({ error: "Authentication / Login required" });
  }

  let { question, answer, option, ...otherBody } = req.body;

  if (question) {
    let questionText = getTextFromHTML(question);
    if (questionText?.trim() === "" && !otherBody.isUpdatingOption) {
      return res.status(400).json({ error: "Question cannot be empty" });
    }
  }

  if (answer) {
    let answerText = getTextFromHTML(answer);
    if (answerText?.trim() === "") {
      return res.status(400).json({ error: "Answer cannot be empty" });
    }
  }

  if (option) {
    let optionText = getTextFromHTML(option);
    if (optionText?.trim() === "") {
      return res.status(400).json({ error: "Option cannot be empty" });
    }
  }

  // these are html input so we need to sanitize them
  if (question) {
    question = DOMPurify.sanitize(question);
  }
  if (answer) {
    answer = DOMPurify.sanitize(answer);
  }
  if (option) {
    option = DOMPurify.sanitize(option);
  }

  try {
    const updatedCard = await updateCard({
      question,
      answer,
      option,
      ...otherBody,
      userId: token.id,
    });

    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
}

module.exports = {
  httpGetCardById,
  httpPatchUpdateCard,
};
