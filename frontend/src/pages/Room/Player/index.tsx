import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import Slider from "rc-slider";

import "./index.css";
import "rc-slider/assets/index.css";
import { useSelector } from "react-redux";
import { RootState } from "src/stores";
import { Media } from "src/stores/app/playlist";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle, faPauseCircle } from "@fortawesome/free-solid-svg-icons";

const PlayerComponent: React.FC = () => {
    const ref = useRef<ReactPlayer>(null);

    const [progress, setProgress] = useState(0);
    const [isPlaying, setPlaying] = useState(false);

    const currentMedia: Media | null = useSelector(
        (state: RootState) => state.playlist.current
    );

    const onSeek = (value: number) => {
        setProgress(value);
        ref.current?.seekTo(value / 100, "fraction");
        setPlaying(true);
    };

    const onPlayerProgress = (newProgress: any) => {
        setProgress(newProgress.played * 100);
    };

    const onPlayPressed = () => {
        setPlaying(!isPlaying);
    };

    return (
        <div className="PlayerComponent d-flex flex-column h-100">
            <div className="d-flex player-progress w-100">
                <Slider value={progress} onChange={onSeek} />
            </div>

            <div className="d-flex player-holder flex-grow-1">
                <div className="d-flex flex-column my-auto p-3">
                    <p className="m-0">
                        {currentMedia
                            ? currentMedia.name
                            : "No media selected!"}
                    </p>
                </div>
                <div
                    className="d-flex flex-grow-1 justify-content-end"
                    style={{
                        visibility:
                            currentMedia !== null ? "visible" : "hidden",
                    }}
                >
                    {!isPlaying ? (
                        <FontAwesomeIcon
                            className="player-control-button"
                            icon={faPlayCircle}
                            size="3x"
                            color="white"
                            onClick={onPlayPressed}
                        />
                    ) : (
                        <FontAwesomeIcon
                            className="player-control-button"
                            icon={faPauseCircle}
                            size="3x"
                            color="white"
                            onClick={onPlayPressed}
                        />
                    )}
                </div>
            </div>

            <ReactPlayer
                ref={ref}
                url={currentMedia?.url}
                width="0"
                height="0"
                progressInterval={100}
                playing={isPlaying}
                onProgress={onPlayerProgress}
            />
        </div>
    );
};

export default PlayerComponent;
