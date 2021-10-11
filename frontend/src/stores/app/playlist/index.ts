import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Media {
    url: string;
    name: string;
    duration: number;
}

interface PlaylistState {
    songs: Media[];
}

const initialState: PlaylistState = {
    songs: [],
};

export const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        addSong(state, action: PayloadAction<Media>) {
            state.songs.push(action.payload);
        },
        deleteSong(state, action: PayloadAction<Media>) {
            state.songs = state.songs.filter((song) => song !== action.payload);
        },
    },
});

export const playlistReducer = playlistSlice.reducer;
export const { addSong, deleteSong } = playlistSlice.actions;
