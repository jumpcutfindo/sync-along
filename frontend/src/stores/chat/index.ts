/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAction } from "@reduxjs/toolkit";
import SocketClient from "src/services/SocketClient";

export const sendMessage = createAction("chat/sendMessage", (text: string) => {
    return {
        payload: {
            text,
            types: [
                "chat/sendMessage/REQUEST",
                "chat/sendMessage/SUCCESS",
                "chat/sendMessage/FAILURE",
            ],
            promise: (socket: SocketClient) => socket.emit("chatMessage", text),
        },
    };
});

export const updateMessages = createAction("message/getMessage", (data) => {
    return {
        payload: {
            id: data.time,
            username: data.username,
            text: data.text,
        },
    };
});

export const joinRoom = createAction(
    "room/joinRoom",
    ({ username, room }: { username: string; room: string }) => {
        return {
            payload: {
                types: [
                    "room/joinRoom/REQUEST",
                    "room/joinRoom/SUCCESS",
                    "room/joinRoom/FAILURE",
                ],
                promise: async (socket: SocketClient) => {
                    await socket.connect();
                    const res = await socket.emit("joinRoom", {
                        username,
                        room,
                    });
                    return res;
                },
            },
        };
    }
);

export const receiveMessages = createAction("chat/getMessages", (dispatch) => {
    return {
        payload: {
            types: [
                "chat/getMessages/REQUEST",
                "chat/getMessages/SUCCESS",
                "chat/getMessages/FAILURE",
            ],
            promise: async (socket: SocketClient) => {
                await socket.connect();

                return socket.on("message", (data) => {
                    dispatch(updateMessages(data));
                });
            },
        },
    };
});

export const stopReceiveMessages = createAction("chat/stopMessages", () => {
    return {
        payload: {
            types: [
                "chat/stopMessages/REQUEST",
                "chat/stopMessages/SUCCESS",
                "chat/stopMessages/FAILURE",
            ],
            promise: (socket: SocketClient) => {
                return socket.disconnect();
            },
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
