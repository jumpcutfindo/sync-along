/* eslint-disable @typescript-eslint/ban-types */
/**
 * A middleware for handling socket requests
 */

import { Middleware } from "redux";
import SocketClient from "src/services/SocketClient";
import Types from "Types";

const chatMiddleware = (
    socket: SocketClient
): Middleware<{}, Types.RootState> => {
    return ({ dispatch, getState }) =>
        (next) =>
        (action) => {
            if (typeof action === "function") {
                return action(dispatch, getState);
            }

            const { promise, type, ...rest } = action;
            // Filters out actions that are not related to chat functionality
            if (!type.startsWith("chat") || !promise) {
                return next(action);
            }

            next({ ...rest, type: "REQUEST" });

            return promise(socket)
                .then((result: { text: string }) => {
                    return next({ ...rest, result, type: "SUCCESS" });
                })
                .catch((error: Error) => {
                    console.log("error here!");
                    return next({ ...rest, error, type: "FAILURE" });
                });
        };
};

export default chatMiddleware;
