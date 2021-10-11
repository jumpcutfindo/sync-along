import React from "react";

import ChatComponent from "./Chat";
import PlayerComponent from "./Player";
import PlaylistComponent from "./Playlist";
import RoomInfoComponent from "./RoomInfo";

import "./Room.css";

const RoomScreen: React.FC = () => {
    return (
        <div className="RoomScreen d-flex w-100 h-100">
            <div className="PlayerColumn d-flex flex-column h-100">
                <div className="PlaylistComponentContainer flex-grow-1">
                    <PlaylistComponent />
                </div>
                <div className="PlayerComponentContainer">
                    <PlayerComponent />
                </div>
            </div>
            <div className="ChatColumn d-flex-column h-100">
                <div className="RoomInfoComponentContainer">
                    <RoomInfoComponent />
                </div>
                <div className="ChatComponentContainer">
                    <ChatComponent />
                </div>
            </div>
        </div>
    );
};

export default RoomScreen;
