/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";
import userApi from "src/services/user";
import useNavigator from "src/hooks/useNavigator";

import { appLogout } from "src/stores/app";
import { storeRoomCode } from "src/stores/room";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { setToastMessage, toastSlice } from "src/stores/app/toasts";

const UserInfoButton: React.FC = () => {
    const username = useAppSelector((state) => state.app.user?.name);

    if (!username) return null;

    return (
        <button type="button" className="btn btn-outline-light d-flex me-2">
            <FontAwesomeIcon icon={faUser} className="my-auto me-2" />
            {username}
        </button>
    );
};

const LogOutButton: React.FC = () => {
    const dispatch = useAppDispatch();
    const { navToLogin } = useNavigator();

    const [logout, { isSuccess, isLoading }] =
        userApi.endpoints.logout.useMutation();

    useEffect(() => {
        if (isSuccess) {
            dispatch(storeRoomCode(undefined));
            dispatch(appLogout());
            navToLogin();

            dispatch(
                setToastMessage({
                    type: "danger",
                    message: "Successfully logged out of Sync-Along.",
                })
            );
        }
    }, [isSuccess, isLoading]);

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
                <UserInfoButton />
                <LogOutButton />
            </div>
        </div>
    );
};

export default DashboardControls;
