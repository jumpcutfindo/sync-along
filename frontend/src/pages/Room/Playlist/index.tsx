/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/typedReduxHooks";
import {
    Media,
    addSong,
    receivePlaylistUpdates,
    selectSong,
    removeSong,
} from "src/stores/app/playlist";

import { Overlay } from "react-bootstrap";

import "./index.css";
import useInputState from "src/hooks/useInputState";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { validateAddMedia } from "src/utils/validation/validator";

const AddMediaButton: React.FC = () => {
    const ref = useRef(null);
    const dispatch = useAppDispatch();

    const [url, onChangeUrl] = useInputState("");
    const [isShowPopover, setShowPopover] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const togglePopover = () => {
        setShowPopover(!isShowPopover);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const validation = validateAddMedia(url);

        if (!validation.valid) {
            if (validation.error) setErrorMsg(validation.error);
            return;
        }

        setErrorMsg("");
        dispatch(addSong(url));
    };

    const isError = () => {
        return errorMsg === "";
    };

    return (
        <div className="AddMediaButton my-auto">
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
                        <p
                            style={{
                                visibility: `${
                                    !isError() ? "visible" : "hidden"
                                }`,
                            }}
                            className="mb-2 text-danger"
                        >
                            {errorMsg}
                        </p>
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
                                Close
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
        </div>
    );
};

const PlaylistHeader: React.FC = () => (
    <div className="PlaylistHeader d-flex">
        <div className="d-flex w-100 m-3">
            <h2 className="my-auto">PLAYLIST</h2>
            <PlaylistHeaderButtons />
        </div>
    </div>
);

const PlaylistItem: React.FC<{
    index: number;
    media: Media;
    selected: boolean;
    selectThis: (arg: string) => void;
    removeThis: (arg: string) => void;
}> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { index, media, selected, selectThis, removeThis } = props;

    const selectThisToPlay = () => {
        selectThis(media.id.toString());
    };

    const removeThisFromPlaylist = (event: any) => {
        event.stopPropagation();
        removeThis(media.id.toString());
    };

    return (
        <div
            role="button"
            className={`PlaylistItem d-flex ${index % 2 ? "odd" : "even"} ${
                selected ? "selected" : ""
            } py-2`}
            onClick={selectThisToPlay}
        >
            <div className="my-auto mx-2">
                <p className="video-index m-0">#{index + 1}</p>
            </div>
            <div className="video-thumbnail" />
            <div className="d-flex flex-column align-content-start text-start ms-2 flex-grow-1">
                <div>
                    <p className="video-title my-0">{media.name}</p>
                    <a
                        className="video-url"
                        href={media.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {media.url}
                    </a>
                </div>
            </div>
            <FontAwesomeIcon
                className="player-control-button me-3 my-auto"
                icon={faTimes}
                size="1x"
                color="red"
                onClick={removeThisFromPlaylist}
            />
        </div>
    );
};

const Playlist: React.FC = () => {
    const dispatch = useAppDispatch();

    const medias = useAppSelector((state) => state.playlist.media);
    const current = useAppSelector((state) => state.playlist.current);

    const setCurrentPlaying = (id: string) => {
        dispatch(selectSong(id));
    };

    const removeSelected = (id: string) => {
        dispatch(removeSong(id));
    };

    useEffect(() => {
        dispatch(receivePlaylistUpdates()).catch(() => console.log("error"));
    }, [dispatch]);

    const mediaViews = medias.map((media: Media, index: number) => (
        <PlaylistItem
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            media={media}
            selected={media.id === current?.id}
            selectThis={setCurrentPlaying}
            removeThis={removeSelected}
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
        <div className="Playlist flex-grow-1">
            {mediaViews}
            <p className="my-2">End of list.</p>
        </div>
    );
};

const PlaylistComponent: React.FC = () => {
    return (
        <div className="PlaylistComponent d-flex flex-column h-100">
            <PlaylistHeader />
            <hr className="my-0" />
            <Playlist />
        </div>
    );
};

export default PlaylistComponent;
