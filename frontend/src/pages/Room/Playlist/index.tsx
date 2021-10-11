import React from "react";

import "./index.css";

const PlaylistHeader: React.FC = () => (
    <div className="PlaylistHeader d-flex mb-2">
        <div className="d-flex w-100 m-3">
            <h2 className="m-0">PLAYLISTS</h2>
            <div className="PlaylistHeaderButtons d-flex w-100 justify-content-end">
                <button type="button" className="btn btn-primary my-auto me-2">
                    Add a Song
                </button>
                <button type="button" className="btn btn-success my-auto">
                    Import Playlist
                </button>
            </div>
        </div>
    </div>
);

const Playlist: React.FC = () => {
    return <div className="Playlist">This is the main playlist</div>;
};

const PlaylistComponent: React.FC = () => {
    return (
        <div className="PlaylistComponent d-flex-column h-100">
            <PlaylistHeader />
            <hr className="my-0" />
            <Playlist />
        </div>
    );
};

export default PlaylistComponent;
