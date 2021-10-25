import React from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";

import useNavigator from "src/hooks/useNavigator";

import { appLogout } from "src/stores/app";
import { updateAccessToken } from "src/stores/auth";

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
        <button type="button" className="btn btn-danger" onClick={logout}>
            Log Out
        </button>
    );
};

const RoomButton: React.FC = () => {
    return (
        <button type="button" className="btn btn-primary me-2">
            Room
        </button>
    );
};

const PlaylistsButton: React.FC = () => {
    return (
        <button type="button" className="btn btn-primary me-2">
            My Playlists
        </button>
    );
};

const DashboardControls: React.FC = () => {
    return (
        <div className="DashboardControls d-flex">
            <div className="DashboardNavigation d-flex align-items-center justify-content-start flex-grow-1">
                <RoomButton />
                <PlaylistsButton />
            </div>
            <div className="d-flex">
                <LogOutButton />
            </div>
        </div>
    );
};

export default DashboardControls;
