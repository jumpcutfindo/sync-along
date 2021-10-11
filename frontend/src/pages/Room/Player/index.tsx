import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import Slider from "rc-slider";

import "./index.css";
import "rc-slider/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/stores";
import { Media, nextMedia } from "src/stores/app/playlist";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlayCircle,
    faPauseCircle,
    faStepBackward,
    faStepForward,
} from "@fortawesome/free-solid-svg-icons";

const PlayerInfo: React.FC<{
    currentProgress: number | undefined;
    mediaDuration: number | undefined;
    currentMedia: Media | null;
}> = (props) => {
    const { currentProgress, mediaDuration, currentMedia } = props;

    let progressText = "";
    if (currentProgress !== undefined && mediaDuration !== undefined) {
        const currentDuration = (currentProgress / 100) * mediaDuration * 1000;
        const totalDuration = mediaDuration * 1000;

        progressText = `${new Date(currentDuration)
            .toISOString()
            .substr(11, 8)} /
            ${new Date(totalDuration).toISOString().substr(11, 8)}`;
    }

    return (
        <div className="d-flex player-info flex-grow-1 text-start">
            <p className="my-auto">
                {currentMedia ? currentMedia.name : "No media selected!"}
            </p>
            <div
                className="d-flex player-progress-text flex-grow-1 justify-content-end"
                style={{ visibility: mediaDuration ? "visible" : "hidden" }}
            >
                <p className="my-auto">{progressText}</p>
            </div>
        </div>
    );
};

const PlayerButtons: React.FC<{
    isLoaded: boolean;
    isPlaying: boolean;
    onPlayPressed: () => void;
    onNextPressed: () => void;
}> = (props) => {
    const { isLoaded, isPlaying, onPlayPressed, onNextPressed } = props;

    if (!isLoaded) return null;

    return (
        <div className="d-flex player-buttons justify-content-end my-auto mx-3">
            <FontAwesomeIcon
                className="player-control-button my-auto me-3"
                icon={faStepBackward}
                size="2x"
                color="white"
            />
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
            <FontAwesomeIcon
                className="player-control-button my-auto ms-3"
                icon={faStepForward}
                size="2x"
                color="white"
                onClick={onNextPressed}
            />
        </div>
    );
};

const PlayerComponent: React.FC = () => {
    const ref = useRef<ReactPlayer>(null);

    const dispatch = useDispatch();

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

    const onNextPressed = () => {
        dispatch(nextMedia());
        setPlaying(true);
    };

    return (
        <div className="PlayerComponent d-flex flex-column h-100">
            <div className="d-flex player-progress w-100">
                <Slider value={progress} onChange={onSeek} />
            </div>

            <div className="d-flex flex-grow-1 player-holder px-3">
                <PlayerInfo
                    currentProgress={progress}
                    mediaDuration={ref.current?.getDuration()}
                    currentMedia={currentMedia}
                />
                <PlayerButtons
                    isLoaded={currentMedia !== null}
                    isPlaying={isPlaying}
                    onPlayPressed={onPlayPressed}
                    onNextPressed={onNextPressed}
                />
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
