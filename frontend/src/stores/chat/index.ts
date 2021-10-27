/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAction } from "@reduxjs/toolkit";
import SocketClient from "src/services/SocketClient";

export const sendMessage = createAction("chat/sendMessage", (text: string) => {
    return {
        payload: {
            text,
            promise: (socket: SocketClient) => socket.emit("chatMessage", text),
        },
    };
});

export const updateMessages = createAction("chat/getMessage", (data) => {
    return {
        payload: {
            id: data.time,
            username: data.username,
            text: data.text,
        },
    };
});

export const receiveMessages = createAction("chat/getMessages", (dispatch) => {
    return {
        payload: {
            promise: (socket: SocketClient) =>
                socket.on("message", (data) => {
                    dispatch("chat", updateMessages(data));
                }),
        },
    };
});

export const stopReceiveMessages = createAction("chat/stopMessages", () => {
    return {
        payload: {
            promise: (socket: SocketClient) => socket.disconnect(),
        },
    };
});

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
        builder.addCase(updateMessages, (state, action) => {
            const { id, username, text } = action.payload;
            state.messages.push({
                id,
                text,
                username,
            });
        });
    },
});

export const chatReducer = chatSlice.reducer;
