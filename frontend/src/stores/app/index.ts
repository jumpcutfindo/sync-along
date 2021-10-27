import { createSlice } from "@reduxjs/toolkit";

interface AppState {
    loggedIn: boolean;
    user?: {
        name: string;
        id: string;
    };
}

const initialState: AppState = {
    loggedIn: false,
    user: undefined,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        storeUser(state, action) {
            const { name, id } = action.payload;
            state.user = {
                name,
                id,
            };
        },
        appLogin(state) {
            state.loggedIn = true;
        },
        appLogout(state) {
            state.loggedIn = false;
            state.user = undefined;
        },
    },
});

export const appReducer = appSlice.reducer;
export const { appLogin, appLogout, storeUser } = appSlice.actions;
