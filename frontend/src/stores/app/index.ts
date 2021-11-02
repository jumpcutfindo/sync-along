import { createSlice } from "@reduxjs/toolkit";

interface AppState {
    loggedIn: boolean;
    user?: {
        name: string;
    };
}

const initialState: AppState = {
    loggedIn: localStorage.getItem("user") !== null,
    user:
        localStorage.getItem("user") !== null
            ? { name: localStorage.getItem("user") as string }
            : undefined,
};

const saveUsernameLocal = (username: string | undefined) => {
    if (username) localStorage.setItem("user", username);
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
        },
        appLogin(state) {
            state.loggedIn = true;
            saveUsernameLocal(state.user?.name);
        },
        appLogout(state) {
            state.loggedIn = false;
            state.user = undefined;
            saveUsernameLocal(undefined);
        },
    },
});

export const appReducer = appSlice.reducer;
export const { appLogin, appLogout, storeUser } = appSlice.actions;
