import { createSlice } from "@reduxjs/toolkit";

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
        appLogin(state) {
            state.loggedIn = true;
        },
        appLogout(state) {
            state.loggedIn = false;
        },
    },
});

export const appReducer = appSlice.reducer;
export const { appLogin, appLogout } = appSlice.actions;
