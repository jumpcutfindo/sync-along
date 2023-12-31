import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import Slider from "rc-slider";

import "./index.css";
import "rc-slider/assets/index.css";

import { useAppSelector, useAppDispatch } from "src/hooks/typedReduxHooks";
import { Media, nextSong, prevSong } from "src/stores/app/playlist";
import {
    completeSong,
    pauseSong,
    playSong,
    receivePlayerUpdates,
    resetPlayer,
    seekSong,
    setPlayerVolume,
    startPlayer,
    stopPlayer,
} from "src/stores/app/player";

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
        <div className="d-flex flex-grow-1 player-info text-start">
            <p className="ms-3 my-auto">
                {currentMedia ? currentMedia.name : "No media selected!"}
            </p>
            <div className="d-flex player-progress-text flex-grow-1 justify-content-end">
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
        <div className="d-flex flex-column my-auto mx-2">
            <div className="d-flex player-buttons justify-content-between">
                <FontAwesomeIcon
                    className="player-control-button my-auto"
                    icon={faStepBackward}
                    size="2x"
                    color="white"
                    onClick={onPrevPressed}
                />
                {!isPlaying ? (
                    <FontAwesomeIcon
                        className="player-control-button mx-2"
                        icon={faPlayCircle}
                        size="3x"
                        color="white"
                        onClick={onPlayPressed}
                    />
                ) : (
                    <FontAwesomeIcon
                        className="player-control-button mx-2"
                        icon={faPauseCircle}
                        size="3x"
                        color="white"
                        onClick={onPlayPressed}
                    />
                )}
                <FontAwesomeIcon
                    className="player-control-button my-auto"
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
                    className="d-flex my-auto"
                    value={volume * 100}
                    onChange={onSeekVolume}
                />
            </div>
        </div>
    );
};

const PlayerComponent: React.FC = () => {
    const ref = useRef<ReactPlayer>(null);

    const dispatch = useAppDispatch();

    const [sliderProgress, setSliderProgress] = useState(0);

    const volume: number = useAppSelector((state) => state.player.volume);

    const currentMedia: Media | null = useAppSelector(
        (state) => state.playlist.current
    );

    const isPlaying: boolean = useAppSelector(
        (state) => state.player.isPlaying
    );

    const lastUpdateTime: number = useAppSelector(
        (state) => state.player.lastUpdateTime
    );

    const seekTime: number = useAppSelector(
        (state) => state.player.lastScrubTime
    );

    const setVolume = (vol: number) => {
        dispatch(setPlayerVolume(vol));
    };

    const setPlaying = (shouldPlay: boolean) => {
        if (shouldPlay) {
            dispatch(startPlayer());
            dispatch(playSong(sliderProgress));
        } else {
            dispatch(stopPlayer());
            dispatch(pauseSong(sliderProgress));
        }
    };

    // Methods for client side
    const onVolumeChange = (value: number) => {
        setVolume(value);
    };

    const onPlayerProgress = (newProgress: any) => {
        setSliderProgress(newProgress.played * 100);
    };

    // Button actions
    const onPlayPressed = () => {
        setPlaying(!isPlaying);
    };

    const onNextPressed = () => {
        dispatch(nextSong());
        dispatch(resetPlayer());
    };

    const onPrevPressed = () => {
        dispatch(prevSong());
        dispatch(resetPlayer());
    };

    const onSeekSong = (value: number) => {
        if (ref.current && currentMedia) dispatch(seekSong(value));
    };

    const onSongFinished = () => {
        dispatch(completeSong());
    };

    useEffect(() => {
        ref.current?.seekTo(seekTime / 100, "fraction");
        setSliderProgress(seekTime);
    }, [seekTime, lastUpdateTime]);

    useEffect(() => {
        dispatch(receivePlayerUpdates()).catch(() => console.log("error"));
    }, [dispatch, seekTime]);

    return (
        <div className="PlayerComponent d-flex flex-column h-100">
            <div className="d-flex player-progress w-100">
                <Slider value={sliderProgress} onChange={onSeekSong} />
            </div>

            <div className="d-flex player-holder flex-grow-1">
                <PlayerInfo
                    currentProgress={sliderProgress}
                    mediaDuration={ref.current?.getDuration()}
                    currentMedia={currentMedia}
                />
                <div className="d-flex justify-content-end px-2">
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
                onEnded={onSongFinished}
            />
        </div>
    );
};

export default PlayerComponent;
