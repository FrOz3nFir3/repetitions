const Card = require("./cards.mongo");

// Fetches all cards that belong to a specific category.
// Uses $eq to prevent NoSQL injection.
async function cardsByCategory(category) {
  return Card.find({ category: { $eq: category } });
}

// Fetches a list of all distinct card categories.
async function getAllCards() {
  return Card.distinct("category");
}

// Creates a new card document.
async function createNewCard(card) {
  const newCard = new Card(card);
  return newCard.save();
}

// Fetches a single card by its MongoDB document ID.
// Uses findOne with $eq to prevent NoSQL injection.
async function getCardById(id) {
  return Card.findOne({ _id: { $eq: id } });
}

async function getCardsByIds(ids) {
  // Validate ids to prevent unnecessary database queries with invalid data.
  if (!ids || ids.length === 0 || !Array.isArray(ids)) {
    return [];
  }
  const cards = await Card.find(
    {
      _id: {
        $in: ids,
      },
    },
    {
      "main-topic": 1,
      "sub-topic": 1,
      category: 1,
      reviewLength: { $size: "$review" },
    }
  );
  return cards;
}

/**
 * Updates a card document based on the provided details.
 * This function handles multiple update scenarios:
 * 1. Updating a specific flashcard within the 'review' array.
 * 2. Adding a new flashcard to the 'review' array.
 * 3. Deleting a flashcard from the 'review' array.
 * 4. Updating top-level fields of the card document.
 * Uses $eq in queries to prevent NoSQL injection.
 */
async function updateCard(details) {
  const {
    _id,
    cardId,
    minimumOptions,
    optionIndex,
    option,
    question,
    answer,
    deleteCard,
    ...otherDetails
  } = details;

  const options = { new: true }; // Return the updated document

  // The original logic fetches the card first. This is only strictly necessary
  // for adding a new card to determine the new cardId.
  // getCardById is already secured against NoSQL injection.
  const card = await getCardById(_id);
  if (!card) {
    // To prevent errors on subsequent operations, we stop here.
    // Consider throwing an error for better error handling upstream.
    return null;
  }

  const isUpdatingSpecificCard = cardId != null;
  // This condition is broad and will trigger if question and answer are present,
  // but it's handled correctly by the if/else-if structure.
  const isAddingNewCard = question && answer;
  const isUpdatingOtherFields = Object.keys(otherDetails).length > 0;

  // Scenario 1: Update a specific flashcard in the 'review' array
  if (isUpdatingSpecificCard) {
    let cardUpdate;
    // Note: This positional index update is fragile. If the order of cards in the
    // 'review' array changes, this will update the wrong card.
    // A more robust solution would use arrayFilters with the unique cardId.
    const review = `review.${cardId - 1}`;

    if (question) {
      cardUpdate = { $set: { [`${review}.question`]: question } };
    } else if (answer) {
      cardUpdate = { $set: { [`${review}.answer`]: answer } };
    } else if (typeof optionIndex === "number" && option) {
      cardUpdate = { $set: { [`${review}.options.${optionIndex}`]: option } };
    } else if (option) {
      cardUpdate = { $push: { [`${review}.options`]: option } };
    } else if (minimumOptions) {
      cardUpdate = {
        $set: { [`${review}.minimumOptions`]: Number(minimumOptions) },
      };
    } else if (deleteCard) {
      cardUpdate = { $pull: { review: { cardId } } };
    }

    if (cardUpdate) {
      return Card.findOneAndUpdate({ _id: { $eq: _id } }, cardUpdate, options);
    }
  } else if (isAddingNewCard) {
    // Scenario 2: Add a new flashcard to the 'review' array
    const cardsLength = card.review.length + 1;
    const cardDetails = {
      cardId: cardsLength,
      question,
      answer,
      minimumOptions: 2,
      options: [answer],
    };
    return Card.findOneAndUpdate(
      { _id: { $eq: _id } },
      { $push: { review: cardDetails } },
      options
    );
  } else if (isUpdatingOtherFields) {
    // Scenario 3: Update top-level fields of the card document
    const allowedUpdates = {};

    const {
      description,
      category,
      "main-topic": mainTopic,
      "sub-topic": subTopic,
    } = otherDetails;

    if (category) {
      allowedUpdates.category = category;
    }
    if (mainTopic) {
      allowedUpdates["main-topic"] = mainTopic;
    }
    if (subTopic) {
      allowedUpdates["sub-topic"] = subTopic;
    }
    if (description) {
      allowedUpdates.description = description;
    }

    if (Object.keys(allowedUpdates).length > 0) {
      return Card.findOneAndUpdate(
        { _id: { $eq: _id } },
        { $set: allowedUpdates },
        options
      );
    }
  }

  // Return original card if no update logic was triggered
  return card;
}

module.exports = {
  cardsByCategory,
  createNewCard,
  getAllCards,
  getCardById,
  getCardsByIds,
  updateCard,
};
