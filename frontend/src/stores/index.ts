import { configureStore } from "@reduxjs/toolkit";

// API Slices
import userApi from "src/services/user";
import roomApi from "src/services/room";
import chatApi from "src/services/chat";

// State slices
import { authReducer, authSlice } from "./auth";
import { appReducer, appSlice } from "./app";
import { roomReducer, roomSlice } from "./room";
import { playlistReducer, playlistSlice } from "./app/playlist";
import { playerReducer, playerSlice } from "./app/player";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [roomApi.reducerPath]: roomApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [authSlice.name]: authReducer,
        [appSlice.name]: appReducer,
        [playlistSlice.name]: playlistReducer,
        [playerSlice.name]: playerReducer,
        [roomSlice.name]: roomReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
