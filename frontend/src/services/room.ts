import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface RoomParams {
    accessToken: string;
}

interface RoomResponse {
    roomCode: string;
}

const roomApi = createApi({
    reducerPath: "roomApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
    endpoints: (builder) => ({
        generateRoomCode: builder.mutation<RoomResponse, RoomParams>({
            query: (body) => ({
                url: "/room/new",
                method: "POST",
                body,
            }),
        }),
        removeRoom: builder.mutation<any, RoomParams>({
            query: (body) => ({
                url: "/room/remove",
                method: "POST",
                body,
            }),
        }),
    }),
});

export default roomApi;
