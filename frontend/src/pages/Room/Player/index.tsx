import { SourceInfo } from "plyr";
import Plyr from "plyr-react";
import React from "react";

import "./index.css";
import "./plyr.css";

const Player: React.FC = () => {
    const source: SourceInfo = {
        type: "audio",
        sources: [{ src: "s3Q80mk7bxE", provider: "youtube" }],
    };

    return (
        <div className="Player">
            <Plyr className="my-auto" source={source} />
        </div>
    );
};

const PlayerComponent: React.FC = () => {
    return (
        <div className="PlayerComponent h-100">
            <Player />
        </div>
    );
};

export default PlayerComponent;
