/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { BACKEND_URL } from "src/constants/env";

import Types from "Types";
import { connectSocketAction, disconnectSocketAction } from "./actions";

const host = BACKEND_URL;

const NoConnectionError = new Error("No socket connection");

// Created an additional function for connecting sockets in case we want to reuse the socket for music
// management
export const connectSocket = createAsyncThunk<
    unknown,
    undefined,
    {
        extra: SocketClient;
    }
>(connectSocketAction, (_, { extra: socketClient }) => {
    return socketClient.connect();
});

export const disconnectSocket = createAsyncThunk<
    unknown,
    undefined,
    {
        extra: SocketClient;
    }
>(disconnectSocketAction, (_, { extra: socketClient }) => {
    return socketClient.disconnect();
});

class SocketClient {
    socket: Types.Socket | undefined;

    connect(): Promise<string> {
        this.socket = io(host);
        return new Promise((resolve, reject) => {
            if (this.socket?.connected) {
                resolve("Connected!");
                return;
            }
            this.socket?.on("connect", () => resolve("Connected!"));
            this.socket?.on("connect_error", (error: Error) => reject(error));
        });
    }

    // TODO: debug why handler does not receive acknowledgement from server
    disconnect(): Promise<string> {
        return new Promise((resolve) => {
            console.log("in disconnect socket client");
            if (!this.socket) {
                console.log("socket not here");
            }
            this.socket?.on("disconnect", () => {
                console.log("disconnected in socket io");
                this.socket = undefined;
                return resolve("Disconnected!");
            });
            resolve("");
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    emit<EmitArgs, EmitResponse>(
        event: string,
        data: EmitArgs
    ): Promise<EmitResponse> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject(NoConnectionError);
            }
            return this.socket.emit(
                event,
                data,
                (response: EmitResponse & { error: Error }) => {
                    if (response?.error) {
                        console.error(response?.error);
                        return reject(response?.error);
                    }
                    return resolve(response);
                }
            );
        });
    }

    on(event: string, handler: (...args: any[]) => void): unknown {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject(NoConnectionError);
            }
            this.socket.on(event, handler);
            return resolve(`Performed ${event}`);
        });
    }
}

export default SocketClient;
