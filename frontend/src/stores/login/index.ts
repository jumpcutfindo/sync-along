// eslint-disable @typescript-eslint/no-param-reassign
import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
    name: "login",
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        signIn: (state) => {
            state.isLoggedIn = true;
        },
        signOut: (state) => {
            state.isLoggedIn = false;
        },
    },
});

export const { signIn, signOut } = loginSlice.actions;

export default loginSlice.reducer;
