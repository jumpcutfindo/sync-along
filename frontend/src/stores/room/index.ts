import { createSlice } from "@reduxjs/toolkit";

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

export const roomReducer = roomSlice.reducer;
export const { storeRoomCode } = roomSlice.actions;
