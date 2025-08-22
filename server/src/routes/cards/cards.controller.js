import {
  cardsByCategory,
  countCardsByCategory,
  createNewCard,
  findExistingCard,
  getAllCards,
  getAllCategoriesWithPagination,
  countAllCategories,
  getCardsByIds,
  getCardsByAuthor,
  countCardsByAuthor,
} from "../../models/cards/cards.model.js";
import { getPublicUserByUsername } from "../../models/users/users.model.js";
import { getPagination } from "../../services/query.js";
import { getCategoriesPagination } from "../../services/categoryQuery.js";

export async function httpGetCardsByAuthor(req, res) {
  const { username } = req.params;
  const user = await getPublicUserByUsername(username, false);

  const authorId = user?._id;
  const { skip, limit } = getPagination(req.query);
  try {
    const cards = await getCardsByAuthor(authorId, { skip, limit });
    const total = await countCardsByAuthor(authorId);
    const hasMore = skip + limit < total;
    res.json({ cards, total, hasMore });
  } catch (error) {
    res.status(500).json({ error });
  }
}
import {
  normalizeWhitespace,
  normalizeCategory,
} from "../../utils/textNormalization.js";

export async function httpGetCardsByCategory(req, res) {
  const { category } = req.params;
  const { skip, limit } = getPagination(req.query);
  const { search } = req.query;

  try {
    const cards = await cardsByCategory(category, { skip, limit, search });
    const total = await countCardsByCategory(category, search);
    const hasMore = skip + limit < total;

    res.json({
      cards,
      total,
      hasMore,
      page: Math.floor(skip / limit) + 1,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
export async function httpPostCardsByIds(req, res) {
  var { cardsIds } = req.body;
  try {
    const cards = await getCardsByIds(cardsIds);
    return res.json(cards);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: error.message });
  }
}
export async function httpPostCreateNewCard(req, res) {
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

export async function httpGetAllCards(req, res) {
  try {
    const allCards = await getAllCards();
    res.json(allCards);
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function httpGetAllCategoriesPaginated(req, res) {
  const { skip, limit } = getCategoriesPagination(req.query);
  const { search } = req.query;

  try {
    const categories = await getAllCategoriesWithPagination({
      skip,
      limit,
      search,
    });
    const total = await countAllCategories(search);
    const hasMore = skip + limit < total;

    res.json({
      categories,
      total,
      hasMore,
      page: Math.floor(skip / limit) + 1,
      limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
