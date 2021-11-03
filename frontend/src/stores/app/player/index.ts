import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SocketClient from "src/services/SocketClient";
import {
    completeAction,
    playAction,
    seekAction,
    updatePlayerAction,
} from "./actions";

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
    number,
    { extra: SocketClient }
>(playAction, (currentTime, { extra: socketClient }) => {
    return socketClient.emit("player/play", currentTime);
});

export const pauseSong = createAsyncThunk<
    unknown,
    number,
    { extra: SocketClient }
>(playAction, (currentTime, { extra: socketClient }) => {
    return socketClient.emit("player/pause", currentTime);
});

export const seekSong = createAsyncThunk<
    unknown,
    number,
    { extra: SocketClient }
>(seekAction, (seekTime, { extra: socketClient }) => {
    return socketClient.emit("player/scrub", seekTime);
});

export const completeSong = createAsyncThunk<
    unknown,
    undefined,
    { extra: SocketClient }
>(completeAction, (undef, { extra: socketClient }) => {
    return socketClient.emit("player/complete", {});
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
        startPlayer(state) {
            state.isPlaying = true;
        },
        stopPlayer(state) {
            state.isPlaying = false;
        },
        resetPlayer(state) {
            state = JSON.parse(JSON.stringify(initialState));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updatePlayer, (state, action) => {
            const { isPlaying, lastScrubTime, lastUpdateTime } = action.payload;

            state.isPlaying = isPlaying;
            state.lastScrubTime = lastScrubTime;
            state.lastUpdateTime = lastUpdateTime;
        });
    },
});

export const playerReducer = playerSlice.reducer;
export const { startPlayer, stopPlayer, resetPlayer } = playerSlice.actions;
