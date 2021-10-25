/* eslint-disable @typescript-eslint/no-explicit-any */
import io from "socket.io-client";

const host = "http://localhost:4000";

const NoConnectionError = new Error("No socket connection");
type Socket = ReturnType<typeof io>;

class SocketClient {
    socket: Socket | undefined;

    connect(): Promise<string> {
        this.socket = io(host);
        return new Promise((resolve, reject) => {
            this.socket?.on("connect", () => resolve("Connected!"));
            this.socket?.on("connect_error", (error: Error) => reject(error));
        });
    }

    disconnect(): Promise<string> {
        return new Promise((resolve) => {
            this.socket?.on("disconnect", () => {
                this.socket = undefined;
                resolve("Disconnected!");
            });
        });
    }

    emit(event: string, data: Record<string, unknown>): any {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                return reject(NoConnectionError);
            }

            return this.socket.emit(
                event,
                data,
                (response: { error: Error }) => {
                    if (response.error) {
                        console.error(response.error);
                        return reject(response.error);
                    }

                    return resolve("Emited event");
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
