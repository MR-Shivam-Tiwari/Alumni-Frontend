import { createSlice } from "@reduxjs/toolkit";




const profileSlice = createSlice({
    name: "profile",
    initialState: {
      admin: false,
    },
    reducers: {
      updateProfile: (state, action) => {
        return {
            ...state,
            ...action.payload,
          };

      },
      setAdmin: (state,action) => {
        state.admin = true;
       
      }
    },
  });
  
  export const { updateProfile,setAdmin } = profileSlice.actions;
  export const profileReducer = profileSlice.reducer;