/* eslint-disable @typescript-eslint/ban-types */
/**
 * A middleware for handling socket requests
 */

import { Middleware } from "redux";
import Types from "Types";

const chatMiddleware = (
    socket: Types.Socket
): Middleware<{}, Types.RootState> => {
    return ({ dispatch, getState }) =>
        (next) =>
        (action) => {
            if (typeof action === "function") {
                return action(dispatch, getState);
            }

            const { promise, type, ...rest } = action;
            // Filters out actions that are not related to chat functionality
            if (type !== "chat" || !promise) {
                return next(action);
            }

            next({ ...rest, type: "REQUEST" });

            return promise(socket)
                .then((result: { text: string }) => {
                    return next({ ...rest, result, type: "SUCCESS" });
                })
                .catch((error: Error) => {
                    return next({ ...rest, error, type: "FAILURE" });
                });
        };
};

export default chatMiddleware;
