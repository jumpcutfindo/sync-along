import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/stores";
import { Media } from "src/stores/app/playlist";

import "./index.css";

const PlaylistHeaderButtons: React.FC = () => {
    return (
        <div className="PlaylistHeaderButtons d-flex w-100 justify-content-end">
            <button type="button" className="btn btn-primary my-auto me-2">
                Add a Song
            </button>
            <button type="button" className="btn btn-success my-auto">
                Import Playlist
            </button>
        </div>
    );
};

const PlaylistHeader: React.FC = () => (
    <div className="PlaylistHeader d-flex mb-2">
        <div className="d-flex w-100 m-3">
            <h2 className="m-0">PLAYLISTS</h2>
            <PlaylistHeaderButtons />
        </div>
    </div>
);

const PlaylistItem: React.FC<{ media: Media }> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { media } = props;

    return (
        <div>
            <p>This is a playlist item</p>
        </div>
    );
};

const Playlist: React.FC = () => {
    const medias = useSelector((state: RootState) => state.playlist.songs);

    const mediaViews = medias.map((media, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <PlaylistItem key={index} media={media} />
    ));

    if (mediaViews.length === 0) {
        return (
            <div className="mt-3">
                <p>Playlist is empty, add media by using the buttons above!</p>
            </div>
        );
    }

    return (
        <div className="Playlist d-flex-column w-100 h-100">{mediaViews}</div>
    );
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
