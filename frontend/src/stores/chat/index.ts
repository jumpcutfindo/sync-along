import { createSlice } from "@reduxjs/toolkit";

interface ChatStore {
    socket?: any;
}

const initialState: ChatStore = {};

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        initialiseSocketConnection(state, action) {
            state.socket = action.payload.socket;
        },
    },
});

export const authReducer = chatSlice.reducer;
export const { initialiseSocketConnection } = chatSlice.actions;
