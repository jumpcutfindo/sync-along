import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SocketClient from "src/services/SocketClient";
import Types from "Types";

import { joinRoomAction, leaveRoomAction } from "./actions";

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

interface RoomStore {
    roomCode?: string;
}

const initialState: RoomStore = {};

export const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        storeRoomCode(state, action) {
            state.roomCode = action.payload;
        },
    },
});

export const selectRoomCode = (state: Types.RootState) => state.room.roomCode;

export const roomReducer = roomSlice.reducer;
export const { storeRoomCode } = roomSlice.actions;
