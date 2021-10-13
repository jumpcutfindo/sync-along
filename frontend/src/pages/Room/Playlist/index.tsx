/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { FormEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/stores";
import { Media, addMedia, setMedia } from "src/stores/app/playlist";
import { play } from "src/stores/app/player";

import { Overlay } from "react-bootstrap";

import "./index.css";
import useInputState from "src/hooks/useInputState";

const validateYouTubeURL = (url: string) => {
    if (url === undefined || url === null || url === "") return false;
    const p =
        /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

    const flag = url.match(p);
    if (flag) return flag[1];
    return false;
};

const AddMediaButton: React.FC = () => {
    const ref = useRef(null);
    const dispatch = useDispatch();

    const [url, onChangeUrl] = useInputState("");
    const [isShowPopover, setShowPopover] = useState(false);

    const togglePopover = () => {
        setShowPopover(!isShowPopover);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        // TODO: Basic validation of the url or pass to server to handle
        // TODO: Send url to server for handling
        const response: Media = {
            url,
            name: url,
        };

        if (validateYouTubeURL(url)) dispatch(addMedia(response));
    };

    return (
        <div className="AddMediaButton me-2">
            <button
                ref={ref}
                type="button"
                className="btn btn-primary"
                onClick={togglePopover}
            >
                Add Media
            </button>
            <Overlay
                target={ref.current}
                show={isShowPopover}
                placement="bottom"
                transition={false}
            >
                <div className="add-media-popover d-flex flex-column p-3 mt-2">
                    <p className="mb-2">
                        <b>Add a link:</b>
                    </p>
                    <form onSubmit={handleSubmit}>
                        <input
                            className="form-control mb-2"
                            placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            onChange={onChangeUrl}
                        />
                        <div className="d-flex">
                            <button
                                type="submit"
                                className="btn btn-success me-2"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={togglePopover}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Overlay>
        </div>
    );
};

const PlaylistHeaderButtons: React.FC = () => {
    return (
        <div className="PlaylistHeaderButtons d-flex w-100 justify-content-end">
            <AddMediaButton />
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

const PlaylistItem: React.FC<{
    index: number;
    media: Media;
    selected: boolean;
    setPlaying: (arg: number) => void;
}> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { index, media, selected, setPlaying } = props;

    const setThisPlaying = () => {
        setPlaying(index);
    };

    return (
        <div
            role="button"
            className={`PlaylistItem d-flex ${index % 2 ? "odd" : "even"} ${
                selected ? "selected" : ""
            } py-2`}
            onClick={setThisPlaying}
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
    const dispatch = useDispatch();

    const medias = useSelector((state: RootState) => state.playlist.media);
    const currentIndex = useSelector(
        (state: RootState) => state.playlist.currentIndex
    );

    const setCurrentPlaying = (index: number) => {
        dispatch(setMedia(index));
        dispatch(play());
    };

    const mediaViews = medias.map((media, index) => (
        <PlaylistItem
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            media={media}
            selected={index === currentIndex}
            setPlaying={setCurrentPlaying}
        />
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
