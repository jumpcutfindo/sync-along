/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * A middleware for handling socket requests
 */

import { Middleware } from "redux";
import { RootState } from "src/stores";

// eslint-disable-next-line @typescript-eslint/ban-types
const chatMiddleware = (socket: any): Middleware<{}, RootState> => {
    return ({ dispatch, getState }) =>
        (next) =>
        (action) => {
            if (typeof action === "function") {
                return action(dispatch, getState);
            }

            const { promise, type, types, ...rest } = action;
            // Filters out actions that are not related to chat functionality
            if (type !== "chat" || !promise) {
                return next(action);
            }

            const [REQUEST, SUCCESS, FAILURE] = types;
            next({ ...rest, type: REQUEST });

            return promise(socket)
                .then((result: unknown) => {
                    return next({ ...rest, result, type: SUCCESS });
                })
                .catch((error: unknown) => {
                    return next({ ...rest, error, type: FAILURE });
                });
        };
};

export default chatMiddleware;
