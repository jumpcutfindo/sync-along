import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    accessToken?: string;
}

const initialState: AuthState = {};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateAccessToken(state, action: PayloadAction<string | undefined>) {
            state.accessToken = action.payload;
        },
    },
});

export const authReducer = authSlice.reducer;
export const { updateAccessToken } = authSlice.actions;
