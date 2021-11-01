import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "src/constants/env";

interface PlaylistParams {
    accessToken: string;
    room: string;
}

const playlistApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL }),
    endpoints: (builder) => ({
        get: builder.mutation<any, PlaylistParams>({
            query: (body) => ({
                url: "/playlist/get",
                method: "GET",
                body,
            }),
        }),
        add: builder.mutation<any, PlaylistParams>({
            query: (body) => ({
                url: "/playlist/add",
                method: "POST",
                body,
            }),
        }),
        remove: builder.mutation<any, PlaylistParams>({
            query: (body) => ({
                url: "/playlist/remove",
                method: "POST",
                body,
            }),
        }),
    }),
});

export default playlistApi;
