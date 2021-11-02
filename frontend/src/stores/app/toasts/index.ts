import { createSlice } from "@reduxjs/toolkit";

interface ToastStore {
    message?: string;
    type?: string;
}

const initialState: ToastStore = {};

export const toastSlice = createSlice({
    name: "toasts",
    initialState,
    reducers: {
        setToastMessage(state, action) {
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
    },
});

export const toastReducer = toastSlice.reducer;
export const { setToastMessage } = toastSlice.actions;
