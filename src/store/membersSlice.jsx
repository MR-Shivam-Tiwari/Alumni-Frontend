import { createSlice } from "@reduxjs/toolkit";




const memberSlice = createSlice({
    name: "member",
    initialState: {
      members: [], 
  },
    reducers: {
      updateMember: (state, action) => {
        state.members = [...state.members, ...action.payload];
      },
    },
  });
  
  export const { updateMember } = memberSlice.actions;
  export const memberReducer = memberSlice.reducer;