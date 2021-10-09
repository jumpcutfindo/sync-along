import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/stores";

import { appLogout } from "src/stores/app";

const ProfileButton: React.FC<{ onClick: () => void }> = (props) => {
    const { onClick } = props;

    const loggedIn = useSelector((state: RootState) => state.app.loggedIn);

    if (!loggedIn) return null;

    return (
        <button type="button" className="btn btn-primary" onClick={onClick}>
            Profile Name
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
    const logout = () => {
        appLogout();
    };

    return (
        <div className="DashboardControls d-flex">
            <div className="DashboardNavigation d-flex align-items-center justify-content-start flex-grow-1">
                <RoomButton />
                <PlaylistsButton />
            </div>
            <div className="d-flex">
                <ProfileButton onClick={logout} />
            </div>
        </div>
    );
};

export default DashboardControls;
