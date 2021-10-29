/* eslint-disable @typescript-eslint/no-shadow */
import {
    createAction,
    createAsyncThunk,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import { url } from "inspector";
import { useAppSelector } from "src/hooks/typedReduxHooks";
import SocketClient from "src/services/SocketClient";
import { RootState } from "Types";

import {
    selectSongAction,
    addSongAction,
    removeSongAction,
    playlistUpdateAction as updatePlaylistAction,
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
        setMedia(state, action: PayloadAction<number>) {
            state.currentIndex = action.payload;
            state.current = state.media[action.payload];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updatePlaylist, (state, action) => {
            const { playlist, current } = action.payload;
            console.log(action.payload);

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
export const { addMedia, nextMedia, prevMedia, setMedia } =
    playlistSlice.actions;
