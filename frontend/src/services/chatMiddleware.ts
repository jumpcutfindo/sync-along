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

            const { type, payload, ...rest } = action;
            // Filters out actions that are not related to chat functionality
            if (!type.startsWith("chat") && !(type === "room/joinRoom")) {
                return next(action);
            }

            const { types, promise } = action.payload;
            const [REQUEST, SUCCESS, FAILURE] = types;
            next({ ...rest, type: REQUEST });

            return promise(socket)
                .then((result: { text: string }) => {
                    return next({ ...rest, result, type: SUCCESS });
                })
                .catch((error: Error) => {
                    return next({ ...rest, error, type: FAILURE });
                });
        };
};

export default chatMiddleware;
