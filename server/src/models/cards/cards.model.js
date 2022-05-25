const Card = require("./cards.mongo");

async function cardsByCategory(category) {
  try {
    const cards = await Card.find({ category });
    return cards;
  } catch (e) {
    throw e;
  }
}

async function getAllCards() {
  try {
    const cards = await Card.distinct("category");
    return cards;
  } catch (e) {
    throw e;
  }
}

async function createNewCard(card) {
  try {
    const newCard = new Card(card);
    return await newCard.save();
  } catch (e) {
    throw e;
  }
}

async function getCardById(id) {
  try {
    const card = await Card.findById(id);
    return card;
  } catch (e) {
    throw e;
  }
}

async function updateCard(details) {
  const {
    _id,
    cardId,
    minimumOptions,
    optionIndex,
    option,
    question,
    answer,
    ...otherDetails
  } = details;

  try {
    let card = await getCardById(_id);

    let updatingSpecificCard = cardId != null;
    let addingNewCard = question && answer;
    let updatingOtherFields = Object.keys(otherDetails).length > 0;

    if (updatingSpecificCard) {
      let cardUpdate;
      let review = `review.${cardId - 1}`;
      if (question) {
        let questionUpdate = `${review}.question`;
        cardUpdate = { $set: { [questionUpdate]: question } };
      } else if (answer) {
        let answerUpdate = `${review}.answer`;
        cardUpdate = { $set: { [answerUpdate]: answer } };
      } else if (typeof optionIndex == "number" && option) {
        let updateOption = `${review}.options.${optionIndex}`;
        cardUpdate = { $set: { [updateOption]: option } };
      } else if (option) {
        let addOption = `${review}.options`;
        cardUpdate = { $push: { [addOption]: option } };
      } else if (minimumOptions) {
        let changeOption = `${review}.minimumOptions`;
        cardUpdate = { $set: { [changeOption]: Number(minimumOptions) } };
      }
      console.log(cardUpdate);
      card = await Card.findOneAndUpdate({ _id }, { ...cardUpdate });
    } else if (addingNewCard) {
      const cardsLength = card.review.length + 1;

      let cardDetails = {
        cardId: cardsLength,
        question,
        answer,
        minimumOptions: 2,
        options: [answer],
      };
      card = await Card.findOneAndUpdate(
        { _id },
        { $push: { review: cardDetails } }
      );
    } else if (updatingOtherFields) {
      card = await Card.findOneAndUpdate(
        { _id },
        { $set: { ...otherDetails } }
      );
    }

    return card;
  } catch (e) {
    throw e;
  }
}
module.exports = {
  cardsByCategory,
  createNewCard,
  getAllCards,
  getCardById,
  updateCard,
};
