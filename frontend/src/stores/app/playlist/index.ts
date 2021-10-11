import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Media {
    url: string;
    name: string;
    duration: number;
}

interface PlaylistState {
    media: Media[];
    current: Media | null;
    currentIndex: number;
}

const initialState: PlaylistState = {
    media: [],
    current: null,
    currentIndex: -1,
};

export const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        addMedia(state, action: PayloadAction<Media>) {
            state.media.push(action.payload);

            if (state.currentIndex === -1) {
                state.currentIndex = 0;
                // eslint-disable-next-line prefer-destructuring
                state.current = state.media[0];
            }
        },
        nextMedia(state) {
            state.currentIndex += 1;
            state.current = state.media[state.currentIndex];

            if (state.currentIndex >= state.media.length) {
                state.currentIndex = 0;
                // eslint-disable-next-line prefer-destructuring
                state.current = state.media[0];
            }
        },
        prevMedia(state) {
            state.currentIndex -= 1;
            state.current = state.media[state.currentIndex];

            if (state.currentIndex < 0) {
                state.currentIndex = 0;
                // eslint-disable-next-line prefer-destructuring
                state.current = state.media[0];
            }
        },
    },
});

export const playlistReducer = playlistSlice.reducer;
export const { addMedia, nextMedia, prevMedia } = playlistSlice.actions;
