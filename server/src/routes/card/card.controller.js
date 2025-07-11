const { getCardById, updateCard } = require("../../models/cards/cards.model");

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
  try {
    const updatedCard = await updateCard({ ...req.body, userId: token.id });

    return res.json({ok:true});
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
}

module.exports = {
  httpGetCardById,
  httpPatchUpdateCard,
};
