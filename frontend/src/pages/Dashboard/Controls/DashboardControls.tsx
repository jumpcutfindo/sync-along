import React from "react";

/*
const LoginButton: React.FC<{ onClick: () => void }> = (props) => {
    const { onClick } = props;

    return (
        <button type="button" className="btn btn-primary" onClick={onClick}>
            Log In
        </button>
    );
};
 */

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
        </div>
    );
};

export default DashboardControls;
