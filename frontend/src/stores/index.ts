import { configureStore } from "@reduxjs/toolkit";

// State slices
import loginReducer from "./login";

export const store = configureStore({
    reducer: {
        login: loginReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
