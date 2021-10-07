import { configureStore } from "@reduxjs/toolkit";

// API Slices
import userApi from "src/services/user";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
