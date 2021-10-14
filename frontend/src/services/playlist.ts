import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface PlaylistParams {
    accessToken: string;
    room: string;
}

const playlistApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
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
