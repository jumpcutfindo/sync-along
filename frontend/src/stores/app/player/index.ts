import { createSlice } from "@reduxjs/toolkit";

interface PlayerState {
    isPlaying: boolean;
}

const initialState: PlayerState = {
    isPlaying: false,
};

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
});

export const playerReducer = playerSlice.reducer;
export const { play, stop } = playerSlice.actions;
