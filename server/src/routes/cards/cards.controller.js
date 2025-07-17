const {
  cardsByCategory,
  createNewCard,
  getAllCards,
  getCardsByIds,
} = require("../../models/cards/cards.model");

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
  try {
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
