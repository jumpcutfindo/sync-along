/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";
import userApi from "src/services/user";
import useNavigator from "src/hooks/useNavigator";

import { appLogout } from "src/stores/app";
import { storeRoomCode, leaveRoom as leaveRoomAction, resetRoom } from "src/stores/room";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { setToastMessage, toastSlice } from "src/stores/app/toasts";
import { resetPlaylist } from "src/stores/app/playlist";
import { resetPlayer } from "src/stores/app/player";
import { resetChat } from "src/stores/chat";

const UserInfoButton: React.FC = () => {
    const isLoggedIn = useAppSelector((state) => state.app.loggedIn);
    const username = useAppSelector((state) => state.app.user?.name);

    if (!isLoggedIn || !username) return null;

    return (
        <button type="button" className="btn btn-outline-light d-flex me-2">
            <FontAwesomeIcon icon={faUser} className="my-auto me-2" />
            {username}
        </button>
    );
};

const LogOutButton: React.FC<{ leaveRoom: () => void }> = (props) => {
    const { leaveRoom } = props;
    const dispatch = useAppDispatch();
    const { navToLogin } = useNavigator();

    const inRoom = useAppSelector((state) => state.room.roomCode);

    const [logout, { isSuccess, isLoading }] =
        userApi.endpoints.logout.useMutation();

    useEffect(() => {
        if (isSuccess) {
            if (inRoom) leaveRoom();
            dispatch(appLogout());
            navToLogin();

            dispatch(
                setToastMessage({
                    type: "success",
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

const LeaveRoomButton: React.FC<{ leaveRoom: () => void }> = (props) => {
    const { leaveRoom } = props;

    const inRoom = useAppSelector((state) => state.room.roomCode);

    if (!inRoom) return null;

    const onLeaveRoom = () => leaveRoom();

    return (
        <button
            type="button"
            className="btn btn-danger me-2"
            onClick={onLeaveRoom}
        >
            Leave Room
        </button>
    );
};

const DashboardControls: React.FC = () => {
    const dispatch = useAppDispatch();
    const { navToDashboard } = useNavigator();

    const leaveRoom = () => {
        dispatch(leaveRoomAction());
        dispatch(storeRoomCode(undefined));
        dispatch(resetPlaylist());
        dispatch(resetPlayer());
        dispatch(resetChat());
        dispatch(resetRoom());
        navToDashboard();
    };

    return (
        <div className="DashboardControls d-flex">
            <div className="DashboardNavigation d-flex align-items-center justify-content-start flex-grow-1">
                <LeaveRoomButton leaveRoom={leaveRoom} />
            </div>
            <div className="d-flex">
                <UserInfoButton />
                <LogOutButton leaveRoom={leaveRoom} />
            </div>
        </div>
    );
};

export default DashboardControls;
