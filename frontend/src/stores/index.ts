import { configureStore } from "@reduxjs/toolkit";

// API Slices
import userApi from "src/services/user";

// State slices
import { authReducer, authSlice } from "./auth";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [authSlice.name]: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
