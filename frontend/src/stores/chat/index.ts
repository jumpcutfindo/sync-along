/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAction } from "@reduxjs/toolkit";

import Types from "Types";

export const sendMessage = createAction("chat", (text: string) => {
    return {
        payload: {
            text,
            promise: (socket: Types.Socket) => socket.emit("chatMessage", text),
        },
    };
});

export const updateMessages = createAction("chat", (data) => {
    return {
        payload: {
            id: data.time,
            username: data.username,
            text: data.text,
        },
    };
});

export const receiveMessages = createAction("chat", (dispatch) => {
    return {
        payload: {
            promise: (socket: Types.Socket) =>
                socket.on("message", (data) => {
                    dispatch("chat", updateMessages(data));
                }),
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
