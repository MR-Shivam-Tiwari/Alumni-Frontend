import { createSlice } from "@reduxjs/toolkit";




const webSocketSlice = createSlice({
    name: "webSocket",
    initialState: {
        ws: null,
    },
    reducers: {
        setWebSocket: (state, action) => {
           
                state.wsUrl = action.payload;
           

        },
        closeWebSocket: (state) => {
            state.wsUrl = null;
        },
    },
});

export const { setWebSocket, closeWebSocket } = webSocketSlice.actions;
export const webSocketReducer = webSocketSlice.reducer;




