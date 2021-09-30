import React from "react";

// eslint-disable-next-line import/no-named-as-default
import DashboardState from "../DashboardState";

const LoginButton: React.FC = () => {
    return (
        <button type="button" className="btn btn-primary">
            Log In
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DashboardControls: React.FC<{ state: DashboardState }> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state } = props;

    return (
        <div className="DashboardControls d-flex">
            <div className="DashboardNavigation d-flex align-items-center justify-content-start flex-grow-1">
                <RoomButton />
                <PlaylistsButton />
            </div>
            <div className="DashboardLogin d-flex flex-grow-0 justify-content-end">
                <LoginButton />
            </div>
        </div>
    );
};

export default DashboardControls;
