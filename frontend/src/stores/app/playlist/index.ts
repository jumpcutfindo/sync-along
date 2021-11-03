/* eslint-disable @typescript-eslint/no-shadow */
import {
    createAction,
    createAsyncThunk,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import { url } from "inspector";
import { useAppSelector } from "src/hooks/typedReduxHooks";
import SocketClient from "src/services/socket/SocketClient";
import { RootState } from "Types";

import {
    selectSongAction,
    addSongAction,
    removeSongAction,
    updatePlayerAction as updatePlaylistAction,
    nextSongAction,
    prevSongAction,
} from "./actions";

export interface Media {
    id: string;
    url: string;
    name: string;
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

export const updatePlaylist = createAction(updatePlaylistAction, (data) => {
    const { playlist, current } = JSON.parse(data);

    const payload = { playlist, current };

    return { payload };
});

export const addSong = createAsyncThunk<
    unknown,
    string,
    { extra: SocketClient }
>(addSongAction, (url, { extra: socketClient }) => {
    return socketClient.emit("playlist/add", { url });
});

export const selectSong = createAsyncThunk<
    unknown,
    string,
    { extra: SocketClient }
>(selectSongAction, (id, { extra: socketClient }) => {
    return socketClient.emit("playlist/select", { id });
});

export const removeSong = createAsyncThunk<
    unknown,
    string,
    { extra: SocketClient }
>(removeSongAction, (id, { extra: socketClient }) => {
    return socketClient.emit("playlist/remove", { id });
});

export const nextSong = createAsyncThunk<
    unknown,
    undefined,
    { extra: SocketClient }
>(nextSongAction, (undef, { extra: socketClient }) => {
    return socketClient.emit("playlist/next", {});
});

export const prevSong = createAsyncThunk<
    unknown,
    undefined,
    { extra: SocketClient }
>(prevSongAction, (undef, { extra: socketClient }) => {
    return socketClient.emit("playlist/prev", {});
});

export const receivePlaylistUpdates = createAsyncThunk<
    unknown,
    undefined,
    { extra: SocketClient }
>(updatePlaylistAction, (_, { dispatch, extra: socketClient }) => {
    return socketClient.on("playlist/update", (data) => {
        dispatch(updatePlaylist(data));
    });
});

export const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        resetPlaylist(state) {
            state.media = [];
            state.current = null;
            state.currentIndex = -1;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updatePlaylist, (state, action) => {
            const { playlist, current } = action.payload;

            // Update the current playlist with the data from the server
            state.media = playlist.map((song: any) => {
                return {
                    id: song.id,
                    url: song.url,
                    name: song.url,
                };
            });

            // Avoid having to search if there isn't a song set to play
            if (!current) return;

            // If there is a song set to play, try to find it and play it on our end
            const currentSong = state.media.find(
                (song) => song.id === current.id
            );

            if (currentSong) state.current = currentSong;
        });
    },
});

export const playlistReducer = playlistSlice.reducer;
export const { resetPlaylist } = playlistSlice.actions;
