import { createSlice } from "@reduxjs/toolkit";
import cookies from "js-cookie";

interface AppState {
    loggedIn: boolean;
    user?: {
        name: string;
    };
}

const initialState: AppState = {
    loggedIn: cookies.get("connect.sid") !== null,
    user:
        localStorage.getItem("user") !== null
            ? { name: localStorage.getItem("user") as string }
            : undefined,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        storeUser(state, action) {
            const { name } = action.payload;
            state.user = {
                name,
            };

            localStorage.setItem("user", name);
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
