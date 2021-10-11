import React, { useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import Slider from "rc-slider";

import "./index.css";
import "rc-slider/assets/index.css";

const PlayerComponent: React.FC = () => {
    const ref = useRef<ReactPlayer>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [player, setPlayer] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setPlaying] = useState(false);

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
        <div className="PlayerComponent h-100">
            <div className="d-flex player-progress w-100">
                <Slider value={progress} onChange={onSeek} />
            </div>

            <button type="button" onClick={onPlayPressed}>
                Toggle Music
            </button>

            <ReactPlayer
                ref={ref}
                url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
