/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SocketClient from "src/services/SocketClient";

import { selectRoomCode } from "src/stores/room";

import Types from "Types";

const socketService = new SocketClient();

export const sendMessage = createAsyncThunk(
    "chat",
    async (text: string, { getState }) => {
        const roomCode = selectRoomCode(getState() as Types.RootState);
        const result = await socketService.emit("message", {
            text,
            roomCode,
        });
        return result;
    }
);

type Messages = {
    id: string;
    text: string;
    username: string;
};

type ChatState = {
    messages: Messages[];
};

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
    } as ChatState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state, action) => {
                state.messages.push({
                    id: "1",
                    text: action.meta.arg,
                    username: `test`,
                });
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.messages = state.messages.filter((msg) => msg.id !== `2`);
            });
    },
});

export const chatReducer = chatSlice.reducer;
