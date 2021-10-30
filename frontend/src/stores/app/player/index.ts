import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SocketClient from "src/services/SocketClient";
import { playAction, updatePlayerAction } from "./actions";

interface PlayerState {
    isPlaying: boolean;
    lastScrubTime: number;
    lastUpdateTime: number;
}

const initialState: PlayerState = {
    isPlaying: false,
    lastScrubTime: 0,
    lastUpdateTime: Date.now(),
};

export const updatePlayer = createAction(updatePlayerAction, (data) => {
    const { isPlaying, lastScrubTime, lastUpdateTime } = JSON.parse(data);

    const payload = { isPlaying, lastScrubTime, lastUpdateTime };

    return { payload };
});

export const playSong = createAsyncThunk<
    unknown,
    undefined,
    { extra: SocketClient }
>(playAction, (undef, { extra: socketClient }) => {
    return socketClient.emit("player/play", {});
});

export const pauseSong = createAsyncThunk<
    unknown,
    undefined,
    { extra: SocketClient }
>(playAction, (undef, { extra: socketClient }) => {
    return socketClient.emit("player/pause", {});
});

export const receivePlayerUpdates = createAsyncThunk<
    unknown,
    undefined,
    { extra: SocketClient }
>(updatePlayerAction, (_, { dispatch, extra: socketClient }) => {
    return socketClient.on("player/update", (data) => {
        dispatch(updatePlayer(data));
    });
});

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        play(state) {
            state.isPlaying = true;
        },
        stop(state) {
            state.isPlaying = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updatePlayer, (state, action) => {
            const { isPlaying, lastScrubTime, lastUpdateTime } = action.payload;

            state.isPlaying = isPlaying;
            state.lastScrubTime = lastScrubTime;
            state.lastUpdateTime = lastUpdateTime;

            console.log(state);
        });
    },
});

export const playerReducer = playerSlice.reducer;
export const { play, stop } = playerSlice.actions;
