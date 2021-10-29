import React from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";

import useNavigator from "src/hooks/useNavigator";

import { appLogout } from "src/stores/app";
import { updateAccessToken } from "src/stores/auth";
import { storeRoomCode } from "src/stores/room";

const LogOutButton: React.FC = () => {
    const dispatch = useAppDispatch();
    const { navToLogin } = useNavigator();

    const logout = () => {
        // Set app's state to logged out, and also remove the access token
        dispatch(appLogout());
        dispatch(updateAccessToken(undefined));

        navToLogin();
    };

    const loggedIn = useAppSelector((state) => state.app.loggedIn);

    if (!loggedIn) return null;

    return (
        <button
            type="button"
            className="btn btn-outline-danger"
            onClick={logout}
        >
            Log Out
        </button>
    );
};

const LeaveRoomButton: React.FC = () => {
    const dispatch = useAppDispatch();
    const inRoom = useAppSelector((state) => state.room.roomCode);
    const { navToDashboard } = useNavigator();

    if (!inRoom) return null;

    const leaveRoom = () => {
        // TODO: Add functionality to actually leave the socket room on pressed
        dispatch(storeRoomCode(undefined));
        navToDashboard();
    };

    return (
        <button
            type="button"
            className="btn btn-danger me-2"
            onClick={leaveRoom}
        >
            Leave Room
        </button>
    );
};

const DashboardControls: React.FC = () => {
    return (
        <div className="DashboardControls d-flex">
            <div className="DashboardNavigation d-flex align-items-center justify-content-start flex-grow-1">
                <LeaveRoomButton />
            </div>
            <div className="d-flex">
                <LogOutButton />
            </div>
        </div>
    );
};

export default DashboardControls;
