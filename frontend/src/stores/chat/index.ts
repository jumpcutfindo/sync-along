/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import SocketClient from "src/services/SocketClient";

export const updateMessages = createAction("message/getMessage", (data) => {
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

export const joinRoomThunk = createAsyncThunk<
    void,
    JoinRoomArgs,
    {
        extra: SocketClient;
    }
>("room/joinRoom", async ({ username, room }, thunkApi) => {
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

export const sendMessage = createAsyncThunk<unknown, string, {
    extra: SocketClient
}>("chat/sendMessage", (text: string, { extra: socketClient }) => {
    return socketClient.emit("chatMessage", text);
});

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
