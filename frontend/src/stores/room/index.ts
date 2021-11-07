import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

import Types from "Types";
import SocketClient from "src/services/socket/SocketClient";

import { PlayerState } from "src/stores/app/player";
import { PlaylistState } from "src/stores/app/playlist";
import {
    createRoomAction,
    joinRoomAction,
    leaveRoomAction,
    updateRoomAction,
} from "./actions";

interface RoomStore {
    roomCode?: string;
}

const initialState: RoomStore = {};

export const updateRoom = createAction(updateRoomAction, (data) => {
    const { users, userCount } = JSON.parse(data);
    const payload = { users, userCount };

    return { payload };
});

type JoinRoomArgs = {
    username: string;
    room: string;
};

type CreateRoomArgs = {
    username: string;
};

export type CreateRoomResponse = {
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
    return socketClient.emit<CreateRoomArgs, CreateRoomResponse>(
        "room/create",
        {
            username,
        }
    );
});

export const joinRoom = createAsyncThunk<
    CreateRoomResponse,
    JoinRoomArgs,
    {
        extra: SocketClient;
    }
>(joinRoomAction, async ({ username, room }, thunkApi) => {
    const socketClient = thunkApi.extra;
    return socketClient.emit("room/join", {
        username,
        room,
    });
});

export const leaveRoom = createAsyncThunk<void, void, { extra: SocketClient }>(
    leaveRoomAction,
    async (_, thunkApi) => {
        const socketClient = thunkApi.extra;
        return socketClient.emit("room/leave");
    }
);

export const receiveRoomUpdates = createAsyncThunk<
    unknown,
    undefined,
    { extra: SocketClient }
>(updateRoomAction, (_, { dispatch, extra: socketClient }) => {
    return socketClient.on("playlist/update", (data) => {
        dispatch(updateRoom(data));
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
    extraReducers: (builder) => {
        builder.addCase(updateRoom, (state, action) => {
            const { users, userCount } = action.payload;

            console.log(users, userCount);
        });
    },
});

export const selectRoomCode = (state: Types.RootState) => state.room.roomCode;

export const roomReducer = roomSlice.reducer;
export const { storeRoomCode } = roomSlice.actions;
