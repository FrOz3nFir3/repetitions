import {createSlice} from "@reduxjs/toolkit";
import {addCard} from "../actions/cards";

var initialState = [
  {"main-topic":"javascript", "sub-topic":"fundamentals", category:"programming", review:[]},
  {"main-topic":"javascript", "sub-topic":"dom", category:"programming", review:[]},
  {"main-topic":"react", "sub-topic":"fundamentals", category:"programming", review:[]},

]

export const cards = createSlice({
  name:'cards',
  initialState,
  reducers:{

  },
  extraReducers:(builder)=>{
    builder.addCase(addCard, (state, action) => {
      // "mutate" the array by calling push()
      state.push(action.payload)
    })
  }
})
