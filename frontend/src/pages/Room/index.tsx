import React from "react";
import ChatComponent from "./Chat";
import PlayerComponent from "./Player";
import PlaylistComponent from "./Playlist";
import RoomInfoComponent from "./RoomInfo";

const RoomScreen: React.FC = () => {
    return (
        <div className="RoomScreen d-flex w-100 h-100">
            <PlaylistComponent />
            <PlayerComponent />
            <ChatComponent />
            <RoomInfoComponent />
        </div>
    );
};

export default RoomScreen;
