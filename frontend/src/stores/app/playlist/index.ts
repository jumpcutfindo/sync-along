import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Media {
    url: string;
    name: string;
    duration: number;
}

interface PlaylistState {
    media: Media[];
    current: Media | null;
}

const initialState: PlaylistState = {
    media: [],
    current: null,
};

export const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        setMedia(state, action: PayloadAction<Media>) {
            state.current = action.payload;
        },
        addMedia(state, action: PayloadAction<Media>) {
            state.media.push(action.payload);
        },
        removeMedia(state, action: PayloadAction<Media>) {
            state.media = state.media.filter((song) => song !== action.payload);
        },
    },
});

export const playlistReducer = playlistSlice.reducer;
export const { addMedia, removeMedia } = playlistSlice.actions;
