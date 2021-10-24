import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { io } from "socket.io-client";

export interface Message {
    id: number;
    room: string;
    userName: string;
    text: string;
}

const chatApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: (build) => ({
        getMessages: build.query<Message[], string>({
            query: (room) => `messages/${room}`,
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                const socket = io("/");
                console.log(arg);
                try {
                    // wait for initial query to resolve before proceeding
                    await cacheDataLoaded;

                    // when data is received from socket connection to server
                    const listener = (event: Message) => {
                        updateCachedData((draft) => {
                            draft.push(event);
                        });
                    };
                    socket.on("message", listener);
                } catch {
                    // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`
                }
                await cacheEntryRemoved;
                socket.close();
            },
        }),
    }),
});

export default chatApi;
