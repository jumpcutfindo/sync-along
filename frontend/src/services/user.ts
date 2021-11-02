import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "src/constants/env";

interface AuthResponse {
    username: string;
    accessToken?: string;
}

interface LoginParams {
    username: string;
    password: string;
}

const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: BACKEND_URL }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginParams>({
            query: (body) => ({
                url: "/login",
                method: "POST",
                credentials: "include",
                body,
            }),
        }),
        register: builder.mutation<any, LoginParams>({
            query: (body) => ({
                url: "/register",
                method: "POST",
                body,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
                credentials: "include",
            }),
        }),
    }),
});

export default userApi;
