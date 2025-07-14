const Card = require("./cards.mongo");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

function getTextFromHTML(html) {
  if (!html) return "";

  // Sanitize the HTML
  const sanitizedHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });

  // Replace block-level elements with newlines
  let text = sanitizedHtml.replace(/<\/(div|p|h[1-6])>/gi, "\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // Strip all other tags
  text = text.replace(/<[^>]+>/g, "");

  // Collapse multiple spaces into a single space
  text = text.replace(/ +/g, " ");

  // Reduce multiple newlines to a maximum of two
  text = text.replace(/\n{3,}/g, "\n\n");

  // Trim leading/trailing whitespace
  return text.trim();
}

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
async function createNewCard(card, userId) {
  const newCard = new Card({
    ...card,
    author: userId,
    logs: [
      {
        eventType: "created",
        user: userId,
        summary: "Card created",
      },
    ],
  });
  return newCard.save();
}

// Fetches a single card by its MongoDB document ID.
// Uses findOne with $eq to prevent NoSQL injection.
async function getCardById(id) {
  return Card.findOne({ _id: { $eq: id } })
    .populate({
      path: "author",
      select: "name email -_id",
    })
    .populate({
      path: "lastUpdatedBy",
      select: "name email -_id",
    })
    .populate({
      path: "logs.user",
      select: "name email -_id",
    })
    .exec();
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
 * This function handles multiple update scenarios and logs detailed changes.
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
    userId,
    ...otherDetails
  } = details;

  const card = await Card.findOne({ _id: { $eq: _id } });
  if (!card) {
    return null;
  }

  const options = { new: true };
  let updateQuery = {};
  const changes = [];
  let summary = "";

  const isUpdatingSpecificCard = cardId != null;
  const isAddingNewCard = question && answer && !isUpdatingSpecificCard;
  const isUpdatingOtherFields = Object.keys(otherDetails).length > 0;

  if (isUpdatingSpecificCard) {
    const reviewIndex = card.review.findIndex((r) => r.cardId === cardId);
    if (reviewIndex === -1) return card; // or throw error

    const reviewPath = `review.${reviewIndex}`;
    const oldReview = card.review[reviewIndex];
    const changedFields = [];

    if (question !== undefined) {
      updateQuery.$set = {
        ...updateQuery.$set,
        [`${reviewPath}.question`]: question,
      };
      changes.push({
        field: `Question`,
        oldValue: getTextFromHTML(oldReview.question),
        newValue: getTextFromHTML(question),
      });
      changedFields.push("question");
    }
    if (answer !== undefined) {
      updateQuery.$set = {
        ...updateQuery.$set,
        [`${reviewPath}.answer`]: answer,
      };
      changes.push({
        field: `Answer`,
        oldValue: getTextFromHTML(oldReview.answer),
        newValue: getTextFromHTML(answer),
      });
      changedFields.push("answer");
    }
    if (option !== undefined) {
      if (optionIndex !== undefined) {
        updateQuery.$set = {
          ...updateQuery.$set,
          [`${reviewPath}.options.${optionIndex}`]: option,
        };
        changes.push({
          field: `Option #${optionIndex + 1}`,
          oldValue: getTextFromHTML(oldReview.options[optionIndex]),
          newValue: getTextFromHTML(option),
        });
      } else {
        updateQuery.$push = {
          ...updateQuery.$push,
          [`${reviewPath}.options`]: option,
        };
        changes.push({
          field: `New Option`,
          oldValue: null,
          newValue: getTextFromHTML(option),
        });
      }
      changedFields.push("options");
    }
    if (minimumOptions !== undefined) {
      updateQuery.$set = {
        ...updateQuery.$set,
        [`${reviewPath}.minimumOptions`]: Number(minimumOptions),
      };
      changes.push({
        field: `Minimum Options`,
        oldValue: oldReview.minimumOptions,
        newValue: Number(minimumOptions),
      });
      changedFields.push("minimum options");
    }
    if (deleteCard) {
      updateQuery.$pull = { review: { cardId: cardId } };
      changes.push({
        field: `Flashcard #${cardId}`,
        oldValue: {
          ...oldReview,
          question: getTextFromHTML(oldReview.question),
          answer: getTextFromHTML(oldReview.answer),
        },
        newValue: "Deleted",
      });
      summary = `Deleted flashcard #${cardId}.`;
    } else {
      summary = `Updated ${changedFields.join(", ")} in flashcard #${cardId}.`;
    }
  } else if (isAddingNewCard) {
    const newFlashcard = {
      cardId: card.review.length + 1,
      question,
      answer,
      minimumOptions: 2,
      options: [answer],
    };
    updateQuery.$push = { review: newFlashcard };
    changes.push({
      field: "New Flashcard",
      oldValue: null,
      newValue: {
        ...newFlashcard,
        question: getTextFromHTML(newFlashcard.question),
        answer: getTextFromHTML(newFlashcard.answer),
        options: [getTextFromHTML(newFlashcard.answer)],
      },
    });
    summary = `Added new flashcard #${newFlashcard.cardId}.`;
  } else if (isUpdatingOtherFields) {
    const {
      description,
      category,
      "main-topic": mainTopic,
      "sub-topic": subTopic,
    } = otherDetails;
    const changedFields = [];

    if (category !== undefined && card.category !== category) {
      updateQuery.$set = { ...updateQuery.$set, category };
      changes.push({
        field: "Category",
        oldValue: card.category,
        newValue: category,
      });
      changedFields.push("Category");
    }
    if (mainTopic !== undefined && card["main-topic"] !== mainTopic) {
      updateQuery.$set = { ...updateQuery.$set, "main-topic": mainTopic };
      changes.push({
        field: "Main Topic",
        oldValue: card["main-topic"],
        newValue: mainTopic,
      });
      changedFields.push("Main Topic");
    }
    if (subTopic !== undefined && card["sub-topic"] !== subTopic) {
      updateQuery.$set = { ...updateQuery.$set, "sub-topic": subTopic };
      changes.push({
        field: "Sub Topic",
        oldValue: card["sub-topic"],
        newValue: subTopic,
      });
      changedFields.push("Sub Topic");
    }
    if (description !== undefined && card.description !== description) {
      updateQuery.$set = { ...updateQuery.$set, description };
      changes.push({
        field: "Description",
        oldValue: card.description,
        newValue: description,
      });
      changedFields.push("Description");
    }
    if (changedFields.length > 0) {
      summary = `Updated ${changedFields.join(", ")}.`;
    }
  }

  if (changes.length > 0) {
    const logEntry = {
      eventType: "updated",
      user: userId,
      summary: summary || "Card updated.",
      changes,
    };

    if (updateQuery.$push) {
      updateQuery.$push.logs = logEntry;
    } else {
      updateQuery.$push = { logs: logEntry };
    }

    if (updateQuery.$set) {
      updateQuery.$set.lastUpdatedBy = userId;
    } else {
      updateQuery.$set = { lastUpdatedBy: userId };
    }

    return Card.findOneAndUpdate({ _id: { $eq: _id } }, updateQuery, options);
  }

  return card; // No changes made
}

module.exports = {
  cardsByCategory,
  createNewCard,
  getAllCards,
  getCardById,
  getCardsByIds,
  updateCard,
  getTextFromHTML,
};
