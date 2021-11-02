import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "src/constants/env";

interface RoomParams {
    username: string;
}

interface RoomResponse {
    code: string;
}

const roomApi = createApi({
    reducerPath: "roomApi",
    baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL }),
    endpoints: (builder) => ({
        generateRoomCode: builder.mutation<RoomResponse, RoomParams>({
            query: (body) => ({
                url: "/room/create",
                method: "POST",
                body,
            }),
        }),
        removeRoom: builder.mutation<any, RoomParams>({
            query: (body) => ({
                url: "/room/delete",
                method: "POST",
                body,
            }),
        }),
    }),
});

export default roomApi;
