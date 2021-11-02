import { configureStore, combineReducers } from "@reduxjs/toolkit";
// API Slices
import userApi from "src/services/user";
import roomApi from "src/services/room";

// external clients and adapters
import SocketClient from "src/services/SocketClient";

// State slices
import { authReducer, authSlice } from "./auth";
import { appReducer, appSlice } from "./app";
import { roomReducer, roomSlice } from "./room";
import { playlistReducer, playlistSlice } from "./app/playlist";
import { playerReducer, playerSlice } from "./app/player";
import { chatSlice, chatReducer } from "./chat";
import { toastReducer, toastSlice } from "./app/toasts";

const socketClient = new SocketClient();

export const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
    [roomApi.reducerPath]: roomApi.reducer,
    [authSlice.name]: authReducer,
    [appSlice.name]: appReducer,
    [playlistSlice.name]: playlistReducer,
    [playerSlice.name]: playerReducer,
    [roomSlice.name]: roomReducer,
    [chatSlice.name]: chatReducer,
    [toastSlice.name]: toastReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: socketClient,
            },
        }),
});

export default store;
