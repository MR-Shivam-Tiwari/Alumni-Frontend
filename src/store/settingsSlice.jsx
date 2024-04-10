import { createSlice } from "@reduxjs/toolkit";


const settingsSlice = createSlice({
    name: "settings",
    initialState: {
    },
    reducers: {
      updateSettings: (state, action) => {
        console.log("settings",state.settings)
        return {
            ...state,
            ...action.payload,
          };

      },
    },
  });
  
  export const { updateSettings } = settingsSlice.actions;
  export const settingsReducer = settingsSlice.reducer;