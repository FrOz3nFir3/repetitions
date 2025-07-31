const {
  cardsByCategory,
  createNewCard,
  findExistingCard,
  getAllCards,
  getCardsByIds,
} = require("../../models/cards/cards.model");
const {
  normalizeWhitespace,
  normalizeCategory,
} = require("../../utils/textNormalization");

async function httpGetCardsByCategory(req, res) {
  const { category } = req.params;
  try {
    const cards = await cardsByCategory(category);
    res.json(cards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
async function httpPostCardsByIds(req, res) {
  var { cardsIds } = req.body;
  try {
    const cards = await getCardsByIds(cardsIds);
    return res.json(cards);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
}
async function httpPostCreateNewCard(req, res) {
  const token = req.token;

  if (token === null) {
    return res.status(401).json({ error: "Authentication / Login required" });
  }
  var { mainTopic, subTopic, category } = req.body;
  if (!mainTopic && !mainTopic.trim()) {
    return res.status(409).json({ error: "Main Topic name is required" });
  }

  if (!subTopic && !subTopic.trim()) {
    return res.status(409).json({ error: "Sub Topic name is required" });
  }

  if (!category && !category.trim()) {
    return res.status(409).json({ error: "Category name is required" });
  }

  try {
    // Check if a card with the same main-topic, sub-topic, and category already exists
    const existingCard = await findExistingCard(mainTopic, subTopic, category);
    if (existingCard) {
      return res.status(409).json({
        error: `A card with the same Main Topic "${mainTopic}", Sub Topic "${subTopic}", and Category "${category}" already exists. Please use different values to avoid confusion.`,
      });
    }

    mainTopic = normalizeWhitespace(mainTopic);
    subTopic = normalizeWhitespace(subTopic);
    category = normalizeCategory(category);

    const card = await createNewCard(
      {
        "main-topic": mainTopic,
        "sub-topic": subTopic,
        category,
      },
      token.id
    );
    return res.json(card);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
}

async function httpGetAllCards(req, res) {
  try {
    const allCards = await getAllCards();
    res.json(allCards);
  } catch (error) {
    res.status(500).json({ error });
  }
}
module.exports = {
  httpGetCardsByCategory,
  httpPostCreateNewCard,
  httpGetAllCards,
  httpPostCardsByIds,
};
