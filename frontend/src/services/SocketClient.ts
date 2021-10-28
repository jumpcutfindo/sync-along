/* eslint-disable @typescript-eslint/no-explicit-any */
import io from "socket.io-client";
import Types from "Types";

const host = "http://localhost:4001";

const NoConnectionError = new Error("No socket connection");
class SocketClient {
    socket: Types.Socket | undefined;

    connect(): Promise<string> {
        this.socket = io(host);
        return new Promise((resolve, reject) => {
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
    emit(event: string, data: any): any {
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
