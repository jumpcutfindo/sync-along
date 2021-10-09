import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
    loggedIn: boolean;
}

const initialState: AppState = {
    loggedIn: false,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        login(state, action: PayloadAction<undefined>) {
            state.loggedIn = true;
        },
        logout(state, action: PayloadAction<undefined>) {
            state.loggedIn = false;
        }
    },
});

export const appReducer = appSlice.reducer;
export const { login, logout } = appSlice.actions;
