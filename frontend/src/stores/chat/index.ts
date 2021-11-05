/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import SocketClient from "src/services/socket/SocketClient";
import {
    receiveMessagesAction,
    sendMessageAction,
    updateMessagesAction,
} from "src/stores/chat/actions";

export const updateMessages = createAction(updateMessagesAction, (data) => {
    return {
        payload: {
            id: data.time,
            username: data.username,
            text: data.text,
        },
    };
});

export const sendMessage = createAsyncThunk<
    unknown,
    string,
    {
        extra: SocketClient;
    }
>(sendMessageAction, (text: string, { extra: socketClient }) => {
    return socketClient.emit("chat/message", text);
});

// TODO: add handlers if socket.io times out.
export const receiveMessages = createAsyncThunk<
    unknown,
    undefined,
    {
        extra: SocketClient;
    }
>(receiveMessagesAction, (_, { dispatch, extra: socketClient }) => {
    return socketClient.on("message", (data) => dispatch(updateMessages(data)));
});

export type Messages = {
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
    reducers: {
        resetChat(state) {
            state.messages = [];
        },
    },
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
export const { resetChat } = chatSlice.actions;
