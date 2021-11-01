import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "src/constants/env";

interface AuthResponse {
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
                body,
            }),
        }),
        register: builder.mutation<AuthResponse, LoginParams>({
            query: (body) => ({
                url: "/register",
                method: "POST",
                body,
            }),
        }),
        logout: builder.query({
            query: () => ({
                url: "/logout",
                method: "GET",
            }),
        }),
    }),
});

export default userApi;
