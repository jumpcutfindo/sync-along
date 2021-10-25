import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SocketClient from "src/services/SocketClient";

import { selectRoomCode } from "src/stores/room";

const socketService = new SocketClient();

const sendMessage = createAsyncThunk(
    "chat/send",
    async (text, { getState }) => {
        const roomCode = selectRoomCode(getState());
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
        builder.addCase(sendMessage.pending, (state, action) => {
            state.messages.push({
                id: (action?.payload?.id) as string,
                text: `${action?.payload?.text}`,
                username: `${action?.payload?.username}`,
            });
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            state.messages = state.messages.filter(
                (msg) => msg.id !== `${action?.payload?.id}`
            );
        });
    },
});

export const chatReducer = chatSlice.reducer;
