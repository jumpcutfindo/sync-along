import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import Slider from "rc-slider";

import "./index.css";
import "rc-slider/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/stores";
import { Media, nextMedia, prevMedia } from "src/stores/app/playlist";
import { play, stop } from "src/stores/app/player";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlayCircle,
    faPauseCircle,
    faStepBackward,
    faStepForward,
    faVolumeOff,
    faVolumeDown,
    faVolumeUp,
    faVolumeMute,
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
        <div className="d-flex player-info flex-grow-1 text-start me-2">
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
    volume: number;
    onVolumeChanged: (arg: number) => void;
    isLoaded: boolean;
    isPlaying: boolean;
    onPlayPressed: () => void;
    onNextPressed: () => void;
    onPrevPressed: () => void;
}> = (props) => {
    const {
        volume,
        isLoaded,
        isPlaying,
        onPlayPressed,
        onNextPressed,
        onPrevPressed,
        onVolumeChanged,
    } = props;

    const [savedVolume, setSavedVolume] = useState(volume);
    const [isMuted, setMuted] = useState(false);

    if (!isLoaded) return null;

    const getVolumeIcon = () => {
        if (isMuted) return faVolumeMute;
        if (volume === 0.0) return faVolumeOff;
        if (volume < 0.5) return faVolumeDown;
        return faVolumeUp;
    };

    const toggleMute = () => {
        if (isMuted) onVolumeChanged(savedVolume);
        else onVolumeChanged(0.0);

        setMuted(!isMuted);
    };

    const onSeekVolume = (value: number) => {
        onVolumeChanged(value / 100);
        setSavedVolume(value / 100);
        setMuted(false);
    };

    return (
        <div className="d-flex flex-column my-auto mx-3">
            <div className="d-flex player-buttons justify-content-end mb-2">
                <FontAwesomeIcon
                    className="player-control-button my-auto me-3"
                    icon={faStepBackward}
                    size="2x"
                    color="white"
                    onClick={onPrevPressed}
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
            <div className="d-flex">
                <FontAwesomeIcon
                    className="player-control-button player-volume-icon my-auto me-2"
                    icon={getVolumeIcon()}
                    size="1x"
                    color="white"
                    onClick={toggleMute}
                />
                <Slider
                    className="my-auto"
                    value={volume * 100}
                    onChange={onSeekVolume}
                />
            </div>
        </div>
    );
};

const PlayerComponent: React.FC = () => {
    const ref = useRef<ReactPlayer>(null);

    const dispatch = useDispatch();

    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.5);

    const currentMedia: Media | null = useSelector(
        (state: RootState) => state.playlist.current
    );

    const isPlaying: boolean = useSelector(
        (state: RootState) => state.player.isPlaying
    );

    const setPlaying = (shouldPlay: boolean) => {
        if (shouldPlay) dispatch(play());
        else dispatch(stop());
    };

    // Methods for client side
    const onVolumeChange = (value: number) => {
        setVolume(value);
    };

    const onPlayerProgress = (newProgress: any) => {
        setProgress(newProgress.played * 100);
    };

    // Methods for server side
    // TODO: This should send a message to the server indicating the value of the progress
    const onSeek = (value: number) => {
        setProgress(value);
        ref.current?.seekTo(value / 100, "fraction");
        setPlaying(true);
    };

    // TODO: This should send a message to the server indicating the player has been toggled
    const onPlayPressed = () => {
        setPlaying(!isPlaying);
    };

    // TODO: This should send a message to the server indicating a skip to the next song
    const onNextPressed = () => {
        dispatch(nextMedia());
        setPlaying(true);
    };

    // TODO: This should send a message to the server indicating a jump to prev song
    const onPrevPressed = () => {
        dispatch(prevMedia());
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
                    volume={volume}
                    onVolumeChanged={onVolumeChange}
                    isLoaded={currentMedia !== null}
                    isPlaying={isPlaying}
                    onPlayPressed={onPlayPressed}
                    onNextPressed={onNextPressed}
                    onPrevPressed={onPrevPressed}
                />
            </div>

            <ReactPlayer
                ref={ref}
                url={currentMedia?.url}
                width="0"
                height="0"
                progressInterval={100}
                playing={isPlaying}
                volume={volume}
                onProgress={onPlayerProgress}
            />
        </div>
    );
};

export default PlayerComponent;
