import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/stores";
import { Media, addMedia } from "src/stores/app/playlist";

import "./index.css";

const PlaylistHeaderButtons: React.FC = () => {
    const dispatch = useDispatch();

    const addNewMedia = () => {
        // TODO: This should send an API request then use the response to update the playlist state of the app

        // TODO: Remove this temporary "response" from server
        const media: Media = {
            url: "https://www.youtube.com/watch?v=s3Q80mk7bxE",
            name: "I Want You Back - The Jackson 5",
            duration: 2000,
        };
        dispatch(addMedia(media));
    };

    return (
        <div className="PlaylistHeaderButtons d-flex w-100 justify-content-end">
            <button
                type="button"
                className="btn btn-primary my-auto me-2"
                onClick={addNewMedia}
            >
                Add Media
            </button>
            <button type="button" className="btn btn-success my-auto">
                Import Playlist
            </button>
        </div>
    );
};

const PlaylistHeader: React.FC = () => (
    <div className="PlaylistHeader d-flex">
        <div className="d-flex w-100 m-3">
            <h2 className="m-0">PLAYLIST</h2>
            <PlaylistHeaderButtons />
        </div>
    </div>
);

const PlaylistItem: React.FC<{ index: number; media: Media }> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { index, media } = props;

    return (
        <div
            className={`PlaylistItem d-flex ${index % 2 ? "odd" : "even"} py-2`}
        >
            <div className="my-auto mx-2">
                <p className="video-index m-0">#{index + 1}</p>
            </div>
            <div className="video-thumbnail" />
            <div className="d-flex-column align-content-start text-start ms-2">
                <p className="video-title my-0">{media.name}</p>
                <a className="video-url" href={media.url}>
                    {media.url}
                </a>
            </div>
        </div>
    );
};

const Playlist: React.FC = () => {
    const medias = useSelector((state: RootState) => state.playlist.media);

    const mediaViews = medias.map((media, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <PlaylistItem key={index} index={index} media={media} />
    ));

    if (mediaViews.length === 0) {
        return (
            <div className="mt-3">
                <p>Playlist is empty, add media by using the buttons above!</p>
            </div>
        );
    }

    return (
        <div className="Playlist d-flex-column w-100 overflow-auto">
            {mediaViews}
            <p className="my-2">End of list.</p>
        </div>
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
