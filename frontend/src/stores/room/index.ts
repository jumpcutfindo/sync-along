import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import Types from "Types";
import SocketClient from "src/services/SocketClient";

import { PlayerState } from "src/stores/app/player";
import { PlaylistState } from "src/stores/app/playlist";
import { createRoomAction, joinRoomAction } from "./actions";

interface RoomStore {
    roomCode?: string;
}

const initialState: RoomStore = {};

type JoinRoomArgs = {
    username: string;
    room: string;
};

type CreateRoomArgs = {
    username: string;
};

type CreateRoomResponse = {
    code: string;
    playlist: PlaylistState;
    player: PlayerState;
};

export const createRoom = createAsyncThunk<
    CreateRoomResponse,
    CreateRoomArgs,
    {
        extra: SocketClient;
    }
>(createRoomAction, async ({ username }, thunkApi) => {
    const socketClient = thunkApi.extra;
    return new Promise((resolve, reject) => {
        socketClient
            .connect()
            .then(() => {
                return socketClient.emit("room/create", {
                    username,
                });
            })
            .then((res) => {
                return resolve(res);
            })
            .catch((err) => reject(err));
    });
});

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
                return socketClient.emit("room/join", {
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
