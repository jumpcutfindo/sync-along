import { createSlice } from "@reduxjs/toolkit";

interface ToastStore {
    message?: string;
    type?: string;
    hasShown: boolean;
}

const initialState: ToastStore = {
    hasShown: true,
};

export const toastSlice = createSlice({
    name: "toasts",
    initialState,
    reducers: {
        setToastMessage(state, action) {
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.hasShown = false;
        },
        setShown(state, action) {
            state.hasShown = action.payload;
        },
    },
});

export const toastReducer = toastSlice.reducer;
export const { setToastMessage, setShown } = toastSlice.actions;
