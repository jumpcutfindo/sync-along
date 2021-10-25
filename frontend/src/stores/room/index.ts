import { createSlice } from "@reduxjs/toolkit";

import Types from "Types";

interface RoomStore {
    roomCode?: string;
}

const initialState: RoomStore = {};

export const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        storeRoomCode(state, action) {
            state.roomCode = action.payload.roomCode;
        },
    },
});

export const selectRoomCode = (state: Types.RootState) => state.room.roomCode;

export const roomReducer = roomSlice.reducer;
export const { storeRoomCode } = roomSlice.actions;
