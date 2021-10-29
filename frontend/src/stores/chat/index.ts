/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import SocketClient from "src/services/SocketClient";
import {
    connectSocketAction,
    disconnectSocketAction,
    joinRoomAction,
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

type JoinRoomArgs = {
    username: string;
    room: string;
};

export const joinRoom = createAsyncThunk<
    void,
    JoinRoomArgs,
    {
        extra: SocketClient;
    }
>(joinRoomAction, async ({ username, room }, thunkApi) => {
    const socketClient = thunkApi.extra;
    return new Promise((resolve, reject) => {
        socketClient
            .connect()
            .then(() => {
                return socketClient.emit("joinRoom", {
                    username,
                    room,
                });
            })
            .then((res) => {
                return resolve(res);
            })
            .catch((err) => reject(err));
    });
});

export const sendMessage = createAsyncThunk<
    unknown,
    string,
    {
        extra: SocketClient;
    }
>(sendMessageAction, (text: string, { extra: socketClient }) => {
    return socketClient.emit("chatMessage", text);
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

// Created an additional function for connecting sockets in case we want to reuse the socket for music
// management
export const connectSocket = createAsyncThunk<
    unknown,
    undefined,
    {
        extra: SocketClient;
    }
>(connectSocketAction, (_, { extra: socketClient }) => {
    return socketClient.connect();
});

export const disconnectSocket = createAsyncThunk<
    unknown,
    undefined,
    {
        extra: SocketClient;
    }
>(disconnectSocketAction, (_, { extra: socketClient }) => {
    return socketClient.disconnect();
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateMessages, (state, action) => {
                const { id, username, text } = action.payload;
                state.messages.push({
                    id,
                    text,
                    username,
                });
            })
            .addCase(disconnectSocket.fulfilled, (state) => {
                state.messages = [];
                return state;
            });
    },
});

export const chatReducer = chatSlice.reducer;
