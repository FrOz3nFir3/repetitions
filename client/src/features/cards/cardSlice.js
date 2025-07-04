import {  createSlice } from "@reduxjs/toolkit";

const cardSlicer = createSlice({
  name: "card",
  initialState: { card: null },
  reducers: {
    initialCard(state, action){
      state.card = action.payload;
    },
    modifyCard(state, action){
      const updateDetails = action.payload;

      if(updateDetails.cardId){
        // updating a specific flashcard
        const {_id, cardId, optionIndex, option, ...flashCardUpdate} = updateDetails;

        if(optionIndex >= 0){
          // updating a specific option
          state.card.review[cardId - 1].options[optionIndex] = option;
        }else if(option){
          // adding new option
          state.card.review[cardId - 1].options.push(option)
        } else{
            // either updating question answer or minimum options
            for (const [key, value] of Object.entries(flashCardUpdate)) {
              state.card.review[cardId - 1][key] = value;
            }
          }
        } else{
        const {
          question,
          answer
        } = updateDetails;

        if(question && answer){
          // adding new flashcard
          state.card.review.push({cardId:state.card.review.length + 1, question, answer, minimumOptions:2, options:[answer]})
        }else{
          for (const [key, value] of Object.entries(updateDetails)) {
            state.card[key] = value;
          }
        }
      }
    }
  },
});
export const { initialCard, modifyCard } = cardSlicer.actions

export const selectCurrentCard = (state) => state.card.card;

export default cardSlicer;
